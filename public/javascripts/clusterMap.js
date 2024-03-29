mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "cluster-map",
  style: "mapbox://styles/mapbox/light-v10",
  // center: [-103.59179687498357, 40.66995747013945],
  center: [-100.440584, 38.344861],
  zoom: 3,
});

var mq = window.matchMedia("(min-width: 768px)");

if (mq.matches) {
  map.setZoom(3); //set map zoom level for desktop size
} else {
  map.setZoom(2); //set map zoom level for mobile size
}

map.scrollZoom.disable();

map.addControl(new mapboxgl.NavigationControl());

map.on("load", function () {
  // Add a new source from our GeoJSON data and
  // set the 'cluster' option to true. GL-JS will
  // add the point_count property to your source data.
  map.addSource("resorts", {
    type: "geojson",
    // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
    // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
    data: resorts,
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
  });

  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "resorts",
    filter: ["has", "point_count"],
    paint: {
      // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
      // with three steps to implement three types of circles:
      //   * Blue, 20px circles when point count is less than 100
      //   * Yellow, 30px circles when point count is between 100 and 750
      //   * Pink, 40px circles when point count is greater than or equal to 750
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#039be5",
        10,
        "#2196F3",
        30,
        "#3F51B5",
      ],
      "circle-radius": ["step", ["get", "point_count"], 10, 10, 20, 30, 15],
      "circle-stroke-width": 1,
      "circle-stroke-color": "#ffffff",
    },
  });

  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "resorts",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
    paint: {
      "text-color": "#ffffff",
    },
  });

  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "resorts",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#4fc3f7",
      "circle-radius": 4,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#ffffff",
    },
  });

  // inspect a cluster on click
  map.on("click", "clusters", function (e) {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["clusters"],
    });
    const clusterId = features[0].properties.cluster_id;
    map
      .getSource("resorts")
      .getClusterExpansionZoom(clusterId, function (err, zoom) {
        if (err) return;

        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom,
        });
      });
  });

  var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  // When a click event occurs on a feature in
  // the unclustered-point layer, open a popup at
  // the location of the feature, with
  // description HTML from its properties.
  map.on("mouseenter", "unclustered-point", function (e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = "pointer";
    const { popUpMarkup } = e.features[0].properties;
    const coordinates = e.features[0].geometry.coordinates.slice();

    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    popup.setLngLat(coordinates).setHTML(popUpMarkup).addTo(map);
  });

  map.on("mouseleave", "unclustered-point", function () {
    popup.setLngLat(coordinates).setHTML(popUpMarkup).addTo(map);
    map.getCanvas().style.cursor = "";
    popup.remove();
  });

  map.on("mouseenter", "clusters", function () {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "clusters", function () {
    map.getCanvas().style.cursor = "";
  });
});
