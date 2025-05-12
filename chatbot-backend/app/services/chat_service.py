from datetime import datetime
from typing import List, Optional, Tuple, Dict
import logging
import asyncio
from openai import AsyncOpenAI
from sqlalchemy.orm import Session
from tenacity import retry, stop_after_attempt, wait_exponential
from ..models.models import Topic, Conversation, Message
from ..core.config import settings

# Configurar logging
logger = logging.getLogger(__name__)

# Inicializar cliente OpenAI
client = AsyncOpenAI(
    api_key=settings.OPENAI_API_KEY,
    base_url=settings.OPENAI_API_URL
)

def initialize_topics(db: Session):
    """Inicializar temas si la tabla está vacía"""
    if db.query(Topic).count() == 0:
        initial_topics = [
            {"name": "Equipo de Protección Personal", "description": "Información sobre EPP y su uso adecuado"},
            {"name": "Manejo de Sustancias Químicas", "description": "Procedimientos seguros para el manejo de químicos"},
            {"name": "Prevención de Incendios", "description": "Medidas para prevenir y responder a incendios"},
            {"name": "Primeros Auxilios", "description": "Procedimientos básicos de primeros auxilios"},
            {"name": "Trabajo en Alturas", "description": "Protocolos para trabajo seguro en alturas"},
            {"name": "Ergonomía", "description": "Optimización de espacios de trabajo"}
        ]
        for topic_data in initial_topics:
            topic = Topic(**topic_data)
            db.add(topic)
        db.commit()

def get_topics(db: Session) -> List[Topic]:
    return db.query(Topic).all()

def get_topic_by_id(db: Session, topic_id: int) -> Optional[Topic]:
    return db.query(Topic).filter(Topic.id == topic_id).first()

def get_conversation(db: Session, conversation_id: int) -> Optional[Conversation]:
    return db.query(Conversation).filter(Conversation.id == conversation_id).first()

def get_conversations_for_user(db: Session, user_id: int) -> List[Conversation]:
    return db.query(Conversation).filter(Conversation.user_id == user_id).all()

def create_message(db: Session, content: str, conversation_id: int, is_ai: bool, sender_id: int) -> Message:
    """
    Crear un nuevo mensaje.
    Args:
        content: Contenido del mensaje
        conversation_id: ID de la conversación
        is_ai: True si el mensaje es del bot, False si es del usuario
        sender_id: 0 para mensajes del bot, ID del usuario para mensajes del usuario
    """
    message = Message(
        conversation_id=conversation_id,
        sender_id=sender_id,
        is_ai=is_ai,
        content=content,
        timestamp=datetime.utcnow()
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message

def create_conversation(db: Session, user_id: int, title: str, topic_id: Optional[int] = None) -> Conversation:
    conversation = Conversation(
        user_id=user_id,
        title=title,
        topic_id=topic_id,
        created_at=datetime.utcnow()
    )
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation


def is_safety_related(message: str) -> bool:
    """
    Verifica si un mensaje está relacionado con la seguridad industrial
    o si es un mensaje de seguimiento solicitando información
    """
    safety_keywords = [
        'seguridad', 'riesgo', 'peligro', 'protección', 'epp', 'accidente',
        'emergencia', 'prevención', 'incidente', 'protocolo', 'norma', 'procedimiento',
        'química', 'altura', 'incendio', 'evacuación', 'primeros auxilios', 'ergonomía',
        'señalización', 'residuo', 'tóxico', 'salud ocupacional', 'industrial', 'legal',
        'sanción', 'multa', 'consecuencia', 'legislación', 'ley', 'reglamento', 'normativa'
    ]
    
    # Palabras clave para mensajes de seguimiento/continuación
    follow_up_keywords = [
        'continua', 'sigue', 'más información', 'continúa', 'prosigue', 'adelante',
        'dime más', 'explica', 'detalla', 'amplia', 'elabora', 'entrega', 'dame',
        'proporciona', 'muestra', 'completa', 'información', 'tema', 'por favor'
    ]
    
    message_lower = message.lower()
    
    # Si es muy corto, probablemente es un mensaje de seguimiento
    if len(message_lower.split()) <= 10:
        return any(keyword in message_lower for keyword in follow_up_keywords) or any(keyword in message_lower for keyword in safety_keywords)
    
    return any(keyword in message_lower for keyword in safety_keywords)

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=10),
    reraise=True
)
async def get_ai_response(
    user_message: str, 
    topic_id: Optional[int] = None,
    conversation_history: Optional[List[dict]] = None
) -> str:
    try:
        if not is_safety_related(user_message):
            return ("Lo siento, como asistente especializado en seguridad industrial, solo puedo "
            "proporcionar información relacionada con temas de seguridad industrial. "
            "Por favor, reformula tu pregunta enfocándola en aspectos de seguridad y "
            "prevención de riesgos laborales.")

        is_follow_up = conversation_history and len(user_message.strip().split()) <= 7
        messages = [
            {
                "role": "system",
                "content": """Eres un asistente especializado en seguridad industrial con las siguientes directrices:
                1. SOLO proporciona información sobre seguridad industrial y prevención de riesgos laborales.
                2. Da respuestas claras, concisas y basadas en normativas y mejores prácticas de seguridad.
                3. Si no estás completamente seguro de algo, indica que se debe consultar con un profesional certificado.
                4. Cuando detectes una pregunta que no está relacionada con seguridad industrial, responde:
                   'Como asistente especializado en seguridad industrial, solo puedo proporcionar información 
                   sobre temas relacionados con la seguridad y prevención de riesgos laborales.'
                5. Prioriza siempre la seguridad y la prevención en tus respuestas.
                6. Cita normativas o estándares relevantes cuando sea apropiado.
                7. INCLUYE SIEMPRE información sobre las posibles consecuencias legales del incumplimiento 
                   de las normas de seguridad cuando sea relevante para la consulta.
                8. Si el usuario envía mensajes cortos como "continúa", "más información", "explica más", etc.,
                   interpreta esto como una solicitud para ampliar la información sobre el tema actual.
                9. Responde a solicitudes de seguimiento como "dame la información correcta sobre el tema" 
                   proporcionando datos completos y estructurados sobre el tema en discusión."""
            },
            {
                "role": "user",
                "content": user_message
            }
        ]

        if conversation_history:
            messages = [messages[0]] + conversation_history + [messages[1]]
            
            total_chars = sum(len(msg["content"]) for msg in messages)
            logger.info(f"Contexto total enviado: ~{total_chars} caracteres")

        try:
            async with asyncio.timeout(30):  
                response = await client.chat.completions.create(
                    model='deepseek/deepseek-prover-v2:free',   
                    messages=messages,
                )
                return response.choices[0].message.content
        except asyncio.TimeoutError:
            logger.error("Timeout al esperar respuesta de la API")
            return "Lo siento, el servicio está tardando demasiado en responder. Por favor, intenta nuevamente."
        except Exception as api_error:
            logger.error(f"Error en la API: {str(api_error)}")
            raise

    except Exception as e:
        logger.error(f"Error general al obtener respuesta: {e}")
        return "Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta nuevamente."
    
