/**
 * @file
 * Main theming script.
 */

/**
 * Misc. plugins not included via Bower.
 *
 * - jQuery bigTarget: No longer supported by plugin author.
 *   Included here with modifications to pass ESLint parameters.
 */

/**
 * jquery-bigTarget.js - enlarge an anchors clickzone
 * https://github.com/leevigraham/jquery-bigTarget
 * Written by: Leevi Graham <http://leevigraham.com>
 * Requires: jQuery v1.3.2 or later
 *
 * jquery-bigTarget.js takes an anchor and expands it's clickzone by adding an onclick action to a parent element (defined in the clickzone plugin option)  improving user accessibility.
 *
 * Plugin options:
 *
 * clickZone: 'div:eq(0)', // parent element selector. The element will be the big target clickzone
 * clickZoneClass: 'big-target-click-zone', // class added to the clickzone
 * clickZoneHoverClass: 'big-target-click-zone-hover', // class add on clickzone hover
 * anchorClass: 'big-target-anchor', // class added the the bigTarget anchor
 * anchorHoverClass: 'big-target-anchor-hover', // class added the the bigTarget anchor on hover
 * copyTitleToClickZone: true, // copy the anchors title element to the clickzone
 * openRelExternalInNewWindow: true // open rel="external" in a new window / tab
 *
 * Example Usage:
 *
 * $("#example2 .big-target-link").bigTarget({
 *     clickZone: '#example2',
 *     clickZoneClass: 'custom-big-target-click-zone',
 *     clickZoneHoverClass: 'custom-big-target-click-zone-hover',
 *     anchorHoverClass: 'custom-big-target-link-hover',
 *     copyTitleToClickZone: false,
 *     openRelExternalInNewWindow: false
 * });
 */

(function ($) {
  'use strict';
  var ver = '2.0';

  $.fn.bigTarget = function (options) {
    var settings = $.extend({}, $.fn.bigTarget.defaults, options);
    return this.each(function (index) {

      var $a = $(this);
      var href = this.href || false;
      var title = this.title || false;

      if (!href) {
        return;
      }

      var o = $.metadata ? $.extend({}, settings, $a.metadata()) : settings;

      $a
        .addClass(o['anchorClass'])
        .hover(function () {
          $a.toggleClass(o['anchorHoverClass']);
        })
        .parents(o['clickZone'])
        .each(function (index) {
          var $clickZone = $(this);
          if (title && o['copyTitleToClickZone']) {
            $clickZone.attr('title', title);
          }
          $clickZone
            .addClass(o['clickZoneClass'])
            .hover(function () {
              $clickZone.toggleClass(o['clickZoneHoverClass']);
            })
            .click(function (e) {
              if (!(e.metaKey || e.ctrlKey)) {
                if (getSelectedText() === '') {
                  if ($a.is('[rel*=external]') && o['openRelExternalInNewWindow']) {
                    window.open(href);
                  }
                  else {
                    window.location = href;
                  }
                }
              }
            });
        });
    });
  };

  function getSelectedText() {
    var t = false;
    if (window.getSelection) {
      t = window.getSelection().toString();
    }
    else if (document.getSelection) {
      t = document.getSelection();
    }
    else if (document.selection) {
      t = document.selection.createRange().text;
    }
    return t;
  }

  $.fn.bigTarget.ver = function () {
    return ver;
  };

  $.fn.bigTarget.defaults = {
    clickZone: 'div:eq(0)',
    clickZoneClass: 'big-target-click-zone',
    clickZoneHoverClass: 'big-target-click-zone-hover',
    anchorClass: 'big-target-anchor',
    anchorHoverClass: 'big-target-anchor-hover',
    copyTitleToClickZone: true,
    openRelExternalInNewWindow: true
  };

  // Fixes JS not working after hitting "Back" button ~ http://stackoverflow.com/a/2638357
  window.onunload = function () {};
})(jQuery);

/**
 * @file
 * Secondary theming script.
 */

/**
 * @file
 * Scroll animation for anchor tags to account for the nav header.
 */

(function anchorScroll($, Drupal, _, window) {
  'use strict';

  // How to use anchor scroll animation.
  // [1] Create a link element similar to:
  // <a id="my-id-tag" class="u-anim-anchor-scroll" tabindex="-1"></a>
  // [2] Visit the page url with the anchor tag:
  // http://example.com#my-id-tag

  /**
   * Expandable text tiles.
   */
  Drupal.behaviors.pinAnchorScroll = {
    attach: function (context) {
      function scrollToAnchor() {
        var $bodyInit = $('body:not(.pin-anchor-init-processed)', context);
        if ($bodyInit.length > 0) {
          $bodyInit.addClass('pin-anchor-init-processed');
          var $anchor = $(window.location.hash, $bodyInit).filter('.u-anim-anchor-scroll');
          if ($anchor.length > 0) {
            var $nav = $('.site__header > .navigation');
            if ($nav.length > 0) {
              var navHeight = $nav.outerHeight() || 0;
              if (navHeight) {
                var scrollTopOffset = $anchor.offset().top || 0;
                // Adjust for sticky nav.
                scrollTopOffset -= (2 * navHeight);

                // Buffer of 10px.
                scrollTopOffset -= 10;

                // Animate the scroll.
                if (scrollTopOffset > 0) {
                  $('html, body').animate({
                    scrollTop: scrollTopOffset
                  }, {
                    duration: 600
                  });
                  $anchor.focus();
                }
              }
            }
          }
        }
      }
      // Handle page load case.
      if (window.location.hash && window.location.hash.indexOf('=') === -1) {
        scrollToAnchor();
      }
      // Handle TOC case.
      $('a.toc-link').on('click', function (event) {
        // Don't let clicking the link write the hash to location.
        event.preventDefault();
        // Use history.pushState to write the hash to location to prevent scroll.
        if (history.pushState) {
          history.pushState(null, null, $(this).attr('href'));
        }
        else {
          window.location.hash = $(this).attr('href');
        }
        // Remove class preventing scroll.
        $('body.pin-anchor-init-processed').removeClass('pin-anchor-init-processed');
        scrollToAnchor();

      });
    }
  };

}(jQuery, Drupal, _, window));

/**
 * @file
 * animations script.
 */

(function animationsScript($, Drupal, _) {
  'use strict';

  /**
   * Copyright 2012, Digital Fusion
   * Licensed under the MIT license.
   * http://teamdf.com/jquery-plugins/license/
   *
   * @author Sam Sehnert
   * @desc A small plugin that checks whether elements are within
   *     the user visible viewport of a web browser.
   *     only accounts for vertical position, not horizontal.
   * @param {Boolean} partial - If false, triggers when entire item is visible, if true, then if top is visible.
   * @return {Boolean} If the item is in the viewport.
   */
  $.fn.visible = function (partial) {
    var $t = $(this);
    var $w = $(window);
    var viewTop = $w.scrollTop();
    var viewBottom = viewTop + $w.height();
    var _top = $t.offset().top;
    var _bottom = _top + $t.height();
    var compareTop = partial === true ? _bottom : _top;
    var compareBottom = partial === true ? _top : _bottom;

    return ((compareBottom <= viewBottom) && (compareTop >= viewTop));
  };

  /**
   * animate.css -http://daneden.me/animate
   * Version - 3.6.0
   * Licensed under the MIT license - http://opensource.org/licenses/MIT
   *
   * Copyright (c) 2018 Daniel Eden
  */
  $.fn.extend({
    animateCss: function (animationName, callback) {
      var animationEnd = (function (el) {
        var animations = {
          animation: 'animationend',
          OAnimation: 'oAnimationEnd',
          MozAnimation: 'mozAnimationEnd',
          WebkitAnimation: 'webkitAnimationEnd'
        };

        for (var t in animations) {
          if (el.style[t] !== undefined) { // eslint-disable-line no-undefined
            return animations[t];
          }
        }
      })(document.createElement('div'));

      this.addClass('animate__animated animate__' + animationName).one(animationEnd, function () {
        $(this).removeClass('animate__animated animate__' + animationName);

        if (typeof callback === 'function') {
          callback();
        }
      });

      return this;
    }
  });

  // How to use animation triggers
  // All elements with an attribute of `data-anim-trigger="view"` will get an attribute of `data-anim-triggered='yes'` added - use that to trigger CSS animations. Additionally, those elements will have the `anim-trigger` JS event fired, which will execute code in a `$('.class').on('anim-trigger', function () { animate here })`.
  // Staggered Starts are done by applying this to a wrapper: `class="u-anim-staggered-start" data-anim-trigger="view"`.
  // Any children with a class of `u-anim-staggered-start__item` will get a `data-anim-triggered='yes'` attribute applied with a time delay of `staggeredDelay` between each.

  // These are just the triggers, you can use any animation; the most popular being a Fade In and Slide Up - just add a class of `u-anim-fade-in-and-slide-up` to the element. Demoes are visible in Pattern Lab under "Base > Animations".
  Drupal.behaviors.animations = {
    attach: function (context) {
      // Milliseconds between checks for visibility on scroll
      var scrollDebounceRate = 50;
      // Milliseconds in between staggered start items starting.
      var staggeredDelay = 333;
      var $items = $('[data-anim-trigger="view"]', context);
      var $staggeredContainers = $('.u-anim-staggered-start', context);

      // Make sure we've got Underscore.
      if (typeof _ === 'undefined') {
        console.error('Not able to find Underscore.'); // eslint-disable-line no-console
      }

      /**
       * Trigger animations on this element.
       * Adds data attribute and triggers event handlers
       * @param {JQuery} $item The element
       */
      function triggerAnimation($item) {
        if ($item.attr('data-anim-triggered') !== 'yes') {
          $item.attr('data-anim-triggered', 'yes');
          $item.trigger('anim-trigger');
        }
      }

      function triggerVisibleAnimations() {
        $items.each(function () {
          var $item = $(this);
          if ($item.visible(true)) {
            triggerAnimation($item);
          }
        });
      }

      $staggeredContainers.each(function () {
        var $this = $(this);
        $this.one('anim-trigger', function () {
          $('.u-anim-staggered-start__item', $this).each(function (i) {
            var delay = staggeredDelay * i;

            setTimeout(function () {
              triggerAnimation($(this));
            }.bind(this), delay);
          });
        });
      });

      // placing function call at bottom of call stack so other function can finish up first (like `Drupal.behaviors.stats`)
      setTimeout(triggerVisibleAnimations, 0);
      $(window).scroll(_.throttle(triggerVisibleAnimations, scrollDebounceRate));
    }
  };
}(jQuery, Drupal, _));

/**
 * @file
 * Link script.
 */

(function linkScript($, Drupal, _) {
  'use strict';

  Drupal.behaviors.links = {
    attach: function targetBlankAccessible(context) {
      $('a[target="_blank"]').each(function () {
        if (!$(this).hasClass('social-links__link') && !$(this).parent().hasClass('menu__item')) {
          $(this).addClass('a-link--external');
          $(this).append('<span class="visually-hidden">(opens in a new window)</span>');
        }
      });
    }
  };
}(jQuery, Drupal, _));

/**
 * @file
 * Forms script.
 */

(function formsScript($, Drupal) {
  'use strict';

  /*
   * Add class to 'touched' required form items.
   */
  Drupal.behaviors.touchReqFormItems = {
    attach: function (context) {
      $('.required', context).one('blur keydown', function () {
        $(this).addClass('touched');
      });
    }
  };

  /*
   * User Experience Feedback Form Interactions.
   */
  Drupal.behaviors.pinFeedbackForm = {
    attach: function (context) {
      if ($('.user-experience-form', context).length) {
        var $form = $('.user-experience-form');
        var $first = $('.user-experience-form__first-step');
        var $second = $('.user-experience-form__collection-fields');

        // If a user clicks with a mouse on the faces
        $('label', $first).mouseup(function () {
          var $face = $(this);
          if ($face.attr('for').indexOf('edit-user-feedback-sad') !== -1) {
            $first.hide();
            $second.show();
          }
          else {
            // Response is Happy.
            $('.webform-button--submit', $form).trigger('click');
          }
        });

        // If user presses enter on the inputs
        $('input', $first).keydown(function (e) {
          if (e.which === 13) {
            e.preventDefault();
            var $face = $(this);
            if ($face.attr('value').indexOf('sad') !== -1) {
              $first.hide();
              $second.show();
              $('#edit-additional-response').focus();
            }
            else {
              // Response is Happy.
              $('.webform-button--submit', $form).trigger('click');
            }
          }
        });


      }
    }
  };

}(jQuery, Drupal));

/**
 * @file
 * Table script.
 */

(function formsScript($, Drupal) {
  'use strict';

  /*
   * Initialize datatables.net to facilitate sorting, filtering and search.
   */
  Drupal.behaviors.filterTables = {
    attach: function (context) {
      if ($('.table--searchable', context).length) {
        var table = $('.table--searchable');
        var placeholder = Drupal.t('Filter terms or numbers');
        table.DataTable({
          dom: 'Bfrtip',
          buttons: [
            {
              text: '<i class="icon--close" aria-label="Close" role="img"></i>',
              className: 'table__clear button--close u-bg--grey--light',
              action: function (e, dt, node, config) {
                dt.search('').draw();
                clearBtn.hide();
              }
            }
          ],
          paging: false,
          info: false,
          autoWidth: false,
          language: {
            search: '_INPUT_',
            searchPlaceholder: placeholder
          },
          mark: {
            element: 'strong'
          }
        });
        var clearBtn = $('.table__clear');
        var dataTable = table.DataTable();
        clearBtn
          .appendTo('.dataTables_filter')
          .hide();
        dataTable.on('search.dt', function () {
          clearBtn.show();
        });
      }
    }
  };

}(jQuery, Drupal));

