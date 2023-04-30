
const express=require('express')
const bodyParser = require('body-parser');
//要解决跨域问题，草
var cors = require('cors');
const app = express()
app.use(cors());
//数据库
const mysql=require('mysql');
const { error } = require('@hapi/joi/lib/base');
const db=mysql.createPool({
  host:'127.0.0.1',
  user:'root',
  password:'1234',
  database:'first_table',
})
//解析表单
app.use(bodyParser.urlencoded({ extended: false}));

app.post('/login', (req, res) => {
    const sql='insert into baoxiu set ?'
  const username = req.body.username;
  const tel=req.body.tel;
  var time=req.body.time;
  time=new Date(time.replace('T',' '));
  const xh=req.body.xh;
  const question=req.body.question;
  db.query(sql,{username:username,tel:tel,time:time,xh:xh,question:question},(err,results)=>{
    if(err)
    return res.send({message:err.message})
    //提交成功
    res.send({status:0,message:'提交成功'
});  
  })
  
  
  
})
//进入页面初始化表格
app.get('/show', (req, res) => {
  const sql='select * from baoxiu  LIMIT 0,2'
db.query(sql,(err,results)=>{
  if(err)
  return res.send({message:err.message})
  //表单数据返回到前端
 
  res.json(results);  
})
//分页显示
app.post('/newdata',(req,res)=>{

   const pageNum=req.body.Num;
   //要解决类型不同问题
   const pageSize=parseInt(req.body.Size)
   //从那一条开始
   const start=(pageNum-1)*pageSize;
   
  // res.send({status:0,start:start})
  db.query('select * from baoxiu LIMIT ?,?',[start,pageSize],(error,results)=>{
    if(error)
    res.send({message:error.message})

    res.json(results)
   })
})
//最大页码
app.get('/getCount',(req,res)=>{
  db.query('select count(*) from baoxiu',(error,results)=>{
    if(error)
    res.send({message:error.message})
    
    const total=results[0]['count(*)'];
    res.send({total});  
    
  })
  
})

})
//是否完成
app.post('/solved',(req,res)=>{
  const sql='UPDATE baoxiu SET solve=? WHERE username=?'
console.log(req.body.solve)
console.log(req.body.username)
  var s;
  if(req.body.solve=="true")
  s="1"
  else
  s="0"
  console.log(s)
  db.query(sql,[s,req.body.username],(error,results)=>{
    if(error){
    res.send({message:error.message})
    }
     else {
      
     // db.commit()
    res.send({solve:s});
     }
  })

})
//删除记录
app.post('/delete',(req,res)=>{
  const sql='delete from baoxiu where username=? '
 db.query(sql,req.body.username,(error,results)=>{
  if(error){
    res.send({message:error.message})
    }
     else {
      
    res.send({delete:'删除成功'});
     }
 })
})
app.listen(8080, () => console.log('Server Started on http://localhost:8080'))

