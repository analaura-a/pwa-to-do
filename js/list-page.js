/* Elementos HTML DOM */
let body = document.getElementById("body");
let navGoBack = document.getElementById("back-to-lists");
let mainTitle = document.getElementById("main-title");
let mainSubtitle = document.getElementById("main-subtitle");
let listType = document.getElementById("list-type");
let appContentContainer = document.getElementById("dinamic-content");
let deleteTaskListButton;
let taskListPage;


/* FETCH */
async function fetchTaskLists() {
  try {
    let response = await fetch("../json/taskslists.json");
    let taskLists = await response.json();
    return taskLists;
  } catch (error) {
    console.log('Hubo un error al intentar obtener el JSON de las listas');
  }
}

async function fetchTasks(){
  try {
    let response = await fetch("../json/tasks.json");
    let tasks = await response.json();
    return tasks;
  } catch (error) {
    console.log('Hubo un error al intentar obtener el JSON de las tareas');
  }
}


/* indexedDB */
let db;

//Estado de la base de datos
let dbInitialized = localStorage.getItem('dbInitialized');

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

    console.log('Conexión exitosa con la base de datos');
    
    db = event.target.result;
    
    // Verificamos si la base de datos ya se ha inicializado, para no repetir
    if (!dbInitialized) {

        // Agregamos las listas de tareas existentes en el JSON a nuestra base de datos indexedDB
        fetchTaskLists()
        .then((data) => {
          addingJSONTaskLists(data);
        })
        .catch((json) => console.log(json));

        // Agregamos las tareas existentes en el JSON a nuestra base de datos indexedDB
        fetchTasks()
        .then((data) => {
          addingJSONTasks(data);
        })
        .catch((json) => console.log(json));

    }

    // Almacenamos en localStorage que la base de datos se inicializó
    localStorage.setItem('dbInitialized', true);

    // Renderizamos las listas de tareas
    renderTaskLists();

  };

}

createDatabase();


function addingJSONTaskLists(data){

  // Realizamos la transacción para agregar las listas del JSON a indexedDB
  const transaction = db.transaction(['toDoLists'], 'readwrite');
  let objectStore = transaction.objectStore('toDoLists');

  data.forEach((taskList) => {
    let taskListJSON = {
      "name": taskList.name,
      "description": taskList.description,
      "type": taskList.type
    }

    let request = objectStore.add(taskListJSON);

    request.onsuccess = function() {
      console.log('Se agregaron con éxito las listas de tareas en el JSON a la base de datos');
    };
  
    request.onerror = function(event) {
      console.log('Ocurrió un error intentando agregar las listas de tareas en el JSON a la base de datos', event);
    };
    
  });

  // Transacción completada
  transaction.oncomplete = () => {
    console.log('Transaction [addingJSONTaskLists] completada con éxito');

    renderTaskLists();
  };

  // Transacción con error
  transaction.onerror = (e) => {
    console.log('Ocurrió un problema al realizar la transaction [addingJSONTaskLists]', e);
  };
  
}


function addingJSONTasks(data){

  // Realizamos la transacción para agregar las listas del JSON a indexedDB
  const transaction = db.transaction(['toDoTasks'], 'readwrite');
  let objectStore = transaction.objectStore('toDoTasks');

  data.forEach((task) => {
    let taskJSON = {
      "list_id": task.list_id,
      "task_name": task.task_name,
      "done_status": task.done_status,
    }

    let request = objectStore.add(taskJSON);

    request.onsuccess = function() {
      console.log('Se agregaron con éxito las tareas en el JSON a la base de datos');
    };
  
    request.onerror = function(event) {
      console.log('Ocurrió un error intentando agregar las tareas en el JSON a la base de datos', event);
    };
    
  });

  // Transacción completada
  transaction.oncomplete = () => {
    console.log('Transaction [addingJSONTasks] completada con éxito');
  };

  // Transacción con error
  transaction.onerror = (e) => {
    console.log('Ocurrió un problema al realizar la transaction [addingJSONTasks]', e);
  };


}


/* Función para renderizar el listado (Listas de tareas) */
function renderTaskLists() {

  vaciarContainer();

  //Creamos y agregamos el contenedor de las listas de tareas
  let divTasklistsContainer = crearTasklistsContainer();
  appContentContainer.appendChild(divTasklistsContainer);

  //Iniciamos la transacción de lectura de la base de datos
  const transaction = db.transaction(['toDoLists'], 'readonly');
  let objectStore = transaction.objectStore('toDoLists');

  let request = objectStore.getAll();

  request.onsuccess = function(event) {

    let array = event.target.result;
    array.forEach((taskList) => {

      //Creamos una card por cada lista en la base de datos
      let cardList = `<a href="detail-page.html" class="list" id="${taskList.id}">  
                          <p class="list-type">${taskList.type}</p>
                          <div class="list-content">
                              <h2 class="h3 list-title">${taskList.name}</h2>
                              <p class="paragraph text-light list-description">${taskList.description}</p>
                          </div>
                      </a>`;

      //Las agregamos al contenedor
      divTasklistsContainer.innerHTML += cardList;

    });

    array.forEach(taskList => {

      //Les agregamos un evento para obtener y setear su ID en localStorage al hacerles click
      taskListPage = document.getElementById(`${taskList.id}`);
      taskListPage.addEventListener("click", () => {
        localStorage.setItem('tasklist', taskList.id);
      });
      
    });

  };

  request.onerror = function(event) {
    console.log('Ocurrió un error intentando mostrar las listas de tareas', event);
  };
 
  transaction.oncomplete = () => {
    console.log('Transaction [renderTaskLists] completada con éxito');

    //Creamos y agregamos el botón "Agregar una nueva lista de tareas"
    crearButtonNewList(divTasklistsContainer);
  };

  transaction.onerror = (e) => {
    console.log('Ocurrió un problema al realizar la transaction [renderTaskLists]', e);
  };

}


/* Función para vaciar el contenedor */
let vaciarContainer = function () {
  appContentContainer.innerHTML = "";
};

/* Función crear el elemento contenedor de las listas de tareas */
let crearTasklistsContainer = function () {
  let divTasklistsContainer = document.createElement("div");
  divTasklistsContainer.classList.add("lists-container");
  return divTasklistsContainer;
};

/* Función para crear el botón "Agregar nueva lista de tareas" */
let crearButtonNewList = function (container) {
  let ancla = document.createElement("a");
  ancla.classList.add("add-list");
  ancla.setAttribute("href", "add-to-do-list.html");
  ancla.setAttribute("id", "add-list");
  ancla.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewbox="0 0 48 48">
        <path fill="#949BA3"
            d="M38 22H26V10a2 2 0 1 0-4 0v12H10a2 2 0 1 0 0 4h12v12a2 2 0 0 0 4 0V26h12a2 2 0 0 0 0-4Z" />
  </svg>
  <p>Agregar una nueva lista</p>`;

  container.appendChild(ancla);
};