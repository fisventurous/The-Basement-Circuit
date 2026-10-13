import { makeFighter, restoreFighter, simulateFight, CORNER_RUMOURS, PETE_TAGLINES, HOME_TAGLINES } from "./engine.js";
import { connectPollinations, disconnectPollinations, getAccessToken, takeDraft } from "./auth.js";
import { forgeFighter } from "./pollinations.js";
import { isSoundEnabled, toggleSound, playBell, playHit, playExploit, playMiss, playWin, playLoss } from "./audio.js";

const $ = (selector) => document.querySelector(selector);
const lineInput = $("#fighter-line");
const count = $("[data-count]");
const scoutCount = $("[data-scout-count]");
const scoutQuestion = $("[data-scout-question]");
const scoutAnswer = $("[data-scout-answer]");
const scoutButton = $('[data-action="scout"]');
const cycleScoutButton = $('[data-action="cycle-scout"]');
const homeLookBadge = $("[data-home-look]");
const awayLookBadge = $("[data-away-look]");
const form = $("[data-fighter-form]");
const status = $("[data-status]");
const fightPanel = $("[data-fight-panel]");
const boutResult = $("[data-bout-result]");
const tapeEmpty = $("[data-tape-empty]");
const tapeLog = $("[data-tape-log]");
const roundLog = $("[data-round-log]");
const connectButton = $("[data-action='connect']");
const soundToggle = $("[data-action='toggle-sound']");
const soundLabel = $("[data-sound-label]");
const authState = $("[data-auth-state]");
const howDialog = $("[data-how-dialog]");
const startFightButton = $("[data-action='start-fight']");
const rematchButton = $("[data-action='rematch']");
const forgePanel = $("[data-forge-panel]");
const forgeHeading = $("[data-forge-heading]");
const forgeStep = $("[data-forge-step]");
const forgeMessages = [
    "Weighing the contender and testing the gloves…",
    "Scouting the one-line description for quirks…",
    "Signing three surprise moves with the promoter…",
    "Setting the opening odds against Pigeon Pete…",
];
let forgeTimer = null;
let fightInProgress = false;
let tactic = "push";
let currentLine = "";
let currentFighter = null;
let rematch = 0;
let currentRumourIndex = Math.floor(Math.random() * CORNER_RUMOURS.length);

function applyRumour(index) {
    currentRumourIndex = (index + CORNER_RUMOURS.length) % CORNER_RUMOURS.length;
    const rumour = CORNER_RUMOURS[currentRumourIndex];
    if (scoutCount) scoutCount.textContent = rumour.scout;
    if (scoutQuestion) scoutQuestion.textContent = rumour.question;
    scoutAnswer.hidden = true;
    scoutAnswer.textContent = "";
    scoutButton.disabled = false;
    scoutButton.querySelector("span").textContent = "ASK AROUND";
}

function randomizeTaglines(preserveHomeIfDossier = false) {
    if (awayLookBadge) {
        const awayTag = PETE_TAGLINES[Math.floor(Math.random() * PETE_TAGLINES.length)];
        awayLookBadge.textContent = awayTag;
    }
    if (homeLookBadge && (!preserveHomeIfDossier || !currentFighter)) {
        const homeTag = HOME_TAGLINES[Math.floor(Math.random() * HOME_TAGLINES.length)];
        homeLookBadge.textContent = homeTag;
    }
}

const draft = takeDraft();
if (draft) {
    lineInput.value = draft;
    count.textContent = String(draft.length);
}

lineInput.addEventListener("input", () => {
    count.textContent = String(lineInput.value.length);
});

scoutButton.addEventListener("click", () => {
    const rumour = CORNER_RUMOURS[currentRumourIndex];
    scoutAnswer.textContent = rumour.clue;
    scoutAnswer.hidden = false;
    scoutButton.disabled = true;
    scoutButton.querySelector("span").textContent = "THE WORD IS OUT";
});

