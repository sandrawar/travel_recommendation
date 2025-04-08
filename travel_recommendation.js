const btnSearch = document.getElementById('btnSearch');
const resultDiv = document.getElementById("search-results");

function searchDest() {
  const inputElement = document.getElementById('destinationnInput');
  const input = inputElement.value.toLowerCase();
  resultDiv.innerHTML = '';  // Czyszczenie wyników przed dodaniem nowych

  fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
      const country = data.countries.find(item => item.name.toLowerCase() === input);

      if (country) {
        const cities = country.cities;

        cities.forEach(city => {
          resultDiv.innerHTML += `
            <div class="city-card">
              <h3>${city.name}</h3>
              <img src="${city.imageUrl}" alt="${city.name}">
              <p>${city.description}</p>
            </div>
          `;
        });

        // Pokazanie wyników wyszukiwania
        resultDiv.style.display = 'flex';  // Pokazuje kontener wyników wyszukiwania
      } else {
        resultDiv.innerHTML = 'Destination not found.';
        resultDiv.style.display = 'flex';  // Pokazuje komunikat o braku wyników
      }
    })
    .catch(error => {
      console.error('Error:', error);
      resultDiv.innerHTML = 'An error occurred while fetching data.';
      resultDiv.style.display = 'flex';  // Pokazuje komunikat o błędzie
    });
}

btnSearch.addEventListener('click', searchDest);
