import { makeFighter, makeChallenger, restoreFighter, simulateFight, CORNER_RUMOURS, PETE_TAGLINES, HOME_TAGLINES } from "./engine.js";
import { connectPollinations, disconnectPollinations, getAccessToken, takeDraft } from "./auth.js";
import { forgeFighter, getFighterAvatarUrl, loadFighterAvatar, generateCustomRumour } from "./pollinations.js";
import { isSoundEnabled, toggleSound, playBell, playHit, playExploit, playMiss, playWin, playLoss } from "./audio.js";

const $ = (selector) => document.querySelector(selector);
const lineInput = $("#fighter-line");
const count = $("[data-count]");
const scoutCount = $("[data-scout-count]");
const scoutQuestion = $("[data-scout-question]");
const scoutAnswer = $("[data-scout-answer]");
const scoutButton = $('[data-action="scout"]');
const cycleScoutButton = $('[data-action="cycle-scout"]');
const bribeButton = $('[data-action="bribe-scout"]');
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
const returnCornerButton = $("[data-action='return-corner']");
const seriesStamp = $("[data-series-stamp]");
const matchmakerSub = $("[data-matchmaker-sub]");
const homeHpVal = $("[data-home-hp-val]");
const homeHpBar = $("[data-home-hp-bar]");
const awayHpVal = $("[data-away-hp-val]");
const awayHpBar = $("[data-away-hp-bar]");
const zoomDialog = $("[data-zoom-dialog]");
const zoomMedia = $("[data-zoom-media]");
const zoomName = $("[data-zoom-name]");
const zoomLine = $("[data-zoom-line]");
const zoomTag = $("[data-zoom-tag]");
const closeZoomButton = $("[data-action='close-zoom']");
const homeAvatar = $("[data-home-avatar]");
const awayAvatar = $("[data-away-avatar]");
const stageHomeArt = $("[data-stage-home-art]");
const stageAwayArt = $("[data-stage-away-art]");
const defaultHomeSvg = stageHomeArt?.querySelector("svg")?.outerHTML ?? "";
const defaultAwaySvg = stageAwayArt?.querySelector("svg")?.outerHTML ?? "";
const challengerName = $("[data-challenger-name]");
const challengerLine = $("[data-challenger-line]");
const challengerTraits = $("[data-challenger-traits]");
const challengerMoves = $("[data-challenger-moves]");
const resultStampWrap = $("[data-result-stamp-wrap]");
const resultStamp = $("[data-result-stamp]");
const boutStripLeft = $("[data-bout-strip-left]");
const boutStripRight = $("[data-bout-strip-right]");
const stageMark = $("[data-stage-mark]");
const stageCaption = $("[data-stage-caption]");
const boutFooterLeft = $("[data-bout-footer-left]");
const boutFooterRight = $("[data-bout-footer-right]");
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
const MAX_BOUTS = 3;
let boutNumber = 1;
let seriesWins = 0;
let seriesLosses = 0;
let fightInProgress = false;
let tactic = "push";
let currentLine = "";
let currentFighter = null;
let rematch = 0;

function pickInitialRumourIndex() {
    let lastRumourId = null;
    try {
        lastRumourId = localStorage.getItem("basement-circuit:last-rumour");
    } catch {}
    const candidates = CORNER_RUMOURS.map((r, i) => ({ id: r.id, index: i }))
        .filter((r) => r.id !== lastRumourId);
    const pool = candidates.length > 0 ? candidates : CORNER_RUMOURS.map((r, i) => ({ id: r.id, index: i }));
    const picked = pool[Math.floor(Math.random() * pool.length)];
    try {
        localStorage.setItem("basement-circuit:last-rumour", picked.id);
    } catch {}
    return picked.index;
}

let currentRumourIndex = pickInitialRumourIndex();

