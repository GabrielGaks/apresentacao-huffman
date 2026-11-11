# Roteiro e falas

**Huffman por dentro** · Teoria dos Grafos, turma CC6M · Prof. Jairo Lucas · Universidade Vila Velha

Tempo: 26 a 29 minutos (o professor pede de 20 a 30), mais perguntas. Em cada slide, "avance N vezes" quer dizer apertar → (ou Espaço) N vezes antes de ir para o próximo slide, para revelar as animações enquanto fala.

| Quem | Slides | Parte | Tempo |
|---|---|---|---|
| Pessoa 1 | 1 a 5 | O problema, onde é usado, a ideia e os quatro passos | 5 min |
| Pessoa 2 | 6 e 7 | Huffman em ação: contar e montar a árvore | 3 min |
| Pessoa 3 | 8 e 9 | Huffman em ação: empacotar e decodificar | 3 min |
| Gabriel Aguiar | 10 a 13 | O limite do Huffman, o LZ77 compactando e abrindo, e os dois juntos | 7 min |
| Pessoa 4 | 14 a 17 | O programa e os resultados | 4 a 5 min |
| Pessoa 5 | 18 a 20 | Demonstração ao vivo, conclusão e perguntas | 5 a 7 min |

Gabriel Aguiar aparece com o nome; os demais estão como Pessoa 1 a 5, na ordem em que falam.

Atalhos: → / Espaço avança, ← volta, **F** tela cheia.

## O fio da história

A apresentação é uma história só, não cinco partes. Cada pessoa termina com uma pergunta e a próxima começa respondendo:

1. **O problema:** todo caractere custa 8 bits, até os repetidos. *E se o que aparece mais custasse menos?*
2. **A ideia:** frequente ganha código curto. *Mas como o algoritmo acha esses códigos?*
3. **Huffman em ação:** BANANA vira árvore, bits, arquivo e volta inteira. *Mas o Huffman olha letra por letra. E se o texto repete trechos inteiros?*
4. **LZ77 em ação:** trecho repetido vira "volte e copie"; os dois juntos, como no ZIP. *Onde tudo isso roda?*
5. **O programa:** a mesma árvore da BANANA aparece na tela. *Quanto isso economiza de verdade?*
6. **O resultado:** a BANANA de volta, o texto repetitivo, o arquivo do professor e a resposta à pergunta do início.

As falas de passagem abaixo já carregam essas perguntas. Usem a frase de gancho em vez de "agora o fulano vai falar".

## Antes de começar

- Rode `python app.py` dentro de `projeto_huffman_web/projeto_huffman_web` e deixe `http://127.0.0.1:8000` aberto em outra aba.
- Tenha copiado `ABRACADABRA ` repetido 200 vezes.
- Teste o arquivo do professor assim que ele for entregue.

---

## Pessoa 1 (slides 1 a 5)

**Slide 1: Huffman por dentro**

> Boa noite. Somos o grupo (diga os nomes dos integrantes). A pergunta do nosso trabalho é: como guardar a mesma informação usando menos espaço e, depois, recuperar tudo sem perder nada? Vamos mostrar o problema, a ideia do Huffman, o algoritmo funcionando passo a passo e o nosso programa ao vivo.

**Slide 2: O problema** (avance 2 vezes)

> Num arquivo de texto comum, cada caractere ocupa 8 bits, não importa qual seja. A palavra BANANA ocupa 48 bits.

> Só que as letras não aparecem na mesma quantidade. O A aparece três vezes; o B, uma. Mesmo assim, os dois custam o mesmo. Esse desperdício é o que a compactação ataca.

> E esse problema não é só nosso.

**Slide 3: Onde Huffman aparece** (avance 1 vez no final)

> Ele já foi resolvido, e vocês usam a solução todo dia sem perceber. Huffman está dentro do ZIP, do gzip, que comprime páginas na web, do PNG e do PDF. Todos usam um formato chamado DEFLATE. JPEG e MP3 usam Huffman na etapa final da compressão, e o HTTP/2 compacta cabeçalhos com um código Huffman fixo.

