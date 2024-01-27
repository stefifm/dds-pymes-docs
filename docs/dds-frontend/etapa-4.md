---
sidebar_position: 5
---

# Etapa 4

## Componente Articulos

A continuación crearemos el siguiente componente (página) de nuestra aplicación: `Articulos` que como dijimos inicialmente nos brinda la funcionalidad de un **ABMC (Alta, Baja, Modificaciones y Consultas)** sobre los datos de la tabla Artículos. Pensando en la estructura de nuestro componente debido a que tendrá mayor complejidad que el componente anterior `ArticulosFamilias`, comenzaremos con un diseño conceptual del mismo que estará representado en el siguiente gráfico:

![Articulos](/img/abm-etapa4.png)

Como vemos la estructura propuesta incluye:
- Un componente contenedor llamado `Articulos.jsx` el cual estará encargado de gestionar los estados, la funcionalidad necesaria para el ABMC y una interface visual mínima que incluye el título de la página.
- Y tres componentes hijos
  1. `ArticulosBuscar.jsx` que permitirá filtrar la búsqueda de los Artículos según un par de parámetros: Nombre (descripcion del articulo) y Activo (booleano que indica si el artículo está activo o no, se usa para la baja lógica)
  2. `ArticulosListado.jsx` que permitirá mostrar en una tabla un resumen (algunos campos representativos) del resultado de la búsqueda según los parámetros establecidos en el componente anterior (componente hermano). Aquí se incluye también: un contador de registros que cumplen la condición de filtrado, un paginador, un botón imprimir y un mensaje para avisar cuando no se encuentren resultados según el criterio establecido.
  3. `ArticulosRegistro` que permitirá ver todos los campos de un determinado registro seleccionado, los cuales podrán ser "Consultados" o "Modificados" y también esta misma interface se usará para dar de "Alta" un nuevo registro.

Comenzaremos creando una versión estática de los componentes y luego le iremos agregando funcionalidad, todo dentro de una carpeta dentro de components llamada igual que el componente `articulos`.

### Los componentes hijos: ArticulosBuscar y ArticulosListado

Creamos el componente `ArticulosBuscar` mediante el archivo `src/components/articulos/ArticulosBuscar.jsx` con el siguiente código:

```jsx title="src/components/articulos/ArticulosBuscar.jsx"
import React from "react";
export default function ArticulosBuscar ({Nombre, setNombre, Activo, setActivo, Buscar, Agregar}) {

    return (
    <form name="FormBusqueda">
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-4 col-md-2">
            <label className="col-form-label">Nombre:</label>
          </div>
          <div className="col-sm-8 col-md-4">
            <input
              type="text"
              className="form-control"
              onChange={(e) => setNombre(e.target.value)}
              value={Nombre}
              maxLength="55"
              autoFocus
            />
          </div>
          <div className="col-sm-4 col-md-2">
            <label className="col-form-label">Activo:</label>
          </div>
          <div className="col-sm-8 col-md-4">
            <select
              className="form-control"
              onChange={(e) => setActivo(e.target.value)}
              value={Activo}
            >
              <option value={""}></option>
              <option value={false}>NO</option>
              <option value={true}>SI</option>
            </select>
          </div>
        </div>
  
        <hr />
  
        {/* Botones */}
        <div className="row">
          <div className="col text-center botones">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => Buscar(1) }
          >
            <i className="fa fa-search"> </i> Buscar
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => Agregar() }
          >
            <i className="fa fa-plus"> </i> Agregar
          </button>
          </div>
        </div>
      </div>
    </form>
    )
  };
```

**Observe**:
- Este componente recibe como parámetros dos estados: `Nombre` y `Activo` y dos funciones `Buscar` y `Agregar` que serán provistas por su componente padre `Articulos`
- La técnica ("formularios controlados") usada para enlazar los estados con los campos del formulario, que es mediante la propiedad `value` de los campos y la función `onChange` que se ejecuta cada vez que se modifica el valor del campo.
- Creamos el componente `ArticulosListado` mediante el archivo `src/components/articulos/ArticulosListado.jsx` con el siguiente código:

