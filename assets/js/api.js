const baseUrl = "https://se-flashcards-api.en.tripleten-services.com/v1";

const headers = {
  "Content-Type": "application/json",
  Authorization: "019feb67-8cf8-758b-bf7a-61411d18710a",
};
/**
 * Processes a fetch response and parses successful responses as JSON.
 *
 * @param {Response} res - The response returned by fetch.
 * @returns {Promise<object>} A promise containing the parsed response data.
 */
function processResponse(res) {
  if (res.ok) {
    return res.json();
  }

  return Promise.reject(`Error: ${res.status}`);
}
/**
 * Creates a new deck through the API.
 *
 * @param {object} deck - The deck data to create.
 * @param {string} deck.name - The name of the deck.
 * @param {string} deck.color - The hexadecimal color of the deck.
 * @param {Array} deck.cards - The cards contained in the deck.
 * @returns {Promise<object>} A promise containing the newly created deck.
 */
function addDeck({ name, color, cards }) {
  return fetch(`${baseUrl}/decks`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name,
      color,
      cards,
    }),
  }).then(processResponse);
}
/**
 * Retrieves all decks from the API.
 *
 * @returns {Promise<Array>} A promise containing the fetched decks.
 */
function getDecks() {
  return fetch(`${baseUrl}/decks`, { headers }).then(processResponse);
}
/**
 * Deletes a deck through the API.
 *
 * @param {string} deckId - The unique ID of the deck to delete.
 * @returns {Promise<object>} A promise containing the API response.
 */
function deleteDeck(deckId) {
  return fetch(`${baseUrl}/decks/${deckId}`, {
    method: "DELETE",
    headers,
  }).then(processResponse);
}

export { getDecks, deleteDeck, addDeck };
