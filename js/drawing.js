import { bassNotes, rowTypes, noteToIndex, flatNoteMap, sharpNoteMap } from './config.js';
import { getChordNotes } from './note-logic.js';
import { DRAWING_CONFIG } from './drawing-config.js';
import { playNote, playChord } from './sound.js';

const svg = document.getElementById("accordion-svg");

// Calculate the required width based on the maximum x-coordinate of any button
const maxColIndex = bassNotes.length - 1;
const maxRowOffset = (rowTypes.length - 2) * DRAWING_CONFIG.offsetX;
const calculatedWidth = DRAWING_CONFIG.initialCxOffset + maxColIndex * DRAWING_CONFIG.spacingX + maxRowOffset + DRAWING_CONFIG.radius + DRAWING_CONFIG.svgWidthPadding;

svg.setAttribute("width", calculatedWidth);
svg.setAttribute("height", DRAWING_CONFIG.spacingY * rowTypes.length + DRAWING_CONFIG.svgHeightPadding);

export const buttons = [];

export function drawAccordion() {
  rowTypes.forEach((row, rowIndex) => {
    bassNotes.forEach((note, colIndex) => {
      // Use a cumulative offset relative to the Bass row (rowIndex 1)
      const cx = DRAWING_CONFIG.initialCxOffset + colIndex * DRAWING_CONFIG.spacingX + (rowIndex - 1) * DRAWING_CONFIG.offsetX;
      const cy = DRAWING_CONFIG.initialCyOffset + rowIndex * DRAWING_CONFIG.spacingY;

      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      svg.appendChild(group);

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", cx);
      circle.setAttribute("cy", cy);
      circle.setAttribute("r", DRAWING_CONFIG.radius);
      circle.classList.add("button");
      circle.dataset.note = note;
      circle.dataset.rowType = row.type;
      group.appendChild(circle);

      // Add text label
      if (row.type === "bass" || row.type === "counterbass") {
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", cx);
        label.setAttribute("y", cy + DRAWING_CONFIG.labelCyOffset);
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
        const noteSpacing = DRAWING_CONFIG.chordNoteSpacing;

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
      group.addEventListener('click', () => {
        if (row.type === 'bass' || row.type === 'counterbass') {
          const bassNoteIndex = noteToIndex[note];
          if (bassNoteIndex !== undefined) {
            let noteToPlay = note;
            if (row.type === 'counterbass') {
              const counterBassIndex = (bassNoteIndex + 4) % 12;
              const isFlatKey = note.includes('b') || note === 'F';
              const primaryMap = isFlatKey ? flatNoteMap : sharpNoteMap;
              noteToPlay = primaryMap[counterBassIndex];
            }
            playNote(noteToPlay, 3);
          }
        } else {
          const chordNotes = getChordNotes(note, row.type);
          playChord(chordNotes, 4);
        }
      });
      
      buttons.push(circle);
    });
  });

  // --- Add Top/Bottom labels ---
  // Using fixed offsets from SVG boundaries for "top left" and "top right"
  const verticalOffset = DRAWING_CONFIG.locationLabelVerticalOffset;
  const horizontalPadding = DRAWING_CONFIG.locationLabelHorizontalPadding;

  const bottomLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  bottomLabel.setAttribute("x", horizontalPadding);
  bottomLabel.setAttribute("y", verticalOffset);
  bottomLabel.classList.add("location-label");
  bottomLabel.setAttribute("text-anchor", "start"); // Explicitly set to start
  bottomLabel.textContent = "bottom";
  svg.appendChild(bottomLabel);

  const topLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  topLabel.setAttribute("x", calculatedWidth - horizontalPadding);
  topLabel.setAttribute("y", verticalOffset);
  topLabel.classList.add("location-label");
  topLabel.setAttribute("text-anchor", "end"); // Align to the right
  topLabel.textContent = "top";
  svg.appendChild(topLabel);
}
