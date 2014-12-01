'use strict';

// Layout Class Definition
//==============================

var LayoutElement = function(element, options) {

};

var Layout = function(element, options) {
  this.options  = options;
  this.$body    = $(document.body);
  this.$element = $(element);
  this.isShown  = null;
  this.elementList = [];


  // this.$element.children().each(function() {
    // var $this = $(this);
    // var data = $this.data('studio.layout');
    // var options = $.extend({}, Layout.DEFAULTS, $this.data(), typeof option == 'object' && option);

    // if (!data) {
      // $this.data('studio.layout', (data = new LayoutElement(this, options)));
    // }
  // });

  // console.log(JSON.stringify(options));

  if (!this.$element.hasClass('group'))
    this.$element.addClass('group');

  this.$element.css('position', 'relative');

  this.measure();
  this.layoutChrome();
  this.updateDisplayList(this.$element.width(), this.$element.height());

  // this.$element.parent().on("resize", this.layoutChrome);
}

Layout.VERSION = '1.0.0';
Layout.TRANSITION_DURATION = 300;
Layout.DEFAULTS = {
  horizontalGan: 6,
  horizontalAlign: "left",
  // horizontalCenter: 0,
  verticalAlign: "top",
  verticalGan: 6,
  // verticalCenter: 0,
  padding: "0,0,0,0",
  // width: 'auto',
  // height: 'auto',
  layout: "basic"
};

Layout.prototype.measure = function() {
  this.options.height = this.$element.height();
  this.options.width = this.$element.width();

};

Layout.prototype.layoutChrome = function() {
  var self = this;
  var childList = this.$element.children();
  // console.log(JSON.stringify(childList));
  if (this.options['layout'] == 'vertical') {
    var hOffset = 0;
    this.$element.children().each(function() {
      var child = $(this);
      var data = child.data();
      var options = self.options;

      var currentStyle = {
        left: 0,
        top: hOffset
      };

      if (data['width']) {
        currentStyle.width = data['width'];
      }
      if (data['height']) {
        if (typeof data.height === 'string' && data.height.endsWith('%')) {
          // currentStyle.
        } else {
          currentStyle.height = data['height'];
        }
      }

      child.css(currentStyle).addClass('layoutElement');
      hOffset += $(this).height() + (options['verticalGan'] ? parseInt(options['verticalGan']) : 0);
    });
  } else if (this.options['layout'] == 'basic') {
    console.log("Basic layout.");
  } else if (this.options['layout'] == 'horizontal') {
    console.log("Horizontal layout.")
  }

};

Layout.prototype.updateDisplayList = function(unscaledWidth, unscaleHeight) {

};

// Layout plugin definition
//==============================

function Plugin(option) {
  return this.each(function() {
    var $this = $(this);
    var data = $this.data('studio.layout');
    var options = $.extend({}, Layout.DEFAULTS, $this.data(), typeof option == 'object' && option);

    if (!data) {
      $this.data('studio.layout', (data = new Layout(this, options)));
    }
  });
}

// var old = $.fn.layout;

// $.fn.layout = Plugin;
// $.fn.layout.Constructor = Layout;

// Layout on Conflict
//==============================

// $.fn.layout.noConflict = function() {
  // $.fn.layout = old;
  // return this;
// }

// Layout Data-API
//==============================

// $(document).on('ready.studio.layout.data-api', '[data-toggle="layout"]', function(e) {
  // console.log("Parse layout ?");
// });

// $(window).on('load', function() {
  // $('[data-layout]').each(function() {
    // var $layout = $(this);
    // Plugin.call($layout, $layout.data());
  // });
// });

