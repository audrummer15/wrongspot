'use strict';

describe('Service: region', function () {

  // load the service's module
  beforeEach(module('wrongspotApp'));

  // instantiate service
  var region;
  beforeEach(inject(function (_region_) {
    region = _region_;
  }));

  it('should do something', function () {
    expect(!!region).toBe(true);
  });

});
