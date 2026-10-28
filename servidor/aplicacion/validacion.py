from .modelos import RedBayesiana
def validar_red(red: RedBayesiana):
    errores = []
    nombres = set(red.nodos.keys())
    if not 3 <= len(nombres) <= 10:
        errores.append(
            "La red debe tener entre 3 y 10 nodos."
        )

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

    visitados = set()
    en_camino = set()
    def visitar(nombre):
        if nombre in en_camino:
            return True
        if nombre in visitados:
            return False
        en_camino.add(nombre)
        nodo = red.nodos[nombre]
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
                errores.append(
                    "La red contiene un ciclo."
                )
                break

    return errores


