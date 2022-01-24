SET sql_safe_updates = FALSE;

USE defaultdb;
DROP DATABASE IF EXISTS TeamBluePrivacyMonitoring CASCADE;
CREATE DATABASE IF NOT EXISTS TeamBluePrivacyMonitoring;

USE TeamBluePrivacyMonitoring;

CREATE TABLE SpecificationChanges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    updated TIMESTAMP DEFAULT now(),
    differences JSONB
);
