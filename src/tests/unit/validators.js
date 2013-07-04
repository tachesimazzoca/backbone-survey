(function($, _) {
  module("backbone-survey validators");

  test("ValidationMessage", function() {
    var clz = BackboneSurvey.ValidationMessage;
    var msg;
    msg = new BackboneSurvey.ValidationMessage.OK();
    deepEqual(msg.valid, true);
    ok(msg instanceof clz);

    var str = "Error";
    msg = new BackboneSurvey.ValidationMessage.Error(str);
    ok(msg instanceof clz);
    deepEqual(msg.valid, false);
    deepEqual(msg.message, str);
  });

  test("RequiredValidator", function() {
    var str = "Required";
    var validator = new BackboneSurvey.RequiredValidator({ message: str });
    ok(validator instanceof BackboneSurvey.Validator);
    _.each(["", [], {}, false, null, undefined], function(v) {
      var msg = validator.validate(v, {});
      ok(msg instanceof BackboneSurvey.ValidationMessage.Error, "Error - " + v);
      deepEqual(msg.message, str);
    });
    _.each([0, "0", "a"], function(v) {
      var msg = validator.validate(v, {});
      ok(msg instanceof BackboneSurvey.ValidationMessage.OK, "OK - " + v);
    });
  });
})(jQuery, _);
