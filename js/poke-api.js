const pokeApi = {}

function convertPokeApiDetailsToPokemon(pokeDetails) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetails.order
    pokemon.name = pokeDetails.name

    const types = pokeDetails.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type
    pokemon.photo = pokeDetails.sprites.other.dream_world.front_default

    // Adiciona atributos básicos
    pokemon.hp = pokeDetails.stats.find(stat => stat.stat.name === 'hp')?.base_stat
    pokemon.attack = pokeDetails.stats.find(stat => stat.stat.name === 'attack')?.base_stat
    pokemon.defense = pokeDetails.stats.find(stat => stat.stat.name === 'defense')?.base_stat
    pokemon.speed = pokeDetails.stats.find(stat => stat.stat.name === 'speed')?.base_stat

    return pokemon
}

pokeApi.getPokemonDetails = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailsToPokemon)
}

pokeApi.getPokemons = function (offset = 0, limit = 10) {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetails))
        .then((detailsRequests) => Promise.all(detailsRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}
