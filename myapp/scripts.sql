CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
ALTER TABLE courseschedule ADD COLUMN id uuid DEFAULT uuid_generate_v4 ();
ALTER TABLE cheatsheet ADD COLUMN ts timestamp DEFAULT CURRENT_TIMESTAMP;