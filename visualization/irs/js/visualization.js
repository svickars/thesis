// GLOBAL
// draw first story when page is loaded
var storyID = "mbrown";
window.onload = drawStory(storyID);
var orange = "#f15a24";
var rightBar = false;
var status = "begin";
var drawn = false;

// SCROLLMAGIC
// define global controller
var controller = new ScrollMagic.Controller();
TweenLite.defaultOverwrite = false;

// MAPBOX
// initialize main map
var map1 = d3.select("#map1_cont").append("div").attr("class", "map").attr("id", "map");
d3.select("#map").style("height", window.innerHeight + "px").style("width", window.innerWidth + "px");

mapboxgl.accessToken = 'pk.eyJ1Ijoic3ZpY2thcnMiLCJhIjoiY2l1aW5saDhkMDAwMTNvbDdmcTlncnp1cyJ9.wIpJKF-DW1C2uPgKnUtNWg';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/svickars/cj15o81vo00212rqu9mw0wgkp',
  center: [-92.01173055555556, 50.12052777777778],
  zoom: 9,
  attributionControl: false
});
map.scrollZoom.disable();
map.dragRotate.disable();
map.addControl(new mapboxgl.Navigation());

// scrollmagic: pin main map
var map1_p = new ScrollMagic.Scene({
    triggerElement: "#tMap1_p",
    duration: "800%"
  })
  .triggerHook("onLeave")
  .setPin("#map1_cont")
  .on("enter", function() {
    status = "map";
  })
  .addTo(controller);

// Setup our svg layer that we can manipulate with d3
var container = map.getCanvasContainer();
var svg = d3.select(container).append("svg"),
  g = svg.append("g");

function getD3() {
  var bbox = document.body.getBoundingClientRect();
  var center = map.getCenter();
  var zoom = map.getZoom();
  // 512 is hardcoded tile size, might need to be 256 or changed to suit your map config
  var scale = (512) * 0.5 / Math.PI * Math.pow(2, zoom);

  var d3projection = d3.geoMercator()
    .center([center.lng, center.lat])
    .translate([bbox.width / 2, bbox.height / 2])
    .scale(scale);

  return d3projection;
}

var d3Projection = getD3();
var path = d3.geoPath()


