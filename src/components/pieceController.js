import {EVENTS, SELECTORS} from '../constants';

/**
 * Piece Controller Component.
 * Manages the piece events like rotation and x/y translation.
 */
export class PieceController {
  /**
   * Creates the Piece Component.
   * @param {!Object} board The board instance.
   */
  constructor(board) {
    /**
     * @private {!HTMLElement}
     */
    this.document_ = document

    /**
     * @private {!Object}
     */
    this.board_ = board;

    /**
     * @private {!Object}
     */
    this.piece_ = null;

    /**
     * @private {Object}
     */
    this.mouseDownHoldStarter_ = null;
    
    this.controlsEventHandler_ = this.controlsEventHandler_.bind(this);
    this.onMouseUp_ =  this.onMouseUp_.bind(this);
    this.onMouseDown_ = this.onMouseDown_.bind(this);
  }

  /**
   * Moves the piece to the right.
   * @param {!Event} event
   * @private
   */
  movePieceToRight_(event) {
    const {pieceCoord} = this.piece_;
    const evenTarget = event.target;
    const isKeyBoardAction = event.keyCode === 39;
    const isRightAction = evenTarget.parentElement.classList.contains(Classname.RIGHT) || isKeyBoardAction;

    if (isRightAction) {
      const nextRightPosition = pieceCoord.map((elem) => [elem[0], elem[1] + 1]);
      const isValidRightPositionOnBoard = this.board_.isMatrixCoordAvailable(nextRightPosition); 

      isValidRightPositionOnBoard && this.piece_.movePieceXPos('right');
    }
  }

  /**
   * Moves the piece to the left.
   * @param {!Event} event
   * @private
   */
  movePieceToLeft_(event) {
    const {pieceCoord} = this.piece_;
    const evenTarget = event.target;
    const isKeyBoardAction = event.keyCode === 37;
    const isLeftAction = evenTarget.parentElement.classList.contains(Classname.LEFT) || isKeyBoardAction;

    if (isLeftAction) {
      const nextLeftPosition = pieceCoord.map((elem) => [elem[0], elem[1] - 1]);
      const isValidLeftPositionOnBoard = this.board_.isMatrixCoordAvailable(nextLeftPosition); 

      isValidLeftPositionOnBoard && this.piece_.movePieceXPos('left');
    }
  }

  /**
   * Rotates the piece on the next position.
   * @param {!Event} event
   * @private
   */
  rotatePiece_(event) {
    event.stopPropagation();

    const evenTarget = event.target;
    const isNextAction = 
      evenTarget.parentElement.classList.contains(Classname.NEXT) || event.keyCode === 32;

    if (isNextAction) {
      const {nextPiecePosition, newIndexRotation} = this.piece_.getNextPieceRotation();
      const isValidPositionOnBoard = this.board_.isMatrixCoordAvailable(nextPiecePosition); 

      isValidPositionOnBoard && this.piece_.setPieceRotationCoord(nextPiecePosition, newIndexRotation);
    }
  }

  /**
   * Callback for mouse down event.
   * @param {!Event} event
   * @private
   */
   onMouseDown_(event){
    event.stopPropagation();

    this.mouseDownHoldStarter_ = setInterval(() => {
      this.movePieceToRight_(event);
      this.movePieceToLeft_(event);
      this.rotatePiece_(event);
    }, 400);
  }

  /**
   * Callback for mouse up event.
   * @param {!Event} event
   * @private
   */
  onMouseUp_(event) {
    event.stopPropagation();

    if (this.mouseDownHoldStarter_) {
      clearInterval(this.mouseDownHoldStarter_);
    }
  }
  
  /**
   * Listen for events.
   * @param {!Event} event
   * @private
   */
  controlsEventHandler_(event) {
    event.stopPropagation();

    this.movePieceToRight_(event);
    this.movePieceToLeft_(event);
    this.rotatePiece_(event);
  }

  /**
   * Listen for Events.
   * @private
   */
  listenEvents_() {
    this.document_.addEventListener(EVENTS.KEY_DOWN, this.controlsEventHandler_);
    this.document_.addEventListener(EVENTS.CLICK, this.controlsEventHandler_);
    this.document_.addEventListener(EVENTS.MOUSE_DOWN, this.onMouseDown_);
    this.document_.addEventListener(EVENTS.MOUSE_UP,  this.onMouseUp_);
    this.document_.addEventListener(EVENTS.MOUSE_OUT, this.onMouseUp_);
    this.document_.querySelector(SELECTORS.START_GAME_CTA).addEventListener(EVENTS.KEY_DOWN, (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
  }

  /**
   * Wraps a new piece instance on the controller.
   */
  wrapNewPiece(piece) {
    this.piece_ = piece;
  }

  /**
   * Initializes the component.
   */
  init() {
    this.listenEvents_();
  }
}

/**
 * Classname.
 */
 const Classname = {
  LEFT: 'js-cursor-left',
  NEXT: 'js-cursor-next',
  RIGHT: 'js-cursor-right',
};