// Resume los pasos reales del motor para imprimirlos sin datos JSON extensos.

type Registro = Record<string, unknown>;

type FilaFactor = {
    asignacion: Record<string, string>;
    valor: number;
};

type Factor = {
    variables: string[];
    filas: FilaFactor[];
};

type Propiedades = {
    pasos: Registro[];
    orden: string[];
};

const MAX_FILAS = 6;

// Leer estructuras del backend sin suponer que todas las etapas tienen los mismos campos.
function comoRegistro(valor: unknown): Registro | null {
    return valor !== null && typeof valor === 'object' && !Array.isArray(valor)
        ? valor as Registro
        : null;
}

function comoTexto(valor: unknown, alternativo = ''): string {
    return typeof valor === 'string' ? valor : alternativo;
}

function comoFactor(valor: unknown): Factor | null {
    const objeto = comoRegistro(valor);
    if (!objeto || !Array.isArray(objeto.variables) || !Array.isArray(objeto.filas)) {
        return null;
    }

    if (!objeto.variables.every(variable => typeof variable === 'string')) {
        return null;
    }

    const filas: FilaFactor[] = [];
    for (const entrada of objeto.filas) {
        const fila = comoRegistro(entrada);
        const asignacion = comoRegistro(fila?.asignacion);
        if (!fila || !asignacion || typeof fila.valor !== 'number') {
            return null;
        }
        if (!Object.values(asignacion).every(estado => typeof estado === 'string')) {
            return null;
        }
        filas.push({
            asignacion: asignacion as Record<string, string>,
            valor: fila.valor
        });
    }

    return { variables: objeto.variables as string[], filas };
}

function comoFactores(valor: unknown): Factor[] {
    if (!Array.isArray(valor)) return [];
    return valor.map(comoFactor).filter((factor): factor is Factor => factor !== null);
}

function listaVariables(factor: Factor): string {
    return factor.variables.join(', ') || 'Factor constante';
}

