var BackboneSurvey = BackboneSurvey || {};

(function($, _, Backbone, app) {
  $(function() {
    // AppView
    app.AppView = Backbone.View.extend({
      el: $("#survey-app")

    , elPrefix: "survey-"

    , events: {
        "click .survey-prev": "prevPage"
      , "click .survey-next": "nextPage"
      }

    , initialize: function() {
        this.$title = this.$("." + this.elPrefix + "title");
        this.$sections = this.$("#" + this.elPrefix + "sections");
        this.$answerMap = {};

        this.listenTo(app.survey, "change", this.render);
      }

    , render: function() {
        //console.log(["AppView#render", app.survey]);
        this.$title.html(app.survey.get("title") || "");
        this.$sections.html("");
        this.$answerMap = {};
        if (app.survey.get("page") > 0) {
          var me = this;
          app.survey.sections
            .each(function(section) {
              if (section.get("page") !== app.survey.get("page")) {
                return;
              }
              var qv = new app.SectionView({
                model: section
              , className: me.elPrefix + "section"
              });
              var $qv = qv.render();
              var num = section.get("num");
              me.$answerMap[num] = $qv.$('[name="answer-' + num + '"]');
              me.$sections.append($qv.el);
            });
        } else {
          // Hide AppView
        }
        return this;
      }

    , prevPage: function() {
        for (var k in this.$answerMap) {
        }
        app.survey.prevPage();
      }

    , nextPage: function() {
        for (var k in this.$answerMap) {
        }
        app.survey.nextPage();
      }
    });

    // SectionView
    app.SectionView = Backbone.View.extend({
      tagName: "div"

    , initialize: function() {
        this.elPrefix = this.elPrefix || "survey-";
        this.sectionTemplate = _.template(app.Template.SectionView.section);
        var html = "";
        switch (this.model.questionType()) {
          case app.QuestionType.TEXT:
            html = app.Template.SectionView.text;
            break;
          case app.QuestionType.RADIO:
            html = app.Template.SectionView.radio;
            break;
          case app.QuestionType.CHECKBOX:
            html = app.Template.SectionView.checkbox;
            break;
          default:
            break;
        }
        this.answerTemplate = _.template(html);
      }

    , render: function() {
        this.$el.html(this.sectionTemplate(this.model.toJSON()));
        this.$el.find("." + this.elPrefix + "answer")
            .html(this.answerTemplate(this.model.toJSON()));
        return this;
      }
    });
  });

  app.Template = {
    SectionView: {
      section: '<div class="survey-question">' +
        '<span class="survey-question-num"><%- num %>. </span>' +
        '<span class="survey-question-title"><%= question %></span></div>' +
        '<div class="survey-answer"></div>'

    , text: '<%= label %><input type="text" name="answer-<%- num %>"><%= guide %>'

    , radio: '<ul><% _.each(options, function(option) { %>' +
        '<li><label><input type="radio" name="answer-<%- num %>" value="<%- option.value %>">' +
        '<%- option.label %></label></li><% }); %></ul>'

    , checkbox: '<ul><% _.each(options, function(option) { %>' +
        '<li><label><input type="checkbox" name="answer-<%- num %>" value="<%- option.value %>">' +
        '<%- option.label %></label></li><% }); %> </ul>'
    }
  };
})(jQuery, _, Backbone, BackboneSurvey);
