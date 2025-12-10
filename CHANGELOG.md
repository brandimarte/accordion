# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-12-08

### Added

-   Audio playback: Clicking on any button on the SVG diagram now plays the corresponding note or chord.
-   "Play Chord" button: A new button next to the chord selector allows playing the currently selected chord with a proper bass note in a lower octave.

### Changed

-   Refactored audio playback logic to support distinct behaviors for diagram clicks and the "Play Chord" button.
-   Fixed "7" chord (dominant 7th) playback and highlighting by standardizing its internal value to "seventh".
-   Updated `README.md` to document the new audio features.

## [1.0.0] - 2025-12-08

### Added

-   Initial release of the Accordion Chord Visualizer.
-   Core functionality for displaying major, minor, 7th, diminished, maj7, m7, 6, m6, dim_triad, and 7b5 chords.
-   Support for enharmonic chord spellings and playability constraints.
-   Interactive SVG diagram of a 120-bass Stradella accordion.
-   Dropdowns for selecting root note and chord type.
-   Visual indicators for concave bass buttons (Ab, C, E, Fb, G#).
-   "Top" and "Bottom" labels for diagram orientation.
-   Comprehensive `README.md` file.
-   `LICENSE` file (GNU GPLv3 License).

### Changed

-   Refactored JavaScript into modular structure (`config.js`, `note-logic.js`, `drawing.js`, `chords.js`, `main.js`).
-   Improved `highlightSingleChord` function using a strategy pattern.
-   Extracted "closest note to the left" logic into a reusable helper function (`utils.js`).
-   Grouped drawing-related constants into a `drawing-config.js` object.
-   Adjusted SVG dimensions and button positioning for better layout and spacing.
