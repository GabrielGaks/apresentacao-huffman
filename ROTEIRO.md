# Roteiro e falas

**Huffman por dentro** · Teoria dos Grafos, turma CC6M · Prof. Jairo Lucas · Universidade Vila Velha

Tempo: 26 a 29 minutos (o professor pede de 20 a 30), mais perguntas. Em cada slide, "avance N vezes" quer dizer apertar → (ou Espaço) N vezes antes de ir para o próximo slide, para revelar as animações enquanto fala.

| Quem | Slides | Parte | Tempo |
|---|---|---|---|
| Arthur Vieira | 1 a 5 | O problema, onde é usado, a ideia e o resumo do algoritmo | 5 min |
| Davi Conde | 6 a 9 | Simulação completa com BANANA | 6 min |
| Gabriel Aguiar | 10 a 13 | O que é LZ77, o código dele executando e a combinação com Huffman | 6 min |
| Mateus Pastorre | 14 a 16 | Nosso programa e a árvore em SVG | 3 min |
| Thiago Gama | 17 a 20 | Resultados, demonstração, conclusão e perguntas | 6 a 8 min |

Atalhos: → / Espaço avança, ← volta, **F** tela cheia, **N** mostra as notas de fala.

## Antes de começar

- Rode `python app.py` dentro de `projeto_huffman_web/projeto_huffman_web` e deixe `http://127.0.0.1:8000` aberto em outra aba.
- Tenha copiado `ABRACADABRA ` repetido 200 vezes.
- Teste o arquivo do professor assim que ele for entregue.

---

## Arthur Vieira (slides 1 a 5)

**Slide 1: Huffman por dentro**

> Boa noite. Somos Arthur Prates, Arthur Vieira, Davi Conde, Gabriel Aguiar, Mateus Pastorre e Thiago Gama. A pergunta do nosso trabalho é: como guardar a mesma informação usando menos espaço e, depois, recuperar tudo sem perder nada? Vamos mostrar o problema, a ideia do Huffman, o algoritmo funcionando passo a passo e o nosso programa ao vivo.

**Slide 2: O problema** (avance 2 vezes)

> Num arquivo de texto comum, cada caractere ocupa 8 bits, não importa qual seja. A palavra BANANA ocupa 48 bits.

> Só que as letras não aparecem na mesma quantidade. O A aparece três vezes; o B, uma. Mesmo assim, os dois custam o mesmo. Esse desperdício é o que a compactação ataca.

**Slide 3: Onde Huffman aparece** (avance 1 vez no final)

> Isso não é só exercício de sala. Huffman está dentro do ZIP, do gzip, que comprime páginas na web, do PNG e do PDF. Todos usam um formato chamado DEFLATE. JPEG e MP3 usam Huffman na etapa final da compressão, e o HTTP/2 compacta cabeçalhos com um código Huffman fixo.

> E o DEFLATE é justamente LZ77 seguido de Huffman, a mesma combinação que implementamos.

**Slide 4: A ideia em uma frase** (avance 2 vezes)

> David Huffman criou o método em 1952, ainda aluno no MIT, num trabalho da disciplina de Robert Fano. A ideia lembra o código Morse: a letra mais usada ganha o sinal mais curto.

> Com tamanho fixo, BANANA gasta 48 bits. Dando 0 para o A, 10 para o B e 11 para o N, cai para 9 bits.

> Um detalhe importante: nenhum código é o começo de outro. Por isso dá para ler os bits em sequência, sem separador, e nunca há ambiguidade.

**Slide 5: Quatro passos** (avance 4 vezes, um passo por vez)

> Como o algoritmo chega nesses códigos? Em quatro passos. Primeiro, conta quantas vezes cada byte aparece. Segundo, coloca todos numa fila, do menos ao mais frequente. Terceiro, junta os dois menores num nó pai, devolve à fila e repete até sobrar um só nó, a raiz. Esse é o ponto que liga o trabalho à disciplina: o resultado é uma árvore binária. Quarto, percorre a árvore: esquerda vale 0, direita vale 1.

> Passagem: "O Davi vai mostrar isso executando no nosso código, com BANANA."

---

## Davi Conde (slides 6 a 9)

**Slide 6: Contar** (avance 4 vezes)

> A linha destacada à esquerda é a que está executando no nosso huffman.py. A função cria 256 contadores zerados, um para cada byte possível. BANANA entra como 42, 41, 4E, 41, 4E, 41 em hexadecimal.

> O laço percorre os seis bytes e incrementa cada contador. No fim: A três vezes, B uma, N duas. O programa conta bytes, não letras; por isso acentos e quebras de linha funcionam.

