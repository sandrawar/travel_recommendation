const btnSearch = document.getElementById('btnSearch');
const resultDiv = document.getElementById("search-results");

function searchDest() {
  const inputElement = document.getElementById('destinationnInput');
  const input = document.getElementById('destinationnInput').value.toLowerCase();
  resultDiv.innerHTML = ''; 

  fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
      const country = data.countries.find(item => item.name.toLowerCase() === input);

      if (country) {
        const cities = country.cities;

        cities.forEach(city => {
          resultDiv.innerHTML += `
            <div class="city">
              <h3>${city.name}</h3>
              <img src="${city.imageUrl}" alt="${city.name}" style="max-width: 200px;">
              <p>${city.description}</p>
            </div>
          `;
        });
        inputElement.value = '';
      } else {
        resultDiv.innerHTML = 'Destination not found.';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      resultDiv.innerHTML = 'An error occurred while fetching data.';
    });
}

btnSearch.addEventListener('click', searchDest);
