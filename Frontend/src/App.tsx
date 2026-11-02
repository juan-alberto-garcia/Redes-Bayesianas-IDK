
import { useEffect, useState } from 'react';

import { clienteApi } from './servicios/clienteApi';
import EditorCpt from './componentes/EditorCpt';
import GrafoBayesiano from './componentes/GrafoBayesiano';
import EditorEvidencias from './componentes/EditorEvidencias';

import type {
    RedBayes,
    NodoBayes,
    FilaProbabilidad,
    RespuestaInferencia
} from './tipos/red';

import './App.css';

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

type Movimiento = {
    id: string;
    posicion: {
        x: number;
        y: number;
    };
};

function existeCamino(
    origen: string,
    destino: string,
    nodos: NodoBayes[]
): boolean {

    const pendientes = [origen];
    const visitados = new Set<string>();

    while (pendientes.length > 0) {

        const actual = pendientes.pop();

        if (!actual || visitados.has(actual)) {
            continue;
        }

        if (actual === destino) {
            return true;
        }

        visitados.add(actual);

        for (const nodo of nodos) {
            if (nodo.padres.includes(actual)) {
                pendientes.push(nodo.id);
            }
        }
    }

    return false;
}

function construirTabla(
    hijo: NodoBayes,
    padresNuevos: string[],
    nodos: NodoBayes[]
): FilaProbabilidad[] {

    let combinaciones: Record<string, string>[] = [{}];

    for (const idPadre of padresNuevos) {

        const padre = nodos.find(
            nodo => nodo.id === idPadre
        );

        if (!padre) {
            throw new Error(
                `No existe el nodo padre ${idPadre}`
            );
        }

        combinaciones = combinaciones.flatMap(
            condiciones =>
                padre.estados.map(estado => ({
                    ...condiciones,
                    [idPadre]: estado
                }))
        );
    }

    const probabilidadInicial = 1 / hijo.estados.length;

    return combinaciones.map(condiciones => ({
        condiciones,
        probabilidades: Object.fromEntries(
            hijo.estados.map(estado => [
                estado,
                probabilidadInicial
            ])
        )
    }));
}

