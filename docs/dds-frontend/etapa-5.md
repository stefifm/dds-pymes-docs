---
sidebar_position: 6
---
# Etapa 5

## Funcionalidades del ABMC

En esta etapa comenzaremos a completar las funcionalidades del ABMC de artículos, para lo cual vamos a crear el servicio de artículos que nos permitirá consumir los datos de la webapi expuesta por el backend. Inicialmente nos hará falta instalar la librería axios para poder realizar las peticiones http al servidor, para lo cual ejecutamos el siguiente comando en la consola:

```bash
npm install axios
```

:::tip[Nota]
  En stackblitz por compatibilidad usar axios@0.27
:::

## Creando los servicios de Artículos y ArtículosFamilias

Seguidamente creamos el archivo `articulos.service.js` en la carpeta services y agregamos el siguiente codigo:

```js title="src/services/articulos.service.js"
import axios from "axios";

const urlResource = "https://labsys.frc.utn.edu.ar/dds-express/api/articulos";

async function Buscar(Nombre, Activo, Pagina) {
  const resp = await axios.get(urlResource, {
    params: { Nombre, Activo, Pagina },
  });
  return resp.data;
}

async function BuscarPorId(item) {
  const resp = await axios.get(urlResource + "/" + item.IdArticulo);
  return resp.data;
}

async function ActivarDesactivar(item) {
  await axios.delete(urlResource + "/" + item.IdArticulo);
}

async function Grabar(item) {
  if (item.IdArticulo === 0) {
    await axios.post(urlResource, item);
  } else {
    await axios.put(urlResource + "/" + item.IdArticulo, item);
  }
}

export const articulosService = {
  Buscar,BuscarPorId,ActivarDesactivar,Grabar
};
```

**Observe**:
- La correcta configuración de la url del recurso.
- Que el servicio ofrece todas las funciones necesarias para el ABMC.

Análogamente al servicio de artículos, creamos el servicio de articulosFamilias en el archivo articulosFamilias.service.js y agregamos el siguiente código:

```js title="src/services/articulosFamilias.service.js"
import axios from "axios";

const urlResource = "https://labsys.frc.utn.edu.ar/dds-express/api/articulosfamilias";

async function Buscar() {
  const resp = await axios.get(urlResource);
  return resp.data;
}

export const articulosfamiliasService = {
  Buscar
};
```
**Observe**:
- La correcta configuración de la url del recurso.
que el servicio es una versión simplificada del mismo ya que solo ofrece la función Buscar.
- El mismo será usado indirectamente (mediante props) por componente `ArticulosRegistro.js` para cargar el combo de `articulosFamilias`.

## Implementando las funcionalidades del ABMC

Ahora vamos a completar las funcionalidades del ABMC de artículos, completando los siguiente pasos:

1. Primero que todo, al inicio en el componente Articulos.jsx importamos los servicios de articulos.service y articulosFamilias.service y comentamos el import de articulosFamiliasMockService.

  ```jsx title="src/components/articulos/Articulos.jsx"
  //import { articulosFamiliasMockService as articulosfamiliasService } from "../../services/articulosFamilias-mock-service";
  import { articulosService } from "../../services/articulos.service";
  import { articulosfamiliasService } from "../../services/articulosFamilias.service";
  ```
2. Traer datos del servidor para cargar el combo en el componente `ArticulosRegistro.js`. En el componente Articulos.js agregamos el siguiente código:
  
  ```jsx title="src/components/articulos/Articulos.jsx"
  useEffect(() => {
    async function BuscarArticulosFamilas() {
      let data = await articulosfamiliasService.Buscar();
      setArticulosFamilias(data);
    }
    BuscarArticulosFamilas();
  }, []);
  ```
**Observe**:
- Este código solo se ejecuta una sola vez

### Funcionalidad Buscar:

En el componente Articulos.jsx completamos la función Buscar, su nuevo código será:

```jsx title="src/components/articulos/Articulos.jsx"
async function Buscar(_pagina) {
    if (_pagina && _pagina !== Pagina) {
      setPagina(_pagina);
    }
    // OJO Pagina (y cualquier estado...) se actualiza para el proximo render, para buscar usamos el parametro _pagina
    else {
      _pagina = Pagina;
    }

    const data = await articulosService.Buscar(Nombre, Activo, _pagina);
    setItems(data.Items);
    setRegistrosTotal(data.RegistrosTotal);

    //generar array de las páginas para mostrar en select del paginador
    const arrPaginas = [];
    for (let i = 1; i <= Math.ceil(data.RegistrosTotal / 10); i++) {
      arrPaginas.push(i);
    }
    setPaginas(arrPaginas);
  }
```

