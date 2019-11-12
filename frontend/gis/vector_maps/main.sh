#!/usr/bin/env bash

BIN='./node_modules/.bin'

mkdir -p tmp

${BIN}/cartodb -u p2cs-sei -f geojson 'SELECT the_geom, name, geoid FROM brazil_biomes' > tmp/BRAZIL_BIOME.json
${BIN}/mapshaper tmp/BRAZIL_BIOME.json -simplify rdp 30% planar keep-shapes -o public/vector_layers/BRAZIL_BIOME.topo.json format=topojson

${BIN}/cartodb -u p2cs-sei -f geojson 'SELECT the_geom, name, geoid FROM brazil_states' > tmp/BRAZIL_STATE.json
${BIN}/mapshaper tmp/BRAZIL_STATE.json -simplify rdp 30% planar keep-shapes -o public/vector_layers/BRAZIL_STATE.topo.json format=topojson

${BIN}/cartodb -u p2cs-sei -f geojson 'SELECT the_geom, name, geoid FROM brazil_municipalities' > tmp/BRAZIL_MUNICIPALITY.json
${BIN}/mapshaper tmp/BRAZIL_MUNICIPALITY.json -simplify rdp 30% planar keep-shapes -o public/vector_layers/BRAZIL_MUNICIPALITY.topo.json format=topojson

${BIN}/cartodb -u p2cs-sei -f geojson 'SELECT the_geom, name, geocode as geoid FROM colombia_departments_dane_20190808' > tmp/COLOMBIA_DEPARTMENT.json
${BIN}/mapshaper tmp/COLOMBIA_DEPARTMENT.json -simplify rdp 30% planar keep-shapes -o public/vector_layers/COLOMBIA_DEPARTMENT.topo.json format=topojson

${BIN}/cartodb -u p2cs-sei -f geojson "SELECT the_geom, name, geoid FROM colombia_municipalities" > tmp/COLOMBIA_MUNICIPALITY.json
${BIN}/mapshaper tmp/COLOMBIA_MUNICIPALITY.json -simplify rdp 30% planar keep-shapes -o public/vector_layers/COLOMBIA_MUNICIPALITY.topo.json format=topojson

${BIN}/cartodb -u p2cs-sei -f geojson 'SELECT the_geom, name, geoid FROM paraguay_departments' > tmp/PARAGUAY_DEPARTMENT.json
${BIN}/mapshaper tmp/PARAGUAY_DEPARTMENT.json -simplify rdp 30% planar keep-shapes -o public/vector_layers/PARAGUAY_DEPARTMENT.topo.json format=topojson

${BIN}/cartodb -u p2cs-sei -f geojson 'SELECT the_geom, simple_name as name, geoid FROM paraguay_ecoregions_2018_11_14' > tmp/PARAGUAY_BIOME.json
${BIN}/mapshaper tmp/PARAGUAY_BIOME.json -simplify rdp 30% planar keep-shapes -o public/vector_layers/PARAGUAY_BIOME.topo.json format=topojson

#${BIN}/cartodb -u p2cs-sei -f topojson 'SELECT distinct on (geoid, port, latitude, longitude) the_geom, geoid, port as name FROM indonesia_ports_20191031' > public/vector_layers/INDONESIA_PORT_OF_EXPORT.topo.json

${BIN}/cartodb -u p2cs-sei -f geojson 'SELECT the_geom, kab as name, geoid FROM indonesia_kabupaten_boundaries_2016_20190613' > tmp/INDONESIA_KABUPATEN.json
${BIN}/mapshaper tmp/INDONESIA_KABUPATEN.json -simplify rdp 30% planar keep-shapes -o public/vector_layers/INDONESIA_KABUPATEN.topo.json format=topojson
