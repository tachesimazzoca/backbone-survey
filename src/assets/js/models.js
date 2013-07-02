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
      , question: ""
      , options: []
      , multiple: false
      , freeOptions: []
      , skipOptions: []
      , rules: []
      , routeDependencies: []
      }

    , questionType: function() {
        return (this.get("options").length === 0) ?
          app.QuestionType.TEXT :
          (this.get("multiple") ? app.QuestionType.CHECKBOX :
          app.QuestionType.RADIO);
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
        ps = _.sortBy(ps, function(num) { return -1 * num; });
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
        ps = _.sortBy(ps, function(num) { return num; });
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
