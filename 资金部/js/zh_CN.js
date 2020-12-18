/*********************************
 * Themes, rules, and i18n support
 * Locale: Chinese; 中文
 *********************************/
(function ($) {
    /* Global configuration
     */
    $.validator.config({
        //stopOnError: false,
        //theme: 'yellow_right',
        defaultMsg: "{0}格式不正确",
        loadingMsg: "正在验证...",
        
        // Custom rules
        rules: {
            digits: [/^\d+$/, "请输入数字"]
    		,digitsNumber: [/^[1-9]\d*$/, "请输入大于0的整数"]
		    ,decimal: [/^-?\d+\.\d+$/, "请输入小数"]
    		,decimalNumber: [/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/, "请输入大于0的数"] //包含小数
    		,decimalNonnegative: [/^((?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,})|[0]$/, "请输入大于或等于0的数"] //包含小数
    		,decimalNonnegative2: [/^((\d{1,})|(\d{1,}[.]\d{1,}))$/, "请输入大于或等于0的数"] //包含小数(上面的貌似有问题)
            ,letters: [/^[a-z]+$/i, "{0}只能输入字母"]
    		,lettersOrNumbers: [/^[0-9a-zA-Z]*$/i, "请输入数字或字母"]
            ,tel: [/^(?:(?:0\d{2,3}[- ]?[1-9]\d{6,7})|(?:[48]00[- ]?[1-9]\d{6}))$/, "电话格式不正确"]
            ,mobile: [/^[1][3,4,5,7,8,9][0-9]{9}$/, "手机号格式不正确"]
            ,email: [/^[\w\+-]+(\.[\w\+-]+)*@[a-z\d-]+(\.[a-z\d-]+)*\.([a-z]{2,4})$/i, "邮箱格式不正确"]
            ,qq: [/^[1-9]\d{4,}$/, "QQ号格式不正确"]
            ,date: [/^\d{4}-\d{1,2}-\d{1,2}$/, "请输入正确的日期,例:yyyy-mm-dd"]
            ,time: [/^([01]\d|2[0-3])(:[0-5]\d){1,2}$/, "请输入正确的时间,例:14:30或14:30:00"]
            ,ID_card: [/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/, "请输入正确的身份证号码"]
            ,url: [/^(https?|ftp):\/\/[^\s]+$/i, "网址格式不正确"]
            ,postcode: [/^[1-9]\d{5}$/, "邮政编码格式不正确"]
            ,chinese: [/^[\u0391-\uFFE5]{2,8}$/, "请输入2-8个中文"]
            ,chinese_order:[/^[\u4e00-\u9fa5]+$/,"请输入中文汉字"]
            ,username: [/^\w{5,20}$/, "请输入5-20位数字、字母、下划线"]
            ,password: [/^[0-9a-zA-Z]{8,16}$/, "密码由8-16位数字、字母组成"]
    		,numberLettersMix: [/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/, "请输入由6-20位数字、字母的组合"]
    		,carNo: [/^[\u4e00-\u9fa5]{1}[a-zA-Z]{1}[a-zA-Z0-9]+$/, "车牌开头两位由汉字字母组成"]
    		,idCard: [/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/, "身份证格式不正确"]
    		,decimalTwo: [/^-?\d+(\.(\d){0,2}){0,1}$/, "只能有两位小数"]
    		,decimalFour: [/^-?\d+(\.(\d){0,4}){0,1}$/, "只能有四位小数"]
    		,decimalSix: [/^-?\d+(\.(\d){0,6}){0,1}$/, "最多有六位小数"]
//		    ,decimalTwoPositive: [/^\d+(\.(\d){0,2}){0,1}$/, "只能有两位小数"]
    		,decimalTwoAcreage: [/(?!^0\.0?0$)^(([1-9][0-9]*)|[0]|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, "请输入正确的面积格式，如：88.04"]
    		,decimalTwoPositive: [/(?!^0\.0?0$)^(([1-9][0-9]*)|[0]|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, "请输入正确的金额格式，如：89.04"]
    		,decimalTwoPositive2:[/(^-?[1-9](\d+)?(\.\d{1,2})?$)|(^-?0$)|(^-?\d\.\d{1,2}$)/,"请输入正确的金额格式，如：88.04"]//允许负数
    		,decimalone: [/^-?\d+(\.(\d){0,1}){0,1}$/, "只能有一位小数"]
            ,decimalcent: [/(?!^0\.0?0$)^([1-9]\d?(\.\d{1,2})?|0.\d{1,2})$/,"只能输入大于0小于100的两位小数" ]
			,decimaltest: [/(?!^0\.0?0$)^(0\.\d{1,2}|[1-9](\.\d{1,2})?|1\d(\.\d{1,2})?|20|20\.0|20\.00)$/,"只能输入大于0不大于20的两位小数" ]
    		,decimalTwotest: [/^(-?\d+(\.(\d){0,2}){0,1})\/(-?\d+(\.(\d){0,2}){0,1})$/, "正确格式：*.**/*.**"]
		    ,decimalTwoletter: [/^(0.0[1-9])|0$/, "只能输入0.01到0.09之间的数字"]
			,dateTwo: [/^\d{4}\/\d{1,2}\/\d{1,2}$/, "请输入正确的日期,例:yyyy-mm-dd"]
    		,monthDate: [/^((\d{4})-(0[1-9]|1[0-2]))$/, "请输入正确的月份,例:yyyy-mm"]
            ,billGenDate: [/^([1-9]|1\d|2[0-7])$/, "请输入1-27的整数"]//产品账单生成日
            ,billGenDate_28: [/^([1-9]|1\d|2[0-8])$/, "请输入1-28的整数"]//产品账单生成日
    		,billGenDate_31: [/^([1-9]|1\d|2\d|3[0-1])$/, "请输入1-31的整数"]//选择日期
            ,accept: function (element, params){
                if (!params) return true;
                var ext = params[0];
                return (ext === '*') ||
                       (new RegExp(".(?:" + (ext || "png|jpg|jpeg|gif") + ")$", "i")).test(element.value) ||
                       this.renderMsg("只接受{1}后缀", ext.replace('|', ','));
            }
           ,checkIdentityNo: function(element, params){
        	   var idCard=element.value;
      		 var regIdCard=/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
      		 if(regIdCard.test(idCard)){
      		  if(idCard.length==18){
      		   var idCardWi=new Array( 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 );
      		   var idCardY=new Array( 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 );
      		   var idCardWiSum=0;
      		   for(var i=0;i<17;i++){
      		    idCardWiSum+=idCard.substring(i,i+1)*idCardWi[i];
      		   }
      		   var idCardMod=idCardWiSum%11;
      		   var idCardLast=idCard.substring(17);
      		   if(idCardMod==2){
      		    if(!(idCardLast=="X"||idCardLast=="x")){
      		    return false;
      		    }
      		   }else{
      		    if(!(idCardLast==idCardY[idCardMod])){
      		     return false;
      		    }
      		   }
      		  } 
      		 }else{
      		  return false;
      		 } 
      		 return true;
      	 
           }
            
        }
    });

    /* Default error messages
     */
    $.validator.config({
        messages: {
            required: "{0}不能为空",
            remote: "{0}已被使用",
            integer: {
                '*': "请输入整数",
                '+': "请输入正整数",
                '+0': "请输入正整数或0",
                '-': "请输入负整数",
                '-0': "请输入负整数或0"
            },
            match: {
                eq: "{0}与{1}不一致",
                neq: "{0}与{1}不能相同",
                lt: "{0}必须小于{1}",
                gt: "{0}必须大于{1}",
                lte: "{0}必须小于或等于{1}",
                gte: "{0}必须大于或等于{1}"
            },
            range: {
                rg: "请输入{1}到{2}的数",
                gt: "请输入大于或等于{1}的数",
                lt: "请输入小于或等于{1}的数"
            },
            checked: {
                eq: "请选择{1}项",
                rg: "请选择{1}到{2}项",
                gt: "请至少选择{1}项",
                lt: "请最多选择{1}项"
            },
            length: {
                eq: "请输入{1}个字符",
                rg: "请输入{1}到{2}个字符",
                gt: "请至少输入{1}个字符",
                lt: "请最多输入{1}个字符",
                eq_2: "",
                rg_2: "",
                gt_2: "",
                lt_2: ""
            }
        }
    });

    /* Themes
     */
    var TPL_ARROW = '<span class="n-arrow"><b>◆</b><i>◆</i></span>';
    $.validator.setTheme({
        'simple_right': {
            formClass: 'n-simple',
            msgClass: 'n-right'
        },
        'simple_bottom': {
            formClass: 'n-simple',
            msgClass: 'n-bottom'
        },
        'yellow_top': {
            formClass: 'n-yellow',
            msgClass: 'n-top',
            msgArrow: TPL_ARROW
        },
        'yellow_right': {
            formClass: 'n-yellow',
            msgClass: 'n-right',
            msgArrow: TPL_ARROW
        },
        'yellow_right_effect': {
            formClass: 'n-yellow',
            msgClass: 'n-right',
            msgArrow: TPL_ARROW,
            msgShow: function($msgbox, type){
                var $el = $msgbox.children();
                if ($el.is(':animated')) return;
                if (type === 'error') {
                    $el.css({
                        left: '20px',
                        opacity: 0
                    }).delay(100).show().stop().animate({
                        left: '-4px',
                        opacity: 1
                    }, 150).animate({
                        left: '3px'
                    }, 80).animate({
                        left: 0
                    }, 80);
                } else {
                    $el.css({
                        left: 0,
                        opacity: 1
                    }).fadeIn(200);
                }
            },
            msgHide: function($msgbox, type){
                var $el = $msgbox.children();
                $el.stop().delay(100).show().animate({
                    left: '20px',
                    opacity: 0
                }, 300, function(){
                    $msgbox.hide();
                });
            }
        }
    });
})(jQuery);