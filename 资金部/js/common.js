/**
 * xulian
 */
var scright;
//浏览器窗口大小改变事件
window.onresize=function(){  
	bindFloatTableBtn();
	listMenu();
}  
$(document).ready(function() {
	loadSelect();
	//切换皮肤的功能
	
	//end
	//多选框
	$(document).on("click",".checkboxClass",function(){
		$(this).toggleClass("selected");
	})
	// $(document).on("click",".loader-box",function(){loadingDone()});
	$(document).on("click",".navbar li.menu dt",function() {
		swichMenu($(this).closest("li"));
	});
	$(document).on("click",".navbar li.menu dd",function() {
		swichItem($(this));
	});
	$(".userInfo a.openMsg").click(openMsg);
	$(".black_layer,.iMsgBox .closeBtn").click(closeMsg);
	loadSwitchTag();
	//按钮收缩
	var navHide=false;
	$("#toggLeftNav").click(function() {
        var pare  = $(".mainFrame", window.parent.document);
        if(!navHide) {
            $("#toggLeftNav").removeClass("on");
            navHide = true;
            pare.animate({
                width:(pare.width() + 217)+"px",
                left:'-217px'
            });
        }else {
            $("#toggLeftNav").addClass("on");
            navHide = false;
            pare.animate({
                width:(pare.width() - 217)+"px",
                left:'0px'
            });
        }

    });
	// $(document).on("click",".table-list th .checkboxFive input",checkboxAll);
	// $(document).on("click",".table-list td .checkboxFive input",checkboxTr);
	// $(document).on("click",".table-list td:not('.cktd')",checkboxTr);
	$(document).on("click","a.iframeLink",changeIframe);
	
	bindFloatTableBtn();
	$(".table-scroll-box").scroll(function(){
		scright = $(".table-scroll-box .table").width() - $(".table-scroll-box").width() - $(".table-scroll-box").scrollLeft();
		$(".table-scroll-box td> .btn-tr-edit,.table-scroll-box td> .btn-tr-check,.table-scroll-box td> .btn-tr-rmb,.table-scroll-box td> .btn-tr-del,.table-scroll-box .table-opr-btn").css("right",scright+10);
	});
});
function loading() {
	$("body").append("<div class=\'loader-box\'><div class=\'loaders\'><div class=\'loader\'><div class=\'loader-inner ball-pulse-rise\'><div></div><div></div><div></div><div></div><div></div></div></div></div></div>");
}
function loadingDone() {
	$(".loader-box").remove();
}
function changeIframe() {
	$("#ti_panel_frame").attr("src",$(this).attr("data-target"));
}
function swichMenu($clickLi) {

	if(!$clickLi.hasClass("active")) {
		$("#contentNav .menu.active").find("dd").slideUp(function(){$("#contentNav .menu.active").removeClass("active")});
		$clickLi.find("dd").slideDown(function(){$clickLi.addClass("active")});
		if($clickLi.hasClass("todolist")) $clickLi.addClass("active");
	}else {
		$(".todolist").removeClass("active");
		$clickLi.find("dd").slideUp(function(){$clickLi.removeClass("active")});
	}
	setTimeout(function(){$("#contentNav").mCustomScrollbar("update")},500) ;
}
//列表筛选条件事件
function filtrate($obj){
	$(document).on('click',$obj+' .dropdown-menu li',function(event){
		event.stopPropagation();
		$(this).toggleClass("selected");
	})
}
function swichItem($clickDd) {
	if(!$clickDd.hasClass("on")) {
		$(".navbar li.menu dd.on").removeClass("on");
		$clickDd.addClass("on");
	}
}
function closeMsg() {
	var animateNum = "";
	if($(".iMsgBox").hasClass("msgCenterShow")) animateNum = "2";
	$(".black_layer").fadeOut();
	$(".iMsgBox").removeClass("fadeInRight"+animateNum).addClass("fadeOutRight"+animateNum);
	$(".iMsgBox").fadeOut();

}
function openMsg() {
	var animateNum = "";
	if($(".iMsgBox").hasClass("msgCenterShow")) animateNum = "2";
	$(".black_layer").fadeIn();
	$(".iMsgBox").removeClass("fadeOutRight"+animateNum).addClass("fadeInRight"+animateNum);
	$(".iMsgBox").show();
	// $("#msgContent").mCustomScrollbar("update");
//	$("#msg_panel_frame").attr("src","messages.html");
	$("#msg_panel_frame").contents().find("#msgUnread .loanMore").prevAll().remove();
	$("#msg_panel_frame")[0].contentWindow.displayContent(0,10,0,'msgUnread');
}
function loadSelect() {
	$(".dropdown .dropdown-menu").each(function() {
		$parent = $(this).closest(".dropdown");
		$btn = $parent.find("button.dropdown-toggle");
		$menuUl = $parent.find(".dropdown-menu");
		if($btn.hasClass("default-option")) {
			if(!$menuUl.find("li.default").length>0) {
				$menuUl.prepend("<li class='default' role='presentation' tabindex='-1' href='javascript:'><a role='menuitem'>"+$btn.attr("data-default")+"</a></li>");
			}
		}
		var $sltli = $(this).find("a.on");
		valSelect($sltli);
	});
	$(document).on("click",".dropdown .dropdown-menu li.default a",function(){
		resetSelect($(this).closest(".dropdown").find("button.dropdown-toggle").attr("id"));
	});
	$(document).on("click",".dropdown .dropdown-menu li:not('.default') a",function(){
		checkSelect($(this));
	});
}
function valSelect($sltli) {
	var btn = $sltli.closest(".dropdown").find("button.dropdown-toggle");
	var ipt = $sltli.closest(".dropdown").find("input");
	btn.attr("data-id", $sltli.attr("data-id"));
	ipt.attr("data-id", $sltli.attr("data-id"));
	btn.find("i").html($sltli.html());
	ipt.val($sltli.html()).change();
	btn.addClass("wrote");
	
//	ipt.trigger("validate");//重新验证input框数据
}
function checkSelect($obj) {
	$parent = $obj.closest(".dropdown-menu");	
	$parent.find("li").removeClass("active");
	if(!$obj.hasClass("on")) {
		$parent.find("a.on").removeClass("on");
		$obj.addClass("on");
		$parent.closest(".dropdown").find("i").html($obj.html());
	}
	valSelect($obj);
}
function resetSelect(sltid) {
	$("ul[aria-labelledby='"+sltid+"']").find(".on").removeClass("on");
	$("#"+sltid).find("i").html($("#"+sltid).attr("data-default"));
	$("#"+sltid+"_ip").attr("data-id","").val("");
	$("#"+sltid).attr("data-id","").val("");//Ò»ÆðÖÃ¿Õ
	$("#"+sltid).removeClass("wrote");
}
function setSelect(sltid,dataid) {
	var $obj = $("ul[aria-labelledby='"+sltid+"']").find("a[data-id='"+dataid+"']");
	checkSelect($obj);
}
function initSelect() {
	$(".dropdown .dropdown-menu").each(function() {
		$parent = $(this).closest(".dropdown");
		$btn = $parent.find("button.dropdown-toggle");
		$menuUl = $parent.find(".dropdown-menu");
		var ipt = $parent.find("input");
		var selectData=ipt.attr("data-id");//数据库返回的数据（数据展示时应该写入此处）
		if(selectData&&null!=selectData&&""!=selectData){//
			var $obj = $menuUl.find("a[data-id='"+selectData+"']");
			checkSelect($obj);
		}
	});
}

