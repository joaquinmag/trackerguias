'use strict';

import React from 'react';
import TrackerStore from './TrackerStore';
import {TrackerActions} from './TrackerActions';

export default React.createClass({
  displayName: 'LookupResponse',
  getInitialState() {
    return {
      htmlResponse: null,
    };
  },
  render() {
    return (
      <div className="mdl-card mdl-cell mdl-cell--12-col mdl-shadow--4dp">
        <div className="section__text mdl-cell mdl-cell--12-col" dangerouslySetInnerHTML={{__html: this.state.htmlResponse}}>
        </div>
      </div>
    );
  },
  appendLookupResults: function () {
    this.setState({
      htmlResponse: TrackerStore.getTracking().tracking
    });
    console.log(TrackerStore.getTracking().tracking);
  },
  componentDidMount: function() {
    TrackerStore.addChangeListener(TrackerActions.constants().LOOKUP_PACKAGE, this.appendLookupResults);
    componentHandler.upgradeDom();
  },
  componentWillUnmount: function() {
    TrackerStore.removeChangeListener(TrackerActions.constants().LOOKUP_PACKAGE, this.appendLookupResults);
  },
  componentDidUpdate() {
    componentHandler.upgradeDom();
  }
});