> E o DEFLATE é justamente LZ77 seguido de Huffman, a mesma combinação que implementamos. Guardem esse nome, LZ77, que ele volta na história. Mas primeiro: qual é a ideia do Huffman?

**Slide 4: A ideia em uma frase** (avance 2 vezes)

> David Huffman criou o método em 1952, ainda aluno no MIT, num trabalho da disciplina de Robert Fano. A ideia lembra o código Morse: a letra mais usada ganha o sinal mais curto.

> Com tamanho fixo, BANANA gasta 48 bits. Dando 0 para o A, 10 para o B e 11 para o N, cai para 9 bits.

> Um detalhe importante: nenhum código é o começo de outro. Por isso dá para ler os bits em sequência, sem separador, e nunca há ambiguidade.

> Falta saber como o algoritmo descobre esses códigos sozinho.

**Slide 5: Quatro passos** (avance 4 vezes, um passo por vez)

> Como o algoritmo chega nesses códigos? Em quatro passos. Primeiro, conta quantas vezes cada byte aparece. Segundo, coloca todos numa fila, do menos ao mais frequente. Terceiro, junta os dois menores num nó pai, devolve à fila e repete até sobrar um só nó, a raiz. Esse é o ponto que liga o trabalho à disciplina: o resultado é uma árvore binária. Quarto, percorre a árvore: esquerda vale 0, direita vale 1.

> Passagem: "Agora vamos ver esses quatro passos acontecendo de verdade, no nosso código, com a mesma BANANA."

---

## Pessoa 2 (slides 6 e 7)

**Slide 6: Contar** (avance 4 vezes)

> Vamos seguir a BANANA por dentro do programa, passo a passo. A linha destacada à esquerda é a que está executando no nosso huffman.py. A função cria 256 contadores zerados, um para cada byte possível. BANANA entra como 42, 41, 4E, 41, 4E, 41 em hexadecimal.

> O laço percorre os seis bytes e incrementa cada contador. No fim: A três vezes, B uma, N duas. O programa conta bytes, não letras; por isso acentos e quebras de linha funcionam.

**Slide 7: Combinar** (avance 4 vezes)

> Com as frequências contadas, o segundo passo é montar a árvore. A fila começa com B 1, N 2 e A 3. O código ordena e remove os dois menores, B e N, e cria um pai de peso 3. Agora sobram A 3 e o novo nó 3. Eles se unem na raiz, de peso 6.

> Percorrendo a árvore: A recebe 0, B recebe 10 e N recebe 11. BANANA vira 10, 0, 11, 0, 11, 0: nove bits.

> Passagem: "Temos o código de cada letra. Agora, como isso vira um arquivo de verdade, e como volta?"

---

## Pessoa 3 (slides 8 e 9)

**Slide 8: Empacotar** (avance 2 vezes)

> Temos os códigos, mas o computador grava bytes, não bits soltos. Os 9 bits viram dois bytes, 9B e 00, com 7 bits de preenchimento.

> O arquivo também precisa levar a árvore, senão ninguém consegue descompactar. Com a assinatura HUF1, o tamanho original e a árvore, BANANA fica com 24 bytes. Em textos tão pequenos, o cabeçalho pesa mais que a economia; em textos reais, ele se dilui.

**Slide 9: Decodificar** (avance 4 vezes)

> Falta provar que dá para voltar sem perder nada. Para isso, o código lê a árvore do arquivo e percorre os bits: 0 desce para a esquerda, 1 para a direita. Chegou numa folha, escreve a letra e volta para a raiz. 10 vira B, 0 vira A, 11 vira N, até formar BANANA.

> O tamanho guardado no cabeçalho diz quando parar, e os bits de preenchimento são ignorados. Antes de confiar no arquivo, o programa valida assinatura, árvore e tamanho.

> Passagem: "A BANANA voltou inteira. Mas repare: o Huffman olha letra por letra. E se o texto repetir trechos inteiros?"

---

## Gabriel Aguiar (slides 10 a 13)

**Slide 10: O limite do Huffman** (avance 3 vezes)

> Esse é o limite do Huffman. Repare em como ele pensa.

