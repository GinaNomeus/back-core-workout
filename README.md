# Back & Core

A small phone web app for a weekly 10-minute back and core workout with dumbbells and a bench.

Open it at https://ginanomeus.github.io/back-core-workout/ and add it to your home screen.

- `workout.json`: this week's workout, a 2-minute warm-up, then 5 exercises (hip hinge, back pull, front core, side core, extra) for 2 rounds.
- `exercises.js`: the exercise library: drawings, cues, doses, the job each one does, and the equipment it needs.
- `app.js`: the guided workout, timers and the feedback screen. Feedback is shared as a message; the app stores nothing beyond the workout in progress.

No build step: plain HTML, CSS and JavaScript, served by GitHub Pages. Works offline after the first visit.

This is general fitness education, not medical advice.
