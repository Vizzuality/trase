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


--
-- Name: tablefunc; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS tablefunc WITH SCHEMA public;


--
-- Name: EXTENSION tablefunc; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION tablefunc IS 'functions that manipulate whole tables, including crosstab';


SET search_path = public, pg_catalog;

--
-- Name: attribute_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE attribute_type AS ENUM (
    'Quant',
    'Qual',
    'Ind'
);


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
    max_value character varying(10),
    divisor double precision
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
-- Name: inds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE inds (
    ind_id integer NOT NULL,
    name text,
    unit text,
    unit_type text,
    tooltip boolean,
    tooltip_text text,
    frontend_name text,
    place_factsheet boolean,
    actor_factsheet boolean,
    place_factsheet_tabular boolean,
    actor_factsheet_tabular boolean,
    place_factsheet_temporal boolean,
    actor_factsheet_temporal boolean
);


--
-- Name: quals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE quals (
    qual_id integer NOT NULL,
    name text,
    tooltip boolean,
    tooltip_text text,
    frontend_name text,
    place_factsheet boolean,
    actor_factsheet boolean,
    place_factsheet_tabular boolean,
    actor_factsheet_tabular boolean,
    place_factsheet_temporal boolean,
    actor_factsheet_temporal boolean
);


--
-- Name: quants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE quants (
    quant_id integer NOT NULL,
    name text,
    unit text,
    unit_type text,
    tooltip boolean,
    tooltip_text text,
    frontend_name text,
    place_factsheet boolean,
    actor_factsheet boolean,
    place_factsheet_tabular boolean,
    actor_factsheet_tabular boolean,
    place_factsheet_temporal boolean,
    actor_factsheet_temporal boolean
);


--
-- Name: flow_indicators; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW flow_indicators AS
 SELECT f.flow_id,
    f.qual_id AS indicator_id,
    'Qual'::text AS indicator_type,
    NULL::double precision AS numeric_value,
        CASE
            WHEN (lower(f.value) = 'yes'::text) THEN true
            WHEN (lower(f.value) = 'no'::text) THEN false
            ELSE NULL::boolean
        END AS boolean_value,
    q.name,
    NULL::text AS unit,
    q.name AS name_with_unit
   FROM (flow_quals f
     JOIN quals q ON ((f.qual_id = q.qual_id)))
  WHERE (q.name = 'ZERO_DEFORESTATION'::text)
  GROUP BY f.flow_id, f.qual_id, f.value, q.name
UNION ALL
 SELECT f.flow_id,
    f.ind_id AS indicator_id,
    'Ind'::text AS indicator_type,
    f.value AS numeric_value,
    NULL::boolean AS boolean_value,
    i.name,
    i.unit,
        CASE
            WHEN (i.unit IS NULL) THEN i.name
            ELSE (((i.name || ' ('::text) || i.unit) || ')'::text)
        END AS name_with_unit
   FROM (flow_inds f
     JOIN inds i ON ((f.ind_id = i.ind_id)))
  WHERE (i.name = ANY (ARRAY['BIODIVERSITY'::text, 'FOREST_500'::text, 'SMALLHOLDERS'::text, 'WATER_SCARCITY'::text, 'COMPLIANCE_FOREST_CODE'::text]))
  GROUP BY f.flow_id, f.ind_id, f.value, i.name, i.unit
UNION ALL
 SELECT f.flow_id,
    f.quant_id AS indicator_id,
    'Quant'::text AS indicator_type,
    f.value AS numeric_value,
    NULL::boolean AS boolean_value,
    q.name,
    q.unit,
        CASE
            WHEN (q.unit IS NULL) THEN q.name
            ELSE (((q.name || ' ('::text) || q.unit) || ')'::text)
        END AS name_with_unit
   FROM (flow_quants f
     JOIN quants q ON ((f.quant_id = q.quant_id)))
  WHERE (q.name = ANY (ARRAY['AGROSATELITE_SOY_DEFOR_'::text, 'GHG'::text, 'POTENTIAL_SOY_RELATED_DEFOR'::text, 'SOY_'::text, 'TOTAL_DEFOR_RATE'::text]))
  GROUP BY f.flow_id, f.quant_id, f.value, q.name, q.unit
  WITH NO DATA;


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
    node_type_id integer,
    is_domestic_consumption boolean,
    is_unknown boolean
);


