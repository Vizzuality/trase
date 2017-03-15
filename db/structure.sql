--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.1
-- Dumped by pg_dump version 9.6.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: intarray; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS intarray WITH SCHEMA public;


--
-- Name: EXTENSION intarray; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION intarray IS 'functions, operators, and index support for 1-D arrays of integers';


SET search_path = public, pg_catalog;

--
-- Name: attribute_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE attribute_type AS ENUM (
    'Quant',
    'Qual',
    'Ind'
);


--
-- Name: idx(anyarray, anyelement); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION idx(anyarray, anyelement) RETURNS integer
    LANGUAGE sql IMMUTABLE
    AS $_$
  SELECT i FROM (
     SELECT generate_series(array_lower($1,1),array_upper($1,1))
  ) g(i)
  WHERE $1[i] = $2
  LIMIT 1;
$_$;


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: commodities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE commodities (
    commodity_id integer NOT NULL,
    name text
);


--
-- Name: commodities_commodity_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE commodities_commodity_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: commodities_commodity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE commodities_commodity_id_seq OWNED BY commodities.commodity_id;


--
-- Name: context; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE context (
    id integer NOT NULL,
    country_id integer,
    commodity_id integer,
    years integer[],
    is_disabled boolean,
    is_default boolean,
    default_year integer
);


--
-- Name: context_factsheet_attribute; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE context_factsheet_attribute (
    id integer NOT NULL,
    attribute_id integer NOT NULL,
    attribute_type attribute_type,
    context_id integer NOT NULL,
    factsheet_type character varying(10) NOT NULL
);


--
-- Name: context_factsheet_attribute_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE context_factsheet_attribute_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: context_factsheet_attribute_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE context_factsheet_attribute_id_seq OWNED BY context_factsheet_attribute.id;


--
-- Name: context_filter_by; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE context_filter_by (
    id integer NOT NULL,
    context_id integer,
    node_type_id integer,
    "position" integer
);


--
-- Name: context_filter_by_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE context_filter_by_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: context_filter_by_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE context_filter_by_id_seq OWNED BY context_filter_by.id;


--
-- Name: context_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE context_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: context_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE context_id_seq OWNED BY context.id;


--
-- Name: context_indicators; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE context_indicators (
    id integer NOT NULL,
    context_id integer NOT NULL,
    indicator_attribute_id integer NOT NULL,
    indicator_attribute_type attribute_type NOT NULL,
    "position" integer NOT NULL
);


--
-- Name: context_indicators_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE context_indicators_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: context_indicators_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE context_indicators_id_seq OWNED BY context_indicators.id;


--
-- Name: context_layer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE context_layer (
    id integer NOT NULL,
    layer_attribute_id integer NOT NULL,
    layer_attribute_type attribute_type,
    context_id integer,
    "position" integer,
    bucket_3 double precision[],
    bucket_5 double precision[],
    context_layer_group_id integer,
    is_default boolean DEFAULT false
);


--
-- Name: context_layer_group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE context_layer_group (
    id integer NOT NULL,
    name text,
    "position" integer,
    context_id integer
);


--
-- Name: context_layer_group_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE context_layer_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: context_layer_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE context_layer_group_id_seq OWNED BY context_layer_group.id;


--
-- Name: context_layer_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE context_layer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: context_layer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE context_layer_id_seq OWNED BY context_layer.id;


--
-- Name: context_nodes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE context_nodes (
    id integer NOT NULL,
    context_id integer,
    column_group integer,
    column_position integer,
    is_default boolean,
    node_type_id integer
);


--
-- Name: context_nodes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE context_nodes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: context_nodes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE context_nodes_id_seq OWNED BY context_nodes.id;


--
-- Name: context_recolor_by; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE context_recolor_by (
    id integer NOT NULL,
    context_id integer,
    recolor_attribute_id integer NOT NULL,
    recolor_attribute_type attribute_type,
    is_default boolean,
    is_disabled boolean,
    group_number integer DEFAULT 1,
    "position" integer,
    legend_type character varying(55),
    legend_color_theme character varying(55),
    interval_count integer,
    min_value character varying(10),
    max_value character varying(10)
);


--
-- Name: context_recolor_by_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE context_recolor_by_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: context_recolor_by_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE context_recolor_by_id_seq OWNED BY context_recolor_by.id;


--
-- Name: context_resize_by; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE context_resize_by (
    id integer NOT NULL,
    context_id integer,
    is_default boolean,
    is_disabled boolean,
    resize_attribute_id integer NOT NULL,
    resize_attribute_type attribute_type,
    group_number integer DEFAULT 1,
    "position" integer
);


