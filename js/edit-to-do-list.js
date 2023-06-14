/* Elementos HTML DOM */
let formEditList = document.getElementById("editListForm");
let formName = formEditList.name;
let formDescription = formEditList.description;
let formType = document.querySelectorAll('input[name="type"]');


/* Obtenemos el índice de la lista a través de localStorage */
let tasklistIndex = JSON.parse(localStorage.getItem('tasklist'));


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
    objectStoreList.createIndex('type_index', 'type', {unique: false});

    // Creamos el objectStores para las tareas
    const objectStoreTasks = db.createObjectStore('toDoTasks', {keyPath: 'id', autoIncrement: true});
    objectStoreTasks.createIndex('list_index', 'list_id', {unique: false});
    objectStoreTasks.createIndex('done_status_index', 'done_status', {unique: false});
    objectStoreTasks.createIndex('done_status_and_list', ['list_id', 'done_status'], {unique: false});
    
  };

  /* Conexión exitosa con la base de datos */
  DBOpenRequest.onsuccess = function(event) {

    db = event.target.result;
    
    getListData();

  };

}

createDatabase();


/* Función para obtener y mostrar los datos de la lista actual */
function getListData(){

    const transaction = db.transaction(['toDoLists'], 'readonly');
    let objectStore = transaction.objectStore('toDoLists');

    let request = objectStore.get(tasklistIndex);

    request.onsuccess = function(event) {

        let selectedTaskList = event.target.result;

        // Mostramos los datos existentes en el form
        formName.value = selectedTaskList.name;
        formDescription.value = selectedTaskList.description;
        formType.forEach(element => {
            if(element.value == selectedTaskList.type){
                element.checked = true;
            }
        });

    }

    request.onerror = function(event) {
        console.log('Ocurrió un error intentando obtener los datos de la lista de tareas', event);
    };

}


/* Función para aplicar los cambios a la lista de tareas */
formEditList.addEventListener("submit", editList);

function editList(e) {

    e.preventDefault();

    //Obtenemos los nuevos valores enviados por el form
    let updatedFormName = formEditList.name;
    let updatedFormDescription = formEditList.description;
    let updatedFormType = document.querySelector('input[name="type"]:checked');

    //Iniciamos la transacción
    const transaction = db.transaction(['toDoLists'], 'readwrite');
    let objectStore = transaction.objectStore('toDoLists');

    //Obtenemos la lista
    let getRequest = objectStore.get(tasklistIndex);

    getRequest.onsuccess = function(event) {
        
        let taskList = event.target.result;

        //Actualizamos los datos
        taskList.name = updatedFormName.value;
        taskList.description = updatedFormDescription.value;
        taskList.type = updatedFormType.value;

        let updateRequest = objectStore.put(taskList);

        updateRequest.onsuccess = function(){
            console.log('Se actualizó con éxito la lista de tareas');
        }

        updateRequest.onerror = function(){
            console.log('Ocurrió un error intentando editar la lista de tareas', event);
        }

    }

    transaction.oncomplete = () => {
        console.log('Transaction [editList] completada con éxito');
        location.assign('detail-page.html');
    };
  
    // Transacción con error
    transaction.onerror = (e) => {
        console.log('Ocurrió un problema al realizar la transaction [editList]', e);
    };
   
}