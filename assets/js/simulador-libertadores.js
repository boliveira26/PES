// ==========================================================================
// assets/js/simulador-libertadores.js - MOTOR BLINDADO LIBERTADORES
// ==========================================================================

const CHAVE_SORTEIO = 'resultado_sorteio_libertadores';
const CHAVE_SIMULACAO_MOTOR = 'simulacao_libertadores_motor_v5';
const CHAVE_SIMULACAO_CHAVEAMENTO = 'simulacao_libertadores';

const sorteioPadraoLibertadores = [
    { chave: 'A', pote2: 'Botafogo', pote1: 'Palmeiras' },
    { chave: 'B', pote2: 'Nacional', pote1: 'São Paulo' },
    { chave: 'C', pote2: 'Peñarol', pote1: 'Flamengo' },
    { chave: 'D', pote2: 'Talleres', pote1: 'River Plate' },
    { chave: 'E', pote2: 'San Lorenzo', pote1: 'Atlético-MG' },
    { chave: 'F', pote2: 'Colo-Colo', pote1: 'Fluminense' },
    { chave: 'G', pote2: 'Junior Barranquilla', pote1: 'Grêmio' },
    { chave: 'H', pote2: 'The Strongest', pote1: 'Bolívar' }
];

let estadoSimulador = {
    sorteioAssinatura: '',
    placares: {},
    penaltis: {}
};

const placaresPES = [
    [1, 0], [2, 1], [2, 0], [1, 1], [0, 0], [3, 1], [1, 2], [0, 1], [2, 2], [3, 2]
];

function sortearPlacarPES() {
    return placaresPES[Math.floor(Math.random() * placaresPES.length)];
}

// 1. INICIALIZAÇÃO BLINDADA
function inicializarSimulador() {
    verificarESincronizarNovoSorteio();
    carregarEstruturaOitavas();
    configurarInputsGols();
    configurarInputsPenaltis();
    configurarBotoesAcao();
    calcularMataMataCompleto(false); // false = não abrir modal no carregamento
}

// 2. DETECTA SE O SORTEIO MUDOU E LIMPA PLACARES ANTIGOS
function verificarESincronizarNovoSorteio() {
    const sorteioSalvo = localStorage.getItem(CHAVE_SORTEIO);
    const sorteioAtualStr = sorteioSalvo || JSON.stringify(sorteioPadraoLibertadores);

    const salvos = localStorage.getItem(CHAVE_SIMULACAO_MOTOR);
    if (salvos) {
        const dadosSalvos = JSON.parse(salvos);
        
        // Se o sorteio atual for diferente do sorteio da simulação anterior, RESETA TUDO
        if (dadosSalvos.sorteioAssinatura !== sorteioAtualStr) {
            estadoSimulador = {
                sorteioAssinatura: sorteioAtualStr,
                placares: {},
                penaltis: {}
            };
            localStorage.removeItem(CHAVE_SIMULACAO_MOTOR);
            localStorage.removeItem(CHAVE_SIMULACAO_CHAVEAMENTO);
            limparCamposNaTela();
        } else {
            estadoSimulador = dadosSalvos;
            restaurarValoresNaTela();
        }
    } else {
        estadoSimulador = {
            sorteioAssinatura: sorteioAtualStr,
            placares: {},
            penaltis: {}
        };
    }
}

function limparCamposNaTela() {
    document.querySelectorAll('input.gols').forEach(inp => inp.value = '');
    document.querySelectorAll('input.gols-penalti').forEach(inp => inp.value = '');
    document.querySelectorAll('.linha-penaltis-jogo').forEach(el => el.classList.add('oculto'));
    const modal = document.getElementById('modal-campeao');
    if (modal) modal.classList.add('oculto');
}

