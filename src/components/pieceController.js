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
     * @private {!HTMLElemet}
     */
    this.document_ = document;

    /**
     * @private {!Object}
     */
    this.board_ = board;

    /**
     * @private {!Object}
     */
    this.piece_ = null;
    
    this.keyDownHandler_ = this.keyDownHandler_.bind(this);
  }
  
  /**
   * Listen for events.
   * @param {!Event} event
   * @private
   */
  keyDownHandler_(event) {
    const {pieceCoord} = this.piece_;

    switch (event.keyCode) {
      case 32:
        const {nextPiecePosition, newIndexRotation} = this.piece_.getNextPieceRotation();
        const isValidPositionOnBoard = this.board_.isMatrixCoordAvailable(nextPiecePosition); 

        if (isValidPositionOnBoard) {
          this.piece_.setPieceRotationCoord(nextPiecePosition, newIndexRotation);
        }
        break;
      case 37:
        const nextLeftPosition = pieceCoord.map((elem) => [elem[0], elem[1] - 1]);
        const isValidLeftPositionOnBoard = this.board_.isMatrixCoordAvailable(nextLeftPosition); 

        if (isValidLeftPositionOnBoard) {
          this.piece_.movePieceXPos('left');
        }
        break;
      case 39:
        const nextRightPosition = pieceCoord.map((elem) => [elem[0], elem[1] + 1]);
        const isValidRightPositionOnBoard = this.board_.isMatrixCoordAvailable(nextRightPosition); 

        if (isValidRightPositionOnBoard) {
          this.piece_.movePieceXPos('right');
        }
        break;
    }
  }

  /**
   * Listen for events.
   * @private
   */
  listenEvents_() {
    this.document_.addEventListener(Events.KEY_DOWN, this.keyDownHandler_);
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
 * Events,
 */
 const Events = {
  KEY_DOWN: 'keydown'
};