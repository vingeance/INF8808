var prodTypes = [
  {id: 13, typeName: "Série télévisée"},
  {id: 27, typeName: "Série web"},
  {id: 16, typeName: "Court métrage"},
  {id: 11, typeName: "Long métrage"},
  {id: 22, typeName: "Documentaire"},
  {id: 26, typeName: "Evénement média"},
  {id: 19, typeName: "Film étudiant"},
  {id: 20, typeName: "Multimédia"},
  {id: 18, typeName: "Photographie"},
  {id: 25, typeName: "Photographie étrangère"},
  {id: 21, typeName: "Publicité étrangère"},
  {id: 15, typeName: "Message publicitaire"},
  {id: 28, typeName: "Publicité web"},
  {id: 12, typeName: "Téléfilm"},
  {id: 23, typeName: "Télé-roman"},
  {id: 14, typeName: "Télévision générale"},
  {id: 17, typeName: "Vidéo"},
  {id: 24, typeName: "Vidéo corporatif"},
  {id: 1, typeName: "À déterminer"}
];

const prodTypesGroups = [
  { groupId: 0, groupName: "Série télé", color: "#a6cee3", prodTypesIds: [ 13, 27 ] },
  { groupId: 1, groupName: "Long/Court métrage", color: "#1f78b4", prodTypesIds: [ 16, 11 ] },
  { groupId: 2, groupName: "Documentaire", color: "#b2df8a", prodTypesIds: [ 22 ] },
  { groupId: 3, groupName: "Evénement média", color: "#33a02c", prodTypesIds: [ 26 ] },
  { groupId: 4, groupName: "Film étudiant", color: "#fb9a99", prodTypesIds: [ 19 ] },
  { groupId: 5, groupName: "Multimédia", color: "#e31a1c", prodTypesIds: [ 20 ] },
  { groupId: 6, groupName: "Photographie", color: "#fdbf6f", prodTypesIds: [ 18, 25 ] },
  { groupId: 7, groupName: "Publicité", color: "#ff7f00", prodTypesIds: [ 21, 15, 28 ] },
  { groupId: 8, groupName: "Téléfilm/Télé-roman", color: "#cab2d6", prodTypesIds: [ 12, 23 ] },
  { groupId: 9, groupName: "Télévision générale", color: "#6a3d9a", prodTypesIds: [ 14 ] },
  { groupId: 10, groupName: "Vidéo", color: "#ffff99", prodTypesIds: [ 17, 24 ] },
  { groupId: 11, groupName: "Autre", color: "#b15928", prodTypesIds: [ 1 ] }
];

function colorScale(color, prodTypesGroups) {
  color.domain(prodTypesGroups.map(function (d) {
    return d.groupId;
  }));
  color.range(prodTypesGroups.map(function (d) {
    return d.color;
  }));
}

function createSources(permisData, protocolesData) {
  var filtered = permisData.filter(function(d) {
    return (d.NOM_ARROND !== 'Indéfini') && (d.LONGITUDE !== "") && (d.LATITUDE !== "");
  });

  var sources = d3.nest()
    .key(function(d) { return d.NO_ID_PRO; })
    .key(function(d) { return d.NOM_ARROND; })
    .entries(filtered);

    sources.forEach(function(permis) {
        var result = protocolesData.filter(function(protocole) {
            return protocole.NO_ID_PRO === permis.key;
        });
        delete permis.NO_ID_PRO;
        permis.NOM_PRO = (result[0] !== undefined) ? result[0].TITRE_PRODUCTION : null;
        permis.PROD_GROUP_ID = (result[0] !== undefined) ? getProdGroupByTypeId(+result[0].NO_TYPEPRODUCTION) : null;
    });

  var filterByProdGroup = d3.nest()
    .key(function(d) { return d.PROD_GROUP_ID; })
    .entries(sources);

  return filterByProdGroup;
}

