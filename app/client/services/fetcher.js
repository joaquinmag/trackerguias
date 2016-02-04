import request from 'superagent';
import when from 'when';
import {WrongStatusException, ErrorStatusException} from '../exceptions';
const url_prefix = '';

export function httpPost(url, payload) {
  return when.promise(function (resolve, reject) {
    request.post(url_prefix + url)
      .type('application/json')
      .set('Accept', 'application/json')
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('port', 3000)
      .send(payload)
      .end(function (err, res) {
        if (err) {
          reject(new ErrorStatusException(err));
        } else if (res.ok) {
          let parsedJSON = JSON.parse(res.text);
          if (parsedJSON.status === 'ok') {
            resolve(parsedJSON.data);
          } else {
            reject(new WrongStatusException(parsedJSON.message));
          }
        } else {
          reject(new ErrorStatusException('An error occurred'));
        }
      });
  });
}
