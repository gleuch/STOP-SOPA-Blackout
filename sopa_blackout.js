/*
  STOP SOPA
  Embeddable code for SOPA blackout solidarity

  by Greg Leuch <http://gleuch.com> / @gleuch,
  based on the blocker series by @gleuch (Shaved Bieber, Tinted Sheen, Ctrl+F'd, and more).

  MIT License - http://creativecommons.org/licenses/MIT.

  ------------------------------------------------------------------------------------
 
*/

function sopa_blackout_start($_) {
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
      settings : {hide_bg : true, href : false, page_height : 0, replace: '<ins class="sopa_blackout" style="color: %C; background-color: %C;">zz$1</ins>', init : false, finish : false},

      pluck : function(str) {
        return $_.map(str.split(' '), function(s) {return s.replace(/.{1}/img, '*');}).join(' ');
      },

      filter : function(self) {
        if (self.nodeType == 1) {
          var tag = self.tagName.toLowerCase();
          return !($_(self).hasClass('sopa_blackout') || tag == 'head' || tag == 'img' || tag == 'textarea' || tag == 'option' || tag == 'style' || tag == 'script' || tag == 'code' || tag == 'samp');
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
              r.addClass('sopa_blackout').css({background: el_c, width: r.width(), height: r.height()}).attr('src', ("https:" == document.location.protocol ? 'https:' : 'http:')+'//assets.gleuch.com/blank.png').width(w).height(h);
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

  if (typeof(stop_sopa) != 'object') var stop_sopa = {promote:'tab'}
  if (typeof(stop_sopa.promote) == 'undefined') stop_sopa.promote = 'tab';
  if (typeof(stop_sopa.color) == 'undefined') stop_sopa.color = '#000000';
  $_.sopa_blackout('body', stop_sopa.color);

  if (!!!stop_sopa.promote) {
    // lame ass motherfucker
  } else if (stop_sopa.promote == 'overlay') {
    var html = '<h1>OMGWTF</h1>';
    if ($_('#sopa_blackout_overlay').size() <= 0) $_('body').first().append(html);
  } else {
    var html = '<h1>OMGWTF</h1>';
    if ($_('#sopa_blackout_tab').size() <= 0) $_('body').first().append(html);
  }


  /* Allow AJAX detection */
  setInterval(function() {
    var h = $_('body').height(), ch = $_.sopa_blackout.settings.page_height;

    if (location.href != $_.sopa_blackout.settings.href || Math.abs(ch-h) > 20 ) {
      $_.sopa_blackout.settings.href = location.href;
      $_.sopa_blackout.settings.page_height = h;
      $_.sopa_blackout.settings.init = false;
      $_.sopa_blackout.settings.finish = false;
      $_.sopa_blackout('body', sopa_blackout_color);
    }
  }, 1000);
};






/* STOP SOPA!! */
try {
  if (typeof(jQuery) == 'undefined') {
    document.write('<scr'+'ipt src="'+ ("https:" == document.location.protocol ? 'https:' : 'http:') +'//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></scr'+'ipt>');
  }


  setTimeout(function() {
    try {
      if (!jQuery('body').hasClass('stop_sopa_blackout')) {
        jQuery('body').addClass('stop_sopa_blackout');
        sopa_blackout_start(jQuery);
      }
    } catch(err) {}
  }, (typeof(jQuery) == 'undefined' ? 1000 : 100));
} catch(err) {}