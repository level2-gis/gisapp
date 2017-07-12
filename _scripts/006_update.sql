--gisapp update script
INSERT INTO settings (version, date) VALUES (7, now());

--table users
ALTER TABLE users ADD CONSTRAINT users_user_email_key UNIQUE (user_email);
ALTER TABLE users ADD COLUMN registered timestamp with time zone;

--table projects
ALTER TABLE projects ADD COLUMN display_name text;
ALTER TABLE projects ADD COLUMN crs text;
ALTER TABLE projects ADD COLUMN description text;