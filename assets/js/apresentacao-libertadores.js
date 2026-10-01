// ==========================================================================
// assets/js/apresentacao-libertadores.js - CERIMÔNIA OFICIAL DA LIBERTADORES
// ==========================================================================

const ESCUDOS_OFICIAIS_LIBERTA = {
    "Palmeiras": "https://logodetimes.com/times/palmeiras/logo-palmeiras-256.png",
    "Flamengo": "https://logodetimes.com/times/flamengo/logo-flamengo-256.png",
    "River Plate": "https://upload.wikimedia.org/wikipedia/commons/f/f1/River_Plate.png?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=original",
    "Fluminense": "https://logodetimes.com/times/fluminense/logo-fluminense-256.png",
    "São Paulo": "https://logodetimes.com/times/sao-paulo/logo-sao-paulo-256.png",
    "Atlético-MG": "https://logodetimes.com/times/atletico-mineiro/logo-atletico-mineiro-256.png",
    "Atlético Mineiro": "https://logodetimes.com/times/atletico-mineiro/logo-atletico-mineiro-256.png",
    "Grêmio": "https://logodetimes.com/times/gremio/logo-gremio-256.png",
    "Bolívar": "https://logodetimes.com/times/bolivar/logo-bolivar-256.png",
    "Universitario": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Escudo_del_Club_Universitario_de_Deportes.svg/3840px-Escudo_del_Club_Universitario_de_Deportes.svg.png",
    "CRB": "https://logodetimes.com/times/crb/logo-crb-256.png",
    "Junior Barranquilla": "https://logodetimes.com/times/junior-barranquilla/logo-junior-barranquilla-256.png",
    "Olimpia": "https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_de_Olimpia_2022_PNG_HD.png?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=original",
    "Barcelona SC": "https://logodetimes.com/times/barcelona-de-guayaquil/logo-barcelona-de-guayaquil-256.png",
    "Corinthians": "https://logodetimes.com/times/corinthians/logo-corinthians-256.png",
    "Bahia": "https://logodetimes.com/times/bahia/logo-bahia-256.png",
    "Atlético Nacional": "https://logodetimes.com/times/atletico-nacional/logo-atletico-nacional-256.png",
    "Estudiantes": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/68/Escudo_del_Club_Estudiantes_de_La_Plata.svg/1280px-Escudo_del_Club_Estudiantes_de_La_Plata.svg.png?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=thumbnail",
    "Red Bull Bragantino": "https://logodetimes.com/times/red-bull-bragantino/logo-red-bull-bragantino-256.png",
    "Colo-Colo": "https://upload.wikimedia.org/wikipedia/pt/e/e8/Colo-Colo_Futbol_Club.png?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=original",
    "Racing Club": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Escudo_de_Racing_Club_%282014%29.svg/1920px-Escudo_de_Racing_Club_%282014%29.svg.png?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=thumbnail",
    "LDU Quito": "https://upload.wikimedia.org/wikipedia/commons/7/72/LDU_Escudo_Actualizado_2023.png?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=original",
    "Caracas": "https://upload.wikimedia.org/wikipedia/pt/f/f4/Caracas_FC.png?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=original",
    "Botafogo": "https://logodetimes.com/times/botafogo/logo-botafogo-256.png",
    "Nacional": "https://upload.wikimedia.org/wikipedia/commons/1/1e/Club_Nacional_de_Football%27s_logo.png?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=original",
    "San Lorenzo": "https://logodetimes.com/times/san-lorenzo/logo-san-lorenzo-256.png",
    "Peñarol": "https://logodetimes.com/times/penarol/logo-penarol-256.png",
    "Talleres": "https://logodetimes.com/times/talleres-de-cordoba/logo-talleres-de-cordoba-256.png",
    "The Strongest": "https://assets.footylogos.com/logos/the-strongest/the-strongest-logo-footylogos.png"
};

const escudoPadraoLibertadores = 'https://www.ogol.com.br/img/logos/edicoes/130437_imgbank_.png';

function obterEscudoTime(nomeTime) {
    return ESCUDOS_OFICIAIS_LIBERTA[nomeTime] || escudoPadraoLibertadores;
}

// Times qualificados da sua simulação do PES
const timesPadraoLibertadores = {
    pote1: ['Atlético-MG', 'Universitario', 'Junior Barranquilla', 'Barcelona SC', 'Bahia', 'Estudiantes', 'Colo-Colo', 'LDU Quito'],
    pote2: ['Flamengo', 'CRB', 'Olimpia', 'Corinthians', 'Atlético Nacional', 'Red Bull Bragantino', 'Racing Club', 'Caracas']
};

let cenaAtual = 1;
const totalCenas = 5;
let autoPlayAtivo = false;
let autoPlayTimer = null;
const tempoPorCenaMs = 11000;

// Controle de timeouts
let timeoutsAnimacao = [];

// Elementos do DOM
const btnVoltar = document.getElementById('btn-voltar-cena');
const btnAvancar = document.getElementById('btn-avancar-cena');
const btnAutoPlay = document.getElementById('btn-auto-play');
const palcoCenaPotes = document.getElementById('palco-cena-potes');

function limparTimeoutsAnimacao() {
    timeoutsAnimacao.forEach(t => clearTimeout(t));
    timeoutsAnimacao = [];
}

