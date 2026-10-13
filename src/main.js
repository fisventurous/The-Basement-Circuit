const lineInput = document.querySelector("#fighter-line");
const count = document.querySelector("[data-count]");
const scoutAnswer = document.querySelector("[data-scout-answer]");
const form = document.querySelector("[data-fighter-form]");
const status = document.querySelector("[data-status]");
const scoutButton = document.querySelector('[data-action="scout"]');
lineInput.addEventListener("input", () => {
    count.textContent = String(lineInput.value.length);
});

scoutButton.addEventListener("click", () => {
    scoutAnswer.textContent = "Anything with a sleeve of crisps and a grudge.";
    scoutAnswer.hidden = false;
    scoutButton.disabled = true;
    scoutButton.querySelector("span").textContent = "THE WORD IS OUT";
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "Your line’s in. The bookies are arguing.";
    lineInput.blur();
});

document.querySelector('[data-action="how"]').addEventListener("click", showHowItWorks);

function showHowItWorks() {
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    const card = document.createElement("section");
    const eyebrow = document.createElement("p");
    const heading = document.createElement("h2");
    const description = document.createElement("p");
    const closeButton = document.createElement("button");
    card.className = "how-card";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    card.setAttribute("aria-labelledby", "how-title");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = "A WORD FROM THE PROMOTER";
    heading.id = "how-title";
    heading.textContent = "Scout. Write. Swing.";
    description.textContent = "Ask around for one clue about the challenger. Write a fighter in a single line. Then watch the bout and see if your idea holds up.";
    closeButton.type = "button";
    closeButton.textContent = "BACK TO THE CORNER";
    card.append(eyebrow, heading, description, closeButton);
    backdrop.append(card);
    backdrop.addEventListener("click", (event) => {
        if (event.target === backdrop || event.target === closeButton) backdrop.remove();
    });
    document.body.append(backdrop);
    closeButton.focus();
}