/**
 * @file
 * Tab script.
 */

(function tabScript($, Drupal) {
  'use strict';

  Drupal.behaviors.tab = {
    attach: function tabAttach(context) {
      var $tabItems = $('.tab__item', context);
      // Handle setting the currently active link
      $tabItems
        .on('click', function (e) {
          e.preventDefault();
        })
        .hammer()
        .on('tap press', function () {
          $tabItems.attr('aria-selected', 'false');
          $(this).attr('aria-selected', 'true');
        });
    }
  };
}(jQuery, Drupal));

/**
 * @file
 * Accordion script.
 */

(function accordionScript($, Drupal, _) {
  'use strict';

  Drupal.behaviors.accordion = {
    attach: function accordionAttach(context) {
      var hash = window.location.hash;
      if (hash) {
        var entity_id = hash.substr(9);
        var element = document.querySelectorAll("[data-entity-id='" + entity_id + "']");
        if (element) {
          $(element).parents('.accordion-tab').addClass('is-open');
        }
      }

      var openAccordion = $('.accordion.accordion--open');
      openAccordion.children().first('.accordion-tab').addClass('is-open');
      openAccordion.find('.accordion-tab__title').first().attr('aria-expanded', 'true');
      openAccordion.find('.accordion-tab__content').first().attr('aria-hidden', 'false');


      $('.accordion-tab > .accordion-tab__title ').click(function () {
        var $this = $(this);
        $('.is-open > .accordion-tab__title').attr('aria-expanded', 'false');
        $('.is-open > .accordion-tab__content').attr('aria-hidden', 'true');
        $this.parent().siblings().removeClass('is-open');
        if ($this.parent().hasClass('is-open')) {
          $this.parent().removeClass('is-open');
          $this.attr('aria-expanded', 'false');
          $this.siblings('.accordion-tab__content').attr('aria-hidden', 'true');
        }
        else {
          $this.parent().addClass('is-open');
          $this.attr('aria-expanded', 'true');
          $this.siblings('.accordion-tab__content').attr('aria-hidden', 'false');
        }
        return false;
      });
    }
  };
}(jQuery, Drupal, _));

/**
 * @file
 * Carousel script.
 */

(function carouselScript($, Drupal, _) {
  'use strict';

  function setItemWidth($carousel) {
    let $carouselList = $carousel.find('.js-carousel-list');
    let $carouselItem = $carousel.find('.js-carousel-item');
    let curWidth = 0;

    $carouselList.removeAttr('style');
    $carouselItem.each(function () {
      curWidth += $(this).outerWidth(true);
    });
    return curWidth;
  }

  function slide($carousel, target) {
    let $carouselContainer = $carousel.find('#carouselContainer');
    let $carouselList = $carousel.find('#carouselList');
    let dir =
      $(target)
        .parent()
        .data('dir') || target;
    let curPos = parseInt($carouselList.css('left')) || 0;
    let moveTo = 0;
    let containerWidth = $carouselContainer.outerWidth();
    let listWidth = $carouselList.outerWidth();
    let before = curPos + containerWidth;
    let after = listWidth + (curPos - containerWidth);

    if (dir === 'next') {
      moveTo =
        after < containerWidth ? curPos - after : curPos - containerWidth;
    }
    else {
      moveTo = before >= 0 ? 0 : curPos + containerWidth;
    }
    return moveTo;
  }

  function magicLine($carousel, context) {
    let $carouselItem = $carousel.find('.js-carousel-item');
    let $magicLine = $('.magic-line', context);

    $magicLine
      .width($('[aria-selected="true"]', context).width())
      .css('left', $('[aria-selected="true"]', context).position().left)
      .data('origLeft', $magicLine.position().left)
      .data('origWidth', $magicLine.width());

    $carouselItem.click(function () {
      let $el = $(this).find(':first-child');
      let leftPos = $el.position().left;
      let newWidth = $el.width();
      $magicLine.stop().animate({
        left: leftPos,
        width: newWidth
      });
    });
  }

  function determineOverflow(content, container) {
    let containerMetrics = container.getBoundingClientRect();
    let containerMetricsRight = Math.floor(containerMetrics.right);
    let containerMetricsLeft = Math.floor(containerMetrics.left);
    let contentMetrics = content.getBoundingClientRect();
    let contentMetricsRight = Math.floor(contentMetrics.right);
    let contentMetricsLeft = Math.floor(contentMetrics.left);

    if (
      containerMetricsLeft > contentMetricsLeft &&
      containerMetricsRight < contentMetricsRight
    ) {
      return 'both';
    }
    else if (contentMetricsLeft < containerMetricsLeft) {
      return 'left';
    }
    else if (contentMetricsRight > containerMetricsRight) {
      return 'right';
    }
    else {
      return 'none';
    }
  }

  // Determine if an element is in the visible viewport.
  function isInViewport(el) {
    let rect = el.getBoundingClientRect();
    let html = document.documentElement;
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || html.clientHeight) &&
      rect.right <= (window.innerWidth || html.clientWidth)
    );
  }

  function toggleArrowClasses($carousel, state) {
    $carousel
      .removeClass(
        'js-carousel__overflow--both js-carousel__overflow--left js-carousel__overflow--right js-carousel__overflow--none'
      )
      .addClass('js-carousel__overflow--' + state);
  }

  Drupal.behaviors.carousel = {
    attach: function carouselAttach(context) {
      let $carouselRoot = $('.js-carousel', context);
      let $nav = $('.site__header > .navigation', context);
      let isWalkthrough = $('.walkthrough-content', context).length;

      // Bounce if no carousel on page
      if (!$carouselRoot.length) {
        return;
      }

      $carouselRoot.each(function () {
        let $carousel = $(this);
        let $carouselList = $carousel.find('#carouselList');
        let $carouselContainer = $('#carouselContainer', context);
        let $carouselButton = $carousel.find('.js-carousel-button');
        // For calculations.
        let carouselList = document.getElementById('carouselList');
        let carouselContainer = document.getElementById('carouselContainer');

        let tabString = '';
        $('[id^="chapter-"]', context).each(function (i) {
          let $self = $(this);
          let headingText = $self.text();
          let headingId = $self.attr('id');
          let splitArr = headingId.split('-');
          let isSelected = i === 0;
          if (isWalkthrough) {
            tabString +=
              '<div class="carousel__item js-carousel-item"><a href="#' +
              headingId +
              '" class="tab__item" id="tab-' +
              splitArr[1] +
              '" aria-selected="' +
              isSelected +
              '"><div class="chapter-tab-index">' +
              (i + 1) +
              '</div><div class="chapter-tab-title">' +
              $.trim(headingText) +
              '</div></a></div>';
          }
          else {
            tabString +=
              '<div class="carousel__item js-carousel-item"><a href="#' +
              headingId +
              '" class="tab__item" id="tab-' +
              splitArr[1] +
              '" aria-selected="' +
              isSelected +
              '">' +
              headingText +
              '</a></div>';
          }
        });

        let $tabString = $(tabString);
        $carouselList.append($tabString);

        let $tabs = $('[id^="tab-"]', $tabString);
        $tabs.hammer().on('click tap press', function (e) {
          e.preventDefault();

          $tabs.attr('aria-selected', 'false').removeClass('tab__item--active');
          $(this).attr('aria-selected', 'true');

          let anchorId = $(this).attr('href');
          let $anchor = $(anchorId, context);
          if ($nav.length > 0) {
            let navHeight = $nav.outerHeight() || 0;
            if (navHeight) {
              let anchorOffset = $anchor.offset().top - $anchor.outerHeight();
              let scrollTopOffset = anchorOffset || 0;
              // Adjust for sticky nav.
              scrollTopOffset -= 3 * navHeight;
              // Buffer of 10px.
              scrollTopOffset -= 10;
              // Animate the scroll.
              if (scrollTopOffset > 0 && !isWalkthrough) {
                $('html, body', context).animate(
                  {
                    scrollTop: scrollTopOffset
                  },
                  {
                    duration: 600
                  }
                );
              }
              $anchor.focus();
            }
          }
        });

        let overflowState = 'right';
        toggleArrowClasses($carousel, overflowState);
        $carouselList.css('width', setItemWidth($carousel));
        magicLine($carousel, context);

        // Resize.
        $(window).on(
          'resize',
          _.throttle(function windowResize() {
            let overflowState = determineOverflow(
              carouselList,
              carouselContainer
            );
            toggleArrowClasses($carousel, overflowState);
            $carouselList.css('width', setItemWidth($carousel));
            magicLine($carousel, context);
          }, 400)
        );

        // Button click/tap/press.
        $carouselButton.hammer().on('click tap press', function (e) {
          let moveTo = slide($carousel, e.target);
          $carouselList.stop().animate(
            {
              left: moveTo
            },
            {
              complete: function () {
                let overflowState = determineOverflow(
                  carouselList,
                  carouselContainer
                );
                toggleArrowClasses($carousel, overflowState);
              }
            }
          );
        });

        const $tabItem = $('.tab__item', context);

        // Keyboard tab key.
        $tabItem.hammer().on('focus', function (e) {
          let inViewport = isInViewport(e.target);
          let moveTo = $(this).position().left;
          if (!inViewport) {
            $carouselList.stop().animate(
              {
                left: -moveTo
              }
            );
          }
          if (moveTo === 0) {
            toggleArrowClasses($carousel, 'right');
          }
          else if (moveTo >= $carouselContainer.width()) {
            toggleArrowClasses($carousel, 'left');
          }
          else {
            toggleArrowClasses($carousel, 'both');
          }
        });

        // Swipe events.
        $carouselList.hammer().on('swipeleft', function () {
          let moveTo = slide($carousel, 'next');
          $carouselList.stop().animate(
            {
              left: moveTo
            },
            {
              complete: function () {
                let overflowState = determineOverflow(
                  carouselList,
                  carouselContainer
                );
                toggleArrowClasses($carousel, overflowState);
              }
            }
          );
        });
        $carouselList.hammer().on('swiperight', function () {
          let moveTo = slide($carousel, 'prev');
          $carouselList.stop().animate(
            {
              left: moveTo
            },
            {
              complete: function () {
                let overflowState = determineOverflow(
                  carouselList,
                  carouselContainer
                );
                toggleArrowClasses($carousel, overflowState);
              }
            }
          );
        });
      });

      let windowPosition = 0;
      let carouselCSS = {};
      let carouselTop = $carouselRoot.position().top;
      let carouselHeight = $carouselRoot.outerHeight();
      let carouselTogglePosition = carouselTop - carouselHeight;
      // Variables used for scrollspy.
      let lastId = '';
      // All list items
      let menuItems = $('#carouselList', context).find('a');
      // Anchors corresponding to menu items
      let scrollItems = menuItems.map(function () {
        let item = $($(this).attr('href'));
        if (item.length) {
          return item;
        }
      });

      $(window).on(
        'scroll',
        _.debounce(function debounceCarouselPositionSet() {
          windowPosition = $(this).scrollTop();

          if ($(this).width() < 768) {
            // More top margin to account for the topic navigator.
            if (windowPosition >= carouselTogglePosition) {
              carouselCSS = {
                position: 'fixed',
                top: '106px'
              };
            }
            else if (windowPosition < carouselTogglePosition) {
              carouselCSS = {
                position: 'relative',
                top: 'initial'
              };
            }
          }
          else {
            if (windowPosition >= carouselTogglePosition) {
              carouselCSS = {
                position: 'fixed',
                top: '53px'
              };
            }
            else if (windowPosition < carouselTogglePosition) {
              carouselCSS = {
                position: 'relative',
                top: 'initial'
              };
            }
          }

          $carouselRoot.css(carouselCSS);
          // Scrollspy.
          // Get container scroll position
          let fromTop =
            $(this).scrollTop() + carouselHeight + 3 * $nav.outerHeight();
          // Get id of current scroll item
          let current = scrollItems.map(function () {
            if ($(this).offset().top < fromTop) {
              return this;
            }
          });

          if (current.length) {
            // Get the id of the current element
            current = current[current.length - 1];
            let id = $(current).attr('id');
            if (lastId !== id && !isWalkthrough) {
              lastId = id;
              // Set/remove active class
              $(menuItems).attr('aria-selected', 'false');
              $('[href="#' + id + '"]', context).attr('aria-selected', 'true');
            }
          }
        }, 0)
      );
    }
  };
})(jQuery, Drupal, _);

/**
 * CTA script
 */

