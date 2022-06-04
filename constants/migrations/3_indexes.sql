CREATE INDEX IF NOT EXISTS gin_index_full_name_admin ON admins USING GIN (full_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS gin_index_full_name_country ON countries USING GIN (full_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS gin_index_full_name_state ON states USING GIN (full_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS gin_index_full_name_cities ON cities USING GIN (full_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS gin_index_full_name_districts ON districts USING GIN (full_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS gin_index_full_name_fuel_types ON fuel_types USING GIN (full_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS gin_index_full_name_company_branch ON company_branch USING GIN (full_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS gin_index_full_name_company_user ON company_user USING GIN (full_name gin_trgm_ops);