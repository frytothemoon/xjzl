//点缩略图加载原图
//function loadImg(obj) {
//	if(!obj.hasClass("isPreviewing")) {
//		var oldsrc=obj.attr("src");
//		if(oldsrc) {
//			var newsrc=oldsrc.split("?")[0];
//			loading();
//			obj.attr("src",newsrc);
//			obj.load(function(){
//				loadingDone();
//				obj.attr("data-width",obj[0].naturalWidth);
//				obj.attr("data-height",obj[0].naturalHeight);
//				bindPictureListView(obj);
//				obj.addClass("isPreviewing");
//			});
//		}
//	}else {
//		bindPictureListView(obj);
//	}
//}


var isMortgatecorp=localStorage.getItem("isMortgatecorp");
	if(isMortgatecorp=="1"){
		$(".funding_hide").addClass("hide");
	}
	
	
function getRootPath(){ 
     var pathName = window.location.pathname.substring(1); 
     console.log(pathName);
     var webName = pathName == ''?'' : pathName.substring(0, pathName.indexOf('/')); 
     console.log(webName);
     return window.location.protocol + '//' + window.location.host + '/'+ webName + '/'; 
};

var root=getRootPath();		//全局根路径
//输入框输入数字自动添加千分号(s：数值，dit：保留小数位数)-wm
function numberformat(z,dit){
	    var s="";
	    if('null'==z||""==z||null==z||typeof(z)=='undefined'||null==dit||typeof(dit)=='undefined'||'null'==dit||""===dit){
		return "";
	    }else{
	    	s=new String(z);
	    }
	    s=s.replace(/\s+/g, "").replace(",","");
	    var fv = parseFloat(s)
	    s= fv.toFixed(dit);
      if(/[^0-9\.]/.test(s)) return null;
      s=s.replace(/^(\d*)$/,"$1.");
      var str_0="";
    	  if(/^\d{1}$/.test(dit)){
    		  for(var i=0;i<dit-1;i++){
    			  str_0=str_0+"0";
    		  }
    	  }else{
    		  console.log("请输入正确参数");
    		  return null;
    	  }
      var regs="(\\d*\\.\\d{"+dit+"})\\d*";
      var reg=new RegExp(regs);
      s=(s+str_0).replace(reg,"$1");
      s=s.replace(".",",");
      var re=/(\d)(\d{3},)/;
      while(re.test(s)){
    	  s=s.replace(re,"$1,$2");
      }
      var dstr="";
      	for(var i=0;i<dit;i++){
      		dstr=dstr+"\\d";
  		}
      	var regs1="";
      	var regs2="";
      	if(""!=dstr){
      		regs1=",("+dstr+")$"
      		regs2=".$1";
      	}else{
      		regs1=",$"
      	    regs2="";
      	}
      var reg1=new RegExp(regs1);
      s=s.replace(reg1,regs2);
      return  s.replace(/^\./,"0.")
      }
//获取浏览器参数
function getUrlParam(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r!=null) return unescape(r[2]); return null; //返回参数值
};
function getfromPagePath(){
	var r = window.location.search; 
	var p = window.location.pathname;
	if(p!=null){
		p=p.replace("/zhishi-backend","..");
	}
	if(r!=null){
		return p+r;
	}
	return '';
};
var formPagePath=getfromPagePath();
function formatDate(date,fmt)   
{ 
  var o = {   
    "M+" : date.getMonth()+1,                 //月份   
    "d+" : date.getDate(),                    //日   
    "h+" : date.getHours(),                   //小时   
    "m+" : date.getMinutes(),                 //分   
    "s+" : date.getSeconds(),                 //秒   
    "q+" : Math.floor((date.getMonth()+3)/3), //季度   
    "S"  : date.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
};

$.views.converters("convertDateStr", function(date) {
	if(date==undefined || date==null){
		return "";
	}
	return formatDate((new Date(date)),"yyyy-MM-dd hh:mm:ss");
});

$.views.converters("convertDateStrYMD", function(date) {
	if(date==undefined || date==null){
		return "";
	}
	return formatDate((new Date(date)),"yyyy-MM-dd");
});

//千分位展示数字start
function thousandBitSeparator (num){
	if(null==num||typeof(num)=='undefined'){
		return ;
	}
	var num = (num || 0).toString(), result = '',num_sr= '';
	var splitstr = num.split('.');
	if(splitstr.length>1){
		num_sr = num.split('.')[1];
		num = num.split('.')[0];
	}
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) { result = num + result; if(splitstr.length>1){ result = result + '.' + num_sr; }}
    return result;
}
$.views.converters("thousandBitSeparator", function(num) {
	return thousandBitSeparator(num);
});
//千分位展示数字end

$.views.converters("isSelected" , function(first, last) {
		if (first == null)	return "";
		return first == last ? "selected=selected" : "";
	}
);

