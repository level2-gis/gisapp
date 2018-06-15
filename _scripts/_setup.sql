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

DROP FUNCTION IF EXISTS public.get_project_data(text);
CREATE OR REPLACE FUNCTION public.get_project_data(project text)
  RETURNS TABLE(client_id integer, client_name text, client_display_name text, client_url text, theme_name text, overview_layer json, base_layers json, extra_layers json, tables_onstart text[], is_public boolean, project_id integer, project_name text, project_display_name text, crs text, description text, contact text, restrict_to_start_extent boolean, geolocation boolean, feedback boolean, measurements boolean, print boolean, zoom_back_forward boolean, identify_mode boolean, permalink boolean, feedback_email text, project_path text, plugins text[])
LANGUAGE 'plpgsql'

COST 1
VOLATILE
ROWS 1000
AS $BODY$

declare base json;
declare overview json;
declare extra json;
declare plugins text[];
begin
  base:=null;
  overview:=null;

  SELECT json_agg(json_build_object('type',layers.type,'definition',layers.definition,'name',layers.name,'title',layers.display_name))
  FROM
    (SELECT layers.* FROM projects,layers where layers.id = ANY(projects.base_layers_ids) AND projects.name=$1 ORDER BY idx(projects.base_layers_ids, layers.id)) AS layers INTO base;

  SELECT json_agg(json_build_object('type',layers.type,'definition',layers.definition,'name',layers.name,'title',layers.display_name))
  FROM
    (SELECT layers.* FROM projects,layers where layers.id = ANY(projects.extra_layers_ids) AND projects.name=$1 ORDER BY idx(projects.extra_layers_ids, layers.id)) AS layers INTO extra;

  SELECT array_agg(plugins.name) from projects,plugins WHERE plugins.id = ANY(projects.plugin_ids) AND projects.name=$1 INTO plugins;

  SELECT json_agg(json_build_object('type',layers.type,'definition',layers.definition,'name',layers.name,'title',layers.display_name))
  FROM projects,layers where layers.id = projects.overview_layer_id and projects.name=$1 INTO overview;

  RETURN QUERY SELECT
                 clients.id,
                 clients.name,
                 clients.display_name,
                 clients.url,
                 themes.name,
                 overview,
                 base,
                 extra,
                 projects.tables_onstart,
                 projects.public,
                 projects.id,
                 projects.name,
                 projects.display_name,
                 projects.crs,
                 projects.description,
                 projects.contact,
                 projects.restrict_to_start_extent,
                 projects.geolocation,
                 projects.feedback,
                 projects.measurements,
                 projects.print,
                 projects.zoom_back_forward,
                 projects.identify_mode,
                 projects.permalink,
                 projects.feedback_email,
                 projects.project_path,
                 plugins

               FROM projects,clients,themes WHERE clients.theme_id=themes.id AND projects.client_id = clients.id AND projects.name=$1;
end;

$BODY$;

COMMENT ON FUNCTION public.get_project_data(text)
IS 'IN project --> client, theme, baselayers, overview layer, extra layers and tables_onstart for project_name.';

SET default_with_oids = false;

--
-- TOC entry 170 (class 1259 OID 95936)
-- Name: clients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE clients (
    id integer NOT NULL,
    name text NOT NULL,
    display_name text,
    theme_id integer NOT NULL DEFAULT 1,
    url text,
    description text,
    ordr integer NOT NULL DEFAULT 0
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
    display_name text,
    contact text,
    crs text,
    description text,
    overview_layer_id integer,
    base_layers_ids integer[],
    extra_layers_ids integer[],
    client_id integer NOT NULL,
    tables_onstart text[],
    public boolean DEFAULT false NOT NULL,
    restrict_to_start_extent boolean NOT NULL default FALSE,
    geolocation boolean NOT NULL default TRUE,
    feedback boolean NOT NULL default TRUE,
    measurements boolean NOT NULL default TRUE,
    print boolean NOT NULL DEFAULT true,
    zoom_back_forward boolean NOT NULL DEFAULT true,
    identify_mode boolean NOT NULL DEFAULT false,
    permalink boolean NOT NULL DEFAULT true,
    feedback_email text,
    project_path text,
    ordr integer NOT NULL DEFAULT 0,
    plugin_ids integer[]
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
    registered timestamp with time zone,
    count_login integer DEFAULT 0,
    project_ids integer[],
    admin boolean DEFAULT false,
    lang text,
    organization text
);

CREATE TABLE plugins (
  id serial,
  name text NOT NULL,
  description text,
  CONSTRAINT plugins_pkey PRIMARY KEY (id),
  CONSTRAINT plugins_name_key UNIQUE (name)
);
INSERT INTO plugins(name) VALUES ('streetview');
INSERT INTO plugins(name) VALUES ('simpleaction');

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

INSERT INTO layers VALUES (1, 'google_map', 'Google Streets', 'Google', '{type: google.maps.MapTypeId.MAP, numZoomLevels: 20, isBaseLayer: true, useTiltImages: false}');
INSERT INTO layers VALUES (2, 'google_sat', 'Google Satellite', 'Google', '{type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 20, isBaseLayer: true}');
INSERT INTO layers VALUES (4, 'osm_mapnik', 'OpenStreetMap', 'OSM', '{"numZoomLevels": 20, "serverResolutions": [156543.03390625, 78271.516953125, 39135.7584765625, 19567.87923828125, 9783.939619140625, 4891.9698095703125, 2445.9849047851562, 1222.9924523925781, 611.4962261962891, 305.74811309814453, 152.87405654907226, 76.43702827453613, 38.218514137268066, 19.109257068634033, 9.554628534317017, 4.777314267158508, 2.388657133579254, 1.194328566789627, 0.5971642833948135, 0.29858214169740677]}');


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
INSERT INTO projects(
id, name, overview_layer_id, base_layers_ids, extra_layers_ids,
client_id, tables_onstart, public)
VALUES (1, 'helloworld', 4, '{4}', NULL, 1, NULL, true);


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

INSERT INTO settings VALUES (18, '2018-06-15');


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

ALTER TABLE ONLY users
ADD CONSTRAINT users_user_email_key UNIQUE (user_email);

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

-- View: public.projects_view

DROP VIEW IF EXISTS public.projects_view;
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
    projects.ordr,
    projects.contact,
    clients.display_name AS client,
    clients.name AS client_name
  FROM projects,
    clients
  WHERE projects.client_id = clients.id;

CREATE SEQUENCE public.users_print_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;

CREATE TABLE public.users_print
(
  id integer NOT NULL DEFAULT nextval('users_print_id_seq'::regclass),
  user_name text,
  title text,
  description text,
  print_time timestamp with time zone DEFAULT now(),
  CONSTRAINT users_print_pkey PRIMARY KEY (id),
  CONSTRAINT print_user_name_fkey FOREIGN KEY (user_name)
  REFERENCES public.users (user_name) MATCH SIMPLE
  ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
OIDS=FALSE
);

CREATE OR REPLACE VIEW public.users_print_view AS
  SELECT users_print.user_name,
    users.user_email,
    users.display_name,
    users_print.title,
    users_print.description,
    users_print.print_time,
    users.user_id
  FROM users,
    users_print
  WHERE users_print.user_name = users.user_name;
