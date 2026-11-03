from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from aplicacion.modelos import(RedBayes, SolicitudInferencia, RespuestaInferencia)
from aplicacion.validacion import validarRed
from aplicacion.inferencia import inferirRed


#Crear aplicacion
aplicacion = FastAPI(
    title="IDK",
    description="Proyecto Modelos probabilistas",
    version="0.1.0"
)

#Permitir la comunicacion con el Frontend
aplicacion.add_middleware(
    CORSMiddleware, allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_methods=["*"],
    allow_headers=["*"]
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

#Validar una red bayesiana
@aplicacion.post("/api/validar")
def validarRedApi(red:RedBayes):
    try:
        validarRed(red)
        return{"valida":True, "mensaje":"Red bayesiana valida"}
    except ValueError as error:
        raise HTTPException(
            status_code=422,
            detail=str(error)
        ) from error

#Resolver una consulta bayesiana
@aplicacion.post(
    "/api/inferir",
    response_model=RespuestaInferencia
)
def inferirRedApi(solicitud:SolicitudInferencia):
    try:
        return inferirRed(solicitud)
    except ValueError as error:
        raise HTTPException(
            status_code=422,
            detail=str(error)
        ) from error