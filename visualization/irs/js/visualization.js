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
    mainHeader.addClass('is-hidden');

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

function researchMode() {
    var cmStory = $("#mStory"),
        cmResearch = $("#mResearch");
    cmStory.removeClass("viewerChosen");
    cmResearch.addClass("viewerChosen");
}

function storyMode() {
    var cmStory = $("#mStory"),
        cmResearch = $("#mResearch");
    cmResearch.removeClass("viewerChosen");
    cmStory.addClass("viewerChosen");
}







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
    zoomControl: true,
    scrollWheelZoom: false,
    dragging: !L.Browser.mobile,
    touchZoom: true,
    doubleClickZoom: true,
    boxZoom: false,
    tap: false,
    keyboard: false
}).setView([50.12052777777778, -92.01173055555556], 7);
L.tileLayer('https://api.mapbox.com/styles/v1/svickars/cj15o81vo00212rqu9mw0wgkp/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3ZpY2thcnMiLCJhIjoiY2l1aW5saDhkMDAwMTNvbDdmcTlncnp1cyJ9.wIpJKF-DW1C2uPgKnUtNWg', {}).addTo(map);
var map1_p = new ScrollMagic.Scene({
        triggerElement: "#tMap1_p",
        duration: "500%"
    })
    .triggerHook("onLeave")
    .setPin("#map1_cont")
    .addIndicators({
        name: "map_pin"
    })
    .addTo(controller);

// add school points to map
var svgLayer = L.svg();
svgLayer.addTo(map);
var mapsvg = d3.select("#map1").select("svg"),
    g = mapsvg.append("g");

