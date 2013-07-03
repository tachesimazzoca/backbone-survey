var BackboneSurvey = BackboneSurvey || {};

(function($, _, Backbone, app) {
  $(function() {
    // AppView
    app.AppView = Backbone.View.extend({
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

        this.listenTo(app.survey, "change", this.render);
      }

    , render: function() {
        if (app.logger) {
          app.logger.debug(["AppView#render", app.survey]);
        }
        this.$title.html(app.survey.get("title") || "");
        this.$sections.html("");
        this.sectionViewMap = {};
        if (app.survey.get("page") > 0) {
          var me = this;
          app.survey.sections
            .each(function(section) {
              if (section.get("page") !== app.survey.get("page")) {
                return;
              }
              var num = section.get("num");
              var view = me.sectionViewMap[num] = new app.SectionView({
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
        app.survey.prevPage();
      }

    , nextPage: function() {
        for (var k in this.sectionViewMap) {
          var model = app.survey.sections.findWhere({ num: parseInt(k, 10) });
          if (!model) return;
          model.clearAnswers();
          var view = this.sectionViewMap[k];
          model.set({
            textAnswers: view.textAnswers()
          , optionAnswers: view.optionAnswers()
          }, { silent: true });
        }
        app.survey.nextPage();
      }
    });

    // SectionView
    app.SectionView = Backbone.View.extend({
      tagName: "div"

    , initialize: function() {
        this.elPrefix = this.elPrefix || "survey-";
        this.sectionTemplate = _.template(app.Template.SectionView);
        this.answerView = app.AnswerViewFactory(this);
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
    app.AnswerViewFactory = function(sectionView) {
      var func;
      switch (sectionView.model.get("type")) {
        case app.QuestionType.TEXT:
          func = app.TextAnswerView;
          break;
        case app.QuestionType.RADIO:
          func = app.RadioAnswerView;
          break;
        case app.QuestionType.CHECKBOX:
          func = app.CheckboxAnswerView;
          break;
        default:
          func = app.NoneAnswerView;
          break;
      }
      return new func({
        model: sectionView.model
      , tagName: "div"
      , className: sectionView.elPrefix + "answer"
      });
    };

    // NoneAnswerView
    app.NoneAnswerView = Backbone.View.extend({
      render: function() {
        return this;
      }

    , textAnswers: function() { return []; }

    , optionAnswers: function() { return []; }
    });

    // TextAnswerView
    app.TextAnswerView = Backbone.View.extend({
      render: function() {
        this.$el.html(_.template(app.Template.TextAnswerView)(this.model.toJSON()));
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
    app.RadioAnswerView = Backbone.View.extend({
      render: function() {
        this.$el.html(_.template(app.Template.RadioAnswerView)(this.model.toJSON()));
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
    app.CheckboxAnswerView = Backbone.View.extend({
      render: function() {
        this.$el.html(_.template(app.Template.CheckboxAnswerView)(this.model.toJSON()));
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

  app.Template = {
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
})(jQuery, _, Backbone, BackboneSurvey);
