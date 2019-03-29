/***** Configuration *****/
var color = d3.scaleOrdinal();
var prodTypes = [
  {id: 13, color: "#a6cee3", name: "Série télévisée"},
  {id: 16, color: "#1f78b4", name: "Court métrage"},
  {id: 11, color: "#FFFF00", name: "Long métrage"},
  {id: 22, color: "#b2df8a", name: "Documentaire"},
  {id: 26, color: "#33a02c", name: "Evénement média"},
  {id: 19, color: "#fb9a99", name: "Film étudiant"},
  {id: 20, color: "#e31a1c", name: "Multimédia"},
  {id: 18, color: "#fdbf6f", name: "Photographie"},
  {id: 25, color: "#008000", name: "Photographie étrangère"},
  {id: 21, color: "#ff7f00", name: "Publicité étrangère"},
  {id: 15, color: "#00FFFF", name: "Message publicitaire"},
  {id: 28, color: "#0000FF", name: "Publicité web"},
  {id: 12, color: "#cab2d6", name: "Téléfilm"},
  {id: 23, color: "#FF00FF", name: "Télé-roman"},
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

      const linesvg = d3.select("#lineChart").append("svg")
              .attr("width", 900)
              .attr("height", 650);

      let graphChartsvg = d3.select("#graphChart").append("svg")
              .attr("width", 1200)
              .attr("height", 650);


        colorScale(color, prodTypes);
        var sources = createSourcesMap(permisData, protocolesData);
        const shooting_map = create_shooting_map(mapsvg, 900, 650, sources, color);

        var sources = createSourcesLineChart(protocolesData);
        const linechart = create_lineChart(linesvg, 750, 450, sources);

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


          // Graphique principal (focus)
          var marginFocus = {
            top: 10,
            right: 10,
            bottom: 100,
            left: 60
          };
          var widthFocus = 1000 - marginFocus.left - marginFocus.right;
          var heightFocus = 500 - marginFocus.top - marginFocus.bottom;

          // Graphique secondaire qui permet de choisir l'échelle de la visualisation (contexte)
          var marginContext = {
            top: 430,
            right: 10,
            bottom: 30,
            left: 60
          };
          var widthContext = widthFocus;
          var heightContext = 500 - marginContext.top - marginContext.bottom;

          /***** Échelles *****/
          var xFocus = d3.scaleLinear().range([0, widthFocus]);
          var yFocus = d3.scaleLinear().range([heightFocus, 0]);

          var xContext = d3.scaleTime().range([0, widthContext]);
          var yContext = d3.scaleLinear().range([heightContext, 0]);

          var xAxisFocus = d3.axisBottom(xFocus).tickFormat(d3.format("d"));
          var yAxisFocus = d3.axisLeft(yFocus);

          var xAxisContext = d3.axisBottom(xContext).tickFormat(d3.format("d"));

          /***** Création des éléments *****/


          // Groupe affichant le graphique principal (focus).
          var focus = graphChartsvg.append("g")
            .attr("transform", "translate(" + marginFocus.left + "," + marginFocus.top + ")");

          // Groupe affichant le graphique secondaire (contexte).
          var context = graphChartsvg.append("g")
   .attr("transform", "translate(" + marginContext.left + "," + marginContext.top + ")");
          // Ajout d'un plan de découpage.
          graphChartsvg.append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", widthFocus)
            .attr("height", heightFocus);

          // Fonctions pour dessiner les lignes
          var lineFocus = createLine(xFocus, yFocus);
          var lineContext = createLine(xContext, yContext);

          // Permet de redessiner le graphique principal lorsque le zoom/brush est modifié.
          var brush = d3.brushX()
            .extent([[0, 0], [widthContext, heightContext]])
            .on("brush", function () {
              brushUpdate(brush, focus, lineFocus, xFocus, xContext, xAxisFocus, yAxisFocus, sources, color, lineContext);
            });

          /***** Chargement des données *****/
            parseDate(protocolesData);

            // var sources = createSources(color, data);
            var sources = createSourcesBrushGraph(color, protocolesData, prodTypes)
            domainX(xFocus, xContext, protocolesData);
            domainY(yFocus, yContext, sources);

            /***** Création du graphique focus *****/
            // createFocusLineChart(focus, sources, lineFocus, color);


            const graphChart = createFocusGraphChart(graphChartsvg, sources, lineFocus, color)
            // Axes focus
            focus.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + heightFocus + ")")
              .call(xAxisFocus);

            focus.append("g")
              .attr("class", "y axis")
              .call(yAxisFocus);

            /***** Création du graphique contexte *****/
            createContextLineChart(graphChartsvg, sources, lineContext, color);

            // Axes contexte
            context.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + heightContext + ")")
              .call(xAxisContext);

            context.append("g")
              .attr("class", "x brush")
              .call(brush)
              .selectAll("rect")
              .attr("y", -6)
              .attr("height", heightContext + 7);

            /***** Création de la légende *****/
            legend(graphChartsvg, sources, color);





    });
});


//
// /**
//  * Fichier principal permettant de dessiner les deux graphiques demandés. Ce fichier utilise les autres fichiers
//  * que vous devez compléter.
//  *
//  * /!\ Aucune modification n'est nécessaire dans ce fichier!
//  */
// (function(d3, localization) {
//   "use strict";
//
//   /***** Configuration *****/
//
// })(d3, localization);
