import { useEffect, useState } from 'react';
import { clienteApi } from './servicios/clienteApi';
import EditorCpt from './componentes/EditorCpt';
import EditorRed from './componentes/EditorRed';
import 'reactflow/dist/style.css';

import type {
    RedBayes,
    NodoBayes,
    FilaProbabilidad,
    RespuestaInferencia
} from './tipos/red';

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
                    probabilidades: {
                        Si: 0.3,
                        No: 0.7
                    }
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
                    probabilidades: {
                        Si: 0.9,
                        No: 0.1
                    }
                },
                {
                    condiciones: { A: 'No' },
                    probabilidades: {
                        Si: 0.2,
                        No: 0.8
                    }
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
                    probabilidades: {
                        Si: 0.4,
                        No: 0.6
                    }
                }
            ]
        }
    ]
};


// Comprobar si existe un camino dirigido
function existeCamino(
    origen: string,
    destino: string,
    nodos: NodoBayes[]
): boolean {

    const pendientes = [origen];
    const visitados = new Set<string>();

    while (pendientes.length > 0) {

        const actual = pendientes.pop();

        if (!actual) {
            continue;
        }

        if (actual === destino) {
            return true;
        }

        if (visitados.has(actual)) {
            continue;
        }

        visitados.add(actual);

        // Buscar los hijos del nodo actual
        for (const nodo of nodos) {
            if (nodo.padres.includes(actual)) {
                pendientes.push(nodo.id);
            }
        }
    }

    return false;
}


// Construir la tabla cuando cambian los padres
function construirTabla(
    nodoHijo: NodoBayes,
    padresNuevos: string[],
    nodos: NodoBayes[]
): FilaProbabilidad[] {

    let combinaciones: Record<string, string>[] = [{}];

    // Generar combinaciones de estados
    for (const idPadre of padresNuevos) {

        const padre = nodos.find(
            nodo => nodo.id === idPadre
        );

        if (!padre) {
            throw new Error('No se encontro el nodo padre');
        }

        combinaciones = combinaciones.flatMap(
            condiciones =>
                padre.estados.map(estado => ({
                    ...condiciones,
                    [idPadre]: estado
                }))
        );
    }

    // Probabilidad uniforme inicial
    const probabilidadInicial =
        1 / nodoHijo.estados.length;

    return combinaciones.map(condiciones => ({
        condiciones,
        probabilidades: Object.fromEntries(
            nodoHijo.estados.map(estado => [
                estado,
                probabilidadInicial
            ])
        )
    }));
}


