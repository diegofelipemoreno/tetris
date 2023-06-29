import './style.css';
import {CONSTANTS, SELECTORS, EVENTS} from './constants';
import {Game} from './components/game.js';
import {requestAnimationUtil, mobileCheck} from './utils';

let gameConfig = {
  width: 14,
  height: 22,
  pieceSize: 18,
  gameSpeed: CONSTANTS.requestAnimationSpeed
};

if (mobileCheck()) {
  gameConfig = {...gameConfig, width: 12, height: 21};
};

/**
 * The Game Facade Component.
 * Manages the Tetris visibility, start, end actions.
 */
export class GameFacade {
  /**
   * Creates the Game Facade Component.
   */
  constructor() {
    /**
     * @private {!HTMLElement}
     */
    this.document_ = document;

    /**
     * @private {HTMLElement}
     */
    this.body_ = document.body;

    /**
     * @private {!HTMLElement}
     */
    this.startGameCheckbox_ = null;

    /**
     * @private {HTMLElement}
     */
    this.tetrisContainer_ = null;

    /**
     * @private {Game}
     */
    this.game_ = null;

    this.startGameHandler_ = this.startGameHandler_.bind(this);
    this.watchGameStatus_ = this.watchGameStatus_.bind(this);
  }

  /**
   * Start game handler.
   * @param {!Event} event
   * @private
   */
   startGameHandler_(event) {
    const startCta = event.target;
    const isChecked = startCta.checked;

    if (mobileCheck()) {
      this.document_.querySelector(SELECTORS.SATELLITE)?.scrollIntoView();
    } else {
      this.body_.scrollIntoView();
    }
    
    isChecked ? this.startGame_() : this.endGame_(); 
   }

  /**
   * Starts the game.
   * @private
   */
  startGame_() {
    this.game_ = new Game(gameConfig);

    this.game_.init();
    this.body_.classList.add(Classname.SCROLL_DISABLED);
    this.tetrisContainer_.classList.remove(Classname.GAME_ACTIVE);
    this.watchGameStatus_();
  }

  /**
   * Ends the game.
   * @private
   */
  endGame_() {
    this.game_.end();
    this.body_.classList.remove(Classname.SCROLL_DISABLED);
    this.tetrisContainer_.classList.add(Classname.GAME_ACTIVE);
  }

  /**
   * Listen for Events.
   * @private
   */
  listenEvents_() {
    this.startGameCheckbox_.addEventListener(EVENTS.CLICK, this.startGameHandler_);
  }

  /**
   * Watches the game is over status.
   * @private
   */
  watchGameStatus_() {
    const {isGameOver} = this.game_;

    if (isGameOver) {
      this.endGame_();
      this.startGameCheckbox_.checked = false;
    }

    requestAnimationUtil(this.watchGameStatus_, this.gameSpeed_);
  }

  /**
   * Initializes the component.
   */
  init() {
    this.tetrisContainer_ = this.document_.querySelector(SELECTORS.TETRIS_CONTAINER);
    this.startGameCheckbox_ = this.document_.querySelector(SELECTORS.START_GAME_CTA);

    if (this.startGameCheckbox_) {
      this.listenEvents_();
    }
  }
}

//new GameFacade().init();

/**
 * Classname.
 */
 const Classname = {
  SCROLL_DISABLED: 'scroll-disabled',
  GAME_ACTIVE: 'tetris-main-container-start'
};