d3.json("js/data/locations.json", function(collection) {

  var labelName = g.selectAll("text")
    .data(collection.schools)
    .enter().append("text")
    .attr("class", "label schoolLabel")
    .attr("id", function(d) {
      return "label-" + d.schoolID;
    })
    .attr("pointer-events", "none")
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
    .attr("pointer-events", "none")
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
    .attr("pointer-events", "none")
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
    .attr("pointer-events", "none")
    .attr("dx", "9px")
    .attr("dy", "19px")
    .text(function(d) {
      return d.start + " - " + d.end;
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
    .attr("r", 15);

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
    .attr("r", 5);



  function render() {
    d3Projection = getD3();
    path.projection(d3Projection)

    feature.attr("cx", function(d) {
        return d3Projection([d.longitude, d.latitude])[0];
      })
      .attr("cy", function(d) {
        return d3Projection([d.longitude, d.latitude])[1];
      });
    sTip.attr("x", function(d) {
        return d3Projection([d.longitude, d.latitude])[0];
      })
      .attr("y", function(d) {
        return d3Projection([d.longitude, d.latitude])[1];
      });
    sTip2.attr("x", function(d) {
        return d3Projection([d.longitude, d.latitude])[0];
      })
      .attr("y", function(d) {
        return d3Projection([d.longitude, d.latitude])[1];
      });
    labelName.attr("x", function(d) {
        return d3Projection([d.longitude, d.latitude])[0];
      })
      .attr("y", function(d) {
        return d3Projection([d.longitude, d.latitude])[1];
      });
    featureR.attr("cx", function(d) {
        return d3Projection([d.lng, d.lat])[0];
      })
      .attr("cy", function(d) {
        return d3Projection([d.lng, d.lat])[1];
      });
    rTip.attr("x", function(d) {
        return d3Projection([d.lng, d.lat])[0];
      })
      .attr("y", function(d) {
        return d3Projection([d.lng, d.lat])[1];
      });

    feature.on("mouseover", schoolDotMouseIn)
      .on("click", function(d) {
        rightBarOut(d);
        d3.event.stopPropagation();
      })
      .on("mouseout", schoolDotMouseOut);

    featureR.on("mouseover", reserveDotMouseIn)
      .on("mouseout", reserveDotMouseOut);

  }

  // re-render our visualization whenever the view changes
  map.on("viewreset", function() {
    render()
  })
  map.on("move", function() {
    render()
  })

  // render our initial visualization
  render()

  // interactions
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
})

d3.json("js/data/connections.json", function(collection) {

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
            return d3Projection([d.eLng, d.eLat])[0];
          }
        )
        .attr("y2",
          function(d) {
            return d3Projection([d.eLng, d.eLat])[1];
          }
        );
    } else {
      drawn = false;
      connectionFeature.transition().duration(1500)
        .attr("x2",
          function(d) {
            return d3Projection([d.sLng, d.sLat])[0];
          }
        )
        .attr("y2",
          function(d) {
            return d3Projection([d.sLng, d.sLat])[1];
          }
        );
    };
  })

  function render() {
    d3Projection = getD3();
    path.projection(d3Projection)

    if (drawn === false) {
      connectionFeature.attr("x1",
          function(d) {
            return d3Projection([d.sLng, d.sLat])[0];
          }
        )
        .attr("y1",
          function(d) {
            return d3Projection([d.sLng, d.sLat])[1];
          }
        )
        .attr("x2",
          function(d) {
            return d3Projection([d.sLng, d.sLat])[0];
          }
        )
        .attr("y2",
          function(d) {
            return d3Projection([d.sLng, d.sLat])[1];
          }
        );
    } else {
      connectionFeature.attr("x1",
          function(d) {
            return d3Projection([d.sLng, d.sLat])[0];
          }
        )
        .attr("y1",
          function(d) {
            return d3Projection([d.sLng, d.sLat])[1];
          }
        )
        .attr("x2",
          function(d) {
            return d3Projection([d.eLng, d.eLat])[0];
          }
        )
        .attr("y2",
          function(d) {
            return d3Projection([d.eLng, d.eLat])[1];
          }
        );
    }
  }

  // re-render our visualization whenever the view changes
  map.on("viewreset", function() {
    render()
  })
  map.on("move", function() {
    render()
  })
  map.on("rotate", function() {
    render()
  })

  // render our initial visualization
  render()
})



// STORY OPTIONS
// use jquery to make this box side-scrollable
jQuery("#stories-select").draggable({
  axis: "x",
  cursor: "move",
  containment: "stories",
});

// scrollmagic: pin story select and horizontal scroll
var storiesSelectScroll = new TimelineMax()
  .to("#stories-select", 1, {
    x: "-50%",
    delay: .25
  });

var p4pin = new ScrollMagic.Scene({
    triggerElement: "#p4",
    triggerHook: "onLeave",
    duration: "200%"
  })
  .setPin("#p4")
  .setTween(storiesSelectScroll)
  .addTo(controller);

// draw a circle for each available story and add their name and pullquote
d3.json("js/data/stories/stories.json", function(data) {
  for (var j = 0; j < data.stories.length; j++) {
    var story_option_container = d3.select("#stories-select").append("div").attr("class", "story-option-container").attr("id", data.stories[j].id)
      .on("click", function(d, i) {
        storyID = d3.select(this).attr("id");
        d3.selectAll(".story-option-container").transition().duration(200).ease(d3.easeLinear).style("opacity", .1);
        d3.select("#" + storyID).transition().duration(200).ease(d3.easeLinear).style("opacity", 1.0);
        drawStory(storyID);
        p4pin.destroy();
      });
    var story_option_circle = d3.select("#" + data.stories[j].id).append("div").attr("class", "story-option-circle").attr("id", "story-option" + j);

    // set background image of circle
    story_option_circle.style("background", "linear-gradient(rgba(241, 90, 36, 0.25),rgba(241, 90, 36, 0.25)), url('js/data/stories/images/" + data.stories[j].picture + "'), rgb(241, 90, 36)").style("background-size", "10em");

    var story_option_label = d3.select("#" + data.stories[j].id).append("div").attr("class", "story-label");
    story_option_label.html("<p class='story-option-name'>" + data.stories[j].name + "</p><p class='story-option-quote'>&ldquo;" + data.stories[j].pull + "&rdquo;</p>");
  }
});


