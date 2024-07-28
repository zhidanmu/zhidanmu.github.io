let rtc=(()=>{
	let conns={};
	
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
	
	function add_conn(conn){
		conns[conn.label]=conn;
	}
	
	function remove_conn(conn){
		if(conns[conn.label]){
			delete conns[conn.label];
		}
	}
	
	
	function set_connection(conn,remote_name){
		conn.on('open',()=>{
			add_conn(conn);
			stdsys(lan['connect_to'].replace('{id}',remote_name));
			
			conn.on('data',(data)=>{
				let txt=JSON.parse(data);
				stdout(txt);
				transmit(conn,data);
			});
			
		});
		conn.on('error',(err)=>{
				stderr(err);
			});
			
		conn.on('close',()=>{
			stdsys(lan['close_connection_to'].replace('{id}',conn.metadata['user_name']));
			remove_conn(conn);
		});
	}
	
	
	
	let peer=new Peer();
	
	peer.on('open',(id)=>{
		stdsys(lan['peer_id'].replace('{id}',id));	
	});
	
	peer.on('error',(e)=>{
		stderr(e);
	});
	
	peer.on('connection',(conn)=>{
		set_connection(conn,conn.metadata['user_name']);
	});
	
	peer.on('disconnect',()=>{
		stdout(lan['lost_server_connection']);
	});
	
	function get_id(){
		return peer.id;
	}
	
	function connect(id){
		let conn=peer.connect(id,{metadata:{'user_name':user.get('user_name')}});
		set_connection(conn,'HOST');
		return lan['try_to_connect'].replace('{id}',id);
	}
	
	function disconnect(){
		peer.disconnect();
	}
	
	function reconnect(){
		peer.reconnect();
	}
	
	function destroy(){
		peer.destroy();
	}
	
	function send(message){
		for(let i in conns){
			nc=conns[i];
			if(nc.open){
				nc.send(message);
			}
		}	
	}
	
	function transmit(conn,message){
		for(let i in conns){
			let nc=conns[i];
			if(nc.label!=conn.label&&nc.open){
				nc.send(message);
			}
		}
	}
	
	return {
		get_id:get_id,
		disconnect:disconnect,
		reconnect:reconnect,
		connect:connect,
		destroy:destroy,
		send:send,
		transmit:transmit
		
	}
})();