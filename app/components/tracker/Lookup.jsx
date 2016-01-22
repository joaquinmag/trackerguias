'use strict';

import React from 'react';
import Label from '../common/Label.jsx';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
//import ThingActions from './ThingActions';

export default React.createClass({
  displayName: 'Lookup',
  getInitialState() {
    return {
      selectedValue: null
    };
  },
  updateValue (newValue) {
    this.setState({
      selectedValue: newValue
    });
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
      }
    ];
    return (
      <form action="/tracker" method="post">
      <div className="mdl-selectfield mdl-js-selectfield mdl-selectfield--floating-label">
        <select id="profile_information_form_country_id" name="profile_information_form_country" className="mdl-selectfield__select" required>
            <option value=""></option>
            <option value="192">OCA</option>
            <option value="1">BusPack</option>
        </select>
    </div>
        <div className="mdl-card__supporting-text">
          <fieldset>
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label textfield-demo">
              <Label htmlFor="trackingNumber" text="# Tracking" />
              <Input name="username" type="text" required={true}/>
            </div>
          </fieldset>
        </div>
        <div className="mdl-card__actions mdl-card--border">
          <Button type="submit" text="Update"/>
        </div>
      </form>
    );
  }
});
