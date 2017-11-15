--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.5
-- Dumped by pg_dump version 9.6.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: revamp; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA revamp;


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


--
-- Name: add_soy_(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION add_soy_() RETURNS integer
    LANGUAGE plpgsql
    AS $$
    DECLARE
      trader_id INTEGER;
    BEGIN
      DELETE FROM node_quants WHERE quant_id = 1;
      FOR trader_id IN SELECT DISTINCT path[6] FROM flows WHERE context_id = 1 UNION SELECT DISTINCT path[7] FROM flows WHERE context_id = 1 LOOP
        FOR year_ IN 2010..2015 LOOP
  INSERT INTO node_quants (node_id, quant_id, value, year) VALUES (trader_id, 1, get_trader_sum(trader_id, year_), year_);
END LOOP;
      END LOOP;
      UPDATE node_quants SET value = 0.0 WHERE quant_id = 1 AND value IS NULL;
      RETURN 1;
    END;
  $$;


--
-- Name: fix_zd(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION fix_zd() RETURNS integer
    LANGUAGE plpgsql
    AS $$
    DECLARE trader_id INTEGER;
    BEGIN
      DELETE FROM node_quals WHERE qual_id = 1;
      FOR trader_id IN SELECT DISTINCT path[6] FROM flows WHERE context_id = 1 UNION SELECT DISTINCT path[7] FROM flows WHERE context_id = 1 LOOP
        INSERT INTO node_quals (node_id, qual_id, value) VALUES (trader_id, 1, 'NO');
      END LOOP;
      UPDATE node_quals SET value = 'YES' WHERE qual_id = 1 AND node_id IN (SELECT node_id FROM nodes WHERE name = ANY('{"ADM","AGREX INC","ALGAR AGRO","AMAGGI","BALDO","BUNGE","CARGILL","CGG TRADING","CHS","COAMO","COFCO","CUTRALE","BTG PACTUAL COMMODITIES","BTG PACTUAL COMMODITIES","FIAGRIL","GAVILON","GLENCORE","IMCOPA IMPORTACAO EXPORTACAO E INDUSTRIA DE OLEOS LTDA","LOUIS DREYFUS","MARUBENI","MULTIGRAIN S.A.","NIDERA","NOVAAGRI INFRA-ESTRUTURA DE ARMAZENAGEM E ESCOAMENTO AGRICOLA S.A.","OLAM INTERNATIONAL","OLEOS MENU","TOYOTA TSUSHO CORPORATION","SEARA","SELECTA","SODRUGESTVO PARAGUAY S A","ALIANCA AGRICOLA DO CERRADO S.A","SODRUGESTVO PARAGUAY S A","BTG PACTUAL COMMODITIES"}'));
      RETURN 1;
    END;
  $$;


--
-- Name: get_trader_sum(integer, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION get_trader_sum(trader_id integer, year_ integer) RETURNS double precision
    LANGUAGE sql
    AS $$
    SELECT sum(value)
    FROM flow_quants
    WHERE quant_id IN (
      SELECT quant_id
      FROM quants
      WHERE name = 'Volume')
        AND flow_id IN (
          SELECT flow_id
          FROM flows
          WHERE trader_id = ANY(path)
            AND year = year_
            AND context_id = 1); 
  $$;


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
    default_year integer,
    default_context_layers character varying[],
    default_basemap character varying
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
    "position" integer NOT NULL,
    name_in_download text
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
    is_default boolean DEFAULT false,
    color_scale character varying,
    years integer[],
    aggregate_method character varying,
    enabled boolean DEFAULT true NOT NULL
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
    node_type_id integer,
    profile_type character varying
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
    divisor double precision,
    tooltip_text text
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
    "position" integer,
    tooltip_text text
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
-- Name: download_versions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE download_versions (
    id integer NOT NULL,
    symbol character varying NOT NULL,
    current boolean DEFAULT false,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    context_id integer
);


--
-- Name: download_versions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE download_versions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: download_versions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE download_versions_id_seq OWNED BY download_versions.id;


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
    q.name AS name_with_unit,
    ci.name_in_download,
    ci.context_id
   FROM ((flow_quals f
     JOIN quals q ON ((f.qual_id = q.qual_id)))
     JOIN context_indicators ci ON (((ci.indicator_attribute_type = 'Qual'::attribute_type) AND (ci.indicator_attribute_id = q.qual_id))))
  GROUP BY f.flow_id, f.qual_id, f.value, q.name, ci.name_in_download, ci.context_id
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
        END AS name_with_unit,
    ci.name_in_download,
    ci.context_id
   FROM ((flow_inds f
     JOIN inds i ON ((f.ind_id = i.ind_id)))
     JOIN context_indicators ci ON (((ci.indicator_attribute_type = 'Ind'::attribute_type) AND (ci.indicator_attribute_id = i.ind_id))))
  GROUP BY f.flow_id, f.ind_id, f.value, i.name, i.unit, ci.name_in_download, ci.context_id
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
        END AS name_with_unit,
    ci.name_in_download,
    ci.context_id
   FROM ((flow_quants f
     JOIN quants q ON ((f.quant_id = q.quant_id)))
     JOIN context_indicators ci ON (((ci.indicator_attribute_type = 'Quant'::attribute_type) AND (ci.indicator_attribute_id = q.quant_id))))
  GROUP BY f.flow_id, f.quant_id, f.value, q.name, q.unit, ci.name_in_download, ci.context_id
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
    node_type text,
    is_geo_column boolean
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
            WHEN (cn.node_type = ANY (ARRAY['COUNTRY OF PRODUCTION'::text, 'BIOME'::text, 'LOGISTICS HUB'::text, 'STATE'::text])) THEN upper(n.name)
            ELSE initcap(n.name)
        END AS name,
    cn.node_type,
    cn.column_group,
    cn.column_position,
    cn.is_default,
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
     JOIN ( SELECT context_nodes.context_id,
            context_nodes.column_group,
            context_nodes.column_position,
            context_nodes.is_default,
            context_nodes.node_type_id,
            node_types.node_type
           FROM (context_nodes
             JOIN node_types ON ((node_types.node_type_id = context_nodes.node_type_id)))) cn ON (((f."position" = (cn.column_position + 1)) AND (f.context_id = cn.context_id))))
     JOIN nodes n ON ((n.node_id = f.node_id)))
  WITH NO DATA;


--
-- Name: materialized_flows; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW materialized_flows AS
 SELECT f_0.flow_id,
    f_0.context_id,
    f_0.year,
    f_0.name AS name_0,
    f_1.name AS name_1,
    f_2.name AS name_2,
    f_3.name AS name_3,
    f_4.name AS name_4,
    f_5.name AS name_5,
    f_6.name AS name_6,
    f_7.name AS name_7,
    f_0.node_id AS node_id_0,
    f_1.node_id AS node_id_1,
    f_2.node_id AS node_id_2,
    f_3.node_id AS node_id_3,
    f_4.node_id AS node_id_4,
    f_5.node_id AS node_id_5,
    f_6.node_id AS node_id_6,
    f_7.node_id AS node_id_7,
        CASE
            WHEN (f_5.node_type = 'EXPORTER'::text) THEN f_5.node_id
            WHEN (f_2.node_type = 'EXPORTER'::text) THEN f_2.node_id
            WHEN (f_2.node_type = 'TRADER'::text) THEN f_2.node_id
            WHEN (f_1.node_type = 'EXPORTER'::text) THEN f_1.node_id
            ELSE NULL::integer
        END AS exporter_node_id,
        CASE
            WHEN (f_6.node_type = 'IMPORTER'::text) THEN f_6.node_id
            WHEN (f_3.node_type = 'IMPORTER'::text) THEN f_3.node_id
            WHEN (f_2.node_type = 'IMPORTER'::text) THEN f_2.node_id
            ELSE NULL::integer
        END AS importer_node_id,
        CASE
            WHEN (f_7.node_type = 'COUNTRY'::text) THEN f_7.node_id
            WHEN (f_4.node_type = 'COUNTRY'::text) THEN f_4.node_id
            WHEN (f_3.node_type = 'COUNTRY'::text) THEN f_3.node_id
            ELSE NULL::integer
        END AS country_node_id,
    fi.indicator_type,
    fi.indicator_id,
    fi.name AS indicator,
    fi.name_with_unit AS indicator_with_unit,
    fi.name_in_download,
    bool_and(fi.boolean_value) AS bool_and,
    sum(fi.numeric_value) AS sum,
        CASE
            WHEN ((fi.indicator_type = 'Qual'::text) AND bool_and(fi.boolean_value)) THEN 'yes'::text
            WHEN ((fi.indicator_type = 'Qual'::text) AND (NOT bool_and(fi.boolean_value))) THEN 'no'::text
            ELSE (sum(fi.numeric_value))::text
        END AS total
   FROM ((((((((node_flows f_0
     JOIN node_flows f_1 ON (((f_1.flow_id = f_0.flow_id) AND (f_1.column_position = 1))))
     JOIN node_flows f_2 ON (((f_2.flow_id = f_0.flow_id) AND (f_2.column_position = 2))))
     JOIN node_flows f_3 ON (((f_3.flow_id = f_0.flow_id) AND (f_3.column_position = 3))))
     LEFT JOIN node_flows f_4 ON (((f_4.flow_id = f_0.flow_id) AND (f_4.column_position = 4))))
     LEFT JOIN node_flows f_5 ON (((f_5.flow_id = f_0.flow_id) AND (f_5.column_position = 5))))
     LEFT JOIN node_flows f_6 ON (((f_6.flow_id = f_0.flow_id) AND (f_6.column_position = 6))))
     LEFT JOIN node_flows f_7 ON (((f_7.flow_id = f_0.flow_id) AND (f_7.column_position = 7))))
     JOIN flow_indicators fi ON (((f_0.flow_id = fi.flow_id) AND (f_0.context_id = fi.context_id))))
  WHERE (f_0.column_position = 0)
  GROUP BY f_0.flow_id, f_0.context_id, f_0.year, f_0.name, f_0.node_id, f_1.name, f_1.node_id, f_1.node_type, f_2.name, f_2.node_id, f_2.node_type, f_3.name, f_3.node_id, f_3.node_type, f_4.name, f_4.node_id, f_4.node_type, f_5.name, f_5.node_id, f_5.node_type, f_6.name, f_6.node_id, f_6.node_type, f_7.name, f_7.node_id, f_7.node_type, fi.indicator_type, fi.indicator_id, fi.name, fi.name_with_unit, fi.name_in_download
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


SET search_path = revamp, pg_catalog;

--
-- Name: ind_properties; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE ind_properties (
    id integer NOT NULL,
    ind_id integer NOT NULL,
    display_name text NOT NULL,
    unit_type text,
    tooltip_text text,
    is_visible_on_place_profile boolean DEFAULT false NOT NULL,
    is_visible_on_actor_profile boolean DEFAULT false NOT NULL,
    is_temporal_on_place_profile boolean DEFAULT false NOT NULL,
    is_temporal_on_actor_profile boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    CONSTRAINT ind_properties_unit_type_check CHECK ((unit_type = ANY (ARRAY['currency'::text, 'ratio'::text, 'score'::text, 'unitless'::text])))
);


--
-- Name: COLUMN ind_properties.display_name; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN ind_properties.display_name IS 'Name of attribute for display';


--
-- Name: COLUMN ind_properties.unit_type; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN ind_properties.unit_type IS 'Type of unit, e.g. score. One of restricted set of values.';


--
-- Name: COLUMN ind_properties.tooltip_text; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN ind_properties.tooltip_text IS 'Tooltip text';


--
-- Name: COLUMN ind_properties.is_visible_on_place_profile; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN ind_properties.is_visible_on_place_profile IS 'Whether to display this attribute on place profile';


--
-- Name: COLUMN ind_properties.is_visible_on_actor_profile; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN ind_properties.is_visible_on_actor_profile IS 'Whether to display this attribute on actor profile';


--
-- Name: inds; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE inds (
    id integer NOT NULL,
    name text NOT NULL,
    unit text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE inds; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE inds IS 'Attributes classified as inds';


--
-- Name: COLUMN inds.name; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN inds.name IS 'Attribute short name, e.g. FOREST_500; those literals are referred to in code, therefore should not be changed without notice';


--
-- Name: COLUMN inds.unit; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN inds.unit IS 'Unit in which values for this attribute are given';


--
-- Name: qual_properties; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE qual_properties (
    id integer NOT NULL,
    qual_id integer NOT NULL,
    display_name text NOT NULL,
    tooltip_text text,
    is_visible_on_place_profile boolean DEFAULT false NOT NULL,
    is_visible_on_actor_profile boolean DEFAULT false NOT NULL,
    is_temporal_on_place_profile boolean DEFAULT false NOT NULL,
    is_temporal_on_actor_profile boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: COLUMN qual_properties.display_name; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN qual_properties.display_name IS 'Name of attribute for display';


--
-- Name: COLUMN qual_properties.tooltip_text; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN qual_properties.tooltip_text IS 'Tooltip text';


--
-- Name: COLUMN qual_properties.is_visible_on_place_profile; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN qual_properties.is_visible_on_place_profile IS 'Whether to display this attribute on place profile';


--
-- Name: COLUMN qual_properties.is_visible_on_actor_profile; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN qual_properties.is_visible_on_actor_profile IS 'Whether to display this attribute on actor profile';


--
-- Name: quals; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE quals (
    id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE quals; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE quals IS 'Attributes classified as quals';


--
-- Name: COLUMN quals.name; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN quals.name IS 'Attribute short name, e.g. ZERO_DEFORESTATION; those literals are referred to in code, therefore should not be changed without notice';


--
-- Name: quant_properties; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE quant_properties (
    id integer NOT NULL,
    quant_id integer NOT NULL,
    display_name text NOT NULL,
    unit_type text,
    tooltip_text text,
    is_visible_on_place_profile boolean DEFAULT false NOT NULL,
    is_visible_on_actor_profile boolean DEFAULT false NOT NULL,
    is_temporal_on_place_profile boolean DEFAULT false NOT NULL,
    is_temporal_on_actor_profile boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    CONSTRAINT quant_properties_unit_type_check CHECK ((unit_type = ANY (ARRAY['currency'::text, 'area'::text, 'count'::text, 'volume'::text, 'unitless'::text])))
);


--
-- Name: COLUMN quant_properties.display_name; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN quant_properties.display_name IS 'Name of attribute for display';


--
-- Name: COLUMN quant_properties.unit_type; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN quant_properties.unit_type IS 'Type of unit, e.g. score. One of restricted set of values.';


--
-- Name: COLUMN quant_properties.tooltip_text; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN quant_properties.tooltip_text IS 'Tooltip text';


--
-- Name: COLUMN quant_properties.is_visible_on_place_profile; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN quant_properties.is_visible_on_place_profile IS 'Whether to display this attribute on place profile';


--
-- Name: COLUMN quant_properties.is_visible_on_actor_profile; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN quant_properties.is_visible_on_actor_profile IS 'Whether to display this attribute on actor profile';


--
-- Name: quants; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE quants (
    id integer NOT NULL,
    name text NOT NULL,
    unit text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE quants; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE quants IS 'Attributes classified as quants';


--
-- Name: COLUMN quants.name; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN quants.name IS 'Attribute short name, e.g. FOB; those literals are referred to in code, therefore should not be changed without notice';


--
-- Name: COLUMN quants.unit; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN quants.unit IS 'Unit in which values for this attribute are given';


--
-- Name: attributes_mv; Type: MATERIALIZED VIEW; Schema: revamp; Owner: -
--

CREATE MATERIALIZED VIEW attributes_mv AS
 SELECT row_number() OVER () AS id,
    s.original_type,
    s.original_id,
    s.name,
    s.display_name,
    s.unit,
    s.unit_type,
    s.tooltip_text,
    s.is_visible_on_actor_profile,
    s.is_visible_on_place_profile,
    s.is_temporal_on_actor_profile,
    s.is_temporal_on_place_profile,
    s.aggregate_method
   FROM ( SELECT 'Quant'::text AS original_type,
            quants.id AS original_id,
            quants.name,
            qp.display_name,
            quants.unit,
            qp.unit_type,
            qp.tooltip_text,
            qp.is_visible_on_actor_profile,
            qp.is_visible_on_place_profile,
            qp.is_temporal_on_actor_profile,
            qp.is_temporal_on_place_profile,
            'SUM'::text AS aggregate_method
           FROM (quants
             LEFT JOIN quant_properties qp ON ((qp.quant_id = quants.id)))
        UNION ALL
         SELECT 'Ind'::text,
            inds.id,
            inds.name,
            ip.display_name,
            inds.unit,
            ip.unit_type,
            ip.tooltip_text,
            ip.is_visible_on_actor_profile,
            ip.is_visible_on_place_profile,
            ip.is_temporal_on_actor_profile,
            ip.is_temporal_on_place_profile,
            'AVG'::text
           FROM (inds
             LEFT JOIN ind_properties ip ON ((ip.ind_id = inds.id)))
        UNION ALL
         SELECT 'Qual'::text,
            quals.id,
            quals.name,
            qp.display_name,
            NULL::text,
            NULL::text,
            qp.tooltip_text,
            qp.is_visible_on_actor_profile,
            qp.is_visible_on_place_profile,
            qp.is_temporal_on_actor_profile,
            qp.is_temporal_on_place_profile,
            NULL::text
           FROM (quals
             LEFT JOIN qual_properties qp ON ((qp.qual_id = quals.id)))) s
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW attributes_mv; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON MATERIALIZED VIEW attributes_mv IS 'Materialized view which merges inds, quals and quants.';


--
-- Name: COLUMN attributes_mv.id; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN attributes_mv.id IS 'The unique id is a sequential number which is generated at REFRESH and therefore not fixed.';


--
-- Name: COLUMN attributes_mv.original_type; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN attributes_mv.original_type IS 'Type of the original entity (Ind / Qual / Quant)';


--
-- Name: COLUMN attributes_mv.original_id; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN attributes_mv.original_id IS 'Id from the original table (inds / quals / quants)';


--
-- Name: carto_layers; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE carto_layers (
    id integer NOT NULL,
    contextual_layer_id integer NOT NULL,
    identifier text NOT NULL,
    years integer[],
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE carto_layers; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE carto_layers IS 'Year-specific data layers defined in CartoDB used to display contextual layers.';


--
-- Name: COLUMN carto_layers.identifier; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN carto_layers.identifier IS 'Identifier of the CartoDB named map, e.g. brazil_biomes; unique in scope of contextual layer';


--
-- Name: COLUMN carto_layers.years; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN carto_layers.years IS 'Array of years for which to show this carto layer in scope of contextual layer; NULL for all years';


--
-- Name: carto_layers_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE carto_layers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: carto_layers_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE carto_layers_id_seq OWNED BY carto_layers.id;


--
-- Name: chart_attributes; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE chart_attributes (
    id integer NOT NULL,
    chart_id integer NOT NULL,
    "position" integer,
    years integer[],
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE chart_attributes; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE chart_attributes IS 'Attributes (inds/quals/quants) to display in a chart.';


--
-- Name: COLUMN chart_attributes.chart_id; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN chart_attributes.chart_id IS 'Refence to chart';


--
-- Name: COLUMN chart_attributes."position"; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN chart_attributes."position" IS 'Display order in scope of chart';


--
-- Name: COLUMN chart_attributes.years; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN chart_attributes.years IS 'Array of years for which to show this attribute in scope of chart; NULL for all years';


--
-- Name: chart_attributes_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE chart_attributes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chart_attributes_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE chart_attributes_id_seq OWNED BY chart_attributes.id;


--
-- Name: chart_inds; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE chart_inds (
    id integer NOT NULL,
    chart_attribute_id integer NOT NULL,
    ind_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE chart_inds; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE chart_inds IS 'Inds to display in a chart (see chart_attributes.)';


--
-- Name: chart_inds_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE chart_inds_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chart_inds_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE chart_inds_id_seq OWNED BY chart_inds.id;


--
-- Name: chart_quals; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE chart_quals (
    id integer NOT NULL,
    chart_attribute_id integer NOT NULL,
    qual_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE chart_quals; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE chart_quals IS 'Quals to display in a chart (see chart_attributes.)';


--
-- Name: chart_quals_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE chart_quals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chart_quals_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE chart_quals_id_seq OWNED BY chart_quals.id;


--
-- Name: chart_quants; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE chart_quants (
    id integer NOT NULL,
    chart_attribute_id integer NOT NULL,
    quant_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE chart_quants; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE chart_quants IS 'Quants to display in a chart (see chart_attributes.)';


--
-- Name: chart_quants_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE chart_quants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chart_quants_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE chart_quants_id_seq OWNED BY chart_quants.id;


--
-- Name: charts; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE charts (
    id integer NOT NULL,
    profile_id integer NOT NULL,
    parent_id integer,
    identifier text NOT NULL,
    title text NOT NULL,
    "position" integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE charts; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE charts IS 'Charts on profile pages.';


--
-- Name: COLUMN charts.parent_id; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN charts.parent_id IS 'Self-reference to parent used to define complex charts, e.g. table with values in tabs';


--
-- Name: COLUMN charts.identifier; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN charts.identifier IS 'Identifier used to map this chart to a part of code which contains calculation logic';


--
-- Name: COLUMN charts.title; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN charts.title IS 'Title of chart for display';


--
-- Name: COLUMN charts."position"; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN charts."position" IS 'Display order in scope of profile';


--
-- Name: charts_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE charts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: charts_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE charts_id_seq OWNED BY charts.id;


--
-- Name: commodities; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE commodities (
    id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE commodities; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE commodities IS 'Commodities in supply chains, such as soy or beef';


--
-- Name: COLUMN commodities.name; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN commodities.name IS 'Commodity name; unique across commodities';


--
-- Name: commodities_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE commodities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: commodities_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE commodities_id_seq OWNED BY commodities.id;


--
-- Name: context_node_types; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE context_node_types (
    id integer NOT NULL,
    context_id integer NOT NULL,
    node_type_id integer NOT NULL,
    column_group integer NOT NULL,
    column_position integer NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    is_geo_column boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE context_node_types; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE context_node_types IS 'Node types represented in supply chains per context. The value of column_position is interpreted as position in flows.path.';


--
-- Name: COLUMN context_node_types.column_group; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN context_node_types.column_group IS 'Number of sankey column in which to display nodes of this type';


--
-- Name: COLUMN context_node_types.column_position; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN context_node_types.column_position IS 'Index of node of this type in flows.path';


--
-- Name: COLUMN context_node_types.is_default; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN context_node_types.is_default IS 'When set, show this node type as default (only use for one)';


--
-- Name: COLUMN context_node_types.is_geo_column; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN context_node_types.is_geo_column IS 'When set, show nodes on map';


--
-- Name: context_node_types_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE context_node_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: context_node_types_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE context_node_types_id_seq OWNED BY context_node_types.id;


--
-- Name: context_properties; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE context_properties (
    id integer NOT NULL,
    context_id integer NOT NULL,
    years integer[],
    default_year integer,
    default_basemap text,
    is_disabled boolean DEFAULT false NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE context_properties; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE context_properties IS 'Visualisation properties of a context (one row per context)';


--
-- Name: COLUMN context_properties.years; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN context_properties.years IS 'Years for which country-commodity data is present; NULL for all years';


--
-- Name: COLUMN context_properties.default_year; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN context_properties.default_year IS 'Default year for this context';


--
-- Name: COLUMN context_properties.default_basemap; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN context_properties.default_basemap IS 'Default basemap for this context, e.g. satellite';


--
-- Name: COLUMN context_properties.is_disabled; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN context_properties.is_disabled IS 'When set, do not show this context';


--
-- Name: COLUMN context_properties.is_default; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN context_properties.is_default IS 'When set, show this context as default (only use for one)';


--
-- Name: context_properties_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE context_properties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: context_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE context_properties_id_seq OWNED BY context_properties.id;


--
-- Name: contexts; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE contexts (
    id integer NOT NULL,
    country_id integer NOT NULL,
    commodity_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE contexts; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE contexts IS 'Country-commodity combinations.';


--
-- Name: contexts_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE contexts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contexts_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE contexts_id_seq OWNED BY contexts.id;


--
-- Name: contextual_layers; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE contextual_layers (
    id integer NOT NULL,
    context_id integer NOT NULL,
    title text NOT NULL,
    identifier text NOT NULL,
    "position" integer NOT NULL,
    tooltip_text text,
    is_default boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE contextual_layers; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE contextual_layers IS 'Additional layers shown on map coming from CartoDB';


--
-- Name: COLUMN contextual_layers.title; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN contextual_layers.title IS 'Title of layer for display';


--
-- Name: COLUMN contextual_layers.identifier; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN contextual_layers.identifier IS 'Identifier of layer, e.g. brazil_biomes';


--
-- Name: COLUMN contextual_layers."position"; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN contextual_layers."position" IS 'Display order in scope of context';


--
-- Name: COLUMN contextual_layers.tooltip_text; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN contextual_layers.tooltip_text IS 'Tooltip text';


--
-- Name: COLUMN contextual_layers.is_default; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN contextual_layers.is_default IS 'When set, show this layer by default';


--
-- Name: contextual_layers_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE contextual_layers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contextual_layers_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE contextual_layers_id_seq OWNED BY contextual_layers.id;


--
-- Name: countries; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE countries (
    id integer NOT NULL,
    name text NOT NULL,
    iso2 text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE countries; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE countries IS 'Countries (source)';


--
-- Name: COLUMN countries.name; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN countries.name IS 'Country name';


--
-- Name: COLUMN countries.iso2; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN countries.iso2 IS '2-letter ISO code';


--
-- Name: countries_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE countries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: countries_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE countries_id_seq OWNED BY countries.id;


--
-- Name: country_properties; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE country_properties (
    id integer NOT NULL,
    country_id integer NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    zoom integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: COLUMN country_properties.latitude; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN country_properties.latitude IS 'TODO';


--
-- Name: COLUMN country_properties.longitude; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN country_properties.longitude IS 'TODO';


--
-- Name: COLUMN country_properties.zoom; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN country_properties.zoom IS 'TODO';


--
-- Name: country_properties_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE country_properties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: country_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE country_properties_id_seq OWNED BY country_properties.id;


--
-- Name: download_attributes; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE download_attributes (
    id integer NOT NULL,
    context_id integer NOT NULL,
    "position" integer NOT NULL,
    display_name text NOT NULL,
    years integer[],
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE download_attributes; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE download_attributes IS 'Attributes (quals/quants) available for download.';


--
-- Name: COLUMN download_attributes."position"; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN download_attributes."position" IS 'Display order in scope of context';


--
-- Name: COLUMN download_attributes.display_name; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN download_attributes.display_name IS 'Name of attribute for display';


--
-- Name: COLUMN download_attributes.years; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN download_attributes.years IS 'Years for which attribute is present; NULL for all years';


--
-- Name: download_attributes_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE download_attributes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: download_attributes_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE download_attributes_id_seq OWNED BY download_attributes.id;


--
-- Name: download_quals; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE download_quals (
    id integer NOT NULL,
    download_attribute_id integer NOT NULL,
    qual_id integer NOT NULL,
    is_filter_enabled boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE download_quals; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE download_quals IS 'Quals to include in downloads (see download_attributes.)';


--
-- Name: COLUMN download_quals.is_filter_enabled; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN download_quals.is_filter_enabled IS 'When set, enable selection of discreet values (advanced filter)';


--
-- Name: download_quants; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE download_quants (
    id integer NOT NULL,
    download_attribute_id integer NOT NULL,
    quant_id integer NOT NULL,
    is_filter_enabled boolean DEFAULT false NOT NULL,
    filter_bands double precision[],
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE download_quants; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE download_quants IS 'Quants to include in downloads (see download_attributes.)';


--
-- Name: COLUMN download_quants.is_filter_enabled; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN download_quants.is_filter_enabled IS 'When set, enable selection of value ranges (advanced filter)';


--
-- Name: COLUMN download_quants.filter_bands; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN download_quants.filter_bands IS 'Array of value ranges to allow filtering by';


--
-- Name: download_attributes_mv; Type: MATERIALIZED VIEW; Schema: revamp; Owner: -
--

CREATE MATERIALIZED VIEW download_attributes_mv AS
 SELECT da.id,
    da.context_id,
    da."position",
    da.display_name,
    da.years,
    da.created_at,
    da.updated_at,
    a.id AS attribute_id
   FROM ((download_quants daq
     JOIN download_attributes da ON ((da.id = daq.download_attribute_id)))
     JOIN attributes_mv a ON (((a.original_id = daq.quant_id) AND (a.original_type = 'Quant'::text))))
UNION ALL
 SELECT da.id,
    da.context_id,
    da."position",
    da.display_name,
    da.years,
    da.created_at,
    da.updated_at,
    a.id AS attribute_id
   FROM ((download_quals daq
     JOIN download_attributes da ON ((da.id = daq.download_attribute_id)))
     JOIN attributes_mv a ON (((a.original_id = daq.qual_id) AND (a.original_type = 'Qual'::text))))
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW download_attributes_mv; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON MATERIALIZED VIEW download_attributes_mv IS 'Materialized view which merges download_quals and download_quants with download_attributes.';


--
-- Name: COLUMN download_attributes_mv.attribute_id; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN download_attributes_mv.attribute_id IS 'References the unique id in attributes_mv.';


--
-- Name: download_quals_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE download_quals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: download_quals_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE download_quals_id_seq OWNED BY download_quals.id;


--
-- Name: download_quants_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE download_quants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: download_quants_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE download_quants_id_seq OWNED BY download_quants.id;


--
-- Name: download_versions; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE download_versions (
    id integer NOT NULL,
    context_id integer NOT NULL,
    symbol character varying NOT NULL,
    is_current boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE download_versions; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE download_versions IS 'Versions of data downloads';


--
-- Name: COLUMN download_versions.symbol; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN download_versions.symbol IS 'Version symbol (included in downloaded file name)';


--
-- Name: COLUMN download_versions.is_current; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN download_versions.is_current IS 'When set, use this version symbol for new downloads (only use for one)';


--
-- Name: download_versions_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE download_versions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: download_versions_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE download_versions_id_seq OWNED BY download_versions.id;


--
-- Name: flow_inds; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE flow_inds (
    id integer NOT NULL,
    flow_id integer NOT NULL,
    ind_id integer NOT NULL,
    value double precision NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE flow_inds; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE flow_inds IS 'Values of inds for flow';


--
-- Name: COLUMN flow_inds.value; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN flow_inds.value IS 'Numeric value';


--
-- Name: flow_inds_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE flow_inds_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: flow_inds_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE flow_inds_id_seq OWNED BY flow_inds.id;


--
-- Name: flow_quals; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE flow_quals (
    id integer NOT NULL,
    flow_id integer NOT NULL,
    qual_id integer NOT NULL,
    value text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE flow_quals; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE flow_quals IS 'Values of quals for flow';


--
-- Name: COLUMN flow_quals.value; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN flow_quals.value IS 'Textual value';


--
-- Name: flow_quals_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE flow_quals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: flow_quals_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE flow_quals_id_seq OWNED BY flow_quals.id;


--
-- Name: flow_quants; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE flow_quants (
    id integer NOT NULL,
    flow_id integer NOT NULL,
    quant_id integer NOT NULL,
    value double precision NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE flow_quants; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE flow_quants IS 'Values of quants for flow';


--
-- Name: COLUMN flow_quants.value; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN flow_quants.value IS 'Numeric value';


--
-- Name: flow_quants_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE flow_quants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: flow_quants_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE flow_quants_id_seq OWNED BY flow_quants.id;


--
-- Name: flows; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE flows (
    id integer NOT NULL,
    context_id integer NOT NULL,
    year smallint NOT NULL,
    path integer[] DEFAULT '{}'::integer[],
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE flows; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE flows IS 'Flows of commodities through nodes';


--
-- Name: COLUMN flows.year; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN flows.year IS 'Year';


--
-- Name: COLUMN flows.path; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN flows.path IS 'Array of node ids which constitute the supply chain, where position of node in this array is linked to the value of column_position in context_node_types';


--
-- Name: flows_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE flows_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: flows_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE flows_id_seq OWNED BY flows.id;


--
-- Name: ind_properties_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE ind_properties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ind_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE ind_properties_id_seq OWNED BY ind_properties.id;


--
-- Name: inds_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE inds_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: inds_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE inds_id_seq OWNED BY inds.id;


--
-- Name: map_attribute_groups; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE map_attribute_groups (
    id integer NOT NULL,
    context_id integer NOT NULL,
    name text NOT NULL,
    "position" integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE map_attribute_groups; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE map_attribute_groups IS 'Groups attributes (inds/quals/quants) to display on map';


--
-- Name: COLUMN map_attribute_groups.name; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN map_attribute_groups.name IS 'Name for display';


--
-- Name: COLUMN map_attribute_groups."position"; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN map_attribute_groups."position" IS 'Display order in scope of context';


--
-- Name: map_attribute_groups_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE map_attribute_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: map_attribute_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE map_attribute_groups_id_seq OWNED BY map_attribute_groups.id;


--
-- Name: map_attributes; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE map_attributes (
    id integer NOT NULL,
    map_attribute_group_id integer NOT NULL,
    "position" integer NOT NULL,
    bucket_3 double precision[] DEFAULT '{}'::double precision[] NOT NULL,
    bucket_5 double precision[] DEFAULT '{}'::double precision[] NOT NULL,
    color_scale text,
    years integer[],
    is_disabled boolean DEFAULT false NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE map_attributes; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE map_attributes IS 'Attributes (inds/quants) to display on map';


--
-- Name: COLUMN map_attributes."position"; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN map_attributes."position" IS 'Display order in scope of group';


--
-- Name: COLUMN map_attributes.bucket_3; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN map_attributes.bucket_3 IS 'TODO';


--
-- Name: COLUMN map_attributes.bucket_5; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN map_attributes.bucket_5 IS 'TODO';


--
-- Name: COLUMN map_attributes.color_scale; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN map_attributes.color_scale IS 'TODO';


--
-- Name: COLUMN map_attributes.years; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN map_attributes.years IS 'Years for which attribute is present; NULL for all years';


--
-- Name: COLUMN map_attributes.is_disabled; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN map_attributes.is_disabled IS 'When set, do not show this attribute';


--
-- Name: COLUMN map_attributes.is_default; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN map_attributes.is_default IS 'When set, show this attribute by default';


--
-- Name: map_attributes_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE map_attributes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: map_attributes_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE map_attributes_id_seq OWNED BY map_attributes.id;


--
-- Name: map_inds; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE map_inds (
    id integer NOT NULL,
    map_attribute_id integer NOT NULL,
    ind_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE map_inds; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE map_inds IS 'Inds to display on map (see map_attributes.)';


--
-- Name: map_quants; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE map_quants (
    id integer NOT NULL,
    map_attribute_id integer NOT NULL,
    quant_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE map_quants; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE map_quants IS 'Quants to display on map (see map_attributes.)';


--
-- Name: map_attributes_mv; Type: MATERIALIZED VIEW; Schema: revamp; Owner: -
--

CREATE MATERIALIZED VIEW map_attributes_mv AS
 SELECT ma.id,
    ma.map_attribute_group_id,
    ma."position",
    ma.bucket_3,
    ma.bucket_5,
    ma.color_scale,
    ma.years,
    ma.is_disabled,
    ma.is_default,
    ma.created_at,
    ma.updated_at,
    a.id AS attribute_id
   FROM ((map_quants maq
     JOIN map_attributes ma ON ((ma.id = maq.map_attribute_id)))
     JOIN attributes_mv a ON (((a.original_id = maq.quant_id) AND (a.original_type = 'Quant'::text))))
UNION ALL
 SELECT ma.id,
    ma.map_attribute_group_id,
    ma."position",
    ma.bucket_3,
    ma.bucket_5,
    ma.color_scale,
    ma.years,
    ma.is_disabled,
    ma.is_default,
    ma.created_at,
    ma.updated_at,
    a.id AS attribute_id
   FROM ((map_inds mai
     JOIN map_attributes ma ON ((ma.id = mai.map_attribute_id)))
     JOIN attributes_mv a ON (((a.original_id = mai.ind_id) AND (a.original_type = 'Ind'::text))))
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW map_attributes_mv; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON MATERIALIZED VIEW map_attributes_mv IS 'Materialized view which merges map_inds and map_quants with map_attributes.';


--
-- Name: COLUMN map_attributes_mv.attribute_id; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN map_attributes_mv.attribute_id IS 'References the unique id in attributes_mv.';


--
-- Name: map_inds_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE map_inds_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: map_inds_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE map_inds_id_seq OWNED BY map_inds.id;


--
-- Name: map_quants_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE map_quants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: map_quants_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE map_quants_id_seq OWNED BY map_quants.id;


--
-- Name: node_inds; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE node_inds (
    id integer NOT NULL,
    node_id integer NOT NULL,
    ind_id integer NOT NULL,
    year integer,
    value double precision NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE node_inds; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE node_inds IS 'Values of inds for node';


--
-- Name: COLUMN node_inds.year; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN node_inds.year IS 'Year; NULL for all years';


--
-- Name: COLUMN node_inds.value; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN node_inds.value IS 'Numeric value';


--
-- Name: node_inds_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE node_inds_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: node_inds_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE node_inds_id_seq OWNED BY node_inds.id;


--
-- Name: node_quals; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE node_quals (
    id integer NOT NULL,
    node_id integer NOT NULL,
    qual_id integer NOT NULL,
    year integer,
    value text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE node_quals; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE node_quals IS 'Values of quals for node';


--
-- Name: COLUMN node_quals.year; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN node_quals.year IS 'Year; NULL for all years';


--
-- Name: COLUMN node_quals.value; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN node_quals.value IS 'Textual value';


--
-- Name: node_quals_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE node_quals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: node_quals_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE node_quals_id_seq OWNED BY node_quals.id;


--
-- Name: node_quants; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE node_quants (
    id integer NOT NULL,
    node_id integer NOT NULL,
    quant_id integer NOT NULL,
    year integer,
    value double precision NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE node_quants; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE node_quants IS 'Values of quants for node';


--
-- Name: COLUMN node_quants.year; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN node_quants.year IS 'Year; NULL for all years';


--
-- Name: COLUMN node_quants.value; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN node_quants.value IS 'Numeric value';


--
-- Name: node_quants_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE node_quants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: node_quants_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE node_quants_id_seq OWNED BY node_quants.id;


--
-- Name: node_types; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE node_types (
    id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE node_types; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE node_types IS 'List of types of nodes in the system, e.g. MUNICIPALITY or EXPORTER. Important: those literals are referred to in code, therefore should not be changed without notice.';


--
-- Name: COLUMN node_types.name; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN node_types.name IS 'Name of node type, spelt in capital letters; unique across node types';


--
-- Name: node_types_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE node_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: node_types_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE node_types_id_seq OWNED BY node_types.id;


--
-- Name: nodes; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE nodes (
    id integer NOT NULL,
    node_type_id integer NOT NULL,
    name text NOT NULL,
    geo_id text,
    is_domestic_consumption boolean DEFAULT false NOT NULL,
    is_unknown boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE nodes; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE nodes IS 'Nodes of different types, such as MUNICIPALITY or EXPORTER, which participate in supply chains';


--
-- Name: COLUMN nodes.name; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN nodes.name IS 'Name of node';


--
-- Name: COLUMN nodes.geo_id; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN nodes.geo_id IS '2-letter iso code in case of country nodes; other geo identifiers possible for other node types';


--
-- Name: COLUMN nodes.is_domestic_consumption; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN nodes.is_domestic_consumption IS 'When set, assume domestic trade';


--
-- Name: COLUMN nodes.is_unknown; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN nodes.is_unknown IS 'When set, node was not possible to identify';


--
-- Name: nodes_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE nodes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nodes_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE nodes_id_seq OWNED BY nodes.id;


--
-- Name: profiles; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE profiles (
    id integer NOT NULL,
    context_node_type_id integer NOT NULL,
    name text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    CONSTRAINT profiles_name_check CHECK ((name = ANY (ARRAY['actor'::text, 'place'::text])))
);


--
-- Name: TABLE profiles; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE profiles IS 'Context-specific profiles';


--
-- Name: COLUMN profiles.name; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN profiles.name IS 'Profile name, either actor or place. One of restricted set of values.';


--
-- Name: profiles_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE profiles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE profiles_id_seq OWNED BY profiles.id;


--
-- Name: qual_properties_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE qual_properties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: qual_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE qual_properties_id_seq OWNED BY qual_properties.id;


--
-- Name: quals_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE quals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: quals_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE quals_id_seq OWNED BY quals.id;


--
-- Name: quant_properties_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE quant_properties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: quant_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE quant_properties_id_seq OWNED BY quant_properties.id;


--
-- Name: quants_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE quants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: quants_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE quants_id_seq OWNED BY quants.id;


--
-- Name: recolor_by_attributes; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE recolor_by_attributes (
    id integer NOT NULL,
    context_id integer NOT NULL,
    group_number integer DEFAULT 1 NOT NULL,
    "position" integer NOT NULL,
    legend_type text NOT NULL,
    legend_color_theme text NOT NULL,
    interval_count integer,
    min_value text,
    max_value text,
    divisor double precision,
    tooltip_text text,
    years integer[],
    is_disabled boolean DEFAULT false NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE recolor_by_attributes; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE recolor_by_attributes IS 'Attributes (inds/quals) available for recoloring.';


--
-- Name: COLUMN recolor_by_attributes.group_number; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN recolor_by_attributes.group_number IS 'TODO';


--
-- Name: COLUMN recolor_by_attributes."position"; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN recolor_by_attributes."position" IS 'Display order in scope of context';


--
-- Name: COLUMN recolor_by_attributes.legend_type; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN recolor_by_attributes.legend_type IS 'TODO';


--
-- Name: COLUMN recolor_by_attributes.legend_color_theme; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN recolor_by_attributes.legend_color_theme IS 'TODO';


--
-- Name: COLUMN recolor_by_attributes.interval_count; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN recolor_by_attributes.interval_count IS 'TODO';


--
-- Name: COLUMN recolor_by_attributes.min_value; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN recolor_by_attributes.min_value IS 'TODO';


--
-- Name: COLUMN recolor_by_attributes.max_value; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN recolor_by_attributes.max_value IS 'TODO';


--
-- Name: COLUMN recolor_by_attributes.divisor; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN recolor_by_attributes.divisor IS 'TODO';


--
-- Name: COLUMN recolor_by_attributes.tooltip_text; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN recolor_by_attributes.tooltip_text IS 'Tooltip text';


--
-- Name: COLUMN recolor_by_attributes.years; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN recolor_by_attributes.years IS 'Array of years for which to show this attribute in scope of chart; NULL for all years';


--
-- Name: COLUMN recolor_by_attributes.is_disabled; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN recolor_by_attributes.is_disabled IS 'When set, do not show this attribute';


--
-- Name: COLUMN recolor_by_attributes.is_default; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN recolor_by_attributes.is_default IS 'When set, show this attribute by default';


--
-- Name: recolor_by_attributes_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE recolor_by_attributes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: recolor_by_attributes_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE recolor_by_attributes_id_seq OWNED BY recolor_by_attributes.id;


--
-- Name: recolor_by_inds; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE recolor_by_inds (
    id integer NOT NULL,
    recolor_by_attribute_id integer NOT NULL,
    ind_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE recolor_by_inds; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE recolor_by_inds IS 'Inds available for recoloring (see recolor_by_attributes.)';


--
-- Name: recolor_by_quals; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE recolor_by_quals (
    id integer NOT NULL,
    recolor_by_attribute_id integer NOT NULL,
    qual_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE recolor_by_quals; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE recolor_by_quals IS 'Quals available for recoloring (see recolor_by_attributes.)';


--
-- Name: recolor_by_attributes_mv; Type: MATERIALIZED VIEW; Schema: revamp; Owner: -
--

CREATE MATERIALIZED VIEW recolor_by_attributes_mv AS
 SELECT ra.id,
    ra.context_id,
    ra.group_number,
    ra."position",
    ra.legend_type,
    ra.legend_color_theme,
    ra.interval_count,
    ra.min_value,
    ra.max_value,
    ra.divisor,
    ra.tooltip_text,
    ra.years,
    ra.is_disabled,
    ra.is_default,
    ra.created_at,
    ra.updated_at,
    a.id AS attribute_id
   FROM ((recolor_by_inds rai
     JOIN recolor_by_attributes ra ON ((ra.id = rai.recolor_by_attribute_id)))
     JOIN attributes_mv a ON (((a.original_id = rai.ind_id) AND (a.original_type = 'Ind'::text))))
UNION ALL
 SELECT ra.id,
    ra.context_id,
    ra.group_number,
    ra."position",
    ra.legend_type,
    ra.legend_color_theme,
    ra.interval_count,
    ra.min_value,
    ra.max_value,
    ra.divisor,
    ra.tooltip_text,
    ra.years,
    ra.is_disabled,
    ra.is_default,
    ra.created_at,
    ra.updated_at,
    a.id AS attribute_id
   FROM ((recolor_by_quals raq
     JOIN recolor_by_attributes ra ON ((ra.id = raq.recolor_by_attribute_id)))
     JOIN attributes_mv a ON (((a.original_id = raq.qual_id) AND (a.original_type = 'Qual'::text))))
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW recolor_by_attributes_mv; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON MATERIALIZED VIEW recolor_by_attributes_mv IS 'Materialized view which merges recolor_by_inds and recolor_by_quals with recolor_by_attributes.';


--
-- Name: COLUMN recolor_by_attributes_mv.attribute_id; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN recolor_by_attributes_mv.attribute_id IS 'References the unique id in attributes_mv.';


--
-- Name: recolor_by_inds_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE recolor_by_inds_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: recolor_by_inds_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE recolor_by_inds_id_seq OWNED BY recolor_by_inds.id;


--
-- Name: recolor_by_quals_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE recolor_by_quals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: recolor_by_quals_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE recolor_by_quals_id_seq OWNED BY recolor_by_quals.id;


--
-- Name: resize_by_attributes; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE resize_by_attributes (
    id integer NOT NULL,
    context_id integer NOT NULL,
    group_number integer DEFAULT 1 NOT NULL,
    "position" integer NOT NULL,
    tooltip_text text,
    years integer[],
    is_disabled boolean DEFAULT false NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE resize_by_attributes; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE resize_by_attributes IS 'Attributes (quants) available for resizing.';


--
-- Name: COLUMN resize_by_attributes.group_number; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN resize_by_attributes.group_number IS 'TODO';


--
-- Name: COLUMN resize_by_attributes."position"; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN resize_by_attributes."position" IS 'Display order in scope of context';


--
-- Name: COLUMN resize_by_attributes.tooltip_text; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN resize_by_attributes.tooltip_text IS 'Tooltip text';


--
-- Name: COLUMN resize_by_attributes.years; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN resize_by_attributes.years IS 'Array of years for which to show this attribute in scope of chart; NULL for all years';


--
-- Name: COLUMN resize_by_attributes.is_disabled; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN resize_by_attributes.is_disabled IS 'When set, do not show this attribute';


--
-- Name: COLUMN resize_by_attributes.is_default; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN resize_by_attributes.is_default IS 'When set, show this attribute by default';


--
-- Name: resize_by_attributes_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE resize_by_attributes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: resize_by_attributes_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE resize_by_attributes_id_seq OWNED BY resize_by_attributes.id;


--
-- Name: resize_by_quants; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE resize_by_quants (
    id integer NOT NULL,
    resize_by_attribute_id integer NOT NULL,
    quant_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE resize_by_quants; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE resize_by_quants IS 'Quants available for recoloring (see resize_by_attributes.)';


--
-- Name: resize_by_attributes_mv; Type: MATERIALIZED VIEW; Schema: revamp; Owner: -
--

CREATE MATERIALIZED VIEW resize_by_attributes_mv AS
 SELECT ra.id,
    ra.context_id,
    ra.group_number,
    ra."position",
    ra.tooltip_text,
    ra.years,
    ra.is_disabled,
    ra.is_default,
    ra.created_at,
    ra.updated_at,
    a.id AS attribute_id
   FROM ((resize_by_quants raq
     JOIN resize_by_attributes ra ON ((ra.id = raq.resize_by_attribute_id)))
     JOIN attributes_mv a ON (((a.original_id = raq.quant_id) AND (a.original_type = 'Quant'::text))))
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW resize_by_attributes_mv; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON MATERIALIZED VIEW resize_by_attributes_mv IS 'Materialized view which merges resize_by_quants with resize_by_attributes.';


--
-- Name: COLUMN resize_by_attributes_mv.attribute_id; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON COLUMN resize_by_attributes_mv.attribute_id IS 'References the unique id in attributes_mv.';


--
-- Name: resize_by_quants_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE resize_by_quants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: resize_by_quants_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE resize_by_quants_id_seq OWNED BY resize_by_quants.id;


--
-- Name: traders; Type: TABLE; Schema: revamp; Owner: -
--

CREATE TABLE traders (
    id integer NOT NULL,
    importer_id integer NOT NULL,
    exporter_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE traders; Type: COMMENT; Schema: revamp; Owner: -
--

COMMENT ON TABLE traders IS 'Links between importer and exporter nodes which represent the same trader';


--
-- Name: traders_id_seq; Type: SEQUENCE; Schema: revamp; Owner: -
--

CREATE SEQUENCE traders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: traders_id_seq; Type: SEQUENCE OWNED BY; Schema: revamp; Owner: -
--

ALTER SEQUENCE traders_id_seq OWNED BY traders.id;


SET search_path = public, pg_catalog;

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
-- Name: download_versions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY download_versions ALTER COLUMN id SET DEFAULT nextval('download_versions_id_seq'::regclass);


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


SET search_path = revamp, pg_catalog;

--
-- Name: carto_layers id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY carto_layers ALTER COLUMN id SET DEFAULT nextval('carto_layers_id_seq'::regclass);


--
-- Name: chart_attributes id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY chart_attributes ALTER COLUMN id SET DEFAULT nextval('chart_attributes_id_seq'::regclass);


--
-- Name: chart_inds id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY chart_inds ALTER COLUMN id SET DEFAULT nextval('chart_inds_id_seq'::regclass);


--
-- Name: chart_quals id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY chart_quals ALTER COLUMN id SET DEFAULT nextval('chart_quals_id_seq'::regclass);


--
-- Name: chart_quants id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY chart_quants ALTER COLUMN id SET DEFAULT nextval('chart_quants_id_seq'::regclass);


--
-- Name: charts id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY charts ALTER COLUMN id SET DEFAULT nextval('charts_id_seq'::regclass);


--
-- Name: commodities id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY commodities ALTER COLUMN id SET DEFAULT nextval('commodities_id_seq'::regclass);


--
-- Name: context_node_types id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY context_node_types ALTER COLUMN id SET DEFAULT nextval('context_node_types_id_seq'::regclass);


--
-- Name: context_properties id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY context_properties ALTER COLUMN id SET DEFAULT nextval('context_properties_id_seq'::regclass);


--
-- Name: contexts id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY contexts ALTER COLUMN id SET DEFAULT nextval('contexts_id_seq'::regclass);


--
-- Name: contextual_layers id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY contextual_layers ALTER COLUMN id SET DEFAULT nextval('contextual_layers_id_seq'::regclass);


--
-- Name: countries id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY countries ALTER COLUMN id SET DEFAULT nextval('countries_id_seq'::regclass);


--
-- Name: country_properties id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY country_properties ALTER COLUMN id SET DEFAULT nextval('country_properties_id_seq'::regclass);


--
-- Name: download_attributes id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY download_attributes ALTER COLUMN id SET DEFAULT nextval('download_attributes_id_seq'::regclass);


--
-- Name: download_quals id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY download_quals ALTER COLUMN id SET DEFAULT nextval('download_quals_id_seq'::regclass);


--
-- Name: download_quants id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY download_quants ALTER COLUMN id SET DEFAULT nextval('download_quants_id_seq'::regclass);


--
-- Name: download_versions id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY download_versions ALTER COLUMN id SET DEFAULT nextval('download_versions_id_seq'::regclass);


--
-- Name: flow_inds id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY flow_inds ALTER COLUMN id SET DEFAULT nextval('flow_inds_id_seq'::regclass);


--
-- Name: flow_quals id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY flow_quals ALTER COLUMN id SET DEFAULT nextval('flow_quals_id_seq'::regclass);


--
-- Name: flow_quants id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY flow_quants ALTER COLUMN id SET DEFAULT nextval('flow_quants_id_seq'::regclass);


--
-- Name: flows id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY flows ALTER COLUMN id SET DEFAULT nextval('flows_id_seq'::regclass);


--
-- Name: ind_properties id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY ind_properties ALTER COLUMN id SET DEFAULT nextval('ind_properties_id_seq'::regclass);


--
-- Name: inds id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY inds ALTER COLUMN id SET DEFAULT nextval('inds_id_seq'::regclass);


--
-- Name: map_attribute_groups id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY map_attribute_groups ALTER COLUMN id SET DEFAULT nextval('map_attribute_groups_id_seq'::regclass);


--
-- Name: map_attributes id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY map_attributes ALTER COLUMN id SET DEFAULT nextval('map_attributes_id_seq'::regclass);


--
-- Name: map_inds id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY map_inds ALTER COLUMN id SET DEFAULT nextval('map_inds_id_seq'::regclass);


--
-- Name: map_quants id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY map_quants ALTER COLUMN id SET DEFAULT nextval('map_quants_id_seq'::regclass);


--
-- Name: node_inds id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY node_inds ALTER COLUMN id SET DEFAULT nextval('node_inds_id_seq'::regclass);


--
-- Name: node_quals id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY node_quals ALTER COLUMN id SET DEFAULT nextval('node_quals_id_seq'::regclass);


--
-- Name: node_quants id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY node_quants ALTER COLUMN id SET DEFAULT nextval('node_quants_id_seq'::regclass);


--
-- Name: node_types id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY node_types ALTER COLUMN id SET DEFAULT nextval('node_types_id_seq'::regclass);


--
-- Name: nodes id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY nodes ALTER COLUMN id SET DEFAULT nextval('nodes_id_seq'::regclass);


--
-- Name: profiles id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY profiles ALTER COLUMN id SET DEFAULT nextval('profiles_id_seq'::regclass);


--
-- Name: qual_properties id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY qual_properties ALTER COLUMN id SET DEFAULT nextval('qual_properties_id_seq'::regclass);


--
-- Name: quals id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY quals ALTER COLUMN id SET DEFAULT nextval('quals_id_seq'::regclass);


--
-- Name: quant_properties id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY quant_properties ALTER COLUMN id SET DEFAULT nextval('quant_properties_id_seq'::regclass);


--
-- Name: quants id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY quants ALTER COLUMN id SET DEFAULT nextval('quants_id_seq'::regclass);


--
-- Name: recolor_by_attributes id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY recolor_by_attributes ALTER COLUMN id SET DEFAULT nextval('recolor_by_attributes_id_seq'::regclass);


--
-- Name: recolor_by_inds id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY recolor_by_inds ALTER COLUMN id SET DEFAULT nextval('recolor_by_inds_id_seq'::regclass);


--
-- Name: recolor_by_quals id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY recolor_by_quals ALTER COLUMN id SET DEFAULT nextval('recolor_by_quals_id_seq'::regclass);


--
-- Name: resize_by_attributes id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY resize_by_attributes ALTER COLUMN id SET DEFAULT nextval('resize_by_attributes_id_seq'::regclass);


--
-- Name: resize_by_quants id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY resize_by_quants ALTER COLUMN id SET DEFAULT nextval('resize_by_quants_id_seq'::regclass);


--
-- Name: traders id; Type: DEFAULT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY traders ALTER COLUMN id SET DEFAULT nextval('traders_id_seq'::regclass);


SET search_path = public, pg_catalog;

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
-- Name: download_versions download_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY download_versions
    ADD CONSTRAINT download_versions_pkey PRIMARY KEY (id);


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


SET search_path = revamp, pg_catalog;

--
-- Name: carto_layers carto_layers_contextual_layer_id_identifier_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY carto_layers
    ADD CONSTRAINT carto_layers_contextual_layer_id_identifier_key UNIQUE (contextual_layer_id, identifier);


--
-- Name: carto_layers carto_layers_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY carto_layers
    ADD CONSTRAINT carto_layers_pkey PRIMARY KEY (id);


--
-- Name: chart_attributes chart_attributes_chart_id_position_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY chart_attributes
    ADD CONSTRAINT chart_attributes_chart_id_position_key UNIQUE (chart_id, "position");


--
-- Name: chart_attributes chart_attributes_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY chart_attributes
    ADD CONSTRAINT chart_attributes_pkey PRIMARY KEY (id);


--
-- Name: chart_inds chart_inds_chart_attribute_id_ind_id_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY chart_inds
    ADD CONSTRAINT chart_inds_chart_attribute_id_ind_id_key UNIQUE (chart_attribute_id, ind_id);


--
-- Name: chart_inds chart_inds_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY chart_inds
    ADD CONSTRAINT chart_inds_pkey PRIMARY KEY (id);


--
-- Name: chart_quals chart_quals_chart_attribute_id_qual_id_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY chart_quals
    ADD CONSTRAINT chart_quals_chart_attribute_id_qual_id_key UNIQUE (chart_attribute_id, qual_id);


--
-- Name: chart_quals chart_quals_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY chart_quals
    ADD CONSTRAINT chart_quals_pkey PRIMARY KEY (id);


--
-- Name: chart_quants chart_quants_chart_attribute_id_quant_id_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY chart_quants
    ADD CONSTRAINT chart_quants_chart_attribute_id_quant_id_key UNIQUE (chart_attribute_id, quant_id);


--
-- Name: chart_quants chart_quants_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY chart_quants
    ADD CONSTRAINT chart_quants_pkey PRIMARY KEY (id);


--
-- Name: charts charts_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY charts
    ADD CONSTRAINT charts_pkey PRIMARY KEY (id);


--
-- Name: charts charts_profile_id_parent_id_position_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY charts
    ADD CONSTRAINT charts_profile_id_parent_id_position_key UNIQUE (profile_id, parent_id, "position");


--
-- Name: commodities commodities_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY commodities
    ADD CONSTRAINT commodities_pkey PRIMARY KEY (id);


--
-- Name: context_node_types context_node_types_context_id_node_type_id_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY context_node_types
    ADD CONSTRAINT context_node_types_context_id_node_type_id_key UNIQUE (context_id, node_type_id);


--
-- Name: context_node_types context_node_types_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY context_node_types
    ADD CONSTRAINT context_node_types_pkey PRIMARY KEY (id);


--
-- Name: context_properties context_properties_context_id_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY context_properties
    ADD CONSTRAINT context_properties_context_id_key UNIQUE (context_id);


--
-- Name: context_properties context_properties_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY context_properties
    ADD CONSTRAINT context_properties_pkey PRIMARY KEY (id);


--
-- Name: contexts contexts_country_id_commodity_id_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY contexts
    ADD CONSTRAINT contexts_country_id_commodity_id_key UNIQUE (country_id, commodity_id);


--
-- Name: contexts contexts_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY contexts
    ADD CONSTRAINT contexts_pkey PRIMARY KEY (id);


--
-- Name: contextual_layers contextual_layers_context_id_identifier_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY contextual_layers
    ADD CONSTRAINT contextual_layers_context_id_identifier_key UNIQUE (context_id, identifier);


--
-- Name: contextual_layers contextual_layers_context_id_position_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY contextual_layers
    ADD CONSTRAINT contextual_layers_context_id_position_key UNIQUE (context_id, "position");


--
-- Name: contextual_layers contextual_layers_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY contextual_layers
    ADD CONSTRAINT contextual_layers_pkey PRIMARY KEY (id);


--
-- Name: countries countries_iso2_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY countries
    ADD CONSTRAINT countries_iso2_key UNIQUE (iso2);


--
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (id);


--
-- Name: country_properties country_properties_country_id_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY country_properties
    ADD CONSTRAINT country_properties_country_id_key UNIQUE (country_id);


--
-- Name: country_properties country_properties_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY country_properties
    ADD CONSTRAINT country_properties_pkey PRIMARY KEY (id);


--
-- Name: download_attributes download_attributes_context_id_position_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY download_attributes
    ADD CONSTRAINT download_attributes_context_id_position_key UNIQUE (context_id, "position");


--
-- Name: download_attributes download_attributes_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY download_attributes
    ADD CONSTRAINT download_attributes_pkey PRIMARY KEY (id);


--
-- Name: download_quals download_quals_download_attribute_id_qual_id_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY download_quals
    ADD CONSTRAINT download_quals_download_attribute_id_qual_id_key UNIQUE (download_attribute_id, qual_id);


--
-- Name: download_quals download_quals_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY download_quals
    ADD CONSTRAINT download_quals_pkey PRIMARY KEY (id);


--
-- Name: download_quants download_quants_download_attribute_id_quant_id_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY download_quants
    ADD CONSTRAINT download_quants_download_attribute_id_quant_id_key UNIQUE (download_attribute_id, quant_id);


--
-- Name: download_quants download_quants_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY download_quants
    ADD CONSTRAINT download_quants_pkey PRIMARY KEY (id);


--
-- Name: download_versions download_versions_context_id_symbol_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY download_versions
    ADD CONSTRAINT download_versions_context_id_symbol_key UNIQUE (context_id, symbol);


--
-- Name: download_versions download_versions_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY download_versions
    ADD CONSTRAINT download_versions_pkey PRIMARY KEY (id);


--
-- Name: flow_inds flow_inds_flow_id_ind_id_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY flow_inds
    ADD CONSTRAINT flow_inds_flow_id_ind_id_key UNIQUE (flow_id, ind_id);


--
-- Name: flow_inds flow_inds_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY flow_inds
    ADD CONSTRAINT flow_inds_pkey PRIMARY KEY (id);


--
-- Name: flow_quals flow_quals_flow_id_qual_id_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY flow_quals
    ADD CONSTRAINT flow_quals_flow_id_qual_id_key UNIQUE (flow_id, qual_id);


--
-- Name: flow_quals flow_quals_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY flow_quals
    ADD CONSTRAINT flow_quals_pkey PRIMARY KEY (id);


--
-- Name: flow_quants flow_quants_flow_id_quant_id_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY flow_quants
    ADD CONSTRAINT flow_quants_flow_id_quant_id_key UNIQUE (flow_id, quant_id);


--
-- Name: flow_quants flow_quants_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY flow_quants
    ADD CONSTRAINT flow_quants_pkey PRIMARY KEY (id);


--
-- Name: flows flows_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY flows
    ADD CONSTRAINT flows_pkey PRIMARY KEY (id);


--
-- Name: ind_properties ind_properties_ind_id_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY ind_properties
    ADD CONSTRAINT ind_properties_ind_id_key UNIQUE (ind_id);


--
-- Name: ind_properties ind_properties_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY ind_properties
    ADD CONSTRAINT ind_properties_pkey PRIMARY KEY (id);


--
-- Name: inds inds_name_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY inds
    ADD CONSTRAINT inds_name_key UNIQUE (name);


--
-- Name: inds inds_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY inds
    ADD CONSTRAINT inds_pkey PRIMARY KEY (id);


--
-- Name: map_attribute_groups map_attribute_groups_context_id_position_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY map_attribute_groups
    ADD CONSTRAINT map_attribute_groups_context_id_position_key UNIQUE (context_id, "position");


--
-- Name: map_attribute_groups map_attribute_groups_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY map_attribute_groups
    ADD CONSTRAINT map_attribute_groups_pkey PRIMARY KEY (id);


--
-- Name: map_attributes map_attributes_map_attribute_group_id_position_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY map_attributes
    ADD CONSTRAINT map_attributes_map_attribute_group_id_position_key UNIQUE (map_attribute_group_id, "position");


--
-- Name: map_attributes map_attributes_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY map_attributes
    ADD CONSTRAINT map_attributes_pkey PRIMARY KEY (id);


--
-- Name: map_inds map_inds_map_attribute_id_ind_id_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY map_inds
    ADD CONSTRAINT map_inds_map_attribute_id_ind_id_key UNIQUE (map_attribute_id, ind_id);


--
-- Name: map_inds map_inds_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY map_inds
    ADD CONSTRAINT map_inds_pkey PRIMARY KEY (id);


--
-- Name: map_quants map_quants_map_attribute_id_quant_id_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY map_quants
    ADD CONSTRAINT map_quants_map_attribute_id_quant_id_key UNIQUE (map_attribute_id, quant_id);


--
-- Name: map_quants map_quants_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY map_quants
    ADD CONSTRAINT map_quants_pkey PRIMARY KEY (id);


--
-- Name: node_inds node_inds_node_id_ind_id_year_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY node_inds
    ADD CONSTRAINT node_inds_node_id_ind_id_year_key UNIQUE (node_id, ind_id, year);


--
-- Name: node_inds node_inds_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY node_inds
    ADD CONSTRAINT node_inds_pkey PRIMARY KEY (id);


--
-- Name: node_quals node_quals_node_id_qual_id_year_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY node_quals
    ADD CONSTRAINT node_quals_node_id_qual_id_year_key UNIQUE (node_id, qual_id, year);


--
-- Name: node_quals node_quals_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY node_quals
    ADD CONSTRAINT node_quals_pkey PRIMARY KEY (id);


--
-- Name: node_quants node_quants_node_id_quant_id_year_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY node_quants
    ADD CONSTRAINT node_quants_node_id_quant_id_year_key UNIQUE (node_id, quant_id, year);


--
-- Name: node_quants node_quants_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY node_quants
    ADD CONSTRAINT node_quants_pkey PRIMARY KEY (id);


--
-- Name: node_types node_types_name_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY node_types
    ADD CONSTRAINT node_types_name_key UNIQUE (name);


--
-- Name: node_types node_types_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY node_types
    ADD CONSTRAINT node_types_pkey PRIMARY KEY (id);


--
-- Name: nodes nodes_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY nodes
    ADD CONSTRAINT nodes_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_context_node_type_id_name_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY profiles
    ADD CONSTRAINT profiles_context_node_type_id_name_key UNIQUE (context_node_type_id, name);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: qual_properties qual_properties_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY qual_properties
    ADD CONSTRAINT qual_properties_pkey PRIMARY KEY (id);


--
-- Name: qual_properties qual_properties_qual_id_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY qual_properties
    ADD CONSTRAINT qual_properties_qual_id_key UNIQUE (qual_id);


--
-- Name: quals quals_name_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY quals
    ADD CONSTRAINT quals_name_key UNIQUE (name);


--
-- Name: quals quals_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY quals
    ADD CONSTRAINT quals_pkey PRIMARY KEY (id);


--
-- Name: quant_properties quant_properties_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY quant_properties
    ADD CONSTRAINT quant_properties_pkey PRIMARY KEY (id);


--
-- Name: quant_properties quant_properties_quant_id_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY quant_properties
    ADD CONSTRAINT quant_properties_quant_id_key UNIQUE (quant_id);


--
-- Name: quants quants_name_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY quants
    ADD CONSTRAINT quants_name_key UNIQUE (name);


--
-- Name: quants quants_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY quants
    ADD CONSTRAINT quants_pkey PRIMARY KEY (id);


--
-- Name: recolor_by_attributes recolor_by_attributes_context_id_group_number_position_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY recolor_by_attributes
    ADD CONSTRAINT recolor_by_attributes_context_id_group_number_position_key UNIQUE (context_id, group_number, "position");


--
-- Name: recolor_by_attributes recolor_by_attributes_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY recolor_by_attributes
    ADD CONSTRAINT recolor_by_attributes_pkey PRIMARY KEY (id);


--
-- Name: recolor_by_inds recolor_by_inds_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY recolor_by_inds
    ADD CONSTRAINT recolor_by_inds_pkey PRIMARY KEY (id);


--
-- Name: recolor_by_inds recolor_by_inds_recolor_by_attribute_id_ind_id_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY recolor_by_inds
    ADD CONSTRAINT recolor_by_inds_recolor_by_attribute_id_ind_id_key UNIQUE (recolor_by_attribute_id, ind_id);


--
-- Name: recolor_by_quals recolor_by_quals_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY recolor_by_quals
    ADD CONSTRAINT recolor_by_quals_pkey PRIMARY KEY (id);


--
-- Name: recolor_by_quals recolor_by_quals_recolor_by_attribute_id_qual_id_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY recolor_by_quals
    ADD CONSTRAINT recolor_by_quals_recolor_by_attribute_id_qual_id_key UNIQUE (recolor_by_attribute_id, qual_id);


--
-- Name: resize_by_attributes resize_by_attributes_context_id_group_number_position_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY resize_by_attributes
    ADD CONSTRAINT resize_by_attributes_context_id_group_number_position_key UNIQUE (context_id, group_number, "position");


--
-- Name: resize_by_attributes resize_by_attributes_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY resize_by_attributes
    ADD CONSTRAINT resize_by_attributes_pkey PRIMARY KEY (id);


--
-- Name: resize_by_quants resize_by_quants_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY resize_by_quants
    ADD CONSTRAINT resize_by_quants_pkey PRIMARY KEY (id);


--
-- Name: resize_by_quants resize_by_quants_resize_by_attribute_id_quant_id_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY resize_by_quants
    ADD CONSTRAINT resize_by_quants_resize_by_attribute_id_quant_id_key UNIQUE (resize_by_attribute_id, quant_id);


--
-- Name: traders traders_exporter_id_importer_id_key; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY traders
    ADD CONSTRAINT traders_exporter_id_importer_id_key UNIQUE (exporter_id, importer_id);


--
-- Name: traders traders_pkey; Type: CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY traders
    ADD CONSTRAINT traders_pkey PRIMARY KEY (id);


SET search_path = public, pg_catalog;

--
-- Name: context_indicators_indicator_attribute_type_indicator_attri_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX context_indicators_indicator_attribute_type_indicator_attri_idx ON context_indicators USING btree (indicator_attribute_type, indicator_attribute_id, context_id);


--
-- Name: index_download_versions_on_symbol; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_download_versions_on_symbol ON download_versions USING btree (symbol);


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
-- Name: index_node_flows_on_flow_id_and_column_position; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_node_flows_on_flow_id_and_column_position ON node_flows USING btree (flow_id, column_position);


--
-- Name: index_nodes_on_node_type_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_nodes_on_node_type_id ON nodes USING btree (node_type_id);


SET search_path = revamp, pg_catalog;

--
-- Name: attributes_mv_name_idx; Type: INDEX; Schema: revamp; Owner: -
--

CREATE UNIQUE INDEX attributes_mv_name_idx ON attributes_mv USING btree (name);


--
-- Name: download_attributes_mv_context_id_attribute_id_idx; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX download_attributes_mv_context_id_attribute_id_idx ON download_attributes_mv USING btree (context_id, attribute_id);


--
-- Name: download_attributes_mv_id_idx; Type: INDEX; Schema: revamp; Owner: -
--

CREATE UNIQUE INDEX download_attributes_mv_id_idx ON download_attributes_mv USING btree (id);


--
-- Name: flow_inds_ind_id_idx; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX flow_inds_ind_id_idx ON flow_inds USING btree (ind_id);


--
-- Name: flow_quals_qual_id_idx; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX flow_quals_qual_id_idx ON flow_quals USING btree (qual_id);


--
-- Name: flow_quants_quant_id_idx; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX flow_quants_quant_id_idx ON flow_quants USING btree (quant_id);


--
-- Name: index_attributes_mv_id_idx; Type: INDEX; Schema: revamp; Owner: -
--

CREATE UNIQUE INDEX index_attributes_mv_id_idx ON attributes_mv USING btree (id);


--
-- Name: index_carto_layers_on_contextual_layer_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_carto_layers_on_contextual_layer_id ON carto_layers USING btree (contextual_layer_id);


--
-- Name: index_chart_attributes_on_chart_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_chart_attributes_on_chart_id ON chart_attributes USING btree (chart_id);


--
-- Name: index_chart_inds_on_chart_attribute_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_chart_inds_on_chart_attribute_id ON chart_inds USING btree (chart_attribute_id);


--
-- Name: index_chart_inds_on_ind_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_chart_inds_on_ind_id ON chart_inds USING btree (ind_id);


--
-- Name: index_chart_quals_on_chart_attribute_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_chart_quals_on_chart_attribute_id ON chart_quals USING btree (chart_attribute_id);


--
-- Name: index_chart_quals_on_qual_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_chart_quals_on_qual_id ON chart_quals USING btree (qual_id);


--
-- Name: index_chart_quants_on_chart_attribute_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_chart_quants_on_chart_attribute_id ON chart_quants USING btree (chart_attribute_id);


--
-- Name: index_chart_quants_on_quant_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_chart_quants_on_quant_id ON chart_quants USING btree (quant_id);


--
-- Name: index_charts_on_parent_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_charts_on_parent_id ON charts USING btree (parent_id);


--
-- Name: index_charts_on_profile_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_charts_on_profile_id ON charts USING btree (profile_id);


--
-- Name: index_context_node_types_on_context_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_context_node_types_on_context_id ON context_node_types USING btree (context_id);


--
-- Name: index_context_node_types_on_node_type_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_context_node_types_on_node_type_id ON context_node_types USING btree (node_type_id);


--
-- Name: index_context_properties_on_context_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_context_properties_on_context_id ON context_properties USING btree (context_id);


--
-- Name: index_contexts_on_commodity_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_contexts_on_commodity_id ON contexts USING btree (commodity_id);


--
-- Name: index_contexts_on_country_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_contexts_on_country_id ON contexts USING btree (country_id);


--
-- Name: index_contextual_layers_on_context_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_contextual_layers_on_context_id ON contextual_layers USING btree (context_id);


--
-- Name: index_country_properties_on_country_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_country_properties_on_country_id ON country_properties USING btree (country_id);


--
-- Name: index_download_attributes_on_context_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_download_attributes_on_context_id ON download_attributes USING btree (context_id);


--
-- Name: index_download_quals_on_download_attribute_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_download_quals_on_download_attribute_id ON download_quals USING btree (download_attribute_id);


--
-- Name: index_download_quals_on_qual_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_download_quals_on_qual_id ON download_quals USING btree (qual_id);


--
-- Name: index_download_quants_on_download_attribute_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_download_quants_on_download_attribute_id ON download_quants USING btree (download_attribute_id);


--
-- Name: index_download_quants_on_quant_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_download_quants_on_quant_id ON download_quants USING btree (quant_id);


--
-- Name: index_download_versions_on_context_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_download_versions_on_context_id ON download_versions USING btree (context_id);


--
-- Name: index_flow_inds_on_flow_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_flow_inds_on_flow_id ON flow_inds USING btree (flow_id);


--
-- Name: index_flow_quals_on_flow_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_flow_quals_on_flow_id ON flow_quals USING btree (flow_id);


--
-- Name: index_flow_quants_on_flow_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_flow_quants_on_flow_id ON flow_quants USING btree (flow_id);


--
-- Name: index_flows_on_context_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_flows_on_context_id ON flows USING btree (context_id);


--
-- Name: index_flows_on_context_id_and_year; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_flows_on_context_id_and_year ON flows USING btree (context_id, year);


--
-- Name: index_flows_on_path; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_flows_on_path ON flows USING btree (path);


--
-- Name: index_ind_properties_on_ind_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_ind_properties_on_ind_id ON ind_properties USING btree (ind_id);


--
-- Name: index_map_attribute_groups_on_context_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_map_attribute_groups_on_context_id ON map_attribute_groups USING btree (context_id);


--
-- Name: index_map_attributes_on_map_attribute_group_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_map_attributes_on_map_attribute_group_id ON map_attributes USING btree (map_attribute_group_id);


--
-- Name: index_map_inds_on_ind_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_map_inds_on_ind_id ON map_inds USING btree (ind_id);


--
-- Name: index_map_inds_on_map_attribute_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_map_inds_on_map_attribute_id ON map_inds USING btree (map_attribute_id);


--
-- Name: index_map_quants_on_map_attribute_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_map_quants_on_map_attribute_id ON map_quants USING btree (map_attribute_id);


--
-- Name: index_map_quants_on_quant_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_map_quants_on_quant_id ON map_quants USING btree (quant_id);


--
-- Name: index_node_inds_on_node_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_node_inds_on_node_id ON node_inds USING btree (node_id);


--
-- Name: index_node_quals_on_node_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_node_quals_on_node_id ON node_quals USING btree (node_id);


--
-- Name: index_node_quants_on_node_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_node_quants_on_node_id ON node_quants USING btree (node_id);


--
-- Name: index_profiles_on_context_node_type_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_profiles_on_context_node_type_id ON profiles USING btree (context_node_type_id);


--
-- Name: index_qual_properties_on_qual_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_qual_properties_on_qual_id ON qual_properties USING btree (qual_id);


--
-- Name: index_quant_properties_on_quant_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_quant_properties_on_quant_id ON quant_properties USING btree (quant_id);


--
-- Name: index_recolor_by_attributes_on_context_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_recolor_by_attributes_on_context_id ON recolor_by_attributes USING btree (context_id);


--
-- Name: index_recolor_by_inds_on_ind_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_recolor_by_inds_on_ind_id ON recolor_by_inds USING btree (ind_id);


--
-- Name: index_recolor_by_inds_on_recolor_by_attribute_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_recolor_by_inds_on_recolor_by_attribute_id ON recolor_by_inds USING btree (recolor_by_attribute_id);


--
-- Name: index_recolor_by_quals_on_qual_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_recolor_by_quals_on_qual_id ON recolor_by_quals USING btree (qual_id);


--
-- Name: index_recolor_by_quals_on_recolor_by_attribute_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_recolor_by_quals_on_recolor_by_attribute_id ON recolor_by_quals USING btree (recolor_by_attribute_id);


--
-- Name: index_resize_by_attributes_on_context_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_resize_by_attributes_on_context_id ON resize_by_attributes USING btree (context_id);


--
-- Name: index_resize_by_quants_on_quant_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_resize_by_quants_on_quant_id ON resize_by_quants USING btree (quant_id);


--
-- Name: index_resize_by_quants_on_resize_by_attribute_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_resize_by_quants_on_resize_by_attribute_id ON resize_by_quants USING btree (resize_by_attribute_id);


--
-- Name: index_traders_on_exporter_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_traders_on_exporter_id ON traders USING btree (exporter_id);


--
-- Name: index_traders_on_importer_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX index_traders_on_importer_id ON traders USING btree (importer_id);


--
-- Name: map_attributes_mv_id_idx; Type: INDEX; Schema: revamp; Owner: -
--

CREATE UNIQUE INDEX map_attributes_mv_id_idx ON map_attributes_mv USING btree (id);


--
-- Name: map_attributes_mv_map_attribute_group_id_attribute_id_idx; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX map_attributes_mv_map_attribute_group_id_attribute_id_idx ON map_attributes_mv USING btree (map_attribute_group_id, attribute_id);


--
-- Name: node_inds_ind_id_idx; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX node_inds_ind_id_idx ON node_inds USING btree (ind_id);


--
-- Name: node_quals_qual_id_idx; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX node_quals_qual_id_idx ON node_quals USING btree (qual_id);


--
-- Name: node_quants_quant_id_idx; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX node_quants_quant_id_idx ON node_quants USING btree (quant_id);


--
-- Name: nodes_node_type_id_idx; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX nodes_node_type_id_idx ON nodes USING btree (node_type_id);


--
-- Name: recolor_by_attributes_mv_context_id_attribute_id; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX recolor_by_attributes_mv_context_id_attribute_id ON recolor_by_attributes_mv USING btree (context_id, attribute_id);


--
-- Name: recolor_by_attributes_mv_id_idx; Type: INDEX; Schema: revamp; Owner: -
--

CREATE UNIQUE INDEX recolor_by_attributes_mv_id_idx ON recolor_by_attributes_mv USING btree (id);


--
-- Name: resize_by_attributes_mv_context_id_attribute_id_idx; Type: INDEX; Schema: revamp; Owner: -
--

CREATE INDEX resize_by_attributes_mv_context_id_attribute_id_idx ON resize_by_attributes_mv USING btree (context_id, attribute_id);


--
-- Name: resize_by_attributes_mv_id_idx; Type: INDEX; Schema: revamp; Owner: -
--

CREATE UNIQUE INDEX resize_by_attributes_mv_id_idx ON resize_by_attributes_mv USING btree (id);


SET search_path = public, pg_catalog;

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


SET search_path = revamp, pg_catalog;

--
-- Name: download_quants fk_rails_05ea4b5d71; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY download_quants
    ADD CONSTRAINT fk_rails_05ea4b5d71 FOREIGN KEY (quant_id) REFERENCES quants(id) ON DELETE CASCADE;


--
-- Name: flow_inds fk_rails_0a8bdfaf25; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY flow_inds
    ADD CONSTRAINT fk_rails_0a8bdfaf25 FOREIGN KEY (flow_id) REFERENCES flows(id) ON DELETE CASCADE;


--
-- Name: node_quals fk_rails_14ebb50b5a; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY node_quals
    ADD CONSTRAINT fk_rails_14ebb50b5a FOREIGN KEY (node_id) REFERENCES nodes(id) ON DELETE CASCADE;


--
-- Name: recolor_by_attributes fk_rails_15a713c884; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY recolor_by_attributes
    ADD CONSTRAINT fk_rails_15a713c884 FOREIGN KEY (context_id) REFERENCES contexts(id) ON DELETE CASCADE;


--
-- Name: context_node_types fk_rails_15e56acf9a; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY context_node_types
    ADD CONSTRAINT fk_rails_15e56acf9a FOREIGN KEY (node_type_id) REFERENCES node_types(id) ON DELETE CASCADE;


--
-- Name: download_attributes fk_rails_163b9bb8d8; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY download_attributes
    ADD CONSTRAINT fk_rails_163b9bb8d8 FOREIGN KEY (context_id) REFERENCES contexts(id) ON DELETE CASCADE;


--
-- Name: chart_attributes fk_rails_18fff2d805; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY chart_attributes
    ADD CONSTRAINT fk_rails_18fff2d805 FOREIGN KEY (chart_id) REFERENCES charts(id) ON DELETE CASCADE;


--
-- Name: download_quals fk_rails_1be1712b6c; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY download_quals
    ADD CONSTRAINT fk_rails_1be1712b6c FOREIGN KEY (download_attribute_id) REFERENCES download_attributes(id) ON DELETE CASCADE;


--
-- Name: quant_properties fk_rails_201d91fbef; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY quant_properties
    ADD CONSTRAINT fk_rails_201d91fbef FOREIGN KEY (quant_id) REFERENCES quants(id) ON DELETE CASCADE;


--
-- Name: flow_inds fk_rails_23d15ab229; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY flow_inds
    ADD CONSTRAINT fk_rails_23d15ab229 FOREIGN KEY (ind_id) REFERENCES inds(id) ON DELETE CASCADE;


--
-- Name: context_node_types fk_rails_23d7986b34; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY context_node_types
    ADD CONSTRAINT fk_rails_23d7986b34 FOREIGN KEY (context_id) REFERENCES contexts(id) ON DELETE CASCADE;


--
-- Name: resize_by_quants fk_rails_2617a248e4; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY resize_by_quants
    ADD CONSTRAINT fk_rails_2617a248e4 FOREIGN KEY (resize_by_attribute_id) REFERENCES resize_by_attributes(id) ON DELETE CASCADE;


--
-- Name: node_inds fk_rails_28ea53a9b9; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY node_inds
    ADD CONSTRAINT fk_rails_28ea53a9b9 FOREIGN KEY (ind_id) REFERENCES inds(id) ON DELETE CASCADE;


--
-- Name: recolor_by_inds fk_rails_2950876b56; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY recolor_by_inds
    ADD CONSTRAINT fk_rails_2950876b56 FOREIGN KEY (recolor_by_attribute_id) REFERENCES recolor_by_attributes(id) ON DELETE CASCADE;


--
-- Name: chart_inds fk_rails_2c8eebb539; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY chart_inds
    ADD CONSTRAINT fk_rails_2c8eebb539 FOREIGN KEY (chart_attribute_id) REFERENCES chart_attributes(id) ON DELETE CASCADE;


--
-- Name: flow_quants fk_rails_2dbc0a565f; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY flow_quants
    ADD CONSTRAINT fk_rails_2dbc0a565f FOREIGN KEY (flow_id) REFERENCES flows(id) ON DELETE CASCADE;


--
-- Name: map_quants fk_rails_308b5b45f7; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY map_quants
    ADD CONSTRAINT fk_rails_308b5b45f7 FOREIGN KEY (map_attribute_id) REFERENCES map_attributes(id) ON DELETE CASCADE;


--
-- Name: map_attribute_groups fk_rails_32f187c0c7; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY map_attribute_groups
    ADD CONSTRAINT fk_rails_32f187c0c7 FOREIGN KEY (context_id) REFERENCES contexts(id) ON DELETE CASCADE;


--
-- Name: nodes fk_rails_37e87445f7; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY nodes
    ADD CONSTRAINT fk_rails_37e87445f7 FOREIGN KEY (node_type_id) REFERENCES node_types(id) ON DELETE CASCADE;


--
-- Name: download_versions fk_rails_3fcb3b1d94; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY download_versions
    ADD CONSTRAINT fk_rails_3fcb3b1d94 FOREIGN KEY (context_id) REFERENCES contexts(id) ON DELETE CASCADE;


--
-- Name: chart_quals fk_rails_48ef39e784; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY chart_quals
    ADD CONSTRAINT fk_rails_48ef39e784 FOREIGN KEY (chart_attribute_id) REFERENCES chart_attributes(id) ON DELETE CASCADE;


--
-- Name: map_inds fk_rails_49db6b9c1f; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY map_inds
    ADD CONSTRAINT fk_rails_49db6b9c1f FOREIGN KEY (ind_id) REFERENCES inds(id) ON DELETE CASCADE;


--
-- Name: recolor_by_quals fk_rails_5294e7fccd; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY recolor_by_quals
    ADD CONSTRAINT fk_rails_5294e7fccd FOREIGN KEY (recolor_by_attribute_id) REFERENCES recolor_by_attributes(id) ON DELETE CASCADE;


--
-- Name: contextual_layers fk_rails_5c2d32b5a7; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY contextual_layers
    ADD CONSTRAINT fk_rails_5c2d32b5a7 FOREIGN KEY (context_id) REFERENCES contexts(id) ON DELETE CASCADE;


--
-- Name: country_properties fk_rails_668b355aa6; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY country_properties
    ADD CONSTRAINT fk_rails_668b355aa6 FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE;


--
-- Name: chart_quants fk_rails_69c56caceb; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY chart_quants
    ADD CONSTRAINT fk_rails_69c56caceb FOREIGN KEY (quant_id) REFERENCES quants(id) ON DELETE CASCADE;


--
-- Name: flow_quals fk_rails_6e55ca4cbc; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY flow_quals
    ADD CONSTRAINT fk_rails_6e55ca4cbc FOREIGN KEY (flow_id) REFERENCES flows(id) ON DELETE CASCADE;


--
-- Name: ind_properties fk_rails_720a88d4b2; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY ind_properties
    ADD CONSTRAINT fk_rails_720a88d4b2 FOREIGN KEY (ind_id) REFERENCES inds(id) ON DELETE CASCADE;


--
-- Name: traders fk_rails_79308a8475; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY traders
    ADD CONSTRAINT fk_rails_79308a8475 FOREIGN KEY (importer_id) REFERENCES nodes(id) ON DELETE CASCADE;


--
-- Name: charts fk_rails_805a6066ad; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY charts
    ADD CONSTRAINT fk_rails_805a6066ad FOREIGN KEY (parent_id) REFERENCES charts(id) ON DELETE CASCADE;


--
-- Name: flow_quals fk_rails_917b9da2b8; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY flow_quals
    ADD CONSTRAINT fk_rails_917b9da2b8 FOREIGN KEY (qual_id) REFERENCES quals(id) ON DELETE CASCADE;


--
-- Name: resize_by_attributes fk_rails_91f952a39c; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY resize_by_attributes
    ADD CONSTRAINT fk_rails_91f952a39c FOREIGN KEY (context_id) REFERENCES contexts(id) ON DELETE CASCADE;


--
-- Name: recolor_by_inds fk_rails_93051274e4; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY recolor_by_inds
    ADD CONSTRAINT fk_rails_93051274e4 FOREIGN KEY (ind_id) REFERENCES inds(id) ON DELETE CASCADE;


--
-- Name: node_quals fk_rails_962f283611; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY node_quals
    ADD CONSTRAINT fk_rails_962f283611 FOREIGN KEY (qual_id) REFERENCES quals(id) ON DELETE CASCADE;


--
-- Name: carto_layers fk_rails_9b2f0fa157; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY carto_layers
    ADD CONSTRAINT fk_rails_9b2f0fa157 FOREIGN KEY (contextual_layer_id) REFERENCES contextual_layers(id) ON DELETE CASCADE;


--
-- Name: flow_quants fk_rails_a48f7b74d0; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY flow_quants
    ADD CONSTRAINT fk_rails_a48f7b74d0 FOREIGN KEY (quant_id) REFERENCES quants(id) ON DELETE CASCADE;


--
-- Name: charts fk_rails_a7dc6318f9; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY charts
    ADD CONSTRAINT fk_rails_a7dc6318f9 FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE;


--
-- Name: chart_inds fk_rails_b730b06fdc; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY chart_inds
    ADD CONSTRAINT fk_rails_b730b06fdc FOREIGN KEY (ind_id) REFERENCES inds(id) ON DELETE CASCADE;


--
-- Name: chart_quals fk_rails_c1341bce97; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY chart_quals
    ADD CONSTRAINT fk_rails_c1341bce97 FOREIGN KEY (qual_id) REFERENCES quals(id) ON DELETE CASCADE;


--
-- Name: flows fk_rails_c33db455e5; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY flows
    ADD CONSTRAINT fk_rails_c33db455e5 FOREIGN KEY (context_id) REFERENCES contexts(id) ON DELETE CASCADE;


--
-- Name: resize_by_quants fk_rails_c63dc992e3; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY resize_by_quants
    ADD CONSTRAINT fk_rails_c63dc992e3 FOREIGN KEY (quant_id) REFERENCES quants(id) ON DELETE CASCADE;


--
-- Name: qual_properties fk_rails_c8bcede145; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY qual_properties
    ADD CONSTRAINT fk_rails_c8bcede145 FOREIGN KEY (qual_id) REFERENCES quals(id) ON DELETE CASCADE;


--
-- Name: map_inds fk_rails_cac7dc7c14; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY map_inds
    ADD CONSTRAINT fk_rails_cac7dc7c14 FOREIGN KEY (map_attribute_id) REFERENCES map_attributes(id) ON DELETE CASCADE;


--
-- Name: profiles fk_rails_cbc235c3bc; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY profiles
    ADD CONSTRAINT fk_rails_cbc235c3bc FOREIGN KEY (context_node_type_id) REFERENCES context_node_types(id) ON DELETE CASCADE;


--
-- Name: map_quants fk_rails_cc084396cb; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY map_quants
    ADD CONSTRAINT fk_rails_cc084396cb FOREIGN KEY (quant_id) REFERENCES quants(id) ON DELETE CASCADE;


--
-- Name: context_properties fk_rails_cc3af59ff4; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY context_properties
    ADD CONSTRAINT fk_rails_cc3af59ff4 FOREIGN KEY (context_id) REFERENCES contexts(id) ON DELETE CASCADE;


--
-- Name: contexts fk_rails_d9e59d1113; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY contexts
    ADD CONSTRAINT fk_rails_d9e59d1113 FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE;


--
-- Name: node_quants fk_rails_dd544b3e59; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY node_quants
    ADD CONSTRAINT fk_rails_dd544b3e59 FOREIGN KEY (node_id) REFERENCES nodes(id) ON DELETE CASCADE;


--
-- Name: chart_quants fk_rails_dd98c02cd6; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY chart_quants
    ADD CONSTRAINT fk_rails_dd98c02cd6 FOREIGN KEY (chart_attribute_id) REFERENCES chart_attributes(id) ON DELETE CASCADE;


--
-- Name: download_quants fk_rails_e3b3c104f3; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY download_quants
    ADD CONSTRAINT fk_rails_e3b3c104f3 FOREIGN KEY (download_attribute_id) REFERENCES download_attributes(id) ON DELETE CASCADE;


--
-- Name: node_quants fk_rails_e5f4cc54e9; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY node_quants
    ADD CONSTRAINT fk_rails_e5f4cc54e9 FOREIGN KEY (quant_id) REFERENCES quants(id) ON DELETE CASCADE;


--
-- Name: download_quals fk_rails_e8e87251a2; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY download_quals
    ADD CONSTRAINT fk_rails_e8e87251a2 FOREIGN KEY (qual_id) REFERENCES quals(id) ON DELETE CASCADE;


--
-- Name: contexts fk_rails_eea78f436e; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY contexts
    ADD CONSTRAINT fk_rails_eea78f436e FOREIGN KEY (commodity_id) REFERENCES commodities(id) ON DELETE CASCADE;


--
-- Name: recolor_by_quals fk_rails_f5f36c9f54; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY recolor_by_quals
    ADD CONSTRAINT fk_rails_f5f36c9f54 FOREIGN KEY (qual_id) REFERENCES quals(id) ON DELETE CASCADE;


--
-- Name: map_attributes fk_rails_f85c86caa0; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY map_attributes
    ADD CONSTRAINT fk_rails_f85c86caa0 FOREIGN KEY (map_attribute_group_id) REFERENCES map_attribute_groups(id) ON DELETE CASCADE;


--
-- Name: traders fk_rails_f8b100d54e; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY traders
    ADD CONSTRAINT fk_rails_f8b100d54e FOREIGN KEY (exporter_id) REFERENCES nodes(id) ON DELETE CASCADE;


--
-- Name: node_inds fk_rails_fe29817503; Type: FK CONSTRAINT; Schema: revamp; Owner: -
--

ALTER TABLE ONLY node_inds
    ADD CONSTRAINT fk_rails_fe29817503 FOREIGN KEY (node_id) REFERENCES nodes(id) ON DELETE CASCADE;


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
('20170316135218'),
('20170323090506'),
('20170323121305'),
('20170506225529'),
('20170526080738'),
('20170526095950'),
('20170526103500'),
('20170526131332'),
('20170613120932'),
('20170614111428'),
('20170630134124'),
('20170821081055'),
('20170824111857'),
('20170829074711'),
('20170918133625'),
('20170918134156'),
('20170921125513'),
('20170925102834'),
('20170929120908'),
('20171002093637'),
('20171002102750'),
('20171004102919'),
('20171006161620'),
('20171006171936'),
('20171011112259'),
('20171011121102'),
('20171011121557'),
('20171011121700'),
('20171012103851'),
('20171012104354'),
('20171012110946'),
('20171012112442'),
('20171012124235'),
('20171012130125'),
('20171013081306'),
('20171013094155'),
('20171013095055'),
('20171013101825'),
('20171013103931'),
('20171013104602'),
('20171018093008'),
('20171020091710'),
('20171020125731'),
('20171020133529'),
('20171101111009'),
('20171106114656'),
('20171106121710'),
('20171106123358'),
('20171115091532');


