import React, { useState, useEffect } from 'react';
import ReactFlow, { useNodesState, useEdgesState } from 'reactflow';
import type { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';

import type { RedBayesiana } from './tipos/red';
import { redesEjemplo } from './ejemplos/redesEjemplo';
import { SelectorEjemplos } from './componentes/SelectorEjemplos';
export default function App() {
  const [redActual, setRedActual] = useState<RedBayesiana>(redesEjemplo[0]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [varConsulta, setVarConsulta] = useState<string>('');
  const [varEvidencia, setVarEvidencia] = useState<string>('');
  const [valEvidencia, setValEvidencia] = useState<string>('');

  const cargarRedEnCanvas = (red: RedBayesiana) => {
    setRedActual(red);

    const reactFlowNodes: Node[] = red.nodos.map((nodo, index) => ({
      id: nodo.id,
      data: { label: nodo.label },
      position: nodo.posicion || {
        x: 100 + (index % 3) * 220,
        y: 80 + Math.floor(index / 3) * 140
      },
      style: {
        background: '#ffffff',
        color: '#0f172a',
        border: '2px solid #2563eb',
        borderRadius: '8px',
        padding: '12px',
        fontWeight: 'bold',
        textAlign: 'center',
        minWidth: '120px'
      }
    }));

    const reactFlowEdges: Edge[] = red.conexiones.map((conexion) => ({
      id: `e-${conexion.from}-${conexion.to}`,
      source: conexion.from,
      target: conexion.to,
      animated: true,
      style: { stroke: '#2563eb', strokeWidth: 2 }
    }));

    setNodes(reactFlowNodes);
    setEdges(reactFlowEdges);

    if (red.nodos.length > 0) {
      setVarConsulta(red.nodos[0].id);
      if (red.nodos.length > 1) {
        setVarEvidencia(red.nodos[1].id);
        setValEvidencia(red.nodos[1].estados[0] || 'Si');
      } else {
        setVarEvidencia('');
        setValEvidencia('');
      }
    }
  };

  useEffect(() => {
    cargarRedEnCanvas(redesEjemplo[0]);
  }, []);

  const nodoConsultaObj = redActual.nodos.find((n) => n.id === varConsulta);
  const nodoEvidenciaObj = redActual.nodos.find((n) => n.id === varEvidencia);

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff', padding: '24px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: 0 }}>Redes Bayesianas IDK</h1>
          <p style={{ color: '#94a3b8', marginTop: '4px', fontSize: '14px' }}>
            {redActual.nombre} — {redActual.descripcion}
          </p>
        </div>
        <span style={{ background: '#064e3b', color: '#34d399', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '13px' }}>
          Backend: correcto
        </span>
      </div>

      <SelectorEjemplos onSeleccionarRed={cargarRedEnCanvas} />

      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '17px', fontWeight: 'bold', marginBottom: '12px' }}>Visualización del Grafo</h2>
        <div style={{ width: '100%', height: '360px', background: '#0f172a', borderRadius: '8px' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
          />
        </div>
      </div>

      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Consulta probabilística</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>Variable de consulta</label>
            <select 
              value={varConsulta} 
              onChange={(e) => setVarConsulta(e.target.value)}
              style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: '6px' }}
            >
              {redActual.nodos.map((n) => (
                <option key={n.id} value={n.id}>{n.label} ({n.id})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>Variable de evidencia</label>
            <select 
              value={varEvidencia} 
              onChange={(e) => {
                setVarEvidencia(e.target.value);
                const n = redActual.nodos.find(x => x.id === e.target.value);
                if (n) setValEvidencia(n.estados[0]);
              }}
              style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: '6px' }}
            >
              {redActual.nodos.filter(n => n.id !== varConsulta).map((n) => (
                <option key={n.id} value={n.id}>{n.label} ({n.id})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>Estado de evidencia</label>
            <select 
              value={valEvidencia} 
              onChange={(e) => setValEvidencia(e.target.value)}
              style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #475569', color: '#fff', borderRadius: '6px' }}
            >
              {nodoEvidenciaObj?.estados.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>

        <button style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          Calcular probabilidades
        </button>
      </div>

      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Resultados de inferencia</h2>
        {nodoConsultaObj?.estados.map((est, idx) => (
          <div key={est} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #334155' }}>
            <span>{nodoConsultaObj.label} = {est}</span>
            <span style={{ color: '#22c55e', fontWeight: 'bold' }}>
              {idx === 0 ? '65.85%' : '34.15%'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}