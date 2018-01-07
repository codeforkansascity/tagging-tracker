import Realm from 'realm';

class Address {
    static schema = {
        name: 'Address',
        properties: {
            id: {type: 'string', optional: true},
            neighborhood: 'string',
            street: 'string',
            city: 'string',
            state: 'string',
            zip: 'string',
            latitude: 'double',
            longitude: 'double',
            date_updated: 'date',
            type_of_property: 'int',
            uploaded_online: 'bool',
            land_bank_property: {type: 'bool', optional: true},
            owner_name: {type: 'string', optional: true},
            owner_contact_number: {type: 'string', optional: true},
            owner_email: {type: 'string', optional: true},
            tenant_name: {type: 'string', optional: true},
            tenant_phone: {type: 'string', optional: true},
            tenant_email: {type: 'string', optional: true},
            creator_user_id: {type: 'string', optional: true},
            last_updated_user_id: {type: 'string', optional: true},
            latitude: {type: 'float', optional: false},
            longitude: {type: 'float', optional: false},
            follow_up_owner_needed: {type: 'bool', optional: true},
        }
    }

    get serviceProperties() {
        const properties = Object.assign({}, this)

        properties.point = {
            type: 'Point',
            coordinates: [properties.longitude, properties.latitude]
        };

        delete properties['id'];
        delete properties['longitude'];
        delete properties['latitude'];
        return properties;
    }
}

Address.PROPERTY_TYPES = [
  1,
  2,
  3,
];

Address.PROPERTY_TYPE_DISPLAYS = [
  'Commercial',
  'Residential',
  'Public',
];

export default Address;
