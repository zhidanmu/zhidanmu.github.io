let cmd=(()=>{
	
	function match_cmd(str,cmd){
		if(str.substr(0,cmd.length)==cmd){
			return true;
		}
		return false;
	}
	
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
	
	function _disconnect(){
		return rtc.disconnect();
	}
	
	function _reconnect(){
		return rtc.reconnect();
	}
	
	function handle(str){
		if(str.length<=0||str[0]!='.'){
			return str;
		}
		let cmd_res="";
		
		if(match_cmd(str,'.nn')){
			cmd_res=_nn(str.substr(3).trim());
		}else if(match_cmd(str,'.link')){
			let r=_link(str.substr(5).trim());
			cmd_res=r;
		}else if(match_cmd(str,'.disconnect')){
			cmd_res=_disconnect();
		}else if(match_cmd(str,'.reconnect')){
			cmd_res=_reconnect();
		}else if(match_cmd(str,'.r')){
			let dres=_r(str.substr(2).trim());
			cmd_res=dres.str;
		}else{
			return str;
		}
		
		
		
		let ret="";
		ret+="<span style='color:"+color_option.user_op+";'>";
		ret+=cmd_res;
		ret+="</span>";
		return ret;
	}
	
	return {
		handle:handle
	}
})();