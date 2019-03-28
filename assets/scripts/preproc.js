function colorScale(color, prodTypes) {
  color.domain(prodTypes.map(function (d) {
    return d.name;
  }));
  color.range(prodTypes.map(function (d) {
    return d.color;
  }));
}

function createSourcesMap(permisData, protocolesData) {
  var filtered = permisData.filter(function(d) {
    return (d.NOM_ARROND !== 'Indéfini') && (d.LONGITUDE !== "") && (d.LATITUDE !== "");
  });

  var sources = d3.nest()
    .key(function(d) { return d.NO_ID_PRO; })
    .key(function(d) { return d.NOM_ARROND; })
    .entries(filtered)
    /*.map(function (d) {
      console.log(d);
      return {
        "idProd": +d.values[0].NO_ID_PRO,
        "zoneId": +getZoneId(d.values[0].NOM_ARROND),
        "zoneName": d.values[0].NOM_ARROND,
        "long": Number(d.values[0].LONGITUDE),
        "lat": Number(d.values[0].LATITUDE)
      }
    })*/;

    sources.forEach(function(permis) {
        var result = protocolesData.filter(function(protocole) {
            return protocole.NO_ID_PRO === permis.key;
        });
        delete permis.NO_ID_PRO;
        permis.TYPE_PRO = (result[0] !== undefined) ? result[0].NOM_TYPEPRODUCTION : null;
    });

    //console.log(sources);
    return sources;
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

function createSourcesLineChart(protocolesData) {
  var filtered = protocolesData.filter(function(d) {
    return (d.PERIODE_DE !== "") && (d.PERIODE_AU !== "");
  });
  var arraySource = [0,0,0,0,0,0,0,0,0,0,0,0,0];
    // console.log(filtered);
    filtered.forEach(function(data) {
      var startMonth = parseInt(data.PERIODE_DE.split("-")[1],10);
      var endMonth = parseInt(data.PERIODE_AU.split("-")[1], 10);
      for (var i = 1; i < 13; i++) {
        if(i <= endMonth && i >= startMonth){
            arraySource[i]++;
        }
      }
    });

     return arraySource;
}
