SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
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
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: ind_properties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ind_properties (
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
-- Name: COLUMN ind_properties.is_visible_on_place_profile; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.ind_properties.is_visible_on_place_profile IS 'Whether to display this attribute on place profile';


--
-- Name: COLUMN ind_properties.is_visible_on_actor_profile; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.ind_properties.is_visible_on_actor_profile IS 'Whether to display this attribute on actor profile';


--
-- Name: COLUMN ind_properties.is_temporal_on_place_profile; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.ind_properties.is_temporal_on_place_profile IS 'Whether attribute has temporal data on place profile';


--
-- Name: COLUMN ind_properties.is_temporal_on_actor_profile; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.ind_properties.is_temporal_on_actor_profile IS 'Whether attribute has temporal data on actor profile';


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
    is_visible_on_place_profile boolean DEFAULT false NOT NULL,
    is_visible_on_actor_profile boolean DEFAULT false NOT NULL,
    is_temporal_on_place_profile boolean DEFAULT false NOT NULL,
    is_temporal_on_actor_profile boolean DEFAULT false NOT NULL,
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
-- Name: COLUMN qual_properties.is_visible_on_place_profile; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.qual_properties.is_visible_on_place_profile IS 'Whether to display this attribute on place profile';


--
-- Name: COLUMN qual_properties.is_visible_on_actor_profile; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.qual_properties.is_visible_on_actor_profile IS 'Whether to display this attribute on actor profile';


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
    is_visible_on_place_profile boolean DEFAULT false NOT NULL,
    is_visible_on_actor_profile boolean DEFAULT false NOT NULL,
    is_temporal_on_place_profile boolean DEFAULT false NOT NULL,
    is_temporal_on_actor_profile boolean DEFAULT false NOT NULL,
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
-- Name: COLUMN quant_properties.is_visible_on_place_profile; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_properties.is_visible_on_place_profile IS 'Whether to display this attribute on place profile';


--
-- Name: COLUMN quant_properties.is_visible_on_actor_profile; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.quant_properties.is_visible_on_actor_profile IS 'Whether to display this attribute on actor profile';


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
-- Name: attributes_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.attributes_mv AS
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
           FROM (public.quants
             LEFT JOIN public.quant_properties qp ON ((qp.quant_id = quants.id)))
        UNION ALL
         SELECT 'Ind'::text AS text,
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
            'AVG'::text AS text
           FROM (public.inds
             LEFT JOIN public.ind_properties ip ON ((ip.ind_id = inds.id)))
        UNION ALL
         SELECT 'Qual'::text AS text,
            quals.id,
            quals.name,
            qp.display_name,
            NULL::text AS text,
            NULL::text AS text,
            qp.tooltip_text,
            qp.is_visible_on_actor_profile,
            qp.is_visible_on_place_profile,
            qp.is_temporal_on_actor_profile,
            qp.is_temporal_on_place_profile,
            NULL::text AS text
           FROM (public.quals
             LEFT JOIN public.qual_properties qp ON ((qp.qual_id = quals.id)))) s
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW attributes_mv; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON MATERIALIZED VIEW public.attributes_mv IS 'Materialized view which merges inds, quals and quants.';


--
-- Name: COLUMN attributes_mv.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.attributes_mv.id IS 'The unique id is a sequential number which is generated at REFRESH and therefore not fixed.';


--
-- Name: COLUMN attributes_mv.original_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.attributes_mv.original_type IS 'Type of the original entity (Ind / Qual / Quant)';


--
-- Name: COLUMN attributes_mv.original_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.attributes_mv.original_id IS 'Id from the original table (inds / quals / quants)';


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

COMMENT ON COLUMN public.chart_attributes.legend_name IS 'Legend title';


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
    COALESCE(cha.display_name, a.display_name) AS display_name,
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
     JOIN public.attributes_mv a ON (((a.original_id = chq.qual_id) AND (a.original_type = 'Qual'::text))))
UNION ALL
 SELECT cha.id,
    cha.chart_id,
    cha."position",
    cha.years,
    COALESCE(cha.display_name, a.display_name) AS display_name,
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
     JOIN public.attributes_mv a ON (((a.original_id = chq.quant_id) AND (a.original_type = 'Quant'::text))))
UNION ALL
 SELECT cha.id,
    cha.chart_id,
    cha."position",
    cha.years,
    COALESCE(cha.display_name, a.display_name) AS display_name,
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
     JOIN public.attributes_mv a ON (((a.original_id = chi.ind_id) AND (a.original_type = 'Ind'::text))))
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW chart_attributes_mv; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON MATERIALIZED VIEW public.chart_attributes_mv IS 'Materialized view which merges chart_inds, chart_quals and chart_quants with chart_attributes.';


--
-- Name: COLUMN chart_attributes_mv.display_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.chart_attributes_mv.display_name IS 'If absent in chart_attributes this is pulled from attributes_mv.';


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
    updated_at timestamp without time zone NOT NULL,
    chart_type character varying
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

COMMENT ON COLUMN public.charts.title IS 'Title of chart for display';


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
  WITH DATA;


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
  WITH DATA;


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
    role character varying,
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
-- Name: context_node_types_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.context_node_types_mv AS
 WITH RECURSIVE context_node_types_with_parent AS (
         SELECT cnt.context_id,
            cnt.column_position,
            cnt.node_type_id,
            nt.name AS node_type,
            NULL::integer AS parent_node_type_id,
            NULL::text AS parent_node_type
           FROM (public.context_node_types cnt
             JOIN public.node_types nt ON ((cnt.node_type_id = nt.id)))
          WHERE (cnt.column_position = 0)
        UNION ALL
         SELECT cnt.context_id,
            cnt.column_position,
            cnt.node_type_id,
            nt.name,
            parent_cnt.node_type_id,
            parent_cnt.node_type
           FROM ((public.context_node_types cnt
             JOIN public.node_types nt ON ((cnt.node_type_id = nt.id)))
             JOIN context_node_types_with_parent parent_cnt ON (((cnt.column_position = (parent_cnt.column_position + 1)) AND (cnt.context_id = parent_cnt.context_id))))
        )
 SELECT context_node_types_with_parent.context_id,
    context_node_types_with_parent.column_position,
    context_node_types_with_parent.node_type_id,
    context_node_types_with_parent.node_type,
    context_node_types_with_parent.parent_node_type_id,
    context_node_types_with_parent.parent_node_type
   FROM context_node_types_with_parent
  ORDER BY context_node_types_with_parent.context_id, context_node_types_with_parent.column_position
  WITH NO DATA;


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
  WITH DATA;


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
    chart_type character varying NOT NULL,
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
-- Name: COLUMN dashboards_attributes.chart_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_attributes.chart_type IS 'Type of chart to use in dashboards';


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
    da.chart_type,
    da.created_at,
    da.updated_at,
    a.id AS attribute_id
   FROM ((public.dashboards_inds di
     JOIN public.dashboards_attributes da ON ((da.id = di.dashboards_attribute_id)))
     JOIN public.attributes_mv a ON (((a.original_id = di.ind_id) AND (a.original_type = 'Ind'::text))))
UNION ALL
 SELECT da.id,
    da.dashboards_attribute_group_id,
    da."position",
    da.chart_type,
    da.created_at,
    da.updated_at,
    a.id AS attribute_id
   FROM ((public.dashboards_quals dq
     JOIN public.dashboards_attributes da ON ((da.id = dq.dashboards_attribute_id)))
     JOIN public.attributes_mv a ON (((a.original_id = dq.qual_id) AND (a.original_type = 'Qual'::text))))
