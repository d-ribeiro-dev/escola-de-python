const baseQuestions = [
    { id: 'v1', topic: 'Variáveis', prompt: 'Observe as atribuições abaixo. O que será exibido?', code: 'fruta = "Maçã"\nfruta = "Banana"\nprint(fruta)', options: ['Maçã', 'Banana', 'Maçã e Banana', 'O Python apresentará um erro'], answer: 1, explain: 'A segunda atribuição substitui o valor anterior associado ao nome fruta. No print, a variável contém "Banana".' },
    { id: 'b1', topic: 'Tipos e funções nativas', prompt: 'Qual é o resultado de type(42).__name__?', code: '', options: ['str', 'float', 'int', 'bool'], answer: 2, explain: 'O valor 42 é um número inteiro. A função type identifica o tipo e __name__ retorna o nome da classe: int.' },
    { id: 'b2', topic: 'Funções nativas', prompt: 'O que len() retorna quando recebe uma string?', code: 'len("Python")', options: ['A quantidade de letras/caracteres', 'A última letra', 'O tipo da variável', 'A string em letras maiúsculas'], answer: 0, explain: 'len() retorna o comprimento da sequência. A palavra Python possui seis caracteres.' },
    { id: 'o1', topic: 'Operadores aritméticos', prompt: 'Qual valor será exibido?', code: 'resultado = 7 // 2\nprint(resultado)', options: ['3.5', '3', '1', '4'], answer: 1, explain: 'O operador // faz divisão inteira: descarta a parte decimal e retorna 3.' },
    { id: 'o2', topic: 'Operadores aritméticos', prompt: 'Qual valor será exibido?', code: 'resto = 7 % 2\nprint(resto)', options: ['3', '3.5', '1', '0'], answer: 2, explain: 'O operador % retorna o resto da divisão. Ao dividir 7 por 2, sobra 1.' },
    { id: 'o3', topic: 'Operadores de comparação', prompt: 'Qual será o resultado da expressão?', code: '10 > 5', options: ['10', '5', 'True', 'False'], answer: 2, explain: 'O operador > verifica se o valor à esquerda é maior. Como 10 é maior que 5, o resultado é True.' },
    { id: 'o4', topic: 'Operadores lógicos', prompt: 'Qual será o resultado da expressão?', code: '(3 < 5) and (5 < 8)', options: ['True', 'False', '3', 'Erro'], answer: 0, explain: 'As duas comparações são verdadeiras. O operador and só retorna True quando ambas as condições são verdadeiras.' },
    { id: 's1', topic: 'Strings · Índices', prompt: 'Qual caractere será exibido?', code: 'linguagem = "Python"\nprint(linguagem[0])', options: ['P', 'y', 'n', 'Python'], answer: 0, explain: 'Os índices começam em zero. O caractere da posição 0 é P.' },
    { id: 's2', topic: 'Strings · Fatiamento', prompt: 'Qual trecho será exibido?', code: 'linguagem = "Python"\nprint(linguagem[1:4])', options: ['Pyt', 'yth', 'tho', 'ython'], answer: 1, explain: 'O fatiamento inclui o índice inicial (1) e exclui o final (4). As posições 1, 2 e 3 formam yth.' },
    { id: 's3', topic: 'Strings · Métodos', prompt: 'Qual será o resultado?', code: 'palavra = "python"\nprint(palavra.upper())', options: ['python', 'Python', 'PYTHON', 'Upper'], answer: 2, explain: 'O método upper() devolve uma versão da string com todas as letras em maiúsculas.' }
];
const recoveryQuestions = [
    { id: 'rv1', topic: 'Variáveis', prompt: 'Uma variável recebe dois valores em sequência. Qual valor permanece associado a ela?', code: 'cor = "azul"\ncor = "verde"\nprint(cor)', options: ['azul', 'verde', 'azul e verde', 'Nenhum valor'], answer: 1, explain: 'A atribuição mais recente substitui a anterior. Ao final, cor contém "verde".' },
    { id: 'rb1', topic: 'Tipos e funções nativas', prompt: 'Qual é o tipo do valor 8.5?', code: 'type(8.5).__name__', options: ['int', 'str', 'float', 'bool'], answer: 2, explain: 'Números com parte decimal são do tipo float.' },
    { id: 'rb2', topic: 'Funções nativas', prompt: 'O que len("casa") retorna?', code: '', options: ['3', '4', '5', 'casa'], answer: 1, explain: 'A palavra casa tem quatro caracteres; len() retorna essa quantidade.' },
    { id: 'ro1', topic: 'Operadores aritméticos', prompt: 'Qual resultado aparece?', code: 'print(11 // 3)', options: ['3', '3.66', '2', '4'], answer: 0, explain: 'A divisão inteira // descarta a parte decimal. 11 dividido por 3 resulta em 3 como quociente inteiro.' },
    { id: 'ro2', topic: 'Operadores aritméticos', prompt: 'Qual é o resto desta divisão?', code: 'print(11 % 3)', options: ['3', '2', '1', '0'], answer: 1, explain: '3 cabe três vezes em 11 e sobram 2. O operador % retorna esse resto.' },
    { id: 'ro3', topic: 'Operadores de comparação', prompt: 'A expressão abaixo é verdadeira ou falsa?', code: '4 >= 4', options: ['True', 'False', '4', 'Erro'], answer: 0, explain: 'O operador >= significa maior ou igual. Como os valores são iguais, a expressão é True.' },
    { id: 'ro4', topic: 'Operadores lógicos', prompt: 'Qual é o resultado?', code: '(2 > 5) or (8 == 8)', options: ['True', 'False', '2', '8'], answer: 0, explain: 'A primeira condição é falsa e a segunda é verdadeira. Com or, basta uma condição verdadeira.' },
    { id: 'rs1', topic: 'Strings · Índices', prompt: 'Qual caractere está no índice 2?', code: 'palavra = "código"\nprint(palavra[2])', options: ['c', 'ó', 'd', 'i'], answer: 2, explain: 'A contagem começa em zero: c=0, ó=1, d=2. Portanto, o resultado é d.' },
    { id: 'rs2', topic: 'Strings · Fatiamento', prompt: 'O que será exibido?', code: 'texto = "estudar"\nprint(texto[0:3])', options: ['est', 'stu', 'estud', 'tud'], answer: 0, explain: 'O índice inicial entra e o índice final não entra. As posições 0, 1 e 2 formam est.' },
    { id: 'rs3', topic: 'Strings · Métodos', prompt: 'Qual será o resultado?', code: 'print("PYTHON".lower())', options: ['PYTHON', 'Python', 'python', 'lower'], answer: 2, explain: 'O método lower() devolve a string com letras minúsculas.' }
];  

