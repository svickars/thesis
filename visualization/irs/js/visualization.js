var controller = new ScrollMagic.Controller();
TweenLite.defaultOverwrite = false;

window.onload = drawStoryOptions;

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
        standardScrollElements: ".free-scroll",
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

// horizontal drag on story selection
jQuery("#stories-select").draggable({
    axis: "x",
    cursor: "move",
    containment: "stories",
    // stop: function() {
    //     if (jQuery("#stories-select").position().left < 1)
    //         jQuery("#stories-select").css("left", "720px");
    // }
});


// draw stories
function drawStoryOptions() {
    d3.json("js/data/stories/stories.json", function(data) {
        for (var i = 0; i < data.stories.length; i++) {
            console.log(data.stories[i].name);
            var story_option_container = d3.select("#stories-select").append("div").attr("class", "story-option-container").attr("id", "story-option-container-" + i).on("click", function(i) {
                console.log(i);
            });

            var story_option_circle = d3.select("#story-option-container-" + i).append("div").attr("class", "story-option-circle").attr("id", "story-option" + i);

            story_option_circle.style("background", "linear-gradient(rgba(241, 90, 36, 0.25),rgba(241, 90, 36, 0.25)), url('js/data/stories/images/" + data.stories[i].picture + "'), rgb(241, 90, 36)").style("background-size", "10em");

            var story_option_label = d3.select("#story-option-container-" + i).append("div").attr("class", "story-label");
            story_option_label.html("<p class='story-option-name'>" + data.stories[i].name + "</p><p class='story-option-quote'>&ldquo;" + data.stories[i].pull + "&rdquo;</p>");

            // var story_option_circle = d3.select("#stories-select").append("div").attr("class", "story-option").attr("id", "data.stories[i].id");
        }
    });

    function storyClick(i) {
        console.log(i);
    }
}
