// 1. Iniciação

window.onload = function() {
    // Tenta carregar a Galeria (se existir o contentor na página)
    loadData();
    
    // Prepara o Formulário (se existir o formulário na página)
    setupFormulario();
};

// 2. Galeria - faz o pedido AJAX para ler o ficheiro XML

function loadData() {
    // Verificação de Segurança: Se não houver 'filmes-container', estamos noutra página.
    // O 'return' faz a função parar aqui para não dar erro.
    if (!document.getElementById('filmes-container')) return;

    var oXHR = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    
    oXHR.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Sucesso! Vamos construir a lista.
            showTheList(this.responseXML);
        }
    }
    
    oXHR.open("GET", "xml/filmes.xml", true);
    oXHR.send();
}

/**
 * Recebe o XML, lê os dados e cria os elementos HTML (cartazes) dinamicamente.
 */

function showTheList(xml) {
    var divContainer = document.getElementById('filmes-container');
    var listaFilmes = xml.getElementsByTagName('filme');

    // Percorre todos os filmes encontrados no XML
    for (var i = 0; i < listaFilmes.length; i++) {
        
        // 1. Ler dados do XML
        var titulo = listaFilmes[i].getElementsByTagName("titulo")[0].childNodes[0].nodeValue;
        var genero = listaFilmes[i].getElementsByTagName("genero")[0].childNodes[0].nodeValue;
        var imagemSrc = listaFilmes[i].getElementsByTagName("cartaz")[0].childNodes[0].nodeValue;
        var sinopse = listaFilmes[i].getElementsByTagName("sinopse")[0].childNodes[0].nodeValue;

        // 2. Criar elemento <figure> (o Cartaz)
        var figure = document.createElement('figure');
        figure.id = "filme-" + i; // ID único (ex: filme-0, filme-1...)

        // --- Botão de Fechar (X) ---
        var btnFechar = document.createElement('span');
        btnFechar.className = 'btn-fechar';
        btnFechar.innerHTML = '✖'; 
        // Importante: stopPropagation impede que o clique no X ative o clique do cartaz
        btnFechar.onclick = function(e) {
            e.stopPropagation(); 
            fecharTodos();       
        };

        // --- Clique no Cartaz (Abrir) ---
        figure.onclick = function() {
            abrirFilme(this);
        };

        // 3. Criar Imagem e Textos
        var img = document.createElement('img');
        img.src = imagemSrc;
        img.alt = "Cartaz " + titulo;

        var figcaption = document.createElement('figcaption');
        
        var h3 = document.createElement('h3');
        h3.textContent = titulo;
        
        var pGenero = document.createElement('p');
        pGenero.textContent = genero;
        
        var pSinopse = document.createElement('p');
        pSinopse.className = "sinopse-texto"; // Classe para esconder/mostrar via CSS
        pSinopse.textContent = sinopse;

        // 4. Montar a estrutura (colocar tudo dentro do figure)
        figcaption.appendChild(btnFechar);   
        figcaption.appendChild(h3);
        figcaption.appendChild(pGenero);
        figcaption.appendChild(pSinopse);
        figure.appendChild(img);
        figure.appendChild(figcaption);

        // 5. Adicionar à página
        divContainer.appendChild(figure);
    }

    // Depois de criar tudo, verifica se viemos de um link externo (do Programa)
    checkDirectLink();
}

// 3. Interatividade (abrir e fechar os cartazes)

/**
 * Abre o filme clicado e esconde os outros.
 */

function abrirFilme(elementoClicado) {
    // Se já estiver aberto, não faz nada
    if (elementoClicado.classList.contains('ativo')) return;

    // Primeiro, garante que todos estão fechados
    fecharTodos();

    // Esconde todos os outros (adiciona classe 'inativo')
    var todasFiguras = document.querySelectorAll('.gallery-container figure');
    todasFiguras.forEach(function(fig) {
        fig.classList.add('inativo');
    });

    // Destaca apenas o clicado (remove 'inativo', adiciona 'ativo')
    elementoClicado.classList.remove('inativo');
    elementoClicado.classList.add('ativo');
    
    // Scroll suave até ao filme
    elementoClicado.scrollIntoView({behavior: "smooth", block: "center"});
}

/**
 * Reseta a galeria: remove classes 'ativo' e 'inativo' de todos.
 */

function fecharTodos() {
    var todasFiguras = document.querySelectorAll('.gallery-container figure');
    todasFiguras.forEach(function(fig) {
        fig.classList.remove('ativo');
        fig.classList.remove('inativo');
    });
}

/**
 * Verifica se o URL tem um ID (ex: galeria.html#filme-2) e abre esse filme automaticamente.
 */

function checkDirectLink() {
    var hash = window.location.hash; // Obtém a parte "#filme-X"
    if (hash) {
        var idLimpo = hash.substring(1); // Remove o cardinal (#)
        var elementoAlvo = document.getElementById(idLimpo);
        
        if (elementoAlvo) {
            abrirFilme(elementoAlvo);
        }
    }
}

// 4. Formulário de inscrição

/**
 * Interceta o envio do formulário para não dar erro (já que não temos backend).
 */

function setupFormulario() {
    var form = document.querySelector('form');

    if (form) {
        form.onsubmit = function(evento) {
            // 1. Impede o comportamento padrão (não recarrega a página)
            evento.preventDefault();

            // 2. Mostra mensagem de sucesso
            alert("✅ Inscrição feita com sucesso!\n\nObrigado por te inscreveres no Frame Festival. Vais receber o bilhete no teu email em breve.");

            // 3. Limpa os campos
            form.reset();
        };
    }
}