import React, { useState } from 'react';
import type { RedBayesiana } from '../tipos/red';
import { redesEjemplo } from '../ejemplos/redesEjemplo';
import { redesM } from '../ejemplos/redesM';
import './SelectorEjemplos.css';

interface Props {
  onSeleccionarRed: (red: RedBayesiana) => void;
}

export const SelectorEjemplos: React.FC<Props> = ({ onSeleccionarRed }) => {
  const todasLasRedes = [...redesEjemplo, ...redesM];
  const [redSeleccionadaId, setRedSeleccionadaId] = useState<string>(todasLasRedes[0].id);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setRedSeleccionadaId(id);
    const red = todasLasRedes.find((r) => r.id === id);
    if (red) onSeleccionarRed(red);
  };

  const handleButtonClick = (red: RedBayesiana) => {
    setRedSeleccionadaId(red.id);
    onSeleccionarRed(red);
  };

  return (
    <div className="selector-ejemplos-card">
      <div className="selector-header">
        <h3 className="selector-title">Cargar Red de Ejemplo</h3>
        <select 
          value={redSeleccionadaId} 
          onChange={handleSelectChange}
          className="selector-dropdown"
        >
          <optgroup label="Ejemplos Clásicos">
            {redesEjemplo.map((red) => (
              <option key={red.id} value={red.id}>{red.nombre}</option>
            ))}
          </optgroup>
          <optgroup label="Ejercicios del Maestro">
            {redesM.map((red) => (
              <option key={red.id} value={red.id}>{red.nombre}</option>
            ))}
          </optgroup>
        </select>
      </div>

      <div className="selector-buttons-container">
        {todasLasRedes.map((red) => (
          <button
            key={red.id}
            onClick={() => handleButtonClick(red)}
            className={`selector-btn ${redSeleccionadaId === red.id ? 'active' : ''}`}
          >
            {red.nombre}
          </button>
        ))}
      </div>
    </div>
  );
};