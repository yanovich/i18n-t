/* lib/i18n.js -- main test suite
 * Copyright 2014 Sergei Ianovich
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * i18n package for node.js with RoR-style syntax
 */

describe('i18n', function () {
  it('should translate a key with default settings', function () {
    var i18n = require('../lib/i18n')();

    i18n.t.should.be.type('function');
    i18n.t('hi').should.equal('Greetings!');
  });

  it('should accept option for locales directory', function () {
    var i18n = require('../lib/i18n')({ locales_directory: 'a/b' });

    i18n.t.should.be.type('function');
    i18n.t('hi').should.equal('Hi!');
  });

  describe('with multiple languages', function () {
    var i18n;
    before (function () {
      i18n = require('../lib/i18n')({ supported_languages: ['ru', 'en'] });
    })

    it('should accept option for supported languages', function () {
      i18n.t('hi').should.equal('Privet!');
    });

    it('should accept all supported languages', function () {
      i18n.setLanguage('en');
      i18n.t('hi').should.equal('Greetings!');
    });
  });
})

// vim:ts=2 sts=2 sw=2 et:
