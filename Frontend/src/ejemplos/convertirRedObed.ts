import type { RedBayes, FilaProbabilidad } from '../tipos/red';
import type { RedBayesiana, NodoObed } from './tiposObed';

function comprobarEstados(nodo: NodoObed): void {
    if (nodo.estados.length < 2 || nodo.estados.length > 6) {
        throw new Error(`Cantidad de estados no valida en ${nodo.id}`);
    }
    if (new Set(nodo.estados).size !== nodo.estados.length) {
        throw new Error(`Estados repetidos en ${nodo.id}`);
    }
    if (nodo.estados.some(estado => !estado || estado.includes(','))) {
        throw new Error(`Estado vacio o con coma en ${nodo.id}`);
    }
    if (nodo.cpt.padres.join('|') !== nodo.padres.join('|')) {
        throw new Error(`Padres de CPT diferentes en ${nodo.id}`);
    }
    if (nodo.cpt.estados.join('|') !== nodo.estados.join('|')) {
        throw new Error(`Estados de CPT diferentes en ${nodo.id}`);
    }
}

function convertirTabla(nodo: NodoObed, todos: NodoObed[]): FilaProbabilidad[] {
    let combinaciones: Record<string, string>[] = [{}];
    for (const idPadre of nodo.padres) {
        const padre = todos.find(actual => actual.id === idPadre);
        if (!padre) {
            throw new Error(`Padre ${idPadre} inexistente en ${nodo.id}`);
        }
        combinaciones = combinaciones.flatMap(condiciones =>
            padre.estados.map(estado => ({
                ...condiciones,
                [idPadre]: estado
            }))
        );
    }

    const clavesVistas = new Set<string>();
    const filas = combinaciones.map(condiciones => {
        const probabilidades: Record<string, number> = {};
        for (const estado of nodo.estados) {
            const clave = [
                ...nodo.padres.map(id => condiciones[id]),
                estado
            ].join(',');
            if (!Object.prototype.hasOwnProperty.call(nodo.cpt.tabla, clave)) {
                throw new Error(`Falta ${clave} en la CPT de ${nodo.id}`);
            }
            const valor = nodo.cpt.tabla[clave];
            if (!Number.isFinite(valor) || valor < 0 || valor > 1) {
                throw new Error(`Probabilidad no valida para ${clave}`);
            }
            clavesVistas.add(clave);
            probabilidades[estado] = valor;
        }
        const suma = Object.values(probabilidades).reduce((a, b) => a + b, 0);
        if (Math.abs(suma - 1) > 0.000001) {
            throw new Error(`Fila de CPT no normalizada en ${nodo.id}`);
        }
        return { condiciones, probabilidades };
    });
    if (Object.keys(nodo.cpt.tabla).some(clave => !clavesVistas.has(clave))) {
        throw new Error(`Hay claves adicionales en la CPT de ${nodo.id}`);
    }
    return filas;
}

// Adapta ejemplos del PR #5 al formato que espera FastAPI de IDK.
export function convertirRedObed(origen: RedBayesiana): RedBayes {
    if (origen.nodos.length < 3 || origen.nodos.length > 10) {
        throw new Error('La red de ejemplo debe tener entre 3 y 10 nodos');
    }
    const ids = origen.nodos.map(nodo => nodo.id);
    if (new Set(ids).size !== ids.length) {
        throw new Error('Hay identificadores de nodos repetidos');
    }
    const conexiones = new Set(origen.conexiones.map(
        conexion => `${conexion.from}->${conexion.to}`
    ));
    const padres = new Set(origen.nodos.flatMap(nodo =>
        nodo.padres.map(id => `${id}->${nodo.id}`)
    ));
    if (conexiones.size !== padres.size ||
        [...padres].some(conexion => !conexiones.has(conexion))) {
        throw new Error('Las conexiones no coinciden con los padres');
    }

    return {
        nombre: origen.nombre,
        formato: 1,
        nodos: origen.nodos.map((nodo, indice) => {
            comprobarEstados(nodo);
            return {
                id: nodo.id,
                nombre: nodo.label,
                padres: [...nodo.padres],
                estados: [...nodo.estados],
                posicion: nodo.posicion
                    ? { ...nodo.posicion }
                    : { x: 120 + (indice % 3) * 220,
                        y: 100 + Math.floor(indice / 3) * 170 },
                tabla: convertirTabla(nodo, origen.nodos)
            };
        })
    };
}