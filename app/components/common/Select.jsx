'use strict';

import React from 'react';

export default React.createClass({
  displayName: 'Select',
  propTypes: {
    name: React.PropTypes.string.isRequired,
    label: React.PropTypes.string,
    options: React.PropTypes.array,
    required: React.PropTypes.bool,
    onChange: React.PropTypes.func
  },
  render() {
    let options = this.props.options;
    return (
      <div className="mdl-selectfield mdl-js-selectfield" style={{display: 'block'}}>
          <select id={this.props.name} name={this.props.name}
            required={this.props.required} onChange={this.props.onChange}
            className="mdl-selectfield__select">
              {options.map(function(object, i) {
                return <option key={i} value={object.value}>{object.label}</option>;
              })}
          </select>
          <label className="mdl-selectfield__label" htmlFor="{this.props.name}">{this.props.label}</label>
      </div>
    );
  }
});
