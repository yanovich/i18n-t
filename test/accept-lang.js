/* test/accept-lang.js -- test language selection
 * Copyright 2014 Austin King <shout@ozten.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright 2014 Sergei Ianovich
 *
 * Dual-Licensed under AGPL-3.0 or later, see LICENSE
 * for i18n package for node.js with RoR-style syntax
 */

var acceptLang = require('../lib/accept-lang');

describe('i18n best language', function () {
  it('should find exact language match', function () {
    var accept = 'pa,sv;q=0.8,fi;q=0.7,it-ch;q=0.5,en-us;q=0.3,en;q=0.2';
    var supported = ['en-US', 'af', 'pa'];

    acceptLang(accept, supported).should.be.equal('pa');
  });

  it("should find a matching locale even if region doen't match", function () {
    var accept = 'pa-it,sv;q=0.8,fi;q=0.7,it-ch;q=0.5,en-us;q=0.3,en;q=0.2';
    var supported = ['en-US', 'af', 'pa'];

    acceptLang(accept, supported).should.be.equal('pa');
  });

  it("should only match region exactly", function () {
    var accept = 'pa,sv;q=0.8,fi;q=0.7,it-ch;q=0.5,en-us;q=0.3,en;q=0.2';
    var supported = ['en-US', 'af', 'pa-IT'];

    acceptLang(accept, supported).should.be.equal('en-us');
  });

  it("should not match Finnish to Ligurian", function () {
    var accept = 'fil-PH,fil;q=0.97,en-US;q=0.94,en;q=0.91';
    var supported = ['en-US', 'fi'];

    acceptLang(accept, supported).should.be.equal('en-US');
  });

  it("should support Ligurian", function () {
    var accept = 'fil-PH,fil;q=0.97,en-US;q=0.94,en;q=0.91';
    var supported = ['en-US', 'fi', 'fil-PH'];

    acceptLang(accept, supported).should.be.equal('fil-PH');
  });

  it("should support Ligurian without a region", function () {
    var accept = 'fil-PH,fil;q=0.97,en-US;q=0.94,en;q=0.91';
    var supported = ['en-US', 'fi', 'fil'];

    acceptLang(accept, supported).should.be.equal('fil');
  });
})

// vim:ts=2 sts=2 sw=2 et:
