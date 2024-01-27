---
sidebar_position: 3
---

# Etapa 2

## Componente Articulos Familias

Ahora vamos a crear el segundo componente de nuestra aplicación que se llamará `ArticulosFamilias` y servirá para listar los datos de la tabla `ArticulosFamilias`, simplemente será una tabla html que nos mostrará los dos campos de la tabla `ArticulosFamilias`.

- Vamos a crear el componente `ArticulosFamilias`
  - en la carpeta components agregamos el archivo `ArticulosFamilias.jsx`
   
Copiamos en `ArticulosFamilias.jsx` el siguiente código en donde definimos una tabla html en donde tenemos hardcodeados 2 registros.
  
```jsx title="src/components/ArticulosFamilias.jsx"
function ArticulosFamilias() {
  return (
    <>
      <div className="tituloPagina">Articulos Familias</div>
      <div className="table-responsive">
         <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th style={{ width: "40%" }}>IdArticuloFamilia</th>
              <th style={{ width: "60%" }}>Nombre</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Accesorios</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Audio</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
export { ArticulosFamilias };
```

En el código anterior se usa la clase css `.tituloPagina` para destacar el título del componente, como la misma va a ser reutilizada por varios componentes, la vamos a definir dentro del archivo `App.css`, con el código que vemos a continuación:
  
```css title="src/App.css"
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
```

**Observe**:
- Que el archivo `App.css` ya existía, ya que fue creado al crear el proyecto con el comando `npx create-react-app ...`, por lo que seguramente tenía código de ejemplo que debemos eliminar y solo dejar nuestro código.
- La etiqueta `<thead>` en HTML es utilizada para definir un bloque que contiene las celdas de encabezado de una tabla. El contenido dentro de esta etiqueta se considera como un encabezado de tabla y se utiliza para describir el contenido de las columnas de la tabla.

Ahora modificamos el componente `App` (archivo `App.js`) para que muestre el componente `ArticulosFamilias`, para lo cual necesitamos:
- Importar el archivo de estilo `App.css`
- Importar el código del componente `ArticulosFamilias`
- Modificar el retorno de nuestra función para que devuelva la etiqueta que representa al componente `ArticulosFamilias`
quedando como vemos a continuación:

```jsx title="src/App.js"
  import "./App.css";
  import {ArticulosFamilias} from './components/ArticulosFamilias';
  function App() {
    return (
      <>
        <div className="divBody">
            <ArticulosFamilias/>
        </div>
      </>
    );
  }
  export default App;
```

En el código anterior se usa la clase css `divBody`, para agregar algunos estilos al contenedor de los componentes, la vamos a definir dentro del archivo `App.css`, con el código que vemos a continuación:

```css title="src/App.css"
body {
  background-color: rgb(241, 243, 247);
}

.divBody {
  background-color: white;
  min-height: 75vh;
  padding: 1rem;
}    

```

Grabamos todos los cambios y desde el explorador comprobamos que se carga la página definida en el componente `ArticulosFamilas`

A continuación vamos a crear un array con un conjunto de datos hardcodeados que representarán los datos de `ArticulosFamilias` que queremos que se muestran dinámicamente en el componente que acabamos de crear; para lo cual crearemos en `/src` una carpeta llamada `datos-mock` y dentro de la misma un archivo llamado `articulosfamilias-mock.js` con el siguiente contenido:
  
```js title="src/datos-mock/articulosfamilias-mock.js"
  const arrayArticuloFamilia = [
    { IdArticuloFamilia: 1, Nombre: "Accesorios" },
    { IdArticuloFamilia: 2, Nombre: "Audio" },
    { IdArticuloFamilia: 3, Nombre: "Celulares" },
    { IdArticuloFamilia: 4, Nombre: "Cuidado Personal" },
    { IdArticuloFamilia: 5, Nombre: "Dvd" },
    { IdArticuloFamilia: 6, Nombre: "Fotografía" },
    { IdArticuloFamilia: 7, Nombre: "Frio-Calor" },
    { IdArticuloFamilia: 8, Nombre: "Gps" },
    { IdArticuloFamilia: 9, Nombre: "Informatica" },
]
export default arrayArticuloFamilia;
```

