--gisapp update script from version 13 to version 14

INSERT INTO settings (version, date) VALUES (14, now());

ALTER TABLE users ADD COLUMN lang text;

ALTER TABLE projects ADD COLUMN print boolean NOT NULL DEFAULT true;
ALTER TABLE projects ADD COLUMN zoom_back_forward boolean NOT NULL DEFAULT true;
ALTER TABLE projects ADD COLUMN identify_mode boolean NOT NULL DEFAULT false;
ALTER TABLE projects ADD COLUMN permalink boolean NOT NULL DEFAULT true;

CREATE TABLE users_print
(
	id serial PRIMARY KEY,
	user_name text,
	title text,
	description text,
	print_time timestamp with time zone default now(),
	CONSTRAINT print_user_name_fkey FOREIGN KEY (user_name) REFERENCES public.users (user_name) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION
)


DROP FUNCTION public.get_project_data(text);
CREATE FUNCTION public.get_project_data(project text)
  RETURNS TABLE(client_name text, client_display_name text, client_url text, theme_name text, overview_layer json, base_layers json, extra_layers json, tables_onstart text[], is_public boolean, project_display_name text, crs text, description text, contact text, restrict_to_start_extent boolean, geolocation boolean, feedback boolean, measurements boolean, print boolean, zoom_back_forward boolean, identify_mode boolean, permalink boolean, feedback_email text, project_path text)
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


CREATE OR REPLACE VIEW public.users_print_view AS
 SELECT users_print.user_name,
    users.user_email,
    users.display_name,
    users_print.title,
    users_print.description,
    users_print.print_time,
    users.user_id
   FROM users,
    users_print
  WHERE users_print.user_name = users.user_name;


