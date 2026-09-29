// ==========================================================================
// assets/js/libertadores.js - SORTEIO COM DELAY DE 2 SEGUNDOS NO PAPEL
// ==========================================================================

const chaves = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

let estado = {
    pote1Original: [],
    pote2Original: [],
    pote1Restantes: [],
    pote2Restantes: [],
    confrontoIndex: 0,
    etapa: 'POTE2', // 'POTE2' ou 'POTE1'
    timePote2Atual: null,
    confrontosFinalizados: []
};

// ELEMENTOS DO DOM
const listaPote1 = document.getElementById('lista-pote-1');
const listaPote2 = document.getElementById('lista-pote-2');
const badgePote1 = document.getElementById('badge-pote1');
const badgePote2 = document.getElementById('badge-pote2');
const statusConfrontos = document.getElementById('status-confrontos');

const bolilleroPote2 = document.getElementById('bolillero-pote2');
const bolilleroPote1 = document.getElementById('bolillero-pote1');
const papelSorteio = document.getElementById('papel-sorteio');
const textoTimePapel = document.getElementById('texto-time-papel');
const etapaSorteioTexto = document.getElementById('etapa-sorteio-texto');
const btnSortear = document.getElementById('btn-sortear');
const btnIrChaveamento = document.getElementById('btn-ir-chaveamento');
const btnReiniciarSorteio = document.getElementById('btn-reiniciar-sorteio');

// 1. INICIALIZAÇÃO
function inicializarPalco() {
    const dadosSalvos = localStorage.getItem('dados_sorteio_libertadores');

    if (!dadosSalvos) {
        alert('Nenhum time cadastrado! Redirecionando para a tela de cadastro...');
        window.location.href = 'cadastro-libertadores.html';
        return;
    }

    const dados = JSON.parse(dadosSalvos);

    estado.pote1Original = [...dados.pote1];
    estado.pote2Original = [...dados.pote2];
    estado.pote1Restantes = [...dados.pote1];
    estado.pote2Restantes = [...dados.pote2];
    estado.confrontoIndex = 0;
    estado.etapa = 'POTE2';
    estado.timePote2Atual = null;
    estado.confrontosFinalizados = [];

    renderizarListasPotes();
    atualizarConfrontoAtivo();
}

// 2. RENDERIZA OS POTES NA ESQUERDA
function renderizarListasPotes() {
    listaPote1.innerHTML = '';
    estado.pote1Original.forEach(time => {
        const li = document.createElement('li');
        li.textContent = time;
        li.className = 'item-time-pote';
        li.dataset.time = time;
        if (!estado.pote1Restantes.includes(time)) {
            li.classList.add('sorteado');
        }
        listaPote1.appendChild(li);
    });

    listaPote2.innerHTML = '';
    estado.pote2Original.forEach(time => {
        const li = document.createElement('li');
        li.textContent = time;
        li.className = 'item-time-pote';
        li.dataset.time = time;
        if (!estado.pote2Restantes.includes(time)) {
            li.classList.add('sorteado');
        }
        listaPote2.appendChild(li);
    });

    badgePote1.textContent = `${estado.pote1Restantes.length} restantes`;
    badgePote2.textContent = `${estado.pote2Restantes.length} restantes`;
}

// 3. ATUALIZA DESTAQUES E BOTÕES
function atualizarConfrontoAtivo() {
    chaves.forEach((chave, index) => {
        const card = document.getElementById(`confronto-${chave}`);
        if (card) {
            if (index === estado.confrontoIndex && estado.confrontoIndex < 8) {
                card.classList.add('ativo');
            } else {
                card.classList.remove('ativo');
            }
        }
    });

    if (estado.confrontoIndex < 8) {
        const chaveAtual = chaves[estado.confrontoIndex];
        statusConfrontos.textContent = `Definindo Confronto ${chaveAtual}...`;

        if (estado.etapa === 'POTE2') {
            btnSortear.textContent = `Sortear Pote 2 (Chave ${chaveAtual})`;
            etapaSorteioTexto.textContent = `Sorteando Mandante do Confronto ${chaveAtual}`;
            bolilleroPote2.classList.add('ativo');
            bolilleroPote1.classList.remove('ativo');
        } else {
            btnSortear.textContent = `Sortear Pote 1 (Chave ${chaveAtual})`;
            etapaSorteioTexto.textContent = `Adversário do ${estado.timePote2Atual} (Decide em Casa)`;
            bolilleroPote1.classList.add('ativo');
            bolilleroPote2.classList.remove('ativo');
        }
    }
}

