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
            cpt={("a1",): 0.6, ("a2",): 0.4},
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
    assert not errores, f"Errores de validación: {errores}"
    print("Validación de la red: correcta.")

    resultado = inferir(red, consulta="B", evidencia={"A": "a1"})
    resultado_enum = enumerar(red, consulta="B", evidencia={"A": "a1"})

    print("Eliminación de variables:", resultado)
    print("Enumeración exhaustiva:", resultado_enum)

    for estado in resultado:
        assert abs(resultado[estado] - resultado_enum[estado]) < 1e-6

    resultado_sin_evidencia = inferir(red, consulta="B")
    print("Consulta B sin evidencia:", resultado_sin_evidencia)
    assert abs(resultado_sin_evidencia["b1"] - 0.5) < 1e-6
    assert abs(resultado_sin_evidencia["b2"] - 0.5) < 1e-6

    resultado_a2 = inferir(
        red, consulta="B", evidencia={"A": "a2"}
    )
    print("Consulta B con A = a2:", resultado_a2)
    assert abs(resultado_a2["b1"] - 0.2) < 1e-6
    assert abs(resultado_a2["b2"] - 0.8) < 1e-6

    print("Pruebas del motor: correctas.")


def probar_probabilidad_incorrecta():
    red = RedBayesiana()

    red.agregar_nodo(
        Nodo(
            nombre="A",
            estados=["a1", "a2"],
            cpt={("a1",): 1.2, ("a2",): -0.2},
        )
    )
    red.agregar_nodo(
        Nodo(
            nombre="B",
            estados=["b1", "b2"],
            cpt={("b1",): 0.5, ("b2",): 0.5},
        )
    )
    red.agregar_nodo(
        Nodo(
            nombre="C",
            estados=["c1", "c2"],
            cpt={("c1",): 0.5, ("c2",): 0.5},
        )
    )

    errores = validar_red(red)
    print("Errores detectados:", errores)
    assert errores, "No se detectaron las probabilidades incorrectas."
    print("Prueba de probabilidades incorrectas: correcta.")

def probar_cpt_incompleta():
    red = RedBayesiana()

    red.agregar_nodo(
        Nodo(
            nombre="A",
            estados=["a1", "a2"],
            cpt={("a1",): 0.6},
        )
    )
    red.agregar_nodo(
        Nodo(
            nombre="B",
            estados=["b1", "b2"],
            cpt={("b1",): 0.5, ("b2",): 0.5},
        )
    )
    red.agregar_nodo(
        Nodo(
            nombre="C",
            estados=["c1", "c2"],
            cpt={("c1",): 0.5, ("c2",): 0.5},
        )
    )

    errores = validar_red(red)
    assert errores, "No se detectó la CPT incompleta."
    print("Prueba de CPT incompleta: correcta.")


def probar_ciclo():
    red = RedBayesiana()

    red.agregar_nodo(
        Nodo(
            nombre="A",
            estados=["a1", "a2"],
            padres=["B"],
            cpt={
                ("b1", "a1"): 0.5,
                ("b1", "a2"): 0.5,
                ("b2", "a1"): 0.5,
                ("b2", "a2"): 0.5,
            },
        )
    )
    red.agregar_nodo(
        Nodo(
            nombre="B",
            estados=["b1", "b2"],
            padres=["A"],
            cpt={
                ("a1", "b1"): 0.5,
                ("a1", "b2"): 0.5,
                ("a2", "b1"): 0.5,
                ("a2", "b2"): 0.5,
            },
        )
    )
    red.agregar_nodo(
        Nodo(
            nombre="C",
            estados=["c1", "c2"],
            cpt={("c1",): 0.5, ("c2",): 0.5},
        )
    )

    errores = validar_red(red)
    assert errores, "No se detectó el ciclo."
    print("Prueba de ciclo: correcta.")

    
def probar_consulta_inexistente():
    red = RedBayesiana()

    red.agregar_nodo(
        Nodo("A", ["a1", "a2"], cpt={
            ("a1",): 0.5,
            ("a2",): 0.5,
        })
    )
    red.agregar_nodo(
        Nodo("B", ["b1", "b2"], cpt={
            ("b1",): 0.5,
            ("b2",): 0.5,
        })
    )
    red.agregar_nodo(
        Nodo("C", ["c1", "c2"], cpt={
            ("c1",): 0.5,
            ("c2",): 0.5,
        })
    )

    try:
        inferir(red, consulta="D")
    except ValueError:
        print("Prueba de consulta inexistente: correcta.")
    else:
        raise AssertionError(
            "El motor aceptó una consulta inexistente."
        )

def probar_evidencia_invalida():
    red = RedBayesiana()

    red.agregar_nodo(
        Nodo("A", ["a1", "a2"], cpt={
            ("a1",): 0.5,
            ("a2",): 0.5,
        })
    )
    red.agregar_nodo(
        Nodo("B", ["b1", "b2"], cpt={
            ("b1",): 0.5,
            ("b2",): 0.5,
        })
    )
    red.agregar_nodo(
        Nodo("C", ["c1", "c2"], cpt={
            ("c1",): 0.5,
            ("c2",): 0.5,
        })
    )

    try:
        inferir(red, consulta="B", evidencia={"A": "invalido"})
    except ValueError:
        print("Prueba de evidencia inválida: correcta.")
    else:
        raise AssertionError(
            "El motor aceptó un estado de evidencia inválido."
        )

    
def probar_evidencia_imposible():
    red = RedBayesiana()

    red.agregar_nodo(
        Nodo(
            nombre="A",
            estados=["a1", "a2"],
            cpt={
                ("a1",): 1.0,
                ("a2",): 0.0,
            },
        )
    )

    red.agregar_nodo(
        Nodo(
            nombre="B",
            estados=["b1", "b2"],
            cpt={
                ("b1",): 0.7,
                ("b2",): 0.3,
            },
        )
    )

    red.agregar_nodo(
        Nodo(
            nombre="C",
            estados=["c1", "c2"],
            cpt={
                ("c1",): 0.5,
                ("c2",): 0.5,
            },
        )
    )

    try:
        inferir(red, consulta="B", evidencia={"A": "a2"})
    except ValueError:
        print("Prueba de evidencia imposible: correcta.")
    else:
        raise AssertionError(
            "El motor aceptó una evidencia de probabilidad cero."
        )

if __name__ == "__main__":
    print("Iniciando pruebas...")
    probar_motor()
    probar_probabilidad_incorrecta()
    probar_cpt_incompleta()
    probar_ciclo()
    probar_consulta_inexistente()
    probar_evidencia_invalida()
    probar_evidencia_imposible()
    print("Todas las pruebas terminaron.")
