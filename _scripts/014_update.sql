--gisapp update script from version 14 to version 15

INSERT INTO settings (version, date) VALUES (15, now());

update clients set theme_id=1 where theme_id is null;

alter table clients alter column theme_id set not null;
alter table clients alter column theme_id set default 1;
