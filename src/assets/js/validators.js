var BackboneSurvey = BackboneSurvey || {};

(function($, _, Backbone) {
  $(function() {
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
        var v = value;
        if (_.isNumber(v)) v = v.toString();
        var err;
        if (!_.isEmpty(v)) {
          err = new ValidationResult.OK();
        } else {
          err = new ValidationResult.Error(this.message());
        }
        return err;
      }
    });

    // RangeLengthValidator
    BackboneSurvey.RangeLengthValidator = Validator.extend({
      validate: function(value, data) {
        var v = value;
        if (_.isNumber(v)) v = v.toString();
        var min = _.isNumber(this.attributes.min) ? this.attributes.min : null;
        var max = _.isNumber(this.attributes.max) ? this.attributes.max : null;
        var err;
        if ((min && min > v.length) || (max && max < v.length)) {
          err = new ValidationResult.Error(this.message());
        } else {
          err = new ValidationResult.OK();
        }
        return err;
      }
    });
  });
})(jQuery, _, Backbone);
