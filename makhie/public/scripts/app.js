document.addEventListener('DOMContentLoaded', () => {

    // Fetches business data from database to display on home page
    fetch('/api/businesses')
        .then(response => response.json())
        .then(data => {
            console.log(data);

            // TODO

        })
        .catch(error => console.error('Error fetching businesses:', error));
});
