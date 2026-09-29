// ==========================================================================
// assets/js/libertadores.js - SORTEIO OFICIAL CONMEBOL LIBERTADORES
// ==========================================================================

const chaves = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const timesPadraoLibertadores = {
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

let estado = {
    pote1Original: [],
    pote2Original: [],
    pote1Restantes: [],
    pote2Restantes: [],
    confrontoIndex: 0,
    etapa: 'POTE2',
    timePote2Atual: null,
    confrontosFinalizados: [],
    sorteando: false
};

// ELEMENTOS DO DOM COM SELEÇÃO SEGURA
const listaPote1 = document.getElementById('lista-pote-1');
const listaPote2 = document.getElementById('lista-pote-2');

const bolilleroPote2 = document.getElementById('bolillero-pote2');
const bolilleroPote1 = document.getElementById('bolillero-pote1');
const papelSorteio = document.getElementById('papel-sorteio');
const textoTimePapel = document.getElementById('texto-time-papel');
const etapaSorteioTexto = document.getElementById('etapa-sorteio-texto');
const btnSortear = document.getElementById('btn-sortear');
const btnSortearTudo = document.getElementById('btn-sortear-tudo');
const btnIrChaveamento = document.getElementById('btn-ir-chaveamento');
const btnReiniciarSorteio = document.getElementById('btn-reiniciar-sorteio');

// 1. INICIALIZAÇÃO DO PALCO
function inicializarPalco() {
    const dadosSalvos = localStorage.getItem('dados_sorteio_libertadores');
    const dados = dadosSalvos ? JSON.parse(dadosSalvos) : timesPadraoLibertadores;

    estado.pote1Original = [...dados.pote1];
    estado.pote2Original = [...dados.pote2];
    estado.pote1Restantes = [...dados.pote1];
    estado.pote2Restantes = [...dados.pote2];
    estado.confrontoIndex = 0;
    estado.etapa = 'POTE2';
    estado.timePote2Atual = null;
    estado.confrontosFinalizados = [];
    estado.sorteando = false;

    renderizarListasPotes();
    atualizarConfrontoAtivo();
}

// 2. RENDERIZA OS POTES LATERAIS
function renderizarListasPotes() {
    if (listaPote1) {
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
    }

    if (listaPote2) {
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
    }
}

// 3. ATUALIZA DESTAQUES DOS CONFRONTOS E BOTÕES
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

        if (estado.etapa === 'POTE2') {
            if (btnSortear) btnSortear.textContent = 'Sortear Pote 2';
            if (etapaSorteioTexto) etapaSorteioTexto.textContent = `Sorteando Mandante da Chave ${chaveAtual}`;
            if (bolilleroPote2) bolilleroPote2.classList.add('ativo');
            if (bolilleroPote1) bolilleroPote1.classList.remove('ativo');
        } else {
            if (btnSortear) btnSortear.textContent = 'Sortear Pote 1';
            if (etapaSorteioTexto) etapaSorteioTexto.textContent = `Adversário do ${estado.timePote2Atual} (Decide em Casa)`;
            if (bolilleroPote1) bolilleroPote1.classList.add('ativo');
            if (bolilleroPote2) bolilleroPote2.classList.remove('ativo');
        }
    }
}

// 4. EFEITO DE ROLETA / SUSPENSE NA TIRA DE PAPEL
function animarRoletaSuspense(poteAlvo, callbackFinal) {
    let duracao = 1800;
    let intervaloTempo = 75;
    let tempoDecorrido = 0;

    const intervalId = setInterval(() => {
        const timeAleatorio = poteAlvo[Math.floor(Math.random() * poteAlvo.length)];
        if (textoTimePapel) textoTimePapel.textContent = timeAleatorio;
        tempoDecorrido += intervaloTempo;

        if (tempoDecorrido >= duracao) {
            clearInterval(intervalId);
            callbackFinal();
        }
    }, intervaloTempo);
}

// 5. SORTEIO MANUAL COM ANIMAÇÃO
if (btnSortear) {
    btnSortear.addEventListener('click', () => {
        if (estado.sorteando || estado.confrontoIndex >= 8) return;

        estado.sorteando = true;
        btnSortear.disabled = true;
        if (btnSortearTudo) btnSortearTudo.disabled = true;

        if (papelSorteio) {
            papelSorteio.classList.remove('abrindo');
            void papelSorteio.offsetWidth;
            papelSorteio.classList.add('abrindo');
        }

        const poteAtual = estado.etapa === 'POTE2' ? estado.pote2Restantes : estado.pote1Restantes;

        animarRoletaSuspense(poteAtual, () => {
            executarSorteioAlgoritmo();
            estado.sorteando = false;
            if (btnSortear && estado.confrontoIndex < 8) btnSortear.disabled = false;
            if (btnSortearTudo && estado.confrontoIndex < 8) btnSortearTudo.disabled = false;
        });
    });
}

