"use strict";

function legendLineChart(svg, sources, color) {
  var legend = svg.append("g")
    .attr("class","legend")
    .attr("transform","translate(5,30)")
    .style("font-size","12px");

  legend.selectAll('rect')
    .data(sources)
    .enter()
    .append("rect")
    .attr("value", function(source){
      return source.name;
    })
    .attr("y", function(source, i){
      return i *  25;
    })
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", function(source) {
      var colorName;
      if(source.name == "Documentaire"){
        colorName = "#000000"
      } else if(source.name == "Multimédia"){
       colorName = "#f95770"
     } else if(source.name == "Photographie"){
       colorName = "#5439A4"
     }  else if(source.name == "Vidéo"){
         colorName = "#FF4949"
       }  else if(source.name == "À-déterminer"){
            colorName = "#8d021f"
          }else {
        colorName = color(source.name)
      }
      return colorName;
    })
    .attr("stroke", "black")
    .on("click", function() {
        displayLine(d3.select(this), color);
    });

  legend.selectAll('text')
    .data(sources)
    .enter()
    .append("text")
    .attr("x", 20)
    .attr("y", function(source, i){ return i *  25 + 12;})
    .text(function(source) {
      const nom = (source.name).replace('-', ' ');
      return nom;
    });
}

function displayLine(element, color) {
  let elementValue = element.attr("value");
  let focusSelector = "g#focus" + " #focus-" + elementValue;
  let contextSelector = "g.context" + " #context" + elementValue;
  if(d3.select(focusSelector).style("display") == "none") {
    d3.select(focusSelector).style("display", "inline");
    d3.select(contextSelector).style("display", "inline");
    element.attr("fill", function() {
       var colorName;
       if(elementValue == "Documentaire"){
         colorName = "#000000"
       } else if(elementValue == "Multimédia"){
        colorName = "#f95770"
      } else if(elementValue == "Photographie"){
        colorName = "#5439A4"
      }  else if(elementValue == "Vidéo"){
          colorName = "#FF4949"
        }  else if(elementValue == "À-déterminer"){
            colorName = "#8d021f"
           }else {
         colorName = color(elementValue)
       }
       return colorName;
    })
  }
  else {
    d3.select(focusSelector).style("display", "none");
    d3.select(contextSelector).style("display", "none");
    element.attr("fill", "white");
  }
}
