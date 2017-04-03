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
    
    d3.selectAll(".sIntro").remove();
    d3.selectAll("#mapP3").remove();
    
    d3.json("js/data/schools/" + loc + ".json", function(data) {
        
        // Read data, set variables
        var sName = data.name.replace("IRS", "Indian Residential School");
        var sPlace = data.location.city + ", " + data.location.prov
        var sOpen = data.startYear;
        var sClose = data.endYear;
        
        // ----------
        // PAGE THREE
        // ----------
        
        // Draw map on P3
        var mapP3div = d3.select("#mapP3div").append("div").attr("class", "mapP3").attr("id", "mapP3");
        var mapP3 = L.map('mapP3', { zoomControl:false, scrollWheelZoom:false, dragging:false, touchZoom:false, doubleClickZoom:false, boxZoom:false, tap:false, keyboard:false }).setView([data.location.latLng.lat, data.location.latLng.lng], 10);
        
        L.tileLayer('https://api.mapbox.com/styles/v1/svickars/cizx1z189003a2ss174fmgdib/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3ZpY2thcnMiLCJhIjoiY2l1aW5saDhkMDAwMTNvbDdmcTlncnp1cyJ9.wIpJKF-DW1C2uPgKnUtNWg', {
        }).addTo(mapP3);
        
        // Add school info
        var sIntro = d3.select("#vizP3").append("div").attr("class", "sIntro box");
        sIntro.html("<h1>The <span class='changeU'>" + sName + "</span> opened in <span class='changeU'>" + sPlace + "</span> in <span class='changeU'>" + sOpen + "</span>.</h1> <guide><div class='change'>This visualization will walk you through the story of this residential school.</div><div>Scroll on to explore.</div></guide>")
                .style("opacity", "0");
        
        
        $(".p3").on("mousewheel", function(event) {
            sIntro.transition().duration(1000).style("opacity", "1");
            mapP3.setView([data.location.latLng.lat, data.location.latLng.lng], 11, {
                "animate": true
            });
        });
        
        
        
        // ---------
        // PAGE FOUR
        // ---------
        
        // Add top row of school box
        var sBoxTop = d3.select("#sBoxTop").append("div")
                        .html("<h1>The <span class='changeU'>" + sName + "</span> was open until <span class='changeU'>" + sClose+"</span>.</h1>");
        
    });
    
}


// ******
// JQuery
// ******