function applyRumour(index) {
    currentRumourIndex = (index + CORNER_RUMOURS.length) % CORNER_RUMOURS.length;
    const rumour = CORNER_RUMOURS[currentRumourIndex];
    if (scoutCount) {
        scoutCount.textContent = rumour.scout || `SCOUT ${String(currentRumourIndex + 1).padStart(2, "0")} / ${String(CORNER_RUMOURS.length).padStart(2, "0")}`;
    }
    if (scoutQuestion) scoutQuestion.textContent = rumour.question;
    scoutAnswer.hidden = true;
    scoutAnswer.textContent = "";
    scoutButton.disabled = false;
    scoutButton.querySelector("span").textContent = "ASK AROUND";
    if (fightPanel && !fightPanel.hidden) {
        renderChallengerCard(rumour);
    }
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
    if (currentFighter) return;
    const rumour = CORNER_RUMOURS[currentRumourIndex];
    scoutAnswer.textContent = rumour.clue;
    scoutAnswer.hidden = false;
    scoutButton.disabled = true;
    scoutButton.querySelector("span").textContent = "THE WORD IS OUT";
});

cycleScoutButton?.addEventListener("click", () => {
    if (currentFighter) return;
    const available = CORNER_RUMOURS.map((_, i) => i).filter((i) => i !== currentRumourIndex);
    const nextIndex = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : 0;
    applyRumour(nextIndex);
    try {
        localStorage.setItem("basement-circuit:last-rumour", CORNER_RUMOURS[nextIndex].id);
    } catch {}
});

