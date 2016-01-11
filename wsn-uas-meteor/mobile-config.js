// basic info
App.info({
  name: 'edited-meteor-leaflet-demo',
  description: 'Edited Meteor Leaflet Demo',
});

// CORS for Meteor app
App.accessRule('meteor.local/*');
// allow tiles
App.accessRule('*.openstreetmap.org/*');
App.accessRule('*.tile.thunderforest.com/*');
