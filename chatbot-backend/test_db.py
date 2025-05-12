from sqlalchemy import create_engine, text
from app.core.config import settings
import sys
import psycopg2

def test_database_connection():
    print("Configuración de la base de datos:")
    print(f"URL de conexión: {settings.get_database_url}")
    
    try:
        # Intentar conexión directa con psycopg2 primero
        print("\nProbando conexión con psycopg2...")
        conn = psycopg2.connect(
            dbname=settings.POSTGRES_DB,
            user=settings.POSTGRES_USER,
            password=settings.POSTGRES_PASSWORD,
            host=settings.POSTGRES_SERVER,
            port=settings.POSTGRES_PORT
        )
        print("Conexión psycopg2 exitosa!")
        conn.close()
        
        # Probar con SQLAlchemy
        print("\nProbando conexión con SQLAlchemy...")
        engine = create_engine(settings.get_database_url)
        with engine.connect() as connection:
            print("¡Conexión SQLAlchemy exitosa!")
            result = connection.execute(text("SELECT version();"))
            version = result.fetchone()[0]
            print(f"Versión de PostgreSQL: {version}")
            
    except Exception as e:
        print("\nError al conectar a la base de datos:")
        print(f"Tipo de error: {type(e).__name__}")
        print(f"Mensaje de error: {str(e)}")
        print("\nInformación del sistema:")
        print(f"Python version: {sys.version}")
        sys.exit(1)

if __name__ == "__main__":
    test_database_connection()