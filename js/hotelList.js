;(function($){
	$('.over').on('tap',function(){
		var val=$('#out-date').text().split('（')[0];
		$('#out-date').text(val);
		loading('.hotel');
		getData();
	})
	//返回首页
	$('#hotelList').on('tap','.back',function(){
		location.href='index.html'
	})
	//加载动画
	loading('.hotel');
	//请求数据
	getData();
	function getData(){
		setTimeout(function(){
			$.ajax({
				url:'hotel.json',
				data:{},
				dataType:'json',
				type:"post",
				success:function(e){
					data=e.result.hotel_list;
					renderHotel(data);
					loaded('.hotel');
				}
			})
		},1000)	
	}
	//渲染数据
	function renderHotel(d){
		var str='';
		$.each(d,function(k,v){
				str+="<li class='hotel-item clear' data-id='"+v.hotel_id+"' data-dis='"+v.distance+"'>"+
                    "<div class='hotel-img'><img src='"+v.image+"' alt=''></div>"+
                    "<div class='hotel-info'>"+
                        "<p class='title'>"+v.name+"</p>"+
                        "<p class='score-box'><span class='score'>4.7分</span><span class='gifts'><em>礼</em><em>促</em><em>返</em></span><span class='price'><em>￥"+v.low_price/100+"</em>起</span></p>"+
                        "<p class='star-box'><span class='star'>"+v.stars+"</span></p>"+
                        "<p class='address'>"+v.addr+"<span class='range'>"+v.distance/1000+"km</span></p>"+
                    "</div></li>"
		})
		//str+='<li class="hotel-item"></li>'
		$('.hotel-list').append(str);
		//iscroll
		var iscroll=new IScroll('.iscroll-wrap',{
			click:true
		});
	}
	//底部菜单栏
	function FooterBar(data){
		this.data=data.brand;
		this.init();
		//this.wrap=document.querySelector(wrap);
	}
	FooterBar.prototype={
		tpl:{
			star:['二星以下/经济型','三星','四星','五星','六星'],
			price:['100元以下','100元-200元','200元-300元','300元以上'],
			range:['由远到近','由近到远'],
			brand:null
		},
		init:function(){
			this.brandRender();
			this.render();
			this.addEvent();
		},
		addEvent:function(data){
			var that=this;
			$('.footer-bar').on('click','li',function(){
				if(that.val=='range'){
					var newList;
					console.log(that.sortArr())
					$(this).addClass('checked').siblings().removeClass('checked');
					var flag=$(this).data('flag');
					if(flag==2){
						newList=that.sortArr().reverse();
					}else if(flag==1){
						newList=that.sortArr();
					}
					var str='';
					$.each(newList,function(key,val){
						str+=val.dom.outerHTML;
					})
					$('.hotel-list').html(str);
					that.hide();
				}else{
					if($(this).hasClass('checked')){
						$(this).removeClass('checked');
					}else{
						$(this).addClass('checked');
					}
					if($(this).hasClass('unlimited') || this.val=='range'){
						$(this).addClass('checked').siblings().removeClass('checked');
					}else{
						$('.unlimited').removeClass('checked');
					}
				}
			})

		},
		mask:function(){
			var that=this;
			$('.footer-bar-mask').on('click',function(){
				that.hide();
			})
		},
		brandRender:function(){
			this.tpl.brand=this.data;
		},
		show:function(val){			
			this.val=val;
			$('.footer-bar-mask').remove();
			$('body').append('<div class="mask footer-bar-mask"></div>');
			$('.footer-bar').addClass('bar-show').removeClass('bar-hide');
			this.mask();
			$('.footer-bar').find('.'+val).show().siblings().hide();
		},
		hide:function(){
			$('.footer-bar').addClass('bar-hide').removeClass('bar-show');
			$('.footer-bar-mask').remove();
			$('.footer').find('span').removeClass('on');
		},
		render:function(){
			var str='';
			$.each(this.tpl,function(k,v){
				str+="<ul class='bar "+k+"'><li class='unlimited checked clear'  data-flag=0><span class='check-item left'>不限</span><span class='right checkbox'></li>";
				$.each(v,function(key,val){
					str+="<li data-flag='"+(key+1)+"' class='clear'><span class='check-item left'>"+val+"</span><span class='right checkbox'></li>";
				})
				str+='</ul>'
			})
			$('.footer-bar').html(str)
		},
		sortArr:function(){
			var arr=[],
				hotels=$('.hotel').find('li');
			$.each(hotels,function(key,val){
				arr.push({
					dis:$(this).attr('data-dis'),
					dom:this
				})
			})
			arr.sort(function(a,b){
				if(a.dis*1>b.dis*1){
					return -1;
				}else if(a.dis*1<b.dis*1){
					return 1;
				}else{
					return 0;
				}
			})
			return arr;
		}
	}
	var footerBar=new FooterBar({brand:['汉庭酒店','假日山水酒店','四季酒店','驿家365']});
	$('.footer').on('tap','span',function(){
		if($(this).hasClass('on')){
			$(this).removeClass('on');
		}else{
			$(this).addClass('on').siblings().removeClass('on');
		}
		if($('.footer').find('.on').size()>0){
			footerBar.show($(this).data('val'))
		}else{
			footerBar.hide();
		}
	})
	$('.hotel-list').on('tap','.hotel-item',function(){
		var inDate=$('#in-date').data('time'),
			outDate=$('#out-date').data('time'),
			id=$(this).data('id');
		location.href=encodeURI('detail.html?inDate='+inDate+'&&outDate='+outDate+"&&id="+id);
	})
})(Zepto)