;(function($){
	var defaults,
		ls=window.localStorage;
	init();
	function init(){
		initDate(new Date());
		renderCity();
		initCity();
	}
	//图片轮播
	var swipe=new Swipe(
		document.getElementById('index-slider'),
		{auto:3000}
	);
	//城市选择
	function getData(){
		var temp=[];
		for(var i=0;i<=25;i++){
			var obj=temp[i]={};
			obj.letter=String.fromCharCode(i+65);
			obj.list=[];
		}
		for(var i=0,len=cityList.length;i<len;i++){
			temp[cityList[i][1].charAt(0).toUpperCase().charCodeAt()-65].list.push(cityList[i])
		}
		return temp;
	}
	function renderCity(){
		var hot='<div class="city-item"><h5>热门</h5><ul>';;
		$.each(hotList,function(k,v){
			hot+='<li>'+v[0]+'</li>'
		})
		hot+='</ul></div>';
		var city='';
		$.each(getData(),function(key,val){
			if(val.list.length!=0){
				city+='<div class="city-item"><h5>'+val.letter+'</h5><ul>';
				$.each(val.list,function(k,v){
					city+='<li>'+v[0]+'</li>'
				})
				city+='</ul></div>'
			}
		})
		$('.city-list').html(hot+city)
	}
	$('.index-city').on('tap',function(){
		calendarShow('#city');
		var curCity=$(this).text();
		$('.city-cur').text(curCity);
	})
	$('.city-list').on('tap','li',function(){
		var selCity=$(this).text();
		$(this).addClass('on').siblings().removeClass('on');
		$('.index-city').text(selCity);
		ls.setItem('city',selCity);
		calendarHide('#city');
	})
	//城市列表搜索
	$('.index-btn').on('tap',function(){
		var inDate=$('#in-date').data('time'),
			outDate=$('#out-date').data('time');
			address=$('.index-city').text();
		location.href=encodeURI('hotelList.html?inDate='+inDate+'&&outDate='+outDate+'&&address='+address);
	})
	//默认城市，本地存储
	function initCity(){
		var city=ls.getItem('city');
		if(city){
			$('.index-city').text(city);
		}else{
			ls.setItem('city','');
		}
	}
})(Zepto)