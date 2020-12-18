/*
 * jQuery Ajax封装通用类 (st-lj) 
 * Copyright 2011-2016 .
 */
$(function() {
	/*
	 * ajax封装 url 发送请求的地址 data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(),
	 * "state": 1} async 默认值: true。默认设置下，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为 false。
	 * 注意，同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行。 type 请求方式("POST" 或 "GET")， 默认为 "GET"
	 * dataType 预期服务器返回的数据类型，常用的如：xml、html、json、text successfn 成功回调函数 errorfn
	 * 失败回调函数
	 */
	jQuery.ax = function(url, data, async, type, dataType, contentType,successfn, errorfn) {
		async = (async == null || async == "" || typeof (async) == "undefined") ? "true"
				: async;
		type = (type == null || type == "" || typeof (type) == "undefined") ? "post"
				: type;
		contentType = (contentType == null || contentType == "" || typeof (contentType) == "undefined") ? "application/x-www-form-urlencoded"
				: contentType;
		dataType = (dataType == null || dataType == "" || typeof (dataType) == "undefined") ? "json"
				: dataType;
		data = (data == null || data == "" || typeof (data) == "undefined") ? {
			"date" : new Date().getTime()
		} : data;
		$.ajax({
			type : type,
			async : async,
			data : data,
			url : url,
			timeout:10000,
			dataType : dataType,
			contentType : contentType,
			success : function(d) {
				loadingDone();
				if(successfn){					
					if(d.respCode==1){
//						callPop(1,d.respMsg);
						successfn(d);
					}else if(d.respCode==100){
						callAlert("提示",d.respMsg,function(){
							toLogin();
						});
					}else{
//						alert(d.respMsg);
						callAlert("提示",d.respMsg,null);return;
					}
				}else{
					console.log(d);
//					alert("请求成功！");
					callAlert("提示",d.respMsg,null);return;
				}
			},
			error : function(d) {
				loadingDone();
				console.log(d);
//				alert("请求成功！");
				callAlert("提示","请求失败！请检查代码。",null);return;
			}
		});
	};
	/**
	 * ajax封装 url 发送请求的地址 data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(),
	 * "state": 1} successfn 成功回调函数
	 */
	jQuery.axpost = function(url, data, successfn) {
		data = (data == null || data == "" || typeof (data) == "undefined") ? {
			"date" : new Date().getTime()
		} : data;
		/**
		 * V3.8.0新增排序字段
		 * */
		var currentModel = $("#currentModel").val();
		var orderBy = localStorage.getItem(currentModel + ".orderBy");
		var direct = localStorage.getItem(currentModel + ".direct"); //排序 正序asc,反序desc
		console.log(direct);
		if (orderBy!='undefined'&&orderBy != "" && orderBy != null && direct != "" && direct != null&&direct!='undefined'){
			data['orderBy'] = orderBy;
			data['direct'] = direct;
		}
		var ajaxTimeoutTest=$.ajax({
			type : "post",
			data : data,
			url : url,
			timeout:20000,
			dataType : "json",
//			contentType : "application/json",
			success : function(d) {
				loadingDone();
				if(successfn){					
					if(d.respCode==1){
//						callPop(1,d.respMsg);
						successfn(d);
					}else if(d.respCode==100){
//						alert(d.respMsg);
						callAlert("提示",d.respMsg,function(){
							toLogin();
						});
					}else{
//						alert(d.respMsg);
						callAlert("提示",d.respMsg,null);return;
					}
				}else{
					console.log(d);
//					alert("请求成功！");
					callAlert("提示","请求成功！",null);return;
				}
			},
			complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
				if(status=='timeout'){//超时,status还有success,error等值的情况
					ajaxTimeoutTest.abort();
//					alert("超时");
					loadingDone();
					callAlert("提示","超时",null);return;
				}
			}
		});
	};
	
	
	/**
	 * ajax封装 url 发送请求的地址 data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(),
	 * "state": 1} successfn 成功回调函数
	 */
	jQuery.axpostLongtime = function(url, data, successfn) {
		data = (data == null || data == "" || typeof (data) == "undefined") ? {
			"date" : new Date().getTime()
		} : data;
		var ajaxTimeoutTest=$.ajax({
			type : "post",
			data : data,
			url : url,
			timeout:200000,
			dataType : "json",
//			contentType : "application/json",
			success : function(d) {
				loadingDone();
				if(successfn){					
					if(d.respCode==1){
//						callPop(1,d.respMsg);
						successfn(d);
					}else if(d.respCode==100){
//						alert(d.respMsg);
						callAlert("提示",d.respMsg,function(){
							toLogin();
						});
					}else{
//						alert(d.respMsg);
						callAlert("提示",d.respMsg,null);return;
					}
				}else{
					console.log(d);
//					alert("请求成功！");
					callAlert("提示","请求成功！",null);return;
				}
			},
			complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
				if(status=='timeout'){//超时,status还有success,error等值的情况
					ajaxTimeoutTest.abort();
//					alert("超时");
					loadingDone();
					callAlert("提示","超时",null);return;
				}
			}
		});
	};
	
	//BUCS 
	jQuery.axpostWait  = function(url, data, successfn) {
		data = (data == null || data == "" || typeof (data) == "undefined") ? {
			"date" : new Date().getTime()
		} : data;
		var ajaxTimeoutTest=$.ajax({
			type : "post",
			data : data,
			url : url,
			timeout:0,
			dataType : "json",
//			contentType : "application/json",
			success : function(d) {
				if(successfn){					
					if(d.respCode==1){
//						callPop(1,d.respMsg);
						successfn(d);
					}else if(d.respCode==100){
//						alert(d.respMsg);
						callAlert("提示",d.respMsg,function(){
							toLogin();
						});
					}else{
//						alert(d.respMsg);
						callAlert("提示",d.respMsg,null);return;
					}
				}else{
					console.log(d);
//					alert("请求成功！");
					callAlert("提示","请求成功！",null);return;
				}
			},
			complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
				if(status=='timeout'){//超时,status还有success,error等值的情况
					ajaxTimeoutTest.abort();
//					alert("超时");
					callAlert("提示","超时",null);return;
				}
			}
		});
	};
	
	/**
	 * ajax封装 url 发送请求的地址 data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(),
	 * "state": 1} successfn 成功回调函数  不需要去掉加载延迟
	 */
	jQuery.axpostNoLoad = function(url, data, successfn) {
		data = (data == null || data == "" || typeof (data) == "undefined") ? {
			"date" : new Date().getTime()
		} : data;
		var ajaxTimeoutTest=$.ajax({
			type : "post",
			data : data,
			url : url,
			timeout:28000,
			dataType : "json",
//			contentType : "application/json",
			success : function(d) {
				if(successfn){					
					if(d.respCode==1){
//						callPop(1,d.respMsg);
						successfn(d);
					}else if(d.respCode==100){
//						alert(d.respMsg);
						callAlert("提示",d.respMsg,function(){
							toLogin();
						});
					}else{
//						alert(d.respMsg);
						callAlert("提示",d.respMsg,null);return;
					}
				}else{
					console.log(d);
//					alert("请求成功！");
					callAlert("提示","请求成功！",null);return;
				}
			},
			complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
				if(status=='timeout'){//超时,status还有success,error等值的情况
					ajaxTimeoutTest.abort();
//					alert("超时");
					callAlert("提示","超时",null);return;
				}
			}
		});
	};
	
	/**
	 * ajax封装 url 发送请求的地址 data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(),
	 * "state": 1} dataType 预期服务器返回的数据类型，常用的如：xml、html、json、text successfn
	 * 成功回调函数 errorfn 失败回调函数
	 */
	jQuery.axspost = function(url, data, successfn, errorfn) {
		data = (data == null || data == "" || typeof (data) == "undefined") ? {
			"date" : new Date().getTime()
		} : data;
		$.ajax({
			type : "post",
			data : data,
			url : url,
			timeout:10000,
			dataType : "json",
			success : function(d) {
				loadingDone();
				if(successfn){					
					if(d.respCode==1){
//						callPop(1,d.respMsg);
						successfn(d);
					}else if(d.respCode==100){
//						alert(d.respMsg);
						callAlert("提示",d.respMsg,function(){
							toLogin();
						});
					}else{
//						alert(d.respMsg);
						callAlert("提示",d.respMsg,null);return;
					}
				}else{
					console.log(d);
//					alert("请求成功！");
					callAlert("提示","请求成功！",null);return;
				}
			},
			error : function(e) {
				loadingDone();
				if(errorfn){					
					errorfn(e);
				}else{
//					alert("请求失败！请检查代码。");
					callAlert("提示","请求失败！请检查代码。",null);return;
				}
			}
		});
	};
	/**
	 * ajax封装 url 发送请求的地址 data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(),
	 * "state": 1} dataType 预期服务器返回的数据类型，常用的如：xml、html、json、text successfn
	 * 成功回调函数 errorfn 失败回调函数
	 */
	jQuery.axsget = function(url, successfn, errorfn) {
		$.ajax({
			type : "get",
			url : url,
			timeout:10000,
			dataType : "json",
			success : function(d) {
				loadingDone();
				if(successfn){					
					if(d.respCode==1){
//						callPop(1,d.respMsg);
						successfn(d);
					}else{
//						alert(d.respMsg);
						callAlert("提示",d.respMsg,null);return;
					}
				}else{
					console.log(d);
//					alert("请求成功！");
					callAlert("提示","请求成功！",null);return;
				}
			},
			error : function(e) {
				loadingDone();
				if(errorfn){					
					errorfn(e);
				}else{
//					alert("请求失败！请检查代码。");
					callAlert("提示","请求失败！请检查代码。",null);return;
				}
			}
		});
	};
	
	/**
	 * ajax封装 url 发送请求的地址 data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(),
	 * "state": 1} successfn 成功回调函数
	 */
	jQuery.axpostJosn = function(url, data, successfn) {
		data = (data == null || data == "" || typeof (data) == "undefined") ? {
			"date" : new Date().getTime()
		} : data;
		var ajaxTimeoutTest=$.ajax({
			type : "post",
			data : JSON.stringify(data),
			url : url,
			timeout:10000,
			dataType : "json",
			contentType : "application/json",
			success : function(d) {
				loadingDone();
				if(successfn){					
					if(d.respCode==1){
//						callPop(1,d.respMsg);
						successfn(d);
					}else if(d.respCode==100){
						callAlert("提示",d.respMsg,function(){
							toLogin();
						});
					}else{
						alert(d.respMsg);
					}
				}else{
					console.log(d);
					alert("请求成功！");
				}
			},
			complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
				if(status=='timeout'){//超时,status还有success,error等值的情况
					ajaxTimeoutTest.abort();
					alert("超时");
				}
			}
		});
	};
	
	/**
	 * ajax封装 url 发送请求的地址 data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(),
	 * "state": 1} successfn 成功回调函数 tokenfn 请求业务级异常重新发送tokenid函数
	 */
	jQuery.axtokenpost = function(url, data, successfn ,tokenfn) {
		data = (data == null || data == "" || typeof (data) == "undefined") ? {
			"date" : new Date().getTime()
		} : data;
		var ajaxTimeoutTest=$.ajax({
			type : "post",
			data : data,
			url : url,
			timeout:0,
			dataType : "json",
//			contentType : "application/json",
			success : function(d) {
				loadingDone();
				if(successfn){					
					if(d.respCode==1){
//						callPop(1,d.respMsg);
						successfn(d);
					}else if(d.respCode==100){
//						alert(d.respMsg);
						callAlert("提示",d.respMsg,function(){
							toLogin();
						});
					}else if(d.respCode==500){
//						alert(d.respMsg);
						callAlert("提示",d.respMsg,null);return;

					}else{
//						alert(d.respMsg);
						tokenfn(d);
						callAlert("提示",d.respMsg,null);return;
					}
				}else{
					console.log(d);
//					alert("请求成功！");
					callAlert("提示","请求成功！",null);return;
				}
			},
			complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
				if(status=='timeout'){//超时,status还有success,error等值的情况
					ajaxTimeoutTest.abort();
//					alert("超时");
					loadingDone();
					callAlert("提示","超时",null);return;
				}
			}
		});
	};
});

function toLogin(){
	window.top.location.href="../login.html";
}