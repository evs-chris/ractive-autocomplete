var DelayedInput = require('ractive-delayed-input');

var AutoComplete = DelayedInput.extend({
  init: function() {
    var me = this;
    DelayedInput.prototype.init.call(me);
    me.on('blurred', function() {
      if (!!me.blurTime) {
        clearTimeout(me.blurTime);
        me.blurTime = null;
      }
      me.blurTime = setTimeout(function() {
        me.set('popup', false);
        me.fire('complete', me.get('value'));
      }, 200);
    });
    me.on('popup', function() {
      me.popup();
    });
    me.on('changed', function(v) {
      me.refresh(v);
    });
    me.on('key', function(e) {
      var k = e.original.keyCode;
      if (k === 27) {
        me.set('popup', false);
      } else if (k === 38 || k === 40) {
        e.original.preventDefault();
        if (!me.get('popup')) {
          me.popup();
          return;
        }
        var c = me.get('currentIndex');
        me.current(k === 38 ? c - 1 : c + 1);
      } else if (k === 13) {
        e.original.preventDefault();
        me.set('popup', false);
        var v = me.find('input').value;
        me.set('value', v);
        me.fire('complete', v);
      }
    });
    me.on('clicked', function(e) {
      if (!!me.blurTime) {
        clearTimeout(me.blurTime);
        me.blurTime = null;
      }
      e.original.preventDefault();
      var ul = e.node.querySelector('ul');
      for (var i = 0; i < ul.children.length; i++) if (ul.children[i] === e.original.target) break;
      me.current(i);
      me.set('popup', false);
      e.node.parentNode.querySelector('input').focus();
      me.fire('complete', me.get('value'));
    });

    var fn = me.get('complete');
    if (!!fn && typeof fn === 'function') me.set('completions', fn(me.get('value')));
  },
  data: {
    currentIndex: 0,
    isCurrent: function(i) { return i === this.get('currentIndex'); }
  },
  beforeInit: function(opts) {
    opts.data['on-blur'] = 'blurred';
    opts.data['on-dblclick'] = 'popup';
    DelayedInput.prototype.beforeInit.call(this, opts);
    var wrap = opts.partials.element;
    opts.partials.element = '<div class="ractive-autocomplete">' + wrap + '<div on-click="clicked">{{#.popup}}<ul>{{#.completions:i}}<li class="{{#isCurrent(i)}}current{{/}}">{{.}}</li>{{/}}</ul></div>{{/}}</div>';
  },
  current: function(i) {
    var list = this.get('completions');
    if (!!!list) return;
    if (i < 0) this.set('currentIndex', list.length - 1);
    else if (i >= list.length) this.set('currentIndex', 0);
    else this.set('currentIndex', i);
    this.set('value', list[this.get('currentIndex')]);
  },
  completeWith: function(fn) {
    this.set('complete', fn);
    this.set('completions', null);
  },
  popup: function() {
    var list = this.get('completions');
    if (!!!list) {
      this.refresh(this.get('value'));
    }
    this.set('popup', true);
  },
  refresh: function(v) {
    var me = this;
    var fn = me.get('complete');
    if (!!fn && typeof fn === 'function') {
      var res = fn(v);
      if (!!res && typeof res.then === 'function') {
        res.then(function(rs) {
          me.set({ completions: rs, popup: true });
        });
      } else {
        me.set({
          completions: res,
          popup: true
        });
      }
    }
  }
});
AutoComplete.DelayedInput = DelayedInput;

module.exports = AutoComplete;
