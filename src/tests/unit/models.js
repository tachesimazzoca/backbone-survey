(function($, app) {
  module("backbone-survey models");

  test("Section", function() {
    var model = new app.Section({
      num: 1
    , page: 1
    , routeDependencies: ["A", "B", "C,D"]
    });
    deepEqual(model.get("page"), 1);
    deepEqual(model.get("routeDependencies"), ["A", "B", "C,D"]);
  });

  test("Sections", function() {
    var sections = new app.Sections([
      { num: 1 , page: 1 }
    , { num: 2 , page: 1 }
    , { num: 3 , page: 2 }
    ]);
    deepEqual(sections.firstPage(), 1);
    deepEqual(sections.lastPage(), 2);
    deepEqual(sections.prevPage(0), 1);
    deepEqual(sections.prevPage(1), 1);
    deepEqual(sections.prevPage(2), 1);
    deepEqual(sections.prevPage(3), 2);
    deepEqual(sections.prevPage(4), 2);
    deepEqual(sections.nextPage(0), 1);
    deepEqual(sections.nextPage(1), 2);
    deepEqual(sections.nextPage(2), 2);
    deepEqual(sections.nextPage(3), 2);
  });
})(jQuery, BackboneSurvey);
