'use strict';

import React from 'react';
import Lookup from './Lookup.jsx';
import LookupResponse from './LookupResponse.jsx';
import SubscribeForm from './SubscribeForm.jsx';

export default React.createClass({
  displayName: 'Tracker',
  getInitialState () {
    return {
      isWorking: false,
      requestData: null,
      trackingStatus: null,
      showTrackingInformation: false,
      informationNotFound: false
    };
  },
  handleTrackingUpdate (dataPromise) {
    let self = this;
    dataPromise.then(function (trackingStatus) {
      self.setState({
        trackingStatus: trackingStatus,
        showTrackingInformation: true,
        informationNotFound: false
      });
    })
    .catch(function (err) {
      self.setState({
        trackingStatus: null,
        showTrackingInformation: true,
        informationNotFound: true
      });
    });
  },
  handleTrackingRequestUpdate (requestData) {
    let self = this;
    self.setState({
      trackingRequest: requestData
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
      if (self.state.showTrackingInformation && !self.state.informationNotFound) {
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
            <Lookup setWorking={this.setWorking} parentIsWorking={this.state.working} updateTrackingInformation={this.handleTrackingUpdate} onTrackingRequestUpdate={this.handleTrackingRequestUpdate} />
          </div>
        </section>
        <section className="section--center mdl-grid">
          <LookupResponse trackingStatus={this.state.trackingStatus} show={this.state.showTrackingInformation} notFound={this.state.informationNotFound} />
        </section>
        <section className="section--center mdl-grid">
          {subscribeForm}
        </section>
      </div>
    );
  },
});
