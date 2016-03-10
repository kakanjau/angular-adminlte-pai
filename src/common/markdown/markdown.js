import './markdown.css';
import marked from 'marked';

function isTopMarkdownEle(ele) {
  return ele.parents('markdown, [markdown]').length == 0
}

export default app => {
  app.directive("markdown", [function () {
    return {
      restrict: "AE",
      priority: 10000,
      // scope: {
      //   content: '=',
      //   option: '='
      // },
      link: function (scope, element, attrs) {
        attrs.option && marked.setOptions(JSON.parse(attrs.option));
        if(isTopMarkdownEle(element)){
          if (attrs.content) {
            element.html(marked((attrs.content || '').toString()));
          } else {
            element.html(marked(element.html().replace(/&gt;/g, '>')));
          }
        }
      }
    };
  }])
}
