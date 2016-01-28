export class PackageNotFoundException {
  constructor(message, trackingData) {
    this.message = message;
    this.trackingData = trackingData;
  }
}
