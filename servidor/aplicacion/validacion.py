
from itertools import product
from math import isfinite
from .modelos import RedBayesiana

def validar_red(red: RedBayesiana):
    errores = []
    nombres = set(red.nodos.keys())

    if not 3 <= len(nombres) <= 10:
        errores.append("La red debe tener entre 3 y 10 nodos.")

    for nombre, nodo in red.nodos.items():
        if not nombre.strip():
            errores.append("Hay un nodo sin nombre.")

        if len(nodo.estados) < 2:
            errores.append(
                f"El nodo {nombre} debe tener al menos dos estados."
            )

        if len(nodo.estados) != len(set(nodo.estados)):
            errores.append(
                f"El nodo {nombre} tiene estados repetidos."
            )

        for padre in nodo.padres:
            if padre not in nombres:
                errores.append(
                    f"El padre {padre} del nodo {nombre} no existe."
                )

        if nombre in nodo.padres:
            errores.append(
                f"El nodo {nombre} no puede ser su propio padre."
            )

        if all(padre in nombres for padre in nodo.padres):
            claves_esperadas = set()

            combinaciones_padres = product(
                *(red.nodos[padre].estados for padre in nodo.padres)
            )

            for valores_padres in combinaciones_padres:
                probabilidades = []
                completa = True

                for estado in nodo.estados:
                    clave = tuple(valores_padres) + (estado,)
                    claves_esperadas.add(clave)

                    if clave not in nodo.cpt:
                        errores.append(
                            f"Falta la probabilidad {clave} "
                            f"en el nodo {nombre}."
                        )
                        completa = False
                        continue

                    probabilidad = nodo.cpt[clave]

                    if (
                        isinstance(probabilidad, bool)
                        or not isinstance(probabilidad, (int, float))
                        or not isfinite(probabilidad)
                    ):
                        errores.append(
                            f"La probabilidad de {clave} "
                            f"en el nodo {nombre} no es válida."
                        )
                        completa = False
                        continue

                    if not 0 <= probabilidad <= 1:
                        errores.append(
                            f"La probabilidad de {clave} "
                            f"en el nodo {nombre} debe estar entre 0 y 1."
                        )
                        completa = False

                    probabilidades.append(probabilidad)

                if (
                    completa
                    and abs(sum(probabilidades) - 1.0) > 1e-6
                ):
                    errores.append(
                        f"Las probabilidades del nodo {nombre}, "
                        f"para los padres {valores_padres}, deben sumar 1."
                    )

            for clave in nodo.cpt:
                if clave not in claves_esperadas:
                    errores.append(
                        f"La entrada {clave} de la CPT "
                        f"del nodo {nombre} no es válida."
                    )

    visitados = set()
    en_camino = set()

    def visitar(nombre):
        if nombre in en_camino:
            return True

        if nombre in visitados:
            return False

        en_camino.add(nombre)

        for hijo_nombre, hijo in red.nodos.items():
            if nombre in hijo.padres:
                if visitar(hijo_nombre):
                    return True

        en_camino.remove(nombre)
        visitados.add(nombre)
        return False

    for nombre in nombres:
        if nombre not in visitados:
            if visitar(nombre):
                errores.append("La red contiene un ciclo.")
                break

    return errores