function restaurarValoresNaTela() {
    document.querySelectorAll('.card-jogo').forEach(card => {
        const id = card.id;
        const inputM = card.querySelector('input.gols-mandante');
        const inputV = card.querySelector('input.gols-visitante');

        if (estadoSimulador.placares && estadoSimulador.placares[id]) {
            if (inputM && estadoSimulador.placares[id].m !== null) inputM.value = estadoSimulador.placares[id].m;
            if (inputV && estadoSimulador.placares[id].v !== null) inputV.value = estadoSimulador.placares[id].v;
        }
    });

    document.querySelectorAll('.linha-penaltis-jogo').forEach(linhaPen => {
        const id = linhaPen.id;
        const inputPenM = linhaPen.querySelector('input.pen-mandante');
        const inputPenV = linhaPen.querySelector('input.pen-visitante');

        if (estadoSimulador.penaltis && estadoSimulador.penaltis[id]) {
            if (inputPenM && estadoSimulador.penaltis[id].m !== null) inputPenM.value = estadoSimulador.penaltis[id].m;
            if (inputPenV && estadoSimulador.penaltis[id].v !== null) inputPenV.value = estadoSimulador.penaltis[id].v;
        }
    });
}

// 3. CARREGA OS CONFRONTOS DAS OITAVAS
function carregarEstruturaOitavas() {
    const sorteioSalvo = localStorage.getItem(CHAVE_SORTEIO);
    const confrontos = sorteioSalvo ? JSON.parse(sorteioSalvo) : sorteioPadraoLibertadores;

    confrontos.forEach(confronto => {
        const letra = confronto.chave;
        const timeP2 = confronto.pote2;
        const timeP1 = confronto.pote1;

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

// 4. CONFIGURA DIGITAÇÃO DIRETA
function configurarInputsGols() {
    document.querySelectorAll('.card-jogo').forEach(card => {
        const idJogo = card.id;
        const inputM = card.querySelector('input.gols-mandante');
        const inputV = card.querySelector('input.gols-visitante');

        if (inputM) {
            inputM.addEventListener('focus', () => inputM.select());
            inputM.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                const valor = e.target.value.trim() === '' ? null : parseInt(e.target.value.trim(), 10);
                salvarPlacar(idJogo, 'm', valor);
                calcularMataMataCompleto(true);
            });
        }

        if (inputV) {
            inputV.addEventListener('focus', () => inputV.select());
            inputV.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                const valor = e.target.value.trim() === '' ? null : parseInt(e.target.value.trim(), 10);
                salvarPlacar(idJogo, 'v', valor);
                calcularMataMataCompleto(true);
            });
        }
    });
}

function salvarPlacar(idJogo, tipo, valor) {
    if (!estadoSimulador.placares) estadoSimulador.placares = {};
    if (!estadoSimulador.placares[idJogo]) estadoSimulador.placares[idJogo] = { m: null, v: null };

    estadoSimulador.placares[idJogo][tipo] = valor;
    localStorage.setItem(CHAVE_SIMULACAO_MOTOR, JSON.stringify(estadoSimulador));
}

// 5. CONFIGURA DIGITAÇÃO DOS PÊNALTIS
function configurarInputsPenaltis() {
    document.querySelectorAll('.linha-penaltis-jogo').forEach(linhaPen => {
        const idPen = linhaPen.id;
        const inputPenM = linhaPen.querySelector('input.pen-mandante');
        const inputPenV = linhaPen.querySelector('input.pen-visitante');

        if (inputPenM) {
            inputPenM.addEventListener('focus', () => inputPenM.select());
            inputPenM.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                const valor = e.target.value.trim() === '' ? null : parseInt(e.target.value.trim(), 10);
                salvarPenalti(idPen, 'm', valor);
                calcularMataMataCompleto(true);
            });
        }

        if (inputPenV) {
            inputPenV.addEventListener('focus', () => inputPenV.select());
            inputPenV.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                const valor = e.target.value.trim() === '' ? null : parseInt(e.target.value.trim(), 10);
                salvarPenalti(idPen, 'v', valor);
                calcularMataMataCompleto(true);
            });
        }
    });
}

function salvarPenalti(idPen, tipo, valor) {
    if (!estadoSimulador.penaltis) estadoSimulador.penaltis = {};
    if (!estadoSimulador.penaltis[idPen]) estadoSimulador.penaltis[idPen] = { m: null, v: null };

    estadoSimulador.penaltis[idPen][tipo] = valor;
    localStorage.setItem(CHAVE_SIMULACAO_MOTOR, JSON.stringify(estadoSimulador));
}

