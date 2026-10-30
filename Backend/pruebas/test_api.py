import unittest
from fastapi.testclient import TestClient
from aplicacion.main import aplicacion
from test_modelos import redPrueba

#Cliente para probar la API
cliente=TestClient(aplicacion)
class PruebasApi(unittest.TestCase):
    #Comprobar la ruta principal
    def testInicio(self):
        respuesta=cliente.get("/")
        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(respuesta.json()["mensaje"], "Servidor Funcionando")
    #Comprobar el estado del servidor
    def testEstado(self):
        respuesta=cliente.get("/estado")
        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(respuesta.json()["estado"], "correcto")
    #Validar una red correcta
    def testValidarRed(self):
        red=redPrueba().model_dump()
        respuesta=cliente.post("/api/validar", json=red)
        self.assertEqual(respuesta.status_code, 200)
    #Rechazar una red con padre inexixtente
    def testRedInvalida(self):
        red=redPrueba().model_dump()
        red["nodos"][1]["padres"]=["Inexistentes"]
        respuesta=cliente.post("/api/validar", json=red)
        self.assertEqual(respuesta.status_code, 422)
    #Resolver una consulta con evidencia
    def testInferir(self):
        consulta={"red":redPrueba().model_dump(), "variables_consulta":["A"], "evidencia":{"B":"Si"}, "mostrar_pasos":False}
        respuesta=cliente.post("/api/inferir", json=consulta)
        self.assertEqual(respuesta.status_code, 200, respuesta.text)
        datos=respuesta.json()
        probabilidades={fila["asignacion"]["A"]:fila["probabilidad"]
                        for fila in datos["distribucion"]
        }
        self.assertAlmostEqual(probabilidades["Si"], 0.27 / 0.41)
        self.assertAlmostEqual(probabilidades["No"], 0.14 / 0.41)
        self.assertAlmostEqual(datos["probabilidad_evidencia"], 0.41)
    #Rechazar una consulta inexistente
    def testConsultaInexistente(self):
        consulta={"red":redPrueba().model_dump(), "variables_consulta":["X"], "evidencia":{}}
        respuesta=cliente.post("/api/inferir", json=consulta)
        self.assertEqual(respuesta.status_code, 422)
    #Rechazar una solicitud incompleta
    def testSolicitudIncompleta(self):
        consulta={"red":redPrueba().model_dump()
        }
        respuesta=cliente.post("/api/inferir", json=consulta)
        self.assertEqual(respuesta.status_code, 422)

if __name__=="__main__":
    unittest.main()