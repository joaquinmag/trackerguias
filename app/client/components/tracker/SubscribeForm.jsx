'use strict';

import React from 'react';
import Label from '../common/Label.jsx';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import {TrackerActions} from './TrackerActions';

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
      self.props.setWorking(true);
      self.setState({
        loading: true
      }, function() {
        TrackerActions.subscribeEmail({
          email: self.state.email,
          receiveMoreInfo: self.state.receiveMoreInfo,
          packageInformation: self.props.trackingRequestData
        })
        .then(function() {
          self.setState({
            showSubscribedDone: true,
            loading: false
          });
          setTimeout(function() {
            self.setState({showSubscribedDone: false});
          }, 10000);
          self.props.setWorking(false);
        });
      });
    }
  },
  render() {
    const self = this;
    const disabled = (self.props.parentIsWorking || self.state.loading);
    const formSection = function() {
      if (self.state.showSubscribedDone) {
        return (
          <div className="mdl-card__supporting-text red-text">
            <p><strong>Ha comenzado el proceso de suscripción. Revisá tu casilla de correo y confirmá la suscripción en el email recibido.</strong></p>
          </div>
        );
      } else {
        return (
          <form action="/tracker" method="post" onSubmit={self.subscribeToUpdates}>
            <div className="mdl-card__supporting-text">
              <fieldset>
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                  <Label htmlFor="email" text="Email" />
                  <Input name="email" type="email" required={true} onChange={self.changeEmail} />
                </div>
                <label htmlFor="receiveMoreInfo" className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
                  <input type="checkbox" id="receiveMoreInfo" name="receiveMoreInfo" value="receive" className="mdl-checkbox__input" onChange={self.changeReceiveMoreInfo} />
                  <span className="mdl-checkbox__label">Suscribirse a newsletter con información de productos interesantes.</span>
                </label>
              </fieldset>
            </div>
            <div className="mdl-card__actions mdl-card--border">
              <Button type="submit" text="Suscribir" disabled={disabled}/>
            </div>
          </form>
        );
      }
    }();
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
        {formSection}
      </div>
    );
  },
  componentDidMount: function(){
    componentHandler.upgradeDom();
  },
  componentDidUpdate: function(){
      componentHandler.upgradeDom();
  }
});