UNION ALL
 SELECT da.id,
    da.dashboards_attribute_group_id,
    da."position",
    da.chart_type,
    da.created_at,
    da.updated_at,
    a.id AS attribute_id
   FROM ((public.dashboards_quants dq
     JOIN public.dashboards_attributes da ON ((da.id = dq.dashboards_attribute_id)))
     JOIN public.attributes_mv a ON (((a.original_id = dq.quant_id) AND (a.original_type = 'Quant'::text))))
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW dashboards_attributes_mv; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON MATERIALIZED VIEW public.dashboards_attributes_mv IS 'Materialized view which merges dashboards_inds, dashboards_quals and dashboards_quants with dashboards_attributes.';


--
-- Name: COLUMN dashboards_attributes_mv.attribute_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_attributes_mv.attribute_id IS 'References the unique id in attributes_mv.';


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
-- Name: dashboards_flow_paths_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.dashboards_flow_paths_mv AS
 SELECT DISTINCT flow_paths.context_id,
    contexts.country_id,
    contexts.commodity_id,
    flow_paths.node_id,
    nodes.name AS node,
    nodes.node_type_id,
    node_types.name AS node_type,
    flow_paths.flow_id,
    cnt.column_position,
    cnt_props.column_group,
        CASE
            WHEN (((cnt_props.role)::text = 'exporter'::text) OR ((cnt_props.role)::text = 'importer'::text)) THEN 'company'::character varying
            ELSE cnt_props.role
        END AS category
   FROM (((((( SELECT flows.context_id,
            flows.id AS flow_id,
            a.node_id,
            a."position"
           FROM public.flows,
            LATERAL unnest(flows.path) WITH ORDINALITY a(node_id, "position")) flow_paths
     JOIN public.contexts ON ((flow_paths.context_id = contexts.id)))
     JOIN public.nodes ON ((flow_paths.node_id = nodes.id)))
     JOIN public.node_types ON ((nodes.node_type_id = node_types.id)))
     JOIN public.context_node_types cnt ON (((node_types.id = cnt.node_type_id) AND (flow_paths.context_id = cnt.context_id))))
     JOIN public.context_node_type_properties cnt_props ON ((cnt.id = cnt_props.context_node_type_id)))
  WHERE (cnt_props.role IS NOT NULL)
  WITH NO DATA;


--
-- Name: dashboards_commodities_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.dashboards_commodities_mv AS
 SELECT fp.commodity_id AS id,
    btrim(commodities.name) AS name,
    to_tsvector('simple'::regconfig, COALESCE(btrim(commodities.name), ''::text)) AS name_tsvector,
    fp.country_id,
    fp.node_id
   FROM (public.dashboards_flow_paths_mv fp
     JOIN public.commodities ON ((commodities.id = fp.commodity_id)))
  GROUP BY fp.commodity_id, commodities.name, fp.country_id, fp.node_id
  WITH NO DATA;


--
-- Name: dashboards_companies_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.dashboards_companies_mv AS
 SELECT fp.node_id AS id,
    btrim(fp.node) AS name,
    to_tsvector('simple'::regconfig, COALESCE(btrim(fp.node), ''::text)) AS name_tsvector,
    fp.node_type_id,
    fp.node_type,
    all_fp.country_id,
    all_fp.commodity_id,
    all_fp.node_id
   FROM (public.dashboards_flow_paths_mv all_fp
     JOIN public.dashboards_flow_paths_mv fp ON ((all_fp.flow_id = fp.flow_id)))
  WHERE ((fp.category)::text = 'company'::text)
  GROUP BY fp.node_id, fp.node, fp.node_type_id, fp.node_type, all_fp.country_id, all_fp.commodity_id, all_fp.node_id
  WITH NO DATA;


--
-- Name: dashboards_countries_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.dashboards_countries_mv AS
 SELECT fp.country_id AS id,
    btrim(countries.name) AS name,
    to_tsvector('simple'::regconfig, COALESCE(btrim(countries.name), ''::text)) AS name_tsvector,
    countries.iso2,
    fp.commodity_id,
    fp.node_id
   FROM (public.dashboards_flow_paths_mv fp
     JOIN public.countries ON ((countries.id = fp.country_id)))
  GROUP BY fp.country_id, countries.name, countries.iso2, fp.commodity_id, fp.node_id
  WITH NO DATA;


--
-- Name: dashboards_destinations_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.dashboards_destinations_mv AS
 SELECT fp.node_id AS id,
    btrim(fp.node) AS name,
    to_tsvector('simple'::regconfig, COALESCE(btrim(fp.node), ''::text)) AS name_tsvector,
    fp.node_type_id,
    fp.node_type,
    all_fp.country_id,
    all_fp.commodity_id,
    all_fp.node_id
   FROM (public.dashboards_flow_paths_mv all_fp
     JOIN public.dashboards_flow_paths_mv fp ON ((all_fp.flow_id = fp.flow_id)))
  WHERE ((fp.category)::text = 'destination'::text)
  GROUP BY fp.node_id, fp.node, fp.node_type_id, fp.node_type, all_fp.country_id, all_fp.commodity_id, all_fp.node_id
  WITH NO DATA;


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
-- Name: dashboards_flow_attributes_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.dashboards_flow_attributes_mv AS
 SELECT DISTINCT contexts.country_id,
    contexts.commodity_id,
    flows.path,
    a.id AS attribute_id,
    a.display_name,
    a.tooltip_text,
    da.chart_type,
    da.dashboards_attribute_group_id,
    da."position"
   FROM (((((public.flows
     JOIN public.contexts ON ((flows.context_id = contexts.id)))
     JOIN public.flow_inds ON ((flows.id = flow_inds.flow_id)))
     JOIN public.dashboards_inds di ON ((flow_inds.ind_id = di.ind_id)))
     JOIN public.dashboards_attributes da ON ((da.id = di.dashboards_attribute_id)))
     JOIN public.attributes_mv a ON (((a.original_id = di.ind_id) AND (a.original_type = 'Ind'::text))))
  WHERE (a.display_name IS NOT NULL)
UNION ALL
 SELECT DISTINCT contexts.country_id,
    contexts.commodity_id,
    flows.path,
    a.id AS attribute_id,
    a.display_name,
    a.tooltip_text,
    da.chart_type,
    da.dashboards_attribute_group_id,
    da."position"
   FROM (((((public.flows
     JOIN public.contexts ON ((flows.context_id = contexts.id)))
     JOIN public.flow_quals ON ((flows.id = flow_quals.flow_id)))
     JOIN public.dashboards_quals dq ON ((flow_quals.qual_id = dq.qual_id)))
     JOIN public.dashboards_attributes da ON ((da.id = dq.dashboards_attribute_id)))
     JOIN public.attributes_mv a ON (((a.original_id = dq.qual_id) AND (a.original_type = 'Qual'::text))))
  WHERE (a.display_name IS NOT NULL)
