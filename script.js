const servicos = [
  {
    id: "s1",
    nome: "Faxina residencial",
    categoria: "Residencial",
    preco: 159,
    duracao: "4–6 horas",
    descricao: "Uma limpeza completa para a rotina da sua casa.",
    imagem: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "s2",
    nome: "Limpeza de apartamento",
    categoria: "Residencial",
    preco: 129,
    duracao: "3–5 horas",
    descricao: "Mais organização e cuidado para seu apartamento.",
    imagem: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "s3",
    nome: "Limpeza pesada",
    categoria: "Especializada",
    preco: 249,
    duracao: "5–8 horas",
    descricao: "Uma limpeza reforçada para ambientes que precisam de atenção.",
    imagem: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "s4",
    nome: "Limpeza pós-obra",
    categoria: "Especializada",
    preco: 349,
    duracao: "Sob avaliação",
    descricao: "Cuidado especial após reformas e obras.",
    imagem: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "s5",
    nome: "Limpeza comercial",
    categoria: "Comercial",
    preco: 219,
    duracao: "Sob avaliação",
    descricao: "Mais cuidado e organização para seu espaço de trabalho.",
    imagem: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "s6",
    nome: "Limpeza de cozinha",
    categoria: "Especializada",
    preco: 119,
    duracao: "2–4 horas",
    descricao: "Atenção especial às superfícies e à organização da cozinha.",
    imagem: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=700&q=80"
  }
];

const produtos = [
  {
    id: "p1",
    nome: "Kit básico de limpeza",
    preco: 49.90,
    categoria: "Kits",
    descricao: "Itens essenciais para o dia a dia.",
    imagem: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p2",
    nome: "Kit para cozinha",
    preco: 39.90,
    categoria: "Kits",
    descricao: "Uma seleção para facilitar a limpeza da cozinha.",
    imagem: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p3",
    nome: "Kit de panos de microfibra",
    preco: 24.90,
    categoria: "Acessórios",
    descricao: "Panos reutilizáveis para diferentes superfícies.",
    imagem: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p4",
    nome: "Acessórios para limpeza",
    preco: 34.90,
    categoria: "Acessórios",
    descricao: "Acessórios úteis para a rotina da casa.",
    imagem: "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=600&q=80"
  }
];

// Elementos principais da página
const listaServicos = document.getElementById("lista-servicos");
const listaProdutos = document.getElementById("lista-produtos");
const campoBusca = document.getElementById("campo-busca");
const quantidadeCarrinho = document.getElementById("quantidade-carrinho");
const itensCarrinho = document.getElementById("itens-carrinho");
const subtotalElemento = document.getElementById("subtotal");

const painelCarrinho = document.getElementById("carrinho-painel");
const fundoModal = document.getElementById("fundo-modal");
const modalAgendamento = document.getElementById("modal-agendamento");

let categoriaAtual = "Todos";
let carrinho = [];
let itemAgendamento = null;
let retornoCarrinho = false;
let ultimoFoco = null;
let temporizadorNotificacao;

// Formata os preços em reais
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

