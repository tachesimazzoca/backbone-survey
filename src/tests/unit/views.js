(function($, app) {
  module("backbone-survey views");

  test("AppView", function() {
    var view = new app.AppView();
    app.survey.set(app.survey.parse({
      survey: {
        id: "123"
      , title: "Test Survey"
      , page: 0
      }
    , sections: [
        {
          num: 1
        , page: 1
        , question: "質問文1<strong><em>(太字イタリック)</em></strong>"
        , type: app.QuestionType.TEXT
        , label: "<strong>ラベル：</strong>"
        , guide: "<em>(案内文)</em>"
        }
      , {
          num: 2
        , page: 1
        , question: "質問文2<strong>(太字)</strong>"
        , type: app.QuestionType.RADIO
        , options: [
            { value: "1", label: "単一選択1" }
          , { value: "2", label: "単一選択2" }
          , { value: "3", label: "単一選択3" }
          ]
        }
      , {
          num: 3
        , page: 2
        , question: "質問文3<strong>(太字)</strong>"
        , type: app.QuestionType.CHECKBOX
        , options: [
            { value: "A", label: "複数選択1" }
          , { value: "B", label: "複数選択2" }
          , { value: "C", label: "複数選択3" }
          ]
        }
      ]
    }));
    app.survey.set("page", 1);

    //deepEqual($("#survey-app .survey-title").html(), "Test Survey", "survey-title");
    //deepEqual($("#survey-app #survey-question-1 > p").html(),
    //  "<strong>Q.1</strong> 質問文1<strong>(太字)</strong>",
    //  "survey-question-1 of page1"
    //);
    //deepEqual($("#survey-app #survey-question-2 > p").html(),
    //  "<strong>Q.2</strong> 質問文2<strong>(太字)</strong>",
    //  "survey-question-2 of page1"
    //);

    //app.survey.set("page", 2);
    //deepEqual($("#survey-app #survey-question-3 > p").html(),
    //  "<strong>Q.3</strong> 質問文3<strong>(太字)</strong>",
    //  "survey-question-3 of page 2"
    //);

    //app.survey.set("page", 3);
    //deepEqual($("#survey-app #survey-questions").html(), "", "page 3");
  });
})(jQuery, BackboneSurvey);
