import express, { Request, Response } from "express";
import { resolve } from "path";

const app = express();

app.use(express.static(resolve('./public')));

const path = resolve('./public/html');
app.get('/',(req: Request,res: Response)=>{
  res.sendFile(`${path}/getaccount.html`);
})

app.get('/user',(req: Request,res: Response)=>{
  res.sendFile(`${path}/getuser.html`);
})

app.get('/withdraw',(req: Request,res: Response)=>{
  res.sendFile(`${path}/withdraw.html`);
})

app.get('/transaction',(req: Request,res: Response)=>{
  res.sendFile(`${path}/transaction.html`);
})

app.get('/deposit',(req: Request,res: Response)=>{
  res.sendFile(`${path}/deposit.html`);
})

app.use((req: Request,res: Response)=>{
  res.statusCode = 404;
  res.setHeader('Content-Type','text/plain');
  res.send('404 not found');
});

app.listen(3000,()=> {
  console.log('listening to port 3000');
})