**Slide 7: Combinar** (avance 4 vezes)

> A fila começa com B 1, N 2 e A 3. O código ordena e remove os dois menores, B e N, e cria um pai de peso 3. Agora sobram A 3 e o novo nó 3. Eles se unem na raiz, de peso 6.

> Percorrendo a árvore: A recebe 0, B recebe 10 e N recebe 11. BANANA vira 10, 0, 11, 0, 11, 0: nove bits.

**Slide 8: Empacotar** (avance 2 vezes)

> O computador grava bytes, não bits soltos. Os 9 bits viram dois bytes, 9B e 00, com 7 bits de preenchimento.

> O arquivo também precisa levar a árvore, senão ninguém consegue descompactar. Com a assinatura HUF1, o tamanho original e a árvore, BANANA fica com 24 bytes. Em textos tão pequenos, o cabeçalho pesa mais que a economia; em textos reais, ele se dilui.

**Slide 9: Decodificar** (avance 4 vezes)

> Para voltar, o código lê a árvore do arquivo e percorre os bits: 0 desce para a esquerda, 1 para a direita. Chegou numa folha, escreve a letra e volta para a raiz. 10 vira B, 0 vira A, 11 vira N, até formar BANANA.

> O tamanho guardado no cabeçalho diz quando parar, e os bits de preenchimento são ignorados. Antes de confiar no arquivo, o programa valida assinatura, árvore e tamanho.

> Passagem: "O Huffman aproveita a frequência. O Gabriel vai mostrar uma técnica que aproveita repetições."

---

## Gabriel Aguiar (slides 10 a 13)

**Slide 10: Repetiu? Aponte para trás**

> Até aqui vimos o Huffman sozinho. Agora um ponto importante: o Huffman não depende do LZ77. São duas técnicas diferentes, e o nosso projeto escolheu combinar as duas, como o enunciado sugeria e como o ZIP faz.

> O LZ77 foi criado em 1977 por Lempel e Ziv. A ideia é: se um trecho já apareceu antes, em vez de escrever de novo, a gente aponta para trás. Em ABCABCABC, gravamos A, B e C normalmente, e o resto vira "volte 3 posições e copie 6".

> Repare na diferença embaixo do slide: o Huffman aproveita letras que aparecem muito; o LZ77 aproveita sequências que se repetem.

**Slide 11: LZ77 executando** (avance 4 vezes; a linha destacada é a que está rodando em `lz77_compactar`)

> 1. O laço anda pelo texto com um índice i. Em cada posição, ele pega os próximos 3 bytes e procura esse trecho antes, com `rfind`. Para A, B e C não existe nada antes, então cai no else: `saida.append(dados[i])` grava o byte como está, um literal, e i anda uma casa.

> 2. Em i igual a 3, o trecho é ABC. O `rfind` procura da direita para a esquerda, só dentro da janela de 4.095 bytes, e encontra ABC na posição 0.

> 3. Achar 3 letras é o mínimo. O while compara as próximas letras uma por uma, enquanto forem iguais e até no máximo 18, e aumenta o tamanho. Aqui as 6 letras restantes batem com as de 3 posições antes. Repare que a cópia pode passar por cima de onde ela mesma começou: é isso que permite 3 letras virarem 6.

> 4. Como o tamanho é pelo menos 3, vira referência: distância é i menos a posição achada, 3, e tamanho 6. O i pula 6 casas de uma vez. Nove letras viraram 3 literais e 1 referência. O código ainda testa até 8 candidatos por posição e fica com o maior.

**Slide 12: LZ77 de volta** (avance 4 vezes; código de `lz77_descompactar`)

> Essas peças viram bytes assim: 10, 41, 42, 43, 00, 33.

> 1. O primeiro byte é de controle. Cada bit diz o que é cada uma das próximas 8 peças: 0 é literal, 1 é referência. 10 em hexadecimal é 0001 0000: só a quarta peça é referência. O código testa isso com `flags & (1 << (7 - bit))`.

> 2. Bit 0: `saida.append(tokens[i])`, copia o byte direto. Saem A, B e C.

> 3. Bit 1: a referência ocupa 2 bytes, 00 e 33. Os 12 primeiros bits são a distância, até 4.095, e os 4 últimos são o tamanho menos 3, por isso o tamanho vai de 3 a 18. Aqui: distância 3, tamanho 3 mais 3, igual a 6. Menos de 3 não compensa, porque a referência já gasta 2 bytes.