UNION ALL
 SELECT DISTINCT contexts.country_id,
    contexts.commodity_id,
    flows.path,
    a.id AS attribute_id,
    a.display_name,
    a.tooltip_text,
    da.chart_type,
    da.dashboards_attribute_group_id,
    da."position"
   FROM (((((public.flows
     JOIN public.contexts ON ((flows.context_id = contexts.id)))
     JOIN public.flow_quants ON ((flows.id = flow_quants.flow_id)))
     JOIN public.dashboards_quants dq ON ((flow_quants.quant_id = dq.quant_id)))
     JOIN public.dashboards_attributes da ON ((da.id = dq.dashboards_attribute_id)))
     JOIN public.attributes_mv a ON (((a.original_id = dq.quant_id) AND (a.original_type = 'Quant'::text))))
  WHERE (a.display_name IS NOT NULL)
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW dashboards_flow_attributes_mv; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON MATERIALIZED VIEW public.dashboards_flow_attributes_mv IS 'Materialized view which merges dashboards_attributes_mv and attributes_mv for attributes with values in flow_inds/quals/quants';


--
-- Name: COLUMN dashboards_flow_attributes_mv.country_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_flow_attributes_mv.country_id IS 'References country id (via flows -> contexts) - for dashboards filtering';


--
-- Name: COLUMN dashboards_flow_attributes_mv.commodity_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_flow_attributes_mv.commodity_id IS 'References commodity id (via flows -> contexts) - for dashboards filtering';


--
-- Name: COLUMN dashboards_flow_attributes_mv.path; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_flow_attributes_mv.path IS 'Flow path';


--
-- Name: COLUMN dashboards_flow_attributes_mv.attribute_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_flow_attributes_mv.attribute_id IS 'References the unique id in attributes_mv.';


--
-- Name: COLUMN dashboards_flow_attributes_mv.display_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_flow_attributes_mv.display_name IS 'Attribute display name';


--
-- Name: COLUMN dashboards_flow_attributes_mv.tooltip_text; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_flow_attributes_mv.tooltip_text IS 'Attribute tooltip_text';


--
-- Name: COLUMN dashboards_flow_attributes_mv.dashboards_attribute_group_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_flow_attributes_mv.dashboards_attribute_group_id IS 'References group in dashboards_attribute_groups';


--
-- Name: COLUMN dashboards_flow_attributes_mv."position"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.dashboards_flow_attributes_mv."position" IS 'Position within group';


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
-- Name: dashboards_node_attributes_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.dashboards_node_attributes_mv AS
 SELECT DISTINCT node_inds.node_id,
    a.id AS attribute_id,
    a.display_name,
    a.tooltip_text,
    da.chart_type,
    da.dashboards_attribute_group_id,
    da."position"
   FROM (((public.node_inds
     JOIN public.dashboards_inds di ON ((node_inds.ind_id = di.ind_id)))
     JOIN public.dashboards_attributes da ON ((da.id = di.dashboards_attribute_id)))
     JOIN public.attributes_mv a ON (((a.original_id = di.ind_id) AND (a.original_type = 'Ind'::text))))
  WHERE (a.display_name IS NOT NULL)
UNION ALL
 SELECT DISTINCT node_quals.node_id,
    a.id AS attribute_id,
    a.display_name,
    a.tooltip_text,
    da.chart_type,
    da.dashboards_attribute_group_id,
    da."position"
   FROM (((public.node_quals
     JOIN public.dashboards_quals dq ON ((node_quals.qual_id = dq.qual_id)))
     JOIN public.dashboards_attributes da ON ((da.id = dq.dashboards_attribute_id)))
     JOIN public.attributes_mv a ON (((a.original_id = dq.qual_id) AND (a.original_type = 'Qual'::text))))
  WHERE (a.display_name IS NOT NULL)
UNION ALL
 SELECT DISTINCT node_quants.node_id,
    a.id AS attribute_id,
    a.display_name,
    a.tooltip_text,
    da.chart_type,
    da.dashboards_attribute_group_id,
    da."position"
   FROM (((public.node_quants
     JOIN public.dashboards_quants dq ON ((node_quants.quant_id = dq.quant_id)))
     JOIN public.dashboards_attributes da ON ((da.id = dq.dashboards_attribute_id)))
     JOIN public.attributes_mv a ON (((a.original_id = dq.quant_id) AND (a.original_type = 'Quant'::text))))
  WHERE (a.display_name IS NOT NULL)
  WITH NO DATA;


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
-- Name: dashboards_sources_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.dashboards_sources_mv AS
 SELECT fp.node_id AS id,
    btrim(fp.node) AS name,
    to_tsvector('simple'::regconfig, COALESCE(btrim(fp.node), ''::text)) AS name_tsvector,
    fp.node_type_id,
    fp.node_type,
    quals.name AS parent_node_type,
    node_quals.value AS parent_name,
    all_fp.country_id,
    all_fp.commodity_id,
    all_fp.node_id
   FROM ((((public.dashboards_flow_paths_mv all_fp
     JOIN public.dashboards_flow_paths_mv fp ON ((all_fp.flow_id = fp.flow_id)))
     JOIN public.context_node_types_mv cnt_mv ON (((fp.node_type_id = cnt_mv.node_type_id) AND (fp.context_id = cnt_mv.context_id))))
     LEFT JOIN public.quals ON ((quals.name = cnt_mv.parent_node_type)))
     LEFT JOIN public.node_quals ON (((fp.node_id = node_quals.node_id) AND (quals.id = node_quals.qual_id))))
  WHERE (((fp.category)::text = 'source'::text) AND (all_fp.node_id <> fp.node_id))
  GROUP BY fp.node_id, fp.node, fp.node_type_id, fp.node_type, quals.name, node_quals.value, all_fp.country_id, all_fp.commodity_id, all_fp.node_id
  WITH NO DATA;


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
    a.id AS attribute_id
   FROM ((public.download_quants daq
     JOIN public.download_attributes da ON ((da.id = daq.download_attribute_id)))
     JOIN public.attributes_mv a ON (((a.original_id = daq.quant_id) AND (a.original_type = 'Quant'::text))))
UNION ALL
 SELECT da.id,
    da.context_id,
    da."position",
    da.display_name,
    da.years,
    da.created_at,
    da.updated_at,
    a.id AS attribute_id
   FROM ((public.download_quals daq
     JOIN public.download_attributes da ON ((da.id = daq.download_attribute_id)))
     JOIN public.attributes_mv a ON (((a.original_id = daq.qual_id) AND (a.original_type = 'Qual'::text))))
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW download_attributes_mv; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON MATERIALIZED VIEW public.download_attributes_mv IS 'Materialized view which merges download_quals and download_quants with download_attributes.';


--
-- Name: COLUMN download_attributes_mv.attribute_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.download_attributes_mv.attribute_id IS 'References the unique id in attributes_mv.';


--
-- Name: flow_paths_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.flow_paths_mv AS
 SELECT f.node_id,
    n.geo_id,
        CASE
            WHEN (cn.node_type_name = ANY (ARRAY['COUNTRY OF PRODUCTION'::text, 'BIOME'::text, 'LOGISTICS HUB'::text, 'STATE'::text])) THEN upper(n.name)
            ELSE initcap(n.name)
        END AS name,
    cn.node_type_name,
    cn.column_position,
    f.id AS flow_id,
    f.year,
    f.context_id
   FROM ((( SELECT flows.id,
            flows.year,
            a.node_id,
            a."position",
            flows.context_id
           FROM public.flows,
            LATERAL unnest(flows.path) WITH ORDINALITY a(node_id, "position")) f
     JOIN ( SELECT cnt.context_id,
            cnt.column_position,
            cnt.node_type_id,
            node_types.name AS node_type_name
           FROM (public.context_node_types cnt
             JOIN public.node_types ON ((node_types.id = cnt.node_type_id)))) cn ON (((f."position" = (cn.column_position + 1)) AND (f.context_id = cn.context_id))))
     JOIN public.nodes n ON ((n.id = f.node_id)))
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW flow_paths_mv; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON MATERIALIZED VIEW public.flow_paths_mv IS 'Normalised flows';