(function carouselScript($, Drupal) {
  'use strict';

  Drupal.behaviors.cta = {
    attach: function ctaAttach($context) {
      // Track click on button within CTA
      $('.cta', $context).on('click', '.button', function ctaClick(e) {
        if (drupalSettings.pin_analytics && drupalSettings.pin_analytics.cta && window.ga && window.ga.loaded) {
          // Do not navigate immediately
          e.preventDefault();
          var dataLayer = window.dataLayer = window.dataLayer || [];
          // Title within CTA block
          let eventLabel = ($('.cta__title').data('source-title')) ? $('.cta__title').data('source-title').trim() : $(e.delegateTarget).text().trim();
          // Instead fire event to GA
          window.ga('send', {
            hitType: 'event',
            eventCategory: 'CTA',
            eventAction: 'click',
            eventLabel: eventLabel,
            // Navigate after successful GA track
            hitCallback: function ctaClickGACallback() {
              window.location.assign(e.target.href);
            }
          });
          dataLayer.push({'event':'click', 'eventCategory': 'CTA', 'eventLabel': eventLabel});
        }
      });
    }
  };
}(jQuery, Drupal));

/**
 * @file
 * Device switcher script.
 */

(function deviceSwitcherScript($, Drupal) {
  'use strict';

  function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      return 'android';
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 'apple';
    }
    return 'web';
  }

  Drupal.behaviors.deviceSwitcher = {
    attach: function deviceSwitcherAttach(context) {
      var deviceType = getMobileOperatingSystem();

      $('[data-device="' + deviceType + '"]', context).addClass('device-switcher__toggle--active').attr('aria-selected', 'true');
      $('.device-filter__content', context).hide();
      $('[data-content="' + deviceType + '"]', context).fadeIn().attr('aria-hidden', 'false');

      $('.device-switcher__toggle', context)
        .hammer()
        .on('tap press click', function (e) {
          e.preventDefault();
          var $this = $(this);

          if (!$this.hasClass('device-switcher__toggle--active')) {
            var thisDevice = $this.data('device');
            // Update active toggle.
            $('.device-switcher', context).find('.device-switcher__toggle')
              .removeClass('device-switcher__toggle--active').attr('aria-selected', 'false');
            $this.addClass('device-switcher__toggle--active').attr('aria-selected', 'true');
            // Show the related content.
            $('.device-filter', context).find('.device-filter__content')
              .hide().attr('aria-hidden', 'true');
            $('.device-filter', context).find('[data-content="' + thisDevice + '"]')
              .fadeIn().attr('aria-hidden', 'false');
          }
        });
    }
  };
}(jQuery, Drupal));

/**
 * @file
 * discovercard script.
 */

(function discovercardScript($, Drupal) {
  'use strict';
  Drupal.behaviors.discovercard = {
    attach: function (context) {
      const ctaButton = $('.discover-card__cta', context);

      ctaButton.hover(
        function () {
          const bgColor = $(this).css('border-top-color');
          const textColor = $(this).parents('.discover-card').css('background-color');
          $(this).css('background-color', bgColor);
          $(this).css('color', textColor);
        }, function () {
          const textColor = $(this).parents('.discover-card').css('color');
          $(this).css('background-color', 'transparent');
          $(this).css('color', textColor);
        }
      );
    }
  };
})(jQuery, Drupal);

/**
 * @file
 * filters script.
 */

(function filtersScript($, Drupal) {
  'use strict';
  Drupal.behaviors.filters = {

    autosubmit: function () {
      // Autosubmit on each select option change.
      if ($('form.js-autosubmit').length > 0) {
        $('input.form-submit').trigger('click');
      }
    },
    attach: function (context) {
      var that = this;

      $('.filters select[multiple]').each(function () {
        var $select = $(this);
        var placeholder = $(this).attr('placeholder');

        if (typeof placeholder === 'undefined' || placeholder === null) {
          placeholder = Drupal.t('Select');

        }
        var $selected_item = $select.parent().find('li.selected');
        if ($selected_item.length > 0) {
          $select.parent().find('.form-select').addClass('has-selected-options');
        }

        $select
          .select2({
            placeholder: placeholder
          })
          .on('select2:open', function () {
            $select.parent().addClass('select-toggle--open');
          })
          .on('select2:close', function () {
            $select.parent().removeClass('select-toggle--open');
          })
          .on('change.select2', function () {
            that.autosubmit();
          });
      });
    }
  };

  Drupal.behaviors.CSHSFilterLabel = {
    attach: function (context) {
      $('select.simpler-select [data-parent-value="All"]').text('Filter By');
    }
  };

}(jQuery, Drupal));

/**
 * @file
 * Image Tile script.
 */

(function imageTileScript($, Drupal) {
  'use strict';
  Drupal.behaviors.imageTileTarget = {
    attach: function (context) {
      var $clickZone = $('.js-image-tile--click-zone', context);

      $clickZone.each(function () {
        var $target = $('a', $(this)).first();
        var $links = $('a', $(this));
        // If using clickZone prevent default links.
        $links.on('click', function (e) {
          e.preventDefault();
        });
        $target.bigTarget({
          clickZone: '.js-image-tile--click-zone',
          clickZoneClass: 'js-image-tile',
          anchorClass: 'js-image-tile__target'
        });
      });
    }
  };
}(jQuery, Drupal));

/**
 * @file
 * Media block script.
 */

/**
 * For Media block - video variants.
 *
 * Pinterest Youtube Video with custom poster image JS.
 */
(function ($, Drupal) {
  'use strict';

  Drupal.behaviors.pinYouTubePlayer = {
    attach: function (context, settings) {
      var $video = $('.video--youtube', context);

      // trigger the video player, hide the poster
      $video.each(function () {
        var $playTrigger = $(this).find('.js-play-trigger');
        if ($playTrigger.length > 0) {
          var $videoPlayer = $playTrigger.next('.video-player');
          if ($videoPlayer.length > 0) {
            var $videoIframe = $videoPlayer.find('iframe');
            if ($videoIframe.length > 0 && $videoIframe.attr('src')) {
              $playTrigger.addClass('js-play-trigger--with-video');

              $playTrigger.on('click', function (e) {
                var $trigger = $(this);
                e.preventDefault();
                var $player = $playTrigger.next('.video-player');
                var $iframe = $player.find('iframe');
                var src = $iframe.attr('src');
                if (src) {
                  src = src.replace('autoplay=0', 'autoplay=1');
                  $iframe.attr('src', src);
                  $trigger.hide();
                  $player.show();
                }
              });
            }
          }
        }
      });

    }
  };

})(jQuery, Drupal);

/**
 * @file
 * Pin script.
 */

(function pinScript($, Drupal) {
  'use strict';

  Drupal.behaviors.pinImageFlipToggle = {
    attach: function (context) {
      // This is the placeholder & front element on page load.
      var $pinImageFlipper = $('.js-pin-image-flipper', context);

      // Flip the placeholder to reveal the image on click.
      $pinImageFlipper.each(function () {
        $(this).click(function () {
          var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
          if (isIE11) {
            // We have to use 3 .parent() functions instead of .closest() because of IE11.
            $(this)
              .parent()
              .parent()
              .parent()
              .toggleClass('pin__image-wrap--flip');
          }
          else {
            $(this).closest('.js-pin-image-wrap')
              .toggleClass('pin__image-wrap--flip');
          }
        });
      });
    }
  };
}(jQuery, Drupal));

/**
 * @file
 * Squircle script.
 */

(function squircleScript($, Drupal, drupalSettings) {
  'use strict';

  var randomProperty = function (object) {
    // Grab random element from the JSON list.
    var keys = Object.keys(object);
    var randomKey = Math.floor(keys.length * Math.random());
    return {key: randomKey, object: object[keys[randomKey]]};
  };

  Drupal.behaviors.squircle = {
    attach: function squircleAttach(context) {
      var $ballPit = $('.tip-grid__layout', context);
      if (!$ballPit.length) {
        return;
      }

      $('.squircle', context).on('mouseleave', function () {
        $(this).animateCss('pulse');
      });

      if (typeof (drupalSettings.tipsJson) === 'undefined') {
        return;
      }
      var jsonList = drupalSettings.tipsJson;
      if (!jsonList.length || typeof (jsonList) !== 'object') {
        return;
      }

      // On page load, randomize which tips are shown.
      $('.squircle--tip', context).each(function () {
        var $this = $(this);
        var randomItem = randomProperty(jsonList);
        // Remove selected tip from JSON list, so we don't get repeats.
        jsonList.splice(randomItem.key, 1);
        $this.find('.squircle__label').text(Drupal.t('Tip') + ' ' + randomItem.object.nid);
        $this.find('.squircle__headline').text(randomItem.object.field_tip_text);
      });

      // When user clicks to close a Tip, it will zoom out, update text and ID,
      // then bounces back in. The Masonry layout will adjust accordingly.
      $('.squircle__close-button', context).hammer().on('tap press click', function () {
        var $tip = $(this).parent();
        var randomItem = randomProperty(jsonList);
        var dataLayer = window.dataLayer = window.dataLayer || [];

        if (drupalSettings.pin_analytics && drupalSettings.pin_analytics.squircle && window.ga && window.ga.loaded) {
          // GA tracking of close button
          window.ga('send', {
            hitType: 'event',
            eventCategory: 'tip',
            eventAction: 'click',
            eventLabel: 'homepage'
          });
          // GA4 tracking of close button
          dataLayer.push({
            event: 'tip_closed',
            entity_type: 'tip',
            entity_id: $tip.data('entity-id')
          });
        }

        // Remove selected tip from JSON list, so we don't get repeats.
        jsonList.splice(randomItem.key, 1);

        if (jsonList.length) {
          $tip.animateCss('zoomOut', function () {
            $tip.find('.squircle__label').text(Drupal.t('Tip') + ' ' + randomItem.object.nid);
            $tip.find('.squircle__headline').text(randomItem.object.field_tip_text);
            if ($ballPit.length) {
              // Update Masonry layout.
              $ballPit.masonry('layout');
            }
            $tip.animateCss('bounceIn');
          });
        }
      });
    }
  };
}(jQuery, Drupal, drupalSettings));

/**
 * @file
 * Expandable text tiles.
 */

(function textTileExpandable($, Drupal, _, window) {
  'use strict';

  // CSS Animation settings
  // Durations in ms.
  // These should match the css animations.
  // Expanding has 1 phase1.
  var EXPAND_01_DURATION = 400;
  // Collapsing has 2 phases.
  var COLLAPSE_01_DURATION = 400;
  var COLLAPSE_02_DURATION = 400;

  // JS animation settings.
  var EXPAND_SCROLL_TOP_BUFFER = 10;
  var EXPAND_SCROLL_ANIMATION_DURATION_DIRECT_LINK = 600;

  // Get the left tile of the given tile assuming a 2 column grid.
  var getLeftTile = function ($container) {
    var $prevContainers = $container.prevAll('.text-tile--expandable').filter(':not(.text-tile--expanded)');
    if ($prevContainers.length > 0 && ($prevContainers.length % 2) !== 0) {
      return $prevContainers.first();
    }

    return [];
  };

  /**
   * Process the expandable element.
   *
   * @param {Object} $container
   *   The text tile container jQuery object.
   * @param {string} operation
   *   The operation to perform: 'expand', 'collapse'.
   * @param {int} scrollDuration
   *   The duration for the scroll animation.
   *
   * @return {Object}
   *   The passed in container jQuery object.
   */
  var processExpandable = function ($container, operation, scrollDuration) {
    if ($container.length === 0) {
      return $container;
    }

    var $leftContainer = getLeftTile($container);
    if ($leftContainer !== null && $leftContainer.length > 0) {
      // Scroll processing.
      if (operation === 'collapse') {
        // Collapse.
        scrollCollapse($container, scrollDuration);
      }
      else {
        // Expand.
        $container.addClass('right-container');
        scrollExpand($container, scrollDuration);
      }
    }
    else if (operation === 'collapse') {
      // Collapse.
      collapse($container);
    }
    else {
      // Default: Expand.
      expand($container);
    }

    return $container;
  };

  // Collapse the expandable.
  var collapse = function ($container, scrollDuration) {
    $container.addClass('text-tile--collapsing');
    window.setTimeout(function () {
      $container.removeClass('text-tile--expanded text-tile--collapsing right-container');
      $container.animate({
        marginTop: 0
      }, COLLAPSE_02_DURATION);
    }, COLLAPSE_01_DURATION + COLLAPSE_02_DURATION);
  };

  // Expand the expandable.
  var expand = function ($container) {
    $container.addClass('text-tile--expanded');
  };

  // Collapse and scroll back up.
  var scrollCollapse = function ($container, scrollDuration) {
    // Scroll back up.
    var scrollTopOffset = $container.offset().top;
    if (scrollTopOffset > 0) {
      // Previous container adjust.
      var $leftContainer = getLeftTile($container);
      if ($leftContainer.length > 0) {
        scrollTopOffset -= $leftContainer.outerHeight();
      }

      // Adjust for sticky nav.
      var navHeight = $('.site__header > .navigation').outerHeight() || 0;
      scrollTopOffset -= 3 * navHeight;

      // Buffer.
      scrollTopOffset -= EXPAND_SCROLL_TOP_BUFFER;

      // Animate the scroll.
      if (scrollTopOffset > 0) {
        collapse($container, scrollDuration);
      }
      else {
        // Fallback.
        collapse($container, scrollDuration);
      }
    }
    else {
      // No scroll.
      collapse($container, scrollDuration);
    }
  };

  // Scroll and expand the expandable.
  var scrollExpand = function ($container, scrollDuration) {
    var scrollTopOffset = $container.offset().top;
    if (scrollTopOffset > 0) {
      // Previous container adjust.
      var $leftContainer = getLeftTile($container);
      if ($leftContainer.length > 0) {
        scrollTopOffset += $leftContainer.outerHeight();
      }

      // Adjust for sticky nav.
      var navHeight = $('.site__header > .navigation').outerHeight() || 0;
      scrollTopOffset -= 3 * navHeight;

      // Buffer.
      scrollTopOffset -= EXPAND_SCROLL_TOP_BUFFER;
      // Animate the scroll.
      if (scrollTopOffset > 0) {
        $($container).animate({
          marginTop: $container.outerHeight()
        }, {
          duration: EXPAND_01_DURATION,
          complete: function () {
            expand($container);
          }
        });
        $('html, body').animate({
          scrollTop: $container.offset().top - $container.outerHeight()
        }, {
          duration: EXPAND_01_DURATION
        });
      }
      else {
        // Fallback.
        expand($container);
      }
    }
    else {
      // No scroll.
      expand($container);
    }
  };

  /**
   * Expandable text tiles.
   */
  Drupal.behaviors.textTileExpandable = {
    attach: function (context) {
      $('.text-tile--expandable:not(.pin-expandable-processed)', context).each(function () {
        var $container = $(this);
        $container.addClass('pin-expandable-processed');
        var $expandable = $('> .text-tile__expandable-element', $container);

        // Skip if nothing to expand.
        if ($expandable.length === 0) {
          $('> .text-tile__cta', $container).hide(0);
          return true;
        }

        // Expand click listener.
        $('> .text-tile__cta .js-button--link', $container).click(function (event) {
          event.preventDefault();
          var $parentContainer = $(this).closest('.text-tile--expandable');
          if ($parentContainer.length > 0) {
            processExpandable($parentContainer, 'expand');
          }
        });

        // Collapse click listener.
        $('.expandable-element__header .js-button--link', $expandable).click(function (event) {
          event.preventDefault();
          var $parentContainer = $(this).closest('.text-tile--expandable');
          if ($parentContainer.length > 0) {
            processExpandable($parentContainer, 'collapse');
          }
        });
      });

      // Process incoming links.
      if (window.location.hash && window.location.hash.indexOf('=') === -1) {
        var $bodyInit = $('body:not(.pin-expandable-init-processed)', context);
        if ($bodyInit.length > 0) {
          $bodyInit.addClass('pin-expandable-init-processed');
          var $incomingTrigger = $(window.location.hash, $bodyInit)
            .filter('.text-tile__expandable-anchor-link')
            .siblings('.text-tile__cta')
            .find('> .js-button--link');
          if ($incomingTrigger.length > 0) {
            var $incomingContainer = $incomingTrigger.closest('.text-tile--expandable');
            if ($incomingContainer.length > 0) {
              scrollExpand($incomingContainer, EXPAND_SCROLL_ANIMATION_DURATION_DIRECT_LINK);
            }
          }
        }
      }
    }
  };

}(jQuery, Drupal, _, window));