// Mostrar cantidades y variables de todos los factores sin omitir ninguno.
function ResumenFactores({ factores, titulo }: { factores: Factor[]; titulo: string }) {
    if (factores.length === 0) return null;

    return (
        <div className="ri-resumenFactores">
            <h4>{titulo}</h4>
            <table className="ri-tabla ri-tablaResumen">
                <thead>
                    <tr><th>Factor</th><th>Variables</th><th>Filas</th></tr>
                </thead>
                <tbody>
                    {factores.map((factor, indice) => (
                        <tr key={indice}>
                            <td>{indice + 1}</td>
                            <td>{listaVariables(factor)}</td>
                            <td>{factor.filas.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Imprimir una muestra identificada de filas y conservar la cantidad total.
function TablaFactorReducida({ factor, titulo }: { factor: Factor | null; titulo: string }) {
    if (!factor) return null;
    const filas = factor.filas.slice(0, MAX_FILAS);
    const restantes = factor.filas.length - filas.length;

    return (
        <div className="ri-factorReducido">
            <h4>{titulo}</h4>
            <p>
                <strong>Variables:</strong> {listaVariables(factor)}.{' '}
                <strong>Total de filas:</strong> {factor.filas.length}.
            </p>
            <table className="ri-tabla ri-tablaResumen">
                <thead>
                    <tr>
                        {factor.variables.map(variable => <th key={variable}>{variable}</th>)}
                        <th>Valor</th>
                    </tr>
                </thead>
                <tbody>
                    {filas.map((fila, indice) => (
                        <tr key={indice}>
                            {factor.variables.map(variable => (
                                <td key={variable}>{fila.asignacion[variable] ?? '—'}</td>
                            ))}
                            <td>{fila.valor.toFixed(8)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {restantes > 0 && (
                <p className="ri-avisoFilas">
                    Se muestran las primeras {filas.length} de {factor.filas.length} filas.{' '}
                    Las {restantes} filas restantes no se incluyen en esta versión resumida.
                </p>
            )}
        </div>
    );
}

// Mostrar las etapas reales devueltas por FastAPI mediante resúmenes verificables.
export default function ProcedimientoResumenImpresion({ pasos, orden }: Propiedades) {
    if (pasos.length === 0) {
        return <p>Esta consulta no incluye pasos de inferencia. Ejecuta nuevamente la consulta.</p>;
    }

    return (
        <div className="ri-resumenPasos">
            <p>
                <strong>Orden de eliminación:</strong>{' '}
                {orden.join(' → ') || 'Sin variables ocultas'}
            </p>
            <p className="ri-notaResumen">
                Se presenta un resumen fiel de las etapas. Los factores grandes muestran una
                muestra de filas, sin cambiar las probabilidades ni el cálculo del backend.
            </p>

            {pasos.map((paso, indice) => {
                const etapa = comoTexto(paso.etapa, 'desconocida');
                const factores = comoFactores(paso.factores);
                const factoresUsados = comoFactores(paso.factoresUsados);
                const factoresRestantes = comoFactores(paso.factoresRestantes);
                const producto = comoFactor(paso.producto);
                const resultado = comoFactor(paso.resultado);
                const variable = comoTexto(paso.variable);

                return (
                    <section className="ri-pasoResumen" key={indice}>
                        {etapa === 'inicializacion' && (
                            <>
                                <h3>Paso {indice + 1}. Crear factores</h3>
                                <p>Se generaron {factores.length} factores desde las CPT.</p>
                                <ResumenFactores factores={factores} titulo="Factores iniciales" />
                            </>
                        )}

                        {etapa === 'evidencia' && (
                            <>
                                <h3>Paso {indice + 1}. Aplicar evidencia</h3>
                                <p>
                                    <strong>Evidencias:</strong>{' '}
                                    {Object.entries(comoRegistro(paso.evidencia) ?? {})
                                        .map(([clave, estado]) => `${clave}=${String(estado)}`)
                                        .join(', ') || 'Ninguna'}
                                </p>
                                <ResumenFactores factores={factores} titulo="Factores resultantes" />
                            </>
                        )}

                        {etapa === 'orden' && (
                            <>
                                <h3>Paso {indice + 1}. Elegir variables ocultas</h3>
                                <p>
                                    {Array.isArray(paso.variablesOcultas)
                                        ? paso.variablesOcultas.join(', ') || 'Ninguna'
                                        : 'No especificadas'}
                                </p>
                            </>
                        )}

                        {etapa === 'eliminacion' && (
                            <>
                                <h3>Paso {indice + 1}. Eliminar {variable}</h3>
                                <p>
                                    Se multiplican los factores que contienen {variable} y
                                    después se suman sus valores sobre esa variable.
                                </p>
                                <ResumenFactores factores={factoresUsados} titulo="Factores utilizados" />
                                {producto && (
                                    <p>
                                        <strong>Producto:</strong> {listaVariables(producto)}
                                        {' · '}{producto.filas.length} filas.
                                    </p>
                                )}
                                <TablaFactorReducida
                                    factor={resultado}
                                    titulo={`Factor después de eliminar ${variable}`}
                                />
                            </>
                        )}

                        {etapa === 'producto_final' && (
                            <>
                                <h3>Paso {indice + 1}. Multiplicar los factores restantes</h3>
                                <ResumenFactores factores={factoresRestantes} titulo="Factores restantes" />
                                <TablaFactorReducida
                                    factor={resultado}
                                    titulo="Factor conjunto sin normalizar"
                                />
                            </>
                        )}

                        {etapa === 'normalizacion' && (
                            <>
                                <h3>Paso {indice + 1}. Normalizar la distribución</h3>
                                {typeof paso.probabilidadEvidencia === 'number' && (
                                    <p>
                                        <strong>Probabilidad de evidencia:</strong>{' '}
                                        {paso.probabilidadEvidencia.toFixed(8)}
                                    </p>
                                )}
                                <TablaFactorReducida
                                    factor={comoFactor(paso.factor)}
                                    titulo="Factor normalizado"
                                />
                            </>
                        )}

                        {!['inicializacion', 'evidencia', 'orden', 'eliminacion',
                            'producto_final', 'normalizacion'].includes(etapa) && (
                            <>
                                <h3>Paso {indice + 1}. Etapa {etapa}</h3>
                                <p>La etapa existe en el backend, pero no tiene un resumen visual definido.</p>
                            </>
                        )}
                    </section>
                );
            })}
        </div>
    );
}