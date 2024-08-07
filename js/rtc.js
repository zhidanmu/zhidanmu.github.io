let rtc=(()=>{
	
	function make_id(){
		let prefix='f7';
		let name=user.get('user_name');
		let suffix=Date.now().toString(36).substr(-4);
		
		return (prefix+'-'+name+'-'+suffix);
	}
	
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
	
	
	let peer=null;
	
	let conns={};
	
	function add_conn(conn){
		if(conn)conns[conn.label]=conn;
	}
	
	function remove_conn(conn){
		if(conn){
			console.log(conn.peer+' lost signal');
			delete conns[conn.label];
			conn.close();
		}
	}
	
	window.addEventListener('beforeunload',(event)=>{
		if(peer){
			peer.destroy();
		}
	});
	
	function set_connection(conn,remote_name){
		if(!conn)return;
		
		conn.on('open',()=>{
			add_conn(conn);
			stdsys(lan['connect_to'].replace('{id}',remote_name));
			
			conn.on('data',(data)=>{
				//console.log(data);
				if(!data['type']){
					return;
				}
				
				if(data['type']=='text'){
					stdout(data);
					if(!data['transmit']){	
						data['transmit']=true;
						transmit(conn,data);
					}
					return;
				}
				
				
			});
			
		});
		
		conn.on('error',(err)=>{
			stderr(err);
			remove_conn(conn);
		});
			
		conn.on('close',()=>{
			stdsys(lan['close_connection_to'].replace('{id}',remote_name));
			remove_conn(conn);
		});
	}
	
	function peer_init(id){
		if(!id||id==''){
			id=make_id();
			peer=new Peer(id);
		}else{
			peer=new Peer(id);
		}
		
		peer.on('open',(id)=>{
			stdsys(lan['peer_id'].replace('{id}',id));	
		});
		
		peer.on('error',(e)=>{
			stderr(e);
			for(let i in conns){
				remove_conn(conns[i]);
			}
		});
		
		peer.on('connection',(conn)=>{
			set_connection(conn,conn.metadata['offer_user_name']);
		});
		
		peer.on('disconnect',()=>{
			stderr(lan['lost_server_connection']);
		});
		
		return lan['try_use_peer_id'].replace('{id}',id);
	}
	
	function get_id(){
		return peer.id;
	}
	
	function connect(id){
		if(!peer){
			return lan['peer'];
		}
		let conn=peer.connect(id,{metadata:{'offer_user_name':user.get('user_name')},serialization:'json'});
		set_connection(conn,id);
		return lan['try_to_connect'].replace('{id}',id);
	}
	
	function disconnect(){
		if(peer){
			peer.disconnect();
			return lan['disconnect'];
		}
		return lan['peer'];
	}
	
	function reconnect(){
		if(peer){
			peer.reconnect();
			return lan['reconnect'];
		}
		return lan['peer'];
	}
	
	function destroy(){
		peer.destroy();
	}
	
	function send(message){
		let num=0;
		message['type']='text';
		for(let i in conns){
			nc=conns[i];
			if(nc.open){
				nc.send(message);
				num++;
			}
		}
		return num;
	}
	
	function transmit(conn,message){
		let num=0;
		for(let i in conns){
			let nc=conns[i];
			if(nc.label!=conn.label&&nc.open){
				nc.send(message);
				num++;
			}
		}
		return num;
	}
	
	return {
		peer_init:peer_init,
		get_id:get_id,
		disconnect:disconnect,
		reconnect:reconnect,
		connect:connect,
		destroy:destroy,
		send:send,
		transmit:transmit
	}
})();