const  {pool} = require('../dbConnect.js');

const storeEndpoint=async (data)=>{
  const {endpoint,location} = data;
  let client = null;
    try{
     client = await pool.connect();
     const res = await client.query('INSERT into notification values($1,$2)',[endpoint,location]);
     await client.release();
     return {msg:'Insertion success', status:201};
   }
   catch(error){
     if(error.code==='23505'){
       return {msg:'Endpoint exists' ,status:409};
     }
    else{
     let err = new Error('PushSubscription insertion failed');
     err.status=500;
     await client.release();
     return err;
    }
    }
}


const deleteEndPoint=async (endpoint)=>{
  let client = null;
  try{
    client = await pool.connect();
    const resp = await client.query('DELETE from notification where endpoint=$1',[endpoint]);
   await client.release();
    return true;
  }
  catch(err){
    await client.release();
    return false;
  }
}


const getEndPoints =async ()=>{
  let client =null;
  try{
    client = await pool.connect();
    const resp= await client.query('SELECT * FROM notification');
    await client.release();
    return resp.rows;
  }
  catch(error){
    console.log(error);
    await client.release();
    return false;
  }
}

module.exports={storeEndpoint,deleteEndPoint,getEndPoints};