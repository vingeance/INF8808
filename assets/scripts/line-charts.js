"use strict";
function createLine(x, y) {
  var line = d3.line()
               .x(function(d) { return x(d.date);})
               .y(function(d) { return y(d.count);})
               .curve(d3.curveBasisOpen);
  return line;
}

function createFocusLineChart(g, sources, line, color) {
  g.append("g")
     .attr("id", "focus")
     .selectAll("g")
     .data(sources)
     .enter().append("g")
     .attr("id", function(source) {
       source.name = (source.name).replace(' ', '-');
          return "focus-" + source.name;
        })
     .attr("stroke-width", function(source) {
          var width;
          source.name == "Moyenne" ? width ="3px": width = "1px";
          return width;
        })
     .attr("stroke", function(source) {
          var colorName;
          if(source.name == "Documentaire"){
            colorName = "#000000"
          } else if(source.name == "Multimédia"){
           colorName = "#f95770"
         } else if(source.name == "Photographie"){
           colorName = "#5439A4"
         } else if(source.name == "Vidéo"){
            colorName = "#FF4949"
          }  else if(source.name == "À-déterminer"){
               colorName = "#8d021f"
             } else {
            colorName = color(source.name)
          }
          return colorName;
        })
     .selectAll("path")
     .data(function(source) {
          return [source.values];
        })
     .enter()
     .append("path")
     .attr("class", "line")
     .attr("clip-path", "url(#clip)")
     .attr("d", line)
     .attr("fill", "none");
}

function createContextLineChart(g, sources, line, color) {
  var contextLineGroups = g.append("g")
    .attr("class", "context")
    .selectAll("g")
    .data(sources)
    .enter().append("g");

  contextLineGroups.append("path")
    .attr("class", "line")
    .attr("d", function (d) {
      return line(d.values);
    })
    .attr("clip-path", "url(#clip)")
    .style("stroke", function (d) {
      var colorName;
      if(d.name == "Documentaire"){
        colorName = "#000000"
      } else if(d.name == "Multimédia"){
       colorName = "f95770"
     } else if(d.name == "Photographie"){
       colorName = "#5439A4"
     } else if(d.name == "Vidéo"){
         colorName = "#FF4949"
       }  else if(d.name == "À-déterminer"){
            colorName = "#8d021f"
          } else {
        colorName = color(d.name)
      }
      return colorName;
    })
    .style("stroke-width","1")
    .attr("id", function (d) {
      d.name = (d.name).replace(' ', '-');
      return "context" + d.name;
    });
}
