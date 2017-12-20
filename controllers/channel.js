// Load modules
const dbPool = require('./db');

// function loadChannels () {
//   dbPool.query('SELECT * FROM channels WHERE 1 ORDER BY name ASC', [],
//     function (error, results, fields) {
//       //console.log(typeof error);
//       if (!error) {
//         console.log('channels loaded');
//         console.log(results);
//         global.channels = results;
//       } else {
//         //console.log('error', error);
//       }
//       // error will be an Error if one occurred during the query
//       // results will contain the results of the query
//       // fields will contain information about the returned results fields (if any)
//     });
// }

async function loadChannels () {
    const [rows, fields] =  await dbPool.query('SELECT * FROM channels WHERE 1 ORDER BY name ASC', []);
    global.channels = rows;
    return rows;
}

async function loadChannel (searchId) {
    const [rows, fields] =  await dbPool.query('SELECT * FROM channels WHERE id = ? ', [parseInt(searchId)]);
    return rows[0];
}

function loadChannelByEntity (searchId) {
  var $channels = [];
  console.log(global.channels);
  global.channels.forEach(function (item) {
    if (item.entity_id == searchId) {
      $channels.push(item);
    }
  });

  console.log('CHANNELS FOUND');
  console.log($channels);
  return $channels;
}

module.exports = {
  loadChannels: loadChannels,
  loadChannel: loadChannel,
  loadChannelByEntity: loadChannelByEntity,
    loadChannels:loadChannels
}