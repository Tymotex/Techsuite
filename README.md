# Techsuite
A social app for developers. Built with React, Flask and PostgreSQL.

<img src="./images/techsuite-home-1.png"></img>

# Setup:
1. `git clone https://github.com/Tymotex/Techsuite.git`
2. Run `sudo apt update && sudo apt install postgresql postgresql-contrib` to install PostgreSQL 
3. Navigate to the `server` directory and run `pip3 install -r requirements.txt && cd ../client`
4. Configure the `.env` file inside `server/src`. Set the formatted database URI connection string: `DATABASE_URI="postgresql://username:password@localhost/techsuite"`
5. Navigate to the `client` directory and run `npm install`

# Start:
1. `python3 server.py` inside the `Techsuite/server` folder
2. `npm start` inside the `Techsuite/client` folder

# Issues:
- Socket broadcast issue for group messaging
- Broadcasting to unique users

# Database Setup:
Instructions for installing PostgreSQL and hooking it up with Flask-SQLAlchemy.
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
3. Create a new database instance with ```sudo -u postgres createdb techsuite```
4. Enter the ```psql``` interactive shell and grant privileges
```
$ sudo -u postgres psql
psql=# GRANT ALL PRIVLEGES ON DATABASE techsuite TO me;
```
5. Adjust the database URI string in ```server/src/.env```. The format is ```DATABASE_URI="postgresql://<name>:<password>@<host>/<dbname>"```, for example, ```DATABASE_URI="postgresql://me:1984@localhost/techsuite"```
6. 

### Installing Psycopg2 on Debian/Ubuntu
1. sudo apt install libpq-dev python3-dev
2. pip3 install psycopg2


Note: to use psql to interface with the techsuite database instance, run `sudo -u postgres psql`, then run `\c techsuite` in the prompt

