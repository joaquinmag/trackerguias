export default class Courier {
  static list() {
    return [
      {
        label: 'OCA',
        value: 'oca'
      },
      {
        label: 'BusPack',
        value: 'buspack'
      },
      {
        label: 'Via Cargo',
        value: 'via-cargo'
      }
    ];
  }
  isTrackingDataValid(trackingData) {
    // TODO check if tracking data is valid depending on the courier type
    return true;
  }
}
