const listaMediosDePago = [
    {
        medio: 'Tarjeta de crédito',
        opcion: 1
    },
    {
        medio: 'Tarjeta de débito',
        opcion: 2
    },    
    {
        medio: 'Paypal',
        opcion: 3
    },    
    {
        medio: 'Bitcoin',
        opcion: 4
    },    
]

const obtenerMediosDePago= () => {
    return listaMediosDePago
}

const agregarMediosDePago = (medioDePago) => {
    const opcion = listaMediosDePago[listaMediosDePago.length - 1].opcion;
    medioDePago.opcion = opcion + 1;
    listaMediosDePago.push(medioDePago);
}

const modificarMediosDePago = (medio, opcion) => {;
    listaMediosDePago[opcion - 1].medio = medio;
}

const eliminarMediosDePago = (indice) => {
    listaMediosDePago.splice(indice - 1, 1)
    listaMediosDePago.forEach((element, index) => (element.opcion = index + 1))
}

const obtenerEsteMedio = (pago) => {
    const listaOpciones = listaMediosDePago.map((element) => (element.opcion));
    const indice = listaOpciones.indexOf(parseInt(pago));
    const medioSolicitado = listaMediosDePago[indice];
    
    if(medioSolicitado){
        return medioSolicitado.medio;
    }
    else{
        return undefined;
    }  
}

module.exports = {obtenerMediosDePago, agregarMediosDePago, modificarMediosDePago, eliminarMediosDePago,
    obtenerEsteMedio};