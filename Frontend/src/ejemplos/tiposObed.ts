// Tipos de los ejemplos de Obed, separados del modelo RedBayes de IDK.
export interface NodoObed {
    id: string;
    label: string;
    padres: string[];
    estados: string[];
    posicion?: { x: number; y: number };
    cpt: {
        padres: string[];
        estados: string[];
        tabla: Record<string, number>;
    };
}

export interface RedBayesiana {
    id: string;
    nombre: string;
    descripcion: string;
    nodos: NodoObed[];
    conexiones: { from: string; to: string }[];
}