const Datastore = require('nedb')
  , path = require('path')
  , mobs = new Datastore({filename: path.join('.','databases','Mobs.db')})
  , maps = new Datastore({filename: path.join('.','databases','Maps.db')});

mobs.loadDatabase((err) => {
  if(err) console.log(err);
  console.log('Database: Mobs loaded successfully!');
});

maps.loadDatabase((err) => {
  if(err) console.log(err);
})

export default {
  mobs,
  maps
}

