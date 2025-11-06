// WikiEditor - JavaScript Principal
// Gerenciamento de estado e funcionalidades

// Estado da aplicação
const appState = {
    currentPage: null,
    savedPages: [],
    draggedElement: null,
    elementCounter: 0
};

// Elementos do DOM
const elements = {
    articleContent: null,
    modal: null,
    modalTitle: null,
    modalBody: null,
    modalConfirm: null,
    modalCancel: null,
    closeModal: null,
    paginasSalvas: null,
    indice: null
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    loadSavedPages();
    attachEventListeners();
    updateIndex();
});

// Inicializar referências aos elementos do DOM
function initializeElements() {
    elements.articleContent = document.getElementById('articleContent');
    elements.modal = document.getElementById('modal');
    elements.modalTitle = document.getElementById('modalTitle');
    elements.modalBody = document.getElementById('modalBody');
    elements.modalConfirm = document.getElementById('modalConfirm');
    elements.modalCancel = document.getElementById('modalCancel');
    elements.closeModal = document.querySelector('.close');
    elements.paginasSalvas = document.getElementById('paginasSalvas');
    elements.indice = document.getElementById('indice');
}

// Anexar event listeners
function attachEventListeners() {
    // Ferramentas
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tool = e.target.dataset.tool;
            handleToolClick(tool);
        });
    });

    // Header buttons
    document.getElementById('btnSalvar').addEventListener('click', salvarPagina);
    document.getElementById('btnCarregar').addEventListener('click', mostrarPaginasSalvas);
    document.getElementById('btnNovaPagina').addEventListener('click', novaPagina);

    // Export buttons
    document.getElementById('btnExportarHTMLEditavel').addEventListener('click', () => exportarHTML(true));
    document.getElementById('btnExportarHTML').addEventListener('click', () => exportarHTML(false));
    document.getElementById('btnGerarPDF').addEventListener('click', gerarPDF);
    document.getElementById('btnImprimir').addEventListener('click', imprimir);

    // Manage buttons
    document.getElementById('btnLimparConteudo').addEventListener('click', limparConteudo);
    document.getElementById('btnApagarTudo').addEventListener('click', apagarTudo);

    // Modal
    elements.closeModal.addEventListener('click', closeModal);
    elements.modalCancel.addEventListener('click', closeModal);
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target === elements.modal) {
            closeModal();
        }
    });
}

// ==================== FERRAMENTAS ====================

function handleToolClick(tool) {
    switch(tool) {
        case 'titulo':
            adicionarTitulo();
            break;
        case 'subtitulo':
            adicionarSubtitulo();
            break;
        case 'paragrafo':
            adicionarParagrafo();
            break;
        case 'tabela':
            mostrarModalTabela();
            break;
        case 'imagem':
            mostrarModalImagem();
            break;
        case 'lista':
            mostrarModalLista();
            break;
        case 'infobox':
            mostrarModalInfobox();
            break;
        case 'citacao':
            adicionarCitacao();
            break;
        case 'codigo':
            adicionarCodigo();
            break;
        case 'referencia':
            adicionarReferencia();
            break;
        case 'divisor':
            adicionarDivisor();
            break;
        case 'audio':
            mostrarModalAudio();
            break;
    }
}

// ==================== ADICIONAR ELEMENTOS ====================

function adicionarTitulo() {
    const element = criarElementoBase('titulo');
    element.innerHTML = `
        <h1 contenteditable="true">Título do Artigo</h1>
    `;
    adicionarElementoAoConteudo(element);
    updateIndex();
}

function adicionarSubtitulo() {
    const element = criarElementoBase('subtitulo');
    element.innerHTML = `
        <h2 contenteditable="true">Subtítulo</h2>
    `;
    adicionarElementoAoConteudo(element);
    updateIndex();
}

function adicionarParagrafo() {
    const element = criarElementoBase('paragrafo');
    element.innerHTML = `
        <p contenteditable="true">Clique aqui para editar o parágrafo. Você pode escrever seu conteúdo diretamente neste espaço.</p>
    `;
    adicionarElementoAoConteudo(element);
}

function adicionarCitacao() {
    const element = criarElementoBase('citacao');
    element.innerHTML = `
        <blockquote contenteditable="true">Digite sua citação aqui. As citações são exibidas com formatação especial.</blockquote>
    `;
    adicionarElementoAoConteudo(element);
}

