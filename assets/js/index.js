import { fetchedDecks, getDeckByID } from "./decks.js";
import { hexToString } from "./colors.js";
import { renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck-view.js";
import { getDecks, deleteDeck } from "./api.js";
import { disableSubmitBtn, showError } from "./new-deck-view.js";

let currentDeck = null;

const aboutSection = document.querySelector("#about");
const deckTemplateEl = document.querySelector("#deck-template");
const deckListEl = document.querySelector("#home .gallery__list");
const homeSection = document.querySelector("#home");
const deckViewSection = document.querySelector("#deck-view");
const notFoundSection = document.querySelector("#not-found");
const carouselSection = document.querySelector("#carousel");
const mainContentEl = document.querySelector(".page__main-content");
const practiceBtn = document.querySelector(".gallery__practice-btn");
const newDeckViewSection = document.querySelector("#new-deck-view");
const newDeckBtn = document.querySelector("#home .gallery__new-card-btn");
const pageEl = document.querySelector(".page");
/**
 * Creates a deck element from deck data.
 *
 * @param {object} item - The deck data used to create the element.
 * @returns {DocumentFragment} The cloned deck template.
 */
function createDeckEl(item) {
  const deckEl = deckTemplateEl.content.cloneNode(true);

  const titleEl = deckEl.querySelector(".card__title");
  titleEl.textContent = item.name;

  const countEl = deckEl.querySelector(".card__count");
  countEl.textContent = `${item.cards.length} cards`;

  const colorName = hexToString(item.color);

  deckEl.querySelector(".card").classList.add(`card_color_${colorName}`);

  const deckLinkEl = deckEl.querySelector(".card__link");

  deckLinkEl.href = `#deck/${item._id}`;

  const deleteBtn = deckEl.querySelector(".card__delete-btn");

  deleteBtn.addEventListener("click", () => {
    deleteDeck(item._id)
      .then(() => {
        deleteBtn.closest(".card").remove();

        const deckIndex = fetchedDecks.findIndex(
          (deck) => deck._id === item._id,
        );

        if (deckIndex !== -1) {
          fetchedDecks.splice(deckIndex, 1);
        }
      })
      .catch(() => {
        showError("Can't delete deck");
      });
  });

  return deckEl;
}
/**
 * Renders a deck element in the deck list.
 *
 * @param {object} item - The deck data to render.
 * @returns {void}
 */
function renderDeckEl(item) {
  const deckEl = createDeckEl(item);

  deckListEl.prepend(deckEl);
}
/**
 * Renders the appropriate view based on the current URL hash.
 *
 * @returns {void}
 */
function renderView() {
  aboutSection.style.display = "none";
  homeSection.style.display = "none";
  deckViewSection.style.display = "none";
  newDeckViewSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";

  mainContentEl.classList.remove("page__main-content_location_carousel");
  pageEl.classList.remove("page_no-mobile-bar");
  pageEl.classList.remove("page_location_carousel");

  const hash = window.location.hash;

  if (hash === "#home" || hash === "") {
    homeSection.style.display = "block";
    currentDeck = null;
  } else if (hash === "#about") {
    aboutSection.style.display = "block";
    currentDeck = null;
  } else if (hash === "#new-deck") {
    newDeckViewSection.style.display = "block";
    pageEl.classList.add("page_no-mobile-bar");

    disableSubmitBtn();

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

window.addEventListener("DOMContentLoaded", () => {
  getDecks()
    .then((decks) => {
      fetchedDecks.push(...decks);
      decks.forEach(renderDeckEl);
    })
    .catch(() => {
      showError("Can't fetch decks");
    })
    .finally(() => {
      renderView();
    });
});

window.addEventListener("hashchange", renderView);

newDeckBtn.addEventListener("click", () => {
  window.location.hash = "#new-deck";
});

practiceBtn.addEventListener("click", () => {
  if (currentDeck) {
    window.location.hash = `#carousel/${currentDeck._id}`;
  }
});