// 6. SORTEAR TUDO AUTOMÁTICO
if (btnSortearTudo) {
    btnSortearTudo.addEventListener('click', () => {
        if (estado.sorteando) return;

        btnSortearTudo.disabled = true;
        if (btnSortear) btnSortear.disabled = true;

        const p2Restantes = [...estado.pote2Restantes].sort(() => Math.random() - 0.5);
        const p1Restantes = [...estado.pote1Restantes].sort(() => Math.random() - 0.5);

        if (estado.timePote2Atual && p1Restantes.length > 0) {
            const timeP1 = p1Restantes.pop();
            const chave = chaves[estado.confrontoIndex];
            preencherConfrontoNaTela(chave, estado.timePote2Atual, timeP1);
            estado.confrontosFinalizados.push({ chave, pote2: estado.timePote2Atual, pote1: timeP1 });
            estado.confrontoIndex++;
            estado.timePote2Atual = null;
        }

        while (estado.confrontoIndex < 8 && p2Restantes.length > 0 && p1Restantes.length > 0) {
            const timeP2 = p2Restantes.pop();
            const timeP1 = p1Restantes.pop();
            const chave = chaves[estado.confrontoIndex];

            preencherConfrontoNaTela(chave, timeP2, timeP1);
            estado.confrontosFinalizados.push({ chave, pote2: timeP2, pote1: timeP1 });
            estado.confrontoIndex++;
        }

        estado.pote2Restantes = [];
        estado.pote1Restantes = [];
        renderizarListasPotes();
        finalizarSorteioGeral();
    });
}

function preencherConfrontoNaTela(chave, timeP2, timeP1) {
    const card = document.getElementById(`confronto-${chave}`);
    if (card) {
        const spanT2 = card.querySelector('.time-pote2');
        const spanT1 = card.querySelector('.time-pote1');
        if (spanT2) { 
            spanT2.textContent = timeP2; 
            spanT2.classList.add('preenchido'); 
        }
        if (spanT1) { 
            spanT1.textContent = timeP1; 
            spanT1.classList.add('preenchido'); 
        }
        card.classList.remove('ativo');
        card.classList.add('preenchido');
    }
}

// 7. LÓGICA DO SORTEIO PASSO A PASSO
function executarSorteioAlgoritmo() {
    const chaveAtual = chaves[estado.confrontoIndex];
    const cardConfronto = document.getElementById(`confronto-${chaveAtual}`);

    if (estado.etapa === 'POTE2') {
        const randomIndex = Math.floor(Math.random() * estado.pote2Restantes.length);
        const timeSorteado = estado.pote2Restantes.splice(randomIndex, 1)[0];

        estado.timePote2Atual = timeSorteado;
        if (textoTimePapel) textoTimePapel.textContent = timeSorteado;

        if (cardConfronto) {
            const spanTimePote2 = cardConfronto.querySelector('.time-pote2');
            if (spanTimePote2) {
                spanTimePote2.textContent = timeSorteado;
                spanTimePote2.classList.add('preenchido');
            }
        }

        destacarTimeSorteado(listaPote2, timeSorteado);

        estado.etapa = 'POTE1';
        atualizarConfrontoAtivo();

    } else if (estado.etapa === 'POTE1') {
        const randomIndex = Math.floor(Math.random() * estado.pote1Restantes.length);
        const timeSorteado = estado.pote1Restantes.splice(randomIndex, 1)[0];

        if (textoTimePapel) textoTimePapel.textContent = timeSorteado;

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

function destacarTimeSorteado(containerUl, nomeTime) {
    if (!containerUl) return;
    const item = Array.from(containerUl.children).find(li => li.dataset.time === nomeTime);
    if (item) {
        item.classList.add('recem-sorteado');
        setTimeout(() => {
            item.classList.remove('recem-sorteado');
            item.classList.add('sorteado');
        }, 1200);
    }
}

// 8. FINALIZAÇÃO DO SORTEIO
function finalizarSorteioGeral() {
    if (etapaSorteioTexto) etapaSorteioTexto.textContent = 'Oitavas de Final Definidas';
    if (textoTimePapel) textoTimePapel.textContent = 'CAMINHO DEFINIDO 🏆';

    localStorage.setItem('resultado_sorteio_libertadores', JSON.stringify(estado.confrontosFinalizados));

    if (btnSortear) btnSortear.classList.add('oculto');
    if (btnSortearTudo) btnSortearTudo.classList.add('oculto');
    if (btnIrChaveamento) btnIrChaveamento.classList.remove('oculto');
    if (bolilleroPote1) bolilleroPote1.classList.remove('ativo');
    if (bolilleroPote2) bolilleroPote2.classList.remove('ativo');
}

// 9. REINICIAR SORTEIO
if (btnReiniciarSorteio) {
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

            if (btnSortear) {
                btnSortear.classList.remove('oculto');
                btnSortear.disabled = false;
            }
            if (btnSortearTudo) {
                btnSortearTudo.classList.remove('oculto');
                btnSortearTudo.disabled = false;
            }
            if (btnIrChaveamento) btnIrChaveamento.classList.add('oculto');
            if (textoTimePapel) textoTimePapel.textContent = '---';

            estado.pote1Restantes = [...estado.pote1Original];
            estado.pote2Restantes = [...estado.pote2Original];
            estado.confrontoIndex = 0;
            estado.etapa = 'POTE2';
            estado.timePote2Atual = null;
            estado.confrontosFinalizados = [];
            estado.sorteando = false;

            renderizarListasPotes();
            atualizarConfrontoAtivo();
        }
    });
}

// Inicialização automática
inicializarPalco();