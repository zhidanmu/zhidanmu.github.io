(
()=>{
	let enter_timestamp=0;
	sys.input_div_addEventListener('keydown',(event)=>{
		if(event.keyCode==13){
			let timestamp=Date.now();
			if(timestamp-enter_timestamp<500){
				let content=input_div.innerHTML;
				content=content.replaceAll('<div>','<br>');
				content=content.replaceAll('</div>','');
				content=content.replaceAll('<br>','\n');
				content=content.trim();
				if(content!=""){
					try{
						let str=cmd.handle(content);
						
						let message_obj={speaker:user.get('user_name'),text:str,text_color:color_option.text,speaker_color:color_option.user,time:(new Date().toLocaleString())}
						
						rtc.send(JSON.stringify(message_obj));
						sys.chat_print(message_obj);
						
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