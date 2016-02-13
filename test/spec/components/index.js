'use strict';

var assert = require('chai').assert;
var Joi = require('joi');
var _ = require('../../../src/scripts/vendor/minified')._;
var HTML = require('../../../src/scripts/vendor/minified').HTML;
var components = require('../../../src/scripts/components');
var manipulators = require('../../../src/scripts/lib/manipulators');
var fixture = require('../../fixture');

var componentSchema = Joi.object().keys({
  name: Joi.string().required(),
  template: Joi.string().required(),
  style: Joi.string().optional(),
  manipulator: Joi.alternatives().try(
    Joi.string().valid(Object.keys(manipulators)),
    Joi.object().keys({
      get: Joi.func().required(),
      set: Joi.func().required()
    }).required().unknown(true)
  ),
  defaults: Joi.object().optional(),
  initialize: Joi.func().optional()
}).unknown(true);

describe('components', function() {
  _.eachObj(components, function(name, component) {
    describe(name, function() {
      it('has the correct structure', function() {
        Joi.assert(component, componentSchema);
      });

      it('has all the necessary defaults', function() {
        assert.doesNotThrow(function() {
          HTML(component.template.trim(), component.defaults);
        });
      });

      it('is able to be passed to ClayConfig', function() {
        fixture.clayConfig([component.name]);
      });
    });
  });
});
