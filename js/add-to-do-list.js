/* Elementos HTML */
let formAddNewList = document.getElementById("addListForm");


/* Agregar una nueva lista de tareas */
formAddNewList.addEventListener("submit", addNewList);

function addNewList(e) {
  e.preventDefault();

  //Obtenemos los valores enviados por el form
  let formName = document.getElementById("name");
  let formDescription = document.getElementById("description");
  let formType = document.querySelector('input[name="type"]:checked');

  //Generamos un ID único (?)
  let id = arrayTaskLists.length + 100;

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

  console.log(arrayTaskLists)

}