// 6. CÁLCULO GERAL DO MATA-MATA
function calcularMataMataCompleto(permitirModal = true) {
    const chaves = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const oit = {};

    // 1. Oitavas
    chaves.forEach(letra => {
        const pIda = estadoSimulador.placares[`oitavas-${letra}-ida`];
        const pVolta = estadoSimulador.placares[`oitavas-${letra}-volta`];

        const cardIda = document.getElementById(`oitavas-${letra}-ida`);
        const cardVolta = document.getElementById(`oitavas-${letra}-volta`);
        const linhaPen = document.getElementById(`pen-oitavas-${letra}`);
        if (!cardIda || !cardVolta) return;

        const timeP2 = cardIda.querySelector('.time.mandante').textContent;
        const timeP1 = cardIda.querySelector('.time.visitante').textContent;

        if (pIda && pVolta && pIda.m !== null && pIda.v !== null && pVolta.m !== null && pVolta.v !== null) {
            const golsP2 = pIda.m + pVolta.v;
            const golsP1 = pIda.v + pVolta.m;

            if (golsP1 > golsP2) {
                if (linhaPen) linhaPen.classList.add('oculto');
                oit[letra] = timeP1;
            } else if (golsP2 > golsP1) {
                if (linhaPen) linhaPen.classList.add('oculto');
                oit[letra] = timeP2;
            } else {
                if (linhaPen) linhaPen.classList.remove('oculto');

                const penData = estadoSimulador.penaltis[`pen-oitavas-${letra}`];
                if (penData && penData.m !== null && penData.v !== null && penData.m !== penData.v) {
                    oit[letra] = penData.m > penData.v ? timeP1 : timeP2;
                } else {
                    oit[letra] = null;
                }
            }
        } else {
            if (linhaPen) linhaPen.classList.add('oculto');
        }
    });

    // 2. Quartas
    atualizarCardDuelo('quartas-1', oit['A'] || 'Venc. A', oit['C'] || 'Venc. C');
    atualizarCardDuelo('quartas-2', oit['E'] || 'Venc. E', oit['G'] || 'Venc. G');
    atualizarCardDuelo('quartas-3', oit['B'] || 'Venc. B', oit['D'] || 'Venc. D');
    atualizarCardDuelo('quartas-4', oit['F'] || 'Venc. F', oit['H'] || 'Venc. H');

    const q1 = calcularVencedorMataMata('quartas-1');
    const q2 = calcularVencedorMataMata('quartas-2');
    const q3 = calcularVencedorMataMata('quartas-3');
    const q4 = calcularVencedorMataMata('quartas-4');

    // 3. Semis
    atualizarCardDuelo('semi-1', q1 || 'Venc. Q1', q2 || 'Venc. Q2');
    atualizarCardDuelo('semi-2', q3 || 'Venc. Q3', q4 || 'Venc. Q4');

    const s1 = calcularVencedorMataMata('semi-1');
    const s2 = calcularVencedorMataMata('semi-2');

    // 4. Final Única
    const cardFinal = document.getElementById('final-jogo');
    if (cardFinal) {
        cardFinal.querySelector('.time.mandante').textContent = s1 || 'Venc. Semifinal 1';
        cardFinal.querySelector('.time.visitante').textContent = s2 || 'Venc. Semifinal 2';
    }

    const campeao = calcularCampeaoFinal(cardFinal, s1, s2, permitirModal);

    sincronizarComChaveamento(oit, q1, q2, q3, q4, s1, s2, campeao);
}

