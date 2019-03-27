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


function create_sqr_viz(parent, sources, color){
  
  const percentage = compute_percentage(sources);
  //console.log(percentage);
  
  // percentage est le tableau ordonnée
  // pour chaque élément de percentage, on détermine le nombre de carré à dessiner (à vérifier mais 1 carré = 1%)
  // On dessine ensuite le nombre de carré correspondant
  
  // on ajoute le tool-tip lorsqu'on passe la souris au dessus
  
  
  // on ajoute la légende
}

