const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");
const { response } = require("express");
const app=express();
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));
app.get('/',function(req,res){
    res.sendFile(__dirname+'/signup.html');
})
app.post('/',function(req,res){
    const fname=req.body.fname;
    const lname=req.body.lname;
    const email=req.body.email;
    const data={
        members:[
            {
                email_address:email,
                status:'subscribed',
                merge_fields:{
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    };
    const jsonData=JSON.stringify(data);
    const url='https://us11.api.mailchimp.com/3.0/lists/c979965a96';
    const options={
        method:'POST',
        auth: 'aryan:e36cacbce719d213c53ce3e88fd5122c-us11'
    }
    const request=https.request(url,options,function(response){ 
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on('data',function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
})
app.post('/failure',function(req,res){
    res.redirect('/');
})
app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running on port 3000");
})
