from itertools import product
from math import isfinite, isclose
from aplicacion.modelos import RedBayes

#Verificar si una red cumple con las reglas necesarias
def validarRed(red:RedBayes)->bool:
    #Comprobar cantidad de nodos
    if not 3 <=len(red.nodos)<=10:
        raise ValueError("La red debe tener entre 3 y 10 nodos")
    #Crear un diccionario para localizar los nodos por ID
    nodos={nodo.id: nodo for nodo in red.nodos}

    #Verificar ID
    if len(nodos)!=len(red.nodos):
        raise ValueError("Existen identificadores repedtidos")
    #Revisar cada nodo de la red
    for nodo in red.nodos:
        if not nodo.id.strip() or not nodo.nombre.strip():
            raise ValueError("Los nodos necesitan ID y nombre")
        
        #Cada variable debe tener al menos dos estados
        if len(nodo.estados)<2:
            raise ValueError(f"El nodo {nodo.id} necesita dos estados")
        if any(not estado.strip() for estado in nodo.estados):
            raise ValueError(f"Estados vacios en {nodo.id}")
        if len(set(nodo.estados))!=len(nodo.estados):
            raise ValueError(f"Estados repetidos en {nodo.id}")
        if len(set(nodo.padres))!=len(nodo.padres):
            raise ValueError(f"Padres repetidos en {nodo.id}")
        for padre in nodo.padres:
            if padre not in nodos:
                raise ValueError(f"El padre {padre} no existe en la red")
            if padre == nodo.id:
                raise ValueError(f"El nodo {nodo.id} no puede ser su propio padre")

    #Buscar ciclos mediante recorrido de profundidad
    visitados= set()
    enRecorrido=set()
    def visitar(identificador):
        if identificador in enRecorrido:
            raise ValueError("La red contiene un ciclo")
        if identificador in visitados:
            return
        enRecorrido.add(identificador)
        for padre in nodos[identificador].padres:
            visitar(padre)
        enRecorrido.remove(identificador)
        visitados.add(identificador)
    for nodo in red.nodos:
        visitar(nodo.id)
    #Comprobar las tablas de probabilidad
    
    # Comprobar las tablas de probabilidad
    for nodo in red.nodos:

        # Obtener los estados de los padres
        estadosPadres = [
            nodos[padre].estados
            for padre in nodo.padres
        ]

        # Generar todas las combinaciones posibles
        combinaciones = set(product(*estadosPadres))

        # Comprobar cantidad de filas
        if len(nodo.tabla) != len(combinaciones):
            raise ValueError(
                f"Tabla incompleta en el nodo {nodo.id}"
            )

        combinacionesEncontradas = set()

        for fila in nodo.tabla:

            # Las condiciones deben mencionar a todos los padres
            if set(fila.condiciones) != set(nodo.padres):
                raise ValueError(
                    f"Condiciones incorrectas en {nodo.id}"
                )

            # Verificar los estados de cada padre
            for padre, estado in fila.condiciones.items():
                if estado not in nodos[padre].estados:
                    raise ValueError(
                        f"Estado invalido del padre {padre}"
                    )

            # Crear la combinacion de estados
            combinacion = tuple(
                fila.condiciones[padre]
                for padre in nodo.padres
            )

            # Comprobar combinaciones repetidas
            if combinacion in combinacionesEncontradas:
                raise ValueError(
                    f"Combinacion repetida en {nodo.id}"
                )

            combinacionesEncontradas.add(combinacion)

            # Revisar los estados de la variable
            if set(fila.probabilidades) != set(nodo.estados):
                raise ValueError(
                    f"Probabilidades incompletas en {nodo.id}"
                )

            # Verificar cada probabilidad
            for probabilidad in fila.probabilidades.values():

                if not isfinite(probabilidad):
                    raise ValueError(
                        f"Probabilidad no finita en {nodo.id}"
                    )

                if not 0 <= probabilidad <= 1:
                    raise ValueError(
                        f"Probabilidad fuera del rango en {nodo.id}"
                    )

            # Comprobar que las probabilidades sumen 1
            suma = sum(fila.probabilidades.values())

            if not isclose(suma, 1.0, rel_tol=0, abs_tol=1e-9):
                raise ValueError(
                    f"Las probabilidades no suman 1 en {nodo.id}"
                )

        # Verificar las combinaciones al terminar las filas
        if combinacionesEncontradas != combinaciones:
            raise ValueError(
                f"Faltan combinaciones en {nodo.id}"
            )

    # La red es valida si supera todas las comprobaciones
    return True