// STORIES
// declare function that is called when story is clicked
function drawStory(storyID) {
  // remove previous elements
  d3.select(".storyTime").remove();

  // draw story elements
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

    // view of map

    map.flyTo({
      center: [data.latLng.lng, data.latLng.lat],
      zoom: data.zoom,
      bearing: 0,
      speed: 100,
      curve: 1,

      easing: function(t) {
        return t;
      }
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

        map.flyTo({
          center: [-100, 58],
          zoom: 4,
          bearing: 0,
          speed: 1,
          curve: 1,

          easing: function(t) {
            return t;
          }
        });
      } else {
        d3.select("#dot-" + data.schoolID).style("opacity", 1);
        d3.select("#label-" + data.schoolID).style("opacity", 1);
        map.flyTo({
          center: [data.latLng.lng, data.latLng.lat],
          zoom: data.zoom,
          bearing: 0,
          speed: 5,
          curve: 1,

          easing: function(t) {
            return t;
          }
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
        duration: "150%"
      })
      .offset(document.getElementById('oneof').offsetHeight / 2 + "px")
      .setPin("#oneof")
      .addTo(controller);
    var oneof_fo_t = TweenMax.to("#oneof", .5, {
      opacity: "0"
    });
    var oneof_fo_s = new ScrollMagic.Scene({
        triggerElement: "#thismany",
      })
      .triggerHook("onEnter")
      .setTween(oneof_fo_t)
      .addTo(controller);

    var thismany_p_s = new ScrollMagic.Scene({
        triggerElement: "#thismany",
        duration: "150%"
      })
      .offset(document.getElementById('thismany').offsetHeight / 2 + "px")
      .setPin("#thismany")
      .addTo(controller);
    var thismany_fo_t = TweenMax.to("#thismany", .5, {
      opacity: "0"
    });
    var thismany_fo_s = new ScrollMagic.Scene({
        triggerElement: "#fromreserves",
      })
      .triggerHook("onEnter")
      .setTween(thismany_fo_t)
      .addTo(controller);


    var fromreserves_p_s = new ScrollMagic.Scene({
        triggerElement: "#fromreserves",
        duration: "100%"
      })
      .offset(document.getElementById('fromreserves').offsetHeight / 2 + "px")
      .setPin("#fromreserves")
      .addTo(controller);
    var fromreserves_fo_t = TweenMax.to("#fromreserves", .5, {
      opacity: "0"
    });
    var fromreserves_fo_s = new ScrollMagic.Scene({
        triggerElement: "#tMap1_connections",
      })
      .triggerHook("onLeave")
      .setTween(fromreserves_fo_t)
      .addTo(controller);
  });

}

function rightBarOut(data) {
  setTimeout(function() {
    rightBar = true;
    rightBarCurrent = true;
  }, 500);
  var lat = data.latitude,
    lng = data.longitude;


  rightBarData(data);

  // slide out right bar, shrink mapbox, hide and fade back in controller
  d3.select("#rightBar").classed("rightBarOut", true);
  // d3.select(".mapboxgl-ctrl-top-right").transition().duration(0).style("opacity", 0);

  var mapWidth = window.innerWidth / 2;

  d3.select("#map").transition().delay(500).duration(0).style("height", window.innerHeight + "px").style("width", mapWidth + "px");
  d3.select(".mapboxgl-ctrl-top-right").transition().delay(500).duration(500).style("opacity", 1);

  map.flyTo({
    center: [lng, lat],
    zoom: 10,
    bearing: 0,
    speed: 1,
    curve: 1,

    easing: function(t) {
      return t;
    }
  });

  if (data.listConnections === "") {} else {
    // remove reserveDot class from the ones this school is connected to and un-dim those guys
    d3.selectAll(data.class).classed("reserveDot", false).classed("connection", false);
    d3.selectAll(data.class).style("opacity", ".6");
  }
}

