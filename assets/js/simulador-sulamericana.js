// ==========================================================================
// assets/js/simulador-sulamericana.js - MOTOR DE SIMULAÇÃO DA SUL-AMERICANA
// ==========================================================================

let estadoSimulador = {
    faseAtual: 'oitavas',
    oitavas: [],
    quartas: [],
    semis: [],
    final: null,
    campeao: null
};

const tituloFaseAtiva = document.getElementById('titulo-fase-ativa');
const containerConfrontosFase = document.getElementById('container-confrontos-fase');
const formSimulador = document.getElementById('form-simulador');
const btnAvancarFase = document.getElementById('btn-avancar-fase');
const tabsFases = document.querySelectorAll('.tab-fase');
const btnResetSimulacao = document.getElementById('btn-reset-simulacao');

const modalCampeao = document.getElementById('modal-campeao');
const nomeTimeCampeao = document.getElementById('nome-time-campeao');

// 1. INICIALIZAÇÃO
function inicializarSimulador() {
    const sorteioSalvo = localStorage.getItem('resultado_sorteio_sulamericana');

    if (!sorteioSalvo) {
        alert('Você precisa realizar o Sorteio das Oitavas da Sul-Americana primeiro!');
        window.location.href = 'sul-americana.html';
        return;
    }

    const confrontosSorteados = JSON.parse(sorteioSalvo);

    const simulacaoSalva = localStorage.getItem('simulacao_sulamericana_motor');
    if (simulacaoSalva) {
        estadoSimulador = JSON.parse(simulacaoSalva);
    } else {
        estadoSimulador.oitavas = confrontosSorteados.map(item => ({
            chave: item.chave,
            timeIdaCasa: item.pote2,   // 4ºs da Liberta (1º jogo em casa)
            timeVoltaCasa: item.pote1, // 3ºs da Liberta (decidem em casa)
            golsIdaCasa: '',
            golsIdaFora: '',
            golsVoltaCasa: '',
            golsVoltaFora: '',
            penIdaCasa: '',
            penVoltaCasa: '',
            vencedor: null
        }));
    }

    configurarAbas();
    renderizarFaseAtual();
}

function configurarAbas() {
    tabsFases.forEach(tab => {
        tab.addEventListener('click', () => {
            const fase = tab.dataset.fase;
            
            if (fase === 'quartas' && estadoSimulador.quartas.length === 0) {
                alert('Conclua as Oitavas de Final primeiro!');
                return;
            }
            if (fase === 'semis' && estadoSimulador.semis.length === 0) {
                alert('Conclua as Quartas de Final primeiro!');
                return;
            }
            if (fase === 'final' && !estadoSimulador.final) {
                alert('Conclua as Semifinais primeiro!');
                return;
            }

            estadoSimulador.faseAtual = fase;
            tabsFases.forEach(t => t.classList.remove('ativa'));
            tab.classList.add('ativa');
            renderizarFaseAtual();
        });
    });
}

function atualizarAbaAtiva() {
    tabsFases.forEach(tab => {
        if (tab.dataset.fase === estadoSimulador.faseAtual) {
            tab.classList.add('ativa');
        } else {
            tab.classList.remove('ativa');
        }
    });
}

function renderizarFaseAtual() {
    atualizarAbaAtiva();
    containerConfrontosFase.innerHTML = '';

    if (estadoSimulador.faseAtual === 'oitavas') {
        tituloFaseAtiva.textContent = 'Oitavas de Final (Ida e Volta)';
        btnAvancarFase.textContent = 'Confirmar e Gerar Quartas de Final →';
        renderizarJogosIdaVolta(estadoSimulador.oitavas, 'Oitavas');
    } else if (estadoSimulador.faseAtual === 'quartas') {
        tituloFaseAtiva.textContent = 'Quartas de Final (Ida e Volta)';
        btnAvancarFase.textContent = 'Confirmar e Gerar Semifinais →';
        renderizarJogosIdaVolta(estadoSimulador.quartas, 'Quartas');
    } else if (estadoSimulador.faseAtual === 'semis') {
        tituloFaseAtiva.textContent = 'Semifinais (Ida e Volta)';
        btnAvancarFase.textContent = 'Confirmar e Ir para a Grande Final →';
        renderizarJogosIdaVolta(estadoSimulador.semis, 'Semi');
    } else if (estadoSimulador.faseAtual === 'final') {
        tituloFaseAtiva.textContent = 'Grande Final (Jogo Único - Gran Parque Central)';
        btnAvancarFase.textContent = 'Declarar Campeão da Sul-Americana 🥈';
        renderizarJogoFinal();
    }
}

function renderizarJogosIdaVolta(listaConfrontos, prefixo) {
    listaConfrontos.forEach((duelo, index) => {
        const card = document.createElement('div');
        card.className = 'card-duelo-simulador';

        const labelChave = duelo.chave ? `Chave ${duelo.chave}` : `${prefixo} ${index + 1}`;

        card.innerHTML = `
            <div class="cabecalho-duelo-card">
                <span class="badge-confronto-letra">${labelChave}</span>
                <span class="status-agregado" id="agr-txt-${index}">AGR: - x -</span>
            </div>

            <div class="linha-jogo-input">
                <span class="label-jogo">IDA:</span>
                <span class="time-nome-input mandante">${duelo.timeIdaCasa}</span>
                <input type="number" min="0" max="20" class="input-gol" id="ida-g1-${index}" value="${duelo.golsIdaCasa}" required>
                <span class="divisor-x">x</span>
                <input type="number" min="0" max="20" class="input-gol" id="ida-g2-${index}" value="${duelo.golsIdaFora}" required>
                <span class="time-nome-input visitante">${duelo.timeVoltaCasa}</span>
            </div>

            <div class="linha-jogo-input">
                <span class="label-jogo">VOLTA:</span>
                <span class="time-nome-input mandante">${duelo.timeVoltaCasa}</span>
                <input type="number" min="0" max="20" class="input-gol" id="volta-g2-${index}" value="${duelo.golsVoltaCasa}" required>
                <span class="divisor-x">x</span>
                <input type="number" min="0" max="20" class="input-gol" id="volta-g1-${index}" value="${duelo.golsVoltaFora}" required>
                <span class="time-nome-input visitante">${duelo.timeIdaCasa}</span>
            </div>

            <div class="linha-penaltis ${duelo.precisaPenaltis ? '' : 'oculto'}" id="pen-box-${index}">
                <span class="label-penalti">PÊNALTIS:</span>
                <span class="time-nome-input mandante">${duelo.timeIdaCasa}</span>
                <input type="number" min="0" max="20" class="input-penalti" id="pen-p1-${index}" value="${duelo.penIdaCasa}">
                <span class="divisor-x">x</span>
                <input type="number" min="0" max="20" class="input-penalti" id="pen-p2-${index}" value="${duelo.penVoltaCasa}">
                <span class="time-nome-input visitante">${duelo.timeVoltaCasa}</span>
            </div>
        `;

        containerConfrontosFase.appendChild(card);

        const inIda1 = card.querySelector(`#ida-g1-${index}`);
        const inIda2 = card.querySelector(`#ida-g2-${index}`);
        const inVolta2 = card.querySelector(`#volta-g2-${index}`);
        const inVolta1 = card.querySelector(`#volta-g1-${index}`);

        const atualizarAgregado = () => {
            const gIda1 = parseInt(inIda1.value) || 0;
            const gIda2 = parseInt(inIda2.value) || 0;
            const gVolta2 = parseInt(inVolta2.value) || 0;
            const gVolta1 = parseInt(inVolta1.value) || 0;

            const totalTime1 = gIda1 + gVolta1;
            const totalTime2 = gIda2 + gVolta2;

            const txtAgr = card.querySelector(`#agr-txt-${index}`);
            const penBox = card.querySelector(`#pen-box-${index}`);

            if (inIda1.value !== '' && inIda2.value !== '' && inVolta2.value !== '' && inVolta1.value !== '') {
                txtAgr.textContent = `AGR: ${totalTime1} x ${totalTime2}`;

                if (totalTime1 === totalTime2) {
                    penBox.classList.remove('oculto');
                } else {
                    penBox.classList.add('oculto');
                }
            }
        };

        inIda1.oninput = atualizarAgregado;
        inIda2.oninput = atualizarAgregado;
        inVolta2.oninput = atualizarAgregado;
        inVolta1.oninput = atualizarAgregado;
        atualizarAgregado();
    });
}

function renderizarJogoFinal() {
    const final = estadoSimulador.final;
    const card = document.createElement('div');
    card.className = 'card-duelo-simulador';

    card.innerHTML = `
        <div class="cabecalho-duelo-card">
            <span class="badge-confronto-letra">FINAL</span>
            <span class="status-agregado">ESTÁDIO GRAN PARQUE CENTRAL (MONTEVIDEO)</span>
        </div>

        <div class="linha-jogo-input" style="padding: 1.2rem 1rem;">
            <span class="time-nome-input mandante" style="font-size: 1.1rem;">${final.time1}</span>
            <input type="number" min="0" max="20" class="input-gol" id="final-g1" value="${final.g1}" required>
            <span class="divisor-x">x</span>
            <input type="number" min="0" max="20" class="input-gol" id="final-g2" value="${final.g2}" required>
            <span class="time-nome-input visitante" style="font-size: 1.1rem;">${final.time2}</span>
        </div>

        <div class="linha-penaltis ${final.g1 === final.g2 && final.g1 !== '' ? '' : 'oculto'}" id="final-pen-box">
            <span class="label-penalti">PÊNALTIS / PRORROGAÇÃO:</span>
            <span class="time-nome-input mandante">${final.time1}</span>
            <input type="number" min="0" max="20" class="input-penalti" id="final-pen-1" value="${final.pen1}">
            <span class="divisor-x">x</span>
            <input type="number" min="0" max="20" class="input-penalti" id="final-pen-2" value="${final.pen2}">
            <span class="time-nome-input visitante">${final.time2}</span>
        </div>
    `;

    containerConfrontosFase.appendChild(card);

    const fG1 = card.querySelector('#final-g1');
    const fG2 = card.querySelector('#final-g2');
    const penBox = card.querySelector('#final-pen-box');

    const checkFinalEmpate = () => {
        if (fG1.value !== '' && fG2.value !== '' && fG1.value === fG2.value) {
            penBox.classList.remove('oculto');
        } else {
            penBox.classList.add('oculto');
        }
    };

    fG1.oninput = checkFinalEmpate;
    fG2.oninput = checkFinalEmpate;
}

formSimulador.addEventListener('submit', (e) => {
    e.preventDefault();

    if (estadoSimulador.faseAtual === 'oitavas') {
        processarOitavas();
    } else if (estadoSimulador.faseAtual === 'quartas') {
        processarQuartas();
    } else if (estadoSimulador.faseAtual === 'semis') {
        processarSemis();
    } else if (estadoSimulador.faseAtual === 'final') {
        processarFinal();
    }
});

function processarOitavas() {
    const vencedores = {};

    for (let i = 0; i < estadoSimulador.oitavas.length; i++) {
        const duelo = estadoSimulador.oitavas[i];
        const gIda1 = parseInt(document.getElementById(`ida-g1-${i}`).value);
        const gIda2 = parseInt(document.getElementById(`ida-g2-${i}`).value);
        const gVolta2 = parseInt(document.getElementById(`volta-g2-${i}`).value);
        const gVolta1 = parseInt(document.getElementById(`volta-g1-${i}`).value);

        duelo.golsIdaCasa = gIda1;
        duelo.golsIdaFora = gIda2;
        duelo.golsVoltaCasa = gVolta2;
        duelo.golsVoltaFora = gVolta1;

        const total1 = gIda1 + gVolta1;
        const total2 = gIda2 + gVolta2;

        if (total1 > total2) {
            duelo.vencedor = duelo.timeIdaCasa;
        } else if (total2 > total1) {
            duelo.vencedor = duelo.timeVoltaCasa;
        } else {
            const p1 = parseInt(document.getElementById(`pen-p1-${i}`).value);
            const p2 = parseInt(document.getElementById(`pen-p2-${i}`).value);

            if (isNaN(p1) || isNaN(p2) || p1 === p2) {
                alert(`Preencha o vencedor dos pênaltis no confronto da Chave ${duelo.chave}!`);
                return;
            }

            duelo.penIdaCasa = p1;
            duelo.penVoltaCasa = p2;
            duelo.vencedor = p1 > p2 ? duelo.timeIdaCasa : duelo.timeVoltaCasa;
        }

        vencedores[duelo.chave] = duelo.vencedor;
    }

    estadoSimulador.quartas = [
        { chave: 'Q1', timeIdaCasa: vencedores['A'], timeVoltaCasa: vencedores['C'], golsIdaCasa: '', golsIdaFora: '', golsVoltaCasa: '', golsVoltaFora: '', penIdaCasa: '', penVoltaCasa: '', vencedor: null },
        { chave: 'Q2', timeIdaCasa: vencedores['E'], timeVoltaCasa: vencedores['G'], golsIdaCasa: '', golsIdaFora: '', golsVoltaCasa: '', golsVoltaFora: '', penIdaCasa: '', penVoltaCasa: '', vencedor: null },
        { chave: 'Q3', timeIdaCasa: vencedores['B'], timeVoltaCasa: vencedores['D'], golsIdaCasa: '', golsIdaFora: '', golsVoltaCasa: '', golsVoltaFora: '', penIdaCasa: '', penVoltaCasa: '', vencedor: null },
        { chave: 'Q4', timeIdaCasa: vencedores['F'], timeVoltaCasa: vencedores['H'], golsIdaCasa: '', golsIdaFora: '', golsVoltaCasa: '', golsVoltaFora: '', penIdaCasa: '', penVoltaCasa: '', vencedor: null }
    ];

    salvarEAtualizarChaveamento('quartas');
}

