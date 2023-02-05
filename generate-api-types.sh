#!/bin/sh

SPEC_FILE=postman/schemas/index.yaml
OUTDIR=src/generated/openapi

# Clean the previous generated files
rm -rf $OUTDIR

# Start the generation
openapi-generator-cli generate \
  -g typescript-fetch \
  -i $SPEC_FILE \
  -o $OUTDIR \