/* Elementos HTML DOM */
let formAddNewList = document.getElementById("addListForm");


/* Base de datos */
let db;
function createDatabase(){

  const DBOpenRequest = indexedDB.open('toDoApp', 1);

  /* Error al conectar con la base de datos */
  DBOpenRequest.onerror = function(event) {
  
    console.log('Algo salió mal en la conexión con la base de datos', event);

  };

  /* Creación o actualización de la base de datos */
  DBOpenRequest.onupgradeneeded = function(event) {

    db = event.target.result;

    // Creamos el objectStores para las listas de tareas
    const objectStoreList = db.createObjectStore('toDoLists', {keyPath: 'id', autoIncrement: true});

    // Creamos el objectStores para las tareas
    const objectStoreTasks = db.createObjectStore('toDoTasks', {keyPath: 'id', autoIncrement: true});
    objectStoreTasks.createIndex('list_index', 'list_id', {unique: false});
    objectStoreTasks.createIndex('done_status_and_list', ['list_id', 'done_status'], {unique: false});
    
  };

  /* Conexión exitosa con la base de datos */
  DBOpenRequest.onsuccess = function(event) {

    db = event.target.result;

  };

}

createDatabase();


/* Agregar una nueva lista de tareas */
formAddNewList.addEventListener("submit", addNewList);

function addNewList(e) {

  e.preventDefault();

  //Obtenemos los valores enviados por el form
  let formName = formAddNewList.name;
  let formDescription = formAddNewList.description;
  let formType = document.querySelector('input[name="type"]:checked');

  //Creamos un objeto con los datos ingresados
  let newList = {
    name: formName.value,
    description: formDescription.value,
    type: formType.value
  };

  //Agregamos el objeto a nuestra base de datos indexedDB
  const transaction = db.transaction(['toDoLists'], 'readwrite');
  let objectStore = transaction.objectStore('toDoLists');

  let request = objectStore.add(newList);

  request.onsuccess = function(event) {
    console.log('Se agregó la nueva lista de tareas con éxito');

    //Reseteamos los inputs del form
    formName.value = '';
    formDescription.value = '';
    formType.checked = false;

    //Redirigimos a la página del listado
    location.assign("../html/list-page.html");
  };

  request.onerror = function(event) {
    console.log('Ocurrió un error intentando agregar la nueva lista de tareas', event);
  };

  // Transacción completada
  transaction.oncomplete = () => {
    console.log('Transaction [addNewList] completada con éxito');
  };

  // Transacción con error
  transaction.onerror = (e) => {
    console.log('Ocurrió un problema al realizar la transaction [addNewList]', e);
  };
  
}