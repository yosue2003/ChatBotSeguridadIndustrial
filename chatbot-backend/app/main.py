from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import logging
from .api.routers import chat
from .db.database import get_db
from .services import chat_service

# Configurar logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manejador del ciclo de vida de la aplicación.
    Se ejecuta al iniciar y detener la aplicación.
    """
    try:
        # Inicializar recursos al arrancar
        logger.info("Iniciando la aplicación...")
        db = next(get_db())
        chat_service.initialize_topics(db)
        logger.info("Temas inicializados correctamente")
        db.close()
        
        yield  # La aplicación se ejecuta aquí
        
        # Limpiar recursos al detener
        logger.info("Deteniendo la aplicación...")
        
    except Exception as e:
        logger.error(f"Error durante el ciclo de vida de la aplicación: {e}", exc_info=True)
        raise
    finally:
        logger.info("Limpieza de recursos completada")

app = FastAPI(
    title="ChatBot Seguridad Industrial",
    description="API para el chatbot de seguridad industrial",
    version="1.0.0",
    lifespan=lifespan
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # URL del frontend en desarrollo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir los routers
app.include_router(chat.router)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Error no manejado: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
    )

@app.get("/")
async def root():
    return {"message": "Bienvenido al API del ChatBot de Seguridad Industrial"}