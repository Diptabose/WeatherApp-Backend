const express = require('express');
const PORT = process.env.PORT || 5000;
const cors= require('cors');
const app = express();
const cron = require('node-cron');
const fetch= require('axios');
const {router} =require('./endpoint/sendnotif');
const {scheduler} = require('./Scheduler/today-push.js');

app.use(express.json());


app.use(cors({
    origin:'*'
    }));


app.get('/demo',(req,res)=>{
  res.send('hello');
})
app.use('/send',router );

app.listen(PORT,()=>{console.log(`Server running at port ${PORT}`)});



//const job = cron.schedule('* * * * *',()=>{
 // scheduler();
//});