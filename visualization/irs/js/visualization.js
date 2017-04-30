// GLOBAL
// draw first story when page is loaded
var storyID = "aelias";
window.onload = drawStory(storyID);
var orange = "#f15a24";

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
  zoom: 9
});
map.scrollZoom.disable()
map.dragRotate.disable()

map.addControl(new mapboxgl.Navigation());

// scrollmagic: pin main map
var map1_p = new ScrollMagic.Scene({
    triggerElement: "#tMap1_p",
    duration: "500%"
  })
  .triggerHook("onLeave")
  .setPin("#map1_cont")
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

  var drawn = false;

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
      curve: 1, // change the speed at which it zooms out

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
          center: [-100, 57],
          zoom: 4.5,
          bearing: 0,
          speed: 5,
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
