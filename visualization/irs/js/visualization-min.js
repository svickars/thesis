function getD3(){var t=document.body.getBoundingClientRect(),e=map.getCenter(),o=map.getZoom(),r=256/Math.PI*Math.pow(2,o);return d3.geoMercator().center([e.lng,e.lat]).translate([t.width/2,t.height/2]).scale(r)}function drawStory(t){d3.select(".storyTime").remove(),d3.json("js/data/stories/stories.json",function(e){var o=e.stories.filter(function(e){return e.id===t});o=o[0];var r=o.name,n=o.bio,s=o.schoolBio;storySelected=o.name+" was",pageSix(r);var a=d3.select("#storyTime").append("div").attr("class","storyTime").html("<div id='storyName'></div><div id='storyBio'></div><div id='storySchoolBio'></div><div id='storyStories'></div>"),l=d3.select("#storyName").append("h1").attr("class","name").html("<span class='storyName'>"+r+"</span>"),i=d3.select("#storyBio").append("div").attr("class","bio").html("<p>"+n+"</p>"),c=d3.select("#storySchoolBio").append("div").attr("class","schoolBio").html("<p>"+s+"</p>");storyName_p=new ScrollMagic.Scene({triggerElement:"#storyName",duration:"100%"}).offset(document.getElementById("storyName").offsetHeight/2+"px").setPin("#storyName").addTo(controller),storyBio_p=new ScrollMagic.Scene({triggerElement:"#storyBio",duration:"100%"}).offset(document.getElementById("storyBio").offsetHeight/2+"px").setPin("#storyBio").addTo(controller),storySchoolBio_p=new ScrollMagic.Scene({triggerElement:"#storySchoolBio",duration:"100%"}).offset(document.getElementById("storySchoolBio").offsetHeight/2+"px").setPin("#storySchoolBio").addTo(controller);for(var d=TweenMax.to("#storyName",.5,{opacity:"0"}),p=TweenMax.to("#storyBio",.5,{opacity:"0"}),y=TweenMax.to("#storySchoolBio",.5,{opacity:"0"}),g=new ScrollMagic.Scene({triggerElement:"#storyBio"}).triggerHook("onEnter").setTween(d).addTo(controller),u=new ScrollMagic.Scene({triggerElement:"#storySchoolBio"}).triggerHook("onEnter").setTween(p).addTo(controller),m=new ScrollMagic.Scene({triggerElement:"#storyStories"}).triggerHook("onEnter").setTween(y).addTo(controller),f=0;f<o.story.length;f++){var h=d3.select("#storyStories").append("div").attr("class","storyStories").attr("id","story-"+f);if(""===o.story[f].quote){var v=o.story[f].section,w=o.story[f].pre;h.html("<p class='story-section'>"+v+"</p><p class='story-quote'>"+w+"</p>")}else{var v=o.story[f].section,w=o.story[f].pre,S=o.story[f].quote,T=RiString(S),x=T.words(),M=T.pos();h.html("<p class='story-section'>"+v+"</p><p class='story-pre'>"+w+"</p><p class='story-quote'>&ldquo;<span id='story-quote-"+f+"'></span>&rdquo;</p>")}for(var D=0;D<x.length;D++)if(/[,.?\-]/.test(x[D+1]))var A=d3.select("#story-quote-"+f).append("span").attr("id","quote-"+D).attr("class","pos-"+M[D]).html(x[D]);else var A=d3.select("#story-quote-"+f).append("span").attr("id","quote-"+D).attr("class","pos-"+M[D]).html(x[D]+" ")}for(var f=0;f<o.story.length-1;f++){var j=f+1,L=new ScrollMagic.Scene({triggerElement:"#story-"+f,duration:"100%"}).offset(document.getElementById("story-"+f).offsetHeight/2+"px").setPin("#story-"+f).addTo(controller),b=TweenMax.to("#story-"+f,.5,{opacity:"0"});if(f<o.story.length)var B=new ScrollMagic.Scene({triggerElement:"#story-"+j}).triggerHook("onEnter").setTween(b).addTo(controller)}var k=o.story.length-1;storyStory_last_p=new ScrollMagic.Scene({triggerElement:"#story-"+k,duration:"100%"}).offset(document.getElementById("story-"+k).offsetHeight/2+"px").setPin("#story-"+k).addTo(controller);var b=TweenMax.to("#story-"+k,.5,{opacity:"0"}),B=new ScrollMagic.Scene({triggerElement:"#p6"}).triggerHook("onEnter").setTween(b).addTo(controller)})}function pageSix(t){d3.selectAll(".overlay").remove(),d3.selectAll(".dot").classed("schoolMarker",!0).style("opacity",1),d3.selectAll(".label").classed("schoolLabel",!0).style("opacity",1);var e=d3.select("#oneof").append("div").attr("class","overlay").html(storySelected+" one of an estimated <span class='orange'>150,000</span> Aboriginal children to attend a residential school in Canada."),o=d3.select("#thismany").append("div").attr("class","overlay").html("There were <span class='orange'>132</span> schools located throughout the country."),r=d3.select("#fromreserves").append("div").attr("class","overlay").html("Students were drawn from reserves, bands, and tribes all over Canada, some as far away as <span class='orange'>8000km</span>."),n=new ScrollMagic.Controller;TweenLite.defaultOverwrite=!1,d3.json("js/data/stories/stories.json",function(e){e=e.stories.filter(function(e){return e.name===t}),e=e[0],map.flyTo({center:[e.latLng.lng,e.latLng.lat],zoom:e.zoom,bearing:0,speed:100,curve:1,easing:function(t){return t}}),d3.select("#dot-"+e.schoolID).classed("schoolMarker",!1),d3.select("#label-"+e.schoolID).classed("schoolLabel",!1),new ScrollMagic.Scene({triggerElement:"#tMap1_zo"}).addTo(n).on("progress",function(t){"FORWARD"===t.scrollDirection?(d3.selectAll(".schoolLabel").style("opacity","0"),d3.selectAll(".schoolMarker").style("opacity","0"),map.flyTo({center:[-100,58],zoom:4,bearing:0,speed:2,curve:1,easing:function(t){return t}})):(d3.select("#dot-"+e.schoolID).style("opacity",1),d3.select("#label-"+e.schoolID).style("opacity",1),map.flyTo({center:[e.latLng.lng,e.latLng.lat],zoom:e.zoom,bearing:0,speed:5,curve:1,easing:function(t){return t}}))}),new ScrollMagic.Scene({triggerElement:"#tMap1_irs"}).addTo(n).on("progress",function(t){"FORWARD"===t.scrollDirection?(d3.selectAll(".schoolMarker").transition().duration(600).ease(d3.easeLinear).style("opacity",1),d3.select("#label-"+e.schoolID).transition().duration(600).ease(d3.easeLinear).style("opacity",0)):(d3.selectAll(".schoolMarker").transition().duration(600).ease(d3.easeLinear).style("opacity",0),d3.select("#label-"+e.schoolID).transition().duration(600).ease(d3.easeLinear).style("opacity",1))}),new ScrollMagic.Scene({triggerElement:"#tMap1_reserves"}).addTo(n).on("progress",function(t){"FORWARD"===t.scrollDirection?d3.selectAll(".reserveDot").style("display","block").transition().duration(600).ease(d3.easeLinear).style("opacity",.1):(d3.selectAll(".reserveDot").transition().duration(600).ease(d3.easeLinear).style("opacity",0),d3.selectAll(".reserveDot").transition().delay(600).style("display","none"))});var o=new ScrollMagic.Scene({triggerElement:"#oneof",duration:"150%"}).offset(document.getElementById("oneof").offsetHeight/2+"px").setPin("#oneof").addTo(n),r=TweenMax.to("#oneof",.5,{opacity:"0"}),s=new ScrollMagic.Scene({triggerElement:"#thismany"}).triggerHook("onEnter").setTween(r).addTo(n),a=new ScrollMagic.Scene({triggerElement:"#thismany",duration:"150%"}).offset(document.getElementById("thismany").offsetHeight/2+"px").setPin("#thismany").addTo(n),l=TweenMax.to("#thismany",.5,{opacity:"0"}),i=new ScrollMagic.Scene({triggerElement:"#fromreserves"}).triggerHook("onEnter").setTween(l).addTo(n),c=new ScrollMagic.Scene({triggerElement:"#fromreserves",duration:"100%"}).offset(document.getElementById("fromreserves").offsetHeight/2+"px").setPin("#fromreserves").addTo(n),d=TweenMax.to("#fromreserves",.5,{opacity:"0"}),p=new ScrollMagic.Scene({triggerElement:"#tMap1_connections"}).triggerHook("onLeave").setTween(d).addTo(n)})}function rightBarOut(t){setTimeout(function(){rightBar=!0,rightBarCurrent=!0},500);var e=t.latitude,o=t.longitude;map.flyTo({center:[o,e],zoom:10,bearing:0,speed:2,curve:1,easing:function(t){return t}}),rightBarData(t),d3.select("#rightBar").classed("rightBarOut",!0),d3.select(".mapboxgl-ctrl-top-right").transition().duration(0).style("opacity",0);var r=window.innerWidth-500;d3.select("#map").transition().delay(500).duration(0).style("height",window.innerHeight+"px").style("width",r+"px"),d3.select(".mapboxgl-ctrl-top-right").transition().delay(500).duration(500).style("opacity",1)}function rightBarData(t){console.log("let's do it")}function rightBarBack(t){d3.select("#map").style("height",window.innerHeight+"px").style("width",window.innerWidth+"px"),d3.select("#rightBar").classed("rightBarOut",!1),d3.select(".mapboxgl-ctrl-top-right").transition().duration(200).style("opacity",0),d3.select(".mapboxgl-ctrl-top-right").transition().delay(500).duration(500).style("opacity",1),map.flyTo({center:[-100,58],zoom:4,bearing:0,speed:2,curve:1,easing:function(t){return t}}),d3.selectAll(".reserveDot").style("display","block").transition().duration(600).ease(d3.easeLinear).style("opacity",.1),d3.selectAll(".schoolMarker").transition().duration(600).ease(d3.easeLinear).style("opacity",1),d3.selectAll(".schoolLabel").style("opacity","0"),rightBar=!1}var storyID="aelias";window.onload=drawStory(storyID);var orange="#f15a24",rightBar=!1,status="begin",controller=new ScrollMagic.Controller;TweenLite.defaultOverwrite=!1;var map1=d3.select("#map1_cont").append("div").attr("class","map").attr("id","map");d3.select("#map").style("height",window.innerHeight+"px").style("width",window.innerWidth+"px"),mapboxgl.accessToken="pk.eyJ1Ijoic3ZpY2thcnMiLCJhIjoiY2l1aW5saDhkMDAwMTNvbDdmcTlncnp1cyJ9.wIpJKF-DW1C2uPgKnUtNWg";var map=new mapboxgl.Map({container:"map",style:"mapbox://styles/svickars/cj15o81vo00212rqu9mw0wgkp",center:[-92.01173055555556,50.12052777777778],zoom:9});map.scrollZoom.disable(),map.dragRotate.disable(),map.addControl(new mapboxgl.Navigation);var map1_p=new ScrollMagic.Scene({triggerElement:"#tMap1_p",duration:"800%"}).triggerHook("onLeave").setPin("#map1_cont").on("enter",function(){status="map"}).addTo(controller),container=map.getCanvasContainer(),svg=d3.select(container).append("svg"),g=svg.append("g"),d3Projection=getD3(),path=d3.geoPath();d3.json("js/data/locations.json",function(t){function e(){d3Projection=getD3(),path.projection(d3Projection),p.attr("cx",function(t){return d3Projection([t.longitude,t.latitude])[0]}).attr("cy",function(t){return d3Projection([t.longitude,t.latitude])[1]}),i.attr("x",function(t){return d3Projection([t.longitude,t.latitude])[0]}).attr("y",function(t){return d3Projection([t.longitude,t.latitude])[1]}),c.attr("x",function(t){return d3Projection([t.longitude,t.latitude])[0]}).attr("y",function(t){return d3Projection([t.longitude,t.latitude])[1]}),a.attr("x",function(t){return d3Projection([t.longitude,t.latitude])[0]}).attr("y",function(t){return d3Projection([t.longitude,t.latitude])[1]}),d.attr("cx",function(t){return d3Projection([t.lng,t.lat])[0]}).attr("cy",function(t){return d3Projection([t.lng,t.lat])[1]}),l.attr("x",function(t){return d3Projection([t.lng,t.lat])[0]}).attr("y",function(t){return d3Projection([t.lng,t.lat])[1]}),p.on("mouseover",o).on("click",function(t){rightBarOut(t),d3.event.stopPropagation()}).on("mouseout",n),d.on("mouseover",r).on("mouseout",s)}function o(t){d3.select("#dot-"+t.schoolID).classed("schoolMarker",!1),d3.selectAll(".schoolMarker").style("opacity",".25"),d3.select("#dot-"+t.schoolID).style("fill","#333").style("opacity",1),d3.selectAll("#sTip-"+t.schoolID).style("opacity","1.0"),""===t.listConnections||(d3.selectAll(t.class).classed("reserveDot",!1).classed("connection",!1),d3.selectAll(t.class).style("opacity",".6")),d3.selectAll(".reserveDot").style("opacity",".05"),d3.selectAll(".connection").style("opacity",".05")}function r(t){d3.select("#rDot-"+t.id).classed("reserveDot",!1),d3.selectAll(".reserveDot").style("opacity",".025").style("fill","#333"),d3.selectAll("#rTip-"+t.id).style("opacity","1.0"),""===t.listConnections||(d3.selectAll(t.class).classed("schoolMarker",!1).classed("connection",!1),d3.selectAll(t.class).style("opacity","1"),d3.select("#rDot-"+t.id).style("opacity",.25)),d3.selectAll(".schoolMarker").style("opacity",".25"),d3.selectAll(".connection").style("opacity",".05")}function n(t){d3.selectAll(".dot").classed("schoolMarker",!0),d3.selectAll(".schoolMarker").style("fill",orange).style("opacity","1"),d3.selectAll("#sTip-"+t.schoolID).style("opacity","0"),d3.selectAll(".sTooltip").style("opacity","0"),d3.selectAll(".sTooltip2").style("opacity","0"),d3.selectAll(".rDot").classed("reserveDot",!0),d3.selectAll(".reserveDot").style("opacity",".1"),d3.selectAll(".conn").classed("connection",!0),d3.selectAll(".connection").style("opacity","0.25")}function s(t){d3.selectAll(".rDot").classed("reserveDot",!0),d3.selectAll(".reserveDot").style("opacity",".1"),d3.selectAll(".dot").classed("schoolMarker",!0),d3.selectAll(".schoolMarker").style("opacity","1"),d3.selectAll(".conn").classed("connection",!0),d3.selectAll(".connection").style("opacity","0.25"),d3.selectAll("#rTip-"+t.id).style("opacity","0"),d3.selectAll(".rTooltip").style("opacity","0")}var a=g.selectAll("text").data(t.schools).enter().append("text").attr("class","label schoolLabel").attr("id",function(t){return"label-"+t.schoolID}).attr("pointer-events","none").attr("dy","6px").attr("dx","10px").text(function(t){return t.locationName+" "+t.title}),l=g.selectAll(".rTip").data(t.reservations).enter().append("text",".rtip").attr("class","rTooltip").attr("id",function(t){return"rTip-"+t.id}).attr("pointer-events","none").attr("dx","20px").attr("dy","5px").text(function(t){return t.reserve}),i=g.selectAll(".sTip").data(t.schools).enter().append("text",".stip").attr("class","sTooltip").attr("id",function(t){return"sTip-"+t.schoolID}).attr("pointer-events","none").attr("dx","9px").attr("dy","5px").text(function(t){return t.locationName+" "+t.title}),c=g.selectAll(".sTip2").data(t.schools).enter().append("text",".stip2").attr("class","sTooltip2").attr("id",function(t){return"sTip-"+t.schoolID}).attr("pointer-events","none").attr("dx","9px").attr("dy","19px").text(function(t){return t.start+" - "+t.end}),d=g.selectAll(".rDot").data(t.reservations).enter().append("circle",".rDot").attr("pointer-events","visible").attr("class",function(t){return"rDot reserveDot "+t.listConnections}).attr("id",function(t){return"rDot-"+t.id}).style("stroke","none").style("display","none").style("opacity","0").style("fill","#333").attr("r",15),p=g.selectAll(".sCircle").data(t.schools).enter().append("circle",".sCircle").attr("class",function(t){return"schoolMarker dot "+t.listConnections}).attr("pointer-events","visible").attr("id",function(t){return"dot-"+t.schoolID}).style("stroke","none").style("opacity",1).style("fill",orange).attr("r",5);map.on("viewreset",function(){e()}),map.on("move",function(){e()}),e()}),d3.json("js/data/connections.json",function(t){function e(){d3Projection=getD3(),path.projection(d3Projection),!1===r?o.attr("x1",function(t){return d3Projection([t.sLng,t.sLat])[0]}).attr("y1",function(t){return d3Projection([t.sLng,t.sLat])[1]}).attr("x2",function(t){return d3Projection([t.sLng,t.sLat])[0]}).attr("y2",function(t){return d3Projection([t.sLng,t.sLat])[1]}):o.attr("x1",function(t){return d3Projection([t.sLng,t.sLat])[0]}).attr("y1",function(t){return d3Projection([t.sLng,t.sLat])[1]}).attr("x2",function(t){return d3Projection([t.eLng,t.eLat])[0]}).attr("y2",function(t){return d3Projection([t.eLng,t.eLat])[1]})}var o=g.selectAll("line").data(t).enter().append("line").attr("class",function(t){return"connection conn "+t.id}).attr("id",function(t){return"conn-"+t.id}).style("stroke",orange).style("opacity",.25),r=!1;new ScrollMagic.Scene({triggerElement:"#tMap1_connections"}).addTo(controller).on("progress",function(t){"FORWARD"===t.scrollDirection?(r=!0,o.transition().duration(1500).attr("x2",function(t){return d3Projection([t.eLng,t.eLat])[0]}).attr("y2",function(t){return d3Projection([t.eLng,t.eLat])[1]})):(r=!1,o.transition().duration(1500).attr("x2",function(t){return d3Projection([t.sLng,t.sLat])[0]}).attr("y2",function(t){return d3Projection([t.sLng,t.sLat])[1]}))}),map.on("viewreset",function(){e()}),map.on("move",function(){e()}),map.on("rotate",function(){e()}),e()}),jQuery("#stories-select").draggable({axis:"x",cursor:"move",containment:"stories"});var storiesSelectScroll=(new TimelineMax).to("#stories-select",1,{x:"-50%",delay:.25}),p4pin=new ScrollMagic.Scene({triggerElement:"#p4",triggerHook:"onLeave",duration:"200%"}).setPin("#p4").setTween(storiesSelectScroll).addTo(controller);d3.json("js/data/stories/stories.json",function(t){for(var e=0;e<t.stories.length;e++){var o=d3.select("#stories-select").append("div").attr("class","story-option-container").attr("id",t.stories[e].id).on("click",function(t,e){storyID=d3.select(this).attr("id"),d3.selectAll(".story-option-container").transition().duration(200).ease(d3.easeLinear).style("opacity",.1),d3.select("#"+storyID).transition().duration(200).ease(d3.easeLinear).style("opacity",1),drawStory(storyID),p4pin.destroy()});d3.select("#"+t.stories[e].id).append("div").attr("class","story-option-circle").attr("id","story-option"+e).style("background","linear-gradient(rgba(241, 90, 36, 0.25),rgba(241, 90, 36, 0.25)), url('js/data/stories/images/"+t.stories[e].picture+"'), rgb(241, 90, 36)").style("background-size","10em");d3.select("#"+t.stories[e].id).append("div").attr("class","story-label").html("<p class='story-option-name'>"+t.stories[e].name+"</p><p class='story-option-quote'>&ldquo;"+t.stories[e].pull+"&rdquo;</p>")}}),map.on("click",function(t){!0===rightBar&&rightBarBack(t)});