--
-- Name: download_flows_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.download_flows_mv AS
 SELECT ARRAY[f_0.context_id, (f_0.year)::integer, f_0.node_id, f_1.node_id, f_2.node_id, f_3.node_id, f_4.node_id, f_5.node_id, f_6.node_id, f_7.node_id, f_0.flow_id] AS row_name,
    f_0.flow_id AS id,
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
            WHEN (f_5.node_type_name = 'EXPORTER'::text) THEN f_5.node_id
            WHEN (f_2.node_type_name = 'EXPORTER'::text) THEN f_2.node_id
            WHEN (f_2.node_type_name = 'TRADER'::text) THEN f_2.node_id
            WHEN (f_1.node_type_name = 'EXPORTER'::text) THEN f_1.node_id
            ELSE NULL::integer
        END AS exporter_node_id,
        CASE
            WHEN (f_6.node_type_name = 'IMPORTER'::text) THEN f_6.node_id
            WHEN (f_3.node_type_name = 'IMPORTER'::text) THEN f_3.node_id
            WHEN (f_2.node_type_name = 'IMPORTER'::text) THEN f_2.node_id
            ELSE NULL::integer
        END AS importer_node_id,
        CASE
            WHEN (f_7.node_type_name = 'COUNTRY'::text) THEN f_7.node_id
            WHEN (f_4.node_type_name = 'COUNTRY'::text) THEN f_4.node_id
            WHEN (f_3.node_type_name = 'COUNTRY'::text) THEN f_3.node_id
            ELSE NULL::integer
        END AS country_node_id,
    fi.attribute_type,
    fi.attribute_id,
    fi.name AS attribute_name,
    fi.name_with_unit AS attribute_name_with_unit,
    fi.display_name,
    string_agg(fi.text_value, ' / '::text) AS text_values,
    sum(fi.numeric_value) AS sum,
        CASE
            WHEN (fi.attribute_type = 'Qual'::text) THEN string_agg(fi.text_value, ' / '::text)
            ELSE (sum(fi.numeric_value))::text
        END AS total
   FROM ((((((((public.flow_paths_mv f_0
     JOIN public.flow_paths_mv f_1 ON (((f_1.flow_id = f_0.flow_id) AND (f_1.column_position = 1))))
     JOIN public.flow_paths_mv f_2 ON (((f_2.flow_id = f_0.flow_id) AND (f_2.column_position = 2))))
     JOIN public.flow_paths_mv f_3 ON (((f_3.flow_id = f_0.flow_id) AND (f_3.column_position = 3))))
     LEFT JOIN public.flow_paths_mv f_4 ON (((f_4.flow_id = f_0.flow_id) AND (f_4.column_position = 4))))
     LEFT JOIN public.flow_paths_mv f_5 ON (((f_5.flow_id = f_0.flow_id) AND (f_5.column_position = 5))))
     LEFT JOIN public.flow_paths_mv f_6 ON (((f_6.flow_id = f_0.flow_id) AND (f_6.column_position = 6))))
     LEFT JOIN public.flow_paths_mv f_7 ON (((f_7.flow_id = f_0.flow_id) AND (f_7.column_position = 7))))
     JOIN ( SELECT f.flow_id,
            f.qual_id AS attribute_id,
            'Qual'::text AS attribute_type,
            NULL::double precision AS numeric_value,
            f.value AS text_value,
            q.name,
            NULL::text AS unit,
            q.name AS name_with_unit,
            da.display_name,
            da.context_id
           FROM (((public.flow_quals f
             JOIN public.quals q ON ((f.qual_id = q.id)))
             JOIN public.download_quals dq ON ((dq.qual_id = q.id)))
             JOIN public.download_attributes da ON ((dq.download_attribute_id = da.id)))
          GROUP BY f.flow_id, f.qual_id, f.value, q.name, da.display_name, da.context_id
        UNION ALL
         SELECT f.flow_id,
            f.quant_id,
            'Quant'::text AS text,
            f.value,
            NULL::text AS text,
            q.name,
            q.unit,
                CASE
                    WHEN (q.unit IS NULL) THEN q.name
                    ELSE (((q.name || ' ('::text) || q.unit) || ')'::text)
                END AS "case",
            da.display_name,
            da.context_id
           FROM (((public.flow_quants f
             JOIN public.quants q ON ((f.quant_id = q.id)))
             JOIN public.download_quants dq ON ((dq.quant_id = q.id)))
             JOIN public.download_attributes da ON ((dq.download_attribute_id = da.id)))
          GROUP BY f.flow_id, f.quant_id, f.value, q.name, q.unit, da.display_name, da.context_id) fi ON (((f_0.flow_id = fi.flow_id) AND (f_0.context_id = fi.context_id))))
  WHERE (f_0.column_position = 0)
  GROUP BY f_0.flow_id, f_0.context_id, f_0.year, f_0.name, f_0.node_id, f_1.name, f_1.node_id, f_1.node_type_name, f_2.name, f_2.node_id, f_2.node_type_name, f_3.name, f_3.node_id, f_3.node_type_name, f_4.name, f_4.node_id, f_4.node_type_name, f_5.name, f_5.node_id, f_5.node_type_name, f_6.name, f_6.node_id, f_6.node_type_name, f_7.name, f_7.node_id, f_7.node_type_name, fi.attribute_type, fi.attribute_id, fi.name, fi.name_with_unit, fi.display_name
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW download_flows_mv; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON MATERIALIZED VIEW public.download_flows_mv IS 'Combines data from flow_paths_mv and download_attributes_values_mv in a structure that can be directly used to generate data downloads.';


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
    a.aggregate_method,
    a.original_id AS original_attribute_id,
    mag.context_id
   FROM (((public.map_quants maq
     JOIN public.map_attributes ma ON ((ma.id = maq.map_attribute_id)))
     JOIN public.map_attribute_groups mag ON ((mag.id = ma.map_attribute_group_id)))
     JOIN public.attributes_mv a ON (((a.original_id = maq.quant_id) AND (a.original_type = 'Quant'::text))))
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
    a.aggregate_method,
    a.original_id AS original_attribute_id,
    mag.context_id
   FROM (((public.map_inds mai
     JOIN public.map_attributes ma ON ((ma.id = mai.map_attribute_id)))
     JOIN public.map_attribute_groups mag ON ((mag.id = ma.map_attribute_group_id)))
     JOIN public.attributes_mv a ON (((a.original_id = mai.ind_id) AND (a.original_type = 'Ind'::text))))
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW map_attributes_mv; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON MATERIALIZED VIEW public.map_attributes_mv IS 'Materialized view which merges map_inds and map_quants with map_attributes.';


--
-- Name: COLUMN map_attributes_mv.attribute_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.map_attributes_mv.attribute_id IS 'References the unique id in attributes_mv.';


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
-- Name: COLUMN map_attributes_mv.aggregate_method; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.map_attributes_mv.aggregate_method IS 'The method used to aggregate the data';


--
-- Name: COLUMN map_attributes_mv.original_attribute_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.map_attributes_mv.original_attribute_id IS 'The attribute''s original id';


--
-- Name: COLUMN map_attributes_mv.context_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.map_attributes_mv.context_id IS 'References the context';


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
    CONSTRAINT profiles_name_check CHECK ((name = ANY (ARRAY['actor'::text, 'place'::text])))
);


