
import unittest

from aplicacion.inferencia import inferirRed
from aplicacion.modelos import SolicitudInferencia
from test_modelos import redPrueba


class PruebasInferencia(unittest.TestCase):

    # Obtener la probabilidad de un estado
    def obtenerProbabilidad(self, resultado, variable, estado):
        for fila in resultado.distribucion:
            if fila.asignacion[variable] == estado:
                return fila.probabilidad

        return None

    # Calcular P(B) sin evidencia
    def testSinEvidencia(self):
        solicitud = SolicitudInferencia(
            red=redPrueba(),
            variables_consulta=["B"]
        )

        resultado = inferirRed(solicitud)

        self.assertAlmostEqual(
            self.obtenerProbabilidad(resultado, "B", "Si"),
            0.41
        )

        self.assertAlmostEqual(
            self.obtenerProbabilidad(resultado, "B", "No"),
            0.59
        )

        self.assertAlmostEqual(
            resultado.probabilidad_evidencia, 1.0
        )

    # Calcular P(A | B=Si)
    def testConEvidencia(self):
        solicitud = SolicitudInferencia(
            red=redPrueba(),
            variables_consulta=["A"],
            evidencia={"B": "Si"}
        )

        resultado = inferirRed(solicitud)

        self.assertAlmostEqual(
            self.obtenerProbabilidad(resultado, "A", "Si"),
            0.27 / 0.41
        )

        self.assertAlmostEqual(
            self.obtenerProbabilidad(resultado, "A", "No"),
            0.14 / 0.41
        )

        self.assertAlmostEqual(
            resultado.probabilidad_evidencia, 0.41
        )

    # Consultar dos variables a la vez
    def testVariasConsultas(self):
        solicitud = SolicitudInferencia(
            red=redPrueba(),
            variables_consulta=["B", "A"]
        )

        resultado = inferirRed(solicitud)

        probabilidades = {
            (fila.asignacion["A"], fila.asignacion["B"]):
            fila.probabilidad
            for fila in resultado.distribucion
        }

        self.assertAlmostEqual(
            probabilidades[("Si", "Si")], 0.27
        )
        self.assertAlmostEqual(
            probabilidades[("Si", "No")], 0.03
        )
        self.assertAlmostEqual(
            probabilidades[("No", "Si")], 0.14
        )
        self.assertAlmostEqual(
            probabilidades[("No", "No")], 0.56
        )

    # Consultar una variable que ya conocemos
    def testConsultaObservada(self):
        solicitud = SolicitudInferencia(
            red=redPrueba(),
            variables_consulta=["B"],
            evidencia={"B": "Si"}
        )

        resultado = inferirRed(solicitud)

        self.assertAlmostEqual(
            self.obtenerProbabilidad(resultado, "B", "Si"),
            1.0
        )

        self.assertAlmostEqual(
            self.obtenerProbabilidad(resultado, "B", "No"),
            0.0
        )

    # Comprobar el orden y los pasos
    def testPasosEliminacion(self):
        solicitud = SolicitudInferencia(
            red=redPrueba(),
            variables_consulta=["B"]
        )

        resultado = inferirRed(solicitud)

        self.assertEqual(
            resultado.orden_eliminacion, ["A", "C"]
        )

        self.assertTrue(len(resultado.pasos) > 0)

    # Desactivar la explicacion de pasos
    def testSinPasos(self):
        solicitud = SolicitudInferencia(
            red=redPrueba(),
            variables_consulta=["A"],
            mostrar_pasos=False
        )

        resultado = inferirRed(solicitud)

        self.assertEqual(resultado.pasos, [])

    # Rechazar variables de consulta inexistentes
    def testConsultaInexistente(self):
        solicitud = SolicitudInferencia(
            red=redPrueba(),
            variables_consulta=["X"]
        )

        with self.assertRaisesRegex(ValueError, "consulta"):
            inferirRed(solicitud)

    # Rechazar estados de evidencia inexistentes
    def testEvidenciaInvalida(self):
        solicitud = SolicitudInferencia(
            red=redPrueba(),
            variables_consulta=["A"],
            evidencia={"B": "Tal vez"}
        )

        with self.assertRaisesRegex(
            ValueError, "Estado de evidencia"
        ):
            inferirRed(solicitud)

    # Detectar evidencia de probabilidad cero
    def testEvidenciaImposible(self):
        red = redPrueba()

        # Hacer imposible que B sea Si
        for fila in red.nodos[1].tabla:
            fila.probabilidades = {
                "Si": 0.0,
                "No": 1.0
            }

        solicitud = SolicitudInferencia(
            red=red,
            variables_consulta=["A"],
            evidencia={"B": "Si"}
        )

        with self.assertRaisesRegex(
            ValueError, "probabilidad cero"
        ):
            inferirRed(solicitud)


if __name__ == "__main__":
    unittest.main()
