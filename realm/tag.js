import Realm from 'realm';

class Tag {
    static schema = {
        name: 'Tag',
        properties: {
            id: {type: 'string', optional: true},
            creator_user_id: 'string',
            last_updated_user_id: 'string',
            address: 'string',
            description: 'string',
            img: 'string',
            crossed_out: 'bool',
            uploaded_online: 'bool',
            gang_related: 'bool',
            neighborhood: 'string',
            racially_motivated: 'bool',
            square_footage: 'string',
            surface: 'string',
            tag_words: 'string',
            tag_initials: 'string',
            uploaded_online: 'bool',
            date_taken: {type: 'date', optional: true},
            date_updated: {type: 'date', optional: true},
        },
    }

    get serviceProperties() {
        return Object.assign({}, this);
    }
}

export default Tag;
