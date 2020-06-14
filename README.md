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
- HowlerJS React compatibility? 

<img src="./images/Techsuite.png"></img>
