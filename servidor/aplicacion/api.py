
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from .modelos import Nodo, RedBayesiana
from .inferencia import inferir
from .validacion import validar_red

router = APIRouter()
class DatosNodo(BaseModel):
    nombre: str
    estados: list[str]
    padres: list[str] = Field(default_factory=list)
    cpt: dict[str, float]
class DatosRed(BaseModel):
    nodos: list[DatosNodo]
class DatosConsulta(DatosRed):
    consulta: str
    evidencia: dict[str, str] = Field(default_factory=dict)

def construir_red(datos):
    red = RedBayesiana()
    for datos_nodo in datos.nodos:
        nodo = Nodo(
            nombre=datos_nodo.nombre,
            estados=datos_nodo.estados,
            padres=datos_nodo.padres,
            cpt={
                tuple(clave.split("|")): valor
                for clave, valor in datos_nodo.cpt.items()
            }
        )

        red.agregar_nodo(nodo)
    return red

@router.post("/api/validar")
def validar(datos: DatosRed):
    try:
        red = construir_red(datos)
        errores = validar_red(red)
        if errores:
            raise HTTPException(status_code=400, detail=errores)
        return {
            "estado": "correcto",
            "mensaje": "La red bayesiana es válida."
        }

    except HTTPException:
        raise
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))

@router.post("/api/inferir")
@router.post("/consultar")
def consultar(datos: DatosConsulta):
    try:
        red = construir_red(datos)
        errores = validar_red(red)
        if errores:
            raise HTTPException(status_code=400, detail=errores)
        resultado = inferir(
            red,
            datos.consulta,
            datos.evidencia
        )

        return {
            "estado": "correcto",
            "consulta": datos.consulta,
            "evidencia": datos.evidencia,
            "resultado": resultado
        }

    except HTTPException:
        raise
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))
