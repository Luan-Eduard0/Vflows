var produtos = [];
var anexos = [];
function adicionarProduto() {
    var produtosDiv = $("#produtos");
    var produtoCount = produtosDiv.find(".produto").length + 1;
    var novoProduto = $("<fieldset></fieldset>").addClass("produto mb-3 fieldset-ampliado");
    var container = $("<div></div>").addClass("d-flex mb-3 align-items-center");

    novoProduto.html('<legend>Produto-' + produtoCount + '</legend');
    var produtoFields = `
    
    <div class="row">
    <div class="col-md-3"> <!-- Coluna para a imagem -->
        <img src="https://cdn-icons-png.flaticon.com/512/65/65998.png" alt="Ícone" class="round-image">
    </div>
    <div class="col-md-9"> 
        <div class="row"> 
            <div class="col-md-12"> 
                <div class="form-group">
                    <label for="produto${produtoCount}">Produto</label>
                    <input type="text" class="form-control" id="produto${produtoCount}" name="produto${produtoCount}">
                </div>
            </div>
            <div class="col-md-3">
                <div class="form-group">
                    <label for="undMedida${produtoCount}">UND.M Medida</label>
                    <select class="form-control select-with-arrow" id="undMedida${produtoCount}" name="undMedida${produtoCount}">
                    <option value="UND">UND</option>
                        <option value="M">M</option>
                    </select>
                </div>
            </div>
            <div class="col-md-3">
                <div class="form-group">
                    <label for="qtdEstoque${produtoCount}">QTD.E em Estoque</label>
                    <input type="text" class="form-control" id="qtdEstoque${produtoCount}" name="qtdEstoque${produtoCount}">
                </div>
            </div>
            <div class="col-md-3">
                <div class="form-group">
                    <label for="valorUnitario${produtoCount}">Valor Unitário</label>
                    <input type="text" class="form-control" id="valorUnitario${produtoCount}" name="valorUnitario${produtoCount}">
                </div>
            </div>
            <div class="col-md-3">
                <div class="form-group">
                    <label for="valorTotal${produtoCount}">Valor Total</label>
                    <input type="text" class="form-control" id="valorTotal${produtoCount}" name="valorTotal${produtoCount}" readonly>
                </div>
            </div>
        </div>
    </div>
</div>
`;
    novoProduto.append(produtoFields);


    var botaoRemover = $("<button></button>").addClass("btn btn-danger btn-trash mr-2");
    botaoRemover.click(function () {
        container.remove();
    });

    container.append(botaoRemover);
    container.append(novoProduto);
    produtosDiv.append(container);

    var produto = {
        id: produtoCount,
        nome: $(`#produto${produtoCount}`).val(),
        unidadeMedida: $(`#undMedida${produtoCount}`).val(),
        quantidadeEstoque: $(`#qtdEstoque${produtoCount}`).val(),
        valorUnitario: $(`#valorUnitario${produtoCount}`).val(),
        valorTotal: $(`#valorTotal${produtoCount}`).val()
    };
    produtos.push(produto);
}

var numeroAnexo = 1;

function incluirAnexo() {
    var anexosDiv = $("#anexos");

    var inputAnexo = document.createElement("input");
    inputAnexo.type = "file";

    inputAnexo.addEventListener("change", function () {
        if (inputAnexo.files.length > 0) {
            var file = inputAnexo.files[0];
            var nomeArquivo = file.name;
            var reader = new FileReader();
            reader.onload = function (event) {
                var conteudoArquivo = event.target.result;

                var novoAnexo = {
                    indice: numeroAnexo,
                    nomeArquivo: nomeArquivo,
                    blobArquivo: conteudoArquivo
                };
                numeroAnexo++;

                anexos.push(novoAnexo);

                // Exiba o nome do arquivo na interface do usuário
                var novoAnexoElement = $("<div></div>").text(nomeArquivo);
                anexosDiv.append(novoAnexoElement);
            };

            reader.readAsDataURL(file);
        }
    });

    inputAnexo.click();
}


function calcularValorTotal() {
    var valorUnitario = parseFloat($(this).val());
    var produtoCount = $(this).attr("id").replace("valorUnitario", "");
    var quantidade = parseFloat($(`#qtdEstoque${produtoCount}`).val());

    var valorTotal = valorUnitario * quantidade;
    $(`#valorTotal${produtoCount}`).val(valorTotal);
}
function validarCamposFornecedor() {
    var camposFornecedor = [
        "razaoSocial",
        "nome_fantasia",
        "cnpj",
        "endereco",
        "nome_pessoa_contato",
        "telefone",
        "email"
    ];

    for (var i = 0; i < camposFornecedor.length; i++) {
        var campoId = camposFornecedor[i];
        var valorCampo = $("#" + campoId).val();
        if (valorCampo.trim() === "") {
            alert("O campo " + campoId + " é obrigatório.");
            return false;
        }
    }

    return true;
}
function validarAnexos() {
    if (anexos.length === 0) {
        alert("Anexe pelo menos um documento.");
        return false;
    }
    return true;
}
function validarProdutos() {
    if (produtos.length === 0) {
        alert("Adicione pelo menos um produto.");
        return false;
    }
    return true;
}


function salvarFornecedor() {
    if (validarCamposFornecedor() && validarAnexos( ) && validarProdutos()) {
    var camposFornecedor = [
        "razaoSocial",
        "nome_fantasia",
        "cnpj",
        "endereco",
        "nome_pessoa_contato",
        "telefone",
        "email"
    ];

    var dadosFornecedor = {};

    camposFornecedor.forEach(function (campoId) {
        var campo = $("#" + campoId);
        var valor = campo.val();
        dadosFornecedor[campoId] = valor;
    });

    dadosFornecedor.produtos = [];

    $("input[id^='produto']").each(function() {
        var produtoCount = $(this).attr("id").replace("produto", "");
        var produto = {
            id: produtoCount,
            nome: $(this).val(),
            unidadeMedida: $(`#undMedida${produtoCount}`).val(),
            quantidadeEstoque: $(`#qtdEstoque${produtoCount}`).val(),
            valorUnitario: $(`#valorUnitario${produtoCount}`).val(),
            valorTotal: $(`#valorTotal${produtoCount}`).val()
        };
        dadosFornecedor.produtos.push(produto);
    });

    dadosFornecedor.anexos = anexos;

    var jsonFornecedor = JSON.stringify(dadosFornecedor);

    console.log("Dados do fornecedor:", jsonFornecedor);
}
}
$("#adicionarProduto").click(adicionarProduto);
$("#incluirAnexo").click(incluirAnexo);

$("#salvarFornecedor").click(function () {
    console.log("Botão salvar clicado");
    salvarFornecedor();
});


$(document).on("input", "input[id^='valorUnitario']", calcularValorTotal);
