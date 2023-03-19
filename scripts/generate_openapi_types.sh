OPENAPI_SPEC_PATH=postman/schemas/index.yaml
# clean previous generated
rm -rf $OUTPUT_PATH

# generate openapi specs
openapi-generator-cli generate \
-g typescript-fetch \
-i $OPENAPI_SPEC_PATH \
-o $OUTPUT_PATH