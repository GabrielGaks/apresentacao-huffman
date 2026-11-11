# Roteiro e falas

**Huffman por dentro** · Teoria dos Grafos, turma CC6M · Prof. Jairo Lucas · Universidade Vila Velha

Tempo: 26 a 29 minutos (o professor pede de 20 a 30), mais perguntas. Em cada slide, "avance N vezes" quer dizer apertar → (ou Espaço) N vezes antes de ir para o próximo slide, para revelar as animações enquanto fala.

| Quem | Slides | Parte | Tempo |
|---|---|---|---|
| Pessoa 1 | 1 a 5 | O problema, onde é usado, a ideia e os quatro passos | 5 min |
| Pessoa 2 | 6 e 7 | Huffman em ação: contar e montar a árvore | 3 min |
| Pessoa 3 | 8 e 9 | Huffman em ação: empacotar e decodificar | 3 min |
| Gabriel Aguiar | 10 a 13 | O limite do Huffman, o LZ77 em ação e os dois juntos | 6 min |
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

**Slide 10: O limite do Huffman** (avance 16 vezes, um passo por clique; a caixa verde embaixo das letras acompanha cada passo)

> Olhem este texto: ABC repetido três vezes e um X no final.

> (1) O Huffman conta: A, B e C aparecem 3 vezes, X uma vez. Cada letra ganha um código de 2 bits, e o texto cai para 20 bits. Mas ele paga letra por letra, as 10. Ele não percebe que o ABC se repete: para ele são só letras soltas.

> É aí que entra o LZ77, aquele do ZIP que citamos no começo. Ele foi criado em 1977 por Lempel e Ziv e é uma técnica separada do Huffman. Ele lê o texto da esquerda para a direita procurando pedaços que já apareceram.

> (2) A, B e C nunca apareceram antes, então ele guarda como estão.

> (3) Agora ele está na casa 3. Ele pega as 3 letras a partir dali, as casas 3, 4 e 5, que formam ABC, e procura esse pedaço para trás. Achou nas casas 0, 1 e 2, exatamente 3 casas antes. Então existe repetição, e já daria para dizer "volte 3, copie 3". Ele procura 3 letras de uma vez porque menos que isso não compensa: a instrução também ocupa espaço.

> (4) Mas ele ainda não grava, porque não sabe até onde a repetição vai. Então ele estica, uma letra por vez, sempre comparando com a letra 3 casas atrás. A casa 6 é comparada com a casa 3: A igual a A. Copie 4.

> (5) Casa 7 com a casa 4: B igual a B. Copie 5. (6) Casa 8 com a casa 5: C igual a C. Copie 6.

> Por que de uma em uma, e não de 3 em 3? Porque a repetição pode acabar no meio de um bloco. Se ele comparasse de 3 em 3, perderia as letras iguais antes da diferença.

> (7) Casa 9 com a casa 6: X é igual a A? Não. A repetição quebrou. Só agora ele grava, e grava uma instrução só: volte 3, copie 6.

> (8) O X não se repete, então é guardado como está. O arquivo fica: A, B, C, a instrução e o X.

> (9) E na hora de abrir o arquivo? A, B e C já estão lá. Para a instrução, o ponteiro "lê" fica 3 casas atrás do "escreve".

> (10 a 15) A cada clique, ele copia a letra de "lê" para "escreve" e os dois andam uma casa. Repare que a partir da quarta cópia ele está copiando letras que ele mesmo acabou de escrever. É assim que voltar 3 casas dá para copiar 6 letras.

> (16) Depois da instrução vem o X. O texto voltou inteiro, e as 6 letras do meio nunca foram guardadas no arquivo, só a instrução.

> Num texto tão pequeno, a instrução ainda custa espaço. A vantagem aparece em texto grande e repetitivo, como vamos ver nos resultados. Ou seja: o Huffman explora frequência; o LZ77 explora repetição. Agora vamos ver isso no código.

**Slide 11: LZ77 no código** (avance 11 vezes, uma volta do laço por clique; à esquerda, a linha que está rodando em `lz77_compactar`; à direita, a mesma execução do slide 10 e as variáveis, com a que mudou em amarelo)

> Agora a mesma execução, só que dentro do nosso código. Reparem nas variáveis mudando. O `i` é a casa que está sendo analisada.

> (1) Com i igual a 0, `trecho` pega as 3 letras a partir dali, ABC, e o `rfind` procura esse trecho antes da casa 0. Não acha: `candidato` vale −1.

> (2) Como não achou, cai no `else`: o A vai para a `saida` como literal, e i anda uma casa.

> (3) Com i igual a 1, o trecho é BCA, que não aparece antes: B vira literal. (4) Com i igual a 2, o trecho é CAB, que também não aparece: C vira literal. A saída está em A, B, C.

> (5) Com i igual a 3, o trecho é ABC de novo, e agora o `rfind` acha na casa 0: `candidato` vale 0. O `tamanho` começa em 3, o mínimo.

> (6) O `while` estica: compara `dados[candidato + tamanho]` com `dados[i + tamanho]`, ou seja, casa 3 com casa 6. A igual a A: `tamanho` vira 4. (7) Casa 4 com 7: vira 5. (8) Casa 5 com 8: vira 6.

> (9) Casa 6 com casa 9: A com X. Diferente, então sai do `while` com `tamanho` 6.

> (10) Como o tamanho é pelo menos 3, vira referência: `distancia` é i menos `candidato`, 3 menos 0, igual a 3. A saída ganha a instrução (3, 6), e i pula 6 casas.

> (11) Com i igual a 9 sobra só o X, menos de 3 letras, então ele nem procura: cai no `else` e o X vira literal. i vai para 10 e o laço acaba. Dez letras viraram 4 literais e 1 instrução. No código real ele ainda testa até 8 lugares diferentes onde o trecho apareceu e fica com a cópia mais longa.

> Ponte para o slide 12: "O texto virou literais e referências. Mas, na volta, como o programa sabe o que é cada peça?"

**Slide 12: LZ77 de volta** (avance 4 vezes; código de `lz77_descompactar`)

> Cada peça precisa de uma etiqueta. As peças do ABCABCABCX viram estes bytes: 10, 41, 42, 43, 00, 33, 58.

> 1. O primeiro byte é de controle. Cada bit diz o que é cada uma das próximas 8 peças: 0 é literal, 1 é referência. 10 em hexadecimal é 0001 0000: só a quarta peça é referência; a quinta, o X, é literal. O código testa isso com `flags & (1 << (7 - bit))`.

> 2. Bit 0: `saida.append(tokens[i])`, copia o byte direto. Saem A, B e C (e, no fim, o X, que é o byte 58).

> 3. Bit 1: a referência ocupa 2 bytes, 00 e 33. Os 12 primeiros bits são a distância, até 4.095, e os 4 últimos são o tamanho menos 3, por isso o tamanho vai de 3 a 18. Aqui: distância 3, tamanho 3 mais 3, igual a 6. Menos de 3 não compensa, porque a referência já gasta 2 bytes.

> 4. O for copia `saida[-distancia]` seis vezes: sempre a letra 3 posições atrás, inclusive as que acabou de escrever. Depois vem o X. Volta ABCABCABCX: sete bytes viraram dez.

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
