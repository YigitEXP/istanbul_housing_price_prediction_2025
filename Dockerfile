FROM python:3.11-slim

WORKDIR /app

COPY istanbul_housing_web/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY istanbul_housing_web/ .

EXPOSE 5000

CMD ["python", "app.py"]
