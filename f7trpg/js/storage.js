let storage=(()=>{
	
	function set(k,v){
		return localStorage.setItem(k,v);
	}
	
	function get(k){
		return localStorage.getItem(k);
	}
	
	function remove(k){
		return localStorage.removeItem(k);
	}
	
	function clear(){
		return localStorage.clear();
	}
	
	return {
		set:set,
		get:get,
		remove:remove,
		clear:clear		
	}
})();