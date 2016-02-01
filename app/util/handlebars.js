export const handlebarsHelpers = {
  helpers: {
    exists: function (variable, options) {
      let action;
      if (typeof variable !== 'undefined') {
        action = options.fn(variable);
      } else {
        action = options.inverse(variable);
      }
      return action;
    },
    json: function (variable) {
      return JSON.stringify(variable);
    }
  }
};
