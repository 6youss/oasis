CREATE TABLE resources (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  description VARCHAR
);

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR NOT NULL
);

CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  rate NUMERIC NOT NULL,
  resource_id INTEGER NOT NULL REFERENCES resources(id),
  customer_id INTEGER NOT NULL REFERENCES customers(id)
);

CREATE TABLE availability (
  id SERIAL PRIMARY KEY,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  resource_id INTEGER NOT NULL REFERENCES resources(id)
);
