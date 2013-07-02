var BackboneSurvey = BackboneSurvey || {};

(function($, _, Backbone, app) {
  $(function() {
    // Question
    app.Question = Backbone.Model.extend({
      constructor: function() {
        Backbone.Model.apply(this, arguments);
      }

    , defaults: {
        num: 0
      , page: 0
      , title: ""
      , options: []
      , multiple: false
      , freeOptions: []
      , skipOptions: []
      , rules: []
      , routeDependencies: []
      }

    , questionType: function() {
        return app.QuestionType.TEXT;
      }
    });
    app.Questions = Backbone.Collection.extend({
      model: app.Question
    });

    // Survey
    var Survey = Backbone.Model.extend({
      constructor: function() {
        this.questions = new app.Questions();
        Backbone.Model.apply(this, arguments);
      }

    , defaults: {
        title: ""
      , page: 0
      , answerMap: {}
      }

    , parse: function(resp, options) {
        this.questions.reset(resp.questions || []);
        return resp.survey;
      }

    , nextPage: function() {
        var p = this.get("page");
        if (p < this.questions.length - 1) {
          this.set("page", p + 1);
        }
      }
    });
    app.survey = new Survey();
  });
})(jQuery, _, Backbone, BackboneSurvey);
