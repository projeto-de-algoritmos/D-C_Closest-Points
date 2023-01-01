import "./style.css";
import { CustomUIEvent, UI } from "./ui";

declare global {
  interface WindowEventMap {
    step: CustomEvent<CustomUIEvent>;
  }
}

const $canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

const $minDistance = document.querySelector<HTMLInputElement>("#min-distance")!;
const $currentEvent =
  document.querySelector<HTMLInputElement>("#current-event")!;
const $fps = document.querySelector<HTMLInputElement>("#fps");

const $solve = document.querySelector<HTMLButtonElement>("#solve")!;
const $reset = document.querySelector<HTMLButtonElement>("#reset")!;
const $rand = document.querySelector<HTMLButtonElement>("#rand")
const $quant = document.querySelector<HTMLButtonElement>("#quant");

const ui = new UI($canvas, 3);

window.addEventListener("step", (e: CustomEvent<CustomUIEvent>) => {
  $currentEvent.value = e.detail.currentEvent?.type ?? "";
  $minDistance.value = e.detail.distanceInfo?.[0].toString() ?? "";
});

const animate = () => {
  setTimeout(() => {
    requestAnimationFrame(animate);

    if (ui.canGoNext()) ui.next();
  }, 1000 / Number($fps?.value ?? 1));
};

$solve.addEventListener("click", () => ui.solve());
$reset.addEventListener("click", () => ui.reset());
$rand?.addEventListener("click", () => ui.generateRandom(Number($quant?.value ?? 100)))

animate();
