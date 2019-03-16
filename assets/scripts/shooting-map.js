
function create_shooting_map(parent, width, height, data){
  var margin = {top: 20, right: 20, bottom: 10, left: 20};

  var projection = d3.geoMercator().center([ -73.75,45.58 ]).scale([ 55000 ]).translate([width/2, height/2]);
  var path = d3.geoPath().projection(projection);

  parent.attr("viewBox", [
          margin.left,
          margin.top,
          (width+margin.left),
          (height+margin.bottom)
        ].join(" "))

  d3.json("./data/montrealTerreGeo.json")
    .then(function(geojson) {
        parent.append("g").attr("class", "zone")
          .selectAll("path")
          .data(geojson.features)
          .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", "#d3d3d3");
      });
}
