--gisapp update script from version 17 to version 18

INSERT INTO settings (version, date) VALUES (18, now());

CREATE TABLE plugins (
    id serial,
    name text NOT NULL,
    description text,
    CONSTRAINT plugins_pkey PRIMARY KEY (id),
    CONSTRAINT plugins_name_key UNIQUE (name)
);
INSERT INTO plugins(name) VALUES ('streetview');
INSERT INTO plugins(name) VALUES ('simpleaction');

ALTER TABLE projects ADD COLUMN plugin_ids integer[];
ALTER TABLE users ADD COLUMN organization text;

DROP FUNCTION IF EXISTS public.get_project_data(text);
CREATE OR REPLACE FUNCTION public.get_project_data(project text)
  RETURNS TABLE(client_id integer, client_name text, client_display_name text, client_url text, theme_name text, overview_layer json, base_layers json, extra_layers json, tables_onstart text[], is_public boolean, project_id integer, project_name text, project_display_name text, crs text, description text, contact text, restrict_to_start_extent boolean, geolocation boolean, feedback boolean, measurements boolean, print boolean, zoom_back_forward boolean, identify_mode boolean, permalink boolean, feedback_email text, project_path text, plugins text[])
LANGUAGE 'plpgsql'

COST 1
VOLATILE
ROWS 1000
AS $BODY$

declare base json;
declare overview json;
declare extra json;
declare plugins text[];
begin
  base:=null;
  overview:=null;

  SELECT json_agg(json_build_object('type',layers.type,'definition',layers.definition,'name',layers.name,'title',layers.display_name))
  FROM
    (SELECT layers.* FROM projects,layers where layers.id = ANY(projects.base_layers_ids) AND projects.name=$1 ORDER BY idx(projects.base_layers_ids, layers.id)) AS layers INTO base;

  SELECT json_agg(json_build_object('type',layers.type,'definition',layers.definition,'name',layers.name,'title',layers.display_name))
  FROM
    (SELECT layers.* FROM projects,layers where layers.id = ANY(projects.extra_layers_ids) AND projects.name=$1 ORDER BY idx(projects.extra_layers_ids, layers.id)) AS layers INTO extra;

  SELECT array_agg(plugins.name) from projects,plugins WHERE plugins.id = ANY(projects.plugin_ids) AND projects.name=$1 INTO plugins;

  SELECT json_agg(json_build_object('type',layers.type,'definition',layers.definition,'name',layers.name,'title',layers.display_name))
  FROM projects,layers where layers.id = projects.overview_layer_id and projects.name=$1 INTO overview;
  
  RETURN QUERY SELECT
                 clients.id,
                 clients.name,
                 clients.display_name,
                 clients.url,
                 themes.name,
                 overview,
                 base,
                 extra,
                 projects.tables_onstart,
                 projects.public,
                 projects.id,
                 projects.name,
                 projects.display_name,
                 projects.crs,
                 projects.description,
                 projects.contact,
                 projects.restrict_to_start_extent,
                 projects.geolocation,
                 projects.feedback,
                 projects.measurements,
                 projects.print,
                 projects.zoom_back_forward,
                 projects.identify_mode,
                 projects.permalink,
                 projects.feedback_email,
                 projects.project_path,
                 plugins
                 
               FROM projects,clients,themes WHERE clients.theme_id=themes.id AND projects.client_id = clients.id AND projects.name=$1;
end;

$BODY$;

COMMENT ON FUNCTION public.get_project_data(text)
IS 'IN project --> client, theme, baselayers, overview layer, extra layers and tables_onstart for project_name.';
