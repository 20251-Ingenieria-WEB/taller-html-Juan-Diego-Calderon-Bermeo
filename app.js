// ============================
// AUTOCOMPLETAR
// ============================
// Obtener lista de tipos y llenar el select

fetch('https://pokeapi.co/api/v2/type')
  .then(res => res.json())
  .then(data => {
    const tipos = data.results.map(t => t.name);
    const tipoSelect = document.getElementById('typeFilter');

    tipos.forEach(tipo => {
      const option = document.createElement('option');
      option.value = tipo;
      option.textContent = tipo.charAt(0).toUpperCase() + tipo.slice(1);
      tipoSelect.appendChild(option);
    });
  });


let listaPokemones = [];

// Al iniciar, obtener la lista de nombres
fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
  .then(res => res.json())
  .then(data => {
    listaPokemones = data.results.map(p => p.name); // solo nombres
  });

// Escucha el input mientras el usuario escribe
document.getElementById('pokemonInput').addEventListener('input', function () {
  const input = this.value.toLowerCase();
  const sugerencias = listaPokemones.filter(nombre => nombre.includes(input)).slice(0, 5);
  mostrarSugerencias(sugerencias);
});

function mostrarSugerencias(lista) {
  const contenedor = document.getElementById('suggestions');
  contenedor.innerHTML = '';
  lista.forEach(nombre => {
    const item = document.createElement('div');
    item.classList.add('suggestion-item');
    item.textContent = nombre;
    item.onclick = () => {
      document.getElementById('pokemonInput').value = nombre;
      contenedor.innerHTML = '';
      buscarPokemon();
    };
    contenedor.appendChild(item);
  });
}

// Ocultar sugerencias al hacer clic fuera del input o la lista
document.addEventListener('click', function (event) {
  const input = document.getElementById('pokemonInput');
  const suggestions = document.getElementById('suggestions');

  if (!input.contains(event.target) && !suggestions.contains(event.target)) {
    suggestions.innerHTML = '';
  }
});


// ============================
// BÚSQUEDA DE POKÉMON
// ============================

