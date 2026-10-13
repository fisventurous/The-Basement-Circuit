
const CORNER_RUMOURS = [
    {
        id: "crisps",
        question: "Pete’s been seen circling the chip shop. What’s he afraid of?",
        clue: "A sleeve of crisps will draw him off. The grudge is your call.",
        hint: "crisps, chips, crumbs, or snacks",
        pattern: /\b(crisps?|chips?|crumbs?|bread|corn|snack|sleeve|pasty|pasties)\b/i,
        strength: "Crisps on the wind",
        moves: [{ name: "Crisp decoy", kind: "trick" }, { name: "Lid slam", kind: "strike" }, { name: "Play dead", kind: "brace" }],
        counterText: (actor) => `${actor.name} flashes the crisp packet. Pete forgets the entire sport.`,
        preset: {
            title: "Crumb-Drunk Pete",
            power: 5, speed: 6, guard: 4,
            flaw: "Cannot resist the crinkle of greasy chip wrappers.",
            moves: [{ name: "Crumb flurry", kind: "strike" }, { name: "Wing tax", kind: "trick" }, { name: "Hop back", kind: "brace" }],
        },
    },
    {
        id: "mirrors",
        question: "Pete spent the morning pacing the jeweller’s alley. What dazzles him?",
        clue: "Foil sheets or polished chrome blind his peck. Keep it shiny.",
        hint: "foil, mirrors, chrome, or shiny reflections",
        pattern: /\b(foil|mirrors?|chrome|shiny|glint|reflection|silver|flash|prism)\b/i,
        strength: "Blinding reflections",
        moves: [{ name: "Foil glare", kind: "trick" }, { name: "Prism flash", kind: "feint" }, { name: "Duck low", kind: "brace" }],
        counterText: (actor) => `${actor.name} catches the light with polished foil. Pete pecks his own reflection.`,
        preset: {
            title: "Flashy Pete",
            power: 4, speed: 7, guard: 4,
            flaw: "Stares at polished metal and pecks his own reflection.",
            moves: [{ name: "Mirror dart", kind: "feint" }, { name: "Beak jab", kind: "strike" }, { name: "Wing shield", kind: "brace" }],
        },
    },
    {
        id: "water",
        question: "Pete won’t fly anywhere near the canal lock gates. What weighs him down?",
        clue: "Soak his wings with water or heavy rain. Drenched feathers can’t dodge.",
        hint: "water, rain, puddles, splash, or sponges",
        pattern: /\b(water|rain|sponge|splash|bucket|drench|hose|puddle|tea|kettle)\b/i,
        strength: "Heavy downpour",
        moves: [{ name: "Canal splash", kind: "trick" }, { name: "Soaked jab", kind: "strike" }, { name: "Tuck in", kind: "brace" }],
        counterText: (actor) => `${actor.name} unloads a bucket of murky canal water. Pete’s wings double in weight.`,
        preset: {
            title: "Canal-Drenched Pete",
            power: 6, speed: 4, guard: 5,
            flaw: "Waterlogged primary feathers double his turning circle.",
            moves: [{ name: "Heavy barge", kind: "strike" }, { name: "Gutter splash", kind: "trick" }, { name: "Duck low", kind: "brace" }],
        },
    },
    {
        id: "horns",
        question: "The church bells rang at noon and Pete dropped to the cobbles. Why?",
        clue: "Loud clatters, brass horns, and sudden rattles ruin his inner ear.",
        hint: "horns, bells, whistles, sirens, or loud noise",
        pattern: /\b(bell|horn|whistle|gong|siren|cymbal|shout|rattle|trumpet|alarm)\b/i,
        strength: "Deafening clamour",
        moves: [{ name: "Klaxon blast", kind: "trick" }, { name: "Rattle feint", kind: "feint" }, { name: "Cover ears", kind: "brace" }],
        counterText: (actor) => `${actor.name} sounds a deafening horn blast. Pete covers his head in panic.`,
        preset: {
            title: "Rattled Pete",
            power: 4, speed: 6, guard: 5,
            flaw: "Loud brass bells disorient his inner ear completely.",
            moves: [{ name: "Diving elbow", kind: "trick" }, { name: "Wing swipe", kind: "strike" }, { name: "Cover head", kind: "brace" }],
        },
    },
    {
        id: "felines",
        question: "Someone saw Pete bolt off the gutter yesterday. Who was prowling up there?",
        clue: "He still owes the ginger tom three feathers. Bring claws or feline swagger.",
        hint: "cats, claws, paws, felines, or whiskers",
        pattern: /\b(cats?|feline|claws?|whiskers?|paws?|kitten|tiger|purr)\b/i,
        strength: "Alley cat swagger",
        moves: [{ name: "Alley hiss", kind: "trick" }, { name: "Pounce", kind: "strike" }, { name: "Arch back", kind: "brace" }],
        counterText: (actor) => `${actor.name} gives a low alley-cat hiss. Pete leaps clean out of his boots.`,
        preset: {
            title: "Skittish Pete",
            power: 5, speed: 7, guard: 3,
            flaw: "Still owes the rooftop ginger tom three tail feathers.",
            moves: [{ name: "Alley scramble", kind: "feint" }, { name: "Spur claw", kind: "strike" }, { name: "Perch leap", kind: "brace" }],
        },
    },
    {
        id: "owls",
        question: "Pete won’t roost on the park pergola anymore. What’s perched there?",
        clue: "Carved stone owls and frozen statues give him nightmares. Stand dead still.",
        hint: "owls, statues, scarecrows, stone, or frozen poses",
        pattern: /\b(owl|statue|scarecrow|stone|hawk|marble|frozen|gargoyle)\b/i,
        strength: "Rigid owl stare",
        moves: [{ name: "Owl stare", kind: "trick" }, { name: "Stone feint", kind: "feint" }, { name: "Freeze pose", kind: "brace" }],
        counterText: (actor) => `${actor.name} locks into a rigid predator pose. Pete freezes stiff in terror.`,
        preset: {
            title: "Spooked Pete",
            power: 6, speed: 5, guard: 4,
            flaw: "Frozen raptor statues reduce him to shivering stone.",
            moves: [{ name: "Panic flurry", kind: "strike" }, { name: "Feather feint", kind: "feint" }, { name: "Tuck tight", kind: "brace" }],
        },
    },
    {
        id: "shadows",
        question: "Pete won’t step into the unlit coal cellar. What lurks in the gloom?",
        clue: "Sudden cast shadows and dark trench coats make him duck for phantom hawks.",
        hint: "shadows, silhouettes, cloaks, darkness, or shade",
        pattern: /\b(shadows?|silhouette|cloaks?|darkness|shade|night|blackout|dusk)\b/i,
        strength: "Imposing silhouette",
        moves: [{ name: "Shadow loom", kind: "trick" }, { name: "Gloom jab", kind: "strike" }, { name: "Slip the light", kind: "brace" }],
        counterText: (actor) => `${actor.name} casts a towering shadow across the ring. Pete ducks for cover under an invisible hawk.`,
        preset: {
            title: "Shadow-Shy Pete",
            power: 5, speed: 5, guard: 5,
            flaw: "Flinches at any silhouette taller than a chimney pot.",
            moves: [{ name: "Corner dart", kind: "feint" }, { name: "Beak flurry", kind: "strike" }, { name: "Duck the dark", kind: "brace" }],
        },
    },
    {
        id: "garlic",
        question: "Pete sneezed himself off the bakery roof at dawn. What stung his beak?",
        clue: "Pungent garlic cloves and raw onions overpower his sensitive navigation scent.",
        hint: "garlic, onions, cloves, spices, or pungent herbs",
        pattern: /\b(garlic|onions?|cloves?|spice|pungent|herbs?|curry|mustard)\b/i,
        strength: "Pungent vapour",
        moves: [{ name: "Garlic exhale", kind: "trick" }, { name: "Spicy hook", kind: "strike" }, { name: "Hold breath", kind: "brace" }],
        counterText: (actor) => `${actor.name} exhales a cloud of raw garlic. Pete's eyes water as his beak goes completely numb.`,
        preset: {
            title: "Stung-Beak Pete",
            power: 6, speed: 4, guard: 5,
            flaw: "Overpowered by spicy aromatics and pungent vapours.",
            moves: [{ name: "Blind rush", kind: "strike" }, { name: "Sneeze feint", kind: "feint" }, { name: "Wing cover", kind: "brace" }],
        },
    },
    {
        id: "clocks",
        question: "Pete stood frozen on the watchmaker’s sill for three hours. What trapped him?",
        clue: "A strict ticking metronome or mechanical clock syncs his head bob and steals his timing.",
        hint: "clocks, ticking, watches, metronomes, or pendulums",
        pattern: /\b(clocks?|ticks?|ticking|watch(?:es)?|metronome|pendulum|chime)\b/i,
        strength: "Mechanical tempo",
        moves: [{ name: "Metronome tap", kind: "trick" }, { name: "Cadence hook", kind: "strike" }, { name: "Pendulum sway", kind: "brace" }],
        counterText: (actor) => `${actor.name} starts ticking in strict waltz time. Pete bobs his head to the rhythm and walks onto a jab.`,
        preset: {
            title: "Hypnotised Pete",
            power: 4, speed: 7, guard: 4,
            flaw: "Trapped in involuntary rhythmic head-bobbing.",
            moves: [{ name: "Staccato peck", kind: "strike" }, { name: "Waltz step", kind: "feint" }, { name: "Clock guard", kind: "brace" }],
        },
    },
    {
        id: "grease",
        question: "Pete took a nasty tumble near the depot switch points. What was underfoot?",
        clue: "Greasy soles and buttered cobblestones rob his talons of all traction.",
        hint: "grease, butter, oil, slippery, or slick floors",
        pattern: /\b(grease|butter|oils?|slippery|slick|wax|slime|skid)\b/i,
        strength: "Oily slide",
        moves: [{ name: "Grease toss", kind: "trick" }, { name: "Sliding jab", kind: "strike" }, { name: "Low pivot", kind: "brace" }],
        counterText: (actor) => `${actor.name} slicks the canvas with axle grease. Pete spins helplessly like an oily bowling pin.`,
        preset: {
            title: "Skidding Pete",
            power: 6, speed: 5, guard: 4,
            flaw: "Cannot grip greasy timber or oiled cobblestones.",
            moves: [{ name: "Wheel spin", kind: "feint" }, { name: "Stumble punch", kind: "strike" }, { name: "Slide stop", kind: "brace" }],
        },
    },
    {
        id: "squeaks",
        question: "Why did Pete abandon his perch when the cellar hatch swung open?",
        clue: "High-pitched iron squeaks and rubber dog toys grate right on his nerves.",
        hint: "squeaks, hinges, mice, rubber toys, or shrill cries",
        pattern: /\b(squeaks?|hinges?|mice|mouse|rubber|toys?|shrill|screech)\b/i,
        strength: "Piercing screech",
        moves: [{ name: "Squeak pinch", kind: "trick" }, { name: "Spur counter", kind: "strike" }, { name: "Hedge stance", kind: "brace" }],
        counterText: (actor) => `${actor.name} pinches a shrill squeak toy. Pete covers both ears with his wings in pure agony.`,
        preset: {
            title: "Nerve-Rattled Pete",
            power: 4, speed: 6, guard: 5,
            flaw: "Despises high-frequency squeaks and rusty hinges.",
            moves: [{ name: "Wincing rush", kind: "strike" }, { name: "Hiss feint", kind: "feint" }, { name: "Ear tuck", kind: "brace" }],
        },
    },
    {
        id: "umbrellas",
        question: "A commuter opened a brolly on the platform and Pete panicked. Why?",
        clue: "The sudden snap of an opening umbrella mimics a giant hawk spreading wings.",
        hint: "umbrellas, brollies, parasols, canopies, or snaps",
        pattern: /\b(umbrellas?|broll(?:y|ies)|parasols?|canop(?:y|ies)|awning)\b/i,
        strength: "Canopy snap",
        moves: [{ name: "Brolly snap", kind: "trick" }, { name: "Rib thrust", kind: "strike" }, { name: "Shield canopy", kind: "brace" }],
        counterText: (actor) => `${actor.name} snaps open a black umbrella with a crack. Pete scrambles backward into the ropes.`,
        preset: {
            title: "Brolly-Battered Pete",
            power: 5, speed: 6, guard: 4,
            flaw: "Fears umbrellas opening like giant predatory wings.",
            moves: [{ name: "Blind flurry", kind: "strike" }, { name: "Feather flash", kind: "feint" }, { name: "Rope cling", kind: "brace" }],
        },
    },
    {
        id: "laundry",
        question: "Pete got tangled above the courtyard yesterday. What was flapping?",
        clue: "Gusts of billowing white bedsheets and laundry blind his peripheral vision.",
        hint: "laundry, sheets, washing, towels, or flapping cloth",
        pattern: /\b(laundry|sheets?|washings?|towels?|linen|curtains?|flapping)\b/i,
        strength: "Billowing linen",
        moves: [{ name: "Towel flick", kind: "trick" }, { name: "Linen cross", kind: "strike" }, { name: "Wrap guard", kind: "brace" }],
        counterText: (actor) => `${actor.name} whips out a damp hotel towel. Pete gets wrapped in linen and pecks blindly.`,
        preset: {
            title: "Tangled Pete",
            power: 4, speed: 5, guard: 6,
            flaw: "Easily snared and confused by flapping laundry.",
            moves: [{ name: "Blind peck", kind: "strike" }, { name: "Wind flutter", kind: "feint" }, { name: "Wing knot", kind: "brace" }],
        },
    },
    {
        id: "salt",
        question: "Pete knocked over the salt pot in the greasy spoon and flew off screaming. Why?",
        clue: "Coarse rock salt stings old scrapes on his taped knuckles and wings.",
        hint: "salt, brine, seasoning, saline, or rock salt",
        pattern: /\b(salts?|brine|saline|seasoning|sodium|pickl(?:e|es|ed))\b/i,
        strength: "Stinging brine",
        moves: [{ name: "Salt pinch", kind: "trick" }, { name: "Brine jab", kind: "strike" }, { name: "Tight tuck", kind: "brace" }],
        counterText: (actor) => `${actor.name} tosses a pinch of coarse sea salt. Pete's wing scrapes sting and his stance folds.`,
        preset: {
            title: "Brine-Stung Pete",
            power: 6, speed: 5, guard: 4,
            flaw: "Can't bear salt stinging his scarred wing joints.",
            moves: [{ name: "Desperate jab", kind: "strike" }, { name: "Scrape feint", kind: "feint" }, { name: "Crouch fold", kind: "brace" }],
        },
    },
    {
        id: "magnets",
        question: "Pete won’t land near the rail yard crane. What’s pulling his compass?",
        clue: "Heavy horseshoe magnets scramble the natural lodestone in his beak.",
        hint: "magnets, magnetic, compass, iron, or metal filings",
        pattern: /\b(magnets?|magnetic|compass|lodestone|iron|filings?)\b/i,
        strength: "Magnetic distortion",
        moves: [{ name: "Magnet wave", kind: "trick" }, { name: "Polar punch", kind: "strike" }, { name: "Iron wall", kind: "brace" }],
        counterText: (actor) => `${actor.name} brandishes a heavy horseshoe magnet. Pete's internal navigation steers him straight into the post.`,
        preset: {
            title: "Disoriented Pete",
            power: 4, speed: 7, guard: 4,
            flaw: "Magnetic fields spin his beak compass completely upside down.",
            moves: [{ name: "Erratic hop", kind: "feint" }, { name: "Spinning peck", kind: "strike" }, { name: "Head shake", kind: "brace" }],
        },
    },
    {
        id: "smoke",
        question: "The fishmonger lit the smoker and Pete vanished. What choked him?",
        clue: "Pungent woodsmoke and thick tobacco billows clog his air sacs in seconds.",
        hint: "smoke, tobacco, pipes, fog, or cigars",
        pattern: /\b(smoke|tobacco|pipes?|cigars?|fumes?|fog|smokey|billow)\b/i,
        strength: "Dense smoke screen",
        moves: [{ name: "Pipe puff", kind: "trick" }, { name: "Smoky cross", kind: "strike" }, { name: "Cough slip", kind: "brace" }],
        counterText: (actor) => `${actor.name} puffs a thick ring of pipe tobacco. Pete coughs up feathers and loses his footing.`,
        preset: {
            title: "Wheezing Pete",
            power: 5, speed: 4, guard: 6,
            flaw: "Sensitive air sacs struggle in smoky cellars.",
            moves: [{ name: "Choking rush", kind: "strike" }, { name: "Smog dart", kind: "feint" }, { name: "Huddle low", kind: "brace" }],
        },
    },
    {
        id: "glitter",
        question: "Pete was seen scrubbing his feathers in the gutter after the parade. Why?",
        clue: "Sticky party glitter clogs his plumage and ruins his street credibility.",
        hint: "glitter, confetti, sparkles, party poppers, or sequins",
        pattern: /\b(glitter|confetti|sparkles?|sequins?|shimmer|poppers?)\b/i,
        strength: "Sparkling shower",
        moves: [{ name: "Popper blast", kind: "trick" }, { name: "Sequined jab", kind: "strike" }, { name: "Shiny shell", kind: "brace" }],
        counterText: (actor) => `${actor.name} cracks a party popper full of glitter. Pete shrieks as his feathers sparkle pink.`,
        preset: {
            title: "Sparkle-Stained Pete",
            power: 5, speed: 6, guard: 4,
            flaw: "Terrified of colourful festive glitter sticking to his coat.",
            moves: [{ name: "Dignity swipe", kind: "strike" }, { name: "Groom feint", kind: "feint" }, { name: "Dusting tuck", kind: "brace" }],
        },
    },
    {
        id: "dummies",
        question: "Pete attacked the tailor's window display and broke a wing claw. What fooled him?",
        clue: "Stiff tailor dummies and headless coats confuse his target selection completely.",
        hint: "dummies, mannequin, scarecrow, tailor, or decoy",
        pattern: /\b(dummies|dummy|mannequins?|tailor|decoy|scarecrows?|waxwork)\b/i,
        strength: "Wooden decoy",
        moves: [{ name: "Mannequin stand", kind: "trick" }, { name: "Coat swing", kind: "strike" }, { name: "Dummy block", kind: "brace" }],
        counterText: (actor) => `${actor.name} plants a wooden coat dummy in mid-ring. Pete unloads a 5-hit combo on empty tweed.`,
        preset: {
            title: "Bamboozled Pete",
            power: 7, speed: 4, guard: 4,
            flaw: "Throws power punches at wooden coats and tailor mannequins.",
            moves: [{ name: "Tweed assault", kind: "strike" }, { name: "Whirlwind jab", kind: "strike" }, { name: "Baffled step", kind: "brace" }],
        },
    },
    {
        id: "lasers",
        question: "Someone pointed a red beam near the bus stop and Pete chased it in circles. Why?",
        clue: "A red laser dot triggers his compulsive alley-pecking reflex without fail.",
        hint: "lasers, red dot, pointer, beam, or torchlight",
        pattern: /\b(lasers?|pointer|red dot|beams?|torch(?:light)?|flashlight)\b/i,
        strength: "Dancing red dot",
        moves: [{ name: "Beam bait", kind: "trick" }, { name: "Flash jab", kind: "strike" }, { name: "Spot dodge", kind: "brace" }],
        counterText: (actor) => `${actor.name} clicks a red pointer onto the canvas. Pete drops to his knees to peck the red dot.`,
        preset: {
            title: "Dot-Chasing Pete",
            power: 4, speed: 7, guard: 4,
            flaw: "Compulsively pecks any moving red light beam.",
            moves: [{ name: "Peck circle", kind: "feint" }, { name: "Dart strike", kind: "strike" }, { name: "Pavement crouch", kind: "brace" }],
        },
    },
    {
        id: "chalk",
        question: "The bookie clapped the board dusters and Pete coughed himself silly. What happened?",
        clue: "Fine chalk dust clogs his nostrils and coats his wing feathers in white powder.",
        hint: "chalk, powder, dust, blackboard, or plaster",
        pattern: /\b(chalk|powders?|blackboard|dusty?|plaster|talc(?:um)?)\b/i,
        strength: "Blinding white chalk",
        moves: [{ name: "Chalk clap", kind: "trick" }, { name: "Powder hook", kind: "strike" }, { name: "Dust guard", kind: "brace" }],
        counterText: (actor) => `${actor.name} claps two blackboard dusters together. Pete is enveloped in white chalk and sneezes blindly.`,
        preset: {
            title: "Dusty Pete",
            power: 6, speed: 4, guard: 5,
            flaw: "Easily choked by powdery chalk and blackboard dust.",
            moves: [{ name: "Sneeze charge", kind: "strike" }, { name: "Blind swat", kind: "feint" }, { name: "Cough shell", kind: "brace" }],
        },
    },
    {
        id: "whistles",
        question: "The 8:15 express sounded its guard whistle and Pete jumped two feet in the air. Why?",
        clue: "A shrill referee's pea-whistle makes him think the railway guards have caught him.",
        hint: "whistles, referee whistle, pea-whistle, shrill, or siren",
        pattern: /\b(whistles?|pea-whistle|referee|trill|shrill|siren)\b/i,
        strength: "Piercing trill",
        moves: [{ name: "Whistle blast", kind: "trick" }, { name: "Guardsman jab", kind: "strike" }, { name: "Ticket guard", kind: "brace" }],
        counterText: (actor) => `${actor.name} blows a piercing metal pea-whistle. Pete freezes in panic expecting the railway police.`,
        preset: {
            title: "Guard-Dreading Pete",
            power: 5, speed: 6, guard: 4,
            flaw: "Convinced railway conductors are hunting him down.",
            moves: [{ name: "Ticket dash", kind: "feint" }, { name: "Panic swing", kind: "strike" }, { name: "Corner squat", kind: "brace" }],
        },
    },
    {
        id: "balloons",
        question: "A child dropped a rubber balloon on the pier and Pete wouldn’t land. What scares him?",
        clue: "Static electricity on rubber balloons tugs his head crest and sudden pops make him jump.",
        hint: "balloons, rubber, pop, squeak, or static",
        pattern: /\b(balloons?|rubber|static|popping|popped|inflated)\b/i,
        strength: "Static shock",
        moves: [{ name: "Balloon pop", kind: "trick" }, { name: "Rubber snap", kind: "strike" }, { name: "Static shell", kind: "brace" }],
        counterText: (actor) => `${actor.name} pops a red carnival balloon with a pin. Pete launches three feet straight up into the air.`,
        preset: {
            title: "Pop-Panicked Pete",
            power: 4, speed: 6, guard: 5,
            flaw: "Terrified of sudden balloon pops and static cling.",
            moves: [{ name: "High bounce", kind: "feint" }, { name: "Startled jab", kind: "strike" }, { name: "Crest shield", kind: "brace" }],
        },
    },
    {
        id: "feathers",
        question: "The antique shop lady swept the doorway and Pete backed off in terror. What was she holding?",
        clue: "A giant ostrich feather duster looks like the wing of an ancient titan.",
        hint: "duster, feathers, plume, peacock, or ostrich",
        pattern: /\b(dusters?|feathers?|plumes?|peacock|ostrich|quill)\b/i,
        strength: "Majestic plume",
        moves: [{ name: "Duster sweep", kind: "trick" }, { name: "Plume hook", kind: "strike" }, { name: "Feather fan", kind: "brace" }],
        counterText: (actor) => `${actor.name} produces an enormous peacock feather duster. Pete salutes what he believes is the avian king.`,
        preset: {
            title: "Reverent Pete",
            power: 5, speed: 5, guard: 5,
            flaw: "Submits in awe to oversized decorative plumes.",
            moves: [{ name: "Bowing jab", kind: "strike" }, { name: "Wing dip", kind: "feint" }, { name: "Salute stance", kind: "brace" }],
        },
    },
    {
        id: "warped-glass",
        question: "Pete peered through the greenhouse bottle-glass and started screeching. What did he see?",
        clue: "Distorted magnifying glass makes opponents look fifteen feet tall.",
        hint: "lens, magnifying glass, warped glass, prism, or spectacles",
        pattern: /\b(lens(?:es)?|magnif(?:y|ying)|glass|spectacles|bifocals|prism|curved)\b/i,
        strength: "Distorted magnifying lens",
        moves: [{ name: "Glass glare", kind: "trick" }, { name: "Magnified blow", kind: "strike" }, { name: "Curved defense", kind: "brace" }],
        counterText: (actor) => `${actor.name} peers through a heavy magnifying monocle. To Pete's eyes, the opponent has grown ten times larger.`,
        preset: {
            title: "Hallucinating Pete",
            power: 6, speed: 4, guard: 5,
            flaw: "Easily tricked by curved lenses into seeing giants.",
            moves: [{ name: "Giant-swat", kind: "strike" }, { name: "Dizzy flutter", kind: "feint" }, { name: "Squint guard", kind: "brace" }],
        },
    },
    {
        id: "accordion",
        question: "A busker unpacked a squeeze-box under the arches and Pete flew straight into a billboard. Why?",
        clue: "The wheezing groan of an accordion sounds like a wounded predator calling for backup.",
        hint: "accordion, squeeze-box, concertina, busker, or bellows",
        pattern: /\b(accordion|squeeze-?box|concertina|bellows|polka|busker)\b/i,
        strength: "Wheezing squeeze-box",
        moves: [{ name: "Bellows groan", kind: "trick" }, { name: "Polka jab", kind: "strike" }, { name: "Reed shell", kind: "brace" }],
        counterText: (actor) => `${actor.name} pulls open a squealing pocket squeeze-box. Pete turns pale and flaps into the turnbuckle.`,
        preset: {
            title: "Squeeze-Box Pete",
            power: 5, speed: 5, guard: 5,
            flaw: "Cannot stand the wheeze of underpass squeeze-boxes.",
            moves: [{ name: "Off-key rush", kind: "strike" }, { name: "Tempo skip", kind: "feint" }, { name: "Turnbuckle tuck", kind: "brace" }],
        },
    },
];

function makeChallenger(rumour = CORNER_RUMOURS[0], seed = 0) {
    const activeRumour = rumour || CORNER_RUMOURS[0];
    const defaultPreset = {
        title: "Crumb-Drunk Pete",
        power: 5, speed: 6, guard: 4,
        flaw: "Cannot resist the crinkle of greasy chip wrappers.",
        moves: [{ name: "Crumb flurry", kind: "strike" }, { name: "Wing tax", kind: "trick" }, { name: "Hop back", kind: "brace" }],
    };
    const preset = activeRumour.preset || defaultPreset;
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
