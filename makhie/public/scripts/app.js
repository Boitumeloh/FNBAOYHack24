document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/businesses')
        .then(response => response.json())
        .then(data => {
            const businessList = document.getElementById('businesses');
            data.forEach(business => {
                const li = document.createElement('li');
                li.textContent = `${business.business_name} - ${business.industry}`;
                businessList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching businesses:', error));
});
