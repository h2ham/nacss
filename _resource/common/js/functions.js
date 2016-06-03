'use strict';

var HW = {};
var hw;

HW = function() {
  this.init();
};

(function($, window, document, undefined) {

  HW.prototype = {
    /**
     * 初期設定
     */
    init: function() {
      var base = this;
      var $window = $(window);

      // スクロール位置の保時
      base.scrollTop = 0;

      // スムーススクロール実行
      base.smoothScroll('.js-goto-pagetop', {forthTop: true});

      // リサイズ時に動くイベント
      // $window.on('resize', $.throttle(250, function() {

      // }));

      // window on load イベント
      $window.on('load', function() {
        base.windowOnloadInit();
      });
    },

    /**
     * Window on load設定
     */
    windowOnloadInit: function() {
      // var base = this;
    },

    /**
     * スムーススクロール
     */
    smoothScroll: function(selector, options) {
      var c = $.extend({
        speed: 650,
        easing: 'swing',
        adjust: 0,
        forthTop: false
      }, options);
      $(selector).on('click.smoothScroll', function(e) {
        e.preventDefault();
        var elmHash = $(this).attr('href');
        var targetOffset;
        if (elmHash === '#') { return; }
        targetOffset = (c.forthTop) ? 0 : $(elmHash).offset().top - c.adjust;
        $('html,body').animate({scrollTop: targetOffset}, c.speed, c.easing);
      });
    }

  };

})(jQuery, window, document);

hw = new HW();
