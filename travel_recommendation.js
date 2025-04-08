const btnSearch = document.getElementById('btnSearch');
const resultDiv = document.getElementById("search-results");
const btnClear = document.getElementById('btnClear');

function searchDest() {
  const inputElement = document.getElementById('destinationnInput');
  const input = inputElement.value.toLowerCase().trim();
  resultDiv.innerHTML = '';
  resultDiv.style.display = 'none';

  fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
      let found = false;

      const showPlaces = (places, label, category) => {
        resultDiv.innerHTML += `<h2>${label}</h2>`;
        places.forEach(place => {
          resultDiv.innerHTML += `
            <div class="city-card">
              <h3>${place.name} ${category ? `<span class="category">(${category})</span>` : ''}</h3>
              <img src="${place.imageUrl}" alt="${place.name}">
              <p>${place.description}</p>
            </div>
          `;
        });
        resultDiv.style.display = 'flex';
      };

      // 1. WZORCE: beach / temple / city
      if (["beach", "beaches"].includes(input)) {
        found = true;
        showPlaces(data.beaches, "Popular Beaches", "Beach");
      } else if (["temple", "temples"].includes(input)) {
        found = true;
        showPlaces(data.temples, "Famous Temples", "Temple");
      } else if (["city", "cities"].includes(input)) {
        // Agregujemy wszystkie miasta z krajów
        const allCities = data.countries.flatMap(c => c.cities || []);
        found = true;
        showPlaces(allCities, "Major Cities", "City");
      }

      // 2. SZUKAJ PO KRAJU
      const country = data.countries.find(c => c.name.toLowerCase() === input);
      if (country) {
        found = true;
        const allCountryPlaces = [...(country.cities || [])];

        // Plaże i świątynie zawierające nazwę kraju
        const extraBeaches = data.beaches.filter(b => b.name.toLowerCase().includes(country.name.toLowerCase()));
        const extraTemples = data.temples.filter(t => t.name.toLowerCase().includes(country.name.toLowerCase()));
        
        showPlaces(allCountryPlaces, `Cities in ${country.name}`, "City");
        if (extraBeaches.length > 0) showPlaces(extraBeaches, `Beaches in ${country.name}`, "Beach");
        if (extraTemples.length > 0) showPlaces(extraTemples, `Temples in ${country.name}`, "Temple");
      }

      // 3. SZUKAJ PO FRAGMENCIE NAZWY
      const allPlaces = [
        ...data.beaches.map(p => ({ ...p, category: 'Beach' })),
        ...data.temples.map(p => ({ ...p, category: 'Temple' })),
        ...data.countries.flatMap(c => (c.cities || []).map(p => ({ ...p, category: 'City' })))
      ];

      const nameMatches = allPlaces.filter(p => p.name.toLowerCase().includes(input));
      if (nameMatches.length > 0 && !found) {
        found = true;
        showPlaces(nameMatches, `Results for "${inputElement.value}"`);
      }

      if (!found) {
        resultDiv.innerHTML = `<p>No results found for "${inputElement.value}".</p>`;
        resultDiv.style.display = 'flex';
      }
      
        inputElement.value = "";
    })
    .catch(error => {
      console.error('Error:', error);
      resultDiv.innerHTML = 'An error occurred while fetching data.';
      resultDiv.style.display = 'flex';
    });
}

function clear(){
    resultDiv.innerHTML = '';
    resultDiv.style.display = 'none'; 
}

btnSearch.addEventListener('click', searchDest);
btnClear.addEventListener('click', clear);