```jsx title="src/components/articulos/ArticulosListado.jsx"
import React from "react";
import moment from "moment";

export default function ArticulosListado({
  Items,
  Consultar,
  Modificar,
  ActivarDesactivar,
  Imprimir,
  Pagina,
  RegistrosTotal,
  Paginas,
  Buscar,
}) {
  return (
    <div className="table-responsive">
      <table className="table table-hover table-sm table-bordered table-striped">
        <thead>
          <tr>
            <th className="text-center">Nombre</th>
            <th className="text-center">Precio</th>
            <th className="text-center">Stock</th>
            <th className="text-center">Fecha de Alta</th>
            <th className="text-center">Activo</th>
            <th className="text-center text-nowrap">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Items &&
            Items.map((Item) => (
              <tr key={Item.IdArticulo}>
                <td>{Item.Nombre}</td>
                <td className="text-end">{Item.Precio}</td>
                <td className="text-end">{Item.Stock}</td>
                <td className="text-end">
                  {moment(Item.FechaAlta).format("DD/MM/YYYY")}
                </td>
                <td>{Item.Activo ? "SI" : "NO"}</td>
                <td className="text-center text-nowrap">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    title="Consultar"
                    onClick={() => Consultar(Item)}
                  >
                    <i className="fa fa-eye"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    title="Modificar"
                    onClick={() => Modificar(Item)}
                  >
                    <i className="fa fa-pencil"></i>
                  </button>
                  <button
                    className={
                      "btn btn-sm " +
                      (Item.Activo
                        ? "btn-outline-danger"
                        : "btn-outline-success")
                    }
                    title={Item.Activo ? "Desactivar" : "Activar"}
                    onClick={() => ActivarDesactivar(Item)}
                  >
                    <i
                      className={"fa fa-" + (Item.Activo ? "times" : "check")}
                    ></i>
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Paginador*/}
      <div className="paginador">
        <div className="row">
          <div className="col">
            <span className="pyBadge">Registros: {RegistrosTotal}</span>
          </div>
          <div className="col text-center">
            Pagina: &nbsp;
            <select
              value={Pagina}
              onChange={(e) => {
                Buscar(e.target.value);
              }}
            >
              {Paginas?.map((x) => (
                <option value={x} key={x}>
                  {x}
                </option>
              ))}
            </select>
            &nbsp; de {Paginas?.length}
          </div>

          <div className="col">
            <button className="btn btn-primary float-end" onClick={() => Imprimir()}>
              <i className="fa fa-print"></i>Imprimir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Observe**:
- Este componente recibe como parámetros los estados: `Items`, `RegistrosTotal`, `Pagina` y `Páginas` y las funciones `Buscar`, `Consultar`, `Modificar`, `ActivarDesactivar`, `Imprimir`, que serán provistas por su componente padre `Articulos`
- El formulario controlado de react que tiene los inputs de búsqueda de nombre y activo, y los botones de buscar y agregar.
- El uso de la librería `moment` para formatear la fecha de alta. (requiere que la instalemos con `npm install moment`)
- La técnica usada en la tabla de artículos en la columna Activo para que aparezca según el valor de la propiedad `item.Activo (true/false)` el texto SI/NO
  ```jsx
    <td>{Item.Activo ? "SI" : "NO"}</td>
  ```
- La técnica usada en la tabla de artículos en la columna `Acciones` para que aparezca según el valor de la propiedad `item.Activo (true/false)` el texto `Desactivar/Activar` y el icono `times/check` y otras similares.
- El modo de pasar el item actual como parámetro a las funciones `Consultar`, `Modificar` y `ActivarDesactivar`.

  ```jsx
    onClick={() => Consultar(Item)}
    ...
    onClick={() => Modificar(Item)}
    ...
    onClick={() => ActivarDesactivar(Item)}
  ```

### El componente hijo: ArticulosRegistro

Creamos el componente `ArticulosRegistro` mediante el archivo `src/components/articulos/ArticulosRegistro.jsx` con el siguiente código:

```jsx title="src/components/articulos/ArticulosRegistro.jsx"
import React from "react";

