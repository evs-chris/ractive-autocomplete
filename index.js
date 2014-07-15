var DelayedInput = require('ractive-delayed-input');

var AutoComplete = DelayedInput.extend({
  init: function() {
    var me = this;
    DelayedInput.prototype.init.call(this);
    this.on('blurred', function() {
      if (!!me.blurTime) {
        clearTimeout(me.blurTime);
        me.blurTime = null;
      }
      me.blurTime = setTimeout(function() {
        me.set('popup', false);
      }, 200);
    });
    this.on('popup', function() {
      this.popup();
    });
    this.on('changed', function(v) {
      var fn = me.get('complete');
      if (!!fn && typeof fn === 'function') me.set({
        completions: fn(v),
        popup: true
      });
    });
    this.on('key', function(e) {
      var k = e.original.keyCode;
      if (k === 27) {
        me.set('popup', false);
      } else if (k === 38 || k === 40) {
        e.original.preventDefault();
        if (!me.get('popup')) {
          this.popup();
          return;
        }
        var c = this.get('currentIndex');
        this.current(k === 38 ? c - 1 : c + 1);
      } else if (k === 13) {
        e.original.preventDefault();
        me.set('popup', false);
      }
    });
    this.on('clicked', function(e) {
      if (!!me.blurTime) {
        clearTimeout(me.blurTime);
        me.blurTime = null;
      }
      e.original.preventDefault();
      var ul = e.node.querySelector('ul');
      for (var i = 0; i < ul.children.length; i++) if (ul.children[i] === e.original.target) break;
      this.current(i);
      this.set('popup', false);
      e.node.parentNode.querySelector('input').focus();
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
      var fn = this.get('complete');
      if (!!fn && typeof fn === 'function') this.set('completions', fn(this.get('value')));
    }
    this.set('popup', true);
  }
});
AutoComplete.DelayedInput = DelayedInput;

module.exports = AutoComplete;
