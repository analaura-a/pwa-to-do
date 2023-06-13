/* Elementos HTML DOM */
let mainTitle = document.getElementById("main-title");
let mainSubtitle = document.getElementById("main-subtitle");
let listType = document.getElementById("list-type");
let totalCount = document.getElementById("total-count");
let pendingCount = document.getElementById("pending-count");
let doneCount = document.getElementById("done-count");
let deleteButton = document.getElementById('delete-list');


/* Obtenemos el índice de la lista a través de localStorage */
let tasklistIndex = JSON.parse(localStorage.getItem('tasklist'));
console.log(tasklistIndex);


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
    
  };

  /* Conexión exitosa con la base de datos */
  DBOpenRequest.onsuccess = function(event) {

    db = event.target.result;
    
    renderTasklist();

    renderTaskCounters();

  };

}

createDatabase();


/* Función para renderizar los datos de la lista en la página de detalle */
function renderTasklist(){

  //Iniciamos la transacción
  const transaction = db.transaction(['toDoLists'], 'readonly');
  let objectStore = transaction.objectStore('toDoLists');

  //Obtenemos los datos de la lista en particular
  let request = objectStore.get(tasklistIndex);

  request.onsuccess = function(event) {

    let selectedTaskList = event.target.result;

    // Los mostramos
    mainTitle.textContent = selectedTaskList.name;
    mainSubtitle.textContent = selectedTaskList.description;
    listType.textContent = selectedTaskList.type;

  }

  request.onerror = function(event) {
    console.log('Ocurrió un error intentando obtener los datos de esta lista de tareas', event);
  }

  // Transacción completada
  transaction.oncomplete = () => {
    console.log('Transaction [renderTasklist] completada con éxito');
  };

  // Transacción con error
  transaction.onerror = (e) => {
    console.log('Ocurrió un problema al realizar la transaction [renderTasklist]', e);
  };
    
}


/* Función para renderizar los contadores de las tareas: total, pendientes y completadas */
function renderTaskCounters(){

  const transaction = db.transaction(['toDoTasks'], 'readonly');
  let objectStore = transaction.objectStore('toDoTasks');

  //Obtenemos las tareas de la lista a través de su índice
  let listIndex = objectStore.index("list_index");
  // let statusIndex = objectStore.index("done_status_index");

  let countRequest = listIndex.count(tasklistIndex);
  
  countRequest.onsuccess = function(e) {

    let total = e.target.result;
    totalCount.textContent = `${total} tareas en total`;
  
  }


  // let tasksRequest = listIndex.getAll(tasklistIndex);

  // tasksRequest.onsuccess = function(e) {

  //   console.log(e.target.result);
  //   let tasks = e.target.result;

  //   tasks.forEach(task => {
      
  //   });

  // }

  
 let tasksRequest = listIndex.getAll(tasklistIndex);

  tasksRequest.onsuccess = function(e) {

    console.log(e.target.result);

  
    // let pendingTasksRequest = statusIndex.getAll(true).onsuccess = function(e){
    //   console.log(e.target.result)
    // };
    
    
  }


}




/* Función para eliminar la lista de tareas */
deleteButton.addEventListener("click", deleteTasklist);

function deleteTasklist(){

  //Transacción: borrar lista de tareas
  const transaction = db.transaction(['toDoLists'], 'readwrite');
  let objectStore = transaction.objectStore('toDoLists');

  let request = objectStore.delete(tasklistIndex);

  request.onsuccess = ()=> {

    console.log(`Lista borrada con éxito`);

    //Transacción: borrar tareas asociadas a la lista
    const transactionTasks = db.transaction(['toDoTasks'], 'readwrite');
    let objectStoretasks = transactionTasks.objectStore('toDoTasks');
    let listIndex = objectStoretasks.index("list_index");

    let requestTasks = listIndex.getAll(tasklistIndex);
    
    requestTasks.onsuccess = function(e) {

      let tasks = e.target.result;

      tasks.forEach(task => { 
        
        let requestDeleteTasks = objectStoretasks.delete(task.id);

        requestDeleteTasks.onsuccess = function() {
          console.log("La tarea se borró con éxito");
        }

        requestDeleteTasks.onerror = (e)=> {
          console.error("Ocurrió un error al intentar borrar las tareas", e);
        }

      });

    }

    requestTasks.onerror = (e)=> {
      console.error("Ocurrió un error al intentar obtener las tareas", e)
    }

    transaction.oncomplete = () => {
      console.log('Transaction [deleteTasks] completada con éxito');
      location.assign('list-page.html');
    };
  
    transaction.onerror = (e) => {
      console.error('Ocurrió un problema al realizar la transaction [deleteTasks]', e);
    };

  }

  request.onerror = (e)=> {
    console.error("Ocurrió un error al intentar borrar la lista", e)
  }

  transaction.oncomplete = () => {
    console.log('Transaction [deleteTasklist] completada con éxito');
  };

  transaction.onerror = (e) => {
    console.log('Ocurrió un problema al realizar la transaction [deleteTasklist]', e);
  };

}






















