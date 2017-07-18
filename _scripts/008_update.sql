--gisapp update script
INSERT INTO settings (version, date) VALUES (9, now());

ALTER TABLE projects ADD COLUMN contact text;

DROP VIEW public.projects_view;

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
    projects.contact,
    clients.display_name AS client
   FROM projects,
    clients
  WHERE projects.client_id = clients.id;

ALTER TABLE public.projects_view
  OWNER TO pguser;
