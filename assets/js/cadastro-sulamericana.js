// ==========================================================================
// assets/js/cadastro-sulamericana.js - CADASTRO DOS POTES (SUL-AMERICANA)
// ==========================================================================

const timesExemploSulAmericana = {
    pote1: [
        'LDU Quito',
        'Indep. del Valle',
        'Libertad',
        'Rosario Central',
        'Barcelona SC',
        'Estudiantes L.P.',
        'Cerro Porteño',
        'Alianza Lima'
    ],
    pote2: [
        'Corinthians',
        'Cruzeiro',
        'Internacional',
        'Fortaleza',
        'Athletico-PR',
        'Boca Juniors',
        'Racing Club',
        'América de Cali'
    ]
};

const formPotes = document.getElementById('form-potes');
const btnPreencherTeste = document.getElementById('btn-preencher-teste');
const inputsPote1 = document.querySelectorAll('#inputs-pote-1 input');
const inputsPote2 = document.querySelectorAll('#inputs-pote-2 input');

// Preenchimento de teste
btnPreencherTeste.addEventListener('click', () => {
    inputsPote1.forEach((input, index) => {
        input.value = timesExemploSulAmericana.pote1[index] || '';
    });

    inputsPote2.forEach((input, index) => {
        input.value = timesExemploSulAmericana.pote2[index] || '';
    });
});

// Envio e salvamento
formPotes.addEventListener('submit', (event) => {
    event.preventDefault();

    const pote1 = [];
    const pote2 = [];

    inputsPote1.forEach(input => {
        const nome = input.value.trim();
        if (nome) pote1.push(nome);
    });

    inputsPote2.forEach(input => {
        const nome = input.value.trim();
        if (nome) pote2.push(nome);
    });

    if (pote1.length !== 8 || pote2.length !== 8) {
        alert('Por favor, preencha os 8 times do Pote 1 e os 8 times do Pote 2!');
        return;
    }

    const dadosSorteio = {
        torneio: 'CONMEBOL Sul-Americana',
        dataCadastro: new Date().toISOString(),
        pote1: pote1,
        pote2: pote2
    };

    localStorage.setItem('dados_sorteio_sulamericana', JSON.stringify(dadosSorteio));
    window.location.href = 'sul-americana.html';
});