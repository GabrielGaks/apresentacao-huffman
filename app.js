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

// Slide 10: o LZ77 compactando (compara) e abrindo o arquivo (copia), um passo por clique.
// Cada passo: [estado das 10 casas, ponteiros [anterior, atual] ou null, texto].
// g = guardada como está, o = trecho que já tinha aparecido, i = coberta pela instrução, x = diferente, v = ainda vazia.
const PASSOS_LZ = [
  ["..........", null, "ABCABCABCX: o bloco ABC se repete e o X, no fim, quebra a repetição."],
  ["..........", null, "ABCABCABCX: o bloco ABC se repete e o X, no fim, quebra a repetição."],
  ["ggg.......", null, "Lê da esquerda para a direita. A, B e C ainda não tinham aparecido: guarda como estão."],
  ["oooiii....", null, "Casa 3: as próximas 3 letras, ABC, já apareceram 3 casas antes. <b>Volte 3, copie 3</b>."],
  ["oooiiii...", [3, 6], "Ainda não grava. Compara a próxima: A = A. <b>Volte 3, copie 4</b>."],
  ["oooiiiii..", [4, 7], "B = B. <b>Volte 3, copie 5</b>."],
  ["oooiiiiii.", [5, 8], "C = C. <b>Volte 3, copie 6</b>."],
  ["oooiiiiiix", [6, 9], "X ≠ A: a repetição quebrou. Só agora grava uma instrução: <b>volte 3, copie 6</b>."],
  ["gggiiiiiig", null, "O X não se repete: guarda como está. Arquivo: A, B, C, <b>volte 3, copie 6</b>, X."],
  ["gggvvvvvvv", [0, 3], "A, B e C já estão lá. Para a instrução, <b>lê</b> fica 3 casas atrás de <b>escreve</b>."],
  ...[1, 2, 3, 4, 5, 6].map((k) => [
    "ggg" + "i".repeat(k) + "v".repeat(7 - k),
    k < 6 ? [k, 3 + k] : null,
    k < 6 ? `Copiou ${"ABCABC"[k - 1]} (${k} de 6). Os dois andam uma casa.` : "Copiou 6 de 6: instrução cumprida.",
  ]),
  ["gggiiiiiig", null, "Depois da instrução vem o X, guardado como está. <b>ABCABCABCX</b> de volta ✓"],
];
const CLASSE_CASA = { g: "guardada", o: "origem", i: "copiada", x: "diferente", v: "vazio" };

function mostrarLz(slide) {
  const grade = slide.querySelector("[data-lz-demo]");
  if (!grade) return;
  const [casas, ponteiros, texto] = PASSOS_LZ[Math.min(etapa, PASSOS_LZ.length - 1)];
  const celulas = [...grade.querySelectorAll("span")];
  celulas.forEach((celula, i) => {
    for (const classe of Object.values(CLASSE_CASA)) celula.classList.toggle(classe, CLASSE_CASA[casas[i]] === classe);
  });
  const abrindo = etapa >= 9;
  slide.querySelector(".lz-status").innerHTML = `<code>${etapa < 2 ? "exemplo" : abrindo ? "abrindo o arquivo" : "LZ77 compactando"}</code> ${texto}`;
  const [anterior, atual] = grade.querySelectorAll(".ptr");
  anterior.textContent = abrindo ? "lê" : "anterior";
  atual.textContent = abrindo ? "escreve" : "atual";
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
