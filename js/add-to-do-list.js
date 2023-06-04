/* Elementos HTML DOM */
let formAddNewList = document.getElementById("addListForm");


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
    type: formType.value,
    tasks: [],
  };

  //Agregamos el objeto a nuestra base de datos indexedDB
  let db;
  const DBOpenRequest = indexedDB.open('toDoApp', 1);

  DBOpenRequest.onsuccess = function(event) {
    db = event.target.result;

    const transaction = db.transaction(['toDoLists'], 'readwrite');
    let objectStore = transaction.objectStore('toDoLists');

    let request = objectStore.add(newList);

    request.onsuccess = function(event) {
      console.log('Se agregó la nueva lista de tareas con éxito');

      //Reseteamos los inputs del form
      formName.value = '';
      formDescription.value = '';
      formType.checked = false;

    };

    request.onerror = function(event) {
      console.log('Ocurrió un error intentando agregar la nueva lista de tareas');
    };
  }
  
  //Redirección a pagina de listado? Pop-up de confirmación?

}