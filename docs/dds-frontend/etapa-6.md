---
sidebar_position: 7
---

# Etapa 6

## Componente ArticulosRegistro

A continuación trabajaremos sobre el componente `ArticulosRegistro`, el cual es el encargado de mostrar el formulario para `Consultar`, `Agregar` y/o `Modificar` un registro. La librería que usaremos para lograr enlazar los campos del formulario con el estado del componente es `react-hook-form`, la cual nos permite manejar los estados de los campos del formulario de una manera más sencilla y sin tener que escribir código para cada campo. Para instalar la librería ejecutamos el comando:

```bash
npm install react-hook-form
```

:::tip[Más]
 Para más informacion sobre esta libreria, ver: https://react-hook-form.com/
:::

Lo primero que necesitamos es importar la librería en el componente ArticulosRegistro.js:

```jsx title="src/components/ArticulosRegistro.js"
import { useForm } from "react-hook-form";
```

Luego mediante un hook personalizado que nos ofrece la librería, obtenemos un objeto con las propiedades `register`, `handleSubmit` y `formState`, que nos permitirán manejar los estados de los campos del formulario e implementar una versión sencilla de formularios controlados. El código del hook es el siguiente:

```jsx title="src/components/ArticulosRegistro.js"
const {
  register,
  handleSubmit,
  formState: { errors, touchedFields, isValid, isSubmitted },
} = useForm({ values: Item });
```

**Observe**:
- Que se le pasa como parámetro al hook el objeto `Item`, el cual es el estado del componente y que contiene los datos del registro a mostrar en el formulario.
- Las propiedades del objeto `formState` que se obtienen del hook, nos permitirán implementar la validación de los datos ingresados por el usuario, tema que se verá más adelante.

El paso siguiente es implementar la función `handleSubmit`, la cual es una función que recibe como parámetro una función que se ejecutará cuando el usuario haga click en el botón `Grabar`, y que recibe como parámetro el estado del formulario, el cual es un objeto con los campos del formulario y sus valores. El código de la función será:

```jsx title="src/components/ArticulosRegistro.js"
const onSubmit = (data) => {
    Grabar(data);
  };
```

y la misma será invocada en el evento onSubmit del formulario: reemplazar:
``` jsx title="src/components/ArticulosRegistro.js"
<form>
```

por:
``` jsx title="src/components/ArticulosRegistro.js"	
<form onSubmit={handleSubmit(onSubmit)}>
```

Y este evento del formulario será invocado cuando el usuario haga click en el botón `Grabar`, ya que el mismo es de tipo `submit`.

Luego en el formulario, en cada campo se le pasa como parámetro el atributo `register`, el cual es una función que recibe como parámetro el nombre del campo y modifica al mismo, enlazando con el estado del componente.

A continuación se muestra como ejemplo el campo `Nombre` 

reemplazar:

```jsx title="src/components/ArticulosRegistro.js"
<input
  type="text"
  name="Nombre"
  value={Item.Nombre}
  autoFocus
  className="form-control "
/>
```

por:

```jsx title="src/components/ArticulosRegistro.js"
<input
  type="text"
  {...register("Nombre")}
  autoFocus
  className="form-control"
/>
```

**Observe**:
- Que hemos eliminado la propiedad `name` del input, ya que esta propiedad es manejada por la función `register`.
- Que hemos eliminado la propiedad `value` que en el boceto inicial habíamos completado mediante interpolación y que ahora será manejada por la función `register`.

Habiendo hecho todos los cambios sugeridos el código completo del componente debería ser el siguiente:

