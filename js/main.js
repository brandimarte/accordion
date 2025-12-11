import { indexToNote, bassNotes, noteToIndex, indexToAllNotes } from './config.js';
import { drawAccordion, buttons } from './drawing.js';
import { highlightSingleChord } from './chords.js';
import { initAudio } from './sound.js';
import { getChordNotes } from './note-logic.js';
import { playChordWithBass } from './sound.js';

// --- Populate dropdowns ---
const toneSelect = document.getElementById("tone");
const bassNoteSelect = document.getElementById("bass-note");

function populateNoteDropdown(selectElement, includeRootOption = false) {
  if (includeRootOption) {
    const rootOpt = document.createElement("option");
    rootOpt.value = "root";
    rootOpt.textContent = "Root";
    selectElement.appendChild(rootOpt);
  }
  indexToNote.forEach(tone => {
    const opt = document.createElement("option");
    opt.value = tone;
    opt.textContent = tone;
    selectElement.appendChild(opt);
  });
}

populateNoteDropdown(toneSelect);
populateNoteDropdown(bassNoteSelect, true);

// --- Main highlight function ---
function highlightChord() {
  const selectedRoot = toneSelect.value;
  const chordType = document.getElementById("chord").value;
  const selectedBass = bassNoteSelect.value;

  buttons.forEach(b => {
    b.classList.remove("active");
    b.classList.remove("alternative");
  });

  const bassNoteToHighlight = selectedBass === 'root' ? selectedRoot : selectedBass;

  // Highlight primary chord
  highlightSingleChord(selectedRoot, chordType, "active", bassNoteToHighlight);

  // Handle alternative chords
  const rootNoteIndex = noteToIndex[selectedRoot];
  const allEnharmonicRoots = indexToAllNotes[rootNoteIndex] || [selectedRoot];
  const alternativeRoots = allEnharmonicRoots.filter(r => r !== selectedRoot);

  alternativeRoots.forEach(altRoot => {
    if (bassNotes.includes(altRoot)) {
      // If bass is root, the alternative chord uses its own root as bass.
      // If bass is a specific note (slash chord), the alternative chord uses that same specific bass note.
      const altBassNoteToHighlight = selectedBass === 'root' ? altRoot : selectedBass;
      highlightSingleChord(altRoot, chordType, "alternative", altBassNoteToHighlight);
    }
  });
}

// --- Initial setup ---
const audioOverlay = document.getElementById('audio-overlay');
const audioButton = document.getElementById('audio-enable');

audioButton.addEventListener('click', async () => {
  await initAudio();
  audioOverlay.style.display = 'none';
}, { once: true });

drawAccordion();
toneSelect.addEventListener("change", highlightChord);
bassNoteSelect.addEventListener("change", highlightChord);
document.getElementById("chord").addEventListener("change", highlightChord);

const playChordButton = document.getElementById('play-chord');
playChordButton.addEventListener('click', () => {
  const selectedRoot = toneSelect.value;
  const chordType = document.getElementById("chord").value;
  const selectedBass = bassNoteSelect.value;

  const chordNotes = getChordNotes(selectedRoot, chordType);
  const bassNote = selectedBass === 'root' ? chordNotes[0] : selectedBass;
  
  // The `playChordWithBass` function expects the first note in the array to be the bass.
  // For a slash chord, we replace the chord's root with the selected bass note.
  playChordWithBass(bassNote, chordNotes);
});

// Set default selection and highlight
toneSelect.value = "C";
highlightChord();
