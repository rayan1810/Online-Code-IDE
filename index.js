const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var fs = require("fs");
// var compiler = require('compilex');
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var option = {stats : true};
// compiler.init(option);

app.get('/' , function (req , res ) {

	res.render("index",{data:"",code:""});

});
app.post('/runCode',(req,res)=>{
    var code = req.body.code;
    console.log(code);
    var input = req.body.input;
    var lang = req.body.lang;
    if(lang==="C/C++"){
        var blog = `${new Date().getTime()}.cpp`;
        var writeStream = fs.createWriteStream(blog);
        writeStream.write(code);
        writeStream.end();
        var {spawn} = require('child_process');
        var process = spawn('gcc', [blog
        ]);
        process.stdout.on('data', function (data) {
          res.render('index',{data:data.toString()});
        });
        process.stderr.on('data', (data) => {
          console.error(`stderr: ${data}`);
        });
        process.on('close',(code)=>{
            console.log(`the childe process exited wit code ${code}`);
        })
        fs.unlinkSync(blog);
    }
    else if(lang==="java"){
        var blog = "Main.java";
        var writeStream = fs.createWriteStream(blog);
        writeStream.write(code);
        writeStream.end();
        var {spawn} = require('child_process');
        var process = spawn('javac', [blog
        ]);
        process.on('close',(code)=>{
            console.log(`successfully compiled ${code}`);
        })
        var {spawn:spawn1} = require('child_process');
        var process = spawn1('java', [blog
        ]);
        process.stdout.on('data', function (data) {
          fs.unlinkSync(blog);
          res.render('index',{data:data.toString()});
        });
        process.stderr.on('data', (data) => {
          console.error(`stderr: ${data}`);
        });
        process.on('close',(code)=>{
            console.log(`the child process exited with code ${code}`);
        })
        
    }
    else if(lang==="python"){
        console.log("python wala ");
        var blog = `${new Date().getTime()}.py`;
        var writeStream = fs.createWriteStream(blog);
        writeStream.write(code);
        writeStream.end();
        var {spawn} = require('child_process');
        var process = spawn('python', [blog
        ]);
        process.stdout.on('data', function (data) {
            console.log(data.toString());
            fs.unlinkSync(blog);
          res.render('index',{data:data.toString(),code:code});
        });
        process.stderr.on('data', (data) => {
          console.error(`stderr: ${data}`);
        });
        process.on('close',(code)=>{
            console.log(`the childe process exited wit code ${code}`);
        })
        
    }
});


// app.post('/runCode',function(req,res){
//     var code = req.body.code;
//     var input = req.body.input;
//     var lang = req.body.lang;
//     if((lang === "C")||(lang==="C++")){
//         var envData = { OS : "linux" , cmd : "gcc" };
//         compiler.compileCPPWithInput(envData , code , input , function (data) {
//             if(data.error)
//         		{
//         			res.send(data.error);    		
//         		}
//         		else
//         		{   var blog = `${new Date().getTime()}.html`;
//                     var writeStream = fs.createWriteStream(blog);
//                     writeStream.write(data.output);
//                     writeStream.end();
//         			res.sendFile(blog,{root:__dirname});
//         		}
//         });
//     }
//     if(lang === "Java"){
//         var envData = { OS : "linux" };
//     compiler.compileJavaWithInput( envData , code , input ,  function(data){
//         if(data.error)
//         		{
//         			res.send(data.error);    		
//         		}
//         		else
//         		{
//                     var blog = `${new Date().getTime()}.html`;
//                     var writeStream = fs.createWriteStream(blog);
//                     writeStream.write(data.output);
//                     writeStream.end();
//         			res.sendFile(blog,{root:__dirname});
//         		}
//     });
//     }
//     if(lang === "Python"){
//         var envData = { OS : "linux" }; 
//     compiler.compilePythonWithInput( envData , code , input ,  function(data){
//         if(data.error)
//         		{
//         			res.send(data.error);    		
//         		}
//         		else
//         		{
//         			var blog = `${new Date().getTime()}.html`;
//                     var writeStream = fs.createWriteStream(blog);
//                     writeStream.write(data.output);
//                     writeStream.end();
//         				res.sendFile(blog,{root:__dirname});
//         		}
//     });
//     }
// });


app.listen(3000);