function initSelect(id) {
	$("#"+id+ " .dropdown .dropdown-menu").each(function() {
		$parent = $(this).closest(".dropdown");
		$btn = $parent.find("button.dropdown-toggle");
		$menuUl = $parent.find(".dropdown-menu");
		var ipt = $parent.find("input");
		var selectData=ipt.attr("data-id");//数据库返回的数据（数据展示时应该写入此处）
		if(selectData&&null!=selectData&&""!=selectData){//
			var $obj = $menuUl.find("a[data-id='"+selectData+"']");
			checkSelect($obj);
		}
	});
}
function loadSwitchTag() {
	$(document).on("click",".tag-box .tag-item", function(){
		var $parent = $(this).closest(".tag-box");
		if(!$(this).hasClass("on")) {
			$parent.find(".on").removeClass("on");
			$(this).addClass("on");

			var tagId = $(this).attr("data-tag");

			if(tagId == "#msgUnread") {
				$(".panel-title small").css("display","inline-block");
			}else 
				$(".panel-title small").css("display","none");
			$(tagId).siblings(".on").removeClass("on");
			$(tagId).addClass("on");
			$(tagId).mCustomScrollbar("update");
		}
	});
}
function checkboxAll() {
	$ck = $(this).closest(".table").find(".cktd input")
	if($(this).prop('checked')) {
		$ck.each(function(){
			if(!$(this).prop('checked')) $(this).click();
		});		
	}else {
		$ck.each(function(){
			$(this).removeAttr("checked");
			$(this).closest("tr").removeClass("checked");
		});
	}
}
function checkboxTr() {
	var $tr,$ck;
	if($(this).is("td")) {
		console.log("td")
		$tr = $(this).closest("tr");
		$ck = $tr.find(".checkboxFive input");
			$ck.click()
	}else if($(this).is("input")) {
		$ck = $(this);
		$tr = $ck.closest("tr");
		if(!$ck.prop('checked')) {
			$tr.removeClass("checked");
		}else $tr.addClass("checked");
	}
}

