import expressValidator from 'express-validator';
import Courier from '../data/bookshelf/model/Courier';

export default function () {
  return expressValidator({
    customValidators: {
      isTrackingDataValid: function (value) {
        return Courier.isTrackingDataValid(value);
      }
    }
  });
}
