from fastapi import FastAPI
from .api import router
aplicacion_prueba = FastAPI(
title="IDK",
description="Proyecto Modelos Probabilistas",
version="0.1.0"
)

@aplicacion_prueba.get("/")
def inicio():
    return{
        "nombre": "IDK",
        "mensaje": "Servidor Funcionando"
    }

@aplicacion_prueba.get("/estado")
def verificar_estado():
    return{
        "estado": "correcto",
        "aplicacion": "IDK"
    }

aplicacion_prueba.include_router(router)
