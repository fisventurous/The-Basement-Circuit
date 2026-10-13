import { makeFighter, restoreFighter, simulateFight } from "./engine.js";
import { connectPollinations, disconnectPollinations, getAccessToken, takeDraft } from "./auth.js";
import { forgeFighter } from "./pollinations.js";

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
const connectButton = $("[data-action='connect']");
const authState = $("[data-auth-state]");
let tactic = "push";
let currentLine = "";
let currentFighter = null;
let rematch = 0;

const draft = takeDraft();
if (draft) {
    lineInput.value = draft;
    count.textContent = String(draft.length);
}

lineInput.addEventListener("input", () => {
    count.textContent = String(lineInput.value.length);
});

scoutButton.addEventListener("click", () => {
    scoutAnswer.textContent = "Anything with a sleeve of crisps and a grudge.";
    scoutAnswer.hidden = false;
    scoutButton.disabled = true;
    scoutButton.querySelector("span").textContent = "THE WORD IS OUT";
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    currentLine = lineInput.value.trim().replace(/\s+/g, " ");
    if (!scoutAnswer.textContent) {
        status.textContent = "Get the word from the corner before you write your contender.";
        scoutButton.focus();
        return;
    }
    if (!currentLine) return;
    rematch = 0;
    const token = getAccessToken();
    const submitButton = form.querySelector("[type='submit']");
    submitButton.disabled = true;
    form.setAttribute("aria-busy", "true");
    status.textContent = token ? "The artist’s got your line. Give them a moment." : "The house artist’s sketching a practice card.";
    try {
        const fighter = token ? await forgeFighter(currentLine, token) : makeFighter(currentLine);
        if (fighter.dq) {
            status.textContent = fighter.reason || "The referee’s called a foul. Try a different contender.";
            submitButton.disabled = false;
            form.setAttribute("aria-busy", "false");
            return;
        }
        showDossier(currentLine, fighter, Boolean(token));
    } catch (error) {
        if (error instanceof Error && error.message.includes("expired")) {
            disconnectPollinations();
            renderAuthState();
        }
        status.textContent = error instanceof Error ? error.message : "The forge lost the thread. Try again.";
        submitButton.disabled = false;
        form.setAttribute("aria-busy", "false");
    }
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
connectButton.addEventListener("click", async () => {
    if (getAccessToken()) {
        disconnectPollinations();
        renderAuthState();
        status.textContent = "Pollen disconnected on this device.";
        return;
    }
    try {
        await connectPollinations(lineInput.value.trim());
    } catch (error) {
        status.textContent = error instanceof Error ? error.message : "Couldn’t open the Pollinations sign-in.";
    }
});

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

function showDossier(line, fighter, fromPollinations = false) {
    currentFighter = fighter;
    lineInput.readOnly = true;
    form.querySelector("[type='submit']").disabled = true;
    form.querySelector("[type='submit']").textContent = "LINE SEALED";
    form.setAttribute("aria-busy", "false");
    $("[data-fighter-name]").textContent = fighter.name;
    $("[data-fighter-line]").textContent = `“${line}”`;
    $("[data-home-look]").textContent = (fighter.look || "HAND-CUT CONTENDER · BAD IDEAS").slice(0, 46);
    $(".home-art").style.setProperty("--fighter-accent", fighter.hasCrisps ? "#d4e35f" : fighter.stats.power >= 7 ? "#efaa42" : fighter.stats.guard >= 7 ? "#788b59" : "#e65032");
    const traits = $("[data-fighter-traits]");
    traits.replaceChildren(
        makeTrait("STRENGTH", fighter.strength),
        makeTrait("WEAKNESS", fighter.weakness),
        makeTrait("QUIRK", fighter.quirk),
        makeTrait("POWER", String(fighter.stats.power)),
        makeTrait("SPEED", String(fighter.stats.speed)),
        makeTrait("GUARD", String(fighter.stats.guard)),
    );
    if (fighter.look) traits.append(makeTrait("LOOK", fighter.look));
    const moves = $("[data-fighter-moves]");
    moves.replaceChildren(...(fighter.moves ?? []).map((move) => {
        const chip = document.createElement("span");
        chip.className = "move-chip";
        chip.textContent = move.name;
        return chip;
    }));
    $("[data-fight-status]").textContent = fromPollinations ? "Forged by Pollinations · one text call." : "Local rules preview · no Pollen used.";
    fightPanel.hidden = false;
    boutResult.hidden = true;
    status.textContent = fromPollinations ? "Your fighter’s on the card. Pick a corner call." : "Practice card ready. Connect Pollen to let the artist take a turn.";
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
    const bout = simulateFight(currentLine, tactic, rematch, currentFighter ?? makeFighter(currentLine));
    roundLog.replaceChildren(...bout.log.map(makeRoundEntry));
    $("[data-result-title]").textContent = bout.won ? "UPSET OF THE NIGHT" : "THE HOUSE HOLDS";
    boutResult.hidden = false;
    boutResult.scrollIntoView({ behavior: "smooth", block: "start" });
    saveBout({ line: currentLine, won: bout.won, rounds: bout.rounds });
}

function readTape() {
    try {
        const records = JSON.parse(localStorage.getItem("last-line:tape") ?? "[]");
        return Array.isArray(records)
            ? records.filter((record) => record && typeof record.line === "string" && typeof record.won === "boolean" && Number.isFinite(record.rounds)).slice(0, 20)
            : [];
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
    const replay = { v: 1, line: currentLine, tactic, rematch, fighter: currentFighter };
    url.hash = new URLSearchParams({ fight: JSON.stringify(replay) }).toString();
    try {
        await navigator.clipboard.writeText(url.href);
        $("[data-action='share']").textContent = "TAPE COPIED ✓";
    } catch {
        window.prompt("Copy this fight tape link", url.href);
    }
}

function openSharedFight() {
    if (window.location.hash.length > 5000) return;
    const params = new URLSearchParams(window.location.hash.slice(1));
    try {
        const replay = JSON.parse(params.get("fight"));
        if (replay.v !== 1 || typeof replay.line !== "string" || !replay.line.trim() || replay.line.length > 120) return;
        currentLine = replay.line.trim().replace(/\s+/g, " ");
        tactic = ["push", "brace", "gamble"].includes(replay.tactic) ? replay.tactic : "push";
        rematch = Number.isInteger(replay.rematch) && replay.rematch >= 0 && replay.rematch < 100 ? replay.rematch : 0;
        currentFighter = restoreFighter(replay.fighter, currentLine);
        lineInput.value = currentLine;
        count.textContent = String(currentLine.length);
        scoutAnswer.textContent = "Anything with a sleeve of crisps and a grudge.";
        scoutAnswer.hidden = false;
        scoutButton.disabled = true;
        scoutButton.querySelector("span").textContent = "THE WORD IS OUT";
        document.querySelectorAll("[data-tactic]").forEach((button) => {
            button.setAttribute("aria-pressed", String(button.dataset.tactic === tactic));
        });
        showDossier(currentLine, currentFighter);
        playFight();
    } catch {
        return;
    }
}

function renderAuthState() {
    const connected = Boolean(getAccessToken());
    authState.textContent = connected ? "POLLEN PASS ACTIVE" : "LOCAL CORNER";
    connectButton.textContent = connected ? "DISCONNECT" : "CONNECT POLLEN";
    connectButton.setAttribute("aria-label", connected ? "Disconnect Pollinations on this device" : "Connect your Pollinations account");
    const submitButton = form.querySelector("[type='submit']");
    if (!lineInput.readOnly) submitButton.textContent = connected ? "FORGE WITH POLLINATIONS" : "MAKE PRACTICE CARD";
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
    description.textContent = "Ask around for one clue about the challenger. Write one line and watch the bout. Local practice needs no account; connect Pollinations for the AI artist.";
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
renderAuthState();
openSharedFight();
