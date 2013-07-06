var BackboneSurvey = BackboneSurvey || {};

(function() {
  // ValidationResult
  var ValidationResult = BackboneSurvey.ValidationResult = function(msg) {
    this.message = msg || "";
  };
  ValidationResult.prototype = {
    valid: true
  };
  _.extend(ValidationResult, BackboneSurvey.Extendable);
  ValidationResult.OK = ValidationResult.extend({ valid: true });
  ValidationResult.Error = ValidationResult.extend({ valid: false });

  // Validator
  var Validator = BackboneSurvey.Validator = function(attr) {
    this.attributes = attr || {};
  };
  Validator.prototype = {
    validate: function(value, data) {
      return new ValidationResult.OK();
    }
  , message: function(attr) {
      attr = attr || {};
      return (_.isString(this.attributes.template)) ?
        _.template(this.attributes.template)(_.extend(this.attributes, attr)) :
        (this.attributes.message || "");
    }
  };
  _.extend(Validator, BackboneSurvey.Extendable);

  // RequiredValidator
  BackboneSurvey.RequiredValidator = Validator.extend({
    validate: function(value, data) {
      var vs = _.isArray(value) ? value : [value];
      var result;
      if (vs.length === 0) {
        result = new ValidationResult.Error(this.message());
      } else {
        var me = this;
        _.each(vs, function(v) {
          if (result) return;
          if (_.isNumber(v)) v = v.toString();
          if (_.isEmpty(v)) {
            result = new ValidationResult.Error(me.message());
          }
        });
        if (!result) {
            result = new ValidationResult.OK();
        }
      }
      return result;
    }
  });

  // RangeLengthValidator
  BackboneSurvey.RangeLengthValidator = Validator.extend({
    validate: function(value, data) {
      var vs = _.isArray(value) ? value : [value];
      var result;
      var me = this;
      _.each(vs, function(v) {
        if (result) return;
        if (_.isNumber(v)) v = v.toString();
        var min = _.isNumber(me.attributes.min) ? me.attributes.min : null;
        var max = _.isNumber(me.attributes.max) ? me.attributes.max : null;
        if ((min && min > v.length) || (max && max < v.length)) {
          result = new ValidationResult.Error(me.message());
        }
      });
      if (!result) {
          result = new ValidationResult.OK();
      }
      return result;
    }
  });
})();
