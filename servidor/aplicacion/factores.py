
class Factor:
    def __init__(self, variables, tabla):
        self.variables = list(variables)
        self.tabla = tabla

    def restringir(self, evidencia):
        nuevas_variables = [
            variable
            for variable in self.variables
            if variable not in evidencia
        ]

        nueva_tabla = {}

        for valores, probabilidad in self.tabla.items():
            asignacion = dict(zip(self.variables, valores))

            coincide = all(
                asignacion.get(variable) == valor
                for variable, valor in evidencia.items()
                if variable in asignacion
            )

            if coincide:
                nueva_clave = tuple(
                    asignacion[variable]
                    for variable in nuevas_variables
                )
                nueva_tabla[nueva_clave] = probabilidad

        return Factor(nuevas_variables, nueva_tabla)

    def sumar_variable(self, variable):
        if variable not in self.variables:
            return self

        nuevas_variables = [
            v for v in self.variables if v != variable
        ]

        nueva_tabla = {}

        for valores, probabilidad in self.tabla.items():
            asignacion = dict(zip(self.variables, valores))

            nueva_clave = tuple(
                asignacion[v] for v in nuevas_variables
            )

            nueva_tabla[nueva_clave] = (
                nueva_tabla.get(nueva_clave, 0.0)
                + probabilidad
            )

        return Factor(nuevas_variables, nueva_tabla)

    def multiplicar(self, otro):
        variables_comunes = [
            v for v in self.variables if v in otro.variables
        ]

        nuevas_variables = self.variables + [
            v for v in otro.variables if v not in self.variables
        ]

        nueva_tabla = {}

        for valores_a, prob_a in self.tabla.items():
            asignacion_a = dict(zip(self.variables, valores_a))

            for valores_b, prob_b in otro.tabla.items():
                asignacion_b = dict(zip(otro.variables, valores_b))

                if all(
                    asignacion_a[v] == asignacion_b[v]
                    for v in variables_comunes
                ):
                    asignacion = {**asignacion_a, **asignacion_b}

                    clave = tuple(
                        asignacion[v] for v in nuevas_variables
                    )

                    nueva_tabla[clave] = prob_a * prob_b

        return Factor(nuevas_variables, nueva_tabla)
