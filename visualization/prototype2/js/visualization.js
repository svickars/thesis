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
// The Vizzy
// *********

function drawVisual(loc) {

    // remove previous
    d3.selectAll("#mapS3").remove();



    // read data
    d3.json("js/data/schools/" + loc + ".json", function(data) {

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

        // SET TRIGGER HEIGHTS
        d3.select("#sIntroFadeIN_trigger").style("top", window.innerHeight * 1.5 + "px");
        d3.select("#sIntroFadeOUT_trigger").style("top", window.innerHeight * 2.5 + "px");
        d3.select("#sMapZoomIN_trigger").style("top", window.innerHeight * 2.75 + "px");
        d3.select("#sIntro").style("top", window.innerHeight / 2 + "px");

        // FIRST SCENE (MAP)
        var mapS3fadeIN_tween = new TweenMax.to('#mapS3', 5, {
            opacity: 1.0
        });

        var sIntroFadeIN_tween = new TweenMax.to('#sIntro_box', 1, {
            opacity: 1.0
        });

        var sIntroFadeOUT_tween = new TweenMax.to('#sIntro_box', 1, {
            opacity: 0
        });

        var mapS3fadeIN_scene = new ScrollMagic.Scene({
                triggerElement: '#section3'
            })
            .triggerHook(0.9)
            .setTween(mapS3fadeIN_tween)
            .addIndicators()
            .addTo(controller);

        var mapS3pin_scene = new ScrollMagic.Scene({
                triggerElement: '#section3',
                duration: 5000
            })
            .triggerHook("onLeave")
            .setPin('#mapS3')
            .addIndicators()
            .addTo(controller);

        var sIntroFadeIN_scene = new ScrollMagic.Scene({
                triggerElement: '#sIntroFadeIN_trigger'
            })
            .triggerHook('onEnter')
            .setTween(sIntroFadeIN_tween)
            .addIndicators()
            .addTo(controller);

        var sIntroFadeOUT_scene = new ScrollMagic.Scene({
                triggerElement: '#sIntroFadeOUT_trigger'
            })
            .triggerHook('onEnter')
            .setTween(sIntroFadeOUT_tween)
            .addIndicators()
            .addTo(controller);

        var sMapZoomIN_scene = new ScrollMagic.Scene({
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


        // ---------------------------------


        // ----------
        // PAGE THREE
        // ----------

        // // Draw map on P3
        // var mapP3div = d3.select("#mapP3div").append("div").attr("class", "mapP3").attr("id", "mapP3");
        // var mapP3 = L.map('mapP3', { zoomControl:false, scrollWheelZoom:false, dragging:false, touchZoom:false, doubleClickZoom:false, boxZoom:false, tap:false, keyboard:false }).setView([data.location.latLng.lat, data.location.latLng.lng], 10);


        // Add school info
        // var sIntro = d3.select("#vizP3").append("div").attr("class", "sIntro box");
        // sIntro.html("<h1>The <span class='changeU'>" + sName + "</span> opened in <span class='changeU'>" + sPlace + "</span> in <span class='changeU'>" + sOpen + "</span>.</h1> <guide><div class='change'>This visualization will walk you through the story of this residential school.</div><div>Scroll on to explore.</div></guide>")
        //     .style("opacity", "0");


        // $(".p3").on("mousewheel", function(event) {
        //     sIntro.transition().duration(1000).style("opacity", "1");
        //     mapP3.setView([data.location.latLng.lat, data.location.latLng.lng], 11, {
        //         "animate": true
        //     });
        // });



        // ---------
        // PAGE FOUR
        // ---------

        // Add top row of school box
        // var sBoxTop = d3.select("#sBoxTop").append("div")
        //     .html("<h1>The <span class='changeU'>" + sName + "</span> was open until <span class='changeU'>" + sClose + "</span>.</h1>");

    });

}


// ******
// JQuery
// ******