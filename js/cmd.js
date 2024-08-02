let cmd=(()=>{
	
	function stdout(txt){
		sys.chat_print(txt);
	}
	
	function stderr(err){
		sys.chat_sys_err(err.toString());
		console.log(err);
	}
	
	function stdsys(txt){
		sys.chat_sys_info(txt);
	}
	
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
		let ret=dice.evalMultiDiceExpr(dexpr);
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
	
	function _peer(id){
		let ret=rtc.peer_init(id);
		return ret;
	}
	
	function _disconnect(){
		return rtc.disconnect();
	}
	
	function _reconnect(){
		return rtc.reconnect();
	}
	
	function _help(arg){
		if(arg){
			for(let k in handers){
				let h_=handers[k];
				for(let i=0;i<h_.length;i++){
					if(h_[i].cmd==arg||h_[i].cmd.substr(1)==arg){
						stdsys(lan['description'].replace('{cmd}',h_[i].cmd).replace('{description}',h_[i].description));
						return lan['help'];
					}
				}
			}
			stdsys(lan['no_cmd']);
			return lan['help'];
		}
		
		let ret='';
		for(let k in handers){
			let h_=handers[k];
			ret+="----"+k+"----<br>";
			for(let i=0;i<h_.length;i++){
				ret+=(lan['description'].replace('{cmd}',h_[i].cmd).replace('{description}',h_[i].description));
				ret+='<br>';
			}
		}
		stdsys(ret);
		return lan['help'];
	}
	
	
	let handers={
		common:[
		{
			cmd:'.help',
			func:(arg)=>{
				let ret=_help(arg);
				return ret;
			},
			description:lan.cmd_description['.help'],
			not_send:true//do not send results to other peers
		},
		{
			cmd:'.nn',//cmd
			func:(arg)=>{
				return _nn(arg);
			},//handle function
			description:lan.cmd_description['.nn']//description of .help
		},
		{
			cmd:'.peer',
			func:(arg)=>{
				return _peer(arg);
			},
			description:lan.cmd_description['.peer']
		},
		{
			cmd:'.link',
			func:(arg)=>{
				return _link(arg);
			},
			description:lan.cmd_description['.link']
		},
		{
			cmd:'.disconnect',
			func:(arg)=>{
				return _disconnect();
			},
			description:lan.cmd_description['.disconnect']
		},
		{
			cmd:'.reconnect',
			func:(arg)=>{
				return _reconnect();
			},
			description:lan.cmd_description['.reconnect']
		},
		{
			cmd:'.r',
			func:(arg)=>{
				let ret=_r(arg);
				return ret.str;
			},
			description:lan.cmd_description['.r']
		}
	]};
	
	function get_all_handlers(){
		return handers;
	}
	
	function set_handlers(k,v){
		handers[k]=v;
	}
	
	function remove_handlers(k){
		delete handers[k];
	}
	
	function handle(str){
		let ret={str:'',not_send:false};
		if(str.length<=0||str[0]!='.'){
			ret.str=str;
			return ret;
		}
		let cmd_res="";
		let parsed=false;
		for(let k in handers){
			let handers_=handers[k];
			for(let i=0;i<handers_.length;i++){
				let hldr=handers_[i];
				if(match_cmd(str,hldr.cmd)){
					cmd_res=hldr.func(str.substr(hldr.cmd.length).trim());
					parsed=true;
					if(hldr.not_send){
						ret.not_send=true;
					}
					break;
				}
			}
			if(parsed){
				break;
			}
		}
		if(!parsed){
			ret.str=str;
			return ret;
		}
		
		ret.str+="<span style='color:"+color_option.user_op+";'>";
		ret.str+=cmd_res;
		ret.str+="</span>";
		return ret;
	}
	
	return {
		handle:handle,
		get_all_handlers:get_all_handlers,
		set_handlers:set_handlers,
		remove_handlers:remove_handlers
	}
})();