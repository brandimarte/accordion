let synth;

export async function initAudio() {
  await Tone.start();
  synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      type: "fatsawtooth",
      count: 3,
      spread: 20
    },
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.5,
      release: 0.4
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

export function playChordWithBass(bassNote, chordNotes, chordOctave = 4, bassOctave = 3) {
  if (!synth || !bassNote || !chordNotes) return;

  const bass = `${bassNote}${bassOctave}`;
  const chord = chordNotes.map(n => `${n}${chordOctave}`);

  // Play bass note with higher velocity
  synth.triggerAttackRelease(bass, "8n", Tone.now(), 1.2);

  // Play chord notes with slightly lower velocity
  synth.triggerAttackRelease(chord, "8n", Tone.now(), 0.9);
}
