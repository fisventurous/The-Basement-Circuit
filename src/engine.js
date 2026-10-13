const challenger = {
    name: "Pigeon Pete",
    power: 4,
    speed: 7,
    guard: 4,
    maxHp: 76,
    hp: 76,
};

const CORNER_RUMOURS = [
    {
        id: "crisps",
        scout: "SCOUT 01 / 06",
        question: "Pete’s been seen circling the chip shop. What’s he afraid of?",
        clue: "A sleeve of crisps will draw him off. The grudge is your call.",
        hint: "crisps, chips, crumbs, or snacks",
        pattern: /\b(crisps?|chips?|crumbs?|bread|corn|snack|sleeve|pasty|pasties)\b/i,
        strength: "Crisps on the wind",
        moves: [{ name: "Crisp decoy", kind: "trick" }, { name: "Lid slam", kind: "strike" }, { name: "Play dead", kind: "brace" }],
        counterText: (actor) => `${actor.name} flashes the crisp packet. Pete forgets the entire sport.`,
    },
    {
        id: "mirrors",
        scout: "SCOUT 02 / 06",
        question: "Pete spent the morning pacing the jeweller’s alley. What dazzles him?",
        clue: "Foil sheets or polished chrome blind his peck. Keep it shiny.",
        hint: "foil, mirrors, chrome, or shiny reflections",
        pattern: /\b(foil|mirrors?|chrome|shiny|glint|reflection|silver|flash|prism)\b/i,
        strength: "Blinding reflections",
        moves: [{ name: "Foil glare", kind: "trick" }, { name: "Prism flash", kind: "feint" }, { name: "Duck low", kind: "brace" }],
        counterText: (actor) => `${actor.name} catches the light with polished foil. Pete pecks his own reflection.`,
    },
    {
        id: "water",
        scout: "SCOUT 03 / 06",
        question: "Pete won’t fly anywhere near the canal lock gates. What weighs him down?",
        clue: "Soak his wings with water or heavy rain. Drenched feathers can’t dodge.",
        hint: "water, rain, puddles, splash, or sponges",
        pattern: /\b(water|rain|sponge|splash|bucket|drench|hose|puddle|tea|kettle)\b/i,
        strength: "Heavy downpour",
        moves: [{ name: "Canal splash", kind: "trick" }, { name: "Soaked jab", kind: "strike" }, { name: "Tuck in", kind: "brace" }],
        counterText: (actor) => `${actor.name} unloads a bucket of murky canal water. Pete’s wings double in weight.`,
    },
    {
        id: "horns",
        scout: "SCOUT 04 / 06",
        question: "The church bells rang at noon and Pete dropped to the cobbles. Why?",
        clue: "Loud clatters, brass horns, and sudden rattles ruin his inner ear.",
        hint: "horns, bells, whistles, sirens, or loud noise",
        pattern: /\b(bell|horn|whistle|gong|siren|cymbal|shout|rattle|trumpet|alarm)\b/i,
        strength: "Deafening clamour",
        moves: [{ name: "Klaxon blast", kind: "trick" }, { name: "Rattle feint", kind: "feint" }, { name: "Cover ears", kind: "brace" }],
        counterText: (actor) => `${actor.name} sounds a deafening horn blast. Pete covers his head in panic.`,
    },
    {
        id: "felines",
        scout: "SCOUT 05 / 06",
        question: "Someone saw Pete bolt off the gutter yesterday. Who was prowling up there?",
        clue: "He still owes the ginger tom three feathers. Bring claws or feline swagger.",
        hint: "cats, claws, paws, felines, or whiskers",
        pattern: /\b(cats?|feline|claws?|whiskers?|paws?|kitten|tiger|purr)\b/i,
        strength: "Alley cat swagger",
        moves: [{ name: "Alley hiss", kind: "trick" }, { name: "Pounce", kind: "strike" }, { name: "Arch back", kind: "brace" }],
        counterText: (actor) => `${actor.name} gives a low alley-cat hiss. Pete leaps clean out of his boots.`,
    },
    {
        id: "owls",
        scout: "SCOUT 06 / 06",
        question: "Pete won’t roost on the park pergola anymore. What’s perched there?",
        clue: "Carved stone owls and frozen statues give him nightmares. Stand dead still.",
        hint: "owls, statues, scarecrows, stone, or frozen poses",
        pattern: /\b(owl|statue|scarecrow|stone|hawk|marble|frozen|gargoyle)\b/i,
        strength: "Rigid owl stare",
        moves: [{ name: "Owl stare", kind: "trick" }, { name: "Stone feint", kind: "feint" }, { name: "Freeze pose", kind: "brace" }],
        counterText: (actor) => `${actor.name} locks into a rigid predator pose. Pete freezes stiff in terror.`,
    },
];