function adicionarCodigo() {
    const element = criarElementoBase('codigo');
    element.innerHTML = `
        <pre contenteditable="true">// Digite seu código aqui
function exemplo() {
    console.log("Olá, mundo!");
}</pre>
    `;
    adicionarElementoAoConteudo(element);
}

function adicionarReferencia() {
    const element = criarElementoBase('referencia');
    element.innerHTML = `
        <div contenteditable="true">
            <sup>[1]</sup> <a href="#">Nome da referência</a> - Descrição da fonte
        </div>
    `;
    adicionarElementoAoConteudo(element);
}

function adicionarDivisor() {
    const element = criarElementoBase('divisor');
    element.innerHTML = `<hr>`;
    adicionarElementoAoConteudo(element);
}

// ==================== MODAIS ====================

function mostrarModalTabela() {
    elements.modalTitle.textContent = 'Criar Tabela';
    elements.modalBody.innerHTML = `
        <label for="tabelaLinhas">Número de linhas:</label>
        <input type="number" id="tabelaLinhas" min="1" max="20" value="3">
        
        <label for="tabelaColunas">Número de colunas:</label>
        <input type="number" id="tabelaColunas" min="1" max="10" value="3">
        
        <label for="tabelaTitulo">Título da tabela (opcional):</label>
        <input type="text" id="tabelaTitulo" placeholder="Digite o título da tabela">
    `;
    
    elements.modalConfirm.onclick = () => {
        const linhas = parseInt(document.getElementById('tabelaLinhas').value);
        const colunas = parseInt(document.getElementById('tabelaColunas').value);
        const titulo = document.getElementById('tabelaTitulo').value;
        adicionarTabela(linhas, colunas, titulo);
        closeModal();
    };
    
    openModal();
}

function mostrarModalImagem() {
    elements.modalTitle.textContent = 'Adicionar Imagem';
    elements.modalBody.innerHTML = `
        <label for="imagemTipo">Tipo de imagem:</label>
        <select id="imagemTipo">
            <option value="url">URL da imagem</option>
            <option value="local">Arquivo local</option>
        </select>
        
        <div id="imagemUrlContainer">
            <label for="imagemUrl">URL da imagem:</label>
            <input type="text" id="imagemUrl" placeholder="https://exemplo.com/imagem.jpg">
        </div>
        
        <div id="imagemLocalContainer" style="display: none;">
            <label for="imagemLocal">Selecionar arquivo:</label>
            <input type="file" id="imagemLocal" accept="image/*">
        </div>
        
        <label for="imagemLegenda">Legenda (opcional):</label>
        <input type="text" id="imagemLegenda" placeholder="Digite a legenda da imagem">
        
        <label for="imagemLargura">Largura (opcional, em pixels):</label>
        <input type="number" id="imagemLargura" placeholder="Ex: 400">
    `;
    
    // Alternar entre URL e arquivo local
    document.getElementById('imagemTipo').addEventListener('change', (e) => {
        const urlContainer = document.getElementById('imagemUrlContainer');
        const localContainer = document.getElementById('imagemLocalContainer');
        if (e.target.value === 'url') {
            urlContainer.style.display = 'block';
            localContainer.style.display = 'none';
        } else {
            urlContainer.style.display = 'none';
            localContainer.style.display = 'block';
        }
    });
    
    elements.modalConfirm.onclick = () => {
        const tipo = document.getElementById('imagemTipo').value;
        const legenda = document.getElementById('imagemLegenda').value;
        const largura = document.getElementById('imagemLargura').value;
        
        if (tipo === 'url') {
            const url = document.getElementById('imagemUrl').value;
            if (url) {
                adicionarImagem(url, legenda, largura);
                closeModal();
            } else {
                alert('Por favor, insira uma URL válida.');
            }
        } else {
            const fileInput = document.getElementById('imagemLocal');
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                    adicionarImagem(e.target.result, legenda, largura);
                };
                reader.readAsDataURL(file);
                closeModal();
            } else {
                alert('Por favor, selecione um arquivo.');
            }
        }
    };
    
    openModal();
}

function mostrarModalLista() {
    elements.modalTitle.textContent = 'Criar Lista';
    elements.modalBody.innerHTML = `
        <label for="listaTipo">Tipo de lista:</label>
        <select id="listaTipo">
            <option value="ul">Lista não ordenada (bullets)</option>
            <option value="ol">Lista ordenada (números)</option>
        </select>
        
        <label for="listaItens">Itens da lista (um por linha):</label>
        <textarea id="listaItens" rows="5" placeholder="Item 1&#10;Item 2&#10;Item 3"></textarea>
    `;
    
    elements.modalConfirm.onclick = () => {
        const tipo = document.getElementById('listaTipo').value;
        const itens = document.getElementById('listaItens').value.split('\n').filter(item => item.trim());
        adicionarLista(tipo, itens);
        closeModal();
    };
    
    openModal();
}

