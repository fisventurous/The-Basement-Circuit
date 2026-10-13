
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

function makeChallenger(rumour = CORNER_RUMOURS[0], seed = 0) {
    const activeRumour = rumour || CORNER_RUMOURS[0];
    const presets = {
        crisps: {
            title: "Crumb-Drunk Pete",
            power: 5, speed: 6, guard: 4,
            flaw: "Cannot resist the crinkle of greasy chip wrappers.",
            moves: [{ name: "Crumb flurry", kind: "strike" }, { name: "Wing tax", kind: "trick" }, { name: "Hop back", kind: "brace" }],
        },
        mirrors: {
            title: "Flashy Pete",
            power: 4, speed: 7, guard: 4,
            flaw: "Stares at polished metal and pecks his own reflection.",
            moves: [{ name: "Mirror dart", kind: "feint" }, { name: "Beak jab", kind: "strike" }, { name: "Wing shield", kind: "brace" }],
        },
        water: {
            title: "Canal-Drenched Pete",
            power: 6, speed: 4, guard: 5,
            flaw: "Waterlogged primary feathers double his turning circle.",
            moves: [{ name: "Heavy barge", kind: "strike" }, { name: "Gutter splash", kind: "trick" }, { name: "Duck low", kind: "brace" }],
        },
        horns: {
            title: "Rattled Pete",
            power: 4, speed: 6, guard: 5,
            flaw: "Loud brass bells disorient his inner ear completely.",
            moves: [{ name: "Diving elbow", kind: "trick" }, { name: "Wing swipe", kind: "strike" }, { name: "Cover head", kind: "brace" }],
        },
        felines: {
            title: "Skittish Pete",
            power: 5, speed: 7, guard: 3,
            flaw: "Still owes the rooftop ginger tom three tail feathers.",
            moves: [{ name: "Alley scramble", kind: "feint" }, { name: "Spur claw", kind: "strike" }, { name: "Perch leap", kind: "brace" }],
        },
        owls: {
            title: "Spooked Pete",
            power: 6, speed: 5, guard: 4,
            flaw: "Frozen raptor statues reduce him to shivering stone.",
            moves: [{ name: "Panic flurry", kind: "strike" }, { name: "Feather feint", kind: "feint" }, { name: "Tuck tight", kind: "brace" }],
        },
    };
    const preset = presets[activeRumour.id] || presets.crisps;
    const seedNum = hash(`${activeRumour.id}|${seed}`);
    const staminaRoll = (seedNum % 9) + 4;
    const maxHp = 50 + preset.guard * 4 + staminaRoll;
    return {
        name: "Pigeon Pete",
        title: preset.title,
        line: "The cellar champion · undefeated in the alleyway circuit",
        look: "A scruffy street pigeon birdman in green track shorts, scarred beak, taped wing knuckles",
        strength: "Cobblestone grit and lightning wing-hooks.",
        weakness: activeRumour.clue,
        quirk: preset.flaw,
        stats: { power: preset.power, speed: preset.speed, guard: preset.guard },
        moves: preset.moves,
        maxHp,
        hp: maxHp,
    };
}

const PETE_TAGLINES = [
    "LOCAL MENACE · EST. TUESDAY",
    "CRUMB MAGNATE · 14 FIGHTS UNDEFEATED",
    "GUTTER EMPEROR · UNPAID FINES",
    "SQUARE MILE TYRANT · NO WEIGH-IN",
    "COBBLESTONE TERROR · SHARP BEAK",
    "FEATHERWEIGHT DICTATOR · 0 TAXES",
    "CHIP BIN BARON · ZERO REMORSE",
    "STATUE CLIMBER · SELF-APPOINTED",
    "BREADCRUMB BANDIT · STILL HUNGRY",
    "BUS STOP BOSS · NO TICKET",
    "LAMPPOST LORD · RENT FREE",
    "STALE BREAD SCHOLAR · CRUMBS OVER CASH",
    "SEAGULL SLAYER · ALLEGEDLY",
    "FLAPPY HEAVYWEIGHT · SKIPS LEG DAY",
    "PAVEMENT PROFESSOR · BITES FIRST",
    "RAINY DAY ROYALTY · ALWAYS DAMP",
    "PIGEONHOLED · NOT FOR LONG",
];