async def fetch_topic_context(topic_id: Optional[int], db: Session) -> str:
    if not topic_id:
        return ""
    topic = get_topic_by_id(db, topic_id)
    if topic:
        return f"Contexto: Esta conversación es sobre {topic.name}. "
    return ""

async def process_message(
    db: Session,
    content: str,
    user_id: int,
    conversation_id: Optional[int] = None,
    topic_id: Optional[int] = None
) -> Tuple[Message, Conversation]:
    try:
        # Si hay conversation_id, usar esa conversación, si no, crear una nueva
        if conversation_id:
            conversation = get_conversation(db, conversation_id)
            if not conversation:
                raise ValueError("Conversación no encontrada")
        else:
            topic = get_topic_by_id(db, topic_id) if topic_id else None
            # Determinar el título de la conversación
            if topic:
                title = f"Conversación sobre {topic.name}"
            else:
                title = content[:50] + '...' if len(content) > 50 else content
            
            conversation = create_conversation(db, user_id, title, topic_id)

        # Si el mensaje es un saludo inicial del bot
        is_bot_greeting = any([
            "¡Hola! Soy SAFEMIND 1.0" in content,
        ])

        # Crear el mensaje inicial
        message = create_message(
            db=db,
            content=content,
            conversation_id=conversation.id,
            is_ai=is_bot_greeting,
            sender_id=0 if is_bot_greeting else user_id
        )

        # Si no es un mensaje del bot, obtener respuesta AI
        if not is_bot_greeting:
            conversation_history = [
                {"role": "user" if not msg.is_ai else "assistant", "content": msg.content}
                for msg in conversation.messages[-5:]
            ]

            ai_response = await asyncio.shield(get_ai_response(
                content if content.strip() else "Hola",
                topic_id,
                conversation_history
            ))
            
            # Crear el mensaje de respuesta del bot
            message = create_message(
                db=db,
                content=ai_response,
                conversation_id=conversation.id,
                is_ai=True,
                sender_id=0
            )

        db.refresh(conversation)
        return message, conversation

    except Exception as e:
        logger.error(f"Error en process_message: {e}")
        db.rollback()
        raise

def delete_conversation(db: Session, conversation_id: int) -> bool:
    """Eliminar una conversación y sus mensajes asociados"""
    try:
        conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
        if not conversation:
            return False
        
        db.delete(conversation)
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        raise e

def delete_all_user_conversations(db: Session, user_id: int) -> bool:
    """Eliminar todas las conversaciones de un usuario"""
    try:
        conversations = db.query(Conversation).filter(Conversation.user_id == user_id).all()
        for conversation in conversations:
            db.delete(conversation)
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        raise e

FALLBACK_RESPONSES = {
    "Equipo de Protección Personal": """
    El Equipo de Protección Personal (EPP) es fundamental para la seguridad:
    1. Uso obligatorio según la actividad
    2. Inspección antes de cada uso
    3. Mantenimiento adecuado
    ¿Necesitas información específica sobre algún tipo de EPP?
    """,
    "Manejo de Sustancias Químicas": """
    Para el manejo seguro de sustancias químicas:
    1. Consultar hojas de seguridad (MSDS)
    2. Usar EPP apropiado
    3. Conocer procedimientos de emergencia
    ¿Qué aspecto específico necesitas conocer?
    """,
}

async def get_fallback_response(topic_id: Optional[int], db: Session) -> str:
    if not topic_id:
        return "Por favor, especifica un tema de seguridad industrial para poder ayudarte mejor."
    
    topic = get_topic_by_id(db, topic_id)
    if topic and topic.name in FALLBACK_RESPONSES:
        return FALLBACK_RESPONSES[topic.name]
    
    return """
    Temas principales de seguridad industrial:
    1. Equipo de Protección Personal
    2. Manejo de Sustancias Químicas
    3. Prevención de Incendios
    4. Primeros Auxilios
    ¿Sobre cuál tema necesitas información?
    """