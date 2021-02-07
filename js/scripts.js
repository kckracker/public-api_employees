//***** GLOBAL VARIABLES *****/
const searchContainer = document.querySelector('.search-container');
// Sourced syntax and functionality of Request object from https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
// CORS added as mode value due to initial fetch issues with missing Allow-Control-Allow-Origin header on API.
const randomStudent = new Request("https://randomuser.me/api/?results=12&&nat=us", {
    mode: "cors"
});
const studentGallery = document.querySelector('#gallery');
const students = [];
let studentCards = [];
let modalWindows = [];
let names = [];


//Inserting hidden text to display if search does not yield a match.
document.querySelector('body').insertAdjacentHTML('beforeend', `<h3 id="not-found" hidden>Sorry, your search did not return any results.</h3>`);
// Creating global reference to hidden message for use with search helper function
const notFound = document.querySelector('#not-found');

//***** SEARCH BAR DOM CODE *****/

/* 
Inserting searchbar utilizing the code supplied in project. 
Inserting adjacent HTML to prevent re-writing of DOM.
 */
searchContainer.insertAdjacentHTML('beforeend', `<form action="#" method="get">
<input type="search" id="search-input" class="search-input" placeholder="Search by name...">
<input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
</form>`);


//***** FETCH FUNCTION *****//

/**
 * Function to handle fetching API and pushing data to DOM
 * @param {url} url - Accepts API url to pull random student data, parse data to JSON, 
 * push data to DOM, and add Event Listeners to DOM elements.
 * - Use Promise.all to call addStudent and addListeners functions with collective promise data.
 * - Add event listeners after addStudent function to ensure all DOM elements have been added.
 */

async function fetchStudent(url){
    await fetch(url)
    .then(response => response.json())
    .then(data => {
        students.push(data.results);
    });
    await Promise.all(students)
    .then((data) => {
        addStudent(data);
        addListeners(studentCards);
    })
    
}

//***** HELPER FUNCTIONS *****//

/**
 * Function handling generation of DOM elements and distribution of API data to the newly formed DOM elements.
 * @param {array} array Accepts array of JSON objects retrieved from student API stored at randomStudent
 */
function addStudent(arrays){
    // Ensure innerHTML of gallery div is reset upon refresh of page
    studentGallery.innerHTML = ``;
    // Loop through each element of supplied JSON data and inserting HTML from supplied values in JSON data
    for(let array of arrays){
        for(let student of array){
            studentGallery.insertAdjacentHTML('beforeend', `
            <div class="card">
                <div class="card-img-container">
                    <img class="card-img" src=${student.picture.medium} alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${student.name.first} ${student.name.last}</h3>
                    <p class="card-text">${student.email}</p>
                    <p class="card-text cap">${student.location.city}</p>
                </div>
            </div>
        `)
            /*
            - Inserting Modal Windows in body tag as hidden elements to be revealed with user selection
            - Filtering birth date and phone number through Regex filter and grouping needed matches to 
                reconfigure display returned on modal window.
            */
            document.querySelector('body').insertAdjacentHTML('beforeend', `
            <div class="modal-container" hidden>
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                        <img class="modal-img" src=${student.picture.large} alt="profile picture">
                        <h3 id="name" class="modal-name cap">${student.name.first} ${student.name.last}</h3>
                        <p class="modal-text">${student.email}</p>
                        <p class="modal-text cap">${student.location.city}</p>
                        <hr>
                        <p class="modal-text">${student.phone.replace(/^(\(\d{3}\))-(\d{3}-\d{4})$/, '$1 $2')}</p>
                        <p class="modal-text">${student.location.street.number} ${student.location.street.name}, ${student.location.city}, ${student.location.state} ${student.location.postcode}</p>
                        <p class="modal-text">Birthday: ${student.dob.date.replace(/^(\d{4})-(\d{2})-(\d{2}).+$/, '$2/$3/$1')}</p>
                    </div>
                </div>
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
            </div>
                `)
        }
    }
    /*
    - Pushing newly created student card objects into empty studentCards array for use with DOM manipulation in helper function.
    - Pushing newly created modal windows into separate array for use with DOM manipulation in helper function.
    - Pushing card names into separate array to use as validator in search helper function
    */
    studentCards.push(document.querySelectorAll('div.card'));
    modalWindows.push(document.querySelectorAll('.modal-container'));
    names.push(document.querySelectorAll('#name.card-name'));
}

