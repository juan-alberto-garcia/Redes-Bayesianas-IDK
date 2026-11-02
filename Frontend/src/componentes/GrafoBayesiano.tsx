import { useCallback, useEffect, useMemo } from 'react';

import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    MarkerType,
    Position,
    useNodesState,
    type Edge,
    type Node,
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
    seleccionado: string | null;

    onSeleccionar: (id: string | null) => void;

    onConectar: (
        idPadre: string,
        idHijo: string
    ) => void;

    onDesconectar: (
        idPadre: string,
        idHijo: string
    ) => void;

    onMoverNodos: (
        movimientos: Movimiento[]
    ) => void;
};

// Convertir los nodos de IDK al formato React Flow
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

        targetPosition: Position.Left,
        sourcePosition: Position.Right,

        selected: nodo.id === seleccionado,

        data: {
            label: `${nodo.nombre} (${nodo.id})`
        }
    }));
}

export default function GrafoBayesiano({
    red,
    seleccionado,
    onSeleccionar,
    onConectar,
    onDesconectar,
    onMoverNodos
}: Propiedades) {

    const [
        nodos,
        setNodos,
        manejarCambiosNodos
    ] = useNodesState<Node>(
        convertirNodos(red, seleccionado)
    );

    // Sincronizar nodos con la red bayesiana
    useEffect(() => {

        setNodos(actuales => {

            const anteriores = new Map(
                actuales.map(nodo => [
                    nodo.id,
                    nodo
                ])
            );

            return convertirNodos(
                red,
                seleccionado
            ).map(nodo => {

                const anterior = anteriores.get(nodo.id);

                if (!anterior) {
                    return nodo;
                }

                return {
                    ...anterior,
                    ...nodo
                };
            });
        });

    }, [red.nodos, seleccionado, setNodos]);

    // Construir conexiones desde los padres reales
    const conexiones = useMemo<Edge[]>(() => {

        return red.nodos.flatMap(nodo =>
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
        );

    }, [red.nodos]);

    // Solicitar conexión a App
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

    // Guardar posición al terminar el movimiento
    const terminarMovimiento: OnNodeDrag<Node> =
        useCallback((_evento, nodo) => {

            onMoverNodos([
                {
                    id: nodo.id,
                    posicion: {
                        x: nodo.position.x,
                        y: nodo.position.y
                    }
                }
            ]);

        }, [onMoverNodos]);

    return (
        <section className="panel panelGrafo">

            <h2>Editor gráfico</h2>

            <p>
                Arrastra los nodos para moverlos.
                Conecta la salida derecha con la entrada
                izquierda de otro nodo.
                Haz clic en una flecha para eliminarla.
            </p>

            <div className="lienzoGrafo">

                <ReactFlow
                    nodes={nodos}
                    edges={conexiones}

                    onNodesChange={(
                        cambios: NodeChange<Node>[]
                    ) => {

                        // Evitar eliminaciones solo visuales
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
                        onSeleccionar(nodo.id);
                    }}

                    onPaneClick={() => {
                        onSeleccionar(null);
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

                    // La eliminación se controla desde App
                    deleteKeyCode={null}
                >
                    <Background gap={18} size={1} />

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
                        {red.nodos.find(
                            nodo => nodo.id === seleccionado
                        )?.nombre}
                    </strong>
                </p>
            )}

        </section>
    );
}