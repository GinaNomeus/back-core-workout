// Evening stretches: gentle, for the TV. Kept apart from the workout library,
// so the weekly workout planner never picks them.
// area: lower | middle | upper ; where: floor | couch | standing

const STRETCH_AREAS = {
  lower: "Lower back & hips",
  middle: "Middle back",
  upper: "Upper back, chest & neck",
};

Object.assign(EXERCISES, {
  knee2chest: {
    name: "Knee to chest", slot: "stretch", area: "lower", where: "floor", equipment: [],
    dose: "30 s per side", kind: "hold", seconds: 30, perSide: true,
    cues: [
      "Lie on your back with knees bent and feet flat.",
      "Hold one knee with both hands and gently draw it toward your chest. Keep the other foot on the floor.",
      "Relax your shoulders and breathe slowly. Then switch legs. If it feels good, finish with both knees together.",
    ],
    why: "A gentle stretch for the low back and glutes, and often the most soothing one when the low back aches.",
    video: "knee to chest stretch lower back",
    figure: {
      still: '<line class="floor" x1="5" y1="150" x2="255" y2="150"/>' + H(44, 138) + L(56, 142, 140, 142) + P("140,142 178,112 196,148"),
      a: "",
      b: P("140,142 120,102 152,96") + L(62, 140, 118, 106) + T(126, 84, "gentle hug"),
    },
  },
  kneedrops: {
    name: "Knee rolls (lying)", slot: "stretch", area: "lower", where: "floor", equipment: [],
    dose: "5 slow rolls each way", kind: "reps",
    cues: [
      "Lie on your back, knees bent and together, feet flat, arms out to the sides.",
      "Slowly let both knees fall to one side as far as is comfortable, keeping your shoulders on the floor. Pause, breathe, then roll to the other side.",
      "Small and slow is fine, especially when your back hurts.",
    ],
    why: "Gently rotates and loosens the low back.",
    video: "lying knee rolls lower back stretch",
    figure: {
      still: H(40, 84) + L(52, 84, 140, 84) + L(72, 84, 72, 40) + L(72, 84, 72, 128) + T(8, 160, "seen from above"),
      a: P("140,82 182,74 214,80") + P("140,86 182,94 214,88"),
      b: P("140,82 172,116 204,120") + P("140,86 166,126 198,132"),
    },
  },
  figure4: {
    name: "Seated figure-4 (on the couch)", slot: "stretch", area: "lower", where: "couch", equipment: [],
    dose: "30 s per side", kind: "hold", seconds: 30, perSide: true,
    cues: [
      "Sit near the front of the couch, feet flat. Cross one ankle over the opposite knee.",
      "Sit tall, then slowly lean forward from your hips with a long back until you feel a stretch in the buttock of the crossed leg.",
      "Hold and breathe, then switch sides.",
    ],
    why: "Stretches the glutes and the deep hip muscle (piriformis). Tightness there often pulls on the low back.",
    video: "seated figure 4 stretch chair",
    figure: {
      still: '<line class="floor" x1="5" y1="150" x2="255" y2="150"/>' +
        '<rect class="bench" x="100" y="104" width="118" height="14" rx="4"/><rect class="bench" x="204" y="44" width="14" height="62" rx="4"/>' +
        P("178,100 116,100 112,150") + P("178,98 140,76 110,94"),
      a: L(178, 100, 174, 46) + H(172, 32) + L(174, 56, 142, 80),
      b: L(178, 100, 140, 58) + H(128, 48) + L(142, 62, 130, 84) + T(14, 40, "lean forward,") + T(14, 54, "back long"),
    },
  },
  childpose: {
    name: "Child's pose", slot: "stretch", area: "lower", where: "floor", equipment: [],
    dose: "hold 30–45 s", kind: "hold", seconds: 40,
    cues: [
      "Kneel, knees a little apart, and sit back toward your heels. A pillow under your knees or bottom helps.",
      "Walk your hands forward and let your chest sink toward the floor. Rest your forehead down.",
      "Breathe slowly into your back. If it pinches your low back, don't sit back as far.",
    ],
    why: "A restful stretch for the whole back, hips and shoulders.",
    video: "child's pose for lower back pain",
    figure: {
      still: '<line class="floor" x1="5" y1="150" x2="255" y2="150"/>' + L(150, 146, 198, 146) + L(150, 146, 180, 124) +
        '<path class="fig" d="M180,124 Q150,98 112,128"/>' + H(98, 120, 10) + L(110, 132, 34, 146),
      a: T(126, 86, "sit back, breathe"),
      b: T(126, 86, "chest sinks down"),
    },
  },
  hipflexor: {
    name: "Kneeling hip flexor stretch", slot: "stretch", area: "lower", where: "floor", equipment: [],
    dose: "30 s per side", kind: "hold", seconds: 30, perSide: true,
    cues: [
      "Kneel on one knee on a cushion, the other foot flat in front. Hold the couch for balance.",
      "Tuck your tailbone under and squeeze the glute of the back leg, then shift your hips gently forward until you feel a stretch at the front of that hip.",
      "Keep your back straight, not arched. Switch sides.",
    ],
    why: "Sitting a lot tightens the front of the hips, which tugs the low back into an arch. This releases it.",
    video: "half kneeling hip flexor stretch",
    figure: {
      still: '<line class="floor" x1="5" y1="150" x2="255" y2="150"/><rect class="bench" x="168" y="140" width="34" height="10" rx="4"/>',
      a: L(146, 108, 146, 58) + H(146, 44) + P("146,108 98,108 92,150") + L(146, 108, 182, 140) + L(182, 140, 226, 144),
      b: L(130, 112, 128, 62) + H(128, 48) + P("130,112 86,108 92,150") + L(130, 112, 182, 140) + L(182, 140, 226, 144) +
        T(150, 80, "hips forward,") + T(150, 94, "tailbone tucked"),
    },
  },
  seatedrotation: {
    name: "Seated twist (on the couch)", slot: "stretch", area: "middle", where: "couch", equipment: [],
    dose: "5 slow turns each way", kind: "reps",
    cues: [
      "Sit tall at the front of the couch, feet flat, arms crossed over your chest.",
      "Keep your hips and knees facing forward and slowly turn your upper body to one side. Breathe out as you turn. Come back, then turn the other way.",
      "Turn only as far as is comfortable, and grow taller as you turn.",
    ],
    why: "Loosens the middle back, which gets stiff from sitting and phones.",
    video: "seated thoracic rotation stretch",
    figure: {
      still: L(110, 84, 150, 84) + L(112, 84, 112, 146) + L(148, 84, 148, 146) + H(130, 82, 12) +
        T(8, 160, "seen from above: hips stay, shoulders turn"),
      a: L(86, 80, 174, 80),
      b: L(96, 52, 164, 108),
    },
  },
  openbook: {
    name: "Open book (lying on your side)", slot: "stretch", area: "middle", where: "floor", equipment: [],
    dose: "5 slow per side", kind: "reps",
    cues: [
      "Lie on your side, knees bent and stacked, a pillow under your head, both arms straight out in front.",
      "Keep your knees together and slowly sweep the top arm up and over to the other side, letting your chest open and your eyes follow your hand.",
      "Pause and breathe, then close the book. After 5, turn over.",
    ],
    why: "Opens the middle back and chest gently, without stressing the low back.",
    video: "open book stretch thoracic",
    figure: {
      still: H(58, 84) + L(70, 84, 150, 84) + P("150,84 172,124 212,124") + L(80, 84, 92, 130) + T(8, 160, "seen from above: knees stay together"),
      a: L(84, 84, 98, 130),
      b: L(84, 84, 98, 36) + T(110, 30, "chest opens"),
    },
  },
  doorway: {
    name: "Doorway chest stretch", slot: "stretch", area: "upper", where: "standing", equipment: [],
    dose: "hold 30 s", kind: "hold", seconds: 30,
    cues: [
      "Stand in a doorway with your forearms on the frame, elbows at shoulder height.",
      "Step one foot through and lean gently forward until you feel a stretch across your chest and the front of your shoulders.",
      "Keep your neck long and your belly gently braced. Don't arch your low back.",
    ],
    why: "Opens the chest, which pulls the shoulders forward and strains the upper back.",
    video: "doorway pec stretch",
    figure: {
      still: '<line class="floor" x1="5" y1="150" x2="255" y2="150"/><line class="guide" x1="170" y1="8" x2="170" y2="150"/>',
      a: H(150, 32) + L(150, 44, 150, 96) + L(150, 50, 168, 50) + L(168, 50, 168, 26) + P("150,96 146,150") + L(150, 96, 156, 150),
      b: H(126, 34) + L(128, 46, 130, 96) + L(128, 52, 168, 50) + L(168, 50, 168, 26) + L(130, 96, 110, 150) + L(130, 96, 150, 150) +
        T(30, 70, "feel it across") + T(30, 84, "your chest"),
    },
  },
  neckside: {
    name: "Neck side stretch", slot: "stretch", area: "upper", where: "couch", equipment: [],
    dose: "20 s per side", kind: "hold", seconds: 20, perSide: true,
    cues: [
      "Sit tall. Let one shoulder drop and gently tip your ear toward the other shoulder.",
      "For a little more, rest that hand lightly on your head. Don't pull.",
      "Breathe, then slowly come up and switch sides.",
    ],
    why: "Releases the upper trapezius, the muscle that tightens between neck and shoulder when you're tense or at a screen.",
    video: "upper trapezius neck stretch seated",
    figure: {
      still: L(130, 66, 130, 132) + L(100, 66, 160, 66) + L(160, 66, 166, 122),
      a: H(130, 46) + L(100, 66, 96, 120),
      b: H(114, 52) + P("100,66 92,34 110,38") + T(150, 30, "ear to shoulder"),
    },
  },
  hugstretch: {
    name: "Upper back hug", slot: "stretch", area: "upper", where: "couch", equipment: [],
    dose: "hold 20 s · 3 slow breaths", kind: "hold", seconds: 20,
    cues: [
      "Sit tall and give yourself a big hug, hands reaching around toward your shoulder blades.",
      "Drop your chin and gently round your upper back, as if curling around a ball.",
      "Breathe slowly into the space between your shoulder blades.",
    ],
    why: "Stretches the muscles between the shoulder blades, where upper back pain often sits.",
    video: "upper back stretch self hug",
    figure: {
      still: '<line class="floor" x1="5" y1="150" x2="255" y2="150"/>' + L(140, 100, 140, 150),
      a: L(140, 100, 140, 50) + H(140, 36) + P("140,56 112,70 134,76"),
      b: '<path class="fig" d="M140,100 Q156,62 128,52"/>' + H(116, 58) + P("130,58 104,74 126,80") + T(160, 50, "round, breathe"),
    },
  },
});

// The evening routine: about 10 minutes.
const STRETCH_ROUTINE = [
  { area: "lower", ids: ["knee2chest", "kneedrops", "figure4", "childpose", "hipflexor"] },
  { area: "middle", ids: ["catcamel", "seatedrotation", "openbook"] },
  { area: "upper", ids: ["doorway", "neckside", "hugstretch"] },
];
