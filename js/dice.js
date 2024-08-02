let dice=(()=>{
	
	let default_dice_type=6;
	let default_dice_num=1;
	
	function set_default_dice_type(type){
		default_dice_type=type;
	}
	
	function set_default_dice_num(num){
		default_dice_num=num;
	}
	
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
		let simple_mode=false;
		let dsets={};
		if(num>10){
			simple_mode=true;
		}
		
		for(let i=0;i<num;i++){
			let res=roll_a_die(dice_type);
			total+=res.total;
			if(!simple_mode){
				str+=res.str;
				str+='+';
			}else{
				if(dsets[res.total]){
					dsets[res.total]++;
				}else{
					dsets[res.total]=1;
				}
			}
		}
		
		if(simple_mode){
			for(let i in dsets){
				str+=i.toString();
				str+='*';
				str+=dsets[i].toString();
				str+='+';
			}
		}
		
		str=str.substr(0,str.length - 1);
	
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
	
	function evalMultiDiceExpr(expr){
		let multiDiceExprReg=/((\d)+#)?(((\d)*d(\d)*)|(\d)*)((\+|-|\*|\/)((((\d)*d(\d)*)|(\d)*)))*/g;
		let dexpr=expr.match(multiDiceExprReg);
		if(!dexpr||dexpr.length<=0||!dexpr[0]){
			throw new Error(lan['cmd_error']);
		}
		dexpr=dexpr[0];
		let suffix=expr.replace(dexpr,'');
		let times=expr.match(/((\d)+#)/);
		if(times&&times.length>0){
			times=times[1];
			dexpr=dexpr.replace(times,'').trim();
			times=Number(times.substr(0,times.length-1));
			let str='';
			let total=[];
			for(let i=0;i<times;i++){
				let sexpr=evalDiceExpr(dexpr);
				str+=sexpr.str;
				str+='<br>';
				total.push(sexpr.total);
			}
			return {
				str:str,
				suffix:suffix,
				total:total
			}
		}
		return evalDiceExpr(dexpr);
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
		
		if(mexpr.length<400){
			str+='=';
			str+=mexpr;
		}
		
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
		evalMultiDiceExpr:evalMultiDiceExpr,
		evalF:evalF,
		set_default_dice_num:set_default_dice_num,
		set_default_dice_type:set_default_dice_type
	}
})();