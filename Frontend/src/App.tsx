
import { useEffect, useState } from 'react';
import { clienteApi } from './servicios/clienteApi';
import type { RedBayes, RespuestaInferencia } from './tipos/red';
import './App.css';


// Red de prueba
const redEjemplo: RedBayes = {
    nombre: 'Red de prueba IDK',
    formato: 1,
    nodos: [
        {
            id: 'A',
            nombre: 'Lluvia',
            estados: ['Si', 'No'],
            padres: [],
            posicion: { x: 100, y: 100 },
            tabla: [
                {
                    condiciones: {},
                    probabilidades: { Si: 0.3, No: 0.7 }
                }
            ]
        },
        {
            id: 'B',
            nombre: 'Cesped mojado',
            estados: ['Si', 'No'],
            padres: ['A'],
            posicion: { x: 350, y: 100 },
            tabla: [
                {
                    condiciones: { A: 'Si' },
                    probabilidades: { Si: 0.9, No: 0.1 }
                },
                {
                    condiciones: { A: 'No' },
                    probabilidades: { Si: 0.2, No: 0.8 }
                }
            ]
        },
        {
            id: 'C',
            nombre: 'Trafico',
            estados: ['Si', 'No'],
            padres: [],
            posicion: { x: 100, y: 300 },
            tabla: [
                {
                    condiciones: {},
                    probabilidades: { Si: 0.4, No: 0.6 }
                }
            ]
        }
    ]
};


function App() {

    // Estado del servidor
    const [conexion, setConexion] = useState('Comprobando...');

    // Datos de consulta
    const [consulta, setConsulta] = useState('A');
    const [variableEvidencia, setVariableEvidencia] = useState('B');
    const [estadoEvidencia, setEstadoEvidencia] = useState('Si');

    // Resultados
    const [resultado, setResultado] =
        useState<RespuestaInferencia | null>(null);

    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);


    // Comprobar conexion al iniciar
    useEffect(() => {
        clienteApi.estado()
            .then(datos => setConexion(datos.estado))
            .catch(() => setConexion('Desconectado'));
    }, []);


    // Validar la red
    async function validar() {
        try {
            setError('');
            const respuesta = await clienteApi.validar(redEjemplo);
            setMensaje(respuesta.mensaje);
        } catch (problema) {
            setError(
                problema instanceof Error
                    ? problema.message
                    : 'Error de validacion'
            );
        }
    }


    // Ejecutar eliminacion de variables
    async function calcular() {
        setCargando(true);
        setError('');
        setResultado(null);

        const evidencia = variableEvidencia
            ? { [variableEvidencia]: estadoEvidencia }
            : {};

        try {
            const respuesta = await clienteApi.inferir(
                redEjemplo,
                [consulta],
                evidencia,
                false
            );

            setResultado(respuesta);
        } catch (problema) {
            setError(
                problema instanceof Error
                    ? problema.message
                    : 'Error de inferencia'
            );
        } finally {
            setCargando(false);
        }
    }


    return (
        <main className="aplicacion">

            <header className="encabezado">
                <div>
                    <h1>Redes Bayesianas IDK</h1>
                    <p>Modelos probabilistas</p>
                </div>

                <span className="estado">
                    Backend: {conexion}
                </span>
            </header>

            <section className="panel">
                <h2>Red bayesiana</h2>
                <p>{redEjemplo.nombre}</p>

                <div className="nodos">
                    {redEjemplo.nodos.map(nodo => (
                        <div className="nodo" key={nodo.id}>
                            <strong>{nodo.nombre}</strong>
                            <small>ID: {nodo.id}</small>
                            <small>
                                Padres: {
                                    nodo.padres.join(', ') || 'Ninguno'
                                }
                            </small>
                        </div>
                    ))}
                </div>

                <button onClick={validar}>
                    Validar red
                </button>

                {mensaje && <p className="exito">{mensaje}</p>}
            </section>

            <section className="panel">
                <h2>Consulta probabilistica</h2>

                <div className="campos">
                    <label>
                        Variable de consulta
                        <select
                            value={consulta}
                            onChange={evento =>
                                setConsulta(evento.target.value)
                            }
                        >
                            {redEjemplo.nodos.map(nodo => (
                                <option key={nodo.id} value={nodo.id}>
                                    {nodo.nombre}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Variable de evidencia
                        <select
                            value={variableEvidencia}
                            onChange={evento => {
                                setVariableEvidencia(evento.target.value);
                                setEstadoEvidencia('Si');
                            }}
                        >
                            <option value="">Sin evidencia</option>
                            {redEjemplo.nodos.map(nodo => (
                                <option key={nodo.id} value={nodo.id}>
                                    {nodo.nombre}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Estado de evidencia
                        <select
                            value={estadoEvidencia}
                            disabled={!variableEvidencia}
                            onChange={evento =>
                                setEstadoEvidencia(evento.target.value)
                            }
                        >
                            <option value="Si">Si</option>
                            <option value="No">No</option>
                        </select>
                    </label>
                </div>

                <button onClick={calcular} disabled={cargando}>
                    {cargando ? 'Calculando...' : 'Calcular probabilidades'}
                </button>

                {error && <p className="error">{error}</p>}
            </section>

            {resultado && (
                <section className="panel">
                    <h2>Resultados de inferencia</h2>

                    {resultado.distribucion.map((fila, indice) => (
                        <div className="filaResultado" key={indice}>
                            <span>
                                {Object.entries(fila.asignacion)
                                    .map(([variable, estado]) =>
                                        `${variable} = ${estado}`
                                    ).join(', ')}
                            </span>

                            <strong>
                                {(fila.probabilidad * 100).toFixed(2)}%
                            </strong>
                        </div>
                    ))}

                    <p>
                        Probabilidad de evidencia:{' '}
                        {resultado.probabilidad_evidencia.toFixed(6)}
                    </p>
                </section>
            )}

        </main>
    );
}

export default App;
