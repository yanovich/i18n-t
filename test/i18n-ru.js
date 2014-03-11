/* lib/i18n.js -- test suite for Russian locale
 * Copyright 2014 Sergei Ianovich
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * i18n package for node.js with RoR-style syntax
 */

describe('Russian', function () {
  describe('interpolation', function () {
    var i18n;
    before (function () {
      i18n = require('../lib/i18n')({ locales_directory: 'ru' ,
                                      supported_languages: ['ru']});
    })

    it('should expand a key with pluralization', function () {
      i18n.t('banana', { count: 1 }).should.equal('1 банан');
      i18n.t('banana', { count: 2 }).should.equal('2 банана');
      i18n.t('banana', { count: 5 }).should.equal('5 бананов');
      i18n.t('banana', { count: 1.2 }).should.equal('1.2 банана');
    });
  });
})

// vim:ts=2 sts=2 sw=2 et:
