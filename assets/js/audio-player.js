// ==========================================================================
// assets/js/audio-player.js - MOTOR DE ÁUDIO CONTÍNUO & NAVEGAÇÃO PES
// ==========================================================================

(function () {
    const AUDIO_STATE_KEY = 'conmebol_audio_state_v8';

    // 1. RESOLUÇÃO INTELIGENTE DE CAMINHOS (Evita erro 404 em pastas locais)
    function resolverCaminhoAudio(nomeArquivo) {
        // Detecta a raiz relativa do projeto dinamicamente
        const base = window.location.pathname.includes('/pagina-oficial/') ? '../assets/audio/' : 'assets/audio/';
        return base + nomeArquivo;
    }

    function detectarCompeticaoPorUrl(url) {
        const u = url.toLowerCase();
        const ehSula = u.includes('sula') || 
                       u.includes('sul-americana') || 
                       u.includes('sulamericana') || 
                       u.includes('sudamericana');
        return ehSula ? 'sula' : 'liberta';
    }

    let copaAtiva = detectarCompeticaoPorUrl(window.location.pathname);

    const arquivosHino = {
        liberta: 'hino-libertadores.mp3',
        sula: 'hino-sulamericana.mp3'
    };

    // Objeto global de áudio
    const audio = new Audio();
    audio.loop = true;
    audio.preload = 'auto';
    audio.src = resolverCaminhoAudio(arquivosHino[copaAtiva]);

    let estadoAudio = {
        tocando: true,
        mutado: false,
        volume: 0.5,
        tempoAtual: 0,
        copaAtual: copaAtiva
    };

    // Recupera configurações e tempo salvo
    const salvo = localStorage.getItem(AUDIO_STATE_KEY);
    if (salvo) {
        try {
            const parsed = JSON.parse(salvo);
            estadoAudio.mutado = parsed.mutado || false;
            estadoAudio.volume = parsed.volume !== undefined ? parsed.volume : 0.5;
            estadoAudio.tocando = parsed.tocando !== undefined ? parsed.tocando : true;
            estadoAudio.tempoAtual = parsed.tempoAtual || 0;
            
            // Restaura o segundo exato se a página recarregar
            if (estadoAudio.tempoAtual > 0) {
                audio.currentTime = estadoAudio.tempoAtual;
            }
        } catch (e) {}
    }

    audio.volume = estadoAudio.mutado ? 0 : estadoAudio.volume;

    // Salva o progresso da música continuamente
    audio.addEventListener('timeupdate', () => {
        estadoAudio.tempoAtual = audio.currentTime;
        salvarEstado();
    });

    // 2. REPRODUÇÃO SEGURA (Com desbloqueio de Autoplay)
    function tentarTocarAudio() {
        if (!estadoAudio.tocando || estadoAudio.mutado) {
            atualizarVisualPlayer(false);
            return;
        }

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                atualizarVisualPlayer(true);
            }).catch(() => {
                atualizarVisualPlayer(false);
                // Destrava o áudio no primeiro clique do usuário
                const destravar = () => {
                    if (estadoAudio.tocando && !estadoAudio.mutado) {
                        audio.play().then(() => atualizarVisualPlayer(true)).catch(() => {});
                    }
                    ['click', 'keydown', 'touchstart'].forEach(evt => {
                        window.removeEventListener(evt, destravar);
                    });
                };
                ['click', 'keydown', 'touchstart'].forEach(evt => {
                    window.addEventListener(evt, destravar, { once: true });
                });
            });
        }
    }

    // 3. TROCA DE HINO DINÂMICA
    function trocarHino(tipoCopa, forcarPlay = false) {
        if (copaAtiva === tipoCopa && !audio.paused && !forcarPlay) return;

        copaAtiva = tipoCopa;
        estadoAudio.copaAtual = tipoCopa;

        audio.pause();
        audio.src = resolverCaminhoAudio(arquivosHino[tipoCopa]);
        audio.currentTime = 0;
        audio.load();

        if (estadoAudio.tocando && !estadoAudio.mutado) {
            audio.play().then(() => {
                atualizarVisualPlayer(true);
            }).catch(() => {});
        }

        atualizarWidgetTema();
        salvarEstado();
    }

    // 4. WIDGET FLUTUANTE
    function criarWidget() {
        if (document.getElementById('widget-audio-conmebol')) return;

        const widget = document.createElement('div');
        widget.id = 'widget-audio-conmebol';
        widget.className = `widget-audio-conmebol ${copaAtiva === 'sula' ? 'tema-sula' : 'tema-liberta'}`;

        const tituloExibicao = copaAtiva === 'sula' ? 'CONMEBOL SUDAMERICANA' : 'CONMEBOL LIBERTADORES';

        widget.innerHTML = `
            <div class="bloco-info-audio">
                <div class="equalizador-animado ${audio.paused ? 'pausado' : ''}" id="eq-barras">
                    <span></span><span></span><span></span><span></span>
                </div>
                <div class="textos-audio">
                    <span class="label-audio-hino">HINO OFICIAL</span>
                    <strong class="nome-audio-torneio" id="txt-nome-torneio-audio">${tituloExibicao}</strong>
                </div>
            </div>
            
            <div class="botoes-audio-ctrl">
                <button type="button" id="btn-toggle-audio" class="btn-audio-ctrl" title="Play / Pausar">
                    ${audio.paused ? '▶' : '❚❚'}
                </button>
                <button type="button" id="btn-mute-audio" class="btn-audio-ctrl" title="Mutar / Desmutar">
                    ${estadoAudio.mutado ? '🔇' : '🔊'}
                </button>
            </div>
        `;

        document.body.appendChild(widget);

        const btnToggle = document.getElementById('btn-toggle-audio');
        const btnMute = document.getElementById('btn-mute-audio');

        if (btnToggle) {
            btnToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                if (audio.paused) {
                    audio.play().then(() => {
                        estadoAudio.tocando = true;
                        atualizarVisualPlayer(true);
                        salvarEstado();
                    });
                } else {
                    audio.pause();
                    estadoAudio.tocando = false;
                    atualizarVisualPlayer(false);
                    salvarEstado();
                }
            });
        }

        if (btnMute) {
            btnMute.addEventListener('click', (e) => {
                e.stopPropagation();
                estadoAudio.mutado = !estadoAudio.mutado;
                audio.volume = estadoAudio.mutado ? 0 : estadoAudio.volume;
                btnMute.textContent = estadoAudio.mutado ? '🔇' : '🔊';
                salvarEstado();
            });
        }

        vincularEventosHoverIndex();
    }

    function salvarEstado() {
        localStorage.setItem(AUDIO_STATE_KEY, JSON.stringify(estadoAudio));
    }

    function vincularEventosHoverIndex() {
        const cardLiberta = document.querySelector('.card-copa.libertadores, .btn-libertadores, a[href*="libertadores"]');
        const cardSula = document.querySelector('.card-copa.sulamericana, .btn-sulamericana, a[href*="sul-americana"], a[href*="sulamericana"]');

        if (cardLiberta) {
            cardLiberta.addEventListener('mouseenter', () => {
                if (copaAtiva !== 'liberta') trocarHino('liberta');
            });
        }

        if (cardSula) {
            cardSula.addEventListener('mouseenter', () => {
                if (copaAtiva !== 'sula') trocarHino('sula');
            });
        }
    }

    function atualizarWidgetTema() {
        const widget = document.getElementById('widget-audio-conmebol');
        const txtTorneio = document.getElementById('txt-nome-torneio-audio');

        if (widget && txtTorneio) {
            if (copaAtiva === 'sula') {
                widget.className = 'widget-audio-conmebol tema-sula';
                txtTorneio.textContent = 'CONMEBOL SUDAMERICANA';
            } else {
                widget.className = 'widget-audio-conmebol tema-liberta';
                txtTorneio.textContent = 'CONMEBOL LIBERTADORES';
            }
        }
    }

    function atualizarVisualPlayer(tocando) {
        const eq = document.getElementById('eq-barras');
        const btnToggle = document.getElementById('btn-toggle-audio');
        if (eq) eq.classList.toggle('pausado', !tocando);
        if (btnToggle) btnToggle.textContent = tocando ? '❚❚' : '▶';
    }

    // ==========================================================================
    // 5. MOTOR DE NAVEGAÇÃO CONTÍNUA (SPA)
    // ==========================================================================
    function interceptarNavegacaoLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link || !link.href) return;

            const destino = new URL(link.href, window.location.origin);
            if (destino.origin !== window.location.origin) return;
            if (link.target === '_blank') return;
            if (destino.pathname === window.location.pathname && destino.search === window.location.search) return;

            // Se for link de âncora na mesma página (#secao), não intercepta
            if (destino.pathname === window.location.pathname && destino.hash) return;

            e.preventDefault();
            navegarParaPagina(destino.href, true);
        });
    }

    async function navegarParaPagina(urlCompleta, adicionarHistorico = true) {
        try {
            const resposta = await fetch(urlCompleta);
            if (!resposta.ok) {
                window.location.href = urlCompleta;
                return;
            }

            const htmlTexto = await resposta.text();
            const parser = new DOMParser();
            const docNovo = parser.parseFromString(htmlTexto, 'text/html');

            // 1. Título e classes do Body
            document.title = docNovo.title;
            document.body.className = docNovo.body.className;

            // 2. Atualiza CSS
            atualizarEstilosHead(docNovo);

            // 3. Salva e reanexa o widget de áudio
            const widgetAtual = document.getElementById('widget-audio-conmebol');
            document.body.innerHTML = docNovo.body.innerHTML;
            if (widgetAtual) {
                document.body.appendChild(widgetAtual);
            }

            // 4. Atualiza histórico do navegador
            if (adicionarHistorico) {
                window.history.pushState({}, '', urlCompleta);
            }

            // 5. Troca hino se mudou de copa
            const novaCopa = detectarCompeticaoPorUrl(urlCompleta);
            if (novaCopa !== copaAtiva) {
                trocarHino(novaCopa);
            }

            // 6. Roda os scripts da nova tela
            executarScriptsPagina(docNovo);
            vincularEventosHoverIndex();

        } catch (erro) {
            console.warn('Fallback ativado: navegando tradicionalmente...', erro);
            window.location.href = urlCompleta;
        }
    }

    function atualizarEstilosHead(docNovo) {
        const novosLinks = Array.from(docNovo.querySelectorAll('link[rel="stylesheet"]'));
        novosLinks.forEach(linkNovo => {
            const href = linkNovo.getAttribute('href');
            if (href && !document.querySelector(`link[href="${href}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                document.head.appendChild(link);
            }
        });
    }

    function executarScriptsPagina(docNovo) {
        const scripts = Array.from(docNovo.querySelectorAll('script'));
        scripts.forEach(scriptAntigo => {
            const src = scriptAntigo.getAttribute('src');
            if (src && src.includes('audio-player.js')) return;

            const novoScript = document.createElement('script');
            if (src) {
                novoScript.src = src;
            } else {
                novoScript.textContent = scriptAntigo.textContent;
            }
            document.body.appendChild(novoScript);
        });

        // Notifica scripts que dependem de DOMContentLoaded
        document.dispatchEvent(new Event('DOMContentLoaded'));
    }

    window.addEventListener('popstate', () => {
        navegarParaPagina(window.location.href, false);
    });

    // Inicia tudo assim que o DOM carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            criarWidget();
            tentarTocarAudio();
            interceptarNavegacaoLinks();
        });
    } else {
        criarWidget();
        tentarTocarAudio();
        interceptarNavegacaoLinks();
    }
})();