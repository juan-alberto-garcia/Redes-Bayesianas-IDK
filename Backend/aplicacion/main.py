from fastapi import FastAPI

#Crear aplicacion
aplicacion = FastAPI(
    title="IDK",
    description="Proyecto Modelos probabilistas",
    version="0.1.0"
)

#Ruta
@aplicacion.get("/")
def inicio():
    return {
        "nombre": "IDK",
        "mensaje": "Servidor Funcionando"
    }
#Estado del servidor
@aplicacion.get("/estado")
def verificar_estado():
    return{
        "estado":"correcto",
        "aplicacion":"IDK"
    }
