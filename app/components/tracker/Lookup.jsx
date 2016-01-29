'use strict';

import React from 'react';
import Label from '../common/Label.jsx';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';
import {TrackerActions} from './TrackerActions';

export default React.createClass({
  displayName: 'Lookup',
  propTypes: {
    updateTrackingInformation: React.PropTypes.func.isRequired,
    onTrackingRequestUpdate: React.PropTypes.func.isRequired,
    setWorking: React.PropTypes.func,
    parentIsWorking: React.PropTypes.bool
  },
  getInitialState() {
    return {
      courier: 'oca',
      trackingNumber: '',
      loading: false
    };
  },
  updateTrackingRequestInformation () {
    let self = this;
    self.props.onTrackingRequestUpdate({
      courier: self.state.courier,
      trackingData: {
        packageId: self.state.trackingNumber
      }
    });
  },
  changeTrackingNumber (event) {
    let self = this;
    self.setState({
      trackingNumber: event.target.value
    }, self.updateTrackingRequestInformation);
  },
  changeCourier (event) {
    let self = this;
    self.setState({
      courier: event.target.value
    }, self.updateTrackingRequestInformation);
  },
  lookupTrackingInformation (event) {
    var self = this;
    event.preventDefault();
    if (!self.state.loading && !self.props.parentIsWorking) {
      self.props.setWorking(true);
      self.setState({
        loading: true
      }, function() {
        var dataPromise = TrackerActions.lookupPackage({
          courier: self.state.courier,
          trackingNumber: self.state.trackingNumber
        });
        self.setState({ loading: false });
        self.props.setWorking(false);
        self.props.updateTrackingInformation(dataPromise);
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
    const disabled = function() {
      if (this.props.parentIsWorking || this.state.loading) {
        return {disabled: disabled};
      }
      return {};
    };
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
          <Button type="submit" text="Buscar" {...disabled}/>
        </div>
      </form>
    );
  },
});
