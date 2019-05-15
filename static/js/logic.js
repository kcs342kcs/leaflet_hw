// Creating map object
var myMap = L.map("map", {
  center: [36.05, -112.14],
  zoom: 4
});

// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Grab the data with d3
d3.json(baseURL, function(response) {

  // Create a new marker cluster group
  //var markers = L.markerClusterGroup();
  var markers = L.layerGroup();
  var records = response.features;
  // Loop through data

  function mColor(mag){
    mag = +mag;
    var color = "white";
    if (mag > 5){
      color = "red";
    }
    else if (mag >= 4){
      color = "orangeRed";
    }
    else if (mag >= 3){
      color = "orange";
    }
    else if (mag >= 2){
      color = "yellow";
    }
    else if (mag >= 1){
      color = "yellowgreen";
    }
    else{
      color = "green";
    }
    return color;
  }

  for (var i = 0; i < records.length; i++) {

    // Set the data location property to a variable
    var location = records[i].geometry;
    var props = records[i].properties;

    // Check for location property
    if (location) {

      // Add a new marker to the cluster group and bind a pop-up
      var clr = mColor(props.mag);
      markers.addLayer(L.circleMarker([location.coordinates[1], location.coordinates[0]],{color:clr,fill:true,fillcolor:clr,radius:props.mag*5,fillOpacity:.8})
        .bindPopup(props.title));
    }

  }

  // Add our marker cluster layer to the map
  myMap.addLayer(markers);

  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'legend');
    magnitude = [0, 1, 2, 3, 4, 5]
    //colors = ["#fff2e6", "#1a0d00", "#4d2600", "#804000", "#cc6600", "#ff9933"]
    colors = ["green", "yellowgreen", "yellow", "orange", "orangered", "red"]
    for (var i = 0; i < magnitude.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        magnitude[i] + (magnitude[i + 1] ? "&ndash;" + magnitude[i + 1] + "<br>" : "+");
    }
    return div;
  }
  legend.addTo(myMap);
});
