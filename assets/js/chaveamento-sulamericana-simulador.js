// ==========================================================================
// assets/js/chaveamento-sulamericana-simulador.js - MOTOR CHAVE SIMULADA SULA
// ==========================================================================

const CHAVE_SORTEIO_SULA = 'resultado_sorteio_sulamericana';
const CHAVE_SIMULACAO_SULA = 'simulacao_sulamericana';

function carregarChaveamentoSimuladoSulamericana() {
    // 1. CARREGA AS OITAVAS DE FINAL DO SORTEIO DA SULA
    const sorteioSalvo = localStorage.getItem(CHAVE_SORTEIO_SULA);

    if (sorteioSalvo) {
        const confrontos = JSON.parse(sorteioSalvo);

        confrontos.forEach(item => {
            const card = document.getElementById(`chave-oitavas-${item.chave}`);
            if (card) {
                const slotT1 = card.querySelector(`#oitavas-${item.chave}-t1`);
                const slotT2 = card.querySelector(`#oitavas-${item.chave}-t2`);

                if (slotT1) slotT1.textContent = item.pote2;
                if (slotT2) slotT2.textContent = item.pote1;

                card.classList.add('preenchido');
            }
        });
    }

    // 2. CARREGA PROJEÇÕES DO SIMULADOR DA SULA
    const simulacaoSalva = localStorage.getItem(CHAVE_SIMULACAO_SULA);

    if (simulacaoSalva) {
        const dados = JSON.parse(simulacaoSalva);

        // QUARTAS
        if (dados.quartas) {
            setSlotSula('quartas-1-t1', dados.quartas.q1_t1);
            setSlotSula('quartas-1-t2', dados.quartas.q1_t2);
            setSlotSula('quartas-2-t1', dados.quartas.q2_t1);
            setSlotSula('quartas-2-t2', dados.quartas.q2_t2);
            setSlotSula('quartas-3-t1', dados.quartas.q3_t1);
            setSlotSula('quartas-3-t2', dados.quartas.q3_t2);
            setSlotSula('quartas-4-t1', dados.quartas.q4_t1);
            setSlotSula('quartas-4-t2', dados.quartas.q4_t2);
        } else {
            resetSlotsQuartasSula();
        }

        // SEMIFINAIS
        if (dados.semis) {
            setSlotSula('semi-1-t1', dados.semis.s1_t1);
            setSlotSula('semi-1-t2', dados.semis.s1_t2);
            setSlotSula('semi-2-t1', dados.semis.s2_t1);
            setSlotSula('semi-2-t2', dados.semis.s2_t2);
        } else {
            resetSlotsSemisSula();
        }

        // FINAL
        if (dados.final) {
            setSlotSula('finalista-lado-a', dados.final.f1);
            setSlotSula('finalista-lado-b', dados.final.f2);
        } else {
            resetSlotsFinalSula();
        }

        // CAMPEÃO PROJETADO SULA
        const sloganEl = document.getElementById('slogan-final');
        if (sloganEl) {
            if (dados.campeao) {
                sloganEl.innerHTML = `CAMPEÃO SIMULADO: <span style="color: #ffffff; text-shadow: 0 0 20px rgba(96, 165, 250, 0.9);">${dados.campeao}</span>`;
            } else {
                sloganEl.textContent = 'LA GRAN CONQUISTA';
            }
        }
    } else {
        resetSlotsQuartasSula();
        resetSlotsSemisSula();
        resetSlotsFinalSula();
        const sloganEl = document.getElementById('slogan-final');
        if (sloganEl) sloganEl.textContent = 'LA GRAN CONQUISTA';
    }
}

function setSlotSula(idSlot, valor) {
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

function resetSlotsQuartasSula() {
    for (let i = 1; i <= 4; i++) {
        setSlotSula(`quartas-${i}-t1`, 'N/D');
        setSlotSula(`quartas-${i}-t2`, 'N/D');
    }
}

function resetSlotsSemisSula() {
    for (let i = 1; i <= 2; i++) {
        setSlotSula(`semi-${i}-t1`, 'N/D');
        setSlotSula(`semi-${i}-t2`, 'N/D');
    }
}

function resetSlotsFinalSula() {
    setSlotSula('finalista-lado-a', 'N/D');
    setSlotSula('finalista-lado-b', 'N/D');
}

// 3. BOTÃO DE LIMPEZA DIRETA DA SIMULAÇÃO SULA
document.addEventListener('DOMContentLoaded', () => {
    carregarChaveamentoSimuladoSulamericana();

    const btnLimpar = document.getElementById('btn-limpar-sim-chave-sula');
    if (btnLimpar) {
        btnLimpar.addEventListener('click', () => {
            if (confirm('Deseja limpar todos os resultados simulados da Sul-Americana?')) {
                localStorage.removeItem('simulacao_sulamericana');
                localStorage.removeItem('simulacao_sulamericana_motor_v5');
                carregarChaveamentoSimuladoSulamericana();
            }
        });
    }
});