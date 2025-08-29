import { Router } from 'express'; import { query } from '../db.js';
const router=Router(); router.get('/', async (req,res)=>{try{await query('select 1');res.json({ok:true});}catch(e){res.status(500).json({ok:false,error:e.message})}});
export default router;