--
-- Name: node_flows; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW node_flows AS
 SELECT f.node_id,
    n.geo_id,
        CASE
            WHEN (nt.node_type = ANY (ARRAY['STATE'::text, 'BIOME'::text])) THEN upper(n.name)
            ELSE initcap(n.name)
        END AS name,
    nt.node_type,
    f.flow_id,
    f.year,
    f.context_id
   FROM ((( SELECT flows.flow_id,
            flows.year,
            a.node_id,
            a."position",
            flows.context_id
           FROM flows,
            LATERAL unnest(flows.path) WITH ORDINALITY a(node_id, "position")) f
     JOIN nodes n ON ((n.node_id = f.node_id)))
     JOIN node_types nt ON ((nt.node_type_id = n.node_type_id)))
  WHERE (nt.node_type = ANY (ARRAY['STATE'::text, 'BIOME'::text, 'MUNICIPALITY'::text, 'EXPORTER'::text, 'IMPORTER'::text, 'COUNTRY'::text]))
  WITH NO DATA;


--
-- Name: materialized_flows; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW materialized_flows AS
 WITH aggregated_flows AS (
         SELECT f.context_id,
            f.node_type,
            f.name AS node,
            f.node_id,
            f.geo_id,
            f_ex.node_id AS exporter_node_id,
            f_ex.name AS exporter_node,
            f_im.node_id AS importer_node_id,
            f_im.name AS importer_node,
            f_ctry.node_id AS country_node_id,
            f_ctry.name AS country_node,
            f.year,
            fi.indicator_type,
            fi.indicator_id,
            fi.name AS indicator,
            fi.name_with_unit AS indicator_with_unit,
            bool_and(fi.boolean_value) AS bool_and,
            sum(fi.numeric_value) AS sum
           FROM ((((node_flows f
             JOIN node_flows f_ex ON (((f_ex.node_type = 'EXPORTER'::text) AND (f.flow_id = f_ex.flow_id))))
             JOIN node_flows f_im ON (((f_im.node_type = 'IMPORTER'::text) AND (f.flow_id = f_im.flow_id))))
             JOIN node_flows f_ctry ON (((f_ctry.node_type = 'COUNTRY'::text) AND (f.flow_id = f_ctry.flow_id))))
             JOIN flow_indicators fi ON ((f.flow_id = fi.flow_id)))
          GROUP BY f.context_id, f.year, f.node_id, f.node_type, f.name, f.geo_id, f_ex.node_id, f_ex.name, f_im.node_id, f_im.name, f_ctry.node_id, f_ctry.name, fi.indicator_type, fi.indicator_id, fi.name, fi.name_with_unit
        ), with_totals AS (
         SELECT aggregated_flows.context_id,
            NULL::text AS node_type,
            'TOTAL'::text AS node,
            NULL::integer AS node_id,
            NULL::text AS geo_id,
            aggregated_flows.exporter_node_id,
            aggregated_flows.exporter_node,
            aggregated_flows.importer_node_id,
            aggregated_flows.importer_node,
            aggregated_flows.country_node_id,
            aggregated_flows.country_node,
            aggregated_flows.year,
            aggregated_flows.indicator_type,
            aggregated_flows.indicator_id,
            aggregated_flows.indicator_with_unit,
                CASE
                    WHEN ((aggregated_flows.indicator_type = 'Qual'::text) AND bool_and(aggregated_flows.bool_and)) THEN 'yes'::text
                    WHEN ((aggregated_flows.indicator_type = 'Qual'::text) AND (NOT bool_and(aggregated_flows.bool_and))) THEN 'no'::text
                    ELSE (sum(aggregated_flows.sum))::text
                END AS total
           FROM aggregated_flows
          WHERE (aggregated_flows.node_type = 'STATE'::text)
          GROUP BY aggregated_flows.context_id, aggregated_flows.exporter_node_id, aggregated_flows.exporter_node, aggregated_flows.importer_node_id, aggregated_flows.importer_node, aggregated_flows.country_node_id, aggregated_flows.country_node, aggregated_flows.year, aggregated_flows.indicator_type, aggregated_flows.indicator_id, aggregated_flows.indicator_with_unit
        UNION ALL
         SELECT aggregated_flows.context_id,
            aggregated_flows.node_type,
            aggregated_flows.node,
            aggregated_flows.node_id,
            aggregated_flows.geo_id,
            aggregated_flows.exporter_node_id,
            aggregated_flows.exporter_node,
            aggregated_flows.importer_node_id,
            aggregated_flows.importer_node,
            aggregated_flows.country_node_id,
            aggregated_flows.country_node,
            aggregated_flows.year,
            aggregated_flows.indicator_type,
            aggregated_flows.indicator_id,
            aggregated_flows.indicator_with_unit,
                CASE
                    WHEN ((aggregated_flows.indicator_type = 'Qual'::text) AND aggregated_flows.bool_and) THEN 'yes'::text
                    WHEN ((aggregated_flows.indicator_type = 'Qual'::text) AND (NOT aggregated_flows.bool_and)) THEN 'no'::text
                    ELSE (aggregated_flows.sum)::text
                END AS total
           FROM aggregated_flows
        )
 SELECT with_totals.context_id,
    with_totals.node_type,
    with_totals.node,
    with_totals.node_id,
    with_totals.geo_id,
    with_totals.exporter_node_id,
    with_totals.exporter_node,
    with_totals.importer_node_id,
    with_totals.importer_node,
    with_totals.country_node_id,
    with_totals.country_node,
    with_totals.year,
    with_totals.indicator_type,
    with_totals.indicator_id,
    with_totals.indicator_with_unit,
    with_totals.total
   FROM with_totals
  ORDER BY
        CASE
            WHEN (with_totals.node_type IS NULL) THEN 1
            WHEN (with_totals.node_type = 'STATE'::text) THEN 2
            WHEN (with_totals.node_type = 'BIOME'::text) THEN 3
            ELSE 4
        END, with_totals.node, with_totals.exporter_node, with_totals.importer_node, with_totals.country_node, with_totals.indicator_with_unit
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
-- Name: index_flow_indicators_on_flow_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_flow_indicators_on_flow_id ON flow_indicators USING btree (flow_id);


--
-- Name: index_flow_inds_on_ind_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_flow_inds_on_ind_id ON flow_inds USING btree (ind_id);


--
-- Name: index_flow_quals_on_qual_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_flow_quals_on_qual_id ON flow_quals USING btree (qual_id);


--
-- Name: index_flow_quants_on_quant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_flow_quants_on_quant_id ON flow_quants USING btree (quant_id);


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
-- Name: index_materialized_flows_on_indicator_type_and_indicator_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_materialized_flows_on_indicator_type_and_indicator_id ON materialized_flows USING btree (indicator_type, indicator_id);


--
-- Name: index_node_flows_on_node_type_and_flow_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_node_flows_on_node_type_and_flow_id ON node_flows USING btree (node_type, flow_id);


--
-- Name: index_nodes_on_node_type_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_nodes_on_node_type_id ON nodes USING btree (node_type_id);


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
('20170308111306'),
('20170314095630'),
('20170314113737'),
('20170314115226'),
('20170314115306'),
('20170316135218');