/**
 * @file
 * Text Tile script.
 */

(function textTileScript($, Drupal) {
  'use strict';
  Drupal.behaviors.textTileTarget = {
    attach: function (context) {
      var $clickZone = $('.js-text-tile--click-zone', context);

      $clickZone.each(function () {
        var $target = $('a', $(this)).first();
        $target.bigTarget({
          clickZone: '.js-text-tile--click-zone',
          clickZoneClass: 'js-text-tile',
          anchorClass: 'js-text-tile__target'
        });
      });
    }
  };
}(jQuery, Drupal));

/**
 * @file
 * Tooltip script.
 */

(function tooltipScript($, Drupal) {
  'use strict';

  Drupal.behaviors.tooltip = {
    attach: function tooltipAttach(context) {
      // Get all the tooltip buttons
      var tooltips = document.querySelectorAll('[data-tooltip-content]');

      // Iterate over them
      Array.prototype.forEach.call(tooltips, function (tooltip) {
        // Get the message from the data-content element
        var message = tooltip.getAttribute('data-tooltip-content');

        // Get the live region element
        var liveRegion = tooltip.nextElementSibling;

        // Toggle the message
        var showTooltipBubble = function () {
          liveRegion.innerHTML = '';
          window.setTimeout(function () {
            liveRegion.innerHTML = '<span class="tooltip__bubble">' + message + '</span>';
          }, 100);
        };
        tooltip.addEventListener('click', showTooltipBubble);
        tooltip.addEventListener('focus', showTooltipBubble);

        // Close on outside click
        document.addEventListener('click', function (e) {
          if (tooltip !== e.target) {
            liveRegion.innerHTML = '';
          }
        });

        // Remove tooltip on ESC
        tooltip.addEventListener('keydown', function (e) {
          if ((e.keyCode || e.which) === 27) {
            liveRegion.innerHTML = '';
          }
        });

        // Remove on blur
        tooltip.addEventListener('blur', function (e) {
          liveRegion.innerHTML = '';
        });
      });
    }
  };
}(jQuery, Drupal));

/**
 * @file
 * Navigation script.
 */

(function navigationScript($, Drupal, _) {
  'use strict';

  var isMobileMenuOpen = false;

  // Utility function to resolve on/off classes.
  var navbarActionClasses = function ($element) {
    return {
      on: 'navigation--white-bg',
      off: $element.data('navOffClass') || 'navigation--trans-bg'
    };
  };

  /*
   * Navbar
   */
  Drupal.behaviors.navigationNavbar = {
    attach: function (context) {
      var $navbar = $('.navigation', context);
      var $header = $('.header', context);
      var topicNavCheck = $('.topic-navigator', context).length;
      var $siteHeader = $('.site__header', context);
      var $hasMessagesTabs = $('.site__utility', context).find('#block-tabs, .message').length !== 0;

      if (!$navbar.length) {
        return;
      }

      $('.u-no--click-through', context).on('click', function (e) {
        e.preventDefault();
      });

      if (topicNavCheck && $(window).width() < 768) {
        $navbar
          .attr('data-nav-overlay', 'false')
          .addClass('navigation--white-bg ')
          .removeClass('navigation--trans-bg');
        $siteHeader
          .removeClass('site__header--fixed-nav')
          .addClass('site__header--secondary-fixed-nav');
      }
      else {
        // Set navbar to overlay if header has background.
        // Do not do this if there are tabs or a message in between the header and the navigation.
        if ($header.attr('data-has-bg') === 'true' && !$hasMessagesTabs) {
          $navbar
            .attr('data-nav-overlay', 'true')
            .addClass('navigation--trans-bg')
            .removeClass('navigation--white-bg');
        }

        // Save class to restore when not active.
        $navbar.attr('data-nav-off-class', $navbar.hasClass('navigation--white-bg') ? 'navigation--white-bg' : 'navigation--trans-bg');
      }

      // Apply the proper background to navbar using scrolling data attributes.
      $(window).on('scroll', _.debounce(function () {

        // If main menu is not expanded on mobile.
        if (!$('body').hasClass('u-noscroll')) {

          var actionClasses = navbarActionClasses($navbar);

          // If menu is not in position 0 (top).
          if ($(this).scrollTop() > 0) {

            if ($navbar.attr('data-nav-overlay') === 'true') {
              // Set navigation bar white overlay.
              $navbar
                .attr('data-nav-scrolling', 'true')
                .addClass(actionClasses.on)
                .removeClass(actionClasses.off);
            }
            else {
              $navbar
                .attr('data-nav-scrolling', 'true');
            }
          }
          else {
            if ($navbar.attr('data-nav-overlay') === 'true' && $(this).scrollTop() > 0) {
              // If menu is in position 0, remove uneeded attributes and add relevant classes.
              $navbar.removeAttr('data-nav-scrolling').removeClass(actionClasses.on).addClass(actionClasses.off);
            }
            else {
              $navbar.removeAttr('data-nav-scrolling');
            }
          }
        }
      }, 15));

      // Only apply background changes on hover if not scrolling.
      $navbar.hover(function () {
        var $t = $(this);
        if ($t.attr('data-nav-scrolling') === 'true') {
          return;
        }
        else if ($t.attr('data-nav-overlay') === 'false') {
          return;
        }
        else if (topicNavCheck && $(window).width() < 768) {
          return;
        }
        else {
          var actionClasses = navbarActionClasses($t);
          $t
            .addClass(actionClasses.on)
            .removeClass(actionClasses.off);
        }
      }, function () {
        var $t = $(this);
        if ($t.attr('data-nav-scrolling') === 'true') {
          return;
        }
        else if ($t.attr('data-nav-overlay') === 'false') {
          return;
        }
        else if (topicNavCheck && $(window).width() < 768) {
          return;
        }
        else {
          var actionClasses = navbarActionClasses($t);
          if (!isMobileMenuOpen) {
            $t
              .addClass(actionClasses.off)
              .removeClass(actionClasses.on);
          }
        }
      });

      if ($('.navigation').hasClass('navigation--white-bg') && !$siteHeader.hasClass('site__header--secondary-fixed-nav')) {
        $siteHeader.addClass('site__header--fixed-nav');
      }

      // Resize
      $(window).on('resize', _.throttle(function windowResize() {
        if ($(this).width() >= 768) {
          $siteHeader.removeClass('site__header--secondary-fixed-nav');
        }
        else if (topicNavCheck) {
          $navbar
            .attr('data-nav-overlay', 'false')
            .addClass('navigation--white-bg ')
            .removeClass('navigation--trans-bg');
          $siteHeader
            .removeClass('site__header--fixed-nav')
            .addClass('site__header--secondary-fixed-nav');
        }

        if ($('.menu__toggle').css('display') === 'none') {
          $('.navigation .desktop').css('display', 'block');

          // Set primary and dependent offsets.
          var navHeight = $('.navigation').height();
          var navTop = $('.navigation').position().top;
          $('header.site__header--fixed-nav').css('padding-top', navHeight);
          $('.submenu').css({top: navTop + navHeight + 1});
        }
        else {
          $('.navigation .desktop').css('display', 'none');

          // Reset primary offset.
          $('header.site__header--fixed-nav').css('padding-top', '52px');
        }

        // Match the tools menu height with the main menu height.
        // Note: this assumes the tools menu will always be initially shorter than the main menu.
        var mainMenuHeight = $('.header__nav-main .menu--main').outerHeight();
        $('.header__nav-actions .menu--tools').height(mainMenuHeight);
        $('.header__nav-actions .menu--search').height(mainMenuHeight);
        $('.header__nav-anon .menu--user').height(mainMenuHeight);
        $('aside.branding').height(mainMenuHeight);

      }, 400));
    }
  };

  /*
   * Submenu
   */
  Drupal.behaviors.navigationSubmenu = {
    attach: function (context) {
      var fadeDuration = 125;
      // Main menu item links act as triggers for submenu targets.
      $('.menu--main .menu__item a, .menu--main .menu__item span', context).hoverIntent(function () {
        var $main_menu_items = $('.menu--main .menu__item');
        var $main_item = $(this).parent('.menu__item');
        var $navbar = $main_item.closest('.navigation');
        var $navheader = $navbar.parent('.site__header');
        var $target = $main_item.attr('data-submenu-target');
        var $submenu = $('[data-submenu="' + $target + '"]', $navheader);
        // Reset the old hover classes, prior assigning new one.
        $main_menu_items.removeClass('menu__item--is-open').attr('aria-expanded', 'false');
        // Assigning active class.
        $main_item.addClass('menu__item--is-open').attr('aria-expanded', 'true');
        if ($submenu.length > 0) {
          // -- clear any existing timer
          clearTimeout($submenu.data('hoverTimer'));

          // -- fade in the submenu
          $submenu.stop(true, true).fadeIn(fadeDuration).attr('data-submenu-open', 'true');
        }
      }, function () {
        var $main_item = $(this).parent('.menu__item');
        var $navbar = $main_item.closest('.navigation');
        var $navheader = $navbar.parent('.site__header');
        var $target = $main_item.attr('data-submenu-target');
        var $submenu = $('[data-submenu="' + $target + '"]', $navheader);
        if ($submenu.length > 0) {
          // -- set a timer
          var timer = setTimeout(function () {
            $submenu.stop(true, true).fadeOut(fadeDuration).removeAttr('data-submenu-open');
            $main_item.removeClass('menu__item--is-open').attr('aria-expanded', 'false');
          }, 400);
          $submenu.data('hoverTimer', timer);
        }
        else {
          $('.menu--main .menu__item').removeClass('menu__item--is-open').attr('aria-expanded', 'false');
        }
      });

      // Hover the submenu, clear the hoverTimer.
      $('.submenu__item[data-submenu]', context).hover(function () {
        var $t = $(this);
        // -- clear timer
        clearTimeout($t.data('hoverTimer'));

        // -- swap navbar classes conditionally
        var $navbar = $t.closest('.submenu').siblings('.navigation');
        if ($navbar.attr('data-nav-overlay') === 'true' && !$navbar.attr('data-nav-scrolling')) {
          var actionClasses = navbarActionClasses($navbar);
          $navbar
            .addClass(actionClasses.on)
            .removeClass(actionClasses.off);
        }
      }, function () {
        var $t = $(this);
        // -- fade out when no longer hovering
        $t.stop(true, true).fadeOut(fadeDuration).removeAttr('data-submenu-open');

        // -- swap navbar classes conditionally
        var $navbar = $t.closest('.submenu').siblings('.navigation');
        if ($navbar.attr('data-nav-overlay') === 'true' && !$navbar.attr('data-nav-scrolling')) {
          var actionClasses = navbarActionClasses($navbar);
          $navbar
            .removeClass(actionClasses.on)
            .addClass(actionClasses.off);
        }
        $('.menu--main .menu__item').removeClass('menu__item--is-open').attr('aria-expanded', 'false');
      });

      // Keyboard enter the submenu, clear the hoverTimer.
      $('.menu--main .menu__item a, .menu--main .menu__item span', context).on('keyup', function (e) {
        var keycode = e.keyCode || e.which;
        var $main_menu_items = $('.menu--main .menu__item');
        var $main_item = $(this).parent('.menu__item');
        var $navbar = $main_item.closest('.navigation');
        var $navheader = $navbar.parent('.site__header');
        var $target = $main_item.attr('data-submenu-target');
        var $submenu = $('[data-submenu="' + $target + '"]', $navheader);
        var $submenu_items = $('.submenu__item.menu--submenu');

        if (keycode === 13) {
          // Reset the old hover classes, prior assigning new one.
          $main_menu_items.removeClass('menu__item--is-open').attr('aria-expanded', 'false');
          $submenu_items.hide().removeAttr('data-submenu-open');
          // Assigning active class.
          $main_item.addClass('menu__item--is-open').attr('aria-expanded', 'true');

          if ($submenu.length > 0) {
            // -- fade in the submenu
            $submenu.stop(true, true).fadeIn(fadeDuration).attr('data-submenu-open', 'true');
            $submenu.find('.submenu__item-inner').attr('tabindex', '0').focus();
          }
        }
      });
    }
  };

  /*
   * Mobile
   */
  Drupal.behaviors.navigationMobile = {
    attach: function (context) {
      var $toggle = $('.menu__toggle', context);
      var target = $toggle.attr('data-menu-target');
      var targetEl = '.' + target;
      var $navigation_inner = $('.navigation__inner');
      var $content = $('.site__content, .site__footer');
      var wSTop = 0;
      var $navbar = $('.navigation');
      var $menuSearch = $('.menu--search', context);

      $toggle.click(function () {
        var $this = $(this);
        var $toggleText = $this.find('.menu__toggle-text');
        // Display the content and footer when the hamburger nav gets closed.
        if (isMobileMenuOpen) {
          $content.show();
          window.scrollTo(0, wSTop);
        }
        $this
          .toggleClass('menu__toggle--collapsed')
          .toggleClass('menu__toggle--open');

        if (!$menuSearch.length) {
          // prevent body behind mobile menu from scrolling
          $this.closest('body').toggleClass('u-noscroll');
        }

        isMobileMenuOpen = !isMobileMenuOpen;
        $(targetEl).slideToggle('fast', function () {

          // Save the window position and hide the content with footer to avoid
          // the double scroll glitch.
          if (isMobileMenuOpen) {
            wSTop = window.scrollY;
            $content.hide();
            $navbar.removeClass('navigation--trans-bg').addClass('navigation--white-bg');
          }
        });

        // Change the text of the menu toggle for screen readers.
        if (isMobileMenuOpen) {
          $toggleText.text(Drupal.t('Close menu'));
        }
        else {
          $toggleText.text(Drupal.t('Open menu'));
        }

        if (!$menuSearch.length) {
          // toggle navigation inner.
          $navigation_inner.toggleClass('collapsed');
        }
      });

      // Autoclose mobile naviagation when screen width exceeds 1024px.
      $(window).resize(function () {
        if ($(window).width() > 1024) {
          if ($navigation_inner.hasClass('collapsed')) {
            $('.menu__toggle').trigger('click');
          }
        }
      });
    }
  };

  /*
   * Manage user menu
   */
  Drupal.behaviors.userMenuNav = {
    attach: function (context, settings) {

      // Check for user sessionStorage.
      var $user_session_data = JSON.parse(sessionStorage.getItem('pin_pinterest_authusers.user'));

      if ($user_session_data === null || settings.pin_user_nav_blocks.pinUserScripts.menuOutput === null) {
        return;
      }

      // Get the user menu from drupal settings.
      var $user_menu = $.parseHTML(settings.pin_user_nav_blocks.pinUserScripts.menuOutput);

      // Format the user menu.
      $($user_menu).find('li').addClass('menu__item');

      // Default avatar.

      var $user_avatar = 'https://s.pinimg.com/images/user/default_75.png';
      if ($user_session_data.img && $user_session_data.img.length > 0) {
        // If images exist, use the first one listed.
        $user_avatar = $user_session_data.img;
      }

      // Set the user object.
      var $user = {
        username: Drupal.checkPlain($user_session_data.un),
        name: Drupal.checkPlain($user_session_data.fn),
        avatar: Drupal.checkPlain($user_avatar),
        alt: Drupal.checkPlain($user_session_data.fn) + ' ' + Drupal.checkPlain($user_session_data.ln)
      };
      // Truncate long names to not break layout.
      $user.shortname = ($user.name).length > 29 ? jQuery.trim($user.name).substring(0, 29) + '...' : $user.name;

      // Create markup for header user menu items.
      var $markup = '<div class="user__profile">'
          + '<a href="https://pinterest.com/' + $user.username + '">'
          + '<span class="user__profile__avatar"><img alt="' + $user.alt + '" src="' + $user.avatar + '"></span>'
          + '<span class="user__profile__name">' + $user.shortname + '</span>'
          + '</a></div>'
          + '<button class="menu__user__toggle menu__user__toggle--collapsed" data-menu-target="menu-user-authenticated">'
          + '<span class="menu__user__toggle-text">User Menu</span>'
          + '</button>';

      // Replace the anonymous user menu with authenticated one.
      $('#block-headernavigationanon', context).after($user_menu).replaceWith($markup);

      // Toggle behavior for show/hide of user menu on desktop.
      var isUserMenuOpen = false;
      var $toggle = $('.menu__user__toggle', context);
      var target = $toggle.attr('data-menu-target');
      var targetEl = '.' + target;
      // Toggle user menu function.
      $toggle.click(function () {

        $(this)
          .toggleClass('menu__user__toggle--collapsed')
          .toggleClass('menu__user__toggle--open');

        isUserMenuOpen = !isUserMenuOpen;
        $(targetEl).slideToggle('fast', function () {

        });
      });
      // Auto-close user menu when screen width is less than 1024px.
      $(window).resize(function () {
        if ($(window).width() < 1024) {
          if ($toggle.hasClass('menu__user__toggle--open')) {
            $toggle.trigger('click');
          }
        }
      });
    }
  };

  /*
   * Mobile help-center-mobile-nav
   */
  Drupal.behaviors.userMobile = {
    attach: function (context) {
      var $mobileMenu = $('.menu--mobile', context);
      var $userMenu = $('.menu--user', context);
      var $userProfile = $('.user__profile');
      // Check for mobile and user menus.
      if ($mobileMenu.length && $userMenu.length) {
        // Clone the user menu and update classes.
        var $userMenuMobile =
          $userMenu
            .clone()
            .removeClass()
            .addClass('mobile-user-menu');
        // If logged in, add the user profile menu.
        if ($userProfile.length) {
          $userProfile
            .clone()
            .addClass('mobile')
            .wrap("<li class='menu__item'></li>")
            .parent()
            .prependTo($userMenuMobile);
        }
        // Add the mobile version of the user menu to the mobile menu.
        $userMenuMobile
          .wrap("<li class='menu__item'></li>")
          .parent()
          .appendTo($mobileMenu);
      }
    }
  };

}(jQuery, Drupal, _));

