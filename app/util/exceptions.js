export class PackageNotFoundException {
  constructor(message, trackingData) {
    this.message = message;
    this.trackingData = trackingData;
  }
}

export class SoapConnectionError {
  consructor(message) {
    this.message = message;
  }
}
