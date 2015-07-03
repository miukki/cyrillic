+function ($) {
  'use strict';

  window.alphabet  =[
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
  alphabet.map(function(el,i){el.i = i+1; return el;})
  var reverse =  Array.prototype.sort.call(alphabet.slice(), function(a,b, index){
    return b.l.length - a.l.length;
  });


  // CYRILLIC CLASS DEFINITION
  // =========================

  var toggle   = '[data-input-view="cyrillic"]';
  var helper   = '[data-view="alphabet"]';


  var Cyrillic = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }


  Cyrillic.VERSION = '3.3.5'

  function getParent($this) {
    return $this.parent()
  }


  Cyrillic.prototype.toggle = function (e) {
    var $this = $(this);
    var $parent  = getParent($this);
    var $helper = $parent.find(helper);
    var isActive = $parent.hasClass('active');


    if ($this.is('.disabled, :disabled')) return

    if (!isActive) {

      $this
        .trigger('focus');
        //.attr('data-ouput', '');//ready for data ouput

      $parent
        .addClass('active');

    }

    $helper.trigger('initKeyboard');

    return;
  }

  //how to keep coursor for the current possition
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


  Cyrillic.prototype.keyup = function (e) {
    var param = e.data;
    var $this = $(this);
    var $parent  = getParent($this);
    var $helper = $parent.find(helper);
    var isActive = $parent.hasClass('active');
    var val = $this.val();

    if (/[A-Z]/.test(String.fromCharCode(e.which)) && /91/.test(param.previousKey)) return; //catch command+[any-symbol]
    param.previousKey = e.which;

    if (/27/.test(e.which)) return $this.blur(); //esc

    if (!/input|textarea/i.test(e.target.tagName)) return;

    if ($this.is('.disabled, :disabled')) return;

    if (!isActive) $this.trigger('click');

    if (/91/.test(e.which) || /17/.test(e.which) || /16/.test(e.which) || /13/.test(e.which) || /38/.test(e.which) || /40/.test(e.which) || /37/.test(e.which) || /39/.test(e.which) || /18/.test(e.which) || e.ctrlKey) return; //commmand, ctrl, shift

    $this.val(replaceSymbols(val)[0])
    $helper.trigger('toggleKeyboard', { relatedTarget: this, table: $helper.find('table'), marker: replaceSymbols(val)[1] });
  }

  Cyrillic.prototype.toggleKeyboard = function(e, data){
    var $this = $(this);
    var isActive = getParent($this).hasClass('active');

    if (!isActive) return;

    $(this).removeClass('hide');

    var el = data.table.find(data.marker ? '[data-marker="'+data.marker+'"]' : 'td');
    el.toggleClass(data.marker ? 'success' : 'disabled');
    setTimeout(function(){el.toggleClass(data.marker ? 'success' : 'disabled');}, 500)

  }

  Cyrillic.prototype.blur = function(e) {
    var $this = $(this);
    var $parent  = getParent($this);
    var $helper = $parent.find(helper);

    $helper.addClass('hide').off('toggleKeyboard', Cyrillic.prototype.toggleKeyboard);
    $parent.removeClass('active');
  }

  Cyrillic.prototype.initKeyboard = function() {
    console.log('Cyrillic.prototype.initKeyboard')

    var $this = $(this);
    var trC = $('<tr/>')
    var trL = $('<tr/>')

    for(var i in alphabet) {
      var item = alphabet[i];
      //unicode index
      //var u = item.l.length === 1 ? item.l.toUpperCase().charCodeAt(0) : item.l.toUpperCase().charCodeAt(0) + item.l.toUpperCase().charCodeAt(1) ;
      trC.append($('<td data-marker="'+item.i+'"></td>').html(item.c));
      trL.append($('<td data-marker="'+item.i+'"></td>').html(item.l))
    }
    $this.find('table').html('').append(trC).append(trL)

  }


  // CYRILLIC PLUGIN DEFINITION
  // ==========================



  // APPLY TO EVENTS ELEMENTS
  // ===================================

  $(document)
    .on('click', toggle, Cyrillic.prototype.toggle)
    .on('blur', toggle, Cyrillic.prototype.blur)
    .on('toggleKeyboard', helper, Cyrillic.prototype.toggleKeyboard )
    .on('initKeyboard', helper, Cyrillic.prototype.initKeyboard )
    .on('keyup', toggle, {}, Cyrillic.prototype.keyup);



}(jQuery);
