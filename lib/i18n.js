/* lib/i18n.js -- main module
 * Copyright 2014 Sergei Ianovich
 *
 * language management based on 'i18n-abide'
 * Copyright 2014 Austin King <shout@ozten.com>
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * i18n package for node.js with RoR-style syntax
 */

var path = require('path'),
    fs = require('fs'),
    yaml = require('js-yaml');

function localeFrom(language) {
  if (! language || ! language.split) {
    return "";
  }
  var parts = language.split('-');
  if (parts.length === 1) {
    return parts[0].toLowerCase();
  } else if (parts.length === 2) {
    return util.format('%s_%s', parts[0].toLowerCase(), parts[1].toUpperCase());
  } else if (parts.length === 3) {
    // sr-Cyrl-RS should be sr_RS
    return util.format('%s_%s', parts[0].toLowerCase(), parts[2].toUpperCase());
  } else {
    logger.error(
        util.format("Unable to map a local from language code [%s]", language));
    return language;
  }
}

function I18n(options) {
  var that = this;

  this.locales = {};
  options.supported_languages.forEach(function(lang) {
    var l = localeFrom(lang),
      f = path.join(path.dirname(module.parent.filename),
        options.locales_directory, l + '.yml'),
      data = yaml.safeLoad(fs.readFileSync(f, 'utf8'));
    that.locales[l] = data[l];
  });

  this.setLanguage(options.supported_languages[0]);
}

I18n.prototype.setLanguage = function (lang) {
  var l = localeFrom(lang);
  if (this.locale === l)
    return;
  if (!!this.locales[l])
    this.locale = l;
}
I18n.prototype.t = function (key) {
  return this.locales[this.locale][key];
}

module.exports = function(options) {
  options = options || {};

  if (!options.locales_directory)
    options.locales_directory = 'locales';
  if (!options.supported_languages)
    options.supported_languages = ['en'];

  return new I18n(options);
}

// vim:ts=2 sts=2 sw=2 et:
