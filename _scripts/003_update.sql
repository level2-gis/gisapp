--gisapp update script

INSERT INTO settings (version, date) VALUES (4, now());

-- Function: get_project_data(text)

DROP FUNCTION IF EXISTS get_project_data(text);
CREATE OR REPLACE FUNCTION get_project_data(IN project text)
  RETURNS TABLE(client_name text, client_display_name text, client_url text, theme_name text, overview_layer json, base_layers json, extra_layers json, tables_onstart text[]) AS
$BODY$
declare base json;
declare overview json;
declare extra json;
begin
base:=null;
overview:=null;

SELECT json_agg(('new OpenLayers.Layer.'|| layers.type) || '(' || layers.definition || ');')
FROM projects,layers where layers.id = ANY(projects.base_layers_ids) AND base_layer=true and projects.name=$1 INTO base;

SELECT json_agg(('new OpenLayers.Layer.'|| layers.type) || '(' || layers.definition || ');')
FROM projects,layers where layers.id = ANY(projects.extra_layers_ids) AND base_layer=false and projects.name=$1 INTO extra;

SELECT json_agg(('new OpenLayers.Layer.'|| layers.type) || '(' || layers.definition || ');')
FROM projects,layers where layers.id = projects.overview_layer_id and projects.name=$1 INTO overview;


RETURN QUERY SELECT clients.name, clients.display_name, clients.url, themes.name, overview,base,extra, projects.tables_onstart FROM projects,clients,themes WHERE clients.theme_id=themes.id AND projects.client_id = clients.id AND projects.name=$1;
end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 1
  ROWS 1000;
ALTER FUNCTION get_project_data(text)
  OWNER TO pguser;
COMMENT ON FUNCTION get_project_data(text) IS 'IN project --> client, theme, baselayers, overview layer, extra layers and tables_onstart for project_name.';
