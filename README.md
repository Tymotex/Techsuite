# Techsuite
A collaboration and social networking app for developers. Built with React, Flask and PostgreSQL. 

<img src="./images/techsuite-home-2.png"></img>

# Auto Setup (For Development and Production):
1. `git clone https://github.com/Tymotex/Techsuite.git`
2. `cd util/setup && sudo sh setup.py` 
3. `pip3 install -r server/requirements.txt`
4. `npm install --prefix ./client`
5. Configure the `.env` file inside `server/src`. Set the formatted database URI connection string: `DATABASE_URI="postgresql://username:password@localhost/techsuite"`. See [database setup](#database-setup)

### Development:
1. `./techsuite` inside the `Techsuite/server` folder
2. `npm start` inside the `Techsuite/client` folder


<a name="database-setup">

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
psql=# GRANT ALL PRIVILEGES ON DATABASE techsuite TO me;
```
5. Adjust the database URI string in ```server/src/.env```. The format is ```DATABASE_URI="postgresql://<name>:<password>@<host>/<dbname>"```, for example, ```DATABASE_URI="postgresql://me:1984@localhost/techsuite"```

Note: to use psql to interface with the techsuite database instance, run `sudo -u postgres psql`, then run `\c techsuite` in the prompt

### Installing Psycopg2 on Debian/Ubuntu
1. `sudo apt install libpq-dev python3-dev`
2. `pip3 install psycopg2`




