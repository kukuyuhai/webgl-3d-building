<template>
  <div class="container" id="map" ref="containerRef"></div>
  <div id="inputs">
    <input type="button" id="sunriseEnd" value="sunrise" />
    <input type="button" id="goldenHourEnd" value="morning" />
    <input type="button" id="solarNoon" value="afternoon" />
    <input type="button" id="goldenHour" value="evening" />
    <input type="button" id="sunsetStart" value="sunset" />
    <input type="button" id="getlocal" value="local time" />
    <input type="button" id="next30mins" value="+30 mins" />
    <input type="button" id="prev30mins" value="-30 mins" />
    <input type="button" id="next30days" value="+30 days" />
    <input type="button" id="prev30days" value="-30 days" />
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import mapboxgl from "mapbox-gl";
import SunCalc from "suncalc";
let map = null;
export default defineComponent({
  name: "mapbox",
  setup() {
    const containerRef = ref(null);

    onMounted(() => {
      mapboxgl.accessToken =
        "pk.eyJ1Ijoia3VrdXl1aGFpIiwiYSI6ImNrcjA5dmNkNTA1YXoydm55eWd4OThkMmgifQ.TWlHiuELcj4xPzg4yXPDmg";
      var map = new mapboxgl.Map({
        container: "map",
        style: {
          version: 8,
          sources: {
            "raster-tiles": {
              type: "raster",
              tiles: [
                "http://t0.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=553afffa85eabf17e78f95fddc7152c9",
              ],
              tileSize: 256,
            },
          },
          layers: [
            {
              id: "tdt-img-tiles",
              type: "raster",
              source: "raster-tiles",
              minzoom: 0,
              maxzoom: 22,
            },
          ],
        },
        center: [121.39, 31.14],
        zoom: 15.5,
        pitch: 45,
      });

      function rotateCamera(timestamp) {
        // clamp the rotation between 0 -360 degrees
        // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
        map.rotateTo((timestamp / 100) % 360, { duration: 0 });
        // Request the next frame of the animation.
        requestAnimationFrame(rotateCamera);
      }

      map.on("load", function () {
        // Start the animation.
        // rotateCamera(0);

        // Add 3d buildings and remove label layers to enhance the map
        var layers = map.getStyle().layers;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === "symbol" && layers[i].layout["text-field"]) {
            // remove text labels
            map.removeLayer(layers[i].id);
          }
        }

        map.addLayer({
          id: "3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#aaa",

            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "height"],
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "min_height"],
            ],
            "fill-extrusion-opacity": 0.6,
          },
        });

        map.addLayer({
          id: "sky",
          type: "sky",
          paint: {
            // set up the sky layer to use a color gradient
            "sky-type": "gradient",
            // the sky will be lightest in the center and get darker moving radially outward
            // this simulates the look of the sun just below the horizon
            "sky-gradient": [
              "interpolate",
              ["linear"],
              ["sky-radial-progress"],
              0.8,
              "rgba(135, 206, 235, 1.0)",
              1,
              "rgba(0,0,0,0.1)",
            ],
            "sky-gradient-center": [0, 0],
            "sky-gradient-radius": 90,
            "sky-opacity": [
              "interpolate",
              ["exponential", 0.1],
              ["zoom"],
              5,
              0,
              22,
              1,
            ],
          },
        });
      });
    });

    return {
      containerRef,
    };
  },
});
</script>

<style>
.container {
  width: 100%;
  height: 100vh;
}

#inputs {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px;
}
</style>