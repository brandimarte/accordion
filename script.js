// --- Musical data: Stradella layout ---
const bassNotes = [ // As per Wikimedia chart: Bbb to A#
  "Bbb", "Fb", "Cb", "Gb", "Db", "Ab", "Eb", "Bb", "F", "C", "G", "D", "A", "E", "B", "F#", "C#", "G#", "D#", "A#"
];

const rowTypes = [
  { name: "Counter-bass", type: "counterbass" },
  { name: "Bass",         type: "bass" },
  { name: "Major",        type: "major" },
  { name: "Minor",        type: "minor" },
  { name: "7th",          type: "seventh" },
  { name: "Dim",          type: "diminished" }
];

// A mapping from any note spelling to its index in a 12-tone chromatic scale (C=0, C#=1, D=2...)
const noteToIndex = {
  "C": 0, "B#": 0,
  "C#": 1, "Db": 1,
  "D": 2,
  "D#": 3, "Eb": 3,
  "E": 4, "Fb": 4,
  "F": 5, "E#": 5,
  "F#": 6, "Gb": 6,
  "G": 7, "F##": 7,
  "G#": 8, "Ab": 8,
  "A": 9, "Bbb": 9,
  "A#": 10, "Bb": 10,
  "B": 11, "Cb": 11
};

// A mapping from index to a preferred note spelling for display (e.g., for counter-bass labels)
const indexToNote = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
];

// --- Draw SVG grid ---
const svg = document.getElementById("accordion-svg");
const radius = 12;
const spacingX = 30;
const spacingY = 25;
const offsetX = 15; // Stagger alternate rows

svg.setAttribute("width", spacingX * bassNotes.length + 60);
svg.setAttribute("height", spacingY * rowTypes.length + 40);

const buttons = [];

rowTypes.forEach((row, rowIndex) => {
  bassNotes.forEach((note, colIndex) => {
    const cx = 40 + colIndex * spacingX + (rowIndex % 2 === 0 ? 0 : offsetX);
    const cy = 30 + rowIndex * spacingY;

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.appendChild(group);

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", radius);
    circle.classList.add("button");
    circle.dataset.note = note;
    circle.dataset.rowType = row.type;
    group.appendChild(circle);

    // Add text label (only for bass and counter-bass rows)
    if (row.type === "bass" || row.type === "counterbass") {
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", cx);
      label.setAttribute("y", cy + 1); // Adjust vertical centering
      label.classList.add("label");
      
      let buttonNoteForLabel = note; // This is the bass note from bassNotes array
      if (row.type === 'counterbass') {
        const bassNoteIndex = noteToIndex[note];
        if (bassNoteIndex !== undefined) {
          const counterBassIndex = (bassNoteIndex + 4) % 12; // Major third up
          buttonNoteForLabel = indexToNote[counterBassIndex];
        } else {
          console.warn(`Could not find index for bass note: ${note}`);
        }
      }
      label.textContent = buttonNoteForLabel.replace(/##/g, "x").replace(/bb/g, "d");
      group.appendChild(label);
    }
    
    buttons.push(circle);
  });
});

// --- Populate dropdowns ---
const toneSelect = document.getElementById("tone");
indexToNote.forEach(tone => { // Use indexToNote for dropdown options
  const opt = document.createElement("option");
  opt.value = tone;
  opt.textContent = tone;
  toneSelect.appendChild(opt);
});

// --- Highlight logic ---
function highlightChord() {
  const rootNote = toneSelect.value;
  const chordType = document.getElementById("chord").value;

  buttons.forEach(b => b.classList.remove("active"));

  function activate(targetNote, rowType) {
    const targetNoteIndex = noteToIndex[targetNote];
    if (targetNoteIndex === undefined) {
      console.warn(`Unknown target note for activation: ${targetNote}`);
      return;
    }

    buttons
      .filter(b => {
        const buttonNote = b.dataset.note;
        const buttonNoteIndex = noteToIndex[buttonNote];
        return buttonNoteIndex === targetNoteIndex && b.dataset.rowType === rowType;
      })
      .forEach(b => b.classList.add("active"));
  }
  
  const rootNoteIndex = noteToIndex[rootNote];

  if (chordType === "major") {
    activate(rootNote, "bass");
    activate(rootNote, "major");
  } else if (chordType === "minor") {
    activate(rootNote, "bass");
    activate(rootNote, "minor");
  } else if (chordType === "7") {
    activate(rootNote, "bass");
    activate(rootNote, "seventh");
  } else if (chordType === "maj7") {
    const majorThirdIndex = (rootNoteIndex + 4) % 12;
    const majorThirdNote = indexToNote[majorThirdIndex];
    activate(rootNote, "major");
    activate(majorThirdNote, "counterbass");
  } else if (chordType === "m6") {
    const majorThirdIndex = (rootNoteIndex + 4) % 12;
    const majorThirdNote = indexToNote[majorThirdIndex];
    activate(rootNote, "minor");
    activate(majorThirdNote, "counterbass");
  } else if (chordType === "7b5") {
    // For 7b5, activate the root bass and the root's 7th chord button
    activate(rootNote, "bass");
    activate(rootNote, "seventh");
  }
}

toneSelect.addEventListener("change", highlightChord);
document.getElementById("chord").addEventListener("change", highlightChord);

// Set default selection and highlight
toneSelect.value = "C";
highlightChord();
