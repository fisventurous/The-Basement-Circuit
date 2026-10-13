const challenger = {
    name: "Pigeon Pete",
    power: 4,
    speed: 7,
    guard: 4,
    maxHp: 76,
    hp: 76,
};

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
    const words = line.toLocaleUpperCase("en-GB").match(/[A-Z0-9']+/g) ?? [];
    const name = words.filter((word) => !["A", "AN", "THE", "MY"].includes(word)).slice(0, 3).join(" ");
    return name || "THE UNKNOWN";
}

function fighterLean(line) {
    const signals = [
        [/\b(heavy|strong|giant|brute|tank|hammer|massive|stout)\b/i, "power"],
        [/\b(fast|quick|light|ghost|sprint|slippery|blink|wind)\b/i, "speed"],
        [/\b(shield|armou?r|stone|iron|wall|shell|brick|sturdy)\b/i, "guard"],
    ];
    return signals.find(([pattern]) => pattern.test(line))?.[1] ?? "speed";
}

function makeFighter(line) {
    const lean = fighterLean(line);
    const stats = { power: 5, speed: 5, guard: 5 };
    stats[lean] += 2;
    for (const stat of Object.keys(stats)) if (stat !== lean) stats[stat] -= 1;
    const words = line.match(/[\p{L}\p{N}']+/gu) ?? [];
    const specificity = clamp(Math.floor(new Set(words.map((word) => word.toLocaleLowerCase("en-GB"))).size / 4), 0, 3);
    const hasCrisps = /\b(crisps?|chips?|crumbs?|bread|corn|snack|sleeve)\b/i.test(line);
    const weakness = /\b(only|unless|afraid|scared|hates?|cannot|can't)\b/i.test(line) ? "A very specific problem" : "A short attention span";
    const strength = hasCrisps ? "CRISPS ON THE WIND" : ({ power: "HEAVY HANDS", speed: "TOO QUICK TO PIN", guard: "A WALKING WALL" })[lean];
    const quirk = /\b(polite|sorry|apolog|retired|haunted|tiny|very)\b/i.test(line) ? "A strange little habit" : "Hears the crowd";
    const moves = hasCrisps
        ? [{ name: "CRISP DECOY", kind: "trick" }, { name: "LID SLAM", kind: "strike" }, { name: "PLAY DEAD", kind: "brace" }]
        : [{ name: "BODY SHOT", kind: "strike" }, { name: "DUST-CLOUD FEINT", kind: "feint" }, { name: "TUCK AND ROLL", kind: "brace" }];
    return { name: fighterName(line), line, stats, specificity, hasCrisps, strength, weakness, quirk, moves, look: "A hand-cut contender in taped gloves and a jacket that has seen things." };
}

function restoreFighter(value, line) {
    if (!value || typeof value !== "object") return makeFighter(line);
    const clean = (text, fallback, limit) => typeof text === "string"
        ? text.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, limit) || fallback
        : fallback;
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
    const defaults = makeFighter(line);
    const moves = Array.isArray(value.moves) ? value.moves.slice(0, 3).map((move, index) => ({
        name: clean(move?.name, defaults.moves[index]?.name ?? "BODY SHOT", 28),
        kind: ["strike", "trick", "feint", "brace"].includes(move?.kind) ? move.kind : "strike",
    })) : defaults.moves;
    while (moves.length < 3) moves.push(defaults.moves[moves.length]);
    return {
        ...defaults,
        name: clean(value.name, defaults.name, 32),
        line,
        look: clean(value.look, defaults.look, 120),
        strength: clean(value.strength, defaults.strength, 48),
        weakness: clean(value.weakness, defaults.weakness, 48),
        quirk: clean(value.quirk, defaults.quirk, 48),
        stats,
        specificity: clamp(Number(value.specificity) || 0, 0, 3),
        hasCrisps: value.hasCrisps === true,
        moves,
    };
}

function combatant(fighter, isHome) {
    return { ...fighter, isHome, maxHp: 56 + fighter.stats.guard * 4, hp: 56 + fighter.stats.guard * 4, guardUp: false, cornerCalled: false };
}

function narrate(actor, target, move, kind, damage, critical, counter) {
    if (kind === "brace") return `${actor.name} uses ${move}. ${target.name} has to find another way in.`;
    if (kind === "feint") return damage ? `${actor.name} sells ${move}. ${target.name} buys it at full price.` : `${actor.name} tries ${move}. ${target.name} stays patient.`;
    if (!damage) return `${actor.name} swings. ${target.name} slips out of range.`;
    if (counter) return `${actor.name} flashes the crisp packet. Pete forgets the entire sport.`;
    if (critical) return `${actor.name} catches ${target.name} clean. The front row sits down by accident.`;
    return `${actor.name} lands ${move}. The crowd makes a noise.`;
}

function attack(actor, target, moveData, random, round) {
    const move = moveData.name;
    const kind = moveData.kind;
    if (kind === "brace") {
        actor.guardUp = true;
        return { actor: actor.name, move, damage: 0, critical: false, text: narrate(actor, target, move, kind, 0, false, false), round };
    }
    const hitChance = clamp(0.69 + (actor.stats.speed - target.stats.speed) * 0.025, 0.5, 0.9);
    const hit = random() < hitChance;
    const critical = hit && random() < 0.04 + actor.specificity * 0.025;
    const counter = actor.isHome && actor.hasCrisps;
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
    return { actor: actor.name, move, damage, critical, text: narrate(actor, target, move, kind, damage, critical, counter), round };
}

function simulateFight(line, tactic = "push", rematch = 0, fighterProfile = makeFighter(line)) {
    const random = randomFrom(hash(`${line}|pigeon-pete|${rematch}`));
    const home = combatant(fighterProfile, true);
    home.tactic = tactic;
    const away = combatant({ name: challenger.name, stats: { power: challenger.power, speed: challenger.speed, guard: challenger.guard }, specificity: 1, hasCrisps: false, moves: [{ name: "WING TAX", kind: "strike" }, { name: "DIVING ELBOW", kind: "trick" }, { name: "HOP BACK", kind: "brace" }] }, false);
    const log = [];

    for (let round = 1; round <= 6 && home.hp > 0 && away.hp > 0; round++) {
        const first = home.stats.speed + random() * 4 >= away.stats.speed + random() * 4 ? home : away;
        const second = first === home ? away : home;
        for (const actor of [first, second]) {
            const target = actor === home ? away : home;
            const move = actor.moves[Math.floor(random() * actor.moves.length)];
            log.push(attack(actor, target, move, random, round));
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

export { makeFighter, restoreFighter, simulateFight };
