SET sql_safe_updates = FALSE;

USE defaultdb;
DROP DATABASE IF EXISTS privacy_monitoring CASCADE;
CREATE DATABASE IF NOT EXISTS privacy_monitoring;

USE privacy_monitoring;

CREATE TABLE specification_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created TIMESTAMP DEFAULT now(),
    service_name varchar(100),
    commit varchar(255),
    differences JSONB,
    sourceSpecification JSONB,
    changedSpecification JSONB
);
