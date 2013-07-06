var BackboneSurvey = BackboneSurvey || {};

(function() {
  BackboneSurvey.SurveyView = Backbone.View.extend({
    elPrefix: "survey-"

  , templates: {
      error: '<ul><% _.each(errors, function(error) { %><li><%- error %></li><% }); %></ul>'
    }

  , initialize: function() {
      this.$el.hide();

      var ev = {};
      ev["click ." + this.elPrefix + "start"] = "startPage";
      ev["click ." + this.elPrefix + "prev"] = "prevPage";
      ev["click ." + this.elPrefix + "next"] = "nextPage";
      this.delegateEvents(ev);

      this.$title = this.$("." + this.elPrefix + "title");
      this.$sections = this.$("#" + this.elPrefix + "sections");
      this.sectionView = {};

      this.listenTo(this.model, "change", this.render);
    }

  , render: function() {
      if (BackboneSurvey.logger) {
        BackboneSurvey.logger.debug(["SurveyView#render", this.model]);
      }
      this.$title.html(this.model.get("title") || "");
      this.$sections.html("");
      this.sectionViewMap = {};
      if (this.model.get("page") > 0) {
        var me = this;
        this.model.sections
          .each(function(section) {
            if (section.get("page") !== me.model.get("page")) {
              return;
            }
            var view = me.sectionViewMap[section.id] = new SectionView({
              model: section
            , className: me.elPrefix + "section"
            });
            view.render();
            view.$("." + me.elPrefix + "error").html("").hide(); // Hide error
            me.$sections.append(view.el);
          });
        if (this.model.isFirstPage()) {
          this.$("." + this.elPrefix + "prev").hide();
        } else {
          this.$("." + this.elPrefix + "prev").show();
        }
        this.$el.show();
      } else {
        this.$el.hide();
      }
      return this;
    }

  , startPage: function() {
      this.model.startPage();
    }

  , prevPage: function() {
      this.model.prevPage();
    }

  , nextPage: function() {
      var valid = true;
      for (var k in this.sectionViewMap) {
        var model = this.model.sections.get(k);
        if (!model) return;
        model.clearAnswers();
        var view = this.sectionViewMap[k];
        var $error = view.$("." + this.elPrefix + "error");
        $error.html("").hide();
        model.set({
          textAnswers: view.textAnswers()
        , optionAnswers: view.optionAnswers()
        }, { validate: true });
        // RV : Async validation support
        if (model.validationError) {
          valid = false;
          $error.html(_.template(this.templates.error)(
              { errors: model.validationError })).show();
        }
      }
      if (valid) {
        if (this.model.isLastPage()) {
          this.$el.html("");
          this.trigger("completed", this);
        } else {
          this.model.nextPage();
        }
      }
    }
  });

  // SectionView
  var SectionView = BackboneSurvey.SectionView = Backbone.View.extend({
    tagName: "div"

  , template: '<div class="<%- elPrefix %>question">' +
      '<span class="<%- elPrefix %>question-title"><%= model.question %></span></div>' +
      '<div id="<%- elPrefix %>error-<%- model.id %>" class="<%- elPrefix %>error"></div>' +
      '<div id="<%- elPrefix %>answer-<%- model.id %>" class="<%- elPrefix %>answer"></div>'

  , initialize: function() {
      this.elPrefix = this.elPrefix || "survey-";
      this.answerView = AnswerViewFactory(this);
    }

  , render: function() {
      this.$el.html(_.template(this.template)({
        elPrefix : this.elPrefix
      , model: this.model.toJSON()
      }));
      this.$("#" + this.elPrefix + "answer-" + this.model.id)
          .html(this.answerView.render().el);
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
        func = BackboneSurvey.TextAnswerView;
        break;
      case BackboneSurvey.QuestionType.RADIO:
        func = BackboneSurvey.RadioAnswerView;
        break;
      case BackboneSurvey.QuestionType.CHECKBOX:
        func = BackboneSurvey.CheckboxAnswerView;
        break;
      default:
        func = BackboneSurvey.NoneAnswerView;
        break;
    }
    return new func({
      model: sectionView.model
    , tagName: "div"
    , className: sectionView.elPrefix + "answer-item"
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
    template: '<%= label %><input type="text" name="answer-<%- id %>"' +
      '<% if (textAnswers.length !== 0) { %> value="<%- textAnswers[0] %>"<% } %>>' +
      '<%= guide %>'

  , render: function() {
      this.$el.html(_.template(this.template)(this.model.toJSON()));
      return this;
    }

  , textAnswers: function() {
      var v = this.$('[name="answer-' + this.model.id + '"]').val();
      return (_.isEmpty(v)) ? [] : [v];
    }

  , optionAnswers: function() { return []; }
  });

  // Proto
  var OptionAnswerViewProto = {
    render: function() {
      this.$el.html(_.template(this.template)(this.model.toJSON()));
      var me = this;
      var fn = function() { me.normalize($(this)); };
      this.$('input[name^="answer-"]').each(fn).on("change", fn);
      return this;
    }

  , normalize: function($changed) {
      var so = this.model.get("singleOptions");
      if ($changed.prop("checked")) {
        var v = $changed.val();
        var f = _.contains(so, v) ?
          // uncheck other options
          function() { return this.value != v; } :
          // uncheck single options
          function() { return _.contains(so, this.value); };
        this.$('input[name^="answer-"]').filter(f)
            .prop("checked", false).removeAttr("checked");
      }
    }

  , textAnswers: function() { return []; }

  , optionAnswers: function() {
      var vs = [];
      this.$('[name="answer-' + this.model.id + '"]').each(function() {
        var $this = $(this);
        if ($this.prop("checked")) vs.push($this.val());
      });
      return vs;
    }
  };

  // RadioAnswerView
  var RadioAnswerView = BackboneSurvey.RadioAnswerView = Backbone.View.extend({
    template: '<ul><% _.each(options, function(option) { %>' +
      '<li><label><input type="radio" name="answer-<%- id %>" value="<%- option.value %>"' +
      '<% if (_.contains(optionAnswers, option.value)) { %> checked="checked"<% } %>>' +
      '<%- option.label %></label></li><% }); %></ul>'
  });
  _.extend(RadioAnswerView.prototype, OptionAnswerViewProto);

  // CheckboxAnswerView
  var CheckboxAnswerView = BackboneSurvey.CheckboxAnswerView = Backbone.View.extend({
    template: '<ul><% _.each(options, function(option) { %>' +
      '<li><label><input type="checkbox" name="answer-<%- id %>" value="<%- option.value %>"' +
      '<% if (_.contains(optionAnswers, option.value)) { %> checked="checked"<% } %>>' +
      '<%- option.label %></label></li><% }); %></ul>'
  });
  _.extend(CheckboxAnswerView.prototype, OptionAnswerViewProto);
})();
