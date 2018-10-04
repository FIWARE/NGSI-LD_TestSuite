# NGSI-LD Context Consumption Test Suite

## Entity Retrieval

(Section 5.7.1, 6.5.3.1)

### retrieve_entity_test.js

Exercises retrieval of Entities using Default @context (JSON). No JSON-LD Link header is provided. 

### retrieve_entity_with_ldcontext_test.js

Exercises retrieval of Entities that are in a user @context. JSON-LD Link header is used in GET operations. 

## Query Entities

(Section 5.7.2, 6.4.3.2)

### query_entities.js

Exercises Query Entities using Default @context (JSON). No JSON-LD Link header is provided.

### query_entities_with_ld_context_test.js

Exercises query of Entities that are in a user @context. JSON-LD Link header is used in GET operations. 
