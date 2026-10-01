// All German texts of the game in one place.

export const texts = {
  levelLoadError: (n: number) => `Level ${n} konnte nicht geladen werden`,
  goalTitle: 'Task erfolgreich abgeschlossen ✓',
  goalHint: 'ENTER: nochmal',
  terminalLabel: 'OUTPUT',
  moreErrors: (n: number) => `… und ${n} weitere`,
  scoreLine: (n: number) => `Score: ${n}`,

  // HUD
  hudLives: (n: number) => `x${n}`,
  hudTokens: (n: number) => `Tokens ${n}`,
  hudScore: (n: number) => `Score ${n}`,

  // Floating texts
  contextTokens: (n: number) => `Kontext +${n} Tokens`,
  oneUp: '1UP: Neue Session!',
  autosave: 'Autosave...',
  bugMessages: ['Bug gefixt!', 'Patch deployed!', 'Ticket geschlossen!', 'Works on my machine!', 'LGTM!'],

  // Death & game over
  deathMessages: [
    'Segmentation fault!',
    'Stack Overflow!',
    'Kernel Panic!',
    '404: Claudia nicht gefunden',
    'Out of Memory!',
    'Halluzination erkannt!',
    'Unerwartetes Token...',
    'Strg+Z! Strg+Z!',
    'Null Pointer Exception!',
  ],
  livesLeft: (n: number) => `Noch ${n} Leben`,
  noLivesLeft: 'Keine Leben mehr...',
  gameOverTitle: 'KONTEXTFENSTER VOLL',
  gameOverText: 'Game Over – die Session ist abgelaufen.',

  // Loading
  fileNotFound: (status: number) => `Datei nicht gefunden (${status})`,
  networkError: (message: string) => `Datei konnte nicht gelesen werden: ${message}`,
  invalidJson: (message: string) => `Kein gültiges JSON: ${message}`,

  // Validation
  notAnObject: (path: string) => `${path}: erwartet ein Objekt`,
  missing: (path: string) => `${path}: fehlt`,
  expectedText: (path: string) => `${path}: erwartet einen Text`,
  expectedBool: (path: string) => `${path}: erwartet true oder false`,
  expectedList: (path: string) => `${path}: erwartet eine Liste`,
  expectedTexts: (path: string, n: number) => `${path}: erwartet ${n} Texte`,
  expectedInt: (path: string) => `${path}: erwartet eine ganze Zahl`,
  expectedPositiveInt: (path: string) => `${path}: erwartet eine ganze Zahl größer als 0`,
  expectedInts: (path: string, n: number) => `${path}: erwartet ${n} ganze Zahlen`,
  expectedMover: (path: string) =>
    `${path}: erwartet 4 ganze Zahlen und eine Zahl (Tempo)`,
  outsideLevel: (path: string) => `${path}: liegt außerhalb des Levels`,
  badRange: (path: string, width: number) =>
    `${path}: erwartet von < bis, beide zwischen 0 und ${width}`,
  unknownField: (path: string) => `${path}: unbekanntes Feld`,
};
