/*******
	by Xulian
*******/

function callAlert(title,txt,sureTodo,obj) {
	//console.log(title+txt);
	if(!$("#alertModel").length>0){
		$("body").append("<div class=\'modal fade alertModel\'id=\'alertModel\'tabindex=\'-1\'role=\'dialog\'aria-labelledby=\'myModalLabel\'aria-hidden=\'true\'><div class=\'modal-dialog\'><div class=\'modal-content\'><div class=\'modal-header\'><h4 class=\'modal-title\'></h4></div><div class=\'modal-body\'><p class=\'text-center alertTxt\'></p></div><div class=\'modal-footer text-center\'><button type=\'button\'class=\'btn alertModel-yes\'data-dismiss=\'modal\'>确定</button></div></div></div></div>");
	}
	if(sureTodo&& (typeof sureTodo == "function")) {
		if(obj) {
			btnBindFunObj(".alertModel-yes",sureTodo,obj)
		}else {
			btnBindFun(".alertModel-yes",sureTodo);
		}
	}
	$("#alertModel").find(".modal-title").html(title);
	$("#alertModel").find(".alertTxt").html(txt);
	$('#alertModel').modal({
	   backdrop: 'static', keyboard: false
	});
}
function callConfirm(title,txt,sureTodo,cancelTodo,obj1,obj2) {
	//console.log(title+txt);
	if(!$("#confirmModel").length>0){
		$("body").append("<div class=\'modal fade confirmModel\'id=\'confirmModel\'tabindex=\'-1\'role=\'dialog\'aria-labelledby=\'myModalLabel\'aria-hidden=\'true\'><div class=\'modal-dialog\'><div class=\'modal-content\'><div class=\'modal-header\'><h4 class=\'modal-title\'>"+title+"</h4></div><div class=\'modal-body\'><p class=\'text-center confirmTxt\'>"+txt+"</p></div><div class=\'modal-footer text-center\'><button type=\'button\'class=\'btn confirmModel-yes\' data-dismiss=\'modal\'>确定</button><button type=\'button\'class=\'btn btn-grey confirmModel-no\'data-dismiss=\'modal\'>取消</button></div></div></div></div>");
	}
	$("#confirmModel").find(".modal-title").html(title);
	$("#confirmModel").find(".confirmTxt").html(txt);
	if(obj1) {
		btnBindFunObj(".confirmModel-yes",sureTodo,obj1)
	}else {
		btnBindFun(".confirmModel-yes",sureTodo);
	}
	if(obj2) {
		btnBindFunObj(".confirmModel-no",cancelTodo,obj2)
	}else {
		btnBindFun(".confirmModel-no",cancelTodo);
	}
	$('#confirmModel').modal({
	   backdrop: 'static', keyboard: false
	});
}
function btnBindFun(btn,fun) {
	$(btn).unbind();
	$(btn).one("click",fun);
}
function btnBindFunObj(btn,fun,obj) {
	$(btn).unbind();
	$(btn).one("click",function(){fun(obj);});
}