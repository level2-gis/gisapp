--
-- PostgreSQL database dump
--

-- Dumped from database version 9.3.9
-- Dumped by pg_dump version 9.3.9
-- Started on 2015-08-11 21:15:15 CEST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 181 (class 3079 OID 11789)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2127 (class 0 OID 0)
-- Dependencies: 181
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- TOC entry 182 (class 3079 OID 85453)
-- Name: intarray; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS intarray WITH SCHEMA public;


--
-- TOC entry 2128 (class 0 OID 0)
-- Dependencies: 182
-- Name: EXTENSION intarray; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION intarray IS 'functions, operators, and index support for 1-D arrays of integers';


SET search_path = public, pg_catalog;

--
-- TOC entry 241 (class 1255 OID 85564)
-- Name: check_user_project(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION check_user_project(uname text, project text) RETURNS text
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
$_$;


--
-- TOC entry 2129 (class 0 OID 0)
-- Dependencies: 241
-- Name: FUNCTION check_user_project(uname text, project text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION check_user_project(uname text, project text) IS 'IN uname, project --> validates project, user and user permissions on project';


--
-- TOC entry 240 (class 1255 OID 85565)
-- Name: get_project_data(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION get_project_data(project text) RETURNS TABLE(client_name text, client_display_name text, theme_name text, overview_layer json, base_layers json, extra_layers json, tables_onstart text[])
LANGUAGE plpgsql COST 1
AS $_$
declare base json;
declare overview json;
declare extra json;
begin
base:=null;
overview:=null;

SELECT json_agg(('new OpenLayers.Layer.'|| layers.type) || '(' || layers.definition || ');')
FROM projects,layers where layers.id = ANY(projects.base_layers_ids) AND base_layer=true and projects.name=$1 INTO base;

SELECT json_agg(('new OpenLayers.Layer.'|| layers.type) || '(' || layers.definition || ');')
FROM projects,layers where layers.id = ANY(projects.extra_layers_ids) AND base_layer=false and projects.name=$1 INTO extra;

SELECT json_agg(('new OpenLayers.Layer.'|| layers.type) || '(' || layers.definition || ');')
FROM projects,layers where layers.id = projects.overview_layer_id and projects.name=$1 INTO overview;


RETURN QUERY SELECT clients.name, clients.display_name, themes.name, overview,base,extra, projects.tables_onstart FROM projects,clients,themes WHERE clients.theme_id=themes.id AND projects.client_id = clients.id AND projects.name=$1;
end;
$_$;


--
-- TOC entry 2130 (class 0 OID 0)
-- Dependencies: 240
-- Name: FUNCTION get_project_data(project text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION get_project_data(project text) IS 'IN project --> client, theme, baselayers, overview layer, extra layers and tables_onstart for project_name.';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 170 (class 1259 OID 85566)
-- Name: clients; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE clients (
  id integer NOT NULL,
  name text NOT NULL,
  display_name text,
  theme_id integer
);


--
-- TOC entry 171 (class 1259 OID 85572)
-- Name: clients_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE clients_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;


--
-- TOC entry 2131 (class 0 OID 0)
-- Dependencies: 171
-- Name: clients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE clients_id_seq OWNED BY clients.id;


--
-- TOC entry 172 (class 1259 OID 85574)
-- Name: layers; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE layers (
  id integer NOT NULL,
  name text NOT NULL,
  display_name text,
  type text NOT NULL,
  base_layer boolean NOT NULL,
  definition text NOT NULL
);


--
-- TOC entry 173 (class 1259 OID 85580)
-- Name: layers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE layers_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;


--
-- TOC entry 2132 (class 0 OID 0)
-- Dependencies: 173
-- Name: layers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE layers_id_seq OWNED BY layers.id;


--
-- TOC entry 174 (class 1259 OID 85582)
-- Name: projects; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE projects (
  id integer NOT NULL,
  name text NOT NULL,
  overview_layer_id integer,
  base_layers_ids integer[],
  extra_layers_ids integer[],
  client_id integer,
  tables_onstart text[],
  public boolean DEFAULT false NOT NULL
);


--
-- TOC entry 175 (class 1259 OID 85588)
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE projects_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;


--
-- TOC entry 2133 (class 0 OID 0)
-- Dependencies: 175
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE projects_id_seq OWNED BY projects.id;


--
-- TOC entry 180 (class 1259 OID 94727)
-- Name: settings; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE settings (
  version integer,
  date date
);


--
-- TOC entry 176 (class 1259 OID 85590)
-- Name: themes; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE themes (
  id integer NOT NULL,
  name text NOT NULL
);


--
-- TOC entry 177 (class 1259 OID 85596)
-- Name: themes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE themes_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;


--
-- TOC entry 2134 (class 0 OID 0)
-- Dependencies: 177
-- Name: themes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE themes_id_seq OWNED BY themes.id;


--
-- TOC entry 178 (class 1259 OID 85598)
-- Name: users; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE users (
  user_id integer NOT NULL,
  user_name text,
  user_password_hash text,
  user_email text,
  display_name text,
  last_login timestamp with time zone,
  count_login integer DEFAULT 0,
  project_ids integer[]
);


--
-- TOC entry 179 (class 1259 OID 85605)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE users_user_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;


--
-- TOC entry 2135 (class 0 OID 0)
-- Dependencies: 179
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE users_user_id_seq OWNED BY users.user_id;


--
-- TOC entry 1972 (class 2604 OID 85607)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY clients ALTER COLUMN id SET DEFAULT nextval('clients_id_seq'::regclass);


--
-- TOC entry 1973 (class 2604 OID 85608)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY layers ALTER COLUMN id SET DEFAULT nextval('layers_id_seq'::regclass);


--
-- TOC entry 1974 (class 2604 OID 85609)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY projects ALTER COLUMN id SET DEFAULT nextval('projects_id_seq'::regclass);


--
-- TOC entry 1976 (class 2604 OID 85610)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY themes ALTER COLUMN id SET DEFAULT nextval('themes_id_seq'::regclass);


--
-- TOC entry 1978 (class 2604 OID 85611)
-- Name: user_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY users ALTER COLUMN user_id SET DEFAULT nextval('users_user_id_seq'::regclass);


--
-- TOC entry 2109 (class 0 OID 85566)
-- Dependencies: 170
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO clients VALUES (1, 'demo', 'DEMO', 1);


--
-- TOC entry 2136 (class 0 OID 0)
-- Dependencies: 171
-- Name: clients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('clients_id_seq', 1, false);


--
-- TOC entry 2111 (class 0 OID 85574)
-- Dependencies: 172
-- Data for Name: layers; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO layers VALUES (1, 'google_map', '', 'Google', true, '"Google "+TR.mapBasic,{type: google.maps.MapTypeId.MAP, numZoomLevels: 20, isBaseLayer: true}');
INSERT INTO layers VALUES (2, 'google_sat', '', 'Google', true, '"Google "+TR.mapSatellite,{type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 20, isBaseLayer: true}');
INSERT INTO layers VALUES (3, 'mapquest_map', '', 'OSM', true, '"MapQuest-OSM "+TR.mapBasic, ["http://otile1.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg","http://otile2.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg","http://otile3.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg","http://otile4.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg"], {numZoomLevels: 19, attribution: "Data, imagery and map information provided by <a href=''http://www.mapquest.com/''  target=''_blank''>MapQuest</a>, <a href=''http://www.openstreetmap.org/'' target=''_blank''>Open Street Map</a> and contributors, <a href=''http://creativecommons.org/licenses/by-sa/2.0/'' target=''_blank''>CC-BY-SA</a>  <img src=''http://developer.mapquest.com/content/osm/mq_logo.png'' border=''0''>"}');


--
-- TOC entry 2137 (class 0 OID 0)
-- Dependencies: 173
-- Name: layers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('layers_id_seq', 4, true);


--
-- TOC entry 2113 (class 0 OID 85582)
-- Dependencies: 174
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 2138 (class 0 OID 0)
-- Dependencies: 175
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('projects_id_seq', 1, false);


--
-- TOC entry 2119 (class 0 OID 94727)
-- Dependencies: 180
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO settings VALUES (2, '2015-08-11');


--
-- TOC entry 2115 (class 0 OID 85590)
-- Dependencies: 176
-- Data for Name: themes; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO themes VALUES (1, 'xtheme-blue.css');


--
-- TOC entry 2139 (class 0 OID 0)
-- Dependencies: 177
-- Name: themes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('themes_id_seq', 1, false);


--
-- TOC entry 2117 (class 0 OID 85598)
-- Dependencies: 178
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 2140 (class 0 OID 0)
-- Dependencies: 179
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('users_user_id_seq', 2, true);


--
-- TOC entry 1980 (class 2606 OID 85613)
-- Name: clients_name_key; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace:
--

ALTER TABLE ONLY clients
ADD CONSTRAINT clients_name_key UNIQUE (name);


--
-- TOC entry 1982 (class 2606 OID 85615)
-- Name: clients_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace:
--

ALTER TABLE ONLY clients
ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- TOC entry 1984 (class 2606 OID 85617)
-- Name: layers_layer_name_key; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace:
--

ALTER TABLE ONLY layers
ADD CONSTRAINT layers_layer_name_key UNIQUE (name);


--
-- TOC entry 1986 (class 2606 OID 85619)
-- Name: layers_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace:
--

ALTER TABLE ONLY layers
ADD CONSTRAINT layers_pkey PRIMARY KEY (id);


--
-- TOC entry 1988 (class 2606 OID 85621)
-- Name: projects_name_key; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace:
--

ALTER TABLE ONLY projects
ADD CONSTRAINT projects_name_key UNIQUE (name);


--
-- TOC entry 1990 (class 2606 OID 85623)
-- Name: projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace:
--

ALTER TABLE ONLY projects
ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- TOC entry 1992 (class 2606 OID 85625)
-- Name: themes_name_key; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace:
--

ALTER TABLE ONLY themes
ADD CONSTRAINT themes_name_key UNIQUE (name);


--
-- TOC entry 1994 (class 2606 OID 85627)
-- Name: themes_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace:
--

ALTER TABLE ONLY themes
ADD CONSTRAINT themes_pkey PRIMARY KEY (id);


--
-- TOC entry 1996 (class 2606 OID 85629)
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace:
--

ALTER TABLE ONLY users
ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 1998 (class 2606 OID 85631)
-- Name: users_user_name_key; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace:
--

ALTER TABLE ONLY users
ADD CONSTRAINT users_user_name_key UNIQUE (user_name);


--
-- TOC entry 1999 (class 2606 OID 85632)
-- Name: clients_theme_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY clients
ADD CONSTRAINT clients_theme_id_fkey FOREIGN KEY (theme_id) REFERENCES themes(id);


--
-- TOC entry 2000 (class 2606 OID 85637)
-- Name: projects_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY projects
ADD CONSTRAINT projects_client_id_fkey FOREIGN KEY (client_id) REFERENCES clients(id);


--
-- TOC entry 2001 (class 2606 OID 85642)
-- Name: projects_overview_layer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY projects
ADD CONSTRAINT projects_overview_layer_id_fkey FOREIGN KEY (overview_layer_id) REFERENCES layers(id);


--
-- TOC entry 2126 (class 0 OID 0)
-- Dependencies: 6
-- Name: public; Type: ACL; Schema: -; Owner: -
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2015-08-11 21:15:15 CEST

--
-- PostgreSQL database dump complete
--
