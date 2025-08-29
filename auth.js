export function requireAuth(req,res,next){
  const h=req.headers.authorization||""; const t=h.startsWith("Bearer ")?h.slice(7):null;
  if(!t || t!==process.env.ADMIN_TOKEN) return res.status(401).json({error:"Unauthorized"});
  next();
}