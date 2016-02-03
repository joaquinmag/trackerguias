import createError from 'create-error';

let PackageNotFoundException = createError('PackageNotFoundException');
let SoapConnectionError = createError('SoapConnectionError');
let CourierNotFoundException = createError('CourierNotFoundException');
let WrongTrackingDataException = createError('WrongTrackingDataException');
let ExpiredTrackingException = createError('ExpiredTrackingException');
let NoDifferencesException = createError('NoDifferencesException');

export {
  PackageNotFoundException,
  SoapConnectionError,
  CourierNotFoundException,
  WrongTrackingDataException,
  ExpiredTrackingException,
  NoDifferencesException
};
