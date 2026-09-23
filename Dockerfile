FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# veadk web 默认监听 8000，容器内需绑定 0.0.0.0
EXPOSE 8000
CMD ["veadk", "web", "--host", "0.0.0.0", "--port", "8000"]
