/* global Ractive */

var template = `<div class="ractive-autocomplete"><input value="{{text}}" on-blur="blurred()" on-dblclick="popup()" on-keydown="keydown" /><div on-click="clicked">
{{#popup}}
<ul>{{#completions:i}}<li {{#isCurrent(i)}}class="current"{{/}}>{{display(.)}}</li>{{/}}</ul>
{{/}}</div></div>`;

export default Ractive.extend({
  template: template,
  lazy: 500,
  oninit() {
    this.observe('text', (cur, prev) => {
      // only do completion lookup if this is not from a `select`
      if (cur !== this.get('currentText')) {
        // reset current index
        this.set('current', -1);

        // get new completions
        var fn = this.get('complete');
        if (fn && typeof fn === 'function') {
          var res = fn(cur);
          if (Object.prototype.toString.call(res) === '[object Array]') {
            this.set('completions', res);
            this.popup();
          }
          else if (res.then && typeof res.then === 'function') res.then(arr => {
            this.set('completions', arr);
            this.popup();
          });
        }
      }
    }, { init: false });
  },
  onrender() {
    var cpl, val;

    this.on('clicked', (e) => {
      var i, child, ul = this.find('ul'), found = -1;
      for (i = 0; i < ul.children.length && (child = ul.children[i]); i++) {
        if (child === e.original.target) {
          found = i;
          break;
        }
      }
      this.select(found);
    });

    this.on('keydown', (e) => {
      var k = e.original.keyCode;
      if (k === 27) {
        this.closePopup();
      } else if (k === 38 || k === 40) {
        e.original.preventDefault();
        if (!this.get('popup')) return this.popup();
        var c = this.get('current');
        this.select(k === 38 ? c - 1 : c + 1, false);
      } else if (k === 13) {
        e.original.preventDefault();
        this.closePopup();
        this.select(this.get('current'));
      }
    });

    if ((cpl = this.get('completeWith')) && typeof cpl === 'function') {
      this.completeWith(cpl);
    }

    // if there are no completions but there is a value, use it and select it
    if (!!(cpl = this.get('completions')) && (val = this.get('value'))) {
      this.set('completions', [val]);
      this.select(0, false);
    }
  },
  data: {
    isCurrent(idx) { return this.get('current') === idx; },
    display(member) {
      return this.display(member);
    },
    completions: [],
    current: -2,
    popup: false,
    currentText: '',
    currentVal: ''
  },
  blurred() {
    if (this.blurTime) {
      clearTimeout(this.blurTime);
    }

    this.blurTime = setTimeout(() => this.closePopup(), 200);
  },
  closePopup() { this.set('popup', false); },
  popup() { this.set('popup', true); },
  display(member) {
    var name = this.get('displayMember');
    if (typeof name === 'string') {
      return member ? member[name] : '';
    } else if (typeof name === 'function') {
      return member ? name(member) : '';
    } else {
      return member ? member : '';
    }
  },
  select(idx, fin = true) {
    var val = this.get('completions') || [];
    var text = '';

    if (idx === -1) idx = val.length - 1;
    else if (idx === val.length) idx = 0;

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
      this.set('value', val);
      this.fire('complete', text, idx, val);
    }
  },
  completeWith(fn) {
    this.set('complete', fn);
    this.updateModel('text');
  }
});
