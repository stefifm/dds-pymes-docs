---
sidebar_position: 5
---

# Etapa 5

## Seguridad

En esta etapa vamos a agregar seguridad a la webapi, para ello vamos a utilizar JWT (JSON Web Token) para la autenticación y autorización.

## Configuración de Json Web Token

- instalamos las dependencias necesarias: 
  
```bash
npm install jsonwebtoken
```


- Crearemos el middleware de seguridad, que será el encargado de validar el token de acceso y autorizar el acceso a las rutas seguras, para lo cual crearemos el archivo: `seguridad/auth.js`, con el siguiente contenido:

```javascript title="seguridad/auth.js"
const jwt = require("jsonwebtoken");

const accessTokenSecret = "youraccesstokensecret";
const refreshTokenSecret = "yourrefreshtokensecrethere";

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        //return res.sendStatus(400);
        return res.status(403).json({ message: "token no es valido" });
      }
      
      res.locals.user = user;
      next();
    });
  } else {
    //res.sendStatus(401);
    res.status(401).json({ message: "Acceso denegado" });
  }
};
module.exports = { authenticateJWT, accessTokenSecret, refreshTokenSecret };
```

**Observe**:
- El uso de la librería `jsonwebtoken` para validar el token que se recibe en el header de la petición
- `accessTokenSecret`: es la clave secreta para firmar el token de acceso
- `refreshTokenSecret`: es la clave secreta para firmar el token de refresco
- Si el token es válido, se guarda el usuario en el objeto `res.locals.user`, para que pueda ser utilizado para luego autorizar las rutas seguras
- Si el token no es válido, se devuelve un error 401 (acceso denegado) o 403 (token no válido)

## Configuración de las rutas seguras

Seguidamente en la carpeta routes, crearemos el archivo: `seguridad.js`, con el siguiente contenido

```javascript title="routes/seguridad.js"
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../seguridad/auth");

const users = [
  {
    usuario: "admin",
    clave: "123",
    rol: "admin",
  },
  {
    usuario: "juan",
    clave: "123",
    rol: "member",
  },
];
let refreshTokens = [];

router.post("/api/login", (req, res) => {
  // #swagger.tags = ['Seguridad']
  // #swagger.summary = 'Login de usuarios: admin:123(rol administrador), juan:123(rol miembro)'

  const { usuario, clave } = req.body;

  // Filter user from the users array by usuario and clave
  const user = users.find((u) => {
    return u.usuario === usuario && u.clave === clave;
  });

  if (user) {
    // Generate an access token
    const accessToken = jwt.sign(
      { usuario: user.usuario, rol: user.rol },
      auth.accessTokenSecret,
      { expiresIn: "20m" }
    );

    // Avanzado!
    const refreshToken = jwt.sign(
      { usuario: user.usuario, rol: user.rol },
      auth.refreshTokenSecret
    );

    refreshTokens.push(refreshToken);

    res.json({
      accessToken,
      refreshToken,
      message: "Bienvenido " + user.usuario + "!",
    });
  } else {
    res.json({ message: "usuario or clave incorrecto" });
  }
});

router.post("/api/logout", (req, res) => {
  // #swagger.tags = ['Seguridad']
  // #swagger.summary = 'Logout: invalida el refresh token (no invalida el token actual!!!)'

  // recordar que el token sigue valido hasta que expire, aqui evitamos que pueda renovarse cuando expire!
  let message = "Logout inválido!";
  const { token } = req.body;
  if (refreshTokens.includes(token)) {
    message = "Usuario deslogueado correctamente!";
  }

  refreshTokens = refreshTokens.filter((t) => t !== token);

  res.json({ message });
});

router.post("/api/token", (req, res) => {
  // #swagger.tags = ['Seguridad']
  // #swagger.summary = 'refresh token'
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.sendStatus(401);
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res.sendStatus(403);
  }

  jwt.verify(refreshToken, auth.refreshTokenSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    const accessToken = jwt.sign(
      { usuario: user.usuario, rol: user.rol },
      auth.accessTokenSecret,
      { expiresIn: "20m" }
    );

    res.json({
      accessToken,
    });
  });
});


module.exports = router;
```

**Observe**:
- La definición de usuarios (clave y roles) en forma hardcodeada para simplificar el ejemplo.
- `router.post("/api/login")`: es el método que se encarga de autenticar al usuario, para lo cual se debe enviar el usuario y clave
- `router.post("/api/logout")`: es el método que se encarga de invalidar el token de refresco, para lo cual se debe enviar el token de refresco
- `router.post("/api/token")`: es el método que se encarga de refrescar el token de acceso, para lo cual se debe enviar el token de refresco

## Autenticación

Finalmente haremos uso de la autenticación en la webapi, para lo cual modificaremos el archivo: `routes/articulos.js`, agregando una ruta segura, para lo cual agregaremos el siguiente código:

```javascript title="routes/articulos.js"
//------------------------------------
//-- SEGURIDAD ---------------------------
//------------------------------------
router.get(
  "/api/jwt/articulos",
  auth.authenticateJWT,
  async function (req, res, next) {
    /* #swagger.security = [{
               "bearerAuth1": []
        }] */

    // #swagger.tags = ['Articulos']
    // #swagger.summary = 'obtiene todos los Articulos, con seguridad JWT, solo para rol: admin (usuario:admin, clave:123)'
    const { rol } = res.locals.user;
    if (rol !== "admin") {
      return res.status(403).json({ message: "usuario no autorizado!" });
    }

    let items = await db.articulos.findAll({
      attributes: [
        "IdArticulo",
        "Nombre",
        "Precio",
        "CodigoDeBarra",
        "IdArticuloFamilia",
        "Stock",
        "FechaAlta",
        "Activo",
      ],
      order: [["Nombre", "ASC"]],
    });
    res.json(items);
  }
);
```

**Observe**:
- `router.get("/api/jwt/articulos", ...)`: es la ruta segura que solo puede ser accedida por usuarios con rol: admin
- `auth.authenticateJWT`: es el middleware que se encarga de validar el token de acceso y autorizar el acceso a las rutas seguras
:::warning[Recuerde] 
para usar un middleware debe importarlo `(require...)` 
:::