> 4. O for copia `saida[-distancia]` seis vezes: sempre a letra 3 posições atrás, inclusive as que acabou de escrever. Volta ABCABCABC. Seis bytes viraram nove.

**Slide 13: Primeiro repetição, depois frequência**

> E como aplicamos as duas juntas? A função `compactar_com_lz77` tem três linhas. Primeiro roda o LZ77. Depois entrega os tokens para o mesmo `compactar` do Huffman que o Davi mostrou, porque os tokens também são bytes, e alguns aparecem mais que outros. Por fim, grava a assinatura HUF2 com o tamanho original. Na volta, a ordem se inverte: primeiro Huffman, depois LZ77.

> Por isso, nesse modo, a árvore que o programa mostra é dos bytes dos tokens, não das letras. E combinar nem sempre ganha: em texto curto, as marcações extras podem até aumentar o arquivo.

> Passagem: "O Mateus vai mostrar como isso virou um programa."

---

## Mateus Pastorre (slides 14 a 16)

**Slide 14: Arquitetura**

> O programa tem três partes. A interface, em HTML, CSS e JavaScript, escolhe o arquivo e mostra os resultados. O app.py é o servidor local, que valida e responde às requisições. O huffman.py tem o Huffman e o LZ77, implementados por nós, sem biblioteca pronta de compactação.

**Slide 15: Python monta, JSON leva, SVG desenha**

> A árvore nasce como objetos `No` no Python. A função `arvore_para_dicionario` é recursiva: se o nó é folha, devolve símbolo e frequência; se não, chama a si mesma para o filho esquerdo e para o direito. O resultado vira JSON, o servidor envia, e o JavaScript desenha em SVG. No desenho, esquerda continua sendo 0 e direita, 1: é a mesma árvore que o algoritmo usou.

**Slide 16: Árvore explorável**

> Como uma árvore de um texto grande tem muitos nós, dá para arrastar, dar zoom sem perder nitidez, ajustar o enquadramento e exportar a árvore inteira em SVG.

> Passagem: "O Thiago vai mostrar os números e o programa funcionando."

---

## Thiago Gama (slides 17 a 20)

**Slide 17: Resultados reais** (avance 2 vezes)

> A taxa de compactação é: tamanho original menos compactado, dividido pelo original, vezes cem. Positivo é economia.

> BANANA tem 6 bytes e o arquivo final, 24: menos 300%. Cresceu por causa do cabeçalho, como o Davi mostrou.

> Em ABRACADABRA repetido 200 vezes, 2.400 bytes viram 731 com Huffman e 133 com LZ77 mais Huffman: 94,46% de economia.

**Slide 18: Demonstração ao vivo**

Passos no programa:

1. Escolha o TXT fornecido pelo professor.
2. Selecione **Comparar os dois** e compacte.
3. Mostre os tamanhos, a taxa e alterne as árvores.
4. Abra o passo a passo da árvore.
5. Mostre a amostra hexadecimal e os bits.
6. Baixe o `.huf`.
7. Na aba Descompactar, envie só o `.huf`.
8. Mostre que o texto restaurado é igual ao original.

> Este é o arquivo que recebemos agora. Aqui está o tamanho original e o de cada modo. Baixamos o .huf, descompactamos sem o TXT original, e o conteúdo volta idêntico.

**Slide 19: Conclusão**

> O Huffman reduz o custo usando a frequência. O LZ77 reduz repetições. Juntos, como no ZIP, podem ser muito eficientes, mas o cabeçalho sempre entra na conta. A economia muda conforme o arquivo; os bytes recuperados, nunca. Obrigado.

**Slide 20: Perguntas** (qualquer um responde)

- **Por que bytes e não letras?** Para preservar exatamente o UTF-8, com acentos e quebras de linha.
- **Empates mudam a árvore?** Podem gerar códigos diferentes, todos válidos.
- **LZ77 sempre melhora?** Não. Depende de quanta repetição o arquivo tem.
- **Por que salvar a árvore no arquivo?** Sem ela, não dá para transformar os bits de volta em letras.
- **Quem desenha o SVG?** O Python monta a estrutura; o JavaScript desenha.

## Plano de contingência

- Se o programa falhar ao vivo, use os números do slide 17 e os slides 6 a 9 como demonstração.
- Se o arquivo do professor for pequeno e crescer, explique como efeito esperado do cabeçalho.
- Se os códigos diferirem do exemplo, verifique empate de frequências antes de afirmar erro.
- Com pouco tempo, reduza os slides 14 e 16 a uma frase cada; não corte a demonstração.
