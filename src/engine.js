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
    return { name: fighterName(line), line, stats, specificity, hasCrisps, strength, weakness, quirk };
}

function combatant(fighter, isHome) {
    return { ...fighter, isHome, maxHp: 56 + fighter.stats.guard * 4, hp: 56 + fighter.stats.guard * 4, guardUp: false, push: false, brace: false };
}

function narrate(actor, target, move, damage, critical, counter) {
    if (move === "brace") return `${actor.name} squares up. ${target.name} has to find another way in.`;
    if (move === "feint") return damage ? `${actor.name} sells the feint. ${target.name} buys it at full price.` : `${actor.name} throws a feint. ${target.name} stays patient.`;
    if (!damage) return `${actor.name} swings. ${target.name} slips out of range.`;
    if (counter) return `${actor.name} flashes the crisp packet. Pete forgets the entire sport.`;
    if (critical) return `${actor.name} catches ${target.name} clean. The front row sits down by accident.`;
    return `${actor.name} lands a ${move === "trick" ? "cheap little trick" : "solid shot"}. The crowd makes a noise.`;
}

function attack(actor, target, move, random, round) {
    if (move === "brace") {
        actor.guardUp = true;
        return { actor: actor.name, move, damage: 0, critical: false, text: narrate(actor, target, move, 0, false, false), round };
    }
    const hitChance = clamp(0.69 + (actor.stats.speed - target.stats.speed) * 0.025, 0.5, 0.9);
    const hit = random() < hitChance;
    const critical = hit && random() < 0.04 + actor.specificity * 0.025;
    const counter = actor.isHome && actor.hasCrisps;
    const tactic = actor.isHome && round >= 4 ? actor.tactic : "";
    const moveScale = move === "trick" ? 1.25 : move === "feint" ? 0.75 : 1;
    const tacticScale = tactic === "push" ? 1.2 : tactic === "gamble" && random() < 0.35 ? 1.6 : 1;
    let damage = hit ? Math.round((6 + actor.stats.power + random() * 4) * moveScale * tacticScale * (counter ? 1.25 : 1) * (critical ? 1.5 : 1)) : 0;
    if (target.brace) damage = Math.round(damage * 0.7);
    if (target.guardUp) damage = Math.round(damage * 0.55);
    if (target.isHome && target.tactic === "push" && round >= 4) damage = Math.round(damage * 1.2);
    if (target.isHome && target.tactic === "brace" && round >= 4) damage = Math.round(damage * 0.7);
    target.hp = Math.max(0, target.hp - damage);
    actor.guardUp = false;
    target.brace = false;
    return { actor: actor.name, move, damage, critical, text: narrate(actor, target, move, damage, critical, counter), round };
}

function simulateFight(line, tactic = "push", rematch = 0) {
    const random = randomFrom(hash(`${line}|pigeon-pete|${rematch}`));
    const home = combatant(makeFighter(line), true);
    home.tactic = tactic;
    const away = combatant({ name: challenger.name, stats: { power: challenger.power, speed: challenger.speed, guard: challenger.guard }, specificity: 1, hasCrisps: false }, false);
    const log = [];

    for (let round = 1; round <= 6 && home.hp > 0 && away.hp > 0; round++) {
        home.brace = home.isHome && home.tactic === "brace" && round >= 4;
        away.brace = false;
        const first = home.stats.speed + random() * 4 >= away.stats.speed + random() * 4 ? home : away;
        const second = first === home ? away : home;
        for (const actor of [first, second]) {
            const target = actor === home ? away : home;
            const move = ["strike", "strike", "trick", "feint", "brace"][Math.floor(random() * 5)];
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

export { makeFighter, simulateFight };
