// ==========================================================================
// pagina-oficial/js/sulamericana-oficial.js - GESTÃO DA SUL-AMERICANA
// ==========================================================================

const CHAVE_SORTEIO_SULA = 'resultado_sorteio_sulamericana';
const CHAVE_JOGOS_SULA = 'jogos_oficial_sulamericana';

let estadoSulamericana = {
    placares: {},
    infoJogos: {}
};

// 1. INICIALIZAÇÃO
function inicializarTabelaSulamericana() {
    carregarEstruturaOitavasSula();
    carregarJogosSalvosSula();
    configurarInputsGolsSula();
    configurarEdicaoInfoJogosSula();
    calcularClassificadosEAvançoSula();
}

// 2. CARREGA OS TIMES SORTEADOS
function carregarEstruturaOitavasSula() {
    const sorteioSalvo = localStorage.getItem(CHAVE_SORTEIO_SULA);
    if (!sorteioSalvo) return;

    const confrontos = JSON.parse(sorteioSalvo);

    confrontos.forEach(confronto => {
        const letra = confronto.chave;
        const timeP2 = confronto.pote2; // Mandante na Ida
        const timeP1 = confronto.pote1; // Mandante na Volta

        const cardIda = document.getElementById(`oitavas-${letra}-ida`);
        if (cardIda) {
            cardIda.querySelector('.time.mandante').textContent = timeP2;
            cardIda.querySelector('.time.visitante').textContent = timeP1;
        }

        const cardVolta = document.getElementById(`oitavas-${letra}-volta`);
        if (cardVolta) {
            cardVolta.querySelector('.time.mandante').textContent = timeP1;
            cardVolta.querySelector('.time.visitante').textContent = timeP2;
        }
    });
}

// 3. CARREGA PLACARES E DATAS SALVAS
function carregarJogosSalvosSula() {
    const salvos = localStorage.getItem(CHAVE_JOGOS_SULA);
    if (!salvos) return;

    const dados = JSON.parse(salvos);
    estadoSulamericana = { ...estadoSulamericana, ...dados };

    document.querySelectorAll('.card-jogo').forEach(card => {
        const id = card.id;
        const inputM = card.querySelector('input.gols-mandante');
        const inputV = card.querySelector('input.gols-visitante');
        const infoEl = card.querySelector('.info-jogo');

        if (dados.placares && dados.placares[id]) {
            if (inputM && dados.placares[id].m !== null) inputM.value = dados.placares[id].m;
            if (inputV && dados.placares[id].v !== null) inputV.value = dados.placares[id].v;
        }

        if (dados.infoJogos && dados.infoJogos[id] && infoEl) {
            infoEl.textContent = dados.infoJogos[id];
        }
    });
}

// 4. CONFIGURA INPUTS DE GOLS DIRETOS NA TELA (SULA)
function configurarInputsGolsSula() {
    document.querySelectorAll('.card-jogo').forEach(card => {
        const idJogo = card.id;
        const inputM = card.querySelector('input.gols-mandante');
        const inputV = card.querySelector('input.gols-visitante');

        if (inputM) {
            inputM.addEventListener('focus', () => inputM.select());
            inputM.addEventListener('input', (e) => processarDigitacaoGolSula(e.target, idJogo, 'm'));
        }

        if (inputV) {
            inputV.addEventListener('focus', () => inputV.select());
            inputV.addEventListener('input', (e) => processarDigitacaoGolSula(e.target, idJogo, 'v'));
        }
    });
}

function processarDigitacaoGolSula(inputEl, idJogo, tipo) {
    inputEl.value = inputEl.value.replace(/[^0-9]/g, '');
    const valor = inputEl.value.trim() === '' ? null : parseInt(inputEl.value.trim(), 10);

    salvarPlacarNoEstadoSula(idJogo, tipo, valor);
    calcularClassificadosEAvançoSula();
}

function salvarPlacarNoEstadoSula(idJogo, tipo, valor) {
    if (!estadoSulamericana.placares) estadoSulamericana.placares = {};
    if (!estadoSulamericana.placares[idJogo]) estadoSulamericana.placares[idJogo] = { m: null, v: null };

    estadoSulamericana.placares[idJogo][tipo] = valor;
    localStorage.setItem(CHAVE_JOGOS_SULA, JSON.stringify(estadoSulamericana));
}

// 5. CONFIGURA EDIÇÃO LIVRE DA BARRA DE DATA/HORÁRIO (SULA)
function configurarEdicaoInfoJogosSula() {
    document.querySelectorAll('.card-jogo .info-jogo').forEach(infoEl => {
        const card = infoEl.closest('.card-jogo');
        const idJogo = card.id;

        infoEl.addEventListener('blur', () => {
            const texto = infoEl.textContent.trim();
            if (!estadoSulamericana.infoJogos) estadoSulamericana.infoJogos = {};
            estadoSulamericana.infoJogos[idJogo] = texto;
            localStorage.setItem(CHAVE_JOGOS_SULA, JSON.stringify(estadoSulamericana));
        });
    });
}

