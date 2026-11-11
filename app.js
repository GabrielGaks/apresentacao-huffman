const slides = [...document.querySelectorAll(".slide")];
const manifesto = JSON.parse(document.querySelector("#manifesto").textContent);
const direto = window.parent === window;
const reduzirMovimento = matchMedia("(prefers-reduced-motion: reduce)").matches;
let indice = Math.max(0, slides.findIndex((slide) => slide.dataset.sceneId === location.hash.slice(1)));
let etapa = 0;
let toqueX = null;

document.body.classList.add(direto ? "direct" : "embedded");

function ajustarEscala() {
  document.documentElement.style.setProperty("--escala", Math.min(innerWidth / 1920, innerHeight / 1080));
}
addEventListener("resize", ajustarEscala);
ajustarEscala();
window.__timelines = window.__timelines || {};

if (window.gsap) {
  const timeline = gsap.timeline({ paused: true, onUpdate: () => sincronizarCenaPorTempo(timeline.time()) });
  timeline.set(slides, { autoAlpha: 0 }, 0);
  for (const [indiceSlide, slide] of slides.entries()) {
    const inicio = Number(slide.dataset.start);
    const elementos = slide.querySelectorAll("[data-anim]");
    timeline.set(slide, { autoAlpha: 1 }, inicio).set(slide, { autoAlpha: 0 }, inicio + Number(slide.dataset.duration));
    timeline.fromTo(elementos, { opacity: indiceSlide === 0 ? 1 : 0, y: 34 }, {
      opacity: 1,
      y: 0,
      duration: reduzirMovimento ? 0.01 : 0.58,
      stagger: reduzirMovimento ? 0 : 0.08,
      ease: "power3.out",
    }, inicio);
    for (const item of slide.querySelectorAll("[data-step]")) {
      timeline.fromTo(item, { opacity: 0, y: 18 }, {
        opacity: 1,
        y: 0,
        duration: reduzirMovimento ? 0.01 : 0.35,
        ease: "power2.out",
      }, inicio + Number(item.dataset.step) * 1.5);
    }
  }
  window.__timelines.root = timeline;
  if (direto) gsap.set([...slides, ...document.querySelectorAll("[data-anim]")], { clearProps: "opacity,visibility,transform" });
}

function sincronizarCenaPorTempo(tempo) {
  const ativo = slides.findIndex((slide) => tempo >= Number(slide.dataset.start) && tempo < Number(slide.dataset.start) + Number(slide.dataset.duration));
  if (ativo < 0) return;
  slides.forEach((slide, i) => slide.classList.toggle("is-active", i === ativo));
}

function totalEtapas(slide) {
  const demo = slide.querySelector("[data-lz-demo]");
  return Math.max(demo ? Number(demo.dataset.etapas) : 0, ...[...slide.querySelectorAll("[data-step]")].map((item) => Number(item.dataset.step)));
}

function atualizarEtapas(slide) {
  for (const item of slide.querySelectorAll("[data-step]")) {
    const visivel = Number(item.dataset.step) <= etapa;
    item.classList.toggle("is-revealed", visivel);
    if (window.gsap) gsap.set(item, { opacity: visivel ? 1 : 0, y: 0 });
  }
  for (const linha of slide.querySelectorAll("[data-code-step]")) {
    linha.classList.toggle("code-active", linha.dataset.codeStep.split(" ").map(Number).includes(Math.max(1, etapa)));
  }
  mostrarLz(slide);
}

// Estados das casas: g = guardada como está, o = trecho que já tinha aparecido, i = coberta pela instrução, x = diferente, v = ainda vazia.
const CLASSE_CASA = { g: "guardada", o: "origem", i: "copiada", x: "diferente", v: "vazio" };

