# ci-privacy-alert

This repository contains a GitHub Action for detecting changes in an OpenAPI specification or other YAML/JSON specification and sending the 
differences to a CockroachDB. 

Before using the action you should setup a [CockroachDB](https://www.cockroachlabs.com/). You can setup a for free serverless
Database in a matter of minutes. Then create a table in the following way:

```roomsql
CREATE TABLE specification_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created TIMESTAMP DEFAULT now(),
    service_name varchar(100),
    commit varchar(255),
    differences JSONB
);
```

Full example can be found in `dbinit.sql`.

Example usage: 

```yaml
  - name: Prepare DB connection
    run: echo "$DB_CRT" >> db.crt
    shell: bash
    env:
      DB_CRT : ${{ secrets.DB_CRT }}
  - name: Check out head branch
    uses: actions/checkout@v2
    with:
      path: head
  - name: Check out main branch
    uses: actions/checkout@v2
    with:
      ref: main
      path: base
  - name: CI Privacy Alert Test
    uses: ./head/
    id: ci-privacy-alert
    with:
      source-specification: base/examples/specification.yml
      changed-specification: head/examples/specification-changed.yml
      db-connection: ${{ secrets.DB_CONNECTION_STRING }}
      db-name: ${{ secrets.DB_NAME }}
      table-name: ${{ secrets.TABLE_NAME }}
      service-name: ${{ github.repository }}
      commit: ${{ github.sha }}
```

In order for the GitHub Action to send your specification changes to a CockroachDB you should create the following secrets:

1. DB_NAME - the name of the Database
2. TABLE_NAME - the name of the table
3. DB_CONNECTION_STRING - the connection string used to connect to cockroachdb; with the property `sslrootcert=db.crt`
4. DB_CRT - the SSL certificate for connecting to the DB. The certificate is copied to a file and stored on the GitHub Workspace before running the action.

## OpenAPI Package Comparison

Research on libraries for generating the differences between two OpenAPI specifications. 

The project contains two OpenAPI 3.0.0 specifications, which have different changes from the first version to the second.

Example usage of the application:
```
node app.js -s specification.yml -d specification-changed.yml -o output.json -m deep-diff
```

Arguments:
- "-s" is the path to the original specification
- "-d" is the path to the changed specification
- "-o" is the path for the output file
- "-m" is the mode (the library with which to generate the differences)

Available modes:
- deep-diff
- json-diff
- openapi-diff

Examples folder contains the example outputs of the libraries + the output of the go library [dyff](https://pkg.go.dev/github.com/homeport/dyff/pkg/dyff)
