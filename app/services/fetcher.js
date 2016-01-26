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
  let response;
  return when.promise(function (resolve, reject, notify) {
    request.post(url_prefix + url)
      .type('application/json')
      .set('Accept', 'application/json')
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('port', 3000)
      .send(payload)
      .end(function (err, res) {
        if (err) {
          response = {error: 'message: ' + err.message};
        }
        if (res.ok) {
          resolve(res.text);
        } else {
          reject(JSON.stringify({error: 'message: ' + res.text}));
        }
        if (dispatch) {
          dispatch(JSON.parse(response));
        }
    });
  });
}

export function httpDel(url, dispatch) {
  request.del(url_prefix + url)
      .type('application/json')
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('port', 3000)
      .end(function (err, res) {
        let response;
        if (err) {
          response = {error: 'message: ' + err.message};
        }
        if (res.ok) {
          response = res.text;
          dispatch(JSON.parse(response));
        } else {
          dispatch('Failed to delete');
        }
      });
}

export function httpPut(url, payload, dispatch) {
  let response;
  request.put(url_prefix + url)
      .type('application/json')
      .set('Accept', 'application/json')
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('port', 3000)
      .send(payload)
      .end(function (err, res) {
        if (err) {
          response = {error: 'message: ' + err.message};
        }
        if (res.ok) {
          response = res.text;
        } else {
          response = JSON.stringify({error: 'message: ' + res.text});
        }
        if (dispatch) {
          dispatch(JSON.parse(response));
          return response;
        }
      });
}