--
-- Name: TABLE profiles; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.profiles IS 'Context-specific profiles';


--
-- Name: COLUMN profiles.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.name IS 'Profile name, either actor or place. One of restricted set of values.';


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
-- Name: nodes_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.nodes_mv AS
 SELECT nodes.id,
    nodes.main_id,
    nodes.name,
    node_types.name AS node_type,
    nodes_with_flows.context_id,
    profiles.name AS profile,
    context_properties.is_subnational
   FROM ((((((public.nodes
     JOIN ( SELECT DISTINCT unnest(flows.path) AS node_id,
            flows.context_id
           FROM public.flows) nodes_with_flows ON ((nodes.id = nodes_with_flows.node_id)))
     JOIN public.node_types ON ((node_types.id = nodes.node_type_id)))
     JOIN public.node_properties ON ((nodes.id = node_properties.node_id)))
     JOIN public.context_node_types ON (((context_node_types.node_type_id = node_types.id) AND (context_node_types.context_id = nodes_with_flows.context_id))))
     LEFT JOIN public.profiles ON ((profiles.context_node_type_id = context_node_types.id)))
     LEFT JOIN public.context_properties ON ((context_node_types.context_id = context_properties.context_id)))
  WHERE ((nodes.is_unknown = false) AND (node_properties.is_domestic_consumption = false) AND (nodes.name !~~* 'OTHER'::text))
  WITH NO DATA;


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
    updated_at timestamp without time zone NOT NULL
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
     JOIN public.attributes_mv a ON (((a.original_id = raq.quant_id) AND (a.original_type = 'Quant'::text))))
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW resize_by_attributes_mv; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON MATERIALIZED VIEW public.resize_by_attributes_mv IS 'Materialized view which merges resize_by_quants with resize_by_attributes.';


--
-- Name: COLUMN resize_by_attributes_mv.attribute_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.resize_by_attributes_mv.attribute_id IS 'References the unique id in attributes_mv.';


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
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


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
     JOIN public.attributes_mv a ON (((a.original_id = rai.ind_id) AND (a.original_type = 'Ind'::text))))
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
     JOIN public.attributes_mv a ON (((a.original_id = raq.qual_id) AND (a.original_type = 'Qual'::text))))
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

COMMENT ON COLUMN public.recolor_by_attributes_mv.attribute_id IS 'References the unique id in attributes_mv.';


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
-- Name: recolor_by_attributes recolor_by_attributes_context_id_group_number_position_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recolor_by_attributes
    ADD CONSTRAINT recolor_by_attributes_context_id_group_number_position_key UNIQUE (context_id, group_number, "position");


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
-- Name: resize_by_attributes resize_by_attributes_context_id_group_number_position_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resize_by_attributes
    ADD CONSTRAINT resize_by_attributes_context_id_group_number_position_key UNIQUE (context_id, group_number, "position");


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
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: idx_ckeditor_assetable; Type: INDEX; Schema: content; Owner: -
--

CREATE INDEX idx_ckeditor_assetable ON content.ckeditor_assets USING btree (assetable_type, assetable_id);


--
-- Name: idx_ckeditor_assetable_type; Type: INDEX; Schema: content; Owner: -
--

CREATE INDEX idx_ckeditor_assetable_type ON content.ckeditor_assets USING btree (assetable_type, type, assetable_id);


--
-- Name: index_staff_members_on_staff_group_id; Type: INDEX; Schema: content; Owner: -
--

CREATE INDEX index_staff_members_on_staff_group_id ON content.staff_members USING btree (staff_group_id);


--
-- Name: index_users_on_email; Type: INDEX; Schema: content; Owner: -
--

CREATE UNIQUE INDEX index_users_on_email ON content.users USING btree (email);


--
-- Name: index_users_on_reset_password_token; Type: INDEX; Schema: content; Owner: -
--

CREATE UNIQUE INDEX index_users_on_reset_password_token ON content.users USING btree (reset_password_token);


--
-- Name: attributes_mv_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX attributes_mv_name_idx ON public.attributes_mv USING btree (name);


--
-- Name: chart_attributes_chart_id_position_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX chart_attributes_chart_id_position_key ON public.chart_attributes USING btree (chart_id, "position") WHERE (identifier IS NULL);


--
-- Name: chart_attributes_mv_chart_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chart_attributes_mv_chart_id_idx ON public.chart_attributes_mv USING btree (chart_id);


--
-- Name: chart_attributes_mv_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX chart_attributes_mv_id_idx ON public.chart_attributes_mv USING btree (id);


--
-- Name: context_node_types_mv_context_id_node_type_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX context_node_types_mv_context_id_node_type_id_idx ON public.context_node_types_mv USING btree (context_id, node_type_id);


--
-- Name: dashboards_attributes_mv_group_id_attribute_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_attributes_mv_group_id_attribute_id_idx ON public.dashboards_attributes_mv USING btree (dashboards_attribute_group_id, attribute_id);


--
-- Name: dashboards_attributes_mv_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX dashboards_attributes_mv_id_idx ON public.dashboards_attributes_mv USING btree (id);


--
-- Name: dashboards_commodities_mv_country_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_commodities_mv_country_id_idx ON public.dashboards_commodities_mv USING btree (country_id);


--
-- Name: dashboards_commodities_mv_group_columns_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_commodities_mv_group_columns_idx ON public.dashboards_commodities_mv USING btree (id, name);


--
-- Name: dashboards_commodities_mv_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_commodities_mv_name_idx ON public.dashboards_commodities_mv USING btree (name);


--
-- Name: dashboards_commodities_mv_name_tsvector_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_commodities_mv_name_tsvector_idx ON public.dashboards_commodities_mv USING gin (name_tsvector);


--
-- Name: dashboards_commodities_mv_node_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_commodities_mv_node_id_idx ON public.dashboards_commodities_mv USING btree (node_id);


--
-- Name: dashboards_commodities_mv_unique_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX dashboards_commodities_mv_unique_idx ON public.dashboards_commodities_mv USING btree (id, node_id, country_id);


--
-- Name: dashboards_companies_mv_commodity_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_companies_mv_commodity_id_idx ON public.dashboards_companies_mv USING btree (commodity_id);


--
-- Name: dashboards_companies_mv_country_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_companies_mv_country_id_idx ON public.dashboards_companies_mv USING btree (country_id);


--
-- Name: dashboards_companies_mv_group_columns_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_companies_mv_group_columns_idx ON public.dashboards_companies_mv USING btree (id, name, node_type);


--
-- Name: dashboards_companies_mv_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_companies_mv_name_idx ON public.dashboards_companies_mv USING btree (name);


--
-- Name: dashboards_companies_mv_name_tsvector_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_companies_mv_name_tsvector_idx ON public.dashboards_companies_mv USING gin (name_tsvector);


--
-- Name: dashboards_companies_mv_node_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_companies_mv_node_id_idx ON public.dashboards_companies_mv USING btree (node_id);


--
-- Name: dashboards_companies_mv_node_type_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_companies_mv_node_type_id_idx ON public.dashboards_companies_mv USING btree (node_type_id);


--
-- Name: dashboards_companies_mv_unique_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX dashboards_companies_mv_unique_idx ON public.dashboards_companies_mv USING btree (id, node_id, country_id, commodity_id);


--
-- Name: dashboards_countries_mv_commodity_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_countries_mv_commodity_id_idx ON public.dashboards_countries_mv USING btree (commodity_id);


--
-- Name: dashboards_countries_mv_group_columns_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_countries_mv_group_columns_idx ON public.dashboards_countries_mv USING btree (id, name);