map.on("click", function(d) {
  if (rightBar === true) {
    rightBarBack(d);
  }
})

function rightBarData(data) {
  d3.selectAll(".rRemove").remove();
  // var rightBarNeg = $("#rightBar").width() + 30;
  // d3.select("#rightBar").style("right", "-" + rightBarNeg + "px");
  var all = data;
  d3.json("js/data/schools/" + data.schoolID + ".json", function(school) {
    var rTitle = d3.select("#rTitle").append("h2").attr("class", "rRemove").html(school.name.replace("IRS", "Indian Residential School").replace("RS", "Residential School"));
    var rSub = d3.select("#rSub").append("p").attr("class", "rRemove").html("Open from <span class='orange'>" + school.startYear + "</span> to <span class='orange'>" + school.endYear + "</span> in <span class='orange'>" + data.placeName + "</span>, <span class='orange'>" + data.province + "</span>.")

    if (school.data.reserves.length === 0) {
      var rReserves = d3.select("#rReserves").append("div").attr("class", "r1Content rRemove");
      rReserves.append("h4").html("Data not yet available...");
    } else {
      var rReserves = d3.select("#rReserves").append("div").attr("class", "r1Content rRemove");
      rReserves.append("h4").html("The school drew students from various bands, tribes, and reserves:");
      for (var i = 0; i < data.reserves.length; i++) {
        var distance = data.distances[i];
        rReserves.append("div").html("<span class='rReservesName'>" + data.reserves[i] + "</span> <span class='rReservesDistance'>(" + Number(data.distances[i]).toFixed(0) + "km away)</span>");
      }
    }

    if (school.data.religiousGroups.length === 0) {
      var rReligiousGroups = d3.select("#rReligiousGroups").append("div").attr("class", "r1Content rRemove");
      rReligiousGroups.append("h4").html("Data not yet available...");
    } else {
      var rReligiousGroups = d3.select("#rReligiousGroups").append("div").attr("class", "r1Content rRemove");
      rReligiousGroups.append("h4").html("The school drew was affiliated with various religious groups:");
      for (var i = 0; i < school.data.religiousGroups.length; i++) {
        rReligiousGroups.append("div").html("<span class='rReservesName'>" + school.data.religiousGroups[i].group + "</span>");
      }
    }

    var s = school;
    var yOpen = s.startYear,
      yClose = s.endYear,
      sEnrol = s.data.enrollment;

    var svgR = d3.select("#r3svg")
      .append("svg")
      .attr("class", "rRemove")
      .attr("id", "svgR")
      .style("width", $("#r3svg").width() + "px")
      .style("height", $("#r3svg").height() + "px");

    var margin = {
        top: 5,
        right: 10,
        bottom: 0,
        left: 80
      },
      width = $("#r3svg").width() - margin.left - margin.right,
      height = $("#r3svg").height() - margin.top - margin.bottom,
      heightB = height / 2,
      g = svgR.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // height transform
    // var xAxisVTrans = height + margin.top - margin.bottom - heightBottom;

    var x = d3.scaleLinear().range([0, width]).domain([yOpen, yClose]);
    var y = d3.scaleLinear().range([heightB, 0]).domain([0, 300]);

    // create axes variables
    var xAxis = g.append("g")
      .attr("id", "xAxis")
      .style("transform", "translate(0, -" + heightB + "px)");
    var yAxis = g.append("g")
      .attr("id", "yAxis")
      .style("transform", "translate(0, 0)");

    // draw axes
    xAxis.attr("class", "xAxis axis").call(d3.axisBottom(x)
      .tickFormat(d3.format("d"))
      .tickSizeInner(-height));
    var tHeight = height - 8;
    var tTextHeight = heightB - 15;
    xAxis.style("transform", "translate(0px, " + tHeight + "px)");
    d3.select(".xAxis path").style("transform", "translate(0px, 0px)");
    d3.selectAll(".xAxis text").style("transform", "translate(0px, -" + tTextHeight + "px)");
    yAxis.attr("class", "yAxis axis").call(d3.axisLeft(y)
      .ticks(5)
      .tickSizeInner(-width));

    // draw line
    var line = d3.line()
      .curve(d3.curveMonotoneX)
      .x(function(d) {
        return x(d.year);
      })
      .y(function(d) {
        return y(d.number);
      });

    // draw path
    var path = g.append("svg:path")
      .attr("id", "chart")
      .attr("d", line(sEnrol))
      .attr("stroke", "green")
      .attr("stroke-widt", 2)
      .attr("fill", "none")
      .style("transform", "translate(0,0px)");

    // add other data
    var sM = s.data.management;

    var sMtip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<span class='sMorgName'>" + d.orgName + "</span><br><span class='sMyear'>" + d.startYear + "-" + s.endYear + "</span>";
      })

    svgR.call(sMtip);

    var lineManagement = g.append("line")
      .attr("class", "lineAI")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", heightB + 32)
      .attr("y2", heightB + 32);

    var lineSexual = g.append("line")
      .attr("class", "lineAI")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", heightB + 50)
      .attr("y2", heightB + 50);

    var linePhysical = g.append("line")
      .attr("class", "lineAI")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", heightB + 65)
      .attr("y2", heightB + 65);

    var lineHealth = g.append("line")
      .attr("class", "lineAI")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", heightB + 80)
      .attr("y2", heightB + 80);

    var linePolicy = g.append("line")
      .attr("class", "lineAI")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", heightB + 95)
      .attr("y2", heightB + 95);

    var lineOther = g.append("line")
      .attr("class", "lineAI")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", heightB + 110)
      .attr("y2", heightB + 110);

    var sMrects = g.selectAll(".sMbars")
      .data(sM)
      .enter().append("line", ".sMbars")
      .attr("class", "sMbar")
      .attr("x1", function(d) {
        return x(d.startYear);
      })
      .attr("x2", function(d) {
        return x(d.endYear) - 5;
      })
      .attr("y1", heightB + 32)
      .attr("y2", heightB + 32)
      .on("mouseover", sMtip.show)
      .on("mouseout", sMtip.hide);

    var sMlabels = g.selectAll(".sMlabels")
      .data(sM)
      .enter().append("text", ".sMlabels")
      .attr("class", "sMlabel")
      .attr("x", function(d) {
        return x(d.startYear)
      })
      .attr("dy", 11)
      .attr("dx", 3)
      .attr("y", heightB + 25)
      .text(function(d) {
        return d.org;
      });

    var dAIsexual = s.data.additionalInformation.filter(function(d) {
      return ((d.type === "sexual"));
    });
    var dAIhealth = s.data.additionalInformation.filter(function(d) {
      return ((d.type === "health"));
    });
    var dAIphysical = s.data.additionalInformation.filter(function(d) {
      return ((d.type === "physical"));
    });
    var dAIpolicy = s.data.additionalInformation.filter(function(d) {
      return ((d.type === "policy"));
    });
    var dAIother = s.data.additionalInformation.filter(function(d) {
      return ((d.type === "other"));
    });

    var AItip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return d.notes;
      })

    svgR.call(AItip);

    var lEnrolment = g.append("text")
      .attr("class", "lEnrolment")
      .attr("x", -heightB / 2)
      .attr("dy", 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .text("Average Enrolment");

    var lManagement = g.append("text")
      .attr("class", "lAI")
      .attr("x", -10)
      .attr("dy", 2)
      .attr("y", heightB + 35)
      .attr("text-anchor", "end")
      .text("Management");

    var lSexual = g.append("text")
      .attr("class", "lAI")
      .attr("x", -10)
      .attr("dy", 2)
      .attr("y", heightB + 50)
      .attr("text-anchor", "end")
      .text("Sexual Abuse");

    var lPhysical = g.append("text")
      .attr("class", "lAI")
      .attr("x", -10)
      .attr("dy", 2)
      .attr("y", heightB + 65)
      .attr("text-anchor", "end")
      .text("Physical Abuse");

    var lHealth = g.append("text")
      .attr("class", "lAI")
      .attr("x", -10)
      .attr("dy", 2)
      .attr("y", heightB + 80)
      .attr("text-anchor", "end")
      .text("Health/Medical");

    var lPolicy = g.append("text")
      .attr("class", "lAI")
      .attr("x", -10)
      .attr("dy", 2)
      .attr("y", heightB + 95)
      .attr("text-anchor", "end")
      .text("Policy");

    var lOther = g.append("text")
      .attr("class", "lAI")
      .attr("x", -10)
      .attr("dy", 2)
      .attr("y", heightB + 110)
      .attr("text-anchor", "end")
      .text("Other Reports");

    var AIsexual = g.selectAll(".AIsexual")
      .data(dAIsexual)
      .enter().append("circle", ".AIsexual")
      .attr("class", "AIsexual AIcircle")
      .attr("cx", function(d) {
        return x(d.date);
      })
      .attr("cy", heightB + 50)
      .attr("r", 4)
      .on("mouseover", AItip.show)
      .on("mouseout", AItip.hide);

    var AIphysical = g.selectAll(".AIphysical")
      .data(dAIphysical)
      .enter().append("circle", ".AIphysical")
      .attr("class", "AIphysical AIcircle")
      .attr("cx", function(d) {
        return x(d.date);
      })
      .attr("cy", heightB + 65)
      .attr("r", 4)
      .on("mouseover", AItip.show)
      .on("mouseout", AItip.hide);

    var AIhealth = g.selectAll(".AIhealth")
      .data(dAIhealth)
      .enter().append("circle", ".AIhealth")
      .attr("class", "AIhealth AIcircle")
      .attr("cx", function(d) {
        return x(d.date);
      })
      .attr("cy", heightB + 80)
      .attr("r", 4)
      .on("mouseover", AItip.show)
      .on("mouseout", AItip.hide);

    var AIpolicy = g.selectAll(".AIpolicy")
      .data(dAIpolicy)
      .enter().append("circle", ".AIpolicy")
      .attr("class", "AIpolicy AIcircle")
      .attr("cx", function(d) {
        return x(d.date);
      })
      .attr("cy", heightB + 95)
      .attr("r", 4)
      .on("mouseover", AItip.show)
      .on("mouseout", AItip.hide);

    var AIother = g.selectAll(".AIother")
      .data(dAIother)
      .enter().append("circle", ".AIother")
      .attr("class", "AIother AIcircle")
      .attr("cx", function(d) {
        return x(d.date);
      })
      .attr("cy", heightB + 110)
      .attr("r", 4)
      .on("mouseover", AItip.show)
      .on("mouseout", AItip.hide);
  });
}

function rightBarBack() {
  d3.select("#map").style("height", window.innerHeight + "px").style("width", window.innerWidth + "px");
  d3.select("#rightBar").classed("rightBarOut", false);
  d3.select(".mapboxgl-ctrl-top-right").transition().duration(200).style("opacity", 0);
  d3.select(".mapboxgl-ctrl-top-right").transition().delay(500).duration(500).style("opacity", 1);

  map.flyTo({
    center: [-100, 58],
    zoom: 4,
    bearing: 0,
    speed: 2,
    curve: 1,

    easing: function(t) {
      return t;
    }
  });

  d3.selectAll(".reserveDot").style("display", "block").transition().duration(600).ease(d3.easeLinear).style("opacity", 0.1);
  d3.selectAll(".schoolMarker").transition().duration(600).ease(d3.easeLinear).style("opacity", 1);
  d3.selectAll(".schoolLabel").style("opacity", "0");

  rightBar = false;
}
