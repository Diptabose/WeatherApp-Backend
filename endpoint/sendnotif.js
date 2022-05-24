const express = require('express');
const router = express.Router();
const webpush = require('web-push');
const {storeEndpoint,deleteEndPoint} = require('../DbOperations/storeEndpoint.js');

const vapidKeys={publicKey:'BEyjBD8bR-ZsO9F0vFyoBKfgKNg1SdX8fr_rfVhmhwXZYzc-B9KJepeyICjLdPkk9EUCRBLvHawNve3OZ1MWFhw', privateKey:'1OOi_1vzoINAirYMYLxFJd3HQAA4pm1XmJGBSafYSVQ'};

webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);


router.post('/deleteendpoint',async (req,res)=>{
  console.log('req to delete endpint recieved ');
  try{
    const resp = await deleteEndPoint(req.body);
    if(resp){
      res.status(200).json({msg:'OK'});
    }
    else{
      res.status(500).json({msg:'not deleted'});
    }
  }
  catch(error){
    res.status(500).json({msg:'not deleted'});
  }
});




router.post('/endpoint', async (req,res)=>{
  console.log('req recieved to store endpoint and send demo');
  const {endpoint}= req.body;
   const payload =JSON.stringify({test:true});
   try{
   const resp= await storeEndpoint(req.body);
   if(resp.status===201){
     try{
      await webpush.sendNotification(endpoint, payload);
      console.log('demo notif sent');
      res.status(200).json({msg:'sent'});
     }
     catch(error){
       console.log(error);
       try{
       await deleteEndPoint(endpoint);
       res.status(500).json({msg:'Web push error'});
       }
       catch(error){
         console.log(error);
         res.status(500).json({msg:'Internal Server Error'});
       }
     }
   }
   else{
     console.log('in demo endpoint exists');
     res.status(409).json({msg:'Endpoint exists'});
   }
   }
   catch(error){
     console.log('in demo internal server error')
     res.status(500).json({msg:'Internal Server Error'});
   }
});

module.exports={router,vapidKeys};
