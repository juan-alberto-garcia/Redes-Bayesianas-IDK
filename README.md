# Redes Bayesianas IDK

Aplicación web que desarrollamos para crear, visualizar, modificar y consultar redes bayesianas discretas mediante el algoritmo de eliminación de variables.

**Materia:** Modelos Probabilistas  
**Carrera:** Ingeniería en Computación  
**Universidad:** Universidad Michoacana de San Nicolás de Hidalgo  
**Equipo:** Juan Alberto Garcia Chavez, Edson Alejandro Sáyago Morales, Obed Alberto González Robledo y Francisco Rafael Hurtado Guzmán.  
**Fecha:** 3 de noviembre de 2026

## Descripción

Desarrollamos Redes Bayesianas IDK para facilitar el trabajo con redes probabilísticas de tres a diez nodos.

La aplicación permite construir una red desde una interfaz gráfica, configurar sus probabilidades y ejecutar consultas sin necesidad de utilizar comandos para las operaciones habituales.

El motor de inferencia está implementado en Python mediante operaciones propias sobre factores.

## Funcionalidades

- Creación y eliminación de nodos.
- Edición de identificadores y nombres.
- Estados personalizados.
- Conexiones dirigidas mediante React Flow.
- Detección de ciclos.
- Validación de tablas CPT.
- Consultas individuales y conjuntas.
- Múltiples evidencias.
- Eliminación de variables.
- Importación y exportación JSON.
- Doce redes de ejemplo.
- Historial de hasta treinta consultas.
- Comparación y recuperación de resultados.
- Reportes imprimibles en formato A4.
- Interfaz accesible desde navegadores de computadora y Android.

## Tecnologías

**Frontend:** React, TypeScript, Vite, React Flow y CSS.

**Backend:** Python, FastAPI y Pydantic.

**Herramientas:** Docker, Docker Compose, Git y GitHub.

## Estructura

```text
Redes-Bayesianas-IDK/
├── Backend/
│   ├── aplicacion/
│   │   ├── main.py
│   │   ├── modelos.py
│   │   ├── validacion.py
│   │   ├── factores.py
│   │   └── inferencia.py
│   ├── pruebas/
│   ├── requirements.txt
│   └── Dockerfile
├── Frontend/
│   ├── src/
│   │   ├── componentes/
│   │   ├── ejemplos/
│   │   ├── servicios/
│   │   ├── tipos/
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
├── documentacion/
│   ├── migracion.md
│   ├── pruebas.md
│   └── contribuciones.md
├── compose.yaml
└── README.md
```

## Requisitos

- Python 3.12 o compatible.
- Node.js 22 o compatible.
- npm.
- Navegador web actualizado.
- Docker y Docker Compose, opcionales.

## Instalación local en Windows

### Backend

Desde la raíz:

```powershell
cd Backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn aplicacion.main:aplicacion --host 127.0.0.1 --port 8082
```

Si ya existe el entorno virtual, podemos reutilizarlo.

### Frontend

En otra terminal:

```powershell
cd Frontend
npm install
npm run dev
```

Abrimos la dirección que indique Vite, normalmente:

`http://localhost:5173`

Si el servidor está conectado, la interfaz debe mostrar `Backend: correcto`.

## Instalación en GNU/Linux

Los comandos equivalentes para crear y activar el entorno virtual son:

```bash
cd Backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m uvicorn aplicacion.main:aplicacion --host 127.0.0.1 --port 8082
```

Para el frontend:

```bash
cd Frontend
npm install
npm run dev
```

Estas instrucciones describen el procedimiento previsto; la compatibilidad completa en GNU/Linux sigue pendiente de prueba formal.

## Ejecución con Docker

Desde la raíz del proyecto:

```bash
docker compose up --build -d
```

Comprobamos los servicios:

```bash
docker compose ps
```

Para detenerlos:

```bash
docker compose down
```

Los puertos deben revisarse en `compose.yaml`.

