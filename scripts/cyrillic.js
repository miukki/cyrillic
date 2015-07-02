+function ($) {
  'use strict';

  // CYRILLIC CLASS DEFINITION
  // =========================

  var toggle   = '[data-input-view="cyrillic"]'

  var Cyrillic = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Cyrillic.VERSION = '3.3.5'

  function getParent($this) {
    return $this.parent()
  }


  Cyrillic.prototype.toggle = function (e) {
    var $this = $(this)
    console.log('e', e.type, e.target.nodeName, this);

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('active')


    if (!isActive) {

      $this
        .trigger('focus')
        .attr('data-ouput', '');//ready for data ouput

      $parent
        .toggleClass('active');

    }

    return false
  }

  Cyrillic.prototype.keydown = function (e) {
    var $this = $(this)
    var $parent  = getParent($this)
    var isActive = $parent.hasClass('active')

    e.preventDefault()
    e.stopPropagation()



    if (/27/.test(e.which)) {//esc
      $(this).blur();
      getParent($this).toggleClass('active');
      $parent.find('.helper').trigger('activeKeyboard', null)
      return;
    }

    if (!isActive && !/27/.test(e.which)) {
      $this.trigger('click')
      $parent.find('.helper').trigger('activeKeyboard', { relatedTarget: this })
      return;
    }

    if (/13/.test(e.which)) {//enter
      console.log('enter', enter)
    }

    if (!/input|textarea/i.test(e.target.tagName)) return

    if ($this.is('.disabled, :disabled')) return

    console.log('e.which', e.which);

  }

  Cyrillic.prototype.helper = function(e, param){
    var $this = $(this);
    var isActive = getParent($this).hasClass('active')
    $(this).toggleClass('hide');


    if (!isActive) {
      $(this).off('activeKeyboard', Cyrillic.prototype.helper)
      console.log('no active')
    } else {
      console.log('do something')
    }

  }

  // CYRILLIC PLUGIN DEFINITION
  // ==========================



  // APPLY TO EVENTS ELEMENTS
  // ===================================

  $(document)
    .on('click', toggle, Cyrillic.prototype.toggle)
    .on('activeKeyboard', '.helper', Cyrillic.prototype.helper )
    .on('keydown', toggle, Cyrillic.prototype.keydown);






}(jQuery);
