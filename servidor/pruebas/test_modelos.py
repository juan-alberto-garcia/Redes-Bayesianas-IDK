
import unittest

from aplicacion.modelos import (RedBayes,SolicitudInferencia)

# Crear una red de ejemplo para las pruebas
def crear_red_prueba():
    datos = {
        "nombre": "Red del clima",
        "nodos": [
            {
                "id": "A",
                "nombre": "Lluvia",
                "estados": ["Si", "No"],
                "tabla": [
                    {
                        "probabilidades": {
                            "Si": 0.3,
                            "No": 0.7
                        }
                    }
                ]
            },
            {
                "id": "B",
                "nombre": "Cesped mojado",
                "estados": ["Si", "No"],
                "padres": ["A"],
                "tabla": [
                    {
                        "condiciones": {"A": "Si"},
                        "probabilidades": {
                            "Si": 0.9,
                            "No": 0.1
                        }
                    },
                    {
                        "condiciones": {"A": "No"},
                        "probabilidades": {
                            "Si": 0.2,
                            "No": 0.8
                        }
                    }
                ]
            },
            {
                "id": "C",
                "nombre": "Trafico",
                "estados": ["Si", "No"],
                "tabla": [
                    {
                        "probabilidades": {
                            "Si": 0.4,
                            "No": 0.6
                        }
                    }
                ]
            }
        ]
    }

    return RedBayes.model_validate(datos)


class PruebasModelos(unittest.TestCase):

    # Comprobar que podemos crear una red
    def test_crear_red(self):
        red = crear_red_prueba()

        self.assertEqual(len(red.nodos), 3)
        self.assertEqual(red.nombre, "Red del clima")
        self.assertEqual(red.nodos[1].padres, ["A"])

    # Comprobar que conservamos los datos al guardar
    def test_guardar_y_recuperar(self):
        red = crear_red_prueba()

        datos_json = red.model_dump_json()
        red_recuperada = RedBayes.model_validate_json(
            datos_json
        )

        self.assertEqual(
            red.model_dump(),
            red_recuperada.model_dump()
        )

        # Comprobar que podemos definir una consulta
    def test_crear_consulta(self):
        red = crear_red_prueba()

        consulta = SolicitudInferencia(
            red=red,
            variables_consulta=["A"],
            evidencia={"B": "Si"}
        )

        self.assertEqual(
            consulta.variables_consulta, ["A"]
        )

        self.assertEqual(
            consulta.evidencia["B"], "Si"
        )

        self.assertTrue(consulta.mostrar_pasos)


if __name__ == "__main__":
    unittest.main()