// Slide 11: a mesma compactação do slide 10, com as variáveis do código. Cada passo só lista o que mudou.
const PASSOS_CODIGO = (() => {
  let variaveis = { i: "0", inicio: "0", trecho: "", candidato: "", tamanho: "", distancia: "", saida: "[ ]" };
  return [
    ["..........", null, "Versão simplificada de lz77_compactar (o código real testa até 8 lugares e guarda a cópia mais longa). Começa com i = 0.", {}],
    ["..........", null, "i = 0: inicio = 0. Procura ABC antes da casa 0: não acha, <b>−1</b>. tamanho = 0 e o if é falso.", { trecho: '"ABC"', candidato: "−1", tamanho: "0" }],
    ["g.........", null, "tamanho é 0, menor que 3: cai no else. A vira literal e i += 1.", { saida: "[A]" }],
    ["gg........", null, "i = 1: trecho BCA não aparece antes. B vira literal.", { i: "1", trecho: '"BCA"', saida: "[A, B]" }],
    ["ggg.......", null, "i = 2: trecho CAB não aparece antes. C vira literal.", { i: "2", trecho: '"CAB"', saida: "[A, B, C]" }],
    ["oooiii....", null, "i = 3: trecho ABC. Agora acha na casa <b>0</b>. O tamanho começa em 3.", { i: "3", trecho: '"ABC"', candidato: "0", tamanho: "3" }],
    ["oooiiii...", [3, 6], "while: dados[3] == dados[6]? A = A. <b>tamanho = 4</b>.", { tamanho: "4" }],
    ["oooiiiii..", [4, 7], "dados[4] == dados[7]? B = B. <b>tamanho = 5</b>.", { tamanho: "5" }],
    ["oooiiiiii.", [5, 8], "dados[5] == dados[8]? C = C. <b>tamanho = 6</b>.", { tamanho: "6" }],
    ["oooiiiiiix", [6, 9], "dados[6] == dados[9]? A ≠ X: sai do while com <b>tamanho = 6</b>.", {}],
    ["gggiiiiii.", null, "tamanho ≥ 3: distancia = i − candidato = 3 − 0 = <b>3</b>. Grava (volte 3, copie 6). Depois, i += 6.", { distancia: "3", saida: "[A, B, C, (3, 6)]" }],
    ["gggiiiiiig", null, "i = 9: o trecho é só X e não aparece antes. Cai no else: X vira literal. i vai para 10: fim.", { i: "9", trecho: '"X"', candidato: "−1", tamanho: "0", distancia: "", saida: "[A, B, C, (3, 6), X]" }],
  ].map(([casas, ponteiros, texto, mudou]) => {
    variaveis = { ...variaveis, ...mudou };
    return [casas, ponteiros, texto, variaveis, Object.keys(mudou)];
  });
})();
// Slide 12: abrindo o arquivo. Cada passo: [casas, ponteiros [lê, escreve], texto, o que mudou, bytes acesos].
const PASSOS_VOLTA = (() => {
  let variaveis = { i: "0", flags: "", bit: "", distancia: "", tamanho: "" };
  const copias = [1, 2, 3, 4, 5, 6].map((k) => [
    "ggg" + "i".repeat(k) + "v".repeat(7 - k), k < 6 ? [k, 3 + k] : null,
    k < 6 ? `Copia saida[-3], a letra 3 casas atrás: ${"ABCABC"[k - 1]} (${k} de 6). Os dois ponteiros andam.` : "Copiou 6 de 6: instrução cumprida.",
    {}, [4],
  ]);
  return [
    ["vvvvvvvvvv", null, "Versão simplificada de lz77_descompactar. A saída começa vazia.", {}, []],
    ["vvvvvvvvvv", null, "Lê o byte de controle: <b>10 = 0001 0000</b>. Cada bit diz o que é a próxima peça: 0 = letra, 1 = instrução.", { flags: "0001 0000" }, [0]],
    ["gvvvvvvvvv", null, "bit 0 vale 0: é letra. Copia o byte 41 direto: <b>A</b>.", { i: "1", bit: "0" }, [1]],
    ["ggvvvvvvvv", null, "bit 1 vale 0: letra <b>B</b>.", { i: "2", bit: "1" }, [2]],
    ["gggvvvvvvv", null, "bit 2 vale 0: letra <b>C</b>.", { i: "3", bit: "2" }, [3]],
    ["gggvvvvvvv", [0, 3], "bit 3 vale 1: é instrução. Lê 00 33: <b>distancia 3, tamanho 3 + 3 = 6</b>.", { i: "4", bit: "3", distancia: "3", tamanho: "6" }, [4]],
    ...copias,
    ["gggiiiiiig", null, "bit 4 vale 0: letra <b>X</b> (byte 58).", { i: "6", bit: "4" }, [5]],
    ["gggiiiiiig", null, "Acabaram os bytes: fim. <b>ABCABCABCX</b> de volta ✓ 7 bytes viraram 10.", { i: "7" }, []],
  ].map(([casas, ponteiros, texto, mudou, acesos]) => {
    variaveis = { ...variaveis, ...mudou };
    return [casas, ponteiros, texto, variaveis, Object.keys(mudou), acesos];
  });
})();
const DEMOS_LZ = { codigo: PASSOS_CODIGO, volta: PASSOS_VOLTA };

