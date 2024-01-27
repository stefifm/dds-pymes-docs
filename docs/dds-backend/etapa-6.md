---
sidebar_position: 6
---

# Etapa 6

## Test unitarios

En esta etapa implementaremos test unitarios para validar las webapis desarrolladas, para lo cual utilizaremos las librerías: jest y supertest. Para iniciar nos aseguramos tener instalada a nivel global la librería jest, con la cual se ejecutan las pruebas unitarias:

```bash
npm install -g jest
```

luego a nivel de nuestro proyecto instalaremos como dependencia de desarrollo la librería supertest:

```bash
npm install --save-dev supertest
```

Ya instaladas las librerías necesarias escribiremos nuestro primer archivo de test, para lo cual crearemos el archivo: test/pruebainicial.test.js, con el siguiente contenido:

```javascript title="test/pruebainicial.test.js"
const request = require("supertest");
const app = require("../index");

describe("Ejemplo simple, test que no falla", () => {
  it("Simplemente compruebo si true === true", () => {
    expect(true).toBe(true);
  });
});

describe("GET hola mundo", () => {
  it("Debería devolver Hola mundo!", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Hola mundo!');
  });
});

describe("GET _isalive", () => {
  it("Deberia devolver ejecutándose desde ...", async () => {
    const res = await request(app).get("/_isalive");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('Ejecutandose desde:');
  });
});

describe("GET 404", () => {
  it("Debería devolver error 404 y su texto apropiado", async () => {
    const res = await request(app).get("/urlinexistente");
    expect(res.statusCode).toEqual(404);
    expect(res.text).toEqual("No encontrada!");
  });
});
```

Antes de ejecutarlo necesitamos hacer un cambio a nuestra aplicación, para que la misma no inicie el servidor web al momento de ejecutar los test, para lo cual modificaremos el archivo: `index.js`, condicionando el inicio del servidor web, para que solo se ejecute cuando no se esté ejecutando los test y también exporte la aplicación `express`, para lo cual haremos el siguiente cambio:

Reemplazar:

```javascript title="index.js"
 const port = process.env.PORT || 3000;   // en producción se usa el puerto de la variable de entorno PORT
  app.locals.fechaInicio = new Date();
  app.listen(port, () => {
    console.log(`sitio escuchando en el puerto ${port}`);
  });
```

Por:
  
```javascript title="index.js"
if (!module.parent) {   // si no es llamado por otro módulo, es decir, si es el módulo principal -> levantamos el servidor
  const port = process.env.PORT || 3000;   // en producción se usa el puerto de la variable de entorno PORT
  app.locals.fechaInicio = new Date();
  app.listen(port, () => {
    console.log(`sitio escuchando en el puerto ${port}`);
  });
}
module.exports = app; // para testing
```

**Observe**:
- `module.parent`: es una variable que se define cuando se ejecuta un módulo desde otro módulo, en este caso cuando se ejecuta el test desde el archivo: `test/pruebainicial.test.js`, esta variable se define, por lo tanto el servidor web no se inicia, pero si se ejecuta el test desde el navegador, esta variable no se define, por lo tanto el servidor web se inicia

Ahora ejecutaremos el test, para lo cual ejecutaremos el siguiente comando:

```bash
jest test/pruebainicial.test.js
```

**Observe**:
- Si ejecuta el comando: `jest`, sin especificar el archivo de test, se ejecutarán todos los test que se encuentren en la carpeta test
- Si alguna prueba falla, indica que dicha prueba no pasó, y muestra el error que se produjo.
- **Ejercicio**:
  - En el caso de la funcionalidad `Hola mundo!`, si la misma no está implementada en la aplicación, le proponemos implementarla y volver a verificarla.
  - En el caso de la funcionalidad `_isalive`, si la misma no está implementada en la aplicación, le proponemos implementar y volver a verificarla.

## Test de la webapi ArticulosFamilias

Seguidamente crearemos un test para validar la webapi de articulosfamilias, para lo cual crearemos el archivo: `test/articulosfamilias.test.js`, con el siguiente contenido:
  