function mostrarModalInfobox() {
    elements.modalTitle.textContent = 'Criar Infobox';
    elements.modalBody.innerHTML = `
        <label for="infoboxTitulo">Título do Infobox:</label>
        <input type="text" id="infoboxTitulo" placeholder="Ex: Informações Gerais">
        
        <label for="infoboxConteudo">Conteúdo (formato: Label: Valor, um por linha):</label>
        <textarea id="infoboxConteudo" rows="6" placeholder="Nome: Exemplo&#10;Data: 2025&#10;Local: Brasil"></textarea>
    `;
    
    elements.modalConfirm.onclick = () => {
        const titulo = document.getElementById('infoboxTitulo').value;
        const conteudo = document.getElementById('infoboxConteudo').value;
        adicionarInfobox(titulo, conteudo);
        closeModal();
    };
    
    openModal();
}

function mostrarModalAudio() {
    elements.modalTitle.textContent = 'Adicionar Áudio';
    elements.modalBody.innerHTML = `
        <label for="audioTipo">Tipo de áudio:</label>
        <select id="audioTipo">
            <option value="url">URL do áudio</option>
            <option value="local">Arquivo local</option>
        </select>
        
        <div id="audioUrlContainer">
            <label for="audioUrl">URL do áudio:</label>
            <input type="text" id="audioUrl" placeholder="https://exemplo.com/audio.mp3">
        </div>
        
        <div id="audioLocalContainer" style="display: none;">
            <label for="audioLocal">Selecionar arquivo:</label>
            <input type="file" id="audioLocal" accept="audio/*">
        </div>
        
        <label for="audioLabel">Descrição (opcional):</label>
        <input type="text" id="audioLabel" placeholder="Ex: Entrevista com...">
    `;
    
    // Alternar entre URL e arquivo local
    document.getElementById('audioTipo').addEventListener('change', (e) => {
        const urlContainer = document.getElementById('audioUrlContainer');
        const localContainer = document.getElementById('audioLocalContainer');
        if (e.target.value === 'url') {
            urlContainer.style.display = 'block';
            localContainer.style.display = 'none';
        } else {
            urlContainer.style.display = 'none';
            localContainer.style.display = 'block';
        }
    });
    
    elements.modalConfirm.onclick = () => {
        const tipo = document.getElementById('audioTipo').value;
        const label = document.getElementById('audioLabel').value;
        
        if (tipo === 'url') {
            const url = document.getElementById('audioUrl').value;
            if (url) {
                adicionarAudio(url, label);
                closeModal();
            } else {
                alert('Por favor, insira uma URL válida.');
            }
        } else {
            const fileInput = document.getElementById('audioLocal');
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                    adicionarAudio(e.target.result, label);
                };
                reader.readAsDataURL(file);
                closeModal();
            } else {
                alert('Por favor, selecione um arquivo.');
            }
        }
    };
    
    openModal();
}

// ==================== ADICIONAR ELEMENTOS COMPLEXOS ====================

function adicionarTabela(linhas, colunas, titulo) {
    const element = criarElementoBase('tabela');
    
    let tabelaHTML = '';
    if (titulo) {
        tabelaHTML += `<caption contenteditable="true">${titulo}</caption>`;
    }
    
    tabelaHTML += '<table><thead><tr>';
    for (let i = 0; i < colunas; i++) {
        tabelaHTML += `<th contenteditable="true">Cabeçalho ${i + 1}</th>`;
    }
    tabelaHTML += '</tr></thead><tbody>';
    
    for (let i = 0; i < linhas; i++) {
        tabelaHTML += '<tr>';
        for (let j = 0; j < colunas; j++) {
            tabelaHTML += `<td contenteditable="true">Célula ${i + 1},${j + 1}</td>`;
        }
        tabelaHTML += '</tr>';
    }
    
    tabelaHTML += '</tbody></table>';
    tabelaHTML += `
        <div class="table-controls">
            <button onclick="adicionarLinhaTabela(this)">➕ Adicionar Linha</button>
            <button onclick="removerLinhaTabela(this)">➖ Remover Linha</button>
            <button onclick="adicionarColunaTabela(this)">➕ Adicionar Coluna</button>
            <button onclick="removerColunaTabela(this)">➖ Remover Coluna</button>
        </div>
    `;
    
    element.innerHTML = tabelaHTML;
    adicionarElementoAoConteudo(element);
}

