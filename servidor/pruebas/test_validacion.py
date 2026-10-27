
import unittest
from aplicacion.validacion import validarRed
from test_modelos import redPrueba


class PruebasValidacion(unittest.TestCase):

    # Una red correcta deberia ser aceptada
    def testRedValida(self):
        red = redPrueba()
        self.assertTrue(validarRed(red))

    # Una red con ciclos debe rechazarse
    def testDetectarCiclos(self):
        red = redPrueba()

        # B depende de A; hacemos que A dependa de B
        red.nodos[0].padres = ["B"]

        with self.assertRaisesRegex(ValueError, "ciclo"):
            validarRed(red)

    # La red debe tener minimo 3 nodos
    def testMinimoNodos(self):
        red = redPrueba()

        # Quitar un nodo para dejar solamente 2
        red.nodos.pop()

        with self.assertRaisesRegex(ValueError, "entre 3 y 10"):
            validarRed(red)

    # No debe haber padres inexistentes
    def testPadreInexistente(self):
        red = redPrueba()

        # El nodo B tendra un padre que no existe
        red.nodos[1].padres = ["X"]

        with self.assertRaisesRegex(ValueError, "no existe"):
            validarRed(red)

    # Las probabilidades deben sumar 1
    def testSumaProbabilidades(self):
        red = redPrueba()

        # Cambiar una probabilidad para que sumen 1.2
        red.nodos[0].tabla[0].probabilidades["Si"] = 0.5

        with self.assertRaisesRegex(ValueError, "no suman 1"):
            validarRed(red)

    # La tabla debe tener todas las combinaciones
    def testTablaIncompleta(self):
        red = redPrueba()

        # Eliminar una fila de la tabla del nodo B
        red.nodos[1].tabla.pop()

        with self.assertRaisesRegex(ValueError, "Tabla incompleta"):
            validarRed(red)


if __name__ == "__main__":
    unittest.main()
