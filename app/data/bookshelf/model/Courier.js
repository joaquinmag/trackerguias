export default class Courier {
  static register(bookshelf) {
    bookshelf.models.Thing = bookshelf.Model.extend({
      tableName: 'Thing',
      user: function () {
        return this.belongsTo(bookshelf.models.User);
      }
    });
    bookshelf.models.Things = bookshelf.Collection.extend({
      model: bookshelf.models.Thing
    });
  }

  isTrackingDataValid(trackingData) {
    // TODO check if tracking data is valid depending on the courier type
    return true;
  }
}