const HOME_TAGLINES = [
    "HAND-CUT CONTENDER · BAD IDEAS",
    "TAPED KNUCKLES · NO REGRETS",
    "BASEMENT WILDCARD · DEBT-FREE",
    "CHIP SHOP REGULAR · UNTESTED",
    "ROUND FOUR SPECIALIST · RAW GRIT",
    "FLAT CAP & BANDAGES · READY",
    "TEA BREAK ASSASSIN · BACK BY FIVE",
    "DRESSING GOWN DESTROYER · HALF AWAKE",
    "CAR PARK CHAMPION · PAID FOR 2 HOURS",
    "ONE-LINER LEGEND · NO SECOND DRAFT",
    "CORNER SHOP KNIGHT · EXACT CHANGE",
    "SUNDAY LEAGUE HERO · KNEES GONE",
    "BORROWED GLOVES · BIG HOPES",
    "SELF-FUNDED UNDERDOG · NO SPONSORS",
    "LAST MINUTE ENTRY · FIRST CLASS NERVES",
    "WELL-READ UNDERDOG · ONE LINE ONLY",
    "SPARE KEY HOLDER · EVERYONE'S NEIGHBOUR",
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
    const seedNum = hash(`${line}|${rumour?.id || "home"}`);
    const staminaRoll = (seedNum % 11) + 2;
    const maxHp = 48 + stats.guard * 4 + staminaRoll;
    return {
        name: fighterName(line),
        line,
        stats,
        maxHp,
        hp: maxHp,
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
    const clean = (text, fallback, limit) => {
        if (typeof text !== "string") return fallback;
        const normalized = text.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
        if (!normalized) return fallback;
        if (normalized.length <= limit) return normalized;
        const sliced = normalized.slice(0, limit);
        const lastSpace = sliced.lastIndexOf(" ");
        return (lastSpace > limit * 0.65 ? sliced.slice(0, lastSpace) : sliced).trim() || fallback;
    };
    const readable = (text, fallback, limit) => {
        const val = clean(text, fallback, limit);
        return val === val.toLocaleUpperCase("en-GB")
            ? val.toLocaleLowerCase("en-GB").replace(/(^|\s)\p{L}/gu, (letter) => letter.toLocaleUpperCase("en-GB"))
            : val;
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
        name: readable(move?.name, defaults.moves[index]?.name ?? "Body shot", 36),
        kind: ["strike", "trick", "feint", "brace"].includes(move?.kind) ? move.kind : "strike",
    })) : defaults.moves;
    while (moves.length < 3) moves.push(defaults.moves[moves.length]);
    const hasExploit = value.hasExploit === true || value.hasCrisps === true || Boolean(rumour?.pattern?.test(line));
    const maxHp = Number(value.maxHp) || defaults.maxHp;
    return {
        ...defaults,
        name: readable(value.name, defaults.name, 36),
        line,
        look: readable(value.look, defaults.look, 240),
        strength: readable(value.strength, defaults.strength, 180),
        weakness: readable(value.weakness, defaults.weakness, 180),
        quirk: readable(value.quirk, defaults.quirk, 180),
        stats,
        maxHp,
        hp: maxHp,
        specificity: clamp(Number(value.specificity) || 0, 0, 3),
        hasCrisps: hasExploit,
        hasExploit,
        moves,
    };
}

function combatant(fighter, isHome) {
    const maxHp = Number(fighter.maxHp) || (56 + fighter.stats.guard * 4);
    return {
        ...fighter,
        isHome,
        baseSpeed: fighter.stats.speed,
        maxHp,
        hp: maxHp,
        guardUp: false,
        cornerCalled: false,
    };
}

