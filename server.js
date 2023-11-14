const express = require('express');
const fileUpload = require('express-fileupload');
const {v4:uuid} = require('uuid');
const cors = require('cors')
const path = require('path')
const app  = express();

// app.use(json());
app.use(cors());
app.use(fileUpload())
app.use((err,req,res,next)=>{
   res.status(500).send('Server Error')
})

app.post('/upload', (req, res)=>{
     if(!req.files || !req.files.file){
       return res.status(400).json({
          error:'No file uploaded'
       })
     }

     const file = req.files.file;
     const maxSize = 10*1024*1024; //10mb
     if(file.size > maxSize) {
         return res.status(400).json({
           error: 'File size is too big' 
         })
     }
     const fileName = uuid() + path.extname(file.name)
     const upload_dir = `${__dirname}/client/public/uploads`
     file.mv(`${upload_dir}/${fileName}`, (err)=>{
        if(err){
            return res.status(500).send(err);
        }
        
        res.json({
           fileName,
           filePath: `/uploads/${fileName}`
        })
     })

})


app.listen(80,()=>console.log('server is running on http://localhost:80'))