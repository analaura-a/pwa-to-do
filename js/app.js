// try {
//     let data = await fetch('...');
// } catch (e) {
//     console.log(e);
// }

// data
//     .then(r => r.json())
//     .catch(json => console.log(json));


// fetch('https://jsonplaceholder.typicode.com/photos')
//     .then(response => response.json())
//     .then(json => console.log(json))



async function fetchFullAlbum() {
    let response = await fetch('../tasks.json');
    let photos = response.json();
    return photos
}

fetchFullAlbum()
    .then(res => console.log(res));