// 6. CÁLCULO DE AGREGADOS E AVANÇO AUTOMÁTICO SULA
function calcularClassificadosEAvançoSula() {
    const chaves = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const vencedoresOitavas = {};

    chaves.forEach(letra => {
        const placarIda = estadoSulamericana.placares ? estadoSulamericana.placares[`oitavas-${letra}-ida`] : null;
        const placarVolta = estadoSulamericana.placares ? estadoSulamericana.placares[`oitavas-${letra}-volta`] : null;

        const cardIda = document.getElementById(`oitavas-${letra}-ida`);
        if (!cardIda) return;

        const timeP2 = cardIda.querySelector('.time.mandante').textContent;
        const timeP1 = cardIda.querySelector('.time.visitante').textContent;

        if (placarIda && placarVolta && placarIda.m !== null && placarIda.v !== null && placarVolta.m !== null && placarVolta.v !== null) {
            const golsP2 = placarIda.m + placarVolta.v;
            const golsP1 = placarIda.v + placarVolta.m;

            if (golsP1 > golsP2) {
                vencedoresOitavas[letra] = timeP1;
            } else if (golsP2 > golsP1) {
                vencedoresOitavas[letra] = timeP2;
            } else {
                vencedoresOitavas[letra] = timeP1;
            }
        }
    });

    // Atualiza Quartas de Final
    atualizarConfrontoMataMataSula('quartas-1', vencedoresOitavas['A'] || 'Venc. A', vencedoresOitavas['C'] || 'Venc. C');
    atualizarConfrontoMataMataSula('quartas-2', vencedoresOitavas['E'] || 'Venc. E', vencedoresOitavas['G'] || 'Venc. G');
    atualizarConfrontoMataMataSula('quartas-3', vencedoresOitavas['B'] || 'Venc. B', vencedoresOitavas['D'] || 'Venc. D');
    atualizarConfrontoMataMataSula('quartas-4', vencedoresOitavas['F'] || 'Venc. F', vencedoresOitavas['H'] || 'Venc. H');

    // Calcula Semifinais
    const vQ1 = calcularVencedorMataMataSula('quartas-1');
    const vQ2 = calcularVencedorMataMataSula('quartas-2');
    const vQ3 = calcularVencedorMataMataSula('quartas-3');
    const vQ4 = calcularVencedorMataMataSula('quartas-4');

    atualizarConfrontoMataMataSula('semi-1', vQ1 || 'Venc. Q1', vQ2 || 'Venc. Q2');
    atualizarConfrontoMataMataSula('semi-2', vQ3 || 'Venc. Q3', vQ4 || 'Venc. Q4');

    // Calcula Final Única
    const vS1 = calcularVencedorMataMataSula('semi-1');
    const vS2 = calcularVencedorMataMataSula('semi-2');

    const cardFinal = document.getElementById('final-jogo');
    if (cardFinal) {
        if (vS1) cardFinal.querySelector('.time.mandante').textContent = vS1;
        if (vS2) cardFinal.querySelector('.time.visitante').textContent = vS2;
    }
}

function atualizarConfrontoMataMataSula(prefixo, t1, t2) {
    const cardIda = document.getElementById(`${prefixo}-ida`);
    const cardVolta = document.getElementById(`${prefixo}-volta`);

    if (cardIda) {
        cardIda.querySelector('.time.mandante').textContent = t1;
        cardIda.querySelector('.time.visitante').textContent = t2;
    }
    if (cardVolta) {
        cardVolta.querySelector('.time.mandante').textContent = t2;
        cardVolta.querySelector('.time.visitante').textContent = t1;
    }
}

function calcularVencedorMataMataSula(prefixo) {
    const placarIda = estadoSulamericana.placares ? estadoSulamericana.placares[`${prefixo}-ida`] : null;
    const placarVolta = estadoSulamericana.placares ? estadoSulamericana.placares[`${prefixo}-volta`] : null;

    const cardIda = document.getElementById(`${prefixo}-ida`);
    if (!cardIda) return null;

    const t1 = cardIda.querySelector('.time.mandante').textContent;
    const t2 = cardIda.querySelector('.time.visitante').textContent;

    if (t1.startsWith('Venc.') || t2.startsWith('Venc.')) return null;

    if (placarIda && placarVolta && placarIda.m !== null && placarIda.v !== null && placarVolta.m !== null && placarVolta.v !== null) {
        const golsT1 = placarIda.m + placarVolta.v;
        const golsT2 = placarIda.v + placarVolta.m;

        if (golsT1 > golsT2) return t1;
        if (golsT2 > golsT1) return t2;
        return t1;
    }
    return null;
}

// Inicialização automática ao carregar
inicializarTabelaSulamericana();