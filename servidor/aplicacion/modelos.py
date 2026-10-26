from typing import Any
from pydantic import BaseModel, Field

#Posicion del nodo
class Posicion(BaseModel):
    x: float=0.0
    y: float=0.0

#Tabla de probabilidad
class FilaProbabiliad(BaseModel):
    condiciones: dict[str,str]= Field(default_factory=dict)
    probabilidades:dict[str,float]

#Informacion de cada nodo
class NodoBayes(BaseModel):
    id: str
    nombre:str
    estados: list[str]
    padres:list[str]=Field(default_factory=list)
    tabla: list[FilaProbabiliad]
    posicion: Posicion=Field(default_factory=Posicion)

#Representacion de una red 
class RedBayes(BaseModel):
    nombre: str="Red sin titulo"
    nodos:list[NodoBayes]
    formato:int=1

#Datos para una consulta
class SolicitudInferencia(BaseModel):
    red: RedBayes
    variables_consulta: list[str]
    evidencia: dict[str,str]=Field(default_factory=dict)
    mostrar_pasos:bool=True

#Resultado para la combinacion de estados
class FilaResultado(BaseModel):
    asignacion: dict[str,str]
    probabilidad: float

#Respuesta final del algoritmo de inferencia
class RespuestaInferencia(BaseModel):
    nombre_red: str
    variable_consulta:list[str]
    evidencia:dict[str,str]
    distribucion:list[FilaResultado]
    probabilidad_evidencia:float
    orden_eliminacion:list[str]
    pasos:list[dict[str,Any]]=Field(default_factory=list)