--
-- Name: context_resize_by_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE context_resize_by_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: context_resize_by_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE context_resize_by_id_seq OWNED BY context_resize_by.id;


--
-- Name: countries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE countries (
    country_id integer NOT NULL,
    name text,
    iso2 text,
    latitude double precision,
    longitude double precision,
    zoom integer
);


--
-- Name: countries_country_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE countries_country_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: countries_country_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE countries_country_id_seq OWNED BY countries.country_id;


--
-- Name: flow_inds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE flow_inds (
    flow_id integer,
    ind_id integer,
    value double precision
);


--
-- Name: flow_quals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE flow_quals (
    flow_id integer,
    qual_id integer,
    value text
);


--
-- Name: flow_quants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE flow_quants (
    flow_id integer,
    quant_id integer,
    value double precision
);


--
-- Name: flows; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE flows (
    flow_id integer NOT NULL,
    year smallint,
    path integer[],
    context_id integer
);


--
-- Name: flows_flow_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE flows_flow_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: flows_flow_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE flows_flow_id_seq OWNED BY flows.flow_id;


--
-- Name: inds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE inds (
    ind_id integer NOT NULL,
    name text,
    unit text,
    unit_type text,
    tooltip_text text,
    frontend_name text,
    place_factsheet boolean,
    actor_factsheet boolean,
    place_factsheet_tabular boolean,
    actor_factsheet_tabular boolean,
    place_factsheet_temporal boolean,
    actor_factsheet_temporal boolean,
    tooltip boolean
);


--
-- Name: inds_ind_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE inds_ind_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: inds_ind_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE inds_ind_id_seq OWNED BY inds.ind_id;


--
-- Name: node_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE node_types (
    node_type_id integer NOT NULL,
    node_type text
);


--
-- Name: nodes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE nodes (
    node_id integer NOT NULL,
    geo_id text,
    main_node_id integer,
    name text,
    node_type_id integer
);


--
-- Name: quants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE quants (
    quant_id integer NOT NULL,
    name text,
    unit text,
    unit_type text,
    tooltip_text text,
    frontend_name text,
    place_factsheet boolean,
    actor_factsheet boolean,
    place_factsheet_tabular boolean,
    actor_factsheet_tabular boolean,
    place_factsheet_temporal boolean,
    actor_factsheet_temporal boolean,
    tooltip boolean
);


--
-- Name: materialized_flows; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW materialized_flows AS
 WITH normalized_flows AS (
         SELECT f_1.flow_id,
            f_1.year,
            f_1.node_id,
            f_1."position",
            f_1.context_id,
            cn.node_type_id,
            cn.node_type
           FROM (( SELECT flows.flow_id,
                    flows.year,
                    a.node_id,
                    a."position",
                    flows.context_id
                   FROM flows,
                    LATERAL unnest(flows.path) WITH ORDINALITY a(node_id, "position")) f_1
             JOIN ( SELECT context_nodes.context_id,
                    context_nodes.column_position,
                    context_nodes.node_type_id,
                    node_types.node_type
                   FROM (context_nodes
                     JOIN node_types ON ((node_types.node_type_id = context_nodes.node_type_id)))) cn ON (((f_1."position" = (cn.column_position + 1)) AND (f_1.context_id = cn.context_id))))
        )
 SELECT f.flow_id,
    f.context_id,
    f.year,
    f.node_id,
    f.node_type,
        CASE
            WHEN (f.node_type = ANY (ARRAY['STATE'::text, 'BIOME'::text])) THEN upper(n.name)
            ELSE initcap(n.name)
        END AS node,
    n.geo_id,
    f_ex.node_id AS exporter_node_id,
    n_ex.name AS exporter_node,
    f_im.node_id AS importer_node_id,
    n_im.name AS importer_node,
    f_ctry.node_id AS country_node_id,
    n_ctry.name AS country_node,
    q.quant_id,
    (((q.name || ' ('::text) || q.unit) || ')'::text) AS name,
    fq.value
   FROM (((((((((normalized_flows f
     JOIN nodes n ON ((n.node_id = f.node_id)))
     JOIN normalized_flows f_ex ON (((f.flow_id = f_ex.flow_id) AND (f_ex.node_type = 'EXPORTER'::text))))
     JOIN nodes n_ex ON ((f_ex.node_id = n_ex.node_id)))
     JOIN normalized_flows f_im ON (((f.flow_id = f_im.flow_id) AND (f_im.node_type = 'IMPORTER'::text))))
     JOIN nodes n_im ON ((n_im.node_id = f_im.node_id)))
     JOIN normalized_flows f_ctry ON (((f.flow_id = f_ctry.flow_id) AND (f_ctry.node_type = 'COUNTRY'::text))))
     JOIN nodes n_ctry ON ((n_ctry.node_id = f_ctry.node_id)))
     JOIN flow_quants fq ON ((f.flow_id = fq.flow_id)))
     JOIN quants q ON ((fq.quant_id = q.quant_id)))
  WHERE (f.node_type = ANY (ARRAY['STATE'::text, 'BIOME'::text, 'MUNICIPALITY'::text]))
  ORDER BY
        CASE
            WHEN (f.node_type = 'STATE'::text) THEN 1
            WHEN (f.node_type = 'BIOME'::text) THEN 2
            ELSE 3
        END, n_ex.name, n_im.name, n_ctry.name
  WITH NO DATA;


