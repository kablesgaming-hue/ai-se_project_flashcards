import { hexToString, removeColorClasses } from "./colors.js";

const carouselSection = document.querySelector("#carousel");

const titleEl = carouselSection.querySelector(".carousel__title");
const cardEl = carouselSection.querySelector(".carousel__card");
const cardTextEl = carouselSection.querySelector(".carousel__card-text");

const leftBtn = carouselSection.querySelector(".carousel__btn_type_left");
const rightBtn = carouselSection.querySelector(".carousel__btn_type_right");
const flipBtn = carouselSection.querySelector(".carousel__btn_type_flip");
/**
 * Renders a deck in the carousel view and sets up carousel controls.
 *
 * @param {object} deck - The deck to display.
 * @returns {void}
 */
function renderCarouselView(deck) {
  let currentIndex = 0;
  let showingQuestion = true;
  /**
   * Updates the carousel to display the current card and navigation state.
   *
   * @returns {void}
   */
  function updateDisplay() {
    const currentCard = deck.cards[currentIndex];

    titleEl.textContent = `${currentIndex + 1} of ${deck.cards.length} · ${deck.name}`;

    removeColorClasses(cardEl);

    const colorName = hexToString(deck.color);
    cardEl.classList.add(`carousel__card_color_${colorName}`);

    if (showingQuestion) {
      cardTextEl.textContent = currentCard.question;
    } else {
      cardTextEl.textContent = currentCard.answer;

      removeColorClasses(cardEl);
      cardEl.classList.add("carousel__card_color_white");
    }
    leftBtn.disabled = currentIndex === 0;
    rightBtn.disabled = currentIndex === deck.cards.length - 1;
  }

  flipBtn.addEventListener("click", () => {
    showingQuestion = !showingQuestion;
    updateDisplay();
  });

  leftBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      showingQuestion = true;
      updateDisplay();
    }
  });

  rightBtn.addEventListener("click", () => {
    if (currentIndex < deck.cards.length - 1) {
      currentIndex++;
      showingQuestion = true;
      updateDisplay();
    }
  });

  updateDisplay();
}

export { renderCarouselView };
