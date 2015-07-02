+function ($) {
  'use strict';

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
    {l: 'shh', c: 'щ'},
    {l: '\'\'', c: 'ъ'},
    {l: 'y', c: 'ы'},
    {l: '\'', c: 'ь'},
    {l: 'eh', c: 'э'},
    {l: 'ju', c: 'ю'},
    {l: 'ja', c: 'я'}
  ]

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
        .trigger('focus')
        .attr('data-ouput', '');//ready for data ouput

      $parent
        .addClass('active');

    }

    $helper.trigger('initKeyboard');

    console.log('e', e.type, e.target.nodeName, 'isActive', $parent.hasClass('active'));

    return;
  }

  Cyrillic.prototype.keydown = function (e) {
    var $this = $(this);
    var $parent  = getParent($this);
    var $helper = $parent.find(helper);
    var isActive = $parent.hasClass('active');

    e.preventDefault();
    e.stopPropagation();

    if (/27/.test(e.which)) return $this.blur();

    if (!/input|textarea/i.test(e.target.tagName)) return;

    if ($this.is('.disabled, :disabled')) return;

    if (!isActive) $this.trigger('click');

    $helper.trigger('toggleKeyboard', { relatedTarget: this });
    console.log('e.which', e.which, /13/.test(e.which) ? 'enter': '');

  }

  Cyrillic.prototype.toggleKeyboard = function(e){
    var $this = $(this);
    var isActive = getParent($this).hasClass('active');

    if (!isActive) return;

    $(this).removeClass('hide');
    console.log('do something', alphabet.length);
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
      trC.append($('<td></td>').html(item.c))
      trL.append($('<td></td>').html(item.l))
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
    .on('keydown', toggle, Cyrillic.prototype.keydown);






}(jQuery);
