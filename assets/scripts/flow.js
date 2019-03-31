/***** Configuration *****/
var color = d3.scaleOrdinal();

d3.csv("./data/permis_tournages.csv").then(function(permisData) {
    d3.csv("./data/protocoles_tournages.csv").then(function(protocolesData) {
        const mapsvg = d3.select("#map").append("svg")
            .attr("width", 900)
            .attr("height", 750);

        colorScale(color, prodTypesGroups);
        var sources = createSources(permisData, protocolesData);
        const shooting_map = create_shooting_map(mapsvg, 900, 750, sources, color);

        var stepOne = function() {
        }

        var stepTwo = function() {
        }

        var stepThree = function() {
        }

        var stepFour = function() {

        }

        const vis_steps = [stepOne, stepTwo, stepThree, stepFour];

        const gs = d3.graphScroll()
        .container(d3.select("#container"))
        .eventId('sec1_id')
        .sections(d3.selectAll("#container #sections > section"))
        .on("active", function(i) {
            vis_steps[i]();
        });
    });
});
