---
sidebar_position: 2
---
# Etapa 2

## weapi articulosfamiliasmock

Esta api no accede a base de datos sino que simulando dicho acceso trabaja con un array de datos hardcodeados.

- Agregamos al proyecto la carpeta `routes` en donde pondremos los controladores de las diferentes rutas de los recursos de la webapi
- En la carpeta `routes` creamos el archivo `articulosfamiliasmock.js` que gestionará el recurso `articulosfamiliasmock`, con el siguiente código:

```javascript title="routes/articulosfamiliasmock.js"
const express = require('express');
const router = express.Router();

let arr_ArticulosFamiliasMock = [
  {
    "IdArticuloFamilia": 1,
    "Nombre": "Accesorios"
  },
  {
    "IdArticuloFamilia": 2,
    "Nombre": "Audio"
  },
  {
    "IdArticuloFamilia": 3,
    "Nombre": "Celulares"
  },
  {
    "IdArticuloFamilia": 4,
    "Nombre": "Cuidado Personal"
  },
  {
    "IdArticuloFamilia": 5,
    "Nombre": "Dvd"
  },
  {
    "IdArticuloFamilia": 6,
    "Nombre": "Fotografia"
  },
  {
    "IdArticuloFamilia": 7,
    "Nombre": "Frio-Calor"
  },
  {
    "IdArticuloFamilia": 8,
    "Nombre": "Gps"
  },
  {
    "IdArticuloFamilia": 9,
    "Nombre": "Informatica"
  },
  {
    "IdArticuloFamilia": 10,
    "Nombre": "Led - Lcd"
  }
];

router.get('/api/articulosfamiliasmock', async function (req, res) {
  res.json(arr_ArticulosFamiliasMock);
});
module.exports = router;
```

**Observe**:
- La clase `express.Router` para crear controladores de rutas montables y modulares.
- La definición moqueada del array de datos de `articulosfamilias`.
- El controlador `GET` de la ruta `/api/articulosfamilasmock` que devolverá serializado como json el array de datos.
- La función se define como asíncrona `async`, que aunque no tenga sentido actualmente, la usamos previendo cuando obtengamos datos desde la base de datos donde será necesaria.


Una vez definido el controlador de nuestro recurso debemos vincularlo a nuestra aplicación `express`, cargando el módulo de ruta en el archivo `index.js` antes de levantar el servidor
  
```javascript title="index.js"
const express = require('express');
const articulosfamiliasmockRouter = require("./routes/articulosfamiliasmock");
const app = express();

// controlar ruta
app.get("/", (req, res) => {
  res.send("Backend inicial dds-backend!");
});

// vincular rutas
app.use(articulosfamiliasmockRouter);

// levantar servidor
const port = 3000;
app.listen(port, () => {
    console.log(`sitio escuchando en el puerto ${port}`);
});
```

Para testear nuestro recurso, iniciemos nuestra aplicación y consultemos desde el explorador la siguiente url: `http://localhost:3000/api/articulosfamiliasmock`

## Método GET por id

Agregaremos ahora el método `GET` que permite obtener un recurso según su `id`, al archivo `articulosfamiliasmock.js` le agregamos este código, antes del export:

```javascript title="routes/articulosfamiliasmock.js"
router.get('/api/articulosfamiliasmock/:id', async function (req, res) {
  let articuloFamilia = arr_ArticulosFamiliasMock.find(
    (x) => x.IdArticuloFamilia == req.params.id
  );
  if (articuloFamilia) res.json(articuloFamilia);
  else res.status(404).json({ message: 'articulofamilia no encontrado' });
});
```

**Observe**:
- Cómo se recupera el `id` del segmento de la url, mediante la colección `params`
- Cómo se busca en el array el dato solicitado
  - si se encuentra se devuelve el mismo en formato de `json`
  - si no se encuentra se devuelve un error 404 con un mensaje adecuado.

Para testearlo, iniciemos nuestra aplicación y consultemos desde el explorador la siguiente url: `http://localhost:3000/api/articulosfamiliasmock/1`

