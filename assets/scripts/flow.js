/***** Configuration *****/
var color1 = d3.scaleOrdinal();
var color2 = d3.scaleOrdinal();
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
  {id: 21, color: "#FF00FF", name: "Publicité étrangère"},
  {id: 15, color: "#00FFFF", name: "Message publicitaire"},
  {id: 28, color: "#00FF00", name: "Publicité web"},
  {id: 12, color: "#cab2d6", name: "Téléfilm"},
  {id: 23, color: "#ff7f00", name: "Télé-roman"},
  {id: 14, color: "#ff8c00", name: "Télévision générale"},
  {id: 17, color: "#ffff99", name: "Vidéo"},
  {id: 24, color: "#e9332f", name: "Vidéo corporatif"},
  {id: 1, color: "#b15928", name: "À déterminer"}
];


var colorOrigins = d3.scaleOrdinal();
var origins = [
	{id: 1, color: "#ff0000", name: "Canadienne"},
	{id: 2, color: "#36ad80", name: "Coproduction"},
	{id: 3, color: "#f6be00", name: "Etrangère"},
	{id: 4, color: "#a7aead", name: "À déterminer"}
];
d3.csv("./data/permis_tournages.csv").then(function(permisData) {
    d3.csv("./data/protocoles_tournages.csv").then(function(protocolesData) {
        const mapsvg = d3.select("#map").append("svg")
            .attr("width", 900)
            .attr("height", 750);

        const mapPanel = mapsvg.append("g")
          .attr("id", "panel")

        mapPanel.append("text")
          .attr("id", "district-name")
          .attr("x", "25%")
          .attr("y", "25%");

        // mapPanel.append("text")
        //   .attr("id", "district-count")
        //   .attr("x", "25%")
        //   .attr("y", "25%")

      const linesvg = d3.select("#lineChart").append("svg")
              .attr("width", 900)
              .attr("height", 650);



        colorScale(color1, prodTypes);
        var sources = createSourcesMap(permisData, protocolesData);
        const shooting_map = create_shooting_map(mapsvg, 900, 650, sources, color1);
        colorScaleLineChart(color2, prodTypes);
        var sources = createSourcesLineChart(protocolesData);
        const linechart = create_lineChart(linesvg, 750, 450, sources);
        const sqrsvg = d3.select("#sqrviz")
        						.append("svg")
        						.attr("width",600)
        						.attr("height",500)
        						.attr("transform", "translate(0,20)");
        		colorScale(colorOrigins, origins);
        		var tip_sqr_viz = d3.tip()
        			.attr('class', 'd3-tip')
        			.offset([-10, 0]);
        		const sqr_viz = create_sqr_viz(sqrsvg, protocolesData, colorOrigins, tip_sqr_viz);
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

        var marginFocus = {
          top: 10,
          right: 10,
          bottom: 100,
          left: 60
        };
        var widthFocus = 675;
        var heightFocus = 500 - marginFocus.top - marginFocus.bottom;

        var marginContext = {
          top: 430,
          right: 10,
          bottom: 30,
          left: 60
        };
        var widthContext = widthFocus;
        var heightContext = 500 - marginContext.top - marginContext.bottom;

        var xFocus = d3.scaleTime().range([0, 900]);
        var yFocus = d3.scaleLinear().range([heightFocus, 0]);

        var xContext = d3.scaleTime().range([0, 900]);
        var yContext = d3.scaleLinear().range([heightContext, 0]);

        var xAxisFocus = d3.axisBottom(xFocus).tickFormat(d3.format("d"));
        var yAxisFocus = d3.axisLeft(yFocus);

        var xAxisContext = d3.axisBottom(xContext).tickFormat(d3.format("d"));

        var svg = d3.select("#graphChart")
          .append("svg")
          .attr("width", widthFocus + marginFocus.left + marginFocus.right)
          .attr("height", heightFocus + marginFocus.top + marginFocus.bottom);
        // console.log(widthFocus + marginFocus.left + marginFocus.right);
        // console.log(heightFocus + marginFocus.top + marginFocus.bottom);
        // Groupe affichant le graphique principal (focus).
        var focus = svg.append("g")
          .attr("transform", "translate(" + marginFocus.left + "," + marginFocus.top + ")");

        var context = svg.append("g")
          .attr("transform", "translate(" + marginContext.left + "," + marginContext.top + ")");

        svg.append("defs")
          .append("clipPath")
          .attr("id", "clip")
          .append("rect")
          .attr("width", widthFocus)
          .attr("height", heightFocus);

        var lineFocus = createLine(xFocus, yFocus);
        var lineContext = createLine(xContext, yContext);

        var brush = d3.brushX()
          .extent([[0, 0], [widthContext, heightContext]])
          .on("brush", function () {
            brushUpdate(brush, focus, lineFocus, xFocus, xContext, xAxisFocus, yAxisFocus);
          });

            parseDate(protocolesData);
            var sources = createSourcesGraphChart(color2, protocolesData, prodTypes);

            domainX(xFocus, xContext, protocolesData);
            domainY(yFocus, yContext, sources);

            createFocusLineChart(focus, sources, lineFocus, color2);

            // Axes focus
            focus.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + heightFocus + ")")
              .call(xAxisFocus);

            focus.append("g")
              .attr("class", "y axis")
              .call(yAxisFocus);

            createContextLineChart(context, sources, lineContext, color2);

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

              var legendSVG = d3.select("#legend")
                .append("svg")
                .attr("width", 175)
                .attr("height",500);
             legendLineChart(legendSVG, sources, color2);



    });
});