```javascript title="test/articulosfamilias.test.js"
const request = require("supertest");
const app = require("../index");

describe("GET /api/articulosfamilias", function () {
  it("Devolveria todos los artciulosfamilias", async function () {
    const res = await request(app)
      .get("/api/articulosfamilias")
      .set("content-type", "application/json");
    expect(res.headers["content-type"]).toEqual(
      "application/json; charset=utf-8"
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          IdArticuloFamilia: expect.any(Number),
          Nombre: expect.any(String),
        }),
      ])
    );
  });
});


describe("GET /api/articulosfamilias/:id", function () {
  it("respond with json containing a single artciulosfamilias", async function () {
    const res = await request(app)
      .get("/api/articulosfamilias/1");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        IdArticuloFamilia: 1,
        Nombre: expect.any(String),
      })
    );
  });
});
```

**Observe**:
- Solo se testean los métodos `GET`; el primero testea la webapi de `articulosfamilias` y verifica que la respuesta sea un array con objetos que contengan los atributos `IdArticuloFamilia` y `Nombre`. El segundo testea la webapi de `articulosfamilias/:id` y verifica que la respuesta sea un objeto que contenga los atributos `IdArticuloFamilia = 1` y `Nombre` sea un texto
  
**_Ejercicio_**: Implemente los test para métodos faltantes de la webapi de articulosfamilias.

## Test de la webapi Articulos

Ahora continuaremos con la implementación de test para la webapi de articulos, para lo cual crearemos el archivo: test/articulos.test.js, con el siguiente contenido:

```javascript title="test/articulos.test.js"
const request = require("supertest");
const app = require("../index");
const articuloAlta = {
  Nombre: "Articulo " + (() => (Math.random() + 1).toString(36).substring(2))(), // Genera un nombre aleatorio
  Precio: 10.5,
  CodigoDeBarra: "1234567890123",
  IdArticuloFamilia: 1,
  Stock: 11,
  FechaAlta: new Date().toISOString(),
  Activo: true,
};
const articuloModificacion = {
  IdArticulo: 1,
  Nombre: "Articulo " + (() => (Math.random() + 1).toString(36).substring(2))(), // Genera un nombre aleatorio
  Precio: 10.5,
  CodigoDeBarra: "1234567890123",
  IdArticuloFamilia: 1,
  Stock: 11,
  FechaAlta: new Date().toISOString(),
  Activo: true,
};

// test route/articulos GET
describe("GET /api/articulos", () => {
  it("Deberia devolver todos los artículos", async () => {
    const res = await request(app).get("/api/articulos");
    expect(res.statusCode).toEqual(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        Items: expect.arrayContaining([
          expect.objectContaining({
            IdArticulo: expect.any(Number),
            Nombre: expect.any(String),
            Precio: expect.any(Number),
            Stock: expect.any(Number),
            FechaAlta: expect.any(String),
            Activo: expect.any(Boolean)
          }),
        ]),
        RegistrosTotal: expect.any(Number),
      })
    );
  });
});

// test route/articulos GET
describe("GET /api/articulos con filtros", () => {
  it("Deberia devolver los articulos según filtro ", async () => {
    const res = await request(app).get("/api/articulos?Nombre=AIRE&Activo=true&Pagina=1");
    expect(res.statusCode).toEqual(200);

    expect(verificarPropiedades(res.body.Items) ).toEqual(true );
  
    function verificarPropiedades(array) {
      for (let i = 0; i < array.length; i++) {
        if ( !array[i].Nombre.includes("AIRE") || !array[i].Activo ) {
          return false;
        }
      }
      return true;
    }
    
  });
});

// test route/articulos/:id GET
describe("GET /api/articulos/:id", () => {
  it("Deberia devolver el artículo con el id 1", async () => {
    const res = await request(app).get("/api/articulos/1");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        IdArticulo: expect.any(Number),
        Nombre: expect.any(String),
        Precio: expect.any(Number),
        CodigoDeBarra: expect.any(String),
        IdArticuloFamilia: expect.any(Number),
        Stock: expect.any(Number),
        FechaAlta: expect.any(String),
        Activo: expect.any(Boolean),
      })
    );
  });
});

// test route/articulos POST
describe("POST /api/articulos", () => {
  it("Deberia devolver el articulo que acabo de crear", async () => {
    const res = await request(app).post("/api/articulos").send(articuloAlta);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        IdArticulo: expect.any(Number),
        Nombre: expect.any(String),
        Precio: expect.any(Number),
        CodigoDeBarra: expect.any(String),
        IdArticuloFamilia: expect.any(Number),
        Stock: expect.any(Number),
        FechaAlta: expect.any(String),
        Activo: expect.any(Boolean),
      })
    );
  });
});

// test route/articulos/:id PUT
describe("PUT /api/articulos/:id", () => {
  it("Deberia devolver el articulo con el id 1 modificado", async () => {
    const res = await request(app)
      .put("/api/articulos/1")
      .send(articuloModificacion);
    expect(res.statusCode).toEqual(204);
  });
});

// test route/articulos/:id DELETE
describe("DELETE /api/articulos/:id", () => {
  it("Debería devolver el artículo con el id 1 borrado", async () => {
    const res = await request(app).delete("/api/articulos/1");
    expect(res.statusCode).toEqual(200);

    // baja lógica, no se borra realmente
    // expect(res.body).toEqual(
    //   expect.objectContaining({
    //     IdArticulo: expect.any(Number),
    //     Nombre: expect.any(String),
    //     Precio: expect.any(Number),
    //   })
    // );
  });
});
```

