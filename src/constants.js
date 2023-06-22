export const CONSTANTS = {
  requestAnimationSpeed: 400,
  requestAnimationHighSpeed: 40,
  pixelImage: './images/tetris-pixel.jpg'
};

/**
 * Events.
 */
export const EVENTS = {
  CLICK: 'click',
  KEY_DOWN: 'keydown',
  KEY_UP: 'keyup',
  MOUSE_DOWN: 'mousedown',
  MOUSE_UP: 'mouseup',
  MOUSE_OUT: 'mouseout'
};

/**
 * Event codes.
 */
export const EVENT_CODE = {
  SPACE: 'Space',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight'
};

/**
 * Key codes enum.
 * @enum {number}
 */
export const KEY_CODES = {
  DOWN: 40,
  ENTER: 13,
  ESC: 27,
  SPACE: 32,
  TAB: 9,
  UP: 38,
  LEFT: 37,
  RIGHT: 39
};

/**
 * Selectors.
 */
export const SELECTORS = {
  START_GAME_CTA: '.js-cta-start-game',
  DOWN_CTA: '.js-cursor-down',
  TETRIS_CONTAINER: '.js-main-container',
  NEXT_CTA: '.js-cursor-next',
  CANVAS: '.js-tetris-board',
  SATELLITE: '.js-satellite'
};
