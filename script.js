// --- Musical data: Stradella layout ---
const tones = [
  "Bbb", "Fb", "Cb", "Gb", "Db", "Ab", "Eb", "Bb", "F", "C", "G", "D", "A", "E", "B", "F#", "C#", "G#", "D#", "A#"
];
const toneCount = 20;

const columns = [
  { name: "Counter-bass", type: "counterbass", offset: 0.5 },
  { name: "Bass", type: "bass", offset: 0.0 },
  { name: "Major", type: "major", offset: 0.5 },
  { name: "Minor", type: "minor", offset: 0.0 },
  { name: "7th", type: "seventh", offset: 0.5 },
  { name: "Dim", type: "diminished", offset: 0.0 }
];

// --- Draw SVG grid ---
const svg = document.getElementById("accordion-svg");
const radius = 12;
const spacingX = 45;
const spacingY = 28;
const offsetY = 14;
svg.setAttribute("width", spacingX * columns.length + 60);
svg.setAttribute("height", spacingY * toneCount + 60);

const buttons = [];

columns.forEach((col, ci) => {
  tones.forEach((tone, ri) => {
    const cx = 40 + ci * spacingX;
    const cy = 30 + ri * spacingY + col.offset * offsetY;

    // Group for circle + label
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.appendChild(group);

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", radius);
    circle.classList.add("button");
    circle.dataset.tone = tone;
    circle.dataset.col = col.type;
    group.appendChild(circle);

    // 🎵 Add text label
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", cx);
    label.setAttribute("y", cy + 0.6); // slightly adjust vertical centering
    // label.classList.add("label");
    label.setAttribute("class", "label");
    label.textContent = tone;
    group.appendChild(label);

    buttons.push(circle);
  });
});

// --- Populate dropdowns ---
const toneSelect = document.getElementById("tone");
tones.slice(0, 12).forEach(tone => {
  const opt = document.createElement("option");
  opt.value = tone;
  opt.textContent = tone;
  toneSelect.appendChild(opt);
});

// --- Highlight logic ---
function highlightChord() {
  const tone = toneSelect.value;
  const chordType = document.getElementById("chord").value;

  buttons.forEach(b => b.classList.remove("active"));

  const rootIndex = tones.findIndex(t => t === tone);
  const fifthUp = (rootIndex + 1) % tones.length; // Circle of fifths move up
  const thirdUp = (rootIndex + 4) % tones.length; // Major 3rd up (approx.)

  function activate(note, colType) {
    buttons
      .filter(b => b.dataset.tone === note && b.dataset.col === colType)
      .forEach(b => b.classList.add("active"));
  }

  if (chordType === "major") {
    activate(tone, "bass");
    activate(tone, "major");
  } else if (chordType === "minor") {
    activate(tone, "bass");
    activate(tone, "minor");
  } else if (chordType === "7") {
    activate(tone, "bass");
    activate(tone, "seventh");
  } else if (chordType === "maj7") {
    activate(tone, "bass");
    activate(tone, "major");
    activate(tones[thirdUp], "counterbass");
  } else if (chordType === "m6") {
    activate(tone, "minor");
    activate(tones[thirdUp], "counterbass");
  } else if (chordType === "7b5") {
    activate(tone, "seventh");
    activate(tones[fifthUp], "diminished");
  }
}

toneSelect.addEventListener("change", highlightChord);
document.getElementById("chord").addEventListener("change", highlightChord);
highlightChord();
