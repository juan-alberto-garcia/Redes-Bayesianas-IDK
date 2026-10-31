El verificador independiente es un módulo desarrollado en Python para comprobar los resultados de operaciones probabilísticas realizadas sobre redes bayesianas.

Funciona como una implementación matemática separada de la aplicación principal IDK. Su objetivo es comparar resultados y ayudar a detectar posibles errores en los cálculos.

Comprobar de manera independiente los resultados obtenidos mediante el método de eliminación de variables y contrastarlos con el método de enumeración exhaustiva.

| Archivo | Función |
|---|---|
| `__init__.py` | Identifica la carpeta como un paquete de Python. |
| `modelos.py` | Define los nodos y las redes bayesianas. |
| `factores.py` | Implementa las operaciones con factores probabilísticos. |
| `inferencia.py` | Realiza inferencias mediante eliminación de variables. |
| `enumeracion.py` | Calcula probabilidades mediante enumeración exhaustiva. |
| `validacion.py` | Comprueba la estructura y las probabilidades de la red. |
| `pruebas_motor.py` | Ejecuta las pruebas del verificador. |
| `RESULTADOS_PRUEBAS.md` | Documenta los resultados obtenidos. |

- Validar redes bayesianas.
- Comprobar las tablas de probabilidad condicional (CPT).
- Detectar probabilidades incorrectas.
- Detectar ciclos en la red.
- Detectar padres duplicados.
- Realizar consultas probabilísticas.
- Aplicar eliminación de variables.
- Comparar resultados mediante enumeración exhaustiva.
- Detectar consultas inexistentes.
- Rechazar estados de evidencia inválidos o evidencias de probabilidad cero.

Desde la carpeta principal del repositorio, ejecutar:

```powershell
python -m verificador_independiente.pruebas_motor
```

El programa ejecuta las pruebas y muestra los resultados en la terminal.

1. Validación de una red correcta.
2. Comparación entre eliminación de variables y enumeración exhaustiva.
3. Consulta sin evidencia.
4. Consulta con evidencia.
5. Consulta con variable oculta.
6. Detección de probabilidades incorrectas.
7. Detección de tablas CPT incompletas.
8. Detección de ciclos.
9. Detección de consultas inexistentes.
10. Detección de evidencia inválida.
11. Detección de evidencia imposible en ambos métodos.
12. Detección de padres duplicados.

- Se pueden utilizar varias variables como evidencia en una consulta.
- Actualmente se consulta una sola variable a la vez.
- La comparación con las cinco redes oficiales de la aplicación IDK está pendiente de realizarse.

En las pruebas matemáticas realizadas, los resultados de eliminación de variables coincidieron con los de enumeración exhaustiva.

También se comprobó que el verificador detecta los errores de estructura y evidencia incluidos en las pruebas.

Los detalles numéricos se encuentran en `RESULTADOS_PRUEBAS.md`.

El verificador se mantiene separado de los módulos de la aplicación principal, ubicados en `servidor/aplicacion`.

Esta separación permite conservar dos implementaciones independientes y facilitar la comparación de resultados. El verificador no reemplaza el motor matemático de la aplicación principal.

Los cambios de este módulo se realizaron en la rama:

`feat/motor-matematico`

La incorporación del verificador está pendiente de revisión e integración mediante un Pull Request dirigido a la rama `main`.
