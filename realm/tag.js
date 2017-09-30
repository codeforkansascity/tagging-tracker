import Realm from 'realm';

class Tag extends Realm.Object {}

Tag.schema = {
    name: 'Tag',
    properties: {
        img: 'string',
        neighborhood: 'string',
        square_footage: 'string',
        description: 'string',
        tag_words: 'string',
    },
};

export default Tag;