function atualizarCardDuelo(prefixo, t1, t2) {
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
    const pIda = estadoSimulador.placares[`${prefixo}-ida`];
    const pVolta = estadoSimulador.placares[`${prefixo}-volta`];

    const cardIda = document.getElementById(`${prefixo}-ida`);
    const cardVolta = document.getElementById(`${prefixo}-volta`);
    const linhaPen = document.getElementById(`pen-${prefixo}`);
    if (!cardIda || !cardVolta) return null;

    const t1 = cardIda.querySelector('.time.mandante').textContent;
    const t2 = cardIda.querySelector('.time.visitante').textContent;

    if (t1.startsWith('Venc.') || t2.startsWith('Venc.') || t1 === 'N/D' || t2 === 'N/D') return null;

    if (pIda && pVolta && pIda.m !== null && pIda.v !== null && pVolta.m !== null && pVolta.v !== null) {
        const golsT1 = pIda.m + pVolta.v;
        const golsT2 = pIda.v + pVolta.m;

        if (golsT1 > golsT2) {
            if (linhaPen) linhaPen.classList.add('oculto');
            return t1;
        } else if (golsT2 > golsT1) {
            if (linhaPen) linhaPen.classList.add('oculto');
            return t2;
        } else {
            if (linhaPen) linhaPen.classList.remove('oculto');

            const penData = estadoSimulador.penaltis[`pen-${prefixo}`];
            if (penData && penData.m !== null && penData.v !== null && penData.m !== penData.v) {
                return penData.m > penData.v ? t2 : t1;
            }
            return null;
        }
    } else {
        if (linhaPen) linhaPen.classList.add('oculto');
    }
    return null;
}

function calcularCampeaoFinal(cardFinal, s1, s2, permitirModal) {
    if (!cardFinal || !s1 || !s2 || s1.startsWith('Venc.') || s2.startsWith('Venc.') || s1 === 'N/D' || s2 === 'N/D') return null;

    const pFinal = estadoSimulador.placares['final-jogo'];
    const linhaPenFinal = document.getElementById('pen-final-jogo');

    if (pFinal && pFinal.m !== null && pFinal.v !== null) {
        let campeao = null;
        if (pFinal.m > pFinal.v) {
            if (linhaPenFinal) linhaPenFinal.classList.add('oculto');
            campeao = s1;
        } else if (pFinal.v > pFinal.m) {
            if (linhaPenFinal) linhaPenFinal.classList.add('oculto');
            campeao = s2;
        } else {
            if (linhaPenFinal) linhaPenFinal.classList.remove('oculto');

            const penData = estadoSimulador.penaltis['pen-final-jogo'];
            if (penData && penData.m !== null && penData.v !== null && penData.m !== penData.v) {
                campeao = penData.m > penData.v ? s1 : s2;
            }
        }

        if (campeao && permitirModal) {
            const modal = document.getElementById('modal-campeao');
            const nomeEl = document.getElementById('nome-time-campeao');
            if (modal && nomeEl) {
                nomeEl.textContent = campeao;
                modal.classList.remove('oculto');
            }
        }
        return campeao;
    } else {
        if (linhaPenFinal) linhaPenFinal.classList.add('oculto');
    }
    return null;
}

// 7. SINCRONIZA COM CHAVEAMENTO
function sincronizarComChaveamento(oit, q1, q2, q3, q4, s1, s2, campeao) {
    const dados = {
        quartas: (oit['A'] || oit['C']) ? {
            q1_t1: oit['A'] || 'N/D', q1_t2: oit['C'] || 'N/D',
            q2_t1: oit['E'] || 'N/D', q2_t2: oit['G'] || 'N/D',
            q3_t1: oit['B'] || 'N/D', q3_t2: oit['D'] || 'N/D',
            q4_t1: oit['F'] || 'N/D', q4_t2: oit['H'] || 'N/D'
        } : null,
        semis: (q1 || q2 || q3 || q4) ? {
            s1_t1: q1 || 'N/D', s1_t2: q2 || 'N/D',
            s2_t1: q3 || 'N/D', s2_t2: q4 || 'N/D'
        } : null,
        final: (s1 || s2) ? {
            f1: s1 || 'N/D',
            f2: s2 || 'N/D'
        } : null,
        campeao: campeao || null
    };

    localStorage.setItem(CHAVE_SIMULACAO_CHAVEAMENTO, JSON.stringify(dados));
}