--
-- Name: node_inds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE node_inds (
    node_id integer,
    ind_id integer,
    year smallint,
    value double precision
);


--
-- Name: node_quals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE node_quals (
    node_id integer,
    qual_id integer,
    year smallint,
    value text
);


--
-- Name: node_quants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE node_quants (
    node_id integer,
    quant_id integer,
    year smallint,
    value double precision
);


--
-- Name: node_types_node_type_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE node_types_node_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: node_types_node_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE node_types_node_type_id_seq OWNED BY node_types.node_type_id;


--
-- Name: nodes_node_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE nodes_node_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nodes_node_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE nodes_node_id_seq OWNED BY nodes.node_id;


--
-- Name: quals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE quals (
    qual_id integer NOT NULL,
    name text,
    tooltip_text text,
    frontend_name text,
    place_factsheet boolean,
    actor_factsheet boolean,
    place_factsheet_tabular boolean,
    actor_factsheet_tabular boolean,
    place_factsheet_temporal boolean,
    actor_factsheet_temporal boolean,
    tooltip boolean
);


--
-- Name: quals_qual_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE quals_qual_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: quals_qual_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE quals_qual_id_seq OWNED BY quals.qual_id;


--
-- Name: quants_quant_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE quants_quant_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: quants_quant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE quants_quant_id_seq OWNED BY quants.quant_id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE schema_migrations (
    version character varying NOT NULL
);


--
-- Name: commodities commodity_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY commodities ALTER COLUMN commodity_id SET DEFAULT nextval('commodities_commodity_id_seq'::regclass);


--
-- Name: context id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY context ALTER COLUMN id SET DEFAULT nextval('context_id_seq'::regclass);


--
-- Name: context_factsheet_attribute id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY context_factsheet_attribute ALTER COLUMN id SET DEFAULT nextval('context_factsheet_attribute_id_seq'::regclass);


--
-- Name: context_filter_by id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY context_filter_by ALTER COLUMN id SET DEFAULT nextval('context_filter_by_id_seq'::regclass);


--
-- Name: context_indicators id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY context_indicators ALTER COLUMN id SET DEFAULT nextval('context_indicators_id_seq'::regclass);


--
-- Name: context_layer id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY context_layer ALTER COLUMN id SET DEFAULT nextval('context_layer_id_seq'::regclass);


--
-- Name: context_layer_group id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY context_layer_group ALTER COLUMN id SET DEFAULT nextval('context_layer_group_id_seq'::regclass);


--
-- Name: context_nodes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY context_nodes ALTER COLUMN id SET DEFAULT nextval('context_nodes_id_seq'::regclass);


--
-- Name: context_recolor_by id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY context_recolor_by ALTER COLUMN id SET DEFAULT nextval('context_recolor_by_id_seq'::regclass);


--
-- Name: context_resize_by id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY context_resize_by ALTER COLUMN id SET DEFAULT nextval('context_resize_by_id_seq'::regclass);


--
-- Name: countries country_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY countries ALTER COLUMN country_id SET DEFAULT nextval('countries_country_id_seq'::regclass);


--
-- Name: flows flow_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY flows ALTER COLUMN flow_id SET DEFAULT nextval('flows_flow_id_seq'::regclass);


--
-- Name: inds ind_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY inds ALTER COLUMN ind_id SET DEFAULT nextval('inds_ind_id_seq'::regclass);


--
-- Name: node_types node_type_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY node_types ALTER COLUMN node_type_id SET DEFAULT nextval('node_types_node_type_id_seq'::regclass);


--
-- Name: nodes node_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY nodes ALTER COLUMN node_id SET DEFAULT nextval('nodes_node_id_seq'::regclass);


