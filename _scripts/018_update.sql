--gisapp update script from version 18 to version 19

INSERT INTO settings (version, date) VALUES (19, now());

CREATE OR REPLACE FUNCTION check_user_project(uname text, project text) RETURNS text
    LANGUAGE plpgsql COST 1
    AS $_$
declare proj_id integer;
declare is_public boolean;
begin
proj_id:=0;
select id,public from projects where name=$2 into proj_id,is_public;
--RAISE NOTICE '%', proj_id;
if proj_id=0 OR proj_id IS NULL then
	return 'TR.noProject';
else
	if is_public = true then return 'OK'; end if;
	if lower($1) = 'guest' then
		if is_public = true then return 'OK';
		else return 'TR.noPublicAccess'; end if;
	else
		select case when admin = true then proj_id else idx(project_ids,proj_id) end from users where user_name=$1 INTO proj_id;
		--RAISE NOTICE '%', proj_id;
		if proj_id=0 then return 'TR.noPermission';
		elseif proj_id IS NULL then return 'TR.noUser';
		else return 'OK';
		end if;
	end if;
end if;
end;
$_$;