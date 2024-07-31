let lan=(()=>{
	let lans={
		'zh':{
			'double_enter_send':'下方输入框可双击回车发送消息',
			'roll_dice':'[掷骰]',
			'cmd_error':'指令解析失败',
			'change_name':'{username1}更名为{username2}',
			'fail_to_send':'发送失败',
			'init_info':'当前用户名:{username}<br>下方输入框可双击回车发送消息<br>本网页使用PeerJS框架实现WebRTC',
			'connection_failed':'连接失败',
			'peer_id':'本机id为:{id}<br>主机可使用 .link [参与者id] 连接其他参与者<br>主机会广播消息，请勿互相连接',
			'lost_server_connection':'失去服务器连接',
			'connect_to':'已与{id}建立连接',
			'close_connection_to':'与{id}的连接已断开',
			'try_to_connect':'尝试与{id}建立连接中...',
			'reconnect':'尝试重连服务器...',
			'disconnect':'已断开与服务器的连接',
			'peer':'请先使用 .peer [想使用的id] 来申请连接id',
			'try_use_peer_id':'尝试申请{id}中...',
			'rxnum':'<span style="color:{color};"> @{num}</span>',
			cmd_description:{
				'.nn':'.nn [名字]来修改自己名字',
				'.peer':'.peer [id]来向服务器申请id',
				'.link':'.link [目标id] 来连接其他id',
				'.disconnect':'断开与服务器连接（但保留已建立链接）',
				'.reconnect':'重新连接服务器',
				'.r':'投骰指令,.r2d6代表投掷两枚六面骰',
				'.help':'帮助指令, .help [指令名]来查看其他指令'
			},
			'no_cmd':'无此指令',
			'help':'使用.help查看帮助中...',
			'description':'{cmd}>>>{description}'
		}
	}
	
	let ret=lans['zh'];
	
	let paramsStr = window.location.search
	let params = new URLSearchParams(paramsStr)
	let lp=params.get('lan');
	ret=lans[lp];
	if(ret==undefined){
		ret=lans['zh'];
	}

	return ret;
})();