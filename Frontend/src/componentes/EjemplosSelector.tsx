import React from 'react';
import ejemplos from '../data/ejemplos.json';

interface EjemplosSelectorProps {
  onLoadExample: (ejemplo: any) => void;
}

export const EjemplosSelector: React.FC<EjemplosSelectorProps> = ({ onLoadExample }) => {
  return (
    <div style={{ padding: '15px', background: '#1e293b', borderRadius: '8px', marginBottom: '15px', color: '#fff' }}>
      <h3 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Cargar Red de Ejemplo</h3>
      <div style={{ display: 'flex', gap: '10px' }}>
        {Object.keys(ejemplos).map((key) => {
          const ej = (ejemplos as any)[key];
          return (
            <button
              key={key}
              onClick={() => onLoadExample(ej)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {ej.nombre}
            </button>
          );
        })}
      </div>
    </div>
  );
};