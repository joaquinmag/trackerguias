'use strict';

import React from 'react';

export default React.createClass({
  displayName: 'Button',
  propTypes: {
    text: React.PropTypes.string.isRequired,
    href: React.PropTypes.string,
    type: React.PropTypes.string,
    clickAction: React.PropTypes.func,
    disabled: React.PropTypes.bool
  },
  render() {
    const self = this;
    const disabled = function() {
      if (self.props.disabled) {
        return "disabled";
      }
    }();
    return (
        <a href={self.props.href} onClick={self.props.clickAction}>
          <button type={self.props.type} className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" disabled={disabled}>
          {self.props.text}
          </button>
        </a>
    );
  }
});