function mostrarLz(slide) {
  const grade = slide.querySelector("[data-lz-demo]");
  if (!grade) return;
  const demo = grade.dataset.lzDemo;
  const passos = DEMOS_LZ[demo];
  const [casas, ponteiros, texto, variaveis, mudou, acesos = []] = passos[Math.min(etapa, passos.length - 1)];
  const celulas = [...grade.querySelectorAll("span")];
  celulas.forEach((celula, i) => {
    for (const classe of Object.values(CLASSE_CASA)) celula.classList.toggle(classe, CLASSE_CASA[casas[i]] === classe);
  });
  slide.querySelector(".lz-status").innerHTML = `<code>passo ${etapa}</code> ${texto}`;
  slide.querySelectorAll(".lz-bytes-demo p").forEach((byte, i) => byte.classList.toggle("atual", acesos.includes(i)));
  for (const campo of slide.querySelectorAll("[data-var]")) {
    const nome = campo.dataset.var;
    campo.textContent = variaveis[nome] || "–";
    campo.classList.toggle("mudou", mudou.includes(nome));
  }
  const [anterior, atual] = grade.querySelectorAll(".ptr");
  anterior.textContent = demo === "volta" ? "lê" : "anterior";
  atual.textContent = demo === "volta" ? "escreve" : "atual";
  grade.classList.toggle("copiando", Boolean(ponteiros));
  if (!ponteiros) return;
  const apontar = (ponteiro, celula) => { ponteiro.style.translate = `${celula.offsetLeft + celula.offsetWidth / 2}px 0`; };
  apontar(anterior, celulas[ponteiros[0]]);
  apontar(atual, celulas[ponteiros[1]]);
}

