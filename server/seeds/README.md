
### Populating the database:
Simple instructions for seeding the database:
```
dropdb -U tim techsuite
createdb -U tim techsuite
psql techsuite -f <seedfile.sql>
```

The server must be off.
