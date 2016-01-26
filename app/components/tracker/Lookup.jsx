'use strict';

import React from 'react';
import Label from '../common/Label.jsx';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';
import {TrackerActions} from './TrackerActions';

export default React.createClass({
  displayName: 'Lookup',
  getInitialState() {
    return {
      courier: null,
      trackingNumber: '',
      loading: false
    };
  },
  changeTrackingNumber (event) {
    this.setState({
      trackingNumber: event.target.value
    });
  },
  changeCourier (event) {
    this.setState({
      courier: event.target.value
    });
  },
  lookupTrackingInformation (event) {
    var self = this;
    event.preventDefault();
    if (!self.state.loading) {
      self.setState({
        loading: true
      }, function() {
        TrackerActions.lookupPackage({
          courier: self.state.courier,
          trackingNumber: self.state.trackingNumber
        }).catch(function (error) {
          self.setState({ showError: true });
        }).then(function (response) {
          console.log(response);
          self.setState({ loading: false });
        });
      });
    }
  },
  render() {
    var options = [
      {
        label: "OCA",
        value: "oca"
      },
      {
        label: "BusPack",
        value: "buspack"
      },
      {
        label: "Via Cargo",
        value: "via-cargo"
      }
    ];
    return (
      <form action="/tracker" method="post" onSubmit={this.lookupTrackingInformation}>
        <div className="mdl-card__supporting-text">
          <fieldset>
            <Select name="courier" options={options} label="Elija el trasporte" onChange={this.changeCourier} />
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label textfield-demo">
              <Label htmlFor="trackingNumber" text="# Tracking" />
              <Input name="username" type="text" required={true} onChange={this.changeTrackingNumber} />
            </div>
          </fieldset>
        </div>
        <div className="mdl-card__actions mdl-card--border">
          <Button type="submit" text="Buscar" />
        </div>
      </form>
    );
  },
  componentDidMount() {
    componentHandler.upgradeDom();
  },
  componentDidUpdate() {
    componentHandler.upgradeDom();
  }
});
