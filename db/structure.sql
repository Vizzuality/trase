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
-- Name: inds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inds (
    id integer NOT NULL,
    name text NOT NULL,
    unit text,
    created_at timestamp without time zone NOT NULL
);


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
-- Name: quals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quals (
    id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp without time zone NOT NULL
);


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
-- Name: quants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quants (
    id integer NOT NULL,
    name text NOT NULL,
    unit text,
    created_at timestamp without time zone NOT NULL
);


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
    updated_at timestamp without time zone NOT NULL
);


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
    is_choropleth_disabled boolean DEFAULT false NOT NULL
);


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
    is_highlighted boolean DEFAULT false NOT NULL
);


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
-- Name: country_properties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.country_properties (
    id integer NOT NULL,
    country_id integer NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    zoom integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


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
-- Name: flows; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.flows (
    id integer NOT NULL,
    context_id integer NOT NULL,
    year smallint NOT NULL,
    path integer[] DEFAULT '{}'::integer[],
    created_at timestamp without time zone NOT NULL
);


--
-- Name: node_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.node_types (
    id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp without time zone NOT NULL
);


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
    bool_and(fi.boolean_value) AS bool_and,
    sum(fi.numeric_value) AS sum,
        CASE
            WHEN ((fi.attribute_type = 'Qual'::text) AND bool_and(fi.boolean_value)) THEN 'yes'::text
            WHEN ((fi.attribute_type = 'Qual'::text) AND (NOT bool_and(fi.boolean_value))) THEN 'no'::text
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
                CASE
                    WHEN (lower(f.value) = 'yes'::text) THEN true
                    WHEN (lower(f.value) = 'no'::text) THEN false
                    ELSE NULL::boolean
                END AS boolean_value,
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
            NULL::boolean AS bool,
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
    adm_1_name varchar,
    adm_1_topojson_path varchar,
    adm_1_topojson_root varchar,
    adm_2_name varchar,
    adm_2_topojson_path varchar,
    adm_2_topojson_root varchar,
    main_topojson_path varchar,
    main_topojson_root varchar,
    CONSTRAINT profiles_name_check CHECK ((name = ANY (ARRAY['actor'::text, 'place'::text])))
);


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
    context_properties.is_subnational AS is_subnational
 FROM (((((public.nodes
     JOIN ( SELECT DISTINCT unnest(flows.path) AS node_id,
            flows.context_id
           FROM public.flows) nodes_with_flows ON ((nodes.id = nodes_with_flows.node_id)))
     JOIN public.node_types ON ((node_types.id = nodes.node_type_id)))
     JOIN public.node_properties ON ((nodes.id = node_properties.node_id)))
     JOIN public.context_node_types ON (((context_node_types.node_type_id = node_types.id) AND (context_node_types.context_id = nodes_with_flows.context_id))))
     LEFT JOIN public.profiles ON ((profiles.context_node_type_id = context_node_types.id)))
     LEFT JOIN public.context_properties ON ((context_node_types.context_id = context_properties.context_id))
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
    a.id AS attribute_id
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
    a.id AS attribute_id
   FROM ((public.recolor_by_quals raq
     JOIN public.recolor_by_attributes ra ON ((ra.id = raq.recolor_by_attribute_id)))
     JOIN public.attributes_mv a ON (((a.original_id = raq.qual_id) AND (a.original_type = 'Qual'::text))))
  WITH NO DATA;


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
-- Name: qual_properties id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qual_properties ALTER COLUMN id SET DEFAULT nextval('public.qual_properties_id_seq'::regclass);


--
-- Name: quals id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quals ALTER COLUMN id SET DEFAULT nextval('public.quals_id_seq'::regclass);


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
-- Name: chart_attributes chart_attributes_chart_id_position_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chart_attributes
    ADD CONSTRAINT chart_attributes_chart_id_position_key UNIQUE (chart_id, "position");


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
-- Name: recolor_by_attributes recolor_by_attributes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recolor_by_attributes
    ADD CONSTRAINT recolor_by_attributes_pkey PRIMARY KEY (id);


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
-- Name: index_country_properties_on_country_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_country_properties_on_country_id ON public.country_properties USING btree (country_id);


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
-- Name: index_qual_properties_on_qual_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_qual_properties_on_qual_id ON public.qual_properties USING btree (qual_id);


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
-- Name: map_inds fk_rails_49db6b9c1f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_inds
    ADD CONSTRAINT fk_rails_49db6b9c1f FOREIGN KEY (ind_id) REFERENCES public.inds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: node_properties fk_rails_4dcde982df; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.node_properties
    ADD CONSTRAINT fk_rails_4dcde982df FOREIGN KEY (node_id) REFERENCES public.nodes(id) ON DELETE CASCADE;


--
-- Name: recolor_by_quals fk_rails_5294e7fccd; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recolor_by_quals
    ADD CONSTRAINT fk_rails_5294e7fccd FOREIGN KEY (recolor_by_attribute_id) REFERENCES public.recolor_by_attributes(id) ON DELETE CASCADE;


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
-- Name: charts fk_rails_805a6066ad; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.charts
    ADD CONSTRAINT fk_rails_805a6066ad FOREIGN KEY (parent_id) REFERENCES public.charts(id) ON DELETE CASCADE;


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
-- Name: node_quals fk_rails_962f283611; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.node_quals
    ADD CONSTRAINT fk_rails_962f283611 FOREIGN KEY (qual_id) REFERENCES public.quals(id) ON UPDATE CASCADE ON DELETE CASCADE;


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
('20180808114630');
