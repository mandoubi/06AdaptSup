/**
* @preserve textfill
* @name jquery.textfill.js
* @author Russ Painter
* @author Yu-Jie Lin
* @author Jean Millerat
* @version 0.4.0-fork Jean Millerat
* @date 2013-10-14
* @copyright (c) 2013 Jean Millerat
* @copyright (c) 2012-2013 Yu-Jie Lin
* @copyright (c) 2009 Russ Painter
* @license Affero Gnu Public License version 3 or later version
* @homepage https://github.com/jquery-textfill/jquery-textfill
* @example http://jquery-textfill.github.io/jquery-textfill/index.html
*/
; (function($) {
  /**
* Resizes an inner element's font so that the inner element completely fills the outer element.
* @param {Object} Options which are maxFontEm (default=40), innerTag (default='span')
* @return All outer elements processed
*/
  $.fn.textfill = function(options) {
    var defaults = {
      debug: false,
      maxFontEm: 4,
      minFontEm: 0.01,
      innerTag: 'div.sizeMe',
      widthOnly: false,
      success: null, // callback when a resizing is done
      callback: null, // callback when a resizing is done (deprecated, use success)
      fail: null, // callback when a resizing is failed
      complete: null, // callback when all is done
      explicitWidth: null,
      explicitHeight: null
    };
    var Opts = $.extend(defaults, options);

    function _debug() {
      if (!Opts.debug
      || typeof console == 'undefined'
      || typeof console.debug == 'undefined') {
        return;
      }

      console.debug.apply(console, arguments);
    }

    function _warn() {
      if (typeof console == 'undefined'
      || typeof console.warn == 'undefined') {
        return;
      }

      console.warn.apply(console, arguments);
    }

    function _debug_sizing(prefix, ourText, maxHeight, maxWidth, minFontEm, maxFontEm) {
      function _m(v1, v2) {
        var marker = ' / ';
        if (v1 > v2) {
          marker = ' > ';
        } else if (v1 == v2) {
          marker = ' = ';
        }
        return marker;
      }

      _debug(
        prefix +
        'font: ' + ourText.css('font-size') +
        ', H: ' + ourText.height() + _m(ourText.height(), maxHeight) + maxHeight +
        ', W: ' + ourText.width() + _m(ourText.width() , maxWidth) + maxWidth +
        ', minFontEm: ' + minFontEm +
        ', maxFontEm: ' + maxFontEm
      );
    }

    function _sizeMe(ourText, fontSize) {
        ourText.css('font-size', fontSize+"em");
    };
    
    function _sizing(prefix, ourText, func, max, maxHeight, maxWidth, minFontEm, maxFontEm) {
      _debug_sizing(prefix + ': ', ourText, maxHeight, maxWidth, minFontEm, maxFontEm);
      var i = 0;
      while (maxFontEm - minFontEm >= 0.015 && i < 20) {
    	i = i + 1;
        var fontSize = Math.floor((minFontEm + maxFontEm) / 2 * 100)/100;
        _sizeMe(ourText, fontSize)
        if (func.call(ourText) <= max) {
          minFontEm = fontSize;
          if (func.call(ourText) == max) {
            break;
          }
        } else {
          maxFontEm = fontSize;
        }
        _debug_sizing(prefix + ': ', ourText, maxHeight, maxWidth, minFontEm, maxFontEm);
      }
      _sizeMe(ourText, maxFontEm)
      if (func.call(ourText) <= max) {
        minFontEm = maxFontEm;
        _debug_sizing(prefix + '* ', ourText, maxHeight, maxWidth, minFontEm, maxFontEm);
      }
      return minFontEm;
    }

    this.each(function() {
      var ourText = $(Opts.innerTag + ':visible:first', this);
      // Use explicit dimensions when specified
      var maxHeight = Opts.explicitHeight || $(this).height();
      var maxWidth = Opts.explicitWidth || $(this).width();
      var oldFontSize = "1em"; //ourText.css('font-size');
      var fontSize;

      _debug('Opts: ', Opts);
      _debug('Vars:' +
        ' maxHeight: ' + maxHeight +
        ', maxWidth: ' + maxWidth
      );

      var minFontEm = Opts.minFontEm;
      var maxFontEm = Opts.maxFontEm <= 0 ? maxHeight : Opts.maxFontEm;
      var HfontSize = undefined;
      if (!Opts.widthOnly) {
        HfontSize = _sizing('H', ourText, $.fn.height, maxHeight, maxHeight, maxWidth, minFontEm, maxFontEm);
      }
      var WfontSize = _sizing('W', ourText, $.fn.width, maxWidth, maxHeight, maxWidth, minFontEm, maxFontEm);

      if (Opts.widthOnly) {
        _sizeMe(ourText, WfontSize);
      } else {
        _sizeMe(ourText, Math.min(HfontSize, WfontSize));
      }
      _debug('Final: ' + ourText.css('font-size'));

      if (ourText.width() > maxWidth
      || (ourText.height() > maxHeight && !Opts.widthOnly)
      ) {
        _sizeMe(ourText, oldFontSize);
        if (Opts.fail) {
          Opts.fail(this);
        }
      } else if (Opts.success) {
        Opts.success(this);
      } else if (Opts.callback) {
        _warn('callback is deprecated, use success, instead');
        // call callback on each result
        Opts.callback(this);
      }
    });

    // call complete when all is complete
    if (Opts.complete) Opts.complete(this);

    return this;
  };
})(window.jQuery);