## API

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/estado` | Estado del servidor |
| POST | `/api/validar` | Validación de redes |
| POST | `/api/inferir` | Inferencia probabilística |

## Formato JSON

Las redes utilizan una estructura con nombre, versión y nodos.

Cada nodo contiene identificador, nombre, estados, padres, posición gráfica y CPT.

Ejemplo parcial:

```json
{
  "nombre": "Red de ejemplo",
  "formato": 1,
  "nodos": [
    {
      "id": "A",
      "nombre": "Lluvia",
      "estados": ["Si", "No"],
      "padres": [],
      "posicion": {
        "x": 100,
        "y": 100
      },
      "tabla": [
        {
          "condiciones": {},
          "probabilidades": {
            "Si": 0.3,
            "No": 0.7
          }
        }
      ]
    }
  ]
}
```

El ejemplo presenta un nodo para mostrar el formato. Deben agregarse los nodos restantes para formar una red válida de al menos tres variables.

## Redes de ejemplo

La aplicación incluye doce redes.

### Ejercicios del maestro

| Ejercicio | Tema | Nodos | Consulta de referencia |
|---|---|---:|---|
| 1 | Ciberseguridad | 3 | P(P=1 \| A=1) |
| 2 | Mundial de fútbol | 4 | P(G=1 \| R=1) |
| 3 | Videojuegos | 5 | P(R=1 \| K=1) |
| 5 | Ransomware | 6 | P(I=1 \| T=1,L=1) |
| 10 | Octavos | 10 | P(G=1 \| Le=1,Cl=1) |

Resultados de referencia obtenidos por enumeración independiente:

- Ciberseguridad: 83.74 %.
- Mundial: 43.80 %.
- Videojuegos: 56.16 %.
- Ransomware: 98.98 %.
- Octavos: 38.70 %.

### Otros ejemplos

- Lluvia y Aspersor.
- Alarma de Terremoto y Robo.
- Diagnóstico Médico.
- Calidad de Software.
- Tráfico Urbano.
- Rendimiento Académico.
- Sistema Financiero.

Estos siete ejemplos y el selector original fueron aportados por Obed y adaptados para IDK durante la integración.

## Ejecutar las pruebas

Desde `Backend`, con el entorno virtual activado:

```powershell
python -m unittest discover -s pruebas -p "test_*.py" -v
```

Resultado final registrado:

```text
Ran 32 tests in 0.739s

OK
```

Para compilar el frontend desde la raíz:

```powershell
npm --prefix .\Frontend run build
```

La compilación de integración de C06 se realizó correctamente con 194 módulos transformados.

También realizamos pruebas manuales de las doce redes, historial, reportes y Android.

Los resultados y limitaciones están documentados en:

`documentacion/pruebas.md`

## Plataformas

| Plataforma | Estado |
|---|---|
| Windows 11 | Probada |
| Android mediante navegador | Probada |
| Docker | Probado |
| GNU/Linux | Pendiente de verificación completa |
| macOS | No probado |

## Documentación

El repositorio incluye:

- `documentacion/migracion.md`: bitácora de integración.
- `documentacion/pruebas.md`: registro de pruebas.
- `documentacion/contribuciones.md`: aportaciones del equipo.


Para la entrega académica también preparamos el manual de usuario y la memoria técnica en PDF.

## Integrantes y contribuciones

**Juan Alberto:** backend original, algoritmo de eliminación de variables, API e integración de componentes.

**Edson:** trabajo de frontend y funcionalidades relacionadas con edición gráfica y múltiples evidencias.

**Obed:** selector y siete redes de ejemplo; trabajo documentado en el PR #5.

**Francisco:** Validador independiente del backend, revisión y limpieza de archivos del proyecto, con contribuciones registradas en GitHub.

Para más información consultamos `documentacion/contribuciones.md` y el historial del repositorio.

## Relación con Vercel

Mantenemos dos repositorios independientes:

- `Redes-Bayesianas-IDK`.
- `Redes-Bayesianas-Vercel`.

**El despliegue existente en Vercel conserva la versión de su propio repositorio. No será sustituido ni actualizado automáticamente desde IDK.**

## Limitaciones conocidas

- Falta una prueba completa de compatibilidad GNU/Linux.
- El comparador automático auxiliar de los cinco ejercicios oficiales no concluyó su ejecución.
- Los factores grandes se muestran resumidos en los reportes PDF.
- El historial se almacena localmente en el navegador.

## Conclusión

Redes Bayesianas IDK reúne las principales funcionalidades necesarias para crear, modificar, validar y consultar redes bayesianas desde una interfaz gráfica.

Nuestro desarrollo combina un motor propio de inferencia, herramientas visuales, almacenamiento JSON y pruebas que permiten revisar su funcionamiento.

El historial de GitHub conserva la evolución del proyecto y las contribuciones del equipo.
