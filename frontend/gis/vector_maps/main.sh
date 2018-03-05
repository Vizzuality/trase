#!/usr/bin/env bash

BIN='./node_modules/.bin'

mkdir -p tmp

${BIN}/cartodb -u p2cs-sei -f geojson 'SELECT the_geom, geoid FROM BRAZIL_biomes' > tmp/BRAZIL_BIOME.json
${BIN}/geo2topo -p --simplify 0.0000001 -o public/vector_layers/BRAZIL_BIOME.topo.json -- tmp/BRAZIL_BIOME.json

${BIN}/cartodb -u p2cs-sei -f geojson 'SELECT the_geom, geoid FROM BRAZIL_states' > tmp/BRAZIL_STATE.json
${BIN}/geo2topo -p --simplify 0.0000001 -o public/vector_layers/BRAZIL_STATE.topo.json -- tmp/BRAZIL_STATE.json

${BIN}/cartodb -u p2cs-sei -f geojson 'SELECT the_geom, geoid, nome, biome_geoid, state_geoid FROM BRAZIL_municipalities_1' > tmp/BRAZIL_MUNICIPALITY.json
${BIN}/geo2topo -p --simplify 0.0000001 -o public/vector_layers/BRAZIL_MUNICIPALITY.topo.json -- tmp/BRAZIL_MUNICIPALITY.json

${BIN}/cartodb -u p2cs-sei -f geojson 'SELECT the_geom, geoid FROM col_departments' > tmp/COLOMBIA_DEPARTMENT.json
${BIN}/geo2topo -p --simplify 0.0000001 -o public/vector_layers/COLOMBIA_DEPARTMENT.topo.json -- tmp/COLOMBIA_DEPARTMENT.json

rm tmp/PARAGUAY_DEPARTMENT.json
rm tmp/PARAGUAY_DEPARTMENT_renamed.json
ogr2ogr -f GeoJSON -t_srs crs:84 tmp/PARAGUAY_DEPARTMENT.json gis/shapefiles/paraguay-department/PARAGUAY_ADM1.shp
ogr2ogr -f GeoJSON tmp/PARAGUAY_DEPARTMENT_renamed.json tmp/PARAGUAY_DEPARTMENT.json -sql "SELECT ID_GOVT AS geoid from PARAGUAY_ADM1"
${BIN}/geo2topo -p --simplify 0.0000000001 -o public/vector_layers/PARAGUAY_DEPARTMENT.topo.json -- tmp/PARAGUAY_DEPARTMENT_renamed.json
