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