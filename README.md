# ci-privacy-alert

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
