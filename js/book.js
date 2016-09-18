;(function($){
	var bookMsg=decodeURI(window.location.search).substr(1),	
		bookMsg=getSearchMsg(bookMsg,'&&','=');
	$('.book-indate').text(domFormat(new Date(bookMsg.inDate)),false);
	$('.book-outdate').text(domFormat(new Date(bookMsg.outDate)),false);
	$('#book').on('tap','.back',function(){
		location.href='detail.html'+encodeURI('?inDate='+bookMsg.inDate+'&&outDate='+bookMsg.outDate+"&&id="+bookMsg.detailId);
	}).on('.del',function(){
		var inp=$(this).prev()
		inp.val("").focus()
	}).on('tap','.count',function(){
		$.slideSelect({
			data:['1','2','3','4','5'],
			title:"请选择房间数量",
			valDom:$('.count'),
			parentDom:$('.count-select'),
			callback:function(data){
				var str="<h3 class='tit'>入住人信息</h3>"
				for(var i=0;i<data;i++){
					str+='<p class="clear"><span class="left">姓名</span><input class="info-text" type="text" placeholder="每间只需填写一个姓名"></p>'+
            				'<p class="clear"><span class="left">证件</span><input class="info-text" type="text" placeholder="入住人省份证号/护照号"><span class="del">×</span></p>';
				}
				$('.person-info').html(str)
			}
		})	
	}).on('tap','.time',function(){
		$.slideSelect({
			data:['19点之前','20点之前','21点之前','22点之前','23点之前','24点之前',],
			title:"请选择到店时间",
			valDom:$('.time'),
			parentDom:$('.time-select')
		})
	})
})(Zepto)