import express from 'express'; import cors from 'cors'; import dotenv from 'dotenv'; dotenv.config();
import health from './routes/health.js'; import products from './routes/products.js'; import sales from './routes/sales.js';
const app=express(); app.use(cors()); app.use(express.json());
app.use('/health', health); app.use('/api/products', products); app.use('/api/sales', sales);
app.use((req,res)=>res.status(404).json({error:'Not found'}));
const port=process.env.PORT||10000; app.listen(port, ()=>console.log('Server listening on',port));
