-----------
NEW INSTALL
-----------
1. Run _setup.sql

-----------
UPGRADE
-----------
1. Check your database version: SELECT max(version) FROM settings; (if there is no table settings, version = 1)

2. Run all scripts from your version number and higher.
