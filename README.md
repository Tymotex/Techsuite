# Techsuite

A collaboration and social networking application, built with React, Flask and PostgreSQL.  

[![Techsuite demo video](https://img.youtube.com/vi/C4o2fOCq2cI/0.jpg)](https://www.youtube.com/watch?v=C4o2fOCq2cI)

### Core Features
- **Channels**. These are groups that users can join and then send messages to each other in real time. Think of them like the text channels on Discord or Slack.
    - Each channel is customisable to be accessible to the public or invitation-only.
    - There is a basic authorisation system with ‘owners’ being able to set properties about the channel and manage its members, etc.
    - Each channel gets their own personalisable space with owners being able to set a picture and a cover wallpaper and utilise other admin functionalities.
- **Connections**. Very similar to LinkedIn and Facebook. When you sign up, you can view other people’s profiles and send them requests to connect. Once they become your contact, you’ll be able to directly exchange messages in real time.
- **Profiles**. Just like in Facebook, every user has their own personalisable space that’s viewable by other users on the platform. You can set your own bio, share what channels you’re a member of and set your own profile picture and cover wallpaper.
- **News**. You can explore through trending projects on GitHub and peruse the latest articles from Hacker News.

## Gallery
Some screenshots of Techsuite.

Landing page.

![Home Page](./images/techsuite-home-showcase.png)

Channels index page.

![Channels index Page](./images/techsuite-channel-showcase.png)

Channel page.

![Channel Page](./images/techsuite-channel-page-showcase.png)

Connections page.

![Connections Page](./images/techsuite-connections-showcase.png)

Messaging.

![Message Page](./images/techsuite-messaging-showcase.png)

Profile.

![Profile Page](./images/techsuite-profile-showcase.png)

News page.

![News Page](./images/techsuite-news-showcase.png)

<img src="./images/showcase.gif"></img>

## Setup Instructions (Ubuntu):
1. Get the repo: `git clone https://github.com/Tymotex/Techsuite.git`
2. `cd util/setup && sudo sh setup.py` 
3. [Set up the PostgreSQL database](#database-setup)
4. Install backend server dependencies:
    ```bash
        sudo apt-get install pkg-config
        sudo apt-get install libcairo2-dev
        sudo apt install libpq-dev python3-dev
        pip install -r server/requirements.txt
    ```
    Note: this project uses [psycopg2](https://www.psycopg.org/docs/) as the PostgreSQL database adapter. See [psycopg2 setup](#psycopg2-setup).
5. Install client dependencies: `npm install --prefix ./client`
6. Configure the environment variables in the `.env` file at `server/src/.env`: 
    1. Set the formatted database URI connection string: `DATABASE_URI="postgresql://username:password@localhost/techsuite"`. See [how to create a role](#database-setup)
    2. [Register for the Google+ API](https://developers.google.com/identity/sign-in/web/sign-in) and set the `GOOGLE_AUTH_API_CLIENT_ID` and `GOOGLE_AUTH_API_CLIENT_SECRET` fields.
    3. [Deprecated] For automated mailing in prodution, set SMTP fields for email services: `SMTP_HOST_ADDRESS`, `SMTP_PORT`, `SENDER_EMAIL_ADDRESS`, `SENDER_PASSWORD`. See how to get a Google app password <a href="https://support.google.com/accounts/answer/185833">here</a>.

Example `server/src/.env` file:
```shell
    SECRET_MESSAGE="baldurs-gate-3"
    PORT=5000
    DATABASE_URI="postgresql://<username>:<password>@localhost/techsuite"
    BASE_URI="https://techsuite.dev/api"
    GOOGLE_AUTH_API_CLIENT_ID="123asd.apps.googleusercontent.com"
    GOOGLE_AUTH_API_CLIENT_SECRET="ASDF1234"
    SMTP_HOST_ADDRESS="smtp.gmail.com"
    SMTP_PORT=587
    SENDER_EMAIL_ADDRESS="your@gmail.com"
    SENDER_PASSWORD="app password"
```

### Run Project (Development)
1. Run `./techsuite` inside the `server` directory
2. Run `yarn start` inside the `client` directory

Note: follow the comment instructions inside `client/src/constants/api-routes.js` for configuring routes. 

### Run Project (Production)
1. Run `./techsuite` inside the `server` directory
2. Run `yarn build` inside the `client` directory. The output is written into the `client/build` directory.
    To quickly serve the production files for viewing, run `npx serve -s build` inside `client`.

#### Server Configuration
This project uses Nginx as a reverse proxy server. [This is an example configuration file](https://gist.github.com/Tymotex/f23a746727a26eff3c96132ce56d0038) used for deployment on a VPS.

#### Deployment Resources:
Some deployment resources that helped set up NGINX on a Linux cloud VM, DNS
configuration and HTTPS.
- Ubuntu 20.04 VPS [initial setup guide](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-20-04).
- Nginx installation, firewall configuration and daemon usage [guide](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04).
- Obtaining a free TLS/SSL certificate using Certbot (Let's Encrypt) for Nginx [guide](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-18-04).

<a name="database-setup">

## Database Setup

Instructions for installing PostgreSQL, interfacing with the Techsuite database instance and hooking up Flask-SQLAlchemy.

1. Install PostgreSQL
    ```
    $ sudo apt update
    $ sudo apt install postgresql postgresql-contrib
    ```
2. Enable and start the `postgresql` service.
    ```
    sudo systemctl enable postgresql.service
    sudo systemctl start postgresql.service
    ```
3. Create a new role
    ```
    $ sudo -u postgres createuser --interactive --pwprompt
    Enter name of role to add: me
    Enter password for new role: 
    Enter it again: 
    Shall the new role be a superuser? (y/n) y
    ```
4. Create a new database instance with 
    ```
    sudo -u postgres createdb techsuite
    ```
5. Enter the ```psql``` interactive shell and grant privileges to the new role
    ```
    $ sudo -u postgres psql
    psql=# GRANT ALL PRIVILEGES ON DATABASE techsuite TO me;
    ```
6. Adjust the database URI string in ```server/src/.env```. The format is: 
    ```
    DATABASE_URI="postgresql://<name>:<password>@<host>/<dbname>"
    ```
    For example, 
    ```
    DATABASE_URI="postgresql://me:1984@localhost/techsuite"
    ```
7. Run `./techsuite --reset` to create the database instance and run the Flask server

<a name="psycopg2 setup">

### Installing Psycopg2 on Debian/Ubuntu
Psycopg2 is a necessary library for Flask-SQLAlchemy to work.
1. `sudo apt install libpq-dev python3-dev`
2. `pip3 install psycopg2`

> SQLAlchemy is a ORM, psycopg2 is a database driver. These are completely different things: SQLAlchemy generates SQL statements and psycopg2 sends SQL statements to the database. SQLAlchemy depends on psycopg2 or other database drivers to communicate with the database. [Source](https://stackoverflow.com/questions/8588126/sqlalchemy-or-psycopg2)

## Development Notes

Some notes to supplement development.

#### Seeding Data
There are `*.sql` files inside `server/seeds` which can be executed to populate
the database instance with pre-existing data.

To execute a seed file with a `psql` CLI command:
```bash
psql -U <db_user> -d techsuite -f <seed-file-path>
```

Alternatively, launch a `psql` shell with `psql -U <db_user> -d techsuite`, then
run the command `\i <seed-file-path>` to execute the SQL commands in that file.

These seeds should be run on an empty database instance. To drop all tables,
run `DROP TABLE bios, channels, connections, direct_messages, member_of, messages, techsuite_users CASCADE;`
in the `psql` shell.

To produce new seed files, use the `pg_dump` CLI: `pg_dump techsuite -U <db_user>`.
