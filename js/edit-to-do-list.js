/* Elementos HTML DOM */
let formEditList = document.getElementById("editListForm");
console.log(formEditList);

//Obtener datos de la lista actual y mostrarlos en el form
function getListData(){

    let formName = formAddNewList.name;
    let formDescription = formAddNewList.description;
    let formType = document.querySelector('input[name="type"]:checked');

}


/* Editar lista de tareas */
formEditList.addEventListener("submit", editList);

function editList(e) {
    e.preventDefault();

     //Que en submit esos datos se actualicen

   
}
