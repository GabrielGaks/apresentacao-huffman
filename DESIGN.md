---
colors:
  background: "#0B0F0D"
  surface: "#151B18"
  text: "#F1F5F2"
  muted: "#A4B0A9"
  accent: "#79D49C"
fonts:
  display: "Arial, Helvetica, sans-serif"
  mono: "Consolas, 'Courier New', monospace"
tone: "minimalista técnico, preciso e didático"
constraints:
  - "uma ideia principal por slide"
  - "tema escuro único e acento verde"
  - "código real ao lado da consequência visual"
  - "movimento apenas para execução, comparação e estado"
---

# Direção visual

Apresentação 16:9 com hierarquia tipográfica forte, superfícies sem efeitos decorativos e dados reais da implementação. Painéis têm raio de 18 px; controles usam formato de cápsula. O layout deve funcionar em projetor, notebook e celular, respeitando `prefers-reduced-motion`.

## Linguagem de movimento

- Entrada em cascata curta para estabelecer hierarquia.
- Execução didática em três atos: contar, combinar e empacotar.
- A linha ativa do código e o estado gráfico mudam juntos.
- Linhas da árvore são desenhadas na direção da execução; bytes surgem em sequência.
- A grade técnica de fundo é baixa em contraste e não compete com o conteúdo.

## Canvas e animações didáticas

- Acima de 900 px de largura, o slide é desenhado em 1920×1080 e escalado inteiro para caber na tela (unidades `cqw` relativas ao `#deck`); abaixo disso, layout fluido de celular.
- Cópia do LZ77: ponteiros **lê** (amarelo) e **escreve** (verde) andam juntos sobre as casas; casas não guardadas no arquivo aparecem tracejadas.
