# Contribuciones del equipo — Redes Bayesianas IDK

**Materia:** Modelos Probabilistas  
**Fecha:** 3 de noviembre de 2026

## 1. Organización del equipo

Desarrollamos Redes Bayesianas IDK mediante diferentes tareas de programación, integración, revisión y pruebas.

Cada integrante participó en actividades específicas. Durante el desarrollo utilizamos GitHub para compartir avances y conservar el historial de los cambios realizados.

En este documento explicamos qué aportó cada integrante y cómo reunimos sus trabajos.

No queremos atribuir todo el proyecto a una sola persona ni confundir el desarrollo original de un componente con las modificaciones realizadas posteriormente para integrarlo.

## 2. Juan Alberto — Backend e integración

Juan Alberto se encargó del desarrollo original del backend.

Implementó los módulos principales:

- `modelos.py`: estructuras de datos de redes y consultas.
- `validacion.py`: comprobaciones de integridad.
- `factores.py`: operaciones probabilísticas.
- `inferencia.py`: eliminación de variables.
- `main.py`: comunicación mediante FastAPI.

También realizó una parte importante de la integración final, conectando las funcionalidades del frontend con el motor del proyecto.

Entre sus actividades estuvieron la configuración Docker, el cliente API, la adaptación de componentes, las pruebas, la integración de ejemplos, la gestión JSON, el historial y los reportes.

Su trabajo permitió que las funcionalidades gráficas utilizaran el backend original, sin sustituir el algoritmo.

## 3. Edson — Interfaz y evidencias

Edson participó en el desarrollo de funcionalidades del frontend.

Trabajó en aspectos relacionados con la edición gráfica y el manejo de evidencias.

Su trabajo quedó vinculado a la rama `feature/multiples-evidencias` y al PR #4.

Durante la integración fue necesario adaptar componentes de estas funcionalidades al estado actual del proyecto y al contrato de FastAPI.

Conservamos su contribución en el historial del repositorio y distinguimos sus aportaciones originales de las modificaciones posteriores.

## 4. Obed — Selector y redes de ejemplo

Obed trabajó en la rama `feature/ejemplos-y-docs`.

Su aportación incluyó un selector y siete redes de ejemplo:

1. Lluvia y Aspersor.
2. Alarma de Terremoto y Robo.
3. Diagnóstico Médico.
4. Calidad de Software.
5. Tráfico Urbano.
6. Rendimiento Académico.
7. Sistema Financiero.

Estas redes contienen estructuras, relaciones y tablas de probabilidad.

Su trabajo quedó integrado originalmente mediante el PR #5.

Durante C06 recuperamos sus archivos y adaptamos los formatos de las CPT para utilizarlos con el backend de IDK.

Conservamos las siete redes sin eliminarlas ni reemplazarlas.

Las siete aprobaron las comprobaciones funcionales realizadas durante C06.

Al preparar el commit `feat: integrar ejemplos, historial y reportes`, agregamos a `@obed-2091` mediante la opción de coautoría de GitHub Desktop para reconocer los componentes reutilizados.

## 5. Paco — Revisión y limpieza

Paco realizó aportaciones relacionadas con la revisión y organización de archivos del repositorio.

En el historial se encuentra el commit `cf36825`, vinculado con la limpieza de archivos y conservación del verificador independiente.

Reconocemos ese trabajo como parte de su contribución.

Utilizamos el historial de Git como referencia de las aportaciones que efectivamente quedaron registradas.

## 6. Integración del trabajo

Para reunir los componentes utilizamos ramas de funcionalidad, pull requests y commits.

La integración se organizó en siete etapas:

| Etapa | Actividad |
|---|---|
| C01 | Docker |
| C02 | Comunicación React–FastAPI |
| C03 | React Flow |
| C04 | Consultas y evidencias |
| C05 | Estados y JSON |
| C06 | Ejemplos, historial y reportes |
| C07 | Pruebas y corrección de impresión |

Al incorporar componentes existentes respetamos su procedencia y realizamos las adaptaciones necesarias.

## 7. Ejercicios del maestro

Los cinco ejercicios oficiales fueron incorporados de forma independiente de las siete redes de Obed.

Corresponden a:

- Ciberseguridad: tres nodos.
- Mundial: cuatro nodos.
- Videojuegos: cinco nodos.
- Ransomware: seis nodos.
- Octavos de final: diez nodos.

Estos ejercicios se recuperaron del material e implementación de referencia y se adaptaron al catálogo final de IDK.

No los presentamos como parte de las siete redes desarrolladas por Obed.

## 8. Pruebas realizadas

Durante la integración realizamos pruebas de funcionamiento de las redes, consultas, estados, CPT, JSON, historial y reportes.

Registramos:

- 32 pruebas automatizadas del backend aprobadas.
- 19 pruebas funcionales de C06 aprobadas.
- Nueve pruebas en Android aprobadas.
- Compilaciones satisfactorias.
- Revisión del reporte final de diez páginas.

Las tareas de integración y pruebas se documentan por separado de la autoría original de cada componente.

## 9. Historial de GitHub

La evidencia de colaboración se encuentra en el repositorio:

https://github.com/juan-alberto-garcia/Redes-Bayesianas-IDK

Recomendamos revisar:

- Commits originales de los módulos.
- PR #4, relacionado con Edson.
- PR #5, relacionado con Obed.
- Commit `cf36825`, relacionado con Paco.
- Commits C01–C07 de integración.

Los datos de autor y coautor deben coincidir con el historial publicado del repositorio.

## 10. Conclusión

El resultado final reúne trabajo de varios integrantes.

La división de tareas permitió avanzar en diferentes componentes, mientras que la integración por etapas ayudó a mantener la compatibilidad entre ellos.

Consideramos importante dejar constancia de quién desarrolló cada parte, qué modificaciones se realizaron después y cómo comprobamos el funcionamiento del conjunto.