/* Ver las tareas (Página de detalle) */
// function renderTasks(e){

//   // Identificamos la lista 
//   let idList = e.currentTarget.id;
//   let index = arrayTaskLists.findIndex((taskList) => `${taskList.id}` === idList);

//   // Guardamos en variables
//   let selectedTaskList = arrayTaskLists[index];
//   let tasks = arrayTaskLists[index].tasks;

//   vaciarContainer();

//   // Cambiamos el contenido del título de la página
//   mainTitle.textContent = selectedTaskList.name;
//   mainSubtitle.textContent = selectedTaskList.description;
//   listType.textContent = selectedTaskList.type;

//   /* Ver las tareas (por estado) */
//   function showByStatus(){

//     //Creamos 2 arrays nuevos a partir del array "tasks", usando el estado de sus tareas ("done_status")
//     let pendingTasks = [];
//     let doneTasks = [];

//     tasks.forEach((task) => {
//       if (task.done_status == false){
//         pendingTasks.push(task);
//       } else if (task.done_status == true){
//         doneTasks.push(task);
//       } else {
//         console.log(task);
//       }
//     });

//     //Columna "Tareas pendientes"
//     let pendingTasksContainer = document.getElementById('tasksPending');

//     if(pendingTasks.length === 0){
//       pendingTasksContainer.innerHTML = "<p>¡No hay tareas pendientes!</p>"
//     } else {
//       pendingTasks.forEach((task) => {
//         let taskItem =  
//         `<div class="task">
//           <input type="checkbox" id="${task.id}" class="task-checkbox">
//           <label for="${task.id}"><span class="custom-checkbox"></span>${task.task_name}</label>
//           <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none"
//               viewbox="0 0 48 48" class="delete-list delete-list-task" id="delete-${task.id}">
//               <path fill="#949BA3"
//                   d="M10.742 13.543c-.686 0-1.242.634-1.242 1.413 0 .78.556 1.413 1.24 1.413h26.518c.686 0 1.242-.633 1.242-1.413s-.556-1.413-1.244-1.413h-4.14c-.854-.024-1.756-.642-2.046-1.554l-.049-.161-.183-.63-.007-.021c-.111-.38-.209-.71-.345-1.006-.543-1.19-1.553-2.017-2.718-2.228-.294-.053-.607-.053-.966-.053h-5.604c-.357 0-.67 0-.966.053-1.165.211-2.174 1.038-2.718 2.228-.138.3-.236.635-.347 1.018l-.003.009-.185.63-.049.16c-.29.913-1.042 1.53-1.894 1.555h-4.294Z" />
//               <path fill="#949BA3" fill-rule="evenodd"
//                   d="M24.65 40.112h-1.3c-4.485 0-6.726 0-8.184-1.427-1.457-1.425-1.606-3.766-1.904-8.441l-.43-6.757c-.163-2.54-.244-3.81.488-4.616.73-.805 1.966-.805 4.435-.805h12.49c2.47 0 3.704 0 4.435.805.73.804.65 2.076.488 4.616l-.43 6.756c-.298 4.676-.447 7.015-1.903 8.442-1.46 1.427-3.7 1.427-8.184 1.427Zm-4.797-16.945c.664-.07 1.257.44 1.321 1.139l.806 8.479c.066.7-.418 1.323-1.083 1.392-.664.07-1.257-.44-1.321-1.14l-.806-8.478c-.066-.7.418-1.323 1.083-1.392Zm9.377 1.392c.067-.7-.418-1.323-1.081-1.392-.663-.07-1.259.44-1.323 1.139l-.806 8.479c-.066.7.418 1.323 1.083 1.392.662.07 1.257-.44 1.321-1.14l.806-8.478Z"
//                   clip-rule="evenodd" />
//           </svg>
//         </div>`
  
//         pendingTasksContainer.innerHTML += taskItem
//       });
//     }

//     //Columna "Tareas completadas"
//     let doneTasksContainer = document.getElementById('tasksDone');

