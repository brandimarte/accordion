import { indexToNote, bassNotes, noteToIndex, indexToAllNotes } from './config.js';
import { drawAccordion, buttons } from './drawing.js';
import { highlightSingleChord } from './chords.js';
import { initAudio } from './sound.js';
import { getChordNotes } from './note-logic.js';
import { playChordWithBass } from './sound.js';

// --- Populate dropdowns ---
const toneSelect = document.getElementById("tone");
indexToNote.forEach(tone => {
  const opt = document.createElement("option");
  opt.value = tone;
  opt.textContent = tone;
  toneSelect.appendChild(opt);
});

// --- Main highlight function ---
function highlightChord() {
  const selectedRoot = toneSelect.value;
  const chordType = document.getElementById("chord").value;

  buttons.forEach(b => {
    b.classList.remove("active");
    b.classList.remove("alternative");
  });

  const rootNoteIndex = noteToIndex[selectedRoot];
  const allEnharmonicRoots = indexToAllNotes[rootNoteIndex] || [selectedRoot];

  const primaryRoot = selectedRoot;
  const alternativeRoots = allEnharmonicRoots.filter(r => r !== primaryRoot);

  // Highlight primary chord
  highlightSingleChord(primaryRoot, chordType, "active");

  // Highlight alternative chords
  alternativeRoots.forEach(altRoot => {
    // Only highlight if the alternative bass note actually exists on the board
    if (bassNotes.includes(altRoot)) {
      highlightSingleChord(altRoot, chordType, "alternative");
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
document.getElementById("chord").addEventListener("change", highlightChord);

const playChordButton = document.getElementById('play-chord');
playChordButton.addEventListener('click', () => {
  const selectedRoot = toneSelect.value;
  const chordType = document.getElementById("chord").value;
  const notesToPlay = getChordNotes(selectedRoot, chordType);
  playChordWithBass(notesToPlay);
});

// Set default selection and highlight
toneSelect.value = "C";
highlightChord();