function App() {

    const [redActual, setRedActual] =
        useState<RedBayes>(redEjemplo);

    const [seleccionado, setSeleccionado] =
        useState<string | null>(null);

    const [padresSeleccionados, setPadresSeleccionados] =
        useState<Record<string, string>>({});

    const [conexion, setConexion] =
        useState('Comprobando...');

    const [consulta, setConsulta] =
        useState('A');

    const [evidencias, setEvidencias] =
        useState<Record<string, string>>({});

    const [resultado, setResultado] =
        useState<RespuestaInferencia | null>(null);

    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    useEffect(() => {

        clienteApi.estado()
            .then(datos => setConexion(datos.estado))
            .catch(() => setConexion('Desconectado'));

    }, []);

    function limpiarResultados() {
        setResultado(null);
        setMensaje('');
        setError('');
    }

    function agregarNodo() {

        if (redActual.nodos.length >= 10) {
            setError('La red no puede superar los 10 nodos');
            setMensaje('');
            return;
        }

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
            posicion: {
                x: 100 + (redActual.nodos.length % 3) * 220,
                y: 100 + Math.floor(
                    redActual.nodos.length / 3
                ) * 150
            },
            tabla: [
                {
                    condiciones: {},
                    probabilidades: {
                        Si: 0.5,
                        No: 0.5
                    }
                }
            ]
        };

        setRedActual(anterior => ({
            ...anterior,
            nodos: [
                ...anterior.nodos,
                nuevoNodo
            ]
        }));

        setSeleccionado(nuevoNodo.id);
        limpiarResultados();
    }

    function renombrarNodo(id: string) {

        const nodo = redActual.nodos.find(
            actual => actual.id === id
        );

        if (!nodo) {
            return;
        }

        const nombre = window.prompt(
            'Nuevo nombre del nodo:',
            nodo.nombre
        );

        if (nombre === null) {
            return;
        }

        if (!nombre.trim()) {
            setError('El nombre no puede estar vacío');
            setMensaje('');
            return;
        }

        setRedActual(anterior => ({
            ...anterior,
            nodos: anterior.nodos.map(actual =>
                actual.id === id
                    ? {
                        ...actual,
                        nombre: nombre.trim()
                    }
                    : actual
            )
        }));

        limpiarResultados();
    }

    function eliminarNodo(id: string) {

        if (redActual.nodos.length <= 3) {
            setMensaje('');
            setError(
                'La red debe conservar al menos 3 nodos'
            );
            return;
        }

        const restantes = redActual.nodos.filter(
            nodo => nodo.id !== id
        );

        const tieneHijos = restantes.some(
            nodo => nodo.padres.includes(id)
        );

        const aviso = tieneHijos
            ? 'Se eliminarán las relaciones del nodo y se reiniciarán las CPT de sus hijos. ¿Continuar?'
            : '¿Eliminar este nodo de la red?';

        if (!window.confirm(aviso)) {
            return;
        }

        const actualizados = restantes.map(nodo => {

            if (!nodo.padres.includes(id)) {
                return nodo;
            }

            const padres = nodo.padres.filter(
                padre => padre !== id
            );

            return {
                ...nodo,
                padres,
                tabla: construirTabla(
                    nodo,
                    padres,
                    restantes
                )
            };
        });

        setRedActual(anterior => ({
            ...anterior,
            nodos: actualizados
        }));

        setSeleccionado(actual =>
            actual === id ? null : actual
        );

        if (consulta === id) {
            setConsulta(actualizados[0].id);
        }

        setEvidencias(anterior => {

            const siguientes = { ...anterior };
            delete siguientes[id];

            return siguientes;
        });

        setPadresSeleccionados(anterior => {

            const siguientes = { ...anterior };
            delete siguientes[id];

            for (const idHijo of Object.keys(siguientes)) {
                if (siguientes[idHijo] === id) {
                    siguientes[idHijo] = '';
                }
            }

            return siguientes;
        });

        limpiarResultados();
    }

    function agregarRelacion(
        idPadre: string,
        idHijo: string
    ) {

        const padre = redActual.nodos.find(
            nodo => nodo.id === idPadre
        );

        const hijo = redActual.nodos.find(
            nodo => nodo.id === idHijo
        );

        if (!padre || !hijo) {
            setError('Selecciona nodos válidos');
            setMensaje('');
            return;
        }

        if (idPadre === idHijo) {
            setError(
                'Un nodo no puede ser su propio padre'
            );
            setMensaje('');
            return;
        }

        if (hijo.padres.includes(idPadre)) {
            setError('La relación ya existe');
            setMensaje('');
            return;
        }

        if (
            existeCamino(
                idHijo,
                idPadre,
                redActual.nodos
            )
        ) {
            setError(
                'La relación produciría un ciclo dirigido'
            );
            setMensaje('');
            return;
        }

        const confirmar = window.confirm(
            'Se reiniciará la tabla CPT del nodo hijo. ¿Continuar?'
        );

        if (!confirmar) {
            return;
        }

        const padresNuevos = [
            ...hijo.padres,
            idPadre
        ];

        const tablaNueva = construirTabla(
            hijo,
            padresNuevos,
            redActual.nodos
        );

        setRedActual(anterior => ({
            ...anterior,
            nodos: anterior.nodos.map(nodo =>
                nodo.id === idHijo
                    ? {
                        ...nodo,
                        padres: padresNuevos,
                        tabla: tablaNueva
                    }
                    : nodo
            )
        }));

        setPadresSeleccionados(anterior => ({
            ...anterior,
            [idHijo]: ''
        }));

        limpiarResultados();
    }

    function quitarRelacion(
        idPadre: string,
        idHijo: string
    ) {

        const hijo = redActual.nodos.find(
            nodo => nodo.id === idHijo
        );

        if (!hijo || !hijo.padres.includes(idPadre)) {
            return;
        }

        const confirmar = window.confirm(
            'Se eliminará la relación y se reiniciará la CPT del hijo. ¿Continuar?'
        );

        if (!confirmar) {
            return;
        }

        const padresNuevos = hijo.padres.filter(
            padre => padre !== idPadre
        );

        const tablaNueva = construirTabla(
            hijo,
            padresNuevos,
            redActual.nodos
        );

        setRedActual(anterior => ({
            ...anterior,
            nodos: anterior.nodos.map(nodo =>
                nodo.id === idHijo
                    ? {
                        ...nodo,
                        padres: padresNuevos,
                        tabla: tablaNueva
                    }
                    : nodo
            )
        }));

        limpiarResultados();
    }

    function moverNodos(movimientos: Movimiento[]) {

        if (movimientos.length === 0) {
            return;
        }

        const posiciones = new Map(
            movimientos.map(movimiento => [
                movimiento.id,
                movimiento.posicion
            ])
        );

        setRedActual(anterior => {

            let huboCambios = false;

            const nodos = anterior.nodos.map(nodo => {

                const posicion = posiciones.get(nodo.id);

                if (!posicion) {
                    return nodo;
                }

                if (
                    nodo.posicion?.x === posicion.x &&
                    nodo.posicion?.y === posicion.y
                ) {
                    return nodo;
                }

                huboCambios = true;

                return {
                    ...nodo,
                    posicion
                };
            });

            if (!huboCambios) {
                return anterior;
            }

            return {
                ...anterior,
                nodos
            };
        });
    }

    function guardarCpt(
        idNodo: string,
        tablaNueva: FilaProbabilidad[]
    ) {

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

    function actualizarEvidencias(
        nuevas: Record<string, string>
    ) {

        const validas = Object.fromEntries(
            Object.entries(nuevas).filter(
                ([id, estado]) =>
                    id !== consulta &&
                    redActual.nodos.some(nodo =>
                        nodo.id === id &&
                        nodo.estados.includes(estado)
                    )
            )
        );

        setEvidencias(validas);
        limpiarResultados();
    }

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
                    : 'Error de validación'
            );
        }
    }

    async function calcular() {

        if (
            Object.prototype.hasOwnProperty.call(
                evidencias,
                consulta
            )
        ) {
            setError(
                'La variable de consulta no puede ser evidencia simultáneamente'
            );
            return;
        }

        setCargando(true);
        setError('');
        setResultado(null);

        try {

            const respuesta =
                await clienteApi.inferir(
                    redActual,
                    [consulta],
                    evidencias,
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

                <p>{redActual.nombre}</p>

                <p>
                    Nodos: {redActual.nodos.length} / 10
                </p>

                <div className="nodos">

                    {redActual.nodos.map(nodo => (

                        <div
                            className="nodo"
                            key={nodo.id}
                        >

                            <strong>{nodo.nombre}</strong>

                            <small>
                                ID: {nodo.id}
                            </small>

                            <small>
                                Estados: {
                                    nodo.estados.join(', ')
                                }
                            </small>

                            <small>
                                Padres: {
                                    nodo.padres.join(', ') ||
                                    'Ninguno'
                                }
                            </small>

                            <div className="listaPadres">

                                {nodo.padres.map(idPadre => (

                                    <button
                                        key={idPadre}
                                        type="button"
                                        className="botonPadre"
                                        title="Quitar relación"
                                        onClick={() =>
                                            quitarRelacion(
                                                idPadre,
                                                nodo.id
                                            )
                                        }
                                    >
                                        {idPadre} ×
                                    </button>

                                ))}

                            </div>

                            <div className="configuracionPadres">

                                <label>

                                    Agregar padre

                                    <select
                                        value={
                                            padresSeleccionados[nodo.id] || ''
                                        }
                                        onChange={evento =>
                                            setPadresSeleccionados(
                                                anterior => ({
                                                    ...anterior,
                                                    [nodo.id]:
                                                        evento.target.value
                                                })
                                            )
                                        }
                                    >

                                        <option value="">
                                            Seleccionar
                                        </option>

                                        {redActual.nodos
                                            .filter(posiblePadre =>
                                                posiblePadre.id !== nodo.id &&
                                                !nodo.padres.includes(
                                                    posiblePadre.id
                                                )
                                            )
                                            .map(posiblePadre => (

                                                <option
                                                    key={posiblePadre.id}
                                                    value={posiblePadre.id}
                                                >
                                                    {posiblePadre.nombre}
                                                </option>

                                            ))}

                                    </select>

                                </label>

                                <button
                                    type="button"
                                    className="botonSecundario"
                                    disabled={
                                        !padresSeleccionados[nodo.id]
                                    }
                                    onClick={() =>
                                        agregarRelacion(
                                            padresSeleccionados[nodo.id],
                                            nodo.id
                                        )
                                    }
                                >
                                    Conectar
                                </button>

                            </div>

                            <button
                                type="button"
                                className="botonRenombrar"
                                onClick={() =>
                                    renombrarNodo(nodo.id)
                                }
                            >
                                Renombrar
                            </button>

                            <button
                                type="button"
                                className="botonEliminar"
                                onClick={() =>
                                    eliminarNodo(nodo.id)
                                }
                            >
                                Eliminar
                            </button>

                        </div>

                    ))}

                </div>

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
                        disabled={
                            redActual.nodos.length >= 10
                        }
                    >
                        + Agregar nodo
                    </button>

                </div>

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

            <GrafoBayesiano
                red={redActual}
                seleccionado={seleccionado}
                onSeleccionar={setSeleccionado}
                onConectar={agregarRelacion}
                onDesconectar={quitarRelacion}
                onMoverNodos={moverNodos}
            />

            <EditorCpt
                red={redActual}
                onGuardar={guardarCpt}
            />

            <section className="panel">

                <h2>Consulta probabilística</h2>

                <div className="campos">

                    <label>

                        Variable de consulta

                        <select
                            value={consulta}
                            onChange={evento => {

                                const id = evento.target.value;

                                setConsulta(id);

                                setEvidencias(anterior => {

                                    const siguientes = {
                                        ...anterior
                                    };

                                    delete siguientes[id];

                                    return siguientes;
                                });

                                limpiarResultados();
                            }}
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

                </div>

                <EditorEvidencias
                    red={redActual}
                    consulta={consulta}
                    evidencias={evidencias}
                    onCambiar={actualizarEvidencias}
                />

                <button
                    type="button"
                    onClick={calcular}
                    disabled={cargando}
                >
                    {
                        cargando
                            ? 'Calculando...'
                            : 'Calcular probabilidades'
                    }
                </button>

            </section>

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