/**
 * @file
 * Nav Circles script.
 */

(function navCirclesScript($, Drupal, _) {
  'use strict';

  /*
   * Set click targets.
   */
  Drupal.behaviors.navCirclesTarget = {
    attach: function (context) {
      var $clickZone = $('.js-nav-circle--click-zone', context);

      $clickZone.each(function () {
        var $target = $('a', $(this)).first();
        $target.bigTarget({
          clickZone: '.js-nav-circle--click-zone',
          clickZoneClass: 'js-nav-circle',
          anchorClass: 'js-nav-circle__target'
        });
      });
    }
  };

  /*
   * Set text sizes.
   */
  Drupal.behaviors.navCirclesTextSize = {
    attach: function (context) {
      var $navCircles = $('.nav-circle', context);
      // Map a utility class to set font-size/line-height
      // based on a current line-height.
      var sizeMap = {
        24: 'u-text--18-22',
        20: 'u-text--14-16',
        16: 'u-text--12-14'
      };

      $navCircles.each(function () {
        var $t = $(this);
        var $text = $('a', $t);
        var textHeight = $text.height();
        var lineHeight = parseInt($text.css('line-height'));
        // The height of the text divided by the current line-height
        // will tell us how many lines of text we have.
        var lineNums = textHeight / lineHeight;

        function setSize(navCircle) {
          // If text is four or more lines, bump down the
          // font-size/line-height by setting utility class.
          if (lineNums >= 4) {
            navCircle.addClass(sizeMap[lineHeight]);
          }
          // Else, remove any traces of the classes.
          else {
            for (var size in sizeMap) {
              if (size) {
                navCircle.removeClass(sizeMap[size]);
              }
            }
          }
        }

        setSize($t);

        $(window).resize(_.debounce(function () {
          // Re-evaluate some variables.
          textHeight = $text.height();
          lineHeight = parseInt($text.css('line-height'));
          lineNums = textHeight / lineHeight;

          setSize($t);
        }, 50));
      });
    }
  };
}(jQuery, Drupal, _));

/**
 * @file
 * Footer scripts.
 */

(function footerScript($, Drupal, _) {
  'use strict';

  /*
  * Full viewport height content/sticky footer
  */
  Drupal.behaviors.footerSticky = {
    attach: function (context) {
      function setHeight() {
        var $siteContent = $('.site__content', context);
        var siteContentHeight = parseInt($siteContent.height());
        var siteHeight = parseInt($('.site', context).height());
        var viewportHeight = window.innerHeight;

        if (siteHeight < viewportHeight) {
          $siteContent
            .css('min-height', siteContentHeight + (viewportHeight - siteHeight))
            .addClass('site__content--full-height');
        }
      }

      // Need setHeight() to run after React is injected onLoad.
      setTimeout(function () {
        setHeight();
      }, 0);

      $(window).resize(_.debounce(function () {
        setHeight();
      }, 50));

      if ($('.footer-flush', context).length) {
        $('.footer', context).addClass('footer--no-margin');
      }
    }
  };

}(jQuery, Drupal, _));

(function languageSwitchScript($, Drupal, _) {
  'use strict';

  /*
   * Language select
   */
  Drupal.behaviors.languageSelectSwitcher = {
    attach: function (context) {
      var $languageSelect = $('.js-language-block', context);

      // Bind change event to select.
      $languageSelect.on('change', function () {
        var url = $(this).val(); // get selected value
        if (url) { // require a URL
          window.location = url; // redirect
        }
        return false;
      });
    }
  };

}(jQuery, Drupal, _));


(function footerCountryCodedLinks($, Drupal, _) {
  'use strict';

  /**
   * Extract the geoip country code cookie.
   *
   * @return {Object}
   *   An object with the following for the first tracker found:
   *   'name': The name of the cookie.
   *   'value': The current value of the cookie, null if not set.
   */
  var getGeoIpCountryCodeCookie = function () {
    var cookie = {
      name: '_ss_country_code',
      value: null
    };

    if ('cookie' in $) {
      var cookieValue = $.cookie(cookie.name);
      if (typeof cookieValue !== 'undefined') {
        cookie.value = cookieValue;
      }
    }

    return cookie;
  };


  /**
   * Footer country coded links.
   */
  Drupal.behaviors.footerCountryCodedLinks = {
    attach: function (context) {
      var country_cookie = getGeoIpCountryCodeCookie();
      if (country_cookie.value) {
        $('.footer__menu__item[data-country-code*=' + country_cookie.value.toUpperCase() + ']', context).show();
      }
    }
  };

}(jQuery, Drupal, _));

/**
 * @file
 * Alerts script.
 */

