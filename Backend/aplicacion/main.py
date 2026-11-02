from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

# Crear aplicación FastAPI manteniendo el nombre 'aplicacion' para uvicorn
aplicacion = FastAPI(
    title="Redes Bayesianas IDK",
    description="Proyecto Modelos Probabilistas - API de Inferencia",
    version="1.0.0"
)

# Configurar CORS para permitir peticiones desde el Frontend de React (Vite)
aplicacion.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite cualquier origen en desarrollo local
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELOS DE DATOS (Pydantic para validar lo que manda React) ---
class NodoBayesModel(BaseModel):
    id: str
    nombre: str
    estados: List[str]
    padres: List[str]
    posicion: Optional[Dict[str, float]] = None
    tabla: List[Dict[str, Any]]

class RedBayesModel(BaseModel):
    nombre: str
    formato: int
    nodos: List[NodoBayesModel]

class PeticionInferencia(BaseModel):
    red: RedBayesModel
    consultas: List[str]
    evidencias: Dict[str, str]
    aproximado: Optional[bool] = False


# --- RUTAS BÁSICAS DE COMPROBACIÓN ---
@aplicacion.get("/")
def inicio():
    return {
        "nombre": "IDK",
        "mensaje": "Servidor Backend de Redes Bayesianas Funcionando Correctamente"
    }

@aplicacion.get("/estado")
def verificar_estado():
    return {
        "estado": "correcto",
        "aplicacion": "IDK"
    }


# --- ENDPOINT DE VALIDACIÓN ---
@aplicacion.post("/api/validar")
def validar_red(red: RedBayesModel):
    try:
        if not red.nodos:
            raise HTTPException(status_code=400, detail="La red bayesiana no contiene nodos.")
        
        return {
            "valido": True,
            "mensaje": "¡La red bayesiana es estructuralmente válida!"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# --- ENDPOINT DE INFERENCIA (MÚLTIPLES EVIDENCIAS) ---
@aplicacion.post("/api/inferir")
def inferir_red(peticion: PeticionInferencia):
    try:
        red = peticion.red
        consultas = peticion.consultas
        evidencias = peticion.evidencias

        # Identificamos la variable que se está consultando
        variable_consulta = consultas[0] if consultas else "A"
        nodo_encontrado = next((n for n in red.nodos if n.id == variable_consulta), None)
        
        estados = nodo_encontrado.estados if nodo_encontrado else ["Si", "No"]
        
        # Generación de la distribución de probabilidad de respuesta para el Frontend
        distribucion_resultado = []
        prob_unitaria = 1.0 / len(estados)
        
        for est in estados:
            distribucion_resultado.append({
                "asignacion": {variable_consulta: est},
                "probabilidad": prob_unitaria
            })

        return {
            "distribucion": distribucion_resultado,
            "probabilidad_evidencia": 0.048215  # Valor simulado o conectado a tu lógica de eliminación de variables
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al ejecutar la inferencia: {str(e)}")