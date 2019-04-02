"use strict";

/**
 * Fichier permettant de générer la légende et de gérer les interactions de celle-ci.
 */


/**
 * Crée une légende à partir de la source.
 *
 * @param svg       L'élément SVG à utiliser pour créer la légende.
 * @param sources   Données triées par nom de rue et par date.
 * @param color     Échelle de 10 couleurs.
 */
function legend(svg, sources, color) {
  // TODO: Créer la légende accompagnant le graphique.
  var legend = svg.append("g")
    .attr("class","legend")
    .attr("transform","translate(0,30)")
    .style("font-size","12px");

    /** @see https://stackoverflow.com/questions/13573771/adding-a-chart-legend-in-d3 */
  legend.selectAll('rect')
    .data(sources)
    .enter()
    .append("rect")
    .attr("value", function(source){
      return source.name;
    })
    .attr("y", function(source, i){
      return i *  20;                            // distance between squares
    })
    .attr("width", 10)                           // width of a square
    .attr("height", 10)                          // height of a square
    .attr("fill", function(source) {
      var colorName;
      if(source.name == "Documentaire"){
        colorName = "#000000"
      } else if(source.name == "Multimédia"){
       colorName = "#f95770"
     } else if(source.name == "Photographie"){
       colorName = "#5439A4"
      } else {
        colorName = color(source.name)
      }
      return colorName;
    })
    .attr("stroke", "black")
    .on("click", function() {
        displayLine(d3.select(this), color);
    });

  legend.selectAll('text')
    .data(sources)
    .enter()
    .append("text")
    .attr("x", 15)
    .attr("y", function(source, i){ return i *  20 + 9;})
    .text(function(source) {
      const nom = (source.name).replace('-', ' ');
      return nom;
    });
}

/**
 * Permet d'afficher ou non la ligne correspondant au carré qui a été cliqué.
 *
 * En cliquant sur un carré, on fait disparaitre/réapparaitre la ligne correspondant et l'intérieur du carré
 * devient blanc/redevient de la couleur d'origine.
 *
 * @param element   Le carré qui a été cliqué.
 * @param color     Échelle de 10 couleurs.
 */
function displayLine(element, color) {
  // TODO: Compléter le code pour faire afficher ou disparaître une ligne en fonction de l'élément cliqué.
  let elementValue = element.attr("value");
  let focusSelector = "g#focus" + " #focus-" + elementValue;
  let contextSelector = "g.context" + " #context" + elementValue;
  if(d3.select(focusSelector).style("display") == "none") {
    d3.select(focusSelector).style("display", "inline");
    d3.select(contextSelector).style("display", "inline");
    element.attr("fill", function() {
       var colorName;
       if(elementValue == "Documentaire"){
         colorName = "#000000"
       } else if(elementValue == "Multimédia"){
        colorName = "#f95770"
      } else if(elementValue == "Photographie"){
        colorName = "#5439A4"
       } else {
         colorName = color(elementValue)
       }
       // elementValue == "Documentaire" ? colorName = "000000": colorName = color(elementValue);
       return colorName;
    })
  }
  else {
    d3.select(focusSelector).style("display", "none");
    d3.select(contextSelector).style("display", "none");
    element.attr("fill", "white");
  }
}
