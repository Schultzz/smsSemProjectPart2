'use strict';

describe('myAppRename.filters', function () {
  beforeEach(module('myAppRename.filters'));

  describe('checkmark', function () {

    it('should convert boolean values to unicode checkmark or cross',
      inject(function (checkmarkFilter) {
        expect(checkmarkFilter(true)).toBe('\u2713');
        expect(checkmarkFilter(false)).toBe('\u2718');
      }));
  });


  describe('filterXXXX', function () {

  })
});

