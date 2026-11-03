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