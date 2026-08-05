const formEl = document.querySelector("#new-deck-form");

const submitBtn = formEl.querySelector(".new-deck-view__submit-btn");

const textareaEl = formEl.querySelector(".new-deck-view__textarea");

function disableSubmitBtn() {
  submitBtn.disabled = false;
}

export { disableSubmitBtn };
