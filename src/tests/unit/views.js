(function($) {
  module("backbone-survey views");

  test("AnswerViewFactory", function() {
    var section = new BackboneSurvey.Section();
    var sectionView = new BackboneSurvey.SectionView({ model: section });
    var answerView;
    answerView = BackboneSurvey.AnswerViewFactory(sectionView);
    ok(answerView instanceof BackboneSurvey.NoneAnswerView, "Create NoneAnswerView");

    section.set("type", BackboneSurvey.QuestionType.NONE);
    answerView = BackboneSurvey.AnswerViewFactory(sectionView);
    ok(answerView instanceof BackboneSurvey.NoneAnswerView, "Create NoneAnswerView");

    section.set("type", BackboneSurvey.QuestionType.TEXT);
    answerView = BackboneSurvey.AnswerViewFactory(sectionView);
    ok(answerView instanceof BackboneSurvey.TextAnswerView, "Create TextAnswerView");

    section.set("type", BackboneSurvey.QuestionType.RADIO);
    answerView = BackboneSurvey.AnswerViewFactory(sectionView);
    ok(answerView instanceof BackboneSurvey.RadioAnswerView, "Create RadioAnswerView");

    section.set("type", BackboneSurvey.QuestionType.CHECKBOX);
    answerView = BackboneSurvey.AnswerViewFactory(sectionView);
    ok(answerView instanceof BackboneSurvey.CheckboxAnswerView, "Create CheckboxAnswerView");
  });

  test("TextAnswerView", function() {
    var ans = ["回答文<i>"];
    var section = new BackboneSurvey.Section({
      num: 1
    , type: BackboneSurvey.QuestionType.TEXT
    , textAnswers: ans
    });
    var view = new BackboneSurvey.TextAnswerView({ model: section });
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
    var section = new BackboneSurvey.Section({
      num: 2
    , type: BackboneSurvey.QuestionType.Radio
    , options: opts
    , optionAnswers: ans
    });
    var view = new BackboneSurvey.RadioAnswerView({ model: section });
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
    var section = new BackboneSurvey.Section({
      num: 3
    , type: BackboneSurvey.QuestionType.Checkbox
    , options: opts
    , optionAnswers: ans
    });
    var view = new BackboneSurvey.CheckboxAnswerView({ model: section });
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
})(jQuery);