(function alertsScript($, Drupal, _, drupalSettings) {
  'use strict';

  var $alerts = $('.alerts, .notification');

  /**
   * Extract the tracker cookie name and value for the container element.
   *
   * TODO: Assumes only 1 tracker withing the container.
   *
   * @param {Object} $container
   *   The container jQuery object.
   *
   * @return {Object}
   *   An object with the following for the first tracker found:
   *   'name': The name of the cookie.
   *   'value': The current value of the cookie, null if not set.
   */
  var getAlertsTrackerCookie = function ($container) {
    var cookie = {
      name: '',
      value: null
    };

    if ('cookie' in $) {
      $('[data-alert-tracker-id]', $container).first().each(function () {
        var $t = $(this);
        cookie.name = 'pinAlert' + $t.data('alertTrackerId');

        var cookieValue = $.cookie(cookie.name);
        if (typeof cookieValue !== 'undefined') {
          cookie.value = cookieValue;
        }

        return false;
      });
    }

    return cookie;
  };

  /**
   * Set the tracker cookie name and value for the container element.
   *
   * TODO: Assumes only 1 tracker withing the container.
   *
   * @param {Object} $container
   *   The container jQuery object.
   *
   * @return {Object}
   *   An object with the following for the first tracker found:
   *   'name': The name of the cookie.
   *   'value': The current value of the cookie, null if not set.
   */
  var setAlertsTrackerCookie = function ($container) {
    var cookie = getAlertsTrackerCookie($container);
    if (cookie.name) {
      cookie.value = 1;
      $.cookie(cookie.name, cookie.value, {
        path: drupalSettings && drupalSettings.path ? (drupalSettings.path.baseUrl || '/') : '/',
        expires: 365,
        secure: true
      });
    }

    return cookie;
  };

  var calculateOffset = function ($container) {
    // Set offset based on the negative of the current
    // CSS bottom value plus the height of the alert.
    var currentBottom = parseInt($container.css('bottom'), 10);
    var alertHeight = $container.height();
    var alertOffset = (alertHeight - currentBottom) * -1;
    return alertOffset;
  };

  var prepareAlert = function ($container, alertOffset) {
    $container
      .css({
        bottom: alertOffset,
        display: 'block',
        visibility: 'hidden'
      })
      .attr('tabindex', -1)
      .attr('aria-hidden', 'true');
    // Check if a cookie is set against it.
    var cookie = getAlertsTrackerCookie($container);
    if (cookie.value) {
      disableAlert($container);
    }
  };

  var displayAlert = function ($container, alertOffset) {
    if ($container.hasClass('alerts--active')) {
      var $window = $(window);
      var $document = $(document);
      var displayHeight = $.type($container.data('alertDisplayHeight')) !== 'undefined' ? $container.data('alertDisplayHeight') : $window.height();
      var scrollPosition = $document.scrollTop();
      if (scrollPosition >= displayHeight) {
        // We add an amination class here to set transition in CSS
        // and avoid an animating alerts box on initial page load.
        $container.addClass('alerts--anim')
          .css({
            bottom: 0,
            visibility: 'visible'
          })
          .attr('aria-hidden', 'false')
          .attr('tabindex', 0);
      }
      else {
        $container
          .css('bottom', alertOffset)
          .attr('aria-hidden', 'true')
          .attr('tabindex', -1);
      }
    }
  };

  var dismissAlert = function ($container, alertOffset) {
    $container
      .css('bottom', alertOffset)
      .attr('aria-hidden', 'true')
      .attr('tabindex', -1)
      .delay(700).hide(0);
    setAlertsTrackerCookie($container);
    disableAlert($container);
    activateNextAlert($alerts);
  };

  var disableAlert = function ($container) {
    $container.addClass('alerts--disabled');
    $container.removeClass('alerts--active');
  };

  var activateAlert = function ($container) {
    $container.addClass('alerts--active');
  };

  var activateNextAlert = function ($alerts) {
    // Find the first alert not disabled and activate it.
    $alerts.not('.alerts--disabled').first().each(function () {
      var $container = $(this);
      activateAlert($container);
    });
  };


  /*
   * Alerts behaviors.
   */
  Drupal.behaviors.alertsSlide = {
    attach: function (context) {
      $alerts.each(function (index) {
        var $container = $(this);
        var alertOffset = calculateOffset($container);
        prepareAlert($container, alertOffset);
        // Slide up/down the alert based on scroll position in the viewport.
        $(window).on('scroll', _.debounce(function () {
          displayAlert($container, alertOffset);
        }, 15));
        // Set an event to dismiss the alert.
        $container.find('.js-alerts__close-button').click(function () {
          dismissAlert($container, alertOffset);
        });
      });
      activateNextAlert($alerts);
      // Trigger the scroll event.
      $(window).scroll();
    }
  };

  /*
   * Hide placeholder on input click.
   */
  Drupal.behaviors.placeholderHide = {
    attach: function (context) {
      var $alerts_input = $('.alerts input');
      if ($alerts_input.length > 0) {
        $alerts_input.on('click', function () {
          $(this).removeAttr('placeholder');
        });
      }
    }
  };

  /*
   * Newsletter validation mechanism.
   */
  Drupal.behaviors.NewsletterValidation = {
    isValidEmailAddress: function (emailAddress) {
      var pattern = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/; // eslint-disable-line no-useless-escape
      return pattern.test(emailAddress);
    },
    setSubmitStatus: function ($input, $submit) {
      var input_val = $input.val();
      var valid_email = Drupal.behaviors.NewsletterValidation.isValidEmailAddress(input_val);

      // If input not empty or is not valid email, disable sumit.
      if (input_val.length === 0 || !valid_email) {
        $submit.addClass('disabled');
      }
      // otherwise enable by removing disabled class.
      else {
        // otherwise enable by removing disabled class.
        $submit.removeClass('disabled');
      }
    },
    attach: function (context) {
      var $newsletter_form = $('aside.alerts--newsletter');

      // Check if newsletter form is on the page.
      if ($newsletter_form.length > 0) {
        var $input = $newsletter_form.find('input#edit-email');
        var $submit = $newsletter_form.find('.button--go');

        // Set default status based if input is autocompleted in future case.
        Drupal.behaviors.NewsletterValidation.setSubmitStatus($input, $submit);

        // On keyup event, while typing the e-mail decide whenever to enable
        // the submit.
        $input.keyup(function () {
          Drupal.behaviors.NewsletterValidation.setSubmitStatus($(this), $submit);
        });

      }
    }
  };


}(jQuery, Drupal, _, drupalSettings));

/**
 * @file
 * Header script.
 */

(function headerScript($, Drupal) {
  'use strict';

  Drupal.behaviors.header = {
    attach: function (context) {
      var $header = $('.header--full-height', context);
      var $more = $('.header__more', $header);

      $more.on('click', function () {
        // Get the header's current offset.
        var topOffset = $header.height() + parseInt($header.css('paddingTop')) + parseInt($header.css('paddingBottom'));

        // Give a bit of spacing from the nav.
        var destinationOffset = topOffset - 52;

        // Scroll the body there.
        $('html, body', context).animate({
          scrollTop: destinationOffset + 'px'
        });
      });

      // Forcing focus on header search input if not hidden. Timeout is used to
      // trigger focus state after the page is rendered.
      setTimeout(function headerSearchTimeout() {
        if (!$('.header__inner .search-form__input', context).is(':hidden')) {
          $('.header__inner .search-form__input', context).focus();
        }
      }, 0);
    }
  };
}(jQuery, Drupal));

/**
 * @file
 * Headline script.
 */

(function headlineScript($, Drupal, _) {
  'use strict';

  function updateLayout(id) {
    if (!id) {
      return;
    }

    var $headlineHeader = $('#' + id).find('.headline__header');
    var $headlineContent = $('#' + id).find('.headline__content');
    var $headlineSecondaryContent = $('#' + id).find('.headline__secondary-content');
    var $headlinePrimaryMedia = $('#' + id).find('.headline__primary-media');

    if ($(window).width() <= 767) {
      $headlineHeader.prepend($headlinePrimaryMedia);
      $headlineContent.append($headlineSecondaryContent);
      $('#' + id).attr('data-mobile-layout', 'true');
    }
    else {
      $headlineHeader.append($headlineSecondaryContent);
      $headlineContent.prepend($headlinePrimaryMedia);
      $('#' + id).attr('data-mobile-layout', 'false');
    }
  }

  Drupal.behaviors.headline = {
    attach: function (context) {
      if (!$('.headline--flexible-content', context).length) { return; }

      $('.headline--flexible-content', context).each(function () {
        if (($(window).width() > 767 && $(this).data('mobile-layout')) || ($(window).width() <= 767 && !$(this).data('mobile-layout'))) {
          updateLayout($(this).attr('id'));
        }
      });

      $(window).on('resize', _.throttle(function windowResize() {
        $('.headline--flexible-content', context).each(function () {
          var layoutBoolean = $(this).attr('data-mobile-layout');
          if (($(window).width() > 767 && layoutBoolean) || ($(window).width() <= 767 && layoutBoolean === 'false')) {
            updateLayout($(this).attr('id'));
          }
        });
      }, 400));
    }
  };
}(jQuery, Drupal, _));

/**
 * @file
 * Stats script.
 */

