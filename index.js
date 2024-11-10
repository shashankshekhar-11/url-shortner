const express = require('express');
const {connectToMongoDB} =require('./connect')
const urlRoute =require('./routes/url')
const URL = require('./models/url');
const { handleGetAnalytics } = require('./controllers/url');
const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/short-url')
.then(() =>{console.log("MongoDB connected");
})
app.use(express.json());

app.get("/test",async(req,res)=>{
    const allUrls = await URL.find({})
    return res.send(`
    <html>
        <head>  </head>
        <body>
            <ol>
                ${allUrls.map(url => `<li>${url.shortId} - ${url.redirectURL} - ${url.visitHistory.length} </li>`).join('')}
            </ol>
        </body>
    </html>
    `)
});

app.use('/url',urlRoute)

app.get('/url/:shortId',async (req,res)=>{
    const shortId =req.params.shortId;
    const entry=await URL.findOneAndUpdate({
        shortId
    },
    {
        $push:{
        visitHistory:{
            timestamp : Date.now(),
        },
        },
    }
    );
    res.redirect(entry.redirectURL)
})



app.listen(PORT,() => console.log(`Server started on ${PORT}`));
