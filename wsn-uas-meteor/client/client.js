// on startup run resizing event
Meteor.startup(function() {
  $(window).resize(function() {
    $('#map').css('height', window.innerHeight - 82 - 45);
  });
  $(window).resize(); // trigger resize event 
});
 
var myIcon = L.icon({
    iconUrl: 'quadcopter.png',
    iconSize: [38, 38],
});

var lat = 38.9875;
var lon = -76.9373;

Template.table.helpers({
  clat: 38.9875, 
  clong: -76.9373,
  elat: 38.9879,
  elong: -76.9376,
  qlat: 38.9876,
  qlong: -76.9375
});

/*
Template.table.events({
  'click button': function () {
    Session.set('counterHome', 1);
    Session.set('counterCP', 0);
    lat = 39.700554;
    lon = -76.536123;
    map.setView([lat, lon], 18);
  }
});
*/

Session.setDefault('counterHome', 0);
Session.setDefault('counterCP', 1);

Template.home.helpers({
  counterHome: function () {
    return Session.get('counterHome');
  }
});

Template.home.events({
  'click button': function () {
    Session.set('counterHome', 1);
    Session.set('counterCP', 0);
    lat = 39.700554;
    lon = -76.536123;
    map.setView([lat, lon], 18);
  }
});

Template.cp.helpers({
  counterCP: function () {
    return Session.get('counterCP');
  }
});

Template.cp.events({
  'click button': function () {
    Session.set('counterHome', 0);
    Session.set('counterCP', 1);
    lat = 38.9875;
    lon = -76.9373;
    map.setView([lat, lon], 18);
  }
});

// create marker collection --> (move to ../lib/collections.js?)
var Markers = new Meteor.Collection('markers');

Meteor.subscribe('markers');

Template.map.rendered = function() {
  L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';

  //var g_satellite = new L.Google('SATELLITE');
  //var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');

  var map = L.map('map', {
    doubleClickZoom: false,
    scrollWheelZoom: false
  }).setView([lat, lon], 18);

  //Esri_WorldImagery.addTo(map);

  L.tileLayer.provider('Thunderforest.Outdoors').addTo(map);

  map.on('click', function(event) {
    Markers.insert({latlng: event.latlng});
    map.setView([lat,lon], 18);
  });

  var circle = L.circle([38.9870, -76.9379], 100, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5
  }).addTo(map);

  //var circle = L.circle([38.9870, -76.9379], 140, {
  //    color: 'lightblue',
  //    fillColor: '#0ff',
  //    fillOpacity: 0.5
  //}).addTo(map);

  L.marker([38.9875, -76.9373], {icon: myIcon}).addTo(map); 
  //L.circle([38.9870, -76.9379], 140).addTo(map); //[number] = meters

  var query = Markers.find();
  query.observe({
    added: function (document) {
      var marker = L.marker(document.latlng).addTo(map)
        .on('click', function(event) {
          map.removeLayer(marker);
          Markers.remove({_id: document._id});
        });
    },
    removed: function (oldDocument) {
      layers = map._layers;
      var key, val;
      for (key in layers) {
        val = layers[key];
        if (val._latlng) {
          if (val._latlng.lat === oldDocument.latlng.lat && val._latlng.lng === oldDocument.latlng.lng) {
            map.removeLayer(val);
          }
        }
      }
    }
  });
};
