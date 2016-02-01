'use strict';

import React from 'react';
import Lookup from './Lookup.jsx';
import LookupResponse from './LookupResponse.jsx';
import SubscribeForm from './SubscribeForm.jsx';

export default React.createClass({
  displayName: 'Tracker',
  propTypes: {
    couriers: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
  },
  getInitialState () {
    return {
      isWorking: false,
      trackingRequestData: null,
      trackingStatus: null,
      showTrackingInformation: false,
      errorMessage: null
    };
  },
  handleTrackingUpdate (dataPromise) {
    let self = this;
    dataPromise.then(function (trackingStatus) {
      self.setState({
        trackingStatus: trackingStatus,
        showTrackingInformation: true,
        errorMessage: null
      });
    })
    .catch(function (err) {
      if (err.status == 'wrong') {
        self.setState({
          trackingStatus: null,
          showTrackingInformation: true,
          errorMessage: err.message
        });
      }
    });
  },
  handleTrackingRequestUpdate (requestData) {
    let self = this;
    self.setState({
      trackingRequestData: requestData
    });
  },
  setWorking (isWorking) {
    this.setState({
      working: isWorking
    });
  },
  render () {
    const self = this;
    const subscribeForm = function () {
      if (self.state.showTrackingInformation && !self.state.errorMessage) {
        return <SubscribeForm trackingRequestData={self.state.trackingRequestData} setWorking={self.setWorking} parentIsWorking={self.state.working} />;
      }
    }();
    return (
      <div>
        <section className="section--center mdl-grid">
          <div className="mdl-card mdl-cell mdl-cell--12-col mdl-shadow--4dp">
            <div className="mdl-card__title">
              <h3 className="mdl-card__title-text">Ingresá los datos del envío</h3>
        		</div>
        		<div className="mdl-card__supporting-text">
        			<p>
        				La información es provista a través de las páginas de las empresas de encomiendas aquí disponibles. <br />
        				Cualquier sugerencia/problema indicarlo <a href="https://github.com/joaquinmag/trackerguias/issues" target="_blank">aquí</a>
        			</p>
        		</div>
            <Lookup couriers={this.props.couriers} setWorking={this.setWorking} parentIsWorking={this.state.working} updateTrackingInformation={this.handleTrackingUpdate} onTrackingRequestUpdate={this.handleTrackingRequestUpdate} />
          </div>
        </section>
        <section className="section--center mdl-grid">
          <LookupResponse trackingStatus={this.state.trackingStatus} show={this.state.showTrackingInformation} errorMessage={this.state.errorMessage} />
        </section>
        <section className="section--center mdl-grid">
          {subscribeForm}
        </section>
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
