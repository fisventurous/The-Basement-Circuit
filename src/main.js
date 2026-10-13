import { makeFighter, simulateFight } from "./engine.js";

const $ = (selector) => document.querySelector(selector);
const lineInput = $("#fighter-line");
const count = $("[data-count]");
const scoutAnswer = $("[data-scout-answer]");
const form = $("[data-fighter-form]");
const status = $("[data-status]");
const scoutButton = $('[data-action="scout"]');
const fightPanel = $("[data-fight-panel]");
const boutResult = $("[data-bout-result]");
const tapeEmpty = $("[data-tape-empty]");
const tapeLog = $("[data-tape-log]");
const roundLog = $("[data-round-log]");
let tactic = "push";
let currentLine = "";
let rematch = 0;

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
    currentLine = lineInput.value.trim().replace(/\s+/g, " ");
    if (!scoutAnswer.textContent) {
        status.textContent = "Get the word from the corner before you write your contender.";
        scoutButton.focus();
        return;
    }
    if (!currentLine) return;
    rematch = 0;
    showDossier(currentLine);
});

document.querySelectorAll("[data-tactic]").forEach((button) => {
    button.addEventListener("click", () => {
        tactic = button.dataset.tactic;
        document.querySelectorAll("[data-tactic]").forEach((option) => {
            option.setAttribute("aria-pressed", String(option === button));
        });
    });
});

$("[data-action='start-fight']").addEventListener("click", () => playFight());
$("[data-action='rematch']").addEventListener("click", () => {
    rematch += 1;
    playFight();
});
$("[data-action='share']").addEventListener("click", shareFight);
$("[data-action='how']").addEventListener("click", showHowItWorks);

function makeTrait(label, value) {
    const card = document.createElement("div");
    const name = document.createElement("span");
    const trait = document.createElement("b");
    card.className = "trait-card";
    name.textContent = label;
    trait.textContent = value;
    card.append(name, trait);
    return card;
}

function showDossier(line) {
    const fighter = makeFighter(line);
    $("[data-fighter-name]").textContent = fighter.name;
    $("[data-fighter-line]").textContent = `“${line}”`;
    const traits = $("[data-fighter-traits]");
    traits.replaceChildren(
        makeTrait("STRENGTH", fighter.strength),
        makeTrait("WEAKNESS", fighter.weakness),
        makeTrait("QUIRK", fighter.quirk),
        makeTrait("POWER", String(fighter.stats.power)),
        makeTrait("SPEED", String(fighter.stats.speed)),
        makeTrait("GUARD", String(fighter.stats.guard)),
    );
    $("[data-fight-status]").textContent = "Local rules preview · no Pollen used.";
    fightPanel.hidden = false;
    boutResult.hidden = true;
    status.textContent = "Your fighter’s on the card. Pick a corner call.";
    fightPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function makeRoundEntry(event) {
    const item = document.createElement("li");
    const round = document.createElement("b");
    const description = document.createElement("p");
    const damage = document.createElement("small");
    round.textContent = `R${event.round}`;
    description.textContent = event.text;
    damage.textContent = event.damage ? `${event.damage} DAMAGE` : "NO DAMAGE";
    item.append(round, description, damage);
    return item;
}

function playFight() {
    if (!currentLine) return;
    const bout = simulateFight(currentLine, tactic, rematch);
    roundLog.replaceChildren(...bout.log.map(makeRoundEntry));
    $("[data-result-title]").textContent = bout.won ? "UPSET OF THE NIGHT" : "THE HOUSE HOLDS";
    boutResult.hidden = false;
    boutResult.scrollIntoView({ behavior: "smooth", block: "start" });
    saveBout({ line: currentLine, won: bout.won, rounds: bout.rounds });
}

function readTape() {
    try {
        const records = JSON.parse(localStorage.getItem("last-line:tape") ?? "[]");
        return Array.isArray(records) ? records.slice(0, 20) : [];
    } catch {
        return [];
    }
}

function saveBout(record) {
    const records = [{ ...record, date: Date.now() }, ...readTape()].slice(0, 20);
    try {
        localStorage.setItem("last-line:tape", JSON.stringify(records));
    } catch {
        status.textContent = "The bout’s in the book. Your browser couldn’t save the tape.";
    }
    renderTape(records);
}

function renderTape(records = readTape()) {
    tapeEmpty.hidden = records.length > 0;
    tapeLog.replaceChildren(...records.map((record) => {
        const item = document.createElement("li");
        const result = document.createElement("strong");
        const line = document.createElement("span");
        const mark = document.createElement("b");
        result.textContent = record.won ? "WIN" : "LOSS";
        line.textContent = record.line;
        mark.textContent = `${record.rounds} ROUNDS`;
        item.append(result, line, mark);
        return item;
    }));
}

async function shareFight() {
    const url = new URL(window.location.href);
    const replay = { v: 1, line: currentLine, tactic, rematch };
    url.hash = new URLSearchParams({ fight: JSON.stringify(replay) }).toString();
    try {
        await navigator.clipboard.writeText(url.href);
        $("[data-action='share']").textContent = "TAPE COPIED ✓";
    } catch {
        window.prompt("Copy this fight tape link", url.href);
    }
}

function openSharedFight() {
    const params = new URLSearchParams(window.location.hash.slice(1));
    try {
        const replay = JSON.parse(params.get("fight"));
        if (replay.v !== 1 || typeof replay.line !== "string" || replay.line.length > 120) return;
        currentLine = replay.line.trim().replace(/\s+/g, " ");
        tactic = ["push", "brace", "gamble"].includes(replay.tactic) ? replay.tactic : "push";
        rematch = Number.isInteger(replay.rematch) && replay.rematch >= 0 && replay.rematch < 100 ? replay.rematch : 0;
        lineInput.value = currentLine;
        count.textContent = String(currentLine.length);
        scoutAnswer.textContent = "Anything with a sleeve of crisps and a grudge.";
        scoutAnswer.hidden = false;
        scoutButton.disabled = true;
        scoutButton.querySelector("span").textContent = "THE WORD IS OUT";
        document.querySelectorAll("[data-tactic]").forEach((button) => {
            button.setAttribute("aria-pressed", String(button.dataset.tactic === tactic));
        });
        showDossier(currentLine);
        playFight();
    } catch {
        return;
    }
}

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

renderTape();
openSharedFight();
