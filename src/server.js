import dotenv from 'dotenv';
import app from './app.js';
import connectDb from './config/db.js';

dotenv.config();
connectDb()

const PORT =process.env.PORT || 5000;


app.listen(PORT,()=>{
    console.log(`server is running ${PORT}`);
})