// ==========================================================================
// assets/js/chaveamento-sulamericana.js - PREENCHIMENTO DO BRACKET SULA
// ==========================================================================

function carregarChaveamentoSulamericana() {
    const resultadoSalvo = localStorage.getItem('resultado_sorteio_sulamericana');

    if (!resultadoSalvo) {
        console.warn('Nenhum sorteio finalizado da Sul-Americana encontrado.');
        return;
    }

    const confrontos = JSON.parse(resultadoSalvo);

    confrontos.forEach(confronto => {
        const letraChave = confronto.chave;
        const cardChave = document.getElementById(`chave-oitavas-${letraChave}`);
        const slotTime1 = document.getElementById(`oitavas-${letraChave}-t1`);
        const slotTime2 = document.getElementById(`oitavas-${letraChave}-t2`);

        if (slotTime1 && slotTime2) {
            slotTime1.textContent = confronto.pote2;
            slotTime1.classList.remove('vazio');

            slotTime2.textContent = confronto.pote1;
            slotTime2.classList.remove('vazio');

            if (cardChave) {
                cardChave.classList.add('preenchido');
            }
        }
    });
}

carregarChaveamentoSulamericana();