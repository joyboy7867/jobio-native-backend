import  express  from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
mongoose.connect('mongodb+srv://jobio:jobioreactnative@cluster0.hksbm0w.mongodb.net/').then(found=>{
    console.log("connected to database")
}).catch(err=>{
    console.log("not connected to database")

})

const savedschema=new mongoose.Schema({
    userId:{type:String,required:true,unique:true},
    jobpost:{type:[{title:String,company:String,image:String,desc:String,skill:[String],date:String,apply:String}]}
})
const savedmodel=mongoose.model('saved',savedschema)
const app=express()
app.use(bodyParser.json())


app.post("/saved-job",async(req,res)=>{
    const{title,company,image,desc,skill,date,apply,userid}=req.body;
  
    await savedmodel.findOne({userId:userid}).then(async(found)=>{
        if(!found){
            const p=savedmodel({
                userId:userid,
                jobpost:{
                    title:title,
                    company:company,
                    image:image,
                    desc:desc,
                    skill:skill,
                    date:date,
                    apply:apply
                }
            })
            await p.save()
        }else{
            await savedmodel.findByIdAndUpdate(found._id,{$push:{jobpost:{title:title,
                company:company,
                image:image,
                desc:desc,
                skill:skill,
                date:date,
                apply:apply}}},{new:true}).then(found=>{
                console.log("updated")
            })
            
        }
    })
})
app.post("/get-saved",async(req,res)=>{
    const{userid}=req.body;
    let found=await savedmodel.findOne({userId:userid})
   res.json(found.jobpost)
})

app.post("/delete-saved",async(req,res)=>{
    const{userid,postid}=req.body
    await savedmodel.findOne({userId:userid}).then(async found=>{
        if(found){
            const indexToRemove = found.jobpost.findIndex(post => post._id.toString() === postid);
            if (indexToRemove !== -1) {
                
                found.jobpost.splice(indexToRemove, 1);
                
                await found.save();
                res.status(200).json({ message: 'Job post deleted successfully.' });
                console.log("deleted")
            } else {
                res.status(404).json({ message: 'Job post not found.' });
                console.log("post not found")
            }
        }else{
            console.log("user not found")
        }
    })
})


app.listen(5000,()=>{
    console.log("listening at 5000")
})