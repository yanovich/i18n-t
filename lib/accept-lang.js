/* lib/accept-lang.js -- choose best language
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

function qualityCmp(a, b) {
  if (a.quality === b.quality)
    return 0;
  else if (a.quality < b.quality)
    return 1;
  else
    return -1;
}

function parseAcceptLanguage(header) {
  if (!header || !header.split)
    return [];
  var params = header.split(',');
  var langs = params.map(function (param) {
    var parts = param.split(';');
    var q = 1;
    if (parts.length > 1 && parts[1].indexOf('q=') !== -1) {
      var qval = parseFloat(parts[1].split('q=')[1]);
      if (isNaN(qval) === false)
        q = qval;
    }
    return { lang: parts[0].trim(), quality: q };
  });
  langs.sort(qualityCmp);
  return langs;
}

module.exports = function(header, supported_languages) {
  var s = supported_languages.map(function (l) { return l.toLowerCase(); });
  var langs = parseAcceptLanguage(header);

  for (var i = 0; i < langs.length; i++) {
    var l = langs[i];
    if (s.indexOf(l.lang.toLowerCase()) !== -1)
      return l.lang;
    else if (s.indexOf(l.lang.split('-')[0].toLowerCase()) !== -1)
      return l.lang.split('-')[0];
  }
  return s[0];
}

// vim:ts=2 sts=2 sw=2 et:
