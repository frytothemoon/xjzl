var  currentModel = '';  
function  rememberRecord()  {
	currentModel = $("#currentModel").val();
	sessionStorage.setItem(currentModel , currentModel); // 记录下当前的model名称
	/** ***************记录当前的条件********************************* */
	sessionStorage.setItem(currentModel + ".serial_no", $("#serial_no").val());
	sessionStorage.setItem(currentModel + ".contractNo", $("#contractNo").val());
	sessionStorage.setItem(currentModel + ".customerName", $("#customerName").val());

	sessionStorage.setItem(currentModel + ".type", $("#type_ip").attr("data-id"));	

	/** ***************记录当前的条件********************************* */
	var pageSize = $("#selectPageSize").val();
	if (typeof (pageSize) == 'undefined') {
		pageSize = 10;
	}
	sessionStorage.setItem(currentModel + ".pageSize", pageSize); // 当前页大小
	sessionStorage.setItem(currentModel + ".nextPage", $("#_click_page").val()); // 当前页
}


function reviseNextPage() {

	var last = $("#_last").val();
	var first = $("#_first").val();
	var currentContentCount = $("#_currentCount").val();
	if (last == "true" && first == "false") { 
		if (delArray.length == currentContentCount) {
			currentModel = $("#currentModel").val();
			var nextPage = sessionStorage.getItem(currentModel + ".nextPage");
			sessionStorage.setItem(currentModel + ".nextPage", nextPage - 1);
		}
	}
}
function displayContent() {

	currentModel = sessionStorage.getItem("currentModel");
	var nextPage = 0;
	var pageSize = 10;
	var bankAccount = "";
	var repayMonth = "";
	var prjName = "";
	var prjState = "";
	if (currentModel == null) {
		console.log("未进入session区域");
		if ($("#_click_page").val() != undefined && $("#_click_page").val()) {
			nextPage = $("#_click_page").val();
		}
		if (typeof (nextPage) == 'undefined' || nextPage == "") {
			nextPage = 0;
			$("#_click_page").val(nextPage);
		}
		if ($("#selectPageSize").val()
			&& $("#selectPageSize").val() != undefined) {
			pageSize = $("#selectPageSize").val();
		}
		if (typeof (pageSize) == 'undefined' || pageSize == "") {
			pageSize = 10;
			$("#selectPageSize").val(pageSize);
		}
		/** ****************从页面中取出页面中的条件****************************** */
		bankAccount=$("#bankAccountList_ip").attr("data-id");
		repayMonth=$("#repayMonth").val();
		prjName=$("#prjName").val();
		prjState=$("#state_ip").attr("data-id");
		/** ****************从页面中取出页面中的条件****************************** */
	} else {
		console.log("进入了session区域");
		bankAccount = sessionStorage.getItem(currentModel + ".bankAccount");
		repayMonth = sessionStorage.getItem(currentModel + ".repayMonth");
		/** ****************从sessionStorge中取出页面中的条件****************************** */
		prjName = sessionStorage.getItem(currentModel + ".prjName");
		prjState = sessionStorage.getItem(currentModel + ".prjState");

		/** ****************从sessionStorge中取出页面中的条件****************************** */
		/** ****************将原来记住的值传重新赋值到页面上****************************** */
		$("#prjName").val(prjName);
		$("#repayMonth").val(repayMonth);
		setSelect("bankAccountList",bankAccount);
		setSelect("state",prjState);
		/** ****************将原来记住的值传重新赋值到页面上****************************** */
	}
	loading();
	var url = "../zs/finance/queryFinanceProject";

	var mydata = {
		bankId: bankAccount,
		repayDate : repayMonth,
		finProjectName : prjName,
		tradeState : prjState,
		nextPage : nextPage,
		pageSize: pageSize
	};
	$.axpost(url, mydata, function (data) {
		loadingDone();

		if (data.respMap.curWeekPlan != null && data.respMap.curWeekPlan != undefined && data.respMap.curWeekPlan != "") {
			$("#curWeekPlan").html(data.respMap.curWeekPlan);
		}
		if (data.respMap.nextWeekPlan != null && data.respMap.nextWeekPlan != undefined && data.respMap.nextWeekPlan != "") {
			$("#nextWeekPlan").html(data.respMap.nextWeekPlan);
		}
		if (data.respMap.curMonthPlan != null && data.respMap.curMonthPlan != undefined && data.respMap.curMonthPlan != "") {
			$("#curMonthPlan").html(data.respMap.curMonthPlan);
		}

		var tblContentHtml = $("#tableContentTmple").render(
			data.respData.content);
		$("#mycontent").html(tblContentHtml);
		loadTmpl.renderExternalTemplate("page", "#displayPage", data.respData);
	});
}

