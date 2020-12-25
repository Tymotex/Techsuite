# Techsuite
A collaboration and social networking application, built with React, Flask and PostgreSQL.  

<table>
    <tr>
        <td width="50%">            
            <img src="./images/techsuite-channel-showcase.png"></img>
        </td>
        <td>
            <img src="./images/techsuite-message-showcase.png"></img>
        </td>
    <tr>
    <tr>
        <td width="50%">            
            <img src="./images/techsuite-news-showcase.png"></img>
        </td>
        <td>
            <img src="./images/techsuite-home-showcase.png"></img>
        </td>
    <tr>
</table>


## Features:
- Standalone authentication system and support for one-click Google sign-in and registration
- User profile personalisation with profile image/cover uploading and bio customisation 
- Friendship management system for social networking
- Realtime private messaging with connected Techsuite peers
- Channels with realtime messaging which can support multiple concurrent users
- Channel operations, personalisation and configuration. Eg. image/cover uploading, authorisation levels, membership management and private channels
- View and search for GitHub's most popular and trendy software projects
- View articles sourced from HackerNews based on what's most hot/popular/recent
- Persistent dark mode toggle, responsive and animated UI

#### Planned Features:
- Connection recommendation system and users browsing page
- Entertainment page hooked up to IGDB plus and embedded persistent audio player
- Automated email notification services

# Setup Instructions:
1. `git clone https://github.com/Tymotex/Techsuite.git`
2. `cd util/setup && sudo sh setup.py` 
3. `pip3 install -r server/requirements.txt` and [set up the database](#database-setup)
4. `npm install --prefix ./client`
5. Configure the `.env` file inside `server/src`: 
    1. Set the formatted database URI connection string: `DATABASE_URI="postgresql://username:password@localhost/techsuite"`. See [how to create a role](#database-setup)

### For Development:
1. Run `./techsuite` inside the `Techsuite/server` directory
2. Run `npm start` inside the `Techsuite/client` directory

### For Production:
1. Run `./techsuite` inside the `Techsuite/server` directory
2. Run `npm run build` inside the `Techsuite/client` directory. The output is written into the `Techsuite/client/build` directory

### Server Configuration:
This project uses Nginx as a reverse proxy server. [This is an example configuration file](https://gist.github.com/Tymotex/f23a746727a26eff3c96132ce56d0038) used for deployment on a VPS.

#### Deployment Resources:

- Ubuntu 20.04 VPS [initial setup guide](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-20-04)

- Nginx installation, firewall configuration and daemon usage [guide](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04)

- Obtaining a free TLS/SSL certificate using Certbot (Let's Encrypt) for Nginx [guide](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-18-04)

<a name="database-setup">

# Database Setup:
Instructions for installing PostgreSQL, interfacing with the Techsuite database instance and hooking up Flask-SQLAlchemy.
1. Install PostgreSQL
    ```
    $ sudo apt update
    $ sudo apt install postgresql postgresql-contrib
    ```
2. Create a new role
    ```
    $ sudo -u postgres createuser --interactive --pwprompt
    Enter name of role to add: me
    Enter password for new role: 
    Enter it again: 
    Shall the new role be a superuser? (y/n) y
    ```
3. Create a new database instance with 
    ```
    sudo -u postgres createdb techsuite
    ```
4. Enter the ```psql``` interactive shell and grant privileges to the new role
    ```
    $ sudo -u postgres psql
    psql=# GRANT ALL PRIVILEGES ON DATABASE techsuite TO me;
    ```
5. Adjust the database URI string in ```server/src/.env```. The format is: 
    ```
    DATABASE_URI="postgresql://<name>:<password>@<host>/<dbname>"
    ```
    For example, 
    ```
    DATABASE_URI="postgresql://me:1984@localhost/techsuite"
    ```

Note: to use psql to interface with the techsuite database instance, run `psql -d techsuite -U <username>` 

### Installing Psycopg2 on Debian/Ubuntu
Psycopg2 is a necessary library for Flask-SQLAlchemy to work.
1. `sudo apt install libpq-dev python3-dev`
2. `pip3 install psycopg2`

> SQLAlchemy is a ORM, psycopg2 is a database driver. These are completely different things: SQLAlchemy generates SQL statements and psycopg2 sends SQL statements to the database. SQLAlchemy depends on psycopg2 or other database drivers to communicate with the database! [Source](https://stackoverflow.com/questions/8588126/sqlalchemy-or-psycopg2)



