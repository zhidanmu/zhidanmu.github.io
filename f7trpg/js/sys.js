
let sys=(function(){
	const chat_div=document.getElementById("chat_div");
	const input_div=document.getElementById("input_div");
	const menu_div=document.getElementById("menu_div");
	
	let chat_div_focus=0;
	chat_div.addEventListener("focus",(event)=>{
		chat_div_focus=1;
	});
	chat_div.addEventListener("blur",(event)=>{
		chat_div_focus=0;
	});
	
	
	function chat_print({speaker='default_speaker',speaker_color=color_option.user,text='default_text',text_color=color_option.text,time=(new Date().toLocaleString())}){
		text=text.replaceAll('\n','<br>');
		let p=document.createElement("p");
		let sp=document.createElement('div');
		let tx=document.createElement('div');
		
		sp.style.color=speaker_color;
		sp.innerHTML=speaker+'  '+time;
		tx.style.color=text_color;
		tx.innerHTML=text;
		p.appendChild(sp);
		p.appendChild(tx);
		
		chat_div.appendChild(p);
		if(chat_div_focus==0){
			chat_div.scrollTop = chat_div.scrollHeight;
		}
	}
	
	function chat_sys_info(txt){
		chat_print({speaker:'-SYSTEM-',text:txt,text_color:color_option.sys,speaker_color:color_option.sys,time:(new Date().toLocaleString())});
	}
	
	function chat_sys_err(txt){
		chat_print({speaker:'-ERROR-',text:txt,text_color:color_option.err,speaker_color:color_option.err,time:(new Date().toLocaleString())});
	}
	
	function input_div_addEventListener(e,func){
		input_div.addEventListener(e,func);
	}
		
	(()=>{
		function setVH() {
		  let VH = window.innerHeight / 100;
		  document.documentElement.style.setProperty('--vh', VH + 'px');
		}
		let i = 'orientationchange' in window ? 'orientationchange' : 'resize';
		document.addEventListener('DOMContentLoaded', setVH);
		window.addEventListener(i,setVH);
	})();
	

	return {
		chat_print:chat_print,
		chat_sys_info:chat_sys_info,
		chat_sys_err:chat_sys_err,
		input_div_addEventListener:input_div_addEventListener
	}
})();