// Evita inserir textos dos dados diretamente como HTML
function escaparHTML(texto) {
  return String(texto).replace(/[&<>"']/g, caractere => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[caractere]);
}

// Normaliza a pesquisa, inclusive os acentos
function normalizar(texto) {
  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// Mostra uma mensagem na tela
function notificar(mensagem) {
  const elemento = document.getElementById("notificacao");

  elemento.textContent = mensagem;
  elemento.classList.add("visivel");

  clearTimeout(temporizadorNotificacao);

  temporizadorNotificacao = setTimeout(() => {
    elemento.classList.remove("visivel");
  }, 2800);
}

// Cria os cartões de serviços
function renderizarServicos() {
  const pesquisa = normalizar(campoBusca.value);

  const encontrados = servicos.filter(servico => {
    const correspondeCategoria =
      categoriaAtual === "Todos" ||
      servico.categoria === categoriaAtual;

    const texto = normalizar(
      `${servico.nome} ${servico.descricao} ${servico.categoria}`
    );

    return correspondeCategoria &&
      (!pesquisa || texto.includes(pesquisa));
  });

  listaServicos.innerHTML = encontrados.map(servico => `
    <article class="card-servico">
      <img
        src="${escaparHTML(servico.imagem)}"
        alt="${escaparHTML(servico.nome)}"
        loading="lazy">

      <div class="card-conteudo">
        <span class="card-categoria">
          ${escaparHTML(servico.categoria)}
        </span>

        <h3>${escaparHTML(servico.nome)}</h3>

        <p class="card-descricao">
          ${escaparHTML(servico.descricao)}
        </p>

        <div class="card-info">
          <span>◷ ${escaparHTML(servico.duracao)}</span>
          <span>Agendamento desejado</span>
        </div>

        <div class="card-info">
          <div>
            <div class="card-preco">
              ${formatarPreco(servico.preco)}
            </div>
            <small>Preço demonstrativo</small>
          </div>
        </div>

        <button class="botao botao-principal botao-card"
          data-agendar="${escaparHTML(servico.id)}">
          Agendar serviço
        </button>
      </div>
    </article>
  `).join("");

  document.getElementById("vazio-servicos").hidden =
    encontrados.length > 0;
}

// Cria os cartões de produtos
function renderizarProdutos() {
  const pesquisa = normalizar(campoBusca.value);

  const encontrados = produtos.filter(produto => {
    const texto = normalizar(
      `${produto.nome} ${produto.descricao} ${produto.categoria}`
    );

    return !pesquisa || texto.includes(pesquisa);
  });

  listaProdutos.innerHTML = encontrados.map(produto => `
    <article class="card-produto">
      <div class="produto-imagem">
        <img
          src="${escaparHTML(produto.imagem)}"
          alt="${escaparHTML(produto.nome)}"
          loading="lazy">

        <span class="selo-produto">
          ${escaparHTML(produto.categoria)}
        </span>
      </div>

      <div class="produto-conteudo">
        <h3>${escaparHTML(produto.nome)}</h3>
        <p>${escaparHTML(produto.descricao)}</p>

        <div class="produto-rodape">
          <span class="produto-preco">
            ${formatarPreco(produto.preco)}
          </span>

          <button class="botao-adicionar"
            data-adicionar="${escaparHTML(produto.id)}"
            aria-label="Adicionar ${escaparHTML(produto.nome)} ao carrinho">
            +
          </button>
        </div>
      </div>
    </article>
  `).join("");

  document.getElementById("vazio-produtos").hidden =
    encontrados.length > 0;
}

// Atualiza os resultados quando o cliente pesquisa
function pesquisar() {
  renderizarServicos();
  renderizarProdutos();
}

campoBusca.addEventListener("input", pesquisar);

document.getElementById("botao-buscar").addEventListener("click", () => {
  pesquisar();

  document.getElementById("servicos").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

// Filtro de categorias
document.getElementById("categorias").addEventListener("click", evento => {
  const botao = evento.target.closest("[data-categoria]");

  if (!botao) return;

  categoriaAtual = botao.dataset.categoria;

  document.querySelectorAll(".categoria").forEach(categoria => {
    categoria.classList.toggle("ativa", categoria === botao);
  });

  renderizarServicos();
});

// Adiciona um produto ou serviço ao carrinho
function adicionarAoCarrinho(item, tipo) {
  const idCarrinho = `${tipo}-${item.id}`;

  const existente = carrinho.find(
    itemCarrinho => itemCarrinho.idCarrinho === idCarrinho
  );

  if (existente) {
    existente.quantidade++;
  } else {
    carrinho.push({
      idCarrinho,
      id: item.id,
      tipo,
      nome: item.nome,
      preco: item.preco,
      quantidade: 1
    });
  }

  atualizarCarrinho();
  notificar(`${item.nome} adicionado ao carrinho!`);
}

// Botões de agendamento e de adicionar produtos
document.addEventListener("click", evento => {
  const botaoAdicionar = evento.target.closest("[data-adicionar]");
  const botaoAgendar = evento.target.closest("[data-agendar]");

  if (botaoAdicionar) {
    const produto = produtos.find(
      item => item.id === botaoAdicionar.dataset.adicionar
    );

    if (produto) adicionarAoCarrinho(produto, "produto");
  }

  if (botaoAgendar) {
    const servico = servicos.find(
      item => item.id === botaoAgendar.dataset.agendar
    );

    if (servico) abrirAgendamento(servico);
  }
});

// Atualiza quantidade e subtotal
function atualizarCarrinho() {
  const quantidade = carrinho.reduce(
    (total, item) => total + item.quantidade, 0
  );

  const subtotal = carrinho.reduce(
    (total, item) => total + item.preco * item.quantidade, 0
  );

  quantidadeCarrinho.textContent = quantidade;
  subtotalElemento.textContent = formatarPreco(subtotal);

  document.getElementById("carrinho-vazio").hidden =
    carrinho.length > 0;

  itensCarrinho.innerHTML = carrinho.map(item => `
    <div class="item-carrinho">
      <div>
        <h3>${escaparHTML(item.nome)}</h3>
        <p>${formatarPreco(item.preco * item.quantidade)}</p>

        <div class="controles-quantidade">
          <button data-diminuir="${escaparHTML(item.idCarrinho)}"
            aria-label="Diminuir quantidade">−</button>

          <span>${item.quantidade}</span>

          <button data-aumentar="${escaparHTML(item.idCarrinho)}"
            aria-label="Aumentar quantidade">+</button>
        </div>
      </div>

      <div class="item-acoes">
        <span>${item.tipo === "servico" ? "Serviço" : "Produto"}</span>

        <button class="remover-item"
          data-remover="${escaparHTML(item.idCarrinho)}">
          Remover
        </button>
      </div>
    </div>
  `).join("");

  document.getElementById("finalizar-pedido").disabled =
    carrinho.length === 0;
}

// Controla os botões de quantidade e remoção
itensCarrinho.addEventListener("click", evento => {
  const botao = evento.target.closest("button");
  if (!botao) return;

  const itemId =
    botao.dataset.aumentar ||
    botao.dataset.diminuir ||
    botao.dataset.remover;

  const item = carrinho.find(
    produto => produto.idCarrinho === itemId
  );

  if (!item) return;

  if (botao.dataset.aumentar !== undefined) {
    item.quantidade++;
  } else if (botao.dataset.diminuir !== undefined) {
    item.quantidade--;

    if (item.quantidade <= 0) {
      carrinho = carrinho.filter(
        produto => produto.idCarrinho !== itemId
      );
    }
  } else {
    carrinho = carrinho.filter(
      produto => produto.idCarrinho !== itemId
    );
  }

  atualizarCarrinho();
});

// Abre e fecha o carrinho
function abrirCarrinho() {
  ultimoFoco = document.activeElement;

  painelCarrinho.classList.add("aberto");
  fundoModal.classList.add("visivel");

  painelCarrinho.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-aberto");

  document.getElementById("fechar-carrinho").focus();
}

function fecharCarrinho() {
  painelCarrinho.classList.remove("aberto");
  fundoModal.classList.remove("visivel");

  painelCarrinho.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-aberto");

  if (!modalAgendamento.hidden) {
    document.body.classList.add("modal-aberto");
  }

  if (ultimoFoco && ultimoFoco.isConnected) {
    ultimoFoco.focus();
  }
}

document.getElementById("abrir-carrinho")
  .addEventListener("click", abrirCarrinho);

document.getElementById("fechar-carrinho")
  .addEventListener("click", fecharCarrinho);

fundoModal.addEventListener("click", fecharCarrinho);

// Abre o formulário de agendamento
function abrirAgendamento(servico = null, veioDoCarrinho = false) {
  itemAgendamento = servico;
  retornoCarrinho = veioDoCarrinho;
  ultimoFoco = document.activeElement;

  if (veioDoCarrinho) {
    fecharCarrinho();
  }

  const titulo = document.getElementById("titulo-agendamento");
  const resumo = document.getElementById("resumo-agendamento");

  if (servico) {
    titulo.textContent = "Agendar serviço";
    resumo.textContent =
      `${servico.nome} — ${formatarPreco(servico.preco)} (valor demonstrativo).`;
  } else {
    titulo.textContent = "Finalizar pedido";
    resumo.textContent =
      `Confira seus dados. Subtotal atual: ${subtotalElemento.textContent}.`;
  }

  const campoData = document.getElementById("data-agendamento");

  // Não permite escolher uma data anterior a hoje
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");

  campoData.min = `${ano}-${mes}-${dia}`;

  modalAgendamento.hidden = false;
  document.body.classList.add("modal-aberto");

  document.getElementById("fechar-agendamento").focus();
}

function fecharAgendamento() {
  modalAgendamento.hidden = true;
  document.body.classList.remove("modal-aberto");

  if (retornoCarrinho) {
    abrirCarrinho();
  } else if (ultimoFoco && ultimoFoco.isConnected) {
    ultimoFoco.focus();
  }
}

document.getElementById("fechar-agendamento")
  .addEventListener("click", fecharAgendamento);

// Continuar pedido a partir do carrinho
document.getElementById("finalizar-pedido")
  .addEventListener("click", () => {
    if (carrinho.length === 0) {
      notificar("Adicione um item antes de continuar.");
      return;
    }

    abrirAgendamento(null, true);
  });

// Formata o CEP enquanto o cliente digita
document.getElementById("cep").addEventListener("input", evento => {
  const numeros = evento.target.value.replace(/\D/g, "").slice(0, 8);

  evento.target.value = numeros.length > 5
    ? `${numeros.slice(0, 5)}-${numeros.slice(5)}`
    : numeros;
});

// Valida e apresenta uma confirmação demonstrativa
document.getElementById("form-agendamento")
  .addEventListener("submit", evento => {
    evento.preventDefault();

    const cep = document.getElementById("cep").value;
    const data = document.getElementById("data-agendamento").value;

    if (cep.replace(/\D/g, "").length !== 8) {
      notificar("Informe um CEP válido com 8 números.");
      document.getElementById("cep").focus();
      return;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataEscolhida = new Date(`${data}T12:00:00`);

    if (!data || dataEscolhida < hoje) {
      notificar("Escolha uma data válida, a partir de hoje.");
      return;
    }

    const pedido = {
      tipo: itemAgendamento ? "Agendamento de serviço" : "Pedido da loja",
      servico: itemAgendamento ? itemAgendamento.nome : null,
      itens: carrinho.map(item => ({
        nome: item.nome,
        quantidade: item.quantidade,
        preco: item.preco
      })),
      tipoImovel: document.getElementById("tipo-imovel").value,
      data,
      horario: document.getElementById("horario-agendamento").value,
      cep,
      observacoes: document.getElementById("observacoes").value,
      subtotal: carrinho.reduce(
        (total, item) => total + item.preco * item.quantidade, 0
      ) + (itemAgendamento ? itemAgendamento.preco : 0)
    };

    // Por enquanto, apenas exibe o pedido no navegador.
    console.log("Pedido demonstrativo Brilhaê:", pedido);

    modalAgendamento.hidden = true;
    document.body.classList.remove("modal-aberto");

    document.getElementById("form-agendamento").reset();

    if (itemAgendamento) {
      adicionarAoCarrinho(itemAgendamento, "servico");
    }

    itemAgendamento = null;
    retornoCarrinho = false;

    notificar("Pedido demonstrativo registrado nesta sessão!");

    // O pedido não é enviado a um servidor.
    // A confirmação não significa que o serviço foi reservado.
  });

// Fecha janelas usando a tecla Escape
document.addEventListener("keydown", evento => {
  if (evento.key !== "Escape") return;

  if (!modalAgendamento.hidden) {
    fecharAgendamento();
  } else if (painelCarrinho.classList.contains("aberto")) {
    fecharCarrinho();
  }
});

// Inicia a página com os dados de demonstração
renderizarServicos();
renderizarProdutos();
atualizarCarrinho();