// 4. CLIQUE NO BOTÃO DE SORTEIO (SUSPENSE DE 2 SEGUNDOS)
btnSortear.addEventListener('click', () => {
    btnSortear.disabled = true;

    // Reseta o papel
    papelSorteio.classList.remove('abrindo');
    textoTimePapel.textContent = 'ABRINDO...';
    void papelSorteio.offsetWidth; // Força reflow no navegador

    // Inicia a animação de desenrolar o papel (2 segundos)
    papelSorteio.classList.add('abrindo');

    // Executa a revelação exatamente no final dos 2 segundos (2000ms)
    setTimeout(() => {
        executarSorteioAlgoritmo();
        btnSortear.disabled = false;
    }, 2000);
});

// 5. LÓGICA DO SORTEIO ALEATÓRIO
function executarSorteioAlgoritmo() {
    const chaveAtual = chaves[estado.confrontoIndex];
    const cardConfronto = document.getElementById(`confronto-${chaveAtual}`);

    if (estado.etapa === 'POTE2') {
        const randomIndex = Math.floor(Math.random() * estado.pote2Restantes.length);
        const timeSorteado = estado.pote2Restantes.splice(randomIndex, 1)[0];

        estado.timePote2Atual = timeSorteado;
        textoTimePapel.textContent = timeSorteado;

        if (cardConfronto) {
            const spanTimePote2 = cardConfronto.querySelector('.time-pote2');
            if (spanTimePote2) {
                spanTimePote2.textContent = timeSorteado;
                spanTimePote2.classList.add('preenchido');
            }
        }

        destacarTimeSorteado(listaPote2, timeSorteado);
        badgePote2.textContent = `${estado.pote2Restantes.length} restantes`;

        estado.etapa = 'POTE1';
        atualizarConfrontoAtivo();

    } else if (estado.etapa === 'POTE1') {
        const randomIndex = Math.floor(Math.random() * estado.pote1Restantes.length);
        const timeSorteado = estado.pote1Restantes.splice(randomIndex, 1)[0];

        textoTimePapel.textContent = timeSorteado;

        if (cardConfronto) {
            const spanTimePote1 = cardConfronto.querySelector('.time-pote1');
            if (spanTimePote1) {
                spanTimePote1.textContent = timeSorteado;
                spanTimePote1.classList.add('preenchido');
            }
            cardConfronto.classList.remove('ativo');
            cardConfronto.classList.add('preenchido');
        }

        destacarTimeSorteado(listaPote1, timeSorteado);
        badgePote1.textContent = `${estado.pote1Restantes.length} restantes`;

        estado.confrontosFinalizados.push({
            chave: chaveAtual,
            pote2: estado.timePote2Atual,
            pote1: timeSorteado
        });

        estado.confrontoIndex++;
        estado.timePote2Atual = null;
        estado.etapa = 'POTE2';

        if (estado.confrontoIndex >= 8) {
            finalizarSorteioGeral();
        } else {
            atualizarConfrontoAtivo();
        }
    }
}

// 6. DESTAQUE NA LISTA DA ESQUERDA
function destacarTimeSorteado(containerUl, nomeTime) {
    const item = Array.from(containerUl.children).find(li => li.dataset.time === nomeTime);
    if (item) {
        item.classList.add('recem-sorteado');
        setTimeout(() => {
            item.classList.remove('recem-sorteado');
            item.classList.add('sorteado');
        }, 1500);
    }
}

// 7. FINALIZAÇÃO
function finalizarSorteioGeral() {
    statusConfrontos.textContent = 'Sorteio Oficial Concluído!';
    etapaSorteioTexto.textContent = 'Oitavas de Final Definidas';
    textoTimePapel.textContent = 'CAMINHO DEFINIDO 🏆';

    localStorage.setItem('resultado_sorteio_libertadores', JSON.stringify(estado.confrontosFinalizados));

    btnSortear.classList.add('oculto');
    btnIrChaveamento.classList.remove('oculto');
    bolilleroPote1.classList.remove('ativo');
    bolilleroPote2.classList.remove('ativo');
}

// 8. REINICIAR
btnReiniciarSorteio.addEventListener('click', () => {
    if (confirm('Deseja reiniciar este sorteio do início?')) {
        chaves.forEach(chave => {
            const card = document.getElementById(`confronto-${chave}`);
            if (card) {
                card.classList.remove('ativo', 'preenchido');
                const t2 = card.querySelector('.time-pote2');
                const t1 = card.querySelector('.time-pote1');
                if (t2) { t2.textContent = 'Aguardando...'; t2.classList.remove('preenchido'); }
                if (t1) { t1.textContent = 'Aguardando...'; t1.classList.remove('preenchido'); }
            }
        });

        btnSortear.classList.remove('oculto');
        btnIrChaveamento.classList.add('oculto');
        textoTimePapel.textContent = '---';

        estado.pote1Restantes = [...estado.pote1Original];
        estado.pote2Restantes = [...estado.pote2Original];
        estado.confrontoIndex = 0;
        estado.etapa = 'POTE2';
        estado.timePote2Atual = null;
        estado.confrontosFinalizados = [];

        renderizarListasPotes();
        atualizarConfrontoAtivo();
    }
});

// Inicialização automática
inicializarPalco();