var BackboneSurvey = BackboneSurvey || {};

(function($, _, Backbone, app) {
  $(function() {
    // AppView
    app.AppView = Backbone.View.extend({
      el: $("#survey-app")

    , elPrefix: "survey-"

    , initialize: function() {
        this.$title = this.$("." + this.elPrefix + "title");
        this.$questions = this.$("#" + this.elPrefix + "questions");

        this.listenTo(app.survey, "change", this.render);
      }

    , render: function() {
        //console.log(["AppView#render", app.survey]);
        this.$title.html(app.survey.get("title") || "");
        this.$questions.html("");
        if (app.survey.get("page") > 0) {
          var $questions = this.$questions;
          app.survey.questions
            .each(function(question) {
              if (question.get("page") !== app.survey.get("page")) {
                return;
              }
              var v = new app.TextQuestionView({ model: question });
              $questions.append(v.render().el);
            });
        } else {
          // Hide AppView
        }
        return this;
      }
    });

    // QuestionView
    app.TextQuestionView = Backbone.View.extend({
      tagName: "div"

    , elPrefix: "survey-"

    , initialize: function() {
        switch (this.model.questionType()) {
          case app.QuestionType.TEXT:
            this.template = _.template($("#" + this.elPrefix + "textquestion-template").html());
            break;
          case app.QuestionType.RADIO:
            this.template = _.template($("#" + this.elPrefix + "radioquestion-template").html());
            break;
          case app.QuestionType.CHECKBOX:
            this.template = _.template($("#" + this.elPrefix + "checkboxquestion-template").html());
            break;
          default:
            this.template = _.template($("#" + this.elPrefix + "textquestion-template").html());
            break;
        }
      }

    , render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
      }
    });
  });
})(jQuery, _, Backbone, BackboneSurvey);
