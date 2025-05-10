def obtener_respuesta(pregunta: str) -> str:
    pregunta = pregunta.lower()

    respuestas = {
        "hola": "¡Hola! ¿En qué puedo ayudarte sobre seguridad industrial?",
        "epp": "El EPP es el equipo de protección personal. Incluye casco, guantes, chaleco, etc.",
        "casco": "El casco protege tu cabeza de impactos. Úsalo en zonas de riesgo.",
        "emergencia": "En caso de emergencia, sigue el protocolo de evacuación y mantén la calma.",
        "adiós": "¡Cuídate! Recuerda siempre usar tu EPP."
    }

    for clave, respuesta in respuestas.items():
        if clave in pregunta:
            return respuesta

    return "No entiendo tu pregunta. ¿Puedes reformularla?"