function App() {

    // Red editable
    const [redActual, setRedActual] =
        useState<RedBayes>(redEjemplo);

    // Estado del servidor
    const [conexion, setConexion] =
        useState('Comprobando...');

    // Consulta y múltiples evidencias (reemplazando los estados anteriores)
    const [consulta, setConsulta] = useState('A');
    const [evidencias, setEvidencias] = useState<Record<string, string>>({});

    // Padres seleccionados para cada nodo
    const [padresSeleccionados, setPadresSeleccionados] =
        useState<Record<string, string>>({});

    // Resultados
    const [resultado, setResultado] =
        useState<RespuestaInferencia | null>(null);

    // Mensajes
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);


    // Comprobar conexion con FastAPI
    useEffect(() => {

        clienteApi.estado()
            .then(datos => setConexion(datos.estado))
            .catch(() => setConexion('Desconectado'));

    }, []);


    // Limpiar resultados anteriores
    function limpiarResultados() {
        setResultado(null);
        setMensaje('');
        setError('');
    }


    // Función para actualizar el nombre de un nodo desde el editor gráfico
    const actualizarNombreNodo = (idNodo: string, nuevoNombre: string) => {
        setRedActual((prevRed) => ({
            ...prevRed,
            nodos: prevRed.nodos.map((nodo) => 
                nodo.id === idNodo ? { ...nodo, nombre: nuevoNombre } : nodo
            )
        }));
        limpiarResultados();
    };


    // Agregar un nodo
    function agregarNodo() {

        // Limitar la red a 10 nodos
        if (redActual.nodos.length >= 10) {
            setMensaje('');
            setError('La red no puede superar los 10 nodos');
            return;
        }

        // Buscar un identificador disponible
        let numero = 1;

        while (
            redActual.nodos.some(
                nodo => nodo.id === `N${numero}`
            )
        ) {
            numero++;
        }

        const nuevoNodo: NodoBayes = {
            id: `N${numero}`,
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
                x: 100 +
                    (redActual.nodos.length % 3) * 220,
                y: 100 +
                    Math.floor(
                        redActual.nodos.length / 3
                    ) * 150
            }
        };

        // Actualizar la red
        setRedActual(anterior => ({
            ...anterior,
            nodos: [
                ...anterior.nodos,
                nuevoNodo
            ]
        }));

        limpiarResultados();
    }


    // Cambiar el nombre de un nodo (método alternativo por prompt)
    function renombrarNodo(id: string) {

        const nodoSeleccionado = redActual.nodos.find(
            nodo => nodo.id === id
        );

        if (!nodoSeleccionado) {
            return;
        }

        const nuevoNombre = window.prompt(
            'Nuevo nombre del nodo:',
            nodoSeleccionado.nombre
        );

        if (nuevoNombre === null) {
            return;
        }

        if (!nuevoNombre.trim()) {
            setMensaje('');
            setError('El nombre no puede estar vacio');
            return;
        }

        // Actualizar solo el nodo seleccionado
        setRedActual(anterior => ({
            ...anterior,
            nodos: anterior.nodos.map(nodo =>
                nodo.id === id
                    ? {
                        ...nodo,
                        nombre: nuevoNombre.trim()
                    }
                    : nodo
            )
        }));

        limpiarResultados();
    }


    // Eliminar un nodo
    function eliminarNodo(id: string) {

        // Conservar minimo 3 nodos
        if (redActual.nodos.length <= 3) {
            setMensaje('');
            setError(
                'La red debe conservar al menos 3 nodos'
            );
            return;
        }

        // Comprobar si tiene hijos
        const hijos = redActual.nodos.filter(
            nodo => nodo.padres.includes(id)
        );

        if (hijos.length > 0) {
            setMensaje('');
            setError(
                'Primero debes quitar las relaciones de este nodo'
            );
            return;
        }

        const confirmar = window.confirm(
            '¿Eliminar este nodo de la red?'
        );

        if (!confirmar) {
            return;
        }

        const nodosRestantes = redActual.nodos.filter(
            nodo => nodo.id !== id
        );

        // Actualizar la red
        setRedActual(anterior => ({
            ...anterior,
            nodos: nodosRestantes
        }));

        // Actualizar variable de consulta
        if (consulta === id) {
            setConsulta(nodosRestantes[0].id);
        }

        // Limpiar evidencia si el nodo eliminado formaba parte de ella
        if (evidencias[id]) {
            const nuevasEvidencias = { ...evidencias };
            delete nuevasEvidencias[id];
            setEvidencias(nuevasEvidencias);
        }

        limpiarResultados();
    }


    // Guardar una tabla CPT editada
    function guardarCpt(
        idNodo: string,
        tablaNueva: FilaProbabilidad[]
    ) {

        // Actualizar las probabilidades del nodo
        setRedActual(anterior => ({
            ...anterior,
            nodos: anterior.nodos.map(nodo =>
                nodo.id === idNodo
                    ? {
                        ...nodo,
                        tabla: tablaNueva
                    }
                    : nodo
            )
        }));

        limpiarResultados();
    }


    // Validar la red bayesiana
    async function validar() {

        setError('');
        setMensaje('');

        try {

            const respuesta =
                await clienteApi.validar(redActual);

            setMensaje(respuesta.mensaje);

        } catch (problema) {

            setError(
                problema instanceof Error
                    ? problema.message
                    : 'Error de validacion'
            );
        }
    }


    // Ejecutar inferencia con múltiples evidencias
    async function calcular() {

        setCargando(true);
        setError('');
        setResultado(null);

        try {

            const respuesta = await clienteApi.inferir(
                redActual,
                [consulta],   // Variable(s) de consulta
                evidencias,   // Objeto con múltiples evidencias (ej. { B: 'Si', C: 'No' })
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


                {/* EDITOR GRÁFICO CON REACT FLOW */}
                <div style={{ width: '100%', height: '500px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '1rem' }}>
                    <EditorRed 
                        red={redActual} 
                        onActualizarNombreNodo={actualizarNombreNodo} 
                    />
                </div>


                {/* Acciones de la red */}
                <div className="accionesRed" style={{ marginTop: '1rem' }}>
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


                {/* Mensajes de la red */}
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


            {/* Editor de tablas CPT */}
            <EditorCpt
                red={redActual}
                onGuardar={guardarCpt}
            />


            {/* Panel de consulta probabilistica */}
            <section className="panel">

                <h2>Consulta probabilística</h2>

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


                    {/* SECCIÓN DE MÚLTIPLES EVIDENCIAS */}
                    <div style={{ gridColumn: '1 / -1', marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                        <h3>Evidencias múltiples</h3>

                        {/* Listado dinámico de evidencias agregadas */}
                        {Object.entries(evidencias).length === 0 ? (
                            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>No hay evidencias agregadas (consulta marginal).</p>
                        ) : (
                            <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {Object.entries(evidencias).map(([idNodo, estado]) => {
                                    const nodoObj = redActual.nodos.find(n => n.id === idNodo);
                                    return (
                                        <div key={idNodo} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9f9f9', padding: '6px 12px', borderRadius: '6px', border: '1px solid #ddd' }}>
                                            <span><strong>{nodoObj?.nombre || idNodo}</strong> = {estado}</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const nuevasEvidencias = { ...evidencias };
                                                    delete nuevasEvidencias[idNodo];
                                                    setEvidencias(nuevasEvidencias);
                                                    limpiarResultados();
                                                }}
                                                style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                Quitar
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Controles para añadir una nueva evidencia */}
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                            <select id="selectNuevaEvidencia" defaultValue="" style={{ flex: 1, minWidth: '150px' }}>
                                <option value="" disabled>Seleccionar variable...</option>
                                {redActual.nodos
                                    .filter(nodo => !evidencias[nodo.id] && consulta !== nodo.id)
                                    .map(nodo => (
                                        <option key={nodo.id} value={nodo.id}>
                                            {nodo.nombre}
                                        </option>
                                    ))
                                }
                            </select>

                            <select id="selectEstadoEvidencia" defaultValue="Si" style={{ width: '100px' }}>
                                <option value="Si">Si</option>
                                <option value="No">No</option>
                            </select>

                            <button
                                type="button"
                                onClick={() => {
                                    const selectNodo = document.getElementById('selectNuevaEvidencia') as HTMLSelectElement;
                                    const selectEstado = document.getElementById('selectEstadoEvidencia') as HTMLSelectElement;

                                    if (selectNodo && selectNodo.value) {
                                        setEvidencias({
                                            ...evidencias,
                                            [selectNodo.value]: selectEstado.value
                                        });
                                        selectNodo.value = "";
                                        limpiarResultados();
                                    }
                                }}
                            >
                                + Añadir evidencia
                            </button>
                        </div>
                    </div>

                </div>


                {/* Ejecutar consulta */}
                <button
                    type="button"
                    onClick={calcular}
                    disabled={cargando}
                    style={{ marginTop: '1.5rem' }}
                >
                    {
                        cargando
                            ? 'Calculando...'
                            : 'Calcular probabilidades'
                    }
                </button>

            </section>


            {/* Resultados de inferencia */}
            {resultado && (

                <section className="panel">

                    <h2>Resultados de inferencia</h2>

                    {resultado.distribucion.map(
                        (fila, indice) => (

                            <div
                                className="filaResultado"
                                key={indice}
                            >

                                <span>
                                    {
                                        Object.entries(
                                            fila.asignacion
                                        )
                                            .map(
                                                ([variable, estado]) =>
                                                    `${variable} = ${estado}`
                                            )
                                            .join(', ')
                                    }
                                </span>

                                <strong>
                                    {
                                        (
                                            fila.probabilidad * 100
                                        ).toFixed(2)
                                    }%
                                </strong>

                            </div>

                        )
                    )}

                    <p>
                        Probabilidad de evidencia:{' '}
                        {
                            resultado
                                .probabilidad_evidencia
                                .toFixed(6)
                        }
                    </p>

                </section>

            )}

        </main>
    );
}

export default App;
