export class Timeline {
  public epochMillis: number = Date.now();
  public timeoutMillis: number = 5 * 1000;

  public reset(timeoutMillis?: number) {
    this.epochMillis = Date.now();
    if (timeoutMillis !== undefined) {
      this.timeoutMillis = timeoutMillis;
    }
  }

  public get passedMillis() {
    return Date.now() - this.epochMillis;
  }

  public get remainMillis() {
    return this.epochMillis + this.timeoutMillis - Date.now();
  }

  public get over() {
    return this.remainMillis <= 0;
  }
}

export const globalTimeline = new Timeline();
