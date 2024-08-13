let f7trpg=(()=>{
	function stderr(err){
		sys.chat_sys_err(err.toString());
		console.log(err);
	}
	
	function stdsys(txt){
		sys.chat_sys_info(txt);
	}
	
	let character_status={
		'gang':1,
		'ling':1,
		'qiao':1,
		'career':'战士',
		'HP':30,
		'ATK':1,
		'HLA':1,
		'DEX':1,
		'HD':8,
		'currentHP':30,
		'MPB':0,
		'MPchaos':0,
		'Wreck_lvl':0
	};
	
	function set_status(k,v){
		character_status[k]=v;
		save_status();
	}
	
	function get_status(k){
		return character_status[k];
	}
	
	function remove_status(k){
		delete character_status[k];
	}
	
	function save_status(){
		storage.set('f7trpg_status',JSON.stringify(character_status));
	}
	
	function load_status(){
		let sav=storage.get('f7trpg_status');
		if(sav){
			character_status=JSON.parse(sav);
		}
	}
	
	const career_attr_table={
		'战士':{
			HP:'PMA',
			ATK:'PMA',
			HLA:'NMA',
			DEX:'AMA',
			HD:'AMA'
		},
		'坦克':{
			HP:'PMA',
			ATK:'NMA',
			HLA:'NMA',
			DEX:'AMA',
			HD:'PMA'
		},
		'影袭':{
			HP:'NMA',
			ATK:'AMA',
			HLA:'NMA',
			DEX:'PMA',
			HD:'PMA'
		},
		'法师':{
			HP:'AMA',
			ATK:'PMA',
			HLA:'NMA',
			DEX:'NMA',
			HD:'AMA'
		},
		'射手':{
			HP:'AMA',
			ATK:'PMA',
			HLA:'NMA',
			DEX:'AMA',
			HD:'NMA'
		},
		'辅助':{
			HP:'AMA',
			ATK:'NMA',
			HLA:'PMA',
			DEX:'NMA',
			HD:'AMA'
		}
	}
	
	const attr_id_str="f7_status_{attr}";
	
	function gen_status_panel(){
		let sta=document.createElement('div');
		sta.classList.add('center_div');
		sta.classList.add('opa');
		sta.classList.add('black_border');
		sta.classList.add('status');
		
		sta.style.display='none';
		sta.id='f7_status';
		sta.innerHTML='<p>STATUS<p>';
		sta.tabIndex='0';	
		
		let attr_layout=[
			
			{
				attr:'gang',
				description:'刚',
				type:'number',
				min:'1',
				max:'99'
			},
			{
				attr:'ling',
				description:'灵',
				type:'number',
				min:'1',
				max:'99'
			},
			{
				attr:'qiao',
				description:'巧',
				type:'number',
				min:'1',
				max:'99'
			},
		
			{
				attr:'career',
				description:'职业',
				type:'datalist',
				options:[
					'战士','坦克','影袭','法师','射手','辅助'
				]
			},
			{
				attr:'calGA',
				description:'生成属性',
				type:'button',
				value:'计算',
				func:()=>{
					let gang=Number(character_status['gang']);
					let ling=Number(character_status['ling']);
					let qiao=Number(character_status['qiao']);
					let ma=[gang,ling,qiao];
					let pma=(ma.reduce((a, b) => Math.max(a, b), -Infinity));
					let nma=(ma.reduce((a, b) => Math.min(a, b), +Infinity));
					let ama=(gang+ling+qiao)-pma-nma;
					character_status['PMA']=pma;
					character_status['AMA']=ama;
					character_status['NMA']=nma;
					let career=$(attr_id_str.replace("{attr}",'career')).value;
					let career_data=career_attr_table[career];
					
					let ev = document.createEvent("HTMLEvents");
					ev.initEvent('change',false,true);
					
					if(!career_data){
						$(attr_id_str.replace("{attr}",'career')).value="战士";
						$(attr_id_str.replace("{attr}",'career')).dispatchEvent(ev);
					}
					
					let hp=20+10*Number(character_status[career_data['HP']]);
					let atk=Number(character_status[career_data['ATK']]);
					let hla=Number(character_status[career_data['HLA']]);
					let dex=Number(character_status[career_data['DEX']]);
					let hd=7+Number(character_status[career_data['HD']]);
					
					$(attr_id_str.replace("{attr}",'HP')).value=hp;
					$(attr_id_str.replace("{attr}",'ATK')).value=atk;
					$(attr_id_str.replace("{attr}",'HLA')).value=hla;
					$(attr_id_str.replace("{attr}",'DEX')).value=dex;
					$(attr_id_str.replace("{attr}",'HD')).value=hd;
					
					$(attr_id_str.replace("{attr}",'HP')).dispatchEvent(ev);
					$(attr_id_str.replace("{attr}",'ATK')).dispatchEvent(ev);
					$(attr_id_str.replace("{attr}",'HLA')).dispatchEvent(ev);
					$(attr_id_str.replace("{attr}",'DEX')).dispatchEvent(ev);
					$(attr_id_str.replace("{attr}",'HD')).dispatchEvent(ev);
					
				}
			},
			{
				attr:'HP',
				description:'HP上限',
				type:'number',
				min:'1',
				max:'999'
			},
			{
				attr:'ATK',
				description:'ATK',
				type:'number',
				min:'1',
				max:'99'
			},
			{
				attr:'HLA',
				description:'HLA',
				type:'number',
				min:'1',
				max:'99'
			},
			{
				attr:'DEX',
				description:'DEX',
				type:'number',
				min:'1',
				max:'99'
			},
			{
				attr:'HD',
				description:'HD',
				type:'number',
				min:'1',
				max:'99'
			},
			{
				attr:'currentHP',
				description:'当前生命值HP',
				type:'number',
				min:'1',
				max:'999'
			},
			{
				attr:'MPB',
				description:'幻力平衡值MPB',
				type:'number',
				min:'-1010',
				max:'+1010'
			},
			{
				attr:'MPchaos',
				description:'幻力紊乱点',
				type:'number',
				min:'0',
				max:'10'
			},
			{
				attr:'Wreck_lvl',
				description:'活骸化等级',
				type:'number',
				min:'0',
				max:'5'
			}
			
		];
		
		const wrap_position={'calGA':1,'HD':1,'MPB':1};
		
		for(let i=0;i<attr_layout.length;i++){
			let attr_obj=attr_layout[i];
			let label=document.createElement('label');
			label.innerHTML=attr_obj.description;
			label.classList.add('attr_label');
			let input=document.createElement('input');
			input.classList.add('input');
			input.id=attr_id_str.replace("{attr}",attr_obj.attr);
			let type=attr_obj.type;
			
			if(type=='number'){
				input.type='number';
				input.min=attr_obj.min;
				input.max=attr_obj.max;
				input.addEventListener('change',()=>{
					set_status(attr_obj.attr,Number(input.value));
				});
				input.value=character_status[attr_obj.attr];
			}else if(type=='datalist'){
				let datalist=document.createElement('datalist');
				datalist.id=attr_id_str.replace("{attr}",attr_obj.attr)+'_datalist';
				let options=attr_obj.options;
				for(let j=0;j<options.length;j++){
					let opt=document.createElement('option');
					opt.value=options[j];
					datalist.appendChild(opt);
				}
				label.appendChild(datalist);
				input.setAttribute('list',attr_id_str.replace("{attr}",attr_obj.attr)+'_datalist');
				input.addEventListener('change',()=>{
					set_status(attr_obj.attr,input.value);
				});
				input.value=character_status[attr_obj.attr];
			}else if(type=='button'){
				input.type='button';
				input.value=attr_obj.value;
				input.addEventListener('click',()=>{
					attr_obj.func();
				});
			}
			
			label.appendChild(input);
			sta.appendChild(label);
			
			if(wrap_position[attr_obj.attr]){
				let wrap_div=document.createElement('div');
				wrap_div.style.width='100%';
				sta.appendChild(wrap_div);
			}

		}
				
		document.body.appendChild(sta);
	}
	
	function _status(){
		$('f7_status').style.display='block';
	}
	
	function _chat(){
		$('f7_status').style.display='none';
	}
	
	function cal_atk(dp,coe,atk,a_2,a_5){
		
		const atk_table={
			'2':'{A/5}',
			'3':'{A/2}',
			'4':'{A/2}',
			'5':'max({ATK}-{A/5},1)',
			'6':'max({ATK}-{A/5},1)',
			'7':'{ATK}',
			'8':'{ATK}+{A/5}',
			'9':'{ATK}+{A/5}',
			'10':'{ATK}+{A/2}',
			'11':'{ATK}+{A/2}',
			'12':'{ATK}+{A/2}+{A/5}'
		}
		
		const cal_expr_str='{coe}*({rdexpr})';
		
		let str='';
		dp=dp.toString();
		let	rdexpr=atk_table[dp].replace('{ATK}',atk).replace('{A/2}',a_2).replace('{A/5}',a_5);
		let cal_expr=cal_expr_str.replace('{coe}',coe).replace('{rdexpr}',rdexpr);
		str+=cal_expr_str.replace('{coe}',coe).replace('{rdexpr}',atk_table[dp]);
		str+='=';
		str+=cal_expr;
		let total=dice.evalF(cal_expr.replaceAll('max','Math.max').replaceAll('min','Math.min'));
		str+='=';
		str+=total.toString();
		return {
			str:str,
			total:total
		};
	}	
	
	function _atk(arg){
		let coe=parseInt(arg);
		if(!coe)coe=1;
		let ret={str:''};
		
		let atk=character_status['ATK'];
		let a_2=Math.floor(atk/2);
		if(a_2==0)a_2=1;
		let a_5=Math.floor(atk/5);
		if(a_5==0)a_5=1;
		
		let rd=dice.evalDiceExpr('2d6');
		ret.str+=rd.str;
		ret.str+='<br>';
		ret.str+='[伤害]';
		let res=cal_atk(rd.total,coe,atk,a_2,a_5);
		ret.str+=res.str;
		ret.str+='<br>';
		ret.total=res.total;
		return ret;
	}
	
	function cal_hla(dp,coe,hla,h_2,h_5){
		
		const atk_table={
			'2':'{H/5}',
			'3':'{H/2}',
			'4':'{H/2}',
			'5':'max({HLA}-{H/5},1)',
			'6':'max({HLA}-{H/5},1)',
			'7':'{HLA}',
			'8':'{HLA}+{H/5}',
			'9':'{HLA}+{H/5}',
			'10':'{HLA}+{H/2}',
			'11':'{HLA}+{H/2}',
			'12':'{HLA}+{H/2}+{H/5}'
		}
		
		const cal_expr_str='{coe}*({rdexpr})';
		
		let str='';
		dp=dp.toString();
		let	rdexpr=atk_table[dp].replace('{HLA}',hla).replace('{H/2}',h_2).replace('{H/5}',h_5);
		let cal_expr=cal_expr_str.replace('{coe}',coe).replace('{rdexpr}',rdexpr);
		str+=cal_expr_str.replace('{coe}',coe).replace('{rdexpr}',atk_table[dp]);
		str+='=';
		str+=cal_expr;
		let total=dice.evalF(cal_expr.replaceAll('max','Math.max').replaceAll('min','Math.min'));
		str+='=';
		str+=total.toString();
		return {
			str:str,
			total:total
		};
	}	
	
	function _hla(arg){
		let coe=parseInt(arg);
		if(!coe)coe=1;
		let ret={str:''};
		
		let hla=character_status['HLA'];
		let h_2=Math.floor(hla/2);
		if(h_2==0)h_2=1;
		let h_5=Math.floor(hla/5);
		if(h_5==0)h_5=1;
		
		let rd=dice.evalDiceExpr('2d6');
		ret.str+=rd.str;
		ret.str+='<br>';
		ret.str+='[治疗]';
		let res=cal_hla(rd.total,coe,hla,h_2,h_5);
		ret.str+=res.str;
		ret.str+='<br>';
		ret.total=res.total;
		return ret;
	}
	
	function _hp(arg){
		let val=parseInt(arg);
		if(!val){
			return "当前HP："+character_status['currentHP'];
		}
		
		let fh=character_status['HP']-character_status['currentHP'];
		if(val>fh)val=fh;
		
		let ret='';
		ret+='[HP变更]';
		let res=character_status['currentHP']+val;
		ret+=character_status['currentHP']+'+('+val+')'+'='+res;
		if(val==fh){
			ret+='(已达上限)';
		}
		character_status['currentHP']=res;
		$(attr_id_str.replace('{attr}','currentHP')).value=res;
		ret+='<br>';
		ret+=_mp(-val);
		return ret;
	}
	
	function _mp(arg){
		let val=parseInt(arg);
		if(!val){
			return "当前MPB："+character_status['MPB'];
		}
		let ret='';
		ret+='[MPB变更]';
		let res=character_status['MPB']+val;
		ret+=character_status['MPB']+'+('+val+')'+'='+res;
		character_status['MPB']=res;
		$(attr_id_str.replace('{attr}','MPB')).value=res;
		ret+='<br>';
		save_status();
		return ret;
	}
	
	function _mpchaos(arg){
		let modv=parseInt(arg);
		if(modv){
			if(modv<0){
				let chaos=character_status['MPchaos'];
				if(-modv>chaos)modv=-chaos;
				let res=chaos+modv;
				let ret='[幻力紊乱点]{ov}-{val}={res}<br>'.replace('{ov}',character_status['MPchaos']).replace('{val}',-modv).replace('{res}',res);
				character_status['MPchaos']=res;
				$(attr_id_str.replace('{attr}','MPchaos')).value=res;
				save_status();
				return ret;
			}else{
				let ret='';
				let chaos=character_status['MPchaos'];
				let res=chaos+modv;
				ret+='[幻力紊乱点]{ov}+{val}={res}<br>'.replace('{ov}',character_status['MPchaos']).replace('{val}',modv).replace('{res}',res);
				if(res>=10){
					let lv=character_status['Wreck_lvl'];
					ret+='活骸化程度上升 LV{o}->LV{e}<br>'.replace('{o}',lv).replace('{e}',lv+1);
					character_status['Wreck_lvl']=lv+1;
					$(attr_id_str.replace('attr','Wreck_lvl')).value=lv+1;
					ret+='[幻力紊乱点]{o}->0<br>'.replace('{o}',res);
					character_status['MPchaos']=0;
					$(attr_id_str.replace('{attr}','MPchaos')).value=0;
				}else{
					character_status['MPchaos']=res;
					$(attr_id_str.replace('{attr}','MPchaos')).value=res;
				}
				save_status();
				return ret;
			}
		}
		let val=Math.floor(Math.abs(character_status['MPB'])/50);
		let ret='';
		ret+='当前MPB：{MPB}<br>'.replace('{MPB}',character_status['MPB']);
		if(val==0){
			ret+='[幻力紊乱点]{v}<br>'.replace('{v}',character_status['MPchaos']);
			ret+='未获得幻力紊乱点<br>';
		}else{
			let res=character_status['MPchaos']+val;
			ret+='[幻力紊乱点]{ov}+{val}={res}<br>'.replace('{ov}',character_status['MPchaos']).replace('{val}',val).replace('{res}',res);
			if(res>=10){
				let lv=character_status['Wreck_lvl'];
				ret+='!!!活骸化程度上升!!! LV{o}->LV{e}<br>'.replace('{o}',lv).replace('{e}',lv+1);
				character_status['Wreck_lvl']=lv+1;
			$(attr_id_str.replace('{attr}','Wreck_lvl')).value=lv+1;
				ret+='[幻力紊乱点]{o}->0<br>'.replace('{o}',res);
				character_status['MPchaos']=0;
				$(attr_id_str.replace('{attr}','MPchaos')).value=0;
			}else{
				character_status['MPchaos']=res;
				$(attr_id_str.replace('{attr}','MPchaos')).value=res;
			}
			save_status();
		}
		
		return ret;
	}
	
	function add_cmds(){
		cmd.set_handlers('f7trpg',[
			{
				cmd:'.status',
				func:(arg)=>{
					return _status();
				},
				description:"显示状态页面",
				not_send:true
			},
			{
				cmd:'.chat',
				func:(arg)=>{
					return _chat();
				},
				description:"显示聊天页面(关闭其他页面)",
				not_send:true
			},
			{
				cmd:'.atk',
				func:(arg)=>{
					return _atk(arg).str;
				},
				description:"使用.atk [技能伤害系数]快速投骰伤害"
			},
			{
				cmd:'.hla',
				func:(arg)=>{
					return _hla(arg).str;
				},
				description:"使用.hla [技能治疗系数]快速投骰治疗"
			},
			{
				cmd:'.hp',
				func:(arg)=>{
					return _hp(arg);
				},
				description:"使用.hp [+/-生命值]更改生命值"
			},
			{
				cmd:'.mpchaos',
				func:(arg)=>{
					return _mpchaos(arg);
				},
				description:"使用.mpchaos [+/-数值]变更幻力紊乱值，不填写参数自动根据当前幻力计算当前幻力紊乱值"
			},
			{
				cmd:'.mp',
				func:(arg)=>{
					return _mp(arg);
				},
				description:"使用.mp [+/-幻力平衡值]更改幻力平衡值"
			}
		]);
	}
	
	function init(){
		load_status();
		gen_status_panel();
		dice.set_default_dice_num(2);
		dice.set_default_dice_type(6);
		add_cmds();
		$('menu_div').innerHTML='F7TRPG';
		document.title='F7TRPG';
		sys.chat_sys_info('f7trpg模块已加载');
	}
	
	return {
		init:init,
		set_status:set_status,
		get_status:get_status,
		remove_status:remove_status
	}
	
})();

f7trpg.init();