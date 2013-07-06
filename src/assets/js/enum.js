var BackboneSurvey = BackboneSurvey || {};

(function() {
  // AnswerType
  var AnswerType = function() {};
  BackboneSurvey.AnswerType = {};
  BackboneSurvey.AnswerType.NONE = new AnswerType();
  BackboneSurvey.AnswerType.TEXT = new AnswerType();
  BackboneSurvey.AnswerType.OPTION = new AnswerType();

  // QuestionType
  var QuestionType = function(answerType, multiple) {
    this._answerType = answerType;
    this._multiple = multiple;
  };
  QuestionType.prototype = {
    answerType: function() { return this._answerType; }
  , multiple: function() { return this._multiple; }
  };
  BackboneSurvey.QuestionType = {};
  BackboneSurvey.QuestionType.NONE = new QuestionType(BackboneSurvey.AnswerType.NONE, false);
  BackboneSurvey.QuestionType.TEXT = new QuestionType(BackboneSurvey.AnswerType.TEXT, false);
  BackboneSurvey.QuestionType.RADIO = new QuestionType(BackboneSurvey.AnswerType.OPTION, false);
  BackboneSurvey.QuestionType.CHECKBOX = new QuestionType(BackboneSurvey.AnswerType.OPTION, true);
})();
