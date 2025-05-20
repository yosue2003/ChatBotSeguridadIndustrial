from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Configuración de la base de datos
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "chatbot_db"
    
    DATABASE_URL: Optional[str] = None
    
    
    OPENAI_API_KEY: str
    OPENAI_API_URL: str
    OPENAI_MODEL: str = "deepseek/deepseek-r1-zero:free"
    
    MAX_RETRIES: int = 3
    RETRY_MIN_WAIT: float = 4
    RETRY_MAX_WAIT: float = 10

    @property
    def get_database_url(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()