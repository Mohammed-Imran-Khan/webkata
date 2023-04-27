// Define constants
const API_URL = "https://pokeapi.co/api/v2";
const POKEMON_PER_PAGE = 50;

// Get DOM elements
const pokemonListElement = document.getElementById("pokemon-list");
const prevPageButton = document.getElementById("prev-page");
const nextPageButton = document.getElementById("next-page");
const currentPageElement = document.getElementById("current-page");

// Define variables
let currentPage = 1;
let totalPages = 0;

// Fetch data from API
async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error:", error);
  }
}

// Display list of pokemon
async function displayPokemonList(offset, limit) {
  const data = await fetchData(
    `${API_URL}/pokemon?offset=${offset}&limit=${limit}`
  );

  const pokemonList = await Promise.all(
    data.results.map(async (pokemon) => {
      const details = await fetchData(pokemon.url);
      const abilities = details.abilities.map(
        (ability) => `<li>${ability.ability.name}</li>`
      );
      const moves = details.moves.map(
        (move) => `<li>${move.move.name}</li>`
      );
      const weight = details.weight;

      return `
        <div class="pokemon">
          <h2>${pokemon.name}</h2>
          <p><strong>Abilities:</strong></p>
          <ul>${abilities.join("")}</ul>
          <p><strong>Moves:</strong></p>
          <ul>${moves.join("")}</ul>
          <p><strong>Weight:</strong> ${weight}</p>
        </div>
      `;
    })
  );

  pokemonListElement.innerHTML = pokemonList.join("");
}

// Display current page
function displayCurrentPage() {
  currentPageElement.textContent = currentPage;
}

// Display previous page
function displayPrevPage() {
  if (currentPage > 1) {
    currentPage -= 1;
    displayPokemonList((currentPage - 1) * POKEMON_PER_PAGE, POKEMON_PER_PAGE);
    displayCurrentPage();
  }
}

// Display next page
function displayNextPage() {
  if (currentPage < totalPages) {
    currentPage += 1;
    displayPokemonList((currentPage - 1) * POKEMON_PER_PAGE, POKEMON_PER_PAGE);
    displayCurrentPage();
  }
}

// Get total number of pokemon
async function getTotalPokemon() {
  const data = await fetchData(`${API_URL}/pokemon?offset=0&limit=1`);
  return data.count;
}

// Initialize the app
async function init() {
  const totalPokemon = await getTotalPokemon();
  totalPages = Math.ceil(totalPokemon / POKEMON_PER_PAGE);
  displayPokemonList(0, POKEMON_PER_PAGE);
  displayCurrentPage();
}

// Event listeners
prevPageButton.addEventListener("click", displayPrevPage);
nextPageButton.addEventListener("click", displayNextPage);

// Initialize the app
init();
