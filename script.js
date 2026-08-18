const container = document.querySelector(".container");
const inputBusca = document.getElementById("search");
const btnOrdem = document.getElementById("ordem");

let ordemCrescente = true;

function renderizar(lista) {
  const html = lista.map(anime => `
    <div class="card ${anime.dropado ? "dropado" : ""} ${anime.brutal ? "brutal" : ""}" onclick="abrirModal('${anime.nome.replace(/'/g, "\\'")}')">
      ${anime.dropado ? `<div class="drop-label">DROPADO</div>` : ""}
      ${anime.brutal ? `<div class="brutal-label">BRUTAL</div>` : ""}
      <img class="banner" src="${anime.img}">
      <div class="content">
        <div class="title">${anime.nome}</div>
        <div class="info">
          <div>⭐ ${anime.nota > 0 ? anime.nota.toFixed(1) : "-.-"}</div>
          <div>🎙️ ${anime.dublado ? "Dublado" : "Legendado"}</div>
          <div>📺 ${anime.finalizado ? "Finalizado" : anime.emLancamento ? "Em lançamento" : "Não finalizado"}</div>
          <div>📊 Eps: ${anime.emLancamento ? anime.eps.split("/")[0] + "/?" : anime.eps}</div>
        </div>
        <div class="desc">${anime.desc}</div>
      </div>
    </div>
  `).join('');
  container.innerHTML = html;
}

function filtrarEOrdenar() {
  const termo = inputBusca.value.toLowerCase();
  const generoSelecionado = document.getElementById("filtroGenero").value;
  const ordenacaoSelecionada = document.getElementById("tipoOrdem").value;

  let resultado = animes.filter(anime => {
    const bateNome = anime.nome.toLowerCase().includes(termo);
    
    let bateGenero = true;
    if (generoSelecionado) {
      if (anime.genre) {
        const ids = anime.genre.split(",").map(id => id.trim());
        bateGenero = ids.includes(generoSelecionado);
      } else {
        bateGenero = false;
      }
    }

    return bateNome && bateGenero;
  });

if (ordenacaoSelecionada === "nome") {
  resultado.sort((a, b) => a.nome.localeCompare(b.nome));
} else if (ordenacaoSelecionada === "nota") {
  resultado.sort((a, b) => b.nota - a.nota);
} else if (ordenacaoSelecionada === "imdb") {
  resultado.sort((a, b) => b.imdb - a.imdb);
} else if (ordenacaoSelecionada === "MyAnimeList") {
  resultado.sort((a, b) => b.MyAnimeList - a.MyAnimeList);
}

if (!ordemCrescente) {
  resultado.reverse();
}

  renderizar(resultado);
}

inputBusca.addEventListener("input", filtrarEOrdenar);
document.getElementById("filtroGenero").addEventListener("change", filtrarEOrdenar);
document.getElementById("tipoOrdem").addEventListener("change", filtrarEOrdenar);
btnOrdem.addEventListener("click", () => {
  ordemCrescente = !ordemCrescente;
  btnOrdem.innerText = ordemCrescente ? "⬆️ Crescente" : "⬇️ Decrescente";
  filtrarEOrdenar();
});

const bibliotecaGeneros = {
  1: "Romance",
  2: "Ação",
  3: "Ecchi",
  4: "Comédia",
  5: "Isekai",
  6: "Drama",
  7: "Fantasia",
  8: "Sci-Fi",
  9: "Slice of Life",
  10: "Shonen"
};

