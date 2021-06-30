/**
 * Score Component.
 */
export class Score {
  /**
   * Creates the Score Component.
   */
  constructor() {
    /**
     * @private {HTMLElemet}
     */
    this.scoreSelector_ = null;

    /**
     * @private {number}
     */
    this.linesCompleted_ = 0;
  }

  /**
   * Sets the linesCompleted value.
   * @param {number} lines
   */
  set linesCompleted(lines) {
    this.linesCompleted_ = lines;
    this.render();
  }

  /**
   * Gets the linesCompleted value.
   */
  get linesCompleted() {
    return this.linesCompleted_;
  }

  /**
   * Renders the game score on the view.
   */
  render() {
    this.scoreSelector_.innerHTML = this.linesCompleted_;
  }

  /**
   * Initializes the component.
   */
  init() {
    this.scoreSelector_ = document.querySelector('.js-score');
  }
}