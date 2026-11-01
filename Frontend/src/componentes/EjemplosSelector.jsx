import React from 'react';
import ejemplos from '../data/ejemplos.json';

export const EjemplosSelector = ({ onLoadExample }) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg my-4">
      <h3 className="font-bold text-lg mb-2 text-gray-800">Cargar Red de Ejemplo</h3>
      <div className="flex gap-3">
        {Object.keys(ejemplos).map((key) => (
          <button
            key={key}
            onClick={() => onLoadExample(ejemplos[key])}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
          >
            {ejemplos[key].nombre}
          </button>
        ))}
      </div>
    </div>
  );
};