(function($, app) {
  module("backbone-survey views");

  test("AnswerViewFactory", function() {
    var section = new app.Section();
    var sectionView = new app.SectionView({ model: section });
    var answerView;
    answerView = app.AnswerViewFactory(sectionView);
    ok(answerView instanceof app.NoneAnswerView, "Create NoneAnswerView");

    section.set("type", app.QuestionType.NONE);
    answerView = app.AnswerViewFactory(sectionView);
    ok(answerView instanceof app.NoneAnswerView, "Create NoneAnswerView");

    section.set("type", app.QuestionType.TEXT);
    answerView = app.AnswerViewFactory(sectionView);
    ok(answerView instanceof app.TextAnswerView, "Create TextAnswerView");

    section.set("type", app.QuestionType.RADIO);
    answerView = app.AnswerViewFactory(sectionView);
    ok(answerView instanceof app.RadioAnswerView, "Create RadioAnswerView");

    section.set("type", app.QuestionType.CHECKBOX);
    answerView = app.AnswerViewFactory(sectionView);
    ok(answerView instanceof app.CheckboxAnswerView, "Create CheckboxAnswerView");
  });

  test("TextAnswerView", function() {
    var ans = ["回答文<i>"];
    var section = new app.Section({
      num: 1
    , type: app.QuestionType.TEXT
    , textAnswers: ans
    });
    var view = new app.TextAnswerView({ model: section });
    view.render();
    deepEqual(view.$el.html(), '<input type="text" name="answer-1" value="回答文&lt;i&gt;">');
    deepEqual(view.textAnswers(), ans);
    deepEqual(view.optionAnswers(), []);
  });

  test("RadioAnswerView", function() {
    var opts = [
      { value: "A", label: "回答A" }
    , { value: "B", label: "回答B" }
    ];
    var ans = ["B"];
    var section = new app.Section({
      num: 2 
    , type: app.QuestionType.Radio
    , options: opts
    , optionAnswers: ans
    });
    var view = new app.RadioAnswerView({ model: section });
    view.render();
    deepEqual(view.$el.html(),
      '<ul>' +
      '<li><label><input type="radio" name="answer-2" value="A">回答A</label></li>' +
      '<li><label><input type="radio" name="answer-2" value="B" checked="checked">回答B</label></li>' +
      '</ul>'
    );
    deepEqual(view.textAnswers(), []);
    deepEqual(view.optionAnswers(), ans);
  });

  test("CheckboxAnswerView", function() {
    var opts = [
      { value: "1", label: "回答1" }
    , { value: "2", label: "回答2" }
    , { value: "3", label: "回答3" }
    ];
    var ans = ["1", "3"];
    var section = new app.Section({
      num: 3 
    , type: app.QuestionType.Checkbox
    , options: opts
    , optionAnswers: ans
    });
    var view = new app.CheckboxAnswerView({ model: section });
    view.render();
    deepEqual(view.$el.html(),
      '<ul>' +
      '<li><label><input type="checkbox" name="answer-3" value="1" checked="checked">回答1</label></li>' +
      '<li><label><input type="checkbox" name="answer-3" value="2">回答2</label></li>' +
      '<li><label><input type="checkbox" name="answer-3" value="3" checked="checked">回答3</label></li>' +
      '</ul>'
    );
    deepEqual(view.textAnswers(), []);
    deepEqual(view.optionAnswers(), ans);
  });
})(jQuery, BackboneSurvey);
