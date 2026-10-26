FROM python:3.12-slim
WORKDIR /servidor
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY aplicacion ./aplicacion
EXPOSE 8000
CMD ["uvicorn", "aplicacion.main:aplicacion", "--host", "0.0.0.0", "--port", "8000"]
