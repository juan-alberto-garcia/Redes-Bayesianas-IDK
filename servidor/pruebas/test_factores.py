
import unittest

from aplicacion.factores import (Factor, crearFactor, reducirFactor, multiplicarFactores, sumarVariable, normalizarFactor
)

from test_modelos import redPrueba


class PruebasFactores(unittest.TestCase):

    # Preparar factores para cada prueba
    def setUp(self):
        red = redPrueba()

        self.factorA = crearFactor(red.nodos[0])
        self.factorB = crearFactor(red.nodos[1])

    # Comprobar la creacion de factores
    def testCrearFactor(self):

        self.assertEqual(self.factorA.variables, ["A"])
        self.assertAlmostEqual(
            self.factorA.valores[("Si",)], 0.3
        )

        self.assertEqual(self.factorB.variables, ["A", "B"])
        self.assertAlmostEqual(
            self.factorB.valores[("No", "Si")], 0.2
        )

    # Aplicar evidencia sobre el factor
    def testReducirFactor(self):

        resultado = reducirFactor(
            self.factorB, {"A": "Si"}
        )

        self.assertEqual(resultado.variables, ["B"])
        self.assertEqual(len(resultado.valores), 2)

        self.assertAlmostEqual(
            resultado.valores[("Si",)], 0.9
        )

        self.assertAlmostEqual(
            resultado.valores[("No",)], 0.1
        )

    # Comprobar la multiplicacion
    def testMultiplicarFactores(self):

        resultado = multiplicarFactores(
            self.factorA, self.factorB
        )

        self.assertEqual(resultado.variables, ["A", "B"])

        self.assertAlmostEqual(
            resultado.valores[("Si", "Si")], 0.27
        )

        self.assertAlmostEqual(
            resultado.valores[("No", "Si")], 0.14
        )

    # Eliminar A y obtener probabilidades de B
    def testSumarVariable(self):

        producto = multiplicarFactores(
            self.factorA, self.factorB
        )

        resultado = sumarVariable(producto, "A")

        self.assertEqual(resultado.variables, ["B"])

        self.assertAlmostEqual(
            resultado.valores[("Si",)], 0.41
        )

        self.assertAlmostEqual(
            resultado.valores[("No",)], 0.59
        )

    # Comprobar la normalizacion
    def testNormalizarFactor(self):

        producto = multiplicarFactores(
            self.factorA, self.factorB
        )

        reducido = reducirFactor(
            producto, {"B": "Si"}
        )

        resultado = normalizarFactor(reducido)

        self.assertEqual(resultado.variables, ["A"])

        self.assertAlmostEqual(
            resultado.valores[("Si",)], 0.27 / 0.41
        )

        self.assertAlmostEqual(
            resultado.valores[("No",)], 0.14 / 0.41
        )

        self.assertAlmostEqual(
            sum(resultado.valores.values()), 1.0
        )

    # No eliminar variables inexistentes
    def testVariableInexistente(self):

        with self.assertRaises(ValueError):
            sumarVariable(self.factorA, "X")

    # No normalizar factores con probabilidad total cero
    def testNormalizacionImposible(self):

        factor = Factor(
            variables=["A"],
            valores={
                ("Si",): 0.0,
                ("No",): 0.0
            }
        )

        with self.assertRaises(ValueError):
            normalizarFactor(factor)


if __name__ == "__main__":
    unittest.main()
