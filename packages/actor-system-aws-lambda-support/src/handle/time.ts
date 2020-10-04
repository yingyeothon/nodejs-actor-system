export class Timeline {
  public epochMillis: number = Date.now();
  public timeoutMillis: number = 5 * 1000;

  public reset(timeoutMillis?: number): void {
    this.epochMillis = Date.now();
    if (timeoutMillis !== undefined) {
      this.timeoutMillis = timeoutMillis;
    }
  }

  public get passedMillis(): number {
    return Date.now() - this.epochMillis;
  }

  public get remainMillis(): number {
    return this.epochMillis + this.timeoutMillis - Date.now();
  }

  public get over(): boolean {
    return this.remainMillis <= 0;
  }
}

export const globalTimeline = new Timeline();
