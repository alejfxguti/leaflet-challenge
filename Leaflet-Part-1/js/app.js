// Fetch the earthquake data
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
  .then(response => response.json())
  .then(data => {
    // Initialize the map
    const map = L.map('map').setView([0, 0], 2);

    // Create a tile layer for the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Extract today's date for the title
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Note: Months are zero-based, so add 1
    const day = today.getDate();

    // Set the title in the HTML element
    const titleElement = document.getElementById('visualization-title');
    titleElement.textContent = `All earthquakes on ${year}-${month}-${day}`;

    // Loop through the earthquake features
    data.features.forEach(feature => {
      // Get the magnitude and depth of the earthquake
      const magnitude = feature.properties.mag;
      const depth = feature.geometry.coordinates[2];

      // Define the marker options based on magnitude and depth
      const markerOptions = {
        radius: magnitude * 2,
        fillColor: getColor(depth),
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };

      // Create a circle marker for each earthquake
      const marker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], markerOptions);

      // Add a popup to the marker with additional information
      const popupContent = `<strong>Location:</strong> ${feature.properties.place}<br/>
                            <strong>Magnitude:</strong> ${magnitude}<br/>
                            <strong>Depth:</strong> ${depth}`;
      marker.bindPopup(popupContent);

      // Add the marker to the map
      marker.addTo(map);
    });

    // Create a legend
    const legend = L.control({ position: 'topright' });
    legend.onAdd = function (map) {
      const div = L.DomUtil.create('div', 'info legend');
      const depths = [0, 10, 30, 50, 70, 90];
      const labels = [];

      for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
          '<i class="depth-legend" style="background:' + getColor(depths[i] + 1) + '"></i> ' +
          depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
      }

      return div;
    };
    legend.addTo(map);
  });

// Function to get the color based on depth
function getColor(depth) {
  return depth > 90 ? '#FF0000' :
    depth > 70 ? '#FF4500' :
    depth > 50 ? '#FF8C00' :
    depth > 30 ? '#FFA500' :
    depth > 10 ? '#FFD700' :
    '#FFFF00';
}
