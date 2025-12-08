// --- Musical data: Stradella layout ---
export const bassNotes = [ // As per Wikimedia chart: Bbb to A#
  "Bbb", "Fb", "Cb", "Gb", "Db", "Ab", "Eb", "Bb", "F", "C", "G", "D", "A", "E", "B", "F#", "C#", "G#", "D#", "A#"
];

export const rowTypes = [
  { name: "Counter-bass", type: "counterbass" },
  { name: "Bass",         type: "bass" },
  { name: "Major",        type: "major" },
  { name: "Minor",        type: "minor" },
  { name: "7th",          type: "seventh" },
  { name: "Dim",          type: "diminished" }
];

// A mapping from any note spelling to its index in a 12-tone chromatic scale (C=0, C#=1, D=2...)
export const noteToIndex = {
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

// Create a reverse map from index to all enharmonic note names
export const indexToAllNotes = {};
for (const note in noteToIndex) {
  const index = noteToIndex[note];
  if (!indexToAllNotes[index]) {
    indexToAllNotes[index] = [];
  }
  // Add to front if it's a sharp, to the back if it's a flat, for consistent ordering
  if (note.includes('#')) {
    indexToAllNotes[index].unshift(note);
  } else {
    indexToAllNotes[index].push(note);
  }
}

// A mapping from index to a preferred note spelling for display
export const indexToNote = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export const sharpNoteMap = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const flatNoteMap = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
