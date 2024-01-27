---
sidebar_position: 8
---

# Etapa 7

## Servicio/Componente ModalDialog

Vamos a implementar un servicio y un componente asociado, que nos permitirá ejecutar funcionalidad desde los diferentes componentes y/o servicios de nuestra aplicación. El mismo ofrecerá 3 funcionalidades:

- `Alert()`: similar al `alert()` de javascript pero con bootstrap y en modo asíncrono
- `Confirm()`: similar al `confirm()` de javascript pero con bootstrap y en modo asíncrono
- `Bloquear/DesbloquearPantalla()`: formulario modal que evitará que un usuario del sistema llame 2 veces a la misma acción, pensando que no funcionó. Para lo cual se bloqueará la interface html hasta que se complete dicha acción. Un caso típico podría ser clickear 2 veces el botón grabar porque el servidor está lento y el usuario no tiene una retroalimentación de que la acción ya está en curso y tiene que esperar a que termine su ejecución.

### Componente ModalDialog

Crearemos la interface visual que estará asociada a nuestro servicio, para lo cual crearemos el componente: components/ModalDialog.jsx

```jsx title="src/components/ModalDialog.jsx"
import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import modalDialogService from "../services/modalDialog.service";


function ModalDialog() {
  const [mensaje, setMensaje] = useState("");
  const [titulo, setTitulo] = useState("");
  const [boton1, setBoton1] = useState("");
  const [boton2, setBoton2] = useState("");
  const [accionBoton1, setAccionBoton1] = useState(null);
  const [accionBoton2, setAccionBoton2] = useState(null);
  const [tipo, setTipo] = useState("");


  const handleAccionBoton1 = () => {
    if (accionBoton1) {
      accionBoton1();
    }
    setMensaje((x) => (x = ""));
  };
  const handleAccionBoton2 = () => {
    if (accionBoton2) {
      accionBoton2();
    }
    setMensaje((x) => (x = ""));
  };


  const handleClose = () => {
    setMensaje((x) => (x = ""));
  };


  function Show(
    // cuidado en esta funcion cuando se invoca desde el servicio modalDialogService
    //   NO tiene las variables de state del componente, ej mensaje, titulo, boton1....
    //   pero SI a las funciones setMensaje, setTitulo, setBoton1....
    _mensaje,
    _titulo,
    _boton1,
    _boton2,
    _accionBoton1,
    _accionBoton2,
    _tipo
  ) {
    setMensaje((x) => (x = _mensaje));
    setTitulo((x) => (x = _titulo));
    setBoton1((x) => (x = _boton1));
    setBoton2((x) => (x = _boton2));
    setAccionBoton1(() => _accionBoton1);
    setAccionBoton2(() => _accionBoton2);
    setTipo((x) => (x = _tipo));
  }


  useEffect(() => {
    //suscribirse al servicio modalDialogService al iniciar el componente
    modalDialogService.subscribeShow(Show);
    return () => {
      //desuscribirse al servicio modalDialogService al desmontar el componente
      modalDialogService.subscribeShow(null);
    };
  }, []);


  let classHeader = "";
  let faIcon = "";
  switch (tipo) {
    case "success":
      classHeader = "bg-success";
      faIcon = "fa-regular fa-circle-check";
      break;
    case "danger":
      classHeader = "bg-danger";
      faIcon = "fa-solid fa-triangle-exclamation";
      break;
    case "info":
      classHeader = "bg-info";
      faIcon = "fa-solid fa-circle-info";
      break;
    case "warning":
      classHeader = "bg-warning";
      faIcon = "fa-solid fa-triangle-exclamation";
      break;
    default:
      classHeader = "bg-success";
      break;
  }


  if (mensaje === "") return null;


  return (
    <>
      <Modal
        show
        onHide={handleClose}
        backdrop="static"
        keyboard={mensaje === "BloquearPantalla" ? false : true}
      >
        <Modal.Header
          className={classHeader}
          closeButton={mensaje !== "BloquearPantalla"}
        >
          <Modal.Title>{titulo}</Modal.Title>
        </Modal.Header>


        <Modal.Body style={{ fontSize: "1.2em" }}>
          {mensaje === "BloquearPantalla" ? (
            <div className="progress">
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                aria-valuenow="100"
                aria-valuemin="0"
                aria-valuemax="100"
                style={{ flex: 1 }}
              ></div>
            </div>
          ) : (
            <p>
              <i
                style={{ fontSize: "1.6em", margin: "0.5em" }}
                className={faIcon}
              ></i>
              {mensaje}
            </p>
          )}
        </Modal.Body>


        <Modal.Footer>
          {boton1 !== "" && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAccionBoton1}
            >
              {boton1}
            </button>
          )}
          {boton2 !== "" && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleAccionBoton2}
            >
              {boton2}
            </button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}


export default ModalDialog;
```