function adicionarImagem(src, legenda, largura) {
    const element = criarElementoBase('imagem');
    
    let imgHTML = '<figure>';
    if (largura) {
        imgHTML += `<img src="${src}" alt="${legenda || 'Imagem'}" style="width: ${largura}px;">`;
    } else {
        imgHTML += `<img src="${src}" alt="${legenda || 'Imagem'}">`;
    }
    
    if (legenda) {
        imgHTML += `<figcaption contenteditable="true">${legenda}</figcaption>`;
    }
    imgHTML += '</figure>';
    
    element.innerHTML = imgHTML;
    adicionarElementoAoConteudo(element);
}

function adicionarLista(tipo, itens) {
    const element = criarElementoBase('lista');
    
    let listaHTML = tipo === 'ul' ? '<ul>' : '<ol>';
    itens.forEach(item => {
        listaHTML += `<li contenteditable="true">${item}</li>`;
    });
    listaHTML += tipo === 'ul' ? '</ul>' : '</ol>';
    
    element.innerHTML = listaHTML;
    adicionarElementoAoConteudo(element);
}

function adicionarInfobox(titulo, conteudo) {
    const element = criarElementoBase('infobox');
    
    let infoboxHTML = '<div class="infobox-container">';
    infoboxHTML += `<div class="infobox-title" contenteditable="true">${titulo || 'Informações'}</div>`;
    infoboxHTML += '<div class="infobox-content">';
    
    const linhas = conteudo.split('\n').filter(linha => linha.trim());
    linhas.forEach(linha => {
        const partes = linha.split(':');
        if (partes.length >= 2) {
            const label = partes[0].trim();
            const value = partes.slice(1).join(':').trim();
            infoboxHTML += `
                <div class="infobox-row">
                    <div class="infobox-label" contenteditable="true">${label}:</div>
                    <div class="infobox-value" contenteditable="true">${value}</div>
                </div>
            `;
        }
    });
    
    infoboxHTML += '</div></div>';
    element.innerHTML = infoboxHTML;
    adicionarElementoAoConteudo(element);
}

function adicionarAudio(src, label) {
    const element = criarElementoBase('audio');
    
    let audioHTML = '';
    if (label) {
        audioHTML += `<div class="audio-label" contenteditable="true">${label}</div>`;
    }
    audioHTML += `<audio controls src="${src}">Seu navegador não suporta o elemento de áudio.</audio>`;
    
    element.innerHTML = audioHTML;
    adicionarElementoAoConteudo(element);
}

// ==================== FUNÇÕES DE TABELA ====================

function adicionarLinhaTabela(btn) {
    const element = btn.closest('.article-element');
    const tbody = element.querySelector('tbody');
    const colunas = element.querySelectorAll('thead th').length;
    
    const novaLinha = document.createElement('tr');
    for (let i = 0; i < colunas; i++) {
        const td = document.createElement('td');
        td.contentEditable = true;
        td.textContent = 'Nova célula';
        novaLinha.appendChild(td);
    }
    
    tbody.appendChild(novaLinha);
}

function removerLinhaTabela(btn) {
    const element = btn.closest('.article-element');
    const tbody = element.querySelector('tbody');
    
    if (tbody.rows.length > 1) {
        tbody.deleteRow(-1);
    } else {
        alert('A tabela deve ter pelo menos uma linha.');
    }
}

function adicionarColunaTabela(btn) {
    const element = btn.closest('.article-element');
    const table = element.querySelector('table');
    
    // Adicionar coluna no cabeçalho
    const thead = table.querySelector('thead tr');
    const th = document.createElement('th');
    th.contentEditable = true;
    th.textContent = 'Novo Cabeçalho';
    thead.appendChild(th);
    
    // Adicionar coluna em cada linha do corpo
    const tbody = table.querySelector('tbody');
    tbody.querySelectorAll('tr').forEach(tr => {
        const td = document.createElement('td');
        td.contentEditable = true;
        td.textContent = 'Nova célula';
        tr.appendChild(td);
    });
}

