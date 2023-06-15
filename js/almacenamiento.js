/* Función constructora de objetos */
function Almacenamiento(a, b) {

    let storage = {}

    async function resetear() {
        storage = {}
    }

    async function agregar(a, b) {
        storage[a] = b;
    }

    async function leer(a) {
        return storage[a]
    }

    return {
        resetear,
        agregar,
        leer
    }
}

// Instanciar el objeto anteponiendo "new"
let almacenamiento = new Almacenamiento();
