import { decks } from "./decks.js";

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

const formEl = document.querySelector("#new-deck-form");
const submitBtn = formEl.querySelector(".new-deck-view__submit-btn");
const textareaEl = formEl.querySelector(".new-deck-view__textarea");

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeColor(color) {
  if (!color) {
    return "#64d583";
  }

  const hex = color.startsWith("#") ? color.slice(1) : color;

  if (!HEX_DIGITS.test(hex)) {
    return "#64d583";
  }

  return `#${hex.toLowerCase()}`;
}

function disableSubmitBtn() {
  submitBtn.disabled = false;
}

function handleNewDeckSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const values = Object.fromEntries(formData);

  const jsonData = JSON.parse(values["deck-json"]);

  const deck = {
    id: `${slugify(jsonData.name)}-${Date.now()}`,
    color: normalizeColor(values.color),
    name: jsonData.name,
    cards: jsonData.cards,
  };

  decks.push(deck);

  window.location.hash = `#deck/${deck.id}`;
}

formEl.addEventListener("submit", handleNewDeckSubmit);

export { disableSubmitBtn };
