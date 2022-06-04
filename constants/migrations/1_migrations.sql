-- sql tables
create table if not exists admins
(
    id         int primary key generated always as identity,
    username   varchar(50) unique       not null,
    password   varchar(150)             not null,
    token      varchar(150),
    name       varchar(50)              not null,
    surname    varchar(50)              not null,
    patronymic varchar(50)              not null,
    full_name  text,
    is_super   boolean                  not null,
    created_at timestamp with time zone not null default current_timestamp
);

create table if not exists countries
(
    id        int primary key generated always as identity,
    name_uz   varchar(50) not null,
    name_ru   varchar(50) not null,
    name_en   varchar(50) not null,
    full_name text
);

create table if not exists states
(
    id         int primary key generated always as identity,
    country_id int         not null references countries (id) on delete cascade ,
    name_uz    varchar(50) not null,
    name_ru    varchar(50) not null,
    name_en    varchar(50) not null,
    full_name  text
);

create table if not exists cities
(
    id        int primary key generated always as identity,
    state_id  int         not null references states (id) on delete cascade,
    name_uz   varchar(50) not null,
    name_ru   varchar(50) not null,
    name_en   varchar(50) not null,
    full_name text
);

create table if not exists districts
(
    id        int primary key generated always as identity,
    city_id   int         not null references cities (id) on delete cascade,
    name_uz   varchar(50) not null,
    name_ru   varchar(50) not null,
    name_en   varchar(50) not null,
    full_name text
);

create table if not exists fuel_types
(
    id        int primary key generated always as identity,
    parent_id int references fuel_types (id) on delete cascade,
    name_uz   varchar(50) not null,
    name_ru   varchar(50) not null,
    name_en   varchar(50) not null,
    full_name text
);

create table if not exists companies
(
    id         int primary key generated always as identity,
    name       varchar(50)              not null,
    image      varchar(50),
    created_at timestamp with time zone not null default current_timestamp
);

create table if not exists company_branch
(
    id          bigint primary key generated always as identity,
    company_id  int                      not null references companies (id) on delete cascade,
    district_id int                      not null references districts (id),
    name_uz     varchar(50)              not null,
    name_ru     varchar(50)              not null,
    name_en     varchar(50)              not null,
    full_name   varchar(50),
    coords      point                    not null,
    mon_from    time                     not null,
    mon_to      time                     not null,
    tue_from    time                     not null,
    tue_to      time                     not null,
    wed_from    time                     not null,
    wed_to      time                     not null,
    thu_from    time                     not null,
    thu_to      time                     not null,
    fri_from    time                     not null,
    fri_to      time                     not null,
    sat_from    time                     not null,
    sat_to      time                     not null,
    sun_from    time                     not null,
    sun_to      time                     not null,
    is_working  boolean                  not null default true,
    created_at  timestamp with time zone not null default current_timestamp
);

create table if not exists company_branch_fuel_selection
(
    id                bigint primary key generated always as identity,
    company_branch_id bigint                   not null references company_branch (id) on delete cascade,
    fuel_type_id      int                      not null references fuel_types (id) on delete cascade,
    is_available      boolean                  not null,
    price             decimal(18, 2)           not null,
    created_at        timestamp with time zone not null default current_timestamp,
    unique (company_branch_id, fuel_type_id)
);

create table if not exists company_user
(
    id           int primary key generated always as identity,
    company_id   int                      not null references companies (id) on delete cascade,
    name         varchar(50)              not null,
    surname      varchar(50)              not null,
    patronymic   varchar(50)              not null,
    full_name    text,
    passport     char(9) unique           not null,
    phone_number char(12) unique          not null,
    image        varchar(50),
    password     varchar(150)             not null,
    token        varchar(150),
    is_super     boolean                  not null default true,
    created_at   timestamp with time zone not null default current_timestamp
);

create table if not exists company_user_branches
(
    company_user_id   bigint                   not null references company_user (id) on delete cascade,
    company_branch_id bigint                   not null references company_branch (id) on delete cascade,
    is_super          boolean                  not null default true,
    created_at        timestamp with time zone not null default current_timestamp,
    unique (company_branch_id, company_user_id)
);