let categorias = [];
let historico = [];

let historicoAberto = false;

carregar();

document
.getElementById("novaCategoria")
.addEventListener("click", adicionarCategoria);

document
.getElementById("exportar")
.addEventListener("click", exportarDados);

document
.getElementById("importar")
.addEventListener(
    "click",
    () => {
        document
        .getElementById(
            "arquivoImportacao"
        )
        .click();
    }
);

document
.getElementById(
    "arquivoImportacao"
)
.addEventListener(
    "change",
    importarDados
);

if (categorias.length === 0) {
    adicionarCategoria();
}

renderizar();

function adicionarCategoria() {

    categorias.push({
        id: Date.now(),
        nome: "Categoria",
        resultado: "",
        aberta: true,
        elementos: [
            {
                nome: "Elemento",
                peso: 5
            }
        ]
    });

    salvar();
    renderizar();
}

function alternarCategoria(categoriaIndex) {

    categorias[categoriaIndex].aberta =
        !categorias[categoriaIndex].aberta;

    salvar();
    renderizar();
}

function adicionarElemento(categoriaIndex) {

    categorias[categoriaIndex].elementos.push({
        nome: "Elemento",
        peso: 5
    });

    salvar();
    renderizar();
}

function excluirElemento(categoriaIndex, elementoIndex){

    categorias[categoriaIndex]
        .elementos
        .splice(elementoIndex, 1);

    salvar();
    renderizar();

}

function excluirCategoria(categoriaIndex){

    categorias.splice(categoriaIndex, 1);

    salvar();
    renderizar();

}

function alternarHistorico(){

    historicoAberto =
        !historicoAberto;

    renderizar();

}

function limparHistorico(){

    if(
        confirm(
            "Deseja apagar todo o histórico?"
        )
    ){

        historico = [];

        salvar();
        renderizar();

    }

}

function sortear(categoriaIndex) {

    const elementos =
        categorias[categoriaIndex].elementos;

    const saco = [];

    elementos.forEach(elemento => {

        const nome =
            elemento.nome.trim();

        if (!nome) return;

        for (let i = 0; i < elemento.peso; i++) {
            saco.push(nome);
        }

    });

    if (saco.length === 0) {
        return;
    }

    const sorteado =
        saco[Math.floor(Math.random() * saco.length)];

    categorias[categoriaIndex].resultado =
    sorteado;

historico.unshift({
    categoria:
        categorias[categoriaIndex].nome,
    resultado:
        sorteado
});

if(historico.length > 50){
    historico.pop();
}

salvar();
renderizar();
}

