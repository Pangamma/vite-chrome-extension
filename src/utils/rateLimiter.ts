/**
 * Use this for when you only want to initiate actions once an action stops
 * occuring for longer than "delayMs" milliseonds. Useful for scroll event
 * watchers and other operations when you want to limit how often heavier
 * operations can be triggerred.
 */
export class RateLimiter {
  private delayMs: number;
  private maxMsBeforeForcingQueuedAction?: number;
  private timeoutHandle?: number;
  private lastGoTime: number = 0;
  private queuedAction?: () => void;

  constructor(delayMs: number, maxMsBeforeForcingQueuedAction?: number) {
    this.delayMs = delayMs;
    this.maxMsBeforeForcingQueuedAction = maxMsBeforeForcingQueuedAction;
  }

  public tryAction(action: () => void): RateLimiter {
    this.queuedAction = action;

    // ALWAYS clear the wait handle.
    if (this.timeoutHandle !== undefined) {
      window.clearTimeout(this.timeoutHandle);
      this.timeoutHandle = undefined;
    }

    // Waiting past the max wait times? Force it to run.
    if (this.maxMsBeforeForcingQueuedAction !== undefined && (this.maxMsBeforeForcingQueuedAction + this.lastGoTime) < Date.now()) {
      const func = this.queuedAction;
      this.queuedAction = undefined;
      this.lastGoTime = Date.now();
      func(); // Force it to be run.
      return this;
    }

    // Try and run it again to see if it is not interupted.
    this.timeoutHandle = window.setTimeout(() => {
      if (this.queuedAction) {
        this.queuedAction();
        this.queuedAction = undefined;
        this.lastGoTime = Date.now();
      }
    }, this.delayMs);

    return this;
  }

  public cancel(): RateLimiter {
    if (this.timeoutHandle !== undefined) {
      window.clearTimeout(this.timeoutHandle);
      this.queuedAction = undefined;
    }

    return this;
  }
}
