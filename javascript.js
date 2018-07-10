var validationModule = (function() {
  var form = null;
  var state = null;
  var valid = false;
  var masks = {
    email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    phone: /((\+7 \(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{2})(\-|\s)?(\d{2})$/,
    required: /^.{2,}$/
  };
  var sheme = null;

  function serializeToObject(query) {
    return query
      .replace(/(^\?)/, "")
      .split("&")
      .map(
        function(n) {
          return (n = n.split("=")), (this[n[0]] = n[1]), this;
        }.bind({})
      )[0];
  }

  function setNotify(element, currentSheme) {
    if (
      !$(element)
        .next()
        .hasClass("error-label")
    ) {
      $(
        '<div class="error-label">' + currentSheme.message + "</div>"
      ).insertAfter(element);
    }
  }

  function removeNotify(element, currentSheme) {
    if (
      $(element)
        .next()
        .hasClass("error-label")
    ) {
      $(element)
        .next()
        .remove();
    }
  }

  function validateElement(element) {
    var element = element;
    var name = element.name;
    var value = element.value;

    var currentSheme = sheme.find(item => item.name === name);
    var currentMask = masks[currentSheme.validate];

    if (value.match(currentMask)) {
      removeNotify(element, currentSheme);
    } else {
      setNotify(element, currentSheme);
    }
  }

  return {
    handles: function() {
      form.keyup(function(event) {
        state = serializeToObject(form.serialize());
        validateElement(event.target);
      });
    },
    init: function(selector, options) {
      form = $(selector);
      sheme = options;
      this.handles();
    }
  };
})();

validationModule.init("#form", [
  { name: "email", validate: "email", message: "Enter your email" },
  { name: "phone", validate: "phone", message: "Enter your phone" },
  { name: "name", validate: "required", message: "Enter your name" }
]);
