# NGSI-LD Context Provision Test Suite

## Entity Creation (Sections: 6.4.3 , 5.6.1)

### create_entity_test.js

It exercises the creation of Entities using plain JSON. No JSON-LD header is provided so that the Default @context will be used.

### create_entity_errors_test.js

It exercises the creation of Entities under different error circumstances that should be reported by the API implementation. 

### create_entity_with_ldcontext_test.js

It exercises the creation of Entities using JSON-LD as input (including a @context).

## Append Attributes (Sections: 6.6.3.1, 5.6.3)

### append_entity_attrs_test.js

It exercises appending new Attributes to an Entity. Using JSON content and a Default @context.

## Protocol Errors 

### protocol_errors_test.js

It exercises different protocol errors that might happen. (Section 6.3.4)
