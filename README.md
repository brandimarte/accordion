# Accordion Chord Visualizer

A web-based tool to visualize chord fingerings on a 120-bass Stradella accordion system. This project helps accordionists learn and understand the layout of the bass buttons and how different chords are formed.

## Features

-   **Interactive Diagram:** A complete 120-bass Stradella layout.
-   **Audio Playback:** Click any button on the diagram to hear its corresponding note or chord.
-   **Multiple Chord Types:** Visualize major, minor, dominant 7th, diminished, major 7th, minor 7th, and other complex chords.
-   **"Play Chord" Button:** Play the currently selected chord with a proper bass note in a lower octave.
-   **Enharmonic Equivalents:** Shows alternative fingerings for chords with enharmonically equivalent roots (e.g., A# and Bb).
-   **Special Button Indicators:**
    -   Highlights buttons with a concave depression (Ab, C, E) for easy orientation.
    -   Indicates the "top" and "bottom" of the bass system.
-   **Responsive Design:** The diagram is viewable on different screen sizes.

## How to Use

1.  Open the `index.html` file in your web browser.
2.  A "Click to enable audio" button will appear. Click it to initialize the sound.
3.  Use the **Tone** and **Chord type** dropdowns to select a chord. The diagram will automatically highlight the required buttons.
4.  Click the **Play Chord** button to hear the selected chord.
5.  Click any individual button on the SVG diagram to hear its specific note or chord.

### Highlighting Legend

-   **Red buttons:** Primary fingering for the selected chord.
-   **Blue buttons:** Alternative fingering using an enharmonically equivalent root note.

## Technologies Used

-   HTML
-   CSS
-   JavaScript (Vanilla)

## Author

This project was created by [Pedro Brandimarte](https://brandimarte.github.io).

## License

This project is licensed under the GNU General Public License v3.0.
