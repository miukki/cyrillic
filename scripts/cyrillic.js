+function ($) {
  'use strict';

  //setSelectionRange for ie8


  $.fn.setSelectionRange = function(start, end) {
    if(!end) end = start;
    return this.each(function() {
        if (this.setSelectionRange) {
            this.setSelectionRange(start, end);
        } else if (this.createTextRange) {
            var range = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    });
  };

  function getCaret(el) {
    if (el.selectionStart) {
      return el.selectionStart;
    } else if (document.selection) {
      el.focus();

      var r = document.selection.createRange();
      if (r == null) {
        return 0;
      }

      var re = el.createTextRange(),
          rc = re.duplicate();
      re.moveToBookmark(r.getBookmark());
      rc.setEndPoint('EndToStart', re);

      return rc.text.length;
    }
    return 0;
  }


  var alphabet = [
    {l: 'a', c: 'а'},
    {l: 'b', c: 'б'},
    {l: 'v', c: 'в'},
    {l: 'g', c: 'г'},
    {l: 'd', c: 'д'},
    {l: 'e', c: 'е'},
    {l: 'jo', c: 'ё'},
    {l: 'zh', c: 'ж'},
    {l: 'z', c: 'з'},
    {l: 'i', c: 'и'},
    {l: 'jj', c: 'й'},
    {l: 'k', c: 'к'},
    {l: 'l', c: 'л'},
    {l: 'm', c: 'м'},
    {l: 'n', c: 'н'},
    {l: 'o', c: 'о'},
    {l: 'p', c: 'п'},
    {l: 'r', c: 'р'},
    {l: 's', c: 'с'},
    {l: 't', c: 'т'},
    {l: 'u', c: 'у'},
    {l: 'f', c: 'ф'},
    {l: 'kh', c: 'х'},
    {l: 'c', c: 'ц'},
    {l: 'ch', c: 'ч'},
    {l: 'sh', c: 'ш'},
    {l: 'w', c: 'щ'},
    {l: '"', c: 'ъ'},
    {l: 'y', c: 'ы'},
    {l: '\'', c: 'ь'},
    {l: 'eh', c: 'э'},
    {l: 'q', c: 'ю'},
    {l: 'ja', c: 'я'}
  ];

  if (!Array.prototype.map && (typeof _ === 'function')) {
    alphabet = _.map(alphabet, function(el,i){el.i = i+1; return el;})
  } else {
    alphabet.map(function(el,i){el.i = i+1; return el;})
  }

  var reverse =  Array.prototype.sort.call(alphabet.slice(), function(a,b, index){
    return b.l.length - a.l.length;
  });


  // CYRILLIC CLASS DEFINITION
  // =========================

  var toggle   = '[data-input-view="cyrillic"]';
  var helper   = 'div[data-keyboard="cyrillic"]';


  var Cyrillic = function () {}

  Cyrillic.VERSION = '0.0.1'

  function getParent($this) {
    return $this.parent()
  }


  Cyrillic.prototype.toggle = function (e) {
    var $this = $(this);
    var $parent  = getParent($this);
    var $helper = $(helper);
    var isActive = $parent.hasClass('active');


    if ($this.is('.disabled, :disabled')) return

    if (!isActive) {

      $this.trigger('focus');
        //.attr('data-ouput', '');//ready for data ouput
      $parent.addClass('active');
      $helper.trigger('showKeyboard');

    }

    return;
  }

  var replaceSymbols = function(val){
    for(var i in reverse) {
      var item = reverse[i];
      var re = new RegExp(item.l); //+ '$'
      var reUp = new RegExp(item.l, 'i'); //не чувствительный к регистру
      //unicode index
      //var u = item.l.length === 1 ? item.l.toUpperCase().charCodeAt(0) : item.l.toUpperCase().charCodeAt(0) + item.l.toUpperCase().charCodeAt(1) ;

      if (re.test(val)){
        return [val.replace(re, item.c), item.i];
      } else if (reUp.test(val)) {
        return [val.replace(reUp, item.c.toUpperCase()), item.i];
      }
    }
    return [val, null]//.replace(/(h|q|w)$/,'')
  }


  Cyrillic.prototype.keyup = function (e,data) {
    var param = e.data;
    var $this = $(this);
    var $parent  = getParent($this);
    var $helper = $(helper);
    var isActive = $parent.hasClass('active');
    var val = $this.val();

    //Updating an input's value without losing cursor position
    var start = this.selectionStart || getCaret(this);

    if (/[A-Z]/.test(String.fromCharCode(e.which)) && /91/.test(param.previousKey)) {
      param.previousKey = e.which;; //catch command+[any-symbol]
      return
    }
    param.previousKey = e.which;

    if (/27/.test(e.which)) return $this.trigger('blur', Cyrillic.prototype.blur); //esc

    if (!/input|textarea/i.test(e.target.tagName)) return;

    if ($this.is('.disabled, :disabled')) return;

    if (!isActive) $this.trigger('click');

    if (/91/.test(e.which) || /17/.test(e.which) || /16/.test(e.which) || /13/.test(e.which) || /38/.test(e.which) || /40/.test(e.which) || /37/.test(e.which) || /39/.test(e.which) || /18/.test(e.which) || e.ctrlKey) return; //commmand, ctrl, shift

    $this.val(replaceSymbols(val)[0]);

    //click on virtual-keyboard, if im click on virtual-keyboard i loosing coursor (need fix it)
    if (data && data.td) {
      data.td = data.shiftKey ? data.td.toUpperCase() : data.td;
      val = val.slice(0,start) + data.td + val.substr(start)
      $this.val(val);
      start++;
    }

    //position of coursor
    $(this).setSelectionRange(start);

    //highlight keyboard
    $helper.trigger('hintKeyboard', { relatedTarget: $helper.find('table'), marker: (data && data.marker) ? data.marker : replaceSymbols(val)[1] });
  }

  Cyrillic.prototype.showKeyboard = function(e) {
    var $this = $(this);

    $this.removeClass('hide');
    $this.trigger(e = $.Event('show.keyboard', { relatedTarget: undefined }))
  }

  Cyrillic.prototype.hintKeyboard = function(e, data){

    var el = data.relatedTarget.find(data.marker ? '[data-marker="'+data.marker+'"]' : 'td');
    el.toggleClass(data.marker ? 'success' : 'disabled');
    setTimeout(function(){el.toggleClass(data.marker ? 'success' : 'disabled');}, 500)

  }

  Cyrillic.prototype.blur = function(e) {
    var $this = $(this);
    var $parent  = getParent($this);
    var $helper = $(helper);

    $helper.addClass('hide').off('showKeyboard', Cyrillic.prototype.showKeyboard).off('hintKeyboard', Cyrillic.prototype.hintKeyboard);
    $helper.trigger(e = $.Event('hide.keyboard', { relatedTarget: undefined }));
    $parent.removeClass('active');
  }

  Cyrillic.prototype.initKeyboard = function() {
    var $this = $(this);
    var $parent  = getParent($this);
    var $toggle  = $parent.find(toggle);

    var trC = $('<tr/>')
    var trL = $('<tr/>')

    for(var i in alphabet) {
      var item = alphabet[i];
      //unicode index
      //var u = item.l.length === 1 ? item.l.toUpperCase().charCodeAt(0) : item.l.toUpperCase().charCodeAt(0) + item.l.toUpperCase().charCodeAt(1) ;
      trC.append($('<td data-letter="'+item.c+'" data-marker="'+item.i+'"></td>').html(item.c));
      trL.append($('<td data-letter="'+item.c+'" data-marker="'+item.i+'"></td>').html(item.l))
    }
    $this.find('table').html('').append(trC).append(trL);
    $this.on('mousedown', 'table', function() {
      event.preventDefault();
    }).on('click', 'td', {toggle: $toggle}, Cyrillic.prototype.clickTd);

  }

  Cyrillic.prototype.clickTd = function(e,d) {
    var param = e.data;
    var $td = $(this);
    param.toggle.trigger('keyup', {shiftKey: e.shiftKey, td: $td.data('letter') || '', marker: $td.data('marker')})
  }

  // CYRILLIC PLUGIN INIT DEFINITION
  // ==========================

  $.fn.cyrillic = function (param) {

  }

  $(document)
    .on('click', toggle, Cyrillic.prototype.toggle)
    .on('blur', toggle, Cyrillic.prototype.blur)
    .on('keyup', toggle, {}, Cyrillic.prototype.keyup)
    .on('hintKeyboard', helper, Cyrillic.prototype.hintKeyboard )
    .on('initKeyboard', helper, Cyrillic.prototype.initKeyboard )
    .on('showKeyboard', helper, Cyrillic.prototype.showKeyboard )
    .ready(function(){$(this).find(helper).trigger('initKeyboard');});


}(jQuery);
