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
    let response = await fetch("../tasks.json");
    let taskLists = await response.json();
    return taskLists;
  } catch (error) {
    console.log('Hubo un error al intentar obtener el JSON');
  }
}


/* indexedDB*/
let db;
const DBOpenRequest = indexedDB.open('toDoApp', 1);

// Verificar si la base de datos ya se ha inicializado previamente
let dbInitialized = localStorage.getItem('dbInitialized');



/* Error al conectar con la base de datos */
DBOpenRequest.onerror = function(event) {
 
  console.log('Algo salió mal en la conexión con la base de datos', event);

};



/* Creación o actualización de la base de datos */
DBOpenRequest.onupgradeneeded = function(event) {

  db = event.target.result;

  // Creamos un objectStore para la base de datos
  const objectStore = db.createObjectStore('toDoLists', {keyPath: 'id', autoIncrement: true});

  // Agregamos los índices necesarios
  objectStore.createIndex('type_index', 'type', {unique: false});
  // objectStore.createIndex('tasks_index', 'tasks', {multiEntry: true, unique: true});
  
};



/* Conexión exitosa con la base de datos */
DBOpenRequest.onsuccess = function(event) {

  console.log('Conexión exitosa con la base de datos');
  
  db = event.target.result;
  
  // Agregamos las listas de tareas existentes en el JSON a nuestra base de datos indexedDB
  fetchTaskLists()
  .then((data) => {
    addingJSONTaskLists(data);
  })
  .catch((json) => console.log(json));

  // Almacenamos en localStorage que la base de datos se inicializó
  localStorage.setItem('dbInitialized', true);

  // Renderizamos las listas de tareas
  renderTaskLists();

};


/* Función para agregar las listas de tareas en el JSON a nuestra base de datos */
function addingJSONTaskLists(data){

  // Verificamos si la base de datos ya se ha inicializado, para no repetir las listas
  if (!dbInitialized) {

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
  
      request.onsuccess = function(event) {
        console.log('Se agregaron con éxito las listas de tareas en el JSON a la base de datos');
      };
    
      request.onerror = function(event) {
        console.log('Ocurrió un error intentando agregar las listas de tareas en el JSON a la base de datos');
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

  } else {
    return;
  }

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
      let cardList = `<button class="list" id="${taskList.id}">
                          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewbox="0 0 48 48"
                              class="delete-list" id="delete-list-${taskList.id}">
                              <path fill="#949BA3"
                                  d="M10.742 13.543c-.686 0-1.242.634-1.242 1.413 0 .78.556 1.413 1.24 1.413h26.518c.686 0 1.242-.633 1.242-1.413s-.556-1.413-1.244-1.413h-4.14c-.854-.024-1.756-.642-2.046-1.554l-.049-.161-.183-.63-.007-.021c-.111-.38-.209-.71-.345-1.006-.543-1.19-1.553-2.017-2.718-2.228-.294-.053-.607-.053-.966-.053h-5.604c-.357 0-.67 0-.966.053-1.165.211-2.174 1.038-2.718 2.228-.138.3-.236.635-.347 1.018l-.003.009-.185.63-.049.16c-.29.913-1.042 1.53-1.894 1.555h-4.294Z" />
                              <path fill="#949BA3" fill-rule="evenodd"
                                  d="M24.65 40.112h-1.3c-4.485 0-6.726 0-8.184-1.427-1.457-1.425-1.606-3.766-1.904-8.441l-.43-6.757c-.163-2.54-.244-3.81.488-4.616.73-.805 1.966-.805 4.435-.805h12.49c2.47 0 3.704 0 4.435.805.73.804.65 2.076.488 4.616l-.43 6.756c-.298 4.676-.447 7.015-1.903 8.442-1.46 1.427-3.7 1.427-8.184 1.427Zm-4.797-16.945c.664-.07 1.257.44 1.321 1.139l.806 8.479c.066.7-.418 1.323-1.083 1.392-.664.07-1.257-.44-1.321-1.14l-.806-8.478c-.066-.7.418-1.323 1.083-1.392Zm9.377 1.392c.067-.7-.418-1.323-1.081-1.392-.663-.07-1.259.44-1.323 1.139l-.806 8.479c-.066.7.418 1.323 1.083 1.392.662.07 1.257-.44 1.321-1.14l.806-8.478Z"
                                  clip-rule="evenodd" />
                          </svg>
                          <p class="list-type">${taskList.type}</p>
                          <div class="list-content">
                              <h2 class="h3 list-title">${taskList.name}</h2>
                              <p class="paragraph text-light list-description">${taskList.description}
                              </p>
                          </div>
                          <p class="list-task-count bold-paragraph text-dark">1/2</p>
                      </button>`;

      //Las agregamos al contenedor
      divTasklistsContainer.innerHTML += cardList;

    });

    array.forEach(taskList => {

      // Botón para borrar lista
      deleteTaskListButton = document.getElementById(`delete-list-${taskList.id}`);
      deleteTaskListButton.addEventListener("click", function () {
        console.log(deleteTaskListButton)
      })

      // Botón para ver el detalle de la lista
      taskListPage = document.getElementById(`${taskList.id}`);
      taskListPage.addEventListener("click", (e) => {
        if(e.target.tagName == "svg"){
          return;
        } else {
          localStorage.setItem('tasklist', `${taskList.id}`);
          location.assign("detail-page.html");
        }
      });

    })



  };

  request.onerror = function(event) {
    console.log('Ocurrió un error intentando mostrar las listas de tareas', event);
    crearButtonNewList(divTasklistsContainer);
  };
 
  transaction.oncomplete = () => {
    //Creamos y agregamos el botón "Agregar una nueva lista de tareas"
    console.log('Transaction [renderTaskLists] completada con éxito');
    crearButtonNewList(divTasklistsContainer);
  };

   //Evento para eliminar una lista de tareas
  // arrayTaskLists.forEach((taskList) => {

  //   deleteTaskListButton = document.getElementById(`delete-list-${taskList.id}`);
  //   deleteTaskListButton.addEventListener("click", function (e) {
    
  //     //Identificamos la lista
  //     let idBoton = e.currentTarget.id;
  //     let index = arrayTaskLists.findIndex((taskList) => `delete-list-${taskList.id}` === idBoton);

  //     //La eliminamos del array
  //     arrayTaskLists.splice(index, 1);

  //     renderTaskLists();

  //   });
  // });

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

