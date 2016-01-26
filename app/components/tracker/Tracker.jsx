'use strict';

import React from 'react';
import Lookup from './Lookup.jsx';
import LookupResponse from './LookupResponse.jsx';

export default React.createClass({
  displayName: 'Tracker',
  render() {
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
            <Lookup />
          </div>
        </section>
        <section className="section--center mdl-grid">
          <LookupResponse />
        </section>
      </div>
    );
  },
  componentDidMount() {
    componentHandler.upgradeDom();
  },
  componentDidUpdate() {
    componentHandler.upgradeDom();
  }
});
