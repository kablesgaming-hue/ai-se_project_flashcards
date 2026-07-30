import { decks, getDeckByID } from "./decks.js";
import { hexToString } from "./colors.js";
import { renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck-view.js";

let currentDeck = null;

const deckTemplateEl = document.querySelector("#deck-template");
const deckListEl = document.querySelector(".gallery__list");
const homeSection = document.querySelector("#home");
const deckViewSection = document.querySelector("#deck-view");
const notFoundSection = document.querySelector("#not-found");
const carouselSection = document.querySelector("#carousel");
const mainContentEl = document.querySelector(".page__main-content");
const practiceBtn = document.querySelector(".gallery__practice-btn");
const pageEl = document.querySelector(".page");

function createDeckEl(item) {
  const deckEl = deckTemplateEl.content.cloneNode(true);

  const titleEl = deckEl.querySelector(".card__title");
  titleEl.textContent = item.name;

  const countEl = deckEl.querySelector(".card__count");
  countEl.textContent = `${item.cards.length} cards`;

  const colorName = hexToString(item.color);

  deckEl.querySelector(".card").classList.add(`card_color_${colorName}`);

  const deckLinkEl = deckEl.querySelector(".card__link");

  deckLinkEl.href = `#deck/${item.id}`;

  const deleteBtn = deckEl.querySelector(".card__delete-btn");

  deleteBtn.addEventListener("click", () => {
    deleteBtn.closest(".card").remove();
  });

  return deckEl;
}
function renderDeckEl(item) {
  const deckEl = createDeckEl(item);

  deckListEl.prepend(deckEl);
}
function renderView() {
  homeSection.style.display = "none";
  deckViewSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";

  mainContentEl.classList.remove("page__main-content_location_carousel");
  pageEl.classList.remove("page_no-mobile-bar");
  pageEl.classList.remove("page_location_carousel");

  const hash = window.location.hash;

  if (hash === "#home" || hash === "") {
    homeSection.style.display = "block";
    currentDeck = null;
  } else if (hash.startsWith("#deck/")) {
    const deckID = hash.split("/")[1];
    const deck = getDeckByID(deckID);

    if (!deck) {
      notFoundSection.style.display = "flex";
      pageEl.classList.add("page_no-mobile-bar");
      currentDeck = null;
      return;
    }

    currentDeck = deck;
    deckViewSection.style.display = "block";
    renderDeckView(deck);
  } else if (hash.startsWith("#carousel/")) {
    const deckID = hash.split("/")[1];
    const deck = getDeckByID(deckID);

    if (!deck) {
      notFoundSection.style.display = "flex";
      pageEl.classList.add("page_no-mobile-bar");
      currentDeck = null;
      return;
    }

    currentDeck = deck;
    carouselSection.style.display = "flex";

    mainContentEl.classList.add("page__main-content_location_carousel");
    pageEl.classList.add("page_no-mobile-bar");
    pageEl.classList.add("page_location_carousel");

    renderCarouselView(deck);
  } else {
    currentDeck = null;
    notFoundSection.style.display = "flex";
    pageEl.classList.add("page_no-mobile-bar");
  }
}

decks.forEach(renderDeckEl);

renderView();

window.addEventListener("hashchange", renderView);

practiceBtn.addEventListener("click", () => {
  if (currentDeck) {
    window.location.hash = `#carousel/${currentDeck.id}`;
  }
});