function narrate(actor, target, move, kind, damage, critical, counter, activeRumour, random = Math.random) {
    if (kind === "brace") {
        const lines = [
            `${actor.name} anchors down behind ${move}. ${target.name} has to reset the angle.`,
            `${actor.name} sets a heavy guard with ${move}. Nothing getting through cleanly.`,
            `${actor.name} uses ${move}. ${target.name} probes but finds only elbows and gloves.`,
        ];
        return lines[Math.floor(random() * lines.length)];
    }
    if (kind === "feint") {
        if (damage) {
            const lines = [
                `${actor.name} sells ${move} completely. ${target.name} buys it at full price.`,
                `${actor.name} disguises ${move} smoothly. ${target.name} bites and leaves an opening.`,
                `${actor.name} fakes ${move} and steps inside. ${target.name} looks the wrong way.`,
            ];
            return lines[Math.floor(random() * lines.length)];
        }
        const lines = [
            `${actor.name} tries ${move}. ${target.name} stays patient and doesn’t flinch.`,
            `${actor.name} shows ${move}, but ${target.name} reads the deception calmly.`,
        ];
        return lines[Math.floor(random() * lines.length)];
    }
    if (!damage) {
        const lines = [
            `${actor.name} swings with ${move}. ${target.name} slips out of range.`,
            `${actor.name} uncorks ${move}, but ${target.name} bobs cleanly under the breeze.`,
            `${target.name} times the distance perfectly and steps around ${actor.name}’s ${move}.`,
            `${actor.name} overextends on ${move}. ${target.name} lets the leather pass harmlessly.`,
            `${actor.name} launches ${move}, but only catches cellar draught.`,
        ];
        return lines[Math.floor(random() * lines.length)];
    }
    if (counter) {
        return activeRumour?.counterText ? activeRumour.counterText(actor) : `${actor.name} exploits the secret flaw. Pete forgets the entire sport.`;
    }
    if (critical) {
        const lines = [
            `${actor.name} catches ${target.name} clean with ${move}. The front row scrambles for cover.`,
            `${actor.name} detonates a vicious ${move}! ${target.name} spins like a top on the cobbles.`,
            `${actor.name} connects flush with ${move}. That shot echoed off the cellar beams.`,
            `${actor.name} lands ${move} with monstrous force. The referee winces in disbelief.`,
        ];
        return lines[Math.floor(random() * lines.length)];
    }
    const lines = [
        `${actor.name} lands ${move}. The crowd roars in approval.`,
        `${actor.name} steps inside and drives ${move} home on ${target.name}.`,
        `${actor.name} connects with ${move}. Chalk dust flies off ${target.name}.`,
        `${actor.name} snaps ${move} right through ${target.name}’s guard.`,
        `${actor.name} times ${move} to perfection and scores to the ribs.`,
        `${actor.name} catches ${target.name} off-balance with ${move}.`,
    ];
    return lines[Math.floor(random() * lines.length)];
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
            text: narrate(actor, target, move, kind, 0, false, false, activeRumour, random),
            round,
            homeHp: actor.isHome ? actor.hp : target.hp,
            awayHp: actor.isHome ? target.hp : actor.hp,
            homeMaxHp: actor.isHome ? actor.maxHp : target.maxHp,
            awayMaxHp: actor.isHome ? target.maxHp : actor.maxHp,
            homeSpeed: actor.isHome ? actor.stats.speed : target.stats.speed,
            awaySpeed: actor.isHome ? target.stats.speed : actor.stats.speed,
        };
    }
    const hitChance = clamp(0.69 + (actor.stats.speed - target.stats.speed) * 0.025, 0.5, 0.9);
    const hit = random() < hitChance;
    const critical = hit && random() < 0.04 + (actor.specificity || 0) * 0.025;
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
        text: narrate(actor, target, move, kind, damage, critical, counter, activeRumour, random),
        round,
        homeHp: actor.isHome ? actor.hp : target.hp,
        awayHp: actor.isHome ? target.hp : actor.hp,
        homeMaxHp: actor.isHome ? actor.maxHp : target.maxHp,
        awayMaxHp: actor.isHome ? target.maxHp : actor.maxHp,
        homeSpeed: actor.isHome ? actor.stats.speed : target.stats.speed,
        awaySpeed: actor.isHome ? target.stats.speed : actor.stats.speed,
    };
}

const MAX_ROUNDS = 7;

