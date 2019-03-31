
d3.select("#mapPanel").append("g")
  .attr("id", "panel")
  .append("text")
  .attr("id", "district-name")
  .attr("x", "25%")
  .attr("y", "25%");

function create_shooting_map(parent, width, height, sources, color) {

  var projection = d3.geoMercator().center([ -73.75,45.58 ]).scale([ 80000 ]).translate([width/2, height/2]);
  var path = d3.geoPath().projection(projection);

  d3.json("./data/montrealTerreGeo.json")
    .then(function(geojson) {

      var graph = parent.append("g");
      graph.selectAll("path")
        .data(geojson.features)
        .enter()
          .append("path")
          .attr("id", function(d) {
            return d.properties["NUM"];
          })
          .attr("name", function(d) {
            return d.properties["NOM"];
          })
          .attr("class", "zone")
          .attr("d", path)
          .attr("fill", "white")
          .on("click", function(d) {
              showPanel(d.properties["NOM"]);
          });

      // Create a sub 'g' for each prod types groups
      const prodTypesGroupsEnter = graph.selectAll("g")
        .data(sources)
        .enter()
        .append("g")
        .attr("id", function(d) {
          return "prodGroup" + d.key;
        })
        .attr("groupId", function(d) {
          return d.key;
        });

      // Create a sub 'g' for each prod ids groups (a particular prod may have been shot at different locations)
      const prodIdsGroupsEnter = prodTypesGroupsEnter.merge(prodTypesGroupsEnter).selectAll("g")
        .data(d => d.values)
        .enter()
        .append("g")
        .attr("id", function(d) {
          return "prodId" + d.key;
        })
        .attr("prodName", function(d) {
          return d.NOM_PRO;
        });

      // Create a circle for each shootings
      const circle = prodIdsGroupsEnter.merge(prodIdsGroupsEnter).selectAll("circle")
        .data(d => d.values)
        .enter()
          .append("circle")
          .attr("class", "circle")
          .attr("name", function(d) {
            return d.values[0].NOM_ARROND;
          })
          .attr("r",2)
          .attr("transform", function(d) {
            return "translate(" + projection([d.values[0].LONGITUDE, d.values[0].LATITUDE]) + ")";
          })
          .attr("fill", function(d) {
              return color(d3.select(this.parentNode.parentNode).attr("groupId"));
          })
    });

    // Create the map legend
    legend(parent, prodTypesGroups, color);
}

// Display an info panel when a region is clicked on the map
function showPanel(pathName) {
  var panel = d3.select("#panel");
  panel.style("display", "block");

  var districtNameElem = panel.select("#district-name");
  districtNameElem.text(pathName);
}

// Legend for the map
function legend(svg, prodGroups, color) {

  var legend = svg.append("g")
    .attr("class","legend")
    .attr("transform","translate(20, 20)")
    .style("font-size","12px");

  legend.selectAll('rect')
    .data(prodGroups)
    .enter()
    .append("rect")
    .attr("value", function(source){
      return source.groupId;
    })
    .attr("y", function(source, i){
      return i *  25;                            // distance between squares
    })
    .attr("width", 15)                           // width of a square
    .attr("height", 15)                          // height of a square
    .attr("fill", function(source) {
      return color(source.groupId);
    })
    .attr("stroke", "black")
    .on("click", function() {
        displayCircles(d3.select(this), color);
    });

  legend.selectAll('text')
    .data(prodGroups)
    .enter()
    .append("text")
    .attr("x", 20)
    .attr("y", function(source, i){ return i *  25 + 12;})
    .text(function(source) {
      return source.groupName;
    });
}

// Display/Hide circles when a legend rectangle is clicked
function displayCircles(element, color) {
  var prodGroup = "#prodGroup" + element.attr("value");
  if (element.attr("fill") === "white") {
    element.attr("fill", function () {
      return color(element.attr("value"))
    });
    d3.select(prodGroup).style("opacity", 1);
  } else {
    element.attr("fill", "white");
    d3.select(prodGroup).style("opacity", 0);
  }
}
