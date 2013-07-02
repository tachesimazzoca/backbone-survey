(function($, app) {
  module("backbone-survey models");

  test("Question", function() {
    var ques = new app.Question({
      id: "123"
    , page: 1
    , routeDependencies: ["A", "B", "C,D"]
    });
    deepEqual(ques.id, "123");
    deepEqual(ques.get("page"), 1);
    deepEqual(ques.get("routeDependencies"), ["A", "B", "C,D"]);
  });
})(jQuery, BackboneSurvey);
