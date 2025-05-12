from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from typing import List, Optional
from sqlalchemy.orm import Session
import logging
import asyncio
from ...schemas.chat_schema import ChatRequest, ChatResponse, Topic, Conversation
from ...services import chat_service
from ...db.database import get_db

# Configurar logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["chat"])

@router.get("/topics", response_model=List[Topic])
async def get_topics(db: Session = Depends(get_db)):
    """Obtener todos los temas disponibles de seguridad industrial"""
    try:
        topics = chat_service.get_topics(db)
        logger.info(f"Temas recuperados exitosamente: {len(topics)} temas")
        return topics
    except Exception as e:
        logger.error(f"Error al obtener temas: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/conversations/{user_id}", response_model=List[Conversation])
async def get_user_conversations(user_id: int, db: Session = Depends(get_db)):
    """Obtener todas las conversaciones de un usuario"""
    try:
        conversations = chat_service.get_conversations_for_user(db, user_id)
        logger.info(f"Conversaciones recuperadas para usuario {user_id}: {len(conversations)}")
        return conversations
    except Exception as e:
        logger.error(f"Error al obtener conversaciones: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/conversation/{conversation_id}", response_model=Conversation)
async def get_conversation(conversation_id: int, db: Session = Depends(get_db)):
    """Obtener una conversación específica por su ID"""
    try:
        conversation = chat_service.get_conversation(db, conversation_id)
        if not conversation:
            logger.warning(f"Conversación no encontrada: {conversation_id}")
            raise HTTPException(status_code=404, detail="Conversación no encontrada")
        logger.info(f"Conversación recuperada: {conversation_id}")
        return conversation
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error al obtener conversación: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/message", response_model=ChatResponse)
async def send_message(request: ChatRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Enviar un mensaje y obtener respuesta del bot"""
    try:
        # Usar asyncio.shield para proteger la operación de cancelaciones abruptas
        async with asyncio.timeout(60):  # Timeout global de 60 segundos
            message, conversation = await asyncio.shield(
                chat_service.process_message(
                    db=db,
                    content=request.content,
                    user_id=1,  # TODO: Implementar autenticación
                    conversation_id=request.conversationId,
                    topic_id=request.topicId
                )
            )
            return ChatResponse(message=message, conversation=conversation)
    except asyncio.TimeoutError:
        logger.error("Timeout global al procesar el mensaje")
        raise HTTPException(
            status_code=504,
            detail="El servidor tardó demasiado en responder. Por favor, intenta nuevamente."
        )
    except asyncio.CancelledError:
        logger.warning("La solicitud fue cancelada por el cliente")
        # Intentar hacer rollback de la transacción si es posible
        try:
            db.rollback()
        except Exception:
            pass
        raise HTTPException(status_code=499, detail="Cliente cerró la conexión")
    except Exception as e:
        logger.error(f"Error al procesar mensaje: {e}", exc_info=True)
        # Intentar hacer rollback de la transacción
        try:
            db.rollback()
        except Exception:
            pass
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/conversation/{conversation_id}")
async def delete_conversation(conversation_id: int, db: Session = Depends(get_db)):
    """Eliminar una conversación específica"""
    try:
        success = chat_service.delete_conversation(db, conversation_id)
        if not success:
            raise HTTPException(status_code=404, detail="Conversación no encontrada")
        return {"message": "Conversación eliminada exitosamente"}
    except Exception as e:
        logger.error(f"Error al eliminar conversación: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/conversations/{user_id}")
async def delete_all_user_conversations(user_id: int, db: Session = Depends(get_db)):
    """Eliminar todas las conversaciones de un usuario"""
    try:
        success = chat_service.delete_all_user_conversations(db, user_id)
        return {"message": "Todas las conversaciones han sido eliminadas"}
    except Exception as e:
        logger.error(f"Error al eliminar conversaciones: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=dict)
async def chat_endpoint(
    content: str = "",
    user_id: int = 1,
    conversation_id: Optional[int] = None,
    topic_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    try:
        message, conversation = await chat_service.process_message(
            db=db,
            content=content,
            user_id=user_id,
            conversation_id=conversation_id,
            topic_id=topic_id
        )
        return {
            "message": {
                "id": message.id,
                "content": message.content,
                "is_ai": message.is_ai,
                "timestamp": message.timestamp
            },
            "conversation": {
                "id": conversation.id,
                "title": conversation.title
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))