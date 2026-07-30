import { hexToString } from "./colors.js";

const deckViewSection = document.querySelector("#deck-view");
const deckViewTitleEl = deckViewSection.querySelector(".gallery__title");
const deckViewListEl = deckViewSection.querySelector(".gallery__list");
const cardTemplateEl = document.querySelector("#card-template");

function renderDeckView(deck) {
  deckViewTitleEl.textContent = deck.name;
  deckViewListEl.innerHTML = "";

  deck.cards.forEach((cardData) => {
    const cardFragment = cardTemplateEl.content.cloneNode(true);
    const cardEl = cardFragment.querySelector(".card");
    const titleEl = cardFragment.querySelector(".card__title");
    const flipBtn = cardFragment.querySelector(".card__flip-btn");
    const deleteBtn = cardFragment.querySelector(".card__delete-btn");

    titleEl.textContent = cardData.question;

    const colorName = hexToString(deck.color);
    cardEl.classList.add(`card_color_${colorName}`);

    let showingQuestion = true;

    flipBtn.setAttribute("aria-label", "Show answer");

    flipBtn.addEventListener("click", () => {
      showingQuestion = !showingQuestion;
      titleEl.textContent = showingQuestion
        ? cardData.question
        : cardData.answer;
      flipBtn.setAttribute(
        "aria-label",
        showingQuestion ? "Show answer" : "Show question",
      );
      cardEl.classList.toggle("card_flipped", !showingQuestion);
    });

    deleteBtn.addEventListener("click", () => {
      cardEl.remove();
    });

    deckViewListEl.append(cardFragment);
  });
}

export { renderDeckView };