function abrirModal(nomeAnime) {
  if (!nomeAnime) return;

  const anime = animes.find(a => a.nome === nomeAnime);
  if (!anime) return;

  const modal = document.getElementById("animeModal");
  const content = document.getElementById("modalContent");
  
  if (!modal || !content) return;
  
  document.getElementById("modalHeader").style.backgroundImage = `url('${anime.img}')`;
  document.getElementById("modalTitle").innerText = anime.nome;
  
  const descElement = document.getElementById("modalDesc");
  if (anime.desc === "???") {
    descElement.innerText = "Este anime ainda não tem uma análise definida. Ainda vou/estou assistindo! 🍿";
  } else {
    descElement.innerText = anime.desc;
  }

  let assistidos = 0;
  let totais = 0;
  let porcentagem = 0;

  if (anime.eps && anime.eps.includes("/")) {
    const partes = anime.eps.split("/");
    assistidos = parseInt(partes[0]) || 0;
    totais = parseInt(partes[1]) || 0;
    
    if (totais > 0) {
      porcentagem = Math.min(Math.round((assistidos / totais) * 100), 100);
    }
  }

  let tagsHTML = "";
  if (anime.genre) {
    const idsGeneros = anime.genre.split(",").map(id => id.trim());
    idsGeneros.forEach(id => {
      const nomeGenero = bibliotecaGeneros[id];
      if (nomeGenero) {
        tagsHTML += `<span class="genre-tag">${nomeGenero}</span>`;
      }
    });
  }

document.getElementById("modalGridInfo").innerHTML = `
    <div>⭐ Minha Nota: ${anime.nota > 0 ? anime.nota.toFixed(1) : "-.-"}</div>
    <div>⭐ Nota IMDB: ${anime.imdb > 0 ? anime.imdb.toFixed(1) : "-.-"}</div>
    <div>🎙️ Áudio: ${anime.dublado ? "Dublado" : "Legendado"}</div>
    <div>⭐ Nota MyAnimeList: ${anime.MyAnimeList > 0 ? anime.MyAnimeList.toFixed(1) : "-.-"}</div>
    
    <div class="progress-container">
      <div class="progress-labels">
        <span>📊 Progresso:</span>
        <span>${assistidos} / ${anime.emLancamento ? "?" : totais} eps</span>
      </div>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" style="width: ${porcentagem}%"></div>
        <div class="progress-percentage-floating" style="left: ${porcentagem}%">${porcentagem}%</div>
      </div>
    </div>

    <div class="modal-genres-wrapper">
      <div class="modal-genres-title">🎭 Gêneros:</div>
      <div class="modal-genres-list">${tagsHTML || '<span class="genre-tag">Não informado</span>'}</div>
    </div>
  `;

const painelAnterior = content.querySelector(".notas-laterais");

if (painelAnterior) {
  painelAnterior.remove();
}

const temTemporadas =
  Array.isArray(anime.temporadas) &&
  anime.temporadas.length > 0;

const temFilmes =
  Array.isArray(anime.filmesNotas) &&
  anime.filmesNotas.length > 0;

if (temTemporadas || temFilmes) {

  let conteudoNotas = "";

  if (temTemporadas) {
    conteudoNotas += `
      <div class="notas-secao">

        <div class="notas-secao-titulo">
          📺 Temporadas
        </div>

        ${anime.temporadas.map(temp => `
          <div class="nota-item">
            <span>${temp.nome}</span>
            <strong>${temp.nota != null && Number(temp.nota) > 0 ? Number(temp.nota).toFixed(1) : "-.-"}</strong>
          </div>
        `).join("")}

      </div>
    `;
  }

  if (temFilmes) {
    conteudoNotas += `
      <div class="notas-secao">

        <div class="notas-secao-titulo">
          🎬 Filmes
        </div>

        ${anime.filmesNotas.map(filme => `
          <div class="nota-item">
            <span>${filme.nome}</span>
            <strong>${filme.nota != null && Number(filme.nota) > 0 ? Number(filme.nota).toFixed(1) : "-.-"}</strong>
          </div>
        `).join("")}

      </div>
    `;
  }

  const painelNotas = document.createElement("div");

  painelNotas.className = "notas-laterais";

  painelNotas.innerHTML = `
    <div class="notas-conteudo">
      ${conteudoNotas}
    </div>

    <div class="notas-aba">
      <span>⭐ N O T A S</span>
    </div>
  `;

  content.appendChild(painelNotas);
}

  content.classList.remove("brutal-border", "dropado-border"); 
  if (anime.brutal) content.classList.add("brutal-border");
  if (anime.dropado) content.classList.add("dropado-border");

  modal.classList.add("active");
}

function fecharModal() {
  const modal = document.getElementById("animeModal");
  if (modal) modal.classList.remove("active");
}

const animeModalEl = document.getElementById("animeModal");
if (animeModalEl) {
  animeModalEl.addEventListener("click", (e) => {
    if (e.target.id === "animeModal") fecharModal();
  });
}

function atualizarEstatisticas() {
  const totalAnimes = animes.length;
  let assistidos = 0;
  let pendentes = 0;
  let totalBrutais = 0;
  let totalDropados = 0;
  let somaNotas = 0;
  let animesComNota = 0;

  animes.forEach(anime => {
    if (anime.brutal) totalBrutais++;
    if (anime.dropado) totalDropados++;

   if (anime.nota > 0 && !anime.dropado) {
      somaNotas += anime.nota;
      animesComNota++;
   }
    
    let epsAssistidos = 0;
    if (anime.eps && anime.eps.includes("/")) {
      epsAssistidos = parseInt(anime.eps.split("/")[0]) || 0;
    }

    if (anime.finalizado || epsAssistidos > 0) {
      assistidos++;
    } else if (!anime.dropado) {
      pendentes++;
    }
  });

  const notaMedia = animesComNota > 0 ? (somaNotas / animesComNota).toFixed(1) : "-.-";

  const divEst = document.getElementById("estatisticasGerais");
  if (divEst) {
    divEst.innerHTML = `
      📺 Total de Animes: <strong>${totalAnimes}</strong><br>
      ✅ Assistidos: <strong>${assistidos}</strong><br>
      ⏳ Pendentes: <strong>${pendentes}</strong><br>
      ⭐ Nota Média: <strong>${notaMedia}</strong><br>
      🔥 Brutais: <strong>${totalBrutais}</strong> | ❌ Dropados: <strong>${totalDropados}</strong>
    `;
  }
}
  
filtrarEOrdenar();
atualizarEstatisticas();
