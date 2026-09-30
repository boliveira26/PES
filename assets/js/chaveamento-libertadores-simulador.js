// ==========================================================================
// assets/js/chaveamento-libertadores-simulador.js - MOTOR CHAVE SIMULADA
// ==========================================================================

const CHAVE_SORTEIO = 'resultado_sorteio_libertadores';
const CHAVE_SIMULACAO = 'simulacao_libertadores';

function carregarChaveamentoSimuladoLibertadores() {
    // 1. CARREGA AS OITAVAS DE FINAL DO SORTEIO ATUAL
    const sorteioSalvo = localStorage.getItem(CHAVE_SORTEIO);

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

    // 2. CARREGA PROJEÇÕES DO SIMULADOR (QUARTAS, SEMIS, FINAL E CAMPEÃO)
    const simulacaoSalva = localStorage.getItem(CHAVE_SIMULACAO);

    if (simulacaoSalva) {
        const dados = JSON.parse(simulacaoSalva);

        // QUARTAS
        if (dados.quartas) {
            setSlot('quartas-1-t1', dados.quartas.q1_t1);
            setSlot('quartas-1-t2', dados.quartas.q1_t2);
            setSlot('quartas-2-t1', dados.quartas.q2_t1);
            setSlot('quartas-2-t2', dados.quartas.q2_t2);
            setSlot('quartas-3-t1', dados.quartas.q3_t1);
            setSlot('quartas-3-t2', dados.quartas.q3_t2);
            setSlot('quartas-4-t1', dados.quartas.q4_t1);
            setSlot('quartas-4-t2', dados.quartas.q4_t2);
        } else {
            resetSlotsQuartas();
        }

        // SEMIFINAIS
        if (dados.semis) {
            setSlot('semi-1-t1', dados.semis.s1_t1);
            setSlot('semi-1-t2', dados.semis.s1_t2);
            setSlot('semi-2-t1', dados.semis.s2_t1);
            setSlot('semi-2-t2', dados.semis.s2_t2);
        } else {
            resetSlotsSemis();
        }

        // FINAL
        if (dados.final) {
            setSlot('finalista-lado-a', dados.final.f1);
            setSlot('finalista-lado-b', dados.final.f2);
        } else {
            resetSlotsFinal();
        }

        // CAMPEÃO PROJETADO
        const sloganEl = document.getElementById('slogan-final');
        if (sloganEl) {
            if (dados.campeao) {
                sloganEl.innerHTML = `CAMPEÃO SIMULADO: <span style="color: #ffffff; text-shadow: 0 0 20px rgba(212, 175, 55, 0.9);">${dados.campeao}</span>`;
            } else {
                sloganEl.textContent = 'A GLÓRIA ETERNA';
            }
        }
    } else {
        resetSlotsQuartas();
        resetSlotsSemis();
        resetSlotsFinal();
        const sloganEl = document.getElementById('slogan-final');
        if (sloganEl) sloganEl.textContent = 'A GLÓRIA ETERNA';
    }
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

// 3. BOTÃO DE LIMPEZA DIRETA DA SIMULAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    carregarChaveamentoSimuladoLibertadores();

    const btnLimpar = document.getElementById('btn-limpar-sim-chave');
    if (btnLimpar) {
        btnLimpar.addEventListener('click', () => {
            if (confirm('Deseja limpar todos os resultados simulados?')) {
                localStorage.removeItem('simulacao_libertadores');
                localStorage.removeItem('simulacao_libertadores_motor_v5');
                carregarChaveamentoSimuladoLibertadores();
            }
        });
    }
});