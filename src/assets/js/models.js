var BackboneSurvey = BackboneSurvey || {};

(function($, _, Backbone, app) {
  $(function() {
    // Section
    app.Section = Backbone.Model.extend({
      constructor: function() {
        Backbone.Model.apply(this, arguments);
      }

    , defaults: {
        num: 0
      , page: 0
      , type: app.QuestionType.NONE
      , question: ""
      , label: ""
      , guide: ""
      , options: [] // select options
      , textOptions: [] // option keys that need a free text answer
      , singleOptions: [] // option keys that disable the other keys
      , optionAnswers: [] // selected options
      , textAnswers: [] // free text answers
      , rules: []
      , routeDependencies: []
      }

    , clearAnswers: function() {
        this.set({
          optionAnswers: []
        , textAnswers: []
        }, { silent: true });
      }
    });

    // Sections
    app.Sections = Backbone.Collection.extend({
      model: app.Section

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
    var Survey = Backbone.Model.extend({
      constructor: function() {
        this.sections = new app.Sections();
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
    app.survey = new Survey();
  });
})(jQuery, _, Backbone, BackboneSurvey);
