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

// A mapping from index to a preferred note spelling for display
const indexToNote = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
];

const sharpNoteMap = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const flatNoteMap = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];


// --- Chord note calculation ---
function getChordNotes(rootNote, chordType) {
  const rootIndex = noteToIndex[rootNote];
  if (rootIndex === undefined) return [];

  const isFlatKey = rootNote.includes('b') || rootNote === 'F';
  const primaryMap = isFlatKey ? flatNoteMap : sharpNoteMap;

  const notes = [];
  let third, fifth, seventh;

  // The root note spelling should be preserved from the bassNotes array
  notes.push(rootNote);

  switch (chordType) {
    case "major": // R, M3, P5
      third = primaryMap[(rootIndex + 4) % 12];
      fifth = primaryMap[(rootIndex + 7) % 12];
      notes.push(third, fifth);
      break;
    case "minor": // R, m3, P5
      third = flatNoteMap[(rootIndex + 3) % 12]; // Minor third is typically a flat
      fifth = primaryMap[(rootIndex + 7) % 12];
      notes.push(third, fifth);
      break;
    case "seventh": // R, M3, m7
      third = primaryMap[(rootIndex + 4) % 12];
      seventh = flatNoteMap[(rootIndex + 10) % 12]; // Dominant seventh is a flat
      notes.push(third, seventh);
      break;
    case "diminished": // As per user: Root, m3, d7
      third = flatNoteMap[(rootIndex + 3) % 12]; // Minor third is a flat
      seventh = flatNoteMap[(rootIndex + 9) % 12]; // Diminished seventh is a flat
      notes.push(third, seventh);
      break;
    default:
      return [];
  }
  return notes;
}


// --- Draw SVG grid ---
const svg = document.getElementById("accordion-svg");
const radius = 24;
const spacingX = 60;
const spacingY = 50;
const offsetX = 30;

// Calculate the required width based on the maximum x-coordinate of any button
const maxColIndex = bassNotes.length - 1;
const maxRowOffset = (rowTypes.length - 2) * offsetX;
const calculatedWidth = 70 + maxColIndex * spacingX + maxRowOffset + radius + 20;

svg.setAttribute("width", calculatedWidth);
svg.setAttribute("height", spacingY * rowTypes.length + 40);

const buttons = [];

rowTypes.forEach((row, rowIndex) => {
  bassNotes.forEach((note, colIndex) => {
    // Use a cumulative offset relative to the Bass row (rowIndex 1)
    const cx = 70 + colIndex * spacingX + (rowIndex - 1) * offsetX;
    const cy = 45 + rowIndex * spacingY;

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.appendChild(group);

    const circle = document.createElementNS("http://www.w3.000/svg", "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", radius);
    circle.classList.add("button");
    circle.dataset.note = note;
    circle.dataset.rowType = row.type;
    group.appendChild(circle);

    // Add text label
    if (row.type === "bass" || row.type === "counterbass") {
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", cx);
      label.setAttribute("y", cy + 1);
      label.classList.add("label");
      let buttonNoteForLabel = note; // This is the fundamental bass note from bassNotes array

      if (row.type === 'counterbass') {
        const bassNoteIndex = noteToIndex[note]; // Index of the fundamental bass
        if (bassNoteIndex !== undefined) {
          const counterBassIndex = (bassNoteIndex + 4) % 12; // Index of the major third above

          // Determine if the fundamental bass is a flat key or sharp key
          const isFlatKey = note.includes('b') || note === 'F';
          const primaryMap = isFlatKey ? flatNoteMap : sharpNoteMap;

          buttonNoteForLabel = primaryMap[counterBassIndex];
        }
      }
      label.textContent = buttonNoteForLabel.replace(/##/g, "x").replace(/bb/g, "d");
      group.appendChild(label);
    } else {
      // Create vertical labels for chord buttons
      const chordNotes = getChordNotes(note, row.type);
      const noteSpacing = 10; // Doubled from 5

      chordNotes.forEach((note, index) => {
        const noteLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        noteLabel.setAttribute("x", cx);
        // Position the 3 notes vertically centered: (cy - 5, cy, cy + 5)
        const yPos = cy + (index - 1) * noteSpacing;
        noteLabel.setAttribute("y", yPos);
        noteLabel.classList.add("label", "chord-label");
        noteLabel.textContent = note;
        group.appendChild(noteLabel);
      });
    }
    
    buttons.push(circle);
  });
});

// --- Populate dropdowns ---
const toneSelect = document.getElementById("tone");
indexToNote.forEach(tone => {
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
    if (targetNoteIndex === undefined) return;

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
    activate(rootNote, "bass");
    activate(rootNote, "seventh");
  }
}

toneSelect.addEventListener("change", highlightChord);
document.getElementById("chord").addEventListener("change", highlightChord);

// Set default selection and highlight
toneSelect.value = "C";
highlightChord();