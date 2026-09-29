// ==========================================================================
// assets/js/apresentacao-libertadores.js - CERIMÔNIA OFICIAL DA LIBERTADORES
// ==========================================================================

// MAPA DE ESCUDOS ESTÁVEIS (WIKIMEDIA SPECIAL FILEPATH)
const mapaEscudos = {
    // POTE 1
    'palmeiras': 'https://commons.wikimedia.org/wiki/Special:FilePath/Palmeiras_logo.svg',
    'flamengo': 'https://commons.wikimedia.org/wiki/Special:FilePath/Flamengo_braz_logo.svg',
    'riverplate': 'https://commons.wikimedia.org/wiki/Special:FilePath/Escudo_del_C_A_River_Plate.svg',
    'fluminense': 'https://commons.wikimedia.org/wiki/Special:FilePath/Fluminense_FC_escudo.png',
    'saopaulo': 'https://commons.wikimedia.org/wiki/Special:FilePath/Brasao_do_Sao_Paulo_Futebol_Clube.svg',
    'atleticomg': 'https://commons.wikimedia.org/wiki/Special:FilePath/Clube_Atl%C3%A9tico_Mineiro_logo.svg',
    'atleticomineiro': 'https://commons.wikimedia.org/wiki/Special:FilePath/Clube_Atl%C3%A9tico_Mineiro_logo.svg',
    'gremio': 'https://commons.wikimedia.org/wiki/Special:FilePath/Gremio_logo.svg',
    'bolivar': 'https://commons.wikimedia.org/wiki/Special:FilePath/Club_Bol%C3%ADvar_logo.svg',

    // POTE 2
    'botafogo': 'https://commons.wikimedia.org/wiki/Special:FilePath/Escudo_Botafogo.svg',
    'nacional': 'https://commons.wikimedia.org/wiki/Special:FilePath/Escudo_del_Club_Nacional_de_Football.svg',
    'sanlorenzo': 'https://commons.wikimedia.org/wiki/Special:FilePath/Escudo_del_Club_Atl%C3%A9tico_San_Lorenzo_de_Almagro.svg',
    'penarol': 'https://commons.wikimedia.org/wiki/Special:FilePath/Escudo_del_Club_Atl%C3%A9tico_Pe%C3%B1arol.svg',
    'talleres': 'https://commons.wikimedia.org/wiki/Special:FilePath/Escudo_del_Club_Atl%C3%A9tico_Talleres_de_C%C3%B3rdoba.svg',
    'talleresdecordoba': 'https://commons.wikimedia.org/wiki/Special:FilePath/Escudo_del_Club_Atl%C3%A9tico_Talleres_de_C%C3%B3rdoba.svg',
    'colocolo': 'https://commons.wikimedia.org/wiki/Special:FilePath/Colo-Colo_logo.svg',
    'junior': 'https://commons.wikimedia.org/wiki/Special:FilePath/Escudo_de_Atl%C3%A9tico_Junior.svg',
    'juniorbarranquilla': 'https://commons.wikimedia.org/wiki/Special:FilePath/Escudo_de_Atl%C3%A9tico_Junior.svg',
    'thestrongest': 'https://commons.wikimedia.org/wiki/Special:FilePath/Escudo_The_Strongest.png',
    'strongest': 'https://commons.wikimedia.org/wiki/Special:FilePath/Escudo_The_Strongest.png',

    // EXTRAS / SULA
    'bocajuniors': 'https://commons.wikimedia.org/wiki/Special:FilePath/Boca_escudo.png',
    'cruzeiro': 'https://commons.wikimedia.org/wiki/Special:FilePath/Cruzeiro_Esporte_Clube_%28logo%29.svg',
    'corinthians': 'https://commons.wikimedia.org/wiki/Special:FilePath/Sport_Club_Corinthians_Paulista_crest.svg',
    'internacional': 'https://commons.wikimedia.org/wiki/Special:FilePath/Escudo_do_Sport_Club_Internacional.svg',
    'athleticopr': 'https://commons.wikimedia.org/wiki/Special:FilePath/Club_Athletico_Paranaense_2018.svg',
    'athleticoparanaense': 'https://commons.wikimedia.org/wiki/Special:FilePath/Club_Athletico_Paranaense_2018.svg',
    'fortaleza': 'https://commons.wikimedia.org/wiki/Special:FilePath/Fortaleza_Esporte_Clube_logo.svg',
    'lanus': 'https://commons.wikimedia.org/wiki/Special:FilePath/Escudo_del_Club_Atl%C3%A9tico_Lan%C3%BAs.svg',
    'racing': 'https://commons.wikimedia.org/wiki/Special:FilePath/Escudo_de_Racing_Club.svg',
    'ldu': 'https://commons.wikimedia.org/wiki/Special:FilePath/LDU_Quito_logo.svg',
    'lduquito': 'https://commons.wikimedia.org/wiki/Special:FilePath/LDU_Quito_logo.svg',
    'rosariocentral': 'https://commons.wikimedia.org/wiki/Special:FilePath/Escudo_de_Rosario_Central.svg',
    'redbullbragantino': 'https://commons.wikimedia.org/wiki/Special:FilePath/Red_Bull_Bragantino.svg',
    'bragantino': 'https://commons.wikimedia.org/wiki/Special:FilePath/Red_Bull_Bragantino.svg',
    'libertad': 'https://commons.wikimedia.org/wiki/Special:FilePath/Club_Libertad.svg',
    'palestino': 'https://commons.wikimedia.org/wiki/Special:FilePath/Club_Deportivo_Palestino_logo.svg'
};

const escudoPadraoLibertadores = 'https://www.ogol.com.br/img/logos/edicoes/130437_imgbank_.png';

