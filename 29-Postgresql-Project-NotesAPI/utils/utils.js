function validDigit(num){
   return !/^\d+$/.test(num)
}
export const CheckvalidId = (req,res,next)=>{

    if(validDigit(req.params.id)){
        return res.status(400).json({"ok":false , 'msg':"Invalid ID"})
    }
    next()
    
}


