(function (global, factory) {

  'use strict';

  if (typeof define === 'function' && define.amd) {
    // export as AMD
    define(['exports'], factory);
  } else if (typeof module !== 'undefined' && module.exports && typeof require === 'function') {
    // node/browserify
    factory(exports);
  } else {
    // browser global
    global.RactiveAutocomplete = {};
    factory(global.RactiveAutocomplete);
  }

}(typeof window !== 'undefined' ? window : this, function (exports) {

  'use strict';

  /* global Ractive */

  var index__template = "<div class=\"ractive-autocomplete\"><input value=\"{{text}}\" on-blur=\"blurred()\" on-dblclick=\"popup()\" on-keydown=\"keydown\" /><div on-click=\"clicked\">\n{{#popup}}\n<ul>{{#completions:i}}<li {{#isCurrent(i)}}class=\"current\"{{/}}>{{display(.)}}</li>{{/}}</ul>\n{{/}}</div></div>";

  var index__default = Ractive.extend({
    template: index__template,
    lazy: 500,
    oninit: function () {
      var _this = this;
      this.observe("text", function (cur, prev) {
        // only do completion lookup if this is not from a `select`
        if (cur !== _this.get("currentText")) {
          // reset current index
          _this.set("current", -1);

          // get new completions
          var fn = _this.get("complete");
          if (fn && typeof fn === "function") {
            var res = fn(cur);
            if (Object.prototype.toString.call(res) === "[object Array]") {
              _this.set("completions", res);
              _this.popup();
            } else if (res.then && typeof res.then === "function") res.then(function (arr) {
              _this.set("completions", arr);
              _this.popup();
            });
          }
        }
      }, { init: false });
    },
    onrender: function () {
      var _this2 = this;
      var cpl, val;

      this.on("clicked", function (e) {
        var i, child, ul = _this2.find("ul"), found = -1;
        for (i = 0; i < ul.children.length && (child = ul.children[i]); i++) {
          if (child === e.original.target) {
            found = i;
            break;
          }
        }
        _this2.select(found);
      });

      this.on("keydown", function (e) {
        var k = e.original.keyCode;
        if (k === 27) {
          _this2.closePopup();
        } else if (k === 38 || k === 40) {
          e.original.preventDefault();
          if (!_this2.get("popup")) return _this2.popup();
          var c = _this2.get("current");
          _this2.select(k === 38 ? c - 1 : c + 1, false);
        } else if (k === 13) {
          e.original.preventDefault();
          _this2.closePopup();
          _this2.select(_this2.get("current"));
        }
      });

      if ((cpl = this.get("completeWith")) && typeof cpl === "function") {
        this.completeWith(cpl);
      }

      // if there are no completions but there is a value, use it and select it
      if (!!(cpl = this.get("completions")) && (val = this.get("value"))) {
        this.set("completions", [val]);
        this.select(0, false);
      }
    },
    data: {
      isCurrent: function (idx) {
        return this.get("current") === idx;
      },
      display: function (member) {
        return this.display(member);
      },
      completions: [],
      current: -2,
      popup: false,
      currentText: "",
      currentVal: ""
    },
    blurred: function () {
      var _this3 = this;
      if (this.blurTime) {
        clearTimeout(this.blurTime);
      }

      this.blurTime = setTimeout(function () {
        return _this3.closePopup();
      }, 200);
    },
    closePopup: function () {
      this.set("popup", false);
    },
    popup: function () {
      this.set("popup", true);
    },
    display: function (member) {
      var name = this.get("displayMember");
      if (typeof name === "string") {
        return member ? member[name] : "";
      } else if (typeof name === "function") {
        return member ? name(member) : "";
      } else {
        return member ? member : "";
      }
    },
    select: function (idx, fin) {
      if (fin === undefined) fin = true;
      var val = this.get("completions") || [];
      var text = "";

      if (idx === -1) idx = val.length - 1;else if (idx === val.length) idx = 0;

      if (val) val = val[idx];
      text = this.display(val);

      // update current selections
      this.set({
        currentText: text,
        currentVal: val
      });

      // update input and highlight
      this.set({
        text: text,
        current: idx
      });

      if (fin) {
        this.closePopup();
        this.set("value", val);
        this.fire("complete", text, idx, val);
      }
    },
    completeWith: function (fn) {
      this.set("complete", fn);
      this.updateModel("text");
    }
  });
  //# sourceMappingURL=01-_6to5-index.js.map

  exports['default'] = index__default;

}));
//# sourceMappingURL=./ractive-autocomplete.js.map