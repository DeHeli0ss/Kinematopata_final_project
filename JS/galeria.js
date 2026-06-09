

let aktualny = 0;
let timer;

const slajdy  = document.querySelectorAll('.slajd');
const kropki  = document.querySelectorAll('.kropka');
const ILOSC   = slajdy.length;
const CZAS_MS = 10000; // 10 sekund


function pokazSlajd(index) {
    // Zdejmij aktywne klasy ze wszystkich
    slajdy.forEach(s => s.classList.remove('aktywny'));
    kropki.forEach(k => k.classList.remove('aktywna-kropka'));

    
    aktualny = (index + ILOSC) % ILOSC;
    slajdy[aktualny].classList.add('aktywny');
    kropki[aktualny].classList.add('aktywna-kropka');

   
    resetTimer();
}


function zmienSlajd(kierunek) {
    pokazSlajd(aktualny + kierunek);
}


function idzDoSlajdu(index) {
    pokazSlajd(index);
}


function startTimer() {
    timer = setInterval(() => {
        pokazSlajd(aktualny + 1);
    }, CZAS_MS);
}

function resetTimer() {
    clearInterval(timer);
    startTimer();
}


startTimer();