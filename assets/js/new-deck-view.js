import { fetchedDecks } from "./decks.js";
import { addDeck } from "./api.js";

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

const formEl = document.querySelector("#new-deck-form");
const submitBtn = formEl.querySelector(".new-deck-view__submit-btn");
const textareaEl = formEl.querySelector(".new-deck-view__textarea");

const errorModal = document.querySelector("#error-modal");
const errorCloseBtn = errorModal.querySelector(".modal__close");
const errorMessageEl = errorModal.querySelector(".modal__error");
/**
 * Normalizes a hexadecimal color value.
 *
 * @param {string} color - The color value to normalize.
 * @returns {string} The normalized hexadecimal color.
 */
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
/**
 * Closes a modal by removing its visible class.
 *
 * @param {HTMLElement} modal - The modal to close.
 * @returns {void}
 */
function closeModal(modal) {
  modal.classList.remove("modal_visible");
}
/**
 * Enables the new deck form submit button.
 *
 * @returns {void}
 */
function disableSubmitBtn() {
  submitBtn.disabled = false;
}
/**
 * Displays an error message in the error modal.
 *
 * @param {string} message - The error message to display.
 * @returns {void}
 */
function showError(message) {
  errorMessageEl.textContent = message;
  errorModal.classList.add("modal_visible");
}
/**
 * Validates that a deck name is a string between 2 and 80 characters.
 *
 * @param {*} name - The deck name to validate.
 * @returns {string|null} The valid name, or null if the name is invalid.
 */
function validateName(name) {
  if (typeof name != "string" || name.length < 2 || name.length > 80) {
    return null;
  }

  return name;
}
/**
 * Parses a JSON string and returns null if parsing fails.
 *
 * @param {string} jsonString - The JSON string to parse.
 * @returns {object|null} The parsed data, or null if parsing fails.
 */
function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}
/**
 * Handles submission of the new deck form.
 *
 * @param {SubmitEvent} e - The form submission event.
 * @returns {void}
 */
function handleNewDeckSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const values = Object.fromEntries(formData);

  const jsonData = parseJSON(values["deck-json"]);

  if (jsonData === null) {
    showError("JSON parsing failed");
    return;
  }

  if (validateName(jsonData.name) === null) {
    showError("Name must be a string between 2 and 80 characters");
    return;
  }

  if (!Array.isArray(jsonData.cards)) {
    showError("Cards must be an array");
    return;
  }

  const colorValue = normalizeColor(values.color);

  if (
    typeof jsonData.color === "string" &&
    jsonData.color.toLowerCase() !== colorValue
  ) {
    showError(
      `The JSON color ${jsonData.color} does not match the selected color ${colorValue}`,
    );
    return;
  }

  addDeck({
    name: jsonData.name,
    color: colorValue,
    cards: jsonData.cards,
  })
    .then((newDeck) => {
      fetchedDecks.push(newDeck);
      window.location.hash = "deck/" + newDeck._id;
    })
    .catch(() => {
      showError("Can't add deck");
    });
}

formEl.addEventListener("submit", handleNewDeckSubmit);

errorCloseBtn.addEventListener("click", () => {
  closeModal(errorModal);
});

export { disableSubmitBtn, showError };
