let user=(()=>{
	let user_data={};
	
	function setDefaultValue(){
		if(!user_data['user_name']){
			let name='USER_';
			let tl=Date.now().toString(36);
			tl=tl.substr(-6,6);
			name+=tl;
			set('user_name',name);
		}
	}
	
	function loadUserData(){
		let sou_data=storage.get('user_data');
		if(sou_data!=null){
			user_data=JSON.parse(sou_data);
		}
		setDefaultValue();
	}
	
	loadUserData();
	
	function saveUserData(){
		storage.set('user_data',JSON.stringify(user_data));
	}
	
	function set(k,v){
		user_data[k]=v;
		saveUserData();
	}
	
	function get(k){
		return user_data[k];
	}
	
	return {
		loadUserData:loadUserData,
		saveUserData:saveUserData,
		set:set,
		get:get
	}
})();