**Observe**:
- Se testean los métodos `GET`, `POST`, `PUT` y `DELETE` de la webapi de artículos
- Se prepara un objeto `articuloAlta` para testear el método `POST`
- Se prepara un objeto `articuloModificacion` para testear el método `PUT`
- Tanto para el alta como para la modificación se genera un nombre aleatorio para el artículo, así no se repiten los nombres de los artículos en la base de datos, lo que es exigido en base de datos.

## Test de la webapi Seguridad

Ahora continuaremos con un test para probar las webapi de seguridad de nuestra aplicación, para lo cual crearemos el archivo: `test/seguridad.test.js`, con el siguiente contenido:

```javascript title="test/seguridad.test.js"
const request = require("supertest");
const app = require("../index");

const usuarioAdmin = { usuario: "admin", clave: "123" };
const usuarioMiembro = { usuario: "juan", clave: "123" };


describe("POST /api/login admin", function () {
  it("Devolveria error de autenticacion, porque tiene clave errónea", async function () {
    const res = await request(app)
      .post("/api/login")
      //.set("Content-type", "application/json")
      .send({ usuario: "admin", clave: "errónea" });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("usuario or clave incorrecto");
  });

  it("Devolvería el token para usuario admin", async function () {
    const res = await request(app).post("/api/login").send(usuarioAdmin);

    expect(res.statusCode).toEqual(200);
    expect(res.body.accessToken).toEqual(expect.any(String));
  });
});

describe("GET /api/jwt/articulos", () => {

  it("Devolveria error, porque falta token de autorización", async function () {
    const res = await request(app).get("/api/jwt/articulos");
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Acceso denegado");
  });

  it("Devolveria error, porque el token no es válido", async function () {
    const res = await request(app).get("/api/jwt/articulos")
    .set("Authorization", 'Bearer invalido');
    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toEqual("token no es válido");
  });

  it("Devolvería todos los articulos, solo autorizado para administradores", async function () {
    const res1 = await request(app)
    .post("/api/login")
    .set("Content-type", "application/json")
    .send(usuarioAdmin);
    expect(res1.statusCode).toEqual(200);
    let token = res1.body.accessToken;

    const res = await request(app)
      .get("/api/jwt/articulos")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          IdArticulo: expect.any(Number),
          Nombre: expect.any(String),
          Precio: expect.any(Number),
          CodigoDeBarra: expect.any(String),
          IdArticuloFamilia: expect.any(Number),
          Stock: expect.any(Number),
          FechaAlta: expect.any(String),
          Activo: expect.any(Boolean),
        }),
      ])
    );
  });

  it("Devolvería error de autorizacion, porque solo están autorizados los administradores", async function () {
    const res1 = await request(app)
    .post("/api/login")
    .set("Content-type", "application/json")
    .send(usuarioMiembro);
    expect(res1.statusCode).toEqual(200);
    let token = res1.body.accessToken;

    const res = await request(app)
      .get("/api/jwt/articulos")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toEqual('usuario no autorizado!');
  });

});
```

**Observe**:
- Se testean los métodos con resultados exitosos
- Se testean los métodos con resultados erróneos

Finalmente, para poder ejecutar todos los tests, como un scripts en el archivo `package.json`, agregaremos la siguiente propiedad al objeto script:

```json title="package.json"
"scripts": {
  "test": "jest --testTimeout=10000"
},
```

con lo cual podremos ejecutar los test con el comando:
  
```bash
npm run test
```