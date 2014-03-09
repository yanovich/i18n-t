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
})