function removerColunaTabela(btn) {
    const element = btn.closest('.article-element');
    const table = element.querySelector('table');
    const thead = table.querySelector('thead tr');
    
    if (thead.cells.length > 1) {
        // Remover última coluna do cabeçalho
        thead.deleteCell(-1);
        
        // Remover última coluna de cada linha do corpo
        const tbody = table.querySelector('tbody');
        tbody.querySelectorAll('tr').forEach(tr => {
            tr.deleteCell(-1);
        });
    } else {
        alert('A tabela deve ter pelo menos uma coluna.');
    }
}

// Continua no próximo bloco...



// ==================== FUNÇÕES AUXILIARES ====================

function criarElementoBase(tipo) {
    const element = document.createElement('div');
    element.className = `article-element element-${tipo}`;
    element.draggable = true;
    element.dataset.elementId = ++appState.elementCounter;
    
    // Adicionar controles
    const controls = document.createElement('div');
    controls.className = 'element-controls';
    controls.innerHTML = `
        <button class="control-btn move" title="Mover">↕️</button>
        <button class="control-btn delete" title="Deletar" onclick="deletarElemento(this)">🗑️</button>
    `;
    element.appendChild(controls);
    
    // Event listeners para drag and drop
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragend', handleDragEnd);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('drop', handleDrop);
    element.addEventListener('dragleave', handleDragLeave);
    
    return element;
}

