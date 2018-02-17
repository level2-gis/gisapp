--gisapp update script from version 15 to version 16

INSERT INTO settings (version, date) VALUES (16, now());

ALTER TABLE projects ADD COLUMN ordr integer NOT NULL DEFAULT 0;
ALTER TABLE clients ADD COLUMN ordr integer NOT NULL DEFAULT 0;

DROP FUNCTION IF EXISTS public.get_project_data(text);
CREATE OR REPLACE FUNCTION public.get_project_data(project text)
  RETURNS TABLE(client_id integer, client_name text, client_display_name text, client_url text, theme_name text, overview_layer json, base_layers json, extra_layers json, tables_onstart text[], is_public boolean, project_id integer, project_name text, project_display_name text, crs text, description text, contact text, restrict_to_start_extent boolean, geolocation boolean, feedback boolean, measurements boolean, print boolean, zoom_back_forward boolean, identify_mode boolean, permalink boolean, feedback_email text, project_path text)
LANGUAGE 'plpgsql'

COST 1
VOLATILE
ROWS 1000
AS $BODY$

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
	       projects.project_path

             FROM projects,clients,themes WHERE clients.theme_id=themes.id AND projects.client_id = clients.id AND projects.name=$1;
end;

$BODY$;

COMMENT ON FUNCTION public.get_project_data(text)
IS 'IN project --> client, theme, baselayers, overview layer, extra layers and tables_onstart for project_name.';

DROP VIEW IF EXISTS public.clients_view;
CREATE OR REPLACE VIEW public.clients_view AS
  SELECT clients.id,
    clients.name,
    clients.display_name,
    clients.url,
    clients.description,
    clients.ordr,
    count(projects.id) AS count,
    sort(array_agg(projects.id)) AS project_ids
  FROM clients,
    projects
  WHERE clients.id = projects.client_id
  GROUP BY projects.client_id, clients.id, clients.name, clients.display_name, clients.url;

-- View: public.projects_view

DROP VIEW IF EXISTS public.projects_view;
CREATE OR REPLACE VIEW public.projects_view AS
  SELECT projects.id,
    projects.name,
    projects.client_id,
    projects.public,
    CASE
    WHEN projects.display_name IS NULL THEN projects.name
    ELSE projects.display_name
    END AS display_name,
    projects.crs,
    projects.description,
    projects.ordr,
    projects.contact,
    clients.display_name AS client,
    clients.name AS client_name
  FROM projects,
    clients
  WHERE projects.client_id = clients.id;