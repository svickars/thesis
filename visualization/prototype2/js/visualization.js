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

var x = d3.scaleTime()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.number); });



// *********
// The Vizzy
// *********

function drawVisual(loc) {

    // remove previous
    d3.selectAll("#mapS3").remove();



    // read data
    d3.json("js/data/schools/" + loc + ".json", function(data) {
        
        // Make section 4 visible
        d3.select("#section3break").style("display", "block");
        d3.select("#section4").style("display", "block");

        // Read data, set variables
        var sName = data.name.replace("IRS", "Indian Residential School");
        var sPlace = data.location.city + ", " + data.location.prov
        var sOpen = data.startYear;
        var sClose = data.endYear;

        // DEFINE SCROLL CONTROLLER
        var controller = new ScrollMagic.Controller();


        // DRAW MAP
        var sMap = d3.select("#sMap").append("div").attr("class", "sMap").attr("id", "mapS3");
        d3.select("#mapS3").style("height", window.innerHeight + "px").style("width", window.innerWidth + "px").style("opacity", 0);
        var map = L.map('mapS3', {
            zoomControl: false,
            scrollWheelZoom: false,
            dragging: false,
            touchZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            tap: false,
            keyboard: false
        }).setView([data.location.latLng.lat, data.location.latLng.lng], 10);
        L.tileLayer('https://api.mapbox.com/styles/v1/svickars/cizx1z189003a2ss174fmgdib/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3ZpY2thcnMiLCJhIjoiY2l1aW5saDhkMDAwMTNvbDdmcTlncnp1cyJ9.wIpJKF-DW1C2uPgKnUtNWg', {}).addTo(map);


        // SCHOOL INTRO
        var sIntro = d3.select("#sIntro").append("div").attr("id", "sIntro_box").attr("class", "sBox");
        sIntro.style("opacity", 0)
            .html("<div class='col-md-10 col-md-offset-1 col-xs-12 blackBox' id='sIntro_blackBox'><h1>The <span class='changeU'>" + sName + "</span> opened in <span class='changeU'>" + sPlace + "</span> in <span class='changeU'>" + sOpen + "</span>.</h1> <guide><div class='change'>This visualization will walk you through the story of this residential school.</div><div>Scroll on to explore.</div></guide></div>");

        // BREAK ONE (3-4)
        var bOne = d3.select("#section3break").append("div").attr("class", "col-md-8 col-md-offset-2 col-xs-12").attr("id", "section3break_text");
        bOne.html("<h1>The " + sName + "</h1><h5>"+sOpen+"–"+sClose+"</h5><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p>")
        

        // SCHOOL DATA
        // set left height
        d3.select("#sData_left").style("height", window.innerHeight + "px");
        
        
        // timeline
        var sTimeline = data.data.chronoHistory;
        
        for (var i = 0; i < sTimeline.length; i++ ){
            var sTimeline_box = d3.select("#sData_right").append("div").attr("class", "sTimeline_box").attr("id", "sTimeline" + i);
            sTimeline_box.html("<span class='change'>" + sTimeline[i].date + "</span><br> " +  sTimeline[i].desc);
        
            var sTimeline_boxFI_t = new TweenMax.to('#sTimeline' + i, .25, {
                opacity: 1.0
            });
            
            var sTimeline_boxFO_t = new TweenMax.to('#sTimeline' + i, .25, {
                opacity: .1
            });
            
            var sTimeline_boxFI_s = new ScrollMagic.Scene({
                triggerElement: '#sTimeline' + i
            })
            // .offset(document.getElementById('sTimeline' + i).offsetHeight / 2)
            .setTween(sTimeline_boxFI_t)
            .addIndicators()
            .addTo(controller);
            
            var sTimeline_boxFI_s = new ScrollMagic.Scene({
                triggerElement: '#sTimeline' + i
            })
            .offset(document.getElementById('sTimeline' + i).offsetHeight)
            .setTween(sTimeline_boxFO_t)
            .addIndicators()
            .addTo(controller);
            
        }

        // visualization
        var svgSchool = d3.select("#vSchool")
            .append("svg")
            .attr("id", "svg")
            .attr("width", "100%")
            .attr("height", window.innerHeight + "px");
            
        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = +svgSchool.attr("width") - margin.left - margin.right,
            height = +svgSchool.attr("height") - margin.top - margin.bottom,
            g = svgSchool.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
        var sEnrol = data.data.enrollment;
        
        console.log(typeof sEnrol[i].number)
        
        // svgSchool.append('svg:path')
        //     .attr('d', line(sEnrol))
        //     .attr('stroke', 'green')
        //     .attr('stroke-width', 2)
        //     .attr('fill', 'none');


        // SET TRIGGER HEIGHTS
        d3.select("#sIntroFadeIN_trigger").style("top", window.innerHeight * 1.25 + "px");
        d3.select("#sIntroFadeOUT_trigger").style("top", window.innerHeight * 2.5 + "px");
        d3.select("#sMapZoomIN_trigger").style("top", window.innerHeight * 2.75 + "px");
        d3.select("#sIntro").style("top", window.innerHeight / 2 + "px");

        // SCENES (MAP)
        var mapS3fI_t = new TweenMax.to('#mapS3', 2.5, {
            opacity: 1.0
        });

        var sIntroFI_t = new TweenMax.to('#sIntro_box', .25, {
            opacity: 1.0
        });

        var sIntroFO_t = new TweenMax.to('#sIntro_box', .25, {
            opacity: 0
        });

        var mapS3FI_s = new ScrollMagic.Scene({
                triggerElement: '#section3'
            })
            .triggerHook(0.9)
            .setTween(mapS3fI_t)
            .addIndicators()
            .addTo(controller);

        var mapS3P_s = new ScrollMagic.Scene({
                triggerElement: '#section3',
                duration: "225%"
            })
            .triggerHook("onLeave")
            .setPin('#mapS3')
            .addIndicators()
            .addTo(controller);

        var sIntroFI_s = new ScrollMagic.Scene({
                triggerElement: '#sIntroFadeIN_trigger'
            })
            .triggerHook('onEnter')
            .setTween(sIntroFI_t)
            .addIndicators()
            .addTo(controller);

        var sIntroFO_s = new ScrollMagic.Scene({
                triggerElement: '#sIntroFadeOUT_trigger'
            })
            .triggerHook('onEnter')
            .setTween(sIntroFO_t)
            .addIndicators()
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
            .triggerHook('onEnter')
            .addIndicators()
            .addTo(controller);
            
        var sTimeline_boxP_s = new ScrollMagic.Scene({
                triggerElement: '#section4',
                duration: document.getElementById('sData_right').offsetHeight + 300
            })
            .triggerHook("onLeave")
            .setPin('#sData_left', {pushFollowers: false})
            .addIndicators()
            .addTo(controller);


    });

}


// ******
// JQuery
// ******