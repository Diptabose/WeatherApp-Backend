const pg= require('pg');

//Localhost Config

const pool= new pg.Pool({
    host: 'localhost', // server name or IP address;
    port: 5432,
    database: 'notifications',
    user: 'bose',
    password: 'bose',
});




//Server side config
/*const pool= new pg.Pool({
  connectionString:'',
  ssl:{
    rejectUnauthorized:false,
  }
});*/

module.exports={pool};
