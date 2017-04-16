// declare starting variables and run functions on load
window.onload = drawStoryOptions;
var storyID = "bbaxter";
var storySelected = "These students were";
// window.onload = pageSix();

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
var controller = new ScrollMagic.Controller();
TweenLite.defaultOverwrite = false;
var drawStory_s = new ScrollMagic.Scene({
        triggerElement: '#p4'
    })
    .on("enter", function(event) {
        drawStory(storyID);
        pageSix();
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
    d3.select(".storyTime").remove();

    var controller = new ScrollMagic.Controller();
    TweenLite.defaultOverwrite = false;

    d3.json("js/data/stories/stories.json", function(data) {

        var story = data.stories.filter(function(d) {
            return ((d.id === storyID));
        });
        story = story[0];
        var storyName_content = story.name;
        var storyBio_content = story.bio;
        var storySchoolBio_content = story.schoolBio;

        storySelected = story.name + " was";
        pageSix();

        // draw basic story elements
        var storyTime = d3.select("#storyTime").append("div").attr("class", "storyTime").html("<div id='storyName'></div><div id='storyBio'></div><div id='storySchoolBio'></div><div id='storyStories'></div>")
        var name = d3.select("#storyName").append("h1").attr("class", "name").html("<span class='storyName'>" + storyName_content + "</span>");
        var bio = d3.select("#storyBio").append("div").attr("class", "bio").html("<p>" + storyBio_content + "</p>");
        var schoolBio = d3.select("#storySchoolBio").append("div").attr("class", "schoolBio").html("<p>" + storySchoolBio_content + "</p>");

        storyName_p = new ScrollMagic.Scene({
                triggerElement: "#storyName",
                duration: "100%"
            })
            .offset(document.getElementById('storyName').offsetHeight / 2 + "px")
            .setPin("#storyName")
            .addIndicators({
                name: "storyName_pin"
            })
            .addTo(controller);

        storyBio_p = new ScrollMagic.Scene({
                triggerElement: "#storyBio",
                duration: "100%"
            })
            .offset(document.getElementById('storyBio').offsetHeight / 2 + "px")
            .setPin("#storyBio")
            .addIndicators({
                name: "storyBio_pin"
            })
            .addTo(controller);

        storySchoolBio_p = new ScrollMagic.Scene({
                triggerElement: "#storySchoolBio",
                duration: "100%"
            })
            .offset(document.getElementById('storySchoolBio').offsetHeight / 2 + "px")
            .setPin("#storySchoolBio")
            .addIndicators({
                name: "storySchoolBio_pin"
            })
            .addTo(controller);

        var storyName_f = TweenMax.to("#storyName", .5, {
            opacity: "0"
        });

        var storyBio_f = TweenMax.to("#storyBio", .5, {
            opacity: "0"
        });

        var storySchoolBio_f = TweenMax.to("#storySchoolBio", .5, {
            opacity: "0"
        });

        var storyName_f_s = new ScrollMagic.Scene({
                triggerElement: "#storyBio"
            })
            .triggerHook("onEnter")
            .setTween(storyName_f)
            .addIndicators({
                name: "storyName_f"
            })
            .addTo(controller);

        var storyBio_f_s = new ScrollMagic.Scene({
                triggerElement: "#storySchoolBio"
            })
            .triggerHook("onEnter")
            .setTween(storyBio_f)
            .addIndicators({
                name: "storyName_f"
            })
            .addTo(controller);

        var storySchoolBio_f_s = new ScrollMagic.Scene({
                triggerElement: "#storyStories"
            })
            .triggerHook("onEnter")
            .setTween(storySchoolBio_f)
            .addIndicators({
                name: "storyName_f"
            })
            .addTo(controller);


        // draw each story
        for (var i = 0; i < story.story.length; i++) {
            var storyStory = d3.select("#storyStories").append("div").attr("class", "storyStories").attr("id", "story-" + i);
            if (story.story[i].quote === "") {
                storyStory.html("<p class='story-section'>" + story.story[i].section + "</p><p class='story-quote'>" + story.story[i].pre + "</p>");
            } else {
                storyStory.html("<p class='story-section'>" + story.story[i].section + "</p><p class='story-pre'>" + story.story[i].pre + "</p><p class='story-quote'>&ldquo;" + story.story[i].quote + "&rdquo;</p>");
            }

        }

        // pin and fade each story
        for (var i = 0; i < story.story.length - 1; i++) {
            var n = i + 1;
            storyStory_p = new ScrollMagic.Scene({
                    triggerElement: "#story-" + i,
                    duration: "100%"
                })
                .offset(document.getElementById('story-' + i).offsetHeight / 2 + "px")
                .setPin("#story-" + i)
                .addIndicators({
                    name: "story-" + i + "_pin"
                })
                .addTo(controller);

            var storyStory_FO_t = TweenMax.to("#story-" + i, .5, {
                opacity: "0"
            });
            if (i < story.story.length) {
                storyStory_FO_s = new ScrollMagic.Scene({
                        triggerElement: "#story-" + n
                    })
                    .triggerHook("onEnter")
                    .setTween(storyStory_FO_t)
                    .addIndicators({
                        name: "storyStory_FO_s"
                    })
                    .addTo(controller);
            }
        }
        var totalStories = story.story.length - 1;
        storyStory_last_p = new ScrollMagic.Scene({
                triggerElement: "#story-" + totalStories,
                duration: "100%"
            })
            .offset(document.getElementById('story-' + totalStories).offsetHeight / 2 + "px")
            .setPin("#story-" + totalStories)
            .addIndicators({
                name: "story-" + totalStories + "_pin"
            })
            .addTo(controller);
    });
}

function pageSix() {
    d3.select(".p6header").remove();
    var p6header = d3.select("#p6header").append("h1").attr("class", "p6header").html(storySelected + " one of an estimated <span class='orange'>150,000</span> Aboriginal children to attend a residential school in Canada.");
    var p6header2 = d3.select("#p6header2").append("h1").attr("class", "p6header").html("<span class='orange'>132</span> schools operated in every Canadian province and territory except Newfoundland, Prince Edward Island, or New Brunswick.");

    var controller = new ScrollMagic.Controller();
    TweenLite.defaultOverwrite = false;

    // var pageSix_header_p = new ScrollMagic.Scene({
    //         triggerElement: "#p6header",
    //         duration: "25%"
    //     })
    //     .triggerHook("onLeave")
    //     .offset(-window.innerHeight * .25)
    //     .setPin("#p6header")
    //     .addIndicators()
    //     .addTo(controller);
    // var pageSix_header_f = TweenMax.to("#p6header", .5, {
    //     opacity: ".25"
    // });
    // var pageSix_header_f_s = new ScrollMagic.Scene({
    //         triggerElement: "#p6header"
    //     })
    //     .triggerHook("onLeave")
    //     .offset(-window.innerHeight * .25)
    //     .setTween(pageSix_header_f)
    //     .addIndicators()
    //     .addTo(controller);
}

function studentCircles() {
    console.log("do it!");
}
