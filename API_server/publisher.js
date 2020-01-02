var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://127.0.0.1');
const express = require('express');
const app = express();
const path = require('path');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded());                   //      use for encoding JSON to object


//////////////////  Connect with front end app ////////////

//////////////////////////////////////////////
var contactList = [
  {
  
   topic: "",

   msg: ""
}

]
////////////////////////////////
isconnected = false;
client.on('connect', ()=> {
  isconnected = true;
})
/////////////////////////////////////////////////


////  Make API ////////////
app.get('/',(req,res)=>{
  return res.render('home', {
      title: "Publisher"
     // contact_list: contactList
  });
  // res.send('cool');
});




///////////////////////////////////         Contact form handling     ///////////////////////////////////////////

app.post('/create-contact',(req,res)=>{
     contactList[0].topic=req.body.topic1;
     contactList[0].msg=req.body.message1;
     if(isconnected ==true){
            client.publish(contactList[0].topic, contactList[0].msg);
            console.log(contactList[0].msg);

    }
  return res.redirect('/');
});


//////////////////////////////////////////             Starting server        ///////////////////////////////

app.listen(3001,()=>{
  console.log("server is working");
})

