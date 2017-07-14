--gisapp update script
INSERT INTO settings (version, date) VALUES (8, now());

ALTER TABLE clients ADD COLUMN description text;

DROP VIEW clients_view;
CREATE OR REPLACE VIEW public.clients_view AS
  SELECT clients.id,
    clients.name,
    clients.display_name,
    clients.url,
    clients.description,
    count(projects.id) AS count,
    sort(array_agg(projects.id)) AS project_ids
  FROM clients,
    projects
  WHERE clients.id = projects.client_id
  GROUP BY projects.client_id, clients.id, clients.name, clients.display_name, clients.url;