function buscarPokemon() {
    const nombre = document.getElementById("pokemonInput").value.toLowerCase();
    const tipoFiltro = document.getElementById("typeFilter").value.toLowerCase();
    const habilidadFiltro = document.getElementById("abilityFilter").value.toLowerCase();
    const statFiltro = document.getElementById("statFilter").value;
    const statMin = parseInt(document.getElementById("statValueFilter").value);
  
    const mostrarError = (msg) => {
      document.getElementById("pokemonInfo").innerHTML = `<p style="color:red;">${msg}</p>`;
    };
  
    // 🧭 Si hay nombre, buscar directamente
    if (nombre) {
      buscarPorNombre(nombre, tipoFiltro, habilidadFiltro, statFiltro, statMin);
      return;
    }
  
    // 🧭 Si no hay nombre, pero sí hay al menos otro filtro, buscar por tipo o habilidad
    let promesas = [];
  
    if (tipoFiltro) {
      promesas.push(fetch(`https://pokeapi.co/api/v2/type/${tipoFiltro}`).then(res => res.json()).then(data => data.pokemon.map(p => p.pokemon.name)));
    }
  
    if (habilidadFiltro) {
      promesas.push(fetch(`https://pokeapi.co/api/v2/ability/${habilidadFiltro}`).then(res => res.json()).then(data => data.pokemon.map(p => p.pokemon.name)));
    }
  
    if (promesas.length === 0) {
  // Si hay filtro por estadística, aplicar búsqueda básica de pokémon
  if (statFiltro && !isNaN(statMin)) {
    // Obtener los primeros 150 pokémon (puedes ajustar el límite)
    fetch("https://pokeapi.co/api/v2/pokemon?limit=150")
      .then(res => res.json())
      .then(data => {
        const urls = data.results.map(p => p.url);

        // Obtener los detalles de cada pokémon
        Promise.all(urls.map(url => fetch(url).then(r => r.json())))
          .then(listaDetalles => {
            const filtrados = listaDetalles.filter(poke => {
              const stat = poke.stats.find(s => s.stat.name === statFiltro);
              return stat && stat.base_stat >= statMin;
            });

            if (filtrados.length === 0) {
              mostrarError("No se encontraron pokémon que cumplan con la estadística.");
              return;
            }

            let html = `<h2>Pokémon con ${statFiltro} ≥ ${statMin}:</h2>`;
            filtrados.slice(0, 10).forEach(poke => {
              html += `
                <div style="margin-bottom: 20px; cursor: pointer;" onclick="buscarPorNombre('${poke.name}')">
      <h3>${poke.name.toUpperCase()} (#${poke.id})</h3>
      <img src="${poke.sprites.front_default}" alt="${poke.name}">
    </div>
              `;
            });
            document.getElementById("pokemonInfo").innerHTML = html;
          });
      })
      .catch(() => mostrarError("Error al obtener pokémon para aplicar filtro por estadística."));
  } else {
    mostrarError("Por favor escribe un nombre o selecciona al menos un filtro.");
  }

  return;
}

  
    Promise.all(promesas)
      .then(resultados => {
        // Intersección de los nombres si hay más de un filtro
        let nombresFiltrados = resultados.reduce((a, b) => a.filter(n => b.includes(n)));
  
        // Eliminar duplicados
        nombresFiltrados = [...new Set(nombresFiltrados)].slice(0, 10); // máximo 10
  
        // Obtener detalles de los pokémon
        return Promise.all(
          nombresFiltrados.map(nombre => fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`).then(res => res.json()))
        );
      })
      .then(listaDetalles => {
        // Aplicar filtro por estadística si existe
        const filtradosFinales = listaDetalles.filter(poke => {
          if (statFiltro && !isNaN(statMin)) {
            const stat = poke.stats.find(s => s.stat.name === statFiltro);
            return stat && stat.base_stat >= statMin;
          }
          return true;
        });
  
        if (filtradosFinales.length === 0) {
          mostrarError("No se encontraron pokémon que cumplan todos los filtros.");
          return;
        }
  
        let html = `<h2>Resultados (${filtradosFinales.length}):</h2>`;
        filtradosFinales.forEach(poke => {
          html += `
            <div style="margin-bottom: 20px; cursor: pointer;" onclick="buscarPorNombre('${poke.name}')">
      <h3>${poke.name.toUpperCase()} (#${poke.id})</h3>
      <img src="${poke.sprites.front_default}" alt="${poke.name}">
    </div>
          `;
        });
        document.getElementById("pokemonInfo").innerHTML = html;
      })
      .catch(err => {
        console.error(err);
        mostrarError("Ocurrió un error al buscar los pokémon.");
      });
  }
  
  


function buscarPorNombre(nombre, tipoFiltro, habilidadFiltro, statFiltro, statMin) {
    const url = `https://pokeapi.co/api/v2/pokemon/${nombre}`;
  
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("Pokémon no encontrado");
        return res.json();
      })
      .then(data => {
        const tipos = data.types.map(t => t.type.name);
        const habilidades = data.abilities.map(a => a.ability.name);
        const stats = data.stats.map(s => `<li>${s.stat.name}: ${s.base_stat}</li>`).join("");
  
        if (tipoFiltro && !tipos.includes(tipoFiltro)) throw new Error("Tipo no coincide");
        if (habilidadFiltro && !habilidades.includes(habilidadFiltro)) throw new Error("Habilidad no coincide");
  
        if (statFiltro && !isNaN(statMin)) {
          const stat = data.stats.find(s => s.stat.name === statFiltro);
          if (!stat || stat.base_stat < statMin) {
            throw new Error("Estadística no cumple con el valor mínimo");
          }
        }
  
        document.getElementById("pokemonInfo").innerHTML = `
  <div class="pokemon-container">
    <div class="pokemon-texto">
      <h2 class="nombre">${data.name.toUpperCase()} (#${data.id})</h2>
      <p><strong>Tipo(s):</strong> ${tipos.join(", ")}</p>
      <p><strong>Habilidades:</strong> ${habilidades.join(", ")}</p>
      <div class="stats">
        <h3>Estadísticas:</h3>
        <ul>
          ${data.stats.map(stat => `
            <li><strong>${stat.stat.name}:</strong> ${stat.base_stat}</li>
          `).join("")}
        </ul>
      </div>
    </div>
    <div class="pokemon-imagen">
      <img src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}">
    </div>
  </div>
`;

      })
      .catch(error => {
        document.getElementById("pokemonInfo").innerHTML = `<p style="color:red;">${error.message}</p>`;
      });
  }

