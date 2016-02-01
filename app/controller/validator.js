import expressValidator from 'express-validator';
import Courier from '../data/bookshelf/model/Courier';

export default function () {
  return expressValidator({
    customValidators: {
      isValidTrackingData: function (value) {
        return Courier.isValidTrackingData(value);
      }
    }
  });
}