--
-- Name: dashboards_countries_mv_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_countries_mv_name_idx ON public.dashboards_countries_mv USING btree (name);


--
-- Name: dashboards_countries_mv_name_tsvector_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_countries_mv_name_tsvector_idx ON public.dashboards_countries_mv USING gin (name_tsvector);


--
-- Name: dashboards_countries_mv_node_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_countries_mv_node_id_idx ON public.dashboards_countries_mv USING btree (node_id);


--
-- Name: dashboards_countries_mv_unique_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX dashboards_countries_mv_unique_idx ON public.dashboards_countries_mv USING btree (id, node_id, commodity_id);


--
-- Name: dashboards_destinations_mv_commodity_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_destinations_mv_commodity_id_idx ON public.dashboards_destinations_mv USING btree (commodity_id);


--
-- Name: dashboards_destinations_mv_country_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_destinations_mv_country_id_idx ON public.dashboards_destinations_mv USING btree (country_id);


--
-- Name: dashboards_destinations_mv_group_columns_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_destinations_mv_group_columns_idx ON public.dashboards_destinations_mv USING btree (id, name, node_type);


--
-- Name: dashboards_destinations_mv_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_destinations_mv_name_idx ON public.dashboards_destinations_mv USING btree (name);


--
-- Name: dashboards_destinations_mv_name_tsvector_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_destinations_mv_name_tsvector_idx ON public.dashboards_destinations_mv USING gin (name_tsvector);


--
-- Name: dashboards_destinations_mv_node_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_destinations_mv_node_id_idx ON public.dashboards_destinations_mv USING btree (node_id);


--
-- Name: dashboards_destinations_mv_node_type_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_destinations_mv_node_type_id_idx ON public.dashboards_destinations_mv USING btree (node_type_id);


--
-- Name: dashboards_destinations_mv_unique_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX dashboards_destinations_mv_unique_idx ON public.dashboards_destinations_mv USING btree (id, node_id, country_id, commodity_id);


--
-- Name: dashboards_flow_paths_mv_category_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_flow_paths_mv_category_idx ON public.dashboards_flow_paths_mv USING btree (category);


--
-- Name: dashboards_flow_paths_mv_flow_id_node_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX dashboards_flow_paths_mv_flow_id_node_id_idx ON public.dashboards_flow_paths_mv USING btree (flow_id, node_id);


--
-- Name: dashboards_sources_mv_commodity_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_sources_mv_commodity_id_idx ON public.dashboards_sources_mv USING btree (commodity_id);


--
-- Name: dashboards_sources_mv_country_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_sources_mv_country_id_idx ON public.dashboards_sources_mv USING btree (country_id);


--
-- Name: dashboards_sources_mv_group_columns_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_sources_mv_group_columns_idx ON public.dashboards_sources_mv USING btree (id, name, node_type, parent_name, parent_node_type);


--
-- Name: dashboards_sources_mv_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_sources_mv_name_idx ON public.dashboards_sources_mv USING btree (name);


--
-- Name: dashboards_sources_mv_name_tsvector_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_sources_mv_name_tsvector_idx ON public.dashboards_sources_mv USING gin (name_tsvector);


--
-- Name: dashboards_sources_mv_node_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_sources_mv_node_id_idx ON public.dashboards_sources_mv USING btree (node_id);


--
-- Name: dashboards_sources_mv_node_type_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboards_sources_mv_node_type_id_idx ON public.dashboards_sources_mv USING btree (node_type_id);


--
-- Name: dashboards_sources_unique_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX dashboards_sources_unique_idx ON public.dashboards_sources_mv USING btree (id, node_id, country_id, commodity_id);


--
-- Name: download_attributes_mv_context_id_attribute_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX download_attributes_mv_context_id_attribute_id_idx ON public.download_attributes_mv USING btree (context_id, attribute_id);


--
-- Name: download_attributes_mv_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX download_attributes_mv_id_idx ON public.download_attributes_mv USING btree (id);


--
-- Name: download_flows_mv_attribute_type_attribute_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX download_flows_mv_attribute_type_attribute_id_id_idx ON public.download_flows_mv USING btree (attribute_type, attribute_id, id);


--
-- Name: download_flows_mv_context_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX download_flows_mv_context_id_idx ON public.download_flows_mv USING btree (context_id);


--
-- Name: download_flows_mv_country_node_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX download_flows_mv_country_node_id_idx ON public.download_flows_mv USING btree (country_node_id);


--
-- Name: download_flows_mv_exporter_node_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX download_flows_mv_exporter_node_id_idx ON public.download_flows_mv USING btree (exporter_node_id);


--
-- Name: download_flows_mv_importer_node_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX download_flows_mv_importer_node_id_idx ON public.download_flows_mv USING btree (importer_node_id);


--
-- Name: download_flows_mv_row_name_attribute_type_attribute_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX download_flows_mv_row_name_attribute_type_attribute_id_idx ON public.download_flows_mv USING btree (row_name, attribute_type, attribute_id);


--
-- Name: flow_inds_ind_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX flow_inds_ind_id_idx ON public.flow_inds USING btree (ind_id);


--
-- Name: flow_quals_qual_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX flow_quals_qual_id_idx ON public.flow_quals USING btree (qual_id);


--
-- Name: flow_quants_quant_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX flow_quants_quant_id_idx ON public.flow_quants USING btree (quant_id);


--
-- Name: index_attributes_mv_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_attributes_mv_id_idx ON public.attributes_mv USING btree (id);


--
-- Name: index_carto_layers_on_contextual_layer_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_carto_layers_on_contextual_layer_id ON public.carto_layers USING btree (contextual_layer_id);


--
-- Name: index_chart_attributes_on_chart_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_chart_attributes_on_chart_id ON public.chart_attributes USING btree (chart_id);


--
-- Name: index_chart_inds_on_chart_attribute_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_chart_inds_on_chart_attribute_id ON public.chart_inds USING btree (chart_attribute_id);


--
-- Name: index_chart_inds_on_ind_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_chart_inds_on_ind_id ON public.chart_inds USING btree (ind_id);


--
-- Name: index_chart_quals_on_chart_attribute_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_chart_quals_on_chart_attribute_id ON public.chart_quals USING btree (chart_attribute_id);


--
-- Name: index_chart_quals_on_qual_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_chart_quals_on_qual_id ON public.chart_quals USING btree (qual_id);


--
-- Name: index_chart_quants_on_chart_attribute_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_chart_quants_on_chart_attribute_id ON public.chart_quants USING btree (chart_attribute_id);


--
-- Name: index_chart_quants_on_quant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_chart_quants_on_quant_id ON public.chart_quants USING btree (quant_id);


--
-- Name: index_charts_on_parent_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_charts_on_parent_id ON public.charts USING btree (parent_id);


--
-- Name: index_charts_on_profile_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_charts_on_profile_id ON public.charts USING btree (profile_id);


--
-- Name: index_commodity_attribute_properties_mv_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_commodity_attribute_properties_mv_id ON public.commodity_attribute_properties_mv USING btree (id, commodity_id, qual_id, quant_id, ind_id);


--
-- Name: index_context_attribute_properties_mv_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_context_attribute_properties_mv_id ON public.context_attribute_properties_mv USING btree (context_id, qual_id, quant_id, ind_id);


--
-- Name: index_context_node_type_properties_on_context_node_type_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_context_node_type_properties_on_context_node_type_id ON public.context_node_type_properties USING btree (context_node_type_id);


