
import { Modal } from 'antd-mobile'
import router from 'umi/router';

(function (doc, win) {
  var isPC = false
  if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    isPC = false
  } else {
    isPC = true
  }


  resizeFont()
  window.onresize = function () {
    resizeFont()
  };

  function resizeFont() {
    if (isPC) {
      var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
          var clientWidth = docEl.clientWidth;
          if (!clientWidth) return;
          let fs = 0
          if (clientWidth > 1200) {
            fs = 70
          } else if (clientWidth > 1920) {
            fs = 90
          } else {
            return
          }
          // if (fs < 65) return
          docEl.style.fontSize = fs + 'px';
        };
      if (!doc.addEventListener) return;
      win.addEventListener(resizeEvt, recalc, false);
      doc.addEventListener('DOMContentLoaded', recalc, false);
    }
  }
})(document, window);

export const dva = {
  config: {
    onError(err: ErrorEvent) {
      err.preventDefault();
      console.error(err.message);
    },
  },
};
