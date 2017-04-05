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
        d3.select("#section3break").style("display", "block");
        d3.select("#section4").style("display", "block");
        d3.select("#section5").style("display", "block");

        // Read data, set variables
        var sName = data.name.replace("IRS", "Indian Residential School");
        var sPlace = data.location.city + ", " + data.location.prov
        var sOpen = data.startYear;
        var sClose = data.endYear;

        // DEFINE SCROLL CONTROLLER
        var controller = new ScrollMagic.Controller();


        // DRAW MAP
        var sMap = d3.select("#sMap").append("div").attr("class", "sMap").attr("id", "mapS3");
        d3.select("#mapS3").style("height", window.innerHeight + "px").style("width", window.innerWidth + "px").style("opacity", 1);
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
        var sIntro = d3.select("#sIntro").append("div");
        sIntro.html("<div class='col-md-10 col-md-offset-1 col-xs-12 blackbox'><h1>The <span class='changeU'>" + sName + "</span> opened in <span class='changeU'>" + sPlace + "</span> in <span class='changeU'>" + sOpen + "</span>.</h1> <guide><div class='change'>This visualization will walk you through the story of this residential school.</div><div>Scroll on to explore.</div></guide></div>");
        // var sIntro = d3.select("#sIntro").append("div").attr("id", "sIntro_box").attr("class", "sBox");
        // sIntro.style("opacity", 0)
        //     .html("<div class='col-md-10 col-md-offset-1 col-xs-12 blackBox' id='sIntro_blackBox'><h1>The <span class='changeU'>" + sName + "</span> opened in <span class='changeU'>" + sPlace + "</span> in <span class='changeU'>" + sOpen + "</span>.</h1> <guide><div class='change'>This visualization will walk you through the story of this residential school.</div><div>Scroll on to explore.</div></guide></div>");

        // BREAK ONE (3-4)
        var bOne = d3.select("#section3break").append("div").attr("class", "col-md-8 col-md-offset-2 col-xs-12").attr("id", "section3break_text");
        bOne.html("<h1>The " + sName + "</h1><h5>"+sOpen+"–"+sClose+"</h5><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p>")
        

        // SCHOOL DATA
        // set left height
        d3.select("#sData_left").style("height", window.innerHeight + "px");

        // visualization
        var svgSchool = d3.select("#vSchool")
            .append("svg")
            .attr("id", "svg")
            .attr("width", "100%")
            .attr("height", window.innerHeight + "px");
            
        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = document.getElementById('sData_left').offsetWidth - margin.left - margin.right,
            height = window.innerHeight - margin.top - margin.bottom,
            heightBottom = 100,
            g = svgSchool.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
        
        // height transform
        var xAxisVTrans = height + margin.top - margin.bottom - heightBottom;
        
        var x = d3.scaleLinear().range([margin.left, width - margin.right]).domain([sOpen,sClose]);
        var y = d3.scaleLinear().range([height - margin.top, margin.bottom + heightBottom]).domain([0,300]);
        
        // create axes variables
        var xAxis = svgSchool.append("g")
	            .attr("id", "xAxis")
	            .style("transform", "translate(0," +xAxisVTrans +"px)");
	    var yAxis = svgSchool.append("g")
	            .attr("id", "yAxis")
	            .style("transform", "translate(" + margin.left +"px,-"+heightBottom+"px)")
	     
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
        
        d3.select("#sData_right").style("min-height", sEnrol.length*50 + "px");
        
        for (var i=0; i<sEnrol.length; i++ ) {
            
            var currentL = svgSchool.append("line")
                                    .attr("id", "currentL")
                                    .attr("x1", 50)
                                    .attr("y1", margin.top)
                                    .attr("x2", 50)
                                    .attr("y2", height-heightBottom)
                                    .style("stroke-width", 1)
                                    .style("stroke", "white")
                                    .style("fill", "none")
                                    .style("left", 0);
                                    
            
            var sYearly = d3.select("#sData_right").append("div").attr("class", "sYearly").attr("id", "sYearly" + (i+sOpen));
            // sYearly.html(sEnrol[i].year)
            // d3.select("#sYearly"+(i+sOpen)).style("top", (rightHeight/sEnrol.length)*i + "px");
            
            var move = width/sEnrol.length * i;
            
            var currentL_t = new TweenMax.to('#currentL', .25, {
                css: { transform: 'translate(' + move + 'px, 0)' }});
			
			var currentY = i+sOpen;
			
			var currentL_s = new ScrollMagic.Scene({
			        triggerElement: '#sYearly' + (i+sOpen),
			    })
			 //   .on("enter", function() {
			 //       currentL.transition().duration(200).ease(d3.easeLinear).style("transform", "translate(" + move + "px, 0)");
			 //   })
			    .offset(-document.getElementById('sYearly' + currentY).offsetHeight)
			    .setTween(currentL_t)
			    .addIndicators(currentY)
			    .addTo(controller);
							
            var sYearly_s = new ScrollMagic.Scene({
                    triggerElement: '#sYearly' + (i+sOpen)
                })
                .on("enter", function() {
                    // draw path
                    var path = svgSchool.append('svg:path')
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
                })
                .addIndicators()
                .addTo(controller);
        };
        
        // timeline
        var sTimeline = data.data.chronoHistory;
        
        for (var i = 0; i < sTimeline.length; i++ ){
            var sTimelineBox = d3.select("#sYearly" + sTimeline[i].date).append("div").attr("class", "sTimeline_box").attr("id", "sTimeline" + sTimeline[i].date);
            sTimelineBox.html("<span class='change'>"+sTimeline[i].date+"</span><br>"+sTimeline[i].desc);
            
            var sTimeline_boxFI_t = new TweenMax.to('#sTimeline' + sTimeline[i].date, .25, {
                opacity: 1.0
            });
            
            var sTimeline_boxFO_t = new TweenMax.to('#sTimeline' + sTimeline[i].date, .25, {
                opacity: .1
            });
            
            var sTimeline_boxFI_s = new ScrollMagic.Scene({
                triggerElement: '#sTimeline' + sTimeline[i].date
            })
            .offset(document.getElementById('sTimeline' + sTimeline[i].date).offsetHeight / 2)
            .setTween(sTimeline_boxFI_t)
            .addIndicators()
            .addTo(controller);
            
            var sTimeline_boxFO_s = new ScrollMagic.Scene({
                triggerElement: '#sTimeline' + sTimeline[i].date
            })
            .offset(document.getElementById('sTimeline' + sTimeline[i].date).offsetHeight)
            .setTween(sTimeline_boxFO_t)
            .addIndicators()
            .addTo(controller);
            
        };



        // move down section 5
        // var s4 = document.getElementById("sData_right").offsetHeight + window.innerHeight;
        // var s5 = (window.innerHeight*5.8) + document.getElementById("sData_right").offsetHeight;
        // d3.select("#section4").style("height", s4 + "px");
        // d3.select("#section5").style("top", s5 + "px");




        // SET TRIGGER HEIGHTS
        // d3.select("#sIntroFadeIN_trigger").style("top", window.innerHeight * 1.25 + "px");
        // d3.select("#sIntroFadeOUT_trigger").style("top", window.innerHeight * 2.5 + "px");
        // d3.select("#sMapZoomIN_trigger").style("top", window.innerHeight * 2.75 + "px");
        // d3.select("#sIntro").style("top", window.innerHeight / 2 + "px");

        // SCENES (MAP)
        
        var mapS3fI_t = new TweenMax.to('#mapS3', 2.5, {
            opacity: 1.0
        });

        var sIntroFI_t = new TweenMax.to('#sIntro', .5, {
            opacity: 1.0
        });

        var sIntroFO_t = new TweenMax.to('#sIntro', .5, {
            opacity: 0
        });
        

        // var mapS3FI_s = new ScrollMagic.Scene({
        //         triggerElement: '#section3'
        //     })
        //     .triggerHook(0.9)
        //     .setTween(mapS3fI_t)
        //     .addIndicators()
        //     .addTo(controller);

        var mapS3P_s = new ScrollMagic.Scene({
                triggerElement: '#section3',
                duration: '300%'
            })
            // .offset("50%")
            .triggerHook('onEnter')
            .setPin('#mapS3')
            .addIndicators({name: 'map-pin'})
            .addTo(controller);


        var sIntroFI_s = new ScrollMagic.Scene({
                triggerElement: '#sIntroFadeIN_trigger'
            })
            // .triggerHook('onEnter')
            .offset(document.getElementById('sIntro').offsetHeight / 2)
            .setTween(sIntroFI_t)
            .addIndicators({name: 'sIntroFI'})
            .addTo(controller);
        
        var sIntroP_s = new ScrollMagic.Scene({
                triggerElement: '#sIntroFadeIN_trigger',
                duration: '50%'
            })
            // .triggerHook('onEnter')
            .offset(document.getElementById('sIntro').offsetHeight / 2)
            // .setTween(sIntroFI_t)
            .setPin('#sIntro')
            .addIndicators({name: 'sIntroP'})
            .addTo(controller);

        var sIntroFO_s = new ScrollMagic.Scene({
                triggerElement: '#sIntroFadeOUT_trigger'
            })
            // .triggerHook('onEnter')
            .setTween(sIntroFO_t)
            .offset(document.getElementById('sIntro').offsetHeight / 2)
            .addIndicators({name: 'sIntroFO'})
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
            .addIndicators({name: 'sMapZI'})
            .addTo(controller);
            
            
            
        var sTimeline_boxP_s = new ScrollMagic.Scene({
                triggerElement: '#section4',
                duration: document.getElementById('sData_right').offsetHeight + 700
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