A continuación vamos a modificar el componente `ArticulosFamilias` para que desde su código se pueda acceder al array de `ArticulosFamilias` recién creados al inicio del archivo, Importamos el array `ArticuloFamilia`:

```jsx title="src/components/ArticulosFamilias.jsx"
  import arrayArticuloFamilia from "../datos-mock/articulosfamilias-mock";
```

Dentro del componente `ArticuloFamilias` agregamos:
- Una constante llamada `articulosFamilias` que contenga el array de `articulosFamilias` recién importado que luego va ser recorrido/transformado (mediante la función `map`) en el html para generar la tabla
- Y otra constante `tituloPagina` para mostrar como título de la página

```jsx title="src/components/ArticulosFamilias.jsx"
function ArticulosFamilias() {
  const articulosFamilias = arrayArticuloFamilia;
  const tituloPagina = 'ArticulosFamilias';
  
  return (
    //...
  )
}

```

Luego modificamos la respuesta html de nuestro componente `ArticulosFamilias` para que muestre la propiedad `Titulo` y con ayuda de la función `map` recorra el array `Items` y dibuje (pinte o renderice) la tabla. El código completo de nuestro componente quedaria asi:

```jsx title="src/components/ArticulosFamilias.jsx"
import arrayArticuloFamilia from '../datos-mock/articulosfamilias-mock';

function ArticulosFamilias() {
  const articulosFamilias = arrayArticuloFamilia;
  const tituloPagina = 'ArticulosFamilias';

  return (
    <div>
      <div className="tituloPagina">{tituloPagina}</div>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th style={{ width: "40%" }}>IdArticuloFamilia</th>
            <th style={{ width: "60%" }}>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {articulosFamilias &&
            articulosFamilias.map((articulofamilia) => (
              <tr key={articulofamilia.IdArticuloFamilia}>
                <td>{articulofamilia.IdArticuloFamilia}</td>
                <td>{articulofamilia.Nombre}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );

}

export default ArticulosFamilias;
```

Ahora probamos los cambios realizado ejecutando la aplicación mediante el comando:
```bash
npm run start
```

**Observe**:
- La técnica usada para renderizar condicionalmente el `tbody` de la tabla solo si existe la variable `articulosFamilias`.
- La técnica usada para transformar el array Items mediante la función `map` y por cada ítem generar el tag `tr` correspondiente a la fila de la tabla.

## Creando el servicio mock de ArticulosFamilias

Para mantener simple nuestro componente, es deseable que solo maneje la renderización de nuestra html y mediante servicios recibir o enviar datos desde y hacia el servidor (o como hasta ahora moqueados). Para ir hacia ese concepto, seguidamente creamos un servicio que denominaremos `articulosFamilias-mock-service.js`, análogamente como hicimos anteriormente con los componentes, lo haremos dentro de una carpeta `services` donde agrupamos los servicios de nuestra aplicación.

En dicho servicio, crearemos:
- Un método `Buscar` que devuelva todos los registros del array ArticulosFamlias
- Un método `BuscarPorId` que devuelve el articulofamilia solicitado.
- Un método `Agregar` para dar de alta un registro
- Un método `Modificar` para modificar un registro
- Un método `Eliminar` para eliminar un registro

Finalmente exportamos la funcionalidad desarrollada

A continuación el código del servicio `/src/services/articulosFamilias-mock-service.js`