d3.json("js/data/locations.json", function(collection) {

    collection.schools.forEach(function(d) {
        d.LatLng = new L.LatLng(d.latitude,
            d.longitude);
    });
    collection.reservations.forEach(function(d) {
        d.LatLng = new L.LatLng(d.lat,
            d.lng);
    });


    var featureR = g.selectAll(".rDot")
        .data(collection.reservations)
        .enter().append("circle", ".rDot")
        .attr("pointer-events", "visible")
        .attr("class", function(d) {
            return "rDot reserveDot " + d.listConnections;
        })
        .attr("id", function(d) {
            return "rDot-" + d.id;
        })
        .style("stroke", "none")
        .style("display", "none")
        .style("opacity", "0")
        .style("fill", "#333")
        .attr("r", 15)
        .on("mouseover", reserveDotMouseIn)
        .on("mouseout", reserveDotMouseOut);



    var feature = g.selectAll(".sCircle")
        .data(collection.schools)
        .enter().append("circle", ".sCircle")
        .attr("class", function(d) {
            return "schoolMarker dot " + d.listConnections;
        })
        .attr("pointer-events", "visible")
        .attr("id", function(d) {
            return "dot-" + d.schoolID;
        })
        .style("stroke", "none")
        .style("opacity", 1.0)
        .style("fill", orange)
        .attr("r", 5)
        .on("mouseover", schoolDotMouseIn)
        .on("mouseout", schoolDotMouseOut)




    var labelName = g.selectAll("text")
        .data(collection.schools)
        .enter().append("text")
        .attr("class", "label schoolLabel")
        .attr("id", function(d) {
            return "label-" + d.schoolID;
        })
        .attr("dy", "6px")
        .attr("dx", "10px")
        .text(function(d) {
            return d.locationName + " " + d.title;
        });

    var rTip = g.selectAll(".rTip")
        .data(collection.reservations)
        .enter().append("text", ".rtip")
        .attr("class", "rTooltip")
        .attr("id", function(d) {
            return "rTip-" + d.id;
        })
        .attr("dx", "20px")
        .attr("dy", "5px")
        .text(function(d) {
            return d.reserve
        });

    var sTip = g.selectAll(".sTip")
        .data(collection.schools)
        .enter().append("text", ".stip")
        .attr("class", "sTooltip")
        .attr("id", function(d) {
            return "sTip-" + d.schoolID;
        })
        .attr("dx", "9px")
        .attr("dy", "5px")
        .text(function(d) {
            return d.locationName + " " + d.title;
        });

    var sTip2 = g.selectAll(".sTip2")
        .data(collection.schools)
        .enter().append("text", ".stip2")
        .attr("class", "sTooltip2")
        .attr("id", function(d) {
            return "sTip-" + d.schoolID;
        })
        .attr("dx", "9px")
        .attr("dy", "19px")
        .text(function(d) {
            return d.start + " - " + d.end;
        });


    map.on("viewreset", update);
    map.on("zoomend", update);
    update();

    function update() {
        feature.attr("transform",
            function(d) {
                return "translate(" +
                    map.latLngToLayerPoint(d.LatLng).x + "," +
                    map.latLngToLayerPoint(d.LatLng).y + ")";
            }
        );
        sTip.attr("transform",
            function(d) {
                return "translate(" +
                    map.latLngToLayerPoint(d.LatLng).x + "," +
                    map.latLngToLayerPoint(d.LatLng).y + ")";
            }
        );
        sTip2.attr("transform",
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
        featureR.attr("transform",
            function(d) {
                return "translate(" +
                    map.latLngToLayerPoint(d.LatLng).x + "," +
                    map.latLngToLayerPoint(d.LatLng).y + ")";
            }
        );
        rTip.attr("transform",
            function(d) {
                return "translate(" +
                    map.latLngToLayerPoint(d.LatLng).x + "," +
                    map.latLngToLayerPoint(d.LatLng).y + ")";
            }
        );

    }

    function schoolDotMouseIn(d) {
        // remove schoolMarker class from current dot and dim all school dots, except current
        d3.select("#dot-" + d.schoolID).classed("schoolMarker", false);
        d3.selectAll(".schoolMarker").style("opacity", ".25");

        // turn current dot dark gray
        d3.select("#dot-" + d.schoolID).style("fill", "#333").style("opacity", 1);

        // turn on school tooltip for current dot
        d3.selectAll("#sTip-" + d.schoolID).style("opacity", "1.0");

        // for schools with known reserve connections
        if (d.listConnections === "") {} else {
            // remove reserveDot class from the ones this school is connected to and un-dim those guys
            d3.selectAll(d.class).classed("reserveDot", false).classed("connection", false);
            d3.selectAll(d.class).style("opacity", ".6");
        }
        // dim the rest even more
        d3.selectAll(".reserveDot").style("opacity", ".05");
        d3.selectAll(".connection").style("opacity", ".05");

    };

    function reserveDotMouseIn(d) {
        // remove reserveDot class from current dot and dim all school dots, except current
        d3.select("#rDot-" + d.id).classed("reserveDot", false);
        d3.selectAll(".reserveDot").style("opacity", ".025").style("fill", "#333");


        // turn on school tooltip for current dot
        d3.selectAll("#rTip-" + d.id).style("opacity", "1.0");

        // for schools with known reserve connections
        if (d.listConnections === "") {} else {
            // remove reserveDot class from the ones this school is connected to and un-dim those guys
            d3.selectAll(d.class).classed("schoolMarker", false).classed("connection", false);
            d3.selectAll(d.class).style("opacity", "1");
            // unDim current dot
            d3.select("#rDot-" + d.id).style("opacity", .25);
        }
        // dim the rest even more
        d3.selectAll(".schoolMarker").style("opacity", ".25");
        d3.selectAll(".connection").style("opacity", ".05");
    };

    function schoolDotMouseOut(d) {
        // add schoolMarker class back on to all school dots and un-dim them all
        d3.selectAll(".dot").classed("schoolMarker", true);
        d3.selectAll(".schoolMarker").style("fill", orange).style("opacity", "1");

        // turn off tooltips
        d3.selectAll("#sTip-" + d.schoolID).style("opacity", "0");
        d3.selectAll(".sTooltip").style("opacity", "0");
        d3.selectAll(".sTooltip2").style("opacity", "0");

        // reapply reserveDot class to all reserve dots and un-dim and re-dim
        d3.selectAll(".rDot").classed("reserveDot", true);
        d3.selectAll(".reserveDot").style("opacity", ".1");

        // reapply connection class to all connections and un-dim and re-dim
        d3.selectAll(".conn").classed("connection", true);
        d3.selectAll(".connection").style("opacity", "0.25");
    };

    function reserveDotMouseOut(d) {
        // remove reserveDot class from current dot and dim all school dots, except current
        d3.selectAll(".rDot").classed("reserveDot", true);
        d3.selectAll(".reserveDot").style("opacity", ".1");
        d3.selectAll(".dot").classed("schoolMarker", true)
        d3.selectAll(".schoolMarker").style("opacity", "1");
        d3.selectAll(".conn").classed("connection", true);
        d3.selectAll(".connection").style("opacity", "0.25");

        // turn off tooltips
        d3.selectAll("#rTip-" + d.id).style("opacity", "0");
        d3.selectAll(".rTooltip").style("opacity", "0");
    };

});


d3.json("js/data/connections.json", function(collection) {
    collection.forEach(function(d) {
        d.sLatLng = new L.LatLng(d.sLat,
            d.sLng);
        d.eLatLng = new L.LatLng(d.eLat,
            d.eLng);
    });

    var connectionFeature = g.selectAll("line")
        .data(collection)
        .enter().append("line")
        .attr("class", function(d) {
            return "connection conn " + d.id;
        })
        .attr("id", function(d) {
            return "conn-" + d.id;
        })
        .style("stroke", orange)
        .style("opacity", 0.25);

    var drawn = false;

    map.on("viewreset", update);
    map.on("zoomend", update);
    update();

    var map1_connections_s = new ScrollMagic.Scene({
            triggerElement: '#tMap1_connections'
        })
        .addTo(controller);

    map1_connections_s.on("progress", function(event) {
        var dir = event.scrollDirection;
        if (dir === "FORWARD") {
            drawn = true;
            connectionFeature.transition().duration(1500)
                .attr("x2",
                    function(d) {
                        return map.latLngToLayerPoint(d.eLatLng).x;
                    }
                )
                .attr("y2",
                    function(d) {
                        return map.latLngToLayerPoint(d.eLatLng).y;
                    }
                );
        } else {
            drawn = false;
            connectionFeature.transition().duration(1500)
                .attr("x2",
                    function(d) {
                        return map.latLngToLayerPoint(d.sLatLng).x;
                    }
                )
                .attr("y2",
                    function(d) {
                        return map.latLngToLayerPoint(d.sLatLng).y;
                    }
                );
        };
    })

    function update() {
        if (drawn === false) {
            connectionFeature.attr("x1",
                    function(d) {
                        return map.latLngToLayerPoint(d.sLatLng).x;
                    }
                )
                .attr("y1",
                    function(d) {
                        return map.latLngToLayerPoint(d.sLatLng).y;
                    }
                )
                .attr("x2",
                    function(d) {
                        return map.latLngToLayerPoint(d.sLatLng).x;
                    }
                )
                .attr("y2",
                    function(d) {
                        return map.latLngToLayerPoint(d.sLatLng).y;
                    }
                );
        } else {
            connectionFeature.attr("x1",
                    function(d) {
                        return map.latLngToLayerPoint(d.sLatLng).x;
                    }
                )
                .attr("y1",
                    function(d) {
                        return map.latLngToLayerPoint(d.sLatLng).y;
                    }
                )
                .attr("x2",
                    function(d) {
                        return map.latLngToLayerPoint(d.eLatLng).x;
                    }
                )
                .attr("y2",
                    function(d) {
                        return map.latLngToLayerPoint(d.eLatLng).y;
                    }
                );
        }
    }

});

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

            if (story.story[i].quote === "") {
                var strSec = story.story[i].section,
                    strPre = story.story[i].pre;
                storyStory.html("<p class='story-section'>" + strSec + "</p><p class='story-quote'>" + strPre + "</p>");
            } else {
                var strSec = story.story[i].section,
                    strPre = story.story[i].pre,
                    strQuo = story.story[i].quote;
                var rs = RiString(strQuo),
                    words = rs.words(),
                    pos = rs.pos();
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

    d3.selectAll(".overlay").remove();
    d3.selectAll(".dot").classed("schoolMarker", true).style("opacity", 1);
    d3.selectAll(".label").classed("schoolLabel", true).style("opacity", 1);

    var oneofText = d3.select("#oneof").append("div").attr("class", "overlay").html(storySelected + " one of an estimated <span class='orange'>150,000</span> Aboriginal children to attend a residential school in Canada.");

    var thismanytext = d3.select("#thismany").append("div").attr("class", "overlay").html("There were <span class='orange'>132</span> schools located throughout the country.");

    var fromreservestext = d3.select("#fromreserves").append("div").attr("class", "overlay").html("Students were drawn from reserves, bands, and tribes all over Canada, some as far away as <span class='orange'>8000km</span>.");

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

        d3.select("#dot-" + data.schoolID).classed("schoolMarker", false);
        d3.select("#label-" + data.schoolID).classed("schoolLabel", false);
        // zoom out
        var map1_zo_s = new ScrollMagic.Scene({
                triggerElement: '#tMap1_zo'
            })
            .addTo(controller);

        map1_zo_s.on("progress", function(event) {
            var dir = event.scrollDirection;
            if (dir === "FORWARD") {
                d3.selectAll(".schoolLabel").style("opacity", "0");
                d3.selectAll(".schoolMarker").style("opacity", "0");
                map.setView([57, -100], 4.5, {
                    "animate": true
                });
            } else {
                d3.select("#dot-" + data.schoolID).style("opacity", 1);
                d3.select("#label-" + data.schoolID).style("opacity", 1);
                map.setView([data.latLng.lat, data.latLng.lng], data.zoom, {
                    "animate": true
                });
            };
        });

        // show school markers
        var map1_irs_s = new ScrollMagic.Scene({
                triggerElement: '#tMap1_irs'
            })
            .addTo(controller);

        map1_irs_s.on("progress", function(event) {
            var dir = event.scrollDirection;
            if (dir === "FORWARD") {
                d3.selectAll(".schoolMarker").transition().duration(600).ease(d3.easeLinear).style("opacity", 1);
                d3.select("#label-" + data.schoolID).transition().duration(600).ease(d3.easeLinear).style("opacity", 0);
            } else {
                d3.selectAll(".schoolMarker").transition().duration(600).ease(d3.easeLinear).style("opacity", 0);
                d3.select("#label-" + data.schoolID).transition().duration(600).ease(d3.easeLinear).style("opacity", 1);
            };
        })

        // show reserves
        var map1_reserves_s = new ScrollMagic.Scene({
                triggerElement: '#tMap1_reserves'
            })
            .addTo(controller);

        map1_reserves_s.on("progress", function(event) {
            var dir = event.scrollDirection;
            if (dir === "FORWARD") {
                d3.selectAll(".reserveDot").style("display", "block").transition().duration(600).ease(d3.easeLinear).style("opacity", 0.1);
            } else {
                d3.selectAll(".reserveDot").transition().duration(600).ease(d3.easeLinear).style("opacity", 0);
                d3.selectAll(".reserveDot").transition().delay(600).style("display", "none");
            };
        })

        var oneof_p_s = new ScrollMagic.Scene({
                triggerElement: "#oneof",
                duration: "100%"
            })
            .offset(document.getElementById('oneof').offsetHeight / 2 + "px")
            .setPin("#oneof")
            .addTo(controller);
        // var oneof_fo_t = TweenMax.to("#oneof", .5, {
        //     opacity: "0"
        // });
        // var oneof_fo_s = new ScrollMagic.Scene({
        //         triggerElement: "#thismany",
        //     })
        //     .triggerHook("onEnter")
        //     .setTween(oneof_fo_t)
        //     .addTo(controller);

        var thismany_p_s = new ScrollMagic.Scene({
                triggerElement: "#thismany",
                duration: "100%"
            })
            .offset(document.getElementById('thismany').offsetHeight / 2 + "px")
            .setPin("#thismany")
            .addTo(controller);
        // var thismany_fo_t = TweenMax.to("#thismany", .5, {
        //     opacity: "0"
        // });
        // var oneof_fo_s = new ScrollMagic.Scene({
        //         triggerElement: "#tMap1_reserves",
        //     })
        //     .setTween(thismany_fo_t)
        //     .addTo(controller);

        var fromreserves_p_s = new ScrollMagic.Scene({
                triggerElement: "#fromreserves",
                duration: "100%"
            })
            .offset(document.getElementById('fromreserves').offsetHeight / 2 + "px")
            .setPin("#fromreserves")
            .addTo(controller);
        // var fromreserves_fo_t = TweenMax.to("#fromreserves", .5, {
        //     opacity: "0"
        // });
        // var fromreserves_fo_s = new ScrollMagic.Scene({
        //         triggerElement: "#tMap1_reserves",
        //     })
        //     .setTween(fromreserves_fo_t)
        //     .addTo(controller);
    });

}

function camelize(str) {
    return str.replace(/[.,\'\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
        return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
}
