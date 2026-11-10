# Roteiro e falas

**Huffman por dentro** · Teoria dos Grafos, turma CC6M · Prof. Jairo Lucas · Universidade Vila Velha

Tempo: 26 a 29 minutos (o professor pede de 20 a 30), mais perguntas. Em cada slide, "avance N vezes" quer dizer apertar → (ou Espaço) N vezes antes de ir para o próximo slide, para revelar as animações enquanto fala.

| Quem | Slides | Parte | Tempo |
|---|---|---|---|
| Pessoa 1 | 1 a 5 | O problema, onde é usado, a ideia e o resumo do algoritmo | 5 min |
| Gabriel Aguiar | 6 a 9 | Simulação completa com BANANA | 6 min |
| Pessoa 2 | 10 a 13 | O que é LZ77, o código dele executando e a combinação com Huffman | 6 min |
| Pessoa 3 | 14 a 16 | Nosso programa e a árvore em SVG | 3 min |
| Pessoa 4 | 17 a 20 | Resultados, demonstração, conclusão e perguntas | 6 a 8 min |

Gabriel Aguiar mantém o nome; os demais aparecem como Pessoa 1 a 4, na ordem em que falam.

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

## Gabriel Aguiar (slides 6 a 9)

**Slide 6: Contar** (avance 4 vezes)

> Vamos seguir a BANANA por dentro do programa, passo a passo. A linha destacada à esquerda é a que está executando no nosso huffman.py. A função cria 256 contadores zerados, um para cada byte possível. BANANA entra como 42, 41, 4E, 41, 4E, 41 em hexadecimal.

> O laço percorre os seis bytes e incrementa cada contador. No fim: A três vezes, B uma, N duas. O programa conta bytes, não letras; por isso acentos e quebras de linha funcionam.

**Slide 7: Combinar** (avance 4 vezes)

> Com as frequências contadas, o segundo passo é montar a árvore. A fila começa com B 1, N 2 e A 3. O código ordena e remove os dois menores, B e N, e cria um pai de peso 3. Agora sobram A 3 e o novo nó 3. Eles se unem na raiz, de peso 6.

> Percorrendo a árvore: A recebe 0, B recebe 10 e N recebe 11. BANANA vira 10, 0, 11, 0, 11, 0: nove bits.

**Slide 8: Empacotar** (avance 2 vezes)

> Temos os códigos, mas o computador grava bytes, não bits soltos. Os 9 bits viram dois bytes, 9B e 00, com 7 bits de preenchimento.

> O arquivo também precisa levar a árvore, senão ninguém consegue descompactar. Com a assinatura HUF1, o tamanho original e a árvore, BANANA fica com 24 bytes. Em textos tão pequenos, o cabeçalho pesa mais que a economia; em textos reais, ele se dilui.

**Slide 9: Decodificar** (avance 4 vezes)

> Falta provar que dá para voltar sem perder nada. Para isso, o código lê a árvore do arquivo e percorre os bits: 0 desce para a esquerda, 1 para a direita. Chegou numa folha, escreve a letra e volta para a raiz. 10 vira B, 0 vira A, 11 vira N, até formar BANANA.

> O tamanho guardado no cabeçalho diz quando parar, e os bits de preenchimento são ignorados. Antes de confiar no arquivo, o programa valida assinatura, árvore e tamanho.

> Passagem: "A BANANA voltou inteira. Mas repare: o Huffman olha letra por letra. E se o texto repetir trechos inteiros?"

---

## Pessoa 2 (slides 10 a 13)

**Slide 10: O limite do Huffman** (avance 2 vezes)

> Olhem este texto: ABCABCABC. (avance) Para o Huffman, A, B e C aparecem três vezes cada. Ele dá códigos 0, 10 e 11 e cai para 15 bits, mas continua pagando letra por letra, nove vezes.

> (avance) Só que qualquer pessoa vê que o bloco ABC está se repetindo. O Huffman não enxerga isso. É aí que entra o LZ77, aquele do ZIP que citamos no começo. Ele foi criado em 1977 por Lempel e Ziv, e é uma técnica separada: não faz parte do Huffman. A ideia é: se um trecho já apareceu, em vez de escrever de novo, aponta para trás. Grava A, B e C e depois só "volte 3, copie 6".

> Ou seja: Huffman explora frequência; LZ77 explora repetição. Vamos ver o LZ77 rodando no nosso código.

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

> E como aplicamos as duas juntas? A função `compactar_com_lz77` tem três linhas. Primeiro roda o LZ77. Depois entrega os tokens para o mesmo `compactar` do Huffman que o Gabriel mostrou, porque os tokens também são bytes, e alguns aparecem mais que outros. Por fim, grava a assinatura HUF2 com o tamanho original. Na volta, a ordem se inverte: primeiro Huffman, depois LZ77.

> Por isso, nesse modo, a árvore que o programa mostra é dos bytes dos tokens, não das letras. E combinar nem sempre ganha: em texto curto, as marcações extras podem até aumentar o arquivo.

> Passagem: "Vimos as duas técnicas com exemplos pequenos, a BANANA e o ABCABCABC. Agora, onde tudo isso roda?"

---

## Pessoa 3 (slides 14 a 16)

**Slide 14: Arquitetura**

> Tudo o que vimos até aqui roda dentro do nosso programa, que tem três partes. A interface, em HTML, CSS e JavaScript, escolhe o arquivo e mostra os resultados. O app.py é o servidor local, que valida e responde às requisições. O huffman.py tem o Huffman e o LZ77, implementados por nós, sem biblioteca pronta de compactação.

**Slide 15: Python monta, JSON leva, SVG desenha**

> E a árvore que vimos sendo montada com a BANANA aparece na tela assim: ela nasce como objetos `No` no Python. A função `arvore_para_dicionario` é recursiva: se o nó é folha, devolve símbolo e frequência; se não, chama a si mesma para o filho esquerdo e para o direito. O resultado vira JSON, o servidor envia, e o JavaScript desenha em SVG. No desenho, esquerda continua sendo 0 e direita, 1: é a mesma árvore que o algoritmo usou.

**Slide 16: Árvore explorável**

> Como uma árvore de um texto grande tem muitos nós, dá para arrastar, dar zoom sem perder nitidez, ajustar o enquadramento e exportar a árvore inteira em SVG.

> Passagem: "Falta a pergunta mais importante: quanto tudo isso economiza de verdade?"

---

## Pessoa 4 (slides 17 a 20)

**Slide 17: Resultados reais** (avance 2 vezes)

> A taxa de compactação é: tamanho original menos compactado, dividido pelo original, vezes cem. Positivo é economia.

> Lembram da BANANA? 6 bytes viraram 24: menos 300%. Cresceu por causa do cabeçalho com a árvore, que o Gabriel mostrou.

> Agora um texto onde trechos inteiros se repetem, como o ABCABCABC: ABRACADABRA repetido 200 vezes. São 2.400 bytes, que viram 731 com Huffman e 133 com LZ77 mais Huffman: 94,46% de economia.

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

> O teste de verdade é com um arquivo que não preparamos. Este é o arquivo que recebemos agora. Aqui está o tamanho original e o de cada modo. Baixamos o .huf, descompactamos sem o TXT original, e o conteúdo volta idêntico.

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