```jsx title="src/components/ArticulosRegistro.js"
import React from "react";
import { useForm } from "react-hook-form";

export default function ArticulosRegistro({
  AccionABMC,
  ArticulosFamilias,
  Item,
  Grabar,
  Volver,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isValid, isSubmitted },
  } = useForm({ values: Item });
  const onSubmit = (data) => {
    Grabar(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
                {...register("Nombre")}
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
                {...register("Precio")}
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
                {...register("Stock")}
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
                {...register("CodigoDeBarra")}
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
                {...register("IdArticuloFamilia")}
                className="form-control"
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
                {...register("FechaAlta")}
                className="form-control"
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
                {...register("Activo")}
                className="form-control"
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

Si probamos la aplicación ya estaría funcionando correctamente las `Consultas`, `Alta` y `Modificacion` de los articulos.

## Validaciones

Si intentamos dar de alta de un registro, con algún error, por ej: sin completar los datos obligatorios, recibiremos un error de validación en el backend, que en el método `Grabar` del componente `Articulos` se encuentra dentro de un bloque `try/catch`. En el `catch` se captura el error y se muestra un `alert` con el mensaje de error. Las validaciones como esta del lado del backend son fundamentales y no se deben omitir, pero también es importante realizar validaciones en el frontend, para una mejor la experiencia del usuario. Para esto seguiremos usando `react-hook-form` que nos permite realizar este tipo de validaciones.

Para nuestro ejemplo necesitamos 2 cambios en cada etiqueta (input o select) de ingreso de datos:

1. Agregar a la propiedad `register` que ya venimos usando para indicar el nombre del estado a enlazar un segundo parámetro en donde indicaremos qué validaciones se aplicarán a ese campo. Usaremos los validadores más simples: `required`, `minLength`, `maxLength`, `pattern`, `min`, `max`.
2. Agregar junto a la etiqueta de ingreso de datos, un `div` con la clase `invalid-feedback` para mostrar el mensaje de error de validación. El mismo se mostrará sólo cuando el campo no pase la validación.

Para el input `Nombre` reemplazar:

```jsx title="src/components/ArticulosRegistro.js"
<input
  type="text"
  {...register("Nombre")}
  autoFocus
  className="form-control "
/>
```

por:

```jsx title="src/components/ArticulosRegistro.js"
<input
  type="text"
  {...register("Nombre", {
    required: { value: true, message: "Nombre es requerido" },
    minLength: {
      value: 4,
      message: "Nombre debe tener al menos 4 caracteres",
    },
    maxLength: {
      value: 55,
      message: "Nombre debe tener como máximo 55 caracteres",
    },
  })}
  autoFocus
  className={
    "form-control " + (errors?.Nombre ? "is-invalid" : "")
  }
/>
{errors?.Nombre && touchedFields.Nombre && (
  <div className="invalid-feedback">
    {errors?.Nombre?.message}
  </div>
)}
```

Para el input `Precio` reemplazar:

```jsx title="src/components/ArticulosRegistro.js"
<input
  type="number"
  step=".01"
  {...register("Precio")}
  className="form-control"
/>
```

por:

```jsx title="src/components/ArticulosRegistro.js"
<input
  type="number" 
  step=".01"
  {...register("Precio", {
    required: { value: true, message: "Precio es requerido" },
    min: {
      value: 0.01,
      message: "Precio debe ser mayor a 0",
    },
    max: {
      value: 99999.99,
      message: "Precio debe ser menor o igual a 99999.99",
    },
  })}
  className={
    "form-control " + (errors?.Precio ? "is-invalid" : "")
  }
/>
<div className="invalid-feedback">{errors?.Precio?.message}</div>
```

Para el input `Stock` reemplazar:

```jsx title="src/components/ArticulosRegistro.js"
<input
  type="number"
  {...register("Stock")}
  className= "form-control"
/>
```

por:

```jsx title="src/components/ArticulosRegistro.js"
<input
  type="number"
  {...register("Stock", {
    required: { value: true, message: "Stock es requerido" },
    min: {
      value: 0,
      message: "Stock debe ser mayor a 0",
    },
    max: {
      value: 99999,
      message: "Stock debe ser menor o igual a 999999",
    },
  })}
  className={
    "form-control " + (errors?.Stock ? "is-invalid" : "")
  }
/>
<div className="invalid-feedback">{errors?.Stock?.message}</div>
```

Para el input `CodigoDeBarra` reemplazar:

```jsx title="src/components/ArticulosRegistro.js"
<input
  type="text"
  {...register("CodigoDeBarra")}
  className="form-control"
