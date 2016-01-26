import request from 'superagent';
import when from 'when';
const url_prefix = '';

export function getXhrData(url, cb) {
  let response;
  request.get(url_prefix + url)
      .set('Accept', 'application/json')
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('port', 3000)
      .end(function (err, res) {
        if (err) {
          response = {error: 'message: ' + err.message};
        }
        if (res.ok) {
          response = res.text;
        } else {
          response = JSON.stringify({error: 'message: ' + res.text});
        }
        if (cb) {
          cb(JSON.parse(response));
          return response;
        }
      });
}

export function httpPost(url, payload, dispatch) {
  return when.promise(function (resolve, reject, notify) {
    request.post(url_prefix + url)
      .type('application/json')
      .set('Accept', 'application/json')
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('port', 3000)
      .send(payload)
      .end(function (err, res) {
        if (err) {
          reject({error: err});
        } else {
          console.log(JSON.parse(res.text));
          if (res.ok) {
            resolve(JSON.parse(res.text));
          } else {
            reject({error: 'message: ' + res.text});
          }
        }
        if (dispatch) {
          dispatch(JSON.parse(res.text));
        }
    });
  });
}
