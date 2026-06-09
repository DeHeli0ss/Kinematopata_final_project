// ═══════════════════════════════════════════════
//  galeria.js — obsługa galerii książek
//  Auto-zmiana co 10 sekund + klik na strzałki
// ═══════════════════════════════════════════════

let aktualny = 0;
let timer;

const slajdy  = document.querySelectorAll('.slajd');
const kropki  = document.querySelectorAll('.kropka');
const ILOSC   = slajdy.length;
const CZAS_MS = 10000; // 10 sekund

// ── Pokaż slajd o danym indeksie ──
function pokazSlajd(index) {
    // Zdejmij aktywne klasy ze wszystkich
    slajdy.forEach(s => s.classList.remove('aktywny'));
    kropki.forEach(k => k.classList.remove('aktywna-kropka'));

    // Ustaw aktywny
    aktualny = (index + ILOSC) % ILOSC;
    slajdy[aktualny].classList.add('aktywny');
    kropki[aktualny].classList.add('aktywna-kropka');

    // Zresetuj timer po kliknięciu
    resetTimer();
}

// ── Następny / poprzedni (wywołane przez strzałki) ──
function zmienSlajd(kierunek) {
    pokazSlajd(aktualny + kierunek);
}

// ── Skocz do konkretnego slajdu (wywołane przez kropki) ──
function idzDoSlajdu(index) {
    pokazSlajd(index);
}

// ── Auto-zmiana co 10 sekund ──
function startTimer() {
    timer = setInterval(() => {
        pokazSlajd(aktualny + 1);
    }, CZAS_MS);
}

function resetTimer() {
    clearInterval(timer);
    startTimer();
}

// ── Start ──
startTimer();