```js title="src/services/articulosFamilias-mock-service.js"
import arrayArticuloFamilia from '../datos-mock/articulosfamilias-mock';

async function Buscar() {
     return arrayArticuloFamilia;
}

async function BuscarPorId(IdArticuloFamilia) {
      return arrayArticuloFamilia.find((articulofamilia) => articulofamilia.IdArticuloFamilia === IdArticuloFamilia);
}

async function Agregar(articuloFamilia) {
    articuloFamilia.IdArticuloFamilia = arrayArticuloFamilia.length + 1;  // simula autoincremental
    arrayArticuloFamilia.push(articuloFamilia);
}

async function Modificar(articuloFamilia) {
    let articuloFamiliaEncontrado = arrayArticuloFamilia.find((articulofamiliafind) => articulofamiliafind.IdArticuloFamilia === articuloFamilia.IdArticuloFamilia);
    if (articuloFamiliaEncontrado) {
        articuloFamiliaEncontrado.Nombre = articuloFamilia.Nombre;
    }
}

async function Eliminar(IdArticuloFamilia){
    let articuloFamiliaEncontrado = arrayArticuloFamilia.find((articulofamiliafind) => articulofamiliafind.IdArticuloFamilia === IdArticuloFamilia);
    if (articuloFamiliaEncontrado) {
        arrayArticuloFamilia.splice(arrayArticuloFamilia.indexOf(articuloFamiliaEncontrado), 1);
    }
}

export const articulosFamiliasMockService = {
    Buscar, BuscarPorId, Agregar, Modificar, Eliminar
};
```

**Observe**:
- Ya pensando en que nuestro servicio real interactuará contra un servidor remoto mediante llamadas asíncronas, hemos definido este mock lo más parecido al servicio que está imitando por lo que la funciones son asíncronas.


## Modificando el componente ArticulosFamilias para que use el servicio

Ahora modificamos el componente `ArticulosFamilias` para que consuma el nuevo servicio y recupere desde allí el array de `ArticulosFamilias`. Los cambios serán los siguientes:
- dejaremos de usar directamente el `arrayArticuloFamilia`, en cambio ahora el mismo será provisto por el servicio `articulosFamiliasMockService`
- Haremos uso del hook `UseEffect` para invocar este servicio al montarse por primera vez el componente.
- Haremos uso del hook `UseState` para mantener dentro del estado del componente los datos que nos devuelve el servicio.

El nuevo código completo de `ArticulosFamilias` quedaría así:

```jsx title="src/components/ArticulosFamilias.jsx"
import React, {useState, useEffect} from 'react';
import { articulosFamiliasMockService } from '../services/articulosFamilias-mock-service';

function ArticulosFamilias() {
  const tituloPagina = 'ArticulosFamilias';
  const [articulosFamilias, setArticulosFamilias] = useState(null);
  
  // cargar al montar el componente (solo una vez)
  useEffect(() => {
    BuscarArticulosFamilas();
  }, []);
  
  async function BuscarArticulosFamilas() {
    let data = await articulosFamiliasMockService.Buscar();
    setArticulosFamilias(data);
  };

  return (
    <div>
      <div className="tituloPagina">{tituloPagina}</div>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th style={{ width: "40%" }}>IdArticuloFamilia</th>
            <th style={{ width: "60%" }}>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {articulosFamilias &&
            articulosFamilias.map((articulofamilia) => (
              <tr key={articulofamilia.IdArticuloFamilia}>
                <td>{articulofamilia.IdArticuloFamilia}</td>
                <td>{articulofamilia.Nombre}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );

}

export default ArticulosFamilias;
```

**Observe**:
- Dentro del hook `useEffect` no llamamos directamente al servicio porque al ser asíncrono recibimos una advertencia del compilador.
- El hook `useEffect` se ejecuta solo una vez al montar el componente debido a su dependencia vacía: `[]`.

>Los efectos en React son código que se ejecuta después del _render_. **Es decir, se aplican después de que el componente se monte y se ejecute el primer _render_**. El código de los efectos en React también puede ser ejecutado a continuación de la actualización de un componente, ya sea porque se ha cambiado el estado o las _props_.
>https://keepcoding.io/blog/efectos-en-react/

