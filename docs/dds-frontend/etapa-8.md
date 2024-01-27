---
sidebar_position: 9
---

# Etapa 8

## Seguridad JWT

En está etapa implementaremos en nuestro frontend componentes que estarán protegidos con seguridad mediante Json Web Token, verificando autenticación y autorización. 

Para lograrlo nos valdremos de los siguientes elementos: 

1. Un servicio que llamaremos `auth.service.js`, que nos ofrecerá la funcionalidad de `login`, `logout` e identificación del usuario logueado.  
2. Un componente `login.jsx` y su respectivo archivo de estilo, que serán la interface visual del servicio anterior.
3. Un componente auxiliar que llamaremos `RequireAuth`, que nos servirá para “envolver” a los componentes de nuestra aplicación, a los cuales queramos acceder exigiendo autenticación y autorización, es decir todos los componentes que no sean públicos.
4. Componente seguro
   - Un componente con seguridad: `ArticulosJWT` que carga un listado de articulos provenientes de una webapi con seguridad JWT: https://labsys.frc.utn.edu.ar/dds-express/api/jwt/articulos
   - El servicio correspondiente al componente con seguridad: `articulosJWT.service.js`

### Código de services/auth.service.js:

```js title="src/services/auth.service.js"
import httpService from "./http.service";
import modalService from "./modalDialog.service";

const urlServidor = https://labsys.frc.utn.edu.ar/dds-express

const login = async (usuario, clave, navigateToComponent) => {
  let resp = await httpService.post(urlServidor + "/api/login", {
    usuario,
    clave,
  });


  if (resp.data?.accessToken) {
    sessionStorage.setItem("usuarioLogueado", usuario);
    sessionStorage.setItem("accessToken", resp.data.accessToken);
    sessionStorage.setItem("refreshToken", resp.data.refreshToken);
    if (CambioUsuarioLogueado) CambioUsuarioLogueado(usuario);
    {
      //navigate("/Inicio");
     navigateToComponent();
    }
   
  } else {
    if (CambioUsuarioLogueado) CambioUsuarioLogueado(null);
    //alert("Usuario o clave incorrectos");
    modalService.Alert("Usuario o clave incorrectos");
  }
};


const logout = () => {
  sessionStorage.removeItem("usuarioLogueado");
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  if (CambioUsuarioLogueado) CambioUsuarioLogueado(null);
};


const getUsuarioLogueado = () => {
  return sessionStorage.getItem("usuarioLogueado");
};


let CambioUsuarioLogueado = null;
const subscribeUsuarioLogueado = (x) => (CambioUsuarioLogueado = x);

const AuthService = {
  login,
  logout,
  getUsuarioLogueado,
  subscribeUsuarioLogueado
};

export default AuthService;
```

### Código de components/login/login.jsx:

```jsx title="src/components/login/login.jsx"

import React, { useState, useEffect } from "react";
import "./Login.css"; //css global
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import AuthService from "../../services/auth.service";


export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const navigate = useNavigate();
  const {componentFrom} = useParams();


  const navigateToComponent = () => {
    navigate(`/${componentFrom}`);
  };


  const handleIngresar = async () => {
    //AuthService.login(usuario, clave, navigate);
    AuthService.login(usuario, clave, navigateToComponent);
  };




  useEffect(() => {
    // lo primero que hacemos al ingresar al login es desloguearnos
    // borrando los datos de sessionStorage y el state usuarioLogueado
    AuthService.logout();
  });


  return (
    <>
    <div className="divbody text-center">
      <main className="form-signin w-100 m-auto">
        <form className="p-5">
          <img
            className="mb-4"
            src="https://getbootstrap.com/docs/5.2/assets/brand/bootstrap-logo.svg"
            alt=""
            width="72"
            height="57"
          />
          <h1 className="h3 mb-3 fw-normal">Por favor ingrese</h1>


          <div className="form-floating">
            <input
              type="text"
              autoComplete="off"
              placeholder="usuario"
              onChange={(e) => setUsuario(e.target.value)}
              value = {usuario}
              autoFocus
              className="form-control"
              id="usuario"
            />
            <label className="custom-control" for="usuario">
              Usuario
            </label>
          </div>
          <div className="form-floating">
            <input
             type="password"
             autoComplete="off"
             placeholder="Clave"
             onChange={(e) => setClave(e.target.value)}
             value = {clave}
             className="form-control"
             id="clave"
       
            />
            <label className="custom-control" for="clave">
              Clave
            </label>
          </div>


          <div className="checkbox mb-3">
            <label className="custom-control">
              <input type="checkbox" value="remember-me" /> Recordarme
            </label>
          </div>
          <button className="w-100 btn btn-lg btn-primary" type="button"  onClick={(e) => handleIngresar()}>
            Ingresar
          </button>
          <p className="mt-5 mb-3 text-muted">© 2023</p>
        </form>
      </main>
    </div>


  </>
  );
}
```

#### Código de components/login/login.css: 

```css title="src/components/login/login.css"
divbody {
  display: flex;
  align-items: center;
  padding-top: 2em;
  padding-bottom: 2em;
  background-color: #f5f5f5;
}


.form-signin {
  max-width: 500px;
  padding: 15px;
}


.form-signin .form-floating:focus-within {
  z-index: 2;
}


.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}


.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
```

### Código de components/RequireAuth.jsx:

```jsx title="src/components/RequireAuth.jsx"
import React from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";


function RequireAuth({ children }) {
  let usuarioLogueado = AuthService.getUsuarioLogueado();


  // verificar la autenticacion
  if (!usuarioLogueado) {
    return <Navigate to={"/login/" + children.type.name} />;
  }


  // un nivel mas de seguridad seria verificar la autorizacion...
  return children;
}


export default RequireAuth;
```

