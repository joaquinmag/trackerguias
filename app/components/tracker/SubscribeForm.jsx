'use strict';

import React from 'react';
import Label from '../common/Label.jsx';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';

export default React.createClass({
  displayName: 'SubscribeForm',
  propTypes: {
    trackingRequestData: React.PropTypes.object,
    setWorking: React.PropTypes.func,
    parentIsWorking: React.PropTypes.bool
  },
  getInitialState () {
    return {
      email: '',
      receiveMoreInfo: '',
      loading: false,
      showSubscribedDone: false
    };
  },
  changeEmail (event) {
    this.setState({
      email: event.target.value
    });
  },
  changeReceiveMoreInfo (event) {
    this.setState({
      receiveMoreInfo: event.target.value
    });
  },
  subscribeToUpdates (event) {
    let self = this;
    event.preventDefault();
    if (!self.state.loading && !self.props.parentIsWorking) {
      self.setWorking(true);
      self.setState({
        loading: true
      }, function() {
        TrackerActions.subscribeEmail({
          email: self.state.email,
          receiveMoreInfo: self.state.receiveMoreInfo,
          trackingData: self.props.trackingRequestData
        })
        .then(function() {
          self.setState({
            showSubscribedDone: true,
            loading: false
          });
          setTimeout(function() {
            self.setState({showSubscribedDone: false});
          }, 5000);
          self.props.setWorking(false);
        });
      });
    }
  },
  render() {
    return (
      <div className="mdl-card mdl-cell mdl-cell--12-col mdl-shadow--4dp">
        <div className="mdl-card__supporting-text">
          <p>
            <strong>Recibí las actualizaciones en tu encomienda ingresando tu email aquí.</strong>
          </p>
          <p>
            El servidor se encargará de consultar tu encomienda frecuentemente y te enviará un email ante algún cambio.
          </p>
        </div>
        <form action="/tracker" method="post" onSubmit={this.subscribeToUpdates}>
          <div className="mdl-card__supporting-text">
            <fieldset>
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label textfield-demo">
                <Label htmlFor="email" text="Email" />
                <Input name="email" type="email" required={true} onChange={this.changeEmail} />
              </div>
              <label htmlFor="receiveMoreInfo" className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
                <input type="checkbox" id="receiveMoreInfo" name="receiveMoreInfo" value="receive" className="mdl-checkbox__input" onChange={this.changeReceiveMoreInfo} />
                <span className="mdl-checkbox__label">Suscribirse a newsletter con información de productos interesantes.</span>
              </label>
            </fieldset>
          </div>
          <div className="mdl-card__actions mdl-card--border">
            <Button type="submit" text="Suscribir" />
          </div>
        </form>
      </div>
    );
  },
});
