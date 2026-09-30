// ==========================================================================
// assets/js/chaveamento-libertadores.js - MOTOR OFICIAL DA LIBERTADORES
// ==========================================================================

const CHAVE_SORTEIO = 'resultado_sorteio_libertadores';
const CHAVE_JOGOS_OFICIAIS = 'jogos_oficial_libertadores';

function carregarChaveamentoOficialLibertadores() {
    // 1. CARREGA OITAVAS DE FINAL DO SORTEIO REAL
    const sorteioSalvo = localStorage.getItem(CHAVE_SORTEIO);

    if (sorteioSalvo) {
        const confrontos = JSON.parse(sorteioSalvo);

        confrontos.forEach(item => {
            const card = document.getElementById(`chave-oitavas-${item.chave}`);
            if (card) {
                const slotT1 = card.querySelector(`#oitavas-${item.chave}-t1`);
                const slotT2 = card.querySelector(`#oitavas-${item.chave}-t2`);

                if (slotT1) slotT1.textContent = item.pote2; // Ida em casa
                if (slotT2) slotT2.textContent = item.pote1; // Decide em casa

                card.classList.add('preenchido');
            }
        });
    } else {
        ['A','B','C','D','E','F','G','H'].forEach(l => {
            const card = document.getElementById(`chave-oitavas-${l}`);
            if (card) {
                const t1 = card.querySelector(`#oitavas-${l}-t1`);
                const t2 = card.querySelector(`#oitavas-${l}-t2`);
                if (t1) t1.textContent = 'N/D';
                if (t2) t2.textContent = 'N/D';
                card.classList.remove('preenchido');
            }
        });
    }

    // 2. PROCESSA QUARTAS, SEMIS E FINAL A PARTIR DOS JOGOS OFICIAIS DIGITADOS
    const jogosSalvos = localStorage.getItem(CHAVE_JOGOS_OFICIAIS);

    if (jogosSalvos && sorteioSalvo) {
        const dadosJogos = JSON.parse(jogosSalvos);
        const placares = dadosJogos.placares || {};

        // CALCULA VENCEDORES DAS OITAVAS
        const oit = {};
        const chaves = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

        chaves.forEach(l => {
            const pIda = placares[`oitavas-${l}-ida`];
            const pVolta = placares[`oitavas-${l}-volta`];
            const cardIda = document.getElementById(`chave-oitavas-${l}`);

            if (cardIda && pIda && pVolta && pIda.m !== null && pIda.v !== null && pVolta.m !== null && pVolta.v !== null) {
                const t2 = cardIda.querySelector(`#oitavas-${l}-t1`).textContent; // Pote 2
                const t1 = cardIda.querySelector(`#oitavas-${l}-t2`).textContent; // Pote 1

                const golsT2 = pIda.m + pVolta.v;
                const golsT1 = pIda.v + pVolta.m;

                if (golsT1 > golsT2) oit[l] = t1;
                else if (golsT2 > golsT1) oit[l] = t2;
                else oit[l] = t1;
            }
        });

        // PREENCHE QUARTAS
        setSlot('quartas-1-t1', oit['A']);
        setSlot('quartas-1-t2', oit['C']);
        setSlot('quartas-2-t1', oit['E']);
        setSlot('quartas-2-t2', oit['G']);
        setSlot('quartas-3-t1', oit['B']);
        setSlot('quartas-3-t2', oit['D']);
        setSlot('quartas-4-t1', oit['F']);
        setSlot('quartas-4-t2', oit['H']);

        // CALCULA VENCEDORES DAS QUARTAS
        const q1 = calcularVencedorOficial(placares, 'quartas-1', oit['A'], oit['C']);
        const q2 = calcularVencedorOficial(placares, 'quartas-2', oit['E'], oit['G']);
        const q3 = calcularVencedorOficial(placares, 'quartas-3', oit['B'], oit['D']);
        const q4 = calcularVencedorOficial(placares, 'quartas-4', oit['F'], oit['H']);

        // PREENCHE SEMIS
        setSlot('semi-1-t1', q1);
        setSlot('semi-1-t2', q2);
        setSlot('semi-2-t1', q3);
        setSlot('semi-2-t2', q4);

        // CALCULA VENCEDORES DAS SEMIS
        const s1 = calcularVencedorOficial(placares, 'semi-1', q1, q2);
        const s2 = calcularVencedorOficial(placares, 'semi-2', q3, q4);

        // PREENCHE FINAL
        setSlot('finalista-lado-a', s1);
        setSlot('finalista-lado-b', s2);

        // CALCULA CAMPEÃO DA AMÉRICA
        const pFinal = placares['final-jogo'];
        let campeao = null;
        if (s1 && s2 && pFinal && pFinal.m !== null && pFinal.v !== null) {
            if (pFinal.m > pFinal.v) campeao = s1;
            else if (pFinal.v > pFinal.m) campeao = s2;
            else campeao = s1;
        }

        const sloganEl = document.getElementById('slogan-final');
        if (sloganEl) {
            if (campeao) {
                sloganEl.innerHTML = `CAMPEÃO: <span style="color: #ffffff; text-shadow: 0 0 20px rgba(212, 175, 55, 0.9);">${campeao}</span>`;
            } else {
                sloganEl.textContent = 'A GLÓRIA ETERNA';
            }
        }

    } else {
        // Se ainda não houver jogos oficiais gravados, limpa Quartas, Semis e Final
        resetSlotsQuartas();
        resetSlotsSemis();
        resetSlotsFinal();
        const sloganEl = document.getElementById('slogan-final');
        if (sloganEl) sloganEl.textContent = 'A GLÓRIA ETERNA';
    }
}

function calcularVencedorOficial(placares, prefixo, t1, t2) {
    if (!t1 || !t2 || t1 === 'N/D' || t2 === 'N/D') return null;

    const pIda = placares[`${prefixo}-ida`];
    const pVolta = placares[`${prefixo}-volta`];

    if (pIda && pVolta && pIda.m !== null && pIda.v !== null && pVolta.m !== null && pVolta.v !== null) {
        const golsT1 = pIda.m + pVolta.v;
        const golsT2 = pIda.v + pVolta.m;

        if (golsT1 > golsT2) return t1;
        if (golsT2 > golsT1) return t2;
        return t1;
    }
    return null;
}

function setSlot(idSlot, valor) {
    const el = document.getElementById(idSlot);
    if (el) {
        el.textContent = valor || 'N/D';
        const cardPai = el.closest('.card-chave');
        if (cardPai) {
            if (valor && valor !== 'N/D') {
                cardPai.classList.add('preenchido');
            } else {
                cardPai.classList.remove('preenchido');
            }
        }
    }
}

function resetSlotsQuartas() {
    for (let i = 1; i <= 4; i++) {
        setSlot(`quartas-${i}-t1`, 'N/D');
        setSlot(`quartas-${i}-t2`, 'N/D');
    }
}

function resetSlotsSemis() {
    for (let i = 1; i <= 2; i++) {
        setSlot(`semi-${i}-t1`, 'N/D');
        setSlot(`semi-${i}-t2`, 'N/D');
    }
}

function resetSlotsFinal() {
    setSlot('finalista-lado-a', 'N/D');
    setSlot('finalista-lado-b', 'N/D');
}

// Inicialização automática
document.addEventListener('DOMContentLoaded', carregarChaveamentoOficialLibertadores);
carregarChaveamentoOficialLibertadores();