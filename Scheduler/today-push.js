const fetch = require('axios').default;
const webpush = require('web-push');
const cron = require('node-cron');
const  {pool} = require('../dbConnect.js');
const {vapidKeys} = require('../endpoint/sendnotif');
const {getEndPoints , deleteEndPoint } = require('../DbOperations/storeEndpoint');

const apikey='66d9420ba608bc0e68e2a6dffe8361ab';
webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);






async function scheduler(){
  let endObj={};
  try{
   endObj= await fetchAndArrangeEndpoints();
   if(endObj)
   {
     await initWebPush(endObj);
   }
  }
  catch(error){
    console.log(error);
  }
}


async function fetchAndArrangeEndpoints(){
  let endObj={};
  try{
  const endpointResp = await getEndPoints();
  if(endpointResp.length===0){
    return false;
  }
  else{
  endpointResp.map((data)=>{
    if(data.location in endObj)
    {
      endObj[data.location].push(data.endpoint)
    }
    else{
      endObj[data.location]=[data.endpoint];
    }
  });
    return endObj;
  }
  }
  catch(error){
    console.log(error);
    return false;
  }
}


async function initWebPush(endObj){
  Object.entries(endObj).map(async (location)=>{
    let payload =null;
    try{
    const searchCoords = await fetch.get(`https://api.openweathermap.org/geo/1.0/direct?q=${location[0]}&limit=5&appid=${apikey}`);
    
    const coords = searchCoords.data[0];
    const weather= await fetch.get(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${apikey}&units=metric`);
    
    const {feels_like,temp,temp_min,temp_max } = weather.data.main;
    const {description, icon}= weather.data.weather[0]
    const weathericon = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    
     payload = JSON.stringify({feelslike:Math.floor(feels_like),max:Math.floor(temp_max),min:Math.floor(temp_min),temperature:Math.floor(temp),name:location[0],icon:weathericon,desc:description.charAt(0).toUpperCase().concat(description.slice(1))});
    }
   catch(error){
      console.log(error);
    }
    location[1].map(async (endpoint)=>{
     try{
      webpush.sendNotification(JSON.parse(endpoint),payload);
     }
     catch(error){
       console.log(error);
       try{
       await deleteEndPoint(endpoint);
       }
       catch(error){
         console.log(error);
       }
     }
    });
   
  });
}

module.exports={scheduler};