- Testemos cambiando el número final de la url que indica el id del recurso a buscar.

## Método POST

Agregamos ahora el método post, que permite a agregar un recurso, usaremos el siguiente código:

```javascript title="routes/articulosfamiliasmock.js"
router.post('/api/articulosfamiliasmock/', (req, res) => {
  const { Nombre } = req.body;
  let articuloFamilia = {
    Nombre,
    IdArticuloFamilia: Math.floor(Math.random()*100000),
  };

  // aqui agregar a la coleccion
  arr_ArticulosFamiliasMock.push(articuloFamilia);

  res.status(201).json(articuloFamilia);
});
```

**Observe**:
- Cómo se recupera el dato del `Nombre` desde el objeto `body` del request
- El campo `IdArticuloFamilia`, en base de datos sería un autonumérico, aquí usamos un solución poco fiable pero sencilla, solo válida para una demostración rápida.
- devolvemos el código de status 201 y el objeto recién creado; tal vez quien consuma esta api buscara allí, entre otros valores, el `IdArticuloFamilia` recién generado.

Para que este método funcione, express necesita un middleware que le permita interpretar el json que recibe en el `body`, para lo cual agregamos en el `index.js`, luego de crear la constante `app`, el código siguiente:

```javascript title="index.js"
app.use(express.json()); // para poder leer json en el body
```

Testeamos este método, con la ayuda de la aplicación **Postman** que nos facilitara invocar la url con el verbo `POST` y los parámetros necesarios.

## Método PUT y DELETE

Agregamos ahora el método `PUT`, que permite a modificar un recurso, usaremos el siguiente código:
  
```javascript title="routes/articulosfamiliasmock.js"
router.put('/api/articulosfamiliasmock/:id', (req, res) => {
  let articuloFamilia = arr_ArticulosFamiliasMock.find(
    (x) => x.IdArticuloFamilia == req.params.id
  );

  if (articuloFamilia) {
    const { Nombre } = req.body;
    articuloFamilia.Nombre = Nombre;
    res.json({ message: 'articulofamilia actualizado' });
  } else {
    res.status(404).json({ message: 'articulofamilia no encontrado' })
  }
});
```

**Observe**:
- El uso del método `find` para buscar el recurso a modificar
- La modificación del objeto encontrado y la devolución de un mensaje de éxito.
- La devolución del código de status 404 si no se encuentra el recurso a modificar
- Testeamos este modelo, con la ayuda de la aplicación **Postman** que nos facilitara invocar la url con el verbo `PUT` y los parámetros necesarios.

Finalmente agregamos el método `DELETE`, que permite a eliminar un recurso, usaremos el siguiente código:

```javascript title="routes/articulosfamiliasmock.js"
router.delete('/api/articulosfamiliasmock/:id', (req, res) => {
  let articuloFamilia = arr_ArticulosFamiliasMock.find(
    (x) => x.IdArticuloFamilia == req.params.id
  );

  if (articuloFamilia) {
    arr_ArticulosFamiliasMock = arr_ArticulosFamiliasMock.filter(
      (x) => x.IdArticuloFamilia != req.params.id
    );
    res.json({ message: 'articulofamilia eliminado' });
  } else {
    res.status(404).json({ message: 'articulofamilia no encontrado' })
  }
});
```

**Observe**:
- El uso del método `filter`, como estrategia para eliminar el elemento del array
- La devolución de un mensaje de éxito.
- La devolución del código de status 404 si no se encuentra el recurso a eliminar
- Testeamos este método, con la ayuda de la aplicación Postman que nos facilitara invocar la url con el verbo `DELETE` y los parámetros necesarios.

-----------------------------------------------------------------------------------------------------------------------------------------------

## Ejercicio

Implementar una mejora al método `GET` que devuelve todos los `articulosfamilias`. Deberá retornar solo aquellos que coincidan con un parámetro opcional: `Nombre`, si no se recibiese dicho parámetro, seguirá funcionando como antes devolviendo todos los registros.

:::tip[Tips] 
para leer el parámetro usaremos el objeto "query" del request
:::