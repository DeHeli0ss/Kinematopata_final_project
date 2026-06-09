
const params = new URLSearchParams(window.location.search);
const articleId = parseInt(params.get('id'));

fetch('../data/articles.json')
    .then(r => r.json())
    .then(data => {
        const art = data.articles.find(a => a.id === articleId);

        if (!art) {
            document.getElementById('artykul-main').innerHTML =
                '<p style="color:#aaa;padding:40px;text-align:center">Nie znaleziono recenzji.</p>';
            return;
        }

        renderArticlePage(art);
    })
    .catch(() => {
        document.getElementById('artykul-main').innerHTML =
            '<p style="color:#aaa;padding:40px;text-align:center">Błąd ładowania recenzji.</p>';
    });


function renderArticlePage(art) {

    
    document.title = art.tytul + ' — Kinematopata';

   
    const kategEl = document.getElementById('artykul-kategoria');
    kategEl.textContent = art.kategoria.toUpperCase();
    kategEl.className = art.kategoria;

    
    document.getElementById('artykul-naglowek').classList.add(art.kategoria);

    
    document.getElementById('artykul-tytul').textContent    = art.tytul;
    document.getElementById('artykul-ocena').textContent    = '★ ' + art.ocena;
    document.getElementById('artykul-data').textContent     = art.data;
    document.getElementById('artykul-zajawka').textContent  = art.zajawka;

   
    const favIds = JSON.parse(localStorage.getItem('favorites') || '[]');
    const btn = document.getElementById('artykul-fav-btn');
    if (favIds.includes(art.id)) {
        btn.textContent = '★ Ulubione';
        btn.classList.add('fav-active');
    }

    
    const infoLista = document.getElementById('info-lista');
    Object.entries(art.informacje).forEach(([klucz, wartosc]) => {
        infoLista.innerHTML += `
            <div class="info-wiersz">
                <span class="info-klucz">${klucz}</span>
                <span class="info-wartosc">${Array.isArray(wartosc) ? wartosc.join(', ') : wartosc}</span>
            </div>
        `;
    });

    
    document.getElementById('artykul-wprowadzenie').textContent = art.tresc.wprowadzenie;

   
    const rozdzialy = document.getElementById('artykul-rozdzialy');
    art.tresc.rozdzialy.forEach(r => {
        rozdzialy.innerHTML += `
            <h2 class="rozdzial-naglowek">${r.naglowek}</h2>
            <p class="rozdzial-tekst">${r.tekst}</p>
        `;
    });
}



function toggleFavArticle() {
    const btn = document.getElementById('artykul-fav-btn');
    let favIds = JSON.parse(localStorage.getItem('favorites') || '[]');

    if (favIds.includes(articleId)) {
        favIds = favIds.filter(f => f !== articleId);
        btn.textContent = '☆ Dodaj do ulubionych';
        btn.classList.remove('fav-active');
    } else {
        favIds.push(articleId);
        btn.textContent = '★ Ulubione';
        btn.classList.add('fav-active');
    }

    localStorage.setItem('favorites', JSON.stringify(favIds));
}