'use strict';

// AutoHeight Class Definition.

var AutoHeight = function(element, options) {
  this.options = options;
  this.$element = $(element);
  this.$parent = this.$element.parent();

  var self = this;
  $(window).on('resize', function() {
    self.calcHeight();
    setTimeout(function() {
      self.calcHeight();
    }, 500);
  });
  this.calcHeight();
};

AutoHeight.prototype.calcHeight = function() {
  var parent = this.$element.parent();
  var self = this;
  var offsetHeight = 0;
  parent.children().each(function() {
    var node = $(this);
    if (node[0] == self.$element[0]) return;
    offsetHeight += node.outerHeight();
  });

  // self.$element.css({
    // height: 'calc(100%-' + offsetHeight + 'px)'
  // });

  offsetHeight += parseInt(this.$element.css('padding-top'));
  offsetHeight += parseInt(this.$element.css('padding-bottom'));

  this.$element.height(parent.height() - offsetHeight);
}

AutoHeight.VERSION = '1.0.0';
AutoHeight.DEFAULTS = {
  // noop
};

function Plugin(option) {
  return this.each(function() {
    var $this = $(this);
    var data = $this.data('studio.autoheight');
    var options = $.extend({}, AutoHeight.DEFAULTS, $this.data(), typeof option == 'object' && option);

    if (!data) {
      $this.data('studio.autoheight', (data = new AutoHeight(this, options)));
    }
  });
}

var old = $.fn.autoheight;
$.fn.autoheight = Plugin;
$.fn.autoheight.Constructor = AutoHeight;

$.fn.autoheight.noConflict = function() {
  $.fn.autoheight = old;
  return this;
}

$(document).on('resize.studio.layout.data-api', '[data-autoheight="1"]', function(e) {
  console.log("Resize handle.");
});

$(window).on('load', function() {
  $('[data-autoheight="1"]').each(function() {
    var $autoheight = $(this);
    Plugin.call($autoheight, $autoheight.data());
  });
});



