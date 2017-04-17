// declare starting variables and run functions on load
window.onload = drawStoryOptions;
var storyID = "aelias";
var storySelected = "These students were";
var orange = "#f15a24";

// header
jQuery(document).ready(function($) {
    // function drawHeader() {
    var mainHeader = $('.auto-hide-header'),
        headerHeight = mainHeader.height();

    //set scrolling variables
    var scrolling = false,
        previousTop = 0,
        currentTop = 0,
        scrollDelta = 10,
        scrollOffset = 150;

    $(window).on('scroll', function() {
        if (!scrolling) {
            scrolling = true;
            (!window.requestAnimationFrame) ?
            setTimeout(autoHideHeader, 250): requestAnimationFrame(autoHideHeader);
        }
    });

    $(window).on('resize', function() {
        headerHeight = mainHeader.height();
    });

    function autoHideHeader() {
        var currentTop = $(window).scrollTop();

        if (previousTop - currentTop > scrollDelta) {
            //if scrolling up...
            mainHeader.removeClass('is-hidden');
        } else if (currentTop - previousTop > scrollDelta && currentTop > scrollOffset) {
            //if scrolling down...
            mainHeader.addClass('is-hidden');
        }

        previousTop = currentTop;
        scrolling = false;
    }
});









// scroll jumps
// $(function() {
//     $.scrollify({
//         section: "section",
//         sectionName: "chapter-name",
//         interstitialSection: "",
//         easing: "easeOutExpo",
//         scrollSpeed: 1100,
//         offset: 0,
//         scrollbars: true,
//         standardScrollElements: ".free-scroll",
//         setHeights: false,
//         overflowScroll: true,
//         updateHash: true,
//         touchScroll: true,
//         before: function() {},
//         after: function() {},
//         afterResize: function() {},
//         afterRender: function() {}
//     });
// });

// horizontal drag on story selection
jQuery("#stories-select").draggable({
    axis: "x",
    cursor: "move",
    containment: "stories",
});

// draw first story when selection is brought into view
var controller = new ScrollMagic.Controller();
TweenLite.defaultOverwrite = false;
var drawStory_s = new ScrollMagic.Scene({
        triggerElement: '#p4'
    })
    .on("enter", function(event) {
        drawStory(storyID);
        pageSix('Albert Elias');
    })
    .triggerHook('onEnter')
    .addTo(controller);


// initialize maps
var map1 = d3.select("#map1_cont").append("div").attr("class", "map").attr("id", "map1");
d3.select("#map1").style("height", window.innerHeight + "px").style("width", window.innerWidth + "px");
var map = L.map('map1', {
    zoomControl: false,
    scrollWheelZoom: false,
    dragging: false,
    touchZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    tap: false,
    keyboard: false
}).setView([50.12052777777778, -92.01173055555556], 7);
L.tileLayer('https://api.mapbox.com/styles/v1/svickars/cj15o81vo00212rqu9mw0wgkp/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3ZpY2thcnMiLCJhIjoiY2l1aW5saDhkMDAwMTNvbDdmcTlncnp1cyJ9.wIpJKF-DW1C2uPgKnUtNWg', {}).addTo(map);

// add school points to map
var svgLayer = L.svg();
svgLayer.addTo(map);
var mapsvg = d3.select("#map1").select("svg"),
    g = mapsvg.append("g");

