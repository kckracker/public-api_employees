const searchContainer = document.querySelector('.search-container');
const randomStudent = 'https://randomuser.me/api/';
const studentGallery = document.querySelector('#gallery');

searchContainer.insertAdjacentHTML('beforeend', `<form action="#" method="get">
<input type="search" id="search-input" class="search-input" placeholder="Search...">
<input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
</form>`);


//***** HELPER FUNCTIONS *****//

/**
 * Function to handle fetching API and pushing data to DOM
 * @param {url} url Accepts API url to pull random student data, parse data to JSON, and push data to DOM
 */
function fetchStudent(url){
    fetch(url)
    .then(response => response.json())
    .then(data => {
        addStudent(data.results);
    });
}

/**
 * Function handling generation of DOM elements and distribution of API data to the newly formed DOM elements.
 * @param {array} array Accepts array of JSON objects retrieved from student API stored at randomStudent
 */
function addStudent(array){
    for(let student of array){
        studentGallery.insertAdjacentHTML('beforeend', `<div class="card">
        <div class="card-img-container">
            <img class="card-img" src=${student.picture.medium} alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${student.name.first} ${student.name.last}</h3>
            <p class="card-text">${student.email}</p>
            <p class="card-text cap">${student.location.city}, ${student.location.state}</p>
        </div>
    </div>`)
    }
}

console.log(fetchStudent(randomStudent));