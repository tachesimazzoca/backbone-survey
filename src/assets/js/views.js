var BackboneSurvey = BackboneSurvey || {};

(function($, _, Backbone, app) {
  $(function() {
    // AppView
    var AppView = BackboneSurvey.AppView = Backbone.View.extend({
      el: $("#survey-app")

    , elPrefix: "survey-"

    , initialize: function() {
        var ev = {};
        ev["click ." + this.elPrefix + "prev"] = "prevPage";
        ev["click ." + this.elPrefix + "next"] = "nextPage";
        this.delegateEvents(ev);

        this.$title = this.$("." + this.elPrefix + "title");
        this.$sections = this.$("#" + this.elPrefix + "sections");
        this.sectionView = {};

        this.listenTo(BackboneSurvey.survey, "change", this.render);
      }

    , render: function() {
        if (BackboneSurvey.logger) {
          BackboneSurvey.logger.debug(["AppView#render", BackboneSurvey.survey]);
        }
        this.$title.html(BackboneSurvey.survey.get("title") || "");
        this.$sections.html("");
        this.sectionViewMap = {};
        if (BackboneSurvey.survey.get("page") > 0) {
          var me = this;
          BackboneSurvey.survey.sections
            .each(function(section) {
              if (section.get("page") !== BackboneSurvey.survey.get("page")) {
                return;
              }
              var num = section.get("num");
              var view = me.sectionViewMap[num] = new SectionView({
                model: section
              , className: me.elPrefix + "section"
              });
              me.$sections.append(view.render().el);
            });
        } else {
          // Hide AppView
        }
        return this;
      }

    , prevPage: function() {
        BackboneSurvey.survey.prevPage();
      }

    , nextPage: function() {
        for (var k in this.sectionViewMap) {
          var model = BackboneSurvey.survey.sections.findWhere({ num: parseInt(k, 10) });
          if (!model) return;
          model.clearAnswers();
          var view = this.sectionViewMap[k];
          model.set({
            textAnswers: view.textAnswers()
          , optionAnswers: view.optionAnswers()
          }, { validate: true });
        }
        BackboneSurvey.survey.nextPage();
      }
    });

    // SectionView
    var SectionView = BackboneSurvey.SectionView = Backbone.View.extend({
      tagName: "div"

    , initialize: function() {
        this.elPrefix = this.elPrefix || "survey-";
        this.sectionTemplate = _.template(Template.SectionView);
        this.answerView = AnswerViewFactory(this);
      }

    , render: function() {
        this.$el.html(this.sectionTemplate({
          elPrefix : this.elPrefix
        , model: this.model.toJSON()
        }));
        this.$el.append(this.answerView.render().el);
        return this;
      }

    , textAnswers: function() {
        return (this.answerView) ? this.answerView.textAnswers() : [];
      }

    , optionAnswers: function() {
        return (this.answerView) ? this.answerView.optionAnswers() : [];
      }
    });

    // AnswerViewFactory
    var AnswerViewFactory = BackboneSurvey.AnswerViewFactory = function(sectionView) {
      var func;
      switch (sectionView.model.get("type")) {
        case BackboneSurvey.QuestionType.TEXT:
          func = TextAnswerView;
          break;
        case BackboneSurvey.QuestionType.RADIO:
          func = RadioAnswerView;
          break;
        case BackboneSurvey.QuestionType.CHECKBOX:
          func = CheckboxAnswerView;
          break;
        default:
          func = NoneAnswerView;
          break;
      }
      return new func({
        model: sectionView.model
      , tagName: "div"
      , className: sectionView.elPrefix + "answer"
      });
    };

    // NoneAnswerView
    var NoneAnswerView = BackboneSurvey.NoneAnswerView = Backbone.View.extend({
      render: function() {
        return this;
      }

    , textAnswers: function() { return []; }

    , optionAnswers: function() { return []; }
    });

    // TextAnswerView
    var TextAnswerView = BackboneSurvey.TextAnswerView = Backbone.View.extend({
      render: function() {
        this.$el.html(_.template(Template.TextAnswerView)(this.model.toJSON()));
        return this;
      }

    , textAnswers: function() {
        var num = this.model.get("num");
        var v = this.$('[name="answer-' + num + '"]').val();
        return (_.isEmpty(v)) ? [] : [v];
      }

    , optionAnswers: function() { return []; }
    });

    // RadioAnswerView
    var RadioAnswerView = BackboneSurvey.RadioAnswerView = Backbone.View.extend({
      render: function() {
        this.$el.html(_.template(Template.RadioAnswerView)(this.model.toJSON()));
        return this;
      }

    , textAnswers: function() { return []; }

    , optionAnswers: function() {
        var vs = [];
        var num = this.model.get("num");
        this.$('[name="answer-' + num + '"]').each(function() {
          var $this = $(this);
          if ($this.prop("checked")) vs.push($this.val());
        });
        return (_.isEmpty(vs)) ? [] : [vs[0]];
      }
    });

    // CheckboxAnswerView
    var CheckboxAnswerView = BackboneSurvey.CheckboxAnswerView = Backbone.View.extend({
      render: function() {
        this.$el.html(_.template(Template.CheckboxAnswerView)(this.model.toJSON()));
        return this;
      }

    , textAnswers: function() { return []; }

    , optionAnswers: function() {
        var vs = [];
        var num = this.model.get("num");
        this.$('[name="answer-' + num + '"]').each(function() {
          var $this = $(this);
          if ($this.prop("checked")) vs.push($this.val());
        });
        return vs;
      }
    });
  });

  var Template = BackboneSurvey.Template = {
    SectionView: '<div class="<%- elPrefix %>question">' +
      '<span class="<%- elPrefix %>question-num"><%- model.num %>. </span>' +
      '<span class="<%- elPrefix %>question-title"><%= model.question %></span></div>'

  , TextAnswerView: '<%= label %><input type="text" name="answer-<%- num %>"' +
      '<% if (textAnswers.length !== 0) { %> value="<%- textAnswers[0] %>"<% } %>><%= guide %>'

  , RadioAnswerView: '<ul><% _.each(options, function(option) { %>' +
      '<li><label><input type="radio" name="answer-<%- num %>" value="<%- option.value %>"' +
      '<% if (_.contains(optionAnswers, option.value)) { %> checked="checked"<% } %>>' +
      '<%- option.label %></label></li><% }); %></ul>'

  , CheckboxAnswerView: '<ul><% _.each(options, function(option) { %>' +
      '<li><label><input type="checkbox" name="answer-<%- num %>" value="<%- option.value %>"' +
      '<% if (_.contains(optionAnswers, option.value)) { %> checked="checked"<% } %>>' +
      '<%- option.label %></label></li><% }); %></ul>'
  };
})(jQuery, _, Backbone);