(function statsScript($, Drupal, countUp) {
  'use strict';

  /*
   * Stat Graphics.
   */
  Drupal.behaviors.statGraphics = {
    attach: function (context) {
      // Utility to get a number to a place (10th, 100th, etc).
      function numberPlace(number, increment) {
        return number % increment;
      }

      // Draw a radial graphic.
      function drawRadialGraphic(canvas, value) {
        if (canvas[0].getContext) {
          var ctx = canvas[0].getContext('2d');
          var percent;
          var degree;
          var radian;

          // Punch out the center to make the radial shape.
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(500, 500, 250, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.fill();

          // We can only show the amount over 100% since that's the scale
          // we have to work with in a radial representation.
          // For example 368% will be represented as 68%.
          if (value > 100) {
            // Get below the 100th place value.
            value = numberPlace(value, 100);
            // Turn to percentage.
            percent = value / 100;
            // Then to degrees.
            degree = percent * 360.0;
            // Then to radians.
            radian = degree * (Math.PI / 180);

            // Draw the stroke overlay.
            ctx.strokeStyle = 'rgba(255, 255, 255, .65)';
            ctx.beginPath();
            ctx.lineWidth = 500;
            ctx.arc(500, 500, 500, -0.5 * Math.PI, radian + (-0.5 * Math.PI), true);
            ctx.stroke();
          }
          else {
            // Turn to percentage.
            percent = value / 100;
            // Then to degrees.
            degree = percent * 360.0;
            // Then to radians.
            radian = degree * (Math.PI / 180);

            // Draw the stroke overlay.
            ctx.strokeStyle = 'rgba(255, 255, 255, .65)';
            ctx.beginPath();
            ctx.lineWidth = 500;
            ctx.arc(500, 500, 500, -0.5 * Math.PI, radian + (-0.5 * Math.PI), true);
            ctx.stroke();
          }
        }
      }

      // Draw a circle-on-circle graphic.
      function drawCircleOnCircleGraphic(canvas, value) {
        if (canvas[0].getContext) {
          var ctx = canvas[0].getContext('2d');
          var increase;
          var radius;
          var y;

          // We are greatly simplifying here to give a graphical represention
          // of the increase but keep it visible and have it mean something.
          //
          // If a large enough number, over 250, bring it down by 10x.
          // If after rounding it is still over 25, bring it down again.
          if (value >= 250) {
            value = value / 100;
            increase = Math.round(value);
            if (increase > 25) {
              increase = increase / 10;
            }
          }
          // If a small number, show as it is.
          else if (value <= 25) {
            increase = value;
          }
          // Everything else, round it and bring it down by 10x.
          else {
            increase = Math.round(value);
            if (increase > 25) {
              increase = increase / 10;
            }
          }

          // The radius is using a 1000px canvas, so divide
          //  by the increase, rounding, and divide again by 2.
          radius = Math.round(1000 / increase) / 2;
          // Position centered on the y-axis.
          y = 1000 - radius;

          // Draw the circle, positioning it at the bottom center of the canvas.
          ctx.fillStyle = 'rgba(255, 255, 255, .65)';
          ctx.beginPath();
          ctx.arc(500, y, radius, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.fill();
        }
      }

      $('.stats--infographic .stat', context).each(function (index) {
        var $stat = $(this);
        var $canvas = $('.stat__graphic', $stat);
        var type = $canvas.attr('data-stat-graphic');
        var value = $canvas.attr('data-stat-value');

        switch (type) {
          case 'radial':
            drawRadialGraphic($canvas, value);
            break;

          case 'circle-on-circle':
            drawCircleOnCircleGraphic($canvas, value);
            break;
        }
      });
    }
  };

  /*
   * Stat Numbers.
   */
  Drupal.behaviors.statNumbers = {
    attach: function (context) {
      // Count up the stats.
      // Docs: https://inorganik.github.io/countUp.js
      $('.stats--numbers .stat.u-count-up', context).each(function (index) {
        var $stat = $(this);
        var statStart = $stat.attr('data-countup-start');
        var statEnd = $stat.attr('data-countup-end');
        var statPrefix = $('.stat__prefix', $stat).text();
        var statPrefixHtml = '<span class="stat__prefix">' + statPrefix + '</span>';
        var statSuffix = $('.stat__suffix', $stat).text();
        var statSuffixHtml = '<span class="stat__suffix">' + statSuffix + '</span>';
        var statValue = $('.stat__value', $stat)[0];
        // This was hardcoded to '0'. Replaced with variable that will be
        // modified based on following conditions.
        var statDecimalCount = 0;
        // We do the following to ensure that there is a non <div> child
        // that is a pure integer, since that is what our current countUp
        // implementation requires.
        var validStatValue = false;
        $(statValue).contents().each(function () {
          var $statValueText = $(this).text().trim();
          // Check that we're on a text node and that it only has digits.
          if (this.nodeType === 3 && !!$statValueText.match(/^\d+[.,]?\d+$/)) {
            // Check that a decimal does exist.
            if ($statValueText.indexOf('.') !== -1) {
              // Get number of decimal places in number.
              statDecimalCount = $statValueText.split('.')[1].length;
            }
            validStatValue = true;
            return false; // breaks out of .each()
          }
        });

        // Seconds from start to finish of animation
        var duration = 1;
        var countUpOptions = {
          useEasing: true,
          useGrouping: true,
          separator: ',',
          decimal: '.',
          prefix: statPrefix ? statPrefixHtml : '',
          suffix: statSuffix ? statSuffixHtml : ''
        };
        if (validStatValue) {
          // This is a valid stat value. Create a CountUp instance and bind it.
          var statCountUp = new countUp.CountUp(statValue, statStart, statEnd, statDecimalCount, duration, countUpOptions);
          // Execute `$('.stats-numbers .stat').trigger('anim-trigger')` to start.
          // Done in `animations.js` as part of a staggered start.
          $stat.on('anim-trigger', function () {
            statCountUp.start();
          });
        }
      });
    }
  };
}(jQuery, Drupal, countUp));

/**
 * @file
 * Blog Block script.
 */

(function blogBlockScript($, Drupal) {
  'use strict';
  Drupal.behaviors.blogBlockTout = {
    attach: function (context) {
      var $blogBlock = $('.blog-block--with-tout', context);
      var $blogBlockItems = $('.blog-block__item', $blogBlock);
      var $itemTout = $('.blog-block__item--tout', $blogBlock);
      // zero-based indexing
      var orderSmall = $itemTout.attr('data-order-small') - 1;
      var orderLarge = $itemTout.attr('data-order-large') - 1;

      // Clone & insert the text tout in the desired "order"
      // for mobile 2-up and for tablet/desktop 4-up grids.
      $blogBlockItems.each(function (index, element) {
        switch (index) {
          // -- mobile position
          case orderSmall:
            $itemTout
              .clone()
              .removeAttr('data-order-large')
              .insertAfter(element);
            break;
          // -- tablet/desktop position
          case orderLarge:
            $itemTout
              .clone()
              .removeAttr('data-order-small')
              .insertAfter(element);
            break;
        }
        // Detach the original tout.
        $itemTout.detach();
      });
    }
  };
}(jQuery, Drupal));

/**
 * @file
 * Help Center Contact Form script.
 */

(function hcContactFormScript($, Drupal, window, _) {
  'use strict';

  Drupal.behaviors.hcContactForm = {
    attach: function hcContactFormAttach(context, settings) {
      if (typeof settings !== 'undefined' &&
        typeof settings.pin_help_center_contact_form !== 'undefined') {
        if (typeof settings.pin_help_center_contact_form.navIndicator !== 'undefined') {
          var navClass = settings.pin_help_center_contact_form.navIndicator;
          $('.hc-contact-form__navigation li.active').removeClass('active');
          $('.hc-contact-form__navigation li.' + navClass).addClass('active');
        }
      }
      $(window).resize(function () {
        var availableWidth = $(window).width();
        if ($('.hc-contact-form__navigation-wrapper').length && availableWidth <= 580) {
          var navWrapper = $('.hc-contact-form__navigation-wrapper');
          var navList = $('.hc-contact-form__navigation');
          var activeItem = $('.active', navList);
          var activeOffset = activeItem.offset().left;
          var activeWidth = activeItem.width();
          var activeRight = activeOffset + activeWidth;
          var minLeft = Math.abs(availableWidth * 0.15);
          var minRight = Math.abs(availableWidth * -0.85);
          var skipGradient = false;
          if (navList.children().first().hasClass('active')) {
            skipGradient = true;
          }
          if (skipGradient === true) {
            navWrapper.addClass('no-left-gradient');
          }
          else {
            navWrapper.removeClass('no-left-gradient');
          }
          if (skipGradient === false && activeOffset < minLeft) {
            navList.offset({left: minLeft});
          }
          else if (activeRight > minRight) {
            navList.offset({left: -Math.abs(activeRight - minRight)});
          }
        }
        else {
          $('.hc-contact-form__navigation').css({left: 0});
        }
      }).resize();
      $('input[data-drupal-selector="edit-user-issue-subject"]', context).on('focus change', function () {
        window.pinSearch.renderSearch({el: 'search-reduced', variant: 'reduced', context: 'contact_form'});
      }).on('input', function () {
        window.pinSearch.doSearch($(this).val());
      });
      $('input[data-drupal-selector="edit-user-other-emails-add-submit"]').attr({
        value: Drupal.t('Add another email')
      });
      // Accordions.
      // Using setTimeout to work around WebForm's JS that opens accordion
      // options.
      setTimeout(function () {
        $('details', context).each(function () {
          if ($(this).attr('data-webform-key') !== 'account_access_options' &&
          $(this).is('[open]')) {
            $(this).attr('open', '').removeAttr('open');
          }
        });
      }, 0);
      // When the user clicks an issue category, close the currently open
      // category, open the one clicked on, and deselect any chosen option.
      $('details > summary').on('click', function () {
        var $parentSection = $(this).parent().parent();
        $(this).parent().removeAttr('closed');
        $('summary', $parentSection).not(this).each(function () {
          $(this).attr({
            'aria-expanded': 'false',
            'aria-pressed': 'false'
          }).parent().removeAttr('open').attr('closed', '');
        });
        $('input', $parentSection).not(this).each(function () {
          $(this).prop('checked', false);
        });
        // Make sure we re-set the submit to disabled when we do this.
        $parentSection.children()
          .filter('[data-drupal-selector="edit-actions-overview-1"]')
          .addClass('form-disabled')
          .find('input')
          .prop({
            disabled: true
          })
          .addClass('is-disabled');
      });
      // When the user makes a radio button selection on the first page,
      // ensure that the submit button becomes enabled.
      $('[data-drupal-selector="edit-overview-section-1-right"] input[type="radio"]').on('click', function () {
        $(this)
          .closest('[data-drupal-selector="edit-overview-section-1-right"]')
          .children()
          .filter('[data-drupal-selector="edit-actions-overview-1"]')
          .removeClass('form-disabled')
          .find('input')
          .prop({
            disabled: false
          })
          .removeClass('is-disabled');
      });
      // Sticky nav.
      var $nav = $('.hc-contact-form__navigation-wrapper', context);
      var $navHeight = $nav.outerHeight();
      var $distance = $($nav).offset();
      var $window = $(window);
      $window.scroll(function () {
        if ($nav.length > 0 && $window.scrollTop() >= ($distance.top - $navHeight)) {
          $($nav).addClass('sticky');
        }
        else {
          $($nav).removeClass('sticky');
        }
      });
      // Scroll to last completed section.
      var $activeSection = $('.section-active', context);
      if ($activeSection.length) {
        var $lastCompleted = $('.hc-contact-form__completed-sections').children().last();
        if ($lastCompleted.length) {
          var sectionScrollDistance = $lastCompleted.offset().top;
          var winHeight = $(window).height();
          var docHeight = $(document).height() - $lastCompleted.offset().top;
          if (!$lastCompleted.hasClass('scroll-complete') &&
              sectionScrollDistance > 240 &&
              docHeight > winHeight) {
            // 240px is the number needed to align the last completed with the form nav.
            $('html, body').animate({
              scrollTop: (sectionScrollDistance - 240)
            }, 1000);
            $lastCompleted.addClass('scroll-complete');
          }
        }
      }
      $('.pin-media-upload .image-upload-button ~ input[type="submit"]', context).attr('disabled', 'disabled');
      $('.pin-media-upload input[type="checkbox"]', context).on('change', function () {
        if (this.checked) {
          $('.pin-media-upload .image-upload-button ~ input[type="submit"]').removeAttr('disabled');
        }
      });
      var $userDeviceOptions = $('#user-device-options', context);
      if ($userDeviceOptions.length) {
        // Check if all options are blank and select on if so.
        var deviceExists = false;
        var device = device_detect().toString().toLowerCase();
        $('input', $userDeviceOptions).each(function () {
          if ($(this).prop('checked')) {
            deviceExists = true;
          }
        });
        if (deviceExists === false) {
          $('input', $userDeviceOptions).each(function () {
            if ($(this).val() === device) {
              $(this).prop('checked', true);
            }
          });
        }
      }
      var $userBrowserOptions = $('#user-browser-options', context);
      if ($userBrowserOptions.length) {
        // Check if all options are blank and select on if so.
        var browser = browser_detect().toString().toLowerCase();
        var broswerExists = false;
        $('input', $userBrowserOptions).each(function () {
          if ($(this).prop('checked')) {
            broswerExists = true;
          }
        });
        if (broswerExists === false) {
          $('input', $userBrowserOptions).each(function () {
            if ($(this).val() === browser) {
              $(this).prop('checked', true);
            }
          });
        }
      }
    }
  };

  function check_browser(browser) {
    var re = new RegExp(browser, 'i');
    return navigator.userAgent.match(re);
  }

  function device_detect() {

    var device = 'computer';
    var result = null;
    var devices = ['Android', 'IEMobile', 'iPhone', 'iPad', 'Kindle'];

    if (/Kindle|Android|iPhone|iPad|IEMobile/i.test(navigator.userAgent)) {
      $.each(devices, function (index, value) {
        device = check_browser(value);
        if (device !== null) {
          if (device === 'IEMobile') {
            result = 'windowsphone';
            return false;
          }
          result = device;
          return false;
        }
      });
    }

    return result || device;
  }

  function browser_detect() {

    var browsers = ['Edge', 'Firefox', 'OPR', 'Chrome', 'Safari', '.NET'];
    var result = null;

    $.each(browsers, function (index, value) {
      var browser_detected = check_browser(value);
      if (browser_detected !== null) {

        if (browser_detected === 'OPR') {
          result = 'other';
          return false;
        }

        if (browser_detected === '.NET' || browser_detected === 'Edge') {
          result = 'ie';
          return false;
        }
        result = browser_detected;
        return false;
      }
    });

    return result || 'other';
  }

}(jQuery, Drupal, window, _));

/**
 * @file
 * Search Modal script.
 */

(function searchModalScript($, Drupal, drupalSettings, _) {
  'use strict';

  function searchInputTypeSize() {
    $('.dynamic-search__input').on('input', function () {
      var $this = $(this);
      var inputFontSize = parseInt($this.css('font-size'), 10);
      var inputCharCount = $this.val().length;
      var inputWidth = parseInt($this.outerWidth(), 10) + 90;

      // If input font size are set to default, check to see if the text
      // overflows the input. If they do, shrink the font size.
      if ([96, 48].indexOf(inputFontSize) > -1 && (inputCharCount * inputFontSize) > inputWidth) {
        var shrinkFontSize = 0;
        if (inputFontSize === 96) {
          shrinkFontSize = 36;
        }
        else {
          shrinkFontSize = 24;
        }
        $this.css('font-size', shrinkFontSize + 'px');
      }
      // If input font size are set to shrunk font sizes, check to see if the
      // text won't overflow the input. If they do, grow the font size.
      if ([36, 24].indexOf(inputFontSize) > -1) {
        var growFontSize = 0;
        if (inputFontSize === 36) {
          growFontSize = 96;
        }
        else {
          growFontSize = 48;
        }

        if ((inputCharCount * growFontSize) < inputWidth) {
          $this.css('font-size', growFontSize + 'px');
        }
      }
    });
  }

  Drupal.behaviors.searchModal = {
    attach: function searchModalAttach(context) {
      var $modalContainer = $('.search-modal', context);
      var $searchHeaderInput = $('.header-search-trigger__input', context);
      var $menuSearchLink = $('.menu--search > li > a', context);
      // Initialize the search component.
      window.dispatchEvent(new CustomEvent('search-render: full'));

      if ($searchHeaderInput.length) {
        var $triggerIcon = $('.header-search-trigger__trigger .icon--search-alt', context);

        $searchHeaderInput.focus();
        // Render search component in modal but the modal hidden until the user takes a
        // pause in their typing.
        $searchHeaderInput.on('input', function () {
          $triggerIcon.animateCss('fadeOutLeft', function () {
            $triggerIcon.hide();
          });

          window.pinSearch.doSearch($(this).val());
        });
        // Make the modal visible, with pre-rendered search component.
        $searchHeaderInput.on('input', _.debounce(function () {
          var siteHeight = $('.site', context).height() - 53;
          $modalContainer.css({height: siteHeight + 'px'}).show().animateCss('fadeIn');
          $('.dynamic-search__input', context).focus();
          $menuSearchLink.addClass('active');
          searchInputTypeSize();
        }, 400));
      }

      // Reset font size when search reset is clicked.
      $modalContainer
        .on('click', '.dynamic-search__reset', function () {
          $('.dynamic-search__input').removeAttr('style');
        })
        .on('keypress', function (e) {
          if ((e.which === 13) && (!(e.target.classList.contains('dynamic-search__reset'))) && (!(e.target.classList.contains('search-modal__close-button')))) {
            // We prepend currentLanguage so the user is always sent to
            // the correct full page results.
            var currentLanguage = drupalSettings.path.currentLanguage;
            var link = ($('.dynamic-search__result-more').length) ? $('.dynamic-search__result-more').attr('href') : '/' + currentLanguage + '/search' + window.location.hash;
            window.location.href = link;
          }
          else if (e.target.classList.contains('dynamic-search__reset')) {
            // if user hits the reset return focus to the input.
            $('.dynamic-search__input').focus();
          }
        });

      // Workaround Drupal's limits for required fields.
      $menuSearchLink.text('').attr('href', '/#');
      // Navigation search icon trigger.
      $menuSearchLink
        .hammer()
        .on('tap press click', function (e) {
          e.preventDefault();
          window.dispatchEvent(new CustomEvent('search-render: full'));
          $(this).addClass('active');
          var siteHeight = $('.site', context).height() - 53;
          $modalContainer.css({height: siteHeight + 'px'}).show().animateCss('fadeIn');
          $('.dynamic-search__input', context).focus();

          // If mobile menu is active when the search icon is clicked, we want
          // to close the mobile menu and show the site content.
          if ($(window).width() < 1024) {
            var $menuToggle = $('.menu__toggle', context);
            if ($menuToggle.hasClass('menu__toggle--open')) {
              $menuToggle
                .toggleClass('menu__toggle--collapsed')
                .toggleClass('menu__toggle--open');
              $('.menu--mobile', context).slideToggle('fast');
              $('.site__content, .site__footer', context).show();
              window.scrollTo(0, 0);
            }
          }

          searchInputTypeSize();
        });

      // Closing search modal.
      $('.search-modal__close-button', context)
        .hammer()
        .on('tap press click', function (e) {
          e.preventDefault();
          closeSearchModal();
        });
      // Close search from escape key.
      $(document).on('keyup', function (evt) {
        if (evt.keyCode === 27
            && $modalContainer.length
            && $modalContainer.is(':visible')) {
          closeSearchModal();
        }
      });
      // Shared function for closing modal.
      function closeSearchModal() {
        if ($searchHeaderInput.length) {
          $searchHeaderInput.val('').focus();
          $triggerIcon.show().animateCss('fadeInLeft'); // eslint-disable-line block-scoped-var
        }

        $modalContainer.animateCss('fadeOut', function () {
          $modalContainer.hide();
        });
        $menuSearchLink.removeClass('active');
      }
    }
  };
}(jQuery, Drupal, drupalSettings, _));

/**
 * @file
 * Tip Grid script.
 */

(function tipGridScript($, Drupal, _) {
  'use strict';

  Drupal.behaviors.tipGrid = {
    attach: function tipGridAttach(context) {
      const $grid = $('.tip-grid__layout', context);

      if (!$grid.length) {
        return;
      }

      $grid.masonry({
        itemSelector: '.squircle',
        percentPosition: true,
        columnWidth: '.squircle',
        gutter: '.gutter-sizer',
        horizontalOrder: true
      });

      // Resize.
      $(window).on('resize', _.debounce(function windowResize() {
        $grid.masonry('layout');
      }, 100)).resize();
    }
  };
}(jQuery, Drupal, _));

/**
 * @file
 * Topic list grid script.
 */

(function topicListGridScript($, Drupal) {
  'use strict';

  Drupal.behaviors.topicListGrid = {
    attach: function topicListGridAttach(context) {

      // Check for user sessionStorage.
      let userSessionData = sessionStorage.getItem('pin_pinterest_authusers.user') ? JSON.parse(sessionStorage.getItem('pin_pinterest_authusers.user')) : null;
      let facetChosen = sessionStorage.getItem('facetChosen') ? sessionStorage.getItem('facetChosen') : null;

      if (userSessionData) {
        window.userType = userSessionData.is_partner ? 'business' : 'personal';
      }

      let facetToSet = 'personal';

      if (facetChosen) {
        facetToSet = facetChosen;
      }
      else if (window.contentFacet) {
        facetToSet = window.contentFacet;
      }
      else if (window.userType) {
        facetToSet = window.userType;
      }

      let activeId = '';
      const $tabs = $('.tab__item', context);

      // Remove default active state.
      $tabs
        .attr('aria-selected', 'false')
        .removeClass('tab__item--active');

      // Change active state of tabs.
      if (facetToSet === 'business') {
        activeId = 'business';
        $('#' + activeId, context)
          .addClass('tab__item--active')
          .attr('aria-selected', 'true');
      }
      else {
        activeId = 'general';
        $('#' + activeId, context)
          .addClass('tab__item--active')
          .attr('aria-selected', 'true');
      }
      // Show the content for the selected tab.
      $('#panel-' + activeId, context).fadeIn();

      $('.tab__item', context)
        .hammer()
        .on('tap press click', function (e) {
          e.preventDefault();
          const $this = $(this);
          const thisId = $this.attr('id');
          var dataLayer = window.dataLayer = window.dataLayer || [];

          if (drupalSettings.pin_analytics && drupalSettings.pin_analytics.topicListGrid && window.ga && window.ga.loaded) {
            // GA tracking of tab clicks
            window.ga('send', {
              hitType: 'event',
              eventCategory: 'topic type',
              eventAction: 'switch',
              eventLabel: 'homepage'
            });
            // GA4 tracking of tab clicks
            dataLayer.push({
              event: 'context_switch',
              page_context: activeId
            });
          }

          let selectedFacet = thisId === 'business' ? 'business' : 'personal';
          sessionStorage.setItem('facetChosen', selectedFacet);

          let targetToSet = thisId === 'business' ? 2 : 1;
          const $menuItems = $('.menu__item', context);
          const $menuLink = $('.menu__item[data-submenu-target="' + targetToSet + '"]', context);
          const ballpitLayout = $('.tip-grid__layout', context);

          $menuItems.attr('aria-selected', 'false').removeClass('activeFacet');
          $menuLink.addClass('activeFacet').attr('aria-selected', 'true');

          if (!$this.hasClass('tab__item--active')) {
            $('.tab__item--active', context).removeClass('tab__item--active');
            $this.addClass('tab__item--active');
            $('.topic-list-grid__panel', context).hide();
            $('#panel-' + thisId, context).fadeIn();
          }

          // Switch the ballpit based on Topic List toggle.
          const ballpit = $('.tip-grid', context);
          const ballpitContext = ballpit.attr('data-context');
          if ((targetToSet === 1 && ballpitContext !== 'biz') || (targetToSet === 2 && ballpitContext !== 'general')) {
            ballpit
              .attr('aria-hidden', 'false')
              .fadeIn();
            // Update Ballpit Masonry layout.
            ballpitLayout.masonry('layout');
          }
          else {
            ballpit
              .attr('aria-hidden', 'true')
              .fadeOut();
          }

          // Switch the discover card group based on Topic List toggle.
          const discoverCardGroup = $('.discover-card-group', context);
          const discoverCardGroupContext = discoverCardGroup.attr('data-context');
          if ((targetToSet === 1 && discoverCardGroupContext !== 'biz') || (targetToSet === 2 && discoverCardGroupContext !== 'general')) {
            discoverCardGroup
              .attr('aria-hidden', 'false')
              .fadeIn();
          }
          else {
            discoverCardGroup
              .attr('aria-hidden', 'true')
              .fadeOut();
          }
        });
    }
  };
}(jQuery, Drupal));

/**
 * @file
 * Topic navigator script.
 */

(function topicNavigatorScript($, Drupal) {
  'use strict';

  Drupal.behaviors.topicNavigator = {
    attach: function topicNavigatorAttach(context) {
      var isMobile = false;
      var $navigator = $('.topic-navigator', context);

      $navigator.find('.topic-navigator__inner--show')
        .slideToggle();

      if ($(window).width() < 768) {
        var mobileToggleText = $('.topic-navigator__toggle--active', context).text();
        $navigator.find('.topic-navigator__mobile-toggle')
          .text(mobileToggleText);
        $navigator.addClass('topic-navigator--mobile');
        // Hide Show more/less and show all articles.
        $navigator.find('.topic-navigator__more-toggle').parent()
          .hide();
        $navigator.find('.topic-navigator__item--hidden')
          .removeClass('topic-navigator__item--hidden')
          .addClass('topic-navigator__item--shown');
        isMobile = true;
      }

      // Resize
      $(window).on('resize', _.throttle(function windowResize() {
        if ($(window).width() < 768) {
          var mobileToggleText = $('.topic-navigator__toggle--active', context).text();
          $navigator.find('.topic-navigator__mobile-toggle')
            .text(mobileToggleText);
          $navigator.addClass('topic-navigator--mobile');
          // Hide Show more/less and show all articles.
          $navigator.find('.topic-navigator__more-toggle').parent()
            .hide();
          $navigator.find('.topic-navigator__item--hidden')
            .removeClass('topic-navigator__item--hidden')
            .addClass('topic-navigator__item--shown');
          isMobile = true;
        }
        else {
          $navigator.removeClass('topic-navigator--mobile');
          // Show Show more/less and hide excess articles.
          $navigator.find('.topic-navigator__more-toggle').parent()
            .show();
          $navigator.find('.topic-navigator__item--shown')
            .removeClass('topic-navigator__item--shown')
            .addClass('topic-navigator__item--hidden');
          isMobile = false;
        }
      }, 400));

      // Top level toggle behavior.
      $('.topic-navigator__toggle', context)
        .hammer()
        .on('click', function (e) {
          e.preventDefault();
          var $this = $(this);

          if (!$this.hasClass('topic-navigator__toggle--active')) {
            $('.topic-navigator__toggle', context).removeClass('topic-navigator__toggle--active').attr('aria-expanded', 'false');
            $this.addClass('topic-navigator__toggle--active').attr('aria-expanded', 'true');
          }
          else {
            $this.removeClass('topic-navigator__toggle--active').attr('aria-expanded', 'false');
          }

          if ($this.next().hasClass('topic-navigator__inner--show')) {
            $this.next().removeClass('topic-navigator__inner--show');
            $this.next().slideUp();
          }
          else {
            var $navigatorInner = $this.parent().parent().find('li .topic-navigator__inner');
            $navigatorInner.removeClass('topic-navigator__inner--show')
              .slideUp();

            $this.next().toggleClass('topic-navigator__inner--show');
            $this.next().slideToggle();

            if (!isMobile) {
              $navigatorInner.find('.topic-navigator__item--shown')
                .removeClass('topic-navigator__item--shown')
                .addClass('topic-navigator__item--hidden');

              $this.next().find('.topic-navigator__more-toggle')
                .removeClass('topic-navigator__more-toggle--active')
                .attr('aria-expanded', 'false')
                .text(Drupal.t('Show more'));
            }
          }
        });

      // See more/less toggle behavior.
      $('.topic-navigator__more-toggle', context)
        .hammer()
        .on('click', function (e) {
          e.preventDefault();
          var $this = $(this);

          if (!$this.hasClass('topic-navigator__more-toggle--active')) {
            $this.addClass('topic-navigator__more-toggle--active').attr('aria-expanded', 'true');
            $this.parent().parent().append($this.parent());
            $this.parent().parent().find('.topic-navigator__item--hidden')
              .removeClass('topic-navigator__item--hidden')
              .addClass('topic-navigator__item--shown');
            $this.text(Drupal.t('Show less'));
          }
          else {
            $this.removeClass('topic-navigator__more-toggle--active').attr('aria-expanded', 'false');
            $this.parent().parent().find('.topic-navigator__item--shown')
              .removeClass('topic-navigator__item--shown')
              .addClass('topic-navigator__item--hidden');
            $this.parent().insertAfter($this.parent().siblings('.topic-navigator__item:nth-child(3)'));
            $this.text(Drupal.t('Show more'));
          }
        });

      // Mobile toggle behavior.
      $('.topic-navigator__mobile-toggle', context)
        .on('click', function (e) {
          e.preventDefault();
        })
        .hammer()
        .on('tap press', function () {
          var $this = $(this);

          if ($this.hasClass('topic-navigator__mobile-toggle--active')) {
            $this.removeClass('topic-navigator__mobile-toggle--active');
            $('.topic-navigator--mobile', context).css({height: 'auto'});
            $('body', context).removeClass('u-noscroll');
          }
          else {
            $this.addClass('topic-navigator__mobile-toggle--active');
            $('.topic-navigator--mobile', context).css({height: 'calc(100vh - 53px)'});
            $('body', context).addClass('u-noscroll');
          }

          $navigator.find('.topic-navigator__accordion')
            .slideToggle();
        });
    }
  };
}(jQuery, Drupal));

/**
 * @file
 * loader script.
 */

(function loaderScript($, Drupal) {
  'use strict';

  Drupal.behaviors.loader = {
    attach: function (context) {

      // Implicit throbber color.
      var color = 'green';

      // In case blog search overlay is active, set the throbber color to white.
      if ($('body.blog-search-active').length > 0) {
        color = 'white';
      }

      // Define the pitnerest throbber.
      var $pin_loader = '<div class="src-Box-Box---box---bpMa_ src-Box-Box---xs-flex---1TEXs justify-around overflow-hidden"><div class="src-Spinner-Spinner---icon---3HUbA block"><svg class="src-Icon-Icon---icon---3Goc6 ' + color + ' block" height="40" width="40" viewBox="0 0 16 16" aria-label="Example spinner" role="img"><title>Example spinner</title><path d="M10 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2m0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2M6 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2m0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0"></path></svg></div></div>';

      // Execute the default throbber replace with pin styled one.
      var $drupal_loader = $('.ajax-progress.ajax-progress-fullscreen');
      $drupal_loader.html($pin_loader);

      var $hccf_loader = $('.webform-submission-help-center-contact-form-form .ajax-progress.ajax-progress-throbber', context);
      $hccf_loader.html($pin_loader);
    }
  };
}(jQuery, Drupal));

/**
 * @file
 * Code highlight script.
 */

(function codeHighlightScript($, Drupal) {
  'use strict';

  /*
   * Code Highlight.
   */
  Drupal.behaviors.codeHighlightInit = {
    attach: function () {
      hljs.initHighlightingOnLoad(); // eslint-disable-line no-undef
    }
  };
}(jQuery, Drupal));


;
