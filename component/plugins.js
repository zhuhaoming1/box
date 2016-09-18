//公用功能
//转化为页面中的"xxxx年xx月xx日"格式
var defaults;
function domFormat(d,f){
	var year=d.getFullYear(),
		month=d.getMonth(),
		day=d.getDate(),
		str;
	if(f){
		str=year+"年"+(month+1)+'月'+day+'日';
	}else{
		str=(month+1)+'月'+day+'日';
	}
	return str;
}
//转化为日期"xxxx,xx,xx"格式
function dateFormat(str){
	var d=str.replace(/年/,',').replace(/月/,',').replace(/日/,'')
	console.log(d)
}
//显示
function calendarShow(ele){
	$(ele).css({
		'transform':'translate3d(0,0,0)',
		'transition':'.2s'
	})
}
//隐藏
function calendarHide(ele){
	$(ele).css({
		'transform':'translate3d(100%,0,0)',
		'transition':'.2s'
	})
}
//日期的设置
function initDate(d){
	var inDate=domFormat(d,false),
		outDate=domFormat(new Date(d.getTime()+86400000),false),
		_outDate=new Date(d.getTime()+86400000);
	$('#in-date').text(inDate).attr('data-time',d);
	$('#out-date').text(outDate+"（1晚）").attr('data-time',_outDate);
}
//转化地址栏信息
function getSearchMsg(str,sign1,sign2){
	var msg={};
	$.each(str.split(sign1),function(k,v){
		var arr=v.split(sign2)
		msg[arr[0]]=arr[1]
	})
	return msg;
}
/*--------------------------------日历--------------------------------------*/
var calendar=new Calendar({
	wrap:'.calendar'
});
$('#in-date').tap(function(){
	calendarShow('#calendar');
	var selDate=$(this).data('time');
	calendar.render(new Date(selDate));
	defaults='in';
})
$('#out-date').tap(function(){
	calendarShow('#calendar');
	var selDate=$(this).data('time');
	calendar.render(new Date(selDate));
	defaults='out';
})
$('#calendar').on('tap','.back',function(){
	calendarHide('#calendar');
})
$('.over').on('tap',function(){
	var newDate=calendar.newDate(),
		newTime=new Date(newDate).getTime();
	if(!newTime){
		$.dialog({
		    title:'请选择日期',
		    close:'',
		    msg:'请选择日期哦',
		    btn:[
		            {text:'确定',className:'ok'}
		        ]
		})
		return;
	}
	if(defaults=='in'){
		initDate(new Date(newDate));
	}else if(defaults=='out'){
		var inDate=new Date($('#in-date').data('time')),
			span=newTime-new Date(inDate.getFullYear(),inDate.getMonth(),inDate.getDate()).getTime(),
			day=Math.ceil(span/60/60/24/1000);
		if(span<0){
			$.dialog({
			    title:'请选择正确日期',
			    close:'',
			    msg:'离店日不能早于入住日哦，请重新选择',
			    btn:[
			            {text:'确定',className:'ok'}
			        ]
			})
			return;
		}else{
			var out=domFormat(new Date(newDate),false);
			$('#out-date').text(out+"（"+day+"晚）").attr('data-time',newDate);
		} 
	}
	calendarHide('#calendar');
})

/*----------------------------loading------------------------------------*/
function loading(wrap){
	var str=$('<div class="mask-loading mask"><span class="load  icon-spinner"></span></div>');
	$(wrap).append(str);
}
function loaded(wrap){
	$(wrap).find('.mask-loading').remove();
}
var seachMsg=decodeURI(window.location.search).substr(1),
		msg=getSearchMsg(seachMsg,'&&','='),
		inD=domFormat(new Date(msg.inDate)),
		outD=domFormat(new Date(msg.outDate)),
		data=null;
	//设置初始日期
	$('#in-date').text(inD).attr('data-time',msg.inDate);
	$('#out-date').text(outD).attr('data-time',msg.outDate);

function Tab(wrap){
	this.wrap=document.querySelector(wrap);
	this.tab();
}
Tab.prototype.tab=function(){
	$(this.wrap).on('tap','.tab-title',function(){
		var idx=$(this).index();
		console.log(idx)
		$(this).addClass('on').siblings().removeClass('on');
		$('.tab-item-wrap').css({
			'margin-left':-idx*100+'%',
			'transition':'.3s ease'
		})
	})
}
/*----------------------------book------------------------------------*/
$.slideSelect=function(opt){
	var defaults={
			data:[],
			title:'',
			parentDom:'',
			callBack:function(data){
			}
			
	}
	var settings=$.extend({},defaults,opt);
	createDom();
	addEvent();
	
	function createDom(){
		var str="<h4 class='tit'>"+settings.title+"<span class='close'>×</span></h4>";
		$.each(settings.data,function(k,v){
			if(k==settings.valDom.data('idx')){
				str+="<p data-id="+k+" class='on'>"+v+"</p>"
			}else{
				str+="<p data-id="+k+">"+v+"</p>"
			}
		})
		$('body').append($('<div class="book-mask mask"></div>'));
		settings.parentDom.html(str);
		show();
	}
	function addEvent(){
		settings.parentDom.on('click','p',function(){
			$(this).addClass('on').siblings().removeClass('on');
			var val=$(this).text(),
				idx=$(this).index();
			settings.valDom.text(val).data('idx',(idx-1))
			settings.callback &&　settings.callback(val);
			hide();
		}).on('click','.close',function(){
			hide();
		})
	}
	function show(){
		settings.parentDom.css({
			'transform':"translate3d(0,0,0)",
			'transition':'.3s'
		});
	}
	function hide(){
		settings.parentDom
		.css({
			'transform':"translate3d(0,100%,0)",
			'transition':'.3s'
		}).on('webkitTransitionEnd',function(){
			$('.book-mask').remove();
			settings.parentDom.off('webkitTransitionEnd')
		})		
	}
}