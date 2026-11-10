// Exercise library. Generic: nothing personal belongs in this file.
//
// slot:      the job the exercise does in a workout
//            warmup | hinge | pull | frontcore | sidecore | extra
// equipment: what it needs: bench, dumbbell, mat (anything lying or kneeling on the floor)
// kind:      "reps", or "hold" with seconds (perSide doubles it)
// figure:    a `still` layer plus two frames (a, b) that the app cross-fades

const FLOOR = '<line class="floor" x1="5" y1="150" x2="255" y2="150"/>';

function db(cx, cy) {
  return `<g class="db"><rect x="${cx - 6}" y="${cy - 1}" width="12" height="3"/>` +
    `<rect x="${cx - 11}" y="${cy - 6}" width="5" height="13" rx="1"/>` +
    `<rect x="${cx + 6}" y="${cy - 6}" width="5" height="13" rx="1"/></g>`;
}
function dbV(cx, cy) {
  return `<g class="db"><rect x="${cx - 1}" y="${cy - 6}" width="3" height="12"/>` +
    `<rect x="${cx - 6}" y="${cy - 11}" width="13" height="5" rx="1"/>` +
    `<rect x="${cx - 6}" y="${cy + 6}" width="13" height="5" rx="1"/></g>`;
}
function bench(x1, x2, top) {
  return `<rect class="bench" x="${x1}" y="${top}" width="${x2 - x1}" height="8" rx="2"/>` +
    `<line class="floor" x1="${x1 + 8}" y1="${top + 8}" x2="${x1 + 8}" y2="150"/>` +
    `<line class="floor" x1="${x2 - 8}" y1="${top + 8}" x2="${x2 - 8}" y2="150"/>`;
}
const L = (x1, y1, x2, y2) => `<line class="fig" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
const P = (pts) => `<polyline class="fig" points="${pts}"/>`;
const H = (cx, cy, r = 11) => `<circle class="fig head" cx="${cx}" cy="${cy}" r="${r}"/>`;
const T = (x, y, s) => `<text class="lbl" x="${x}" y="${y}">${s}</text>`;

const SLOTS = {
  warmup: "Warm-up",
  hinge: "Hip hinge (low back, glutes, hamstrings)",
  pull: "Back pull (upper & mid back)",
  frontcore: "Front core",
  sidecore: "Side core",
  extra: "Extra: back extensors & glutes",
};

const EXERCISES = {
  // ---------- warm-up ----------
  standcatcamel: {
    name: "Standing cat-camel", slot: "warmup", equipment: [],
    dose: "6 slow cycles", kind: "reps",
    cues: [
      "Stand with knees bent and hands on your thighs.",
      "Slowly round your whole back up, chin down. Then gently arch, chest forward.",
      "Move in a comfortable range: this is to loosen up.",
    ],
    why: "Wakes up the spine without getting on the floor.",
    video: "standing cat cow exercise",
    figure: {
      still: FLOOR + P("150,85 138,116 150,150"),
      a: '<path class="fig" d="M150,85 Q120,52 98,62"/>' + H(86, 74) + L(100, 64, 140, 104) + T(150, 50, "round up"),
      b: '<path class="fig" d="M150,85 Q128,80 98,58"/>' + H(86, 46) + L(100, 60, 140, 104) + T(150, 50, "gently arch"),
    },
  },
  hingedrill: {
    name: "Hip hinge drill (no weight)", slot: "warmup", equipment: [],
    dose: "8 slow reps", kind: "reps",
    cues: [
      "Hands on hips, knees soft.",
      "Push your hips back until you feel the back of your legs stretch, back flat. Stand up tall.",
    ],
    why: "Grooves the movement before the weighted hinge.",
    video: "hip hinge drill beginner",
    figure: {
      still: FLOOR,
      a: H(150, 28) + L(150, 40, 150, 92) + P("150,48 164,70 151,88") + P("150,92 147,121 150,150"),
      b: L(150, 88, 88, 64) + H(72, 58) + P("90,65 114,86 148,88") + P("150,88 138,120 146,150") + T(160, 72, "hips back"),
    },
  },
  catcamel: {
    name: "Cat-camel", slot: "warmup", equipment: ["mat"],
    dose: "6 slow cycles", kind: "reps",
    cues: [
      "On hands and knees. Slowly round your back up, then let it gently sag.",
      "Move only in a comfortable range. This is to loosen up, not to stretch hard.",
    ],
    why: "Eases the spine into moving before you add load.",
    video: "McGill cat camel exercise",
    figure: {
      still: FLOOR + L(70, 100, 70, 150) + P("170,100 170,150 215,150"),
      a: '<path class="fig" d="M70,100 Q120,70 170,100"/>' + H(54, 114) + T(100, 60, "round up"),
      b: '<path class="fig" d="M70,100 Q120,120 170,100"/>' + H(50, 94) + T(96, 140, "gently arch"),
    },
  },
  birddog: {
    name: "Bird dog", slot: "warmup", equipment: ["mat"],
    dose: "5 per side · hold 5–8 s", kind: "reps",
    cues: [
      "Reach one arm forward and the opposite leg back, level with your body. Hold, then switch.",
      "Keep your hips level, as if balancing a cup of tea on your low back.",
    ],
    why: "One of McGill's \"Big 3\". It trains the back muscles to hold the spine still while your limbs move.",
    video: "McGill bird dog exercise form",
    figure: {
      still: FLOOR + L(70, 100, 170, 100) + H(52, 93) + L(70, 100, 70, 150) + P("170,100 170,150 208,150"),
      a: T(92, 88, "back flat"),
      b: L(70, 100, 12, 90) + L(170, 100, 245, 96) + T(92, 88, "back flat, still"),
    },
  },

  // ---------- hip hinge ----------
  rdl: {
    name: "Dumbbell Romanian deadlift", slot: "hinge", equipment: ["dumbbell"],
    dose: "8–10 reps", kind: "reps", weighted: true,
    cues: [
      "Stand tall with a dumbbell in each hand and knees slightly soft.",
      "Push your hips BACK, as if shutting a car door with your bum. Let the weights slide down the front of your thighs.",
      "Stop when you feel your hamstrings stretch. Keep your back flat, never rounded.",
      "Squeeze your glutes to stand back up.",
    ],
    why: "This trains the low back muscles, glutes and hamstrings to share the load, which is how you should lift things in daily life.",
    video: "dumbbell romanian deadlift form beginner",
    figure: {
      still: FLOOR,
      a: H(150, 28) + L(150, 40, 150, 92) + L(150, 46, 153, 98) + db(153, 102) + P("150,92 147,121 150,150"),
      b: L(150, 88, 88, 64) + H(72, 58) + L(88, 64, 94, 112) + db(95, 116) + P("150,88 138,120 146,150") +
        T(160, 72, "hips back") + T(92, 48, "flat back"),
    },
  },
  hipthrust: {
    name: "Hip thrust (shoulders on the bench)", slot: "hinge", equipment: ["bench", "dumbbell"],
    dose: "10–12 reps", kind: "reps", weighted: true,
    cues: [
      "Sit on the floor with your upper back against the side of the bench and a dumbbell resting on your hips.",
      "Feet flat, knees bent. Push through your heels and lift your hips until your body is flat like a table.",
      "Squeeze your glutes at the top. Don't arch your low back. Lower slowly.",
    ],
    why: "Strong glutes take strain off the low back.",
    video: "dumbbell hip thrust bench form",
    figure: {
      still: FLOOR + bench(10, 86, 104) + H(72, 92),
      a: L(86, 104, 130, 140) + db(128, 130) + P("130,140 172,112 182,150"),
      b: L(86, 104, 140, 104) + db(140, 95) + P("140,104 182,104 184,150") + T(150, 80, "squeeze glutes"),
    },
  },

  // ---------- back pull ----------
  row: {
    name: "One-arm dumbbell row", slot: "pull", equipment: ["bench", "dumbbell"],
    dose: "8–10 per side", kind: "reps", weighted: true,
    cues: [
      "One hand and the same-side knee on the bench, other foot on the floor, back flat.",
      "Pull the dumbbell up towards your hip pocket, elbow close to your body. Squeeze your shoulder blade back.",
      "Lower slowly. Don't twist your torso to heave the weight up.",
    ],
    why: "The main upper back exercise. It helps with rounded \"desk shoulders\" and pain between the shoulder blades.",
    video: "one arm dumbbell row bench form",
    figure: {
      still: FLOOR + bench(25, 95, 110) +
        L(78, 80, 152, 72) + H(61, 77) + L(78, 80, 60, 110) + P("152,72 130,110 126,150") + L(152, 72, 200, 150),
      a: L(86, 80, 87, 126) + db(87, 130),
      b: P("86,80 110,60 106,92") + db(106, 96) + T(118, 50, "elbow to hip pocket"),
    },
  },
  revfly: {
    name: "Bent-over reverse fly", slot: "pull", equipment: ["dumbbell"],
    dose: "10–12 reps, light", kind: "reps", weighted: true,
    cues: [
      "Hold two light dumbbells. Hinge forward with a flat back, knees soft, arms hanging.",
      "With a slight bend in the elbows, lift your arms out to the sides until they're level with your shoulders. Squeeze your shoulder blades together.",
      "Lower slowly. Use light weights: this is about control.",
    ],
    why: "Strengthens the muscles between the shoulder blades, which helps upper back and neck pain from sitting.",
    video: "bent over dumbbell reverse fly form",
    figure: {
      still: FLOOR + H(130, 58) + L(100, 74, 160, 74) + L(130, 70, 130, 92) +
        L(120, 92, 140, 92) + L(120, 92, 114, 150) + L(140, 92, 146, 150) + T(150, 22, "seen from the front,") + T(150, 34, "bent forward"),
      a: L(100, 74, 104, 120) + L(160, 74, 156, 120) + dbV(104, 128) + dbV(156, 128),
      b: L(100, 74, 52, 72) + L(160, 74, 208, 72) + dbV(46, 72) + dbV(214, 72),
    },
  },
  pullover: {
    name: "Dumbbell pullover (lying on the bench)", slot: "pull", equipment: ["bench", "dumbbell"],
    dose: "8–10 reps", kind: "reps", weighted: true,
    cues: [
      "Lie on the bench lengthwise, feet on the floor, holding one dumbbell with both hands straight above your chest.",
      "Keep your ribs down and back flat on the bench. Slowly lower the weight back over your head as far as you can without your back arching.",
      "Pull it back up over your chest.",
    ],
    why: "Works the big back muscles (lats) while your core stops your back from arching.",
    video: "dumbbell pullover bench form",
    figure: {
      still: FLOOR + bench(36, 196, 112) + H(48, 100) + L(60, 104, 160, 104) + P("160,104 198,96 200,150") +
        T(70, 164, "back stays on the bench"),
      a: L(68, 104, 68, 54) + db(68, 48),
      b: L(68, 104, 22, 90) + db(16, 88),
    },
  },

  // ---------- front core ----------
  deadbugbench: {
    name: "Dead bug on the bench", slot: "frontcore", equipment: ["bench"],
    dose: "6 per side, slow", kind: "reps", weighted: true,
    cues: [
      "Lie on the bench lengthwise with knees over hips, shins level, and one light dumbbell held straight up over your chest.",
      "Breathe out and press your low back into the bench. Slowly reach one leg out long, then bring it back. Alternate legs.",
      "If your back starts to arch, shorten the reach.",
    ],
    why: "Teaches your core to stop the low back from arching, a common cause of low back strain. No mat needed.",
    video: "dead bug exercise on bench",
    figure: {
      still: FLOOR + bench(36, 172, 122) + L(60, 114, 150, 114) + H(44, 110) + L(66, 114, 68, 62) + db(68, 56) +
        P("150,114 152,76 190,76") + T(60, 164, "low back pressed down"),
      a: "",
      b: L(150, 114, 232, 108),
    },
  },
  deadbug: {
    name: "Dead bug (on the mat)", slot: "frontcore", equipment: ["mat"],
    dose: "6 per side, slow", kind: "reps", weighted: true,
    cues: [
      "Lie on your back with knees over hips, shins level, and one light dumbbell held straight up over your chest.",
      "Breathe out and press your low back into the floor. Slowly reach one leg out long, just above the floor, then bring it back.",
      "If your back starts to arch, shorten the reach. Too hard? Do it without the weight.",
    ],
    why: "Teaches your core to stop the low back from arching, a common cause of low back strain.",
    video: "dead bug exercise with dumbbell form",
    figure: {
      still: FLOOR + L(78, 140, 168, 140) + H(60, 138) + L(82, 140, 86, 82) + db(86, 76) +
        P("168,140 170,98 206,98") + T(70, 164, "low back pressed into floor"),
      a: "",
      b: L(168, 140, 248, 128),
    },
  },
  inclineplank: {
    name: "Incline plank (forearms on the bench)", slot: "frontcore", equipment: ["bench"],
    dose: "hold 20–30 s", kind: "hold", seconds: 25,
    cues: [
      "Forearms on the bench, elbows under shoulders. Walk your feet back until your body is one straight line.",
      "Squeeze your glutes and gently brace your belly, as if about to be poked. Breathe.",
      "Don't let your hips sag or pike up.",
    ],
    why: "Trains the front core to hold your spine steady, without lying on the floor.",
    video: "incline plank on bench form",
    figure: {
      still: FLOOR + bench(20, 96, 110) + P("70,110 92,110") + H(56, 70) + L(70, 82, 70, 110),
      a: P("70,82 150,116 232,148") + T(110, 74, "one straight line"),
      b: P("70,82 150,116 232,148") + T(110, 74, "breathe, hold"),
    },
  },
  curlup: {
    name: "McGill curl-up", slot: "frontcore", equipment: ["mat"],
    dose: "5 holds of 8–10 s", kind: "reps",
    cues: [
      "Lie on your back with one knee bent and one leg straight. Hands under the arch of your low back.",
      "Lift your head and shoulders just a few centimetres as one unit. Hold 8–10 s.",
      "This is not a sit-up. Your low back stays where it is.",
    ],
    why: "One of McGill's \"Big 3\". It works the abs while keeping the spine neutral.",
    video: "McGill curl up how to",
    figure: {
      still: FLOOR + L(170, 142, 250, 146) + P("170,142 202,108 226,148") + T(92, 100, "small lift, hold"),
      a: L(80, 142, 170, 142) + H(62, 140),
      b: L(84, 132, 170, 142) + H(67, 124),
    },
  },

  // ---------- side core ----------
  sideplankpress: {
    name: "Incline side plank + dumbbell press", slot: "sidecore", equipment: ["bench", "dumbbell"],
    dose: "8 presses per side", kind: "reps", weighted: true,
    cues: [
      "Forearm on the bench, elbow under shoulder, feet out so your body is a straight diagonal line.",
      "Hold a dumbbell in your top hand at your shoulder. Press it straight up to the ceiling, then lower it, while your hips stay lifted and still.",
      "Easier: feet closer to the bench. Harder: feet further away.",
    ],
    why: "Side plank strength plus shoulder work. The side core muscles stabilise the low back.",
    video: "incline side plank dumbbell press",
    figure: {
      still: FLOOR + bench(20, 96, 110) + P("70,110 96,110") + H(56, 68) + L(70, 80, 70, 110) +
        P("70,80 150,114 232,148") + T(140, 100, "hips lifted"),
      a: P("72,80 96,88 90,66") + db(90, 60),
      b: L(72, 80, 72, 32) + db(72, 26),
    },
  },
  sideplankincline: {
    name: "Incline side plank (forearm on the bench)", slot: "sidecore", equipment: ["bench"],
    dose: "hold 20 s per side", kind: "hold", seconds: 20, perSide: true,
    cues: [
      "Forearm on the bench, elbow under shoulder. Walk your feet out until your body is a straight diagonal line.",
      "Stack your feet, or put the top foot in front for balance. Lift your hips and hold.",
      "Easier: feet closer to the bench. Harder: feet further away.",
    ],
    why: "Strengthens the deep side muscles that stabilise the low back, without lying on the floor.",
    video: "incline side plank on bench",
    figure: {
      still: FLOOR + bench(20, 96, 110) + P("70,110 96,110") + H(56, 68) + L(70, 80, 70, 110),
      a: P("70,80 150,132 232,148") + T(150, 120, "not sagging"),
      b: P("70,80 150,114 232,148") + T(118, 92, "straight line"),
    },
  },
  sideplank: {
    name: "Side plank (on the mat)", slot: "sidecore", equipment: ["mat"],
    dose: "hold 15–20 s per side", kind: "hold", seconds: 20, perSide: true,
    cues: [
      "Lie on your side with your elbow under your shoulder. Lift your hips so your body forms a straight line.",
      "Start with knees bent, supporting yourself on knee and forearm. Progress to straight legs.",
    ],
    why: "Part of McGill's \"Big 3\". Strengthens the deep side muscles that stabilise the low back.",
    video: "McGill side plank bent knee",
    figure: {
      still: FLOOR + H(50, 94) + P("62,106 62,150 100,150"),
      a: P("62,106 150,146 240,148"),
      b: P("62,106 150,122 240,147") + T(80, 84, "straight line, head to feet"),
    },
  },
  carry: {
    name: "Suitcase carry", slot: "sidecore", equipment: ["dumbbell"],
    dose: "30 s per side", kind: "hold", seconds: 30, perSide: true, weighted: true,
    cues: [
      "Hold one heavy weight at your side like a suitcase. Walk slowly, standing tall and level.",
      "Don't lean away from the weight. Switch hands.",
    ],
    why: "Side-core endurance and posture under load.",
    video: "suitcase carry exercise form",
    figure: {
      still: FLOOR + H(130, 28, 12) + L(130, 40, 130, 100) + L(108, 50, 152, 50) + L(108, 50, 104, 98) +
        L(152, 50, 156, 100) + dbV(157, 108) + T(172, 70, "shoulders level,") + T(172, 84, "don't lean"),
      a: L(130, 100, 116, 150) + P("130,100 142,128 146,146"),
      b: P("130,100 118,128 114,146") + L(130, 100, 144, 150),
    },
  },

  // ---------- extra ----------
  reversehyper: {
    name: "Bench leg lift (reverse hyper)", slot: "extra", equipment: ["bench"],
    dose: "8–10 slow reps", kind: "reps",
    cues: [
      "Lie face down along the bench with your hips at the end, holding the bench, legs hanging down with toes on the floor.",
      "Squeeze your glutes and slowly lift both legs until they're level with your body, no higher. Lower with control.",
      "Keep it slow and smooth. Don't swing.",
    ],
    why: "Strengthens the low back muscles and glutes gently, without loading the spine.",
    video: "reverse hyper on flat bench",
    figure: {
      still: FLOOR + bench(20, 150, 112) + H(30, 98) + L(42, 104, 146, 104) + L(62, 104, 64, 124),
      a: L(146, 104, 166, 150),
      b: L(146, 104, 236, 100) + T(170, 88, "level, no higher"),
    },
  },
  glutebridge: {
    name: "Glute bridge (on the mat)", slot: "extra", equipment: ["mat"],
    dose: "10–12 reps", kind: "reps",
    cues: [
      "Lie on your back, knees bent, feet flat.",
      "Squeeze your glutes and lift your hips until your body is straight from shoulders to knees. Don't arch your back.",
      "Hold 2 s at the top, lower slowly.",
    ],
    why: "Wakes up the glutes so they share the work with the low back.",
    video: "glute bridge form",
    figure: {
      still: FLOOR + H(44, 140),
      a: L(58, 142, 140, 142) + P("140,142 180,110 190,148"),
      b: L(58, 140, 140, 112) + P("140,112 182,104 190,148") + T(110, 90, "squeeze glutes"),
    },
  },
};
