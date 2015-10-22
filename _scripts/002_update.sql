--gisapp update script

INSERT INTO settings (version, date) VALUES (3, now());

ALTER TABLE clients ADD COLUMN url text;
ALTER TABLE settings ADD CONSTRAINT settings_pkey PRIMARY KEY (version);

INSERT INTO layers(id, name, display_name, type, base_layer, definition) VALUES (nextval('layers_id_seq'), 'osm_mapnik', '', 'OSM', true, '"OpenStreetMap (mapnik)"');

UPDATE layers SET definition = '"MapQuest-OSM "+TR.mapBasic, ["http://otile1.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg","http://otile2.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg","http://otile3.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg","http://otile4.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg"], {numZoomLevels: 19}'
WHERE name='mapquest_map';





