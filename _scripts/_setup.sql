--
-- PostgreSQL database dump
--

-- Dumped from database version 9.3.9
-- Dumped by pg_dump version 9.3.9
-- Started on 2015-11-23 22:48:03 CET

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
-- TOC entry 2128 (class 0 OID 0)
-- Dependencies: 181
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- TOC entry 182 (class 3079 OID 95823)
-- Name: intarray; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS intarray WITH SCHEMA public;


--
-- TOC entry 2129 (class 0 OID 0)
-- Dependencies: 182
-- Name: EXTENSION intarray; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION intarray IS 'functions, operators, and index support for 1-D arrays of integers';


SET search_path = public, pg_catalog;

--
-- TOC entry 240 (class 1255 OID 95934)
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
-- TOC entry 2130 (class 0 OID 0)
-- Dependencies: 240
-- Name: FUNCTION check_user_project(uname text, project text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION check_user_project(uname text, project text) IS 'IN uname, project --> validates project, user and user permissions on project';


--
-- TOC entry 241 (class 1255 OID 96388)
-- Name: get_project_data(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION get_project_data(project text) RETURNS TABLE(client_name text, client_display_name text, client_url text, theme_name text, overview_layer json, base_layers json, extra_layers json, tables_onstart text[])
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


RETURN QUERY SELECT clients.name, clients.display_name, clients.url, themes.name, overview,base,extra, projects.tables_onstart FROM projects,clients,themes WHERE clients.theme_id=themes.id AND projects.client_id = clients.id AND projects.name=$1;
end;
$_$;


--
-- TOC entry 2131 (class 0 OID 0)
-- Dependencies: 241
-- Name: FUNCTION get_project_data(project text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION get_project_data(project text) IS 'IN project --> client, theme, baselayers, overview layer, extra layers and tables_onstart for project_name.';


SET default_with_oids = false;

--
-- TOC entry 170 (class 1259 OID 95936)
-- Name: clients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE clients (
    id integer NOT NULL,
    name text NOT NULL,
    display_name text,
    theme_id integer,
    url text
);


--
-- TOC entry 171 (class 1259 OID 95942)
-- Name: clients_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE clients_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2132 (class 0 OID 0)
-- Dependencies: 171
-- Name: clients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE clients_id_seq OWNED BY clients.id;


--
-- TOC entry 172 (class 1259 OID 95944)
-- Name: layers; Type: TABLE; Schema: public; Owner: -
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
-- TOC entry 173 (class 1259 OID 95950)
-- Name: layers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE layers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2133 (class 0 OID 0)
-- Dependencies: 173
-- Name: layers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE layers_id_seq OWNED BY layers.id;


--
-- TOC entry 174 (class 1259 OID 95952)
-- Name: projects; Type: TABLE; Schema: public; Owner: -
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
-- TOC entry 175 (class 1259 OID 95959)
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE projects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2134 (class 0 OID 0)
-- Dependencies: 175
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE projects_id_seq OWNED BY projects.id;


--
-- TOC entry 176 (class 1259 OID 95961)
-- Name: settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE settings (
    version integer NOT NULL,
    date date
);


--
-- TOC entry 177 (class 1259 OID 95964)
-- Name: themes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE themes (
    id integer NOT NULL,
    name text NOT NULL
);


--
-- TOC entry 178 (class 1259 OID 95970)
-- Name: themes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE themes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2135 (class 0 OID 0)
-- Dependencies: 178
-- Name: themes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE themes_id_seq OWNED BY themes.id;


--
-- TOC entry 179 (class 1259 OID 95972)
-- Name: users; Type: TABLE; Schema: public; Owner: -
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
-- TOC entry 180 (class 1259 OID 95979)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2136 (class 0 OID 0)
-- Dependencies: 180
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE users_user_id_seq OWNED BY users.user_id;


--
-- TOC entry 1972 (class 2604 OID 95981)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY clients ALTER COLUMN id SET DEFAULT nextval('clients_id_seq'::regclass);


--
-- TOC entry 1973 (class 2604 OID 95982)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY layers ALTER COLUMN id SET DEFAULT nextval('layers_id_seq'::regclass);


--
-- TOC entry 1975 (class 2604 OID 95983)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY projects ALTER COLUMN id SET DEFAULT nextval('projects_id_seq'::regclass);


--
-- TOC entry 1976 (class 2604 OID 95984)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY themes ALTER COLUMN id SET DEFAULT nextval('themes_id_seq'::regclass);


--
-- TOC entry 1978 (class 2604 OID 95985)
-- Name: user_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY users ALTER COLUMN user_id SET DEFAULT nextval('users_user_id_seq'::regclass);


--
-- TOC entry 2111 (class 0 OID 95936)
-- Dependencies: 170
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO clients VALUES (1, 'demo', 'DEMO', 1, 'http://www.level2.si');


--
-- TOC entry 2137 (class 0 OID 0)
-- Dependencies: 171
-- Name: clients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('clients_id_seq', 1, false);


--
-- TOC entry 2113 (class 0 OID 95944)
-- Dependencies: 172
-- Data for Name: layers; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO layers VALUES (1, 'google_map', '', 'Google', true, '"Google "+TR.mapBasic,{type: google.maps.MapTypeId.MAP, numZoomLevels: 20, isBaseLayer: true}');
INSERT INTO layers VALUES (2, 'google_sat', '', 'Google', true, '"Google "+TR.mapSatellite,{type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 20, isBaseLayer: true}');
INSERT INTO layers VALUES (3, 'mapquest_map', '', 'OSM', true, '"MapQuest-OSM "+TR.mapBasic, ["http://otile1.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg","http://otile2.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg","http://otile3.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg","http://otile4.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg"], {numZoomLevels: 19}');
INSERT INTO layers VALUES (4, 'osm_mapnik', '', 'OSM', true, '"OpenStreetMap (mapnik)"');


--
-- TOC entry 2138 (class 0 OID 0)
-- Dependencies: 173
-- Name: layers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('layers_id_seq', 5, true);


--
-- TOC entry 2115 (class 0 OID 95952)
-- Dependencies: 174
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO projects VALUES (1, 'helloworld', 3, '{2,3,4}', NULL, 1, NULL, true);


--
-- TOC entry 2139 (class 0 OID 0)
-- Dependencies: 175
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('projects_id_seq', 1, false);


--
-- TOC entry 2117 (class 0 OID 95961)
-- Dependencies: 176
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO settings VALUES (4, '2015-11-23');


--
-- TOC entry 2118 (class 0 OID 95964)
-- Dependencies: 177
-- Data for Name: themes; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO themes VALUES (1, 'xtheme-blue.css');


--
-- TOC entry 2140 (class 0 OID 0)
-- Dependencies: 178
-- Name: themes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('themes_id_seq', 1, false);


--
-- TOC entry 2120 (class 0 OID 95972)
-- Dependencies: 179
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 2141 (class 0 OID 0)
-- Dependencies: 180
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('users_user_id_seq', 3, true);


--
-- TOC entry 1980 (class 2606 OID 95987)
-- Name: clients_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY clients
    ADD CONSTRAINT clients_name_key UNIQUE (name);


--
-- TOC entry 1982 (class 2606 OID 95989)
-- Name: clients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- TOC entry 1984 (class 2606 OID 95991)
-- Name: layers_layer_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY layers
    ADD CONSTRAINT layers_layer_name_key UNIQUE (name);


--
-- TOC entry 1986 (class 2606 OID 95993)
-- Name: layers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY layers
    ADD CONSTRAINT layers_pkey PRIMARY KEY (id);


--
-- TOC entry 1988 (class 2606 OID 95995)
-- Name: projects_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY projects
    ADD CONSTRAINT projects_name_key UNIQUE (name);


--
-- TOC entry 1990 (class 2606 OID 95997)
-- Name: projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- TOC entry 1992 (class 2606 OID 96386)
-- Name: settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (version);


--
-- TOC entry 1994 (class 2606 OID 95999)
-- Name: themes_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY themes
    ADD CONSTRAINT themes_name_key UNIQUE (name);


--
-- TOC entry 1996 (class 2606 OID 96001)
-- Name: themes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY themes
    ADD CONSTRAINT themes_pkey PRIMARY KEY (id);


--
-- TOC entry 1998 (class 2606 OID 96003)
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 2000 (class 2606 OID 96005)
-- Name: users_user_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_user_name_key UNIQUE (user_name);


--
-- TOC entry 2001 (class 2606 OID 96006)
-- Name: clients_theme_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY clients
    ADD CONSTRAINT clients_theme_id_fkey FOREIGN KEY (theme_id) REFERENCES themes(id);


--
-- TOC entry 2002 (class 2606 OID 96011)
-- Name: projects_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY projects
    ADD CONSTRAINT projects_client_id_fkey FOREIGN KEY (client_id) REFERENCES clients(id);


--
-- TOC entry 2003 (class 2606 OID 96016)
-- Name: projects_overview_layer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY projects
    ADD CONSTRAINT projects_overview_layer_id_fkey FOREIGN KEY (overview_layer_id) REFERENCES layers(id);


-- Completed on 2015-11-23 22:48:13 CET

--
-- PostgreSQL database dump complete
--

