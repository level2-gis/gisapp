--gisapp update script

INSERT INTO settings (version, date) VALUES (5, now());

UPDATE public.layers SET definition = '"Google "+TR.mapSatellite,{type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 20, isBaseLayer: true, useTiltImages: false}'
WHERE name='google_sat';