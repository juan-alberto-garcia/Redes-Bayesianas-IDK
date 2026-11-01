from dataclasses import dataclass, field
@dataclass
class Nodo:
    nombre: str
    estados: list
    padres: list = field(default_factory=list)
    cpt: dict = field(default_factory=dict)
@dataclass
class RedBayesiana:
    nodos: dict = field(default_factory=dict)

    def agregar_nodo(self, nodo):
        if nodo.nombre in self.nodos:
            raise ValueError("El nodo ya existe")

        self.nodos[nodo.nombre] = nodo