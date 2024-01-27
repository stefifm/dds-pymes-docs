---
sidebar_position: 2
---

# Etapa 1

## Crear un proyecto básico

- Empezamos por crear la carpeta del proyecto con el nombre `dds-backend` en nuestra computadora.
- Nos ubicamos en la carpeta del proyecto, abrimos la consola de git bash (tener en cuenta que debe estar dentro de la carpeta) y ejecutamos `npm init` para inicializar Node. En la consola nos aparecerá una serie de preguntas como las siguientes:

```bash
package name: (dds-backend)
version: (1.0.0)
description:
entry point: (index.js)

etc...
```

- Para cada pregunta podemos dejar la respuesta por defecto presionando enter, o bien escribir la respuesta y presionar enter. Si quieren evitar estas preguntas e inicializar el proyecto rápidamente, pueden ejecutar el comando `npm init -y`.
- Una vez hecho esto, empezamos a instalar las dependecias que vamos a necesitar en esta etapa. La primera es `express` ejecutando el comando `npm i express`.
- Creamos el archivo inicial `index.js` y escribimos el siguiente código:

```javascript title="index.js"
const express = require('express');

// crear servidor
const app = express();

// controlar ruta
app.get("/", (req, res) => {
  res.send("Backend inicial dds-backend!");
});

// levantar servidor
const port = 3000;
app.listen(port, () => {
    console.log(`sitio escuchando en el puerto ${port}`);
});
```

- Ejecutamos el comando `node index.js` dentro de la terminal integrada de VSCode para levantar el servidor.
- Testeamos la aplicación desde el explorador, url: localhost:3000
- Inicializamos repositorio con `git init`.
- Creamos el archivo `.gitignore` y agregamos la carpeta `node_modules/` para que no se suba al repositorio.
- Ejecutamos el comando `git add --all` o `git add .`
- Y luego hacemos commit con `git commit -m "etapa 1 completada"`

:::tip[Nota] 
Para mejorar la experiencia de desarrollo, haremos uso de `nodemon` Para instalarlo, ejecutamos el comando: `npm i nodemon -D` y agregamos el siguiente script en el archivo `package.json`:
:::

```json title="package.json"
{
  "name": "dds-backend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```
Finalmente, para ejecutar el proyecto de aquí en adelante usaremos: `npm run dev`