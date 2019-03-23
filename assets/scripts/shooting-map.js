
function create_shooting_map(parent, width, height, sources){
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
          .attr("class", "zone")
          .attr("d", path)
          .attr("fill", "darkgrey")
          .on("click", function(d) {
              var zoneSource = sources.find(function (e) {
                console.log(d.properties["NUM"]);
                return d.properties["NUM"] === e.id;
              });
              console.log(zoneSource);
              if(zoneSource != undefined)
                showPanel(zoneSource);
          });
    });
}

/**
 * Affichage du panneau d'informations pour une certain circonscription.
 *
 * @param districtId    Le numéro de circonscription à utiliser pour afficher les bonnes informations.
 */
function showPanel(zoneSource) {
  var panel = d3.select("#panel");
  panel.style("display", "block");

  var districtNameElem = panel.select("#district-name");
  districtNameElem.text(zoneSource.zone);

  /*var nbShootings = 0;
  csvdata.forEach(function(entry) {
    if(entry.NOM_ARROND == zoneName) {
      nbShootings++;
    }
  })
  console.log(nbShootings);*/
}
