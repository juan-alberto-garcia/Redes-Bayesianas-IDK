Las pruebas ejecutadas hasta el momento finalizaron correctamente.

| Prueba | Resultado |
|---|---|
| Validación de red correcta | Correcta |
| Eliminación de variables | Correcta |
| Comparación con enumeración exhaustiva | Coinciden |
| Consulta sin evidencia | Correcta |
| Consulta con A = a2 | Correcta |
| Consulta con variable oculta C = c1 | Correcta |
| Probabilidades incorrectas | Detectadas |
| CPT incompleta | Detectada |
| Ciclos | Detectados |
| Consulta inexistente | Rechazada |
| Evidencia inválida | Rechazada |
| Evidencia imposible en inferencia | Rechazada |
| Evidencia imposible en enumeración | Rechazada |
| Padres duplicados | Detectados |

- Eliminación de variables: b1 = 0.7, b2 = 0.3.
- Enumeración exhaustiva: b1 = 0.7, b2 = 0.3.

- b1 = 0.5.
- b2 = 0.5.

- b1 = 0.2.
- b2 = 0.8.

- Eliminación de variables: b1 = 0.5857142857, b2 = 0.4142857143.
- Enumeración exhaustiva: b1 = 0.5857142857, b2 = 0.4142857143.

La diferencia entre ambos métodos en los resultados comprobados es menor que 0.000001.

El verificador detectó correctamente:

- Probabilidades fuera del intervalo permitido.
- Tablas CPT incompletas.
- Redes con ciclos.
- Padres duplicados.
- Consultas inexistentes.
- Estados de evidencia inválidos.
- Evidencias cuya probabilidad es cero.

La enumeración exhaustiva también muestra un mensaje descriptivo cuando la evidencia tiene probabilidad cero.

- Se admiten varias variables de evidencia.
- Actualmente se consulta una sola variable a la vez.
- La comparación con las cinco redes oficiales de IDK (3, 4, 5, 6 y 10 nodos) está pendiente.

Las pruebas ejecutadas muestran que el verificador realiza correctamente las operaciones matemáticas comprobadas y detecta los errores incluidos en los casos de prueba.

La comparación con los resultados de la aplicación principal todavía debe realizarse para completar la validación independiente.