> (1) Ele olha letra por letra: conta quantas vezes cada uma aparece e dá o código mais curto para a mais frequente. Funciona muito bem, mas tem um limite: toda letra custa pelo menos 1 bit. Se o texto for a mesma frase repetida 200 vezes, ele vai pagar as 200 vezes, letra por letra. Ele não percebe que a frase se repete.

> (2) É aí que entra o LZ77, aquele do ZIP que citamos no começo. Ele foi criado em 1977 por Lempel e Ziv e é uma técnica separada do Huffman. Ele olha trechos: se um pedaço já apareceu antes, não escreve de novo. Grava uma instrução: "volte X casas e copie Y letras". Uma instrução ocupa 2 bytes e pode substituir até 18 letras de uma vez.

> (3) Ou seja: o Huffman explora frequência e o LZ77 explora repetição. Um não substitui o outro, e por isso o ZIP usa os dois juntos. Agora vamos ver o LZ77 funcionando, com o nosso código rodando ao lado.

**Slide 11: LZ77 compactando** (avance 11 vezes; acompanhe pelo desenho: as casas, os ponteiros e as variáveis; a linha do código que está rodando fica destacada à esquerda)

> O exemplo é ABC repetido três vezes e um X no fim. Reparem no `i`: é a casa que o programa está olhando agora.

> (1 a 4) Em cada casa, ele pega as 3 letras a partir dali e procura esse pedaço para trás. Em A, B e C não acha nada, porque não existe nada antes: o `candidato` vale −1 e a letra vai para a saída como está.

> (5) Na casa 3, as 3 letras são ABC, e agora ele acha esse pedaço na casa 0. As casas amarelas são de onde vem a cópia; as verdes, o que vai ser coberto. Ele procura 3 letras de uma vez porque menos que isso não compensa: a instrução também ocupa espaço.

> (6 a 8) Mas ele ainda não grava, porque não sabe até onde a repetição vai. Então estica, uma letra por vez. Olhem os ponteiros: o "atual" compara com o "anterior", que está sempre 3 casas atrás. A igual a A, B igual a B, C igual a C, e o `tamanho` sobe para 4, 5 e 6. Ele vai de uma em uma porque a repetição pode acabar no meio de um bloco.

> (9) O X é diferente do A: a repetição quebrou e o `tamanho` para em 6.

> (10) Só agora ele grava, e grava uma instrução só: `distancia` 3, `tamanho` 6, ou seja, volte 3, copie 6. O `i` pula as 6 casas de uma vez.

> (11) Sobra o X, que não aparece antes: vai como está. Dez letras viraram 3 letras, uma instrução e mais uma letra. Esta é uma versão simplificada do nosso código; o real ainda testa até 8 lugares onde o trecho apareceu e fica com a cópia mais longa.

> Ponte para o slide 12: "O arquivo virou letras e instruções misturadas. Mas, na volta, como o programa sabe o que é cada peça?"

**Slide 12: LZ77 abrindo o arquivo** (avance 13 vezes; em cima, os 7 bytes do arquivo, com o que está sendo lido aceso; embaixo, o texto sendo remontado)

> O arquivo do ABCABCABCX tem só estes 7 bytes.

> (1) O primeiro é um byte de controle, 10 em hexadecimal, que em bits é 0001 0000. Cada bit diz o que é a próxima peça: 0 é letra, 1 é instrução. No código, é o `flags`.

> (2 a 4) Bit 0, bit 1 e bit 2 valem 0: são letras. O programa copia os bytes direto: A, B e C aparecem na saída.

> (5) O bit 3 vale 1: é instrução. Ele lê os dois bytes 00 e 33 e tira deles a `distancia`, 3, e o `tamanho`, 3 mais 3, igual a 6. É o "volte 3, copie 6".

> (6 a 11) Agora a cópia. Olhem os ponteiros: o "lê" fica 3 casas atrás do "escreve". A cada clique, a letra do "lê" é copiada para o "escreve" e os dois andam uma casa. Repare que a partir da quarta cópia ele está copiando letras que ele mesmo acabou de escrever: é assim que voltar 3 casas dá para copiar 6 letras. No código, é só `saida.append(saida[-distancia])`, repetido 6 vezes.

> (12) O bit 4 vale 0: o último byte, 58, é a letra X.

