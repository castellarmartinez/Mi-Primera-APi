# Mi primera API

## ¿Qué es **_Mi primera API_**?

Es una API que recrea el Backend de la página web de un restaurante. En ella se pueden registrar usuarios para realizar pedidos de los productos que se encuentran en la tienda.

## ¿Qué tecnologías implementa esta API?

Esta API está escrita en el lenguaje de programación JavaScript, utilizando el framework de Node JS y las librerías de Express y Swagger para la implementación de los Endpoints y la documentación, respectivamente.

## Instalación

### 1. Clona el proyecto: 

```bash
git clone https://gitlab.com/castellarmartinez/mi-primera-api
```

### 2. Instalar dependencias: 

```bash
npm install
```

## Uso

### 1. Iniciar el servidor: 

```bash
node src/index.js
```

### 2. Acceder a la documentación de Swagger: 

Acceda a la documentación de Swagger desde este [enlace](http://localhost:3000/api-docs/).

## Rutas habilitadas en la API

### Rutas públicas

Hay unas acciones que se pueden realizar en la API sin ser usuario registrado, éstas son:

#### 1. [Registro](http://localhost:3000/api-docs/#/Usuarios/post_usuarios_registro):

Para el registro de nuevos usuarios se ingresa un JSON al _body_ con los datos de registro, como se muestra en el ejemplo siguiente:

```javascript
{
  "nombre": "Arnedes Olegario",
  "usuario": "arneolegario",
  "contrasena": "Deivic007",
  "email": "olegario.arnedes@nebular.com",
  "telefono": 3735648623
}
```

Al procesar la solicitud se crea un usuario sin privilegios de administrador.

NOTA: Es importante resaltar que el usuario no se podrá registrar si el JSON no posee las propiedades o posee propiedades adicionales a listadas anteriormente.

#### 2. [Ver productos](http://localhost:3000/api-docs/#/Productos/get_productos_lista):

En esta ruta se pueden ver todos los productos actualmente disponibles en la tienda.

#### 3. [Ver un producto específico](http://localhost:3000/api-docs/#/Productos/get_productos_verproducto__productoId_):

En esta ruta se puede comprobar si un producto existe en la tienda, y en caso tal, ver la información del mismo. En el apartado _path_ se debe ingresar el id del producto.

##### 3.1 Id de los productos

Los id de todos los productos deben contener las iniciales en mayúsculas DR (Delilah Restó), seguidos por una secuencia numérica (ejemplo: DR0090).

### Rutas para usuarios registrados

Estas rutas se encuentran habilitadas para todos los usuarios registrados. Se debe ingresar usando el Authorize.

#### 1. [Login](http://localhost:3000/api-docs/#/Usuarios/get_usuarios_login):

Los usuarios ingresados pueden hacer login en la API, para ello deben autenticarse usando el Authorize. La autenticación se realiza por medio del _express-basic-auth_.

#### 2. [Ver medios de pago](http://localhost:3000/api-docs/#/Medios%20de%20pago/get_mediosdepago_lista):

En esta ruta se pueden ver todos los medios de pago que soporta la tienda.

### Rutas para usuarios sin privilegios de administrador (cliente):

Para acceder a estas rutas habilitadas se debe ingresar como usuario sin privilegios de administrador, usando el Authorize. Originalmente no existen usuarios registrados, por lo que se recomienda hacer el proceso de registro mencionado en el numeral _1_ de la sección de _Rutas públicas_.

#### 1. [Ver historial de pedidos](http://localhost:3000/api-docs/#/Pedidos/get_pedidos_historial):

En esta ruta el cliente puede ver su historial de pedidos.

#### 2. [Hacer nuevo pedido](http://localhost:3000/api-docs/#/Pedidos/post_pedidos_nuevo__productoId_):

En esta ruta los clientes pueden hacer nuevos pedidos. Se debe ingresar en el _path_ el id del producto que se debe agregar (la aplicación sólo soporta la adición de un producto a la vez, si se desea agregar nuevos productos se debe dejar el pedido abierto (_nuevo_), para posteriormente hacer la adición). En el _body_ se debe ingresar un JSON con los datos del pedido, como se muestra en el siguiente ejemplo:

```javascript
{
  "unidades": 5,
  "direccion": "Cra 105 #12-36, Retiro Nuevo",
  "pago": 2,
  "estado": "confirmado"
}
```

Donde el número correspondiente al pago hace referencia a la opción de pago, que a su vez hace referencia al nombre asociado al medio de pago (ejemplo: "pago": 2 --> "opcion": 2 --> "Tarjeta de crédito").

NOTA: Es importante resaltar que no se procesará el pedido si el JSON no posee las propiedades o posee propiedades adicionales a listadas anteriormente, y/o el estado es diferente a "nuevo" (abierto) o "confirmado".

#### 3. [Agregar producto al pedido](http://localhost:3000/api-docs/#/Pedidos/put_pedidos_agregarproducto__productoId_):

En esta ruta se puede agregar un nuevo producto al pedido. En el _path_ se introduce el id del producto que se desea adicionar, y en el _query_ se escribe la cantidad de dicho producto.

#### 4. [Quitar/reducir producto del pedido](http://localhost:3000/api-docs/#/Pedidos/put_pedidos_quitarproducto__productoId_):

Esta ruta es similar a la anterior con la diferencia de que se elimina/reduce en vez de agregar un producto.

#### 5. [Cambiar medio de pago](http://localhost:3000/api-docs/#/Pedidos/put_pedidos_cambiarpago):

Esta ruta se puede cambiar el medio de pago. En el _query_ se debe introducir la opción de pago.

#### 6. [Cambiar dirección](http://localhost:3000/api-docs/#/Pedidos/put_pedidos_cambiardireccion):

Esta ruta se puede cambiar dirección de entrega del producto. En el _query_ se debe introducir la nueva dirección.

#### 7. [Cambiar el estado del pedido](http://localhost:3000/api-docs/#/Pedidos/put_pedidos_modificarestado_cliente):

Esta ruta se puede cambiar el estado del producto. En el _query_ se debe seleccionar las opciones disponibles (confirmado y cancelado).

#### 8. [Ver medios de pago](http://localhost:3000/api-docs/#/Medios%20de%20pago/get_mediosdepago_lista):

Esta ruta se pueden ver los medios de pago que actualmente soporta la tienda.

### Rutas para administradores

Para acceder a estas rutas se debe ingresar como usuario administrador usando el Authorize. Para esta aplicación, el único usuario administrador es:

```javascript
Username: ddcastellar;
Password: xh93fKY1;
```

#### 1. [Ver lista de usuarios registrados](http://localhost:3000/api-docs/#/Usuarios/get_usuarios_lista):

La ruta permite ver todos los usuarios registrados, sin embargo, sólo se muestra el nombre, nombre de usuario y si tiene privilegios de administrador.

#### 2. [Agregar nuevo producto](http://localhost:3000/api-docs/#/Productos/post_productos_agregar__productoId_):

La ruta permite la adición de nuevos productos a la tienda. En el _path_ se debe añadir el id del nuevo producto, teniendo en cuenta las indicaciones del numeral _3.1_ de la sección de _Rutas públicas_. En el _body_ se debe ingresar un JSON con las propiedades nombre y precio del producto, como se muestra en el siguiente ejemplo:

```javascript
{
  "nombre": "Carimañola",
  "precio": 500
}
```

NOTA: Es importante resaltar que no se agregará el nuevo producto si el JSON no posee las propiedades o posee propiedades adicionales a listadas anteriormente.

#### 3. [Modificar un producto](http://localhost:3000/api-docs/#/Productos/put_productos_modificar__productoId_):

Esta ruta es similar a la anterior, permitiendo la modificación del nombre y/o precio de un producto existente.

#### 4. [Eliminar un producto](http://localhost:3000/api-docs/#/Productos/delete_productos_eliminar__productoId_):

En esta ruta se puede eliminar un producto. En el _path_ se debe ingresar el id del producto que se desea eliminar.

#### 5. [Agregar nuevo medio de pago](http://localhost:3000/api-docs/#/Medios%20de%20pago/post_mediosdepago_agregar):

La ruta permite la adición de nuevos medios de pago a la tienda. En el _body_ se debe ingresar un JSON con la propiedad nombre, como se muestra en el siguiente ejemplo:

```javascript
{
  "medio": "Tarjeta de crédito"
}
```

NOTA: Es importante resaltar que no se agregará el nuevo medio de pago si el JSON no posee las propiedades o posee propiedades adicionales a listadas anteriormente.

#### 6. [Modificar un medio de pago](http://localhost:3000/api-docs/#/Medios%20de%20pago/post_mediosdepago_agregar):

Esta ruta permite la modificación de un medio de pago. En el _path_ se debe introducir la opción del medio de pago, y en el _query_ un JSON siguiendo las indicaciones del punto anterior.

#### 7. [Eliminar un medio de pago](http://localhost:3000/api-docs/#/Medios%20de%20pago/delete_mediosdepago_eliminar__opcion_):

La ruta permite la eliminación de un medio de pago en la tienda. En el _path_ se debe ingresar la opción a la que hace referencia dicho medio de pago.

#### 8. [Ver lista de pedidos](http://localhost:3000/api-docs/#/Pedidos/get_pedidos_lista):

Esta ruta permite ver la lista de pedidos que se han hecho en la tienda.

#### 9. [Cambiar el estado del pedido](http://localhost:3000/api-docs/#/Pedidos/put_pedidos_modificarestado_admin):

Esta ruta se puede cambiar el estado del producto. En el _path_ se debe ingresar el id que referencia la orden del pedido (ejemplo #23) cuyo estado se desea modificar. En el _query_ se debe seleccionar las opciones disponibles (preparando, enviando, cancelado, entregado).