$(function() {
	getBankAccountList();
	$("#frm_search").keydown(function(e){
		var e = e || event,  
		keycode = e.which || e.keyCode;
		if (keycode==13) { 
			stopDefault(e);
			displayContent();
		} 
	});
	
	// 行高亮,选中
	$("#example2").tableGrid({
		checkAllId : "checkboxFiveInput", // 全选框的ID属性
		singleCheckboxClass : "ckSelect",
		paging : "displayPage",
		pageAjax : function() {
			displayContent();
		}
	});

	// 点击搜索
	$("#search").click(function() {
	/*	currentModel = sessionStorage.getItem("currentModel");
		if (currentModel != null) {
			sessionStorage.removeItem("currentModel");
		}
		$("#_click_page").val(0);*/
		displayContent();
		console.log("search");
	});

	// 点击查询重置按钮
	$("#reset").click(function() {
		$("#repayMonth").val('');
		$("#prjName").val('');
		resetSelect("bankAccountList");
		resetSelect("state");
	});

	$("#export").click(function(){
		//导入记录
	let nextPage = 0;
	let pageSize = 10;
	let bankAccount = "";
	let repayMonth = "";
	let prjName = "";
	let prjState = "";
		if ($("#_click_page").val() != undefined && $("#_click_page").val()) {
			nextPage = $("#_click_page").val();
		}
		if (typeof (nextPage) == 'undefined' || nextPage == "") {
			nextPage = 0;
			$("#_click_page").val(nextPage);
		}
		if ($("#selectPageSize").val()
			&& $("#selectPageSize").val() != undefined) {
			pageSize = $("#selectPageSize").val();
		}
		if (typeof (pageSize) == 'undefined' || pageSize == "") {
			pageSize = 10;
			$("#selectPageSize").val(pageSize);
		}
		bankAccount=$("#bankAccountList_ip").attr("data-id");
		repayMonth=$("#repayMonth").val();
		prjName=$("#prjName").val();
		prjState=$("#state_ip").attr("data-id");
	
	const url = "../zs/finance/exportDetail";

	const mydata = {
		bankId: bankAccount,
		repayDate : repayMonth,
		finProjectName : prjName,
		tradeState : prjState,
		nextPage : nextPage,
		pageSize: pageSize
	};

	jsPost(url,mydata);
	});

	$("#createProject").click(function(){
		window.location.href='../finance/createProject.html';
	});
	
	
	//点击查看
	$(document).on("click",".seeSome",function(){
		rememberRecord();
		const tid = $(this).attr('tid');
		window.location.href='../finance/projectDetail.html?tid='+tid;
	});
	
	//日期UI
	$('#repayMonth').datetimepicker({
		language : 'zh-CN',
		format : 'yyyy-mm-dd',
		setDate : new Date(),
		weekStart : 1,
		// todayBtn: 1,
		autoclose : 1,
		todayHighlight : 1,
		startView : 2,
		minView : 2,
		forceParse : 0
	});


	var formVue = new Vue({
		el:'#plan_display',
		data:{
			option:'curWeek',
			repayPlan:[],
			sum:{
				principalSum:0,
				interestSum:0,
				amountSum:0,
				otherSum:0
			}
		},
		methods:{
			showDetail:function(bar){
				const url = '../zs/finance/planDetailByTime';
				let that = this;
				this.option=bar;
				$.axpost(url,{'option':bar},function(data){
					that.repayPlan = data.respData;
				});
			}
		},
		created: function (){
		},
		computed:{
			planSum:function(){
				const repayPlan = this.repayPlan;
				let sum={
					principalSum:0,
					interestSum:0,
					amountSum:0,
					otherSum:0
				};
				if(repayPlan==''||repayPlan==null||repayPlan==undefined){
					return sum;
				}
				repayPlan.forEach(e=>{
					sum.principalSum+=e.curPrincipal;
					sum.interestSum+=e.curInterest;
					sum.amountSum+=e.repayAmount;
					sum.otherSum+=e.otherFee;
				});
				sum.principalSum = Math.round((sum.principalSum + Number.EPSILON) * 100) / 100;
				sum.interestSum = Math.round((sum.interestSum + Number.EPSILON) * 100) / 100;
				sum.amountSum = Math.round((sum.amountSum + Number.EPSILON) * 100) / 100;
				sum.otherSum = Math.round((sum.otherSum + Number.EPSILON) * 100) / 100;
				return sum;
			}
		}
	});
});

function getBankAccountList(){
	var url = "../zs/finance/getBanckAccountList";
	$.axpost(url, null, function(data){
		
		var liHtml = "";
		if(data.respData != undefined && data.respData != ""){
			var liList = data.respData;
			if(liList != null && liList.length>0){
				for(var i=0;i<liList.length;i++){
					liHtml += "<li role='presentation'>"+
					"<a role='menuitem' data-id='"+liList[i].tid+"' tabindex='-1' href='#'>"+liList[i].bank+' | '+liList[i].cardNo+"</a>"+
					"</li>";
				}
			}
		}
		$("#bankAccountList_ul").empty().html(liHtml);
		
	});
}