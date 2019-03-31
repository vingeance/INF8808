/**
 * Calcule le pourcentages
 *
 * @param sources     Données de la visualisation
 * @return {Object}   Retourne un tableau donnant pour chaque provenance le pourcentage correspondant (arrondi à l'entier)
 */
function compute_percentage(sources){
	// on récupère les différents types de production depuis source
	var prod_origins = [...new Set(sources.map(d => d.NOM_PROVENANCE))];
	console.log(prod_origins);
	
	// On crée le tableau adéquate
	var obj_percentage = {};
	var tab_percentage = [];
	var i;
	
	// Initialisation du tableau associatif
	for(i = 0; i < prod_origins.length ; i++){
		obj_percentage[prod_origins[i]] = 0;
	}
	
	// remplissage du tableau associatif
	for(i = 0; i < sources.length ; i++){
		obj_percentage[sources[i].NOM_PROVENANCE] += 1;
	}
	
	// on transforme en pourcentage et on crée notre tableau tab_percentage
	for (var key in obj_percentage) {
		if (obj_percentage.hasOwnProperty(key)) {
			obj_percentage[key] /= sources.length;
			obj_percentage[key] *= 100;
			obj_percentage[key] = Math.round(obj_percentage[key]);
			tab_percentage.push({"name": key, "percentage": obj_percentage[key]});
		}
	}
	
	// on trie notre tableau selon les pourcentages
	tab_percentage.sort(function(a,b){ return b.percentage - a.percentage});
	
	//console.log(tab_percentage);
	//console.log(obj_percentage);
	
	return tab_percentage;
}


function create_sqr_viz(parent, sources, color, tip){
  
  const percentage = compute_percentage(sources);
  console.log(percentage);
  
  // Cette ligne était manquante. Elle doit être appelée avant d'utiliser le tooltip.
  parent.call(tip);
  
  // Le texte à afficher dans le tooltip.
  tip.html(d => `${d.name} (${d.percentage}%)`);
  
  var viz = parent.append("g");
  var legend = parent.append("g")
				.attr("class", "legend");
 
  var i;
  var j = 0;
  for(i = 0; i < percentage.length; i++){
	var nb_sqr = percentage[i].percentage + j;
	for(j; j < nb_sqr; j++) {
		// Ici, je crée une IIFE pour ne pas perdre la référence à la variable percentage[i].
		(() => {
			var currentPercentage = percentage[i];
			console.log(currentPercentage);
			var nb_col = j % 10;
			var nb_row = Math.floor(j/10);
			viz.append("rect")
			.attr("x", 36*nb_col)
			.attr("y", 36*nb_row)
			.attr("width", 30)
			.attr("height", 30)
			.attr("fill", color(percentage[i].name))
			.on("mouseover", function() {
				// J'ai ajouté l'instruction call en raison de l'absence de data binding.
				tip.show.call(this, currentPercentage);
			})
			.on("mouseout", tip.hide);
		})();
	}
  }
  
  for(i = 0; i < percentage.length; i++){
	const shift = 380 + 25*i;
	var item = legend.append("g")
				.attr("id", "who" + i)
				.attr("transform", "translate(0," + shift +")");
	
	item.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", 15)
		.attr("height", 15)
		.attr("fill", color(percentage[i].name));
		
	item.append("text")
		.attr("x", 25)
		.attr("y", 15)
		.text(percentage[i].name);
  }

}