/>
```

por:

```jsx title="src/components/ArticulosRegistro.js"
<input
  type="text"
  {...register("CodigoDeBarra", {
    required: {
      value: true,
      message: "Codigo De Barra es requerido",
    },
    pattern: {
      value: /^[0-9]{13}$/,
      message:
        "Codigo De Barra debe ser un número, de 13 dígitos",
    },
  })}
  className={
    "form-control" + (errors?.CodigoDeBarra ? " is-invalid" : "")
  }
/>
<div className="invalid-feedback">
  {errors?.CodigoDeBarra?.message}
</div>
```

Para el input `IdArticuloFamilia` reemplazar:

```jsx title="src/components/ArticulosRegistro.js"
<select
  {...register("IdArticuloFamilia")}
  className="form-control"
>
  <option value="" key={1}></option>
  {ArticulosFamilias?.map((x) => (
    <option value={x.IdArticuloFamilia} key={x.IdArticuloFamilia}>
      {x.Nombre}
    </option>
  ))}
</select>
```

por:

```jsx title="src/components/ArticulosRegistro.js"
<select
  {...register("IdArticuloFamilia", {
    required: { value: true, message: "Familia es requerido" },
  })}
  className={
    "form-control " +
    (errors?.IdArticuloFamilia ? "is-invalid" : "")
  }
>
  <option value="" key={1}></option>
  {ArticulosFamilias?.map((x) => (
    <option value={x.IdArticuloFamilia} key={x.IdArticuloFamilia}>
      {x.Nombre}
    </option>
  ))}
</select>
<div className="invalid-feedback">
  {errors?.IdArticuloFamilia?.message}
</div>
```

Para el input `FechaAlta` reemplazar:

```jsx title="src/components/ArticulosRegistro.js"
<input
  type="date"
  {...register("FechaAlta")}
  className="form-control"
/>
```

por:

```jsx title="src/components/ArticulosRegistro.js"
<input
  type="date"
  {...register("FechaAlta", {
    required: { value: true, message: "Fecha Alta es requerido" }
  })}
  className={
    "form-control " + (errors?.FechaAlta ? "is-invalid" : "")
  }
/>
<div className="invalid-feedback">
  {errors?.FechaAlta?.message}
</div>
```

**Observe**:
- Que no ponemos validación al campo `Activo`, debido a que es de solo lectura. (`disabled`)

Finalmente al último del formulario, teníamos un `div` con el mensaje `"Revisar los datos ingresados..."` que se mostraba siempre, pero ahora solo queremos que se muestre cuando el usuario intente grabar y no haya pasado las validaciones. Para esto, la librería nos ofrece 2 estados: `isValid` y `isSubmitted`. El primero se inicializa en `true` y se actualiza en el evento `onSubmit` del formulario, con el resultado de la validación del formulario. El segundo se inicializa en false y se actualiza en el evento `onSubmit` del formulario, con el valor `true`. Finalmente, en el `div` con el mensaje `"Revisar los datos ingresados..."` agregaremos una condición para que se muestre solo cuando `isValid` sea `false` y `isSubmitted` sea `true`. 

Reemplace:

```jsx title="src/components/ArticulosRegistro.js"
<div className="row alert alert-danger mensajesAlert">
  <i className="fa fa-exclamation-sign"></i>
  Revisar los datos ingresados...