--
-- Name: index_context_node_types_on_context_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_context_node_types_on_context_id ON public.context_node_types USING btree (context_id);


--
-- Name: index_context_node_types_on_node_type_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_context_node_types_on_node_type_id ON public.context_node_types USING btree (node_type_id);


--
-- Name: index_context_properties_on_context_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_context_properties_on_context_id ON public.context_properties USING btree (context_id);


--
-- Name: index_contexts_on_commodity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_contexts_on_commodity_id ON public.contexts USING btree (commodity_id);


--
-- Name: index_contexts_on_country_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_contexts_on_country_id ON public.contexts USING btree (country_id);


--
-- Name: index_contextual_layers_on_context_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_contextual_layers_on_context_id ON public.contextual_layers USING btree (context_id);


--
-- Name: index_country_attribute_properties_mv_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_country_attribute_properties_mv_id ON public.country_attribute_properties_mv USING btree (id, country_id, qual_id, quant_id, ind_id);


--
-- Name: index_country_properties_on_country_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_country_properties_on_country_id ON public.country_properties USING btree (country_id);


--
-- Name: index_dashboards_attributes_on_dashboards_attribute_group_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_dashboards_attributes_on_dashboards_attribute_group_id ON public.dashboards_attributes USING btree (dashboards_attribute_group_id);


--
-- Name: index_dashboards_inds_on_dashboards_attribute_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_dashboards_inds_on_dashboards_attribute_id ON public.dashboards_inds USING btree (dashboards_attribute_id);


--
-- Name: index_dashboards_inds_on_ind_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_dashboards_inds_on_ind_id ON public.dashboards_inds USING btree (ind_id);


--
-- Name: index_dashboards_quals_on_dashboards_attribute_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_dashboards_quals_on_dashboards_attribute_id ON public.dashboards_quals USING btree (dashboards_attribute_id);


--
-- Name: index_dashboards_quals_on_qual_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_dashboards_quals_on_qual_id ON public.dashboards_quals USING btree (qual_id);


--
-- Name: index_dashboards_quants_on_dashboards_attribute_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_dashboards_quants_on_dashboards_attribute_id ON public.dashboards_quants USING btree (dashboards_attribute_id);


--
-- Name: index_dashboards_quants_on_quant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_dashboards_quants_on_quant_id ON public.dashboards_quants USING btree (quant_id);


--
-- Name: index_database_updates_on_status; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_database_updates_on_status ON public.database_updates USING btree (status) WHERE (status = 'STARTED'::text);


--
-- Name: index_download_attributes_on_context_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_download_attributes_on_context_id ON public.download_attributes USING btree (context_id);


--
-- Name: index_download_quals_on_download_attribute_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_download_quals_on_download_attribute_id ON public.download_quals USING btree (download_attribute_id);


--
-- Name: index_download_quals_on_qual_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_download_quals_on_qual_id ON public.download_quals USING btree (qual_id);


--
-- Name: index_download_quants_on_download_attribute_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_download_quants_on_download_attribute_id ON public.download_quants USING btree (download_attribute_id);


--
-- Name: index_download_quants_on_quant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_download_quants_on_quant_id ON public.download_quants USING btree (quant_id);


--
-- Name: index_download_versions_on_context_id_and_is_current; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_download_versions_on_context_id_and_is_current ON public.download_versions USING btree (context_id, is_current) WHERE (is_current IS TRUE);


--
-- Name: index_flow_inds_on_flow_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_flow_inds_on_flow_id ON public.flow_inds USING btree (flow_id);


--
-- Name: index_flow_paths_mv_on_flow_id_and_column_position; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_flow_paths_mv_on_flow_id_and_column_position ON public.flow_paths_mv USING btree (flow_id, column_position);


--
-- Name: index_flow_quals_on_flow_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_flow_quals_on_flow_id ON public.flow_quals USING btree (flow_id);


--
-- Name: index_flow_quants_on_flow_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_flow_quants_on_flow_id ON public.flow_quants USING btree (flow_id);


--
-- Name: index_flows_on_context_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_flows_on_context_id ON public.flows USING btree (context_id);


--
-- Name: index_flows_on_context_id_and_year; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_flows_on_context_id_and_year ON public.flows USING btree (context_id, year);


--
-- Name: index_flows_on_path; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_flows_on_path ON public.flows USING btree (path);


--
-- Name: index_ind_commodity_properties_on_commodity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ind_commodity_properties_on_commodity_id ON public.ind_commodity_properties USING btree (commodity_id);


--
-- Name: index_ind_commodity_properties_on_ind_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ind_commodity_properties_on_ind_id ON public.ind_commodity_properties USING btree (ind_id);


--
-- Name: index_ind_context_properties_on_context_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ind_context_properties_on_context_id ON public.ind_context_properties USING btree (context_id);


--
-- Name: index_ind_context_properties_on_ind_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ind_context_properties_on_ind_id ON public.ind_context_properties USING btree (ind_id);


--
-- Name: index_ind_country_properties_on_country_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ind_country_properties_on_country_id ON public.ind_country_properties USING btree (country_id);


--
-- Name: index_ind_country_properties_on_ind_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ind_country_properties_on_ind_id ON public.ind_country_properties USING btree (ind_id);


--
-- Name: index_ind_properties_on_ind_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ind_properties_on_ind_id ON public.ind_properties USING btree (ind_id);


--
-- Name: index_map_attribute_groups_on_context_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_map_attribute_groups_on_context_id ON public.map_attribute_groups USING btree (context_id);


--
-- Name: index_map_attributes_on_map_attribute_group_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_map_attributes_on_map_attribute_group_id ON public.map_attributes USING btree (map_attribute_group_id);


--
-- Name: index_map_inds_on_ind_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_map_inds_on_ind_id ON public.map_inds USING btree (ind_id);


--
-- Name: index_map_inds_on_map_attribute_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_map_inds_on_map_attribute_id ON public.map_inds USING btree (map_attribute_id);


--
-- Name: index_map_quants_on_map_attribute_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_map_quants_on_map_attribute_id ON public.map_quants USING btree (map_attribute_id);


--
-- Name: index_map_quants_on_quant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_map_quants_on_quant_id ON public.map_quants USING btree (quant_id);


--
-- Name: index_node_inds_on_node_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_node_inds_on_node_id ON public.node_inds USING btree (node_id);


--
-- Name: index_node_properties_on_node_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_node_properties_on_node_id ON public.node_properties USING btree (node_id);


--
-- Name: index_node_quals_on_node_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_node_quals_on_node_id ON public.node_quals USING btree (node_id);


--
-- Name: index_node_quants_on_node_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_node_quants_on_node_id ON public.node_quants USING btree (node_id);


--
-- Name: index_profiles_on_context_node_type_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_profiles_on_context_node_type_id ON public.profiles USING btree (context_node_type_id);


--
-- Name: index_qual_commodity_properties_on_commodity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_qual_commodity_properties_on_commodity_id ON public.qual_commodity_properties USING btree (commodity_id);


--
-- Name: index_qual_commodity_properties_on_qual_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_qual_commodity_properties_on_qual_id ON public.qual_commodity_properties USING btree (qual_id);


--
-- Name: index_qual_context_properties_on_context_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_qual_context_properties_on_context_id ON public.qual_context_properties USING btree (context_id);


--
-- Name: index_qual_context_properties_on_qual_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_qual_context_properties_on_qual_id ON public.qual_context_properties USING btree (qual_id);