/**
 * Filters student display based on search input for names searched
 * @param {input} - Accepts value of user input, looping over names array to determine if input matches a name
 * - If a match is found or input is empty:
 *      - Matching name cards are displayed
 *      - Found counter variable is incremented
 *      - Hidden display for no matches remains hidden
 * - Else the display for each card is set to none
 * 
 * - If found counter variable equals 0 upon looping through names:
 *      -  Hidden display for no matches is set to display
 */

function searchStudent(input){
    let found = 0;
    for(let i = 0; i <names.length; i++){
        for(let j = 0; j < names[i].length; j++){
            let nameCard = names[i][j].parentNode.parentNode;
            if (names[i][j].innerText.toLowerCase().includes(input.toLowerCase()) || input === ""){
                nameCard.style.display = 'block';
                found += 1;
                notFound.hidden = true;
            } else{
                names[i][j].parentNode.parentNode.style.display = 'none';
            }
        }
    }
    if (found === 0){
        notFound.hidden = false;
    }
}

/**
 * - Helper function loops through modal windows array,
 *       displaying hidden content matching array index of clicked student card
 * @param {number} counter - Accepts number of array index of student cards clicked on by user
 *  - Loops through each modal window in DOM:
 *      - Applies event listener on previous button to display previous student if clicked and hide current.
 *          - If previous window is first in array, previous button is hidden from window.
 *      - Applies identical listener to next button to display next student if clicked and hide current.
 *          - If next window is last in array, next button is hidden from display.
 *      - Applies event listener on close button to return hidden status to modal window if clicked.
 *      - If first student card is clicked, prev button will not display. If last student card is clicked, next button will not display.
 *  
 */
function viewModal(counter){
    for (let i = 0; i < modalWindows.length; i++){
        for(let j = 0; j < modalWindows[i].length; j++){
            modalWindows[i][j].querySelector('#modal-close-btn').onclick = () => modalWindows[i][j].hidden = true;
            modalWindows[i][j].querySelector('#modal-prev').onclick =() => {
                    if(j > 0 ){
                        modalWindows[i][j].hidden = true;
                        modalWindows[i][j - 1].hidden = false;
                    } 
                    if (j - 1 === 0){
                        modalWindows[i][j - 1].querySelector('#modal-prev').style.display = 'none';
                    }
                }
                modalWindows[i][j].querySelector('#modal-next').onclick = () => {
                    if(j < 11){
                    modalWindows[i][j].hidden = true;
                    modalWindows[i][j + 1].hidden = false;
                    }
                    if(j + 1 === 11){
                        modalWindows[i][j + 1].querySelector('#modal-next').style.display = 'none';
                    }
                    
                }
            if(counter === j){
                modalWindows[i][j].hidden = false;
                if (j === 0){
                    modalWindows[i][j].querySelector('#modal-prev').style.display = 'none';
                } else if(j === 11){
                    modalWindows[i][j].querySelector('#modal-next').style.display = 'none';
                }
            } 
        }
    }
}

//***** EVENT LISTENERS *****//

/**
 * Function inserting event listeners for search function and modal window toggling
 * @param {array} - Accepts array of studentCards to allow listeners to apply and affect all student cards displayed
 * - Loops through array pushed as parameter: 
 *      - Adds keyup listener to search input field and calls searchStudent helper function, supplying user input
 *      - Adds click listener to search button and calls searchStudent helper function, supplying user input from input field
 *      - Loops through each array index of the array supplied: 
 *          - Adds click listener to each student card and calls viewModal helper funtion, supplying index of student card in array.
 */
function addListeners(array){
    // Creating reference to search DOM elements for ease of reference and inserting here because elements are created dynamically.
    const searchInput = document.querySelector('#search-input');
    const searchButton = document.querySelector('#search-submit');
    for (let i = 0; i < array.length; i++){
        //Calling event listener for search bar and button inside loop of student cards
        searchInput.addEventListener('keyup', (e) => {
            searchStudent(searchInput.value);
        })
        searchButton.addEventListener('click', () => {
            searchStudent(searchInput.value);
        })
        
        for (let j = 0; j < array[i].length; j++){
            array[i][j].addEventListener('click', (e) => {
                viewModal(j);
            })   
        }

    }
}

    


//***** FUNCTION CALL & TIMEOUT *****//
/*
- Calling fetchStudent function, supplying reference to Request object variable randomStudent.
- Adding window timeout to ensure fetch has time to retrieve all necessary data for DOM manipulation.
*/ 
fetchStudent(randomStudent);
window.setTimeout(1000);