d3.json("js/data/school_locations.json", function(collection) {
    collection.schools.forEach(function(d) {
        d.LatLng = new L.LatLng(d.latitude,
            d.longitude);
        d.label = d.type;
    });

    var feature = g.selectAll("circle")
        .data(collection.schools)
        .enter().append("circle")
        .style("stroke", "none")
        .style("opacity", 1.0)
        .style("fill", orange)
        .attr("r", 5);
    var labelName = g.selectAll("text")
        .data(collection.schools)
        .enter().append("text")
        .attr("class", "schoolLabel")
        .attr("dy", "6px")
        .attr("dx", "10px")
        .text(function(d) {
            return d.locationName + " " + d.title;
        });

    map.on("viewreset", update);
    update();

    function update() {
        feature.attr("transform",
            function(d) {
                return "translate(" +
                    map.latLngToLayerPoint(d.LatLng).x + "," +
                    map.latLngToLayerPoint(d.LatLng).y + ")";
            }
        );
        labelName.attr("transform",
            function(d) {
                return "translate(" +
                    map.latLngToLayerPoint(d.LatLng).x + "," +
                    map.latLngToLayerPoint(d.LatLng).y + ")";
            }
        );
    }
})

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
        pageSix(storyName_content);

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
            .addTo(controller);

        storyBio_p = new ScrollMagic.Scene({
                triggerElement: "#storyBio",
                duration: "100%"
            })
            .offset(document.getElementById('storyBio').offsetHeight / 2 + "px")
            .setPin("#storyBio")
            .addTo(controller);

        storySchoolBio_p = new ScrollMagic.Scene({
                triggerElement: "#storySchoolBio",
                duration: "100%"
            })
            .offset(document.getElementById('storySchoolBio').offsetHeight / 2 + "px")
            .setPin("#storySchoolBio")
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
            .addTo(controller);

        var storyBio_f_s = new ScrollMagic.Scene({
                triggerElement: "#storySchoolBio"
            })
            .triggerHook("onEnter")
            .setTween(storyBio_f)
            .addTo(controller);

        var storySchoolBio_f_s = new ScrollMagic.Scene({
                triggerElement: "#storyStories"
            })
            .triggerHook("onEnter")
            .setTween(storySchoolBio_f)
            .addTo(controller);


        // draw each story
        for (var i = 0; i < story.story.length; i++) {
            var storyStory = d3.select("#storyStories").append("div").attr("class", "storyStories").attr("id", "story-" + i);
            var strSec = story.story[i].section,
                strPre = story.story[i].pre,
                strQuo = story.story[i].quote;
            var rs = RiString(strQuo),
                words = rs.words(),
                pos = rs.pos();

            if (story.story[i].quote === "") {
                storyStory.html("<p class='story-section'>" + strSec + "</p><p class='story-quote'>" + strPre + "</p>");
            } else {
                storyStory.html("<p class='story-section'>" + strSec + "</p><p class='story-pre'>" + strPre + "</p><p class='story-quote'>&ldquo;<span id='story-quote-" + i + "'></span>&rdquo;</p>");
            }
            for (var j = 0; j < words.length; j++) {
                if (/[,.?\-]/.test(words[j + 1])) {
                    var storyQuote = d3.select("#story-quote-" + i).append("span").attr("id", "quote-" + j).attr("class", "pos-" + pos[j]).html(words[j]);
                } else {
                    var storyQuote = d3.select("#story-quote-" + i).append("span").attr("id", "quote-" + j).attr("class", "pos-" + pos[j]).html(words[j] + " ");
                }
            }
        }

        // pin and fade each story
        for (var i = 0; i < story.story.length - 1; i++) {
            var n = i + 1;
            var storyStory_p = new ScrollMagic.Scene({
                    triggerElement: "#story-" + i,
                    duration: "100%"
                })
                .offset(document.getElementById('story-' + i).offsetHeight / 2 + "px")
                .setPin("#story-" + i)
                .addTo(controller);

            var storyStory_FO_t = TweenMax.to("#story-" + i, .5, {
                opacity: "0"
            });
            if (i < story.story.length) {
                var storyStory_FO_s = new ScrollMagic.Scene({
                        triggerElement: "#story-" + n
                    })
                    .triggerHook("onEnter")
                    .setTween(storyStory_FO_t)
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
            .addTo(controller);
        var storyStory_FO_t = TweenMax.to("#story-" + totalStories, .5, {
            opacity: "0"
        });
        var storyStory_FO_s = new ScrollMagic.Scene({
                triggerElement: "#p6",
            })
            .triggerHook("onEnter")
            .setTween(storyStory_FO_t)
            .addTo(controller);
    });
}

function pageSix(name) {
    // d3.select("#map1").remove();

    d3.select(".p6header").remove();
    var p6header = d3.select("#p6header").append("h1").attr("class", "p6header").html(storySelected + " one of an estimated <span class='orange'>150,000</span> Aboriginal children to attend a residential school in Canada.");

    var controller = new ScrollMagic.Controller();
    TweenLite.defaultOverwrite = false;
    d3.json("js/data/stories/stories.json", function(data) {

        data = data.stories.filter(function(d) {
            return ((d.name === name));
        });
        data = data[0];

        // set map 1 view
        map.setView([data.latLng.lat, data.latLng.lng], data.zoom, {
            "animate": false
        });

    });
    var map1_p = new ScrollMagic.Scene({
            triggerElement: "#tMap1_p",
            duration: "200%"
        })
        .triggerHook("onLeave")
        .setPin("#map1")
        .addIndicators({
            name: "map_pin"
        })
        .addTo(controller);
}