--
-- Name: index_qual_country_properties_on_country_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_qual_country_properties_on_country_id ON public.qual_country_properties USING btree (country_id);


--
-- Name: index_qual_country_properties_on_qual_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_qual_country_properties_on_qual_id ON public.qual_country_properties USING btree (qual_id);


--
-- Name: index_qual_properties_on_qual_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_qual_properties_on_qual_id ON public.qual_properties USING btree (qual_id);


--
-- Name: index_quant_commodity_properties_on_commodity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_quant_commodity_properties_on_commodity_id ON public.quant_commodity_properties USING btree (commodity_id);


--
-- Name: index_quant_commodity_properties_on_quant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_quant_commodity_properties_on_quant_id ON public.quant_commodity_properties USING btree (quant_id);


--
-- Name: index_quant_context_properties_on_context_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_quant_context_properties_on_context_id ON public.quant_context_properties USING btree (context_id);


--
-- Name: index_quant_context_properties_on_quant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_quant_context_properties_on_quant_id ON public.quant_context_properties USING btree (quant_id);


--
-- Name: index_quant_country_properties_on_country_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_quant_country_properties_on_country_id ON public.quant_country_properties USING btree (country_id);


--
-- Name: index_quant_country_properties_on_quant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_quant_country_properties_on_quant_id ON public.quant_country_properties USING btree (quant_id);


--
-- Name: index_quant_properties_on_quant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_quant_properties_on_quant_id ON public.quant_properties USING btree (quant_id);


--
-- Name: index_recolor_by_attributes_on_context_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_recolor_by_attributes_on_context_id ON public.recolor_by_attributes USING btree (context_id);


--
-- Name: index_recolor_by_inds_on_ind_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_recolor_by_inds_on_ind_id ON public.recolor_by_inds USING btree (ind_id);


--
-- Name: index_recolor_by_inds_on_recolor_by_attribute_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_recolor_by_inds_on_recolor_by_attribute_id ON public.recolor_by_inds USING btree (recolor_by_attribute_id);


--
-- Name: index_recolor_by_quals_on_qual_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_recolor_by_quals_on_qual_id ON public.recolor_by_quals USING btree (qual_id);


--
-- Name: index_recolor_by_quals_on_recolor_by_attribute_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_recolor_by_quals_on_recolor_by_attribute_id ON public.recolor_by_quals USING btree (recolor_by_attribute_id);


--
-- Name: index_resize_by_attributes_on_context_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_resize_by_attributes_on_context_id ON public.resize_by_attributes USING btree (context_id);


--
-- Name: index_resize_by_quants_on_quant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_resize_by_quants_on_quant_id ON public.resize_by_quants USING btree (quant_id);


--
-- Name: index_resize_by_quants_on_resize_by_attribute_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_resize_by_quants_on_resize_by_attribute_id ON public.resize_by_quants USING btree (resize_by_attribute_id);


--
-- Name: map_attributes_mv_context_id_is_disabled_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX map_attributes_mv_context_id_is_disabled_idx ON public.map_attributes_mv USING btree (context_id, is_disabled) WHERE (is_disabled IS FALSE);


--
-- Name: map_attributes_mv_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX map_attributes_mv_id_idx ON public.map_attributes_mv USING btree (id);


--
-- Name: map_attributes_mv_map_attribute_group_id_attribute_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX map_attributes_mv_map_attribute_group_id_attribute_id_idx ON public.map_attributes_mv USING btree (map_attribute_group_id, attribute_id);


--
-- Name: map_attributes_mv_original_attribute_id_attribute_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX map_attributes_mv_original_attribute_id_attribute_type_idx ON public.map_attributes_mv USING btree (original_attribute_id, attribute_type);


--
-- Name: node_inds_ind_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX node_inds_ind_id_idx ON public.node_inds USING btree (ind_id);


--
-- Name: node_quals_qual_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX node_quals_qual_id_idx ON public.node_quals USING btree (qual_id);


--
-- Name: node_quants_quant_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX node_quants_quant_id_idx ON public.node_quants USING btree (quant_id);


--
-- Name: nodes_mv_context_id_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX nodes_mv_context_id_id_idx ON public.nodes_mv USING btree (context_id, id);


--
-- Name: nodes_mv_context_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX nodes_mv_context_id_idx ON public.nodes_mv USING btree (context_id);


--
-- Name: nodes_mv_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX nodes_mv_name_idx ON public.nodes_mv USING gin (to_tsvector('simple'::regconfig, COALESCE(name, ''::text)));


--
-- Name: nodes_node_type_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX nodes_node_type_id_idx ON public.nodes USING btree (node_type_id);


--
-- Name: recolor_by_attributes_mv_context_id_attribute_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX recolor_by_attributes_mv_context_id_attribute_id ON public.recolor_by_attributes_mv USING btree (context_id, attribute_id);


--
-- Name: recolor_by_attributes_mv_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX recolor_by_attributes_mv_id_idx ON public.recolor_by_attributes_mv USING btree (id);


--
-- Name: resize_by_attributes_mv_context_id_attribute_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX resize_by_attributes_mv_context_id_attribute_id_idx ON public.resize_by_attributes_mv USING btree (context_id, attribute_id);


--
-- Name: resize_by_attributes_mv_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX resize_by_attributes_mv_id_idx ON public.resize_by_attributes_mv USING btree (id);


--
-- Name: staff_members fk_rails_6ad8424ffc; Type: FK CONSTRAINT; Schema: content; Owner: -
--

ALTER TABLE ONLY content.staff_members
    ADD CONSTRAINT fk_rails_6ad8424ffc FOREIGN KEY (staff_group_id) REFERENCES content.staff_groups(id) ON UPDATE CASCADE ON DELETE CASCADE;


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
('20171115091532'),
('20171115144320'),
('20171116101949'),
('20171117115459'),
('20171117120322'),
('20171130103917'),
('20171212113051'),
('20171214162643'),
('20171219125633'),
('20180109085838'),
('20180110111533'),
('20180111085256'),
('20180111124938'),
('20180112112907'),
('20180116112807'),
('20180119094345'),
('20180123130300'),
('20180123132607'),
('20180126140843'),
('20180202093906'),
('20180205092759'),
('20180207133151'),
('20180207133331'),
('20180212120524'),
('20180221144544'),
('20180223141212'),
('20180226094007'),
('20180313091306'),
('20180320141501'),
('20180326095318'),
('20180326101002'),
('20180327111929'),
('20180403155328'),
('20180410065335'),
('20180412074237'),
('20180416125150'),
('20180522102950'),
('20180522135640'),
('20180808114630'),
('20180817125528'),
('20180817130807'),
('20180822093443'),
('20180827134927'),
('20180917124246'),
('20180921103012'),
('20180924112256'),
('20180924112257'),
('20180924112258'),
('20180924112259'),
('20180924112260'),
('20180924112261'),
('20180926084643'),
('20180928122607'),
('20181001105332'),
('20181002105509'),
('20181002105912'),
('20181003063720'),
('20181004075142'),
('20181005063834'),
('20181005063841'),
('20181005063849'),
('20181005063856'),
('20181005063909'),
('20181005064856'),
('20181008101006'),
('20181009102913'),
('20181011103455'),
('20181017053240'),
('20181019222226'),
('20181019232447'),
('20181116144800'),
('20181119104937'),
('20181119105000'),
('20181119105010'),
('20181119105022'),
('20181207143449'),
('20181210215622'),
('20190110094614'),
('20190110140539'),
('20190111121850'),
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
('20190321161913');

