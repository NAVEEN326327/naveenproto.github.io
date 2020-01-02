var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://127.0.0.1')
const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded()); 

var msgRecieved;
///////////  topics   ////////////////////////////
var topicSubscribed;

const mysql = require('mysql');

/////////////////////////    MYSQL connectivity ///////////////
var mysqlConnection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'naveen@@',
    database : 'MSP',
    multipleStatements : true
})

mysqlConnection.connect((err)=>{
    if(!err)
    {
        console.log('connected to database ');
    }
    else{
        console.log("connection Failed");
    }
});

/////////////////////////////////



/////////////  MQTT connection creation //////////////
var isconnected = false;
client.on('connect', ()=> {    // Subscribed to topic on connected to mqtt client
 isconnected = true;
});

///////////////  html page render ///////////
app.get('/',(req,res)=>{
  return res.render('sub', {
    title: 'subscriber'
  })
})

//////////////// sending form data /////////////
app.post('/connected', (req,res)=>{

  var topicSubscribed = req.body.name;
  if(isconnected == true){
    id = 1;
    console.log(isconnected);
    client.subscribe(topicSubscribed);
  }



  return res.redirect('/');

})


var id=1;
// On message recieved //////////////////////////////////////
client.on('message',(topic, message)=> {   

  msgRecieved = message.toString();
  topicSubscribed = topic.toString();
  console.log(topicSubscribed);
  if (topicSubscribed == topic) {    ///////  If message recieved from topic on which we subscribed
 
 
    fs.appendFile('storage.txt',id+": "+ msgRecieved+"\n", (err) => {  //append message content to file
     id +=1;
      if (err) {
        console.log(err);
      }
      else {
        console.log('message published from '+topic +' and message is '+ message);
      }
    })   

    var sql = "insert into chat values(null, '" + topic+"', '" + msgRecieved + "')";
mysqlConnection.query(sql, (err)=>{

  if(err) throw err
      console.log("stored data");
       })
       
       mysqlConnection.end();



  }
})



app.listen(3002,()=>{
  console.log('server is working for subscriber');
})