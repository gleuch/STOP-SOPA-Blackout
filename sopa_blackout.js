/*
  STOP SOPA
  Embeddable code for SOPA blackout solidarity

  by Greg Leuch <http://gleuch.com> / @gleuch,
  based on the blocker series by @gleuch (Shaved Bieber, Tinted Sheen, Ctrl+F'd, and more).

  MIT License - http://creativecommons.org/licenses/MIT.

  ------------------------------------------------------------------------------------
 
*/

function FATLAB_sopa_blackout_start($_) {
  $_.fn.reverse = function(){return this.pushStack(this.get().reverse(), arguments);};

  (function($_) {
    $_.sopa_blackout = function(data, c) {
      if (!$_.sopa_blackout.settings.finish) $_.sopa_blackout.init();
      $_(data).sopa_blackout(c);
      if (!$_.sopa_blackout.settings.finish) $_.sopa_blackout.finish(c);
    };

    $_.fn.sopa_blackout = function(c) {
      return this.filter(function() {
        return $_.sopa_blackout.filter(this);
      }).each(function() {
        $_.sopa_blackout.blackout(this, c);
      });
    };

    $_.extend($_.sopa_blackout, {
      settings : {hide_bg : true, href : false, page_height : 0, replace: '<ins class="sopa_blackout" style="color: %C; background-color: %C;">$1</ins>', init : false, finish : false},

      pluck : function(str) {
        return $_.map(str.split(' '), function(s) {return s.replace(/.{1}/img, '*');}).join(' ');
      },

      filter : function(self) {
        if (self.nodeType == 1) {
          var tag = self.tagName.toLowerCase();
          return !($_(self).hasClass('sopa_blackout') || $_(self).hasClass('skip_stop_sopa') || tag == 'head' || tag == 'img' || tag == 'textarea' || tag == 'option' || tag == 'style' || tag == 'script' || tag == 'code' || tag == 'samp');
        } else {
          return true;
        }
      },

      blackout : function(self, c) {
        $_(self).css({'text-shadow' : 'none'});

        if (self.nodeType == 3) {
          if (self.nodeValue.replace(/\s/ig, '')) {
            var text = $_.map(self.nodeValue.split(' '), function(s) {return $_.sopa_blackout.settings.replace.replace(/\%C/mg, c).replace(/\$1/mg, s);}).join(' '),
                sp1 = document.createElement("span");
            sp1.className = 'sopa_blackout';
            sp1.innerHTML = text;
            self.parentNode.replaceChild(sp1, self)
          }
        } else if (self.nodeType == 1) {
          if ($_(self).children().length > 0) {
            $_.sopa_blackout($_(self).contents(), c);
          } else {
            if ($_(self).html() != '') {
              text = $_.map($_(self).html().split(' '), function(s) {return $_.sopa_blackout.settings.replace.replace(/\%C/mg, c).replace(/\$1/mg, s);}).join(' '),
              $_(self).html(text);
            }
          }
        }
      },

      init : function() {
        $_.sopa_blackout.settings.init = true;
      },

      finish : function(c) {
        $_(document).each(function() {this.title = $_.sopa_blackout.pluck(this.title);});

        $_('img, input[type=image], iframe, embed, object').each(function() {
          try {
            if ($_(this).attr('alt').match($_.sopa_blackout.settings.search) || $_(this).attr('title').match($_.sopa_blackout.settings.search) || $_(this).attr('src').match($_.sopa_blackout.settings.search)) {
              var r = $_(this), w = r.width(), h = r.height(), el_c = c;
              r.addClass('sopa_blackout').css({background: el_c, width: r.width(), height: r.height()}).attr('src', ("https:" == document.location.protocol ? 'http:' : 'http:')+'//assets.gleuch.com/blank.png').width(w).height(h);
            }
          } catch(e) {}
        });
        
        // $_('input[type=text]').each(function() {if ($_(this).val().match($_.sopa_blackout.settings.search) ) $_(this).val( $_.sopa_blackout.pluck($_(this).val()) );});
        // $_('textarea, option').each(function() {if ($_(this).html().match($_.sopa_blackout.settings.search) ) $_(this).html( $_.sopa_blackout.pluck($_(this).html()) );});

        var s = document.createElement("style");
        s.innerHTML = ".sopa_blackout, .sopa_blackout:hover {display:inline-block; font-size: inherit !important; box-shadow: 0 1px 2px rgba(0,0,0,.12); text-decoration: none !important;"+ ($_.sopa_blackout.settings.hide_bg ? "background-image: none !important;" : "") +"} .bg_sopa_blackout {box-shadow: 0 1px 2px rgba(0,0,0,.12); "+ ($_.sopa_blackout.settings.hide_bg ? "background-image: none !important;" : "") +"}";
        $_('head').append(s);

        $_.sopa_blackout.settings.href = location.href;
        $_.sopa_blackout.settings.page_height = $_('body').height();

        $_.sopa_blackout.settings.finish = true;
      }
    });
  })($_);

  if (localStorage) {
    if (localStorage.disable_sopa_blackout != '1' || !FATLAB_Stop_SOPA.promote) {
      $_.sopa_blackout('body', FATLAB_Stop_SOPA.color);
    }

    if (!!FATLAB_Stop_SOPA.promote) {
      var html = '';
      if (localStorage.disable_sopa_blackout == '1') {
        html = ' \
          <div id="sopa_blackout_promote" class="skip_stop_sopa" style="position: fixed; z-index: 3000; top: 0; right: 0;"> \
           <a onmouseover="this.style.opacity=.64;" onmouseout="this.style.opacity=1.0;" style="display: inline-block; margin: 5px; padding: 8px 8px 7px 8px; font: 18px/18px normal Helvetica,Arial,sans-serif; font-weight: bold; color: #fff; background: #f0f; text-shadow: 0 1px 2px rgba(0,0,0,.18); box-shadow: 0 1px 2px rgba(0,0,0,.18); font-weight: bold; border: 1px solid #f0f; border-radius: 7px;" href="http://americancensorship.org" title="http://americancensorship.org/" target="_blank" id="sopa_blackout_action">STOP CENORSHIP!</a> \
          </div> \
        ';
        
        setInterval(function() {
          var el = $_('#sopa_blackout_promote a');
          if (el.size() > 0) {
            if (el.hasClass('sopa_ff0')) {
              el.removeClass('sopa_ff0').addClass('sopa_f0f').css({'background-color':'#f0f', 'color':'#fff', 'border-color':'#f0f'});
            } else {
              el.removeClass('sopa_f0f').addClass('sopa_ff0').css({'background-color':'#ff0', 'color':'#000', 'border-color':'#ff0'});
            }
          }
        }, 1000);
      } else {
        html = ' \
          <div id="sopa_blackout_promote" class="skip_stop_sopa" style="position: fixed !important; z-index: 3000 !important; top: 30% !important; left: 0 !important; right: 0 !important;"> \
           <div style="width: 600px !important; margin: 0 auto !important; padding: 20px 26px !important; background: #ff0 !important; border-radius: 10px !important; border: 9px solid #ff0 !important; box-shadow: 0px 3px 5px rgba(0,0,0,.24) !important;"> \
            <h1 style="text-align: center !important; font: 32px/32px bold Helvetica,Arial,sans-serif !important; color: #000 !important; margin: 0 !important; padding: 0 0 14px 0 !important; font-weight: bold !important; background: none !important; font-style: none !important;">Stop Internet Censorship!</h1> \
            <p style="text-align: center !important; font: 20px/25px normal Helvetica,Arial,sans-seri !important; color: #222 !important; margin: 0 !important; padding: 0 0 8px 0 !important; font-weight: bold !important; background: none !important; font-style: none !important;">This and many other web sites could disappear!</p> \
            <p style="text-align: left !important; font: 17px/24px normal Helvetica,Arial,sans-serif !important; color: #222 !important; margin: 0 !important; padding: 0 0 8px 0 !important; background: none !important; font-style: none !important;">Speak up and voice your concerns against SOPA (H.R.3261) and PIPA (S.968), two terrible pieces of Congressional legislation that gives broad powers for the courts to take down sites by claims from "infringed" users.</p> \
            <div style="text-align: center !important; padding: 18px 0 6px 0 !important; margin: 0 !important;"> \
             <a onmouseover="this.style.opacity=.64;" onmouseout="this.style.opacity=1.0;" style="display: inline-block !important; margin: 0 8px !important; padding: 10px 12px !important; font: 24px/24px normal Helvetica,Arial,sans-serif !important; font-weight: bold !important; text-decoration: none !important; font-style: none !important; color: #fff !important; background: #f0f !important; text-shadow: 0 1px 2px rgba(0,0,0,.18) !important; box-shadow: 0 1px 2px rgba(0,0,0,.18) !important; border: 1px solid #f0f !important; border-radius: 7px !important;" href="http://americancensorship.org/" title="http://americancensorship.org/" target="_blank" id="sopa_blackout_action">Speak Up!</a> \
             <a onmouseover="this.style.opacity=.64;" onmouseout="this.style.opacity=1.0;" style="display: inline-block !important; margin: 0 8px !important; padding: 10px 12px !important; font: 24px/24px normal Helvetica,Arial,sans-serif !important; font-weight: bold !important; text-decoration: none !important; font-style: none !important; color: #444 !important; background: #ddd !important; text-shadow: 0 1px 2px rgba(0,0,0,.18) !important; box-shadow: 0 1px 2px rgba(0,0,0,.18) !important; border: 1px solid #ddd !important; border-radius: 7px !important;" href="javascript:;" id="sopa_blackout_skip">I already have!</a> \
            </div> \
           </div> \
          </div> \
        ';
      }

      if ($_('#sopa_blackout_promote').size() <= 0) $_('body').append(html);

      $_('#sopa_blackout_action, #sopa_blackout_skip').click(function() {
        if (localStorage.disable_sopa_blackout != '1') {
          $_('#sopa_blackout_promote').remove();
          localStorage.disable_sopa_blackout = '1';
          window.location.reload();
        }
        return true;
      });
    }
  }


  if (!localStorage.disable_sopa_blackout) {
    /* Allow AJAX detection */
    setInterval(function() {
      var h = $_('body').height(), ch = $_.sopa_blackout.settings.page_height;

      if (location.href != $_.sopa_blackout.settings.href || Math.abs(ch-h) > 20 ) {
        $_.sopa_blackout.settings.href = location.href;
        $_.sopa_blackout.settings.page_height = h;
        $_.sopa_blackout.settings.init = false;
        $_.sopa_blackout.settings.finish = false;
        $_.sopa_blackout('body', FATLAB_Stop_SOPA.color);
      }
    }, 1000);
  }
};






/* STOP SOPA!! */
try {
  if (typeof(jQuery) == 'undefined') {
    document.write('<scr'+'ipt src="'+ ("https:" == document.location.protocol ? 'https:' : 'http:') +'//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></scr'+'ipt>');
  }

  if (typeof(FATLAB_Stop_SOPA) != 'object') var FATLAB_Stop_SOPA = {promote:true}
  if (typeof(FATLAB_Stop_SOPA.promote) == 'undefined') FATLAB_Stop_SOPA.promote = true;
  if (typeof(FATLAB_Stop_SOPA.color) == 'undefined') FATLAB_Stop_SOPA.color = '#000000';

  setTimeout(function() {
    try {
      jQuery.noConflict();
      if (!jQuery('body').hasClass('stop_sopa_blackout')) {
        jQuery('body').addClass('stop_sopa_blackout');
        FATLAB_sopa_blackout_start(jQuery);
      }
    } catch(err) {}
  }, (typeof(jQuery) == 'undefined' ? 1000 : 100));
} catch(err) {}