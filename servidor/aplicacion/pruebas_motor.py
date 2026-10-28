from .validacion import validar_red
from .modelos import Nodo, RedBayesiana
from .inferencia import inferir
from .enumeracion import enumerar

def probar_motor():
    red = RedBayesiana()
    red.agregar_nodo(
        Nodo(
            nombre="A",
            estados=["a1", "a2"],
            cpt={
                ("a1",): 0.6,
                ("a2",): 0.4,
            },
        )
    )

    red.agregar_nodo(
        Nodo(
            nombre="B",
            estados=["b1", "b2"],
            padres=["A"],
            cpt={
                ("a1", "b1"): 0.7,
                ("a1", "b2"): 0.3,
                ("a2", "b1"): 0.2,
                ("a2", "b2"): 0.8,
            },
        )
    )

    red.agregar_nodo(
        Nodo(
            nombre="C",
            estados=["c1", "c2"],
            padres=["A"],
            cpt={
                ("a1", "c1"): 0.9,
                ("a1", "c2"): 0.1,
                ("a2", "c1"): 0.4,
                ("a2", "c2"): 0.6,
            },
        )
    )

    errores = validar_red(red)
    if errores:
        print("errores de validacion:")
        for error in errores:
            print("-", error)
        return
    else:
        print("validacion de la red completada correctamente.") 
    evidencia = {"A": "a1"}
    resultado_eliminacion = inferir(
        red,
        consulta="B",
        evidencia=evidencia,
    )

    resultado_enumeracion = enumerar(
        red,
        consulta="B",
        evidencia=evidencia,
    )

    print("eliminación de variables:", resultado_eliminacion)
    print("enumeración exhaustiva:", resultado_enumeracion)
    for estado in resultado_eliminacion:
        assert abs(
            resultado_eliminacion[estado]
            -resultado_enumeracion[estado]
        ) < 1e-6,(
             f"Los resultados no coinciden para {estado}"
        )

    print("Prueba completada correctamente.")
    resultado_sin_evidencia = inferir(
        red,
        consulta="B",
    )
    
    print("consulta B sin evidencia:", resultado_sin_evidencia)
    assert abs(resultado_sin_evidencia["b1"] - 0.5) < 1e-6
    assert abs(resultado_sin_evidencia["b2"] - 0.5) < 1e-6
    evidencia_a2 = {"A": "a2"}
    resultado_a2 = inferir(
        red,
        consulta="B",
        evidencia=evidencia_a2,
    )

    print("consulta B con A = a2:", resultado_a2)
    assert abs(resultado_a2["b1"] - 0.2) < 1e-6
    assert abs(resultado_a2["b2"] - 0.8) < 1e-6

if __name__ == "__main__":
    probar_motor()