function processarQuartas() {
    const v = [];

    for (let i = 0; i < 4; i++) {
        const duelo = estadoSimulador.quartas[i];
        const gIda1 = parseInt(document.getElementById(`ida-g1-${i}`).value);
        const gIda2 = parseInt(document.getElementById(`ida-g2-${i}`).value);
        const gVolta2 = parseInt(document.getElementById(`volta-g2-${i}`).value);
        const gVolta1 = parseInt(document.getElementById(`volta-g1-${i}`).value);

        duelo.golsIdaCasa = gIda1;
        duelo.golsIdaFora = gIda2;
        duelo.golsVoltaCasa = gVolta2;
        duelo.golsVoltaFora = gVolta1;

        const total1 = gIda1 + gVolta1;
        const total2 = gIda2 + gVolta2;

        if (total1 > total2) {
            duelo.vencedor = duelo.timeIdaCasa;
        } else if (total2 > total1) {
            duelo.vencedor = duelo.timeVoltaCasa;
        } else {
            const p1 = parseInt(document.getElementById(`pen-p1-${i}`).value);
            const p2 = parseInt(document.getElementById(`pen-p2-${i}`).value);
            if (isNaN(p1) || isNaN(p2) || p1 === p2) {
                alert(`Preencha o vencedor dos pênaltis nas Quartas ${i + 1}!`);
                return;
            }
            duelo.penIdaCasa = p1;
            duelo.penVoltaCasa = p2;
            duelo.vencedor = p1 > p2 ? duelo.timeIdaCasa : duelo.timeVoltaCasa;
        }
        v.push(duelo.vencedor);
    }

    estadoSimulador.semis = [
        { chave: 'S1', timeIdaCasa: v[0], timeVoltaCasa: v[1], golsIdaCasa: '', golsIdaFora: '', golsVoltaCasa: '', golsVoltaFora: '', penIdaCasa: '', penVoltaCasa: '', vencedor: null },
        { chave: 'S2', timeIdaCasa: v[2], timeVoltaCasa: v[3], golsIdaCasa: '', golsIdaFora: '', golsVoltaCasa: '', golsVoltaFora: '', penIdaCasa: '', penVoltaCasa: '', vencedor: null }
    ];

    salvarEAtualizarChaveamento('semis');
}

