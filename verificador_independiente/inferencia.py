from .factores import Factor
def crear_factores(red):
    factores = []

    for nombre, nodo in red.nodos.items():
        variables = list(nodo.padres) + [nombre]
        if not nodo.cpt:
            raise ValueError(
                f"El nodo {nombre} no tiene una tabla CPT."
            )

        factores.append(Factor(variables, nodo.cpt))
    return factores

def inferir(red, consulta, evidencia=None, orden=None):
    if evidencia is None:
        evidencia = {}

    if consulta not in red.nodos:
        raise ValueError("La variable de consulta no existe.")

    for variable, estado in evidencia.items():
        if variable not in red.nodos:
            raise ValueError(
                f"La variable {variable} no existe."
            )

        if estado not in red.nodos[variable].estados:
            raise ValueError(
                f"El estado {estado} no existe en {variable}."
            )

    if consulta in evidencia:
        raise ValueError(
            "La variable de consulta no debe estar en la evidencia."
        )

    factores = crear_factores(red)

    factores = [
        factor.restringir(evidencia)
        for factor in factores
    ]

    variables_eliminar = (
        set(red.nodos) - set(evidencia) - {consulta}
    )

    if orden is None:
        orden = [
            variable
            for variable in red.nodos
            if variable in variables_eliminar
        ]
    else:
        if (
            len(orden) != len(set(orden))
            or set(orden) != variables_eliminar
        ):
            raise ValueError(
                "El orden debe contener cada variable a eliminar "
                "exactamente una vez."
            )

    for variable in orden:
        relacionados = [
            factor
            for factor in factores
            if variable in factor.variables
        ]

        factores = [
            factor
            for factor in factores
            if variable not in factor.variables
        ]

        if not relacionados:
            continue

        combinado = relacionados[0]

        for factor in relacionados[1:]:
            combinado = combinado.multiplicar(factor)

        reducido = combinado.sumar_variable(variable)
        factores.append(reducido)

    if not factores:
        raise ValueError(
            "No hay factores disponibles para realizar la consulta."
        )

    resultado = factores[0]

    for factor in factores[1:]:
        resultado = resultado.multiplicar(factor)

    for variable in list(resultado.variables):
        if variable != consulta:
            resultado = resultado.sumar_variable(variable)

    distribucion = {}
    total = 0.0

    for estado in red.nodos[consulta].estados:
        clave = (
            (estado,)
            if consulta in resultado.variables
            else ()
        )

        probabilidad = resultado.tabla.get(clave, 0.0)
        distribucion[estado] = probabilidad
        total += probabilidad

    if total <= 0:
        raise ValueError(
            "La probabilidad total es cero; no se puede normalizar."
        )

    return {
        estado: probabilidad / total
        for estado, probabilidad in distribucion.items()
    }
