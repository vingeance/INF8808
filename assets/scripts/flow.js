/***** Configuration *****/
var color = d3.scaleOrdinal();
var prodTypes = [
  {id: 13, color: "#a6cee3", name: "Série télévisée"},
  {id: 16, color: "#1f78b4", name: "Court métrage"},
  {id: 11, color: "#1f78b4", name: "Long métrage"},
  {id: 22, color: "#b2df8a", name: "Documentaire"},
  {id: 26, color: "#33a02c", name: "Evénement média"},
  {id: 19, color: "#fb9a99", name: "Film étudiant"},
  {id: 20, color: "#e31a1c", name: "Multimédia"},
  {id: 18, color: "#fdbf6f", name: "Photographie"},
  {id: 25, color: "#fdbf6f", name: "Photographie étrangère"},
  {id: 21, color: "#ff7f00", name: "Publicité étrangère"},
  {id: 15, color: "#ff7f00", name: "Message publicitaire"},
  {id: 28, color: "#ff7f00", name: "Publicité web"},
  {id: 12, color: "#cab2d6", name: "Téléfilm"},
  {id: 23, color: "#cab2d6", name: "Télé-roman"},
  {id: 14, color: "#6a3d9a", name: "Télévision générale"},
  {id: 17, color: "#ffff99", name: "Vidéo"},
  {id: 24, color: "#e9332f", name: "Vidéo corporatif"},
  {id: 1, color: "#b15928", name: "À déterminer"}
];

d3.csv("./data/permis_tournages.csv").then(function(permisData) {
    d3.csv("./data/protocoles_tournages.csv").then(function(protocolesData) {
        const mapsvg = d3.select("#map").append("svg")
            .attr("width", 900)
            .attr("height", 650);

        mapsvg.append("g")
          .attr("id", "panel")
          .append("text")
          .attr("id", "district-name")
          .attr("x", "25%")
          .attr("y", "25%");

        colorScale(color, prodTypes);
        var sources = createSources(permisData, protocolesData);
        const shooting_map = create_shooting_map(mapsvg, 900, 650, sources, color);	
		
		// Création de la première data viz
		const sqrsvg = d3.select("#sqrviz").append("svg");
		console.log(protocolesData);
		const sqr_viz = create_sqr_viz(sqrsvg, protocolesData, color);
		
		
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
