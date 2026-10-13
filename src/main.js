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
const howDialog = $("[data-how-dialog]");
const startFightButton = $("[data-action='start-fight']");
const rematchButton = $("[data-action='rematch']");
const scoutClue = "A sleeve of crisps will draw him off. The grudge is your call.";
let fightInProgress = false;
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
    scoutAnswer.textContent = scoutClue;
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
$("[data-action='how']").addEventListener("click", showHowToPlay);
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
    const icon = document.createElement("span");
    const name = document.createElement("span");
    const trait = document.createElement("b");
    card.className = "trait-card";
    icon.className = "trait-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = ({ Strength: "✦", Weakness: "◌", Quirk: "✳", Power: "◆", Speed: "↗", Guard: "⬡", Look: "◉" })[label] ?? "·";
    name.textContent = label;
    trait.textContent = value;
    card.append(icon, name, trait);
    return card;
}

function fighterStyle(line, look = "") {
    const text = `${line} ${look}`.toLocaleLowerCase("en-GB");
    const styles = [
        ["shell", /\b(turtle|tortoise|shell|armadillo)\b/, "SHELL"],
        ["wing", /\b(bird|pigeon|owl|hawk|wing|feather|flying)\b/, "WING"],
        ["machine", /\b(robot|android|machine|clockwork|mechanical|automaton)\b/, "GEAR"],
        ["spectre", /\b(ghost|haunted|spirit|phantom|spectre|specter|wraith)\b/, "WISP"],
        ["deep", /\b(fish|shark|whale|octopus|submarine|ocean|sea)\b/, "DEEP"],
    ];
    const match = styles.find(([, pattern]) => pattern.test(text));
    return match ? [match[0], match[2]] : ["corner", "CORNER"];
}

function showDossier(line, fighter, fromPollinations = false) {
    currentFighter = fighter;
    lineInput.readOnly = true;
    form.querySelector("[type='submit']").disabled = true;
    form.querySelector("[type='submit']").textContent = "LINE SEALED";
    form.setAttribute("aria-busy", "false");
    $("[data-fighter-name]").textContent = fighter.name;
    $(".corner-home .corner-label b").textContent = fighter.name;
    $("[data-fighter-line]").textContent = `“${line}”`;
    const look = fighter.look || "A contender with bad ideas.";
    $("[data-home-look]").textContent = look.length > 52 ? `${look.slice(0, 49).trimEnd()}…` : look;
    const [style, mark] = fighterStyle(line, fighter.look);
    const homeArt = $(".home-art");
    $("[data-home-mark]").textContent = mark;
    homeArt.style.setProperty("--fighter-accent", ({ shell: "#bda4d6", wing: "#d4e35f", machine: "#e6a13c", spectre: "#c7b1df", deep: "#9bc9c1", corner: "#e65032" })[style]);
    const traits = $("[data-fighter-traits]");
    traits.replaceChildren(
        makeTrait("Strength", fighter.strength),
        makeTrait("Weakness", fighter.weakness),
        makeTrait("Quirk", fighter.quirk),
        makeTrait("Power", String(fighter.stats.power)),
        makeTrait("Speed", String(fighter.stats.speed)),
        makeTrait("Guard", String(fighter.stats.guard)),
    );
    if (fighter.look) traits.append(makeTrait("Look", fighter.look));
    const moves = $("[data-fighter-moves]");
    moves.replaceChildren(...(fighter.moves ?? []).map((move) => {
        const chip = document.createElement("span");
        chip.className = "move-chip";
        chip.textContent = move.name.toLocaleLowerCase("en-GB").replace(/\b\p{L}/gu, (letter) => letter.toLocaleUpperCase("en-GB"));
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
    const mark = document.createElement("span");
    const description = document.createElement("p");
    const damage = document.createElement("small");
    item.className = event.damage ? "round-hit" : "round-miss";
    round.textContent = `Round ${event.round}`;
    mark.className = "event-mark";
    mark.setAttribute("aria-hidden", "true");
    mark.textContent = event.damage ? "✦" : "↝";
    description.textContent = event.text;
    damage.textContent = event.damage ? `${event.damage} damage` : "No damage";
    item.append(round, mark, description, damage);
    return item;
}

function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function playFight() {
    if (!currentLine || fightInProgress) return;
    fightInProgress = true;
    startFightButton.disabled = true;
    rematchButton.disabled = true;
    $("[data-action='share']").disabled = true;
    const bout = simulateFight(currentLine, tactic, rematch, currentFighter ?? makeFighter(currentLine));
    roundLog.replaceChildren();
    $("[data-result-title]").textContent = "The bell goes";
    boutResult.hidden = false;
    boutResult.scrollIntoView({ behavior: "smooth", block: "start" });
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (let index = 0; index < bout.log.length; index += 1) {
        const event = bout.log[index];
        roundLog.append(makeRoundEntry(event));
        const next = bout.log[index + 1];
        await wait(reducedMotion ? 40 : next?.round !== event.round ? 520 : 340);
    }
    $("[data-result-title]").textContent = bout.won ? "Upset of the night" : "The house holds";
    startFightButton.disabled = false;
    rematchButton.disabled = false;
    $("[data-action='share']").disabled = false;
    fightInProgress = false;
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
        scoutAnswer.textContent = scoutClue;
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
    if (!lineInput.readOnly) submitButton.textContent = connected ? "Forge with Pollinations" : "Make practice card";
}

function showHowToPlay() {
    howDialog.showModal();
}

$("[data-action='close-how']").addEventListener("click", () => howDialog.close());

renderTape();
renderAuthState();
openSharedFight();