### Código de components/articulosJWT/ArticulosJWT:

```jsx title="src/components/articulosJWT/ArticulosJWT.jsx"
import React, { useState, useEffect } from "react";
import { articulosJWTService } from "../../services/articulosJWT.service";




function ArticulosJWT() {
  const tituloPagina = "Articulos JWT (solo para admintradores)";
  const [articulos, setArticulos] = useState(null);


  // cargar al iniciar el componente, solo una vez
  useEffect(() => {
    BuscarArticulosJWT();
  }, []);


  async function BuscarArticulosJWT() {
    // try {
       
      let data = await articulosJWTService.Buscar();
      setArticulos(data);
    // } catch (error) {
    //   setTimeout(() => {
    //     alert(error.message);
    //   }, 0);
    // }
  }


  return (
    <>
      <div className="tituloPagina">{tituloPagina}</div>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th style={{ width: "20%" }}>IdArticulo</th>
            <th style={{ width: "50%" }}>Nombre</th>
            <th style={{ width: "30%" }}>Precio</th>
          </tr>
        </thead>
        <tbody>
          {articulos &&
            articulos.map((articulofamilia) => (
              <tr key={articulofamilia.IdArticulo}>
                <td>{articulofamilia.IdArticulo}</td>
                <td>{articulofamilia.Nombre}</td>
                <td>{articulofamilia.Precio}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}


export { ArticulosJWT };
```

#### Código de services/articulosJWT.service.js:

```js title="src/services/articulosJWT.service.js"
import httpService from "./http.service";

const urlServidor = "https://labsys.frc.utn.edu.ar/dds-express"
const urlResourceArticulos = urlServidor + "/api/articulos";

const urlResource = urlResourceArticulos;


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

## Integrando a Menu.jsx y App.js

Integrando los elementos anteriores a nuestra aplicación, a nuestro componente `Menu.jsx` le agregamos el link de nuevo componente `ArticulosJWT`, del `login/logout` y la visualización del Usuario logueado, quedándonos de la siguiente manera:
  
```jsx title="src/components/Menu.jsx"
import React, { useEffect, useState } from "react";
import { NavLink} from "react-router-dom";
import AuthService from "../services/auth.service";


function Menu() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(
    AuthService.getUsuarioLogueado()
  );


  function CambioUsuarioLogueado(_usuarioLogueado) {
    setUsuarioLogueado(_usuarioLogueado);
  }


  useEffect(() => {
    AuthService.subscribeUsuarioLogueado(CambioUsuarioLogueado);
    return () => {
      AuthService.subscribeUsuarioLogueado(null);
    }
  }, []);


  return (
    <nav className="navbar navbar-dark bg-dark navbar-expand-md">
      <div className="container-fluid">
        <a className="navbar-brand" href="#!">
          <i className="fa fa-industry"></i>
          &nbsp;<i>Pymes</i>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
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
            <li className="nav-item">
              <NavLink className="nav-link" to="/articulos">
                Articulos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" title="exclusivo para administradores" to="/articulosjwt">
                Articulos JWT
              </NavLink>
            </li>


            <li className="nav-item dropdown bg-dark">
              <a
                className="nav-link dropdown-toggle"
                href="#!"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Informes
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a className="dropdown-item" href="#!">
                    Ventas
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#!">
                    Compras
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#!">
                    Libro de IVA
                  </a>
                </li>
              </ul>
            </li>
          </ul>


            <ul className="navbar-nav ms-auto">
              {usuarioLogueado && (
                <li className="nav-item">
                  <a className="nav-link" href="#!">Bienvenido: {usuarioLogueado}</a>
                </li>
              )}
              <li className="nav-item">
                <NavLink className="nav-link" to="/login/Inicio">
                  <span
                    className={
                      usuarioLogueado ? "text-warning" : "text-success"
                    }
                  >
                    <i
                      className={
                        usuarioLogueado ? "fa fa-sign-out" : "fa fa-sign-in"
                      }
                    ></i>
                  </span>
                  {usuarioLogueado ? " Logout" : " Login"}
                </NavLink>
              </li>
            </ul>
        </div>
      </div>
    </nav>
  );
}


export default Menu;
```

Y finalmente ajustamos en el componente raíz: `App.js` las rutas de navegación con los nuevos componentes: `Login` y `ArticulosJWT`, para simplificar copiamos a continuación solo el html de la navegación:
  
```jsx title="src/App.js"
<BrowserRouter>
  <ModalDialog/>
  <Menu />
    <div className="divBody">
      <Routes>
        <Route path="/inicio" element={<Inicio />} />
        <Route
          path="/articulosfamilias"
          element={<ArticulosFamilias />}
        />
        <Route path="/articulos" element={<Articulos />} />
        <Route
          path="/articulosjwt"
          element={
            <RequireAuth>
              <ArticulosJWT />
            </RequireAuth>
          }
        />
        <Route
          path="/login/:componentFrom"
          element={
            <Login />
          }
        />
        <Route path="*" element={<Navigate to="/inicio" replace />} />
      </Routes>
    </div>
  <Footer />
</BrowserRouter>
```

:::tip[Siguientes pasos]
- ¿Qué pasa si el usuario se autentica, está trabajando con la aplicación y le expira el token? Aquí tendríamos que detectar la respuesta de 401 y solicitar un nuevo token usando el `refresh token`.
- ¿Qué pasa cuando un usuario logueado accede a una ruta protegida (actualmente validada con `RequiereAuth`), pero no cumple con al autorización... no debería poder ver la interface gráfica de la página.
:::