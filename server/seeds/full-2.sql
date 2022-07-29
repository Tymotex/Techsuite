--
-- PostgreSQL database dump
--

-- Dumped from database version 14.3
-- Dumped by pg_dump version 14.3

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
1	Swen	Vincke	https://techsuite.dev/api/images/user_1_profile_1.jpg	https://techsuite.dev/api/images/user_1_profile_cover_1.jpg	My name is Swen Vincke. I'm the founder of Larian Studios, an independent game developer based in Gent, Belgium. Larian Studios has been around since 1997 and I've been running it ever since, so it's fair to say that Larian is a large part of my life and that I take whatever happens to it quite personal.	Gent, Belgium	Game Developer	Bachelor of GameDev
3	Astarion		https://techsuite.dev/api/images/user_3_profile_1.jpg	\N	Astarion prowled the night as a vampire spawn for centuries, serving a sadistic master until he was snatched away. Now he can walk in the light, but can he leave his wicked past behind?	Faerun	Arcane Trickster	
2	Shadow	Heart	https://techsuite.dev/api/images/user_2_profile_1.jpg	\N	One of Shar's dark disciples, Shadowheart was sent on a suicide mission to steal an item of great power. While wrestling with her faith and strange, untamed magic, Shadowheart has enemies on all sides - and a long-buried secret to uncover	Faerun	Cleric of Shar	
4	Gale		https://techsuite.dev/api/images/user_4_profile_1.jpg	\N	Gale has one ambition: to become the greatest wizard Faerûn has ever known. Yet his thirst for magic led to disaster. A Netherese Destruction Orb beats in his chest, counting down to an explosion that can level a city. Gale is confident he'll overcome it, but time is not on his side.	Faerun	Wizard	
7	Joshua	Fluke	https://techsuite.dev/api/images/user_7_profile_1.jpg	\N	React is love. React is life.		YouTuber	
8	Ben	Awad	https://techsuite.dev/api/images/user_8_profile_1.jpg	\N	Angular is love. Angular is life,		YouTuber	
9	\N	\N	https://techsuite.dev/api/images/user_9_profile_1.jpg	\N	\N	\N	Techsuite user	\N
10	Django		https://techsuite.dev/api/images/user_10_profile_1.jpg	\N			Software Engineer	
11	\N	\N	https://techsuite.dev/api/images/default.jpg	\N	\N	\N	Techsuite user	\N
12	\N	\N	https://techsuite.dev/api/images/user_12_profile_1.jpg	\N	\N	\N	Techsuite user	\N
6	Lex	Fridman	https://techsuite.dev/api/images/user_6_profile_1.jpg	https://techsuite.dev/api/images/user_6_profile_cover_1.jpg	I'm an AI researcher working on autonomous vehicles, human-robot interaction, and machine learning at MIT and beyond.	Massachusetts	Research Scientist	MIT
5	Coffee	Monster	http://localhost:5000/api/images/user_5_profile_1.jpg	http://localhost:5000/api/images/user_5_profile_cover_1.jpg	I love good coffee, however I am a terrible JavaScript developer.	Sydney	Software Engineer	Bachelor of Coffee Science
13	Edsger	Dijkstra	http://localhost:5000/api/images/user_13_profile_1.jpg	\N	A Dutch computer scientist, programmer, software engineer, systems scientist, and science essayist. 	Amsterdam	Software Engineer	Bachelor of Computer Science @ University of Amsterdam
\.


--
-- Data for Name: channels; Type: TABLE DATA; Schema: public; Owner: tim
--

COPY public.channels (id, name, description, visibility, channel_img_url, channel_cover_img_url, time_created) FROM stdin;
1	Larian-Studios	Larian Studios is a Belgian video game developer and publisher founded in 1996 by Swen Vincke.	true	https://techsuite.dev/api/images/channel_1_profile_5.jpg	https://techsuite.dev/api/images/channel_1_profile_4.jpg	2020-12-06 10:29:16.668685
3	Deep-Learners	For neural network nerds and AI enthusiasts!	public	https://techsuite.dev/api/images/channel_3_profile_1.jpg	https://techsuite.dev/api/images/channel_3_profile_3.jpg	2020-12-06 10:51:37.43867
4	Fullstack-Devs	A discussion group for anything fullstack related. Anyone is welcome, apart from Angular developers	public	https://techsuite.dev/api/images/channel_4_profile_1.jpg	https://techsuite.dev/api/images/channel_4_profile_2.jpg	2020-12-06 10:58:34.654114
5	Coffee Lovers	Coffee is a brewed drink prepared from roasted coffee beans, the seeds of berries from certain flowering plants in the Coffea genus.	public	http://localhost:5000/api/images/channel_5_profile_14.jpg	http://localhost:5000/api/images/channel_5_profile_15.jpg	2022-07-29 16:24:42.097618
6	Algorithm Fanatics	For those that love everything about writing and designing performant algorithms.	public	http://localhost:5000/api/images/channel_6_profile_3.jpg	http://localhost:5000/api/images/channel_6_profile_2.jpg	2022-07-29 16:39:40.515333
\.


