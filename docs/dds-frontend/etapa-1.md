---
sidebar_position: 2
---

# Etapa 1

## Proyecto Básico

_Creación del proyecto_: Ubicándonos en la carpeta que contendrá nuestro proyecto, por ej `c:/users/miusuario`, desde la consola ejecutamos:
  
```bash
npx create-react-app dds-frontend
```

**Observe**:
- El comando `npx` está disponible porque es parte de NodeJs
- Que este comando genera una carpeta y varias subcarpetas con una serie de archivos que constituyen la plantilla de una nueva aplicación basada en react
- Que se incluye el repositorio git del proyecto

Para verificar la funcionalidad la plantilla inicial del proyecto recién creado, nos ubicamos dentro de dicha carpeta y podemos ejecutarlo y abrirlo en el explorador con el siguiente comando de consola:

```bash
npm run start
```

**Observe**:
- El comando anterior abrirá el explorador por defecto en la url localhost:3000 y mostrará el proyecto en ejecución.
podemos detener nuestro servidor de aplicación node/react, estando ubicados en la ventana desde donde iniciamos el proyecto y pulsando Ctrl+C o cerrando la misma.
- Si cerramos el explorador y no detuvimos la aplicación (punto anterior), nuestra aplicación seguirá ejecutándose y podemos volver a verla en el explorador con la url por defecto

Mediante Visual Studio Code, vamos a cambiar la pantalla inicial de nuestro proyecto, dentro de los archivos generados, buscamos `src/App.js` que es el que proporciona la interface html inicial, y reemplazamos todo su código por el siguiente:
  
```jsx title="src/App.js"
function App() {
  return (
    <h1>Bienvenidos a Desarrollo de Software!</h1>
    );
}
export default App;
```

Grabe los cambios y si la aplicación estaba corriendo, verá como se ha actualizado la salida en el explorador, caso contrario en la ventana de consola vuelva a ejecutarla con el comando:

```bash
npm run start
```

O abreviadamente con:

```bash
npm start
```

## Primer componente: Inicio

Eliminamos todo el contenido del archivo `App.js` y lo reemplazamos por el código de nuestro primer componente:

```jsx title="src/App.js"
import React from 'react';   // necesaria para stackblitz
function App() {
  return (
     <div className="mt-4 p-5 rounded" style={{backgroundColor:"lightgray"}} >
        <h1>Pymes 2023</h1>
        <p>Este ejemplo está desarrollado con las siguientes tecnologías:</p>
        <p>
          Backend: NodeJs, Express , WebApiRest, Swagger, Sequelize, Sqlite y 
          múltiples capas en Javascript.
        </p>
        <p>
          Frontend: Single Page Aplication, HTML, CSS, Bootstrap, NodeJs,
          Javascript y React.
        </p>
        <button className="btn btn-lg btn-primary">
          <i className="fa fa-search"> </i>
          Ver Articulos Familias
        </button>
      </div>
  );
}
export default App;
```

**Observe**:
- Que hemos usado clases de bootstrap e iconos en nuestro html, por lo cual necesitaremos dichas librerías.
- Que hemos usado propiedades de css y en react style tiene una sintaxis especial mediante un objeto de javascript.

Agregamos al proyecto las librerías de `Bootstrap` y sus dependencias

```bash
npm install popper.js bootstrap
```

Agregamos al proyecto la librería de íconos `Font-Awesome` (version 6.20)

```bash	
npm install @fortawesome/fontawesome-free
```

:::tip[Nota] 
Todos los paquetes/librerías deben instalarse estando ubicados en la carpeta raíz del proyecto.
:::

Para que las librerías recién instaladas, se carguen en nuestro proyecto y podamos hacer uso de sus funcionalidades, debemos importarlas al mismo, lo que haremos modificando el archivo `src/index.js` agregando las siguientes líneas de código al inicio del mismo:

```jsx title="src/index.js"
import 'bootstrap/dist/css/bootstrap.min.css'
import '@popperjs/core/dist/cjs/popper.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import '@fortawesome/fontawesome-free/css/all.min.css'
```

Ejecutemos la aplicación, y verificamos si nuestra salida html tiene aplicadas las clases de bootstrap y puede verse el icono utilizado.

Hasta aquí hemos usado el componente principal de la aplicación: `App.js` para nuestra página de inicio, pero en realidad lo que tenemos que hacer es crear inicialmente al menos un componente específico para cada página de nuestra aplicación, para luego ir reconociendo interface/código con sus respectivas responsabilidad y que también podremos reutilizar a partir del cual generamos nuevos componentes.

Vamos a crear un nuevo componente para nuestra página de inicio y para tener un mejor orden, crearemos una nueva carpeta denominada `components` (será hija de `/src`):
- En dicha carpeta, creamos el archivo `/src/components/Inicio.js`
- Copiamos el código desde `App.js` a `Inicio.js`, reemplazando el nombre de la función `App` por `Inicio`, con lo que el código nos quedaría así:

```jsx title="src/components/Inicio.js"
import React from 'react';     //necesaria en stackblitz 
function Inicio() {
  return (
    <div className="mt-4 p-5 rounded" style={{ backgroundColor: "lightgray" }}>
      <h1>Pymes 2023</h1>
      <p>Este ejemplo está desarrollado con las siguientes tecnologías:</p>
      <p>
        Backend: NodeJs, Express , WebApiRest, Swagger, Sequelize, Sqlite
        múltiples capas en Javascript/Typescript.
      </p>
      <p>
        Frontend: Single Page Application, HTML, CSS, Bootstrap, NodeJs,
        Javascript y React.
      </p>
      <button className="btn btn-lg btn-primary">
        <i className="fa fa-search"> </i>
        Ver Articulos Familias
      </button>
    </div>
  );
}
export { Inicio };
```

**Observe**:
- Que siempre los componentes de react deben iniciar con mayúsculas

Ahora modificamos el `App.js` para que muestre el componente `Inicio`, para lo cual reemplazamos su código con el siguiente:
  
```jsx title="src/App.js"
import React from 'react';     //necesaria en stackblitz 
import {Inicio} from "./components/Inicio";
function App() {
return (
    <>
        <Inicio/>
    </>
);
}
export default App;
```

Ejecutemos las aplicaciones y verifiquemos los resultados obtenidos.

En cualquier etapa de nuestro desarrollo, si quisiéramos preparar el código para el despliegue de nuestra aplicación, debemos ejecutar el siguiente script desde la consola:

```bash
npm run build
```

**Observe**:
- Que el comando generó una carpeta llamada `build` y varias subcarpetas, las cuales contienen los archivos minificados necesarios para subir a nuestro servidor.
