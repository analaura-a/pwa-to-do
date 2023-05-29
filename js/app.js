/* Elementos HTML */
let body = document.getElementById("body");
let navGoBack = document.getElementById("back-to-lists");
let mainTitle = document.getElementById("main-title");
let mainSubtitle = document.getElementById("main-subtitle");
let listType = document.getElementById("list-type");
let appContentContainer = document.getElementById("dinamic-content");
let modalAddNewList = document.getElementById("bg-modal-newlist");
let formAddNewList = document.getElementById("addListForm");
let closeModalAddNewList = document.getElementById("close-modal");
let showOnDetail = document.querySelectorAll(".show-on-detail");
let deleteTaskListButton;
let taskListPage;


/* ARRAY Listas de tareas */
let arrayTaskLists = [];


/* FETCH */
async function fetchTaskLists() {
  try {
    let response = await fetch("../tasks.json");
    let taskLists = await response.json();
    return taskLists;
  } catch (error) {
    console.log(error);
  }
}


/* Agregamos las listas de tareas existentes en el JSON al arrayTaskLists */
fetchTaskLists()
  .then((data) => {

    data.forEach((taskList) => {
        arrayTaskLists.push(taskList);
    })

    renderTaskLists();
  })

  .catch((json) => console.log(json));


/* Mostrar el listado (Listas de tareas) */
function renderTaskLists() {

  vaciarContainer();

  //Escondemos los elementos necesarios
  showOnDetail.forEach((element) => {
    element.classList.add("show-on-detail");
  });

  // Cambiamos el contenido del título de la página
  mainTitle.textContent = "Mis listas de tareas";
  mainSubtitle.innerHTML = `¡Mantené tus to-dos ordenados agrupándolos por listas! <br>
  Podés crear todas las que necesites.`;

  //Creamos y agregamos el contenedor de las listas de tareas
  let divTasklistsContainer = crearTasklistsContainer();
  appContentContainer.appendChild(divTasklistsContainer);

  //Creamos una card por cada lista de tareas
  arrayTaskLists.forEach((taskList) => {
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
                          <p class="list-task-count bold-paragraph text-dark">${taskList.tasks.length}/${taskList.tasks.length}</p>
                      </button>`;

    divTasklistsContainer.innerHTML += cardList;
  });

  //Evento para eliminar una lista de tareas
  arrayTaskLists.forEach((taskList) => {

    deleteTaskListButton = document.getElementById(`delete-list-${taskList.id}`);

    deleteTaskListButton.addEventListener("click", function (e) {
    
      //Identificamos la lista
      let idBoton = e.currentTarget.id;
      let index = arrayTaskLists.findIndex((taskList) => `delete-list-${taskList.id}` === idBoton);

      //La eliminamos del array
      arrayTaskLists.splice(index, 1);
      console.log(arrayTaskLists);

      renderTaskLists();

    });
  });

  //Evento para ver las tareas (Página de detalle)
  arrayTaskLists.forEach((taskList) => {
    taskListPage = document.getElementById(`${taskList.id}`);
    taskListPage.addEventListener("click", renderTasks);
  });

  //Creamos y agregamos el botón "Agregar una nueva lista de tareas"
  let buttonNewList = crearButtonNewList();
  divTasklistsContainer.appendChild(buttonNewList);
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
let crearButtonNewList = function () {
  let button = document.createElement("button");
  button.classList.add("add-list");
  button.setAttribute("id", "add-list");
  button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewbox="0 0 48 48">
        <path fill="#949BA3"
            d="M38 22H26V10a2 2 0 1 0-4 0v12H10a2 2 0 1 0 0 4h12v12a2 2 0 0 0 4 0V26h12a2 2 0 0 0 0-4Z" />
  </svg>
  <p>Agregar una nueva lista</p>`;

  /* Evento para mostrar el formulario */
  button.addEventListener("click", function () {
    modalAddNewList.style.display = "grid";
    body.style.overflowY = "hidden";
  });

  return button;
};

/* Eventos para esconder el formulario */
function hideModal(){
  modalAddNewList.style.display = "none";
  body.style.overflowY = "scroll";
}

closeModalAddNewList.addEventListener("click", hideModal);

window.addEventListener("click", function (event) {
  if (event.target == modalAddNewList) {
    hideModal();
  }
});


/* Agregar una nueva lista de tareas */
formAddNewList.addEventListener("submit", addNewList);

function addNewList(e) {
  e.preventDefault();

  //Obtenemos los valores enviados por el form
  let formName = document.getElementById("name");
  let formDescription = document.getElementById("description");
  let formType = document.querySelector('input[name="type"]:checked');

  //Generamos un ID único (?)
  let id = arrayTaskLists.length + 1;

  //Creamos un objeto con los datos ingresados
  let newList = {
    id: id,
    name: formName.value,
    description: formDescription.value,
    type: formType.value,
    tasks: [],
  };

  //Agregamos el objeto al arrayTaskLists
  arrayTaskLists.push(newList);

  //Reseteamos los inputs del form
  formName.value = '';
  formDescription.value = '';
  formType.checked = false;

  hideModal();

  renderTaskLists();

}


/* Ver las tareas (Página de detalle) */
function renderTasks(e){

  // Identificamos la lista 
  let idList = e.currentTarget.id;
  let index = arrayTaskLists.findIndex((taskList) => `${taskList.id}` === idList);

  // Guardamos en variables
  let selectedTaskList = arrayTaskLists[index];
  // console.log(selectedTaskList);
  let tasks = arrayTaskLists[index].tasks;
  // console.log(tasks);


  //Creamos 2 arrays nuevos a partir del array "tasks", usando el estado de sus tareas ("done_status")
  let pendingTasks = [];
  let doneTasks = [];

  tasks.forEach((task) => {
    if (task.done_status == false){
      pendingTasks.push(task);
    } else if (task.done_status == true){
      doneTasks.push(task);
    } else {
      console.log(task);
    }
  });

  vaciarContainer();

  // Agregamos en el nav la posibilidad de volver atrás
  showOnDetail.forEach((element) => {
    element.classList.remove("show-on-detail");
  });
  navGoBack.addEventListener("click", renderTaskLists);

  // Cambiamos el contenido del título de la página
  mainTitle.textContent = selectedTaskList.name;
  mainSubtitle.textContent = selectedTaskList.description;
  listType.textContent = selectedTaskList.type;

  // Agregamos contenido propio de la página de detalle
  appContentContainer.innerHTML += 
  `<form action="#" id="addTaskForm">
    <input type="text" id="newTask" name="newTask" placeholder="Agregar una nueva tarea..." required>
    <button type="submit">Agregar tarea</button>
  </form>

  <div class="filters-container">
    <div class="filters">
        <p class="bold-paragraph text-title">Filtrar por:</p>
        <button type="button" class="filter-button filter-selected">Estado</button>
        <button type="button" class="filter-button">Prioridad</button>
    </div>
    <p>${tasks.length} tareas en total</p>
  </div>

  <div class="tasks-container" id="tasks-container"></div>`

  // Seleccionamos los elementos necesarios para mostrar las tareas (POR ESTADO)
  let tasksContainer = document.getElementById('tasks-container');

  let columnTasksPending = document.createElement('div');
  columnTasksPending.classList.add("column-tasks");
  let columnTasksDone = document.createElement('div');
  columnTasksDone.classList.add("column-tasks");

  tasksContainer.appendChild(columnTasksPending);
  tasksContainer.appendChild(columnTasksDone);

  //Columna "Tareas pendientes"
  columnTasksPending.innerHTML += 
  `
  <div class="tasks-info">
    <h2 class="h3">Pendientes</h2>
    <span class="task-counter">4</span>
  </div>

  <div class="tasks" id="tasksPending"></div>
  `;

  let pendingTasksContainer = document.getElementById('tasksPending');

  pendingTasks.forEach((task) => {
    let taskItem =  
    `<div class="task">
      <input type="checkbox" id="${task.id}" class="task-checkbox">
      <label for="${task.id}"><span class="custom-checkbox"></span>${task.task_name}</label>
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none"
          viewbox="0 0 48 48" class="delete-list delete-list-task">
          <path fill="#949BA3"
              d="M10.742 13.543c-.686 0-1.242.634-1.242 1.413 0 .78.556 1.413 1.24 1.413h26.518c.686 0 1.242-.633 1.242-1.413s-.556-1.413-1.244-1.413h-4.14c-.854-.024-1.756-.642-2.046-1.554l-.049-.161-.183-.63-.007-.021c-.111-.38-.209-.71-.345-1.006-.543-1.19-1.553-2.017-2.718-2.228-.294-.053-.607-.053-.966-.053h-5.604c-.357 0-.67 0-.966.053-1.165.211-2.174 1.038-2.718 2.228-.138.3-.236.635-.347 1.018l-.003.009-.185.63-.049.16c-.29.913-1.042 1.53-1.894 1.555h-4.294Z" />
          <path fill="#949BA3" fill-rule="evenodd"
              d="M24.65 40.112h-1.3c-4.485 0-6.726 0-8.184-1.427-1.457-1.425-1.606-3.766-1.904-8.441l-.43-6.757c-.163-2.54-.244-3.81.488-4.616.73-.805 1.966-.805 4.435-.805h12.49c2.47 0 3.704 0 4.435.805.73.804.65 2.076.488 4.616l-.43 6.756c-.298 4.676-.447 7.015-1.903 8.442-1.46 1.427-3.7 1.427-8.184 1.427Zm-4.797-16.945c.664-.07 1.257.44 1.321 1.139l.806 8.479c.066.7-.418 1.323-1.083 1.392-.664.07-1.257-.44-1.321-1.14l-.806-8.478c-.066-.7.418-1.323 1.083-1.392Zm9.377 1.392c.067-.7-.418-1.323-1.081-1.392-.663-.07-1.259.44-1.323 1.139l-.806 8.479c-.066.7.418 1.323 1.083 1.392.662.07 1.257-.44 1.321-1.14l.806-8.478Z"
              clip-rule="evenodd" />
      </svg>
    </div>`

    pendingTasksContainer.innerHTML += taskItem
  });

  //Columna "Tareas completadas"
  columnTasksDone.innerHTML += 
  `
  <div class="tasks-info">
    <h2 class="h3">Completadas</h2>
    <span class="task-counter">3</span>
  </div>

  <div class="tasks" id="tasksDone"></div>
  `;

  let doneTasksContainer = document.getElementById('tasksDone');

  doneTasks.forEach((task) => {
    let taskItem =  
    `<div class="task">
      <input type="checkbox" id="${task.id}" class="task-checkbox" checked>
      <label for="${task.id}"><span class="custom-checkbox"></span>${task.task_name}</label>
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none"
          viewbox="0 0 48 48" class="delete-list delete-list-task">
          <path fill="#949BA3"
              d="M10.742 13.543c-.686 0-1.242.634-1.242 1.413 0 .78.556 1.413 1.24 1.413h26.518c.686 0 1.242-.633 1.242-1.413s-.556-1.413-1.244-1.413h-4.14c-.854-.024-1.756-.642-2.046-1.554l-.049-.161-.183-.63-.007-.021c-.111-.38-.209-.71-.345-1.006-.543-1.19-1.553-2.017-2.718-2.228-.294-.053-.607-.053-.966-.053h-5.604c-.357 0-.67 0-.966.053-1.165.211-2.174 1.038-2.718 2.228-.138.3-.236.635-.347 1.018l-.003.009-.185.63-.049.16c-.29.913-1.042 1.53-1.894 1.555h-4.294Z" />
          <path fill="#949BA3" fill-rule="evenodd"
              d="M24.65 40.112h-1.3c-4.485 0-6.726 0-8.184-1.427-1.457-1.425-1.606-3.766-1.904-8.441l-.43-6.757c-.163-2.54-.244-3.81.488-4.616.73-.805 1.966-.805 4.435-.805h12.49c2.47 0 3.704 0 4.435.805.73.804.65 2.076.488 4.616l-.43 6.756c-.298 4.676-.447 7.015-1.903 8.442-1.46 1.427-3.7 1.427-8.184 1.427Zm-4.797-16.945c.664-.07 1.257.44 1.321 1.139l.806 8.479c.066.7-.418 1.323-1.083 1.392-.664.07-1.257-.44-1.321-1.14l-.806-8.478c-.066-.7.418-1.323 1.083-1.392Zm9.377 1.392c.067-.7-.418-1.323-1.081-1.392-.663-.07-1.259.44-1.323 1.139l-.806 8.479c-.066.7.418 1.323 1.083 1.392.662.07 1.257-.44 1.321-1.14l.806-8.478Z"
              clip-rule="evenodd" />
      </svg>
    </div>`

    doneTasksContainer.innerHTML += taskItem
  });

  //Cambiar el estado de las tareas
  inputCheckbox = document.querySelectorAll(".task-checkbox");
  inputCheckbox.forEach((element) => {
    element.addEventListener("click", (e) => {

      //Identificamos la tarea
      let idCheckbox = e.currentTarget.id;
      let index = tasks.findIndex((task) => `${task.id}` === idCheckbox);

      //Identificamos su estado
      let taskStatus = tasks[index].done_status;
      console.log(tasks[index]);
    
      //Cambiamos su estado
      if (taskStatus === false){
        taskStatus = true;
        // element.checked = true;
      } 
      
      if(taskStatus === true){
        taskStatus = false;
        // element.checked = false;
      }
    
      console.log(tasks[index]);

    });
  });
  
}