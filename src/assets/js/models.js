var BackboneSurvey = BackboneSurvey || {};

(function($, _, Backbone) {
  $(function() {
    // Section
    var Section = BackboneSurvey.Section = Backbone.Model.extend({
      constructor: function() {
        Backbone.Model.apply(this, arguments);
      }

    , defaults: {
        num: 0
      , page: 0
      , type: BackboneSurvey.QuestionType.NONE
      , question: ""
      , label: ""
      , guide: ""
      , options: [] // select options
      , textOptions: [] // option keys that need a free text answer
      , singleOptions: [] // option keys that disable the other keys
      , optionAnswers: [] // selected options
      , textAnswers: [] // free text answers
      , defaultOptionAnswers: []
      , defaultTextAnswers: []
      , rules: []
      , routeDependencies: []
      }

    , set: function(key, val, options) {
        if (key === null) return this;

        if (typeof key === 'object') {
          attrs = key;
          options = val;
        } else {
          (attrs = {})[key] = val;
        }

        // Normailze attrs.options
        if (typeof(attrs.options) !== "undefined") {
          var opts = attrs.options || [];
          attrs.options = [];
          _.each(opts, function(v) {
            if (typeof(v) !== "object") {
              v = { value: v.toString(), label: v.toString() };
            }
            attrs.options.push(v);
          });
        }

        Backbone.Model.prototype.set.call(this, attrs, options);
      }

    , validate: function(attr, options) {
        var logger = BackboneSurvey.logger;
        var errors = [];
        var answers = this.answers(attr);
        if (logger) {
          logger.debug(["validate at section #" + this.get("num") , answers]);
        }
        var me = this;
        _.each(this.attributes.rules, function(rule) {
          if (errors.length > 0) return;
          var result = rule.validate(answers, me.attributes);
          if (!result.valid) errors.push(result.message);
        });
        if (errors.length > 0 && logger) {
          logger.debug(["validationError at section #" + this.get("num") , errors]);
        }
        if (errors.length > 0) return errors;
      }

    , answers: function(attr) {
        attr = attr || this.attributes;
        var vals = [];
        switch (this.get("type")) {
          case BackboneSurvey.QuestionType.TEXT:
            vals = attr.textAnswers;
            break;
          case BackboneSurvey.QuestionType.RADIO:
          case BackboneSurvey.QuestionType.CHECKBOX:
            vals = attr.optionAnswers;
            break;
          default:
            break;
        }
        return vals;
      }

    , clearAnswers: function() {
        this.set({
          optionAnswers: []
        , textAnswers: []
        }, { silent: true });
      }
    });

    // Sections
    var Sections = BackboneSurvey.Sections = Backbone.Collection.extend({
      model: Section

    , firstPage: function() {
        return this.reduce(function(memo, model) {
          var p = model.get("page");
          return (memo === 0 || memo > p) ? p : memo;
        }, 0);
      }

    , lastPage: function() {
        return this.reduce(function(memo, model) {
          var p = model.get("page");
          return (memo === 0 || memo < p) ? p : memo;
        }, 0);
      }

    , prevPage: function(currentPage) {
        var ps = [];
        this.each(function(model) {
          var p = model.get("page");
          if (p < currentPage) {
            ps.push(p);
          }
        });
        ps = _.sortBy(ps, function(n) { return -1 * n; });
        return (ps.length > 0) ? ps[0] :
            (currentPage === 0) ? this.firstPage() : currentPage;
      }

    , nextPage: function(currentPage) {
        var ps = [];
        this.each(function(model) {
          var p = model.get("page");
          if (p > currentPage) {
            ps.push(p);
          }
        });
        ps = _.sortBy(ps, function(n) { return n; });
        var last = this.lastPage();
        return (ps.length > 0) ? ps[0] :
            (currentPage === 0 || last < currentPage) ? last : currentPage;
      }
    });

    // Survey
    var Survey = BackboneSurvey.Survey = Backbone.Model.extend({
      constructor: function() {
        this.sections = new Sections();
        Backbone.Model.apply(this, arguments);
      }

    , defaults: {
        title: ""
      , page: 0
      }

    , parse: function(resp, options) {
        this.sections.reset(resp.sections || []);
        return resp.survey;
      }

    , startPage: function() {
        this.sections.each(function(section) {
          section.clearAnswers();
          section.set({
            optionAnswers: section.get("defaultOptionAnswers")
          , textAnswers: section.get("defaultTextAnswers")
          });
        });
        var p = this.sections.firstPage();
        this.set({ page: p });
      }

    , prevPage: function() {
        var p = this.sections.prevPage(this.get("page"));
        if (p != this.get("page")) {
          this.set({ page: p });
        }
      }

    , nextPage: function() {
        var p = this.sections.nextPage(this.get("page"));
        if (p != this.get("page")) {
          this.set({ page: p });
        }
      }
    });

    // Global Survey instance
    BackboneSurvey.survey = new Survey();
  });
})(jQuery, _, Backbone);