cycleScoutButton?.addEventListener("click", () => {
    applyRumour(currentRumourIndex + 1);
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
    submitButton.innerHTML = 'INKING CARD <span aria-hidden="true">✦</span>';
    form.setAttribute("aria-busy", "true");
    $(".home-art")?.classList.add("is-inking");
    forgeHeading.textContent = token ? "The Pollinations forge is turning…" : "The house artist is sketching…";
    let stepIndex = 0;
    forgeStep.textContent = forgeMessages[stepIndex];
    clearInterval(forgeTimer);
    forgeTimer = setInterval(() => {
        stepIndex = (stepIndex + 1) % forgeMessages.length;
        forgeStep.textContent = forgeMessages[stepIndex];
    }, 1800);
    forgePanel.hidden = false;
    forgePanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    status.textContent = token ? "The artist’s got your line. Give them a moment." : "The house artist’s sketching a practice card.";
    try {
        const activeRumour = CORNER_RUMOURS[currentRumourIndex];
        const fighter = token
            ? await forgeFighter(currentLine, token, activeRumour)
            : makeFighter(currentLine, activeRumour);
        clearInterval(forgeTimer);
        forgePanel.hidden = true;
        $(".home-art")?.classList.remove("is-inking");
        if (fighter.dq) {
            status.textContent = fighter.reason || "The referee’s called a foul. Try a different contender.";
            submitButton.innerHTML = 'Make the intro <span aria-hidden="true">↗</span>';
            submitButton.disabled = false;
            form.setAttribute("aria-busy", "false");
            return;
        }
        showDossier(currentLine, fighter, Boolean(token));
    } catch (error) {
        clearInterval(forgeTimer);
        forgePanel.hidden = true;
        $(".home-art")?.classList.remove("is-inking");
        if (error instanceof Error && error.message.includes("expired")) {
            disconnectPollinations();
            renderAuthState();
        }
        status.textContent = error instanceof Error ? error.message : "The forge lost the thread. Try again.";
        submitButton.innerHTML = 'Make the intro <span aria-hidden="true">↗</span>';
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
    randomizeTaglines(true);
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
    card.className = `trait-card trait-${label.toLowerCase()}`;
    icon.className = "trait-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = ({ Strength: "✦", Weakness: "◌", Quirk: "✳", Power: "◆", Speed: "↗", Guard: "⬡", Look: "◉" })[label] ?? "·";
    name.textContent = label;
    if (["Power", "Speed", "Guard"].includes(label)) {
        const num = Math.max(1, Math.min(8, Math.round(Number(value)) || 1));
        const pips = Array.from({ length: 8 }, (_, i) => `<i class="${i < num ? "pip-on" : "pip-off"}"></i>`).join("");
        trait.className = "trait-stat-row";
        trait.innerHTML = `<span class="stat-val">${num}</span><span class="stat-pips" aria-hidden="true">${pips}</span>`;
    } else {
        trait.textContent = value;
    }
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
    const [style, mark] = fighterStyle(line, fighter.look);
    $("[data-home-look]").textContent = `${mark} DIVISION · CONTENDER`;
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

    round.textContent = `Round ${event.round}`;
    mark.className = "event-mark";
    mark.setAttribute("aria-hidden", "true");
    description.textContent = event.text;

    if (event.damage === 0) {
        item.className = "round-miss hit-miss";
        mark.textContent = "↝";
        damage.textContent = "0 damage";
    } else if (event.counter) {
        item.className = "round-hit hit-exploit";
        mark.textContent = "★";
        damage.textContent = `-${event.damage} PETE (EXPLOIT)`;
    } else if (event.isHome) {
        item.className = "round-hit hit-dealt";
        mark.textContent = "✦";
        damage.textContent = `-${event.damage} PETE`;
    } else {
        item.className = "round-hit hit-taken";
        mark.textContent = "▼";
        damage.textContent = `-${event.damage} YOU`;
    }

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
    const activeRumour = CORNER_RUMOURS[currentRumourIndex];
    const bout = simulateFight(currentLine, tactic, rematch, currentFighter ?? makeFighter(currentLine, activeRumour), activeRumour);

    playBell();

    const homePips = Array.from(document.querySelectorAll(".health-row div:first-child i"));
    const awayPips = Array.from(document.querySelectorAll(".health-row .health-away i"));
    const healthStatus = $(".health-row span");
    const cornerHome = $(".corner-home");
    const cornerAway = $(".corner-away");

    homePips.forEach((pip) => pip.classList.add("pip-on"));
    awayPips.forEach((pip) => pip.classList.add("pip-on"));
    if (healthStatus) healthStatus.textContent = "ROUND 1 OF 6 · BOUT UNDERWAY";

    roundLog.replaceChildren();
    $("[data-result-title]").textContent = "The bell goes";
    boutResult.hidden = false;
    boutResult.scrollIntoView({ behavior: "smooth", block: "start" });
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (let index = 0; index < bout.log.length; index += 1) {
        const event = bout.log[index];
        roundLog.append(makeRoundEntry(event));

        const homePipsActive = Math.ceil((event.homeHp / event.homeMaxHp) * homePips.length);
        const awayPipsActive = Math.ceil((event.awayHp / event.awayMaxHp) * awayPips.length);
        homePips.forEach((pip, idx) => pip.classList.toggle("pip-on", idx < homePipsActive));
        awayPips.forEach((pip, idx) => pip.classList.toggle("pip-on", idx < awayPipsActive));

        if (healthStatus) {
            healthStatus.textContent = `ROUND ${event.round} OF 6 · ${event.homeHp}HP vs ${event.awayHp}HP`;
        }

        if (event.damage > 0) {
            const defender = event.isHome ? cornerAway : cornerHome;
            if (defender) {
                defender.classList.remove("is-hit");
                void defender.offsetWidth;
                defender.classList.add("is-hit");
            }
        }

        if (event.damage === 0) {
            playMiss();
        } else if (event.counter) {
            playExploit();
        } else {
            playHit(event.critical);
        }

        const next = bout.log[index + 1];
        await wait(reducedMotion ? 40 : next?.round !== event.round ? 580 : 380);
    }

    if (bout.won) {
        playWin();
        if (healthStatus) healthStatus.textContent = "UPSET VICTORY · THE BELT IS YOURS";
    } else {
        playLoss();
        if (healthStatus) healthStatus.textContent = "BOUT OVER · THE HOUSE HOLDS";
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
    const activeRumour = CORNER_RUMOURS[currentRumourIndex];
    const replay = { v: 1, line: currentLine, tactic, rematch, rumourId: activeRumour?.id, fighter: currentFighter };
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
        const rumourIdx = CORNER_RUMOURS.findIndex((r) => r.id === replay.rumourId);
        if (rumourIdx >= 0) currentRumourIndex = rumourIdx;
        const activeRumour = CORNER_RUMOURS[currentRumourIndex];
        applyRumour(currentRumourIndex);
        currentFighter = restoreFighter(replay.fighter, currentLine, activeRumour);
        lineInput.value = currentLine;
        count.textContent = String(currentLine.length);
        scoutAnswer.textContent = activeRumour.clue;
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

function renderSoundState() {
    const active = isSoundEnabled();
    if (soundLabel) soundLabel.textContent = active ? "ON" : "OFF";
    if (soundToggle) soundToggle.setAttribute("aria-label", `Sound effects ${active ? "on" : "off"}`);
}

soundToggle?.addEventListener("click", () => {
    toggleSound();
    renderSoundState();
});

function showHowToPlay() {
    howDialog.showModal();
}

$("[data-action='close-how']").addEventListener("click", () => howDialog.close());

applyRumour(currentRumourIndex);
randomizeTaglines(false);
renderTape();
renderAuthState();
renderSoundState();
openSharedFight();
