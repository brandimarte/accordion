let synth;

export async function initAudio() {
  await Tone.start();
  synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      type: "square"
    },
    envelope: {
      attack: 0.005,
      decay: 0.1,
      sustain: 0.3,
      release: 1
    }
  }).toDestination();
  console.log("Audio ready");
}

export function playNote(note, octave = 3) {
  if (!synth) return;
  synth.triggerAttackRelease(`${note}${octave}`, "8n");
}

export function playChord(notes, octave = 4) {
  if (!synth || !notes || notes.length === 0) return;
  const chordNotes = notes.map(n => `${n}${octave}`);
  synth.triggerAttackRelease(chordNotes, "8n");
}

export function playChordWithBass(notes, chordOctave = 4, bassOctave = 3) {
  if (!synth || !notes || notes.length === 0) return;

  const rootNote = `${notes[0]}${bassOctave}`;
  const otherNotes = notes.slice(1).map(n => `${n}${chordOctave}`);
  const allNotes = [rootNote, ...otherNotes];

  synth.triggerAttackRelease(allNotes, "8n");
}
