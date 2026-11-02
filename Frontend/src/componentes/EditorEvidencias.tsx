import { useState } from 'react';

import type { RedBayes } from '../tipos/red';
import './EditorEvidencias.css';

type Propiedades = {
    red: RedBayes;
    consulta: string;

    evidencias: Record<string, string>;

    onCambiar: (
        evidencias: Record<string, string>
    ) => void;
};

export default function EditorEvidencias({
    red,
    consulta,
    evidencias,
    onCambiar
}: Propiedades) {

    const [
        variableSeleccionada,
        setVariableSeleccionada
    ] = useState('');

    const [
        estadoSeleccionado,
        setEstadoSeleccionado
    ] = useState('');

    // Excluir consulta y evidencias ya agregadas
    const disponibles = red.nodos.filter(nodo =>
        nodo.id !== consulta &&
        !Object.prototype.hasOwnProperty.call(
            evidencias,
            nodo.id
        )
    );

    // Obtener variable válida
    const idDisponible = disponibles.some(
        nodo => nodo.id === variableSeleccionada
    )
        ? variableSeleccionada
        : (disponibles[0]?.id ?? '');

    const nodoDisponible = disponibles.find(
        nodo => nodo.id === idDisponible
    );

    // Obtener estado válido para la variable
    const estadoDisponible =
        nodoDisponible?.estados.includes(
            estadoSeleccionado
        )
            ? estadoSeleccionado
            : (nodoDisponible?.estados[0] ?? '');

    // Agregar una nueva evidencia
    function agregarEvidencia() {

        if (!nodoDisponible || !estadoDisponible) {
            return;
        }

        onCambiar({
            ...evidencias,
            [nodoDisponible.id]: estadoDisponible
        });

        setVariableSeleccionada('');
        setEstadoSeleccionado('');
    }

    // Quitar evidencia existente
    function quitarEvidencia(id: string) {

        const siguientes = { ...evidencias };

        delete siguientes[id];

        onCambiar(siguientes);
    }

    return (
        <div className="editorEvidencias">

            <h3>Evidencias múltiples</h3>

            {Object.keys(evidencias).length === 0 ? (
                <p>
                    No hay evidencias agregadas
                    (consulta marginal).
                </p>
            ) : (

                <div className="listaEvidencias">

                    {Object.entries(evidencias).map(
                        ([id, estado]) => {

                            const nodo = red.nodos.find(
                                actual => actual.id === id
                            );

                            return (
                                <div
                                    className="filaEvidencia"
                                    key={id}
                                >
                                    <span>
                                        <strong>
                                            {nodo?.nombre ?? id}
                                        </strong>
                                        {' = '}
                                        {estado}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            quitarEvidencia(id)
                                        }
                                    >
                                        Quitar
                                    </button>
                                </div>
                            );
                        }
                    )}

                </div>
            )}

            <div className="controlesEvidencia">

                <label>
                    Variable de evidencia

                    <select
                        value={idDisponible}
                        disabled={
                            disponibles.length === 0
                        }
                        onChange={evento => {
                            setVariableSeleccionada(
                                evento.target.value
                            );

                            setEstadoSeleccionado('');
                        }}
                    >
                        {disponibles.length === 0 && (
                            <option value="">
                                Sin variables disponibles
                            </option>
                        )}

                        {disponibles.map(nodo => (
                            <option
                                key={nodo.id}
                                value={nodo.id}
                            >
                                {nodo.nombre}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Estado

                    <select
                        value={estadoDisponible}
                        disabled={!nodoDisponible}
                        onChange={evento => {
                            setEstadoSeleccionado(
                                evento.target.value
                            );
                        }}
                    >
                        {nodoDisponible?.estados.map(
                            estado => (
                                <option
                                    key={estado}
                                    value={estado}
                                >
                                    {estado}
                                </option>
                            )
                        )}
                    </select>
                </label>

                <button
                    type="button"
                    disabled={!nodoDisponible}
                    onClick={agregarEvidencia}
                >
                    + Añadir evidencia
                </button>

            </div>

            <p className="ayudaEvidencias">
                Puedes agregar varias variables observadas.
                La variable de consulta no se puede utilizar
                simultáneamente como evidencia.
            </p>

        </div>
    );
}