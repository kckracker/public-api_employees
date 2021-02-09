# Fetch API - Employee Startup Demo

This project is centered around implementing the fetch API to retrieve data, configure it using JSON, and dynamically display employee profiles based on JSON data retrieved. The data in this project is pulled from the random user API at https://randomuser.me/. 
--------------------------------------------------------------------------------------
***** Summary *****            
--------------------------------------------------------------------------------------
- The project can be broken down simply in three major steps:

    * First, I used a fetch request to retrieve 12 users from the English demographic to enable effective searching using English characters. The random user API gives definition on which url to use in order to specify your request at https://randomuser.me/documentation.

    * Second, I created a couple helper functions to call with the Promise.all method to ensure all promises were finished fetching.

        // The addEmployee function accepts the JSON data and dynamically creates both employee cards for the gallery as well as hidden modal windows for display with the viewModal function.

        // The searchEmployee function receives the user's input from the search bar and filters through the employee cards, hiding any employees whose names do not contain user input.

        // The viewModal function removes the hidden property of previously created HTML and inserts listeners to the previous, next, and close buttons for user navigation.

    * Finally, I created the addListeners function to add a click listener to the search button and keyup listener for the search input. Additionally, the addListeners function loops through the display of employee cards to add click listeners on each one, calling the viewModal function upon user click.

--------------------------------------------------------------------------------------
***** CSS Styling Changes *****
--------------------------------------------------------------------------------------
* Font changed to Libre Baskerville and title size increased to 1.9em for better visibility.

* Background color switched to light blue for greater contrast with employee cards.

* Card color deepened to dark grey with light text and goldenrod yellow headers. Added matching goldenrod accents to borders across the program.

* Decreased the image border radius to create a soft square image for employees and softened the card radius slightly to decrease the sharpness of the corners.

* Added animation to header to change title to goldenrod yellow and shift right on hover. 

--------------------------------------------------------------------------------------
***** Final Notes *****
--------------------------------------------------------------------------------------
* Removed the Next and Previous buttons dynamically for user-friendly modal display when navigating the employee.

Thank you for taking the time to review my program. Cheers!