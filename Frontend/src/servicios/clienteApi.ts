
import type {
  RedBayes,
  RespuestaInferencia
} from '../tipos/red';

// Las solicitudes se envian al servidor de Vite
const baseApi = '';

// Funcion general para comunicarse con FastAPI
async function solicitar<T>(
  ruta: string,
  opciones?: RequestInit
): Promise<T> {

  let respuesta: Response;

  try {
    respuesta = await fetch(
      `${baseApi}${ruta}`,
      {
        ...opciones,
        headers: {
          'Content-Type': 'application/json',
          ...opciones?.headers
        }
      }
    );
  } catch {
    throw new Error(
      'No se pudo conectar con el servidor'
    );
  }

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    const detalle =
      datos.detail ?? 'Error del servidor';

    throw new Error(
      typeof detalle === 'string'
        ? detalle
        : JSON.stringify(detalle)
    );
  }

  return datos as T;
}

// Servicios que utiliza el frontend
export const clienteApi = {

  // Consultar el estado de FastAPI
  estado: () =>
    solicitar<{
      estado: string;
      aplicacion: string;
    }>('/estado'),

  // Validar la estructura de una red bayesiana
  validar: (red: RedBayes) =>
    solicitar<{
      valida: boolean;
      mensaje: string;
    }>('/api/validar', {
      method: 'POST',
      body: JSON.stringify(red)
    }),

  // Realizar inferencia con eliminacion de variables
  inferir: (
    red: RedBayes,
    variablesConsulta: string[],
    evidencia: Record<string, string>,
    mostrarPasos: boolean
  ) =>
    solicitar<RespuestaInferencia>(
      '/api/inferir',
      {
        method: 'POST',
        body: JSON.stringify({
          red,
          variables_consulta: variablesConsulta,
          evidencia,
          mostrar_pasos: mostrarPasos
        })
      }
    )
};