export default function ArticulosRegistro({
  AccionABMC,
  ArticulosFamilias,
  Item,
  Grabar,
  Volver,
}) {
  if (!Item) return null;
  return (
    <form>
      <div className="container-fluid">

        <fieldset disabled={AccionABMC === "C"}>

          {/* campo nombre */}
          <div className="row">
            <div className="col-sm-4 col-md-3 offset-md-1">
              <label className="col-form-label" htmlFor="Nombre">
                Nombre<span className="text-danger">*</span>:
              </label>
            </div>
            <div className="col-sm-8 col-md-6">
              <input
                type="text"
                name="Nombre"
                value={Item?.Nombre}
                autoFocus
                className="form-control "
              />
            </div>
          </div>

          {/* campo Precio */}
          <div className="row">
            <div className="col-sm-4 col-md-3 offset-md-1">
              <label className="col-form-label" htmlFor="Precio">
                Precio<span className="text-danger">*</span>:
              </label>
            </div>
            <div className="col-sm-8 col-md-6">
              <input
                type="number" 
                step=".01"
                name="Precio"
                value={Item.Precio}
                className= "form-control" 
              />
            </div>
          </div>

          {/* campo Stock */}
          <div className="row">
            <div className="col-sm-4 col-md-3 offset-md-1">
              <label className="col-form-label" htmlFor="Stock">
                Stock<span className="text-danger">*</span>:
              </label>
            </div>
            <div className="col-sm-8 col-md-6">
              <input
                type="number"
                name="Stock"
                value={Item.Stock}
                className="form-control"
              />
            </div>
          </div>

          {/* campo CodigoDeBarra */}
          <div className="row">
            <div className="col-sm-4 col-md-3 offset-md-1">
              <label className="col-form-label" htmlFor="CodigoDeBarra">
                Codigo De Barra<span className="text-danger">*</span>:
              </label>
            </div>
            <div className="col-sm-8 col-md-6">
              <input
                type="text"
                name="CodigoDeBarra"
                value={Item.CodigoDeBarra}
                className="form-control"
              />
            </div>
          </div>

          {/* campo idarticulofamilia */}
          <div className="row">
            <div className="col-sm-4 col-md-3 offset-md-1">
              <label className="col-form-label" htmlFor="IdArticuloFamilia">
                Familia<span className="text-danger">*</span>:
              </label>
            </div>
            <div className="col-sm-8 col-md-6">
              <select
                name="IdArticuloFamilia"
                className="form-control"
			value = {Item?.IdArticuloFamilia}
              >
                <option value="" key={1}></option>
                {ArticulosFamilias?.map((x) => (
                  <option value={x.IdArticuloFamilia} key={x.IdArticuloFamilia}>
                    {x.Nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* campo FechaAlta */}
          <div className="row">
            <div className="col-sm-4 col-md-3 offset-md-1">
              <label className="col-form-label" htmlFor="FechaAlta">
                Fecha Alta<span className="text-danger">*</span>:
              </label>
            </div>
            <div className="col-sm-8 col-md-6">
              <input
                type="date"
                name="FechaAlta"
                className="form-control"
                    value={Item?.FechaAlta}
              />
            </div>
          </div>

          {/* campo Activo */}
          <div className="row">
            <div className="col-sm-4 col-md-3 offset-md-1">
              <label className="col-form-label" htmlFor="Activo">
                Activo<span className="text-danger">*</span>:
              </label>
            </div>
            <div className="col-sm-8 col-md-6">
              <select
                name="Activo"
                className="form-control"
			value = {Item?.Activo}
                disabled
              >
                <option value={null}></option>
                <option value={false}>NO</option>
                <option value={true}>SI</option>
              </select>
            </div>
          </div>

        </fieldset>

        {/* Botones Grabar, Cancelar/Volver' */}
        <hr />
        <div className="row justify-content-center">
          <div className="col text-center botones">
            {AccionABMC !== "C" && (
              <button type="submit" className="btn btn-primary">
                <i className="fa fa-check"></i> Grabar
              </button>
            )}
            <button
              type="button"
              className="btn btn-warning"
              onClick={() => Volver()}
            >
              <i className="fa fa-undo"></i>
              {AccionABMC === "C" ? " Volver" : " Cancelar"}
            </button>
          </div>
        </div>

        {/* texto: Revisar los datos ingresados... */}
        <div className="row alert alert-danger mensajesAlert">
          <i className="fa fa-exclamation-sign"></i>
          Revisar los datos ingresados...
        </div>

      </div>
    </form>
  );
}
```

**Observe**:

- Este componente recibe como parámetros los estados: `AccionABMC`, `ArticulosFamilias`, `Item` y las funciones `Grabar` y `Volver` que serán provistas por su componente padre `Articulos`
- Que los `inputs` Nombre,Precio,Stock y CodigoDeBarra tienen "temporalmente", el atributo `value` que se vincula al estado `Item`; y aun cuando arrojen un warning por consola, solo forma parte del boceto inicial del componente y más adelante será reemplazado por un método adecuado de enlace de datos. Por lo tanto los campos Familia, FechaAlta y Activo por ahora no están vinculados.
- Que los `inputs` y `selects` están deshabilitados cuando `AccionABMC` es `C` (consulta), gracias al contenedor `fieldset`
- El `div` con el mensaje de error: "Revisar los datos ingresados...", el mismo será usado más adelante cuando se implementen validaciones de datos.
- La técnica usada para generar las etiquetas options del `select` `ArticulosFamilias` con los datos traídos desde el servidor.

```jsx
{ArticulosFamilias?.map((x) => (
  <option value={x.IdArticuloFamilia} key={x.IdArticuloFamilia}>
    {x.Nombre}
  </option>
))}  
```

## El componente padre: Articulos

Ahora que tenemos los 3 componentes hijos creados, pasamos al componente padre que los contendrá. Creamos el componente `Articulos` mediante el archivo `src/components/articulos/Articulos.jsx` con el siguiente código:
  
```jsx title="src/components/articulos/Articulos.jsx"
import React, { useState, useEffect } from "react";
import moment from "moment";
import ArticulosBuscar from "./ArticulosBuscar";
import ArticulosListado from "./ArticulosListado";
import ArticulosRegistro from "./ArticulosRegistro";
import { articulosFamiliasMockService as articulosfamiliasService } from "../../services/articulosFamilias-mock-service";

function Articulos() {
  const TituloAccionABMC = {
    A: "(Agregar)",
    B: "(Eliminar)",
    M: "(Modificar)",
    C: "(Consultar)",
    L: "(Listado)",
  };
  const [AccionABMC, setAccionABMC] = useState("L");

  const [Nombre, setNombre] = useState("");
  const [Activo, setActivo] = useState("");

  const [Items, setItems] = useState(null);
  const [Item, setItem] = useState(null); // usado en BuscarporId (Modificar, Consultar)
  const [RegistrosTotal, setRegistrosTotal] = useState(0);
  const [Pagina, setPagina] = useState(1);
  const [Paginas, setPaginas] = useState([]);

  const [ArticulosFamilias, setArticulosFamilias] = useState(null);

  // cargar al "montar" el componente, solo la primera vez (por la dependencia [])
  useEffect(() => {
    async function BuscarArticulosFamilas() {
      let data = await articulosfamiliasService.Buscar();
      setArticulosFamilias(data);
    }
    BuscarArticulosFamilas();
  }, []);

  async function Buscar() {
    alert("Buscando...");
    // harcodeamos 2 articulos para probar
    setItems([
      {
        IdArticulo: 108,
        Nombre: "Adaptador usb wifi tl-wn722n",
        Precio: 219.0,
        CodigoDeBarra: "0693536405046",
        IdArticuloFamilia: 9,
        Stock: 898,
        FechaAlta: "2017-01-23T00:00:00",
        Activo: false,
      },
      {
        IdArticulo: 139,
        Nombre: "Aire acondicionado daewoo 3200fc dwt23200fc",
        Precio: 5899.0,
        CodigoDeBarra: "0779816944014",
        IdArticuloFamilia: 7,
        Stock: 668,
        FechaAlta: "2017-01-04T00:00:00",
        Activo: true,
      },
    ]);
  }

  async function BuscarPorId(item, accionABMC) {
    setAccionABMC(accionABMC);
    setItem(item);
    if (accionABMC === "C") {
      alert("Consultando...");
    }
    if (accionABMC === "M") {
      alert("Modificando...");
    }
  }

  function Consultar(item) {
    BuscarPorId(item, "C"); // paso la accionABMC pq es asincrono la busqueda y luego de ejecutarse quiero cambiar el estado accionABMC
  }
  function Modificar(item) {
    if (!item.Activo) {
      alert("No puede modificarse un registro Inactivo.");
      return;
    }
    BuscarPorId(item, "M"); // paso la accionABMC pq es asincrono la busqueda y luego de ejecutarse quiero cambiar el estado accionABMC
  }

  function Agregar() {
    setAccionABMC("A");
    alert("preparando el Alta...");
  }

  function Imprimir() {
    alert("En desarrollo...");
  }

  async function ActivarDesactivar(item) {
    const resp = window.confirm(
      "Está seguro que quiere " +
        (item.Activo ? "desactivar" : "activar") +
        " el registro?"
    );
    if (resp) {
      alert("Activando/Desactivando...");
    }
  }

  async function Grabar(item) {
    alert(
      "Registro " +
        (AccionABMC === "A" ? "agregado" : "modificado") +
        " correctamente."
    );

    Volver();
  }

  // Volver/Cancelar desde Agregar/Modificar/Consultar
  function Volver() {
    setAccionABMC("L");
  }

  return (
    <div>
      <div className="tituloPagina">
        Articulos <small>{TituloAccionABMC[AccionABMC]}</small>
      </div>

      <ArticulosBuscar
        Nombre={Nombre}
        setNombre={setNombre}
        Activo={Activo}
        setActivo={setActivo}
        Buscar={Buscar}
        Agregar={Agregar}
      />

      {/* Tabla de resutados de busqueda y Paginador */}
      <ArticulosListado
        {...{
          Items,
          Consultar,
          Modificar,
          ActivarDesactivar,
          Imprimir,
          Pagina,
          RegistrosTotal,
          Paginas,
          Buscar,
        }}
      />

      <div className="alert alert-info mensajesAlert">
        <i className="fa fa-exclamation-sign"></i>
        No se encontraron registros...
      </div>

      {/* Formulario de alta/modificacion/consulta */}
      <ArticulosRegistro
        {...{ AccionABMC, ArticulosFamilias, Item, Grabar, Volver }}
      />
    </div>
  );
}
export { Articulos };
```

**Observe**:
- En la función `Buscar`, hemos hardcodeado el estado `Items` para simular datos y probar el componente `ArticulosListado.js`, luego generamos el servicio para buscar los artículos usaremos datos reales del servidor.
- Observe la sintaxis usada para pasar los parametros al Componente `ArticulosBuscar` vs la usada para pasar los parámetros a los componentes  `ArticulosListado` y `ArticulosRegistro`, la cual es mas simple gracias al uso del operador de propagación de javascript

Para poder utilizar el componente Articulos.jsx en la aplicación:

1. Debemos importarlo en el componente `App.js` para luego poder agregarlo al ruteo correspondiente en el return de la función `App()`
  ```jsx title="src/App.js"
    import { Articulos } from "./Articulos";
    // ...resto del código 
    <Route path="/articulos" element={<Articulos/>} />
  ```
2. Y finalmente agregamos un enlace en el componente Menu.js para que el usuario pueda acceder a la página de Artículos.
   
  ```jsx title="src/components/Menu.js"
    <li className="nav-item">
      <NavLink className="nav-link" to="/articulos">
        Articulos
      </NavLink>
    </li>
   ```

Ahora pruebe la aplicación y verifique que el componente `Articulos.jsx` renderice correctamente a sus componentes hijos y responda adecuadamente a los eventos del ABMC.

Inicialmente todos los componentes hijos de Articulos están visibles, pero a continuación modificaremos el html que cada componente se muestre cuando corresponda, para lo cual nos basaremos en la acción actual del ABMC indicado por el estado AccionABMC.

Hacemos los siguientes cambios en el componente `Articulos.jsx`:
reemplazamos:
``` jsx
<Articulosbuscar ...>
```

por:
```jsx
{AccionABMC === "L" && <ArticulosBuscar ...> }
```

reemplazamos:
```jsx
<ArticulosListado ...>
```

por:
```jsx
{AccionABMC === "L" && Items?.length > 0 && <ArticulosListado ...> }
```

reemplazamos:
```jsx
<div className="alert alert-info mensajesAlert">... </div>
```

por:
```jsx
{AccionABMC === "L" && Items?.length === 0 && <div className="alert alert-info mensajesAlert">... </div> }
```

reemplazamos:
```jsx
<ArticulosRegistro ...>
```

por:
```jsx
{AccionABMC !== "L" && <ArticulosRegistro ...> }
```

Verifique que el componente `Articulos.js` renderice solo los componentes según la acción que se esté ejecutando y responde adecuadamente a cambios en el estado del ABMC.
