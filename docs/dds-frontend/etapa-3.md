---
sidebar_position: 4
---

# Etapa 3

## Componentes Menu y Footer

### Instalación de React Router Dom y su implementación

Para poder navegar entre las diferentes páginas de nuestra aplicación, hasta ahora representadas por los componentes `Inicio` y `ArticulosFamilias` vamos a crear un nuevo componente llamado `Menu` que nos permitirá implementar dicha funcionalidad.

Pero antes necesitamos preparar a nuestra aplicación para permitir la navegación según el modelo de SPA, para lo cual importamos un módulo de ruteo que nos ofrece react: `react-router-dom` Para ello ejecutaremos el siguiente comando:

```bash
npm install react-router-dom
```

A continuación modificaremos el html de nuestro componente `App` en donde, gracias a la funcionalidad del router, indicaremos qué componente se mostrará según la url que se indique en el explorador.

El código de nuestro componente `App.js` quedará así:

```jsx title="src/App.js"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Inicio from "./components/Inicio";
import ArticulosFamilias from "./components/ArticulosFamilias";
function App() {
  return (
    <>
      <BrowserRouter>
        <div className="divBody">
            <Routes>
              <Route path="/inicio" element={<Inicio />} />
              <Route path="/articulosfamilias" element={<ArticulosFamilias />} />
              <Route path="*" element={<Navigate to="/Inicio" replace />} />
            </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}
export default App;
```

**Observe**:
- Que se importa todos los componentes que deseamos navegar (`Inicio` y `ArticulosFamilias`)
- En la etiqueta `Route` la relación entre la propiedad path y element
- En la última etiqueta `Route` que luego de evaluarse secuencialmente todas las anteriores y de no encontrar coincidencia en el `path`, la redirige al path `/Inicio`

En este momento podremos probar nuestra aplicación, la cual nos permitirá según la url solicitada mostrar el componente correspondiente, podríamos probarlo con las siguientes urls:
- http://localhost:3000/inicio
- http://localhost:3000/articulosfamilias
- http://localhost:3000

### Creación del componente Menu

Ahora ya configurada nuestra aplicación para interpretar la url del explorador, crearemos el componente `Menu` que ofrece la interface html para elegir las distintas pantallas (rutas/componentes) que ofrece nuestra aplicación, creamos en la carpeta components el archivo `Menu.jsx` con el siguiente código:

```jsx title="src/components/Menu.jsx"
import React from "react";
import { NavLink } from "react-router-dom";

function Menu() {
  return (
    <nav className="navbar navbar-dark bg-dark navbar-expand-md">
      <a className="navbar-brand">
        <i className="fa fa-industry"></i>
        &nbsp;<i>Pymes</i>
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <NavLink className="nav-link" to="/inicio">
              Inicio
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/articulosfamilias">
              Articulos Familias
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
export default Menu;
```

**Observe**:
- El código del menú está sacado de la página de bootstrap
- Los links de navegación se crean con la etiqueta NavLink, la cual permite que se le aplique un estilo css cuando el link esta activo, en este caso se le aplica el estilo `nav-link-active`
- Que el componente `Menu` se ha exportado con `export default Menu` que luego incide en cómo debe ser importado.

Ahora modificamos nuevamente el html del `App.js` para renderizar el menú recién creado, este debe ir dentro de las etiquetas `BrowserRouter` y previamente debe ser importado, el código de nuestro componente `App.js` quedará así:

```jsx title="src/App.js"
// … código anterior…
import Menu from "./components/Menu";
function App() {
  return (
    <>
        <BrowserRouter>
          <Menu />
          <div className="divBody">
            <Routes>
              <Route path="/inicio" element={<Inicio />} />
              <Route
                path="/articulosfamilias"
                element={<ArticulosFamilias />}
              />
              <Route path="*" element={<Navigate to="/inicio" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
    </>
  );
}
export default App;
```

En el componente `Inicio.jsx` configuraremos el link del boton para poder navegar a la pantalla de `ArticulosFamilias`, para lo cual haremos el siguiente reemplazo en el código del componente:

Buscamos el código del botón:

```jsx title="src/components/Inicio.jsx"
<button className="btn btn-lg btn-primary">
  <i className="fa fa-search"> </i>
  Ver Articulos Familias
</button>
```

y lo reemplazamos por el siguiente:
  
```jsx title="src/components/Inicio.jsx"
<Link to="/articulosfamilias" className="btn btn-lg btn-primary">
  <i className="fa fa-search"> </i> Ver Articulos Familias
</Link>
```

También en el componente necesitaremos importar el componente `<Link>` recien usado, el cual es provisto por la librería `react-router-dom`, lo haremos con la siguiente linea al inicio del componente `Inicio.jsx`

```jsx title="src/components/Inicio.jsx"
import { Link } from "react-router-dom";
```

Ahora en el navegador podremos ver el menú y podremos navegar entre las distintas pantallas de nuestra aplicación mediante los links del menú como así también mediante las urls del explorador.

### Creación del componente Footer

Análogamente al componente menú que estará visible durante todo el ciclo de vida de nuestra aplicación, crearemos un componente Footer que será el pie de página de nuestra aplicación, el contenido del mismo es muy simple ya que solo tiene datos estáticos informativos con algunos links de interés.

Creamos el archivo `Footer.jsx` en la carpeta components, el código del mismo es el siguiente:

