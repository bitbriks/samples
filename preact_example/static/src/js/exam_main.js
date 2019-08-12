odoo.define('preact_example.exam_main', function () {
  var h = preact.h;
  var handlers = {}; // function onStateChanged(handler) {
  // 	// do push state here
  // 	handlers['state_changed'] = handler;
  // }
  // function clear() {
  // 	handlers = {};
  // }

  class ExamTemplateMain extends preact.Component {
    render(props, state) {
      // props === this.props
      // state === this.state
      return h("h1", null, "Hello World from Preact");
    }

    componentWillUnmount() {
      clear();
    }

  }

  return {
    component: h(ExamTemplateMain, null),
    render: preact.render
  };
});
