from dataclasses import dataclass
from math import isfinite
from aplicacion.modelos import NodoBayes

#Estructura para almacenar un factor
@dataclass
class Factor:
    variables:list[str]
    valores: dict[tuple[str, ...], float]
#Converir la tabla de un nodo en un factor
def crearFactor(nodo:NodoBayes)->Factor:
    #Variables que forman el factor
    variables=nodo.padres+[nodo.id]
    #Diccionario para guardar las probabilidades
    valores={}
    #Recorrer las filas de la tabla
    for fila in nodo.tabla:
        estadosPadres=tuple(fila.condiciones[padre]
                            for padre in nodo.padres)
        #Guardar las probabilidades de cada estado
        for estado, probabilidad in fila.probabilidades.items():
            combinacion=estadosPadres+(estado,)
            valores[combinacion]=probabilidad
    return Factor(variables, valores)
#Aplicar la evidencia a un factor
def reducirFactor(factor: Factor, evidencia:dict[str,str])->Factor:
    #Conservar las variables que no son evidencia
    variablesRestantes=[variable for variable in factor.variables if variable not in evidencia]
    valoresNuevos={}
    #Recorrer las combinaciones del primer factor
    for combinacion, probabilidad in factor.valores.items():
        #Relacionar cada vairiable en su estado
        asignacion=dict(zip(factor.variables,combinacion))
        #Comprobar si coincide con la evidencia
        coincide=all(asignacion[variable]==estado for variable, estado in evidencia.items() if variable in asignacion)
        if coincide:
            #Crear la combinacion sin las variables observadas
            combinacionNueva=tuple(asignacion[variable] for variable in variablesRestantes)
            valoresNuevos[combinacionNueva]=probabilidad
    return Factor(variablesRestantes,valoresNuevos)
#Multiplicar dos factores
def multiplicarFactores(factorA:Factor, factorB:Factor)->Factor:
    #Unir las variables sin repetirlas
    variables=factorA.variables.copy()
    for variable in factorB.variables:
        if variable not in variables:
            variables.append(variable)
    #Buscar variables compartidas
    compartidas=[variable
                 for variable in factorA.variables
                 if variable in factorB.variables]
    valoresNuevos={}
    #Recorrer las combinaciones del primer factor
    for combinacionA, probabilidadA in factorA.valores.items():
        asignacionA=dict(zip(factorA.variables,combinacionA))
        #Recorrer las combinaciones del segundo factor
        for combinacionB, probabilidadB in factorB.valores.items():
            asignacionB=dict(zip(factorB.variables,combinacionB))
            #Verificar que las variables compartidas coincidan
            coincide=all(asignacionA[variable]==asignacionB[variable]
                         for variable in compartidas)
            if not coincide:
                continue
            #Unir las asignaciones
            asignacionNueva={**asignacionA,**asignacionB}
            #Construir la combinacion resultante
            combinacionNueva=tuple(asignacionNueva[variable] for variable in variables)
            #Multiplicar las probabilidades
            valoresNuevos[combinacionNueva]=(probabilidadA*probabilidadB)
    return Factor(variables,valoresNuevos)

#Eliminar una variable sumando probabilidades
def sumarVariable(factor:Factor,variable:str)->Factor:
    #Comprobar que la variable exista
    if variable not in factor.variables:
        raise ValueError(f"La variable {variable} no existe el factor")
    #Localizar la posicion de la variable
    indice=factor.variables.index(variable)
    #Crear las lista sin la variable eliminada
    variablesRestantes=[
        nombre 
        for nombre in factor.variables 
        if nombre != variable
    ]
    valoresNuevos={}
    #Recorrer las combinaciones
    for combinacion, probabilidad in factor.valores.items():
        #Eliminar el estado de la variable
        combinacionNueva=(combinacion[:indice]+combinacion[indice+1:])
        #Sumar probabilidades de combinaciones iguales
        valoresNuevos[combinacionNueva]=(valoresNuevos.get(combinacionNueva,0.0)+probabilidad)
    return Factor(variablesRestantes, valoresNuevos)

#Normalizar las probabilidades de un factor
def normalizarFactor(factor:Factor)->Factor:
    #Calcula la suma de los valores
    total=sum(factor.valores.values())
    #No se puede normalizar una suma nula o no finita
    if not isfinite(total) or total<=0:
        raise ValueError("No se puede normalizar el factor")
    valoresNuevos={}
    #Dividir cada probabilidad entre el total
    for combinacion, probabilidad in factor.valores.items():
        valoresNuevos[combinacion]=probabilidad/total
    return Factor(factor.variables.copy(), valoresNuevos)