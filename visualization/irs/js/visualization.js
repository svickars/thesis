var controller = new ScrollMagic.Controller();
TweenLite.defaultOverwrite = false;

// scroll jumps

$(function() {
    $.scrollify({
        section: "section",
        sectionName: "chapter-name",
        interstitialSection: "",
        easing: "easeOutExpo",
        scrollSpeed: 1100,
        offset: 0,
        scrollbars: true,
        standardScrollElements: "scroll",
        setHeights: false,
        overflowScroll: true,
        updateHash: true,
        touchScroll: true,
        before: function() {},
        after: function() {},
        afterResize: function() {},
        afterRender: function() {}
    });
});

// var p1j = new ScrollMagic.Scene({
//                 triggerElement: '#p2'
//             })
//             .on('enter', function(event) {
//                 console.log('hello');
//             })
//             .triggerHook('onEnter')
//             .addIndicators({
//                 name: 'p1j'
//             })
//             .addTo(controller);
