// ═══════════════════════════════════════════════
//  favorites.js — Lista ulubionych
//  Używa localStorage do przechowywania danych
// ═══════════════════════════════════════════════

// ── Pomocnicze: pobierz listę z localStorage ──
function getList(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
}

// ── Pomocnicze: zapisz listę do localStorage ──
function saveList(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// ── Pomocnicze: badge statusu ──
function statusClass(status) {
    if (status.includes('obejrzan') || status.includes('Przeczytana')) return 'status-tak';
    if (status.includes('trakcie')) return 'status-w';
    return 'status-do';
}

// ═══════════════════════════════════════════════
//  DODAJ POZYCJĘ (film / serial / książka)
// ═══════════════════════════════════════════════
function addItem(event, kategoria) {
    event.preventDefault();

    let item = {};

    if (kategoria === 'filmy') {
    const rezyser = document.getElementById('film-rezyser').value.trim();
    const rok     = document.getElementById('film-rok').value;
    const czesci  = [rezyser, rok].filter(v => v !== '');
    item = {
        id:        Date.now(),
        tytul:     document.getElementById('film-tytul').value.trim(),
        szczegoly: czesci.join(' · '),
        status:    document.getElementById('film-status').value
    };
    document.getElementById('form-film').reset();
}

if (kategoria === 'seriale') {
    const tworca  = document.getElementById('serial-tworca').value.trim();
    const sezony  = document.getElementById('serial-sezony').value;
    const czesci  = [tworca, sezony ? sezony + ' sez.' : ''].filter(v => v !== '');
    item = {
        id:        Date.now(),
        tytul:     document.getElementById('serial-tytul').value.trim(),
        szczegoly: czesci.join(' · '),
        status:    document.getElementById('serial-status').value
    };
    document.getElementById('form-serial').reset();
}

if (kategoria === 'ksiazki') {
    const autor   = document.getElementById('ksiazka-autor').value.trim();
    const rok     = document.getElementById('ksiazka-rok').value;
    const czesci  = [autor, rok].filter(v => v !== '');
    item = {
        id:        Date.now(),
        tytul:     document.getElementById('ksiazka-tytul').value.trim(),
        szczegoly: czesci.join(' · '),
        status:    document.getElementById('ksiazka-status').value
    };
    document.getElementById('form-ksiazka').reset();
}
    const lista = getList(kategoria);
    lista.push(item);
    saveList(kategoria, lista);

    renderLista(kategoria);
}

// ═══════════════════════════════════════════════
//  USUŃ POZYCJĘ
// ═══════════════════════════════════════════════
function deleteItem(id, kategoria) {
    const lista = getList(kategoria).filter(item => item.id !== id);
    saveList(kategoria, lista);
    renderLista(kategoria);
}

// ═══════════════════════════════════════════════
//  RENDERUJ LISTĘ (filmy / seriale / książki)
// ═══════════════════════════════════════════════
function renderLista(kategoria) {
    const container = document.getElementById('lista-' + kategoria);
    if (!container) return;

    const lista = getList(kategoria);

    if (lista.length === 0) {
        container.innerHTML = '<p class="fav-empty">Lista jest pusta. Dodaj pierwszą pozycję!</p>';
        return;
    }

    container.innerHTML = lista.map(item => `
        <div class="fav-item">
            <div class="fav-item-info">
                <span class="fav-item-tytul">${item.tytul}</span>
                <span class="fav-item-szczegoly">${item.szczegoly}</span>
            </div>
            <select class="fav-status-select" onchange="changeStatus(${item.id}, '${kategoria}', this.value)">
                ${getStatusOptions(kategoria, item.status)}
            </select>
            <button class="fav-delete-btn" onclick="deleteItem(${item.id}, '${kategoria}')">Usuń</button>
        </div>
    `).join('');
}

// ═══════════════════════════════════════════════
//  RENDERUJ ULUBIONE RECENZJE
//  (oznaczone gwiazdką na stronach kategorii)
// ═══════════════════════════════════════════════
function renderFavRecenzje(allArticles) {
    const container = document.getElementById('fav-recenzje-grid');
    if (!container) return;

    const favIds = getList('favorites');

    if (favIds.length === 0) {
        container.innerHTML = '<p class="fav-empty">Nie oznaczyłeś jeszcze żadnej recenzji jako ulubioną.</p>';
        return;
    }

    const favArticles = allArticles.filter(a => favIds.includes(a.id));

    if (favArticles.length === 0) {
        container.innerHTML = '<p class="fav-empty">Nie oznaczyłeś jeszcze żadnej recenzji jako ulubioną.</p>';
        return;
    }

    container.innerHTML = favArticles.map(art => `
        <div class="fav-recenzja-karta">
            <div class="fav-recenzja-ocena">${art.ocena}</div>
            <div class="fav-recenzja-srodek">
                <span class="card-kategoria ${art.kategoria}">${art.kategoria.toUpperCase()}</span>
                <h3 class="fav-recenzja-tytul">${art.tytul}</h3>
                <p class="fav-recenzja-info">${art.info}</p>
            </div>
            <div class="fav-recenzja-akcje">
                <a class="fav-czytaj-btn" href="${art.url}">Czytaj recenzję →</a>
                <button class="fav-remove-btn" onclick="removeFavRecenzja(${art.id})">Usuń z ulubionych</button>
            </div>
        </div>
    `).join('');
}

// ── Usuń recenzję z ulubionych ──
function removeFavRecenzja(id) {
    const favIds = getList('favorites').filter(f => f !== id);
    saveList('favorites', favIds);

    // Odśwież widok — pobierz artykuły ponownie
    fetch('../data/articles.json')
        .then(r => r.json())
        .then(data => renderFavRecenzje(data.articles))
        .catch(() => {
            document.getElementById('fav-recenzje-grid').innerHTML =
                '<p class="fav-empty">Błąd ładowania recenzji.</p>';
        });
}

// ═══════════════════════════════════════════════
//  INICJALIZACJA — uruchom po załadowaniu strony
// ═══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {

    // Renderuj listy ręczne
    renderLista('filmy');
    renderLista('seriale');
    renderLista('ksiazki');

    // Renderuj ulubione recenzje (potrzebuje articles.json)
    fetch('../data/articles.json')
        .then(r => r.json())
        .then(data => renderFavRecenzje(data.articles))
        .catch(() => {
            const c = document.getElementById('fav-recenzje-grid');
            if (c) c.innerHTML = '<p class="fav-empty">Błąd ładowania recenzji.</p>';
        });
});

// ── Generuj opcje selecta z zaznaczonym aktualnym statusem ──
function getStatusOptions(kategoria, aktualny) {
    let opcje = [];

    if (kategoria === 'ksiazki') {
        opcje = ['Do przeczytania', 'W trakcie', 'Przeczytana'];
    } else {
        opcje = ['Do obejrzenia', 'W trakcie', 'Obejrzany'];
    }

    return opcje.map(o => `
        <option value="${o}" ${o === aktualny ? 'selected' : ''}>${o}</option>
    `).join('');
}

// ── Zmień status bez usuwania rekordu ──
function changeStatus(id, kategoria, nowyStatus) {
    const lista = getList(kategoria).map(item => {
        if (item.id === id) item.status = nowyStatus;
        return item;
    });
    saveList(kategoria, lista);
    renderLista(kategoria);
}