function obterDadosPotes() {
    const dadosSalvos = localStorage.getItem('dados_sorteio_libertadores');
    return dadosSalvos ? JSON.parse(dadosSalvos) : timesPadraoLibertadores;
}

// 1. TRANSIÇÃO DE CENAS E INDICADORES
function mostrarCena(numeroCena) {
    if (numeroCena < 1 || numeroCena > totalCenas) return;

    limparTimeoutsAnimacao();
    cenaAtual = numeroCena;

    for (let i = 1; i <= totalCenas; i++) {
        const cenaEl = document.getElementById(`cena-${i}`);
        const indEl = document.getElementById(`ind-${i}`);

        if (cenaEl) {
            if (i === cenaAtual) {
                cenaEl.classList.add('ativa');
            } else {
                cenaEl.classList.remove('ativa');
            }
        }

        if (indEl) {
            if (i === cenaAtual) {
                indEl.classList.add('ativo');
            } else {
                indEl.classList.remove('ativo');
            }
        }
    }

    if (cenaAtual === 3) {
        animarRegrasSequenciais();
    } else if (cenaAtual === 4) {
        renderizarVisaoGeralPotes();
    }
}

// 2. ANIMAÇÃO SEQUENCIAL DAS REGRAS (CENA 3)
function animarRegrasSequenciais() {
    const regras = document.querySelectorAll('.card-regra-info');
    regras.forEach(r => r.classList.remove('revelado'));

    regras.forEach((regra, index) => {
        const t = setTimeout(() => {
            regra.classList.add('revelado');
        }, 150 + (index * 220));
        timeoutsAnimacao.push(t);
    });
}

// 3. APRESENTAÇÃO SOLENE DOS POTES (CENA 4)
function renderizarVisaoGeralPotes() {
    if (!palcoCenaPotes || cenaAtual !== 4) return;

    const dados = obterDadosPotes();

    const htmlPote1 = dados.pote1.map(time => `
        <div class="item-time-quadro">
            <img src="${obterEscudoTime(time)}" class="mini-escudo-quadro" alt="${time}" onerror="this.src='${escudoPadraoLibertadores}';">
            <span class="nome-clube-quadro">${time}</span>
        </div>
    `).join('');

    const htmlPote2 = dados.pote2.map(time => `
        <div class="item-time-quadro">
            <img src="${obterEscudoTime(time)}" class="mini-escudo-quadro" alt="${time}" onerror="this.src='${escudoPadraoLibertadores}';">
            <span class="nome-clube-quadro">${time}</span>
        </div>
    `).join('');

    palcoCenaPotes.innerHTML = `
        <div class="container-potes-visao-geral">
            <div class="cabecalho-slide" style="margin-bottom: 1.4rem;">
                <span class="tag-secao-slide">COMPOSIÇÃO OFICIAL</span>
                <h2 class="titulo-slide">OS 16 CLUBES CLASSIFICADOS</h2>
                <p class="subtitulo-slide">8 LÍDERES (POTE 1) &bull; 8 VICE-LÍDERES (POTE 2)</p>
            </div>

            <div class="grid-potes-duplo">
                <!-- POTE 1 -->
                <div class="coluna-pote-quadro">
                    <div class="barra-titulo-pote">
                        <span class="insignia-pote">POTE 1</span>
                        <span class="status-pote">LÍDERES DE GRUPO</span>
                    </div>
                    <div class="lista-times-quadro">${htmlPote1}</div>
                </div>

                <!-- POTE 2 -->
                <div class="coluna-pote-quadro">
                    <div class="barra-titulo-pote">
                        <span class="insignia-pote">POTE 2</span>
                        <span class="status-pote">VICE-LÍDERES</span>
                    </div>
                    <div class="lista-times-quadro">${htmlPote2}</div>
                </div>
            </div>
        </div>
    `;
}

// 4. CONTROLES DE NAVEGAÇÃO
if (btnAvancar) {
    btnAvancar.addEventListener('click', () => {
        if (cenaAtual < totalCenas) {
            mostrarCena(cenaAtual + 1);
        } else {
            window.location.href = 'libertadores.html';
        }
    });
}

if (btnVoltar) {
    btnVoltar.addEventListener('click', () => {
        if (cenaAtual > 1) {
            mostrarCena(cenaAtual - 1);
        }
    });
}

// 5. ATALHOS DO TECLADO
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === 'ArrowRight') {
        e.preventDefault();
        if (btnAvancar) btnAvancar.click();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (btnVoltar) btnVoltar.click();
    }
});

// 6. MODO AUTOMÁTICO
if (btnAutoPlay) {
    btnAutoPlay.addEventListener('click', () => {
        autoPlayAtivo = !autoPlayAtivo;
        btnAutoPlay.classList.toggle('ativo', autoPlayAtivo);
        btnAutoPlay.textContent = autoPlayAtivo ? 'AUTO: ATIVO' : 'MODO AUTOMÁTICO';

        if (autoPlayAtivo) {
            executarAutoPlay();
        } else {
            clearInterval(autoPlayTimer);
        }
    });
}

function executarAutoPlay() {
    clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(() => {
        if (!autoPlayAtivo) return;

        if (cenaAtual < totalCenas) {
            mostrarCena(cenaAtual + 1);
        } else {
            clearInterval(autoPlayTimer);
            setTimeout(() => {
                window.location.href = 'libertadores.html';
            }, 2000);
        }
    }, tempoPorCenaMs);
}

// Inicialização automática
mostrarCena(1);