--
-- Data for Name: connections; Type: TABLE DATA; Schema: public; Owner: tim
--

COPY public.connections (id, user_id, other_user_id, approved, is_requester) FROM stdin;
5	11	9	f	t
6	9	11	f	f
7	11	1	f	t
8	1	11	f	f
9	12	11	f	t
10	11	12	f	f
1	11	6	t	t
2	6	11	t	f
3	11	7	t	t
4	7	11	t	f
11	11	10	t	t
12	10	11	t	f
13	11	8	t	t
14	8	11	t	f
15	13	11	f	t
16	11	13	f	f
\.


--
-- Data for Name: direct_messages; Type: TABLE DATA; Schema: public; Owner: tim
--

COPY public.direct_messages (id, sender_id, connection_id, message, time_created) FROM stdin;
1	7	3	How's it going Elon my man	2020-12-07 08:33:55.810822
2	6	1	Elon my man, how's Neuralink doing?	2020-12-07 08:38:31.357152
\.


--
-- Data for Name: member_of; Type: TABLE DATA; Schema: public; Owner: tim
--

COPY public.member_of (user_id, channel_id, is_owner) FROM stdin;
1	1	t
3	1	f
2	1	f
4	1	f
5	3	t
6	3	f
7	4	t
7	3	f
8	4	f
8	3	f
9	4	f
10	4	f
12	3	f
5	4	f
5	5	t
13	6	t
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: tim
--

COPY public.messages (id, channel_id, user_id, message, time_created) FROM stdin;
1	1	3	*Stares hungrily at Swen*	2020-12-06 10:39:18.952047
2	1	2	I disapprove	2020-12-06 10:42:13.466886
3	3	6	The singularity is coming	2020-12-06 10:54:31.892216
4	4	7	React is clearly the best frontend framework.	2020-12-06 11:00:20.697721
5	4	8	Peace was never an option.	2020-12-06 11:03:16.615322
6	3	8	How do you center a div	2020-12-06 11:05:50.464569
7	4	10	Flask is hot garbage. Not even a real backend framework	2020-12-07 08:20:55.465622
8	3	12	It's true, I'm the great-great-grandson of George Boole. Look it up	2020-12-07 08:31:48.939798
9	5	5	Coffee is darkly colored, bitter, slightly acidic and has a stimulating effect in humans, primarily due to its caffeine content.	2022-07-29 16:25:16.279248
10	5	5	"Never trust anyone who doesn't drink coffee."	2022-07-29 16:28:48.625228
\.


--
-- Data for Name: techsuite_users; Type: TABLE DATA; Schema: public; Owner: tim
--

COPY public.techsuite_users (id, email, password, permission_id, username, bio_id, time_created) FROM stdin;
3	astarion@gmail.com	2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892	1	astarion	3	2020-12-06 10:33:12.900184
2	shadowheart@gmail.com	2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892	1	shadowheart	2	2020-12-06 10:32:09.756358
4	gale@gmail.com	2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892	1	gale	4	2020-12-06 10:43:16.53616
7	reactinator@gmail.com	2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892	1	reactinator	7	2020-12-06 10:57:53.722251
8	angulardev@gmail.com	2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892	1	angulardev	8	2020-12-06 11:02:45.272278
9	expressnix@gmail.com	2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892	1	expressnix	9	2020-12-06 22:28:44.365878
10	djangoman@gmail.com	2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892	1	djangoman	10	2020-12-07 08:18:04.664646
11	elon@gmail.com	2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892	1	ElongatedMuskrat	11	2020-12-07 08:25:15.982518
12	geoffhinton@gmail.com	2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892	1	geoffhinton	12	2020-12-07 08:28:58.292885
1	swenny@gmail.com	2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892	1	Swen Vincke	1	2020-12-06 10:24:31.983611
6	lexfridman@gmail.com	2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892	1	LexFridman	6	2020-12-06 10:52:01.262865
5	coffeemonster@gmail.com	2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892	1	CoffeeMonster	5	2020-12-06 10:48:46.137876
13	dijkstra@gmail.com	2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892	1	Dijkstra	13	2022-07-29 16:30:21.049904
\.


--
-- Name: bios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tim
--

SELECT pg_catalog.setval('public.bios_id_seq', 13, true);


--
-- Name: channels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tim
--

SELECT pg_catalog.setval('public.channels_id_seq', 6, true);


--
-- Name: connections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tim
--

SELECT pg_catalog.setval('public.connections_id_seq', 16, true);


--
-- Name: direct_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tim
--

SELECT pg_catalog.setval('public.direct_messages_id_seq', 2, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tim
--

SELECT pg_catalog.setval('public.messages_id_seq', 10, true);


--
-- Name: techsuite_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tim
--

SELECT pg_catalog.setval('public.techsuite_users_id_seq', 13, true);


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

