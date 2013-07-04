var BackboneSurvey = BackboneSurvey || {};

BackboneSurvey.VERSION = "0.0.0";

(function($, Backbone) {
  $(function() {
    BackboneSurvey.Extendable = {
      extend: Backbone.Model.extend // Use Backbone helper function
    };
  });
})(jQuery, Backbone);