function animarEntrada(slide) {
  if (reduzirMovimento) return;
  [...slide.querySelectorAll("[data-anim]")].forEach((item, i) => item.animate([{ opacity: 0, translate: "0 24px" }, { opacity: 1, translate: "0 0" }], { duration: 560, delay: i * 70, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" }));
}

function atualizarInterface() {
  const slide = slides[indice];
  document.querySelector("#counter").textContent = `${indice + 1} / ${slides.length}`;
  document.querySelector("#previous").disabled = indice === 0 && etapa === 0;
  document.querySelector("#next").disabled = indice === slides.length - 1 && etapa === totalEtapas(slide);
}

function mostrarSlide(novoIndice, revelarTudo = false) {
  if (novoIndice < 0 || novoIndice >= slides.length) return;
  slides.forEach((slide) => slide.classList.remove("is-active"));
  indice = novoIndice;
  etapa = revelarTudo ? totalEtapas(slides[indice]) : 0;
  slides[indice].classList.add("is-active");
  atualizarEtapas(slides[indice]);
  atualizarInterface();
  animarEntrada(slides[indice]);
  history.replaceState(null, "", `#${slides[indice].dataset.sceneId}`);
}

function revelarEtapa(novaEtapa) {
  etapa = Math.max(0, Math.min(totalEtapas(slides[indice]), novaEtapa));
  atualizarEtapas(slides[indice]);
  atualizarInterface();
  const revelados = [...slides[indice].querySelectorAll("[data-step]")].filter((item) => Number(item.dataset.step) === etapa);
  if (window.gsap && !reduzirMovimento && etapa > 0) {
    gsap.fromTo(revelados, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .35, stagger: .05, ease: "power2.out", overwrite: true });
    const detalhes = revelados.flatMap((item) => [...item.querySelectorAll("[data-pop]")]);
    gsap.fromTo(detalhes, { opacity: 0, y: 18, scale: .92 }, { opacity: 1, y: 0, scale: 1, duration: .45, stagger: .08, ease: "back.out(1.45)", overwrite: true });
    const linhas = revelados.flatMap((item) => [...item.querySelectorAll("line[pathLength]")]);
    gsap.fromTo(linhas, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .55, stagger: .08, ease: "power2.out", overwrite: true });
    for (const barra of revelados.flatMap((item) => item.matches(".result-chart") ? [...item.querySelectorAll("i")] : [...item.querySelectorAll(".result-chart i")])) {
      gsap.fromTo(barra, { scaleX: 0 }, { scaleX: Number(getComputedStyle(barra).getPropertyValue("--bar")), duration: .7, ease: "power3.out" });
    }
  }
}

function proximo() {
  const total = totalEtapas(slides[indice]);
  if (etapa < total) revelarEtapa(etapa + 1);
  else if (indice < slides.length - 1) mostrarSlide(indice + 1);
}

function anterior() {
  if (etapa > 0) revelarEtapa(etapa - 1);
  else if (indice > 0) mostrarSlide(indice - 1, true);
}

document.querySelector("#next").addEventListener("click", proximo);
document.querySelector("#previous").addEventListener("click", anterior);

window.addEventListener("keydown", (evento) => {
  if (["ArrowRight", "PageDown", " "].includes(evento.key)) { evento.preventDefault(); proximo(); }
  if (["ArrowLeft", "PageUp", "Backspace"].includes(evento.key)) { evento.preventDefault(); anterior(); }
  if (evento.key === "Home") mostrarSlide(0);
  if (evento.key === "End") mostrarSlide(slides.length - 1);
  if (evento.key.toLowerCase() === "f") document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
});

document.addEventListener("touchstart", (evento) => { toqueX = evento.changedTouches[0].clientX; }, { passive: true });
document.addEventListener("touchend", (evento) => {
  if (toqueX === null) return;
  const delta = evento.changedTouches[0].clientX - toqueX;
  if (Math.abs(delta) > 60) delta < 0 ? proximo() : anterior();
  toqueX = null;
}, { passive: true });

function publicarTimeline() {
  parent.postMessage({
    source: "hf-preview",
    type: "timeline",
    durationInFrames: slides.length * 8 * 30,
    scenes: slides.map((slide) => ({ id: slide.dataset.compositionId, start: Number(slide.dataset.start), duration: 8 })),
  }, "*");
}

if (direto) {
  mostrarSlide(indice);
} else {
  document.body.classList.remove("direct");
  addEventListener("load", () => setTimeout(publicarTimeline, 300));
}

console.assert(slides.length === manifesto.slides.length, "Manifesto e cenas devem ter o mesmo tamanho.");
console.assert(new Set(slides.map((slide) => slide.dataset.sceneId)).size === slides.length, "IDs de cena devem ser únicos.");
