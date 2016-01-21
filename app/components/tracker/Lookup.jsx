'use strict';

import React from 'react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
//import ThingActions from './ThingActions';

export default React.createClass({
  displayName: 'Lookup',
  getInitialState() {
    return {editing: false};
  },
  render() {
    return (
      <form ref="trackPackage" action="/tracker?_method=PUT" method="post">
        <Input name="name" type="text" placeholder="Hello"/>
        <Button text="Update"/>
      </form>
    );
  }
});
