import react from 'react';


var trackerGuias = window.trackerGuias || {};

trackerGuias.home = {
  render: function() {
    console.log("hola");
    //react.render()
  }
}

// TODO esto no deberia ser asi!
window.trackerGuias = trackerGuias;
