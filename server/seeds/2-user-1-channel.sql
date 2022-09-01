--
-- PostgreSQL database dump
--

-- Dumped from database version 12.5 (Ubuntu 12.5-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.5 (Ubuntu 12.5-0ubuntu0.20.04.1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bios; Type: TABLE; Schema: public; Owner: tim
--

CREATE TABLE public.bios (
    id integer NOT NULL,
    first_name character varying(50),
    last_name character varying(50),
    profile_img_url character varying(255),
    cover_img_url character varying(255),
    summary character varying(1000),
    location character varying(255),
    title character varying(50),
    education character varying(255)
);


ALTER TABLE public.bios OWNER TO tim;

--
-- Name: bios_id_seq; Type: SEQUENCE; Schema: public; Owner: tim
--

CREATE SEQUENCE public.bios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bios_id_seq OWNER TO tim;

--
-- Name: bios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tim
--

ALTER SEQUENCE public.bios_id_seq OWNED BY public.bios.id;


--
-- Name: channels; Type: TABLE; Schema: public; Owner: tim
--

CREATE TABLE public.channels (
    id integer NOT NULL,
    name character varying(30) NOT NULL,
    description character varying(1000),
    visibility character varying(30) NOT NULL,
    channel_img_url character varying(255),
    channel_cover_img_url character varying(255),
    time_created timestamp without time zone
);


ALTER TABLE public.channels OWNER TO tim;

--
-- Name: channels_id_seq; Type: SEQUENCE; Schema: public; Owner: tim
--

CREATE SEQUENCE public.channels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.channels_id_seq OWNER TO tim;

--
-- Name: channels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tim
--

ALTER SEQUENCE public.channels_id_seq OWNED BY public.channels.id;


--
-- Name: connections; Type: TABLE; Schema: public; Owner: tim
--

CREATE TABLE public.connections (
    id integer NOT NULL,
    user_id integer,
    other_user_id integer,
    approved boolean,
    is_requester boolean
);


ALTER TABLE public.connections OWNER TO tim;

--
-- Name: connections_id_seq; Type: SEQUENCE; Schema: public; Owner: tim
--

CREATE SEQUENCE public.connections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.connections_id_seq OWNER TO tim;

--
-- Name: connections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tim
--

ALTER SEQUENCE public.connections_id_seq OWNED BY public.connections.id;


--
-- Name: direct_messages; Type: TABLE; Schema: public; Owner: tim
--

CREATE TABLE public.direct_messages (
    id integer NOT NULL,
    sender_id integer NOT NULL,
    connection_id integer NOT NULL,
    message character varying(1000),
    time_created timestamp without time zone
);


ALTER TABLE public.direct_messages OWNER TO tim;

--
-- Name: direct_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: tim
--

CREATE SEQUENCE public.direct_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.direct_messages_id_seq OWNER TO tim;

--
-- Name: direct_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tim
--

ALTER SEQUENCE public.direct_messages_id_seq OWNED BY public.direct_messages.id;


--
-- Name: member_of; Type: TABLE; Schema: public; Owner: tim
--

CREATE TABLE public.member_of (
    user_id integer NOT NULL,
    channel_id integer NOT NULL,
    is_owner boolean
);


ALTER TABLE public.member_of OWNER TO tim;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: tim
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    channel_id integer NOT NULL,
    user_id integer NOT NULL,
    message character varying(1000),
    time_created timestamp without time zone
);


ALTER TABLE public.messages OWNER TO tim;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: tim
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.messages_id_seq OWNER TO tim;

--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tim
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: techsuite_users; Type: TABLE; Schema: public; Owner: tim
--

CREATE TABLE public.techsuite_users (
    id integer NOT NULL,
    email character varying(255),
    password character varying(255),
    permission_id integer,
    username character varying(50),
    bio_id integer NOT NULL,
    time_created timestamp without time zone
);


ALTER TABLE public.techsuite_users OWNER TO tim;

--
-- Name: techsuite_users_id_seq; Type: SEQUENCE; Schema: public; Owner: tim
--

CREATE SEQUENCE public.techsuite_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.techsuite_users_id_seq OWNER TO tim;

--
-- Name: techsuite_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tim
--

ALTER SEQUENCE public.techsuite_users_id_seq OWNED BY public.techsuite_users.id;


--
-- Name: bios id; Type: DEFAULT; Schema: public; Owner: tim
--

ALTER TABLE ONLY public.bios ALTER COLUMN id SET DEFAULT nextval('public.bios_id_seq'::regclass);


--
-- Name: channels id; Type: DEFAULT; Schema: public; Owner: tim
--

ALTER TABLE ONLY public.channels ALTER COLUMN id SET DEFAULT nextval('public.channels_id_seq'::regclass);


--
-- Name: connections id; Type: DEFAULT; Schema: public; Owner: tim
--

ALTER TABLE ONLY public.connections ALTER COLUMN id SET DEFAULT nextval('public.connections_id_seq'::regclass);


--
-- Name: direct_messages id; Type: DEFAULT; Schema: public; Owner: tim
--

ALTER TABLE ONLY public.direct_messages ALTER COLUMN id SET DEFAULT nextval('public.direct_messages_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: tim
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: techsuite_users id; Type: DEFAULT; Schema: public; Owner: tim
--

ALTER TABLE ONLY public.techsuite_users ALTER COLUMN id SET DEFAULT nextval('public.techsuite_users_id_seq'::regclass);


--
-- Data for Name: bios; Type: TABLE DATA; Schema: public; Owner: tim
--

COPY public.bios (id, first_name, last_name, profile_img_url, cover_img_url, summary, location, title, education) FROM stdin;
1	\N	\N	https://techsuite.timz.dev/api/images/default.jpg	\N	\N	\N	Techsuite user	\N
2	\N	\N	https://techsuite.timz.dev/api/images/default.jpg	\N	\N	\N	Techsuite user	\N
\.


--
-- Data for Name: channels; Type: TABLE DATA; Schema: public; Owner: tim
--

COPY public.channels (id, name, description, visibility, channel_img_url, channel_cover_img_url, time_created) FROM stdin;
1	Larian-Studios	Larian Studios is a Belgian video game developer and publisher founded in 1996 by Swen Vincke. It focuses on developing role-playing video games and has previously worked on educational games and a number of casino games.	public	https://techsuite.timz.dev/api/images/default_channel.jpg	\N	2020-12-05 12:22:52.932397
\.


--
-- Data for Name: connections; Type: TABLE DATA; Schema: public; Owner: tim
--

COPY public.connections (id, user_id, other_user_id, approved, is_requester) FROM stdin;
1	2	1	t	t
2	1	2	t	f
\.


--
-- Data for Name: direct_messages; Type: TABLE DATA; Schema: public; Owner: tim
--

COPY public.direct_messages (id, sender_id, connection_id, message, time_created) FROM stdin;
1	1	1	Hey there Tim	2020-12-05 12:25:06.544857
\.


--
-- Data for Name: member_of; Type: TABLE DATA; Schema: public; Owner: tim
--

COPY public.member_of (user_id, channel_id, is_owner) FROM stdin;
1	1	t
2	1	f
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: tim
--

COPY public.messages (id, channel_id, user_id, message, time_created) FROM stdin;
\.


--
-- Data for Name: techsuite_users; Type: TABLE DATA; Schema: public; Owner: tim
--

COPY public.techsuite_users (id, email, password, permission_id, username, bio_id, time_created) FROM stdin;
1	timzhang@gmail.com	2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892	1	Tymotex	1	2020-12-05 12:21:20.986262
2	timzhang3@gmail.com	2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892	1	Tim	2	2020-12-05 12:24:19.382899
\.


--
-- Name: bios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tim
--

SELECT pg_catalog.setval('public.bios_id_seq', 2, true);


--
-- Name: channels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tim
--

SELECT pg_catalog.setval('public.channels_id_seq', 1, true);


--
-- Name: connections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tim
--

SELECT pg_catalog.setval('public.connections_id_seq', 2, true);


--
-- Name: direct_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tim
--

SELECT pg_catalog.setval('public.direct_messages_id_seq', 1, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tim
--

SELECT pg_catalog.setval('public.messages_id_seq', 1, false);


--
-- Name: techsuite_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tim
--

SELECT pg_catalog.setval('public.techsuite_users_id_seq', 2, true);


--
-- Name: bios bios_pkey; Type: CONSTRAINT; Schema: public; Owner: tim
--

ALTER TABLE ONLY public.bios
    ADD CONSTRAINT bios_pkey PRIMARY KEY (id);


--
-- Name: channels channels_pkey; Type: CONSTRAINT; Schema: public; Owner: tim
--

ALTER TABLE ONLY public.channels
    ADD CONSTRAINT channels_pkey PRIMARY KEY (id);


--
-- Name: connections connections_pkey; Type: CONSTRAINT; Schema: public; Owner: tim
--

ALTER TABLE ONLY public.connections
    ADD CONSTRAINT connections_pkey PRIMARY KEY (id);


--
-- Name: direct_messages direct_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: tim
--

ALTER TABLE ONLY public.direct_messages
    ADD CONSTRAINT direct_messages_pkey PRIMARY KEY (id);


--
-- Name: member_of member_of_pkey; Type: CONSTRAINT; Schema: public; Owner: tim
--

ALTER TABLE ONLY public.member_of
    ADD CONSTRAINT member_of_pkey PRIMARY KEY (user_id, channel_id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: tim
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: techsuite_users techsuite_users_pkey; Type: CONSTRAINT; Schema: public; Owner: tim
--

ALTER TABLE ONLY public.techsuite_users
    ADD CONSTRAINT techsuite_users_pkey PRIMARY KEY (id);


--
-- Name: connections connections_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tim
--

ALTER TABLE ONLY public.connections
    ADD CONSTRAINT connections_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.techsuite_users(id);


--
-- Name: direct_messages direct_messages_connection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tim
--

ALTER TABLE ONLY public.direct_messages
    ADD CONSTRAINT direct_messages_connection_id_fkey FOREIGN KEY (connection_id) REFERENCES public.connections(id);


--
-- Name: direct_messages direct_messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tim
--

ALTER TABLE ONLY public.direct_messages
    ADD CONSTRAINT direct_messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.techsuite_users(id);


--
-- Name: member_of member_of_channel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tim
--

ALTER TABLE ONLY public.member_of
    ADD CONSTRAINT member_of_channel_id_fkey FOREIGN KEY (channel_id) REFERENCES public.channels(id);


--
-- Name: member_of member_of_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tim
--

ALTER TABLE ONLY public.member_of
    ADD CONSTRAINT member_of_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.techsuite_users(id);


--
-- Name: messages messages_channel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tim
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_channel_id_fkey FOREIGN KEY (channel_id) REFERENCES public.channels(id);


--
-- Name: messages messages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tim
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.techsuite_users(id);


--
-- Name: techsuite_users techsuite_users_bio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tim
--

ALTER TABLE ONLY public.techsuite_users
    ADD CONSTRAINT techsuite_users_bio_id_fkey FOREIGN KEY (bio_id) REFERENCES public.bios(id);


--
-- PostgreSQL database dump complete
--

