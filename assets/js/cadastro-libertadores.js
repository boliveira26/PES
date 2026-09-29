// ==========================================================================
// assets/js/cadastro-libertadores.js - CONTROLE DO CADASTRO DOS POTES
// ==========================================================================

// 1. TIMES DE EXEMPLO PARA TESTES RÁPIDOS
const timesExemploLibertadores = {
    pote1: [
        'Palmeiras',
        'Flamengo',
        'River Plate',
        'Fluminense',
        'São Paulo',
        'Atlético-MG',
        'Grêmio',
        'Bolívar'
    ],
    pote2: [
        'Botafogo',
        'Nacional',
        'San Lorenzo',
        'Peñarol',
        'Talleres',
        'Colo-Colo',
        'Junior Barranquilla',
        'The Strongest'
    ]
};

// 2. SELEÇÃO DOS ELEMENTOS DO DOM
const formPotes = document.getElementById('form-potes');
const btnPreencherTeste = document.getElementById('btn-preencher-teste');
const inputsPote1 = document.querySelectorAll('#inputs-pote-1 input');
const inputsPote2 = document.querySelectorAll('#inputs-pote-2 input');

// 3. BOTÃO DE PREENCHIMENTO RÁPIDO COM 1 CLIQUE
btnPreencherTeste.addEventListener('click', () => {
    inputsPote1.forEach((input, index) => {
        input.value = timesExemploLibertadores.pote1[index] || '';
    });

    inputsPote2.forEach((input, index) => {
        input.value = timesExemploLibertadores.pote2[index] || '';
    });
});

// 4. ENVIO DO FORMULÁRIO E SALVAMENTO NO LOCALSTORAGE
formPotes.addEventListener('submit', (event) => {
    event.preventDefault(); // Impede o recarregamento padrão da página

    const pote1 = [];
    const pote2 = [];

    // Coleta os valores do Pote 1
    inputsPote1.forEach(input => {
        const nome = input.value.trim();
        if (nome) pote1.push(nome);
    });

    // Coleta os valores do Pote 2
    inputsPote2.forEach(input => {
        const nome = input.value.trim();
        if (nome) pote2.push(nome);
    });

    // Validação de segurança: precisa ter exatamente 8 times em cada pote
    if (pote1.length !== 8 || pote2.length !== 8) {
        alert('Por favor, preencha os 8 times do Pote 1 e os 8 times do Pote 2!');
        return;
    }

    // Salva a estrutura no localStorage para a página do sorteio ler
    const dadosSorteio = {
        torneio: 'CONMEBOL Libertadores',
        dataCadastro: new Date().toISOString(),
        pote1: pote1,
        pote2: pote2
    };

    localStorage.setItem('dados_sorteio_libertadores', JSON.stringify(dadosSorteio));

    // Redireciona para a tela do sorteio oficial
    window.location.href = 'libertadores.html';
});