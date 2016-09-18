;(function($){
	//日历的完成按钮
	$('.over').on('tap',function(){
		var val=$('#out-date').text().split('（')[0];
		$('#out-date').text(val);
	})
	//返回详情页
	var detailMsg=decodeURI(window.location.search).substr(1),	
		detailMsg=getSearchMsg(detailMsg,'&&','='),
		detailId=detailMsg.id;
	$('#detail').on('click','.back',function(){
		var url=location.href=encodeURI('hotelList.html?inDate='+detailMsg.inDate+'&&outDate='+detailMsg.outDate);
	})
	//选项卡
	var detailTab=new Tab('.detail-tab');
	getDetailDate();
	function getDetailDate(){
		$.ajax({
			url:'hotelDetail.json',
			data:{id:detailId},
			type:'post',
			dataType:'json',
			success:function(e){
				var detailData=e.result,
					star=['二星以下/经济型酒店','三星酒店','四星酒店','五星酒店','六星酒店'];
				var str='<div class="detail-tab-item tab-item">'+
                    '<h3 class="name">'+detailData.name+'</h3>'+
                    '<p>星级：'+star[detailData.star-1]+'</p>'+
                    '<p>电话：'+detailData.tel+'</p>'+
                    '<p>地址：'+detailData.addr+'</p>'+
                '</div>'+
                '<div class="detail-tab-item tab-item">'+
                    '<div class="article">'+
                        '<article>'+detailData.desc+'</article>'+        
                    '</div>'+                    
                '</div>'
               $('.detail-tab-item-wrap').html(str);
               /*<section class="room-type">
                    <div class='room-charactor'><p>标准大床房</p><p><span>大床</span><span>无早</span></p></div>
                    <div class='room-price'>￥320</div>
                    <div class='room-btn'>预订</div>
                </section>*/
               var roomStr='';
               $.each(detailData.room_types,function(k,v){
               		var btnStr="<button class='room-btn'>预订</div>";
               		if(v.goods[0].room_state==0){
               			btnStr="<button class='room-btn disabled' disable>满房</div>";
               		}
               		roomStr+='<section class="room-type" data-id="'+v.goods[0].room_id+'">'+
               		"<div class='room-charactor'><p>"+v.name+"</p><p><span>"+v.bed_type+"</span><span>"+(v.breakfast || "")+"</span></p></div>"+
                    "<div class='room-price'>￥"+v.goods[0].price[0]/100+"</div>"+btnStr+'</section>'
               })
               $('.room-type-wrap').html(roomStr);
			}
		})
	}
	$('#detail').on('click','.more',function(){
		var wrap=$(this).prev();
		 	h=wrap.find('.room-type-wrap').height();
		if($(this).hasClass('down')){
			wrap.css({
				'height':h,
				'transition':'.3s'
			})
			$(this).text('收起').addClass('up').removeClass('down')
		}else{
			wrap.css({
				'height':'210px',
				'transition':'.3s'
			})
			$(this).text('展开剩余全部').addClass('down').removeClass('up')
		}
	})
	function lookMore(){

	}
	lookMore.prototype={
		show:function(img){
			this.mask();
			this.render(img);
		},
		mask:function(){
			$('<div class="mask"></div>').appendTo('#detail');
		},
		render:function(imgs){
			console.log(imgs)
			var str='<ul class="big_pic">'
			$.each(imgs,function(k,v){
				str+="<li><img src='"+v+"' alt='' /></li>"
			})
			str+="</ul>";
			console.log(str)
			$('body').append($(str));
		}
	}
	var look_more=new lookMore();
	var detail_img=['../img/banner1.jpg','../img/banner2.jpg','../img/banner3.jpg']
	$('.look-more').on('tap',function(){
		look_more.show(detail_img);
	})
	$('#detail').on('tap','.room-type',function(){
		var roomId=$(this).data('id');
		$.ajax({
			url:'roomDetail.json',
			type:'post',
			data:{id:roomId},
			success:function(e){
				var e=e.result
				var str='<span class="close">×</span>'+
				        '<dl>'+
				            '<dt><img class="room-img" src="'+e.img+'" alt=""></dt>'+
				            '<dd>'+
				                '<h3 class="title">'+e.roomType+'</h3>'+
				                '<p class="price">￥'+e.price+'</p>'
				    if(e.guarantee==1){
				    	str+='<span class="guarantee">担保</span>'
				    }
				    str+='</dd></dl>'+
				        '<p>面积<span>'+e.area+'m²</span></p>'+
				        '<p>可住<span>'+e.count+'人</span></p>'+
				        '<p>床型<span>'+e.bedType+'</span></p>'+
				        '<p>宽带<span>'+(e.wifi|| "无")+'</span></p>'+
				        '<p>提供<span>'+e.breakfast+'</span></p>'+
				        '<div class="book-btn">立即预订</div>'
				$('<div class="mask room-mask"></div>').appendTo('body');
				$('.room').html(str).css({
					"transform":"translate3d(0,0,0)"
				}).attr('data-roomId',e.id)
			}
		})
	})
	$('body').on('click','.room>.close',function(){
		$('.room').css({
			"transform":"translate3d(0,100%,0)"
		}).on('webkitTransitionEnd',function(){
			$('.room-mask').remove();
			$('.room').off('webkitTransitionEnd')
		})
	}).on('click','.book-btn',function(){
		var roomid=$('.room').data('roomid'),
			indate=$('#in-date').data('time'),
			outdate=$('#out-date').data('time');
		location.href='book.html'+encodeURI("?roomid="+roomid+"&&inDate="+indate+"&&outDate="+outdate+'&&detailId='+detailId);
	})
})(Zepto)