```jsx title="src/components/Footer.jsx"
import React from 'react';
function Footer() {
  return (
    <footer className="text-center">
    <small>
      <span>© Pymes 2023</span>
      <span className="m-4">-</span>
      <a href="tel:113"> <span className="fa fa-phone"></span> 0810-888-1234 </a>
      <span className="m-4">-</span>
      Seguinos en
      <a
        className="redes"
        href="https://www.facebook.com"
        style={{"backgroundColor": "#2962ff"}}
        target="_blank"
      >
        <i title="Facebook" className="fab fa-facebook-f"></i>
      </a>
      <a
        className="redes"
        href="https://twitter.com"
        style={{"backgroundColor": "#5ba4d6"}}
        target="_blank"
      >
        <i title="Twitter" className="fab fa-twitter"></i>
      </a>
      <a
        className="redes"
        style={{"backgroundColor": "#ec4c51"}}
        href="https://www.instagram.com"
        target="_blank"
      >
        <i title="Instagram" className="fab fa-instagram"></i>
      </a>
      <a
        className="redes"
        style={{"backgroundColor": "#00e676"}}
        href="https://www.whatsapp.com"
        target="_blank"
      >
        <i title="Whatsapp" className="fab fa-whatsapp"></i>
      </a>
    </small>
  </footer>

  );
}
export { Footer };
```

**Observe**:
- Que el componente `Footer` se ha exportado con `export {Footer}` que luego incide en cómo debe ser importado 

Finalmente modificamos nuevamente el html del componente App para renderizar el Footer recién creado, y cuya versión final completa quedaría así:

```jsx title="src/App.js"
import "./App.css";
import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Menu from "./components/Menu";
import { Footer } from "./components/Footer";
import { Inicio } from "./components/Inicio";
import { ArticulosFamilias } from "./components/articulosfamilias/ArticulosFamilias";
function App() {
  return (
    <>
        <BrowserRouter>
          <Menu />
          <div className="divBody">
            <Routes>
              <Route path="/inicio" element={<Inicio />} />
              <Route
                path="/articulosfamilias"
                element={<ArticulosFamilias />}
              />
              <Route path="*" element={<Navigate to="/inicio" replace />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
    </>
  );
}
export default App;
```

Y agregamos también algunas clases css para darle un poco de estilo a la aplicación, el código de estas clases se encuentra en el archivo `App.css`, aquí va su contenido:

```css title="src/App.css"
body {
  background-color: rgb(241, 243, 247);
}

.divBody {
  background-color: white;
  min-height: 75vh;
  padding: 1rem;
}

/* pie de la pagina */
footer {
  padding: 1rem;
}
.navbar-brand {
  color: aquamarine;
  font-size: 1.5rem;
}

.tituloPagina {
  font-size: 1.75rem;
  font-weight: 500;
  color: white;
  text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue;
  border-bottom-style: solid;
  border-color: gray;
  border-bottom-width: thin;
  padding-bottom: 0.1em;
  margin-bottom: 0.5em;
}



/* todos los formularios */
form {
  background-color: rgb(241, 243, 247);
  border-radius: 0.5rem;
  border-style: solid;
  border-color: lightgrey;
  border-width: thin;
  margin: 0em 0.5rem 1rem 0.5rem;
  padding: 0.5rem;
  box-shadow: 0.62rem 0.62rem 0.31rem rgb(175, 173, 173);
}

/* espacio en los botones contenidos en un div con esta clase */
.botones button {
  margin: 0em 0.5em 0.5em 0em;
}

/* todos los labels menos los de los radio y check */
label:not([class^='custom-control']) {
  background-color: #d7dfe7;
  border-radius: 0.625em 0.2em 0rem 0.625em;
  border-bottom: solid;
  margin-right: -0.9em; /* para que columna label este cerca del input*/
  padding-left: 0.5em;
  display: block;
  height: 90%;
}

/*<=576*/
@media only screen and (max-width: 575px) {
  label:not([class^='custom-control']) {
    margin-right: 0em;
    margin-top: 0.3rem; /* para separar grupo label/input */
  }
}

/*>=576*/
@media only screen and (min-width: 576px) {
  .inputMedio {
    width: 12em;
  }
  .inputChico {
    width: 7em;
  }
}

.pyBadge {
  background-color: #6c757d;
  color: white;
  /* font-size: 1.1em; */
  display: inline-block;
  padding: 0.35em 0.4em;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
}

/* mensajes de validacion */
.validacion {
  color: red;
  font-size: 0.8em;
  font-style: italic;
  padding-left: 1em;
  padding-bottom: 0.5em;
}

/* mensajes de alerta al buscar y grabar */
.mensajesAlert {
  /* color: #495057; */
  margin: 0rem 0.5rem 0rem 0.5rem;
}

.paginador {
  background-color: #e9ecef;
  padding: 0.5rem 1rem 0rem 1rem;
  margin-top: -1rem; /* para pegarlo a la tabla */
}

/* todos los input a mayusculas, y no sus placeholders*/
input {
  text-transform: uppercase;
  /* margin-bottom: 0.2em;  */
  /*separa renglones*/
}
::placeholder {
  text-transform: none;
}

/* encabezados de tablas */
thead {
  /* bootstrap thead-light*/
  color: #495057;
  background-color: #aeb7d7; /* #e9ecef; */
  border-color: #dee2e6;
}

/* redes al pie de pagina */
.redes {
  background-color: blue;
  color: white;
  padding: 0.4em;
  margin: 0.3em;
  border-radius: 1em;
}
```

**Observe**:
- Que a los inputs se le aplica un estilo que hace que visualmente los datos ingresados se vean en mayúsculas, luego combinado con el backend los mismo se guardaran en mayúsculas en la base de datos.

Ahora podemos ejecutar nuestra aplicación comprobar el código que hemos escrito!