</div>
```

por:

```jsx title="src/components/ArticulosRegistro.js"
{!isValid && isSubmitted && (
  <div className="row alert alert-danger mensajesAlert">
    <i className="fa fa-exclamation-sign"></i>
    Revisar los datos ingresados...
  </div>
)}
```

Si probamos la aplicación ya estaria funcionando correctamente las validaciones de los campos del formulario, ahora del lado del cliente!

El código completo del componente `ArticulosRegitros` quedaria asi:

```jsx title="src/components/ArticulosRegistro.js"
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function ArticulosRegistro({
  AccionABMC,
  ArticulosFamilias,
  Item,
  Grabar,
  Volver,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isValid, isSubmitted },
  } = useForm({ values: Item });

  const onSubmit = (data) => {
    Grabar(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
                {...register("Nombre", {
                  required: { value: true, message: "Nombre es requerido" },
                  minLength: {
                    value: 4,
                    message: "Nombre debe tener al menos 4 caracteres",
                  },
                  maxLength: {
                    value: 55,
                    message: "Nombre debe tener como máximo 55 caracteres",
                  },
                })}
                autoFocus
                className={
                  "form-control " + (errors?.Nombre ? "is-invalid" : "")
                }
              />
              {errors?.Nombre && touchedFields.Nombre && (
                <div className="invalid-feedback">
                  {errors?.Nombre?.message}
                </div>
              )}
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
                type="number" step=".01"
                {...register("Precio", {
                  required: { value: true, message: "Precio es requerido" },
                  min: {
                    value: 0.01,
                    message: "Precio debe ser mayor a 0",
                  },
                  max: {
                    value: 99999.99,
                    message: "Precio debe ser menor o igual a 99999.99",
                  },
                })}
                className={
                  "form-control " + (errors?.Precio ? "is-invalid" : "")
                }
              />
              <div className="invalid-feedback">{errors?.Precio?.message}</div>
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
                {...register("Stock", {
                  required: { value: true, message: "Stock es requerido" },
                  min: {
                    value: 0,
                    message: "Stock debe ser mayor a 0",
                  },
                  max: {
                    value: 99999,
                    message: "Stock debe ser menor o igual a 999999",
                  },
                })}
                className={
                  "form-control " + (errors?.Stock ? "is-invalid" : "")
                }
              />
              <div className="invalid-feedback">{errors?.Stock?.message}</div>
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
                {...register("CodigoDeBarra", {
                  required: {
                    value: true,
                    message: "Codigo De Barra es requerido",
                  },
                  pattern: {
                    value: /^[0-9]{13}$/,
                    message:
                      "Codigo De Barra debe ser un número, de 13 dígitos",
                  },
                })}
                className={
                  "form-control" + (errors?.CodigoDeBarra ? " is-invalid" : "")
                }
              />
              <div className="invalid-feedback">
                {errors?.CodigoDeBarra?.message}
              </div>
            </div>
          </div>

          {/* campo IdArticuloFamilia */}
          <div className="row">
            <div className="col-sm-4 col-md-3 offset-md-1">
              <label className="col-form-label" htmlFor="IdArticuloFamilia">
                Familia<span className="text-danger">*</span>:
              </label>
            </div>
            <div className="col-sm-8 col-md-6">
              <select
                {...register("IdArticuloFamilia", {
                  required: { value: true, message: "Familia es requerido" },
                })}
                className={
                  "form-control " +
                  (errors?.IdArticuloFamilia ? "is-invalid" : "")
                }
              >
                <option value="" key={1}></option>
                {ArticulosFamilias?.map((x) => (
                  <option value={x.IdArticuloFamilia} key={x.IdArticuloFamilia}>
                    {x.Nombre}
                  </option>
                ))}
              </select>
              <div className="invalid-feedback">
                {errors?.IdArticuloFamilia?.message}
              </div>
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
                {...register("FechaAlta", {
                  required: { value: true, message: "Fecha Alta es requerido" }
                })}
                className={
                  "form-control " + (errors?.FechaAlta ? "is-invalid" : "")
                }
              />
              <div className="invalid-feedback">
                {errors?.FechaAlta?.message}
              </div>
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
                {...register("Activo", {
                  required: { value: true, message: "Activo es requerido" },
                })}
                className={
                  "form-control" + (errors?.Activo ? " is-invalid" : "")
                }
                disabled
              >
                <option value={null}></option>
                <option value={false}>NO</option>
                <option value={true}>SI</option>
              </select>
              <div className="invalid-feedback">{errors?.Activo?.message}</div>
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
        {!isValid && isSubmitted && (
          <div className="row alert alert-danger mensajesAlert">
            <i className="fa fa-exclamation-sign"></i>
            Revisar los datos ingresados...
          </div>
        )}

      </div>
    </form>
  );
}
```