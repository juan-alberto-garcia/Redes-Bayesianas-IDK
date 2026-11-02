import { useEffect, useCallback } from 'react';
import ReactFlow, { 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  addEdge 
} from 'reactflow';
import 'reactflow/dist/style.css';
import type { RedBayes } from '../tipos/red';

interface EditorRedProps {
  red: RedBayes;
  onActualizarNombreNodo: (idNodo: string, nuevoNombre: string) => void;
}

export default function EditorRed({ red, onActualizarNombreNodo }: EditorRedProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const nuevosNodos = red.nodos.map((nodo, index) => ({
      id: nodo.id,
      position: nodo.posicion ? { x: nodo.posicion.x, y: nodo.posicion.y } : { x: 100 + (index * 150), y: 150 },
      data: { 
        label: (
          <div style={{ padding: '5px' }}>
            <input
              type="text"
              value={nodo.nombre}
              onChange={(e) => onActualizarNombreNodo(nodo.id, e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                fontWeight: 'bold',
                textAlign: 'center',
                width: '100%',
                outline: 'none',
                cursor: 'text'
              }}
            />
          </div>
        ) 
      },
    }));

    const nuevasAristas: any[] = [];
    red.nodos.forEach((nodo) => {
      nodo.padres.forEach((idPadre) => {
        nuevasAristas.push({
          id: `${idPadre}-${nodo.id}`,
          source: idPadre,
          target: nodo.id,
        });
      });
    });

    setNodes(nuevosNodos);
    setEdges(nuevasAristas);
  }, [red, setNodes, setEdges, onActualizarNombreNodo]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div style={{ width: '100%', height: '500px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background gap={16} size={1} />
      </ReactFlow>
    </div>
  );
}