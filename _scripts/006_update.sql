--gisapp update script
INSERT INTO settings (version, date) VALUES (7, now());

--table users
ALTER TABLE users ADD CONSTRAINT users_user_email_key UNIQUE (user_email);
ALTER TABLE users ADD COLUMN registered timestamp with time zone;

--table projects
ALTER TABLE projects ADD COLUMN display_name text;
ALTER TABLE projects ADD COLUMN crs text;
ALTER TABLE projects ADD COLUMN description text;

--views
CREATE OR REPLACE VIEW public.clients_view AS
 SELECT clients.id,
    clients.name,
    clients.display_name,
    clients.url,
    count(projects.id) AS count,
    sort(array_agg(projects.id)) AS project_ids
   FROM clients,
    projects
  WHERE clients.id = projects.client_id
  GROUP BY projects.client_id, clients.id, clients.name, clients.display_name, clients.url;

CREATE OR REPLACE VIEW public.projects_view AS
 SELECT projects.id,
    projects.name,
    projects.client_id,
    projects.public,
        CASE
            WHEN projects.display_name IS NULL THEN projects.name
            ELSE projects.display_name
        END AS display_name,
        CASE
            WHEN projects.crs IS NULL THEN '_'::text
            ELSE projects.crs
        END AS crs,
        CASE
            WHEN projects.description IS NULL THEN '_'::text
            ELSE projects.description
        END AS description,
    clients.display_name AS client
   FROM projects,
    clients
  WHERE projects.client_id = clients.id;