//     if(doneTasks.length === 0){
//       doneTasksContainer.innerHTML = "<p>¡No hay tareas completadas!</p>"
//     } else {
//       doneTasks.forEach((task) => {
//         let taskItem =  
//         `<div class="task">
//           <input type="checkbox" id="${task.id}" class="task-checkbox" checked>
//           <label for="${task.id}"><span class="custom-checkbox"></span>${task.task_name}</label>
//           <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none"
//               viewbox="0 0 48 48" class="delete-list delete-list-task" id="delete-${task.id}">
//               <path fill="#949BA3"
//                   d="M10.742 13.543c-.686 0-1.242.634-1.242 1.413 0 .78.556 1.413 1.24 1.413h26.518c.686 0 1.242-.633 1.242-1.413s-.556-1.413-1.244-1.413h-4.14c-.854-.024-1.756-.642-2.046-1.554l-.049-.161-.183-.63-.007-.021c-.111-.38-.209-.71-.345-1.006-.543-1.19-1.553-2.017-2.718-2.228-.294-.053-.607-.053-.966-.053h-5.604c-.357 0-.67 0-.966.053-1.165.211-2.174 1.038-2.718 2.228-.138.3-.236.635-.347 1.018l-.003.009-.185.63-.049.16c-.29.913-1.042 1.53-1.894 1.555h-4.294Z" />
//               <path fill="#949BA3" fill-rule="evenodd"
//                   d="M24.65 40.112h-1.3c-4.485 0-6.726 0-8.184-1.427-1.457-1.425-1.606-3.766-1.904-8.441l-.43-6.757c-.163-2.54-.244-3.81.488-4.616.73-.805 1.966-.805 4.435-.805h12.49c2.47 0 3.704 0 4.435.805.73.804.65 2.076.488 4.616l-.43 6.756c-.298 4.676-.447 7.015-1.903 8.442-1.46 1.427-3.7 1.427-8.184 1.427Zm-4.797-16.945c.664-.07 1.257.44 1.321 1.139l.806 8.479c.066.7-.418 1.323-1.083 1.392-.664.07-1.257-.44-1.321-1.14l-.806-8.478c-.066-.7.418-1.323 1.083-1.392Zm9.377 1.392c.067-.7-.418-1.323-1.081-1.392-.663-.07-1.259.44-1.323 1.139l-.806 8.479c-.066.7.418 1.323 1.083 1.392.662.07 1.257-.44 1.321-1.14l.806-8.478Z"
//                   clip-rule="evenodd" />
//           </svg>
//         </div>`

//         doneTasksContainer.innerHTML += taskItem
//       });
//     }

//     //Se le agrega a cada tarea la función de cambiar el estado
//     let inputCheckbox = document.querySelectorAll(".task-checkbox");
//     inputCheckbox.forEach((element) => {
//       element.addEventListener("click", changeStatus);
//     });

//     //Se le agrega a cada tarea la función de eliminarse
//     tasks.forEach((task) => {
//       let svgDeleteTask = document.getElementById(`delete-${task.id}`)
//       svgDeleteTask.addEventListener("click", deleteTask);
//     })

//     //Se agrega la función para crear una nueva tarea
//     let addTaskForm = document.getElementById('addTaskForm');
//     addTaskForm.addEventListener("submit", addTask);

//   }

//   showByStatus();

//   //Función para cambiar el estado de las tareas
//   function changeStatus(e){
   
//     //Identificamos la tarea
//     let idCheckbox = e.currentTarget.id;
//     let index = tasks.findIndex((task) => `${task.id}` === idCheckbox);

//     //Identificamos su estado
//     let taskStatus = tasks[index].done_status;
  
//     //Cambiamos su estado
//     if (taskStatus === false){
//       tasks[index].done_status = true;
//     } 
    
//     if(taskStatus === true){
//       tasks[index].done_status = false;
//     }

//     showByStatus();

//   }

//   //Función para eliminar una tarea
//   function deleteTask(e){

//     //Identificamos la tarea
//     let idSVG = e.currentTarget.id;
//     let index = tasks.findIndex((task) => `delete-${task.id}` === idSVG);

//     //La eliminamos del array
//     tasks.splice(index, 1);

//     detailContent();
//     showByStatus();

//   }

//   //Función para agregar una nueva tarea
//   function addTask(e){

//     e.preventDefault();

//     //Obtenemos los valores enviados por el form
//     let taskName = document.getElementById('newTask');

//     //Generamos un ID único (?)
//     let id = `task-${tasks.length + 100}`;

//     //Creamos un objeto con los datos ingresados
//     let newTask = {
//       id: id,
//       task_name: taskName.value,
//       done_status: false
//     }

//     //Agregamos el objeto al array tasks
//     tasks.push(newTask);

//     //Reseteamos los inputs del form
//     taskName.value = '';

//     detailContent();
//     showByStatus();

//   }
  
// }