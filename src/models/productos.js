const listaProductos = 
[
    {
        nombre : 'Changua',
        precio : 4500,
        id : 'DR001'
    }, 
    {
        nombre : 'Buñuelo',
        precio : 1000,
        id : 'DR002'
    }, 
    {
        nombre : 'Hormiga culona',
        precio : 10000,
        id : 'DR003'
    }, 
    {
        nombre : 'Bandeja Paisa',
        precio : 7000,
        id : 'DR004'
    }, 
    {
        nombre : 'Guarapo',
        precio : 1000,
        id : 'DR005'
    }, 
    {
        nombre : 'Tinto',
        precio : 500,
        id : 'DR006'
    }, 
    {
        nombre : 'Ajiaco',
        precio : 6000,
        id : 'DR007'
    }, 
    {
        nombre : 'Gutifarra',
        precio : 2500,
        id : 'DR008'
    }, 
    {
        nombre : 'Patacón',
        precio : 1500,
        id : 'DR009'
    }, 
    {
        nombre : 'Agua',
        precio : 700,
        id : 'DR010'
    }, 
]

const obtenerProductos = () => {
    return listaProductos;
}

const agregarProductos = (producto, id) => {
    producto.id = id;
    listaProductos.push(producto);
}

const modificarProductos = (productoOriginal, productoModificado) => {
    const indice = listaProductos.indexOf(productoOriginal);
    listaProductos.splice(indice, 1, productoModificado);
}

const eliminarProductos = (producto) => {
    const indice = listaProductos.indexOf(producto);
    listaProductos.splice(indice, 1);
}

const obtenerEsteProducto = (id) => {
    const listaID = listaProductos.map((element) => (element.id))
    const indice = listaID.indexOf(id)
    const productoSolicitado = listaProductos[indice];

    return productoSolicitado;
}

module.exports = {obtenerProductos, agregarProductos, modificarProductos, eliminarProductos,
     obtenerEsteProducto};