const PETE_TAGLINES = [
    "LOCAL MENACE · EST. TUESDAY",
    "CRUMB MAGNATE · 14 FIGHTS UNDEFEATED",
    "GUTTER EMPEROR · UNPAID FINES",
    "SQUARE MILE TYRANT · NO WEIGH-IN",
    "COBBLESTONE TERROR · SHARP BEAK",
    "FEATHERWEIGHT DICTATOR · 0 TAXES",
];

const HOME_TAGLINES = [
    "HAND-CUT CONTENDER · BAD IDEAS",
    "TAPED KNUCKLES · NO REGRETS",
    "BASEMENT WILDCARD · DEBT-FREE",
    "CHIP SHOP REGULAR · UNTESTED",
    "ROUND FOUR SPECIALIST · RAW GRIT",
    "FLAT CAP & BANDAGES · READY",
];

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function hash(value) {
    let result = 2166136261;
    for (const char of value) result = Math.imul(result ^ char.codePointAt(0), 16777619);
    return result >>> 0;
}

function randomFrom(seed) {
    let value = seed;
    return () => {
        value += 0x6d2b79f5;
        let next = value;
        next = Math.imul(next ^ (next >>> 15), next | 1);
        next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
        return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
    };
}

function fighterName(line) {
    const words = line.match(/[\p{L}\p{N}']+/gu) ?? [];
    const filler = new Set(["a", "an", "the", "my", "who", "that", "with", "from", "before", "after", "and", "then", "of", "in", "on"]);
    const name = words.filter((word) => !filler.has(word.toLocaleLowerCase("en-GB")))
        .slice(0, 3)
        .map((word) => {
            const readable = word.toLocaleLowerCase("en-GB");
            return readable[0].toLocaleUpperCase("en-GB") + readable.slice(1);
        })
        .join(" ");
    return name || "The Unknown";
}

function fighterLean(line) {
    const signals = [
        [/\b(heavy|strong|giant|brute|tank|hammer|massive|stout)\b/i, "power"],
        [/\b(fast|quick|light|ghost|sprint|slippery|blink|wind)\b/i, "speed"],
        [/\b(shield|armou?r|stone|iron|wall|shell|brick|sturdy)\b/i, "guard"],
    ];
    return signals.find(([pattern]) => pattern.test(line))?.[1] ?? "speed";
}

function makeFighter(line, rumour = CORNER_RUMOURS[0]) {
    const lean = fighterLean(line);
    const stats = { power: 5, speed: 5, guard: 5 };
    stats[lean] += 2;
    for (const stat of Object.keys(stats)) if (stat !== lean) stats[stat] -= 1;
    const words = line.match(/[\p{L}\p{N}']+/gu) ?? [];
    const specificity = clamp(Math.floor(new Set(words.map((word) => word.toLocaleLowerCase("en-GB"))).size / 4), 0, 3);
    const hasExploit = Boolean(rumour?.pattern?.test(line));
    const weakness = /\b(only|unless|afraid|scared|hates?|cannot|can't)\b/i.test(line) ? "A very specific problem" : "A short attention span";
    const strength = hasExploit ? (rumour.strength ?? "Spotted the flaw") : ({ power: "Heavy hands", speed: "Too quick to pin", guard: "A walking wall" })[lean];
    const quirk = /\b(polite|sorry|apolog|retired|haunted|tiny|very)\b/i.test(line) ? "A strange little habit" : "Hears the crowd";
    const moves = hasExploit
        ? rumour.moves
        : [{ name: "Body shot", kind: "strike" }, { name: "Dust-cloud feint", kind: "feint" }, { name: "Tuck and roll", kind: "brace" }];
    return {
        name: fighterName(line),
        line,
        stats,
        specificity,
        hasCrisps: hasExploit,
        hasExploit,
        strength,
        weakness,
        quirk,
        moves,
        look: "A hand-cut contender in taped gloves and a jacket that has seen things.",
    };
}

function restoreFighter(value, line, rumour = CORNER_RUMOURS[0]) {
    if (!value || typeof value !== "object") return makeFighter(line, rumour);
    const clean = (text, fallback, limit) => typeof text === "string"
        ? text.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, limit) || fallback
        : fallback;
    const readable = (text, fallback, limit) => {
        const value = clean(text, fallback, limit);
        return value === value.toLocaleUpperCase("en-GB")
            ? value.toLocaleLowerCase("en-GB").replace(/(^|\s)\p{L}/gu, (letter) => letter.toLocaleUpperCase("en-GB"))
            : value;
    };
    const stats = Object.fromEntries(["power", "speed", "guard"].map((key) => [key, clamp(Number(value.stats?.[key]) || 1, 1, 8)]));
    while (stats.power + stats.speed + stats.guard > 15) {
        const largest = Object.keys(stats).sort((a, b) => stats[b] - stats[a])[0];
        if (stats[largest] <= 1) break;
        stats[largest] -= 1;
    }
    while (stats.power + stats.speed + stats.guard < 15) {
        const smallest = Object.keys(stats).sort((a, b) => stats[a] - stats[b])[0];
        if (stats[smallest] >= 8) break;
        stats[smallest] += 1;
    }
    const defaults = makeFighter(line, rumour);
    const moves = Array.isArray(value.moves) ? value.moves.slice(0, 3).map((move, index) => ({
        name: readable(move?.name, defaults.moves[index]?.name ?? "Body shot", 28),
        kind: ["strike", "trick", "feint", "brace"].includes(move?.kind) ? move.kind : "strike",
    })) : defaults.moves;
    while (moves.length < 3) moves.push(defaults.moves[moves.length]);
    const hasExploit = value.hasExploit === true || value.hasCrisps === true || Boolean(rumour?.pattern?.test(line));
    return {
        ...defaults,
        name: readable(value.name, defaults.name, 32),
        line,
        look: readable(value.look, defaults.look, 120),
        strength: readable(value.strength, defaults.strength, 48),
        weakness: readable(value.weakness, defaults.weakness, 48),
        quirk: readable(value.quirk, defaults.quirk, 48),
        stats,
        specificity: clamp(Number(value.specificity) || 0, 0, 3),
        hasCrisps: hasExploit,
        hasExploit,
        moves,
    };
}

function combatant(fighter, isHome) {
    return { ...fighter, isHome, maxHp: 56 + fighter.stats.guard * 4, hp: 56 + fighter.stats.guard * 4, guardUp: false, cornerCalled: false };
}

function narrate(actor, target, move, kind, damage, critical, counter, activeRumour) {
    if (kind === "brace") return `${actor.name} uses ${move}. ${target.name} has to find another way in.`;
    if (kind === "feint") return damage ? `${actor.name} sells ${move}. ${target.name} buys it at full price.` : `${actor.name} tries ${move}. ${target.name} stays patient.`;
    if (!damage) return `${actor.name} swings. ${target.name} slips out of range.`;
    if (counter) return activeRumour?.counterText ? activeRumour.counterText(actor) : `${actor.name} exploits the secret flaw. Pete forgets the entire sport.`;
    if (critical) return `${actor.name} catches ${target.name} clean. The front row sits down by accident.`;
    return `${actor.name} lands ${move}. The crowd makes a noise.`;
}

function attack(actor, target, moveData, random, round, activeRumour) {
    const move = moveData.name;
    const kind = moveData.kind;
    if (kind === "brace") {
        actor.guardUp = true;
        return {
            actor: actor.name,
            target: target.name,
            isHome: actor.isHome,
            move,
            damage: 0,
            critical: false,
            counter: false,
            text: narrate(actor, target, move, kind, 0, false, false, activeRumour),
            round,
            homeHp: actor.isHome ? actor.hp : target.hp,
            awayHp: actor.isHome ? target.hp : actor.hp,
            homeMaxHp: actor.isHome ? actor.maxHp : target.maxHp,
            awayMaxHp: actor.isHome ? target.maxHp : actor.maxHp,
        };
    }
    const hitChance = clamp(0.69 + (actor.stats.speed - target.stats.speed) * 0.025, 0.5, 0.9);
    const hit = random() < hitChance;
    const critical = hit && random() < 0.04 + actor.specificity * 0.025;
    const counter = actor.isHome && (actor.hasExploit || actor.hasCrisps);
    const tactic = actor.isHome && round === 4 && !actor.cornerCalled ? actor.tactic : "";
    const moveScale = kind === "trick" ? 1.25 : kind === "feint" ? 0.75 : 1;
    let tacticScale = 1;
    if (tactic) {
        actor.cornerCalled = true;
        if (tactic === "push") tacticScale = 1.2;
        if (tactic === "gamble") tacticScale = random() < 0.35 ? 1.6 : 0.6;
    }
    let damage = hit ? Math.round((6 + actor.stats.power + random() * 4) * moveScale * tacticScale * (counter ? 1.25 : 1) * (critical ? 1.5 : 1)) : 0;
    if (target.guardUp) damage = Math.round(damage * 0.55);
    if (target.isHome && target.tactic === "push" && round === 4) damage = Math.round(damage * 1.2);
    if (target.isHome && target.tactic === "brace" && round === 4) damage = Math.round(damage * 0.7);
    target.hp = Math.max(0, target.hp - damage);
    actor.guardUp = false;
    return {
        actor: actor.name,
        target: target.name,
        isHome: actor.isHome,
        move,
        damage,
        critical,
        counter: Boolean(counter && damage > 0),
        text: narrate(actor, target, move, kind, damage, critical, counter, activeRumour),
        round,
        homeHp: actor.isHome ? actor.hp : target.hp,
        awayHp: actor.isHome ? target.hp : actor.hp,
        homeMaxHp: actor.isHome ? actor.maxHp : target.maxHp,
        awayMaxHp: actor.isHome ? target.maxHp : actor.maxHp,
    };
}

function simulateFight(line, tactic = "push", rematch = 0, fighterProfile = null, rumour = CORNER_RUMOURS[0]) {
    const activeRumour = rumour || CORNER_RUMOURS[0];
    const profile = fighterProfile || makeFighter(line, activeRumour);
    const random = randomFrom(hash(`${line}|pigeon-pete|${rematch}|${activeRumour.id}`));
    const home = combatant(profile, true);
    home.tactic = tactic;
    const away = combatant({
        name: challenger.name,
        stats: { power: challenger.power, speed: challenger.speed, guard: challenger.guard },
        specificity: 1,
        hasExploit: false,
        hasCrisps: false,
        moves: [{ name: "Wing tax", kind: "strike" }, { name: "Diving elbow", kind: "trick" }, { name: "Hop back", kind: "brace" }],
    }, false);
    const log = [];

    for (let round = 1; round <= 6 && home.hp > 0 && away.hp > 0; round++) {
        const first = home.stats.speed + random() * 4 >= away.stats.speed + random() * 4 ? home : away;
        const second = first === home ? away : home;
        for (const actor of [first, second]) {
            const target = actor === home ? away : home;
            const move = actor.moves[Math.floor(random() * actor.moves.length)];
            log.push(attack(actor, target, move, random, round, activeRumour));
            if (home.hp <= 0 || away.hp <= 0) break;
        }
    }

    const homeScore = home.hp / home.maxHp;
    const awayScore = away.hp / away.maxHp;
    const winner = home.hp > 0 && (away.hp <= 0 || homeScore > awayScore) ? home : away;
    return {
        fighter: home,
        challenger: away,
        winner: winner.name,
        won: winner === home,
        rounds: log.at(-1)?.round ?? 0,
        log,
    };
}

export { CORNER_RUMOURS, PETE_TAGLINES, HOME_TAGLINES, makeFighter, restoreFighter, simulateFight };
