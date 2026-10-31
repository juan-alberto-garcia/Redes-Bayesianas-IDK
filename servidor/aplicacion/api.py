
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .modelos import Nodo, RedBayesiana
from .inferencia import inferir
from .validacion import validar_red

router = APIRouter()
class DatosNodo(BaseModel):
    nombre: str
    estados: list[str]
    padres: list[str] = []
    cpt: dict[str, float]

class DatosConsulta(BaseModel):
    nodos: list[DatosNodo]
    consulta: str
    evidencia: dict[str, str] = {}

@router.post("/consultar")
def consultar(datos: DatosConsulta):

    try:
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
            "resultado": resultado
        }

    except HTTPException:
        raise
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))

        