**Observe**: 
- Que el servicio hace uso de la librería `react-bootstrap` que deberá instalar; está librería ofrece un conjunto de componentes visuales basados en bootstrap (para mayor info vea: https://react-bootstrap.github.io), en nuestro caso particular usaremos un formulario modal.

### Servicio ModalDialog

Crearemos un servicio llamado services/ModalDialog.js y le asignaremos el siguiente código:

```js title="src/services/ModalDialog.js"
let ModalDialog_Show = null;  //apunta a la funcion show del componente ModalDialog


const Alert = (
  _mensaje,
  _titulo = "Atención",
  _boton1 = "Aceptar",
  _boton2 = "",
  _accionBoton1 = null,
  _accionBoton2 = null,
  _tipo = 'info'
) => {
  if (ModalDialog_Show)
    ModalDialog_Show(
      _mensaje,
      _titulo,
      _boton1,
      _boton2,
      _accionBoton1,
      _accionBoton2,
      _tipo
    );
};


const Confirm = (
  _mensaje,
  _titulo = "Confirmar",
  _boton1 = "Aceptar",
  _boton2 = "Cancelar",
  _accionBoton1 = null,
  _accionBoton2 = null,
  _tipo = 'warning'
) => {
  if (ModalDialog_Show)
    ModalDialog_Show(
      _mensaje,
      _titulo,
      _boton1,
      _boton2,
      _accionBoton1,
      _accionBoton2,
      _tipo
    );
};


let cntBloquearPantalla = 0;
const BloquearPantalla = (blnBloquear) => {
  if (blnBloquear) {
    cntBloquearPantalla++;
  } else {
    cntBloquearPantalla--;
  }
  if (ModalDialog_Show) {
    if (cntBloquearPantalla === 1) {
      ModalDialog_Show(
        "BloquearPantalla",
        "Espere por favor...",
        "",
        "",
        null,
        null,
        'info'
      );
    }
    if (cntBloquearPantalla === 0) {
      ModalDialog_Show("", "", "", "", null, null);
    }
  }
};


const subscribeShow = (_ModalDialog_Show) => {
  ModalDialog_Show = _ModalDialog_Show;
};


const modalDialogService = { Alert, Confirm, BloquearPantalla, subscribeShow };


export default modalDialogService;
```

**Observe**:
- La funcionalidad `Alert`
- La funcionalidad `Confirm`
- La funcionalidad `BloquearPantalla`

### Implementación en el componente ModalDialog

Terminando la configuración y para dejar disponible el componente `ModalDialog` que será manipulado mediante el servicio `ModalDialogService` lo incorporamos al html de nuestro componente `App.js`, poniéndolo arriba del componente `Menu`
  
```jsx title="src/App.js"
//  ..... resto del código
    <ModalDialog/>
    <Menu />
```

Ahora haremos uso del servicio/componente recién definido, en el componente `Articulos`, importamos el servicio:
  
```jsx title="src/components/Articulos.jsx"
import modalDialogService from "../../services/modalDialog.service";
```

reemplazamos los `alert` de javascript por los la función `Alert` provista por el nuevo servicio, por ej:

Reemplazar:

```jsx title="src/components/Articulos.jsx"
alert("No puede modificarse un registro Inactivo.");
```

por:

```jsx title="src/components/Articulos.jsx"
modalDialogService.Alert("No puede modificarse un registro Inactivo.");
```

Reemplazamos los `confirm` de javascript por la función `Confirm` provista por el nuevo servicio, haciendo las adaptaciones necesarias, por ej:

Reemplazar:

```jsx title="src/components/Articulos.jsx"
    const resp = window.confirm(
      "Esta seguro que quiere " +
        (item.Activo ? "desactivar" : "activar") +
        " el registro?"
    );
    if (resp) {
      await articulosService.ActivarDesactivar(item);
      await Buscar();
    }
```

por:

```jsx title="src/components/Articulos.jsx"
modalDialogService.Confirm(
      "Esta seguro que quiere " +
        (item.Activo ? "desactivar" : "activar") +
        " el registro?",
      undefined,
      undefined,
      undefined,
      async () => {
        await articulosService.ActivarDesactivar(item);
        await Buscar();
      }
    );

```

Usar la función `BloquearPantalla()` del servicio para evitar que se llame más de una vez a la misma acción por error (se da generalmente cuando estamos esperando la respuesta del servidor, pero nos parece que no funcionó el click) . En este caso la usaremos para el botón `Buscar` del `FormBusqueda` que trae los datos del servidor. Para lo cual haga la siguientes modificaciones en la función `Buscar()` del componente `Articulos.jsx`

```jsx title="src/components/Articulos.jsx"
async function Buscar(_pagina) {
    if (_pagina && _pagina !== Pagina) {
      setPagina(_pagina);
    }
    // OJO Pagina (y cualquier estado...) se actualiza para el proximo render, para buscar usamos el parametro _pagina
    else {
      _pagina = Pagina;
    }
    modalDialogService.BloquearPantalla(true);
    const data = await articulosService.Buscar(Nombre, Activo, _pagina);
    modalDialogService.BloquearPantalla(false);

    setItems(data.Items);
    setRegistrosTotal(data.RegistrosTotal);


    //generar array de las paginas para mostrar en select del paginador
    const arrPaginas = [];
    for (let i = 1; i <= Math.ceil(data.RegistrosTotal / 10); i++) {
      arrPaginas.push(i);
    }
    setPaginas(arrPaginas);
  }
```

## Interceptor de Axios

Ahora iremos un paso más allá implementado el `BloquearPantalla` para que se ejecute siempre que ejecutemos una comunicación con el servidor (llamada ajax). Lo hacemos mediante un interceptor que nos provee la librería `Axios`. Para cumplir nuestro objetivo vamos a crear un servicio que nos proveerá la funcionalidad de la librería `Axios` con la configuración necesaria para que antes de cada petición ajax y después de la misma invoque a la funcionalidad `BloquearPantalla`. Entonces vamos a crear el servicio: `services/http.service.js`, con el siguiente código:
  
```js title="src/services/http.service.js"
import axios from "axios";
import modalService from "./modalDialog.service";


const httpService = axios.create({
  headers: {
    "Content-type": "application/json",
  },
});


httpService.interceptors.request.use(
  (request) => {
    modalService.BloquearPantalla(true);
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) {
      request.headers["Authorization"] = "Bearer " + accessToken;
    }
    return request;
  },
  (error) => {
    console.log("error en axios request", error);
    return Promise.reject(error);
  }
);


httpService.interceptors.response.use(
  (response) => {
    modalService.BloquearPantalla(false);
    return response;
  },
  (error) => {
    // loguear el error
    console.log("error en axios response ", error);
    modalService.BloquearPantalla(false);


    if (error.response.status === 401) {
      // no auntenticado
      error.message = "debe loguearse para acceder a esta funcionalidad";
    } else if (error.response.status === 403) {
      // no auntenticado
      error.message = "usuario no autorizado para acceder a esta funcionalidad";
    } else {
      error.message =
        error?.response?.data?.message ??
        "Actualmente tenemos inconvenientes en el servidor, por favor intente más tarde";
    }
    modalService.Alert(error.message);


    return Promise.reject(error);


    //return error
    //throw new Error(error?.response?.data?.Message ?? 'Ocurrio un error');
  }
);


export default httpService;
```

**Observe**:
- Se hace uso de una funcionalidad ofrecida por axios llamada interceptor
- Invocamos `BloquearPantalla(true)` antes de cada petición, para bloquear la pantalla.
- Invocamos `BloquearPantalla(false)` después de cada petición (tanto para las respuestas correctas o con error), para desbloquear la pantalla.
- Estamos incluyendo algunos elementos de seguridad que en la próxima etapa terminaremos de implementar.

### Implementación de la nueva funcionalidad

Finalmente en nuestro código podemos reemplazar el uso habitual que hacíamos de la librería `Axios`, por este nuevo servicio que es análogo salvo que agrega la funcionalidad de `BloquearPantalla` en forma automática.

Por ejemplo, si lo implementamos en el servicio `articulos.service.js`, quedaría de la siguiente manera:

```js title="src/services/articulos.service.js"
import httpService from "./http.service";


const urlResource = "https://labsys.frc.utn.edu.ar/dds-express/api/articulos";


async function Buscar(Nombre, Activo, Pagina) {
  const resp = await httpService.get(urlResource, {
    params: { Nombre, Activo, Pagina },
  });
  return resp.data;
}


async function BuscarPorId(item) {
  const resp = await httpService.get(urlResource + "/" + item.IdArticulo);
  return resp.data;
}


async function ActivarDesactivar(item) {
  await httpService.delete(urlResource + "/" + item.IdArticulo);
}


async function Grabar(item) {
  if (item.IdArticulo === 0) {
    await httpService.post(urlResource, item);
  } else {
    await httpService.put(urlResource + "/" + item.IdArticulo, item);
  }
}


export const articulosService = {
  Buscar,BuscarPorId,ActivarDesactivar,Grabar
};
```
