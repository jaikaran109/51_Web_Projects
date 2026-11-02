
const main = document.getElementById("main");

const pokemonNames = [
    "Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon",
    "Charizard", "Squirtle", "Wartortle", "Blastoise", "Caterpie",
    "Metapod", "Butterfree", "Weedle", "Kakuna", "Beedrill",
    "Pidgey", "Pidgeotto", "Pidgeot", "Rattata", "Raticate",
    "Spearow", "Fearow", "Ekans", "Arbok", "Pikachu",
    "Raichu", "Sandshrew", "Sandslash", "Nidoran♀", "Nidorina",
    "Nidoqueen", "Nidoran♂", "Nidorino", "Nidoking", "Clefairy",
    "Clefable", "Vulpix", "Ninetales", "Jigglypuff", "Wigglytuff",
    "Zubat", "Golbat", "Oddish", "Gloom", "Vileplume",
    "Paras", "Parasect", "Venonat", "Venomoth", "Diglett",
    "Dugtrio", "Meowth", "Persian", "Psyduck", "Golduck"
];

const pokemon = pokemonNames.map((name, index) => ({ id: index + 1, name }));

// Shuffle without replacement so every displayed card has different artwork.
for (let i = pokemon.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [pokemon[i], pokemon[randomIndex]] = [pokemon[randomIndex], pokemon[i]];
}

pokemon.forEach(({ id, name }) => {
    const card = document.createElement("div");
    card.className = "cards";

    const img = document.createElement("img");
    img.alt = `${name} Pokémon artwork`;
    img.loading = "lazy";

    img.addEventListener("error", () => {
        if (img.dataset.fallbackApplied !== "true") {
            img.dataset.fallbackApplied = "true";
            img.src = `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/${id}.png`;
            return;
        }

        img.remove();
        card.classList.add("image-unavailable");
        card.textContent = `${name} image unavailable`;
    });

    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    card.appendChild(img);
    main.appendChild(card);
});



