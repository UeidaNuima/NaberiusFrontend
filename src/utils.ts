export class DefaultGetter {
  private obj: any;
  public constructor(obj: any) {
    this.obj = obj;
  }
  public get(index: string | number) {
    if (index in this.obj) {
      return this.obj[index];
    } else {
      return index;
    }
  }
}
