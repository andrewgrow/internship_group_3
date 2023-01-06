/* eslint-disable no-undef */
conn = new Mongo();
db = conn.getDB('onix-internship-group3');

/** Examples for creating via this init script
db.myCollectionName.createIndex({ 'address.zip': 1 }, { unique: false });
db.myCollectionName.insertOne({ address: { city: 'Paris', zip: '123' }, name: 'Mike', phone: '1234' });
 */

/**
db.myCollectionName.insert({ "address": { "city": "Paris", "zip": "123" }, "name": "Mike", "phone": "1234" });
db.myCollectionName.insert({ "address": { "city": "Marsel", "zip": "321" }, "name": "Helga", "phone": "4321" });
*/