function getProdGroupByTypeId(prodTypeId) {
  let prodTypeGroup = "";
  prodTypesGroups.forEach(function(prodGroup) {
      if(prodGroup.prodTypesIds.includes(prodTypeId)) {
        prodTypeGroup = prodGroup.groupId;
      }
  });
  return prodTypeGroup;
}


/*
montrealTerreGeo.json
property NUM uniquely identifies a zone

NOM = NUM
Outremont = 5
LaSalle = 18
Mont-Royal = 2
Ville-Marie = 20
Le Plateau-Mont-Royal = 22
Hampstead = 10
Le Sud-Ouest = 21
Rivière-des-Prairies-Pointe-aux-Trembles = 19
Lachine = 17
Dorval = 1
Montréal-Nord = 16
L'Île-Bizard-Sainte-Geneviève = 6
Kirkland = 3
Dollard-des-Ormeaux = 11
Senneville = 77
Ahuntsic-Cartierville = 24
Côte-Saint-Luc = 72
Saint-Léonard = 14
Montréal-Ouest = 75
Pointe-Claire = 8
L'Île-Dorval = 73
Mercier-Hochelaga-Maisonneuve = 23
Côte-des-Neiges-Notre-Dame-de-Grâce = 27
Rosemont-La Petite-Patrie = 25
Saint-Laurent = 15
Beaconsfield = 7
Villeray-Saint-Michel-Parc-Extension = 26
Westmount = 4
Montréal-Est = 74
Anjou = 9
Pierrefonds-Roxboro = 13
Sainte-Anne-de-Bellevue = 76
Verdun = 12
Baie-d'Urfé = 71

*/

function getZoneId(zoneName) {
    let key = 0;
    switch (zoneName) {
    case "Outremont":
      key = 5;
      break;
    case "LaSalle":
      key = 18;
      break;
    case "Mont-Royal":
      key = 2;
      break;
    case "Ville-Marie":
      key = 20;
      break;
    case "Le Plateau-Mont-Royal":
      key = 22;
      break;
    case "Hampstead":
      key = 10;
      break;
    case "Le Sud-Ouest":
      key = 21;
      break;
    case "Rivière-des-Prairies-Pointe-aux-Trembles":
      key = 19;
      break;
    case "Lachine":
      key = 17;
      break;
    case "Dorval":
      key = 1;
      break;
    case "Montréal-Nord":
      key = 16;
      break;
    case "L'Île-Bizard-Sainte-Geneviève":
      key = 6;
      break;
    case "Kirkland":
      key = 3;
      break;
    case "Dollard-des-Ormeaux":
      key = 11;
      break;
    case "Senneville":
      key = 77;
      break;
    case "Ahuntsic-Cartierville":
      key = 24;
      break;
    case "Côte-Saint-Luc":
      key = 72;
      break;
    case "Saint-Léonard":
      key = 14;
      break;
    case "Montréal-Ouest":
      key = 75;
      break;
    case "Pointe-Claire":
      key = 8;
      break;
    case "L'Île-Dorval":
      key = 73;
      break;
    case "Mercier-Hochelaga-Maisonneuve":
      key = 23;
      break;
    case "Côte-des-Neiges-Notre-Dame-de-Grâce":
      key = 27;
      break;
    case "Rosemont-La Petite-Patrie":
      key = 25;
      break;
    case "Saint-Laurent":
      key = 15;
      break;
    case "Beaconsfield":
      key = 7;
      break;
    case "Villeray-Saint-Michel-Parc-Extension":
      key = 26;
      break;
    case "Westmount":
      key = 4;
      break;
    case "Montréal-Est":
      key = 74;
      break;
    case "Rivière-des-Prairies-Pointe-aux-Trembles/Montréal-Est":
      key = 74;
      break;
    case "Anjou":
      key = 9;
      break;
    case "Pierrefonds/Senneville":
      key = 13;
      break;
    case "Sainte-Anne-de-Bellevue":
      key = 76;
      break;
    case "Verdun":
      key = 12;
      break;
    case "Baie-d'Urfé":
      key = 71;
      break;
  }
  return key;
}