**Observe**:
- El parámetro `_pagina` nos permitirá implementar la paginación de los resultados de la búsqueda en el servidor.
- Cómo se genera un array que representa las páginas a mostrar en el paginador.

### Funcionalidad BuscarPorId

En el componente `Articulos.jsx` completamos la función `BuscarPorId`, haremos uso de la librería `moment` para el manejo de fechas, que necesitaremos importar en el componente (lo dejamos como ejercicio para el lector).

El nuevo código de la función será:
  
```jsx title="src/components/articulos/Articulos.jsx"
async function BuscarPorId(item, accionABMC) {
  const data = await articulosService.BuscarPorId(item);
  setItem(data);
  setAccionABMC(accionABMC);
}
```

**Observe**:
- Cuando se recibe el json del servidor el campo fecha llega desde la webapi convertido en string con el formato ISO 8601 y es adecuado para el `input type date`.

### Funcionalidad Activar/Desactivar

En el componente `Articulos.jsx` completamos la función `ActivarDesactivar`, la cual es una implementación particular de una baja lógica..

El nuevo código de la función será:

```jsx title="src/components/articulos/Articulos.jsx"

async function ActivarDesactivar(item) {
  const resp = window.confirm(
    "Está seguro que quiere " +
      (item.Activo ? "desactivar" : "activar") +
      " el registro?"
  );
  if (resp) {
    await articulosService.ActivarDesactivar(item);
    await Buscar();
  }
}
```

**Observe**:
- Que el método `ActivarDesactivar()` del servicio cambia el estado `Activo` del registro seleccionado invirtiendo su valor.

### Funcionalidad Grabar

En el componente `Articulos.jsx` completamos la función `Grabar`, la cual es usada tanto para grabar el alta como la modificación de un registro.

El nuevo código de la función será:

```jsx title="src/components/articulos/Articulos.jsx"
async function Grabar(item) {
  // agregar o modificar
  try
  {
    await articulosService.Grabar(item);
  }
  catch (error)
  {
    alert(error?.response?.data?.message ?? error.toString())
    return;
  }
  await Buscar();
  Volver();

  setTimeout(() => {
    alert(
      "Registro " +
        (AccionABMC === "A" ? "agregado" : "modificado") +
        " correctamente."
    );
  }, 0);
}
```

**Observe**:
- Esta función no podrá ser ejecutada hasta que en la siguiente etapa se implementa el formulario controlado para el componente `ArticulosRegistro`, que es quien la invocara con el parámetro adecuado; por lo que hasta este momento no funcionara la edición de los campos (inputs y selects), dejando inconclusa la funcionalidad de `Agregar` y `Modificar` del ABMC.
- Que antes de enviar el registro al servidor la fecha que estaba en formato string con el formato `dd/MM/yyyy` se convierte a string formato ISO 8601 como vino inicialmente desde el servidor en el método `BuscarPorId()`.
- Que se llama la función `alert()` con un `setTimeout()` de 0 milisegundos para que se ejecute luego de que se actualice el estado de la UI.

### Funcionalidad Agregar

Ya completando nuestro ABMC, pasamos a la función `Agregar`, la cual se encarga de inicializar el estado del componente para que se muestre el componente `ArticulosRegistro`, con los campos vacíos para que el usuario pueda ingresar los datos del nuevo registro.

El nuevo código de la función será:

```jsx title="src/components/articulos/Articulos.jsx"
function Agregar() {
    setAccionABMC("A");
    setItem({
      IdArticulo: 0,
      Nombre: null,
      Precio: null,
      Stock: null,
      CodigoDeBarra: null,
      IdArticuloFamilia: null,
      FechaAlta: moment(new Date()).format("YYYY-MM-DD"),
      Activo: true,
    });
  }
```

**Observe**:
- Que se inicializa la propiedad `Fecha` de `Item` con la fecha actual.
- Que se inicializa la propiedad `Activo` de `Item` en true y como veremos más adelante este campo es solo de lectura, ya que la única forma que permitimos modificarlo es a través de la función `ActivarDesactivar()`.
