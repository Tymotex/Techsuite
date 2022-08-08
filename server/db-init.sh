#!/bin/sh
# A script to initialise the PostgreSQL Docker container.

set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE USER tim WITH PASSWORD '1989';
	CREATE DATABASE techsuite;
	GRANT ALL PRIVILEGES ON DATABASE techsuite TO tim;
EOSQL
