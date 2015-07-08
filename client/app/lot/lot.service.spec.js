'use strict';

describe('Service: lot', function () {

  // load the service's module
  beforeEach(module('wrongspotApp'));

  // instantiate service
  var lot;
  beforeEach(inject(function (_lot_) {
    lot = _lot_;
  }));

  it('should do something', function () {
    expect(!!lot).toBe(true);
  });

});
