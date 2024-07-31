(
()=>{
	let enter_timestamp=0;
	sys.input_div_addEventListener('keydown',(event)=>{
		if(event.keyCode==13){
			let timestamp=Date.now();
			if(timestamp-enter_timestamp<500){
				let content=input_div.innerHTML;
				content=content.replaceAll('&nbsp;',' ');
				content=content.replaceAll('<div>','<br>');
				content=content.replaceAll('</div>','');
				content=content.replaceAll('<br>','\n');
				if(content!=""){
					try{
						let cmd_res=cmd.handle(content.trim());
						let str=cmd_res.str;
						let not_send=cmd_res.not_send;
						
						if(!not_send){
							let message_obj={speaker:user.get('user_name'),text:str,text_color:color_option.text,speaker_color:color_option.user,time:(new Date().toLocaleString())}
							
							let num=rtc.send(message_obj);
							message_obj['text']=message_obj['text']+lan['rxnum'].replace('{num}',num).replace('{color}',color_option['rxnum']);
							sys.chat_print(message_obj);
						}
						
					}catch(e){
						console.log(e);
						alert(e);
					}
					input_div.innerHTML="";
				}
				event.preventDefault();
			}
			enter_timestamp=timestamp;
			return false;
		}
	});
}
)();