function processarSemis() {
    const v = [];

    for (let i = 0; i < 2; i++) {
        const duelo = estadoSimulador.semis[i];
        const gIda1 = parseInt(document.getElementById(`ida-g1-${i}`).value);
        const gIda2 = parseInt(document.getElementById(`ida-g2-${i}`).value);
        const gVolta2 = parseInt(document.getElementById(`volta-g2-${i}`).value);
        const gVolta1 = parseInt(document.getElementById(`volta-g1-${i}`).value);

        duelo.golsIdaCasa = gIda1;
        duelo.golsIdaFora = gIda2;
        duelo.golsVoltaCasa = gVolta2;
        duelo.golsVoltaFora = gVolta1;

        const total1 = gIda1 + gVolta1;
        const total2 = gIda2 + gVolta2;

        if (total1 > total2) {
            duelo.vencedor = duelo.timeIdaCasa;
        } else if (total2 > total1) {
            duelo.vencedor = duelo.timeVoltaCasa;
        } else {
            const p1 = parseInt(document.getElementById(`pen-p1-${i}`).value);
            const p2 = parseInt(document.getElementById(`pen-p2-${i}`).value);
            if (isNaN(p1) || isNaN(p2) || p1 === p2) {
                alert(`Preencha o vencedor dos pênaltis na Semifinal ${i + 1}!`);
                return;
            }
            duelo.penIdaCasa = p1;
            duelo.penVoltaCasa = p2;
            duelo.vencedor = p1 > p2 ? duelo.timeIdaCasa : duelo.timeVoltaCasa;
        }
        v.push(duelo.vencedor);
    }

    estadoSimulador.final = {
        time1: v[0],
        time2: v[1],
        g1: '',
        g2: '',
        pen1: '',
        pen2: '',
        campeao: null
    };

    salvarEAtualizarChaveamento('final');
}

function processarFinal() {
    const f = estadoSimulador.final;
    const g1 = parseInt(document.getElementById('final-g1').value);
    const g2 = parseInt(document.getElementById('final-g2').value);

    f.g1 = g1;
    f.g2 = g2;

    if (g1 > g2) {
        f.campeao = f.time1;
    } else if (g2 > g1) {
        f.campeao = f.time2;
    } else {
        const p1 = parseInt(document.getElementById('final-pen-1').value);
        const p2 = parseInt(document.getElementById('final-pen-2').value);
        if (isNaN(p1) || isNaN(p2) || p1 === p2) {
            alert('A Final terminou empatada! Preencha o placar dos Pênaltis.');
            return;
        }
        f.pen1 = p1;
        f.pen2 = p2;
        f.campeao = p1 > p2 ? f.time1 : f.time2;
    }

    estadoSimulador.campeao = f.campeao;

    salvarEAtualizarChaveamento('final');

    nomeTimeCampeao.textContent = f.campeao;
    modalCampeao.classList.remove('oculto');
}

function salvarEAtualizarChaveamento(proximaFase) {
    estadoSimulador.faseAtual = proximaFase;

    localStorage.setItem('simulacao_sulamericana_motor', JSON.stringify(estadoSimulador));

    const dadosParaChaveamento = {
        quartas: estadoSimulador.quartas.length ? {
            q1_t1: estadoSimulador.quartas[0].timeIdaCasa,
            q1_t2: estadoSimulador.quartas[0].timeVoltaCasa,
            q2_t1: estadoSimulador.quartas[1].timeIdaCasa,
            q2_t2: estadoSimulador.quartas[1].timeVoltaCasa,
            q3_t1: estadoSimulador.quartas[2].timeIdaCasa,
            q3_t2: estadoSimulador.quartas[2].timeVoltaCasa,
            q4_t1: estadoSimulador.quartas[3].timeIdaCasa,
            q4_t2: estadoSimulador.quartas[3].timeVoltaCasa
        } : null,
        semis: estadoSimulador.semis.length ? {
            s1_t1: estadoSimulador.semis[0].timeIdaCasa,
            s1_t2: estadoSimulador.semis[0].timeVoltaCasa,
            s2_t1: estadoSimulador.semis[1].timeIdaCasa,
            s2_t2: estadoSimulador.semis[1].timeVoltaCasa
        } : null,
        final: estadoSimulador.final ? {
            f1: estadoSimulador.final.time1,
            f2: estadoSimulador.final.time2
        } : null,
        campeao: estadoSimulador.campeao
    };

    localStorage.setItem('simulacao_sulamericana', JSON.stringify(dadosParaChaveamento));

    renderizarFaseAtual();
}

btnResetSimulacao.addEventListener('click', () => {
    if (confirm('Deseja apagar todos os placares simulados e recomeçar das Oitavas?')) {
        localStorage.removeItem('simulacao_sulamericana_motor');
        localStorage.removeItem('simulacao_sulamericana');
        inicializarSimulador();
    }
});

inicializarSimulador();