bribeButton?.addEventListener("click", async () => {
    if (currentFighter) return;
    const token = getAccessToken();
    if (!token) {
        status.textContent = "Connect your Pollen pass to bribe the informant for live AI rumours.";
        connectButton.focus();
        return;
    }
    bribeButton.disabled = true;
    const labelSpan = bribeButton.querySelector("span");
    if (labelSpan) labelSpan.textContent = "BRIBING…";
    else bribeButton.textContent = "BRIBING…";
    status.textContent = "Passing coins across the table for the latest cellar whisper…";
    try {
        const customRumour = await generateCustomRumour(token);
        CORNER_RUMOURS.unshift(customRumour);
        applyRumour(0);
        scoutAnswer.textContent = customRumour.clue;
        scoutAnswer.hidden = false;
        scoutButton.disabled = true;
        scoutButton.querySelector("span").textContent = "THE WORD IS OUT";
        try {
            localStorage.setItem("basement-circuit:last-rumour", customRumour.id);
        } catch {}
        status.textContent = "The informant took the bribe. Read the secret flaw above!";
    } catch (err) {
        status.textContent = err instanceof Error ? err.message : "The informant pocketed your coins and slipped away.";
    } finally {
        bribeButton.disabled = false;
        if (labelSpan) labelSpan.textContent = "✦ BRIBE INFORMANT";
        else bribeButton.textContent = "✦ BRIBE INFORMANT";
    }
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    currentLine = lineInput.value.trim().replace(/\s+/g, " ");
    if (!scoutAnswer.textContent) {
        status.innerHTML = `
            <span class="status-manicule" aria-hidden="true">
                <svg viewBox="0 0 32 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M30 4v12" />
                    <path d="M26 3v14" />
                    <path d="M22 3v14" />
                    <path d="M22 6c-2-3-6-3-8-1l-3 3" />
                    <path d="M12 8H3c-1.1 0-2 .9-2 2s.9 2 2 2h9" />
                    <path d="M12 12h4c1.1 0 2 .7 2 1.5s-.9 1.5-2 1.5h-3" />
                    <path d="M13 15h4c1.1 0 2 .7 2 1.5s-.9 1.5-2 1.5h-4" />
                </svg>
            </span>
            <span>Get the word from the corner before you write your contender.</span>
        `;
        scoutButton.focus();
        return;
    }
    if (!currentLine) return;
    boutNumber = 1;
    seriesWins = 0;
    seriesLosses = 0;
    rematch = 0;
    roundLog.replaceChildren();
    boutResult.hidden = true;
    if (resultStampWrap) resultStampWrap.hidden = true;
    const token = getAccessToken();
    const submitButton = form.querySelector("[type='submit']");
    submitButton.disabled = true;
    submitButton.innerHTML = 'INKING CARD <span aria-hidden="true">✦</span>';
    form.setAttribute("aria-busy", "true");
    $(".home-art")?.classList.add("is-inking");
    forgeHeading.textContent = token ? "The Pollinations press is running…" : "The house artist is sketching…";
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
        status.textContent = error instanceof Error ? error.message : "The press lost the thread. Try again.";
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
returnCornerButton?.addEventListener("click", () => {
    if (boutNumber <= MAX_BOUTS && returnCornerButton.dataset.action === "return-corner") {
        fightPanel.scrollIntoView({ behavior: "smooth", block: "start" });
        randomizeTaglines(true);
        renderChallengerCard(CORNER_RUMOURS[currentRumourIndex]);
        if (homeHpVal && currentFighter) homeHpVal.textContent = `${currentFighter.maxHp} HP`;
        if (homeHpBar) homeHpBar.style.width = "100%";
        $("[data-fight-status]").textContent = `Corner sponge down complete. HP restored to full (${currentFighter?.maxHp || 76} HP) for Bout 0${boutNumber}.`;
    } else {
        lineInput.readOnly = false;
        lineInput.value = "";
        count.textContent = "0";
        const submitButton = form.querySelector("[type='submit']");
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Make the intro <span aria-hidden="true">↗</span>';
        }
        if (cycleScoutButton) {
            cycleScoutButton.disabled = false;
            cycleScoutButton.removeAttribute("title");
        }
        if (bribeButton) {
            bribeButton.disabled = false;
            bribeButton.removeAttribute("title");
        }
        form.setAttribute("aria-busy", "false");
        renderAuthState();
        currentFighter = null;
        boutNumber = 1;
        seriesWins = 0;
        seriesLosses = 0;
        rematch = 0;
        fightPanel.hidden = true;
        boutResult.hidden = true;
        applyRumour(currentRumourIndex);
        if (stageHomeArt && defaultHomeSvg) {
            stageHomeArt.innerHTML = '<span class="fighter-mark" data-home-mark></span>' + defaultHomeSvg;
        }
        if (stageAwayArt && defaultAwaySvg) {
            stageAwayArt.innerHTML = defaultAwaySvg;
        }
        if (boutStripLeft) boutStripLeft.textContent = "TONIGHT’S MAIN EVENT";
        if (boutStripRight) {
            boutStripRight.textContent = "RULES: MOSTLY FAIR";
            boutStripRight.style.color = "";
        }
        if (stageMark) {
            stageMark.textContent = "VS";
            stageMark.className = "stage-mark";
        }
        if (stageCaption) {
            stageCaption.textContent = "SOMEONE HAS TO LOSE";
            stageCaption.className = "stage-caption";
        }
        if (boutFooterLeft) boutFooterLeft.textContent = "SEVEN ROUNDS OR A KNOCKOUT";
        if (boutFooterRight) boutFooterRight.textContent = "THE HOUSE TAKES NO RESPONSIBILITY";
        const cornerHome = $(".corner-home");
        const cornerAway = $(".corner-away");
        cornerHome?.classList.remove("is-series-winner", "is-series-loser");
        cornerAway?.classList.remove("is-series-winner", "is-series-loser");
        const healthStatus = $(".health-row span");
        if (healthStatus) {
            healthStatus.textContent = "WAITING ON THE INTRODUCTIONS";
            healthStatus.className = "";
        }
        const cornerHomeLabel = $(".corner-home .corner-label b");
        if (cornerHomeLabel) cornerHomeLabel.textContent = "THE UNKNOWN";
        if (seriesStamp) seriesStamp.textContent = `BOUT 01 / 03`;
        if (matchmakerSub) matchmakerSub.textContent = `BOUT 01 / 03 · SEVEN ROUNDS`;
        status.textContent = "A good line can beat a bad matchup.";
        $("#top")?.scrollIntoView({ behavior: "smooth", block: "start" });
        lineInput.focus();
    }
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

async function renderAvatar(container, fighter, isChallenger = false) {
    if (!container) return;
    const token = getAccessToken();
    container.innerHTML = isChallenger
        ? '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 3a6 6 0 0 0-6 6c0 1.2.4 2.3 1 3.2L4 16v3h3l3.5-3.5c.5.3 1 .5 1.5.5h1l6-2v-3l-2-1c.7-.9 1-2 1-3a6 6 0 0 0-6-6zm-1 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-3 8.5l-1.5 1.5H6.5l3-3 1 1z"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a5 5 0 0 0-5 5v1.2A5 5 0 0 0 4 13v1a3 3 0 0 0 3 3h1v4a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4h1a3 3 0 0 0 3-3v-1a5 5 0 0 0-3-4.8V7a5 5 0 0 0-5-5zm-3 7a3 3 0 1 1 6 0v1h-6V9zm7 5a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-1h8v1z"/></svg>';

    if (!token) return;

    try {
        const objectUrl = await loadFighterAvatar(fighter, isChallenger, token);
        if (objectUrl) {
            const img = document.createElement("img");
            img.src = objectUrl;
            img.alt = fighter.name || (isChallenger ? "Pigeon Pete" : "Contender");
            img.loading = "lazy";
            img.decoding = "async";
            container.replaceChildren(img);

            const stageArt = isChallenger ? stageAwayArt : stageHomeArt;
            if (stageArt) {
                const mark = stageArt.querySelector("[data-home-mark]");
                const stageFrame = document.createElement("div");
                stageFrame.className = "fighter-stage-frame";
                stageFrame.title = "Click to inspect portrait";
                const stageImg = document.createElement("img");
                stageImg.src = objectUrl;
                stageImg.alt = fighter.name || (isChallenger ? "Pigeon Pete" : "Contender");
                stageImg.loading = "lazy";
                stageImg.decoding = "async";
                stageFrame.appendChild(stageImg);
                if (mark) {
                    stageArt.replaceChildren(mark, stageFrame);
                } else {
                    stageArt.replaceChildren(stageFrame);
                }
            }
        }
    } catch {
        // Retain the SVG silhouette
    }
}

function renderChallengerCard(rumour) {
    const challenger = makeChallenger(rumour, rematch);
    if (challengerName) challengerName.textContent = challenger.name;
    if (awayHpVal) awayHpVal.textContent = `${challenger.maxHp} HP`;
    if (awayHpBar) awayHpBar.style.width = "100%";
    if (challengerTraits) {
        challengerTraits.replaceChildren(
            makeTrait("Strength", challenger.strength),
            makeTrait("Weakness", challenger.weakness),
            makeTrait("Quirk", challenger.quirk),
            makeTrait("Power", String(challenger.stats.power)),
            makeTrait("Speed", String(challenger.stats.speed)),
            makeTrait("Guard", String(challenger.stats.guard)),
        );
        if (challenger.look) challengerTraits.append(makeTrait("Look", challenger.look));
    }
    if (challengerMoves) {
        challengerMoves.replaceChildren(...(challenger.moves ?? []).map((move) => {
            const chip = document.createElement("span");
            chip.className = "move-chip";
            chip.textContent = move.name.toLocaleLowerCase("en-GB").replace(/\b\p{L}/gu, (letter) => letter.toLocaleUpperCase("en-GB"));
            return chip;
        }));
    }
    renderAvatar(awayAvatar, challenger, true);
}

function showDossier(line, fighter, fromPollinations = false) {
    currentFighter = fighter;
    lineInput.readOnly = true;
    form.querySelector("[type='submit']").disabled = true;
    form.querySelector("[type='submit']").textContent = "LINE SEALED";
    form.setAttribute("aria-busy", "false");
    if (cycleScoutButton) {
        cycleScoutButton.disabled = true;
        cycleScoutButton.title = "Rumour locked for the active bout series";
    }
    if (bribeButton) {
        bribeButton.disabled = true;
        bribeButton.title = "Matchup sealed. Bribe available when drafting a new card";
    }
    if (scoutButton) {
        scoutButton.disabled = true;
    }
    if (boutStripLeft) boutStripLeft.textContent = "TONIGHT’S MAIN EVENT";
    if (boutStripRight) {
        boutStripRight.textContent = "RULES: MOSTLY FAIR";
        boutStripRight.style.color = "";
    }
    if (stageMark) {
        stageMark.textContent = "VS";
        stageMark.className = "stage-mark";
    }
    if (stageCaption) {
        stageCaption.textContent = "SOMEONE HAS TO LOSE";
        stageCaption.className = "stage-caption";
    }
    if (boutFooterLeft) boutFooterLeft.textContent = "SEVEN ROUNDS OR A KNOCKOUT";
    if (boutFooterRight) boutFooterRight.textContent = "THE HOUSE TAKES NO RESPONSIBILITY";
    $(".corner-home")?.classList.remove("is-series-winner", "is-series-loser");
    $(".corner-away")?.classList.remove("is-series-winner", "is-series-loser");
    $("[data-fighter-name]").textContent = fighter.name;
    $(".corner-home .corner-label b").textContent = fighter.name;
    if (homeHpVal) homeHpVal.textContent = `${fighter.maxHp} HP`;
    if (homeHpBar) homeHpBar.style.width = "100%";
    if (seriesStamp) seriesStamp.textContent = `BOUT 01 / 03`;
    if (matchmakerSub) matchmakerSub.textContent = `BOUT 01 / 03 · SEVEN ROUNDS`;
    startFightButton.innerHTML = 'Ring Bout 1 <span aria-hidden="true">↗</span>';
    startFightButton.disabled = false;
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
    renderAvatar(homeAvatar, fighter, false);
    renderChallengerCard(CORNER_RUMOURS[currentRumourIndex]);
    $("[data-fight-status]").textContent = fromPollinations ? "Inked by Pollinations · one text call." : "Local rules preview · no Pollen used.";
    fightPanel.hidden = false;
    boutResult.hidden = true;
    if (resultStampWrap) resultStampWrap.hidden = true;
    status.textContent = fromPollinations ? "Your fighter’s on the card. Pick a corner call." : "Practice card ready. Connect Pollen to let the artist take a turn.";
    fightPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function makeRoundEntry(event) {
    const item = document.createElement("li");
    const round = document.createElement("b");
    const mark = document.createElement("span");
    const description = document.createElement("p");
    const damage = document.createElement("small");

    round.textContent = event.round === 8 ? "Tie-Breaker" : `Round ${event.round}`;
    if (event.round === 8) item.className = "round-sudden-death ";
    mark.className = "event-mark";
    mark.setAttribute("aria-hidden", "true");
    description.textContent = event.text;

    if (event.damage === 0) {
        item.className += "round-miss hit-miss";
        mark.textContent = "↝";
        damage.textContent = "0 damage";
    } else if (event.counter) {
        item.className += "round-hit hit-exploit";
        mark.textContent = "★";
        damage.textContent = `-${event.damage} PETE (EXPLOIT)`;
    } else if (event.isHome) {
        item.className += "round-hit hit-dealt";
        mark.textContent = "✦";
        damage.textContent = `-${event.damage} PETE`;
    } else {
        item.className += "round-hit hit-taken";
        mark.textContent = "▼";
        damage.textContent = `-${event.damage} YOU`;
    }

    if (event.damage > 0) {
        const puff = document.createElement("span");
        puff.className = "dust-puff";
        puff.setAttribute("aria-hidden", "true");
        damage.append(puff);
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
    if (returnCornerButton) returnCornerButton.disabled = true;
    $("[data-action='share']").disabled = true;
    if (resultStampWrap) resultStampWrap.hidden = true;
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
    if (healthStatus) healthStatus.textContent = `BOUT ${boutNumber} OF 3 · UNDERWAY`;

    roundLog.replaceChildren();
    $("[data-result-title]").textContent = "The bell goes";
    if (homeHpVal && bout.fighter) homeHpVal.textContent = `${bout.fighter.maxHp} / ${bout.fighter.maxHp} HP`;
    if (homeHpBar) homeHpBar.style.width = "100%";
    if (awayHpVal && bout.challenger) awayHpVal.textContent = `${bout.challenger.maxHp} / ${bout.challenger.maxHp} HP`;
    if (awayHpBar) awayHpBar.style.width = "100%";
    boutResult.hidden = false;
    boutResult.scrollIntoView({ behavior: "smooth", block: "start" });
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (let index = 0; index < bout.log.length; index += 1) {
        const event = bout.log[index];
        const entry = makeRoundEntry(event);
        roundLog.append(entry);
        entry.scrollIntoView({ behavior: "smooth", block: "end" });

        const homePipsActive = Math.ceil((event.homeHp / event.homeMaxHp) * homePips.length);
        const awayPipsActive = Math.ceil((event.awayHp / event.awayMaxHp) * awayPips.length);
        homePips.forEach((pip, idx) => pip.classList.toggle("pip-on", idx < homePipsActive));
        awayPips.forEach((pip, idx) => pip.classList.toggle("pip-on", idx < awayPipsActive));

        if (homeHpVal) homeHpVal.textContent = `${Math.max(0, event.homeHp)} / ${event.homeMaxHp} HP`;
        if (homeHpBar) homeHpBar.style.width = `${Math.max(0, Math.min(100, (event.homeHp / event.homeMaxHp) * 100))}%`;
        if (awayHpVal) awayHpVal.textContent = `${Math.max(0, event.awayHp)} / ${event.awayMaxHp} HP`;
        if (awayHpBar) awayHpBar.style.width = `${Math.max(0, Math.min(100, (event.awayHp / event.awayMaxHp) * 100))}%`;

        if (healthStatus) {
            const roundLabel = event.round === 8 ? "TIE-BREAKER" : `ROUND ${event.round} OF 7`;
            healthStatus.textContent = `BOUT ${boutNumber} · ${roundLabel} · ${event.homeHp}HP vs ${event.awayHp}HP`;
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

    const verdictEntry = makeVerdictEntry(bout);
    roundLog.append(verdictEntry);
    verdictEntry.scrollIntoView({ behavior: "smooth", block: "end" });

    const finalEvent = bout.log.at(-1);
    if (finalEvent) {
        if (homeHpVal) homeHpVal.textContent = finalEvent.homeHp <= 0 ? `0 / ${finalEvent.homeMaxHp} HP (KO'D)` : `${finalEvent.homeHp} / ${finalEvent.homeMaxHp} HP`;
        if (awayHpVal) awayHpVal.textContent = finalEvent.awayHp <= 0 ? `0 / ${finalEvent.awayMaxHp} HP (KO'D)` : `${finalEvent.awayHp} / ${finalEvent.awayMaxHp} HP`;
    }

    if (bout.won) {
        seriesWins += 1;
        playWin();
    } else {
        seriesLosses += 1;
        playLoss();
    }
    if (healthStatus) {
        healthStatus.textContent = `${bout.winner.toUpperCase()} WINS · ${bout.verdict} (${bout.rounds} ROUNDS)`;
    }

    if (resultStampWrap && resultStamp) {
        resultStampWrap.hidden = false;
        resultStamp.className = `result-stamp ${bout.won ? "is-win" : "is-loss"}`;
        resultStamp.textContent = bout.won ? `${bout.fighter.name.toUpperCase()} WINS` : `${bout.challenger.name.toUpperCase()} WINS`;
    }

    $("[data-result-title]").textContent = bout.won
        ? `${bout.fighter.name} wins by ${bout.verdict.toLowerCase()}`
        : `${bout.challenger.name} wins by ${bout.verdict.toLowerCase()}`;

    if (boutNumber < MAX_BOUTS) {
        boutNumber += 1;
        rematch = boutNumber - 1;
        startFightButton.disabled = false;
        startFightButton.innerHTML = `Ring Bout 0${boutNumber} <span aria-hidden="true">↗</span>`;
        if (matchmakerSub) matchmakerSub.textContent = `BOUT 0${boutNumber} / 03 · SEVEN ROUNDS`;
        if (seriesStamp) seriesStamp.textContent = `BOUT 0${boutNumber} / 03`;
        if (returnCornerButton) {
            returnCornerButton.textContent = `RETURN TO CORNER (RESTORE HP FOR BOUT 0${boutNumber}) ↑`;
            returnCornerButton.dataset.action = "return-corner";
            returnCornerButton.disabled = false;
        }
        $("[data-fight-status]").textContent = `Bout 0${boutNumber - 1} finished (${bout.won ? "Win" : "Loss"}). Return to corner to restore full HP and pick tactics for Bout 0${boutNumber}.`;
    } else {
        startFightButton.disabled = true;
        startFightButton.innerHTML = 'Series Complete <span aria-hidden="true">✓</span>';
        const seriesWon = seriesWins > seriesLosses;
        const seriesVerdict = seriesWon ? "SERIES WON" : "SERIES LOST";
        const winnerName = seriesWon ? (currentFighter?.name?.toUpperCase() || "YOU") : "PIGEON PETE";
        const score = `${seriesWins}-${seriesLosses}`;

        if (boutStripLeft) boutStripLeft.textContent = `SERIES CONCLUDED · 3 BOUTS`;
        if (boutStripRight) {
            boutStripRight.textContent = `CHAMPION: ${winnerName} (${score})`;
            boutStripRight.style.color = seriesWon ? "var(--acid)" : "#f77a63";
        }
        if (stageMark) {
            stageMark.textContent = score;
            stageMark.className = `stage-mark ${seriesWon ? "is-series-win" : "is-series-loss"}`;
        }
        if (stageCaption) {
            stageCaption.textContent = seriesWon ? "SERIES CHAMPION" : "PETE RETAINS BELT";
            stageCaption.classList.add("is-series-verdict");
        }
        if (healthStatus) {
            healthStatus.textContent = `🏆 ${winnerName} WINS THE SERIES (${score}) · BOUT 3: ${bout.winner.toUpperCase()} (${bout.verdict})`;
            healthStatus.className = `is-series-verdict ${seriesWon ? "is-win" : "is-loss"}`;
        }
        if (cornerHome && cornerAway) {
            if (seriesWon) {
                cornerHome.classList.add("is-series-winner");
                cornerAway.classList.add("is-series-loser");
            } else {
                cornerAway.classList.add("is-series-winner");
                cornerHome.classList.add("is-series-loser");
            }
        }
        if (boutFooterLeft) boutFooterLeft.textContent = `FINAL STANDING: ${seriesWins} WINS · ${seriesLosses} LOSSES`;
        if (boutFooterRight) boutFooterRight.textContent = seriesWon ? "ODD BELT CLAIMED · CONTENDER TRIUMPHS" : "HOUSE RETAINS THE PURSE";

        if (matchmakerSub) matchmakerSub.textContent = `SERIES CONCLUDED · ${seriesWins}W - ${seriesLosses}L`;
        if (seriesStamp) seriesStamp.textContent = `${seriesWins}W - ${seriesLosses}L`;
        if (returnCornerButton) {
            returnCornerButton.textContent = `SERIES ${seriesVerdict} (${seriesWins}W - ${seriesLosses}L) · DRAFT NEW CONTENDER ↑`;
            returnCornerButton.dataset.action = "new-card";
            returnCornerButton.disabled = false;
        }
        $("[data-fight-status]").textContent = `3 Bouts Concluded · ${seriesVerdict} (${seriesWins}W - ${seriesLosses}L). Draft a new contender.`;
    }

    $("[data-action='share']").disabled = false;
    fightInProgress = false;
    saveBout({
        line: currentLine,
        won: bout.won,
        winner: bout.winner,
        verdict: bout.verdict,
        rounds: bout.rounds,
    });
}

function makeVerdictEntry(bout) {
    const item = document.createElement("li");
    item.className = `round-verdict ${bout.won ? "verdict-win" : "verdict-loss"}`;

    const banner = document.createElement("div");
    banner.className = "verdict-banner";

    const badge = document.createElement("span");
    badge.className = "verdict-badge";
    badge.textContent = bout.won ? "OFFICIAL WINNER" : "HOUSE VICTORY";

    const heading = document.createElement("h3");
    heading.textContent = bout.won ? `${bout.fighter.name} WINS!` : `${bout.challenger.name} WINS!`;

    const detail = document.createElement("p");
    detail.textContent = `${bout.verdict} · ${bout.rounds} ROUNDS CONTESTED`;

    banner.append(badge, heading, detail);
    item.append(banner);
    return item;
}

function clearTape() {
    try {
        localStorage.removeItem("basement-circuit:tape");
        localStorage.removeItem("last-line:tape");
    } catch {}
    renderTape([]);
}

function readTape() {
    try {
        const records = JSON.parse(localStorage.getItem("basement-circuit:tape") ?? localStorage.getItem("last-line:tape") ?? "[]");
        return Array.isArray(records)
            ? records.filter((record) => record && typeof record.line === "string" && typeof record.won === "boolean" && Number.isFinite(record.rounds)).slice(0, 10)
            : [];
    } catch {
        return [];
    }
}

function saveBout(record) {
    const records = [{ ...record, date: Date.now() }, ...readTape()].slice(0, 10);
    try {
        localStorage.setItem("basement-circuit:tape", JSON.stringify(records));
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
        result.className = record.won ? "tape-win" : "tape-loss";
        line.textContent = record.line;
        const winnerLabel = record.winner ? (record.won ? "YOU WON" : `${record.winner.toUpperCase()} WON`) : (record.won ? "WIN" : "PETE WON");
        mark.textContent = `${winnerLabel} · ${record.verdict ?? "DECISION"} (${record.rounds}R)`;
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
        if (replay.v !== 1 || typeof replay.line !== "string" || !replay.line.trim() || replay.line.length > 80) return;
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
    if (!lineInput.readOnly) submitButton.textContent = connected ? "Ink with Pollinations" : "Make practice card";
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
howDialog?.addEventListener("click", (event) => {
    const rect = howDialog.getBoundingClientRect();
    const isInDialog = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
    );
    if (!isInDialog) howDialog.close();
});

function openZoom(isChallenger) {
    if (!zoomDialog) return;
    const stageArt = isChallenger ? stageAwayArt : stageHomeArt;
    const avatarEl = isChallenger ? awayAvatar : homeAvatar;
    const fighter = isChallenger ? makeChallenger(CORNER_RUMOURS[currentRumourIndex], rematch) : currentFighter;
    if (!fighter && !isChallenger) return;
    const img = stageArt?.querySelector("img") || avatarEl?.querySelector("img");
    const svg = avatarEl?.querySelector("svg") || stageArt?.querySelector("svg");
    if (zoomMedia) {
        if (img) {
            zoomMedia.innerHTML = `<img src="${img.src}" alt="${fighter?.name || 'Portrait'}" />`;
        } else if (svg) {
            zoomMedia.innerHTML = svg.outerHTML;
        }
    }
    if (zoomTag) zoomTag.textContent = isChallenger ? "HOUSE CHAMPION PORTRAIT" : "CONTENDER PORTRAIT";
    if (zoomName) zoomName.textContent = fighter?.name || (isChallenger ? "Pigeon Pete" : "The Unknown");
    zoomDialog.showModal();
}

homeAvatar?.addEventListener("click", () => openZoom(false));
awayAvatar?.addEventListener("click", () => openZoom(true));
stageHomeArt?.addEventListener("click", () => openZoom(false));
stageAwayArt?.addEventListener("click", () => openZoom(true));
closeZoomButton?.addEventListener("click", () => zoomDialog?.close());
zoomDialog?.addEventListener("click", (event) => {
    const card = zoomDialog.querySelector(".zoom-card");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const isInCard = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
    );
    if (!isInCard) zoomDialog.close();
});

$("[data-action='clear-tape']")?.addEventListener("click", () => clearTape());

applyRumour(currentRumourIndex);
randomizeTaglines(false);
renderTape();
renderAuthState();
renderSoundState();
openSharedFight();