function simulateFight(line, tactic = "push", rematch = 0, fighterProfile = null, rumour = CORNER_RUMOURS[0]) {
    const activeRumour = rumour || CORNER_RUMOURS[0];
    const profile = fighterProfile || makeFighter(line, activeRumour);
    const random = randomFrom(hash(`${line}|pigeon-pete|${rematch}|${activeRumour.id}`));
    const home = combatant(profile, true);
    home.tactic = tactic;
    const away = combatant(makeChallenger(activeRumour, rematch), false);
    const log = [];

    for (let round = 1; round <= MAX_ROUNDS && home.hp > 0 && away.hp > 0; round++) {
        // Dynamic fatigue after round 3 and when wounded
        if (round >= 4) {
            home.stats.speed = Math.max(2, home.baseSpeed - (home.hp < home.maxHp * 0.4 ? 2 : 1));
            away.stats.speed = Math.max(2, away.baseSpeed - (away.hp < away.maxHp * 0.4 ? 2 : 1));
        }

        const first = home.stats.speed + random() * 4 >= away.stats.speed + random() * 4 ? home : away;
        const second = first === home ? away : home;
        for (const actor of [first, second]) {
            const target = actor === home ? away : home;
            const move = actor.moves[Math.floor(random() * actor.moves.length)];
            log.push(attack(actor, target, move, random, round, activeRumour));
            if (home.hp <= 0 || away.hp <= 0) break;
        }
    }

    // Sudden-death tie breaker if neither is KO'd and HP is close after round 7
    const homePctInitial = home.hp / home.maxHp;
    const awayPctInitial = away.hp / away.maxHp;
    const isTiedOrClose = home.hp > 0 && away.hp > 0 && Math.abs(homePctInitial - awayPctInitial) <= 0.14;

    if (isTiedOrClose) {
        const tieRound = 8;
        const first = home.stats.speed + random() * 4 >= away.stats.speed + random() * 4 ? home : away;
        const second = first === home ? away : home;
        for (const actor of [first, second]) {
            const target = actor === home ? away : home;
            const move = actor.moves[0] ?? { name: "Desperation strike", kind: "strike" };
            const tieEvent = attack(actor, target, move, random, tieRound, activeRumour);
            tieEvent.text = `[SUDDEN DEATH] ${tieEvent.text}`;
            log.push(tieEvent);
            if (home.hp <= 0 || away.hp <= 0) break;
        }
    }

    let winner;
    let verdict;
    const hadTieBreaker = log.some((e) => e.round === 8);
    if (home.hp <= 0) {
        winner = away;
        verdict = hadTieBreaker ? "SUDDEN-DEATH KNOCKOUT" : "KNOCKOUT";
    } else if (away.hp <= 0) {
        winner = home;
        verdict = hadTieBreaker ? "SUDDEN-DEATH KNOCKOUT" : "KNOCKOUT";
    } else {
        const homePct = home.hp / home.maxHp;
        const awayPct = away.hp / away.maxHp;
        if (Math.abs(homePct - awayPct) >= 0.04) {
            winner = homePct > awayPct ? home : away;
            verdict = hadTieBreaker ? "TIE-BREAKER DECISION" : "UNANIMOUS DECISION";
        } else {
            const homeDamage = log.filter((e) => e.isHome).reduce((sum, e) => sum + e.damage, 0);
            const awayDamage = log.filter((e) => !e.isHome).reduce((sum, e) => sum + e.damage, 0);
            if (homeDamage !== awayDamage) {
                winner = homeDamage > awayDamage ? home : away;
                verdict = hadTieBreaker ? "TIE-BREAKER DECISION" : "SPLIT DECISION";
            } else {
                winner = homeDamage >= awayDamage ? home : away;
                verdict = hadTieBreaker ? "TIE-BREAKER DECISION" : "UNDERGROUND VERDICT";
            }
        }
    }

    return {
        fighter: home,
        challenger: away,
        winner: winner.name,
        won: winner === home,
        rounds: log.at(-1)?.round ?? 0,
        verdict,
        log,
    };
}

export { CORNER_RUMOURS, PETE_TAGLINES, HOME_TAGLINES, makeFighter, makeChallenger, restoreFighter, simulateFight };
