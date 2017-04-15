var controller = new ScrollMagic.Controller();
TweenLite.defaultOverwrite = false;

// declare starting variables and run functions on load
window.onload = drawStoryOptions;
var storyID = "bbaxter";
// window.onload = drawStory(storyID);

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


// draw first story when selection is brought into view
var drawStory_s = new ScrollMagic.Scene({
        triggerElement: '#p4'
    })
    .on("enter", function(event) {
        drawStory(storyID);
    })
    .triggerHook('onEnter')
    .addIndicators({
        name: 'drawStory'
    })
    .addTo(controller);


// draw story options
function drawStoryOptions() {
    d3.json("js/data/stories/stories.json", function(data) {
        for (var j = 0; j < data.stories.length; j++) {

            var story_option_container = d3.select("#stories-select").append("div").attr("class", "story-option-container").attr("id", data.stories[j].id).on("click", function(d, i) {
                storyID = d3.select(this).attr("id");
                d3.selectAll(".story-option-container").transition().duration(200).ease(d3.easeLinear).style("opacity", .1);
                d3.select("#" + storyID).transition().duration(200).ease(d3.easeLinear).style("opacity", 1.0);
                console.log(storyID);
                drawStory(storyID);
            });

            var story_option_circle = d3.select("#" + data.stories[j].id).append("div").attr("class", "story-option-circle").attr("id", "story-option" + j);

            story_option_circle.style("background", "linear-gradient(rgba(241, 90, 36, 0.25),rgba(241, 90, 36, 0.25)), url('js/data/stories/images/" + data.stories[j].picture + "'), rgb(241, 90, 36)").style("background-size", "10em");

            var story_option_label = d3.select("#" + data.stories[j].id).append("div").attr("class", "story-label");
            story_option_label.html("<p class='story-option-name'>" + data.stories[j].name + "</p><p class='story-option-quote'>&ldquo;" + data.stories[j].pull + "&rdquo;</p>");

        }
    });

}

function drawStory(storyID) {
    // remove previous
    d3.select(".name").remove();
    d3.select(".bio").remove();

    d3.json("js/data/stories/stories.json", function(data) {
        var story = data.stories.filter(function(d) {
            return ((d.id == storyID));
        })
        story = story[0];
        var name = d3.select("#storyName").append("h1").attr("class", "name").html("<span class='storyName'>" + story.name + "</span>");
        var bio = d3.select("#storyBio").append("p").attr("class", "bio").html(story.bio);
    });

}

var storyName_FI_t = TweenMax.to("#storyName", 1, {
    opacity: "1.0"
});

var storyName_FI_s = new ScrollMagic.Scene({
        triggerElement: "#storyNameFI"
    })
    // .offset(document.getElementById('s3_intro').offsetHeight / 2)
    .triggerHook("onLeave")
    .setTween(storyName_FI_t)
    .addIndicators({
        name: "storyName_FI_s"
    })
    .addTo(controller);

var storyName_p = new ScrollMagic.Scene({
        triggerElement: "#p5",
        duration: "50%"
    })
    .triggerHook("onLeave")
    .setPin("#storyName")
    .addIndicators({
        name: "storyName_pin"
    })
    .addTo(controller);