/**
 * str1是否包含str2 (用于checkbox是否选中)
 */
$.views.converters("isInclude" , function(str1, str2) {
	if(undefined==str1||str1==null || str1==""){
		return "";
	}
	var index=str1.indexOf(str2);
	if(index!=-1){
		return checked="checked";
	}
	return "";
});

$.views.converters("pageSizeSelected",function(first,last){
	if(first==null) return "";
	return first==last? "selected=selected":"";
});

//以指定字符串结尾
String.prototype.endWith=function(s){
  if(s==null||s==""||this.length==0||s.length>this.length)
     return false;
  if(this.substring(this.length-s.length)==s)
     return true;
  else
     return false;
  return true;
 };
 //以指定字符串打头
String.prototype.startWith=function(s){
  if(s==null||s==""||this.length==0||s.length>this.length)
   return false;
  if(this.substr(0,s.length)==s)
     return true;
  else
     return false;
  return true;
 };
 
//去掉字符串两边的空格并去掉双引号，如:"    dd" aa  ",格式化后"dd aa";
 function trimAndDelQuotation(str){
 	if(str==""){
 		return str;
 	}
 	var _temp=str.replace(/\"*/g,"");
 	_temp = $.trim(_temp);
 	return _temp;
 };
 $.views.converters("getSubStr", function(str, len) {
 	if(str==undefined || str==null){
 		return "";
 	}
 	if(str.length>len){
 		 return str.substr(0,len)+"...";
 	}
 	return str;
 });
 $.views.converters("getSubStrSplit", function(str, len) {
	 	if(str==undefined || str==null){
	 		return "";
	 	}
	 	if(str.length>=len){
	 		var substr = str.substr(0,len);
	 		if(substr == '1900-01-01 00:00'){
	 			return '';
	 		}	
	 		return substr;
	 	}
	 	return str;
	 });
 $.views.converters("getNoHTMLSubStr", function(str, len) {
	 str = removeHTMLTag(str);
 	if(str==undefined || str==null){
 		return "";
 	}
 	if(str.length>len){
 		 return str.substr(0,len)+"...";
 	}
 	return str;
 });
 function removeHTMLTag(str) {
     str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
     str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
     //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
     str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;
     return str;
};
 $.views.converters("getConcatStr", function(str1, str2) {
 	if(str2==undefined || str2==null){
 		return "";
 	}
 	return str1+str2;
 });
 //潜客模型版本   1.0 会转换为1 这里做转换 整数加.0
 $.views.converters("detailNum", function(str) {
	 var strs=str.toString();
	 if(strs.indexOf(".") == -1 ){
		 strs=strs+".0";
	 }
	 return strs;
 });
//$(function(){
//	$('input[type="text"]').addClass('inp_select');
//	$('input[type="password"]').addClass('inp_select');
//	$('select').addClass('inp_select');
//});

String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {  
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {  
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);  
    } else {  
        return this.replace(reallyDo, replaceWith);  
    }  
};

Array.prototype.remove=function(dx)
{
    if(isNaN(dx)||dx>this.length){return false;}
    for(var i=0,n=0;i<this.length;i++)
    {
        if(this[i]!=this[dx])
        {
            this[n++]=this[i];
        }
    }
    this.length-=1;
};
/**
 * 统一的消息处理
 */
function dualMsg(data){
	if(data.respCode==0){
		alert(data.respMsg);
	}else if(data.respCode==100){
		alert(data.respMsg);
//		console.log(window.parent);
//		console.log(window.parent.parent);
//		console.log("aaa");
		window.parent.location.href=root+"login.html";
//		window.parent.parent.location.href=root+"login.html";
	}
}

//对Date的扩展，将 Date 转化为指定格式的String 
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
//例子：
//(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
//(new Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
Date.prototype.format = function(fmt) 
{ // author: meizz
var o = { 
"M+" : this.getMonth()+1,                 // 月份
"d+" : this.getDate(),                    // 日
"h+" : this.getHours(),                   // 小时
"m+" : this.getMinutes(),                 // 分
"s+" : this.getSeconds(),                 // 秒
"q+" : Math.floor((this.getMonth()+3)/3), // 季度
"S"  : this.getMilliseconds()             // 毫秒
}; 
if(/(y+)/.test(fmt)) 
fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
for(var k in o) 
if(new RegExp("("+ k +")").test(fmt)) 
fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
return fmt; 
};
/**
 * 获取当前会话的sessionID
 */
function getSessionId() {
	var c_name = 'JSESSIONID';
	if (document.cookie.length > 0) {
		c_start = document.cookie.indexOf(c_name + "=")
		if (c_start != -1) {
			c_start = c_start + c_name.length + 1
			c_end = document.cookie.indexOf(";", c_start)
			if (c_end == -1)
				c_end = document.cookie.length
			return unescape(document.cookie.substring(c_start, c_end));
		}
	}
};
	 
