// ==========================================================================
// assets/js/chaveamento-libertadores.js - PREENCHIMENTO DO CHAVEAMENTO
// ==========================================================================

const todasChaves = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

function carregarChaveamento() {
    const resultadoSalvo = localStorage.getItem('resultado_sorteio_libertadores');

    if (!resultadoSalvo) {
        console.warn('Nenhum sorteio finalizado encontrado no localStorage.');
        return;
    }

    const confrontos = JSON.parse(resultadoSalvo);

    // Percorre os 8 confrontos e preenche as Oitavas de Final
    confrontos.forEach(confronto => {
        const letraChave = confronto.chave;
        const cardChave = document.getElementById(`chave-oitavas-${letraChave}`);
        const slotTime1 = document.getElementById(`oitavas-${letraChave}-t1`);
        const slotTime2 = document.getElementById(`oitavas-${letraChave}-t2`);

        if (slotTime1 && slotTime2) {
            // Pote 2 (1º jogo em casa)
            slotTime1.textContent = confronto.pote2;
            slotTime1.classList.remove('vazio');

            // Pote 1 (Decide em casa)
            slotTime2.textContent = confronto.pote1;
            slotTime2.classList.remove('vazio');

            // Destaca o card preenchido
            if (cardChave) {
                cardChave.classList.add('preenchido');
            }
        }
    });
}

// Executa assim que a página abrir
carregarChaveamento();