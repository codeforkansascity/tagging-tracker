import Realm from 'realm';

class Tag {
    static schema = {
        name: 'Tag',
        properties: {
            id: {type: 'string', optional: true},
            creator_user_id: 'string',
            last_updated_user_id: 'string',
            address: 'Address',
            description: 'string',
            img: 'string',
            crossed_out: 'bool',
            date_taken: {type: 'date', optional: true},
            date_updated: {type: 'date', optional: true},
            gang_related: 'bool',
            neighborhood: 'string',
            racially_motivated: 'bool',
            square_footage: 'string',
            surface: 'string',
            tag_words: 'string',
            tag_initials: 'string',
        },
    }

    get serviceProperties() {
        const properties = Object.assign({}, this)
        properties.address = this.address.id;
        return properties;
    }
}

export default Tag;
