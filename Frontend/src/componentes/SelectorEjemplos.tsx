import { useState } from 'react';

import { redesEjemplo } from '../ejemplos/redesEjemplo';
import { redesM } from '../ejemplos/redesM';

import {
    redesMaestro
} from '../ejemplos/redesMaestroOficial';

import type {
    EjemploMaestro
} from '../ejemplos/redesMaestroOficial';

import type {
    RedBayesiana
} from '../ejemplos/tiposObed';

import './SelectorEjemplos.css';

type Propiedades = {
    onSeleccionarRed: (red: RedBayesiana) => void;
};

type EntradaCatalogo = {
    id: string;
    titulo: string;
    descripcion: string;
    red: RedBayesiana;
    oficial?: EjemploMaestro;
};

// Convertir una red oficial al formato usado por
// el adaptador de IDK, sin modificar sus CPT.
function adaptarOficial(
    ejemplo: EjemploMaestro
): RedBayesiana {

    return {
        id: 'oficial-' + ejemplo.id,
        nombre: ejemplo.red.nombre,
        descripcion: ejemplo.descripcion,

        nodos: ejemplo.red.nodos.map(nodo => {

            const tabla: Record<string, number> = {};

            for (const fila of nodo.tabla) {
                for (const estado of nodo.estados) {

                    const clave = [
                        ...nodo.padres.map(
                            id => fila.condiciones[id]
                        ),
                        estado
                    ].join(',');

                    tabla[clave] =
                        fila.probabilidades[estado];
                }
            }

            return {
                id: nodo.id,
                label: nodo.nombre,
                padres: [...nodo.padres],
                estados: [...nodo.estados],
                posicion: { ...nodo.posicion },

                cpt: {
                    padres: [...nodo.padres],
                    estados: [...nodo.estados],
                    tabla
                }
            };
        }),

        conexiones: ejemplo.red.nodos.flatMap(
            nodo => nodo.padres.map(id => ({
                from: id,
                to: nodo.id
            }))
        )
    };
}

// Cinco redes del material del maestro
const oficiales: EntradaCatalogo[] =
    redesMaestro.map(ejemplo => ({
        id: 'oficial-' + ejemplo.id,
        titulo: ejemplo.titulo,
        descripcion: ejemplo.descripcion,
        red: adaptarOficial(ejemplo),
        oficial: ejemplo
    }));

// Dos ejemplos clasicos de Obed
const clasicos: EntradaCatalogo[] =
    redesEjemplo.map(red => ({
        id: red.id,
        titulo: red.nombre,
        descripcion: red.descripcion,
        red
    }));

// Cinco redes adicionales de Obed
const propuestasObed: EntradaCatalogo[] =
    redesM.map(red => ({
        id: red.id,
        titulo: red.nombre,
        descripcion: red.descripcion,
        red
    }));

// Los tres catalogos se conservan por separado
const todosLosEjemplos: EntradaCatalogo[] = [
    ...oficiales,
    ...clasicos,
    ...propuestasObed
];

export function SelectorEjemplos({
    onSeleccionarRed
}: Propiedades) {

    const [idSeleccionado, setIdSeleccionado] =
        useState(todosLosEjemplos[0]?.id ?? '');

    const seleccionado = todosLosEjemplos.find(
        actual => actual.id === idSeleccionado
    ) ?? todosLosEjemplos[0];

    if (!seleccionado) {
        return (
            <section className="panel catalogoEjemplos">
                <p>No hay redes disponibles.</p>
            </section>
        );
    }

    const referencia = seleccionado.oficial;

    const nombreConsulta = referencia
        ? referencia.red.nodos.find(
            nodo => nodo.id === referencia.consulta
        )?.nombre ?? referencia.consulta
        : '';

    const evidencias = referencia
        ? Object.entries(referencia.evidencias)
            .map(([id, estado]) => {
                const nodo = referencia.red.nodos.find(
                    actual => actual.id === id
                );

                return `${nodo?.nombre ?? id} = ${estado}`;
            })
            .join(', ')
        : '';

    const condiciones = referencia
        ? Object.entries(referencia.evidencias)
            .map(([id, estado]) => `${id}=${estado}`)
            .join(', ')
        : '';

    const expresion = referencia
        ? `P(${referencia.consulta}=${referencia.estadoConsulta}` +
            (condiciones ? ` | ${condiciones}` : '') +
            ')'
        : '';

    function cargarSeleccionado() {
        // La confirmacion ya se realiza en App.tsx.
        onSeleccionarRed(seleccionado.red);
    }

    return (
        <section className="panel catalogoEjemplos">

            <h2>Redes de ejemplo</h2>

            <p>
                Selecciona una red para consultar su
                informacion. Despues presiona el boton
                para cargarla en el editor grafico.
            </p>

            <label className="selectorEjemplos">

                Red disponible

                <select
                    value={idSeleccionado}
                    onChange={evento =>
                        setIdSeleccionado(
                            evento.target.value
                        )
                    }
                >
                    <optgroup label="Ejercicios del maestro">
                        {oficiales.map(ejemplo => (
                            <option
                                key={ejemplo.id}
                                value={ejemplo.id}
                            >
                                {ejemplo.titulo}
                            </option>
                        ))}
                    </optgroup>

                    <optgroup label="Ejemplos clásicos">
                        {clasicos.map(ejemplo => (
                            <option
                                key={ejemplo.id}
                                value={ejemplo.id}
                            >
                                {ejemplo.titulo}
                            </option>
                        ))}
                    </optgroup>

                    <optgroup label="Ejemplos adicionales">
                        {propuestasObed.map(ejemplo => (
                            <option
                                key={ejemplo.id}
                                value={ejemplo.id}
                            >
                                {ejemplo.titulo}
                            </option>
                        ))}
                    </optgroup>

                </select>

            </label>

            <div className="detallesEjemplo">

                <h3>{seleccionado.titulo}</h3>

                <p>{seleccionado.descripcion}</p>

                <p>
                    <strong>Numero de nodos:</strong>{' '}
                    {seleccionado.red.nodos.length}
                </p>

                <p>
                    <strong>Procedencia:</strong>{' '}
                    {referencia
                        ? 'Material del maestro'
                        : 'Ejemplos aportados por Obed'}
                </p>

                {referencia && (
                    <div className="referenciaEjemplo">

                        <p>
                            <strong>Documento:</strong>{' '}
                            Eliminacion de Variables -
                            10 Ejercicios
                        </p>

                        <p>
                            <strong>Ejercicio:</strong>{' '}
                            {referencia.ejercicio}
                        </p>

                        <p>
                            <strong>Pagina:</strong>{' '}
                            {referencia.pagina}
                        </p>

                        <p>
                            <strong>Variable de consulta:</strong>{' '}
                            {nombreConsulta}
                        </p>

                        <p>
                            <strong>Evidencias sugeridas:</strong>{' '}
                            {evidencias || 'Ninguna'}
                        </p>

                        <p>
                            <strong>Consulta de referencia:</strong>{' '}
                            {expresion}
                        </p>

                        <p>
                            <strong>Resultado de referencia:</strong>{' '}
                            <span className="resultadoReferencia">
                                {(referencia.resultadoEsperado * 100)
                                    .toFixed(2)}%
                            </span>
                        </p>

                    </div>
                )}

            </div>

            <button
                type="button"
                onClick={cargarSeleccionado}
            >
                Cargar red de ejemplo
            </button>

        </section>
    );
}