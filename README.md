# Redes Bayesianas - Editor e Inferencias

Proyecto integral para la creación, visualización e inferencia probabilística en Redes Bayesianas utilizando **FastAPI** en el Backend y **React** en el Frontend.

---

## 🛠️ Tecnologías Utilizadas

* **Backend:** Python 3.x, FastAPI, Uvicorn, Pydantic.
* **Frontend:** React, React Flow (Editor Gráfico), TailwindCSS, Axios.

---

## 🚀 Instalación y Ejecución Local

### Prerrequisitos
* Python 3.10+
* Node.js (LTS)

### 1. Iniciar el Backend

```bash
cd Backend
python3 -m pip install -r requirements.txt
python3 -m uvicorn aplicacion.main:aplicacion --reload --port 8000