function renderizar() {

    const app =
        document.getElementById("app");

    app.innerHTML = "";

    categorias.forEach((categoria, categoriaIndex) => {

        const div =
            document.createElement("div");

        div.className = "categoria";

        div.innerHTML = `

           <div class="topo-categoria">

    <button class="btn-expandir">
        ${categoria.aberta ? "▼" : "▶"}
    </button>

    <input
        class="nome-categoria"
        value="${categoria.nome}"
    >

    <button class="btn-excluir-categoria">
        🗑️
    </button>

</div>

            <div class="lista-elementos"></div>

            <button class="btn-elemento">
                + Adicionar Elemento
            </button>

            <br>

            <div class="area-sorteio">

    <button class="btn-sortear">
        🎲 Sortear
    </button>

    <div class="resultado">
        ${categoria.resultado}
    </div>

</div>
            </div>

        `;

        const lista =
            div.querySelector(".lista-elementos");

        if (categoria.aberta) {

            categoria.elementos.forEach(
                (elemento, elementoIndex) => {

                    const linha =
                        document.createElement("div");

                    linha.className = "elemento";

                    let opcoes = "";

                    for (let i = 1; i <= 10; i++) {

                        opcoes += `
                            <option
                                value="${i}"
                                ${elemento.peso == i ? "selected" : ""}
                            >
                                ${i}
                            </option>
                        `;
                    }

                    linha.innerHTML = `

    <input
        value="${elemento.nome}"
    >

    <select>
        ${opcoes}
    </select>

    <button class="btn-excluir-elemento">
        ❌
    </button>

`;

                    const nomeInput =
                        linha.querySelector("input");

                    nomeInput.addEventListener(
                        "input",
                        (e) => {

                            categorias[categoriaIndex]
                                .elementos[elementoIndex]
                                .nome = e.target.value;

                            salvar();

                        }
                    );

                    const pesoSelect =
                        linha.querySelector("select");

                    pesoSelect.addEventListener(
                        "change",
                        (e) => {

                            categorias[categoriaIndex]
                                .elementos[elementoIndex]
                                .peso =
                                Number(e.target.value);

                            salvar();

                        }
                    );
                    
                    linha
.querySelector(".btn-excluir-elemento")
.addEventListener(
    "click",
    () => excluirElemento(
        categoriaIndex,
        elementoIndex
    )
);

                    lista.appendChild(linha);

                });

        } else {

            lista.style.display = "none";

            div.querySelector(".btn-elemento")
                .style.display = "none";

        }

        const nomeCategoria =
            div.querySelector(".nome-categoria");

        nomeCategoria.addEventListener(
            "input",
            (e) => {

                categorias[categoriaIndex]
                    .nome = e.target.value;

                salvar();

            }
        );

        div
        .querySelector(".btn-expandir")
        .addEventListener(
            "click",
            () => alternarCategoria(categoriaIndex)
        );
        
        div
.querySelector(".btn-excluir-categoria")
.addEventListener(
    "click",
    () => {

        if(
            confirm(
                "Excluir esta categoria?"
            )
        ){

            excluirCategoria(
                categoriaIndex
            );

        }

    }
);

        div
        .querySelector(".btn-elemento")
        .addEventListener(
            "click",
            () => adicionarElemento(categoriaIndex)
        );

        div
        .querySelector(".btn-sortear")
        .addEventListener(
            "click",
            () => sortear(categoriaIndex)
        );

        app.appendChild(div);

});

const historicoDiv =
    document.getElementById("historico");
    
historicoDiv.style.display =
    historicoAberto
        ? "block"
        : "none";

historicoDiv.innerHTML = "";

historico.forEach(registro => {

    const item =
        document.createElement("div");

    item.className =
        "item-historico";

    item.innerHTML = `
        <strong>
            ${registro.categoria}
        </strong>
        → ${registro.resultado}
    `;

    historicoDiv.appendChild(item);

});

const btnHistorico =
    document.getElementById(
        "btnHistorico"
    );

btnHistorico.textContent =
    historicoAberto
        ? "▼"
        : "▶";

btnHistorico.onclick =
    alternarHistorico;

document
.getElementById(
    "btnLimparHistorico"
)
.onclick =
    limparHistorico;

}

function exportarDados(){

    const dados = {
        categorias,
        historico
    };

    const json =
        JSON.stringify(
            dados,
            null,
            2
        );

    const blob =
        new Blob(
            [json],
            {
                type:
                "application/json"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "poe-e-pega.json";

    link.click();

    URL.revokeObjectURL(url);

}

function importarDados(event){

    const arquivo =
        event.target.files[0];

    if(!arquivo){
        return;
    }

    const leitor =
        new FileReader();

    leitor.onload =
        function(e){

            try{

                const dados =
                    JSON.parse(
                        e.target.result
                    );

                categorias =
                    dados.categorias || [];

                historico =
                    dados.historico || [];

                salvar();
                renderizar();

            }

            catch{

                alert(
                    "Arquivo inválido."
                );

            }

        };

    leitor.readAsText(
        arquivo
    );

}

function salvar() {

    localStorage.setItem(
        "sorteador-rpg",
        JSON.stringify({
            categorias,
            historico
        })
    );

}

function carregar() {

    const dados =
        localStorage.getItem("sorteador-rpg");

    if (dados) {

        const salvo =
            JSON.parse(dados);

        categorias =
            salvo.categorias || [];

        historico =
            salvo.historico || [];

    }

}