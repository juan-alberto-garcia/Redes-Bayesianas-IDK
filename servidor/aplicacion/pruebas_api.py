from fastapi import FastAPI
from .api import router
aplicacion_prueba = FastAPI()
aplicacion_prueba.include_router(router)
