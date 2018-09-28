#!/usr/bin/env bash

BIN='./node_modules/.bin'

mkdir -p tmp

${BIN}/cartodb -u p2cs-sei -f geojson 'SELECT the_geom, cd_legenda as name, geoid FROM BRAZIL_biomes' > tmp/BRAZIL_BIOME.json
${BIN}/mapshaper tmp/BRAZIL_BIOME.json -simplify rdp 30% planar keep-shapes -o public/vector_layers/BRAZIL_BIOME.topo.json format=topojson

${BIN}/cartodb -u p2cs-sei -f geojson 'SELECT the_geom, nomeuf2 as name, geoid FROM BRAZIL_states' > tmp/BRAZIL_STATE.json
${BIN}/mapshaper tmp/BRAZIL_STATE.json -simplify rdp 30% planar keep-shapes -o public/vector_layers/BRAZIL_STATE.topo.json format=topojson

${BIN}/cartodb -u p2cs-sei -f geojson 'SELECT the_geom, geoid, nome as name, biome_geoid FROM BRAZIL_municipalities_1' > tmp/BRAZIL_MUNICIPALITY.json
${BIN}/mapshaper tmp/BRAZIL_MUNICIPALITY.json -simplify rdp 30% planar keep-shapes -o public/vector_layers/BRAZIL_MUNICIPALITY.topo.json format=topojson

${BIN}/cartodb -u p2cs-sei -f geojson 'SELECT the_geom, geoid FROM col_departments' > tmp/COLOMBIA_DEPARTMENT.json
${BIN}/mapshaper tmp/COLOMBIA_DEPARTMENT.json -simplify rdp 30% planar keep-shapes -o public/vector_layers/COLOMBIA_DEPARTMENT.topo.json format=topojson

${BIN}/cartodb -u p2cs-sei -f geojson "SELECT the_geom, 'CO-' || mpio_ccnct as geoid FROM col_municipalities" > tmp/COLOMBIA_MUNICIPALITY.json
${BIN}/mapshaper tmp/COLOMBIA_MUNICIPALITY.json -simplify rdp 30% planar keep-shapes -o public/vector_layers/COLOMBIA_MUNICIPALITY.topo.json format=topojson

${BIN}/cartodb -u p2cs-sei -f geojson 'SELECT the_geom, geoid FROM pa_departments_2012' > tmp/PARAGUAY_DEPARTMENT.json
${BIN}/mapshaper tmp/PARAGUAY_DEPARTMENT.json -simplify rdp 30% planar keep-shapes -o public/vector_layers/PARAGUAY_DEPARTMENT.topo.json format=topojson