function adicionarElementoAoConteudo(element) {
    // Remover welcome box se existir
    const welcomeBox = elements.articleContent.querySelector('.welcome-box');
    if (welcomeBox) {
        welcomeBox.remove();
    }
    
    elements.articleContent.appendChild(element);
    
    // Scroll suave até o novo elemento
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function deletarElemento(btn) {
    if (confirm('Tem certeza que deseja deletar este elemento?')) {
        const element = btn.closest('.article-element');
        element.remove();
        updateIndex();
    }
}

// ==================== DRAG AND DROP ====================

function handleDragStart(e) {
    appState.draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    
    // Remover classes de todos os elementos
    document.querySelectorAll('.article-element').forEach(el => {
        el.classList.remove('drag-over');
    });
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    
    e.dataTransfer.dropEffect = 'move';
    
    if (this !== appState.draggedElement) {
        this.classList.add('drag-over');
    }
    
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (appState.draggedElement !== this) {
        // Inserir o elemento arrastado antes deste elemento
        elements.articleContent.insertBefore(appState.draggedElement, this);
    }
    
    this.classList.remove('drag-over');
    updateIndex();
    
    return false;
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

// ==================== ÍNDICE ====================

function updateIndex() {
    const titulos = elements.articleContent.querySelectorAll('.element-titulo h1, .element-subtitulo h2');
    
    if (titulos.length === 0) {
        elements.indice.innerHTML = '<p class="empty-message">Adicione títulos para gerar o índice</p>';
        return;
    }
    
    let indexHTML = '<ul style="list-style: none; padding-left: 0;">';
    titulos.forEach((titulo, index) => {
        const texto = titulo.textContent;
        const nivel = titulo.tagName === 'H1' ? 0 : 1;
        const padding = nivel * 15;
        const id = `titulo-${index}`;
        
        // Adicionar ID ao título para navegação
        titulo.id = id;
        
        indexHTML += `
            <li style="padding-left: ${padding}px; margin-bottom: 5px;">
                <a href="#${id}" style="color: var(--primary-color); text-decoration: none; font-size: 13px;">
                    ${texto}
                </a>
            </li>
        `;
    });
    indexHTML += '</ul>';
    
    elements.indice.innerHTML = indexHTML;
}

// ==================== MODAL ====================

function openModal() {
    elements.modal.style.display = 'block';
}

function closeModal() {
    elements.modal.style.display = 'none';
    elements.modalBody.innerHTML = '';
    elements.modalConfirm.onclick = null;
}

// ==================== SALVAR E CARREGAR ====================

function salvarPagina() {
    const titulo = elements.articleContent.querySelector('.element-titulo h1')?.textContent || 'Página sem título';
    
    elements.modalTitle.textContent = 'Salvar Página';
    elements.modalBody.innerHTML = `
        <label for="paginaTitulo">Título da página:</label>
        <input type="text" id="paginaTitulo" value="${titulo}">
    `;
    
    elements.modalConfirm.onclick = () => {
        const tituloSalvo = document.getElementById('paginaTitulo').value;
        
        const pagina = {
            id: Date.now(),
            titulo: tituloSalvo,
            conteudo: elements.articleContent.innerHTML,
            dataSalva: new Date().toLocaleString('pt-BR')
        };
        
        appState.savedPages.push(pagina);
        localStorage.setItem('wikieditor_pages', JSON.stringify(appState.savedPages));
        
        alert('Página salva com sucesso!');
        atualizarListaPaginasSalvas();
        closeModal();
    };
    
    openModal();
}

function loadSavedPages() {
    const saved = localStorage.getItem('wikieditor_pages');
    if (saved) {
        appState.savedPages = JSON.parse(saved);
        atualizarListaPaginasSalvas();
    }
}

function atualizarListaPaginasSalvas() {
    if (appState.savedPages.length === 0) {
        elements.paginasSalvas.innerHTML = '<p class="empty-message">Nenhuma página salva</p>';
        return;
    }
    
    let html = '<ul style="list-style: none; padding-left: 0;">';
    appState.savedPages.forEach(pagina => {
        html += `
            <li style="margin-bottom: 10px; padding: 8px; background: var(--secondary-color); border-radius: 3px;">
                <div style="font-weight: 600; font-size: 13px; margin-bottom: 3px;">${pagina.titulo}</div>
                <div style="font-size: 11px; color: #72777d; margin-bottom: 5px;">${pagina.dataSalva}</div>
                <div style="display: flex; gap: 5px;">
                    <button onclick="carregarPagina(${pagina.id})" style="flex: 1; padding: 4px; font-size: 11px; cursor: pointer; border: 1px solid var(--border-color); border-radius: 3px; background: white;">Carregar</button>
                    <button onclick="deletarPagina(${pagina.id})" style="padding: 4px 8px; font-size: 11px; cursor: pointer; border: 1px solid var(--danger-color); border-radius: 3px; background: white; color: var(--danger-color);">🗑️</button>
                </div>
            </li>
        `;
    });
    html += '</ul>';
    
    elements.paginasSalvas.innerHTML = html;
}

function mostrarPaginasSalvas() {
    if (appState.savedPages.length === 0) {
        alert('Não há páginas salvas.');
        return;
    }
    
    elements.modalTitle.textContent = 'Páginas Salvas';
    elements.modalBody.innerHTML = `
        <p style="margin-bottom: 15px;">Selecione uma página para carregar:</p>
        <div id="listaPaginasModal"></div>
    `;
    
    let html = '';
    appState.savedPages.forEach(pagina => {
        html += `
            <div style="margin-bottom: 10px; padding: 10px; background: var(--secondary-color); border-radius: 4px; cursor: pointer;" onclick="carregarPaginaEFecharModal(${pagina.id})">
                <div style="font-weight: 600; margin-bottom: 3px;">${pagina.titulo}</div>
                <div style="font-size: 12px; color: #72777d;">${pagina.dataSalva}</div>
            </div>
        `;
    });
    
    document.getElementById('listaPaginasModal').innerHTML = html;
    
    elements.modalConfirm.style.display = 'none';
    elements.modalCancel.textContent = 'Fechar';
    
    openModal();
    
    // Restaurar botão confirmar ao fechar
    elements.modal.addEventListener('click', restaurarBotoesModal, { once: true });
}

function restaurarBotoesModal() {
    elements.modalConfirm.style.display = 'inline-block';
    elements.modalCancel.textContent = 'Cancelar';
}

function carregarPagina(id) {
    const pagina = appState.savedPages.find(p => p.id === id);
    if (pagina) {
        if (confirm(`Carregar a página "${pagina.titulo}"? O conteúdo atual será substituído.`)) {
            elements.articleContent.innerHTML = pagina.conteudo;
            appState.currentPage = pagina;
            
            // Reattach event listeners aos elementos carregados
            reattachElementListeners();
            updateIndex();
            
            alert('Página carregada com sucesso!');
        }
    }
}

function carregarPaginaEFecharModal(id) {
    closeModal();
    carregarPagina(id);
}

function deletarPagina(id) {
    if (confirm('Tem certeza que deseja deletar esta página?')) {
        appState.savedPages = appState.savedPages.filter(p => p.id !== id);
        localStorage.setItem('wikieditor_pages', JSON.stringify(appState.savedPages));
        atualizarListaPaginasSalvas();
    }
}

function reattachElementListeners() {
    elements.articleContent.querySelectorAll('.article-element').forEach(element => {
        element.addEventListener('dragstart', handleDragStart);
        element.addEventListener('dragend', handleDragEnd);
        element.addEventListener('dragover', handleDragOver);
        element.addEventListener('drop', handleDrop);
        element.addEventListener('dragleave', handleDragLeave);
    });
}

function novaPagina() {
    if (confirm('Criar uma nova página? O conteúdo atual será limpo.')) {
        elements.articleContent.innerHTML = `
            <div class="welcome-box">
                <h2>👋 Bem-vindo ao Editor Wikipedia Aprimorado!</h2>
                <p>Use as ferramentas da barra lateral para começar a criar seu artigo. Você pode adicionar:</p>
                <ul>
                    <li>Títulos e subtítulos para organizar o conteúdo</li>
                    <li>Parágrafos de texto editáveis</li>
                    <li>Tabelas para dados estruturados (com edição avançada)</li>
                    <li>Imagens com legendas (redimensionáveis)</li>
                    <li>Listas ordenadas e não ordenadas</li>
                    <li>Infoboxes informativos</li>
                    <li>Citações e blocos de código</li>
                    <li>Referências e divisores</li>
                    <li>Áudio (locais ou externos)</li>
                </ul>
                <h3>Novos Recursos:</h3>
                <ul>
                    <li>✨ Cada componente pode ser apagado individualmente</li>
                    <li>🔄 Componentes podem ser redimensionados (imagens, tabelas, infoboxes)</li>
                    <li>📊 Tabelas podem ser editadas sem apagar (adicionar/remover linhas e colunas)</li>
                    <li>📤 Exportação HTML não editável (sem controles de edição)</li>
                    <li>📕 Exportação digital mantida com performance otimizada</li>
                </ul>
                <p><strong>Dica:</strong> Todos os elementos são editáveis. Clique para editar o conteúdo diretamente!</p>
            </div>
        `;
        appState.currentPage = null;
        updateIndex();
    }
}

function limparConteudo() {
    if (confirm('Limpar todo o conteúdo? Esta ação não pode ser desfeita.')) {
        novaPagina();
    }
}

function apagarTudo() {
    if (confirm('ATENÇÃO: Isso irá apagar TODAS as páginas salvas e o conteúdo atual. Esta ação não pode ser desfeita!')) {
        if (confirm('Tem CERTEZA ABSOLUTA? Todas as páginas salvas serão perdidas permanentemente.')) {
            appState.savedPages = [];
            localStorage.removeItem('wikieditor_pages');
            novaPagina();
            atualizarListaPaginasSalvas();
            alert('Tudo foi apagado.');
        }
    }
}

// Continua na parte 3...



// ==================== EXPORTAÇÃO ====================

function exportarHTML(editavel) {
    const titulo = elements.articleContent.querySelector('.element-titulo h1')?.textContent || 'Página Wikipedia';
    
    // Clonar o conteúdo
    const conteudoClone = elements.articleContent.cloneNode(true);
    
    if (!editavel) {
        // Remover controles de edição
        conteudoClone.querySelectorAll('.element-controls').forEach(el => el.remove());
        conteudoClone.querySelectorAll('.table-controls').forEach(el => el.remove());
        
        // Remover atributos de edição
        conteudoClone.querySelectorAll('[contenteditable]').forEach(el => {
            el.removeAttribute('contenteditable');
        });
        
        // Remover atributos de drag
        conteudoClone.querySelectorAll('[draggable]').forEach(el => {
            el.removeAttribute('draggable');
        });
        
        // Remover classes de controle
        conteudoClone.querySelectorAll('.article-element').forEach(el => {
            el.style.border = 'none';
            el.style.cursor = 'default';
        });
    }
    
    // Criar documento HTML completo
    const htmlCompleto = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${titulo}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            color: #202122;
            background-color: #f8f9fa;
            line-height: 1.6;
            padding: 20px;
        }
        
        .article-content {
            max-width: 900px;
            margin: 0 auto;
            background-color: white;
            padding: 30px 40px;
            border: 1px solid #a2a9b1;
            border-radius: 4px;
        }
        
        .article-element {
            margin-bottom: 20px;
        }
        
        .element-titulo h1 {
            font-size: 32px;
            font-weight: 400;
            border-bottom: 1px solid #a2a9b1;
            padding-bottom: 5px;
            margin-bottom: 10px;
        }
        
        .element-subtitulo h2 {
            font-size: 24px;
            font-weight: 400;
            border-bottom: 1px solid #a2a9b1;
            padding-bottom: 3px;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        
        .element-paragrafo p {
            font-size: 14px;
            line-height: 1.8;
            text-align: justify;
        }
        
        .element-tabela table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 14px;
        }
        
        .element-tabela th,
        .element-tabela td {
            border: 1px solid #a2a9b1;
            padding: 8px 12px;
            text-align: left;
        }
        
        .element-tabela th {
            background-color: #f8f9fa;
            font-weight: 600;
        }
        
        .element-tabela tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        
        .element-imagem {
            text-align: center;
            margin: 20px 0;
        }
        
        .element-imagem img {
            max-width: 100%;
            height: auto;
            border: 1px solid #a2a9b1;
            border-radius: 4px;
        }
        
        .element-imagem figcaption {
            font-size: 13px;
            color: #72777d;
            margin-top: 8px;
            font-style: italic;
        }
        
        .element-lista ul,
        .element-lista ol {
            margin-left: 30px;
            font-size: 14px;
        }
        
        .element-lista li {
            margin-bottom: 5px;
        }
        
        .element-infobox {
            float: right;
            width: 300px;
            margin: 0 0 15px 15px;
            border: 1px solid #a2a9b1;
            background-color: #f8f9fa;
            font-size: 13px;
        }
        
        .infobox-title {
            background-color: #3366cc;
            color: white;
            padding: 10px;
            font-weight: 600;
            text-align: center;
        }
        
        .infobox-content {
            padding: 15px;
        }
        
        .infobox-row {
            display: flex;
            margin-bottom: 8px;
        }
        
        .infobox-label {
            font-weight: 600;
            min-width: 100px;
        }
        
        .infobox-value {
            flex: 1;
        }
        
        .element-citacao {
            border-left: 4px solid #a2a9b1;
            padding-left: 20px;
            margin: 20px 0;
            font-style: italic;
            color: #54595d;
        }
        
        .element-codigo {
            background-color: #f6f6f6;
            border: 1px solid #a2a9b1;
            border-radius: 4px;
            padding: 15px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            overflow-x: auto;
            margin: 15px 0;
        }
        
        .element-referencia {
            font-size: 13px;
            color: #3366cc;
            margin: 10px 0;
        }
        
        .element-divisor hr {
            border: none;
            border-top: 1px solid #a2a9b1;
            margin: 20px 0;
        }
        
        .element-audio {
            margin: 20px 0;
        }
        
        .element-audio audio {
            width: 100%;
            max-width: 500px;
        }
        
        .audio-label {
            font-size: 13px;
            color: #72777d;
            margin-bottom: 8px;
        }
        
        .welcome-box {
            background-color: #fef6e7;
            border: 1px solid #fc3;
            border-radius: 4px;
            padding: 20px;
            margin-bottom: 20px;
        }
        
        .welcome-box h2 {
            font-size: 20px;
            margin-bottom: 15px;
        }
        
        .welcome-box h3 {
            font-size: 16px;
            margin-top: 15px;
            margin-bottom: 10px;
        }
        
        .welcome-box p {
            margin-bottom: 10px;
        }
        
        .welcome-box ul {
            margin-left: 25px;
            margin-bottom: 10px;
        }
        
        .welcome-box li {
            margin-bottom: 5px;
        }
        
        @media print {
            body {
                background-color: white;
                padding: 0;
            }
            
            .article-content {
                border: none;
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <div class="article-content">
        ${conteudoClone.innerHTML}
    </div>
</body>
</html>`;
    
    // Criar blob e fazer download
    const blob = new Blob([htmlCompleto], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${titulo.replace(/[^a-z0-9]/gi, '_').toLowerCase()}${editavel ? '_editavel' : ''}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`HTML ${editavel ? 'editável' : 'não editável'} exportado com sucesso!`);
}

function gerarPDF() {
    alert('Para gerar PDF, você tem duas opções:\n\n1. Use a função "Imprimir" e selecione "Salvar como PDF" no diálogo de impressão.\n\n2. Exporte como HTML e use um conversor online de HTML para PDF.\n\nA função de impressão será aberta agora.');
    imprimir();
}

function imprimir() {
    window.print();
}

// ==================== INICIALIZAÇÃO FINAL ====================

// Garantir que as funções globais estejam disponíveis
window.adicionarLinhaTabela = adicionarLinhaTabela;
window.removerLinhaTabela = removerLinhaTabela;
window.adicionarColunaTabela = adicionarColunaTabela;
window.removerColunaTabela = removerColunaTabela;
window.deletarElemento = deletarElemento;
window.carregarPagina = carregarPagina;
window.carregarPaginaEFecharModal = carregarPaginaEFecharModal;
window.deletarPagina = deletarPagina;

console.log('WikiEditor carregado com sucesso!');

