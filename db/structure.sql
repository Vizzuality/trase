SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: content; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA content;


--
-- Name: main; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA main;


--
-- Name: maintenance; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA maintenance;


--
-- Name: fuzzystrmatch; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch WITH SCHEMA public;


--
-- Name: EXTENSION fuzzystrmatch; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION fuzzystrmatch IS 'determine similarities and distance between strings';


--
-- Name: intarray; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS intarray WITH SCHEMA public;


--
-- Name: EXTENSION intarray; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION intarray IS 'functions, operators, and index support for 1-D arrays of integers';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA public;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_stat_statements IS 'track execution statistics of all SQL statements executed';


--
-- Name: postgres_fdw; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgres_fdw WITH SCHEMA public;


--
-- Name: EXTENSION postgres_fdw; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION postgres_fdw IS 'foreign-data wrapper for remote PostgreSQL servers';


--
-- Name: tablefunc; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS tablefunc WITH SCHEMA public;


--
-- Name: EXTENSION tablefunc; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION tablefunc IS 'functions that manipulate whole tables, including crosstab';


--
-- Name: aggregated_buckets(double precision[], integer[], integer[], text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.aggregated_buckets(buckets double precision[], declared_years integer[], requested_years integer[], attribute_type text) RETURNS double precision[]
    LANGUAGE sql IMMUTABLE
    AS $$
  SELECT CASE
    WHEN attribute_type = 'quant' AND ICOUNT(COALESCE(declared_years, requested_years) & requested_years) > 0 THEN
      ARRAY(SELECT ICOUNT(COALESCE(declared_years, requested_years) & requested_years) * UNNEST(buckets))
    ELSE
      buckets
  END
$$;


--
-- Name: FUNCTION aggregated_buckets(buckets double precision[], declared_years integer[], requested_years integer[], attribute_type text); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.aggregated_buckets(buckets double precision[], declared_years integer[], requested_years integer[], attribute_type text) IS 'Aggregates buckets.';


--
-- Name: bucket_index(double precision[], double precision); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.bucket_index(buckets double precision[], value double precision) RETURNS integer
    LANGUAGE sql IMMUTABLE
    AS $$

SELECT CASE WHEN value > 0 THEN idx ELSE 0 END FROM (
  SELECT COALESCE(hi.idx, lo.idx + 1)::INT AS idx, lo.val AS lo, hi.val AS hi
  FROM UNNEST(buckets) WITH ORDINALITY AS lo(val, idx)
  FULL OUTER JOIN UNNEST(buckets) WITH ORDINALITY AS hi(val, idx) ON lo.idx + 1 = hi.idx
) t
WHERE
  value >= t.lo AND value < t.hi AND t.lo IS NOT NULL AND t.hi IS NOT NULL
  OR value >= t.lo AND t.hi IS NULL
  OR value < t.hi AND t.lo IS NULL;
$$;


--
-- Name: FUNCTION bucket_index(buckets double precision[], value double precision); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.bucket_index(buckets double precision[], value double precision) IS 'Given an n-element array of choropleth buckets and a positive value, returns index of bucket where value falls (1 to n + 1); else returns 0.';


--
-- Name: known_path_positions(integer[]); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.known_path_positions(path integer[]) RETURNS boolean[]
    LANGUAGE sql IMMUTABLE
    AS $$
  SELECT ARRAY_AGG(NOT nodes.is_unknown ORDER BY position)::BOOLEAN[]
  FROM UNNEST(path) WITH ORDINALITY a (node_id, position), nodes
  WHERE nodes.id = a.node_id
$$;


--
-- Name: FUNCTION known_path_positions(path integer[]); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.known_path_positions(path integer[]) IS 'Returns array with indexes in path where nodes are known.';


--
-- Name: path_names(integer[]); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.path_names(path integer[]) RETURNS text[]
    LANGUAGE sql IMMUTABLE
    AS $$
  SELECT ARRAY_AGG(nodes.name ORDER BY position)::TEXT[]
  FROM UNNEST(path) WITH ORDINALITY a (node_id, position), nodes
  WHERE nodes.id = a.node_id
$$;


--
-- Name: FUNCTION path_names(path integer[]); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.path_names(path integer[]) IS 'Returns array with node names in path.';


--
-- Name: upsert_attributes(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.upsert_attributes() RETURNS void
    LANGUAGE sql
    AS $$

INSERT INTO attributes (
  original_id,
  original_type,
  name,
  display_name,
  unit,
  unit_type,
  tooltip_text
)
SELECT
  original_id,
  original_type,
  name,
  display_name,
  unit,
  unit_type,
  tooltip_text
FROM attributes_v

EXCEPT

SELECT
  original_id,
  original_type,
  name,
  display_name,
  unit,
  unit_type,
  tooltip_text
FROM attributes
ON CONFLICT (name, original_type) DO UPDATE SET
  original_id = excluded.original_id,
  display_name = excluded.display_name,
  unit = excluded.unit,
  unit_type = excluded.unit_type,
  tooltip_text = excluded.tooltip_text;

DELETE FROM attributes
USING (
  SELECT
    original_id,
    original_type,
    name,
    display_name,
    unit,
    unit_type,
    tooltip_text
  FROM attributes

  EXCEPT

  SELECT
    original_id,
    original_type,
    name,
    display_name,
    unit,
    unit_type,
    tooltip_text
  FROM attributes_v
) s
WHERE attributes.name = s.name AND attributes.original_type = s.original_type;
$$;


--
-- Name: FUNCTION upsert_attributes(); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.upsert_attributes() IS 'Upserts attributes based on new values as returned by attributes_v (identity by original_type + name)';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: ckeditor_assets; Type: TABLE; Schema: content; Owner: -
--

CREATE TABLE content.ckeditor_assets (
    id integer NOT NULL,
    data_file_name character varying NOT NULL,
    data_content_type character varying,
    data_file_size integer,
    data_fingerprint character varying,
    assetable_id integer,
    assetable_type character varying(30),
    type character varying(30),
    width integer,
    height integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: ckeditor_assets_id_seq; Type: SEQUENCE; Schema: content; Owner: -
--

CREATE SEQUENCE content.ckeditor_assets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ckeditor_assets_id_seq; Type: SEQUENCE OWNED BY; Schema: content; Owner: -
--

ALTER SEQUENCE content.ckeditor_assets_id_seq OWNED BY content.ckeditor_assets.id;


--
-- Name: pages; Type: TABLE; Schema: content; Owner: -
--

CREATE TABLE content.pages (
    id bigint NOT NULL,
    name text NOT NULL,
    content text NOT NULL
);


--
-- Name: pages_id_seq; Type: SEQUENCE; Schema: content; Owner: -
--

CREATE SEQUENCE content.pages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pages_id_seq; Type: SEQUENCE OWNED BY; Schema: content; Owner: -
--

ALTER SEQUENCE content.pages_id_seq OWNED BY content.pages.id;


--
-- Name: posts; Type: TABLE; Schema: content; Owner: -
--

CREATE TABLE content.posts (
    id integer NOT NULL,
    title text NOT NULL,
    date timestamp without time zone NOT NULL,
    post_url text NOT NULL,
    state integer DEFAULT 0 NOT NULL,
    highlighted boolean DEFAULT false NOT NULL,
    category text NOT NULL,
    image_file_name text,
    image_content_type text,
    image_file_size integer,
    image_updated_at timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: content; Owner: -
--

CREATE SEQUENCE content.posts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: content; Owner: -
--

ALTER SEQUENCE content.posts_id_seq OWNED BY content.posts.id;


--
-- Name: site_dives; Type: TABLE; Schema: content; Owner: -
--

CREATE TABLE content.site_dives (
    id integer NOT NULL,
    title text NOT NULL,
    page_url text NOT NULL,
    description text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: site_dives_id_seq; Type: SEQUENCE; Schema: content; Owner: -
--

CREATE SEQUENCE content.site_dives_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: site_dives_id_seq; Type: SEQUENCE OWNED BY; Schema: content; Owner: -
--

ALTER SEQUENCE content.site_dives_id_seq OWNED BY content.site_dives.id;


--
-- Name: staff_groups; Type: TABLE; Schema: content; Owner: -
--

CREATE TABLE content.staff_groups (
    id bigint NOT NULL,
    name text NOT NULL,
    "position" integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: staff_groups_id_seq; Type: SEQUENCE; Schema: content; Owner: -
--

CREATE SEQUENCE content.staff_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: staff_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: content; Owner: -
--

ALTER SEQUENCE content.staff_groups_id_seq OWNED BY content.staff_groups.id;


--
-- Name: staff_members; Type: TABLE; Schema: content; Owner: -
--

CREATE TABLE content.staff_members (
    id bigint NOT NULL,
    staff_group_id bigint NOT NULL,
    name text NOT NULL,
    "position" integer NOT NULL,
    bio text NOT NULL,
    image_file_name text,
    image_content_type text,
    image_file_size integer,
    image_updated_at timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: staff_members_id_seq; Type: SEQUENCE; Schema: content; Owner: -
--

CREATE SEQUENCE content.staff_members_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: staff_members_id_seq; Type: SEQUENCE OWNED BY; Schema: content; Owner: -
--

ALTER SEQUENCE content.staff_members_id_seq OWNED BY content.staff_members.id;


--
-- Name: testimonials; Type: TABLE; Schema: content; Owner: -
--

CREATE TABLE content.testimonials (
    id bigint NOT NULL,
    quote text NOT NULL,
    author_name text NOT NULL,
    author_title text NOT NULL,
    image_file_name character varying,
    image_content_type character varying,
    image_file_size integer,
    image_updated_at timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: testimonials_id_seq; Type: SEQUENCE; Schema: content; Owner: -
--

CREATE SEQUENCE content.testimonials_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: testimonials_id_seq; Type: SEQUENCE OWNED BY; Schema: content; Owner: -
--

ALTER SEQUENCE content.testimonials_id_seq OWNED BY content.testimonials.id;


--
-- Name: users; Type: TABLE; Schema: content; Owner: -
--

CREATE TABLE content.users (
    id integer NOT NULL,
    email character varying DEFAULT ''::character varying NOT NULL,
    encrypted_password character varying DEFAULT ''::character varying NOT NULL,
    reset_password_token character varying,
    reset_password_sent_at timestamp without time zone,
    remember_created_at timestamp without time zone,
    sign_in_count integer DEFAULT 0 NOT NULL,
    current_sign_in_at timestamp without time zone,
    last_sign_in_at timestamp without time zone,
    current_sign_in_ip character varying,
    last_sign_in_ip character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: content; Owner: -
--

CREATE SEQUENCE content.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: content; Owner: -
--

ALTER SEQUENCE content.users_id_seq OWNED BY content.users.id;


--
-- Name: unused_indexes; Type: VIEW; Schema: maintenance; Owner: -
--

CREATE VIEW maintenance.unused_indexes AS
 SELECT s.schemaname,
    s.relname AS tablename,
    s.indexrelname AS indexname,
    pg_relation_size((s.indexrelid)::regclass) AS index_size
   FROM (pg_stat_user_indexes s
     JOIN pg_index i ON ((s.indexrelid = i.indexrelid)))
  WHERE ((s.idx_scan = 0) AND (0 <> ALL ((i.indkey)::smallint[])) AND (NOT i.indisunique) AND (NOT (EXISTS ( SELECT 1
           FROM pg_constraint c
          WHERE (c.conindid = s.indexrelid)))))
  ORDER BY (pg_relation_size((s.indexrelid)::regclass)) DESC;


--
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: attributes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.attributes (
    id bigint NOT NULL,
    original_id integer NOT NULL,
    original_type text NOT NULL,
    name text NOT NULL,
    display_name text,
    unit text,
    unit_type text,
    tooltip_text text,
    CONSTRAINT attributes_original_type_check CHECK ((original_type = ANY (ARRAY['Ind'::text, 'Qual'::text, 'Quant'::text])))
);


--
-- Name: TABLE attributes; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.attributes IS 'Merges inds, quals and quants. Readonly table.';


--
-- Name: COLUMN attributes.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.attributes.id IS 'Id is fixed between data updates, unless name changes';


--
-- Name: COLUMN attributes.original_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.attributes.original_id IS 'Id from the original table (inds / quals / quants)';


--
-- Name: COLUMN attributes.original_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.attributes.original_type IS 'Type of the original entity (Ind / Qual / Quant)';


--
-- Name: attributes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.attributes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: attributes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.attributes_id_seq OWNED BY public.attributes.id;


--
-- Name: ind_properties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ind_properties (
    id integer NOT NULL,
    ind_id integer NOT NULL,
    display_name text NOT NULL,
    unit_type text,
    tooltip_text text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    CONSTRAINT ind_properties_unit_type_check CHECK ((unit_type = ANY (ARRAY['currency'::text, 'ratio'::text, 'score'::text, 'unitless'::text])))
);


--
-- Name: COLUMN ind_properties.display_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.ind_properties.display_name IS 'Name of attribute for display';


--
-- Name: COLUMN ind_properties.unit_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.ind_properties.unit_type IS 'Type of unit, e.g. score. One of restricted set of values.';


--
-- Name: COLUMN ind_properties.tooltip_text; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.ind_properties.tooltip_text IS 'Generic tooltip text (lowest precedence)';


--
-- Name: inds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inds (
    id integer NOT NULL,
    name text NOT NULL,
    unit text,
    created_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE inds; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.inds IS 'Attributes classified as inds';


--
-- Name: COLUMN inds.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.inds.name IS 'Attribute short name, e.g. FOREST_500; those literals are referred to in code, therefore should not be changed without notice';


--
-- Name: COLUMN inds.unit; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.inds.unit IS 'Unit in which values for this attribute are given';


--
-- Name: qual_properties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.qual_properties (
    id integer NOT NULL,
    qual_id integer NOT NULL,
    display_name text NOT NULL,
    tooltip_text text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: COLUMN qual_properties.display_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.qual_properties.display_name IS 'Name of attribute for display';


--
-- Name: COLUMN qual_properties.tooltip_text; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.qual_properties.tooltip_text IS 'Generic tooltip text (lowest precedence)';


--
-- Name: quals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quals (
    id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE quals; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.quals IS 'Attributes classified as quals';


--
-- Name: COLUMN quals.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quals.name IS 'Attribute short name, e.g. ZERO_DEFORESTATION; those literals are referred to in code, therefore should not be changed without notice';


--
-- Name: quant_properties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quant_properties (
    id integer NOT NULL,
    quant_id integer NOT NULL,
    display_name text NOT NULL,
    unit_type text,
    tooltip_text text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    CONSTRAINT quant_properties_unit_type_check CHECK ((unit_type = ANY (ARRAY['currency'::text, 'area'::text, 'count'::text, 'volume'::text, 'unitless'::text])))
);


--
-- Name: COLUMN quant_properties.display_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_properties.display_name IS 'Name of attribute for display';


--
-- Name: COLUMN quant_properties.unit_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_properties.unit_type IS 'Type of unit, e.g. count. One of restricted set of values.';


--
-- Name: COLUMN quant_properties.tooltip_text; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_properties.tooltip_text IS 'Generic tooltip text (lowest precedence)';


--
-- Name: quants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quants (
    id integer NOT NULL,
    name text NOT NULL,
    unit text,
    created_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE quants; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.quants IS 'Attributes classified as quants';


--
-- Name: COLUMN quants.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quants.name IS 'Attribute short name, e.g. FOB; those literals are referred to in code, therefore should not be changed without notice';


--
-- Name: COLUMN quants.unit; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quants.unit IS 'Unit in which values for this attribute are given';


--
-- Name: attributes_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.attributes_v AS
 SELECT s.original_id,
    s.original_type,
    s.name,
    s.display_name,
    s.unit,
    s.unit_type,
    s.tooltip_text
   FROM ( SELECT quants.id AS original_id,
            'Quant'::text AS original_type,
            quants.name,
            qp.display_name,
            quants.unit,
            qp.unit_type,
            qp.tooltip_text
           FROM (public.quants
             LEFT JOIN public.quant_properties qp ON ((qp.quant_id = quants.id)))
        UNION ALL
         SELECT inds.id,
            'Ind'::text AS text,
            inds.name,
            ip.display_name,
            inds.unit,
            ip.unit_type,
            ip.tooltip_text
           FROM (public.inds
             LEFT JOIN public.ind_properties ip ON ((ip.ind_id = inds.id)))
        UNION ALL
         SELECT quals.id,
            'Qual'::text AS text,
            quals.name,
            qp.display_name,
            NULL::text AS text,
            NULL::text AS text,
            qp.tooltip_text
           FROM (public.quals
             LEFT JOIN public.qual_properties qp ON ((qp.qual_id = quals.id)))) s;


--
-- Name: carto_layers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.carto_layers (
    id integer NOT NULL,
    contextual_layer_id integer NOT NULL,
    identifier text NOT NULL,
    years integer[],
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    raster_url character varying
);


--
-- Name: TABLE carto_layers; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.carto_layers IS 'Year-specific data layers defined in CartoDB used to display contextual layers.';


--
-- Name: COLUMN carto_layers.identifier; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.carto_layers.identifier IS 'Identifier of the CartoDB named map, e.g. brazil_biomes; unique in scope of contextual layer';


--
-- Name: COLUMN carto_layers.years; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.carto_layers.years IS 'Array of years for which to show this carto layer in scope of contextual layer; empty (NULL) for all years';


--
-- Name: COLUMN carto_layers.raster_url; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.carto_layers.raster_url IS 'Url of raster layer';


--
-- Name: carto_layers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.carto_layers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: carto_layers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.carto_layers_id_seq OWNED BY public.carto_layers.id;


--
-- Name: chart_attributes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chart_attributes (
    id integer NOT NULL,
    chart_id integer NOT NULL,
    "position" integer,
    years integer[],
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    display_name text,
    legend_name text,
    display_type text,
    display_style text,
    state_average boolean DEFAULT false NOT NULL,
    identifier text
);


--
-- Name: TABLE chart_attributes; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.chart_attributes IS 'Attributes (inds/quals/quants) to display in a chart.';


--
-- Name: COLUMN chart_attributes.chart_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.chart_attributes.chart_id IS 'Refence to chart';


--
-- Name: COLUMN chart_attributes."position"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.chart_attributes."position" IS 'Display order in scope of chart';


--
-- Name: COLUMN chart_attributes.years; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.chart_attributes.years IS 'Array of years for which to show this attribute in scope of chart; empty (NULL) for all years';


--
-- Name: COLUMN chart_attributes.display_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.chart_attributes.display_name IS 'Name of attribute for display in chart';


--
-- Name: COLUMN chart_attributes.legend_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.chart_attributes.legend_name IS 'Legend title; you can use {{commodity_name}}, {{company_name}}, {{jurisdiction_name}} and {{year}}';


--
-- Name: COLUMN chart_attributes.display_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.chart_attributes.display_type IS 'Type of display, only used for trajectory deforestation plot in place profiles; e.g. area, line';


--
-- Name: COLUMN chart_attributes.display_style; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.chart_attributes.display_style IS 'Style of display, only used for trajectory deforestation plot in place profiles; e.g. area-pink, area-black, line-dashed-black';


--
-- Name: COLUMN chart_attributes.state_average; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.chart_attributes.state_average IS 'Only used for trajectory deforestation plot in place profiles';


--
-- Name: COLUMN chart_attributes.identifier; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.chart_attributes.identifier IS 'Identifier used to map this chart attribute to a part of code which contains calculation logic';


--
-- Name: chart_attributes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chart_attributes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chart_attributes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chart_attributes_id_seq OWNED BY public.chart_attributes.id;


--
-- Name: chart_inds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chart_inds (
    id integer NOT NULL,
    chart_attribute_id integer NOT NULL,
    ind_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE chart_inds; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.chart_inds IS 'Inds to display in a chart (see chart_attributes.)';


--
-- Name: chart_quals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chart_quals (
    id integer NOT NULL,
    chart_attribute_id integer NOT NULL,
    qual_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE chart_quals; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.chart_quals IS 'Quals to display in a chart (see chart_attributes.)';


--
-- Name: chart_quants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chart_quants (
    id integer NOT NULL,
    chart_attribute_id integer NOT NULL,
    quant_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE chart_quants; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.chart_quants IS 'Quants to display in a chart (see chart_attributes.)';


--
-- Name: chart_attributes_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.chart_attributes_mv AS
 SELECT cha.id,
    cha.chart_id,
    cha."position",
    cha.years,
    COALESCE(NULLIF(cha.display_name, ''::text), NULLIF(a.display_name, ''::text)) AS display_name,
    cha.legend_name,
    cha.display_type,
    cha.display_style,
    cha.state_average,
    cha.identifier,
    a.name,
    a.unit,
    a.tooltip_text,
    a.id AS attribute_id,
    a.original_id,
    a.original_type,
    cha.created_at,
    cha.updated_at
   FROM ((public.chart_quals chq
     JOIN public.chart_attributes cha ON ((cha.id = chq.chart_attribute_id)))
     JOIN public.attributes a ON (((a.original_id = chq.qual_id) AND (a.original_type = 'Qual'::text))))
UNION ALL
 SELECT cha.id,
    cha.chart_id,
    cha."position",
    cha.years,
    COALESCE(NULLIF(cha.display_name, ''::text), NULLIF(a.display_name, ''::text)) AS display_name,
    cha.legend_name,
    cha.display_type,
    cha.display_style,
    cha.state_average,
    cha.identifier,
    a.name,
    a.unit,
    a.tooltip_text,
    a.id AS attribute_id,
    a.original_id,
    a.original_type,
    cha.created_at,
    cha.updated_at
   FROM ((public.chart_quants chq
     JOIN public.chart_attributes cha ON ((cha.id = chq.chart_attribute_id)))
     JOIN public.attributes a ON (((a.original_id = chq.quant_id) AND (a.original_type = 'Quant'::text))))
UNION ALL
 SELECT cha.id,
    cha.chart_id,
    cha."position",
    cha.years,
    COALESCE(NULLIF(cha.display_name, ''::text), NULLIF(a.display_name, ''::text)) AS display_name,
    cha.legend_name,
    cha.display_type,
    cha.display_style,
    cha.state_average,
    cha.identifier,
    a.name,
    a.unit,
    a.tooltip_text,
    a.id AS attribute_id,
    a.original_id,
    a.original_type,
    cha.created_at,
    cha.updated_at
   FROM ((public.chart_inds chi
     JOIN public.chart_attributes cha ON ((cha.id = chi.chart_attribute_id)))
     JOIN public.attributes a ON (((a.original_id = chi.ind_id) AND (a.original_type = 'Ind'::text))))
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW chart_attributes_mv; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON MATERIALIZED VIEW public.chart_attributes_mv IS 'Materialized view which merges chart_inds, chart_quals and chart_quants with chart_attributes.';


--
-- Name: COLUMN chart_attributes_mv.display_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.chart_attributes_mv.display_name IS 'If absent in chart_attributes this is pulled from attributes.';


--
-- Name: chart_inds_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chart_inds_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chart_inds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chart_inds_id_seq OWNED BY public.chart_inds.id;


--
-- Name: chart_node_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chart_node_types (
    id bigint NOT NULL,
    chart_id bigint,
    node_type_id bigint,
    identifier text,
    "position" integer,
    is_total boolean DEFAULT false,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE chart_node_types; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.chart_node_types IS 'Node types to display in a chart.';


--
-- Name: COLUMN chart_node_types.chart_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.chart_node_types.chart_id IS 'Refence to chart';


--
-- Name: COLUMN chart_node_types.node_type_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.chart_node_types.node_type_id IS 'Refence to node type';


--
-- Name: COLUMN chart_node_types.identifier; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.chart_node_types.identifier IS 'Identifier used to map this chart node type to a part of code which contains calculation logic';


--
-- Name: COLUMN chart_node_types."position"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.chart_node_types."position" IS 'Display order in scope of chart; required when more than one';


--
-- Name: chart_node_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chart_node_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chart_node_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chart_node_types_id_seq OWNED BY public.chart_node_types.id;


--
-- Name: chart_quals_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chart_quals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chart_quals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chart_quals_id_seq OWNED BY public.chart_quals.id;


--
-- Name: chart_quants_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chart_quants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chart_quants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chart_quants_id_seq OWNED BY public.chart_quants.id;


--
-- Name: charts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.charts (
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
-- Name: TABLE charts; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.charts IS 'Charts on profile pages.';


--
-- Name: COLUMN charts.parent_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.charts.parent_id IS 'Self-reference to parent used to define complex charts, e.g. table with values in tabs';


--
-- Name: COLUMN charts.identifier; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.charts.identifier IS 'Identifier used to map this chart to a part of code which contains calculation logic';


--
-- Name: COLUMN charts.title; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.charts.title IS 'Title of chart for display; you can use {{commodity_name}}, {{company_name}}, {{jurisdiction_name}} and {{year}}';


--
-- Name: COLUMN charts."position"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.charts."position" IS 'Display order in scope of profile';


--
-- Name: charts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.charts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: charts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.charts_id_seq OWNED BY public.charts.id;


--
-- Name: commodities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.commodities (
    id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE commodities; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.commodities IS 'Commodities in supply chains, such as soy or beef';


--
-- Name: COLUMN commodities.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.commodities.name IS 'Commodity name; unique across commodities';


--
-- Name: commodities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.commodities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: commodities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.commodities_id_seq OWNED BY public.commodities.id;


--
-- Name: ind_commodity_properties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ind_commodity_properties (
    id bigint NOT NULL,
    tooltip_text text NOT NULL,
    commodity_id bigint NOT NULL,
    ind_id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE ind_commodity_properties; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.ind_commodity_properties IS 'Commodity specific properties for ind';


--
-- Name: COLUMN ind_commodity_properties.tooltip_text; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.ind_commodity_properties.tooltip_text IS 'Commodity-specific tooltips are the third-most specific tooltips that can be defined after context and country-specific tooltips; in absence of a commodity-specific tooltip, a generic tooltip will be used.';


--
-- Name: COLUMN ind_commodity_properties.commodity_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.ind_commodity_properties.commodity_id IS 'Reference to commodity';


--
-- Name: COLUMN ind_commodity_properties.ind_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.ind_commodity_properties.ind_id IS 'Reference to ind';


--
-- Name: qual_commodity_properties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.qual_commodity_properties (
    id bigint NOT NULL,
    tooltip_text text NOT NULL,
    commodity_id bigint NOT NULL,
    qual_id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE qual_commodity_properties; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.qual_commodity_properties IS 'Commodity specific properties for qual';


--
-- Name: COLUMN qual_commodity_properties.tooltip_text; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.qual_commodity_properties.tooltip_text IS 'Commodity-specific tooltips are the third-most specific tooltips that can be defined after context and country-specific tooltips; in absence of a commodity-specific tooltip, a generic tooltip will be used.';


--
-- Name: COLUMN qual_commodity_properties.commodity_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.qual_commodity_properties.commodity_id IS 'Reference to commodity';


--
-- Name: COLUMN qual_commodity_properties.qual_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.qual_commodity_properties.qual_id IS 'Reference to qual';


--
-- Name: quant_commodity_properties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quant_commodity_properties (
    id bigint NOT NULL,
    tooltip_text text NOT NULL,
    commodity_id bigint NOT NULL,
    quant_id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE quant_commodity_properties; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.quant_commodity_properties IS 'Commodity specific properties for quant';


--
-- Name: COLUMN quant_commodity_properties.tooltip_text; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_commodity_properties.tooltip_text IS 'Commodity-specific tooltips are the third-most specific tooltips that can be defined after context and country-specific tooltips; in absence of a commodity-specific tooltip, a generic tooltip will be used.';


--
-- Name: COLUMN quant_commodity_properties.commodity_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_commodity_properties.commodity_id IS 'Reference to commodity';


--
-- Name: COLUMN quant_commodity_properties.quant_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_commodity_properties.quant_id IS 'Reference to quant';


--
-- Name: commodity_attribute_properties_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.commodity_attribute_properties_mv AS
 SELECT qual_commodity_properties.id,
    qual_commodity_properties.commodity_id,
    qual_commodity_properties.tooltip_text,
    qual_commodity_properties.qual_id,
    '-1'::integer AS ind_id,
    '-1'::integer AS quant_id
   FROM public.qual_commodity_properties
UNION ALL
 SELECT quant_commodity_properties.id,
    quant_commodity_properties.commodity_id,
    quant_commodity_properties.tooltip_text,
    '-1'::integer AS qual_id,
    '-1'::integer AS ind_id,
    quant_commodity_properties.quant_id
   FROM public.quant_commodity_properties
UNION ALL
 SELECT ind_commodity_properties.id,
    ind_commodity_properties.commodity_id,
    ind_commodity_properties.tooltip_text,
    '-1'::integer AS qual_id,
    ind_commodity_properties.ind_id,
    '-1'::integer AS quant_id
   FROM public.ind_commodity_properties
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW commodity_attribute_properties_mv; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON MATERIALIZED VIEW public.commodity_attribute_properties_mv IS 'Materialized view combining commodity specific properties for inds, quals and quants.';


--
-- Name: COLUMN commodity_attribute_properties_mv.commodity_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.commodity_attribute_properties_mv.commodity_id IS 'Reference to commodity';


--
-- Name: COLUMN commodity_attribute_properties_mv.tooltip_text; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.commodity_attribute_properties_mv.tooltip_text IS 'Tooltip text';


--
-- Name: COLUMN commodity_attribute_properties_mv.qual_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.commodity_attribute_properties_mv.qual_id IS 'Reference to qual';


--
-- Name: COLUMN commodity_attribute_properties_mv.ind_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.commodity_attribute_properties_mv.ind_id IS 'Reference to ind';


--
-- Name: COLUMN commodity_attribute_properties_mv.quant_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.commodity_attribute_properties_mv.quant_id IS 'Reference to quant';


--
-- Name: ind_context_properties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ind_context_properties (
    id bigint NOT NULL,
    tooltip_text text NOT NULL,
    context_id bigint NOT NULL,
    ind_id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE ind_context_properties; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.ind_context_properties IS 'Context specific properties for ind (like tooltip text)';


--
-- Name: COLUMN ind_context_properties.tooltip_text; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.ind_context_properties.tooltip_text IS 'Context-specific tooltips are the most specific tooltips that can be defined; in absence of a context-specific tooltip, a country-specific tooltip will be used (if any).';


--
-- Name: COLUMN ind_context_properties.context_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.ind_context_properties.context_id IS 'Reference to context';


--
-- Name: COLUMN ind_context_properties.ind_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.ind_context_properties.ind_id IS 'Reference to ind';


--
-- Name: qual_context_properties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.qual_context_properties (
    id bigint NOT NULL,
    tooltip_text text NOT NULL,
    context_id bigint NOT NULL,
    qual_id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE qual_context_properties; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.qual_context_properties IS 'Context specific properties for qual (like tooltip text)';


--
-- Name: COLUMN qual_context_properties.tooltip_text; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.qual_context_properties.tooltip_text IS 'Context-specific tooltips are the most specific tooltips that can be defined; in absence of a context-specific tooltip, a country-specific tooltip will be used (if any).';


--
-- Name: COLUMN qual_context_properties.context_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.qual_context_properties.context_id IS 'Reference to context';


--
-- Name: COLUMN qual_context_properties.qual_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.qual_context_properties.qual_id IS 'Reference to qual';


--
-- Name: quant_context_properties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quant_context_properties (
    id bigint NOT NULL,
    tooltip_text text NOT NULL,
    context_id bigint NOT NULL,
    quant_id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE quant_context_properties; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.quant_context_properties IS 'Context specific properties for quant (like tooltip text)';


--
-- Name: COLUMN quant_context_properties.tooltip_text; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_context_properties.tooltip_text IS 'Context-specific tooltips are the most specific tooltips that can be defined; in absence of a context-specific tooltip, a country-specific tooltip will be used (if any).';


--
-- Name: COLUMN quant_context_properties.context_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_context_properties.context_id IS 'Reference to context';


--
-- Name: COLUMN quant_context_properties.quant_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_context_properties.quant_id IS 'Reference to quant';


--
-- Name: context_attribute_properties_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.context_attribute_properties_mv AS
 SELECT qual_context_properties.id,
    qual_context_properties.context_id,
    qual_context_properties.tooltip_text,
    qual_context_properties.qual_id,
    '-1'::integer AS ind_id,
    '-1'::integer AS quant_id
   FROM public.qual_context_properties
UNION ALL
 SELECT quant_context_properties.id,
    quant_context_properties.context_id,
    quant_context_properties.tooltip_text,
    '-1'::integer AS qual_id,
    '-1'::integer AS ind_id,
    quant_context_properties.quant_id
   FROM public.quant_context_properties
UNION ALL
 SELECT ind_context_properties.id,
    ind_context_properties.context_id,
    ind_context_properties.tooltip_text,
    '-1'::integer AS qual_id,
    ind_context_properties.ind_id,
    '-1'::integer AS quant_id
   FROM public.ind_context_properties
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW context_attribute_properties_mv; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON MATERIALIZED VIEW public.context_attribute_properties_mv IS 'Materialized view combining context specific properties for inds, quals and quants.';


--
-- Name: COLUMN context_attribute_properties_mv.context_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.context_attribute_properties_mv.context_id IS 'Reference to context';


--
-- Name: COLUMN context_attribute_properties_mv.tooltip_text; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.context_attribute_properties_mv.tooltip_text IS 'Tooltip text';


--
-- Name: COLUMN context_attribute_properties_mv.qual_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.context_attribute_properties_mv.qual_id IS 'Reference to qual';


--
-- Name: COLUMN context_attribute_properties_mv.ind_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.context_attribute_properties_mv.ind_id IS 'Reference to ind';


--
-- Name: COLUMN context_attribute_properties_mv.quant_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.context_attribute_properties_mv.quant_id IS 'Reference to quant';


--
-- Name: context_node_type_properties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.context_node_type_properties (
    id integer NOT NULL,
    context_node_type_id integer NOT NULL,
    column_group integer NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    is_geo_column boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    is_choropleth_disabled boolean DEFAULT false NOT NULL,
    role character varying NOT NULL,
    prefix text NOT NULL,
    geometry_context_node_type_id integer,
    CONSTRAINT context_node_type_properties_role_check CHECK (((role)::text = ANY (ARRAY[('source'::character varying)::text, ('exporter'::character varying)::text, ('importer'::character varying)::text, ('destination'::character varying)::text])))
);


--
-- Name: COLUMN context_node_type_properties.column_group; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.context_node_type_properties.column_group IS 'Zero-based number of sankey column in which to display nodes of this type';


--
-- Name: COLUMN context_node_type_properties.is_default; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.context_node_type_properties.is_default IS 'When set, show this node type as default (only use for one)';


--
-- Name: COLUMN context_node_type_properties.is_geo_column; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.context_node_type_properties.is_geo_column IS 'When set, show nodes on map';


--
-- Name: COLUMN context_node_type_properties.is_choropleth_disabled; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.context_node_type_properties.is_choropleth_disabled IS 'When set, do not display the map choropleth';


--
-- Name: COLUMN context_node_type_properties.role; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.context_node_type_properties.role IS 'A grouping which defines in which filtering panel to display nodes';


--
-- Name: COLUMN context_node_type_properties.prefix; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.context_node_type_properties.prefix IS 'Used to construct the summary sentence of selection criteria';


--
-- Name: COLUMN context_node_type_properties.geometry_context_node_type_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.context_node_type_properties.geometry_context_node_type_id IS 'Use for geo columns, when geometry is to be taken from another node type (e.g. logistics hub -> municipality)';


--
-- Name: context_node_type_properties_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.context_node_type_properties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: context_node_type_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.context_node_type_properties_id_seq OWNED BY public.context_node_type_properties.id;


--
-- Name: context_node_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.context_node_types (
    id integer NOT NULL,
    context_id integer NOT NULL,
    node_type_id integer NOT NULL,
    column_position integer NOT NULL,
    created_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE context_node_types; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.context_node_types IS 'Node types represented in supply chains per context. The value of column_position is interpreted as position in flows.path.';


--
-- Name: COLUMN context_node_types.column_position; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.context_node_types.column_position IS 'Index of node of this type in flows.path';


--
-- Name: context_node_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.context_node_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: context_node_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.context_node_types_id_seq OWNED BY public.context_node_types.id;


--
-- Name: context_properties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.context_properties (
    id integer NOT NULL,
    context_id integer NOT NULL,
    default_basemap text,
    is_disabled boolean DEFAULT false NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    is_subnational boolean DEFAULT false NOT NULL,
    is_highlighted boolean
);


--
-- Name: TABLE context_properties; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.context_properties IS 'Visualisation properties of a context (one row per context)';


--
-- Name: COLUMN context_properties.default_basemap; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.context_properties.default_basemap IS 'Default basemap for this context, e.g. satellite';


--
-- Name: COLUMN context_properties.is_disabled; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.context_properties.is_disabled IS 'When set, do not show this context';


--
-- Name: COLUMN context_properties.is_default; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.context_properties.is_default IS 'When set, show this context as default (only use for one)';


--
-- Name: COLUMN context_properties.is_subnational; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.context_properties.is_subnational IS 'When set, show indication that sub-national level data is available';


--
-- Name: COLUMN context_properties.is_highlighted; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.context_properties.is_highlighted IS 'When set, shows the context on the context picker suggestions';


--
-- Name: context_properties_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.context_properties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: context_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.context_properties_id_seq OWNED BY public.context_properties.id;


--
-- Name: contexts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contexts (
    id integer NOT NULL,
    country_id integer NOT NULL,
    commodity_id integer NOT NULL,
    years integer[],
    default_year integer,
    created_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE contexts; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.contexts IS 'Country-commodity combinations.';


--
-- Name: COLUMN contexts.years; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.contexts.years IS 'Years for which country-commodity data is present; empty (NULL) for all years';


--
-- Name: COLUMN contexts.default_year; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.contexts.default_year IS 'Default year for this context';


--
-- Name: contexts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.contexts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contexts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.contexts_id_seq OWNED BY public.contexts.id;


--
-- Name: countries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.countries (
    id integer NOT NULL,
    name text NOT NULL,
    iso2 text NOT NULL,
    created_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE countries; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.countries IS 'Countries (source)';


--
-- Name: COLUMN countries.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.countries.name IS 'Country name';


--
-- Name: COLUMN countries.iso2; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.countries.iso2 IS '2-letter ISO code';


--
-- Name: node_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.node_types (
    id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE node_types; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.node_types IS 'List of types of nodes in the system, e.g. MUNICIPALITY or EXPORTER. Those literals are referred to in code, therefore should not be changed without notice.';


--
-- Name: COLUMN node_types.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.node_types.name IS 'Name of node type, spelt in capital letters; unique across node types';


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id integer NOT NULL,
    context_node_type_id integer NOT NULL,
    name text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    main_topojson_path character varying,
    main_topojson_root character varying,
    adm_1_name character varying,
    adm_1_topojson_path character varying,
    adm_1_topojson_root character varying,
    adm_2_name character varying,
    adm_2_topojson_path character varying,
    adm_2_topojson_root character varying,
    CONSTRAINT profiles_name_check CHECK ((name = ANY (ARRAY['actor'::text, 'place'::text, 'country'::text])))
);


--
-- Name: TABLE profiles; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.profiles IS 'Context-specific profiles';


--
-- Name: COLUMN profiles.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.name IS 'Profile name, either actor, place or country.';


--
-- Name: COLUMN profiles.main_topojson_path; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.main_topojson_path IS 'Path must be relative to https://github.com/Vizzuality/trase/tree/develop/frontend/public/vector_layers and start with /';


--
-- Name: COLUMN profiles.main_topojson_root; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.main_topojson_root IS 'Path within the TopoJSON file where geometries are contained';


--
-- Name: COLUMN profiles.adm_1_topojson_path; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.adm_1_topojson_path IS 'Path must be relative to https://github.com/Vizzuality/trase/tree/develop/frontend/public/vector_layers and start with /';


--
-- Name: COLUMN profiles.adm_1_topojson_root; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.adm_1_topojson_root IS 'Path within the TopoJSON file where geometries are contained';


--
-- Name: COLUMN profiles.adm_2_topojson_path; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.adm_2_topojson_path IS 'Path must be relative to https://github.com/Vizzuality/trase/tree/develop/frontend/public/vector_layers and start with /';


--
-- Name: COLUMN profiles.adm_2_topojson_root; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.adm_2_topojson_root IS 'Path within the TopoJSON file where geometries are contained';


--
-- Name: contexts_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.contexts_mv AS
 WITH context_node_types_with_props AS (
         SELECT context_node_types.context_id,
            context_node_types.node_type_id,
            context_node_types.column_position,
            node_types.name AS node_type,
            context_node_type_properties.role,
            context_node_type_properties.column_group,
            context_node_type_properties.is_default
           FROM ((public.context_node_types
             JOIN public.context_node_type_properties ON ((context_node_types.id = context_node_type_properties.context_node_type_id)))
             JOIN public.node_types ON ((context_node_types.node_type_id = node_types.id)))
        )
 SELECT contexts.id,
    contexts.country_id,
    contexts.commodity_id,
    contexts.years,
    contexts.default_year,
    commodities.name AS commodity_name,
    countries.name AS country_name,
    countries.iso2,
    context_properties.default_basemap,
    context_properties.is_disabled,
    context_properties.is_default,
    context_properties.is_subnational,
    context_properties.is_highlighted,
    COALESCE((contexts_with_profiles.id IS NOT NULL), false) AS has_profiles,
    node_types_by_role.node_types_by_role,
    context_node_types_agg.node_types_by_name,
    context_node_types_agg.node_types
   FROM ((((((public.contexts
     JOIN public.commodities ON ((contexts.commodity_id = commodities.id)))
     JOIN public.countries ON ((contexts.country_id = countries.id)))
     JOIN public.context_properties ON ((context_properties.context_id = contexts.id)))
     JOIN ( SELECT context_node_types_with_props.context_id,
            jsonb_object_agg(context_node_types_with_props.role, context_node_types_with_props.node_type_id) AS node_types_by_role
           FROM context_node_types_with_props
          WHERE (context_node_types_with_props.role IS NOT NULL)
          GROUP BY context_node_types_with_props.context_id) node_types_by_role ON ((node_types_by_role.context_id = contexts.id)))
     JOIN ( SELECT context_node_types_with_props.context_id,
            jsonb_object_agg(context_node_types_with_props.node_type, context_node_types_with_props.node_type_id) AS node_types_by_name,
            jsonb_agg(jsonb_build_object('node_type_id'::text, context_node_types_with_props.node_type_id, 'is_default'::text, context_node_types_with_props.is_default, 'column_group'::text, context_node_types_with_props.column_group, 'role'::text, context_node_types_with_props.role, 'node_type'::text, context_node_types_with_props.node_type) ORDER BY context_node_types_with_props.column_position) AS node_types
           FROM context_node_types_with_props
          GROUP BY context_node_types_with_props.context_id) context_node_types_agg ON ((context_node_types_agg.context_id = contexts.id)))
     LEFT JOIN ( SELECT DISTINCT context_node_types.context_id AS id
           FROM (public.context_node_types
             JOIN public.profiles ON ((context_node_types.id = profiles.context_node_type_id)))) contexts_with_profiles ON ((contexts_with_profiles.id = contexts.id)))
  WITH NO DATA;


--
-- Name: contextual_layers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contextual_layers (
    id integer NOT NULL,
    context_id integer NOT NULL,
    title text NOT NULL,
    identifier text NOT NULL,
    "position" integer NOT NULL,
    tooltip_text text,
    is_default boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    legend text
);


--
-- Name: TABLE contextual_layers; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.contextual_layers IS 'Additional layers shown on map coming from CartoDB';


--
-- Name: COLUMN contextual_layers.title; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.contextual_layers.title IS 'Title of layer for display';


--
-- Name: COLUMN contextual_layers.identifier; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.contextual_layers.identifier IS 'Identifier of layer, e.g. brazil_biomes';


--
-- Name: COLUMN contextual_layers."position"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.contextual_layers."position" IS 'Display order in scope of context';


--
-- Name: COLUMN contextual_layers.tooltip_text; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.contextual_layers.tooltip_text IS 'Tooltip text';


--
-- Name: COLUMN contextual_layers.is_default; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.contextual_layers.is_default IS 'When set, show this layer by default';


--
-- Name: COLUMN contextual_layers.legend; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.contextual_layers.legend IS 'Legend as HTML snippet';


--
-- Name: contextual_layers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.contextual_layers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contextual_layers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.contextual_layers_id_seq OWNED BY public.contextual_layers.id;


--
-- Name: countries_com_trade_aggregated_indicators; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.countries_com_trade_aggregated_indicators (
    quantity double precision,
    value double precision,
    quantity_rank integer,
    value_rank integer,
    commodity_id integer NOT NULL,
    year smallint NOT NULL,
    iso2 text NOT NULL,
    activity text NOT NULL
);


--
-- Name: countries_com_trade_indicators; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.countries_com_trade_indicators (
    "false" bigint NOT NULL,
    raw_quantity double precision,
    quantity double precision,
    value double precision,
    commodity_id integer,
    year smallint,
    iso3 text,
    iso2 text,
    commodity_code text,
    activity text,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: countries_com_trade_aggregated_indicators_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.countries_com_trade_aggregated_indicators_v AS
 SELECT sum(countries_com_trade_indicators.quantity) AS quantity,
    sum(countries_com_trade_indicators.value) AS value,
    rank() OVER (PARTITION BY countries_com_trade_indicators.year, countries_com_trade_indicators.commodity_id, countries_com_trade_indicators.activity ORDER BY (sum(countries_com_trade_indicators.quantity)) DESC) AS quantity_rank,
    rank() OVER (PARTITION BY countries_com_trade_indicators.year, countries_com_trade_indicators.commodity_id, countries_com_trade_indicators.activity ORDER BY (sum(countries_com_trade_indicators.value)) DESC) AS value_rank,
    countries_com_trade_indicators.commodity_id,
    countries_com_trade_indicators.year,
    countries_com_trade_indicators.iso2,
    countries_com_trade_indicators.activity
   FROM public.countries_com_trade_indicators
  GROUP BY countries_com_trade_indicators.commodity_id, countries_com_trade_indicators.year, countries_com_trade_indicators.iso2, countries_com_trade_indicators.activity;


--
-- Name: countries_com_trade_indicators_false_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.countries_com_trade_indicators_false_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: countries_com_trade_indicators_false_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.countries_com_trade_indicators_false_seq OWNED BY public.countries_com_trade_indicators."false";


--
-- Name: countries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.countries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: countries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.countries_id_seq OWNED BY public.countries.id;


--
-- Name: countries_wb_indicators; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.countries_wb_indicators (
    id bigint NOT NULL,
    iso3 text NOT NULL,
    year integer NOT NULL,
    name text NOT NULL,
    value double precision NOT NULL,
    rank integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    iso2 text NOT NULL
);


--
-- Name: countries_wb_indicators_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.countries_wb_indicators_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: countries_wb_indicators_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.countries_wb_indicators_id_seq OWNED BY public.countries_wb_indicators.id;


--
-- Name: ind_country_properties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ind_country_properties (
    id bigint NOT NULL,
    tooltip_text text NOT NULL,
    country_id bigint NOT NULL,
    ind_id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE ind_country_properties; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.ind_country_properties IS 'Country specific properties for ind';


--
-- Name: COLUMN ind_country_properties.tooltip_text; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.ind_country_properties.tooltip_text IS 'Country-specific tooltips are the second-most specific tooltips that can be defined after context-specific tooltips; in absence of a country-specific tooltip, a commodity-specific tooltip will be used (if any).';


--
-- Name: COLUMN ind_country_properties.country_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.ind_country_properties.country_id IS 'Reference to country';


--
-- Name: COLUMN ind_country_properties.ind_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.ind_country_properties.ind_id IS 'Reference to ind';


--
-- Name: qual_country_properties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.qual_country_properties (
    id bigint NOT NULL,
    tooltip_text text NOT NULL,
    country_id bigint NOT NULL,
    qual_id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE qual_country_properties; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.qual_country_properties IS 'Country specific properties for qual';


--
-- Name: COLUMN qual_country_properties.tooltip_text; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.qual_country_properties.tooltip_text IS 'Country-specific tooltips are the second-most specific tooltips that can be defined after context-specific tooltips; in absence of a country-specific tooltip, a commodity-specific tooltip will be used (if any).';


--
-- Name: COLUMN qual_country_properties.country_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.qual_country_properties.country_id IS 'Reference to country';


--
-- Name: COLUMN qual_country_properties.qual_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.qual_country_properties.qual_id IS 'Reference to qual';


--
-- Name: quant_country_properties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quant_country_properties (
    id bigint NOT NULL,
    tooltip_text text NOT NULL,
    country_id bigint NOT NULL,
    quant_id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE quant_country_properties; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.quant_country_properties IS 'Country specific properties for quant';


--
-- Name: COLUMN quant_country_properties.tooltip_text; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_country_properties.tooltip_text IS 'Country-specific tooltips are the second-most specific tooltips that can be defined after context-specific tooltips; in absence of a country-specific tooltip, a commodity-specific tooltip will be used (if any).';


--
-- Name: COLUMN quant_country_properties.country_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_country_properties.country_id IS 'Reference to country';


--
-- Name: COLUMN quant_country_properties.quant_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_country_properties.quant_id IS 'Reference to quant';


--
-- Name: country_attribute_properties_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.country_attribute_properties_mv AS
 SELECT qual_country_properties.id,
    qual_country_properties.country_id,
    qual_country_properties.tooltip_text,
    qual_country_properties.qual_id,
    '-1'::integer AS ind_id,
    '-1'::integer AS quant_id
   FROM public.qual_country_properties
UNION ALL
 SELECT quant_country_properties.id,
    quant_country_properties.country_id,
    quant_country_properties.tooltip_text,
    '-1'::integer AS qual_id,
    '-1'::integer AS ind_id,
    quant_country_properties.quant_id
   FROM public.quant_country_properties
UNION ALL
 SELECT ind_country_properties.id,
    ind_country_properties.country_id,
    ind_country_properties.tooltip_text,
    '-1'::integer AS qual_id,
    ind_country_properties.ind_id,
    '-1'::integer AS quant_id
   FROM public.ind_country_properties
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW country_attribute_properties_mv; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON MATERIALIZED VIEW public.country_attribute_properties_mv IS 'Materialized view combining country specific properties for inds, quals and quants.';


--
-- Name: COLUMN country_attribute_properties_mv.country_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.country_attribute_properties_mv.country_id IS 'Reference to country';


--
-- Name: COLUMN country_attribute_properties_mv.tooltip_text; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.country_attribute_properties_mv.tooltip_text IS 'Tooltip text';


--
-- Name: COLUMN country_attribute_properties_mv.qual_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.country_attribute_properties_mv.qual_id IS 'Reference to qual';


--
-- Name: COLUMN country_attribute_properties_mv.ind_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.country_attribute_properties_mv.ind_id IS 'Reference to ind';


--
-- Name: COLUMN country_attribute_properties_mv.quant_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.country_attribute_properties_mv.quant_id IS 'Reference to quant';


--
-- Name: country_properties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.country_properties (
    id integer NOT NULL,
    country_id integer NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    zoom integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    annotation_position_x_pos double precision,
    annotation_position_y_pos double precision
);


--
-- Name: COLUMN country_properties.latitude; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.country_properties.latitude IS 'Country latitide';


--
-- Name: COLUMN country_properties.longitude; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.country_properties.longitude IS 'Country longitude';


--
-- Name: COLUMN country_properties.zoom; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.country_properties.zoom IS 'Zoom level (0-18)';


--
-- Name: COLUMN country_properties.annotation_position_x_pos; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.country_properties.annotation_position_x_pos IS 'X position (in coordinates) where the country''s label is displayed on the explore page';


--
-- Name: COLUMN country_properties.annotation_position_y_pos; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.country_properties.annotation_position_y_pos IS 'Y position (in coordinates) where the country''s label is displayed on the explore page';


--
-- Name: country_properties_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.country_properties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: country_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.country_properties_id_seq OWNED BY public.country_properties.id;


--
-- Name: dashboard_template_commodities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dashboard_template_commodities (
    id bigint NOT NULL,
    dashboard_template_id integer,
    commodity_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: dashboard_template_commodities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dashboard_template_commodities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dashboard_template_commodities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dashboard_template_commodities_id_seq OWNED BY public.dashboard_template_commodities.id;


--
-- Name: dashboard_template_companies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dashboard_template_companies (
    id bigint NOT NULL,
    dashboard_template_id integer,
    node_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: dashboard_template_companies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dashboard_template_companies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dashboard_template_companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dashboard_template_companies_id_seq OWNED BY public.dashboard_template_companies.id;


--
-- Name: dashboard_template_countries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dashboard_template_countries (
    id bigint NOT NULL,
    dashboard_template_id integer,
    country_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: dashboard_template_countries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dashboard_template_countries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dashboard_template_countries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dashboard_template_countries_id_seq OWNED BY public.dashboard_template_countries.id;


--
-- Name: dashboard_template_destinations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dashboard_template_destinations (
    id bigint NOT NULL,
    dashboard_template_id integer,
    node_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: dashboard_template_destinations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dashboard_template_destinations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dashboard_template_destinations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dashboard_template_destinations_id_seq OWNED BY public.dashboard_template_destinations.id;


--
-- Name: dashboard_template_sources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dashboard_template_sources (
    id bigint NOT NULL,
    dashboard_template_id integer,
    node_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: dashboard_template_sources_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dashboard_template_sources_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dashboard_template_sources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dashboard_template_sources_id_seq OWNED BY public.dashboard_template_sources.id;


--
-- Name: dashboard_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dashboard_templates (
    id bigint NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    image_file_name character varying,
    image_content_type character varying,
    image_file_size integer,
    image_updated_at timestamp without time zone,
    category character varying
);


--
-- Name: dashboard_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dashboard_templates_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dashboard_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dashboard_templates_id_seq OWNED BY public.dashboard_templates.id;


--
-- Name: dashboards_attribute_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dashboards_attribute_groups (
    id bigint NOT NULL,
    name text NOT NULL,
    "position" integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE dashboards_attribute_groups; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.dashboards_attribute_groups IS 'Groups attributes (inds/quals/quants) to display on dashboards wizard';


--
-- Name: COLUMN dashboards_attribute_groups.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_attribute_groups.name IS 'Name for display';


--
-- Name: COLUMN dashboards_attribute_groups."position"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_attribute_groups."position" IS 'Display order';


--
-- Name: dashboards_attribute_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dashboards_attribute_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dashboards_attribute_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dashboards_attribute_groups_id_seq OWNED BY public.dashboards_attribute_groups.id;


--
-- Name: dashboards_attributes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dashboards_attributes (
    id bigint NOT NULL,
    dashboards_attribute_group_id bigint NOT NULL,
    "position" integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE dashboards_attributes; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.dashboards_attributes IS 'Attributes (inds/quals/quants) available in dashboards';


--
-- Name: COLUMN dashboards_attributes."position"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_attributes."position" IS 'Display order in scope of group';


--
-- Name: dashboards_attributes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dashboards_attributes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dashboards_attributes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dashboards_attributes_id_seq OWNED BY public.dashboards_attributes.id;


--
-- Name: dashboards_inds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dashboards_inds (
    id bigint NOT NULL,
    dashboards_attribute_id bigint NOT NULL,
    ind_id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE dashboards_inds; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.dashboards_inds IS 'Inds available in dashboards (see dashboards_attributes.)';


--
-- Name: dashboards_quals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dashboards_quals (
    id bigint NOT NULL,
    dashboards_attribute_id bigint NOT NULL,
    qual_id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE dashboards_quals; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.dashboards_quals IS 'Quals available in dashboards (see dashboards_attributes.)';


--
-- Name: dashboards_quants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dashboards_quants (
    id bigint NOT NULL,
    dashboards_attribute_id bigint NOT NULL,
    quant_id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE dashboards_quants; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.dashboards_quants IS 'Quants available in dashboards (see dashboards_attributes.)';


--
-- Name: dashboards_attributes_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.dashboards_attributes_mv AS
 SELECT da.id,
    da.dashboards_attribute_group_id,
    da."position",
    a.id AS attribute_id
   FROM ((public.dashboards_inds di
     JOIN public.dashboards_attributes da ON ((da.id = di.dashboards_attribute_id)))
     JOIN public.attributes a ON (((a.original_id = di.ind_id) AND (a.original_type = 'Ind'::text))))
UNION ALL
 SELECT da.id,
    da.dashboards_attribute_group_id,
    da."position",
    a.id AS attribute_id
   FROM ((public.dashboards_quals dq
     JOIN public.dashboards_attributes da ON ((da.id = dq.dashboards_attribute_id)))
     JOIN public.attributes a ON (((a.original_id = dq.qual_id) AND (a.original_type = 'Qual'::text))))
UNION ALL
 SELECT da.id,
    da.dashboards_attribute_group_id,
    da."position",
    a.id AS attribute_id
   FROM ((public.dashboards_quants dq
     JOIN public.dashboards_attributes da ON ((da.id = dq.dashboards_attribute_id)))
     JOIN public.attributes a ON (((a.original_id = dq.quant_id) AND (a.original_type = 'Quant'::text))))
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW dashboards_attributes_mv; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON MATERIALIZED VIEW public.dashboards_attributes_mv IS 'Materialized view which merges dashboards_inds, dashboards_quals and dashboards_quants with dashboards_attributes.';


--
-- Name: COLUMN dashboards_attributes_mv.attribute_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_attributes_mv.attribute_id IS 'References the unique id in attributes.';


--
-- Name: dashboards_commodities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dashboards_commodities (
    id integer NOT NULL,
    country_id integer NOT NULL,
    node_id integer NOT NULL,
    year smallint NOT NULL,
    name text,
    name_tsvector tsvector,
    profile text
);


--
-- Name: TABLE dashboards_commodities; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.dashboards_commodities IS 'Materialized table used for listing commodities in tool search panels';


--
-- Name: COLUMN dashboards_commodities.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_commodities.id IS 'id of commodity (not unique)';


--
-- Name: COLUMN dashboards_commodities.country_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_commodities.country_id IS 'id of country, from which this commodity is sourced';


--
-- Name: COLUMN dashboards_commodities.node_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_commodities.node_id IS 'id of node, through which this commodity is sourced from this country';


--
-- Name: nodes_with_flows_per_year; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nodes_with_flows_per_year (
    id integer NOT NULL,
    context_id integer NOT NULL,
    country_id integer,
    commodity_id integer,
    node_type_id integer,
    context_node_type_id integer,
    main_id integer,
    column_position smallint,
    year smallint NOT NULL,
    is_unknown boolean,
    name text,
    name_tsvector tsvector,
    node_type text,
    geo_id text
);


--
-- Name: dashboards_commodities_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.dashboards_commodities_v AS
 SELECT DISTINCT nodes.commodity_id AS id,
    nodes.country_id,
    nodes.id AS node_id,
    nodes.year,
    btrim(commodities.name) AS name,
    to_tsvector('simple'::regconfig, COALESCE(btrim(commodities.name), ''::text)) AS name_tsvector,
    profiles.name AS profile
   FROM ((public.nodes_with_flows_per_year nodes
     JOIN public.commodities ON ((commodities.id = nodes.commodity_id)))
     LEFT JOIN public.profiles ON ((nodes.context_node_type_id = profiles.context_node_type_id)))
  WHERE (NOT nodes.is_unknown);


--
-- Name: dashboards_companies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dashboards_companies (
    id integer NOT NULL,
    node_type_id integer,
    context_id integer,
    country_id integer NOT NULL,
    commodity_id integer NOT NULL,
    year smallint NOT NULL,
    name text,
    name_tsvector tsvector,
    node_type text,
    profile text,
    rank_by_year jsonb
);


--
-- Name: flow_quants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.flow_quants (
    id integer NOT NULL,
    flow_id integer NOT NULL,
    quant_id integer NOT NULL,
    value double precision NOT NULL,
    created_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE flow_quants; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.flow_quants IS 'Values of quants for flow';


--
-- Name: COLUMN flow_quants.value; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.flow_quants.value IS 'Numeric value';


--
-- Name: flows; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.flows (
    id integer NOT NULL,
    context_id integer NOT NULL,
    year smallint NOT NULL,
    path integer[] DEFAULT '{}'::integer[],
    created_at timestamp without time zone NOT NULL,
    CONSTRAINT flows_path_length_check CHECK ((public.icount(path) > 3))
);


--
-- Name: TABLE flows; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.flows IS 'Flows of commodities through nodes';


--
-- Name: COLUMN flows.year; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.flows.year IS 'Year';


--
-- Name: COLUMN flows.path; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.flows.path IS 'Array of node ids which constitute the supply chain, where position of node in this array is linked to the value of column_position in context_node_types';


--
-- Name: node_properties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.node_properties (
    id integer NOT NULL,
    node_id integer NOT NULL,
    is_domestic_consumption boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: COLUMN node_properties.is_domestic_consumption; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.node_properties.is_domestic_consumption IS 'When set, assume domestic trade';


--
-- Name: nodes_per_context_ranked_by_volume_per_year_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.nodes_per_context_ranked_by_volume_per_year_mv AS
 SELECT node_volume_per_context_and_year_ranked.context_id,
    node_volume_per_context_and_year_ranked.node_id,
    jsonb_object_agg(node_volume_per_context_and_year_ranked.year, node_volume_per_context_and_year_ranked.rank) AS rank_by_year
   FROM ( SELECT node_volume_per_context_and_year.node_id,
            node_volume_per_context_and_year."position",
            node_volume_per_context_and_year.context_id,
            node_volume_per_context_and_year.year,
            rank() OVER (PARTITION BY node_volume_per_context_and_year."position", node_volume_per_context_and_year.context_id, node_volume_per_context_and_year.year ORDER BY node_volume_per_context_and_year.value DESC) AS rank
           FROM ( SELECT a.node_id,
                    a."position",
                    flows.context_id,
                    flows.year,
                    sum(flow_quants.value) AS value
                   FROM public.flow_quants,
                    public.flows,
                    LATERAL unnest(flows.path) WITH ORDINALITY a(node_id, "position")
                  WHERE ((flow_quants.flow_id = flows.id) AND (flow_quants.quant_id IN ( SELECT quants.id
                           FROM public.quants
                          WHERE (quants.name = 'Volume'::text))))
                  GROUP BY a.node_id, a."position", flows.context_id, flows.year) node_volume_per_context_and_year) node_volume_per_context_and_year_ranked
  GROUP BY node_volume_per_context_and_year_ranked.context_id, node_volume_per_context_and_year_ranked.node_id
  WITH NO DATA;


--
-- Name: dashboards_companies_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.dashboards_companies_v AS
 SELECT nodes.id,
    nodes.node_type_id,
    nodes.context_id,
    nodes.country_id,
    nodes.commodity_id,
    nodes.year,
    nodes.name,
    nodes.name_tsvector,
    nodes.node_type,
    profiles.name AS profile,
    ranked_nodes.rank_by_year
   FROM ((((public.nodes_with_flows_per_year nodes
     JOIN public.node_properties node_props ON ((nodes.id = node_props.node_id)))
     JOIN public.context_node_type_properties cnt_props ON ((nodes.context_node_type_id = cnt_props.context_node_type_id)))
     LEFT JOIN public.profiles ON ((nodes.context_node_type_id = profiles.context_node_type_id)))
     JOIN public.nodes_per_context_ranked_by_volume_per_year_mv ranked_nodes ON (((nodes.context_id = ranked_nodes.context_id) AND (nodes.id = ranked_nodes.node_id))))
  WHERE (((cnt_props.role)::text = ANY (ARRAY[('importer'::character varying)::text, ('exporter'::character varying)::text])) AND (NOT nodes.is_unknown) AND (NOT node_props.is_domestic_consumption) AND (upper(nodes.name) <> 'OTHER'::text));


--
-- Name: dashboards_countries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dashboards_countries (
    id integer NOT NULL,
    commodity_id integer NOT NULL,
    node_id integer NOT NULL,
    year smallint NOT NULL,
    iso2 text,
    name text,
    name_tsvector tsvector,
    profile text
);


--
-- Name: TABLE dashboards_countries; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.dashboards_countries IS 'Materialized table used for listing countries in tool search panels';


--
-- Name: COLUMN dashboards_countries.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_countries.id IS 'id of sourcing country (not unique)';


--
-- Name: COLUMN dashboards_countries.commodity_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_countries.commodity_id IS 'id of commodity sourced from this country';


--
-- Name: COLUMN dashboards_countries.node_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_countries.node_id IS 'id of node, through which this commodity is sourced from this country';


--
-- Name: dashboards_countries_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.dashboards_countries_v AS
 SELECT DISTINCT nodes.country_id AS id,
    nodes.commodity_id,
    nodes.id AS node_id,
    nodes.year,
    countries.iso2,
    btrim(countries.name) AS name,
    to_tsvector('simple'::regconfig, COALESCE(btrim(countries.name), ''::text)) AS name_tsvector,
    profiles.name AS profile
   FROM ((public.nodes_with_flows_per_year nodes
     JOIN public.countries ON ((countries.id = nodes.country_id)))
     LEFT JOIN public.profiles ON ((nodes.context_node_type_id = profiles.context_node_type_id)))
  WHERE (NOT nodes.is_unknown);


--
-- Name: dashboards_destinations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dashboards_destinations (
    id integer NOT NULL,
    node_type_id integer,
    context_id integer,
    country_id integer NOT NULL,
    commodity_id integer NOT NULL,
    year smallint NOT NULL,
    name text,
    name_tsvector tsvector,
    node_type text,
    profile text,
    rank_by_year jsonb
);


--
-- Name: TABLE dashboards_destinations; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.dashboards_destinations IS 'Materialized table used for listing destinations in tool search panels';


--
-- Name: COLUMN dashboards_destinations.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_destinations.id IS 'id of destination node (not unique)';


--
-- Name: COLUMN dashboards_destinations.country_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_destinations.country_id IS 'id of country sourcing commodity going to this node';


--
-- Name: COLUMN dashboards_destinations.commodity_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_destinations.commodity_id IS 'id of commodity going to this node';


--
-- Name: dashboards_destinations_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.dashboards_destinations_v AS
 SELECT nodes.id,
    nodes.node_type_id,
    nodes.context_id,
    nodes.country_id,
    nodes.commodity_id,
    nodes.year,
    nodes.name,
    nodes.name_tsvector,
    nodes.node_type,
    profiles.name AS profile,
    ranked_nodes.rank_by_year
   FROM ((((public.nodes_with_flows_per_year nodes
     JOIN public.node_properties node_props ON ((nodes.id = node_props.node_id)))
     JOIN public.context_node_type_properties cnt_props ON ((nodes.context_node_type_id = cnt_props.context_node_type_id)))
     LEFT JOIN public.profiles ON ((nodes.context_node_type_id = profiles.context_node_type_id)))
     JOIN public.nodes_per_context_ranked_by_volume_per_year_mv ranked_nodes ON (((nodes.context_id = ranked_nodes.context_id) AND (nodes.id = ranked_nodes.node_id))))
  WHERE (((cnt_props.role)::text = 'destination'::text) AND (NOT nodes.is_unknown) AND (NOT node_props.is_domestic_consumption) AND (upper(nodes.name) <> 'OTHER'::text));


--
-- Name: dashboards_exporters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dashboards_exporters (
    id integer NOT NULL,
    node_type_id integer,
    context_id integer,
    country_id integer NOT NULL,
    commodity_id integer NOT NULL,
    year smallint NOT NULL,
    name text,
    name_tsvector tsvector,
    node_type text,
    profile text,
    rank_by_year jsonb
);


--
-- Name: TABLE dashboards_exporters; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.dashboards_exporters IS 'Materialized table used for listing exporters in tool search panels';


--
-- Name: COLUMN dashboards_exporters.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_exporters.id IS 'id of exporter node (not unique)';


--
-- Name: COLUMN dashboards_exporters.country_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_exporters.country_id IS 'id of country sourcing commodity traded by this node';


--
-- Name: COLUMN dashboards_exporters.commodity_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_exporters.commodity_id IS 'id of commodity traded by this node';


--
-- Name: dashboards_exporters_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.dashboards_exporters_v AS
 SELECT nodes.id,
    nodes.node_type_id,
    nodes.context_id,
    nodes.country_id,
    nodes.commodity_id,
    nodes.year,
    nodes.name,
    nodes.name_tsvector,
    nodes.node_type,
    profiles.name AS profile,
    ranked_nodes.rank_by_year
   FROM ((((public.nodes_with_flows_per_year nodes
     JOIN public.node_properties node_props ON ((nodes.id = node_props.node_id)))
     JOIN public.context_node_type_properties cnt_props ON ((nodes.context_node_type_id = cnt_props.context_node_type_id)))
     LEFT JOIN public.profiles ON ((nodes.context_node_type_id = profiles.context_node_type_id)))
     JOIN public.nodes_per_context_ranked_by_volume_per_year_mv ranked_nodes ON (((nodes.context_id = ranked_nodes.context_id) AND (nodes.id = ranked_nodes.node_id))))
  WHERE (((cnt_props.role)::text = 'exporter'::text) AND (NOT nodes.is_unknown) AND (NOT node_props.is_domestic_consumption) AND (upper(nodes.name) <> 'OTHER'::text));


--
-- Name: dashboards_importers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dashboards_importers (
    id integer NOT NULL,
    node_type_id integer,
    context_id integer,
    country_id integer NOT NULL,
    commodity_id integer NOT NULL,
    year smallint NOT NULL,
    name text,
    name_tsvector tsvector,
    node_type text,
    profile text,
    rank_by_year jsonb
);


--
-- Name: TABLE dashboards_importers; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.dashboards_importers IS 'Materialized table used for listing importers in tool search panels';


--
-- Name: COLUMN dashboards_importers.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_importers.id IS 'id of importer node (not unique)';


--
-- Name: COLUMN dashboards_importers.country_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_importers.country_id IS 'id of country sourcing commodity traded by this node';


--
-- Name: COLUMN dashboards_importers.commodity_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_importers.commodity_id IS 'id of commodity traded by this node';


--
-- Name: dashboards_importers_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.dashboards_importers_v AS
 SELECT nodes.id,
    nodes.node_type_id,
    nodes.context_id,
    nodes.country_id,
    nodes.commodity_id,
    nodes.year,
    nodes.name,
    nodes.name_tsvector,
    nodes.node_type,
    profiles.name AS profile,
    ranked_nodes.rank_by_year
   FROM ((((public.nodes_with_flows_per_year nodes
     JOIN public.node_properties node_props ON ((nodes.id = node_props.node_id)))
     JOIN public.context_node_type_properties cnt_props ON ((nodes.context_node_type_id = cnt_props.context_node_type_id)))
     LEFT JOIN public.profiles ON ((nodes.context_node_type_id = profiles.context_node_type_id)))
     JOIN public.nodes_per_context_ranked_by_volume_per_year_mv ranked_nodes ON (((nodes.context_id = ranked_nodes.context_id) AND (nodes.id = ranked_nodes.node_id))))
  WHERE (((cnt_props.role)::text = 'importer'::text) AND (NOT nodes.is_unknown) AND (NOT node_props.is_domestic_consumption) AND (upper(nodes.name) <> 'OTHER'::text));


--
-- Name: dashboards_inds_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dashboards_inds_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dashboards_inds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dashboards_inds_id_seq OWNED BY public.dashboards_inds.id;


--
-- Name: dashboards_quals_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dashboards_quals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dashboards_quals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dashboards_quals_id_seq OWNED BY public.dashboards_quals.id;


--
-- Name: dashboards_quants_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dashboards_quants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dashboards_quants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dashboards_quants_id_seq OWNED BY public.dashboards_quants.id;


--
-- Name: dashboards_sources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dashboards_sources (
    id integer NOT NULL,
    node_type_id integer,
    context_id integer,
    country_id integer NOT NULL,
    commodity_id integer NOT NULL,
    year smallint NOT NULL,
    name text,
    name_tsvector tsvector,
    node_type text,
    profile text,
    rank_by_year jsonb
);


--
-- Name: TABLE dashboards_sources; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.dashboards_sources IS 'Materialized table used for listing sources in tool search panels';


--
-- Name: COLUMN dashboards_sources.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_sources.id IS 'id of source node (not unique)';


--
-- Name: COLUMN dashboards_sources.country_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_sources.country_id IS 'id of country sourcing commodity coming from this node';


--
-- Name: COLUMN dashboards_sources.commodity_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_sources.commodity_id IS 'id of commodity coming from this node';


--
-- Name: dashboards_sources_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.dashboards_sources_v AS
 SELECT nodes.id,
    nodes.node_type_id,
    nodes.context_id,
    nodes.country_id,
    nodes.commodity_id,
    nodes.year,
    nodes.name,
    nodes.name_tsvector,
    nodes.node_type,
    profiles.name AS profile,
    ranked_nodes.rank_by_year
   FROM ((((public.nodes_with_flows_per_year nodes
     JOIN public.node_properties node_props ON ((nodes.id = node_props.node_id)))
     JOIN public.context_node_type_properties cnt_props ON ((nodes.context_node_type_id = cnt_props.context_node_type_id)))
     LEFT JOIN public.profiles ON ((nodes.context_node_type_id = profiles.context_node_type_id)))
     JOIN public.nodes_per_context_ranked_by_volume_per_year_mv ranked_nodes ON (((nodes.context_id = ranked_nodes.context_id) AND (nodes.id = ranked_nodes.node_id))))
  WHERE (((cnt_props.role)::text = 'source'::text) AND (NOT nodes.is_unknown) AND (NOT node_props.is_domestic_consumption) AND (upper(nodes.name) <> 'OTHER'::text));


--
-- Name: database_updates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.database_updates (
    id bigint NOT NULL,
    stats json,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    jid text,
    status text DEFAULT 'STARTED'::text NOT NULL,
    error text,
    CONSTRAINT database_updates_status_check CHECK ((status = ANY (ARRAY['STARTED'::text, 'FINISHED'::text, 'FAILED'::text])))
);


--
-- Name: TABLE database_updates; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.database_updates IS 'Keeping track of database update operations, also used to ensure only one update processed at a time';


--
-- Name: COLUMN database_updates.stats; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.database_updates.stats IS 'JSON structure with information on row counts for all tables before / after update';


--
-- Name: COLUMN database_updates.jid; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.database_updates.jid IS 'Job ID, filled in when update started using a background job processor';


--
-- Name: COLUMN database_updates.status; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.database_updates.status IS 'STARTED (only one at a time), FINISHED or FAILED';


--
-- Name: COLUMN database_updates.error; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.database_updates.error IS 'Exception message for failed updates';


--
-- Name: database_updates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.database_updates_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: database_updates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.database_updates_id_seq OWNED BY public.database_updates.id;


--
-- Name: database_validation_reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.database_validation_reports (
    id bigint NOT NULL,
    report json NOT NULL,
    error_count integer NOT NULL,
    warning_count integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE database_validation_reports; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.database_validation_reports IS 'Keeping track of database validation operations';


--
-- Name: COLUMN database_validation_reports.report; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.database_validation_reports.report IS 'JSON structure with validation report';


--
-- Name: COLUMN database_validation_reports.error_count; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.database_validation_reports.error_count IS 'Count of errors detected';


--
-- Name: COLUMN database_validation_reports.warning_count; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.database_validation_reports.warning_count IS 'Count of warnings detected';


--
-- Name: database_validation_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.database_validation_reports_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: database_validation_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.database_validation_reports_id_seq OWNED BY public.database_validation_reports.id;


--
-- Name: download_attributes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.download_attributes (
    id integer NOT NULL,
    context_id integer NOT NULL,
    "position" integer NOT NULL,
    display_name text NOT NULL,
    years integer[],
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE download_attributes; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.download_attributes IS 'Attributes (quals/quants) available for download.';


--
-- Name: COLUMN download_attributes."position"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.download_attributes."position" IS 'Display order in scope of context';


--
-- Name: COLUMN download_attributes.display_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.download_attributes.display_name IS 'Name of attribute for display in downloads';


--
-- Name: COLUMN download_attributes.years; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.download_attributes.years IS 'Years for which attribute is present; empty (NULL) for all years';


--
-- Name: download_attributes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.download_attributes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: download_attributes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.download_attributes_id_seq OWNED BY public.download_attributes.id;


--
-- Name: download_quals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.download_quals (
    id integer NOT NULL,
    download_attribute_id integer NOT NULL,
    qual_id integer NOT NULL,
    is_filter_enabled boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE download_quals; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.download_quals IS 'Quals to include in downloads (see download_attributes.)';


--
-- Name: COLUMN download_quals.is_filter_enabled; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.download_quals.is_filter_enabled IS 'When set, enable selection of discreet values (advanced filter)';


--
-- Name: download_quants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.download_quants (
    id integer NOT NULL,
    download_attribute_id integer NOT NULL,
    quant_id integer NOT NULL,
    is_filter_enabled boolean DEFAULT false NOT NULL,
    filter_bands double precision[],
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE download_quants; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.download_quants IS 'Quants to include in downloads (see download_attributes.)';


--
-- Name: COLUMN download_quants.is_filter_enabled; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.download_quants.is_filter_enabled IS 'When set, enable selection of value ranges (advanced filter)';


--
-- Name: COLUMN download_quants.filter_bands; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.download_quants.filter_bands IS 'Array of value ranges to allow filtering by';


--
-- Name: download_attributes_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.download_attributes_mv AS
 SELECT da.id,
    da.context_id,
    da."position",
    da.display_name,
    da.years,
    da.created_at,
    da.updated_at,
    a.id AS attribute_id,
    a.original_type,
    a.original_id
   FROM ((public.download_quants daq
     JOIN public.download_attributes da ON ((da.id = daq.download_attribute_id)))
     JOIN public.attributes a ON (((a.original_id = daq.quant_id) AND (a.original_type = 'Quant'::text))))
UNION ALL
 SELECT da.id,
    da.context_id,
    da."position",
    da.display_name,
    da.years,
    da.created_at,
    da.updated_at,
    a.id AS attribute_id,
    a.original_type,
    a.original_id
   FROM ((public.download_quals daq
     JOIN public.download_attributes da ON ((da.id = daq.download_attribute_id)))
     JOIN public.attributes a ON (((a.original_id = daq.qual_id) AND (a.original_type = 'Qual'::text))))
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW download_attributes_mv; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON MATERIALIZED VIEW public.download_attributes_mv IS 'Materialized view which merges download_quals and download_quants with download_attributes.';


--
-- Name: COLUMN download_attributes_mv.attribute_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.download_attributes_mv.attribute_id IS 'References the unique id in attributes.';


--
-- Name: partitioned_denormalised_flow_quals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
)
PARTITION BY LIST (context_id);


--
-- Name: partitioned_denormalised_flow_quants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
)
PARTITION BY LIST (context_id);


--
-- Name: download_flows_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.download_flows_v AS
 SELECT partitioned_denormalised_flow_quants.context_id,
    partitioned_denormalised_flow_quants.year,
    partitioned_denormalised_flow_quants.quant_id AS attribute_id,
    'Quant'::text AS attribute_type,
    partitioned_denormalised_flow_quants.value AS quant_value,
    NULL::text AS qual_value,
    (partitioned_denormalised_flow_quants.value)::text AS total,
    partitioned_denormalised_flow_quants.row_name,
    partitioned_denormalised_flow_quants.path,
    partitioned_denormalised_flow_quants.names
   FROM public.partitioned_denormalised_flow_quants
UNION ALL
 SELECT partitioned_denormalised_flow_quals.context_id,
    partitioned_denormalised_flow_quals.year,
    partitioned_denormalised_flow_quals.qual_id AS attribute_id,
    'Qual'::text AS attribute_type,
    NULL::double precision AS quant_value,
    partitioned_denormalised_flow_quals.value AS qual_value,
    partitioned_denormalised_flow_quals.value AS total,
    partitioned_denormalised_flow_quals.row_name,
    partitioned_denormalised_flow_quals.path,
    partitioned_denormalised_flow_quals.names
   FROM public.partitioned_denormalised_flow_quals;


--
-- Name: download_flows_stats_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.download_flows_stats_mv AS
 SELECT download_flows_v.context_id,
    download_flows_v.year,
    download_flows_v.attribute_type,
    download_flows_v.attribute_id,
    count(*) AS count
   FROM public.download_flows_v
  GROUP BY download_flows_v.context_id, download_flows_v.year, download_flows_v.attribute_type, download_flows_v.attribute_id
  WITH NO DATA;


--
-- Name: download_quals_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.download_quals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: download_quals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.download_quals_id_seq OWNED BY public.download_quals.id;


--
-- Name: download_quants_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.download_quants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: download_quants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.download_quants_id_seq OWNED BY public.download_quants.id;


--
-- Name: download_versions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.download_versions (
    id integer NOT NULL,
    context_id integer NOT NULL,
    symbol character varying NOT NULL,
    is_current boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE download_versions; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.download_versions IS 'Versions of data downloads';


--
-- Name: COLUMN download_versions.symbol; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.download_versions.symbol IS 'Version symbol (included in downloaded file name)';


--
-- Name: COLUMN download_versions.is_current; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.download_versions.is_current IS 'When set, use this version symbol for new downloads (only use for one)';


--
-- Name: download_versions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.download_versions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: download_versions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.download_versions_id_seq OWNED BY public.download_versions.id;


--
-- Name: external_api_updates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.external_api_updates (
    id bigint NOT NULL,
    name text NOT NULL,
    last_update timestamp without time zone NOT NULL,
    resource_name text
);


--
-- Name: external_api_updates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.external_api_updates_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: external_api_updates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.external_api_updates_id_seq OWNED BY public.external_api_updates.id;


--
-- Name: flow_inds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.flow_inds (
    id integer NOT NULL,
    flow_id integer NOT NULL,
    ind_id integer NOT NULL,
    value double precision NOT NULL,
    created_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE flow_inds; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.flow_inds IS 'Values of inds for flow';


--
-- Name: COLUMN flow_inds.value; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.flow_inds.value IS 'Numeric value';


--
-- Name: flow_quals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.flow_quals (
    id integer NOT NULL,
    flow_id integer NOT NULL,
    qual_id integer NOT NULL,
    value text NOT NULL,
    created_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE flow_quals; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.flow_quals IS 'Values of quals for flow';


--
-- Name: COLUMN flow_quals.value; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.flow_quals.value IS 'Textual value';


--
-- Name: flow_attributes_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.flow_attributes_mv AS
 SELECT attributes.id AS attribute_id,
    attributes.name,
    attributes.display_name,
    attributes.unit,
    attributes.unit_type,
    flows.context_id,
    array_agg(DISTINCT flows.year) AS years
   FROM ((public.flows
     JOIN public.flow_quants ON ((flow_quants.flow_id = flows.id)))
     JOIN public.attributes ON (((attributes.original_type = 'Quant'::text) AND (attributes.original_id = flow_quants.quant_id))))
  GROUP BY attributes.id, attributes.name, attributes.display_name, attributes.unit, attributes.unit_type, flows.context_id
UNION ALL
 SELECT attributes.id AS attribute_id,
    attributes.name,
    attributes.display_name,
    attributes.unit,
    attributes.unit_type,
    flows.context_id,
    array_agg(DISTINCT flows.year) AS years
   FROM ((public.flows
     JOIN public.flow_quals ON ((flow_quals.flow_id = flows.id)))
     JOIN public.attributes ON (((attributes.original_type = 'Qual'::text) AND (attributes.original_id = flow_quals.qual_id))))
  GROUP BY attributes.id, attributes.name, attributes.display_name, attributes.unit, attributes.unit_type, flows.context_id
UNION ALL
 SELECT attributes.id AS attribute_id,
    attributes.name,
    attributes.display_name,
    attributes.unit,
    attributes.unit_type,
    flows.context_id,
    array_agg(DISTINCT flows.year) AS years
   FROM ((public.flows
     JOIN public.flow_inds ON ((flow_inds.flow_id = flows.id)))
     JOIN public.attributes ON (((attributes.original_type = 'Ind'::text) AND (attributes.original_id = flow_inds.ind_id))))
  GROUP BY attributes.id, attributes.name, attributes.display_name, attributes.unit, attributes.unit_type, flows.context_id
  WITH NO DATA;


--
-- Name: flow_inds_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.flow_inds_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: flow_inds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.flow_inds_id_seq OWNED BY public.flow_inds.id;


--
-- Name: flow_nodes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.flow_nodes (
    flow_id integer NOT NULL,
    node_id integer NOT NULL,
    context_id integer NOT NULL,
    "position" smallint NOT NULL,
    year smallint NOT NULL
);


--
-- Name: TABLE flow_nodes; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.flow_nodes IS 'Normalised flows, a readonly table populated during data upload.';


--
-- Name: COLUMN flow_nodes.flow_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.flow_nodes.flow_id IS 'id from flows';


--
-- Name: COLUMN flow_nodes.node_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.flow_nodes.node_id IS 'id from path at position';


--
-- Name: COLUMN flow_nodes.context_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.flow_nodes.context_id IS 'from flows';


--
-- Name: COLUMN flow_nodes."position"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.flow_nodes."position" IS '0-indexed';


--
-- Name: COLUMN flow_nodes.year; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.flow_nodes.year IS 'from flows';


--
-- Name: flow_nodes_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.flow_nodes_v AS
 SELECT flows.id AS flow_id,
    a.node_id,
    flows.context_id,
    a."position",
    flows.year
   FROM public.flows,
    LATERAL unnest(flows.path) WITH ORDINALITY a(node_id, "position");


--
-- Name: flow_quals_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.flow_quals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: flow_quals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.flow_quals_id_seq OWNED BY public.flow_quals.id;


--
-- Name: flow_quant_totals_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.flow_quant_totals_mv AS
 SELECT contexts.commodity_id,
    contexts.country_id,
    flows.context_id,
    flow_quants.quant_id,
    flows.year,
    sum(flow_quants.value) AS total
   FROM ((public.flow_quants
     JOIN public.flows ON ((flow_quants.flow_id = flows.id)))
     JOIN public.contexts ON ((flows.context_id = contexts.id)))
  WHERE ((flows.year = contexts.default_year) AND (flow_quants.quant_id IN ( SELECT quants.id
           FROM public.quants
          WHERE (quants.name = 'Volume'::text))))
  GROUP BY contexts.commodity_id, contexts.country_id, flows.context_id, flow_quants.quant_id, flows.year
  WITH NO DATA;


--
-- Name: flow_quants_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.flow_quants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: flow_quants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.flow_quants_id_seq OWNED BY public.flow_quants.id;


--
-- Name: flows_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.flows_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: flows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.flows_id_seq OWNED BY public.flows.id;


--
-- Name: ind_commodity_properties_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ind_commodity_properties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ind_commodity_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ind_commodity_properties_id_seq OWNED BY public.ind_commodity_properties.id;


--
-- Name: ind_context_properties_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ind_context_properties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ind_context_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ind_context_properties_id_seq OWNED BY public.ind_context_properties.id;


--
-- Name: ind_country_properties_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ind_country_properties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ind_country_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ind_country_properties_id_seq OWNED BY public.ind_country_properties.id;


--
-- Name: ind_properties_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ind_properties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ind_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ind_properties_id_seq OWNED BY public.ind_properties.id;


--
-- Name: node_inds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.node_inds (
    id integer NOT NULL,
    node_id integer NOT NULL,
    ind_id integer NOT NULL,
    year integer,
    value double precision NOT NULL,
    created_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE node_inds; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.node_inds IS 'Values of inds for node';


--
-- Name: COLUMN node_inds.year; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.node_inds.year IS 'Year; empty (NULL) for all years';


--
-- Name: COLUMN node_inds.value; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.node_inds.value IS 'Numeric value';


--
-- Name: nodes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nodes (
    id integer NOT NULL,
    node_type_id integer NOT NULL,
    name text NOT NULL,
    geo_id text,
    is_unknown boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    main_id integer
);


--
-- Name: TABLE nodes; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.nodes IS 'Nodes of different types, such as MUNICIPALITY or EXPORTER, which participate in supply chains';


--
-- Name: COLUMN nodes.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.nodes.name IS 'Name of node';


--
-- Name: COLUMN nodes.geo_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.nodes.geo_id IS '2-letter iso code in case of country nodes; other geo identifiers possible for other node types';


--
-- Name: COLUMN nodes.is_unknown; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.nodes.is_unknown IS 'When set, node was not possible to identify';


--
-- Name: COLUMN nodes.main_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.nodes.main_id IS 'Node identifier from Main DB';


--
-- Name: ind_values_meta_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.ind_values_meta_mv AS
 WITH flow_paths AS (
         SELECT DISTINCT unnest(flows.path) AS node_id,
            flows.context_id
           FROM public.flows
        ), nodes AS (
         SELECT nodes.id,
            nodes.node_type_id,
            fp.context_id
           FROM (flow_paths fp
             JOIN public.nodes ON ((fp.node_id = nodes.id)))
        ), node_values AS (
         SELECT node_inds.ind_id,
            nodes.context_id,
            contexts.country_id,
            contexts.commodity_id,
            array_agg(DISTINCT nodes.node_type_id ORDER BY nodes.node_type_id) AS node_types_ids,
            array_agg(DISTINCT node_inds.year ORDER BY node_inds.year) AS years
           FROM ((public.node_inds
             JOIN nodes ON ((node_inds.node_id = nodes.id)))
             JOIN public.contexts ON ((nodes.context_id = contexts.id)))
          GROUP BY node_inds.ind_id, GROUPING SETS ((nodes.context_id), (contexts.country_id), (contexts.commodity_id))
        ), node_values_by_context AS (
         SELECT node_values.ind_id,
            jsonb_object_agg(node_values.context_id, jsonb_build_object('years', node_values.years, 'node_types_ids', node_values.node_types_ids)) AS node_values
           FROM node_values
          WHERE ((node_values.commodity_id IS NULL) AND (node_values.country_id IS NULL) AND (node_values.context_id IS NOT NULL))
          GROUP BY node_values.ind_id
        ), node_values_by_country AS (
         SELECT node_values.ind_id,
            jsonb_object_agg(node_values.country_id, jsonb_build_object('years', node_values.years, 'node_types_ids', node_values.node_types_ids)) AS node_values
           FROM node_values
          WHERE ((node_values.commodity_id IS NULL) AND (node_values.country_id IS NOT NULL) AND (node_values.context_id IS NULL))
          GROUP BY node_values.ind_id
        ), node_values_by_commodity AS (
         SELECT node_values.ind_id,
            jsonb_object_agg(node_values.commodity_id, jsonb_build_object('years', node_values.years, 'node_types_ids', node_values.node_types_ids)) AS node_values
           FROM node_values
          WHERE ((node_values.commodity_id IS NOT NULL) AND (node_values.country_id IS NULL) AND (node_values.context_id IS NULL))
          GROUP BY node_values.ind_id
        ), flow_values AS (
         SELECT flow_inds.ind_id,
            flows.context_id,
            contexts.country_id,
            contexts.commodity_id,
            array_agg(DISTINCT flows.year ORDER BY flows.year) AS years
           FROM ((public.flow_inds
             JOIN public.flows ON ((flow_inds.flow_id = flows.id)))
             JOIN public.contexts ON ((flows.context_id = contexts.id)))
          GROUP BY flow_inds.ind_id, GROUPING SETS ((flows.context_id), (contexts.country_id), (contexts.commodity_id))
        ), flow_values_by_context AS (
         SELECT flow_values.ind_id,
            jsonb_object_agg(flow_values.context_id, jsonb_build_object('years', flow_values.years)) AS flow_values
           FROM flow_values
          WHERE ((flow_values.commodity_id IS NULL) AND (flow_values.country_id IS NULL) AND (flow_values.context_id IS NOT NULL))
          GROUP BY flow_values.ind_id
        ), flow_values_by_country AS (
         SELECT flow_values.ind_id,
            jsonb_object_agg(flow_values.country_id, jsonb_build_object('years', flow_values.years)) AS flow_values
           FROM flow_values
          WHERE ((flow_values.commodity_id IS NULL) AND (flow_values.country_id IS NOT NULL) AND (flow_values.context_id IS NULL))
          GROUP BY flow_values.ind_id
        ), flow_values_by_commodity AS (
         SELECT flow_values.ind_id,
            jsonb_object_agg(flow_values.commodity_id, jsonb_build_object('years', flow_values.years)) AS flow_values
           FROM flow_values
          WHERE ((flow_values.commodity_id IS NOT NULL) AND (flow_values.country_id IS NULL) AND (flow_values.context_id IS NULL))
          GROUP BY flow_values.ind_id
        )
 SELECT inds.id AS ind_id,
    jsonb_build_object('context', nv1.node_values, 'country', nv2.node_values, 'commodity', nv3.node_values) AS node_values,
    jsonb_build_object('context', fv1.flow_values, 'country', fv2.flow_values, 'commodity', fv3.flow_values) AS flow_values
   FROM ((((((public.inds
     LEFT JOIN node_values_by_context nv1 ON ((nv1.ind_id = inds.id)))
     LEFT JOIN node_values_by_country nv2 ON ((nv2.ind_id = inds.id)))
     LEFT JOIN node_values_by_commodity nv3 ON ((nv3.ind_id = inds.id)))
     LEFT JOIN flow_values_by_context fv1 ON ((fv1.ind_id = inds.id)))
     LEFT JOIN flow_values_by_country fv2 ON ((fv2.ind_id = inds.id)))
     LEFT JOIN flow_values_by_commodity fv3 ON ((fv3.ind_id = inds.id)))
  WITH NO DATA;


--
-- Name: inds_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.inds_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: inds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.inds_id_seq OWNED BY public.inds.id;


--
-- Name: map_attribute_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.map_attribute_groups (
    id integer NOT NULL,
    context_id integer NOT NULL,
    name text NOT NULL,
    "position" integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE map_attribute_groups; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.map_attribute_groups IS 'Groups attributes (inds/quals/quants) to display on map';


--
-- Name: COLUMN map_attribute_groups.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.map_attribute_groups.name IS 'Name for display';


--
-- Name: COLUMN map_attribute_groups."position"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.map_attribute_groups."position" IS 'Display order in scope of context';


--
-- Name: map_attribute_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.map_attribute_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: map_attribute_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.map_attribute_groups_id_seq OWNED BY public.map_attribute_groups.id;


--
-- Name: map_attributes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.map_attributes (
    id integer NOT NULL,
    map_attribute_group_id integer NOT NULL,
    "position" integer NOT NULL,
    dual_layer_buckets double precision[] DEFAULT '{}'::double precision[] NOT NULL,
    single_layer_buckets double precision[] DEFAULT '{}'::double precision[] NOT NULL,
    color_scale text,
    years integer[],
    is_disabled boolean DEFAULT false NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE map_attributes; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.map_attributes IS 'Attributes (inds/quants) to display on map';


--
-- Name: COLUMN map_attributes."position"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.map_attributes."position" IS 'Display order in scope of group';


--
-- Name: COLUMN map_attributes.dual_layer_buckets; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.map_attributes.dual_layer_buckets IS 'Choropleth buckets for dual dimension choropleth';


--
-- Name: COLUMN map_attributes.single_layer_buckets; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.map_attributes.single_layer_buckets IS 'Choropleth buckets for single dimension choropleth';


--
-- Name: COLUMN map_attributes.color_scale; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.map_attributes.color_scale IS 'Choropleth colour scale, e.g. blue';


--
-- Name: COLUMN map_attributes.years; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.map_attributes.years IS 'Years for which attribute is present; empty (NULL) for all years';


--
-- Name: COLUMN map_attributes.is_disabled; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.map_attributes.is_disabled IS 'When set, this attribute is not displayed';


--
-- Name: COLUMN map_attributes.is_default; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.map_attributes.is_default IS 'When set, show this attribute by default. A maximum of 2 attributes per context may be set as default.';


--
-- Name: map_attributes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.map_attributes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: map_attributes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.map_attributes_id_seq OWNED BY public.map_attributes.id;


--
-- Name: map_inds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.map_inds (
    id integer NOT NULL,
    map_attribute_id integer NOT NULL,
    ind_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE map_inds; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.map_inds IS 'Inds to display on map (see map_attributes.)';


--
-- Name: map_quants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.map_quants (
    id integer NOT NULL,
    map_attribute_id integer NOT NULL,
    quant_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE map_quants; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.map_quants IS 'Quants to display on map (see map_attributes.)';


--
-- Name: map_attributes_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.map_attributes_mv AS
 SELECT ma.id,
    ma.map_attribute_group_id,
    ma."position",
    ma.dual_layer_buckets,
    ma.single_layer_buckets,
    ma.color_scale,
    ma.years,
    ma.is_disabled,
    ma.is_default,
    ma.created_at,
    ma.updated_at,
    a.id AS attribute_id,
    a.display_name AS name,
    'quant'::text AS attribute_type,
    a.unit,
    a.tooltip_text AS description,
    a.original_id AS original_attribute_id,
    mag.context_id
   FROM (((public.map_quants maq
     JOIN public.map_attributes ma ON ((ma.id = maq.map_attribute_id)))
     JOIN public.map_attribute_groups mag ON ((mag.id = ma.map_attribute_group_id)))
     JOIN public.attributes a ON (((a.original_id = maq.quant_id) AND (a.original_type = 'Quant'::text))))
UNION ALL
 SELECT ma.id,
    ma.map_attribute_group_id,
    ma."position",
    ma.dual_layer_buckets,
    ma.single_layer_buckets,
    ma.color_scale,
    ma.years,
    ma.is_disabled,
    ma.is_default,
    ma.created_at,
    ma.updated_at,
    a.id AS attribute_id,
    a.display_name AS name,
    'ind'::text AS attribute_type,
    a.unit,
    a.tooltip_text AS description,
    a.original_id AS original_attribute_id,
    mag.context_id
   FROM (((public.map_inds mai
     JOIN public.map_attributes ma ON ((ma.id = mai.map_attribute_id)))
     JOIN public.map_attribute_groups mag ON ((mag.id = ma.map_attribute_group_id)))
     JOIN public.attributes a ON (((a.original_id = mai.ind_id) AND (a.original_type = 'Ind'::text))))
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW map_attributes_mv; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON MATERIALIZED VIEW public.map_attributes_mv IS 'Materialized view which merges map_inds and map_quants with map_attributes.';


--
-- Name: COLUMN map_attributes_mv.attribute_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.map_attributes_mv.attribute_id IS 'References the unique id in attributes.';


--
-- Name: COLUMN map_attributes_mv.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.map_attributes_mv.name IS 'Display name of the ind/quant';


--
-- Name: COLUMN map_attributes_mv.attribute_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.map_attributes_mv.attribute_type IS 'Type of the attribute (ind/quant)';


--
-- Name: COLUMN map_attributes_mv.unit; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.map_attributes_mv.unit IS 'Name of the attribute''s unit';


--
-- Name: COLUMN map_attributes_mv.description; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.map_attributes_mv.description IS 'Attribute''s description';


--
-- Name: COLUMN map_attributes_mv.original_attribute_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.map_attributes_mv.original_attribute_id IS 'The attribute''s original id';


--
-- Name: COLUMN map_attributes_mv.context_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.map_attributes_mv.context_id IS 'References the context';


--
-- Name: node_quants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.node_quants (
    id integer NOT NULL,
    node_id integer NOT NULL,
    quant_id integer NOT NULL,
    year integer,
    value double precision NOT NULL,
    created_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE node_quants; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.node_quants IS 'Values of quants for node';


--
-- Name: COLUMN node_quants.year; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.node_quants.year IS 'Year; empty (NULL) for all years';


--
-- Name: COLUMN node_quants.value; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.node_quants.value IS 'Numeric value';


--
-- Name: nodes_with_flows_or_geo_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.nodes_with_flows_or_geo_v AS
 SELECT nodes.id,
    contexts.id AS context_id,
    nodes.node_type_id,
    nodes.main_id,
    nodes.is_unknown,
    node_properties.is_domestic_consumption,
    (upper(btrim(nodes.name)) = 'OTHER'::text) AS is_aggregated,
        CASE
            WHEN ((flow_nodes.node_id IS NOT NULL) OR (upper(btrim(nodes.name)) = 'OTHER'::text)) THEN true
            ELSE false
        END AS has_flows,
    nodes.name,
    node_types.name AS node_type,
    nodes.geo_id,
    profiles.name AS profile
   FROM ((((((((public.nodes
     JOIN public.node_properties ON ((node_properties.node_id = nodes.id)))
     JOIN public.node_types ON ((node_types.id = nodes.node_type_id)))
     JOIN public.context_node_types ON ((context_node_types.node_type_id = node_types.id)))
     JOIN public.contexts ON ((context_node_types.context_id = contexts.id)))
     JOIN public.countries ON ((contexts.country_id = countries.id)))
     JOIN public.context_node_type_properties ON ((context_node_type_properties.context_node_type_id = context_node_types.id)))
     LEFT JOIN public.profiles ON ((profiles.context_node_type_id = context_node_types.id)))
     LEFT JOIN ( SELECT DISTINCT flow_nodes_1.node_id,
            flow_nodes_1.context_id
           FROM public.flow_nodes flow_nodes_1) flow_nodes ON (((flow_nodes.node_id = nodes.id) AND (flow_nodes.context_id = context_node_types.context_id) AND (flow_nodes.context_id = contexts.id))))
  WHERE (((flow_nodes.context_id IS NOT NULL) AND (flow_nodes.context_id = contexts.id)) OR (context_node_type_properties.is_geo_column AND (upper(countries.iso2) = upper("substring"(nodes.geo_id, 1, 2)))) OR (upper(btrim(nodes.name)) = 'OTHER'::text));


--
-- Name: map_attributes_values_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.map_attributes_values_v AS
 WITH node_attributes AS (
         SELECT attributes.id AS attribute_id,
            node_quants.node_id,
            node_quants.year,
            node_quants.value
           FROM (public.node_quants
             JOIN public.attributes ON (((attributes.original_id = node_quants.quant_id) AND (attributes.original_type = 'Quant'::text))))
        UNION ALL
         SELECT attributes.id AS attribute_id,
            node_inds.node_id,
            node_inds.year,
            node_inds.value
           FROM (public.node_inds
             JOIN public.attributes ON (((attributes.original_id = node_inds.ind_id) AND (attributes.original_type = 'Ind'::text))))
        )
 SELECT DISTINCT node_attributes.attribute_id,
    node_attributes.node_id,
    node_attributes.year,
    (nodes.node_type_id)::smallint AS node_type_id,
    node_attributes.value,
    nodes.geo_id,
    countries.iso2
   FROM (((node_attributes
     JOIN public.nodes_with_flows_or_geo_v nodes ON ((nodes.id = node_attributes.node_id)))
     JOIN public.contexts ON ((contexts.id = nodes.context_id)))
     JOIN public.countries ON ((countries.id = contexts.country_id)));


--
-- Name: map_inds_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.map_inds_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: map_inds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.map_inds_id_seq OWNED BY public.map_inds.id;


--
-- Name: map_quants_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.map_quants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: map_quants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.map_quants_id_seq OWNED BY public.map_quants.id;


--
-- Name: node_inds_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.node_inds_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: node_inds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.node_inds_id_seq OWNED BY public.node_inds.id;


--
-- Name: node_properties_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.node_properties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: node_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.node_properties_id_seq OWNED BY public.node_properties.id;


--
-- Name: node_quals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.node_quals (
    id integer NOT NULL,
    node_id integer NOT NULL,
    qual_id integer NOT NULL,
    year integer,
    value text NOT NULL,
    created_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE node_quals; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.node_quals IS 'Values of quals for node';


--
-- Name: COLUMN node_quals.year; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.node_quals.year IS 'Year; empty (NULL) for all years';


--
-- Name: COLUMN node_quals.value; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.node_quals.value IS 'Textual value';


--
-- Name: node_quals_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.node_quals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: node_quals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.node_quals_id_seq OWNED BY public.node_quals.id;


--
-- Name: node_quants_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.node_quants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: node_quants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.node_quants_id_seq OWNED BY public.node_quants.id;


--
-- Name: node_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.node_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: node_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.node_types_id_seq OWNED BY public.node_types.id;


--
-- Name: nodes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nodes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nodes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nodes_id_seq OWNED BY public.nodes.id;


--
-- Name: nodes_stats_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.nodes_stats_mv AS
 WITH top_destinations_totals AS (
         SELECT flows_1.context_id,
            flows_1.year,
            flow_quants_1.quant_id,
            context_node_types_1.node_type_id,
            sum(flow_quants_1.value) AS value
           FROM ((((public.flows flows_1
             JOIN public.context_node_types context_node_types_1 ON ((context_node_types_1.context_id = flows_1.context_id)))
             JOIN public.flow_quants flow_quants_1 ON ((flows_1.id = flow_quants_1.flow_id)))
             JOIN public.nodes nodes_1 ON ((nodes_1.id = flows_1.path[(context_node_types_1.column_position + 1)])))
             JOIN public.node_properties node_properties_1 ON ((nodes_1.id = node_properties_1.node_id)))
          WHERE ((NOT nodes_1.is_unknown) AND (NOT node_properties_1.is_domestic_consumption))
          GROUP BY flows_1.context_id, flows_1.year, flow_quants_1.quant_id, context_node_types_1.node_type_id
        )
 SELECT flows.context_id,
    flows.year,
    flow_quants.quant_id,
    context_node_types.node_type_id,
    flows.path[(context_node_types.column_position + 1)] AS node_id,
    nodes.name,
    nodes.geo_id,
    sum(flow_quants.value) AS value,
    (sum(flow_quants.value) / NULLIF(( SELECT top_destinations_totals.value
           FROM top_destinations_totals
          WHERE ((top_destinations_totals.context_id = flows.context_id) AND (top_destinations_totals.year = flows.year) AND (top_destinations_totals.quant_id = flow_quants.quant_id) AND (top_destinations_totals.node_type_id = context_node_types.node_type_id))), (0)::double precision)) AS height
   FROM ((((public.flows
     JOIN public.context_node_types ON ((context_node_types.context_id = flows.context_id)))
     JOIN public.flow_quants ON ((flows.id = flow_quants.flow_id)))
     JOIN public.nodes ON ((nodes.id = flows.path[(context_node_types.column_position + 1)])))
     JOIN public.node_properties ON ((nodes.id = node_properties.node_id)))
  WHERE ((NOT nodes.is_unknown) AND (NOT node_properties.is_domestic_consumption))
  GROUP BY flows.context_id, flows.year, flow_quants.quant_id, context_node_types.node_type_id, flows.path[(context_node_types.column_position + 1)], nodes.name, nodes.geo_id
  WITH NO DATA;


--
-- Name: nodes_with_flows; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nodes_with_flows (
    id integer NOT NULL,
    context_id integer NOT NULL,
    country_id integer,
    commodity_id integer,
    node_type_id integer,
    context_node_type_id integer,
    main_id integer,
    column_position smallint,
    is_subnational boolean,
    is_unknown boolean,
    is_domestic_consumption boolean,
    name text,
    node_type text,
    profile text,
    geo_id text,
    role text,
    name_tsvector tsvector,
    years smallint[],
    actor_basic_attributes json
);


--
-- Name: nodes_with_flows_or_geo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nodes_with_flows_or_geo (
    id integer NOT NULL,
    context_id integer NOT NULL,
    node_type_id integer,
    main_id integer,
    is_unknown boolean,
    is_domestic_consumption boolean,
    is_aggregated boolean,
    has_flows boolean,
    name text,
    node_type text,
    geo_id text,
    profile text
);


--
-- Name: nodes_with_flows_per_year_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.nodes_with_flows_per_year_v AS
 SELECT nodes_with_co_nodes.node_id AS id,
    nodes_with_co_nodes.context_id,
    contexts.country_id,
    contexts.commodity_id,
    nodes.node_type_id,
    cnt.id AS context_node_type_id,
    nodes.main_id,
    cnt.column_position,
    nodes_with_co_nodes.year,
    nodes.is_unknown,
    nodes.name,
    to_tsvector('simple'::regconfig, COALESCE(nodes.name, ''::text)) AS name_tsvector,
    node_types.name AS node_type,
    upper(btrim(nodes.geo_id)) AS geo_id
   FROM ((((( SELECT DISTINCT flow_nodes.node_id,
            flow_nodes.context_id,
            flow_nodes."position",
            flow_nodes.year
           FROM public.flow_nodes) nodes_with_co_nodes
     JOIN public.nodes ON ((nodes_with_co_nodes.node_id = nodes.id)))
     JOIN public.node_types ON ((nodes.node_type_id = node_types.id)))
     JOIN public.contexts ON ((nodes_with_co_nodes.context_id = contexts.id)))
     JOIN public.context_node_types cnt ON (((nodes_with_co_nodes.context_id = cnt.context_id) AND (nodes_with_co_nodes."position" = (cnt.column_position + 1)) AND (contexts.id = cnt.context_id) AND (nodes.node_type_id = cnt.node_type_id) AND (node_types.id = cnt.node_type_id))));


--
-- Name: nodes_with_flows_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.nodes_with_flows_v AS
 SELECT nodes.id,
    nodes.context_id,
    nodes.country_id,
    nodes.commodity_id,
    nodes.node_type_id,
    nodes.context_node_type_id,
    nodes.main_id,
    nodes.column_position,
    context_properties.is_subnational,
    nodes.is_unknown,
    node_properties.is_domestic_consumption,
    btrim(nodes.name) AS name,
    nodes.node_type,
    profiles.name AS profile,
    nodes.geo_id,
    context_node_type_properties.role,
    nodes.name_tsvector,
    array_agg(DISTINCT nodes.year ORDER BY nodes.year) AS array_agg,
    NULL::json AS actor_basic_attributes
   FROM ((((public.nodes_with_flows_per_year nodes
     JOIN public.node_properties ON ((nodes.id = node_properties.node_id)))
     JOIN public.context_properties ON ((nodes.context_id = context_properties.context_id)))
     JOIN public.context_node_type_properties ON ((nodes.context_node_type_id = context_node_type_properties.context_node_type_id)))
     LEFT JOIN public.profiles ON ((nodes.context_node_type_id = profiles.context_node_type_id)))
  WHERE (NOT context_properties.is_disabled)
  GROUP BY nodes.id, nodes.context_id, nodes.country_id, nodes.commodity_id, nodes.node_type_id, nodes.context_node_type_id, nodes.main_id, nodes.column_position, context_properties.is_subnational, nodes.is_unknown, node_properties.is_domestic_consumption, (btrim(nodes.name)), nodes.node_type, profiles.name, nodes.geo_id, context_node_type_properties.role, nodes.name_tsvector;


--
-- Name: partitioned_denormalised_flow_inds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
)
PARTITION BY LIST (context_id);


--
-- Name: partitioned_denormalised_flow_inds_1; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_1 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_1 FOR VALUES IN (1);


--
-- Name: partitioned_denormalised_flow_inds_19; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_19 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_19 FOR VALUES IN (19);


--
-- Name: partitioned_denormalised_flow_inds_2; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_2 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_2 FOR VALUES IN (2);


--
-- Name: partitioned_denormalised_flow_inds_35; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_35 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_35 FOR VALUES IN (35);


--
-- Name: partitioned_denormalised_flow_inds_37; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_37 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_37 FOR VALUES IN (37);


--
-- Name: partitioned_denormalised_flow_inds_38; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_38 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_38 FOR VALUES IN (38);


--
-- Name: partitioned_denormalised_flow_inds_39; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_39 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_39 FOR VALUES IN (39);


--
-- Name: partitioned_denormalised_flow_inds_4; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_4 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_4 FOR VALUES IN (4);


--
-- Name: partitioned_denormalised_flow_inds_40; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_40 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_40 FOR VALUES IN (40);


--
-- Name: partitioned_denormalised_flow_inds_42; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_42 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_42 FOR VALUES IN (42);


--
-- Name: partitioned_denormalised_flow_inds_43; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_43 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_43 FOR VALUES IN (43);


--
-- Name: partitioned_denormalised_flow_inds_44; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_44 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_44 FOR VALUES IN (44);


--
-- Name: partitioned_denormalised_flow_inds_45; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_45 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_45 FOR VALUES IN (45);


--
-- Name: partitioned_denormalised_flow_inds_46; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_46 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_46 FOR VALUES IN (46);


--
-- Name: partitioned_denormalised_flow_inds_47; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_47 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_47 FOR VALUES IN (47);


--
-- Name: partitioned_denormalised_flow_inds_48; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_48 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_48 FOR VALUES IN (48);


--
-- Name: partitioned_denormalised_flow_inds_49; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_49 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_49 FOR VALUES IN (49);


--
-- Name: partitioned_denormalised_flow_inds_5; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_5 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_5 FOR VALUES IN (5);


--
-- Name: partitioned_denormalised_flow_inds_50; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_50 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_50 FOR VALUES IN (50);


--
-- Name: partitioned_denormalised_flow_inds_51; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_51 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_51 FOR VALUES IN (51);


--
-- Name: partitioned_denormalised_flow_inds_52; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_52 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_52 FOR VALUES IN (52);


--
-- Name: partitioned_denormalised_flow_inds_53; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_53 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_53 FOR VALUES IN (53);


--
-- Name: partitioned_denormalised_flow_inds_54; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_54 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_54 FOR VALUES IN (54);


--
-- Name: partitioned_denormalised_flow_inds_55; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_55 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_55 FOR VALUES IN (55);


--
-- Name: partitioned_denormalised_flow_inds_56; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_56 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_56 FOR VALUES IN (56);


--
-- Name: partitioned_denormalised_flow_inds_57; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_57 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_57 FOR VALUES IN (57);


--
-- Name: partitioned_denormalised_flow_inds_58; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_58 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_58 FOR VALUES IN (58);


--
-- Name: partitioned_denormalised_flow_inds_59; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_59 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_59 FOR VALUES IN (59);


--
-- Name: partitioned_denormalised_flow_inds_6; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_6 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_6 FOR VALUES IN (6);


--
-- Name: partitioned_denormalised_flow_inds_60; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_60 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_60 FOR VALUES IN (60);


--
-- Name: partitioned_denormalised_flow_inds_61; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_61 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_61 FOR VALUES IN (61);


--
-- Name: partitioned_denormalised_flow_inds_7; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_inds_7 (
    context_id integer,
    ind_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_inds ATTACH PARTITION public.partitioned_denormalised_flow_inds_7 FOR VALUES IN (7);


--
-- Name: partitioned_denormalised_flow_quals_1; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_1 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_1 FOR VALUES IN (1);


--
-- Name: partitioned_denormalised_flow_quals_19; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_19 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_19 FOR VALUES IN (19);


--
-- Name: partitioned_denormalised_flow_quals_2; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_2 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_2 FOR VALUES IN (2);


--
-- Name: partitioned_denormalised_flow_quals_35; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_35 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_35 FOR VALUES IN (35);


--
-- Name: partitioned_denormalised_flow_quals_37; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_37 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_37 FOR VALUES IN (37);


--
-- Name: partitioned_denormalised_flow_quals_38; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_38 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_38 FOR VALUES IN (38);


--
-- Name: partitioned_denormalised_flow_quals_39; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_39 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_39 FOR VALUES IN (39);


--
-- Name: partitioned_denormalised_flow_quals_4; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_4 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_4 FOR VALUES IN (4);


--
-- Name: partitioned_denormalised_flow_quals_40; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_40 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_40 FOR VALUES IN (40);


--
-- Name: partitioned_denormalised_flow_quals_42; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_42 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_42 FOR VALUES IN (42);


--
-- Name: partitioned_denormalised_flow_quals_43; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_43 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_43 FOR VALUES IN (43);


--
-- Name: partitioned_denormalised_flow_quals_44; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_44 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_44 FOR VALUES IN (44);


--
-- Name: partitioned_denormalised_flow_quals_45; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_45 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_45 FOR VALUES IN (45);


--
-- Name: partitioned_denormalised_flow_quals_46; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_46 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_46 FOR VALUES IN (46);


--
-- Name: partitioned_denormalised_flow_quals_47; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_47 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_47 FOR VALUES IN (47);


--
-- Name: partitioned_denormalised_flow_quals_48; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_48 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_48 FOR VALUES IN (48);


--
-- Name: partitioned_denormalised_flow_quals_49; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_49 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_49 FOR VALUES IN (49);


--
-- Name: partitioned_denormalised_flow_quals_5; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_5 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_5 FOR VALUES IN (5);


--
-- Name: partitioned_denormalised_flow_quals_50; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_50 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_50 FOR VALUES IN (50);


--
-- Name: partitioned_denormalised_flow_quals_51; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_51 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_51 FOR VALUES IN (51);


--
-- Name: partitioned_denormalised_flow_quals_52; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_52 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_52 FOR VALUES IN (52);


--
-- Name: partitioned_denormalised_flow_quals_53; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_53 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_53 FOR VALUES IN (53);


--
-- Name: partitioned_denormalised_flow_quals_54; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_54 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_54 FOR VALUES IN (54);


--
-- Name: partitioned_denormalised_flow_quals_55; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_55 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_55 FOR VALUES IN (55);


--
-- Name: partitioned_denormalised_flow_quals_56; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_56 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_56 FOR VALUES IN (56);


--
-- Name: partitioned_denormalised_flow_quals_57; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_57 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_57 FOR VALUES IN (57);


--
-- Name: partitioned_denormalised_flow_quals_58; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_58 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_58 FOR VALUES IN (58);


--
-- Name: partitioned_denormalised_flow_quals_59; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_59 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_59 FOR VALUES IN (59);


--
-- Name: partitioned_denormalised_flow_quals_6; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_6 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_6 FOR VALUES IN (6);


--
-- Name: partitioned_denormalised_flow_quals_60; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_60 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_60 FOR VALUES IN (60);


--
-- Name: partitioned_denormalised_flow_quals_61; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_61 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_61 FOR VALUES IN (61);


--
-- Name: partitioned_denormalised_flow_quals_7; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quals_7 (
    context_id integer,
    qual_id integer,
    year smallint,
    value text,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quals ATTACH PARTITION public.partitioned_denormalised_flow_quals_7 FOR VALUES IN (7);


--
-- Name: partitioned_denormalised_flow_quants_1; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_1 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_1 FOR VALUES IN (1);


--
-- Name: partitioned_denormalised_flow_quants_19; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_19 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_19 FOR VALUES IN (19);


--
-- Name: partitioned_denormalised_flow_quants_2; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_2 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_2 FOR VALUES IN (2);


--
-- Name: partitioned_denormalised_flow_quants_35; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_35 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_35 FOR VALUES IN (35);


--
-- Name: partitioned_denormalised_flow_quants_37; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_37 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_37 FOR VALUES IN (37);


--
-- Name: partitioned_denormalised_flow_quants_38; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_38 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_38 FOR VALUES IN (38);


--
-- Name: partitioned_denormalised_flow_quants_39; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_39 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_39 FOR VALUES IN (39);


--
-- Name: partitioned_denormalised_flow_quants_4; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_4 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_4 FOR VALUES IN (4);


--
-- Name: partitioned_denormalised_flow_quants_40; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_40 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_40 FOR VALUES IN (40);


--
-- Name: partitioned_denormalised_flow_quants_42; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_42 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_42 FOR VALUES IN (42);


--
-- Name: partitioned_denormalised_flow_quants_43; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_43 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_43 FOR VALUES IN (43);


--
-- Name: partitioned_denormalised_flow_quants_44; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_44 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_44 FOR VALUES IN (44);


--
-- Name: partitioned_denormalised_flow_quants_45; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_45 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_45 FOR VALUES IN (45);


--
-- Name: partitioned_denormalised_flow_quants_46; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_46 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_46 FOR VALUES IN (46);


--
-- Name: partitioned_denormalised_flow_quants_47; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_47 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_47 FOR VALUES IN (47);


--
-- Name: partitioned_denormalised_flow_quants_48; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_48 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_48 FOR VALUES IN (48);


--
-- Name: partitioned_denormalised_flow_quants_49; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_49 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_49 FOR VALUES IN (49);


--
-- Name: partitioned_denormalised_flow_quants_5; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_5 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_5 FOR VALUES IN (5);


--
-- Name: partitioned_denormalised_flow_quants_50; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_50 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_50 FOR VALUES IN (50);


--
-- Name: partitioned_denormalised_flow_quants_51; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_51 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_51 FOR VALUES IN (51);


--
-- Name: partitioned_denormalised_flow_quants_52; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_52 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_52 FOR VALUES IN (52);


--
-- Name: partitioned_denormalised_flow_quants_53; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_53 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_53 FOR VALUES IN (53);


--
-- Name: partitioned_denormalised_flow_quants_54; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_54 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_54 FOR VALUES IN (54);


--
-- Name: partitioned_denormalised_flow_quants_55; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_55 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_55 FOR VALUES IN (55);


--
-- Name: partitioned_denormalised_flow_quants_56; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_56 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_56 FOR VALUES IN (56);


--
-- Name: partitioned_denormalised_flow_quants_57; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_57 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_57 FOR VALUES IN (57);


--
-- Name: partitioned_denormalised_flow_quants_58; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_58 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_58 FOR VALUES IN (58);


--
-- Name: partitioned_denormalised_flow_quants_59; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_59 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_59 FOR VALUES IN (59);


--
-- Name: partitioned_denormalised_flow_quants_6; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_6 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_6 FOR VALUES IN (6);


--
-- Name: partitioned_denormalised_flow_quants_60; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_60 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_60 FOR VALUES IN (60);


--
-- Name: partitioned_denormalised_flow_quants_61; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_61 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_61 FOR VALUES IN (61);


--
-- Name: partitioned_denormalised_flow_quants_7; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_denormalised_flow_quants_7 (
    context_id integer,
    quant_id integer,
    value double precision,
    year smallint,
    row_name text,
    path integer[],
    names text[],
    known_path_positions boolean[]
);
ALTER TABLE ONLY public.partitioned_denormalised_flow_quants ATTACH PARTITION public.partitioned_denormalised_flow_quants_7 FOR VALUES IN (7);


--
-- Name: partitioned_flow_inds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_inds (
    flow_id integer,
    ind_id integer,
    value double precision
)
PARTITION BY LIST (ind_id);


--
-- Name: partitioned_flow_inds_1; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_inds_1 (
    flow_id integer,
    ind_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_inds ATTACH PARTITION public.partitioned_flow_inds_1 FOR VALUES IN (1);


--
-- Name: partitioned_flow_inds_2; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_inds_2 (
    flow_id integer,
    ind_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_inds ATTACH PARTITION public.partitioned_flow_inds_2 FOR VALUES IN (2);


--
-- Name: partitioned_flow_inds_3; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_inds_3 (
    flow_id integer,
    ind_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_inds ATTACH PARTITION public.partitioned_flow_inds_3 FOR VALUES IN (3);


--
-- Name: partitioned_flow_inds_67; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_inds_67 (
    flow_id integer,
    ind_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_inds ATTACH PARTITION public.partitioned_flow_inds_67 FOR VALUES IN (67);


--
-- Name: partitioned_flow_inds_71; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_inds_71 (
    flow_id integer,
    ind_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_inds ATTACH PARTITION public.partitioned_flow_inds_71 FOR VALUES IN (71);


--
-- Name: partitioned_flow_inds_72; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_inds_72 (
    flow_id integer,
    ind_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_inds ATTACH PARTITION public.partitioned_flow_inds_72 FOR VALUES IN (72);


--
-- Name: partitioned_flow_inds_84; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_inds_84 (
    flow_id integer,
    ind_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_inds ATTACH PARTITION public.partitioned_flow_inds_84 FOR VALUES IN (84);


--
-- Name: partitioned_flow_inds_85; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_inds_85 (
    flow_id integer,
    ind_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_inds ATTACH PARTITION public.partitioned_flow_inds_85 FOR VALUES IN (85);


--
-- Name: partitioned_flow_inds_90; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_inds_90 (
    flow_id integer,
    ind_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_inds ATTACH PARTITION public.partitioned_flow_inds_90 FOR VALUES IN (90);


--
-- Name: partitioned_flow_inds_95; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_inds_95 (
    flow_id integer,
    ind_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_inds ATTACH PARTITION public.partitioned_flow_inds_95 FOR VALUES IN (95);


--
-- Name: partitioned_flow_inds_96; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_inds_96 (
    flow_id integer,
    ind_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_inds ATTACH PARTITION public.partitioned_flow_inds_96 FOR VALUES IN (96);


--
-- Name: partitioned_flow_inds_97; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_inds_97 (
    flow_id integer,
    ind_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_inds ATTACH PARTITION public.partitioned_flow_inds_97 FOR VALUES IN (97);


--
-- Name: partitioned_flow_quals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quals (
    flow_id integer,
    qual_id integer,
    value text
)
PARTITION BY LIST (qual_id);


--
-- Name: partitioned_flow_quals_2; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quals_2 (
    flow_id integer,
    qual_id integer,
    value text
);
ALTER TABLE ONLY public.partitioned_flow_quals ATTACH PARTITION public.partitioned_flow_quals_2 FOR VALUES IN (2);


--
-- Name: partitioned_flow_quals_3; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quals_3 (
    flow_id integer,
    qual_id integer,
    value text
);
ALTER TABLE ONLY public.partitioned_flow_quals ATTACH PARTITION public.partitioned_flow_quals_3 FOR VALUES IN (3);


--
-- Name: partitioned_flow_quals_4; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quals_4 (
    flow_id integer,
    qual_id integer,
    value text
);
ALTER TABLE ONLY public.partitioned_flow_quals ATTACH PARTITION public.partitioned_flow_quals_4 FOR VALUES IN (4);


--
-- Name: partitioned_flow_quals_41; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quals_41 (
    flow_id integer,
    qual_id integer,
    value text
);
ALTER TABLE ONLY public.partitioned_flow_quals ATTACH PARTITION public.partitioned_flow_quals_41 FOR VALUES IN (41);


--
-- Name: partitioned_flow_quals_43; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quals_43 (
    flow_id integer,
    qual_id integer,
    value text
);
ALTER TABLE ONLY public.partitioned_flow_quals ATTACH PARTITION public.partitioned_flow_quals_43 FOR VALUES IN (43);


--
-- Name: partitioned_flow_quals_44; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quals_44 (
    flow_id integer,
    qual_id integer,
    value text
);
ALTER TABLE ONLY public.partitioned_flow_quals ATTACH PARTITION public.partitioned_flow_quals_44 FOR VALUES IN (44);


--
-- Name: partitioned_flow_quals_45; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quals_45 (
    flow_id integer,
    qual_id integer,
    value text
);
ALTER TABLE ONLY public.partitioned_flow_quals ATTACH PARTITION public.partitioned_flow_quals_45 FOR VALUES IN (45);


--
-- Name: partitioned_flow_quals_48; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quals_48 (
    flow_id integer,
    qual_id integer,
    value text
);
ALTER TABLE ONLY public.partitioned_flow_quals ATTACH PARTITION public.partitioned_flow_quals_48 FOR VALUES IN (48);


--
-- Name: partitioned_flow_quals_50; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quals_50 (
    flow_id integer,
    qual_id integer,
    value text
);
ALTER TABLE ONLY public.partitioned_flow_quals ATTACH PARTITION public.partitioned_flow_quals_50 FOR VALUES IN (50);


--
-- Name: partitioned_flow_quals_7; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quals_7 (
    flow_id integer,
    qual_id integer,
    value text
);
ALTER TABLE ONLY public.partitioned_flow_quals ATTACH PARTITION public.partitioned_flow_quals_7 FOR VALUES IN (7);


--
-- Name: partitioned_flow_quants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants (
    flow_id integer,
    quant_id integer,
    value double precision
)
PARTITION BY LIST (quant_id);


--
-- Name: partitioned_flow_quants_1; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_1 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_1 FOR VALUES IN (1);


--
-- Name: partitioned_flow_quants_11; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_11 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_11 FOR VALUES IN (11);


--
-- Name: partitioned_flow_quants_12; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_12 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_12 FOR VALUES IN (12);


--
-- Name: partitioned_flow_quants_18; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_18 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_18 FOR VALUES IN (18);


--
-- Name: partitioned_flow_quants_2; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_2 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_2 FOR VALUES IN (2);


--
-- Name: partitioned_flow_quants_28; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_28 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_28 FOR VALUES IN (28);


--
-- Name: partitioned_flow_quants_3; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_3 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_3 FOR VALUES IN (3);


--
-- Name: partitioned_flow_quants_33; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_33 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_33 FOR VALUES IN (33);


--
-- Name: partitioned_flow_quants_34; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_34 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_34 FOR VALUES IN (34);


--
-- Name: partitioned_flow_quants_36; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_36 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_36 FOR VALUES IN (36);


--
-- Name: partitioned_flow_quants_4; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_4 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_4 FOR VALUES IN (4);


--
-- Name: partitioned_flow_quants_41; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_41 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_41 FOR VALUES IN (41);


--
-- Name: partitioned_flow_quants_59; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_59 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_59 FOR VALUES IN (59);


--
-- Name: partitioned_flow_quants_65; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_65 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_65 FOR VALUES IN (65);


--
-- Name: partitioned_flow_quants_67; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_67 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_67 FOR VALUES IN (67);


--
-- Name: partitioned_flow_quants_7; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_7 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_7 FOR VALUES IN (7);


--
-- Name: partitioned_flow_quants_8; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_8 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_8 FOR VALUES IN (8);


--
-- Name: partitioned_flow_quants_80; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_80 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_80 FOR VALUES IN (80);


--
-- Name: partitioned_flow_quants_81; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_81 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_81 FOR VALUES IN (81);


--
-- Name: partitioned_flow_quants_82; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_82 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_82 FOR VALUES IN (82);


--
-- Name: partitioned_flow_quants_83; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_83 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_83 FOR VALUES IN (83);


--
-- Name: partitioned_flow_quants_84; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_84 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_84 FOR VALUES IN (84);


--
-- Name: partitioned_flow_quants_85; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_85 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_85 FOR VALUES IN (85);


--
-- Name: partitioned_flow_quants_86; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_86 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_86 FOR VALUES IN (86);


--
-- Name: partitioned_flow_quants_87; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_87 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_87 FOR VALUES IN (87);


--
-- Name: partitioned_flow_quants_88; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_88 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_88 FOR VALUES IN (88);


--
-- Name: partitioned_flow_quants_89; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_89 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_89 FOR VALUES IN (89);


--
-- Name: partitioned_flow_quants_90; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_90 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_90 FOR VALUES IN (90);


--
-- Name: partitioned_flow_quants_91; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_91 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_91 FOR VALUES IN (91);


--
-- Name: partitioned_flow_quants_93; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_93 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_93 FOR VALUES IN (93);


--
-- Name: partitioned_flow_quants_95; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flow_quants_95 (
    flow_id integer,
    quant_id integer,
    value double precision
);
ALTER TABLE ONLY public.partitioned_flow_quants ATTACH PARTITION public.partitioned_flow_quants_95 FOR VALUES IN (95);


--
-- Name: partitioned_flows; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
)
PARTITION BY LIST (context_id);


--
-- Name: partitioned_flows_1; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_1 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_1 FOR VALUES IN (1);


--
-- Name: partitioned_flows_19; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_19 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_19 FOR VALUES IN (19);


--
-- Name: partitioned_flows_2; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_2 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_2 FOR VALUES IN (2);


--
-- Name: partitioned_flows_35; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_35 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_35 FOR VALUES IN (35);


--
-- Name: partitioned_flows_37; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_37 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_37 FOR VALUES IN (37);


--
-- Name: partitioned_flows_38; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_38 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_38 FOR VALUES IN (38);


--
-- Name: partitioned_flows_39; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_39 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_39 FOR VALUES IN (39);


--
-- Name: partitioned_flows_4; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_4 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_4 FOR VALUES IN (4);


--
-- Name: partitioned_flows_40; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_40 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_40 FOR VALUES IN (40);


--
-- Name: partitioned_flows_42; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_42 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_42 FOR VALUES IN (42);


--
-- Name: partitioned_flows_43; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_43 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_43 FOR VALUES IN (43);


--
-- Name: partitioned_flows_44; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_44 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_44 FOR VALUES IN (44);


--
-- Name: partitioned_flows_45; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_45 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_45 FOR VALUES IN (45);


--
-- Name: partitioned_flows_46; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_46 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_46 FOR VALUES IN (46);


--
-- Name: partitioned_flows_47; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_47 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_47 FOR VALUES IN (47);


--
-- Name: partitioned_flows_48; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_48 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_48 FOR VALUES IN (48);


--
-- Name: partitioned_flows_49; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_49 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_49 FOR VALUES IN (49);


--
-- Name: partitioned_flows_5; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_5 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_5 FOR VALUES IN (5);


--
-- Name: partitioned_flows_50; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_50 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_50 FOR VALUES IN (50);


--
-- Name: partitioned_flows_51; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_51 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_51 FOR VALUES IN (51);


--
-- Name: partitioned_flows_52; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_52 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_52 FOR VALUES IN (52);


--
-- Name: partitioned_flows_53; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_53 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_53 FOR VALUES IN (53);


--
-- Name: partitioned_flows_54; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_54 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_54 FOR VALUES IN (54);


--
-- Name: partitioned_flows_55; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_55 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_55 FOR VALUES IN (55);


--
-- Name: partitioned_flows_56; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_56 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_56 FOR VALUES IN (56);


--
-- Name: partitioned_flows_57; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_57 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_57 FOR VALUES IN (57);


--
-- Name: partitioned_flows_58; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_58 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_58 FOR VALUES IN (58);


--
-- Name: partitioned_flows_59; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_59 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_59 FOR VALUES IN (59);


--
-- Name: partitioned_flows_6; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_6 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_6 FOR VALUES IN (6);


--
-- Name: partitioned_flows_60; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_60 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_60 FOR VALUES IN (60);


--
-- Name: partitioned_flows_61; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_61 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_61 FOR VALUES IN (61);


--
-- Name: partitioned_flows_7; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partitioned_flows_7 (
    id integer,
    context_id integer,
    year smallint,
    path integer[],
    known_path_positions boolean[],
    names text[]
);
ALTER TABLE ONLY public.partitioned_flows ATTACH PARTITION public.partitioned_flows_7 FOR VALUES IN (7);


--
-- Name: profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.profiles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.profiles_id_seq OWNED BY public.profiles.id;


--
-- Name: qual_commodity_properties_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.qual_commodity_properties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: qual_commodity_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.qual_commodity_properties_id_seq OWNED BY public.qual_commodity_properties.id;


--
-- Name: qual_context_properties_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.qual_context_properties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: qual_context_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.qual_context_properties_id_seq OWNED BY public.qual_context_properties.id;


--
-- Name: qual_country_properties_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.qual_country_properties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: qual_country_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.qual_country_properties_id_seq OWNED BY public.qual_country_properties.id;


--
-- Name: qual_properties_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.qual_properties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: qual_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.qual_properties_id_seq OWNED BY public.qual_properties.id;


--
-- Name: qual_values_meta_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.qual_values_meta_mv AS
 WITH flow_paths AS (
         SELECT DISTINCT unnest(flows.path) AS node_id,
            flows.context_id
           FROM public.flows
        ), nodes AS (
         SELECT nodes.id,
            nodes.node_type_id,
            fp.context_id
           FROM (flow_paths fp
             JOIN public.nodes ON ((fp.node_id = nodes.id)))
        ), node_values AS (
         SELECT node_quals.qual_id,
            nodes.context_id,
            contexts.country_id,
            contexts.commodity_id,
            array_agg(DISTINCT nodes.node_type_id ORDER BY nodes.node_type_id) AS node_types_ids,
            array_agg(DISTINCT node_quals.year ORDER BY node_quals.year) AS years
           FROM ((public.node_quals
             JOIN nodes ON ((node_quals.node_id = nodes.id)))
             JOIN public.contexts ON ((nodes.context_id = contexts.id)))
          GROUP BY node_quals.qual_id, GROUPING SETS ((nodes.context_id), (contexts.country_id), (contexts.commodity_id))
        ), node_values_by_context AS (
         SELECT node_values.qual_id,
            jsonb_object_agg(node_values.context_id, jsonb_build_object('years', node_values.years, 'node_types_ids', node_values.node_types_ids)) AS node_values
           FROM node_values
          WHERE ((node_values.commodity_id IS NULL) AND (node_values.country_id IS NULL) AND (node_values.context_id IS NOT NULL))
          GROUP BY node_values.qual_id
        ), node_values_by_country AS (
         SELECT node_values.qual_id,
            jsonb_object_agg(node_values.country_id, jsonb_build_object('years', node_values.years, 'node_types_ids', node_values.node_types_ids)) AS node_values
           FROM node_values
          WHERE ((node_values.commodity_id IS NULL) AND (node_values.country_id IS NOT NULL) AND (node_values.context_id IS NULL))
          GROUP BY node_values.qual_id
        ), node_values_by_commodity AS (
         SELECT node_values.qual_id,
            jsonb_object_agg(node_values.commodity_id, jsonb_build_object('years', node_values.years, 'node_types_ids', node_values.node_types_ids)) AS node_values
           FROM node_values
          WHERE ((node_values.commodity_id IS NOT NULL) AND (node_values.country_id IS NULL) AND (node_values.context_id IS NULL))
          GROUP BY node_values.qual_id
        ), flow_values AS (
         SELECT flow_quals.qual_id,
            flows.context_id,
            contexts.country_id,
            contexts.commodity_id,
            array_agg(DISTINCT flows.year ORDER BY flows.year) AS years
           FROM ((public.flow_quals
             JOIN public.flows ON ((flow_quals.flow_id = flows.id)))
             JOIN public.contexts ON ((flows.context_id = contexts.id)))
          GROUP BY flow_quals.qual_id, GROUPING SETS ((flows.context_id), (contexts.country_id), (contexts.commodity_id))
        ), flow_values_by_context AS (
         SELECT flow_values.qual_id,
            jsonb_object_agg(flow_values.context_id, jsonb_build_object('years', flow_values.years)) AS flow_values
           FROM flow_values
          WHERE ((flow_values.commodity_id IS NULL) AND (flow_values.country_id IS NULL) AND (flow_values.context_id IS NOT NULL))
          GROUP BY flow_values.qual_id
        ), flow_values_by_country AS (
         SELECT flow_values.qual_id,
            jsonb_object_agg(flow_values.country_id, jsonb_build_object('years', flow_values.years)) AS flow_values
           FROM flow_values
          WHERE ((flow_values.commodity_id IS NULL) AND (flow_values.country_id IS NOT NULL) AND (flow_values.context_id IS NULL))
          GROUP BY flow_values.qual_id
        ), flow_values_by_commodity AS (
         SELECT flow_values.qual_id,
            jsonb_object_agg(flow_values.commodity_id, jsonb_build_object('years', flow_values.years)) AS flow_values
           FROM flow_values
          WHERE ((flow_values.commodity_id IS NOT NULL) AND (flow_values.country_id IS NULL) AND (flow_values.context_id IS NULL))
          GROUP BY flow_values.qual_id
        )
 SELECT quals.id AS qual_id,
    jsonb_build_object('context', nv1.node_values, 'country', nv2.node_values, 'commodity', nv3.node_values) AS node_values,
    jsonb_build_object('context', fv1.flow_values, 'country', fv2.flow_values, 'commodity', fv3.flow_values) AS flow_values
   FROM ((((((public.quals
     LEFT JOIN node_values_by_context nv1 ON ((nv1.qual_id = quals.id)))
     LEFT JOIN node_values_by_country nv2 ON ((nv2.qual_id = quals.id)))
     LEFT JOIN node_values_by_commodity nv3 ON ((nv3.qual_id = quals.id)))
     LEFT JOIN flow_values_by_context fv1 ON ((fv1.qual_id = quals.id)))
     LEFT JOIN flow_values_by_country fv2 ON ((fv2.qual_id = quals.id)))
     LEFT JOIN flow_values_by_commodity fv3 ON ((fv3.qual_id = quals.id)))
  WITH NO DATA;


--
-- Name: quals_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.quals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: quals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.quals_id_seq OWNED BY public.quals.id;


--
-- Name: quant_commodity_properties_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.quant_commodity_properties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: quant_commodity_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.quant_commodity_properties_id_seq OWNED BY public.quant_commodity_properties.id;


--
-- Name: quant_context_properties_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.quant_context_properties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: quant_context_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.quant_context_properties_id_seq OWNED BY public.quant_context_properties.id;


--
-- Name: quant_country_properties_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.quant_country_properties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: quant_country_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.quant_country_properties_id_seq OWNED BY public.quant_country_properties.id;


--
-- Name: quant_properties_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.quant_properties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: quant_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.quant_properties_id_seq OWNED BY public.quant_properties.id;


--
-- Name: quant_values_meta_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.quant_values_meta_mv AS
 WITH flow_paths AS (
         SELECT DISTINCT unnest(flows.path) AS node_id,
            flows.context_id
           FROM public.flows
        ), nodes AS (
         SELECT nodes.id,
            nodes.node_type_id,
            fp.context_id
           FROM (flow_paths fp
             JOIN public.nodes ON ((fp.node_id = nodes.id)))
        ), node_values AS (
         SELECT node_quants.quant_id,
            nodes.context_id,
            contexts.country_id,
            contexts.commodity_id,
            array_agg(DISTINCT nodes.node_type_id ORDER BY nodes.node_type_id) AS node_types_ids,
            array_agg(DISTINCT node_quants.year ORDER BY node_quants.year) AS years
           FROM ((public.node_quants
             JOIN nodes ON ((node_quants.node_id = nodes.id)))
             JOIN public.contexts ON ((nodes.context_id = contexts.id)))
          GROUP BY node_quants.quant_id, GROUPING SETS ((nodes.context_id), (contexts.country_id), (contexts.commodity_id))
        ), node_values_by_context AS (
         SELECT node_values.quant_id,
            jsonb_object_agg(node_values.context_id, jsonb_build_object('years', node_values.years, 'node_types_ids', node_values.node_types_ids)) AS node_values
           FROM node_values
          WHERE ((node_values.commodity_id IS NULL) AND (node_values.country_id IS NULL) AND (node_values.context_id IS NOT NULL))
          GROUP BY node_values.quant_id
        ), node_values_by_country AS (
         SELECT node_values.quant_id,
            jsonb_object_agg(node_values.country_id, jsonb_build_object('years', node_values.years, 'node_types_ids', node_values.node_types_ids)) AS node_values
           FROM node_values
          WHERE ((node_values.commodity_id IS NULL) AND (node_values.country_id IS NOT NULL) AND (node_values.context_id IS NULL))
          GROUP BY node_values.quant_id
        ), node_values_by_commodity AS (
         SELECT node_values.quant_id,
            jsonb_object_agg(node_values.commodity_id, jsonb_build_object('years', node_values.years, 'node_types_ids', node_values.node_types_ids)) AS node_values
           FROM node_values
          WHERE ((node_values.commodity_id IS NOT NULL) AND (node_values.country_id IS NULL) AND (node_values.context_id IS NULL))
          GROUP BY node_values.quant_id
        ), flow_values AS (
         SELECT flow_quants.quant_id,
            flows.context_id,
            contexts.country_id,
            contexts.commodity_id,
            array_agg(DISTINCT flows.year ORDER BY flows.year) AS years
           FROM ((public.flow_quants
             JOIN public.flows ON ((flow_quants.flow_id = flows.id)))
             JOIN public.contexts ON ((flows.context_id = contexts.id)))
          GROUP BY flow_quants.quant_id, GROUPING SETS ((flows.context_id), (contexts.country_id), (contexts.commodity_id))
        ), flow_values_by_context AS (
         SELECT flow_values.quant_id,
            jsonb_object_agg(flow_values.context_id, jsonb_build_object('years', flow_values.years)) AS flow_values
           FROM flow_values
          WHERE ((flow_values.commodity_id IS NULL) AND (flow_values.country_id IS NULL) AND (flow_values.context_id IS NOT NULL))
          GROUP BY flow_values.quant_id
        ), flow_values_by_country AS (
         SELECT flow_values.quant_id,
            jsonb_object_agg(flow_values.country_id, jsonb_build_object('years', flow_values.years)) AS flow_values
           FROM flow_values
          WHERE ((flow_values.commodity_id IS NULL) AND (flow_values.country_id IS NOT NULL) AND (flow_values.context_id IS NULL))
          GROUP BY flow_values.quant_id
        ), flow_values_by_commodity AS (
         SELECT flow_values.quant_id,
            jsonb_object_agg(flow_values.commodity_id, jsonb_build_object('years', flow_values.years)) AS flow_values
           FROM flow_values
          WHERE ((flow_values.commodity_id IS NOT NULL) AND (flow_values.country_id IS NULL) AND (flow_values.context_id IS NULL))
          GROUP BY flow_values.quant_id
        )
 SELECT quants.id AS quant_id,
    jsonb_build_object('context', nv1.node_values, 'country', nv2.node_values, 'commodity', nv3.node_values) AS node_values,
    jsonb_build_object('context', fv1.flow_values, 'country', fv2.flow_values, 'commodity', fv3.flow_values) AS flow_values
   FROM ((((((public.quants
     LEFT JOIN node_values_by_context nv1 ON ((nv1.quant_id = quants.id)))
     LEFT JOIN node_values_by_country nv2 ON ((nv2.quant_id = quants.id)))
     LEFT JOIN node_values_by_commodity nv3 ON ((nv3.quant_id = quants.id)))
     LEFT JOIN flow_values_by_context fv1 ON ((fv1.quant_id = quants.id)))
     LEFT JOIN flow_values_by_country fv2 ON ((fv2.quant_id = quants.id)))
     LEFT JOIN flow_values_by_commodity fv3 ON ((fv3.quant_id = quants.id)))
  WITH NO DATA;


--
-- Name: quants_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.quants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: quants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.quants_id_seq OWNED BY public.quants.id;


--
-- Name: recolor_by_attributes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recolor_by_attributes (
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
-- Name: TABLE recolor_by_attributes; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.recolor_by_attributes IS 'Attributes (inds/quals) available for recoloring.';


--
-- Name: COLUMN recolor_by_attributes.group_number; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.recolor_by_attributes.group_number IS 'Attributes are displayed grouped by their group number, with a separator between groups';


--
-- Name: COLUMN recolor_by_attributes."position"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.recolor_by_attributes."position" IS 'Display order in scope of context and group number';


--
-- Name: COLUMN recolor_by_attributes.legend_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.recolor_by_attributes.legend_type IS 'Type of legend, e.g. linear';


--
-- Name: COLUMN recolor_by_attributes.legend_color_theme; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.recolor_by_attributes.legend_color_theme IS 'Color theme of legend, e.g. red-blue';


--
-- Name: COLUMN recolor_by_attributes.interval_count; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.recolor_by_attributes.interval_count IS 'For legends with min / max value, number of intervals of the legend';


--
-- Name: COLUMN recolor_by_attributes.min_value; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.recolor_by_attributes.min_value IS 'Min value for the legend';


--
-- Name: COLUMN recolor_by_attributes.max_value; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.recolor_by_attributes.max_value IS 'Max value for the legend';


--
-- Name: COLUMN recolor_by_attributes.divisor; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.recolor_by_attributes.divisor IS 'Step between intervals for percentual legends';


--
-- Name: COLUMN recolor_by_attributes.tooltip_text; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.recolor_by_attributes.tooltip_text IS 'Tooltip text';


--
-- Name: COLUMN recolor_by_attributes.years; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.recolor_by_attributes.years IS 'Array of years for which to show this attribute in scope of chart; empty (NULL) for all years';


--
-- Name: COLUMN recolor_by_attributes.is_disabled; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.recolor_by_attributes.is_disabled IS 'When set, this attribute is not displayed';


--
-- Name: COLUMN recolor_by_attributes.is_default; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.recolor_by_attributes.is_default IS 'When set, show this attribute by default';


--
-- Name: recolor_by_attributes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.recolor_by_attributes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: recolor_by_attributes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.recolor_by_attributes_id_seq OWNED BY public.recolor_by_attributes.id;


--
-- Name: recolor_by_inds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recolor_by_inds (
    id integer NOT NULL,
    recolor_by_attribute_id integer NOT NULL,
    ind_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE recolor_by_inds; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.recolor_by_inds IS 'Inds available for recoloring (see recolor_by_attributes.)';


--
-- Name: recolor_by_inds_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.recolor_by_inds_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: recolor_by_inds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.recolor_by_inds_id_seq OWNED BY public.recolor_by_inds.id;


--
-- Name: recolor_by_quals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recolor_by_quals (
    id integer NOT NULL,
    recolor_by_attribute_id integer NOT NULL,
    qual_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE recolor_by_quals; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.recolor_by_quals IS 'Quals available for recoloring (see recolor_by_attributes.)';


--
-- Name: recolor_by_quals_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.recolor_by_quals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: recolor_by_quals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.recolor_by_quals_id_seq OWNED BY public.recolor_by_quals.id;


--
-- Name: resize_by_attributes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resize_by_attributes (
    id integer NOT NULL,
    context_id integer NOT NULL,
    group_number integer DEFAULT 1 NOT NULL,
    "position" integer NOT NULL,
    tooltip_text text,
    years integer[],
    is_disabled boolean DEFAULT false NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    is_quick_fact boolean DEFAULT false NOT NULL
);


--
-- Name: TABLE resize_by_attributes; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.resize_by_attributes IS 'Attributes (quants) available for resizing.';


--
-- Name: COLUMN resize_by_attributes.group_number; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.resize_by_attributes.group_number IS 'Group number';


--
-- Name: COLUMN resize_by_attributes."position"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.resize_by_attributes."position" IS 'Display order in scope of context and group number';


--
-- Name: COLUMN resize_by_attributes.tooltip_text; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.resize_by_attributes.tooltip_text IS 'Tooltip text';


--
-- Name: COLUMN resize_by_attributes.years; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.resize_by_attributes.years IS 'Array of years for which to show this attribute in scope of chart; empty (NULL) for all years';


--
-- Name: COLUMN resize_by_attributes.is_disabled; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.resize_by_attributes.is_disabled IS 'When set, this attribute is not displayed';


--
-- Name: COLUMN resize_by_attributes.is_default; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.resize_by_attributes.is_default IS 'When set, show this attribute by default';


--
-- Name: resize_by_attributes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.resize_by_attributes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: resize_by_attributes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.resize_by_attributes_id_seq OWNED BY public.resize_by_attributes.id;


--
-- Name: resize_by_quants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resize_by_quants (
    id integer NOT NULL,
    resize_by_attribute_id integer NOT NULL,
    quant_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: TABLE resize_by_quants; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.resize_by_quants IS 'Quants available for recoloring (see resize_by_attributes.)';


--
-- Name: resize_by_attributes_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.resize_by_attributes_mv AS
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
   FROM ((public.resize_by_quants raq
     JOIN public.resize_by_attributes ra ON ((ra.id = raq.resize_by_attribute_id)))
     JOIN public.attributes a ON (((a.original_id = raq.quant_id) AND (a.original_type = 'Quant'::text))))
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW resize_by_attributes_mv; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON MATERIALIZED VIEW public.resize_by_attributes_mv IS 'Materialized view which merges resize_by_quants with resize_by_attributes.';


--
-- Name: COLUMN resize_by_attributes_mv.attribute_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.resize_by_attributes_mv.attribute_id IS 'References the unique id in attributes.';


--
-- Name: resize_by_quants_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.resize_by_quants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: resize_by_quants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.resize_by_quants_id_seq OWNED BY public.resize_by_quants.id;


--
-- Name: sankey_card_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sankey_card_links (
    id bigint NOT NULL,
    query_params json NOT NULL,
    title text NOT NULL,
    subtitle text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    level1 boolean DEFAULT false NOT NULL,
    level2 boolean DEFAULT false NOT NULL,
    level3 boolean DEFAULT false NOT NULL,
    country_id bigint,
    commodity_id bigint,
    link text
);


--
-- Name: TABLE sankey_card_links; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.sankey_card_links IS 'Quick sankey cards';


--
-- Name: COLUMN sankey_card_links.query_params; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.sankey_card_links.query_params IS 'query params included on the link of the quick sankey card';


--
-- Name: COLUMN sankey_card_links.title; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.sankey_card_links.title IS 'title of the quick sankey card';


--
-- Name: COLUMN sankey_card_links.subtitle; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.sankey_card_links.subtitle IS 'subtitle of the quick sankey card';


--
-- Name: COLUMN sankey_card_links.level1; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.sankey_card_links.level1 IS 'level used when commodity and country are not selected';


--
-- Name: COLUMN sankey_card_links.level2; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.sankey_card_links.level2 IS 'level used when commodity is selected';


--
-- Name: COLUMN sankey_card_links.level3; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.sankey_card_links.level3 IS 'level used when commodity and country are selected';


--
-- Name: sankey_card_links_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sankey_card_links_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sankey_card_links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sankey_card_links_id_seq OWNED BY public.sankey_card_links.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


--
-- Name: top_profile_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.top_profile_images (
    id bigint NOT NULL,
    commodity_id bigint,
    image_file_name character varying,
    image_content_type character varying,
    profile_type character varying,
    image_file_size integer
);


--
-- Name: top_profile_images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.top_profile_images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: top_profile_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.top_profile_images_id_seq OWNED BY public.top_profile_images.id;


--
-- Name: top_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.top_profiles (
    id bigint NOT NULL,
    context_id bigint NOT NULL,
    node_id bigint NOT NULL,
    summary text,
    year integer,
    profile_type character varying,
    top_profile_image_id bigint
);


--
-- Name: top_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.top_profiles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: top_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.top_profiles_id_seq OWNED BY public.top_profiles.id;


--
-- Name: ckeditor_assets id; Type: DEFAULT; Schema: content; Owner: -
--

ALTER TABLE ONLY content.ckeditor_assets ALTER COLUMN id SET DEFAULT nextval('content.ckeditor_assets_id_seq'::regclass);


--
-- Name: pages id; Type: DEFAULT; Schema: content; Owner: -
--

ALTER TABLE ONLY content.pages ALTER COLUMN id SET DEFAULT nextval('content.pages_id_seq'::regclass);


--
-- Name: posts id; Type: DEFAULT; Schema: content; Owner: -
--

ALTER TABLE ONLY content.posts ALTER COLUMN id SET DEFAULT nextval('content.posts_id_seq'::regclass);


--
-- Name: site_dives id; Type: DEFAULT; Schema: content; Owner: -
--

ALTER TABLE ONLY content.site_dives ALTER COLUMN id SET DEFAULT nextval('content.site_dives_id_seq'::regclass);


--
-- Name: staff_groups id; Type: DEFAULT; Schema: content; Owner: -
--

ALTER TABLE ONLY content.staff_groups ALTER COLUMN id SET DEFAULT nextval('content.staff_groups_id_seq'::regclass);


--
-- Name: staff_members id; Type: DEFAULT; Schema: content; Owner: -
--

ALTER TABLE ONLY content.staff_members ALTER COLUMN id SET DEFAULT nextval('content.staff_members_id_seq'::regclass);


--
-- Name: testimonials id; Type: DEFAULT; Schema: content; Owner: -
--

ALTER TABLE ONLY content.testimonials ALTER COLUMN id SET DEFAULT nextval('content.testimonials_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: content; Owner: -
--

ALTER TABLE ONLY content.users ALTER COLUMN id SET DEFAULT nextval('content.users_id_seq'::regclass);


--
-- Name: attributes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attributes ALTER COLUMN id SET DEFAULT nextval('public.attributes_id_seq'::regclass);


--
-- Name: carto_layers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carto_layers ALTER COLUMN id SET DEFAULT nextval('public.carto_layers_id_seq'::regclass);


--
-- Name: chart_attributes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chart_attributes ALTER COLUMN id SET DEFAULT nextval('public.chart_attributes_id_seq'::regclass);


--
-- Name: chart_inds id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chart_inds ALTER COLUMN id SET DEFAULT nextval('public.chart_inds_id_seq'::regclass);


--
-- Name: chart_node_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chart_node_types ALTER COLUMN id SET DEFAULT nextval('public.chart_node_types_id_seq'::regclass);


--
-- Name: chart_quals id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chart_quals ALTER COLUMN id SET DEFAULT nextval('public.chart_quals_id_seq'::regclass);


--
-- Name: chart_quants id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chart_quants ALTER COLUMN id SET DEFAULT nextval('public.chart_quants_id_seq'::regclass);


--
-- Name: charts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.charts ALTER COLUMN id SET DEFAULT nextval('public.charts_id_seq'::regclass);


--
-- Name: commodities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.commodities ALTER COLUMN id SET DEFAULT nextval('public.commodities_id_seq'::regclass);


--
-- Name: context_node_type_properties id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.context_node_type_properties ALTER COLUMN id SET DEFAULT nextval('public.context_node_type_properties_id_seq'::regclass);


--
-- Name: context_node_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.context_node_types ALTER COLUMN id SET DEFAULT nextval('public.context_node_types_id_seq'::regclass);


--
-- Name: context_properties id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.context_properties ALTER COLUMN id SET DEFAULT nextval('public.context_properties_id_seq'::regclass);


--
-- Name: contexts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contexts ALTER COLUMN id SET DEFAULT nextval('public.contexts_id_seq'::regclass);


--
-- Name: contextual_layers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contextual_layers ALTER COLUMN id SET DEFAULT nextval('public.contextual_layers_id_seq'::regclass);


--
-- Name: countries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.countries ALTER COLUMN id SET DEFAULT nextval('public.countries_id_seq'::regclass);


--
-- Name: countries_com_trade_indicators false; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.countries_com_trade_indicators ALTER COLUMN "false" SET DEFAULT nextval('public.countries_com_trade_indicators_false_seq'::regclass);


--
-- Name: countries_wb_indicators id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.countries_wb_indicators ALTER COLUMN id SET DEFAULT nextval('public.countries_wb_indicators_id_seq'::regclass);


--
-- Name: country_properties id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.country_properties ALTER COLUMN id SET DEFAULT nextval('public.country_properties_id_seq'::regclass);


--
-- Name: dashboard_template_commodities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard_template_commodities ALTER COLUMN id SET DEFAULT nextval('public.dashboard_template_commodities_id_seq'::regclass);


--
-- Name: dashboard_template_companies id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard_template_companies ALTER COLUMN id SET DEFAULT nextval('public.dashboard_template_companies_id_seq'::regclass);


--
-- Name: dashboard_template_countries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard_template_countries ALTER COLUMN id SET DEFAULT nextval('public.dashboard_template_countries_id_seq'::regclass);


--
-- Name: dashboard_template_destinations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard_template_destinations ALTER COLUMN id SET DEFAULT nextval('public.dashboard_template_destinations_id_seq'::regclass);


--
-- Name: dashboard_template_sources id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard_template_sources ALTER COLUMN id SET DEFAULT nextval('public.dashboard_template_sources_id_seq'::regclass);


--
-- Name: dashboard_templates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard_templates ALTER COLUMN id SET DEFAULT nextval('public.dashboard_templates_id_seq'::regclass);


--
-- Name: dashboards_attribute_groups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards_attribute_groups ALTER COLUMN id SET DEFAULT nextval('public.dashboards_attribute_groups_id_seq'::regclass);


--
-- Name: dashboards_attributes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards_attributes ALTER COLUMN id SET DEFAULT nextval('public.dashboards_attributes_id_seq'::regclass);


--
-- Name: dashboards_inds id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards_inds ALTER COLUMN id SET DEFAULT nextval('public.dashboards_inds_id_seq'::regclass);


--
-- Name: dashboards_quals id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards_quals ALTER COLUMN id SET DEFAULT nextval('public.dashboards_quals_id_seq'::regclass);


--
-- Name: dashboards_quants id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards_quants ALTER COLUMN id SET DEFAULT nextval('public.dashboards_quants_id_seq'::regclass);


--
-- Name: database_updates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.database_updates ALTER COLUMN id SET DEFAULT nextval('public.database_updates_id_seq'::regclass);


--
-- Name: database_validation_reports id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.database_validation_reports ALTER COLUMN id SET DEFAULT nextval('public.database_validation_reports_id_seq'::regclass);


--
-- Name: download_attributes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_attributes ALTER COLUMN id SET DEFAULT nextval('public.download_attributes_id_seq'::regclass);


--
-- Name: download_quals id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_quals ALTER COLUMN id SET DEFAULT nextval('public.download_quals_id_seq'::regclass);


--
-- Name: download_quants id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_quants ALTER COLUMN id SET DEFAULT nextval('public.download_quants_id_seq'::regclass);


--
-- Name: download_versions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_versions ALTER COLUMN id SET DEFAULT nextval('public.download_versions_id_seq'::regclass);


--
-- Name: external_api_updates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.external_api_updates ALTER COLUMN id SET DEFAULT nextval('public.external_api_updates_id_seq'::regclass);


--
-- Name: flow_inds id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_inds ALTER COLUMN id SET DEFAULT nextval('public.flow_inds_id_seq'::regclass);


--
-- Name: flow_quals id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_quals ALTER COLUMN id SET DEFAULT nextval('public.flow_quals_id_seq'::regclass);


--
-- Name: flow_quants id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_quants ALTER COLUMN id SET DEFAULT nextval('public.flow_quants_id_seq'::regclass);


--
-- Name: flows id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flows ALTER COLUMN id SET DEFAULT nextval('public.flows_id_seq'::regclass);


--
-- Name: ind_commodity_properties id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ind_commodity_properties ALTER COLUMN id SET DEFAULT nextval('public.ind_commodity_properties_id_seq'::regclass);


--
-- Name: ind_context_properties id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ind_context_properties ALTER COLUMN id SET DEFAULT nextval('public.ind_context_properties_id_seq'::regclass);


--
-- Name: ind_country_properties id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ind_country_properties ALTER COLUMN id SET DEFAULT nextval('public.ind_country_properties_id_seq'::regclass);


--
-- Name: ind_properties id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ind_properties ALTER COLUMN id SET DEFAULT nextval('public.ind_properties_id_seq'::regclass);


--
-- Name: inds id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inds ALTER COLUMN id SET DEFAULT nextval('public.inds_id_seq'::regclass);


--
-- Name: map_attribute_groups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_attribute_groups ALTER COLUMN id SET DEFAULT nextval('public.map_attribute_groups_id_seq'::regclass);


--
-- Name: map_attributes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_attributes ALTER COLUMN id SET DEFAULT nextval('public.map_attributes_id_seq'::regclass);


--
-- Name: map_inds id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_inds ALTER COLUMN id SET DEFAULT nextval('public.map_inds_id_seq'::regclass);


--
-- Name: map_quants id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_quants ALTER COLUMN id SET DEFAULT nextval('public.map_quants_id_seq'::regclass);


--
-- Name: node_inds id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.node_inds ALTER COLUMN id SET DEFAULT nextval('public.node_inds_id_seq'::regclass);


--
-- Name: node_properties id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.node_properties ALTER COLUMN id SET DEFAULT nextval('public.node_properties_id_seq'::regclass);


--
-- Name: node_quals id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.node_quals ALTER COLUMN id SET DEFAULT nextval('public.node_quals_id_seq'::regclass);


--
-- Name: node_quants id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.node_quants ALTER COLUMN id SET DEFAULT nextval('public.node_quants_id_seq'::regclass);


--
-- Name: node_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.node_types ALTER COLUMN id SET DEFAULT nextval('public.node_types_id_seq'::regclass);


--
-- Name: nodes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nodes ALTER COLUMN id SET DEFAULT nextval('public.nodes_id_seq'::regclass);


--
-- Name: profiles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles ALTER COLUMN id SET DEFAULT nextval('public.profiles_id_seq'::regclass);


--
-- Name: qual_commodity_properties id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qual_commodity_properties ALTER COLUMN id SET DEFAULT nextval('public.qual_commodity_properties_id_seq'::regclass);


--
-- Name: qual_context_properties id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qual_context_properties ALTER COLUMN id SET DEFAULT nextval('public.qual_context_properties_id_seq'::regclass);


--
-- Name: qual_country_properties id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qual_country_properties ALTER COLUMN id SET DEFAULT nextval('public.qual_country_properties_id_seq'::regclass);


--
-- Name: qual_properties id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qual_properties ALTER COLUMN id SET DEFAULT nextval('public.qual_properties_id_seq'::regclass);


--
-- Name: quals id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quals ALTER COLUMN id SET DEFAULT nextval('public.quals_id_seq'::regclass);


--
-- Name: quant_commodity_properties id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_commodity_properties ALTER COLUMN id SET DEFAULT nextval('public.quant_commodity_properties_id_seq'::regclass);


--
-- Name: quant_context_properties id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_context_properties ALTER COLUMN id SET DEFAULT nextval('public.quant_context_properties_id_seq'::regclass);


--
-- Name: quant_country_properties id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_country_properties ALTER COLUMN id SET DEFAULT nextval('public.quant_country_properties_id_seq'::regclass);


--
-- Name: quant_properties id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_properties ALTER COLUMN id SET DEFAULT nextval('public.quant_properties_id_seq'::regclass);


--
-- Name: quants id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quants ALTER COLUMN id SET DEFAULT nextval('public.quants_id_seq'::regclass);


--
-- Name: recolor_by_attributes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recolor_by_attributes ALTER COLUMN id SET DEFAULT nextval('public.recolor_by_attributes_id_seq'::regclass);


--
-- Name: recolor_by_inds id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recolor_by_inds ALTER COLUMN id SET DEFAULT nextval('public.recolor_by_inds_id_seq'::regclass);


--
-- Name: recolor_by_quals id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recolor_by_quals ALTER COLUMN id SET DEFAULT nextval('public.recolor_by_quals_id_seq'::regclass);


--
-- Name: resize_by_attributes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resize_by_attributes ALTER COLUMN id SET DEFAULT nextval('public.resize_by_attributes_id_seq'::regclass);


--
-- Name: resize_by_quants id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resize_by_quants ALTER COLUMN id SET DEFAULT nextval('public.resize_by_quants_id_seq'::regclass);


--
-- Name: sankey_card_links id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sankey_card_links ALTER COLUMN id SET DEFAULT nextval('public.sankey_card_links_id_seq'::regclass);


--
-- Name: top_profile_images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.top_profile_images ALTER COLUMN id SET DEFAULT nextval('public.top_profile_images_id_seq'::regclass);


--
-- Name: top_profiles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.top_profiles ALTER COLUMN id SET DEFAULT nextval('public.top_profiles_id_seq'::regclass);


--
-- Name: recolor_by_attributes recolor_by_attributes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recolor_by_attributes
    ADD CONSTRAINT recolor_by_attributes_pkey PRIMARY KEY (id);


--
-- Name: recolor_by_attributes_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.recolor_by_attributes_mv AS
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
    a.id AS attribute_id,
    ARRAY[]::text[] AS legend
   FROM ((public.recolor_by_inds rai
     JOIN public.recolor_by_attributes ra ON ((ra.id = rai.recolor_by_attribute_id)))
     JOIN public.attributes a ON (((a.original_id = rai.ind_id) AND (a.original_type = 'Ind'::text))))
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
    a.id AS attribute_id,
    array_agg(DISTINCT flow_quals.value) AS legend
   FROM ((((public.recolor_by_quals raq
     JOIN public.recolor_by_attributes ra ON ((ra.id = raq.recolor_by_attribute_id)))
     JOIN public.attributes a ON (((a.original_id = raq.qual_id) AND (a.original_type = 'Qual'::text))))
     JOIN public.flow_quals ON ((flow_quals.qual_id = raq.qual_id)))
     JOIN public.flows ON (((flow_quals.flow_id = flows.id) AND (flows.context_id = ra.context_id))))
  WHERE (flow_quals.value !~~ 'UNKNOWN%'::text)
  GROUP BY ra.id, a.id
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW recolor_by_attributes_mv; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON MATERIALIZED VIEW public.recolor_by_attributes_mv IS 'Materialized view which merges recolor_by_inds and recolor_by_quals with recolor_by_attributes.';


--
-- Name: COLUMN recolor_by_attributes_mv.attribute_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.recolor_by_attributes_mv.attribute_id IS 'References the unique id in attributes.';


--
-- Name: ckeditor_assets ckeditor_assets_pkey; Type: CONSTRAINT; Schema: content; Owner: -
--

ALTER TABLE ONLY content.ckeditor_assets
    ADD CONSTRAINT ckeditor_assets_pkey PRIMARY KEY (id);


--
-- Name: pages pages_pkey; Type: CONSTRAINT; Schema: content; Owner: -
--

ALTER TABLE ONLY content.pages
    ADD CONSTRAINT pages_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: content; Owner: -
--

ALTER TABLE ONLY content.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: site_dives site_dives_pkey; Type: CONSTRAINT; Schema: content; Owner: -
--

ALTER TABLE ONLY content.site_dives
    ADD CONSTRAINT site_dives_pkey PRIMARY KEY (id);


--
-- Name: staff_groups staff_groups_pkey; Type: CONSTRAINT; Schema: content; Owner: -
--

ALTER TABLE ONLY content.staff_groups
    ADD CONSTRAINT staff_groups_pkey PRIMARY KEY (id);


--
-- Name: staff_members staff_members_pkey; Type: CONSTRAINT; Schema: content; Owner: -
--

ALTER TABLE ONLY content.staff_members
    ADD CONSTRAINT staff_members_pkey PRIMARY KEY (id);


--
-- Name: testimonials testimonials_pkey; Type: CONSTRAINT; Schema: content; Owner: -
--

ALTER TABLE ONLY content.testimonials
    ADD CONSTRAINT testimonials_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: content; Owner: -
--

ALTER TABLE ONLY content.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- Name: attributes attributes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attributes
    ADD CONSTRAINT attributes_pkey PRIMARY KEY (id);


--
-- Name: carto_layers carto_layers_contextual_layer_id_identifier_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carto_layers
    ADD CONSTRAINT carto_layers_contextual_layer_id_identifier_key UNIQUE (contextual_layer_id, identifier);


--
-- Name: carto_layers carto_layers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carto_layers
    ADD CONSTRAINT carto_layers_pkey PRIMARY KEY (id);


--
-- Name: chart_attributes chart_attributes_chart_id_identifier_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chart_attributes
    ADD CONSTRAINT chart_attributes_chart_id_identifier_key UNIQUE (chart_id, identifier);


--
-- Name: chart_attributes chart_attributes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chart_attributes
    ADD CONSTRAINT chart_attributes_pkey PRIMARY KEY (id);


--
-- Name: chart_inds chart_inds_chart_attribute_id_ind_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chart_inds
    ADD CONSTRAINT chart_inds_chart_attribute_id_ind_id_key UNIQUE (chart_attribute_id, ind_id);


--
-- Name: chart_inds chart_inds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chart_inds
    ADD CONSTRAINT chart_inds_pkey PRIMARY KEY (id);


--
-- Name: chart_node_types chart_node_types_chart_id_identifier_position_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chart_node_types
    ADD CONSTRAINT chart_node_types_chart_id_identifier_position_key UNIQUE (chart_id, identifier, "position");


--
-- Name: chart_node_types chart_node_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chart_node_types
    ADD CONSTRAINT chart_node_types_pkey PRIMARY KEY (id);


--
-- Name: chart_quals chart_quals_chart_attribute_id_qual_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chart_quals
    ADD CONSTRAINT chart_quals_chart_attribute_id_qual_id_key UNIQUE (chart_attribute_id, qual_id);


--
-- Name: chart_quals chart_quals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chart_quals
    ADD CONSTRAINT chart_quals_pkey PRIMARY KEY (id);


--
-- Name: chart_quants chart_quants_chart_attribute_id_quant_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chart_quants
    ADD CONSTRAINT chart_quants_chart_attribute_id_quant_id_key UNIQUE (chart_attribute_id, quant_id);


--
-- Name: chart_quants chart_quants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chart_quants
    ADD CONSTRAINT chart_quants_pkey PRIMARY KEY (id);


--
-- Name: charts charts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.charts
    ADD CONSTRAINT charts_pkey PRIMARY KEY (id);


--
-- Name: charts charts_profile_id_parent_id_identifier_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.charts
    ADD CONSTRAINT charts_profile_id_parent_id_identifier_key UNIQUE (profile_id, parent_id, identifier);


--
-- Name: charts charts_profile_id_parent_id_position_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.charts
    ADD CONSTRAINT charts_profile_id_parent_id_position_key UNIQUE (profile_id, parent_id, "position");


--
-- Name: commodities commodities_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.commodities
    ADD CONSTRAINT commodities_name_key UNIQUE (name);


--
-- Name: commodities commodities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.commodities
    ADD CONSTRAINT commodities_pkey PRIMARY KEY (id);


--
-- Name: context_node_type_properties context_node_type_properties_context_node_type_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.context_node_type_properties
    ADD CONSTRAINT context_node_type_properties_context_node_type_id_key UNIQUE (context_node_type_id);


--
-- Name: context_node_type_properties context_node_type_properties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.context_node_type_properties
    ADD CONSTRAINT context_node_type_properties_pkey PRIMARY KEY (id);


--
-- Name: context_node_types context_node_types_context_id_node_type_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.context_node_types
    ADD CONSTRAINT context_node_types_context_id_node_type_id_key UNIQUE (context_id, node_type_id);


--
-- Name: context_node_types context_node_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.context_node_types
    ADD CONSTRAINT context_node_types_pkey PRIMARY KEY (id);


--
-- Name: context_properties context_properties_context_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.context_properties
    ADD CONSTRAINT context_properties_context_id_key UNIQUE (context_id);


--
-- Name: context_properties context_properties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.context_properties
    ADD CONSTRAINT context_properties_pkey PRIMARY KEY (id);


--
-- Name: contexts contexts_country_id_commodity_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contexts
    ADD CONSTRAINT contexts_country_id_commodity_id_key UNIQUE (country_id, commodity_id);


--
-- Name: contexts contexts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contexts
    ADD CONSTRAINT contexts_pkey PRIMARY KEY (id);


--
-- Name: contextual_layers contextual_layers_context_id_identifier_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contextual_layers
    ADD CONSTRAINT contextual_layers_context_id_identifier_key UNIQUE (context_id, identifier);


--
-- Name: contextual_layers contextual_layers_context_id_position_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contextual_layers
    ADD CONSTRAINT contextual_layers_context_id_position_key UNIQUE (context_id, "position");


--
-- Name: contextual_layers contextual_layers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contextual_layers
    ADD CONSTRAINT contextual_layers_pkey PRIMARY KEY (id);


--
-- Name: countries_com_trade_aggregated_indicators countries_com_trade_aggregated_indicators_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.countries_com_trade_aggregated_indicators
    ADD CONSTRAINT countries_com_trade_aggregated_indicators_pkey PRIMARY KEY (commodity_id, iso2, year, activity);


--
-- Name: countries_com_trade_indicators countries_com_trade_indicators_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.countries_com_trade_indicators
    ADD CONSTRAINT countries_com_trade_indicators_pkey PRIMARY KEY ("false");


--
-- Name: countries countries_iso2_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_iso2_key UNIQUE (iso2);


--
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (id);


--
-- Name: countries_wb_indicators countries_wb_indicators_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.countries_wb_indicators
    ADD CONSTRAINT countries_wb_indicators_pkey PRIMARY KEY (id);


--
-- Name: country_properties country_properties_country_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.country_properties
    ADD CONSTRAINT country_properties_country_id_key UNIQUE (country_id);


--
-- Name: country_properties country_properties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.country_properties
    ADD CONSTRAINT country_properties_pkey PRIMARY KEY (id);


--
-- Name: dashboard_template_commodities dashboard_template_commodities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard_template_commodities
    ADD CONSTRAINT dashboard_template_commodities_pkey PRIMARY KEY (id);


--
-- Name: dashboard_template_companies dashboard_template_companies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard_template_companies
    ADD CONSTRAINT dashboard_template_companies_pkey PRIMARY KEY (id);


--
-- Name: dashboard_template_countries dashboard_template_countries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard_template_countries
    ADD CONSTRAINT dashboard_template_countries_pkey PRIMARY KEY (id);


--
-- Name: dashboard_template_destinations dashboard_template_destinations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard_template_destinations
    ADD CONSTRAINT dashboard_template_destinations_pkey PRIMARY KEY (id);


--
-- Name: dashboard_template_sources dashboard_template_sources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard_template_sources
    ADD CONSTRAINT dashboard_template_sources_pkey PRIMARY KEY (id);


--
-- Name: dashboard_templates dashboard_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard_templates
    ADD CONSTRAINT dashboard_templates_pkey PRIMARY KEY (id);


--
-- Name: dashboards_attribute_groups dashboards_attribute_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards_attribute_groups
    ADD CONSTRAINT dashboards_attribute_groups_pkey PRIMARY KEY (id);


--
-- Name: dashboards_attribute_groups dashboards_attribute_groups_position_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards_attribute_groups
    ADD CONSTRAINT dashboards_attribute_groups_position_key UNIQUE ("position");


--
-- Name: dashboards_attributes dashboards_attributes_dashboards_attribute_group_id_position_ke; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards_attributes
    ADD CONSTRAINT dashboards_attributes_dashboards_attribute_group_id_position_ke UNIQUE (dashboards_attribute_group_id, "position");


--
-- Name: dashboards_attributes dashboards_attributes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards_attributes
    ADD CONSTRAINT dashboards_attributes_pkey PRIMARY KEY (id);


--
-- Name: dashboards_commodities dashboards_commodities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards_commodities
    ADD CONSTRAINT dashboards_commodities_pkey PRIMARY KEY (id, node_id, country_id, year);


--
-- Name: dashboards_companies dashboards_companies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards_companies
    ADD CONSTRAINT dashboards_companies_pkey PRIMARY KEY (id, country_id, commodity_id, year);


--
-- Name: dashboards_countries dashboards_countries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards_countries
    ADD CONSTRAINT dashboards_countries_pkey PRIMARY KEY (id, node_id, commodity_id, year);


--
-- Name: dashboards_destinations dashboards_destinations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards_destinations
    ADD CONSTRAINT dashboards_destinations_pkey PRIMARY KEY (id, country_id, commodity_id, year);


--
-- Name: dashboards_exporters dashboards_exporters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards_exporters
    ADD CONSTRAINT dashboards_exporters_pkey PRIMARY KEY (id, country_id, commodity_id, year);


--
-- Name: dashboards_importers dashboards_importers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards_importers
    ADD CONSTRAINT dashboards_importers_pkey PRIMARY KEY (id, country_id, commodity_id, year);


--
-- Name: dashboards_inds dashboards_inds_dashboards_attribute_id_ind_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards_inds
    ADD CONSTRAINT dashboards_inds_dashboards_attribute_id_ind_id_key UNIQUE (dashboards_attribute_id, ind_id);


--
-- Name: dashboards_inds dashboards_inds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards_inds
    ADD CONSTRAINT dashboards_inds_pkey PRIMARY KEY (id);


--
-- Name: dashboards_quals dashboards_quals_dashboards_attribute_id_qual_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards_quals
    ADD CONSTRAINT dashboards_quals_dashboards_attribute_id_qual_id_key UNIQUE (dashboards_attribute_id, qual_id);


--
-- Name: dashboards_quals dashboards_quals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards_quals
    ADD CONSTRAINT dashboards_quals_pkey PRIMARY KEY (id);


--
-- Name: dashboards_quants dashboards_quants_dashboards_attribute_id_quant_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards_quants
    ADD CONSTRAINT dashboards_quants_dashboards_attribute_id_quant_id_key UNIQUE (dashboards_attribute_id, quant_id);


--
-- Name: dashboards_quants dashboards_quants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards_quants
    ADD CONSTRAINT dashboards_quants_pkey PRIMARY KEY (id);


--
-- Name: dashboards_sources dashboards_sources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards_sources
    ADD CONSTRAINT dashboards_sources_pkey PRIMARY KEY (id, country_id, commodity_id, year);


--
-- Name: database_updates database_updates_jid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.database_updates
    ADD CONSTRAINT database_updates_jid_key UNIQUE (jid);


--
-- Name: database_updates database_updates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.database_updates
    ADD CONSTRAINT database_updates_pkey PRIMARY KEY (id);


--
-- Name: database_validation_reports database_validation_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.database_validation_reports
    ADD CONSTRAINT database_validation_reports_pkey PRIMARY KEY (id);


--
-- Name: download_attributes download_attributes_context_id_position_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_attributes
    ADD CONSTRAINT download_attributes_context_id_position_key UNIQUE (context_id, "position");


--
-- Name: download_attributes download_attributes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_attributes
    ADD CONSTRAINT download_attributes_pkey PRIMARY KEY (id);


--
-- Name: download_quals download_quals_download_attribute_id_qual_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_quals
    ADD CONSTRAINT download_quals_download_attribute_id_qual_id_key UNIQUE (download_attribute_id, qual_id);


--
-- Name: download_quals download_quals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_quals
    ADD CONSTRAINT download_quals_pkey PRIMARY KEY (id);


--
-- Name: download_quants download_quants_download_attribute_id_quant_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_quants
    ADD CONSTRAINT download_quants_download_attribute_id_quant_id_key UNIQUE (download_attribute_id, quant_id);


--
-- Name: download_quants download_quants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_quants
    ADD CONSTRAINT download_quants_pkey PRIMARY KEY (id);


--
-- Name: download_versions download_versions_context_id_symbol_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_versions
    ADD CONSTRAINT download_versions_context_id_symbol_key UNIQUE (context_id, symbol);


--
-- Name: download_versions download_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_versions
    ADD CONSTRAINT download_versions_pkey PRIMARY KEY (id);


--
-- Name: external_api_updates external_api_updates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.external_api_updates
    ADD CONSTRAINT external_api_updates_pkey PRIMARY KEY (id);


--
-- Name: flow_inds flow_inds_flow_id_ind_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_inds
    ADD CONSTRAINT flow_inds_flow_id_ind_id_key UNIQUE (flow_id, ind_id);


--
-- Name: flow_inds flow_inds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_inds
    ADD CONSTRAINT flow_inds_pkey PRIMARY KEY (id);


--
-- Name: flow_nodes flow_nodes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_nodes
    ADD CONSTRAINT flow_nodes_pkey PRIMARY KEY (flow_id, node_id);


--
-- Name: flow_quals flow_quals_flow_id_qual_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_quals
    ADD CONSTRAINT flow_quals_flow_id_qual_id_key UNIQUE (flow_id, qual_id);


--
-- Name: flow_quals flow_quals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_quals
    ADD CONSTRAINT flow_quals_pkey PRIMARY KEY (id);


--
-- Name: flow_quants flow_quants_flow_id_quant_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_quants
    ADD CONSTRAINT flow_quants_flow_id_quant_id_key UNIQUE (flow_id, quant_id);


--
-- Name: flow_quants flow_quants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_quants
    ADD CONSTRAINT flow_quants_pkey PRIMARY KEY (id);


--
-- Name: flows flows_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flows
    ADD CONSTRAINT flows_pkey PRIMARY KEY (id);


--
-- Name: ind_commodity_properties ind_commodity_properties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ind_commodity_properties
    ADD CONSTRAINT ind_commodity_properties_pkey PRIMARY KEY (id);


--
-- Name: ind_context_properties ind_context_properties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ind_context_properties
    ADD CONSTRAINT ind_context_properties_pkey PRIMARY KEY (id);


--
-- Name: ind_country_properties ind_country_properties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ind_country_properties
    ADD CONSTRAINT ind_country_properties_pkey PRIMARY KEY (id);


--
-- Name: ind_properties ind_properties_ind_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ind_properties
    ADD CONSTRAINT ind_properties_ind_id_key UNIQUE (ind_id);


--
-- Name: ind_properties ind_properties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ind_properties
    ADD CONSTRAINT ind_properties_pkey PRIMARY KEY (id);


--
-- Name: inds inds_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inds
    ADD CONSTRAINT inds_name_key UNIQUE (name);


--
-- Name: inds inds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inds
    ADD CONSTRAINT inds_pkey PRIMARY KEY (id);


--
-- Name: map_attribute_groups map_attribute_groups_context_id_position_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_attribute_groups
    ADD CONSTRAINT map_attribute_groups_context_id_position_key UNIQUE (context_id, "position");


--
-- Name: map_attribute_groups map_attribute_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_attribute_groups
    ADD CONSTRAINT map_attribute_groups_pkey PRIMARY KEY (id);


--
-- Name: map_attributes map_attributes_map_attribute_group_id_position_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_attributes
    ADD CONSTRAINT map_attributes_map_attribute_group_id_position_key UNIQUE (map_attribute_group_id, "position");


--
-- Name: map_attributes map_attributes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_attributes
    ADD CONSTRAINT map_attributes_pkey PRIMARY KEY (id);


--
-- Name: map_inds map_inds_map_attribute_id_ind_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_inds
    ADD CONSTRAINT map_inds_map_attribute_id_ind_id_key UNIQUE (map_attribute_id, ind_id);


--
-- Name: map_inds map_inds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_inds
    ADD CONSTRAINT map_inds_pkey PRIMARY KEY (id);


--
-- Name: map_quants map_quants_map_attribute_id_quant_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_quants
    ADD CONSTRAINT map_quants_map_attribute_id_quant_id_key UNIQUE (map_attribute_id, quant_id);


--
-- Name: map_quants map_quants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_quants
    ADD CONSTRAINT map_quants_pkey PRIMARY KEY (id);


--
-- Name: node_inds node_inds_node_id_ind_id_year_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.node_inds
    ADD CONSTRAINT node_inds_node_id_ind_id_year_key UNIQUE (node_id, ind_id, year);


--
-- Name: node_inds node_inds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.node_inds
    ADD CONSTRAINT node_inds_pkey PRIMARY KEY (id);


--
-- Name: node_properties node_properties_node_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.node_properties
    ADD CONSTRAINT node_properties_node_id_key UNIQUE (node_id);


--
-- Name: node_properties node_properties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.node_properties
    ADD CONSTRAINT node_properties_pkey PRIMARY KEY (id);


--
-- Name: node_quals node_quals_node_id_qual_id_year_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.node_quals
    ADD CONSTRAINT node_quals_node_id_qual_id_year_key UNIQUE (node_id, qual_id, year);


--
-- Name: node_quals node_quals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.node_quals
    ADD CONSTRAINT node_quals_pkey PRIMARY KEY (id);


--
-- Name: node_quants node_quants_node_id_quant_id_year_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.node_quants
    ADD CONSTRAINT node_quants_node_id_quant_id_year_key UNIQUE (node_id, quant_id, year);


--
-- Name: node_quants node_quants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.node_quants
    ADD CONSTRAINT node_quants_pkey PRIMARY KEY (id);


--
-- Name: node_types node_types_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.node_types
    ADD CONSTRAINT node_types_name_key UNIQUE (name);


--
-- Name: node_types node_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.node_types
    ADD CONSTRAINT node_types_pkey PRIMARY KEY (id);


--
-- Name: nodes nodes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT nodes_pkey PRIMARY KEY (id);


--
-- Name: nodes_with_flows_or_geo nodes_with_flows_or_geo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nodes_with_flows_or_geo
    ADD CONSTRAINT nodes_with_flows_or_geo_pkey PRIMARY KEY (id, context_id);


--
-- Name: nodes_with_flows_per_year nodes_with_flows_per_year_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nodes_with_flows_per_year
    ADD CONSTRAINT nodes_with_flows_per_year_pkey PRIMARY KEY (id, context_id, year);


--
-- Name: nodes_with_flows nodes_with_flows_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nodes_with_flows
    ADD CONSTRAINT nodes_with_flows_pkey PRIMARY KEY (id, context_id);


--
-- Name: profiles profiles_context_node_type_id_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_context_node_type_id_name_key UNIQUE (context_node_type_id, name);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: qual_commodity_properties qual_commodity_properties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qual_commodity_properties
    ADD CONSTRAINT qual_commodity_properties_pkey PRIMARY KEY (id);


--
-- Name: qual_context_properties qual_context_properties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qual_context_properties
    ADD CONSTRAINT qual_context_properties_pkey PRIMARY KEY (id);


--
-- Name: qual_country_properties qual_country_properties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qual_country_properties
    ADD CONSTRAINT qual_country_properties_pkey PRIMARY KEY (id);


--
-- Name: qual_properties qual_properties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qual_properties
    ADD CONSTRAINT qual_properties_pkey PRIMARY KEY (id);


--
-- Name: qual_properties qual_properties_qual_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qual_properties
    ADD CONSTRAINT qual_properties_qual_id_key UNIQUE (qual_id);


--
-- Name: quals quals_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quals
    ADD CONSTRAINT quals_name_key UNIQUE (name);


--
-- Name: quals quals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quals
    ADD CONSTRAINT quals_pkey PRIMARY KEY (id);


--
-- Name: quant_commodity_properties quant_commodity_properties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_commodity_properties
    ADD CONSTRAINT quant_commodity_properties_pkey PRIMARY KEY (id);


--
-- Name: quant_context_properties quant_context_properties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_context_properties
    ADD CONSTRAINT quant_context_properties_pkey PRIMARY KEY (id);


--
-- Name: quant_country_properties quant_country_properties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_country_properties
    ADD CONSTRAINT quant_country_properties_pkey PRIMARY KEY (id);


--
-- Name: quant_properties quant_properties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_properties
    ADD CONSTRAINT quant_properties_pkey PRIMARY KEY (id);


--
-- Name: quant_properties quant_properties_quant_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_properties
    ADD CONSTRAINT quant_properties_quant_id_key UNIQUE (quant_id);


--
-- Name: quants quants_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quants
    ADD CONSTRAINT quants_name_key UNIQUE (name);


--
-- Name: quants quants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quants
    ADD CONSTRAINT quants_pkey PRIMARY KEY (id);


--
-- Name: recolor_by_inds recolor_by_inds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recolor_by_inds
    ADD CONSTRAINT recolor_by_inds_pkey PRIMARY KEY (id);


--
-- Name: recolor_by_inds recolor_by_inds_recolor_by_attribute_id_ind_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recolor_by_inds
    ADD CONSTRAINT recolor_by_inds_recolor_by_attribute_id_ind_id_key UNIQUE (recolor_by_attribute_id, ind_id);


--
-- Name: recolor_by_quals recolor_by_quals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recolor_by_quals
    ADD CONSTRAINT recolor_by_quals_pkey PRIMARY KEY (id);


--
-- Name: recolor_by_quals recolor_by_quals_recolor_by_attribute_id_qual_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recolor_by_quals
    ADD CONSTRAINT recolor_by_quals_recolor_by_attribute_id_qual_id_key UNIQUE (recolor_by_attribute_id, qual_id);


--
-- Name: resize_by_attributes resize_by_attributes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resize_by_attributes
    ADD CONSTRAINT resize_by_attributes_pkey PRIMARY KEY (id);


--
-- Name: resize_by_quants resize_by_quants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resize_by_quants
    ADD CONSTRAINT resize_by_quants_pkey PRIMARY KEY (id);


--
-- Name: resize_by_quants resize_by_quants_resize_by_attribute_id_quant_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resize_by_quants
    ADD CONSTRAINT resize_by_quants_resize_by_attribute_id_quant_id_key UNIQUE (resize_by_attribute_id, quant_id);


--
-- Name: sankey_card_links sankey_card_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sankey_card_links
    ADD CONSTRAINT sankey_card_links_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: top_profile_images top_profile_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.top_profile_images
    ADD CONSTRAINT top_profile_images_pkey PRIMARY KEY (id);


--
-- Name: top_profiles top_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.top_profiles
    ADD CONSTRAINT top_profiles_pkey PRIMARY KEY (id);


--
-- Name: idx_ckeditor_assetable; Type: INDEX; Schema: content; Owner: -
--

CREATE INDEX idx_ckeditor_assetable ON content.ckeditor_assets USING btree (assetable_type, assetable_id);


--
-- Name: idx_ckeditor_assetable_type; Type: INDEX; Schema: content; Owner: -
--

CREATE INDEX idx_ckeditor_assetable_type ON content.ckeditor_assets USING btree (assetable_type, type, assetable_id);


--
-- Name: index_users_on_email; Type: INDEX; Schema: content; Owner: -
--

CREATE UNIQUE INDEX index_users_on_email ON content.users USING btree (email);


--
-- Name: index_users_on_reset_password_token; Type: INDEX; Schema: content; Owner: -
--

CREATE UNIQUE INDEX index_users_on_reset_password_token ON content.users USING btree (reset_password_token);


--
-- Name: attributes_original_type_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX attributes_original_type_name_idx ON public.attributes USING btree (original_type, name);


--
-- Name: chart_attributes_chart_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chart_attributes_chart_id_idx ON public.chart_attributes USING btree (chart_id);


--
-- Name: chart_attributes_chart_id_position_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX chart_attributes_chart_id_position_idx ON public.chart_attributes USING btree (chart_id, "position") WHERE (identifier IS NULL);


--
-- Name: chart_attributes_mv_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX chart_attributes_mv_id_idx ON public.chart_attributes_mv USING btree (id);


--
-- Name: chart_quals_chart_attribute_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chart_quals_chart_attribute_id_idx ON public.chart_quals USING btree (chart_attribute_id);


--
-- Name: chart_quals_qual_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chart_quals_qual_id_idx ON public.chart_quals USING btree (qual_id);


--
-- Name: chart_quants_chart_attribute_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chart_quants_chart_attribute_id_idx ON public.chart_quants USING btree (chart_attribute_id);


--
-- Name: chart_quants_quant_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chart_quants_quant_id_idx ON public.chart_quants USING btree (quant_id);


--
-- Name: charts_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX charts_parent_id_idx ON public.charts USING btree (parent_id);


--
-- Name: commodity_attribute_properties_mv_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX commodity_attribute_properties_mv_id_idx ON public.commodity_attribute_properties_mv USING btree (id, commodity_id, qual_id, quant_id, ind_id);


--
-- Name: context_attribute_properties_mv_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX context_attribute_properties_mv_id_idx ON public.context_attribute_properties_mv USING btree (context_id, qual_id, quant_id, ind_id);


--
-- Name: context_node_type_properties_context_node_type_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX context_node_type_properties_context_node_type_id_idx ON public.context_node_type_properties USING btree (context_node_type_id);


--
-- Name: context_node_types_context_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX context_node_types_context_id_idx ON public.context_node_types USING btree (context_id);


--
-- Name: context_node_types_node_type_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX context_node_types_node_type_id_idx ON public.context_node_types USING btree (node_type_id);


--
-- Name: context_properties_context_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX context_properties_context_id_idx ON public.context_properties USING btree (context_id);


--
-- Name: contexts_commodity_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX contexts_commodity_id_idx ON public.contexts USING btree (commodity_id);


--
-- Name: contexts_mv_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX contexts_mv_id_idx ON public.contexts_mv USING btree (id);


--
-- Name: contextual_layers_context_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX contextual_layers_context_id_idx ON public.contextual_layers USING btree (context_id);


--
-- Name: country_attribute_properties_mv_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX country_attribute_properties_mv_idx ON public.country_attribute_properties_mv USING btree (id, country_id, qual_id, quant_id, ind_id);


--
-- Name: dashboards_attributes_mv_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX dashboards_attributes_mv_id_idx ON public.dashboards_attributes_mv USING btree (id);


--
-- Name: dashboards_commodities_country_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_commodities_country_id_idx ON public.dashboards_commodities USING btree (country_id);


--
-- Name: dashboards_commodities_name_tsvector_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_commodities_name_tsvector_idx ON public.dashboards_commodities USING btree (name_tsvector);


--
-- Name: dashboards_commodities_node_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_commodities_node_id_idx ON public.dashboards_commodities USING btree (node_id);


--
-- Name: dashboards_companies_commodity_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_companies_commodity_id_idx ON public.dashboards_companies USING btree (commodity_id);


--
-- Name: dashboards_companies_country_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_companies_country_id_idx ON public.dashboards_companies USING btree (country_id);


--
-- Name: dashboards_companies_name_tsvector_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_companies_name_tsvector_idx ON public.dashboards_companies USING btree (name_tsvector);


--
-- Name: dashboards_companies_node_type_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_companies_node_type_id_idx ON public.dashboards_companies USING btree (node_type_id);


--
-- Name: dashboards_countries_commodity_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_countries_commodity_id_idx ON public.dashboards_countries USING btree (commodity_id);


--
-- Name: dashboards_countries_name_tsvector_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_countries_name_tsvector_idx ON public.dashboards_countries USING btree (name_tsvector);


--
-- Name: dashboards_countries_node_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_countries_node_id_idx ON public.dashboards_countries USING btree (node_id);


--
-- Name: dashboards_destinations_commodity_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_destinations_commodity_id_idx ON public.dashboards_destinations USING btree (commodity_id);


--
-- Name: dashboards_destinations_country_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_destinations_country_id_idx ON public.dashboards_destinations USING btree (country_id);


--
-- Name: dashboards_destinations_name_tsvector_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_destinations_name_tsvector_idx ON public.dashboards_destinations USING btree (name_tsvector);


--
-- Name: dashboards_destinations_node_type_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_destinations_node_type_id_idx ON public.dashboards_destinations USING btree (node_type_id);


--
-- Name: dashboards_exporters_commodity_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_exporters_commodity_id_idx ON public.dashboards_exporters USING btree (commodity_id);


--
-- Name: dashboards_exporters_country_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_exporters_country_id_idx ON public.dashboards_exporters USING btree (country_id);


--
-- Name: dashboards_exporters_name_tsvector_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_exporters_name_tsvector_idx ON public.dashboards_exporters USING btree (name_tsvector);


--
-- Name: dashboards_exporters_node_type_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_exporters_node_type_id_idx ON public.dashboards_exporters USING btree (node_type_id);


--
-- Name: dashboards_importers_commodity_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_importers_commodity_id_idx ON public.dashboards_importers USING btree (commodity_id);


--
-- Name: dashboards_importers_country_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_importers_country_id_idx ON public.dashboards_importers USING btree (country_id);


--
-- Name: dashboards_importers_name_tsvector_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_importers_name_tsvector_idx ON public.dashboards_importers USING btree (name_tsvector);


--
-- Name: dashboards_importers_node_type_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_importers_node_type_id_idx ON public.dashboards_importers USING btree (node_type_id);


--
-- Name: dashboards_sources_commodity_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_sources_commodity_id_idx ON public.dashboards_sources USING btree (commodity_id);


--
-- Name: dashboards_sources_country_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_sources_country_id_idx ON public.dashboards_sources USING btree (country_id);


--
-- Name: dashboards_sources_name_tsvector_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_sources_name_tsvector_idx ON public.dashboards_sources USING btree (name_tsvector);


--
-- Name: dashboards_sources_node_type_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_sources_node_type_id_idx ON public.dashboards_sources USING btree (node_type_id);


--
-- Name: database_updates_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX database_updates_status_idx ON public.database_updates USING btree (status) WHERE (status = 'STARTED'::text);


--
-- Name: download_attributes_mv_context_id_original_type_original_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX download_attributes_mv_context_id_original_type_original_id_idx ON public.download_attributes_mv USING btree (context_id, original_type, original_id);


--
-- Name: download_attributes_mv_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX download_attributes_mv_id_idx ON public.download_attributes_mv USING btree (id);


--
-- Name: download_flows_stats_mv_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX download_flows_stats_mv_id_idx ON public.download_flows_stats_mv USING btree (context_id, year, attribute_type, attribute_id);


--
-- Name: download_quants_download_attribute_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX download_quants_download_attribute_id_idx ON public.download_quants USING btree (download_attribute_id);


--
-- Name: download_quants_quant_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX download_quants_quant_id_idx ON public.download_quants USING btree (quant_id);


--
-- Name: download_versions_context_id_is_current_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX download_versions_context_id_is_current_idx ON public.download_versions USING btree (context_id, is_current) WHERE (is_current IS TRUE);


--
-- Name: flow_attributes_mv_attribute_id_context_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX flow_attributes_mv_attribute_id_context_id_idx ON public.flow_attributes_mv USING btree (attribute_id, context_id);


--
-- Name: flow_inds_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX flow_inds_flow_id_idx ON public.flow_inds USING btree (flow_id);


--
-- Name: flow_inds_ind_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX flow_inds_ind_id_idx ON public.flow_inds USING btree (ind_id);


--
-- Name: flow_nodes_context_id_position_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX flow_nodes_context_id_position_idx ON public.flow_nodes USING btree (context_id, "position");


--
-- Name: flow_nodes_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX flow_nodes_flow_id_idx ON public.flow_nodes USING btree (flow_id);


--
-- Name: flow_nodes_node_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX flow_nodes_node_id_idx ON public.flow_nodes USING btree (node_id);


--
-- Name: flow_quals_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX flow_quals_flow_id_idx ON public.flow_quals USING btree (flow_id);


--
-- Name: flow_quals_qual_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX flow_quals_qual_id_idx ON public.flow_quals USING btree (qual_id);


--
-- Name: flow_quant_totals_mv_commodity_id_country_id_quant_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX flow_quant_totals_mv_commodity_id_country_id_quant_id_idx ON public.flow_quant_totals_mv USING btree (commodity_id, country_id, quant_id);


--
-- Name: flow_quants_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX flow_quants_flow_id_idx ON public.flow_quants USING btree (flow_id);


--
-- Name: flow_quants_quant_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX flow_quants_quant_id_idx ON public.flow_quants USING btree (quant_id);


--
-- Name: flows_context_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX flows_context_id_idx ON public.flows USING btree (context_id);


--
-- Name: flows_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX flows_context_id_year_idx ON public.flows USING btree (context_id, year);


--
-- Name: ind_commodity_properties_commodity_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ind_commodity_properties_commodity_id_idx ON public.ind_commodity_properties USING btree (commodity_id);


--
-- Name: ind_commodity_properties_ind_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ind_commodity_properties_ind_id_idx ON public.ind_commodity_properties USING btree (ind_id);


--
-- Name: ind_context_properties_context_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ind_context_properties_context_id_idx ON public.ind_context_properties USING btree (context_id);


--
-- Name: ind_context_properties_ind_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ind_context_properties_ind_id_idx ON public.ind_context_properties USING btree (ind_id);


--
-- Name: ind_country_properties_country_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ind_country_properties_country_id_idx ON public.ind_country_properties USING btree (country_id);


--
-- Name: ind_country_properties_ind_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ind_country_properties_ind_id_idx ON public.ind_country_properties USING btree (ind_id);


--
-- Name: ind_values_meta_mv_ind_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ind_values_meta_mv_ind_id_idx ON public.ind_values_meta_mv USING btree (ind_id);


--
-- Name: index_sankey_card_links_on_commodity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_sankey_card_links_on_commodity_id ON public.sankey_card_links USING btree (commodity_id);


--
-- Name: index_sankey_card_links_on_country_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_sankey_card_links_on_country_id ON public.sankey_card_links USING btree (country_id);


--
-- Name: index_top_profile_images_on_commodity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_top_profile_images_on_commodity_id ON public.top_profile_images USING btree (commodity_id);


--
-- Name: index_top_profiles_on_context_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_top_profiles_on_context_id ON public.top_profiles USING btree (context_id);


--
-- Name: index_top_profiles_on_node_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_top_profiles_on_node_id ON public.top_profiles USING btree (node_id);


--
-- Name: index_top_profiles_on_top_profile_image_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_top_profiles_on_top_profile_image_id ON public.top_profiles USING btree (top_profile_image_id);


--
-- Name: map_attributes_mv_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX map_attributes_mv_id_idx ON public.map_attributes_mv USING btree (id);


--
-- Name: map_quants_map_attribute_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX map_quants_map_attribute_id_idx ON public.map_quants USING btree (map_attribute_id);


--
-- Name: map_quants_quant_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX map_quants_quant_id_idx ON public.map_quants USING btree (quant_id);


--
-- Name: node_inds_ind_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX node_inds_ind_id_idx ON public.node_inds USING btree (ind_id);


--
-- Name: node_inds_node_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX node_inds_node_id_idx ON public.node_inds USING btree (node_id);


--
-- Name: node_properties_node_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX node_properties_node_id_idx ON public.node_properties USING btree (node_id);


--
-- Name: node_quals_node_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX node_quals_node_id_idx ON public.node_quals USING btree (node_id);


--
-- Name: node_quals_qual_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX node_quals_qual_id_idx ON public.node_quals USING btree (qual_id);


--
-- Name: node_quants_node_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX node_quants_node_id_idx ON public.node_quants USING btree (node_id);


--
-- Name: node_quants_quant_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX node_quants_quant_id_idx ON public.node_quants USING btree (quant_id);


--
-- Name: nodes_node_type_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX nodes_node_type_id_idx ON public.nodes USING btree (node_type_id);


--
-- Name: nodes_per_context_ranked_by_volume_per_year_mv_unique_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX nodes_per_context_ranked_by_volume_per_year_mv_unique_idx ON public.nodes_per_context_ranked_by_volume_per_year_mv USING btree (context_id, node_id);


--
-- Name: nodes_stats_mv_context_year_quant_node_node_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX nodes_stats_mv_context_year_quant_node_node_type_idx ON public.nodes_stats_mv USING btree (context_id, year, quant_id, node_id, node_type_id);


--
-- Name: nodes_with_flows_context_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX nodes_with_flows_context_id_idx ON public.nodes_with_flows USING btree (context_id);


--
-- Name: nodes_with_flows_name_tsvector_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX nodes_with_flows_name_tsvector_idx ON public.nodes_with_flows USING btree (name_tsvector);


--
-- Name: nodes_with_flows_or_geo_context_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX nodes_with_flows_or_geo_context_id_idx ON public.nodes_with_flows_or_geo USING btree (context_id);


--
-- Name: nodes_with_flows_or_geo_node_type_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX nodes_with_flows_or_geo_node_type_id_idx ON public.nodes_with_flows_or_geo USING btree (node_type_id);


--
-- Name: nodes_with_flows_per_year_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX nodes_with_flows_per_year_id_idx ON public.nodes_with_flows_per_year USING btree (id);


--
-- Name: partitioned_denormalised_flow_inds_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_context_id_year_idx ON ONLY public.partitioned_denormalised_flow_inds USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_19_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_19_context_id_year_idx ON public.partitioned_denormalised_flow_inds_19 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_row_name_idx ON ONLY public.partitioned_denormalised_flow_inds USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_19_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_19_row_name_idx ON public.partitioned_denormalised_flow_inds_19 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_1_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_1_context_id_year_idx ON public.partitioned_denormalised_flow_inds_1 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_1_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_1_row_name_idx ON public.partitioned_denormalised_flow_inds_1 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_2_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_2_context_id_year_idx ON public.partitioned_denormalised_flow_inds_2 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_2_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_2_row_name_idx ON public.partitioned_denormalised_flow_inds_2 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_35_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_35_context_id_year_idx ON public.partitioned_denormalised_flow_inds_35 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_35_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_35_row_name_idx ON public.partitioned_denormalised_flow_inds_35 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_37_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_37_context_id_year_idx ON public.partitioned_denormalised_flow_inds_37 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_37_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_37_row_name_idx ON public.partitioned_denormalised_flow_inds_37 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_38_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_38_context_id_year_idx ON public.partitioned_denormalised_flow_inds_38 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_38_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_38_row_name_idx ON public.partitioned_denormalised_flow_inds_38 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_39_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_39_context_id_year_idx ON public.partitioned_denormalised_flow_inds_39 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_39_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_39_row_name_idx ON public.partitioned_denormalised_flow_inds_39 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_40_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_40_context_id_year_idx ON public.partitioned_denormalised_flow_inds_40 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_40_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_40_row_name_idx ON public.partitioned_denormalised_flow_inds_40 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_42_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_42_context_id_year_idx ON public.partitioned_denormalised_flow_inds_42 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_42_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_42_row_name_idx ON public.partitioned_denormalised_flow_inds_42 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_43_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_43_context_id_year_idx ON public.partitioned_denormalised_flow_inds_43 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_43_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_43_row_name_idx ON public.partitioned_denormalised_flow_inds_43 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_44_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_44_context_id_year_idx ON public.partitioned_denormalised_flow_inds_44 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_44_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_44_row_name_idx ON public.partitioned_denormalised_flow_inds_44 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_45_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_45_context_id_year_idx ON public.partitioned_denormalised_flow_inds_45 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_45_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_45_row_name_idx ON public.partitioned_denormalised_flow_inds_45 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_46_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_46_context_id_year_idx ON public.partitioned_denormalised_flow_inds_46 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_46_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_46_row_name_idx ON public.partitioned_denormalised_flow_inds_46 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_47_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_47_context_id_year_idx ON public.partitioned_denormalised_flow_inds_47 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_47_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_47_row_name_idx ON public.partitioned_denormalised_flow_inds_47 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_48_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_48_context_id_year_idx ON public.partitioned_denormalised_flow_inds_48 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_48_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_48_row_name_idx ON public.partitioned_denormalised_flow_inds_48 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_49_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_49_context_id_year_idx ON public.partitioned_denormalised_flow_inds_49 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_49_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_49_row_name_idx ON public.partitioned_denormalised_flow_inds_49 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_4_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_4_context_id_year_idx ON public.partitioned_denormalised_flow_inds_4 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_4_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_4_row_name_idx ON public.partitioned_denormalised_flow_inds_4 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_50_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_50_context_id_year_idx ON public.partitioned_denormalised_flow_inds_50 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_50_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_50_row_name_idx ON public.partitioned_denormalised_flow_inds_50 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_51_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_51_context_id_year_idx ON public.partitioned_denormalised_flow_inds_51 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_51_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_51_row_name_idx ON public.partitioned_denormalised_flow_inds_51 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_52_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_52_context_id_year_idx ON public.partitioned_denormalised_flow_inds_52 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_52_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_52_row_name_idx ON public.partitioned_denormalised_flow_inds_52 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_53_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_53_context_id_year_idx ON public.partitioned_denormalised_flow_inds_53 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_53_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_53_row_name_idx ON public.partitioned_denormalised_flow_inds_53 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_54_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_54_context_id_year_idx ON public.partitioned_denormalised_flow_inds_54 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_54_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_54_row_name_idx ON public.partitioned_denormalised_flow_inds_54 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_55_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_55_context_id_year_idx ON public.partitioned_denormalised_flow_inds_55 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_55_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_55_row_name_idx ON public.partitioned_denormalised_flow_inds_55 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_56_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_56_context_id_year_idx ON public.partitioned_denormalised_flow_inds_56 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_56_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_56_row_name_idx ON public.partitioned_denormalised_flow_inds_56 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_57_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_57_context_id_year_idx ON public.partitioned_denormalised_flow_inds_57 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_57_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_57_row_name_idx ON public.partitioned_denormalised_flow_inds_57 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_58_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_58_context_id_year_idx ON public.partitioned_denormalised_flow_inds_58 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_58_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_58_row_name_idx ON public.partitioned_denormalised_flow_inds_58 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_59_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_59_context_id_year_idx ON public.partitioned_denormalised_flow_inds_59 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_59_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_59_row_name_idx ON public.partitioned_denormalised_flow_inds_59 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_5_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_5_context_id_year_idx ON public.partitioned_denormalised_flow_inds_5 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_5_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_5_row_name_idx ON public.partitioned_denormalised_flow_inds_5 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_60_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_60_context_id_year_idx ON public.partitioned_denormalised_flow_inds_60 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_60_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_60_row_name_idx ON public.partitioned_denormalised_flow_inds_60 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_61_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_61_context_id_year_idx ON public.partitioned_denormalised_flow_inds_61 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_61_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_61_row_name_idx ON public.partitioned_denormalised_flow_inds_61 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_6_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_6_context_id_year_idx ON public.partitioned_denormalised_flow_inds_6 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_6_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_6_row_name_idx ON public.partitioned_denormalised_flow_inds_6 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_inds_7_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_7_context_id_year_idx ON public.partitioned_denormalised_flow_inds_7 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_inds_7_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_inds_7_row_name_idx ON public.partitioned_denormalised_flow_inds_7 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_context_id_year_idx ON ONLY public.partitioned_denormalised_flow_quals USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_19_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_19_context_id_year_idx ON public.partitioned_denormalised_flow_quals_19 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_row_name_idx ON ONLY public.partitioned_denormalised_flow_quals USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_19_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_19_row_name_idx ON public.partitioned_denormalised_flow_quals_19 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_1_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_1_context_id_year_idx ON public.partitioned_denormalised_flow_quals_1 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_1_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_1_row_name_idx ON public.partitioned_denormalised_flow_quals_1 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_2_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_2_context_id_year_idx ON public.partitioned_denormalised_flow_quals_2 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_2_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_2_row_name_idx ON public.partitioned_denormalised_flow_quals_2 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_35_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_35_context_id_year_idx ON public.partitioned_denormalised_flow_quals_35 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_35_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_35_row_name_idx ON public.partitioned_denormalised_flow_quals_35 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_37_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_37_context_id_year_idx ON public.partitioned_denormalised_flow_quals_37 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_37_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_37_row_name_idx ON public.partitioned_denormalised_flow_quals_37 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_38_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_38_context_id_year_idx ON public.partitioned_denormalised_flow_quals_38 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_38_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_38_row_name_idx ON public.partitioned_denormalised_flow_quals_38 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_39_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_39_context_id_year_idx ON public.partitioned_denormalised_flow_quals_39 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_39_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_39_row_name_idx ON public.partitioned_denormalised_flow_quals_39 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_40_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_40_context_id_year_idx ON public.partitioned_denormalised_flow_quals_40 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_40_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_40_row_name_idx ON public.partitioned_denormalised_flow_quals_40 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_42_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_42_context_id_year_idx ON public.partitioned_denormalised_flow_quals_42 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_42_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_42_row_name_idx ON public.partitioned_denormalised_flow_quals_42 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_43_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_43_context_id_year_idx ON public.partitioned_denormalised_flow_quals_43 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_43_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_43_row_name_idx ON public.partitioned_denormalised_flow_quals_43 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_44_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_44_context_id_year_idx ON public.partitioned_denormalised_flow_quals_44 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_44_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_44_row_name_idx ON public.partitioned_denormalised_flow_quals_44 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_45_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_45_context_id_year_idx ON public.partitioned_denormalised_flow_quals_45 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_45_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_45_row_name_idx ON public.partitioned_denormalised_flow_quals_45 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_46_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_46_context_id_year_idx ON public.partitioned_denormalised_flow_quals_46 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_46_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_46_row_name_idx ON public.partitioned_denormalised_flow_quals_46 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_47_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_47_context_id_year_idx ON public.partitioned_denormalised_flow_quals_47 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_47_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_47_row_name_idx ON public.partitioned_denormalised_flow_quals_47 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_48_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_48_context_id_year_idx ON public.partitioned_denormalised_flow_quals_48 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_48_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_48_row_name_idx ON public.partitioned_denormalised_flow_quals_48 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_49_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_49_context_id_year_idx ON public.partitioned_denormalised_flow_quals_49 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_49_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_49_row_name_idx ON public.partitioned_denormalised_flow_quals_49 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_4_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_4_context_id_year_idx ON public.partitioned_denormalised_flow_quals_4 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_4_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_4_row_name_idx ON public.partitioned_denormalised_flow_quals_4 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_50_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_50_context_id_year_idx ON public.partitioned_denormalised_flow_quals_50 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_50_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_50_row_name_idx ON public.partitioned_denormalised_flow_quals_50 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_51_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_51_context_id_year_idx ON public.partitioned_denormalised_flow_quals_51 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_51_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_51_row_name_idx ON public.partitioned_denormalised_flow_quals_51 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_52_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_52_context_id_year_idx ON public.partitioned_denormalised_flow_quals_52 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_52_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_52_row_name_idx ON public.partitioned_denormalised_flow_quals_52 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_53_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_53_context_id_year_idx ON public.partitioned_denormalised_flow_quals_53 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_53_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_53_row_name_idx ON public.partitioned_denormalised_flow_quals_53 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_54_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_54_context_id_year_idx ON public.partitioned_denormalised_flow_quals_54 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_54_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_54_row_name_idx ON public.partitioned_denormalised_flow_quals_54 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_55_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_55_context_id_year_idx ON public.partitioned_denormalised_flow_quals_55 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_55_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_55_row_name_idx ON public.partitioned_denormalised_flow_quals_55 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_56_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_56_context_id_year_idx ON public.partitioned_denormalised_flow_quals_56 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_56_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_56_row_name_idx ON public.partitioned_denormalised_flow_quals_56 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_57_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_57_context_id_year_idx ON public.partitioned_denormalised_flow_quals_57 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_57_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_57_row_name_idx ON public.partitioned_denormalised_flow_quals_57 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_58_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_58_context_id_year_idx ON public.partitioned_denormalised_flow_quals_58 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_58_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_58_row_name_idx ON public.partitioned_denormalised_flow_quals_58 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_59_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_59_context_id_year_idx ON public.partitioned_denormalised_flow_quals_59 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_59_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_59_row_name_idx ON public.partitioned_denormalised_flow_quals_59 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_5_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_5_context_id_year_idx ON public.partitioned_denormalised_flow_quals_5 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_5_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_5_row_name_idx ON public.partitioned_denormalised_flow_quals_5 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_60_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_60_context_id_year_idx ON public.partitioned_denormalised_flow_quals_60 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_60_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_60_row_name_idx ON public.partitioned_denormalised_flow_quals_60 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_61_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_61_context_id_year_idx ON public.partitioned_denormalised_flow_quals_61 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_61_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_61_row_name_idx ON public.partitioned_denormalised_flow_quals_61 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_6_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_6_context_id_year_idx ON public.partitioned_denormalised_flow_quals_6 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_6_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_6_row_name_idx ON public.partitioned_denormalised_flow_quals_6 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quals_7_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_7_context_id_year_idx ON public.partitioned_denormalised_flow_quals_7 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quals_7_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quals_7_row_name_idx ON public.partitioned_denormalised_flow_quals_7 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_context_id_year_idx ON ONLY public.partitioned_denormalised_flow_quants USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_19_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_19_context_id_year_idx ON public.partitioned_denormalised_flow_quants_19 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_row_name_idx ON ONLY public.partitioned_denormalised_flow_quants USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_19_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_19_row_name_idx ON public.partitioned_denormalised_flow_quants_19 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_1_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_1_context_id_year_idx ON public.partitioned_denormalised_flow_quants_1 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_1_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_1_row_name_idx ON public.partitioned_denormalised_flow_quants_1 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_2_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_2_context_id_year_idx ON public.partitioned_denormalised_flow_quants_2 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_2_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_2_row_name_idx ON public.partitioned_denormalised_flow_quants_2 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_35_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_35_context_id_year_idx ON public.partitioned_denormalised_flow_quants_35 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_35_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_35_row_name_idx ON public.partitioned_denormalised_flow_quants_35 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_37_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_37_context_id_year_idx ON public.partitioned_denormalised_flow_quants_37 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_37_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_37_row_name_idx ON public.partitioned_denormalised_flow_quants_37 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_38_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_38_context_id_year_idx ON public.partitioned_denormalised_flow_quants_38 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_38_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_38_row_name_idx ON public.partitioned_denormalised_flow_quants_38 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_39_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_39_context_id_year_idx ON public.partitioned_denormalised_flow_quants_39 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_39_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_39_row_name_idx ON public.partitioned_denormalised_flow_quants_39 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_40_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_40_context_id_year_idx ON public.partitioned_denormalised_flow_quants_40 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_40_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_40_row_name_idx ON public.partitioned_denormalised_flow_quants_40 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_42_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_42_context_id_year_idx ON public.partitioned_denormalised_flow_quants_42 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_42_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_42_row_name_idx ON public.partitioned_denormalised_flow_quants_42 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_43_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_43_context_id_year_idx ON public.partitioned_denormalised_flow_quants_43 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_43_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_43_row_name_idx ON public.partitioned_denormalised_flow_quants_43 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_44_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_44_context_id_year_idx ON public.partitioned_denormalised_flow_quants_44 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_44_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_44_row_name_idx ON public.partitioned_denormalised_flow_quants_44 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_45_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_45_context_id_year_idx ON public.partitioned_denormalised_flow_quants_45 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_45_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_45_row_name_idx ON public.partitioned_denormalised_flow_quants_45 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_46_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_46_context_id_year_idx ON public.partitioned_denormalised_flow_quants_46 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_46_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_46_row_name_idx ON public.partitioned_denormalised_flow_quants_46 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_47_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_47_context_id_year_idx ON public.partitioned_denormalised_flow_quants_47 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_47_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_47_row_name_idx ON public.partitioned_denormalised_flow_quants_47 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_48_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_48_context_id_year_idx ON public.partitioned_denormalised_flow_quants_48 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_48_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_48_row_name_idx ON public.partitioned_denormalised_flow_quants_48 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_49_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_49_context_id_year_idx ON public.partitioned_denormalised_flow_quants_49 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_49_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_49_row_name_idx ON public.partitioned_denormalised_flow_quants_49 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_4_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_4_context_id_year_idx ON public.partitioned_denormalised_flow_quants_4 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_4_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_4_row_name_idx ON public.partitioned_denormalised_flow_quants_4 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_50_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_50_context_id_year_idx ON public.partitioned_denormalised_flow_quants_50 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_50_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_50_row_name_idx ON public.partitioned_denormalised_flow_quants_50 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_51_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_51_context_id_year_idx ON public.partitioned_denormalised_flow_quants_51 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_51_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_51_row_name_idx ON public.partitioned_denormalised_flow_quants_51 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_52_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_52_context_id_year_idx ON public.partitioned_denormalised_flow_quants_52 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_52_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_52_row_name_idx ON public.partitioned_denormalised_flow_quants_52 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_53_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_53_context_id_year_idx ON public.partitioned_denormalised_flow_quants_53 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_53_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_53_row_name_idx ON public.partitioned_denormalised_flow_quants_53 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_54_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_54_context_id_year_idx ON public.partitioned_denormalised_flow_quants_54 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_54_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_54_row_name_idx ON public.partitioned_denormalised_flow_quants_54 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_55_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_55_context_id_year_idx ON public.partitioned_denormalised_flow_quants_55 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_55_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_55_row_name_idx ON public.partitioned_denormalised_flow_quants_55 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_56_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_56_context_id_year_idx ON public.partitioned_denormalised_flow_quants_56 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_56_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_56_row_name_idx ON public.partitioned_denormalised_flow_quants_56 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_57_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_57_context_id_year_idx ON public.partitioned_denormalised_flow_quants_57 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_57_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_57_row_name_idx ON public.partitioned_denormalised_flow_quants_57 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_58_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_58_context_id_year_idx ON public.partitioned_denormalised_flow_quants_58 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_58_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_58_row_name_idx ON public.partitioned_denormalised_flow_quants_58 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_59_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_59_context_id_year_idx ON public.partitioned_denormalised_flow_quants_59 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_59_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_59_row_name_idx ON public.partitioned_denormalised_flow_quants_59 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_5_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_5_context_id_year_idx ON public.partitioned_denormalised_flow_quants_5 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_5_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_5_row_name_idx ON public.partitioned_denormalised_flow_quants_5 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_60_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_60_context_id_year_idx ON public.partitioned_denormalised_flow_quants_60 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_60_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_60_row_name_idx ON public.partitioned_denormalised_flow_quants_60 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_61_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_61_context_id_year_idx ON public.partitioned_denormalised_flow_quants_61 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_61_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_61_row_name_idx ON public.partitioned_denormalised_flow_quants_61 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_6_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_6_context_id_year_idx ON public.partitioned_denormalised_flow_quants_6 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_6_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_6_row_name_idx ON public.partitioned_denormalised_flow_quants_6 USING btree (row_name);


--
-- Name: partitioned_denormalised_flow_quants_7_context_id_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_7_context_id_year_idx ON public.partitioned_denormalised_flow_quants_7 USING btree (context_id, year);


--
-- Name: partitioned_denormalised_flow_quants_7_row_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_denormalised_flow_quants_7_row_name_idx ON public.partitioned_denormalised_flow_quants_7 USING btree (row_name);


--
-- Name: partitioned_flow_inds_ind_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_inds_ind_id_flow_id_idx ON ONLY public.partitioned_flow_inds USING btree (ind_id, flow_id);


--
-- Name: partitioned_flow_inds_1_ind_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_inds_1_ind_id_flow_id_idx ON public.partitioned_flow_inds_1 USING btree (ind_id, flow_id);


--
-- Name: partitioned_flow_inds_2_ind_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_inds_2_ind_id_flow_id_idx ON public.partitioned_flow_inds_2 USING btree (ind_id, flow_id);


--
-- Name: partitioned_flow_inds_3_ind_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_inds_3_ind_id_flow_id_idx ON public.partitioned_flow_inds_3 USING btree (ind_id, flow_id);


--
-- Name: partitioned_flow_inds_67_ind_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_inds_67_ind_id_flow_id_idx ON public.partitioned_flow_inds_67 USING btree (ind_id, flow_id);


--
-- Name: partitioned_flow_inds_71_ind_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_inds_71_ind_id_flow_id_idx ON public.partitioned_flow_inds_71 USING btree (ind_id, flow_id);


--
-- Name: partitioned_flow_inds_72_ind_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_inds_72_ind_id_flow_id_idx ON public.partitioned_flow_inds_72 USING btree (ind_id, flow_id);


--
-- Name: partitioned_flow_inds_84_ind_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_inds_84_ind_id_flow_id_idx ON public.partitioned_flow_inds_84 USING btree (ind_id, flow_id);


--
-- Name: partitioned_flow_inds_85_ind_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_inds_85_ind_id_flow_id_idx ON public.partitioned_flow_inds_85 USING btree (ind_id, flow_id);


--
-- Name: partitioned_flow_inds_90_ind_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_inds_90_ind_id_flow_id_idx ON public.partitioned_flow_inds_90 USING btree (ind_id, flow_id);


--
-- Name: partitioned_flow_inds_95_ind_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_inds_95_ind_id_flow_id_idx ON public.partitioned_flow_inds_95 USING btree (ind_id, flow_id);


--
-- Name: partitioned_flow_inds_96_ind_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_inds_96_ind_id_flow_id_idx ON public.partitioned_flow_inds_96 USING btree (ind_id, flow_id);


--
-- Name: partitioned_flow_inds_97_ind_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_inds_97_ind_id_flow_id_idx ON public.partitioned_flow_inds_97 USING btree (ind_id, flow_id);


--
-- Name: partitioned_flow_quals_qual_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quals_qual_id_flow_id_idx ON ONLY public.partitioned_flow_quals USING btree (qual_id, flow_id);


--
-- Name: partitioned_flow_quals_2_qual_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quals_2_qual_id_flow_id_idx ON public.partitioned_flow_quals_2 USING btree (qual_id, flow_id);


--
-- Name: partitioned_flow_quals_3_qual_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quals_3_qual_id_flow_id_idx ON public.partitioned_flow_quals_3 USING btree (qual_id, flow_id);


--
-- Name: partitioned_flow_quals_41_qual_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quals_41_qual_id_flow_id_idx ON public.partitioned_flow_quals_41 USING btree (qual_id, flow_id);


--
-- Name: partitioned_flow_quals_43_qual_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quals_43_qual_id_flow_id_idx ON public.partitioned_flow_quals_43 USING btree (qual_id, flow_id);


--
-- Name: partitioned_flow_quals_44_qual_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quals_44_qual_id_flow_id_idx ON public.partitioned_flow_quals_44 USING btree (qual_id, flow_id);


--
-- Name: partitioned_flow_quals_45_qual_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quals_45_qual_id_flow_id_idx ON public.partitioned_flow_quals_45 USING btree (qual_id, flow_id);


--
-- Name: partitioned_flow_quals_48_qual_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quals_48_qual_id_flow_id_idx ON public.partitioned_flow_quals_48 USING btree (qual_id, flow_id);


--
-- Name: partitioned_flow_quals_4_qual_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quals_4_qual_id_flow_id_idx ON public.partitioned_flow_quals_4 USING btree (qual_id, flow_id);


--
-- Name: partitioned_flow_quals_50_qual_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quals_50_qual_id_flow_id_idx ON public.partitioned_flow_quals_50 USING btree (qual_id, flow_id);


--
-- Name: partitioned_flow_quals_7_qual_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quals_7_qual_id_flow_id_idx ON public.partitioned_flow_quals_7 USING btree (qual_id, flow_id);


--
-- Name: partitioned_flow_quants_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_quant_id_flow_id_idx ON ONLY public.partitioned_flow_quants USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_11_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_11_quant_id_flow_id_idx ON public.partitioned_flow_quants_11 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_12_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_12_quant_id_flow_id_idx ON public.partitioned_flow_quants_12 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_18_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_18_quant_id_flow_id_idx ON public.partitioned_flow_quants_18 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_1_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_1_quant_id_flow_id_idx ON public.partitioned_flow_quants_1 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_28_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_28_quant_id_flow_id_idx ON public.partitioned_flow_quants_28 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_2_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_2_quant_id_flow_id_idx ON public.partitioned_flow_quants_2 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_33_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_33_quant_id_flow_id_idx ON public.partitioned_flow_quants_33 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_34_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_34_quant_id_flow_id_idx ON public.partitioned_flow_quants_34 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_36_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_36_quant_id_flow_id_idx ON public.partitioned_flow_quants_36 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_3_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_3_quant_id_flow_id_idx ON public.partitioned_flow_quants_3 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_41_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_41_quant_id_flow_id_idx ON public.partitioned_flow_quants_41 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_4_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_4_quant_id_flow_id_idx ON public.partitioned_flow_quants_4 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_59_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_59_quant_id_flow_id_idx ON public.partitioned_flow_quants_59 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_65_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_65_quant_id_flow_id_idx ON public.partitioned_flow_quants_65 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_67_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_67_quant_id_flow_id_idx ON public.partitioned_flow_quants_67 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_7_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_7_quant_id_flow_id_idx ON public.partitioned_flow_quants_7 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_80_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_80_quant_id_flow_id_idx ON public.partitioned_flow_quants_80 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_81_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_81_quant_id_flow_id_idx ON public.partitioned_flow_quants_81 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_82_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_82_quant_id_flow_id_idx ON public.partitioned_flow_quants_82 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_83_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_83_quant_id_flow_id_idx ON public.partitioned_flow_quants_83 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_84_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_84_quant_id_flow_id_idx ON public.partitioned_flow_quants_84 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_85_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_85_quant_id_flow_id_idx ON public.partitioned_flow_quants_85 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_86_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_86_quant_id_flow_id_idx ON public.partitioned_flow_quants_86 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_87_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_87_quant_id_flow_id_idx ON public.partitioned_flow_quants_87 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_88_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_88_quant_id_flow_id_idx ON public.partitioned_flow_quants_88 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_89_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_89_quant_id_flow_id_idx ON public.partitioned_flow_quants_89 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_8_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_8_quant_id_flow_id_idx ON public.partitioned_flow_quants_8 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_90_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_90_quant_id_flow_id_idx ON public.partitioned_flow_quants_90 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_91_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_91_quant_id_flow_id_idx ON public.partitioned_flow_quants_91 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_93_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_93_quant_id_flow_id_idx ON public.partitioned_flow_quants_93 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flow_quants_95_quant_id_flow_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flow_quants_95_quant_id_flow_id_idx ON public.partitioned_flow_quants_95 USING btree (quant_id, flow_id);


--
-- Name: partitioned_flows_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_context_id_id_idx ON ONLY public.partitioned_flows USING btree (context_id, id);


--
-- Name: partitioned_flows_19_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_19_context_id_id_idx ON public.partitioned_flows_19 USING btree (context_id, id);


--
-- Name: partitioned_flows_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_year_idx ON ONLY public.partitioned_flows USING btree (year);


--
-- Name: partitioned_flows_19_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_19_year_idx ON public.partitioned_flows_19 USING btree (year);


--
-- Name: partitioned_flows_1_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_1_context_id_id_idx ON public.partitioned_flows_1 USING btree (context_id, id);


--
-- Name: partitioned_flows_1_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_1_year_idx ON public.partitioned_flows_1 USING btree (year);


--
-- Name: partitioned_flows_2_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_2_context_id_id_idx ON public.partitioned_flows_2 USING btree (context_id, id);


--
-- Name: partitioned_flows_2_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_2_year_idx ON public.partitioned_flows_2 USING btree (year);


--
-- Name: partitioned_flows_35_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_35_context_id_id_idx ON public.partitioned_flows_35 USING btree (context_id, id);


--
-- Name: partitioned_flows_35_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_35_year_idx ON public.partitioned_flows_35 USING btree (year);


--
-- Name: partitioned_flows_37_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_37_context_id_id_idx ON public.partitioned_flows_37 USING btree (context_id, id);


--
-- Name: partitioned_flows_37_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_37_year_idx ON public.partitioned_flows_37 USING btree (year);


--
-- Name: partitioned_flows_38_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_38_context_id_id_idx ON public.partitioned_flows_38 USING btree (context_id, id);


--
-- Name: partitioned_flows_38_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_38_year_idx ON public.partitioned_flows_38 USING btree (year);


--
-- Name: partitioned_flows_39_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_39_context_id_id_idx ON public.partitioned_flows_39 USING btree (context_id, id);


--
-- Name: partitioned_flows_39_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_39_year_idx ON public.partitioned_flows_39 USING btree (year);


--
-- Name: partitioned_flows_40_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_40_context_id_id_idx ON public.partitioned_flows_40 USING btree (context_id, id);


--
-- Name: partitioned_flows_40_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_40_year_idx ON public.partitioned_flows_40 USING btree (year);


--
-- Name: partitioned_flows_42_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_42_context_id_id_idx ON public.partitioned_flows_42 USING btree (context_id, id);


--
-- Name: partitioned_flows_42_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_42_year_idx ON public.partitioned_flows_42 USING btree (year);


--
-- Name: partitioned_flows_43_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_43_context_id_id_idx ON public.partitioned_flows_43 USING btree (context_id, id);


--
-- Name: partitioned_flows_43_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_43_year_idx ON public.partitioned_flows_43 USING btree (year);


--
-- Name: partitioned_flows_44_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_44_context_id_id_idx ON public.partitioned_flows_44 USING btree (context_id, id);


--
-- Name: partitioned_flows_44_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_44_year_idx ON public.partitioned_flows_44 USING btree (year);


--
-- Name: partitioned_flows_45_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_45_context_id_id_idx ON public.partitioned_flows_45 USING btree (context_id, id);


--
-- Name: partitioned_flows_45_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_45_year_idx ON public.partitioned_flows_45 USING btree (year);


--
-- Name: partitioned_flows_46_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_46_context_id_id_idx ON public.partitioned_flows_46 USING btree (context_id, id);


--
-- Name: partitioned_flows_46_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_46_year_idx ON public.partitioned_flows_46 USING btree (year);


--
-- Name: partitioned_flows_47_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_47_context_id_id_idx ON public.partitioned_flows_47 USING btree (context_id, id);


--
-- Name: partitioned_flows_47_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_47_year_idx ON public.partitioned_flows_47 USING btree (year);


--
-- Name: partitioned_flows_48_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_48_context_id_id_idx ON public.partitioned_flows_48 USING btree (context_id, id);


--
-- Name: partitioned_flows_48_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_48_year_idx ON public.partitioned_flows_48 USING btree (year);


--
-- Name: partitioned_flows_49_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_49_context_id_id_idx ON public.partitioned_flows_49 USING btree (context_id, id);


--
-- Name: partitioned_flows_49_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_49_year_idx ON public.partitioned_flows_49 USING btree (year);


--
-- Name: partitioned_flows_4_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_4_context_id_id_idx ON public.partitioned_flows_4 USING btree (context_id, id);


--
-- Name: partitioned_flows_4_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_4_year_idx ON public.partitioned_flows_4 USING btree (year);


--
-- Name: partitioned_flows_50_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_50_context_id_id_idx ON public.partitioned_flows_50 USING btree (context_id, id);


--
-- Name: partitioned_flows_50_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_50_year_idx ON public.partitioned_flows_50 USING btree (year);


--
-- Name: partitioned_flows_51_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_51_context_id_id_idx ON public.partitioned_flows_51 USING btree (context_id, id);


--
-- Name: partitioned_flows_51_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_51_year_idx ON public.partitioned_flows_51 USING btree (year);


--
-- Name: partitioned_flows_52_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_52_context_id_id_idx ON public.partitioned_flows_52 USING btree (context_id, id);


--
-- Name: partitioned_flows_52_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_52_year_idx ON public.partitioned_flows_52 USING btree (year);


--
-- Name: partitioned_flows_53_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_53_context_id_id_idx ON public.partitioned_flows_53 USING btree (context_id, id);


--
-- Name: partitioned_flows_53_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_53_year_idx ON public.partitioned_flows_53 USING btree (year);


--
-- Name: partitioned_flows_54_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_54_context_id_id_idx ON public.partitioned_flows_54 USING btree (context_id, id);


--
-- Name: partitioned_flows_54_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_54_year_idx ON public.partitioned_flows_54 USING btree (year);


--
-- Name: partitioned_flows_55_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_55_context_id_id_idx ON public.partitioned_flows_55 USING btree (context_id, id);


--
-- Name: partitioned_flows_55_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_55_year_idx ON public.partitioned_flows_55 USING btree (year);


--
-- Name: partitioned_flows_56_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_56_context_id_id_idx ON public.partitioned_flows_56 USING btree (context_id, id);


--
-- Name: partitioned_flows_56_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_56_year_idx ON public.partitioned_flows_56 USING btree (year);


--
-- Name: partitioned_flows_57_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_57_context_id_id_idx ON public.partitioned_flows_57 USING btree (context_id, id);


--
-- Name: partitioned_flows_57_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_57_year_idx ON public.partitioned_flows_57 USING btree (year);


--
-- Name: partitioned_flows_58_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_58_context_id_id_idx ON public.partitioned_flows_58 USING btree (context_id, id);


--
-- Name: partitioned_flows_58_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_58_year_idx ON public.partitioned_flows_58 USING btree (year);


--
-- Name: partitioned_flows_59_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_59_context_id_id_idx ON public.partitioned_flows_59 USING btree (context_id, id);


--
-- Name: partitioned_flows_59_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_59_year_idx ON public.partitioned_flows_59 USING btree (year);


--
-- Name: partitioned_flows_5_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_5_context_id_id_idx ON public.partitioned_flows_5 USING btree (context_id, id);


--
-- Name: partitioned_flows_5_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_5_year_idx ON public.partitioned_flows_5 USING btree (year);


--
-- Name: partitioned_flows_60_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_60_context_id_id_idx ON public.partitioned_flows_60 USING btree (context_id, id);


--
-- Name: partitioned_flows_60_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_60_year_idx ON public.partitioned_flows_60 USING btree (year);


--
-- Name: partitioned_flows_61_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_61_context_id_id_idx ON public.partitioned_flows_61 USING btree (context_id, id);


--
-- Name: partitioned_flows_61_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_61_year_idx ON public.partitioned_flows_61 USING btree (year);


--
-- Name: partitioned_flows_6_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_6_context_id_id_idx ON public.partitioned_flows_6 USING btree (context_id, id);


--
-- Name: partitioned_flows_6_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_6_year_idx ON public.partitioned_flows_6 USING btree (year);


--
-- Name: partitioned_flows_7_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partitioned_flows_7_context_id_id_idx ON public.partitioned_flows_7 USING btree (context_id, id);


--
-- Name: partitioned_flows_7_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX partitioned_flows_7_year_idx ON public.partitioned_flows_7 USING btree (year);


--
-- Name: qual_commodity_properties_commodity_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX qual_commodity_properties_commodity_id_idx ON public.qual_commodity_properties USING btree (commodity_id);


--
-- Name: qual_commodity_properties_qual_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX qual_commodity_properties_qual_id_idx ON public.qual_commodity_properties USING btree (qual_id);


--
-- Name: qual_context_properties_context_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX qual_context_properties_context_id_idx ON public.qual_context_properties USING btree (context_id);


--
-- Name: qual_context_properties_qual_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX qual_context_properties_qual_id_idx ON public.qual_context_properties USING btree (qual_id);


--
-- Name: qual_country_properties_country_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX qual_country_properties_country_id_idx ON public.qual_country_properties USING btree (country_id);


--
-- Name: qual_country_properties_qual_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX qual_country_properties_qual_id_idx ON public.qual_country_properties USING btree (qual_id);


--
-- Name: qual_values_meta_mv_qual_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX qual_values_meta_mv_qual_id_idx ON public.qual_values_meta_mv USING btree (qual_id);


--
-- Name: quant_commodity_properties_commodity_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX quant_commodity_properties_commodity_id_idx ON public.quant_commodity_properties USING btree (commodity_id);


--
-- Name: quant_commodity_properties_quant_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX quant_commodity_properties_quant_id_idx ON public.quant_commodity_properties USING btree (quant_id);


--
-- Name: quant_context_properties_context_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX quant_context_properties_context_id_idx ON public.quant_context_properties USING btree (context_id);


--
-- Name: quant_context_properties_quant_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX quant_context_properties_quant_id_idx ON public.quant_context_properties USING btree (quant_id);


--
-- Name: quant_country_properties_country_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX quant_country_properties_country_id_idx ON public.quant_country_properties USING btree (country_id);


--
-- Name: quant_country_properties_quant_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX quant_country_properties_quant_id_idx ON public.quant_country_properties USING btree (quant_id);


--
-- Name: quant_properties_quant_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX quant_properties_quant_id_idx ON public.quant_properties USING btree (quant_id);


--
-- Name: quant_values_meta_mv_quant_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX quant_values_meta_mv_quant_id_idx ON public.quant_values_meta_mv USING btree (quant_id);


--
-- Name: recolor_by_attributes_context_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX recolor_by_attributes_context_id_idx ON public.recolor_by_attributes USING btree (context_id);


--
-- Name: recolor_by_attributes_mv_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX recolor_by_attributes_mv_id_idx ON public.recolor_by_attributes_mv USING btree (id);


--
-- Name: resize_by_attributes_context_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX resize_by_attributes_context_id_idx ON public.resize_by_attributes USING btree (context_id);


--
-- Name: resize_by_attributes_mv_context_id_attribute_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX resize_by_attributes_mv_context_id_attribute_id_idx ON public.resize_by_attributes_mv USING btree (context_id, attribute_id);


--
-- Name: resize_by_attributes_mv_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX resize_by_attributes_mv_id_idx ON public.resize_by_attributes_mv USING btree (id);


--
-- Name: resize_by_quants_quant_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX resize_by_quants_quant_id_idx ON public.resize_by_quants USING btree (quant_id);


--
-- Name: resize_by_quants_resize_by_attribute_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX resize_by_quants_resize_by_attribute_id_idx ON public.resize_by_quants USING btree (resize_by_attribute_id);


--
-- Name: partitioned_denormalised_flow_inds_19_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_19_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_19_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_19_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_1_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_1_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_1_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_1_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_2_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_2_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_2_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_2_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_35_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_35_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_35_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_35_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_37_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_37_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_37_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_37_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_38_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_38_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_38_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_38_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_39_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_39_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_39_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_39_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_40_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_40_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_40_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_40_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_42_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_42_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_42_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_42_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_43_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_43_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_43_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_43_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_44_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_44_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_44_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_44_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_45_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_45_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_45_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_45_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_46_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_46_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_46_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_46_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_47_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_47_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_47_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_47_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_48_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_48_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_48_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_48_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_49_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_49_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_49_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_49_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_4_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_4_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_4_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_4_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_50_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_50_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_50_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_50_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_51_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_51_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_51_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_51_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_52_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_52_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_52_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_52_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_53_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_53_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_53_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_53_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_54_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_54_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_54_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_54_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_55_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_55_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_55_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_55_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_56_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_56_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_56_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_56_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_57_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_57_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_57_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_57_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_58_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_58_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_58_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_58_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_59_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_59_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_59_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_59_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_5_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_5_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_5_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_5_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_60_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_60_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_60_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_60_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_61_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_61_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_61_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_61_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_6_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_6_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_6_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_6_row_name_idx;


--
-- Name: partitioned_denormalised_flow_inds_7_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_7_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_inds_7_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_inds_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_inds_7_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_19_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_19_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_19_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_19_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_1_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_1_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_1_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_1_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_2_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_2_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_2_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_2_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_35_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_35_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_35_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_35_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_37_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_37_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_37_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_37_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_38_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_38_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_38_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_38_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_39_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_39_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_39_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_39_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_40_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_40_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_40_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_40_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_42_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_42_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_42_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_42_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_43_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_43_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_43_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_43_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_44_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_44_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_44_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_44_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_45_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_45_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_45_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_45_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_46_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_46_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_46_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_46_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_47_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_47_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_47_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_47_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_48_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_48_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_48_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_48_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_49_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_49_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_49_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_49_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_4_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_4_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_4_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_4_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_50_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_50_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_50_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_50_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_51_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_51_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_51_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_51_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_52_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_52_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_52_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_52_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_53_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_53_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_53_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_53_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_54_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_54_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_54_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_54_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_55_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_55_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_55_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_55_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_56_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_56_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_56_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_56_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_57_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_57_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_57_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_57_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_58_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_58_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_58_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_58_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_59_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_59_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_59_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_59_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_5_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_5_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_5_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_5_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_60_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_60_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_60_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_60_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_61_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_61_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_61_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_61_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_6_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_6_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_6_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_6_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quals_7_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_7_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quals_7_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quals_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quals_7_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_19_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_19_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_19_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_19_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_1_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_1_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_1_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_1_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_2_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_2_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_2_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_2_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_35_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_35_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_35_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_35_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_37_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_37_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_37_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_37_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_38_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_38_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_38_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_38_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_39_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_39_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_39_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_39_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_40_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_40_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_40_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_40_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_42_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_42_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_42_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_42_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_43_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_43_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_43_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_43_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_44_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_44_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_44_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_44_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_45_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_45_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_45_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_45_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_46_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_46_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_46_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_46_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_47_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_47_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_47_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_47_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_48_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_48_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_48_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_48_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_49_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_49_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_49_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_49_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_4_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_4_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_4_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_4_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_50_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_50_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_50_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_50_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_51_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_51_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_51_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_51_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_52_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_52_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_52_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_52_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_53_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_53_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_53_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_53_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_54_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_54_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_54_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_54_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_55_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_55_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_55_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_55_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_56_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_56_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_56_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_56_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_57_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_57_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_57_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_57_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_58_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_58_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_58_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_58_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_59_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_59_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_59_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_59_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_5_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_5_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_5_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_5_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_60_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_60_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_60_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_60_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_61_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_61_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_61_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_61_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_6_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_6_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_6_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_6_row_name_idx;


--
-- Name: partitioned_denormalised_flow_quants_7_context_id_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_context_id_year_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_7_context_id_year_idx;


--
-- Name: partitioned_denormalised_flow_quants_7_row_name_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_denormalised_flow_quants_row_name_idx ATTACH PARTITION public.partitioned_denormalised_flow_quants_7_row_name_idx;


--
-- Name: partitioned_flow_inds_1_ind_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_inds_ind_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_inds_1_ind_id_flow_id_idx;


--
-- Name: partitioned_flow_inds_2_ind_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_inds_ind_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_inds_2_ind_id_flow_id_idx;


--
-- Name: partitioned_flow_inds_3_ind_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_inds_ind_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_inds_3_ind_id_flow_id_idx;


--
-- Name: partitioned_flow_inds_67_ind_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_inds_ind_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_inds_67_ind_id_flow_id_idx;


--
-- Name: partitioned_flow_inds_71_ind_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_inds_ind_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_inds_71_ind_id_flow_id_idx;


--
-- Name: partitioned_flow_inds_72_ind_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_inds_ind_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_inds_72_ind_id_flow_id_idx;


--
-- Name: partitioned_flow_inds_84_ind_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_inds_ind_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_inds_84_ind_id_flow_id_idx;


--
-- Name: partitioned_flow_inds_85_ind_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_inds_ind_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_inds_85_ind_id_flow_id_idx;


--
-- Name: partitioned_flow_inds_90_ind_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_inds_ind_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_inds_90_ind_id_flow_id_idx;


--
-- Name: partitioned_flow_inds_95_ind_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_inds_ind_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_inds_95_ind_id_flow_id_idx;


--
-- Name: partitioned_flow_inds_96_ind_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_inds_ind_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_inds_96_ind_id_flow_id_idx;


--
-- Name: partitioned_flow_inds_97_ind_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_inds_ind_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_inds_97_ind_id_flow_id_idx;


--
-- Name: partitioned_flow_quals_2_qual_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quals_qual_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quals_2_qual_id_flow_id_idx;


--
-- Name: partitioned_flow_quals_3_qual_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quals_qual_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quals_3_qual_id_flow_id_idx;


--
-- Name: partitioned_flow_quals_41_qual_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quals_qual_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quals_41_qual_id_flow_id_idx;


--
-- Name: partitioned_flow_quals_43_qual_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quals_qual_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quals_43_qual_id_flow_id_idx;


--
-- Name: partitioned_flow_quals_44_qual_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quals_qual_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quals_44_qual_id_flow_id_idx;


--
-- Name: partitioned_flow_quals_45_qual_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quals_qual_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quals_45_qual_id_flow_id_idx;


--
-- Name: partitioned_flow_quals_48_qual_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quals_qual_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quals_48_qual_id_flow_id_idx;


--
-- Name: partitioned_flow_quals_4_qual_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quals_qual_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quals_4_qual_id_flow_id_idx;


--
-- Name: partitioned_flow_quals_50_qual_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quals_qual_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quals_50_qual_id_flow_id_idx;


--
-- Name: partitioned_flow_quals_7_qual_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quals_qual_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quals_7_qual_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_11_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_11_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_12_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_12_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_18_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_18_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_1_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_1_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_28_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_28_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_2_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_2_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_33_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_33_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_34_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_34_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_36_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_36_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_3_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_3_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_41_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_41_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_4_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_4_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_59_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_59_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_65_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_65_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_67_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_67_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_7_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_7_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_80_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_80_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_81_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_81_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_82_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_82_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_83_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_83_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_84_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_84_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_85_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_85_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_86_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_86_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_87_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_87_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_88_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_88_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_89_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_89_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_8_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_8_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_90_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_90_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_91_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_91_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_93_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_93_quant_id_flow_id_idx;


--
-- Name: partitioned_flow_quants_95_quant_id_flow_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flow_quants_quant_id_flow_id_idx ATTACH PARTITION public.partitioned_flow_quants_95_quant_id_flow_id_idx;


--
-- Name: partitioned_flows_19_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_19_context_id_id_idx;


--
-- Name: partitioned_flows_19_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_19_year_idx;


--
-- Name: partitioned_flows_1_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_1_context_id_id_idx;


--
-- Name: partitioned_flows_1_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_1_year_idx;


--
-- Name: partitioned_flows_2_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_2_context_id_id_idx;


--
-- Name: partitioned_flows_2_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_2_year_idx;


--
-- Name: partitioned_flows_35_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_35_context_id_id_idx;


--
-- Name: partitioned_flows_35_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_35_year_idx;


--
-- Name: partitioned_flows_37_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_37_context_id_id_idx;


--
-- Name: partitioned_flows_37_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_37_year_idx;


--
-- Name: partitioned_flows_38_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_38_context_id_id_idx;


--
-- Name: partitioned_flows_38_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_38_year_idx;


--
-- Name: partitioned_flows_39_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_39_context_id_id_idx;


--
-- Name: partitioned_flows_39_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_39_year_idx;


--
-- Name: partitioned_flows_40_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_40_context_id_id_idx;


--
-- Name: partitioned_flows_40_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_40_year_idx;


--
-- Name: partitioned_flows_42_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_42_context_id_id_idx;


--
-- Name: partitioned_flows_42_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_42_year_idx;


--
-- Name: partitioned_flows_43_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_43_context_id_id_idx;


--
-- Name: partitioned_flows_43_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_43_year_idx;


--
-- Name: partitioned_flows_44_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_44_context_id_id_idx;


--
-- Name: partitioned_flows_44_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_44_year_idx;


--
-- Name: partitioned_flows_45_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_45_context_id_id_idx;


--
-- Name: partitioned_flows_45_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_45_year_idx;


--
-- Name: partitioned_flows_46_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_46_context_id_id_idx;


--
-- Name: partitioned_flows_46_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_46_year_idx;


--
-- Name: partitioned_flows_47_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_47_context_id_id_idx;


--
-- Name: partitioned_flows_47_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_47_year_idx;


--
-- Name: partitioned_flows_48_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_48_context_id_id_idx;


--
-- Name: partitioned_flows_48_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_48_year_idx;


--
-- Name: partitioned_flows_49_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_49_context_id_id_idx;


--
-- Name: partitioned_flows_49_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_49_year_idx;


--
-- Name: partitioned_flows_4_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_4_context_id_id_idx;


--
-- Name: partitioned_flows_4_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_4_year_idx;


--
-- Name: partitioned_flows_50_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_50_context_id_id_idx;


--
-- Name: partitioned_flows_50_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_50_year_idx;


--
-- Name: partitioned_flows_51_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_51_context_id_id_idx;


--
-- Name: partitioned_flows_51_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_51_year_idx;


--
-- Name: partitioned_flows_52_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_52_context_id_id_idx;


--
-- Name: partitioned_flows_52_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_52_year_idx;


--
-- Name: partitioned_flows_53_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_53_context_id_id_idx;


--
-- Name: partitioned_flows_53_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_53_year_idx;


--
-- Name: partitioned_flows_54_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_54_context_id_id_idx;


--
-- Name: partitioned_flows_54_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_54_year_idx;


--
-- Name: partitioned_flows_55_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_55_context_id_id_idx;


--
-- Name: partitioned_flows_55_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_55_year_idx;


--
-- Name: partitioned_flows_56_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_56_context_id_id_idx;


--
-- Name: partitioned_flows_56_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_56_year_idx;


--
-- Name: partitioned_flows_57_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_57_context_id_id_idx;


--
-- Name: partitioned_flows_57_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_57_year_idx;


--
-- Name: partitioned_flows_58_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_58_context_id_id_idx;


--
-- Name: partitioned_flows_58_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_58_year_idx;


--
-- Name: partitioned_flows_59_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_59_context_id_id_idx;


--
-- Name: partitioned_flows_59_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_59_year_idx;


--
-- Name: partitioned_flows_5_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_5_context_id_id_idx;


--
-- Name: partitioned_flows_5_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_5_year_idx;


--
-- Name: partitioned_flows_60_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_60_context_id_id_idx;


--
-- Name: partitioned_flows_60_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_60_year_idx;


--
-- Name: partitioned_flows_61_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_61_context_id_id_idx;


--
-- Name: partitioned_flows_61_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_61_year_idx;


--
-- Name: partitioned_flows_6_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_6_context_id_id_idx;


--
-- Name: partitioned_flows_6_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_6_year_idx;


--
-- Name: partitioned_flows_7_context_id_id_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_context_id_id_idx ATTACH PARTITION public.partitioned_flows_7_context_id_id_idx;


--
-- Name: partitioned_flows_7_year_idx; Type: INDEX ATTACH; Schema: public; Owner: -
--

ALTER INDEX public.partitioned_flows_year_idx ATTACH PARTITION public.partitioned_flows_7_year_idx;


--
-- Name: staff_members fk_rails_6ad8424ffc; Type: FK CONSTRAINT; Schema: content; Owner: -
--

ALTER TABLE ONLY content.staff_members
    ADD CONSTRAINT fk_rails_6ad8424ffc FOREIGN KEY (staff_group_id) REFERENCES content.staff_groups(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: top_profiles fk_rails_02381b1a96; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.top_profiles
    ADD CONSTRAINT fk_rails_02381b1a96 FOREIGN KEY (context_id) REFERENCES public.contexts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: download_quants fk_rails_05ea4b5d71; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_quants
    ADD CONSTRAINT fk_rails_05ea4b5d71 FOREIGN KEY (quant_id) REFERENCES public.quants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: flow_inds fk_rails_0a8bdfaf25; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_inds
    ADD CONSTRAINT fk_rails_0a8bdfaf25 FOREIGN KEY (flow_id) REFERENCES public.flows(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: dashboards_quals fk_rails_122397808e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards_quals
    ADD CONSTRAINT fk_rails_122397808e FOREIGN KEY (dashboards_attribute_id) REFERENCES public.dashboards_attributes(id) ON DELETE CASCADE;


--
-- Name: node_quals fk_rails_14ebb50b5a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.node_quals
    ADD CONSTRAINT fk_rails_14ebb50b5a FOREIGN KEY (node_id) REFERENCES public.nodes(id) ON DELETE CASCADE;


--
-- Name: recolor_by_attributes fk_rails_15a713c884; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recolor_by_attributes
    ADD CONSTRAINT fk_rails_15a713c884 FOREIGN KEY (context_id) REFERENCES public.contexts(id) ON DELETE CASCADE;


--
-- Name: context_node_types fk_rails_15e56acf9a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.context_node_types
    ADD CONSTRAINT fk_rails_15e56acf9a FOREIGN KEY (node_type_id) REFERENCES public.node_types(id) ON DELETE CASCADE;


--
-- Name: ind_country_properties fk_rails_162974f66c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ind_country_properties
    ADD CONSTRAINT fk_rails_162974f66c FOREIGN KEY (country_id) REFERENCES public.countries(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: download_attributes fk_rails_163b9bb8d8; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_attributes
    ADD CONSTRAINT fk_rails_163b9bb8d8 FOREIGN KEY (context_id) REFERENCES public.contexts(id) ON DELETE CASCADE;


--
-- Name: chart_attributes fk_rails_18fff2d805; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chart_attributes
    ADD CONSTRAINT fk_rails_18fff2d805 FOREIGN KEY (chart_id) REFERENCES public.charts(id) ON DELETE CASCADE;


--
-- Name: download_quals fk_rails_1be1712b6c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_quals
    ADD CONSTRAINT fk_rails_1be1712b6c FOREIGN KEY (download_attribute_id) REFERENCES public.download_attributes(id) ON DELETE CASCADE;


--
-- Name: quant_properties fk_rails_201d91fbef; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_properties
    ADD CONSTRAINT fk_rails_201d91fbef FOREIGN KEY (quant_id) REFERENCES public.quants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: flow_inds fk_rails_23d15ab229; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_inds
    ADD CONSTRAINT fk_rails_23d15ab229 FOREIGN KEY (ind_id) REFERENCES public.inds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: context_node_types fk_rails_23d7986b34; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.context_node_types
    ADD CONSTRAINT fk_rails_23d7986b34 FOREIGN KEY (context_id) REFERENCES public.contexts(id) ON DELETE CASCADE;


--
-- Name: resize_by_quants fk_rails_2617a248e4; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resize_by_quants
    ADD CONSTRAINT fk_rails_2617a248e4 FOREIGN KEY (resize_by_attribute_id) REFERENCES public.resize_by_attributes(id) ON DELETE CASCADE;


--
-- Name: node_inds fk_rails_28ea53a9b9; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.node_inds
    ADD CONSTRAINT fk_rails_28ea53a9b9 FOREIGN KEY (ind_id) REFERENCES public.inds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: recolor_by_inds fk_rails_2950876b56; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recolor_by_inds
    ADD CONSTRAINT fk_rails_2950876b56 FOREIGN KEY (recolor_by_attribute_id) REFERENCES public.recolor_by_attributes(id) ON DELETE CASCADE;


--
-- Name: top_profile_images fk_rails_29f1862b03; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.top_profile_images
    ADD CONSTRAINT fk_rails_29f1862b03 FOREIGN KEY (commodity_id) REFERENCES public.commodities(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chart_inds fk_rails_2c8eebb539; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chart_inds
    ADD CONSTRAINT fk_rails_2c8eebb539 FOREIGN KEY (chart_attribute_id) REFERENCES public.chart_attributes(id) ON DELETE CASCADE;


--
-- Name: quant_country_properties fk_rails_2cb9ec5128; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_country_properties
    ADD CONSTRAINT fk_rails_2cb9ec5128 FOREIGN KEY (quant_id) REFERENCES public.quants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ind_context_properties fk_rails_2d523de840; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ind_context_properties
    ADD CONSTRAINT fk_rails_2d523de840 FOREIGN KEY (ind_id) REFERENCES public.inds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: flow_quants fk_rails_2dbc0a565f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_quants
    ADD CONSTRAINT fk_rails_2dbc0a565f FOREIGN KEY (flow_id) REFERENCES public.flows(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: map_quants fk_rails_308b5b45f7; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_quants
    ADD CONSTRAINT fk_rails_308b5b45f7 FOREIGN KEY (map_attribute_id) REFERENCES public.map_attributes(id) ON DELETE CASCADE;


--
-- Name: map_attribute_groups fk_rails_32f187c0c7; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_attribute_groups
    ADD CONSTRAINT fk_rails_32f187c0c7 FOREIGN KEY (context_id) REFERENCES public.contexts(id) ON DELETE CASCADE;


--
-- Name: nodes fk_rails_37e87445f7; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT fk_rails_37e87445f7 FOREIGN KEY (node_type_id) REFERENCES public.node_types(id) ON DELETE CASCADE;


--
-- Name: download_versions fk_rails_3fcb3b1d94; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_versions
    ADD CONSTRAINT fk_rails_3fcb3b1d94 FOREIGN KEY (context_id) REFERENCES public.contexts(id) ON DELETE CASCADE;


--
-- Name: context_node_type_properties fk_rails_40673dee59; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.context_node_type_properties
    ADD CONSTRAINT fk_rails_40673dee59 FOREIGN KEY (geometry_context_node_type_id) REFERENCES public.context_node_types(id);


--
-- Name: chart_quals fk_rails_48ef39e784; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chart_quals
    ADD CONSTRAINT fk_rails_48ef39e784 FOREIGN KEY (chart_attribute_id) REFERENCES public.chart_attributes(id) ON DELETE CASCADE;


--
-- Name: dashboards_quants fk_rails_49a997570a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards_quants
    ADD CONSTRAINT fk_rails_49a997570a FOREIGN KEY (dashboards_attribute_id) REFERENCES public.dashboards_attributes(id) ON DELETE CASCADE;


--
-- Name: map_inds fk_rails_49db6b9c1f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_inds
    ADD CONSTRAINT fk_rails_49db6b9c1f FOREIGN KEY (ind_id) REFERENCES public.inds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: qual_country_properties fk_rails_4d7c9be019; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qual_country_properties
    ADD CONSTRAINT fk_rails_4d7c9be019 FOREIGN KEY (country_id) REFERENCES public.countries(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: node_properties fk_rails_4dcde982df; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.node_properties
    ADD CONSTRAINT fk_rails_4dcde982df FOREIGN KEY (node_id) REFERENCES public.nodes(id) ON DELETE CASCADE;


--
-- Name: dashboards_inds fk_rails_50cb385211; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards_inds
    ADD CONSTRAINT fk_rails_50cb385211 FOREIGN KEY (dashboards_attribute_id) REFERENCES public.dashboards_attributes(id) ON DELETE CASCADE;


--
-- Name: recolor_by_quals fk_rails_5294e7fccd; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recolor_by_quals
    ADD CONSTRAINT fk_rails_5294e7fccd FOREIGN KEY (recolor_by_attribute_id) REFERENCES public.recolor_by_attributes(id) ON DELETE CASCADE;


--
-- Name: qual_context_properties fk_rails_58bc3d5bcf; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qual_context_properties
    ADD CONSTRAINT fk_rails_58bc3d5bcf FOREIGN KEY (context_id) REFERENCES public.contexts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sankey_card_links fk_rails_5b56ba10d2; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sankey_card_links
    ADD CONSTRAINT fk_rails_5b56ba10d2 FOREIGN KEY (commodity_id) REFERENCES public.commodities(id) ON DELETE CASCADE;


--
-- Name: ind_commodity_properties fk_rails_5c0dcf9d64; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ind_commodity_properties
    ADD CONSTRAINT fk_rails_5c0dcf9d64 FOREIGN KEY (ind_id) REFERENCES public.inds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: contextual_layers fk_rails_5c2d32b5a7; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contextual_layers
    ADD CONSTRAINT fk_rails_5c2d32b5a7 FOREIGN KEY (context_id) REFERENCES public.contexts(id) ON DELETE CASCADE;


--
-- Name: country_properties fk_rails_668b355aa6; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.country_properties
    ADD CONSTRAINT fk_rails_668b355aa6 FOREIGN KEY (country_id) REFERENCES public.countries(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chart_quants fk_rails_69c56caceb; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chart_quants
    ADD CONSTRAINT fk_rails_69c56caceb FOREIGN KEY (quant_id) REFERENCES public.quants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ind_context_properties fk_rails_6b25018f3c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ind_context_properties
    ADD CONSTRAINT fk_rails_6b25018f3c FOREIGN KEY (context_id) REFERENCES public.contexts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: quant_context_properties fk_rails_6e05c978da; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_context_properties
    ADD CONSTRAINT fk_rails_6e05c978da FOREIGN KEY (context_id) REFERENCES public.contexts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: flow_quals fk_rails_6e55ca4cbc; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_quals
    ADD CONSTRAINT fk_rails_6e55ca4cbc FOREIGN KEY (flow_id) REFERENCES public.flows(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ind_properties fk_rails_720a88d4b2; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ind_properties
    ADD CONSTRAINT fk_rails_720a88d4b2 FOREIGN KEY (ind_id) REFERENCES public.inds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: qual_commodity_properties fk_rails_721d9b2c40; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qual_commodity_properties
    ADD CONSTRAINT fk_rails_721d9b2c40 FOREIGN KEY (commodity_id) REFERENCES public.commodities(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: charts fk_rails_805a6066ad; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.charts
    ADD CONSTRAINT fk_rails_805a6066ad FOREIGN KEY (parent_id) REFERENCES public.charts(id) ON DELETE CASCADE;


--
-- Name: quant_context_properties fk_rails_8c0d4513c3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_context_properties
    ADD CONSTRAINT fk_rails_8c0d4513c3 FOREIGN KEY (quant_id) REFERENCES public.quants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: quant_country_properties fk_rails_90fcd1e231; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_country_properties
    ADD CONSTRAINT fk_rails_90fcd1e231 FOREIGN KEY (country_id) REFERENCES public.countries(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sankey_card_links fk_rails_9113195b2d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sankey_card_links
    ADD CONSTRAINT fk_rails_9113195b2d FOREIGN KEY (country_id) REFERENCES public.countries(id) ON DELETE CASCADE;


--
-- Name: flow_quals fk_rails_917b9da2b8; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_quals
    ADD CONSTRAINT fk_rails_917b9da2b8 FOREIGN KEY (qual_id) REFERENCES public.quals(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: resize_by_attributes fk_rails_91f952a39c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resize_by_attributes
    ADD CONSTRAINT fk_rails_91f952a39c FOREIGN KEY (context_id) REFERENCES public.contexts(id) ON DELETE CASCADE;


--
-- Name: recolor_by_inds fk_rails_93051274e4; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recolor_by_inds
    ADD CONSTRAINT fk_rails_93051274e4 FOREIGN KEY (ind_id) REFERENCES public.inds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: quant_commodity_properties fk_rails_93e2577ebb; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_commodity_properties
    ADD CONSTRAINT fk_rails_93e2577ebb FOREIGN KEY (commodity_id) REFERENCES public.commodities(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: node_quals fk_rails_962f283611; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.node_quals
    ADD CONSTRAINT fk_rails_962f283611 FOREIGN KEY (qual_id) REFERENCES public.quals(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: dashboards_quals fk_rails_965c3e87f9; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards_quals
    ADD CONSTRAINT fk_rails_965c3e87f9 FOREIGN KEY (qual_id) REFERENCES public.quals(id) ON DELETE CASCADE;


--
-- Name: dashboards_attributes fk_rails_9afdb92e8e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards_attributes
    ADD CONSTRAINT fk_rails_9afdb92e8e FOREIGN KEY (dashboards_attribute_group_id) REFERENCES public.dashboards_attribute_groups(id) ON DELETE CASCADE;


--
-- Name: carto_layers fk_rails_9b2f0fa157; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carto_layers
    ADD CONSTRAINT fk_rails_9b2f0fa157 FOREIGN KEY (contextual_layer_id) REFERENCES public.contextual_layers(id) ON DELETE CASCADE;


--
-- Name: flow_quants fk_rails_a48f7b74d0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flow_quants
    ADD CONSTRAINT fk_rails_a48f7b74d0 FOREIGN KEY (quant_id) REFERENCES public.quants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: charts fk_rails_a7dc6318f9; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.charts
    ADD CONSTRAINT fk_rails_a7dc6318f9 FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: ind_commodity_properties fk_rails_a8310a8e25; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ind_commodity_properties
    ADD CONSTRAINT fk_rails_a8310a8e25 FOREIGN KEY (commodity_id) REFERENCES public.commodities(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: dashboards_quants fk_rails_b49efb2529; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards_quants
    ADD CONSTRAINT fk_rails_b49efb2529 FOREIGN KEY (quant_id) REFERENCES public.quants(id) ON DELETE CASCADE;


--
-- Name: chart_inds fk_rails_b730b06fdc; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chart_inds
    ADD CONSTRAINT fk_rails_b730b06fdc FOREIGN KEY (ind_id) REFERENCES public.inds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chart_quals fk_rails_c1341bce97; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chart_quals
    ADD CONSTRAINT fk_rails_c1341bce97 FOREIGN KEY (qual_id) REFERENCES public.quals(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: flows fk_rails_c33db455e5; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flows
    ADD CONSTRAINT fk_rails_c33db455e5 FOREIGN KEY (context_id) REFERENCES public.contexts(id) ON DELETE CASCADE;


--
-- Name: resize_by_quants fk_rails_c63dc992e3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resize_by_quants
    ADD CONSTRAINT fk_rails_c63dc992e3 FOREIGN KEY (quant_id) REFERENCES public.quants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: qual_context_properties fk_rails_c67757078e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qual_context_properties
    ADD CONSTRAINT fk_rails_c67757078e FOREIGN KEY (qual_id) REFERENCES public.quals(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: qual_properties fk_rails_c8bcede145; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qual_properties
    ADD CONSTRAINT fk_rails_c8bcede145 FOREIGN KEY (qual_id) REFERENCES public.quals(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: map_inds fk_rails_cac7dc7c14; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_inds
    ADD CONSTRAINT fk_rails_cac7dc7c14 FOREIGN KEY (map_attribute_id) REFERENCES public.map_attributes(id) ON DELETE CASCADE;


--
-- Name: profiles fk_rails_cbc235c3bc; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT fk_rails_cbc235c3bc FOREIGN KEY (context_node_type_id) REFERENCES public.context_node_types(id) ON DELETE CASCADE;


--
-- Name: map_quants fk_rails_cc084396cb; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_quants
    ADD CONSTRAINT fk_rails_cc084396cb FOREIGN KEY (quant_id) REFERENCES public.quants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: context_properties fk_rails_cc3af59ff4; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.context_properties
    ADD CONSTRAINT fk_rails_cc3af59ff4 FOREIGN KEY (context_id) REFERENCES public.contexts(id) ON DELETE CASCADE;


--
-- Name: context_node_type_properties fk_rails_d35e506797; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.context_node_type_properties
    ADD CONSTRAINT fk_rails_d35e506797 FOREIGN KEY (context_node_type_id) REFERENCES public.context_node_types(id) ON DELETE CASCADE;


--
-- Name: contexts fk_rails_d9e59d1113; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contexts
    ADD CONSTRAINT fk_rails_d9e59d1113 FOREIGN KEY (country_id) REFERENCES public.countries(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chart_node_types fk_rails_dbd8214c7b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chart_node_types
    ADD CONSTRAINT fk_rails_dbd8214c7b FOREIGN KEY (chart_id) REFERENCES public.charts(id) ON DELETE CASCADE;


--
-- Name: node_quants fk_rails_dd544b3e59; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.node_quants
    ADD CONSTRAINT fk_rails_dd544b3e59 FOREIGN KEY (node_id) REFERENCES public.nodes(id) ON DELETE CASCADE;


--
-- Name: chart_quants fk_rails_dd98c02cd6; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chart_quants
    ADD CONSTRAINT fk_rails_dd98c02cd6 FOREIGN KEY (chart_attribute_id) REFERENCES public.chart_attributes(id) ON DELETE CASCADE;


--
-- Name: ind_country_properties fk_rails_e01a20acf1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ind_country_properties
    ADD CONSTRAINT fk_rails_e01a20acf1 FOREIGN KEY (ind_id) REFERENCES public.inds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: qual_commodity_properties fk_rails_e18327427d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qual_commodity_properties
    ADD CONSTRAINT fk_rails_e18327427d FOREIGN KEY (qual_id) REFERENCES public.quals(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: download_quants fk_rails_e3b3c104f3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_quants
    ADD CONSTRAINT fk_rails_e3b3c104f3 FOREIGN KEY (download_attribute_id) REFERENCES public.download_attributes(id) ON DELETE CASCADE;


--
-- Name: node_quants fk_rails_e5f4cc54e9; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.node_quants
    ADD CONSTRAINT fk_rails_e5f4cc54e9 FOREIGN KEY (quant_id) REFERENCES public.quants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: download_quals fk_rails_e8e87251a2; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_quals
    ADD CONSTRAINT fk_rails_e8e87251a2 FOREIGN KEY (qual_id) REFERENCES public.quals(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: top_profiles fk_rails_eb02423c0e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.top_profiles
    ADD CONSTRAINT fk_rails_eb02423c0e FOREIGN KEY (node_id) REFERENCES public.nodes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: contexts fk_rails_eea78f436e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contexts
    ADD CONSTRAINT fk_rails_eea78f436e FOREIGN KEY (commodity_id) REFERENCES public.commodities(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: quant_commodity_properties fk_rails_f026110265; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quant_commodity_properties
    ADD CONSTRAINT fk_rails_f026110265 FOREIGN KEY (quant_id) REFERENCES public.quants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chart_node_types fk_rails_f043b3c463; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chart_node_types
    ADD CONSTRAINT fk_rails_f043b3c463 FOREIGN KEY (node_type_id) REFERENCES public.node_types(id) ON DELETE CASCADE;


--
-- Name: top_profiles fk_rails_f4a644ec90; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.top_profiles
    ADD CONSTRAINT fk_rails_f4a644ec90 FOREIGN KEY (top_profile_image_id) REFERENCES public.top_profile_images(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: dashboards_inds fk_rails_f4e97b1eab; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards_inds
    ADD CONSTRAINT fk_rails_f4e97b1eab FOREIGN KEY (ind_id) REFERENCES public.inds(id) ON DELETE CASCADE;


--
-- Name: recolor_by_quals fk_rails_f5f36c9f54; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recolor_by_quals
    ADD CONSTRAINT fk_rails_f5f36c9f54 FOREIGN KEY (qual_id) REFERENCES public.quals(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: map_attributes fk_rails_f85c86caa0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_attributes
    ADD CONSTRAINT fk_rails_f85c86caa0 FOREIGN KEY (map_attribute_group_id) REFERENCES public.map_attribute_groups(id) ON DELETE CASCADE;


--
-- Name: node_inds fk_rails_fe29817503; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.node_inds
    ADD CONSTRAINT fk_rails_fe29817503 FOREIGN KEY (node_id) REFERENCES public.nodes(id) ON DELETE CASCADE;


--
-- Name: qual_country_properties fk_rails_fe3d71a6cc; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qual_country_properties
    ADD CONSTRAINT fk_rails_fe3d71a6cc FOREIGN KEY (qual_id) REFERENCES public.quals(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

SET search_path TO "$user", public;

INSERT INTO "schema_migrations" (version) VALUES
('20190215113824'),
('20190228115321'),
('20190228115345'),
('20190228115409'),
('20190301121434'),
('20190301170044'),
('20190301170114'),
('20190301170138'),
('20190301170523'),
('20190301173716'),
('20190301173748'),
('20190301173808'),
('20190301173824'),
('20190308163938'),
('20190318161140'),
('20190320122547'),
('20190320172713'),
('20190321122822'),
('20190321161913'),
('20190403153118'),
('20190403153119'),
('20190403153135'),
('20190409190106'),
('20190410075223'),
('20190429104832'),
('20190429112751'),
('20190503103053'),
('20190503115752'),
('20190503123635'),
('20190503175955'),
('20190513125050'),
('20190516111644'),
('20190520093639'),
('20190528091308'),
('20190529153223'),
('20190530140625'),
('20190611224257'),
('20190618131945'),
('20190621101736'),
('20190624114103'),
('20190625110206'),
('20190701120240'),
('20190701165705'),
('20190701172702'),
('20190702090231'),
('20190702112018'),
('20190702132100'),
('20190711133915'),
('20190712115644'),
('20190716085538'),
('20190722152438'),
('20190801121907'),
('20190807095141'),
('20190814161133'),
('20190820105523'),
('20190823135415'),
('20190919063754'),
('20190919211340'),
('20190920090440'),
('20190923074833'),
('20190923143224'),
('20190924075531'),
('20190924102948'),
('20191002200900'),
('20191002201000'),
('20191003080052'),
('20191003152614'),
('20191004083620'),
('20191007090648'),
('20191008083758'),
('20191011112339'),
('20191014111756'),
('20191015095615'),
('20191021084412'),
('20191028134448'),
('20191028134449'),
('20191111213756'),
('20191118213141'),
('20191119115004'),
('20191119115005'),
('20191122074338'),
('20191122074453'),
('20191202080716'),
('20191202083829'),
('20191202090700'),
('20191205213427'),
('20191209224804'),
('20191209224805'),
('20191209230015'),
('20191211221707'),
('20191211222503'),
('20191212105506'),
('20191212105507'),
('20191212151744'),
('20191216101622'),
('20191217105056'),
('20191218221238'),
('20191219221216'),
('20200106092554'),
('20200107131928'),
('20200123163215'),
('20200207162026'),
('20200302203632'),
('20200302214104'),
('20200317075824'),
('20200330120605'),
('20200331175932'),
('20200409141902'),
('20200416150928'),
('20200417094644'),
('20200425120802'),
('20200425165029'),
('20200425173940'),
('20200430115447');


