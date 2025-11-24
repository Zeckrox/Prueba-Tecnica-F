# Guía de Ejecución del Proyecto

Este documento proporciona las instrucciones necesarias para configurar y ejecutar tanto el backend como el frontend de este proyecto.

## Tecnologías Utilizadas

-   **Backend:** Python, Django, Django REST Framework
-   **Frontend:** React, Vite
-   **Gestor de Entorno (Backend):** pipenv
-   **Gestor de Paquetes (Frontend):** npm

## Prerrequisitos

Asegúrate de tener instaladas las siguientes herramientas en tu sistema:

-   [Python](https://www.python.org/downloads/) (versión 3.8 o superior)
-   [Pip](https://pip.pypa.io/en/stable/installation/) (generalmente se instala con Python)
-   [pipenv](https://pipenv.pypa.io/en/latest/installation/#installing-pipenv) (`pip install pipenv`)
-   [Node.js](https://nodejs.org/) (versión 14 o superior) y npm (se instala con Node.js)

## Configuración y Ejecución del Backend

1.  **Navega al directorio del backend:**
    ```bash
    cd back
    ```

2.  **Crea un entorno virtual e instala las dependencias:**
    Utilizaremos `pipenv` para gestionar el entorno y los paquetes de Python a partir del archivo `requirements.txt`.
    ```bash
    pipenv install -r ../requirements.txt
    ```

3.  **Activa el entorno virtual:**
    Todos los comandos siguientes deben ejecutarse dentro de este entorno.
    ```bash
    pipenv shell
    ```

4.  **Aplica las migraciones de la base de datos:**
    Esto creará y actualizará el esquema de la base de datos.
    ```bash
    python manage.py migrate
    ```

5.  **Inicia el servidor de desarrollo de Django:**
    Por defecto, el servidor se ejecutará en `http://127.0.0.1:8000/`.
    ```bash
    python manage.py runserver
    ```
    El backend ahora está en funcionamiento.

## Configuración y Ejecución del Frontend

1.  **Abre una nueva terminal.**

2.  **Navega al directorio del frontend:**
    ```bash
    cd front
    ```

3.  **Instala las dependencias de Node.js:**
    ```bash
    npm install
    ```

4.  **Inicia el servidor de desarrollo de Vite:**
    Esto iniciará el servidor de desarrollo para la aplicación de React.
    ```bash
    npm run dev
    ```
    La aplicación frontend estará disponible en la dirección que se muestre en la terminal (generalmente `http://localhost:5173/`).