function normalizarChave(nome) {
    if (!nome) return '';
    return nome.toLowerCase()
               .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
               .replace(/[^a-z0-9]/g, "");
}

function obterEscudoTime(nomeTime) {
    const chave = normalizarChave(nomeTime);
    return mapaEscudos[chave] || escudoPadraoLibertadores;
}

const timesPadraoLibertadores = {
    pote1: ['Palmeiras', 'Flamengo', 'River Plate', 'Fluminense', 'São Paulo', 'Atlético-MG', 'Grêmio', 'Bolívar'],
    pote2: ['Botafogo', 'Nacional', 'San Lorenzo', 'Peñarol', 'Talleres', 'Colo-Colo', 'Junior Barranquilla', 'The Strongest']
};

let cenaAtual = 1;
const totalCenas = 5;
let autoPlayAtivo = false;
let autoPlayTimer = null;
const tempoPorCenaMs = 12000;

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
        iniciarApresentacaoPotesOficiais();
    }
}

// 2. ANIMAÇÃO SEQUENCIAL DOS CARDS DE REGRAS (CENA 3)
function animarRegrasSequenciais() {
    const regras = document.querySelectorAll('.card-regra-info');
    regras.forEach(r => r.classList.remove('revelado'));

    regras.forEach((regra, index) => {
        const t = setTimeout(() => {
            regra.classList.add('revelado');
        }, 200 + (index * 250));
        timeoutsAnimacao.push(t);
    });
}

// 3. APRESENTAÇÃO COMPLETA: POTE 1 SOLO -> POTE 2 SOLO -> VISÃO GERAL
function iniciarApresentacaoPotesOficiais() {
    if (!palcoCenaPotes || cenaAtual !== 4) return;

    const dados = obterDadosPotes();
    
    const filaApresentacao = [
        ...dados.pote1.map(time => ({ time, poteNome: 'POTE 1 • LÍDERES' })),
        ...dados.pote2.map(time => ({ time, poteNome: 'POTE 2 • VICE-LÍDERES' }))
    ];

    let indexFila = 0;

    function renderizarCardSolo(item) {
        if (cenaAtual !== 4) return;

        const escudoUrl = obterEscudoTime(item.time);

        palcoCenaPotes.innerHTML = `
            <div class="container-spotlight-solo">
                <span class="tag-pote-solo">${item.poteNome}</span>
                <div class="card-time-solo" id="card-solo-ativo">
                    <div class="moldura-escudo-solo">
                        <img src="${escudoUrl}" alt="${item.time}" onerror="this.onerror=null; this.src='${escudoPadraoLibertadores}';">
                    </div>
                    <h3 class="nome-time-solo">${item.time}</h3>
                </div>
            </div>
        `;

        const cardAtivo = document.getElementById('card-solo-ativo');
        
        const tEntrada = setTimeout(() => {
            if (cardAtivo && cenaAtual === 4) cardAtivo.classList.add('visivel');
        }, 50);
        timeoutsAnimacao.push(tEntrada);

        // Fica em exibição por 1.8 segundos
        const tFadeOut = setTimeout(() => {
            if (cenaAtual !== 4) return;

            if (cardAtivo) cardAtivo.className = 'card-time-solo saindo';

            // Aguarda 0.4s de transição e passa para o próximo time
            const tProximo = setTimeout(() => {
                indexFila++;
                if (indexFila < filaApresentacao.length) {
                    renderizarCardSolo(filaApresentacao[indexFila]);
                } else {
                    renderizarVisaoGeralPotes(dados);
                }
            }, 400);

            timeoutsAnimacao.push(tProximo);
        }, 1800);

        timeoutsAnimacao.push(tFadeOut);
    }

    renderizarCardSolo(filaApresentacao[0]);
}

// 4. QUADRO FINAL COM OS DOIS POTES LADO A LADO
function renderizarVisaoGeralPotes(dados) {
    if (!palcoCenaPotes || cenaAtual !== 4) return;

    const htmlPote1 = dados.pote1.map(time => `
        <div class="item-time-quadro">
            <img src="${obterEscudoTime(time)}" class="mini-escudo-quadro" alt="${time}" onerror="this.onerror=null; this.src='${escudoPadraoLibertadores}';">
            <span class="nome-clube-quadro">${time}</span>
        </div>
    `).join('');

    const htmlPote2 = dados.pote2.map(time => `
        <div class="item-time-quadro">
            <img src="${obterEscudoTime(time)}" class="mini-escudo-quadro" alt="${time}" onerror="this.onerror=null; this.src='${escudoPadraoLibertadores}';">
            <span class="nome-clube-quadro">${time}</span>
        </div>
    `).join('');

    palcoCenaPotes.innerHTML = `
        <div class="container-potes-visao-geral">
            <div class="cabecalho-slide" style="margin-bottom: 1.2rem;">
                <h2 class="titulo-slide">COMPOSIÇÃO OFICIAL DOS POTES</h2>
                <p class="subtitulo-slide">16 CLUBES CONFIRMADOS</p>
            </div>

            <div class="grid-potes-duplo">
                <!-- POTE 1 -->
                <div class="coluna-pote-quadro">
                    <div class="barra-titulo-pote">
                        <span class="insignia-pote">POTE 1</span>
                        <span class="status-pote">LÍDERES</span>
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

// 5. CONTROLES DE NAVEGAÇÃO
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

// 6. ATALHOS DO TECLADO
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === 'ArrowRight') {
        e.preventDefault();
        if (btnAvancar) btnAvancar.click();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (btnVoltar) btnVoltar.click();
    }
});

// 7. MODO AUTOMÁTICO
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