//闪现泡泡（弹出一秒消失）callPop(状态码,要显示的字符串)
//状态码说明 0:失败 1:成功

var popTal;
function callPop(status,txt) {
	if(popTal) popTal.fadeOut(function(){
		popTal.remove();
	});
	$("body").append("<div class='popWin'><div class='txt'><i class='glyphicon glyphicon-remove-circle'></i><i class='glyphicon glyphicon-ok-circle'></i><span>"+txt+"</span></div></div>");
	popTal = $("body").find(".popWin");
	switch(status){
		case 0:
			$(".popWin").addClass("failure");
			break;
		case 1:
			$(".popWin").addClass("success");
			break;
	}
	$(".popWin").fadeIn(function() {
		setTimeout(function(){
			$(".popWin").remove();
		},700);
	});
}
//闪现泡泡（弹出2秒消失）callPop(状态码,要显示的字符串)
//状态码说明 0:失败 1:成功
function callPop_2(status,txt) {
	if(popTal) popTal.fadeOut(function(){
		popTal.remove();
	});
	$("body").append("<div class='popWin'><div class='txt'><i class='glyphicon glyphicon-remove-circle'></i><i class='glyphicon glyphicon-ok-circle'></i><span>"+txt+"</span></div></div>");
	popTal = $("body").find(".popWin");
	switch(status){
		case 0:
			$(".popWin").addClass("failure");
			break;
		case 1:
			$(".popWin").addClass("success");
			break;
	}
	$(".popWin").fadeIn(function() {
		setTimeout(function(){
			$(".popWin").remove();
		},2000);
	});
}


function bindFloatTableBtn() {
	scright = $(".table-scroll-box .table").width() - $(".table-scroll-box").width();
	$(document).on("mouseover",".table-scroll-box tr",function(){
		$("td> .btn-tr-edit, td> .btn-tr-check, td> .btn-tr-rmb, td> .btn-tr-del, .table-opr-btn").css("right",scright+10);
	});
}

/* 
 * post方式提交数据 
 * PARAMS为参数，如var param = {query:_jsonFilter}，一个json对象
 * */
function jsPost(URL, PARAMS) {        
    var temp = document.createElement("form");        
    temp.action = URL;        
    temp.method = "post";        
    temp.style.display = "none";        
    for (var x in PARAMS) {        
        var opt = document.createElement("textarea");        
        opt.name = x;        
        opt.value = PARAMS[x];        
        temp.appendChild(opt);        
    }        
    document.body.appendChild(temp);        
    temp.submit();        
    return temp;        
}
///** 切换标签frame **/ 
//$(document).on("click",".tagFrameTop li", function() {
//	$(".tagFrameContent").attr("src",$(this).attr("data-src"));
//	$(".tagFrameTop li").removeClass("active");
//	$(this).addClass("active");
//});

//弹出浮层-点击关闭
$(".iframe .topic .close").click(function(){
	var layer=window.parent.document.getElementsByClassName("checkMaterialLayer");
	var back=window.parent.document.getElementsByClassName("modal-backdrop");
	$(layer).removeClass("open");
	$(back).remove();
});
/** 进度条 **/
var progress_width=1,
	progress_intervel;
function writeProgressModal() {
	if($("#progressModal")[0]) {
		progress_width=1;
		$("#progressModal").remove();
	}
	$("body").append("<div class=\'modal fade progressModal\'id=\'progressModal\'tabindex=\'-1\'role=\'dialog\'><div class=\'modal-dialog\'><div class=\'modal-content\'><div class=\'modal-header\'><h4 class=\'modal-title\'>下载中</h4></div><div class=\'modal-body\'><p class=\'progress-title\'>下载文件共8个，正在准备文件</p><p class=\'progress-status\'>已完成<font>80％</font>，请稍后…</p><div class=\'progress progress-striped \'><div class=\'progress-bar progress-bar-success ma05\'role=\'progressbar\'aria-valuenow=\'60\'aria-valuemin=\'0\'aria-valuemax=\'100\'style=\'width: 1%;\'></div></div></div></div></div></div>")
	$("#progressModal").modal("show");
}
function setProgressState(per,sec,str) {
	$("#progressModal .progress-status em").html(str);
	per = per>=100? 100:per;
	if(progress_width<per) {
		$(".progressModal").removeClass("complete");
		progress_intervel = window.setInterval(function(){
			if (progress_width<=per){
				if(progress_width ==100) $(".progressModal").addClass("complete");
				$("#progressModal .progress-status font").html(progress_width+"%");
				$("#progressModal .progress-bar-success").width(progress_width++ + "%");
			}else {
				clearInterval(progress_intervel);
			}
		},sec/(per-progress_width));
	}
}
function setProgressTitle(title) {
	$("#progressModal .progress-title").html(title);
}
function closeProgress(title) {
	$("#progressModal").removeClass("complete");
	$("#progressModal").modal("hide");
}
function uploadLayerReady() {
	$(".uploadLayer .uploadLayer_min,.uploadLayer .uploadLayer_max").click(function(){
		$(this).closest(".uploadLayer").toggleClass("open")
	});
	$(".uploadLayer").fadeIn(function(){
		$(".uploadLayer").addClass("open");
	});

}

//列表拖动
function add_drag_th(target,dragTarget){  
  //允许放入    
	console.log( $(target +" tr>th"));
  $(target +" tr>th").on("dragover",function(e){    
      e.originalEvent.preventDefault();
  });  
  //拿起  
  $(target+" tr>th").on("dragstart",function(e){    
      e.originalEvent.dataTransfer.setData("obj_add",e.currentTarget.cellIndex);
  });  
  //放下  
  $(target+" tr>th").on("drop",function(e){    
      e.originalEvent.preventDefault;    
      var i = parseInt(e.originalEvent.dataTransfer.getData("obj_add"));//所拿起的th列下标    
      var d = this.cellIndex;//被放入的列下标  
      var _t = this;  
      $(target+ " tr>th").each(function(){  
          var j = this;  
          if(j.cellIndex == i){  
              _t.before(j);  
              return false;  
          }  
      });  
      $(target+ " tbody>tr").each(function(){  
          var drag = "";//拿起的td  
          var drop = "";//放下的td  
          $(this).children().each(function(){  
              if(this.cellIndex == i){  
                  drag = this;  
              }  
              if(this.cellIndex == d){  
                  drop = this;  
              }  
          });  
          if(drag != undefined && drop != undefined && drag != "" && drop != ""){  
              drop.before(drag);  
          }  
      });
      var arr=[];
      $(target+" tr>th").each(function(){
      	arr.push($(this).attr("data-name"));
      	localStorage.setItem($(dragTarget).val()+'.thead',JSON.stringify(arr));
      })
      sortTbody();
  });  
}  
function getRootPath(){ 
    var pathName = window.location.pathname.substring(1); 
    var webName = pathName == ''?'' : pathName.substring(0, pathName.indexOf('/')); 
    return window.location.protocol + '//' + window.location.host + '/'+ webName;
}

//皮肤切换的方法
function switcher(){
	var target=getRootPath();
	$('html head').append('<link rel="stylesheet" type="text/css" href="'+target+'/css/second.css"/>');
}

//滚动列表 固定表头的方法
function listMenu(){
	if($(".table_thead").length>0){
		var num=$(".table_width tbody tr").eq(0).find("td");
		var top = $(".table_thead").offset().top; 
		var thWidth=$(".table_width").width();
		$(".table_thead").width(thWidth);
		var isCktd = $(".table_width tbody tr").eq(0).find(".cktd").length;
		//是否含有单选框
		if(isCktd == 0){
			for(var i=0;i<num.length;i++){
				var w=$(".table_width tbody tr").eq(0).find("td").eq(i).width();
				$(".table_thead thead tr").eq(0).find("th").eq(i).find("div").width(w-4);
			}
		}else{
			for(var i=1;i<num.length;i++){
				var w=$(".table_width tbody tr").eq(0).find("td").eq(i).width();
				$(".table_thead thead tr").eq(0).find("th").eq(i).find("div").width(w-4);
			}
		}
		$(".table_thead").scroll(function(){
			var left=$(".table_thead").scrollLeft();
			$(".table_width").scrollLeft(left);
		})
		$(window).scroll(function(){
			if($(window).scrollTop() >= top){
				$(".table_thead").css({"position":"fixed","top":"0","z-index":"1000"});
				
			}else if($(window).scrollTop() < top){
				$(".table_thead").css("position","inherit");
			}
		})
	}
}

//编辑切换内容
//$(document).on("click",".save-group .btn-save",function(){
//	saveBlock($(this).closest(".save-group"));
//});
//$(document).on("click",".save-group .btn-cancel",function(){
//	saveBlock($(this).closest(".save-group"));
//});
//$(document).on("click",".save-group .btn-edit",function(){
//	editBlock($(this).closest(".save-group"));
//});
//$(document).on("click",".save-group .btn-delete",function(){
//	$(this).closest(".save-group").remove();
//});
//function saveBlock($obj) {
//	$obj.removeClass("sg-edit").addClass("sg-save");
//}
//function editBlock($obj) {
//	$obj.removeClass("sg-save").addClass("sg-edit");
//}
////end
