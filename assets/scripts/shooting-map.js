
function create_shooting_map(parent, width, height, sources, color) {

  var projection = d3.geoMercator().center([ -73.75,45.58 ]).scale([ 80000 ]).translate([width/2, height/2]);
  var path = d3.geoPath().projection(projection);

  d3.json("./data/montrealTerreGeo.json")
    .then(function(geojson) {
      // Summarized data for each district
      var districts = {}

      geojson.features.forEach(feature => {
        districts[feature.properties.NOM] = {
          prodTypeCount: prodTypesGroups.reduce((obj, type) => {
            return { ...obj, [type.groupId]: 0 }
          }, {}),
          permitsCount: 0,
          maj: null
        }
      })

      sources.forEach(type => {
        type.values.forEach(demande => {
          demande.values.forEach(district => {
            districts[district.key] = districts[district.key] || { prodTypeCount: {}, permitsCount: 0 }

            districts[district.key].prodTypeCount[type.key]++

            districts[district.key].permitsCount += district.values.length
          })
        })
      })

      Object.values(districts).forEach(district => {
        district.maj = Object.keys(district.prodTypeCount).reduce((maj, key) => {
          var majCount = maj !== null ? district.prodTypeCount[maj] : 0
          return district.prodTypeCount[key] > majCount ? key : maj
        }, null)
      })

      var tooltip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(d => `${d.values[0].TITRE_PRODUCTION} (${d.values[0].DUREE_DE.split("-")[0]})`)

      parent.call(tooltip)

      var focusedDistrict

      var graph = parent.append("g");

      graph.selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("id", d => `${d.properties.NOM}-district`)
        .attr("name", d => d.properties.NOM)
        .attr("class", "zone no-highlight")
        .attr("d", path)
        .attr("fill", "white")
        .attr("stroke", d => districts[d.properties.NOM].maj !== null ? color(districts[d.properties.NOM].maj) : "#333333")
        .on("click", function(d) {

          // inspired by https://bl.ocks.org/mbostock/2206590

          var x, y, k

          
          d3.select(".selected").classed("no-highlight", true);
          d3.select(".selected").classed("selected", false);
          d3.select(this).classed("no-highlight", false);

          if (focusedDistrict !== d) {
            d3.select(this).classed("selected", true);

            showPanel(d, districts[d.properties.NOM]);

            var centroid = path.centroid(d)
            x = centroid[0]
            y = centroid[1]
            k = 4
            focusedDistrict = d
          } else {
            d3.select("#mapPanel").style("display", "none");
            x = width / 2
            y = height / 2
            k = 1
            focusedDistrict = null
          }

          graph.transition()
            .duration(750)
            .attr("transform", `translate(${width / 2}, ${height / 2})scale(${k})translate(${-x}, ${-y})`)
        })
        .on("mouseover", function(d) {
          d3.select(this).classed("no-highlight", false);
        })
        .on("mouseout", function(d) {
          if (d !== focusedDistrict) {
            d3.select(this).classed("no-highlight", true);
          }
        })

      // Create a sub 'g' for each prod types groups
      const prodTypesGroupsEnter = graph.selectAll("g")
        .data(sources)
        .enter()
        .append("g")
        .attr("id", d => `prodGroup${d.key}`)
        .attr("groupId", d => d.key)

      // Create a sub 'g' for each prod ids groups (a particular prod may have been shot at different locations)
      const prodIdsGroupsEnter = prodTypesGroupsEnter.merge(prodTypesGroupsEnter).selectAll("g")
        .data(d => d.values)
        .enter()
        .append("g")
        .attr("id", d => `prodId${d.key}`)
        .attr("prodName", d => d.NOM_PRO)

      // Create a circle for each shootings
      const circle = prodIdsGroupsEnter.merge(prodIdsGroupsEnter).selectAll("circle")
        .data(d => d.values)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("stroke", "black")
        .attr("stroke-width", 0.1)
        .attr("stroke-opacity", 0.5)
        .attr("name", d => d.values[0].NOM_ARROND)
        .attr("r", 1)
        .attr("transform", d => `translate(${projection([d.values[0].LONGITUDE, d.values[0].LATITUDE])})`)
        .attr("fill", function(d) {
            return color(d3.select(this.parentNode.parentNode).attr("groupId"));
        })
        .on("mouseover", function(d) {
          tooltip.show.call(this, d)
        })
        .on("mouseout", tooltip.hide)


      // Create the map legend
      legend(parent, prodTypesGroups, color);
    });

}

// Display an info panel when a region is clicked on the map
function showPanel(feature, districtSummary) {
  var panel = d3.select("#mapPanel");
  panel.style("display", "block");

  var districtNameElem = panel.select("#zone-name");
  districtNameElem.text(feature.properties.NOM);

  panel.select("#zone-count").text("Nombre de permis de tournages : " + districtSummary.permitsCount)
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
    //d3.select(prodGroup).style("opacity", 1);
    d3.select(prodGroup).style("display", "table");
  } else {
    element.attr("fill", "white");
    //d3.select(prodGroup).style("opacity", 0);
    d3.select(prodGroup).style("display", "none");
  }
}
