// **********
// The Set-Up
// **********

// global sizes
var margin = {
    top: 20,
    right: 100,
    bottom: 100,
    left: 60
};

var height = "100%";
var width = "100%";

// global variables





// ******************
// Location Selection
// ******************
// var loc;

// var b1 = d3.select("#b1");
//     b1.on("click", function(d) {
//         // loc = "christie";
//         console.log(loc);
//         // drawVisual();
//     })

// *********
// FUNCTIONS
// *********

// Find user's location
var uLat, uLng, uCity;

$.getJSON('https://geoip-db.com/json/geoip.php?jsonp=?')
    .done(function(location) {
        uCity = location.city;
        uLat = location.latitude;
        uLng = location.longitude;
    });

// calculate distance to location
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}




// *********
// The Vizzy
// *********

function drawVisual(loc) {

    // remove previous
    d3.selectAll("#mapS3").remove();

    // fade location selection section
    d3.select(".bSel").on("click", function(d) {
        d3.select("#s2arrow").transition().duration(200).ease(d3.easeLinear).style("opacity", "1.0");
    });


    // read data
    d3.json("js/data/schools/" + loc + ".json", function(data) {

        // Make sections visible
        d3.select("#section3").style("display", "flex");
        d3.select("#section3break").style("display", "flex");
        d3.select("#section4").style("display", "flex");
        d3.select("#section5").style("display", "flex");

        // Read data, set variables
        var sName = data.name.replace("IRS", "Indian Residential School");
        var sPlace = data.location.city + ", " + data.location.prov
        var sOpen = data.startYear;
        var sClose = data.endYear;

        // DEFINE SCROLL CONTROLLER
        var controller = new ScrollMagic.Controller();
        TweenLite.defaultOverwrite = false;


        // DRAW MAP
        d3.select("#map1").style("height", window.innerHeight + "px").style("width", window.innerWidth + "px");
        var map1 = d3.select("#map1").append("div").attr("class", "map");
        var map = L.map('map1', {
            zoomControl: false,
            scrollWheelZoom: false,
            dragging: false,
            touchZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            tap: false,
            keyboard: false
        }).setView([data.location.latLng.lat, data.location.latLng.lng], 10);
        L.tileLayer('https://api.mapbox.com/styles/v1/svickars/cj15l501n000n2rpaxezq0v2x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3ZpY2thcnMiLCJhIjoiY2l1aW5saDhkMDAwMTNvbDdmcTlncnp1cyJ9.wIpJKF-DW1C2uPgKnUtNWg', {}).addTo(map);

        var distanceTo = getDistanceFromLatLonInKm(data.location.latLng.lat, data.location.latLng.lng, uLat, uLng);


        // SCHOOL INTRO

        var s3_intro = d3.select("#s3_intro").append("div").attr("class", "col-md-10 col-md-offset-1 col-xs-12 whiteBox");

        if (isNaN(distanceTo)) {
            s3_intro.html("<h1>The <span class='changeU'>" + sName + "</span> was located in <span class='changeU'>" + sPlace + "</span> from <span class='changeU'>" + sOpen + "</span> to <span class='changeU'>" + sClose + "</span>.</h1> <guide><div class='change'>This visualization will walk you through the story of this residential school.</div><div>Scroll on to explore.</div></guide>");
        }
        else {
            s3_intro.html("<h1>The <span class='changeU'>" + sName + "</span> was located in <span class='changeU'>" + sPlace + "</span>, <span class='changeU'>" + Math.round(distanceTo) + "km</span> from " + uCity + ".</h1> <guide><div class='change'>This visualization will walk you through the story of this residential school.</div><div>Scroll on to explore.</div></guide>");
        };



        // BREAK ONE (3-4)
        var bOne = d3.select("#section3break_inner").append("div").attr("id", "section3break_text");
        bOne.html("<h1>The " + sName + "</h1><h5>" + sOpen + "–" + sClose + "</h5><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p>")


        // SCHOOL DATA
        // set left height
        d3.select("#sData_left").style("height", window.innerHeight + "px");

        // visualization
        var svgSchool = d3.select("#vSchool")
            .append("svg")
            .attr("id", "svg")
            .attr("width", "100%")
            .attr("height", window.innerHeight + "px");

        var margin = {
                top: 20,
                right: 20,
                bottom: 30,
                left: 50
            },
            width = document.getElementById('sData_left').offsetWidth - margin.left - margin.right,
            height = window.innerHeight - margin.top - margin.bottom,
            heightBottom = 100,
            g = svgSchool.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        // height transform
        var xAxisVTrans = height + margin.top - margin.bottom - heightBottom;

        var x = d3.scaleLinear().range([margin.left, width - margin.right]).domain([sOpen, sClose]);
        var y = d3.scaleLinear().range([height - margin.top, margin.bottom + heightBottom]).domain([0, 300]);

        // create axes variables
        var xAxis = svgSchool.append("g")
            .attr("id", "xAxis")
            .style("transform", "translate(0," + xAxisVTrans + "px)");
        var yAxis = svgSchool.append("g")
            .attr("id", "yAxis")
            .style("transform", "translate(" + margin.left + "px,-" + heightBottom + "px)")

        // draw axes
        xAxis.attr("class", "xAxis axis").call(d3.axisBottom(x)
            .tickFormat(d3.format("d")));
        yAxis.attr("class", "yAxis axis").call(d3.axisLeft(y));

        // draw line
        var line = d3.line()
            .curve(d3.curveMonotoneX)
            .x(function(d) {
                return x(d.year);
            })
            .y(function(d) {
                return y(d.number);
            });


        // create scroll triggers at year marks
        var sEnrol = data.data.enrollment;


        // draw path
        var path = svgSchool.append('svg:path')
            .attr('id', 'chart')
            .attr('d', line(sEnrol))
            .attr('stroke', 'green')
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .style('transform', 'translate(0,-' + heightBottom + 'px)');

        // var totalLength = path.node().getTotalLength();

        // path.attr("stroke-dasharray", totalLength + " " + totalLength)
        //     .attr("stroke-dashoffset", totalLength)
        //     .transition()
        //     .duration(1000)
        //     .attr("stroke-dashoffset", 0);

        function pathPrepare($el, i, total) {
            var lineLength = $el[0].getTotalLength();
            $el.css("stroke-dasharray", lineLength);
            $el.css("stroke-dashoffset", lineLength);
        }

        var $chart = $("path#chart");













        d3.select("#sData_right").style("min-height", sEnrol.length * 50 + "px");

        for (var i = 0; i < sEnrol.length; i++) {

            var currentL = svgSchool.append("line")
                .attr("id", "currentL")
                .attr("x1", 50)
                .attr("y1", margin.top)
                .attr("x2", 50)
                .attr("y2", height - heightBottom)
                .style("stroke-width", 1)
                .style("stroke", "white")
                .style("fill", "none")
                .style("left", 0);


            var sYearly = d3.select("#sData_right").append("div").attr("class", "sYearly").attr("id", "sYearly" + (i + sOpen));
            // sYearly.html(sEnrol[i].year)
            // d3.select("#sYearly"+(i+sOpen)).style("top", (rightHeight/sEnrol.length)*i + "px");

            var move = width / sEnrol.length * i;

            var currentL_t = new TweenMax.to('#currentL', .25, {
                css: {
                    transform: 'translate(' + move + 'px, 0)'
                }
            });

            var currentY = i + sOpen;

            var currentL_s = new ScrollMagic.Scene({
                    triggerElement: '#sYearly' + (i + sOpen),
                })
                //   .on("enter", function() {
                //       currentL.transition().duration(200).ease(d3.easeLinear).style("transform", "translate(" + move + "px, 0)");
                //   })
                // .offset(-document.getElementById('sYearly' + currentY).offsetHeight)
                .setTween(currentL_t)
                .addIndicators({
                    name: currentY
                })
                .addTo(controller);




            // prepare SVG
            pathPrepare($chart, i, sEnrol.length);




            var tween = new TimelineMax()
                .add(TweenMax.to($chart, .25, {
                    strokeDashoffset: 0,
                    ease: Linear.easeNone
                }));

            // build scene
            var scene = new ScrollMagic.Scene({
                    triggerElement: "#sYearly" + (i + sOpen),
                    duration: document.getElementById('sData_right').offsetHeight,
                    tweenChanges: true
                })
                .triggerHook("onCenter")
                .setTween(tween)
                .addIndicators() // add indicators (requires plugin)
                .addTo(controller);




            // var sYearly_s = new ScrollMagic.Scene({
            //         triggerElement: '#sYearly' + (i + sOpen)
            //     })
            //     .on("enter", function() {
            //         // draw path
            //         var path = svgSchool.append('svg:path')
            //             .attr('d', line(sEnrol))
            //             .attr('stroke', 'green')
            //             .attr('stroke-width', 2)
            //             .attr('fill', 'none')
            //             .style('transform', 'translate(0,-' + heightBottom + 'px)');

            //         var totalLength = path.node().getTotalLength();

            //         path.attr("stroke-dasharray", totalLength + " " + totalLength)
            //             .attr("stroke-dashoffset", totalLength)
            //             .transition()
            //             .duration(1000)
            //             .attr("stroke-dashoffset", 0);
            //     })
            //     .addIndicators()
            //     .addTo(controller);
        };

        // timeline
        var sTimeline = data.data.chronoHistory;

        for (var i = 0; i < sTimeline.length; i++) {
            var sTimelineBox = d3.select("#sYearly" + sTimeline[i].date).append("div").attr("class", "sTimeline_box").attr("id", "sTimeline" + sTimeline[i].date);
            sTimelineBox.html("<span class='change'>" + sTimeline[i].date + "</span><br>" + sTimeline[i].desc);

            var sTimeline_boxFI_t = new TweenMax.to('#sTimeline' + sTimeline[i].date, .25, {
                opacity: 1.0
            });

            var sTimeline_boxFO_t = new TweenMax.to('#sTimeline' + sTimeline[i].date, .25, {
                opacity: .1
            });

            var sTimeline_boxFI_s = new ScrollMagic.Scene({
                    triggerElement: '#sTimeline' + sTimeline[i].date
                })
                // .offset(document.getElementById('sTimeline' + sTimeline[i].date).offsetHeight / 2)
                .setTween(sTimeline_boxFI_t)
                .addIndicators({name: "timeline" + sTimeline[i].date + "fade in"})
                .addTo(controller);

            var sTimeline_boxFO_s = new ScrollMagic.Scene({
                    triggerElement: '#sTimeline' + sTimeline[i].date
                })
                .offset(document.getElementById('sTimeline' + sTimeline[i].date).offsetHeight)
                .setTween(sTimeline_boxFO_t)
                .addIndicators({name: "timeline" + sTimeline[i].date + "fade out"})
                .addTo(controller);

        };









        // SCENES

        // pin the school map for its duration
        var mapS3P_s = new ScrollMagic.Scene({
                triggerElement: '#section3',
                duration: '225%'
            })
            .triggerHook('onLeave')
            .setPin('#map1')
            .addIndicators({
                name: 'map-pin'
            })
            .addTo(controller);

        // set up tweens to fade in/out the school intro box
        d3.select("#s3_intro").style("opacity", "0");

        var s3_intro_FI_t = TweenMax.to('#s3_intro', 1, {
            opacity: '1'
        });

        var s3_intro_FO_t = TweenMax.to('#s3_intro', 1, {
            opacity: '0'
        });

        // fade in the intro box
        var s3_intro_FI_s = new ScrollMagic.Scene({
                triggerElement: '#sIntroFadeIN_trigger'
            })
            .offset(document.getElementById('s3_intro').offsetHeight/2)
            .setTween(s3_intro_FI_t)
            .addIndicators()
            .addTo(controller);

        var s3_intro_FO_s = new ScrollMagic.Scene({
                triggerElement: '#sIntroFadeOUT_trigger'
            })
            .offset(document.getElementById('s3_intro').offsetHeight/2)
            .setTween(s3_intro_FO_t)
            .addIndicators()
            .addTo(controller);

        // pin the school intro box from the fade in trigger to the fade out trigger
        var s3_introP_s = new ScrollMagic.Scene({
                triggerElement: '#sIntroFadeIN_trigger',
                duration: '50%'
            })
            .offset(document.getElementById('s3_intro').offsetHeight/2)
            .setPin('#s3_intro')
            .addIndicators({
                name: 's3_intro-pin'
            })
            .addTo(controller);

        // pin the section 3 break until the map is done
        var s3bP_s = new ScrollMagic.Scene({
                triggerElement: '#section3',
                duration: '225%'
            })
            .triggerHook('onEnter')
            .setPin('#section3break')
            .addIndicators({
                name: 's3-pin'
            })
            .addTo(controller);


        var right_height = document.getElementById('sData_right').offsetHeight + 700

        // pin the section 4 container (grey background) for the duration of sData_right
        var s4cP_s = new ScrollMagic.Scene({
                triggerElement: '#section4_container',
                duration: right_height
            })
            .triggerHook('onLeave')
            .setPin('#section4_container')
            .addIndicators({
                name: 's4c-pin'
            })
            .addTo(controller);

        // pin the section 4 left pane (chart) for the duration of sData_right
        var s4cP_s = new ScrollMagic.Scene({
                triggerElement: '#sData_left',
                duration: right_height
            })
            .triggerHook('onLeave')
            .setPin('#sData_left')
            .addIndicators({
                name: 's4_left-pin'
            })
            .addTo(controller);

        // pin section 5 until its turn
        var s4cP_s = new ScrollMagic.Scene({
                triggerElement: '#section3',
                duration: right_height
            })
            .triggerHook('onLeave')
            .setPin('#section5')
            .addIndicators({
                name: 's5-pin'
            })
            .addTo(controller);





        var sMapZI_s = new ScrollMagic.Scene({
                triggerElement: '#sMapZoomIN_trigger'
            })
            .on("enter", function(event) {
                if (map.getZoom() == 10) {
                    map.setView([data.location.latLng.lat, data.location.latLng.lng], 13, {
                        "animate": true
                    });
                }
                else {
                    map.setView([data.location.latLng.lat, data.location.latLng.lng], 10, {
                        "animate": true
                    });
                };
            })
            // .triggerHook('onEnter')
            .addIndicators({
                name: 'sMapZI'
            })
            .addTo(controller);


    });

}


// ******
// JQuery
// ******
