class EventManager {
  static raiseRefreshTable(tableController: string) {
    var evt = new Event(`refreshTable${tableController}`, {bubbles: true});
    document.dispatchEvent(evt);
  }
}
export default EventManager;
