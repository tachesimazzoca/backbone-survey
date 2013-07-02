(function($, app) {
  module("backbone-survey enum");

  test("AnswerType is type safe enum.", function() {
    var keys = [
      "TEXT"
    , "OPTION"
    ];
    for (var i = 0; i < keys.length; i++) {
      eval("var a = app.AnswerType." + keys[i]);
      eval("var b = app.AnswerType." + keys[i]);
      ok(a === b);
      for (var j = 0; j < keys.length; j++) {
        if (i === j) { continue; }
        eval("var c = app.AnswerType." + keys[j]);
        ok(a !== c);
        ok(a != c);
      }
    }
  });

  test("QuestionType is type safe enum.", function() {
    var keys = [
      "TEXT"
    , "RADIO"
    , "CHECKBOX"
    ];
    for (var i = 0; i < keys.length; i++) {
      eval("var a = app.QuestionType." + keys[i]);
      eval("var b = app.QuestionType." + keys[i]);
      ok(a === b);
      for (var j = 0; j < keys.length; j++) {
        if (i === j) { continue; }
        eval("var c = app.QuestionType." + keys[j]);
        ok(a !== c);
        ok(a != c);
      }
    }
  });

  test("QuestionType methods", function() {
    ok(app.QuestionType.TEXT.answerType() === app.AnswerType.TEXT);
    ok(app.QuestionType.TEXT.multiple() === false);

    ok(app.QuestionType.RADIO.answerType() === app.AnswerType.OPTION);
    ok(app.QuestionType.RADIO.multiple() === false);

    ok(app.QuestionType.CHECKBOX.answerType() === app.AnswerType.OPTION);
    ok(app.QuestionType.CHECKBOX.multiple() === true);
  });
})(jQuery, BackboneSurvey);
