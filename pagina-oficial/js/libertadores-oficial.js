// ==========================================================================
// pagina-oficial/js/libertadores-oficial.js - GESTÃO DA LIBERTADORES
// ==========================================================================

const CHAVE_SORTEIO = 'resultado_sorteio_libertadores';
const CHAVE_JOGOS = 'jogos_oficial_libertadores';

let estadoLibertadores = {
    placares: {},
    infoJogos: {}
};

// 1. INICIALIZAÇÃO
function inicializarTabelaLibertadores() {
    carregarEstruturaOitavas();
    carregarJogosSalvos();
    configurarInputsGols();
    configurarEdicaoInfoJogos();
    calcularClassificadosEAvanço();
}

// 2. CARREGA OS TIMES SORTEADOS
function carregarEstruturaOitavas() {
    const sorteioSalvo = localStorage.getItem(CHAVE_SORTEIO);
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
function carregarJogosSalvos() {
    const salvos = localStorage.getItem(CHAVE_JOGOS);
    if (!salvos) return;

    const dados = JSON.parse(salvos);
    estadoLibertadores = { ...estadoLibertadores, ...dados };

    // Restaura placares salvos
    document.querySelectorAll('.card-jogo').forEach(card => {
        const id = card.id;
        const inputM = card.querySelector('input.gols-mandante');
        const inputV = card.querySelector('input.gols-visitante');
        const infoEl = card.querySelector('.info-jogo');

        if (dados.placares && dados.placares[id]) {
            if (inputM && dados.placares[id].m !== null) inputM.value = dados.placares[id].m;
            if (inputV && dados.placares[id].v !== null) inputV.value = dados.placares[id].v;
        }

        // Restaura texto de data/horário/estádio personalizado
        if (dados.infoJogos && dados.infoJogos[id] && infoEl) {
            infoEl.textContent = dados.infoJogos[id];
        }
    });
}

// 4. CONFIGURA INPUTS DE GOLS DIRETOS NA TELA
function configurarInputsGols() {
    document.querySelectorAll('.card-jogo').forEach(card => {
        const idJogo = card.id;
        const inputM = card.querySelector('input.gols-mandante');
        const inputV = card.querySelector('input.gols-visitante');

        if (inputM) {
            inputM.addEventListener('focus', () => inputM.select());
            inputM.addEventListener('input', (e) => processarDigitacaoGol(e.target, idJogo, 'm'));
        }

        if (inputV) {
            inputV.addEventListener('focus', () => inputV.select());
            inputV.addEventListener('input', (e) => processarDigitacaoGol(e.target, idJogo, 'v'));
        }
    });
}

function processarDigitacaoGol(inputEl, idJogo, tipo) {
    // Permite apenas dígitos numéricos
    inputEl.value = inputEl.value.replace(/[^0-9]/g, '');
    const valor = inputEl.value.trim() === '' ? null : parseInt(inputEl.value.trim(), 10);

    salvarPlacarNoEstado(idJogo, tipo, valor);
    calcularClassificadosEAvanço();
}

function salvarPlacarNoEstado(idJogo, tipo, valor) {
    if (!estadoLibertadores.placares) estadoLibertadores.placares = {};
    if (!estadoLibertadores.placares[idJogo]) estadoLibertadores.placares[idJogo] = { m: null, v: null };

    estadoLibertadores.placares[idJogo][tipo] = valor;
    localStorage.setItem(CHAVE_JOGOS, JSON.stringify(estadoLibertadores));
}

// 5. CONFIGURA EDIÇÃO LIVRE DA BARRA DE DATA/HORÁRIO
function configurarEdicaoInfoJogos() {
    document.querySelectorAll('.card-jogo .info-jogo').forEach(infoEl => {
        const card = infoEl.closest('.card-jogo');
        const idJogo = card.id;

        infoEl.addEventListener('blur', () => {
            const texto = infoEl.textContent.trim();
            if (!estadoLibertadores.infoJogos) estadoLibertadores.infoJogos = {};
            estadoLibertadores.infoJogos[idJogo] = texto;
            localStorage.setItem(CHAVE_JOGOS, JSON.stringify(estadoLibertadores));
        });
    });
}

// 6. CÁLCULO DE AGREGADOS E AVANÇO AUTOMÁTICO
function calcularClassificadosEAvanço() {
    const chaves = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const vencedoresOitavas = {};

    chaves.forEach(letra => {
        const placarIda = estadoLibertadores.placares ? estadoLibertadores.placares[`oitavas-${letra}-ida`] : null;
        const placarVolta = estadoLibertadores.placares ? estadoLibertadores.placares[`oitavas-${letra}-volta`] : null;

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
                vencedoresOitavas[letra] = timeP1; // Mantém preferência P1 em caso de empate numérico enquanto não houver pênaltis
            }
        }
    });

    // Atualiza Quartas de Final
    atualizarConfrontoMataMata('quartas-1', vencedoresOitavas['A'] || 'Venc. A', vencedoresOitavas['C'] || 'Venc. C');
    atualizarConfrontoMataMata('quartas-2', vencedoresOitavas['E'] || 'Venc. E', vencedoresOitavas['G'] || 'Venc. G');
    atualizarConfrontoMataMata('quartas-3', vencedoresOitavas['B'] || 'Venc. B', vencedoresOitavas['D'] || 'Venc. D');
    atualizarConfrontoMataMata('quartas-4', vencedoresOitavas['F'] || 'Venc. F', vencedoresOitavas['H'] || 'Venc. H');

    // Calcula Semifinais
    const vQ1 = calcularVencedorMataMata('quartas-1');
    const vQ2 = calcularVencedorMataMata('quartas-2');
    const vQ3 = calcularVencedorMataMata('quartas-3');
    const vQ4 = calcularVencedorMataMata('quartas-4');

    atualizarConfrontoMataMata('semi-1', vQ1 || 'Venc. Q1', vQ2 || 'Venc. Q2');
    atualizarConfrontoMataMata('semi-2', vQ3 || 'Venc. Q3', vQ4 || 'Venc. Q4');

    // Calcula Final Única
    const vS1 = calcularVencedorMataMata('semi-1');
    const vS2 = calcularVencedorMataMata('semi-2');

    const cardFinal = document.getElementById('final-jogo');
    if (cardFinal) {
        if (vS1) cardFinal.querySelector('.time.mandante').textContent = vS1;
        if (vS2) cardFinal.querySelector('.time.visitante').textContent = vS2;
    }
}

function atualizarConfrontoMataMata(prefixo, t1, t2) {
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

function calcularVencedorMataMata(prefixo) {
    const placarIda = estadoLibertadores.placares ? estadoLibertadores.placares[`${prefixo}-ida`] : null;
    const placarVolta = estadoLibertadores.placares ? estadoLibertadores.placares[`${prefixo}-volta`] : null;

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
inicializarTabelaLibertadores();