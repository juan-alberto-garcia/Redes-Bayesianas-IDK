import { useCallback, useEffect, useMemo, useState } from 'react';

import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    MarkerType,
    Position,
    useNodesState,
    type Node,
    type Edge,
    type NodeChange,
    type OnConnect,
    type OnNodeDrag
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import type { RedBayes } from '../tipos/red';
import './GrafoBayesiano.css';

type Posicion = {
    x: number;
    y: number;
};

type Movimiento = {
    id: string;
    posicion: Posicion;
};

type Propiedades = {
    red: RedBayes;
    onConectar: (idPadre: string, idHijo: string) => void;
    onDesconectar: (idPadre: string, idHijo: string) => void;
    onMoverNodos: (movimientos: Movimiento[]) => void;
};

// Convertir el modelo de IDK a nodos visuales
function convertirNodos(
    red: RedBayes,
    seleccionado: string | null
): Node[] {
    return red.nodos.map((nodo, indice) => ({
        id: nodo.id,
        type: 'default',

        position: nodo.posicion ?? {
            x: 100 + indice * 170,
            y: 150
        },

        sourcePosition: Position.Right,
        targetPosition: Position.Left,

        selected: nodo.id === seleccionado,

        data: {
            label: `${nodo.nombre} (${nodo.id})`
        }
    }));
}

// Editor grafico de redes bayesianas
export default function GrafoBayesiano({
    red,
    onConectar,
    onDesconectar,
    onMoverNodos
}: Propiedades) {

    const [seleccionado, setSeleccionado] =
        useState<string | null>(null);

    const [
        nodos,
        setNodos,
        manejarCambiosNodos
    ] = useNodesState<Node>(
        convertirNodos(red, null)
    );

    // Sincronizar con los datos guardados en App
    useEffect(() => {
        setNodos(
            convertirNodos(red, seleccionado)
        );
    }, [red.nodos, seleccionado, setNodos]);

    // Cada padre genera una flecha hacia su hijo
    const conexiones = useMemo<Edge[]>(() =>
        red.nodos.flatMap(nodo =>
            nodo.padres.map(idPadre => ({
                id: `conexion-${idPadre}-${nodo.id}`,
                source: idPadre,
                target: nodo.id,
                type: 'bezier',

                style: {
                    stroke: '#e11d48',
                    strokeWidth: 2
                },

                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: '#e11d48'
                }
            }))
        ),
        [red.nodos]
    );

    // Crear conexiones usando la logica de IDK
    const manejarConexion: OnConnect = useCallback(
        conexion => {
            if (conexion.source && conexion.target) {
                onConectar(
                    conexion.source,
                    conexion.target
                );
            }
        },
        [onConectar]
    );

    // Guardar la posicion final del nodo
    const terminarMovimiento: OnNodeDrag<Node> = useCallback(
        (_evento, nodo) => {
            onMoverNodos([
                {
                    id: nodo.id,
                    posicion: {
                        x: nodo.position.x,
                        y: nodo.position.y
                    }
                }
            ]);
        },
        [onMoverNodos]
    );

    return (
        <section className="panel panelGrafo">

            <h2>Editor grafico</h2>

            <p>
                Arrastra los nodos para moverlos.
                Conecta la salida derecha con la
                entrada izquierda de otro nodo.
                Haz clic en una flecha para quitarla.
            </p>

            <div className="lienzoGrafo">

                <ReactFlow
                    nodes={nodos}
                    edges={conexiones}

                    onNodesChange={(
                        cambios: NodeChange<Node>[]
                    ) => {
                        manejarCambiosNodos(
                            cambios.filter(
                                cambio =>
                                    cambio.type !== 'remove'
                            )
                        );
                    }}

                    onNodeDragStop={terminarMovimiento}
                    onConnect={manejarConexion}

                    onNodeClick={(_evento, nodo) => {
                        setSeleccionado(nodo.id);
                    }}

                    onPaneClick={() => {
                        setSeleccionado(null);
                    }}

                    onEdgeClick={(_evento, conexion) => {
                        onDesconectar(
                            conexion.source,
                            conexion.target
                        );
                    }}

                    fitView
                    minZoom={0.3}
                    maxZoom={2}
                    colorMode="dark"
                    deleteKeyCode={null}
                >

                    <Background
                        gap={18}
                        size={1}
                    />

                    <Controls
                        showInteractive={false}
                    />

                    <MiniMap
                        pannable
                        zoomable
                    />

                </ReactFlow>

            </div>

            {seleccionado && (
                <p className="detalleNodoGrafo">
                    Nodo seleccionado:{' '}

                    <strong>
                        {
                            red.nodos.find(
                                nodo => nodo.id === seleccionado
                            )?.nombre
                        }
                    </strong>
                </p>
            )}

        </section>
    );
}