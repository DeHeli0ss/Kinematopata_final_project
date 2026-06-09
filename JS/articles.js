// Wykryj na której stronie jesteśmy
const page = window.location.pathname.split('/').pop();

fetch('../data/articles.json')
    .then(r => r.json())
    .then(data => {
        const articles = data.articles;

        articles.sort((a, b) => b.id - a.id);

        // STRONA GŁÓWNA — najnowsze artykuły ze wszystkich kategorii
        if (page === 'index.html' || page === '') {
    const grid = document.querySelector('.articles-structure');
    if (grid) renderCards(articles.slice(0, 4), grid, true);
}

        // STRONA FILMÓW
        if (page === 'films.html') {
            const grid = document.getElementById('recenzje-grid');
            if (grid) renderCards(articles.filter(a => a.kategoria === 'film'), grid, false);
        }

        // STRONA SERIALI
        if (page === 'series.html') {
            const grid = document.getElementById('recenzje-grid');
            if (grid) renderCards(articles.filter(a => a.kategoria === 'serial'), grid, false);
        }

        // STRONA KSIĄŻEK
        if (page === 'books.html') {
            const grid = document.getElementById('recenzje-grid');
            if (grid) renderCards(articles.filter(a => a.kategoria === 'ksiazka'), grid, false);
        }
    })
    .catch(err => console.error('Błąd ładowania artykułów:', err));


//Renderuj karty (strona główna i kategorie) ──
function renderCards(articles, container, showTag) {
    container.innerHTML = '';

    if (articles.length === 0) {
        container.innerHTML = '<p style="color:#aaa;padding:10px">Brak artykułów.</p>';
        return;
    }

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

    articles.forEach(art => {
        const isFav = favorites.includes(art.id);

        // Strona główna — nowy template z siatką
        if (showTag) {
            container.innerHTML += `
                <div class="article-card ${art.kategoria}" onclick="window.location.href='${art.url}'">
                    <div class="article-card-top">
                        <span class="card-kategoria ${art.kategoria}">${art.kategoria.toUpperCase()}</span>
                        <span class="article-card-ocena">★ ${art.ocena}</span>
                    </div>
                    <h3 class="article-card-tytul">${art.tytul}</h3>
                    <p class="article-card-info">${art.info}</p>
                    <p class="article-card-zajawka">${art.zajawka}</p>
                    <div class="article-card-footer">
                        <a class="article-card-link" href="${art.url}" onclick="event.stopPropagation()">Czytaj →</a>
                        <button class="fav-btn ${isFav ? 'fav-active' : ''}"
                            onclick="event.stopPropagation(); toggleFavorite(${art.id}, this)">
                            ${isFav ? '★' : '☆'}
                        </button>
                    </div>
                </div>
            `;

        // Strony kategorii — dotychczasowy poziomy układ
        } else {
            container.innerHTML += `
                <div class="recenzja-karta">
                    <div class="recenzja-ocena">${art.ocena}</div>
                    <div class="recenzja-srodek">
                        <h2 class="recenzja-tytul">${art.tytul}</h2>
                        <p class="recenzja-info">${art.info}</p>
                        <p class="recenzja-opis">${art.zajawka}</p>
                    </div>
                    <div class="recenzja-akcje">
                        <a class="recenzja-link" href="${art.url}">Czytaj recenzję →</a>
                        <button class="fav-btn ${isFav ? 'fav-active' : ''}"
                            onclick="toggleFavorite(${art.id}, this)">
                            ${isFav ? '★' : '☆'}
                        </button>
                    </div>
                </div>
            `;
        }
    });
}
// ── Renderuj pełny artykuł ──
function renderArticle(art) {
    document.title = art.tytul;

    const el = id => document.getElementById(id);

    if (el('artykul-kategoria')) el('artykul-kategoria').textContent = art.kategoria.toUpperCase();
    if (el('artykul-tytul'))     el('artykul-tytul').textContent = art.tytul;
    if (el('artykul-data'))      el('artykul-data').textContent = art.data;
    if (el('artykul-ocena'))     el('artykul-ocena').textContent = '★ ' + art.ocena;

    // Informacje
    const infoLista = el('info-lista');
    if (infoLista) {
        Object.entries(art.informacje).forEach(([klucz, wartosc]) => {
            infoLista.innerHTML += `
                <div class="info-wiersz">
                    <span class="info-klucz">${klucz}</span>
                    <span class="info-wartosc">${wartosc}</span>
                </div>
            `;
        });
    }

    // Treść
    if (el('artykul-wprowadzenie')) el('artykul-wprowadzenie').textContent = art.tresc.wprowadzenie;

    const rozdzialy = el('artykul-rozdzialy');
    if (rozdzialy) {
        art.tresc.rozdzialy.forEach(r => {
            rozdzialy.innerHTML += `
                <h2 class="rozdzial-naglowek">${r.naglowek}</h2>
                <p class="rozdzial-tekst">${r.tekst}</p>
            `;
        });
    }
}


// ── Ulubione — localStorage ──
function toggleFavorite(id, btn) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

    if (favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
        btn.textContent = '☆';
        btn.classList.remove('fav-active');
    } else {
        favorites.push(id);
        btn.textContent = '★';
        btn.classList.add('fav-active');
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
}