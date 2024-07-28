let dice=(()=>{
	
	let default_dice_type=6;
	let default_dice_num=2;
	
	function getRandomInt(min, max) {
	  return Math.floor(Math.random() * (max - min + 1 ) + min); 
	}
	
	function roll_a_die(dice_type=default_dice_type){
		let total=getRandomInt(1,dice_type);
		let str=total.toString();
		
		return {
			total:total,
			str:str
		}
	}
	
	function roll_dice(num=default_dice_num,dice_type=default_dice_type){
		let total=0;
		let str="";
		str+='(';
		
		
		for(let i=0;i<num;i++){
			let res=roll_a_die(dice_type);
			total+=res.total;
			if(i!=0)str+='+';
			str+=res.str;
		}
		
		str+=')';
		
		return {
			total:total,
			str:str
		}
	}
	
	function evalF(expr){
		let ste="return ("+expr+");";
		let f=new Function(ste);
		return f();
	}
	
	
	function eval_NdM(ndm){
		let arg=ndm.split('d');
		if(arg[0]==''){
			arg[0]=default_dice_num;
		}else{
			arg[0]=Number(arg[0]);
		}
		
		if(arg[1]==''){
			arg[1]=default_dice_type;
		}else{
			arg[1]=Number(arg[1]);
		}
		
		let ret= roll_dice(arg[0],arg[1]);
		ret['ndm']=arg[0]+'d'+arg[1];
		return ret;
	}
	
	
	function evalDiceExpr(expr){
		
		let diceExprReg=/(((\d)*d(\d)*)|(\d)*)((\+|-|\*|\/)((((\d)*d(\d)*)|(\d)*)))*/g;
		let diceReg=/((\d)*d(\d)*)/g;
		
		let dexpr=expr.match(diceExprReg);
		if(!dexpr||dexpr.length<=0||!dexpr[0]){
			throw new Error(lan['cmd_error']);
		}
		dexpr=dexpr[0];
		let suffix=expr.replace(dexpr,'');
		
		let total=0;
		let str="";
		str+=lan['roll_dice'];
		
		let mexpr=dexpr;
		let ndms=dexpr.match(diceReg);
		
		if(ndms){
			for(let i=0;i<ndms.length;i++){
				let r=eval_NdM(ndms[i]);
				total+=r.total;
				mexpr=mexpr.replace(ndms[i],r.str);
				dexpr=dexpr.replace(ndms[i],r.ndm);
			}
		}
		
		str+=dexpr;
		str+='=';
		str+=mexpr;
		
		total=evalF(mexpr);
		str+='='
		str+=total.toString();
		return {
			total:total,
			str:str,
			suffix:suffix
		}
	}
	
	return {
		getRandomInt:getRandomInt,
		roll_a_die:roll_a_die,
		roll_dice:roll_dice,
		evalDiceExpr:evalDiceExpr,
		evalF:evalF
		
	}
})();