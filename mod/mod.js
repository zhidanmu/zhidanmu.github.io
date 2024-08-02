(function mod_import(){
	
	const mod_path='mod/{mod_name}.js';
	
	const mod_list=[
		'f7trpg'
	];
	
	for(let i=0;i<mod_list.length;i++){
		let script=document.createElement('script');
		script.src=mod_path.replace('{mod_name}',mod_list[i]);
		document.body.appendChild(script);
	}
	
	const css_path='mod/{mod_name}.css';
	
	const css_list=[
		'f7trpg'
	]
	
	for(let i=0;i<css_list.length;i++){
		let link_=document.createElement('link');
		link_.rel="stylesheet";
		link_.type="text/css";
		link_.href=css_path.replace('{mod_name}',css_list[i]);
		document.head.appendChild(link_);
	}
	
	
	
})();