import Realm from 'realm';
import Tag from './tag';
import Address from './address';

export default new Realm({ schema: [Address, Tag], schemaVersion: 2 });
