
from itertools import product
def enumerar(red, consulta, evidencia=None):
    if evidencia is None:
        evidencia = {}

    if consulta not in red.nodos:
        raise ValueError(f"El nodo '{consulta}' no existe.")

    for variable, estado in evidencia.items():
        if variable not in red.nodos:
            raise ValueError(f"El nodo '{variable}' no existe.")
        if estado not in red.nodos[variable].estados:
            raise ValueError(
                f"El estado '{estado}' no es válido para {variable}."
            )

    variables = list(red.nodos.keys())
    distribucion = {
        estado: 0.0
        for estado in red.nodos[consulta].estados
    }

    combinaciones = [
        (nombre, red.nodos[nombre].estados)
        for nombre in variables
    ]

    for estados in product(*(valores for _, valores in combinaciones)):
        asignacion = dict(zip(variables, estados))

        if any(
            asignacion[variable] != estado
            for variable, estado in evidencia.items()
        ):
            continue

        probabilidad = 1.0

        for nombre in variables:
            nodo = red.nodos[nombre]
            clave = tuple(
                [asignacion[padre] for padre in nodo.padres]
                + [asignacion[nombre]]
            )

            if clave not in nodo.cpt:
                raise ValueError(
                    f"Falta la probabilidad {clave} en el nodo '{nombre}'."
                )

            probabilidad *= nodo.cpt[clave]

        distribucion[asignacion[consulta]] += probabilidad

    total = sum(distribucion.values())

    if total == 0:
        raise ValueError(
        )

    return {
        estado: probabilidad / total
        for estado, probabilidad in distribucion.items()
    }
