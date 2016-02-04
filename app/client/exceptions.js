import createError from 'create-error';

let WrongStatusException = createError('WrongStatusException');
let ErrorStatusException = createError('ErrorStatusException');

export {
  WrongStatusException,
  ErrorStatusException
};
