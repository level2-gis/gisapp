--gisapp update script

CREATE TABLE settings (
	version integer,
	date date
);

INSERT INTO settings (version, date) VALUES (2, now());

ALTER TABLE projects ADD COLUMN public boolean NOT NULL DEFAULT false;

-- Function: check_user_project(text, text)
-- DROP FUNCTION check_user_project(text, text);
CREATE OR REPLACE FUNCTION check_user_project(
    uname text,
    project text)
  RETURNS text AS
$BODY$
declare proj_id integer;
declare is_public boolean;
begin
proj_id:=0;
select id,public from projects where name=$2 into proj_id,is_public;
--RAISE NOTICE '%', proj_id;
if proj_id=0 OR proj_id IS NULL then
	return 'TR.noProject';
else
	if lower($1) = 'guest' then
		if is_public = true then return 'OK';
		else return 'TR.noPublicAccess'; end if;
	else
		select idx(project_ids,proj_id) from users where user_name=$1 INTO proj_id;
		--RAISE NOTICE '%', proj_id;
		if proj_id=0 then return 'TR.noPermission';
		elseif proj_id IS NULL then return 'TR.noUser';
		else return 'OK';
		end if;
	end if;
end if;
end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 1;
ALTER FUNCTION check_user_project(text, text)
  OWNER TO pguser;
COMMENT ON FUNCTION check_user_project(text, text) IS 'IN uname, project --> validates project, user and user permissions on project';


