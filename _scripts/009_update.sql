--gisapp update script

INSERT INTO settings (version, date) VALUES (10, now());

ALTER TABLE projects ADD column restrict_to_start_extent boolean NOT NULL default FALSE;
ALTER TABLE projects ADD column geolocation boolean NOT NULL default TRUE;
ALTER TABLE projects ADD column feedback boolean NOT NULL default TRUE;
ALTER TABLE projects ADD column measurements boolean NOT NULL default TRUE;
ALTER TABLE projects ADD column feedback_email text;

ALTER TABLE layers DROP COLUMN base_layer;

DROP FUNCTION get_project_data(project text);
CREATE FUNCTION get_project_data(project text) RETURNS TABLE(
  client_name text,
  client_display_name text,
  client_url text,
  theme_name text,
  overview_layer json,
  base_layers json,
  extra_layers json,
  tables_onstart text[],
  is_public boolean,
  project_display_name text,
  crs text,
  description text,
  contact text,
  restrict_to_start_extent boolean,
  geolocation boolean,
  feedback boolean,
  measurements boolean,
  feedback_email text
)
    LANGUAGE plpgsql COST 1
    AS $_$
declare base json;
declare overview json;
declare extra json;
begin
base:=null;
overview:=null;

  SELECT json_agg(json_build_object('type',layers.type,'definition',layers.definition,'name',layers.name,'title',layers.display_name))
  FROM projects,layers where layers.id = ANY(projects.base_layers_ids) AND projects.name=$1 INTO base;

  SELECT json_agg(json_build_object('type',layers.type,'definition',layers.definition,'name',layers.name,'title',layers.display_name))
  FROM projects,layers where layers.id = ANY(projects.extra_layers_ids) AND projects.name=$1 INTO extra;

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
$_$;

COMMENT ON FUNCTION get_project_data(project text) IS 'IN project --> client, theme, baselayers, overview layer, extra layers and tables_onstart for project_name.';


