/* lib/i18n.js -- main module
 * Copyright 2014 Sergei Ianovich
 *
 * Licensed under AGPL-3.0 or later, see LICENSE
 * i18n package for node.js with RoR-style syntax
 */

var path = require('path'),
    fs = require('fs'),
    yaml = require('js-yaml'),
    bestLang = require('./accept-lang');

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

function nestedKey(obj, keyString) {
  var keys = keyString.split('.');

  while (keys.length) {
    var key = keys.shift();
    if (key in obj)
      obj = obj[key];
    else
      return;
  }

  return obj;
}

function germanic_plural(count) {
  if (count == 1)
    return 'one';
  return 'other';
}

function slavic_plural(count) {
  if (count !== Math.floor(count))
    return 'other';
  var mod = count % 100;
  if (mod > 10 && mod < 15)
    return 'many';
  mod = count % 10;
  if (mod > 4 || mod == 0)
    return 'many';
  if (mod == 1)
    return 'one';
  return 'few';
}

function missingTranslation(key) {
  return '{{{Missing translation for "' + key + '"}}}';
}

var locale_data = {
  en: {
    plural: germanic_plural
  },
  ru: {
    plural: slavic_plural
  }
};

function I18n(options) {
  var self = this;

  this.locales = {};
  options.supported_languages.forEach(function(lang) {
    var l = localeFrom(lang),
      f = path.join(path.dirname(module.parent.filename),
        options.locales_directory, l + '.yml'),
      data = yaml.safeLoad(fs.readFileSync(f, 'utf8'));
    self.locales[l] = data[l];
  });

  this.langs = options.supported_languages;
}

I18n.prototype.request = function () {
  return new I18nRequest(this);
}

I18n.prototype.express = function () {
  var self = this;
  var i18n = new I18nRequest(this);
  var t = function (key, options) {
    return i18n.t(key, options);
  };
  var setLanguage = function (lang) {
    i18n.setLanguage(lang);
  };
  return function (req, res, next) {
    var lang = bestLang(req.headers['accept-language'], self.langs);
    i18n.setLanguage(lang);
    req.t = t;
    req.setLanguage = setLanguage;
    res.locals.t = t;
    next();
  }
}

function I18nRequest(i18n) {
  this.locales = i18n.locales;
  this.setLanguage(i18n.langs[0]);
}

I18nRequest.prototype.setLanguage = function (lang) {
  var l = localeFrom(lang);
  if (this.locale === l)
    return;
  if (!!this.locales[l])
    this.locale = l;
}

I18nRequest.prototype.t = function (key, options) {
  var str = nestedKey(this.locales[this.locale], key);
  if (typeof(str) === 'object' && options && options['count'])
    str = str[locale_data[this.locale.split('_')[0]].plural(options['count'])];
  if (typeof(str) !== 'string')
    return missingTranslation(key);
  if (!options)
    return str;
  return str.replace(/%{([^}]+)}/g, function (m, v) {
    return options[v];
  });
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
