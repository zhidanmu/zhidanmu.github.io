let cmd=(()=>{
	
	function _nn(nn){
		if(!nn)nn=user.get('user_name');
		let ret;
		ret=lan['change_name'].replace('{username1}',user.get('user_name')).replace('{username2}',nn);
		user.set('user_name',nn);
		return ret;
	}
	
	function _r(dexpr){
		let ret=dice.evalDiceExpr(dexpr);
		return ret;
	}
	
	function _link(param){
		id=param.replaceAll(/<\/?.+?\/?>/g,'');
		id=id.replaceAll(/&nbsp;/g,'');
		id=id.replaceAll(/\s/g,'');
		id=id.trim();
		//console.log(id);
		let ret=rtc.connect(id);
		return ret;
	}
	
	function handle(str){
		if(str.length<=0||str[0]!='.'){
			return str;
		}
		
		let not_cmd=true;
		let ret="";
		ret+="<span style='color:"+color_option.user_op+";'>";
		
		if(str.substr(0,3)=='.nn'){
			ret+=_nn(str.substr(3).trim());
			not_cmd=false;
		}else if(str.substr(0,2)=='.r'){
			let dres=_r(str.substr(2).trim());
			ret+=dres.str;
			not_cmd=false;
		}else if(str.substr(0,5)=='.link'){
			let r=_link(str.substr(5).trim());
			ret+=r;
			not_cmd=false;
		}
		
		if(not_cmd){
			return str;
		}
		ret+="</span>";
		return ret;
	}
	
	return {
		handle:handle
	}
})();