--
-- Name: quals qual_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY quals ALTER COLUMN qual_id SET DEFAULT nextval('quals_qual_id_seq'::regclass);


--
-- Name: quants quant_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY quants ALTER COLUMN quant_id SET DEFAULT nextval('quants_quant_id_seq'::regclass);


--
-- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- Name: commodities commodities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY commodities
    ADD CONSTRAINT commodities_pkey PRIMARY KEY (commodity_id);


--
-- Name: context_factsheet_attribute context_factsheet_attribute_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY context_factsheet_attribute
    ADD CONSTRAINT context_factsheet_attribute_pkey PRIMARY KEY (id);


--
-- Name: context_filter_by context_filter_by_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY context_filter_by
    ADD CONSTRAINT context_filter_by_pkey PRIMARY KEY (id);


--
-- Name: context_indicators context_indicators_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY context_indicators
    ADD CONSTRAINT context_indicators_pkey PRIMARY KEY (id);


--
-- Name: context_layer_group context_layer_group_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY context_layer_group
    ADD CONSTRAINT context_layer_group_pkey PRIMARY KEY (id);


--
-- Name: context_nodes context_nodes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY context_nodes
    ADD CONSTRAINT context_nodes_pkey PRIMARY KEY (id);


--
-- Name: context context_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY context
    ADD CONSTRAINT context_pkey PRIMARY KEY (id);


--
-- Name: context_recolor_by context_recolor_by_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY context_recolor_by
    ADD CONSTRAINT context_recolor_by_pkey PRIMARY KEY (id);


--
-- Name: context_resize_by context_resize_by_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY context_resize_by
    ADD CONSTRAINT context_resize_by_pkey PRIMARY KEY (id);


--
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (country_id);


--
-- Name: flows flows_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY flows
    ADD CONSTRAINT flows_pkey PRIMARY KEY (flow_id);


--
-- Name: inds inds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY inds
    ADD CONSTRAINT inds_pkey PRIMARY KEY (ind_id);


--
-- Name: node_types node_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY node_types
    ADD CONSTRAINT node_types_pkey PRIMARY KEY (node_type_id);


--
-- Name: nodes nodes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY nodes
    ADD CONSTRAINT nodes_pkey PRIMARY KEY (node_id);


--
-- Name: quals quals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY quals
    ADD CONSTRAINT quals_pkey PRIMARY KEY (qual_id);


