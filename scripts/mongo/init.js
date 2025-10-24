db = db.getSiblingDB('kn-twitty');

db.createUser({
  user: 'admin',
  pwd: '1234',
  roles: [
    { role: "dbOwner", db: "kn-twitty" }
  ]
});

db.createUser({
  user: 'user',
  pwd: '4321',
  roles: [
    { role: "readWrite", db: "kn-twitty" }
  ]
});