
export interface FilaProbabilidad {
    condiciones: Record<string, string>;
    probabilidades: Record<string, number>;
}

export interface Posicion {
    x: number;
    y: number;
}

export interface NodoBayes {
    id: string;
    nombre: string;
    estados: string[];
    padres: string[];
    tabla: FilaProbabilidad[];
    posicion: Posicion;
}

export interface RedBayes {
    nombre: string;
    nodos: NodoBayes[];
    formato: number;
}

export interface FilaResultado {
    asignacion: Record<string, string>;
    probabilidad: number;
}

export interface RespuestaInferencia {
    nombre_red: string;
    variable_consulta: string[];
    evidencia: Record<string, string>;
    distribucion: FilaResultado[];
    probabilidad_evidencia: number;
    orden_eliminacion: string[];
    pasos: Record<string, unknown>[];
}