//金额转换成大写
function toDX(amount){
    var strOutput = "";
    var strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
    amount += "00";
    var intPos = amount.indexOf('.');
    if (intPos >= 0)
    	amount = amount.substring(0, intPos) + amount.substr(intPos + 1, 2);
    strUnit = strUnit.substr(strUnit.length - amount.length);
    for (var i=0; i < amount.length; i++)
      strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(amount.substr(i,1),1) + strUnit.substr(i,1);
    var DX = strOutput.replace(/零角零分$/, '').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元");
    return DX;
};

//停止浏览器响应默认动作，用于禁止响应默认事件。
function stopDefault(e) {  
    //如果提供了事件对象，则这是一个非IE浏览器   
    if(e && e.preventDefault) {//阻止默认浏览器动作(W3C)
    	e.preventDefault();  
    } else {
    	//IE中阻止函数器默认动作的方式
    	window.event.returnValue = false;   
    }  
    return false;  
};

/*
 * 判断字符串或者对象是否为空
 */
function checkIsEmpty(e){
	if (e == null || e == undefined || e == '' || e.length == 0) { 
		return true; 
	} 
	return false;
}
/**
 * 生成uuid
 * @returns
 */
function getUuid(){
  var len=32;//32长度
  var radix=16;//16进制
  var chars='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');var uuid=[],i;radix=radix||chars.length;if(len){for(i=0;i<len;i++)uuid[i]=chars[0|Math.random()*radix];}else{var r;uuid[8]=uuid[13]=uuid[18]=uuid[23]='-';uuid[14]='4';for(i=0;i<36;i++){if(!uuid[i]){r=0|Math.random()*16;uuid[i]=chars[(i==19)?(r&0x3)|0x8:r];}}}
  return uuid.join('');
} 
//请求得到tokenid
function getTokenid(){
     //后去tokenid
	var tokenid='';
	$.axpost("../zs/tokenController/getFormToken",null,function(data){
		tokenid=data.respData;
        if($("#tokenid").length>0){
        	  $("#tokenid").val(data.respData);
        }
	});
}

/**
 * 清空sessionStorage时，要保留的数据。
 */
function retraveSessionStorage(){
	var currentUser_json=sessionStorage.getItem("currentUser_json");    //潜客使用
	var currentUserRole=sessionStorage.getItem("currentUserRole");		//报表使用
	var currentFramUrl=sessionStorage.getItem("currentFramUrl");  //frame的SRC  针对当前菜单点开的页面是带Tab切换的页面使用
	var currentTabLiId=sessionStorage.getItem("currentTabLiId");	//Tab的ID 针对当前菜单点开的页面是带Tab切换的页面使用
	sessionStorage.clear();  //因为在列表页，所以直接清除页面缓存的数据，等到用户再次从列表页进入编辑或新增页时再记录数据。
	sessionStorage.setItem("currentUser_json",currentUser_json);
	sessionStorage.setItem("currentUserRole",currentUserRole);
	sessionStorage.setItem("currentFramUrl",currentFramUrl);  
	sessionStorage.setItem("currentTabLiId",currentTabLiId);  
}

	//修改frame的SRC  
function loadFrameSRC(defaultsrc){
	var iframeId=$(window.parent.document).find(".show-this").attr("id");
	var dataSrc=localStorage.getItem(iframeId + "currentFramUrl");
	if(dataSrc&&dataSrc!=null&&""!=dataSrc&&"null"!=dataSrc){  		
		console.log("dataSrc:"+dataSrc);
		var dataId=localStorage.getItem(iframeId + "currentTabLiId");
		$(".tagFrameContent").attr("src",dataSrc);
		$(".tagFrameTop li").removeClass("active");
		$("#"+dataId).addClass("active");
	}else if(defaultsrc&&defaultsrc!=null&&defaultsrc!=""){
		console.log("defaultsrc:"+defaultsrc);
		$(".tagFrameContent").attr("src",defaultsrc);
	}
}

/** 切换标签frame **/
$(document).on("click",".tagFrameTop li", function() {
	var iframeId=$(window.parent.document).find(".show-this").attr("id");
	console.log(iframeId);
	if(!$(this).hasClass("active")){
	$(this).closest(".iframe").siblings(".tagFrameContent").attr("src",$(this).attr("data-src"));
	$(this).siblings().removeClass("active");
	$(this).addClass("active");
	localStorage.setItem(iframeId + "currentFramUrl",$(this).attr("data-src"));  //链接
	localStorage.setItem(iframeId + "currentTabLiId",$(this).attr("id"));  //id
	retraveSessionStorage();
	}
});