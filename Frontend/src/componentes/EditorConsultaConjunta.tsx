import { useEffect, useState } from 'react';

import type { RedBayes } from '../tipos/red';
import './EditorConsultaConjunta.css';

type ModoConsulta = 'individual' | 'conjunta';

type Evidencia = {
    variable: string;
    estado: string;
};

type Propiedades = {
    red: RedBayes;
    consultas: string[];
    evidencias: Evidencia[];
    onCambiarConsultas: (nuevas: string[]) => void;
};

export default function EditorConsultaConjunta({
    red,
    consultas,
    evidencias,
    onCambiarConsultas
}: Propiedades) {

    const [modo, setModo] = useState<ModoConsulta>(
        consultas.length > 1 ? 'conjunta' : 'individual'
    );

    const [aviso, setAviso] = useState('');

    // Reconocer una consulta conjunta al cargarla
    useEffect(() => {
        if (consultas.length > 1) {
            setModo('conjunta');
        }
    }, [consultas]);

    // Cambiar de modo
    function cambiarModo(nuevoModo: ModoConsulta) {
        setModo(nuevoModo);
        setAviso('');

        if (
            nuevoModo === 'individual' &&
            consultas.length > 1
        ) {
            onCambiarConsultas([consultas[0]]);
        }
    }

    // Agregar, quitar o reemplazar variables
    function seleccionarVariable(id: string) {
        setAviso('');

        if (modo === 'individual') {
            onCambiarConsultas([id]);
            return;
        }

        if (consultas.includes(id)) {
            if (consultas.length === 1) {
                setAviso(
                    'Debe permanecer al menos una variable de consulta.'
                );
                return;
            }

            onCambiarConsultas(
                consultas.filter(actual => actual !== id)
            );
            return;
        }

        onCambiarConsultas([...consultas, id]);
    }

    // Elegir solamente una variable
    function seleccionarSoloEsta(id: string) {
        setModo('individual');
        setAviso('');
        onCambiarConsultas([id]);
    }

    // Numero de filas que producira la distribucion
    const combinaciones = red.nodos
        .filter(nodo => consultas.includes(nodo.id))
        .reduce(
            (total, nodo) => total * nodo.estados.length,
            1
        );

    const textoEvidencias = evidencias.map(item => {
        const nodo = red.nodos.find(
            actual => actual.id === item.variable
        );

        return `${nodo?.nombre ?? item.variable}=${item.estado}`;
    }).join(', ');

    const expresion = textoEvidencias
        ? `P(${consultas.join(', ')} | ${evidencias.map(
            item => `${item.variable}=${item.estado}`
        ).join(', ')})`
        : `P(${consultas.join(', ')})`;

    return (
        <div className="editorConsultaConjunta">

            <fieldset className="ecc-grupo">
                <legend>Variables de consulta</legend>

                <p>
                    Elige una variable para consulta individual,
                    o varias para calcular una distribucion conjunta.
                </p>

                <div className="ecc-modos">
                    <button
                        type="button"
                        className={
                            modo === 'individual'
                                ? 'ecc-modo ecc-activo'
                                : 'ecc-modo'
                        }
                        aria-pressed={modo === 'individual'}
                        onClick={() => cambiarModo('individual')}
                    >
                        Individual
                    </button>

                    <button
                        type="button"
                        className={
                            modo === 'conjunta'
                                ? 'ecc-modo ecc-activo'
                                : 'ecc-modo'
                        }
                        aria-pressed={modo === 'conjunta'}
                        onClick={() => cambiarModo('conjunta')}
                    >
                        Conjunta
                    </button>
                </div>

                <p className="ecc-instruccion">
                    {modo === 'individual'
                        ? 'Selecciona la variable que deseas consultar.'
                        : 'Pulsa las variables para agregarlas o quitarlas.'}
                </p>

                <div className="ecc-variables">
                    {red.nodos.map(nodo => {
                        const seleccionada =
                            consultas.includes(nodo.id);

                        return (
                            <div
                                key={nodo.id}
                                className={
                                    seleccionada
                                        ? 'ecc-tarjeta ecc-seleccionada'
                                        : 'ecc-tarjeta'
                                }
                            >
                                <button
                                    type="button"
                                    className="ecc-variable"
                                    aria-pressed={seleccionada}
                                    onClick={() =>
                                        seleccionarVariable(nodo.id)
                                    }
                                >
                                    <span>
                                        {seleccionada ? '\u2713' : '+'}
                                    </span>

                                    {nodo.nombre} ({nodo.id})
                                </button>

                                <button
                                    type="button"
                                    className="ecc-solo"
                                    onClick={() =>
                                        seleccionarSoloEsta(nodo.id)
                                    }
                                    title="Consultar solo esta variable"
                                >
                                    Solo esta
                                </button>
                            </div>
                        );
                    })}
                </div>

                {aviso && (
                    <p className="ecc-aviso" role="alert">
                        {aviso}
                    </p>
                )}

            </fieldset>

            <div className="ecc-resumen">
                <h3>Consulta preparada</h3>

                <p>
                    <strong>Variables:</strong>{' '}
                    {consultas.join(', ')}
                </p>

                <p>
                    <strong>Evidencias:</strong>{' '}
                    {textoEvidencias || 'Ninguna'}
                </p>

                <p className="ecc-expresion">
                    {expresion}
                </p>

                <p>
                    Combinaciones posibles: {combinaciones}
                </p>

                {combinaciones > 32 && (
                    <p className="ecc-aviso">
                        Esta consulta producira una tabla extensa.
                    </p>
                )}

                <p className="ecc-instruccion">
                    Configura las evidencias en el panel
                    situado debajo de este selector.
                </p>
            </div>

        </div>
    );
}