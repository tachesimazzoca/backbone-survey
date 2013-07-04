var BackboneSurvey = BackboneSurvey || {};

(function($, _, Backbone) {
  $(function() {
    // ValidationMessage
    var ValidationMessage = BackboneSurvey.ValidationMessage = function(msg) {
      this.message = msg || "";
    };
    ValidationMessage.prototype = {
      valid: true
    };
    _.extend(ValidationMessage, BackboneSurvey.Extendable);
    ValidationMessage.OK = ValidationMessage.extend({ valid: true });
    ValidationMessage.Error = ValidationMessage.extend({ valid: false });

    // Validator
    var Validator = BackboneSurvey.Validator = function(attr) {
      this.attributes = attr || {};
    };
    Validator.prototype = {
      validate: function(value, data) {
        return new ValidationMessage.OK();
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
          err = new ValidationMessage.OK();
        } else {
          err = new ValidationMessage.Error(this.attributes.message);
        }
        return err;
      }
    });
  });
})(jQuery, _, Backbone);
