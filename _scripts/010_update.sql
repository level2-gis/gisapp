--gisapp update script

INSERT INTO settings (version, date) VALUES (11, now());

-- Function: public.get_project_data(text)

-- DROP FUNCTION public.get_project_data(text);

CREATE OR REPLACE FUNCTION public.get_project_data(IN project text)
  RETURNS TABLE(client_name text, client_display_name text, client_url text, theme_name text, overview_layer json, base_layers json, extra_layers json, tables_onstart text[], is_public boolean, project_display_name text, crs text, description text, contact text, restrict_to_start_extent boolean, geolocation boolean, feedback boolean, measurements boolean, feedback_email text) AS
$BODY$
declare base json;
declare overview json;
declare extra json;
begin
base:=null;
overview:=null;

  SELECT json_agg(json_build_object('type',layers.type,'definition',layers.definition,'name',layers.name,'title',layers.display_name))
    FROM
    (SELECT layers.* FROM projects,layers where layers.id = ANY(projects.base_layers_ids) AND projects.name=$1 ORDER BY idx(projects.base_layers_ids, layers.id)) AS layers INTO base;

  SELECT json_agg(json_build_object('type',layers.type,'definition',layers.definition,'name',layers.name,'title',layers.display_name))
  FROM
  (SELECT layers.* FROM projects,layers where layers.id = ANY(projects.extra_layers_ids) AND projects.name=$1 ORDER BY idx(projects.extra_layers_ids, layers.id)) AS layers INTO extra;

  SELECT json_agg(json_build_object('type',layers.type,'definition',layers.definition,'name',layers.name,'title',layers.display_name))
  FROM projects,layers where layers.id = projects.overview_layer_id and projects.name=$1 INTO overview;


RETURN QUERY SELECT
               clients.name,
               clients.display_name,
               clients.url,
               themes.name,
               overview,
               base,
               extra,
               projects.tables_onstart,
               projects.public,
               projects.display_name,
               projects.crs,
               projects.description,
               projects.contact,
               projects.restrict_to_start_extent,
               projects.geolocation,
               projects.feedback,
               projects.measurements,
               projects.feedback_email

             FROM projects,clients,themes WHERE clients.theme_id=themes.id AND projects.client_id = clients.id AND projects.name=$1;
end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 1
  ROWS 1000;

COMMENT ON FUNCTION public.get_project_data(text) IS 'IN project --> client, theme, baselayers, overview layer, extra layers and tables_onstart for project_name.';
