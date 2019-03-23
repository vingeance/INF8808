d3.csv("./data/permis_tournages.csv").then(function(csvdata){

    var width = 600, height = 500;
    const svg = d3.select("#graph").append("svg")
        .attr("width", width)
        .attr("height", height);

    var stepOne = function() {
    }

    var stepTwo = function() {
    }

    var stepThree = function() {
    }

    var stepFour = function() {
      var sources = createSources(csvdata);
      const shooting_map = create_shooting_map(svg, width, height, sources);
    }

    const vis_steps = [stepOne, stepTwo, stepThree, stepFour];

    const gs = d3.graphScroll()
    .container(d3.select("#container"))
    .graph(d3.select("#graph"))
    .eventId('sec1_id')
    .sections(d3.selectAll("#container #sections > section"))
    .on("active", function(i) {
        d3.select("#graph svg").selectAll("*").remove();
        vis_steps[i]();
    });

});
