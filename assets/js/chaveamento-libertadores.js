// ==========================================================================
// assets/js/chaveamento-libertadores.js - ATUALIZA OITAVAS, QUARTAS, SEMIS E FINAL
// ==========================================================================

function carregarChaveamentoCompleto() {
    // 1. Carrega as Oitavas de Final sorteadas
    const resultadoSorteio = localStorage.getItem('resultado_sorteio_libertadores');
    if (resultadoSorteio) {
        const confrontos = JSON.parse(resultadoSorteio);
        confrontos.forEach(confronto => {
            const letra = confronto.chave;
            const card = document.getElementById(`chave-oitavas-${letra}`);
            const t1 = document.getElementById(`oitavas-${letra}-t1`);
            const t2 = document.getElementById(`oitavas-${letra}-t2`);

            if (t1 && t2) {
                t1.textContent = confronto.pote2;
                t2.textContent = confronto.pote1;
                t1.classList.remove('vazio');
                t2.classList.remove('vazio');
                if (card) card.classList.add('preenchido');
            }
        });
    }

    // 2. Carrega as fases simuladas (Quartas, Semis, Final, Campeão)
    const simulacaoSalva = localStorage.getItem('simulacao_libertadores');
    if (simulacaoSalva) {
        const dadosSim = JSON.parse(simulacaoSalva);

        // Preenche Quartas
        if (dadosSim.quartas) {
            preencherSlot('quartas-1-t1', 'chave-quartas-1', dadosSim.quartas.q1_t1);
            preencherSlot('quartas-1-t2', 'chave-quartas-1', dadosSim.quartas.q1_t2);
            preencherSlot('quartas-2-t1', 'chave-quartas-2', dadosSim.quartas.q2_t1);
            preencherSlot('quartas-2-t2', 'chave-quartas-2', dadosSim.quartas.q2_t2);
            preencherSlot('quartas-3-t1', 'chave-quartas-3', dadosSim.quartas.q3_t1);
            preencherSlot('quartas-3-t2', 'chave-quartas-3', dadosSim.quartas.q3_t2);
            preencherSlot('quartas-4-t1', 'chave-quartas-4', dadosSim.quartas.q4_t1);
            preencherSlot('quartas-4-t2', 'chave-quartas-4', dadosSim.quartas.q4_t2);
        }

        // Preenche Semifinais
        if (dadosSim.semis) {
            preencherSlot('semi-1-t1', 'chave-semi-1', dadosSim.semis.s1_t1);
            preencherSlot('semi-1-t2', 'chave-semi-1', dadosSim.semis.s1_t2);
            preencherSlot('semi-2-t1', 'chave-semi-2', dadosSim.semis.s2_t1);
            preencherSlot('semi-2-t2', 'chave-semi-2', dadosSim.semis.s2_t2);
        }

        // Preenche Finalistas
        if (dadosSim.final) {
            const f1 = document.getElementById('finalista-lado-a');
            const f2 = document.getElementById('finalista-lado-b');
            if (f1 && dadosSim.final.f1) f1.textContent = dadosSim.final.f1;
            if (f2 && dadosSim.final.f2) f2.textContent = dadosSim.final.f2;
        }

        // Exibe o Campeão se já houver
        if (dadosSim.campeao) {
            const slogan = document.getElementById('slogan-final');
            if (slogan) {
                slogan.innerHTML = `🏆 CAMPEÃO: ${dadosSim.campeao} 🏆`;
                slogan.style.color = '#fff2be';
            }
        }
    }
}

function preencherSlot(slotId, cardId, nomeTime) {
    if (!nomeTime) return;
    const slot = document.getElementById(slotId);
    const card = document.getElementById(cardId);
    if (slot) {
        slot.textContent = nomeTime;
        slot.classList.remove('vazio');
        if (card) card.classList.add('preenchido');
    }
}

carregarChaveamentoCompleto();