// 8. BOTÕES DE SIMULAÇÃO
function configurarBotoesAcao() {
    const btnOitavas = document.getElementById('btn-simular-oitavas');
    const btnTudo = document.getElementById('btn-simular-tudo');
    const btnReset = document.getElementById('btn-reset-sim');

    if (btnOitavas) {
        btnOitavas.addEventListener('click', () => {
            const chaves = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
            chaves.forEach(l => {
                const pIda = sortearPlacarPES();
                const pVolta = sortearPlacarPES();
                setPlacar(`oitavas-${l}-ida`, pIda[0], pIda[1]);
                setPlacar(`oitavas-${l}-volta`, pVolta[0], pVolta[1]);

                if (pIda[0] + pVolta[1] === pIda[1] + pVolta[0]) {
                    setPenalti(`pen-oitavas-${l}`, 5, 4);
                }
            });
            calcularMataMataCompleto(false);
        });
    }

    if (btnTudo) {
        btnTudo.addEventListener('click', () => {
            // 1. Oitavas
            const chaves = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
            chaves.forEach(l => {
                const pIda = sortearPlacarPES();
                const pVolta = sortearPlacarPES();
                setPlacar(`oitavas-${l}-ida`, pIda[0], pIda[1]);
                setPlacar(`oitavas-${l}-volta`, pVolta[0], pVolta[1]);
                if (pIda[0] + pVolta[1] === pIda[1] + pVolta[0]) {
                    setPenalti(`pen-oitavas-${l}`, 5, 4);
                }
            });
            calcularMataMataCompleto(false);

            // 2. Quartas
            for (let i = 1; i <= 4; i++) {
                const pIda = sortearPlacarPES();
                const pVolta = sortearPlacarPES();
                setPlacar(`quartas-${i}-ida`, pIda[0], pIda[1]);
                setPlacar(`quartas-${i}-volta`, pVolta[0], pVolta[1]);
                if (pIda[0] + pVolta[1] === pIda[1] + pVolta[0]) {
                    setPenalti(`pen-quartas-${i}`, 4, 3);
                }
            }
            calcularMataMataCompleto(false);

            // 3. Semis
            for (let i = 1; i <= 2; i++) {
                const pIda = sortearPlacarPES();
                const pVolta = sortearPlacarPES();
                setPlacar(`semi-${i}-ida`, pIda[0], pIda[1]);
                setPlacar(`semi-${i}-volta`, pVolta[0], pVolta[1]);
                if (pIda[0] + pVolta[1] === pIda[1] + pVolta[0]) {
                    setPenalti(`pen-semi-${i}`, 5, 3);
                }
            }
            calcularMataMataCompleto(false);

            // 4. Final
            const pFin = sortearPlacarPES();
            const g1 = pFin[0] === pFin[1] ? pFin[0] + 1 : pFin[0];
            setPlacar('final-jogo', g1, pFin[1]);
            calcularMataMataCompleto(true); // Exibe o modal do campeão
        });
    }

    if (btnReset) {
        btnReset.addEventListener('click', () => {
            if (confirm('Deseja limpar todos os placares e pênaltis simulados?')) {
                localStorage.removeItem(CHAVE_SIMULACAO_MOTOR);
                localStorage.removeItem(CHAVE_SIMULACAO_CHAVEAMENTO);
                estadoSimulador.placares = {};
                estadoSimulador.penaltis = {};

                limparCamposNaTela();
                inicializarSimulador();
            }
        });
    }
}

function setPlacar(idCard, m, v) {
    const card = document.getElementById(idCard);
    if (!card) return;

    const inM = card.querySelector('input.gols-mandante');
    const inV = card.querySelector('input.gols-visitante');

    if (inM) inM.value = m;
    if (inV) inV.value = v;

    salvarPlacar(idCard, 'm', m);
    salvarPlacar(idCard, 'v', v);
}

function setPenalti(idPen, m, v) {
    const linhaPen = document.getElementById(idPen);
    if (!linhaPen) return;

    linhaPen.classList.remove('oculto');
    const inM = linhaPen.querySelector('input.pen-mandante');
    const inV = linhaPen.querySelector('input.pen-visitante');

    if (inM) inM.value = m;
    if (inV) inV.value = v;

    salvarPenalti(idPen, 'm', m);
    salvarPenalti(idPen, 'v', v);
}

// Inicialização automática
inicializarSimulador();