// Avaliação — Nível Básico

const basicQuestions = [
    {
        id: "bas01",
        topic: "Condicionais",
        prompt: "Qual será o resultado exibido?",
        code: 'idade = 18\nif idade >= 18:\n    print("Adulto")\nelse:\n    print("Menor")',
        options: ["Menor", "Adulto", "18", "Erro"],
        answer: 1,
        explain: "A condição idade >= 18 é verdadeira."
    },
    {
        id: "bas02",
        topic: "Listas",
        prompt: "Qual valor será exibido?",
        code: 'numeros = [10, 20, 30, 40]\nprint(numeros[-1])',
        options: ["10", "20", "40", "Erro"],
        answer: 2,
        explain: "O índice -1 acessa o último elemento da lista."
    },
    {
        id: "bas03",
        topic: "Métodos de listas",
        prompt: "Qual será o conteúdo da lista?",
        code: 'frutas = ["Maçã", "Banana"]\nfrutas.append("Uva")\nprint(frutas)',
        options: [
            '["Uva"]',
            '["Maçã", "Banana"]',
            '["Uva", "Maçã", "Banana"]',
            '["Maçã", "Banana", "Uva"]'
        ],
        answer: 3,
        explain: "append() adiciona um elemento ao final da lista."
    },
    {
        id: "bas04",
        topic: "Laço for",
        prompt: "Quantas vezes o print será executado?",
        code: 'for i in range(2, 6):\n    print(i)',
        options: ["4", "6", "5", "3"],
        answer: 0,
        explain: "range(2, 6) gera os valores 2, 3, 4 e 5."
    },
    {
        id: "bas05",
        topic: "Dicionários",
        prompt: "Qual será o resultado?",
        code: 'produto = {"nome": "Teclado", "preco": 80}\nprint(produto["preco"])',
        options: ["Teclado", "preco", "80", "Erro"],
        answer: 2,
        explain: "A chave preco permite acessar o valor 80."
    },
    {
        id: "bas06",
        topic: "Laço while",
        prompt: "Qual será o último número exibido?",
        code: 'x = 1\nwhile x < 4:\n    print(x)\n    x += 1',
        options: ["4", "3", "2", "1"],
        answer: 1,
        explain: "O laço termina quando x chega a 4, sem imprimir esse valor."
    },
    {
        id: "bas07",
        topic: "Conversão de tipos",
        prompt: "Qual será o resultado?",
        code: 'numero = "15"\nprint(int(numero) + 5)',
        options: ["155", "15", "Erro", "20"],
        answer: 3,
        explain: "int() converte a string em inteiro antes da soma."
    },
    {
        id: "bas08",
        topic: "Completar código",
        type: "completion",
        prompt: "Preencha a lacuna com o operador de igualdade.",
        code: 'senha = 1234\nif senha ___ 1234:\n    print("Acesso permitido")',
        accepted: ["=="],
        explain: "O operador == compara dois valores."
    },
    {
        id: "bas09",
        topic: "Completar código",
        type: "completion",
        prompt: "Escreva apenas o nome da função nativa que calcula o comprimento de uma lista.",
        code: 'nomes = ["Ana", "Carlos", "Maria"]\nprint(___(nomes))',
        accepted: ["len"],
        explain: "len() retorna a quantidade de elementos."
    },
    {
        id: "bas10",
        topic: "Completar código",
        type: "completion",
        prompt: "Preencha a lacuna com a palavra-chave que interrompe o laço.",
        code: 'for numero in range(10):\n    if numero == 5:\n        ___\n    print(numero)',
        accepted: ["break"],
        explain: "break encerra imediatamente a execução do laço."
    }
];

