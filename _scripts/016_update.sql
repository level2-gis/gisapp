--gisapp update script from version 16 to version 17

INSERT INTO settings (version, date) VALUES (17, now());

ALTER TABLE projects ALTER COLUMN client_id SET NOT NULL;

CREATE OR REPLACE VIEW public.clients_view AS
 SELECT clients.id,
    clients.name,
    clients.display_name,
    clients.url,
    clients.description,
    clients.ordr,
    CASE WHEN sum.count IS null THEN 0 ELSE sum.count END,
    sum.project_ids
   FROM clients
   LEFT JOIN
   (SELECT count(projects.id) AS count, sort(array_agg(projects.id)) AS project_ids, client_id FROM projects GROUP BY projects.client_id) AS sum
   ON clients.id = sum.client_id;

