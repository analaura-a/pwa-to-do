/* Elementos HTML */
let appContentContainer = document.getElementById('dinamic-content');
let modalAddNewList = document.getElementById('bg-modal-newlist');
let divTasklistsContainer;


/* FETCH */
let fetchTaskLists = async function () {
    try {
        let response = await fetch('../tasks.json');
        let taskLists = response.json();
        return taskLists;
    } catch (e) {
        console.log(e);
    }
}


/* Función para mostrar el listado de "Listas de tareas" */
let renderTaskLists = function () {

    //Vaciamos el contenedor
    vaciarContainer();

    //Creamos el contenedor de las cards 1 sola vez y lo appendeamos dentro del HTML
    crearTasklistsContainer();

    //Lo guardamos en una variable para poder acceder a él luego
    divTasklistsContainer = document.getElementById('divTasklistsContainer');

    //Renderizamos las Listas de Tareas por cada una de las que existen en el JSON
    fetchTaskLists()
        .then(data => data.forEach(taskList => {

            //Creamos las cards y les asignamos su contenido
            let cardList =
                `<button class="list">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewbox="0 0 48 48"
                        class="delete-list">
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
                </button>`

            //Agregamos las cards en el contenedor de las cards
            divTasklistsContainer.innerHTML += cardList;

        }))
        .catch(json => console.log(json));

    //Creamos el botón "agregar una lista" 1 sola vez
    crearButtonNewList();

    /* ESTO NO FUNCIONA: */
    let buttonWithID = document.getElementById('add-list');
    console.log(buttonWithID)

    buttonWithID.addEventListener("click", function () {
        console.log('hice click');
        modalAddNewList.style.display = "grid";
    })

}

/* Función para vaciar el contenedor */
let vaciarContainer = function () {
    appContentContainer.innerHTML = "";
}

/* Función para vaciar el contenedor */
let crearTasklistsContainer = function () {
    let divTasklistsContainer = document.createElement("div");
    divTasklistsContainer.classList.add("lists-container");
    divTasklistsContainer.setAttribute("id", "divTasklistsContainer");

    appContentContainer.appendChild(divTasklistsContainer);
}

/* Función para crear el botón "Agregar nueva lista de tareas" */
let crearButtonNewList = function () {
    let button = document.createElement("button");
    button.classList.add("add-list");
    button.setAttribute("id", "add-list");
    button.innerHTML =
        `
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewbox="0 0 48 48">
                <path fill="#949BA3"
                    d="M38 22H26V10a2 2 0 1 0-4 0v12H10a2 2 0 1 0 0 4h12v12a2 2 0 0 0 4 0V26h12a2 2 0 0 0 0-4Z" />
            </svg>
            <p>Agregar una nueva lista</p>
        `;

    //Lo agregamos al contenedor junto a las cards de las Listas de tareas
    divTasklistsContainer.append(button);

    /* ESTO NO FUNCIONA: */
    button.addEventListener("click", function () {
        console.log('hice click');
        modalAddNewList.style.display = "grid";
    })

}


renderTaskLists();