> (13) Acabaram os bytes. O texto voltou inteiro: 7 bytes viraram 10 letras, e as 6 do meio nunca estiveram no arquivo, só a instrução.

**Slide 13: Primeiro repetição, depois frequência**

> E como aplicamos as duas juntas? A função `compactar_com_lz77` tem três linhas. Primeiro roda o LZ77. Depois entrega os tokens para o mesmo `compactar` do Huffman que vimos na BANANA, porque os tokens também são bytes, e alguns aparecem mais que outros. Por fim, grava a assinatura HUF2 com o tamanho original. Na volta, a ordem se inverte: primeiro Huffman, depois LZ77.

> Por isso, nesse modo, a árvore que o programa mostra é dos bytes dos tokens, não das letras. E combinar nem sempre ganha: em texto curto, as marcações extras podem até aumentar o arquivo.

> Passagem: "Vimos as duas técnicas com exemplos pequenos, a BANANA e o ABCABCABCX. Agora, onde tudo isso roda?"

---

## Pessoa 4 (slides 14 a 17)

**Slide 14: Arquitetura**

> Tudo o que vimos até aqui, a BANANA e o ABCABCABCX, roda dentro do nosso programa. Ele tem três partes. A interface, feita em HTML, CSS e JavaScript, é onde o usuário escolhe o TXT e vê os resultados. O app.py é o servidor local: recebe o arquivo, valida e chama os algoritmos. E o huffman.py é o coração: tem o Huffman e o LZ77 que acabamos de ver, escritos por nós, sem biblioteca pronta de compactação.

**Slide 15: Python monta, JSON leva, SVG desenha**

> E a árvore que montamos com a BANANA aparece na tela assim. Ela nasce como objetos `No` no Python, mas o navegador não entende objetos Python. Por isso a função `arvore_para_dicionario` converte a árvore de forma recursiva: se o nó é folha, devolve o símbolo e a frequência; se não, chama a si mesma para o filho esquerdo e para o direito. É a mesma lógica da árvore: cada nó resolve os seus dois filhos.

> O resultado vira JSON, o servidor envia, e o JavaScript desenha em SVG. A esquerda continua sendo 0 e a direita, 1: na tela, o A fica à esquerda com código 0, e B e N embaixo do nó de peso 3, exatamente como na BANANA.

**Slide 16: Árvore explorável**

> Na BANANA a árvore tem 5 nós, mas um texto de verdade gera centenas. Por isso ela é explorável: dá para arrastar, dar zoom sem perder nitidez, porque SVG é vetorial, reenquadrar com o Ajustar e exportar a árvore inteira. O programa também mostra o passo a passo da construção, com a mesma fila que vimos na BANANA.

> Ponte para o slide 17: "Falta a pergunta mais importante: quanto tudo isso economiza de verdade?"

**Slide 17: Resultados reais** (avance 2 vezes)

> A taxa de compactação é: tamanho original menos compactado, dividido pelo original, vezes cem. Positivo é economia.

> Lembram da BANANA? 6 bytes viraram 24: menos 300%. Cresceu por causa do cabeçalho com a árvore, que vimos no empacotamento.

> Agora um texto onde trechos inteiros se repetem, como o ABCABCABCX: ABRACADABRA repetido 200 vezes. São 2.400 bytes, que viram 731 com Huffman e 133 com LZ77 mais Huffman: 94,46% de economia.

> Passagem: "Esses números são de exemplos que nós escolhemos. O teste de verdade é com um arquivo que não preparamos."

---

## Pessoa 5 (slides 18 a 20)

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

> Este é o arquivo que o professor nos entregou agora. Aqui está o tamanho original e o de cada modo. Baixamos o .huf, descompactamos sem o TXT original, e o conteúdo volta idêntico.

**Slide 19: Conclusão**

> Começamos perguntando como guardar a mesma informação usando menos espaço. A resposta veio em duas partes: o Huffman dá códigos curtos para o que é frequente, e o LZ77 troca trechos repetidos por referências. Juntos, como no ZIP, podem ser muito eficientes, mas o cabeçalho sempre entra na conta. A economia muda conforme o arquivo; os bytes recuperados, nunca. Obrigado.

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