// Recuperação — Nível Básico

const basicRecoveryQuestions = [
    {
        id: "rbas01",
        topic: "Condicionais",
        prompt: "Qual será o resultado exibido?",
        code: 'nota = 6\nif nota >= 7:\n    print("Aprovado")\nelse:\n    print("Revisar")',
        options: ["Aprovado", "6", "Revisar", "Erro"],
        answer: 2,
        explain: "Como 6 é menor que 7, o bloco else será executado."
    },
    {
        id: "rbas02",
        topic: "Listas",
        prompt: "Qual valor será exibido?",
        code: 'cores = ["Azul", "Verde", "Rosa"]\nprint(cores[1])',
        options: ["Azul", "Verde", "Rosa", "Erro"],
        answer: 1,
        explain: "Os índices começam em zero. O índice 1 acessa o segundo elemento."
    },
    {
        id: "rbas03",
        topic: "Métodos de listas",
        prompt: "Qual será o conteúdo da lista?",
        code: 'numeros = [10, 20, 30]\nnumeros.remove(20)\nprint(numeros)',
        options: ["[10, 30]", "[20, 30]", "[10, 20]", "[20]"],
        answer: 0,
        explain: "remove() elimina a primeira ocorrência do valor informado."
    },
    {
        id: "rbas04",
        topic: "Laço for",
        prompt: "Quantas vezes o print será executado?",
        code: 'for i in range(1, 10, 2):\n    print(i)',
        options: ["9", "10", "4", "5"],
        answer: 3,
        explain: "O range gera os valores 1, 3, 5, 7 e 9."
    },
    {
        id: "rbas05",
        topic: "Dicionários",
        prompt: "Qual será o resultado?",
        code: 'cliente = {"nome": "Ana", "idade": 25}\ncliente["idade"] = 26\nprint(cliente["idade"])',
        options: ["25", "26", "Ana", "Erro"],
        answer: 1,
        explain: "A atribuição atualiza o valor associado à chave idade."
    },
    {
        id: "rbas06",
        topic: "Laço while",
        prompt: "Quantas vezes o print será executado?",
        code: 'x = 5\nwhile x > 0:\n    print(x)\n    x -= 2',
        options: ["5", "2", "3", "4"],
        answer: 2,
        explain: "O laço imprime 5, 3 e 1 antes de terminar."
    },
    {
        id: "rbas07",
        topic: "Conversão de tipos",
        prompt: "Qual será o resultado?",
        code: 'numero = 25\nprint(str(numero) + "5")',
        options: ["255", "30", "25", "Erro"],
        answer: 0,
        explain: "str() converte o número em texto. O operador + concatena as strings."
    },
    {
        id: "rbas08",
        topic: "Completar código",
        type: "completion",
        prompt: "Preencha a lacuna com o operador de diferença.",
        code: 'numero = 8\nif numero ___ 10:\n    print("Diferente")',
        accepted: ["!="],
        explain: "O operador != verifica se dois valores são diferentes."
    },
    {
        id: "rbas09",
        topic: "Completar código",
        type: "completion",
        prompt: "Escreva apenas o nome da função nativa que retorna o maior valor.",
        code: 'numeros = [4, 9, 2]\nprint(___(numeros))',
        accepted: ["max"],
        explain: "max() retorna o maior elemento de uma coleção."
    },
    {
        id: "rbas10",
        topic: "Completar código",
        type: "completion",
        prompt: "Preencha a lacuna com a palavra-chave que pula para a próxima iteração.",
        code: 'for numero in range(5):\n    if numero == 2:\n        ___\n    print(numero)',
        accepted: ["continue"],
        explain: "continue pula o restante da iteração atual sem encerrar o laço."
    }
];