--
-- Name: quants quants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY quants
    ADD CONSTRAINT quants_pkey PRIMARY KEY (quant_id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: context_indicators_indicator_attribute_type_indicator_attri_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX context_indicators_indicator_attribute_type_indicator_attri_idx ON context_indicators USING btree (indicator_attribute_type, indicator_attribute_id, context_id);


--
-- Name: index_materialized_flows_on_country_node_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_materialized_flows_on_country_node_id ON materialized_flows USING btree (country_node_id);


--
-- Name: index_materialized_flows_on_exporter_node_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_materialized_flows_on_exporter_node_id ON materialized_flows USING btree (exporter_node_id);


--
-- Name: index_materialized_flows_on_importer_node_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_materialized_flows_on_importer_node_id ON materialized_flows USING btree (importer_node_id);


--
-- Name: index_materialized_flows_on_node_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_materialized_flows_on_node_id ON materialized_flows USING btree (node_id);


--
-- Name: index_materialized_flows_on_quant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_materialized_flows_on_quant_id ON materialized_flows USING btree (quant_id);


--
-- Name: context context_commodity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY context
    ADD CONSTRAINT context_commodity_id_fkey FOREIGN KEY (commodity_id) REFERENCES commodities(commodity_id);


--
-- Name: context context_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY context
    ADD CONSTRAINT context_country_id_fkey FOREIGN KEY (country_id) REFERENCES countries(country_id);


--
-- Name: context_factsheet_attribute context_factsheet_attribute_context_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY context_factsheet_attribute
    ADD CONSTRAINT context_factsheet_attribute_context_id_fkey FOREIGN KEY (context_id) REFERENCES context(id);


--
-- Name: context_filter_by context_filter_by_context_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY context_filter_by
    ADD CONSTRAINT context_filter_by_context_id_fkey FOREIGN KEY (context_id) REFERENCES context(id);


--
-- Name: context_filter_by context_filter_by_node_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY context_filter_by
    ADD CONSTRAINT context_filter_by_node_type_id_fkey FOREIGN KEY (node_type_id) REFERENCES node_types(node_type_id);


--
-- Name: context_indicators context_indicators_context_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY context_indicators
    ADD CONSTRAINT context_indicators_context_id_fkey FOREIGN KEY (context_id) REFERENCES context(id);


--
-- Name: context_layer context_layer_context_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY context_layer
    ADD CONSTRAINT context_layer_context_id_fkey FOREIGN KEY (context_id) REFERENCES context(id);


--
-- Name: context_layer context_layer_context_layer_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY context_layer
    ADD CONSTRAINT context_layer_context_layer_group_id_fkey FOREIGN KEY (context_layer_group_id) REFERENCES context_layer_group(id);


--
-- Name: context_layer_group context_layer_group_context_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY context_layer_group
    ADD CONSTRAINT context_layer_group_context_id_fkey FOREIGN KEY (context_id) REFERENCES context(id);


--
-- Name: context_nodes context_nodes_context_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY context_nodes
    ADD CONSTRAINT context_nodes_context_id_fkey FOREIGN KEY (context_id) REFERENCES context(id);


--
-- Name: context_nodes context_nodes_node_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY context_nodes
    ADD CONSTRAINT context_nodes_node_type_id_fkey FOREIGN KEY (node_type_id) REFERENCES node_types(node_type_id);


--
-- Name: context_recolor_by context_recolor_by_context_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY context_recolor_by
    ADD CONSTRAINT context_recolor_by_context_id_fkey FOREIGN KEY (context_id) REFERENCES context(id);


--
-- Name: context_resize_by context_resize_by_context_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY context_resize_by
    ADD CONSTRAINT context_resize_by_context_id_fkey FOREIGN KEY (context_id) REFERENCES context(id);


--
-- Name: flow_inds flow_inds_flow_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY flow_inds
    ADD CONSTRAINT flow_inds_flow_id_fkey FOREIGN KEY (flow_id) REFERENCES flows(flow_id);


--
-- Name: flow_inds flow_inds_ind_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY flow_inds
    ADD CONSTRAINT flow_inds_ind_id_fkey FOREIGN KEY (ind_id) REFERENCES inds(ind_id);


--
-- Name: flow_quals flow_quals_flow_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY flow_quals
    ADD CONSTRAINT flow_quals_flow_id_fkey FOREIGN KEY (flow_id) REFERENCES flows(flow_id);


--
-- Name: flow_quals flow_quals_qual_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY flow_quals
    ADD CONSTRAINT flow_quals_qual_id_fkey FOREIGN KEY (qual_id) REFERENCES quals(qual_id);


--
-- Name: flow_quants flow_quants_flow_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY flow_quants
    ADD CONSTRAINT flow_quants_flow_id_fkey FOREIGN KEY (flow_id) REFERENCES flows(flow_id);


--
-- Name: flow_quants flow_quants_quant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY flow_quants
    ADD CONSTRAINT flow_quants_quant_id_fkey FOREIGN KEY (quant_id) REFERENCES quants(quant_id);


--
-- Name: flows flows_context_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY flows
    ADD CONSTRAINT flows_context_id_fkey FOREIGN KEY (context_id) REFERENCES context(id);


--
-- Name: node_inds node_inds_ind_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY node_inds
    ADD CONSTRAINT node_inds_ind_id_fkey FOREIGN KEY (ind_id) REFERENCES inds(ind_id);


--
-- Name: node_inds node_inds_node_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY node_inds
    ADD CONSTRAINT node_inds_node_id_fkey FOREIGN KEY (node_id) REFERENCES nodes(node_id);


--
-- Name: node_quals node_quals_node_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY node_quals
    ADD CONSTRAINT node_quals_node_id_fkey FOREIGN KEY (node_id) REFERENCES nodes(node_id);


--
-- Name: node_quals node_quals_qual_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY node_quals
    ADD CONSTRAINT node_quals_qual_id_fkey FOREIGN KEY (qual_id) REFERENCES quals(qual_id);


--
-- Name: node_quants node_quants_node_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY node_quants
    ADD CONSTRAINT node_quants_node_id_fkey FOREIGN KEY (node_id) REFERENCES nodes(node_id);


--
-- Name: node_quants node_quants_quant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY node_quants
    ADD CONSTRAINT node_quants_quant_id_fkey FOREIGN KEY (quant_id) REFERENCES quants(quant_id);


--
-- Name: nodes nodes_node_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY nodes
    ADD CONSTRAINT nodes_node_type_id_fkey FOREIGN KEY (node_type_id) REFERENCES node_types(node_type_id);


--
-- PostgreSQL database dump complete
--

SET search_path TO "$user", public;

INSERT INTO "schema_migrations" (version) VALUES
('20170217085928'),
('20170308111306');


