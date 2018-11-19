export default abstract class Bus {
  public static fire<T>(event: string, data: T) {
    document.dispatchEvent(
      new CustomEvent(`app:${event}`, {
        bubbles: true,
        cancelable: true,
        detail: data
      })
    );
  }

  public static on<T>(event: string, cb: (data: T) => void) {
    document.addEventListener(`app:${event}`, (event) => {
      cb((event as CustomEvent).detail);
    });
  }
}
