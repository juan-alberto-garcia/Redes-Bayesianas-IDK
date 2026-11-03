# Registro de pruebas — Redes Bayesianas IDK

**Materia:** Modelos Probabilistas  
**Equipo:** Juan Alberto, Edson, Obed y Paco  
**Fecha:** 3 de noviembre de 2026

## 1. Objetivo

Realizamos pruebas durante cada etapa para comprobar que la aplicación continuara funcionando después de incorporar nuevas herramientas.

Utilizamos compilaciones, pruebas automatizadas, consultas matemáticas y verificaciones manuales desde el navegador.

En este registro distinguimos los resultados obtenidos realmente de las comprobaciones que quedaron pendientes.

## 2. Resumen

| Área | Resultado |
|---|---|
| C01 — Docker | 4/4 |
| C02 — API y frontend | 6/6 |
| C03 — Editor gráfico | 12/12 |
| C04 — Consultas conjuntas | 9/9 |
| C05 — Estados y JSON | 9 funcionales y compilación |
| C06 — Ejemplos, historial y reportes | 19/19 |
| C07 — Infraestructura | 5/5 |
| C07 — API e inferencia | 5/5 |
| C07 — Regresiones de interfaz | 5/5 |
| C07 — Android | 9/9 |
| Backend — unittest | 32/32 |
| Reporte A4 | 10 páginas revisadas |

Estos totales se presentan por área; no los sumamos como si fueran pruebas totalmente distintas porque algunas corresponden a regresiones.

## 3. Pruebas de Docker

Comprobamos la configuración de Compose, la construcción de la imagen, el estado del contenedor y la respuesta del servidor.

El endpoint `/estado` devolvió:

```json
{
  "estado": "correcto",
  "aplicacion": "IDK"
}
```

**Resultado: 4/4.**

## 4. Comunicación frontend-backend

Realizamos pruebas con una red pequeña de tres nodos.

Comprobamos la conexión del navegador con FastAPI, la validación y la inferencia.

Resultados registrados:

- P(B=Sí)=0.6.
- P(A=Sí | B=Sí)=0.8.
- P(A=No | B=Sí)=0.2.

**Resultado: 6/6.**

## 5. Editor gráfico

Probamos estas operaciones:

1. Compilación.
2. Inicio de Vite.
3. Conexión con FastAPI.
4. Visualización de nodos.
5. Movimiento de nodos.
6. Creación de conexiones.
7. Rechazo de ciclos.
8. Eliminación de conexiones.
9. Edición de CPT.
10. Validación de redes.
11. Importación y exportación JSON.
12. Inferencia.

**Resultado: 12/12.**

## 6. Consultas conjuntas y evidencias

Realizamos pruebas con varias variables de consulta y con dos evidencias.

Una consulta conjunta produjo:

| B | C | Probabilidad |
|---|---|---:|
| Sí | Sí | 0.164 |
| Sí | No | 0.246 |
| No | Sí | 0.236 |
| No | No | 0.354 |

La distribución suma 1.

También registramos:

- P(A=Sí | B=Sí,C=No)=0.6585365854.
- P(A=No | B=Sí,C=No)=0.3414634146.
- P(B=Sí,C=No)=0.246.

**Resultado: 9/9.**

## 7. Estados y JSON

Durante C05 comprobamos:

- Edición de estados.
- Variables con tres estados.
- Reconstrucción de CPT.
- Rechazo de estados duplicados.
- Cancelación de cambios.
- Exportación JSON.
- Importación JSON.
- Rechazo de datos inválidos.
- Conservación de otras funcionalidades.

**Resultado: nueve pruebas funcionales y compilación aprobadas.**

## 8. Ejercicios del maestro

Cargamos, validamos y consultamos las cinco redes oficiales.

| Prueba | Ejercicio | Nodos | Estado |
|---|---|---:|---|
| C06-01 | Ciberseguridad | 3 | Aprobada |
| C06-02 | Mundial | 4 | Aprobada |
| C06-03 | Videojuegos | 5 | Aprobada |
| C06-04 | Ransomware | 6 | Aprobada |
| C06-05 | Octavos | 10 | Aprobada |

**Resultado: 5/5.**

## 9. Ejemplos de Obed

| Prueba | Ejemplo | Estado |
|---|---|---|
| C06-06 | Lluvia y Aspersor | Aprobada |
| C06-07 | Alarma de Terremoto y Robo | Aprobada |
| C06-08 | Diagnóstico Médico | Aprobada |
| C06-09 | Calidad de Software | Aprobada |
| C06-10 | Tráfico Urbano | Aprobada |
| C06-11 | Rendimiento Académico | Aprobada |
| C06-12 | Sistema Financiero | Aprobada |

**Resultado: 7/7.**

## 10. Historial y reportes

