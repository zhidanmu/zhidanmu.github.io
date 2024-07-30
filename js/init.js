
(()=>{
	$('chat_panel').style.display='block';
	
	sys.chat_sys_info(lan['init_info'].replace('{username}',user.get('user_name'))+ '<br>'+lan['peer']);
})();