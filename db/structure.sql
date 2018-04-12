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
-- Name: staff_members fk_rails_6ad8424ffc; Type: FK CONSTRAINT; Schema: content; Owner: -
--

ALTER TABLE ONLY content.staff_members
    ADD CONSTRAINT fk_rails_6ad8424ffc FOREIGN KEY (staff_group_id) REFERENCES content.staff_groups(id) ON UPDATE CASCADE ON DELETE CASCADE;


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
('20180412074237');


