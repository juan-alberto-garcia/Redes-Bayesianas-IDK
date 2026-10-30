
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

    // Red editable
    const [redActual, setRedActual] = useState<RedBayes>(redEjemplo);

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


    // Agregar un nuevo nodo
    function agregarNodo() {

        // Limitar la red a 10 nodos
        if (redActual.nodos.length >= 10) {
            setError('La red no puede tener mas de 10 nodos');
            return;
        }

        // Buscar un identificador disponible
        let numero = 1;

        while (redActual.nodos.some(
            nodo => nodo.id === `N${numero}`
        )) {
            numero++;
        }

        const identificador = `N${numero}`;

        // Crear un nodo independiente
        const nuevoNodo: RedBayes['nodos'][number] = {
            id: identificador,
            nombre: `Nodo ${numero}`,
            estados: ['Si', 'No'],
            padres: [],
            tabla: [
                {
                    condiciones: {},
                    probabilidades: {
                        Si: 0.5,
                        No: 0.5
                    }
                }
            ],
            posicion: {
                x: 100 + (redActual.nodos.length % 3) * 220,
                y: 100 + Math.floor(redActual.nodos.length / 3) * 150
            }
        };

        // Actualizar la red
        setRedActual(redAnterior => ({
            ...redAnterior,
            nodos: [...redAnterior.nodos, nuevoNodo]
        }));

        // Limpiar resultados anteriores
        setResultado(null);
        setMensaje('');
        setError('');
    }


    // Cambiar el nombre de un nodo
    function renombrarNodo(id: string) {

        // Buscar el nodo seleccionado
        const nodoSeleccionado = redActual.nodos.find(
            nodo => nodo.id === id
        );

        if (!nodoSeleccionado) {
            return;
        }

        // Solicitar el nuevo nombre
        const nuevoNombre = window.prompt(
            'Nuevo nombre del nodo:',
            nodoSeleccionado.nombre
        );

        // Cancelar si se cierra la ventana
        if (nuevoNombre === null) {
            return;
        }

        // Comprobar que el nombre no este vacio
        if (!nuevoNombre.trim()) {
            setError('El nombre del nodo no puede estar vacio');
            return;
        }

        // Actualizar solamente el nodo seleccionado
        setRedActual(redAnterior => ({
            ...redAnterior,
            nodos: redAnterior.nodos.map(nodo =>
                nodo.id === id
                    ? { ...nodo, nombre: nuevoNombre.trim() }
                    : nodo
            )
        }));

        // Limpiar resultados anteriores
        setResultado(null);
        setMensaje('');
        setError('');
    }


    // Validar la red
    async function validar() {
        try {
            setError('');
            setMensaje('');

            const respuesta = await clienteApi.validar(redActual);

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

        // Preparar la evidencia
        const evidencia = variableEvidencia
            ? { [variableEvidencia]: estadoEvidencia }
            : {};

        try {
            const respuesta = await clienteApi.inferir(
                redActual,
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

            {/* Encabezado */}
            <header className="encabezado">
                <div>
                    <h1>Redes Bayesianas IDK</h1>
                    <p>Modelos probabilistas</p>
                </div>

                <span className="estado">
                    Backend: {conexion}
                </span>
            </header>


            {/* Panel de red bayesiana */}
            <section className="panel">

                <h2>Red bayesiana</h2>

                <p>{redActual.nombre}</p>

                <p>
                    Nodos: {redActual.nodos.length} / 10
                </p>

                {/* Mostrar nodos */}
                <div className="nodos">
                    {redActual.nodos.map(nodo => (
                        <div className="nodo" key={nodo.id}>

                            <strong>{nodo.nombre}</strong>

                            <small>ID: {nodo.id}</small>

                            <small>
                                Padres: {
                                    nodo.padres.join(', ') || 'Ninguno'
                                }
                            </small>

                            {/* Boton para cambiar el nombre */}
                            <button
                                type="button"
                                className="botonRenombrar"
                                onClick={() => renombrarNodo(nodo.id)}
                            >
                                Renombrar
                            </button>

                        </div>
                    ))}
                </div>


                {/* Acciones de la red */}
                <div className="accionesRed">

                    <button
                        type="button"
                        onClick={validar}
                    >
                        Validar red
                    </button>

                    <button
                        type="button"
                        onClick={agregarNodo}
                        disabled={redActual.nodos.length >= 10}
                    >
                        + Agregar nodo
                    </button>

                </div>


                {/* Mensajes de validacion */}
                {mensaje && (
                    <p className="exito">
                        {mensaje}
                    </p>
                )}

                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}

            </section>


            {/* Panel de consulta */}
            <section className="panel">

                <h2>Consulta probabilistica</h2>

                <div className="campos">

                    {/* Variable de consulta */}
                    <label>
                        Variable de consulta

                        <select
                            value={consulta}
                            onChange={evento =>
                                setConsulta(evento.target.value)
                            }
                        >
                            {redActual.nodos.map(nodo => (
                                <option
                                    key={nodo.id}
                                    value={nodo.id}
                                >
                                    {nodo.nombre}
                                </option>
                            ))}
                        </select>
                    </label>


                    {/* Variable de evidencia */}
                    <label>
                        Variable de evidencia

                        <select
                            value={variableEvidencia}
                            onChange={evento => {
                                setVariableEvidencia(evento.target.value);
                                setEstadoEvidencia('Si');
                            }}
                        >
                            <option value="">
                                Sin evidencia
                            </option>

                            {redActual.nodos.map(nodo => (
                                <option
                                    key={nodo.id}
                                    value={nodo.id}
                                >
                                    {nodo.nombre}
                                </option>
                            ))}
                        </select>
                    </label>


                    {/* Estado de evidencia */}
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


                {/* Ejecutar consulta */}
                <button
                    type="button"
                    onClick={calcular}
                    disabled={cargando}
                >
                    {cargando
                        ? 'Calculando...'
                        : 'Calcular probabilidades'}
                </button>

            </section>


            {/* Panel de resultados */}
            {resultado && (
                <section className="panel">

                    <h2>Resultados de inferencia</h2>

                    {resultado.distribucion.map((fila, indice) => (
                        <div
                            className="filaResultado"
                            key={indice}
                        >

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
