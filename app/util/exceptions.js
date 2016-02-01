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

export class CourierNotFoundException {
  constructor(message) {
    this.message = message;
  }
}

export class WrongTrackingDataException {
  constructor(courier, trackingData) {
    this.message = `trackingData: ${JSON.stringify(trackingData)} wrong for courier: ${courier}`;
  }
}
