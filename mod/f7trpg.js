let f7trpg=(()=>{
	function stderr(err){
		sys.chat_sys_err(err.toString());
		console.log(err);
	}
	
	function stdsys(txt){
		sys.chat_sys_info(txt);
	}
	
	
	function init(){
		sys.chat_sys_info('f7trpg模块已加载');
	}
	
	return {
		init:init
	}
	
})();

f7trpg.init();