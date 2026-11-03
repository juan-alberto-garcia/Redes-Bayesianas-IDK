export interface CPTTabla {
    padres: string[];
    estados: string[];
    tabla: Record<string, number>;
  }
  
  export interface NodoRed {
    id: string;
    label: string;
    padres: string[];
    estados: string[];
    cpt: CPTTabla;
    posicion?: { x: number; y: number };
  }
  
  export interface ConexionRed {
    from: string;
    to: string;
  }
  
  export interface RedBayesiana {
    id: string;
    nombre: string;
    descripcion: string;
    nodos: NodoRed[];
    conexiones: ConexionRed[];
  }

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