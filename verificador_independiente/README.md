El verificador independiente es un módulo desarrollado en Python para comprobar los resultados de operaciones probabilísticas realizadas sobre redes bayesianas.

Su propósito es funcionar como una implementación matemática separada de la aplicación principal, permitiendo comparar resultados y detectar posibles errores en los cálculos.

Comprobar de manera independiente los resultados obtenidos mediante el método de eliminación de variables y contrastarlos con el método de enumeración exhaustiva.

La carpeta contiene los siguientes módulos:

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
- Detectar ciclos en la red.
- Realizar consultas probabilísticas.
- Aplicar eliminación de variables.
- Comparar resultados mediante enumeración exhaustiva.
- Detectar consultas y evidencias inválidas.

Desde la carpeta principal del repositorio, ejecutar:

```powershell
python -m verificador_independiente.pruebas_motor
```

El programa ejecuta las pruebas y muestra los resultados en la terminal.

Se probaron los siguientes casos:

1. Validación de una red correcta.
2. Comparación entre eliminación de variables y enumeración exhaustiva.
3. Consulta sin evidencia.
4. Consulta con evidencia.
5. Detección de probabilidades incorrectas.
6. Detección de tablas CPT incompletas.
7. Detección de ciclos.
8. Detección de consultas inexistentes.
9. Detección de evidencia inválida.
10. Detección de evidencia imposible.

Las pruebas se ejecutaron correctamente después de reorganizar los archivos en esta carpeta.

Los resultados de eliminación de variables coincidieron con los de enumeración exhaustiva en los casos comprobados.

Los detalles numéricos se encuentran en `RESULTADOS_PRUEBAS.md`.

El verificador se mantiene separado de los módulos de la aplicación principal, ubicados en `servidor/aplicacion`.

Esta separación permite conservar dos implementaciones independientes y facilitar la comparación de resultados.

La incorporación del verificador a un flujo automático de comparación con la aplicación principal queda sujeta a la integración y revisión del equipo.

Los cambios de este módulo se realizaron en la rama:

`feat/motor-matematico`

Los cambios de este módulo se realizaron en la rama:

`feat/motor-matematico`

La implementación se publicó en GitHub mediante commits.
Está pendiente su revisión e integración mediante un Pull Request
dirigido a la rama `main`.