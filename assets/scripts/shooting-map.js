
function create_shooting_map(parent, width, height, sources, color){
  var margin = {top: 20, right: 20, bottom: 10, left: 20};

  var projection = d3.geoMercator().center([ -73.75,45.58 ]).scale([ 80000 ]).translate([width/2, height/2]);
  var path = d3.geoPath().projection(projection);

  parent.attr("viewBox", [
          margin.left,
          margin.top,
          (width+margin.left),
          (height+margin.bottom)
        ].join(" "))

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
              /*var zoneSource = sources.find(function (e) {
                return d.properties["NUM"] === e.zoneId;
              });*/
              showPanel(d.properties["NOM"]/*, zoneSource*/);
          });

      const prodGroups = graph.selectAll("g").data(sources);
      const prodGroupsEnter = prodGroups.enter()
        .append("g")
        .attr("id", function(d) {
          return d.key; // prod id
        })
        .attr("type-prod", function(d) {
          return d.TYPE_PRO; // prod id
        });

      const circle = prodGroupsEnter.merge(prodGroupsEnter).selectAll("circle")
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
              return color(d3.select(this.parentNode).attr("type-prod"));
          })
    });
}

function showPanel(pathName/*, zoneSource*/) {
  var panel = d3.select("#panel");
  panel.style("display", "block");

  var districtNameElem = panel.select("#district-name");
  districtNameElem.text(pathName);

  /*var nbShootings = 0;
  csvdata.forEach(function(entry) {
    if(entry.NOM_ARROND == zoneName) {
      nbShootings++;
    }
  })
  console.log(nbShootings);*/
}
