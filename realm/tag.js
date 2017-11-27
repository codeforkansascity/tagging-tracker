import Realm from 'realm';

class Tag extends Realm.Object {}

Tag.schema = {
    name: 'Tag',
    properties: {
        address: 'Address',
        description: 'string',
        img: 'string',
        crossed_out: 'bool',
        date_taken: 'date',
        gang_related: 'bool',
        neighborhood: 'string',
        racially_motivated: 'bool',
        square_footage: 'string',
        surface: 'string',
        tag_words: 'string',
        tag_initials: 'string',
    },
};

export default Tag;
