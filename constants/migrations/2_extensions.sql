CREATE EXTENSION IF NOT EXISTS pg_trgm;

create or replace function array_diff(array1 bigint[], array2 bigint[])
    returns int[]
    language plpgsql
as
$$
BEGIN
    RETURN (
        SELECT array
                   (SELECT unnest(array1)
                    EXCEPT
                    SELECT unnest(array2))
    );
end;
$$;

-- admin full name
CREATE OR REPLACE FUNCTION update_admin_full_name() RETURNS trigger AS
$$
BEGIN
    UPDATE admins
    SET full_name = concat(name, ' ', surname, ' ', patronymic)
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_admin_inserted_updated
    AFTER INSERT OR UPDATE
    ON admins
    FOR EACH ROW
EXECUTE PROCEDURE update_admin_full_name();

-- company user full name
CREATE OR REPLACE FUNCTION update_company_user_full_name() RETURNS trigger AS
$$
BEGIN
    UPDATE company_user
    SET full_name = concat(name, ' ', surname, ' ', patronymic, ' ', phone_number, ' ', passport)
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_company_user_inserted_updated
    AFTER INSERT OR UPDATE
    ON company_user
    FOR EACH ROW
EXECUTE PROCEDURE update_company_user_full_name();

-- company_branch full name
CREATE OR REPLACE FUNCTION update_company_branch_full_name() RETURNS trigger AS
$$
BEGIN
    UPDATE company_branch
    SET full_name = concat(name_uz, ' ', name_ru, ' ', name_en)
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_company_branch_inserted_updated
    AFTER INSERT OR UPDATE
    ON company_branch
    FOR EACH ROW
EXECUTE PROCEDURE update_company_branch_full_name();

-- country full name
CREATE OR REPLACE FUNCTION update_country_full_name() RETURNS trigger AS
$$
BEGIN
    UPDATE countries
    SET full_name = concat(name_uz, ' ', name_ru, ' ', name_en)
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_country_inserted_updated
    AFTER INSERT OR UPDATE
    ON countries
    FOR EACH ROW
EXECUTE PROCEDURE update_country_full_name();

-- state full name
CREATE OR REPLACE FUNCTION update_state_full_name() RETURNS trigger AS
$$
BEGIN
    UPDATE states
    SET full_name = concat(name_uz, ' ', name_ru, ' ', name_en)
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_states_inserted_updated
    AFTER INSERT OR UPDATE
    ON states
    FOR EACH ROW
EXECUTE PROCEDURE update_state_full_name();

-- city full name
CREATE OR REPLACE FUNCTION update_city_full_name() RETURNS trigger AS
$$
BEGIN
    UPDATE cities
    SET full_name = concat(name_uz, ' ', name_ru, ' ', name_en)
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_city_inserted_updated
    AFTER INSERT OR UPDATE
    ON cities
    FOR EACH ROW
EXECUTE PROCEDURE update_city_full_name();

-- district full name
CREATE OR REPLACE FUNCTION update_district_full_name() RETURNS trigger AS
$$
BEGIN
    UPDATE districts
    SET full_name = concat(name_uz, ' ', name_ru, ' ', name_en)
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_district_inserted_updated
    AFTER INSERT OR UPDATE
    ON districts
    FOR EACH ROW
EXECUTE PROCEDURE update_district_full_name();

-- fuel type full name
CREATE OR REPLACE FUNCTION update_fuel_type_full_name() RETURNS trigger AS
$$
BEGIN
    UPDATE fuel_types
    SET full_name = concat(name_uz, ' ', name_ru, ' ', name_en)
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_fuel_type_inserted_updated
    AFTER INSERT OR UPDATE
    ON fuel_types
    FOR EACH ROW
EXECUTE PROCEDURE update_fuel_type_full_name();