| Prueba | Operación | Estado |
|---|---|---|
| C06-13 | Guardar consultas | Aprobada |
| C06-14 | Conservar historial tras F5 | Aprobada |
| C06-15 | Recuperar consulta | Aprobada |
| C06-16 | Comparar resultados | Aprobada |
| C06-17 | Eliminar y vaciar historial | Aprobada |
| C06-18 | Imprimir reporte A4 | Aprobada |
| C06-19 | Regresión del catálogo | Aprobada |

**Resultado: 7/7.**

**Total C06: 19/19 pruebas funcionales aprobadas.**

## 11. Pruebas automatizadas del backend

Ejecutamos las pruebas desde `Backend` con el entorno virtual activado:

```powershell
python -m unittest discover -s pruebas -p "test_*.py" -v
```

La salida final fue:

```text
Ran 32 tests in 0.739s

OK
```

Las pruebas incluyeron:

- API.
- Modelos.
- Validación.
- Factores.
- Inferencia.
- Evidencias inválidas.
- Consultas inexistentes.
- Normalización.
- Detección de ciclos.
- Tablas incompletas.
- Consultas múltiples.

**Resultado: 32/32.**

En una ejecución anterior aparecieron cinco errores de importación porque utilizamos un Python sin las dependencias del entorno virtual. Repetimos la prueba con `.venv` activado y todas las pruebas aprobaron.

## 12. Compilación de frontend

Ejecutamos:

```powershell
npm --prefix .\Frontend run build
```

Resultado registrado:

- Vite 8.3.5.
- 194 módulos transformados.
- Compilación sin errores.
- Tiempo observado: 232 ms.

Después de corregir el reporte se realizó otra compilación satisfactoria.

## 13. Pruebas de API en C07

Probamos una red con una variable de tres estados.

Resultados:

| Estado | Probabilidad posterior |
|---|---:|
| Bajo | 0.0333333333 |
| Medio | 0.3000000000 |
| Alto | 0.6666666667 |

La suma es 1.

La probabilidad de evidencia registrada fue 0.36.

También comprobamos una consulta conjunta con P(A=Alto,B=Sí)=0.4 y rechazo de solicitudes inválidas mediante HTTP 422.

**Resultado: 5/5.**

## 14. Regresiones de interfaz C07

Comprobamos:

1. Agregar y conectar nodos.
2. Modificar estados y CPT.
3. Ejecutar consultas conjuntas.
4. Exportar e importar JSON.
5. Rechazar ciclos.

**Resultado: 5/5.**

## 15. Pruebas Android

Ejecutamos estas nueve comprobaciones:

| ID | Operación | Estado |
|---|---|---|
| M01 | Acceso y conexión FastAPI | Aprobada |
| M02 | Selector de doce redes | Aprobada |
| M03 | Zoom y desplazamiento del grafo | Aprobada |
| M04 | Estados y CPT | Aprobada |
| M05 | Consulta conjunta y evidencias | Aprobada |
| M06 | Importación y exportación JSON | Aprobada |
| M07 | Historial | Aprobada |
| M08 | Resultados y reporte | Aprobada |
| M09 | Adaptación visual | Aprobada |

**Resultado: 9/9.**

## 16. Reportes PDF

Probamos la generación de un reporte de diez nodos.

La primera versión produjo 152 páginas porque mostraba las tablas intermedias como JSON.

Después de modificar el componente de impresión obtuvimos una versión de once páginas.

Finalmente corregimos los caracteres especiales y revisamos un PDF de diez páginas.

En el reporte de prueba, la consulta P(Le) produjo:

| Estado | Probabilidad |
|---|---:|
| Le=1 | 0.20 |
| Le=0 | 0.80 |

La suma es 1.

El documento contiene grafo, CPT, consulta, resultados y procedimiento resumido.

**Resultado: reporte A4 aprobado.**

## 17. Referencias matemáticas de los cinco ejercicios

Realizamos cálculos independientes por enumeración utilizando las CPT de referencia.

| Ejercicio | Resultado |
|---|---:|
| Ciberseguridad | 83.74 % |
| Mundial | 43.80 % |
| Videojuegos | 56.16 % |
| Ransomware | 98.98 % |
| Octavos | 38.70 % |

Estas referencias se documentan para contrastarlas con las consultas correspondientes en IDK.

El verificador automático auxiliar no terminó su ejecución debido a errores al cargar herramientas de TypeScript. Por ello no registramos como aprobada una comparación automatizada final de esas cinco consultas contra FastAPI.

## 18. Pruebas pendientes

Identificamos dos comprobaciones que no debemos presentar como terminadas:

- Comparación automática final de las cinco consultas oficiales contra el backend.
- Verificación completa en GNU/Linux.

Estas pendientes no cambian los resultados de las pruebas que sí ejecutamos y registramos.

## 19. Conclusión

Las pruebas nos ayudaron a comprobar que el sistema conserva su funcionamiento al integrar componentes.

Verificamos el motor mediante pruebas automatizadas y realizamos comprobaciones manuales de editor, consultas, JSON, ejemplos, historial, reportes y Android.

El registro conserva tanto los resultados aprobados como las limitaciones y pruebas pendientes.