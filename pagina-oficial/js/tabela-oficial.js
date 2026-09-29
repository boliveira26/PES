// ==========================================================================
// tabela-oficial/js/tabela-oficial.js - PREENCHE IDA NA ESQ E VOLTA NA DIR
// ==========================================================================

function preencherTabelaOficial() {
    const ehLibertadores = document.body.classList.contains('tema-libertadores');
    
    const chaveSorteio = ehLibertadores ? 'resultado_sorteio_libertadores' : 'resultado_sorteio_sulamericana';
    const chaveSimulacao = ehLibertadores ? 'simulacao_libertadores' : 'simulacao_sulamericana';

    // 1. CARREGA AS OITAVAS DE FINAL
    const sorteioSalvo = localStorage.getItem(chaveSorteio);
    if (sorteioSalvo) {
        const confrontos = JSON.parse(sorteioSalvo);

        confrontos.forEach(confronto => {
            const letra = confronto.chave;
            const timeP2 = confronto.pote2; // Mandante no jogo de Ida
            const timeP1 = confronto.pote1; // Mandante no jogo de Volta

            // JOGO DE IDA (ESQUERDA)
            const cardIda = document.getElementById(`oitavas-${letra}-ida`);
            if (cardIda) {
                cardIda.querySelector('.time.mandante').textContent = timeP2;
                cardIda.querySelector('.time.visitante').textContent = timeP1;
            }

            // JOGO DE VOLTA (DIREITA)
            const cardVolta = document.getElementById(`oitavas-${letra}-volta`);
            if (cardVolta) {
                cardVolta.querySelector('.time.mandante').textContent = timeP1;
                cardVolta.querySelector('.time.visitante').textContent = timeP2;
            }
        });
    }

    // 2. CARREGA QUARTAS, SEMIS E FINAL
    const simulacaoSalva = localStorage.getItem(chaveSimulacao);
    if (simulacaoSalva) {
        const dadosSim = JSON.parse(simulacaoSalva);

        // Preenche Quartas
        if (dadosSim.quartas) {
            preencherDuelo('quartas-1-ida', dadosSim.quartas.q1_t1, dadosSim.quartas.q1_t2);
            preencherDuelo('quartas-1-volta', dadosSim.quartas.q1_t2, dadosSim.quartas.q1_t1);
            preencherDuelo('quartas-2-ida', dadosSim.quartas.q2_t1, dadosSim.quartas.q2_t2);
            preencherDuelo('quartas-2-volta', dadosSim.quartas.q2_t2, dadosSim.quartas.q2_t1);
            preencherDuelo('quartas-3-ida', dadosSim.quartas.q3_t1, dadosSim.quartas.q3_t2);
            preencherDuelo('quartas-3-volta', dadosSim.quartas.q3_t2, dadosSim.quartas.q3_t1);
            preencherDuelo('quartas-4-ida', dadosSim.quartas.q4_t1, dadosSim.quartas.q4_t2);
            preencherDuelo('quartas-4-volta', dadosSim.quartas.q4_t2, dadosSim.quartas.q4_t1);
        }

        // Preenche Semis
        if (dadosSim.semis) {
            preencherDuelo('semi-1-ida', dadosSim.semis.s1_t1, dadosSim.semis.s1_t2);
            preencherDuelo('semi-1-volta', dadosSim.semis.s1_t2, dadosSim.semis.s1_t1);
            preencherDuelo('semi-2-ida', dadosSim.semis.s2_t1, dadosSim.semis.s2_t2);
            preencherDuelo('semi-2-volta', dadosSim.semis.s2_t2, dadosSim.semis.s2_t1);
        }

        // Preenche a Final
        if (dadosSim.final && dadosSim.final.f1 && dadosSim.final.f2) {
            preencherDuelo('final-jogo', dadosSim.final.f1, dadosSim.final.f2);
        }
    }
}

function preencherDuelo(cardId, mandante, visitante) {
    const card = document.getElementById(cardId);
    if (card && mandante && visitante) {
        card.querySelector('.time.mandante').textContent = mandante;
        card.querySelector('.time.visitante').textContent = visitante;
    }
}

preencherTabelaOficial();