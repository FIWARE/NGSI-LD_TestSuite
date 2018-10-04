# NGSI-LD Context Provision Test Suite

## Entity Creation 

(Sections: 6.4.3 , 5.6.1)

### create_entity_test.js

It exercises the creation of Entities using plain JSON. No JSON-LD header is provided so that the Default @context will be used.

### create_entity_errors_test.js

It exercises the creation of Entities under different error circumstances that should be reported by the API implementation. 

### create_entity_with_ldcontext_test.js

It exercises the creation of Entities using JSON-LD as input (including a @context).

## Append Attributes 

(Sections: 6.6.3.1, 5.6.3)

### append_entity_attrs_test.js

It exercises appending new Attributes to an Entity. Using JSON content and a Default @context.

## Update Attributes 

(Sections: 6.6.3.2, 5.6.2)

### update_entity_attrs_test.js

It exercises the update of Entity Attributes. 

## Partial Attribute Update 

(Sections: 6.7.3.1, 5.6.4)

### partial_attr_update_test.js

It exercises the partial update of an Entity Attribute. 

## Delete Entity 

(Sections: 6.5.3.2, 5.6.6)

### delete_entity_test.js

It exercises the deletion of an Entity.

## Delete Entity Attribute 

(Sections: 6.7.3.2, 5.6.5)

### delete_entity_attr_test.js

It exercises the deletion of an Entity Attribute. 

## Protocol Errors 

(Section 6.3.4)

### protocol_errors_test.js

It exercises different protocol errors that might happen. 
