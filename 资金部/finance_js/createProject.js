$(function () {

    var myArr = new Array();//需要绑定上传的id
    var totalCount = 0;//进度条显示的总下载条数
    var completedCount = 0;//进度条显示的已完成条数
    var failCount = 0;//已失败条数
    
    const tid = getUrlParam('tid')
    if (tid != null && tid != '' && tid != undefined) {
        loading();
        const url = '../zs/finance/getProjectDetailBySerialNo';
        $.axpost(url, { 'tid': tid }, function (data) {
            loadingDone();
            /*const prjTemp= {
                bankAccount: "",
                prjName: "",
                amount: "",
                date: "",
                rate: "",
                creditAgency: "",
                adviserFee: "",
                guaranteeFee: "",
                bondFee: "",
                tradeBillList: [],
                associatedPrjList: []
            };
            bigVue.project = JSON.parse(JSON.stringify(prjTemp));*/
            bigVue.project = data.respData;
            if(data.respData.tradeBillList==null||data.respData.tradeBillList==''||data.respData.tradeBillList==undefined){
           		bigVue.project.tradeBillList = [];
            }
            if(data.respData.associatedPrjList==null||data.respData.associatedPrjList==''||data.respData.associatedPrjList==undefined){
           		bigVue.project.associatedPrjList = [];
            }
            prjvue.prjSelected = [];
            prjvue.prjSelected = JSON.parse(JSON.stringify(data.respData.associatedPrjList));
            if(bigVue.project.tradeBillList!=null&&bigVue.project.tradeBillList!=''&&bigVue.project.tradeBillList!=undefined){
            	bigVue.project.tradeBillList.forEach(function (value) {
                value.repayDate = formatDate(value.repayDate);
            });
            }
            
            const bankAccount = data.respData.bank + '|' + data.respData.cardNo;
            bigVue.project.bankAccount = bankAccount;
            getBillListSum(data.respData.tradeBillList);
            
            const date = new Date(data.respData.date);
            $('#date').datetimepicker("setDate", date);
            
            const bankTag = document.getElementById("bankAccountI");
            bankTag.innerHTML = bankAccount;
            const bank_ip = document.getElementById("bankAccount_ip");
            $('a[data-id$='+data.respData.bankId+']').addClass("on");
            const bankAccountButton = document.getElementById("bankAccount");
            bankAccountButton.setAttribute('data-id', data.respData.bankId);
            bank_ip.setAttribute('data-id', data.respData.bankId);
            bank_ip.value = data.respData.bankId;
            $('#bankAccount').addClass("btn dropdown-toggle wrote");
            
            if(data.respData.dataList!=null&&data.respData.dataList!=''&&data.respData.dataList!=undefined){
            	data.respData.dataList.forEach(function (value) {
                const picture = getpictureHtml(value.dataType, value.url, data.respMap.zimgUrl, null, value.icon, null);
                $('#contract').parent().before(picture);
            });
            }
            

        });
    }
    
    $(document).on("click","img",function(e){
		fImgPreview($("img"),e.target);
	});
    var bigVue = new Vue({
        el: "#project",
        data: {

            project: {
                bankAccount: "",
                prjName: "",
                amount: "",
                date: "",
                rate: "",
                creditAgency: "",
                adviserFee: "",
                guaranteeFee: "",
                bondFee: "",
                tradeBillList: [],
                associatedPrjList: []
            },
            billSum: {}
        },
        methods: {
            createProject: function () {
                $('#projectForm').validator().trigger("validate");
                var prjNameValid = $("#ied").hasClass('hidden');
                if ($('#projectForm').validator().isValid() && prjNameValid) {
                    let url = "../zs/finance/submitProject";

                    var imgJson = "[";
                    imgJson = getImg("img", imgJson, "contract", "融资合同");
                    if (imgJson != "[") {
                        imgJson = imgJson.substring(0, imgJson.length - 1);
                    }
                    imgJson += "]";
                    var orderDataList = eval(imgJson);
                    const bankId = $('#bankAccount_ip').attr('data-id');
                    const bankName = $('#bankAccountI').text().split('|')[0];
                    const cardNo = $('#bankAccountI').text().split('|')[1];
                    var date = $("#date").val();
                    let dataPrj = this.project;
                    if (tid != null && tid != '' && tid != undefined) {
                        dataPrj.tid = tid;
                    }
                    dataPrj.bankId = bankId;
                    dataPrj.date = date;
                    dataPrj.dataList = orderDataList;
                    dataPrj.bank = bankName;
                    dataPrj.cardNo = cardNo;
                    if (dataPrj.tradeBillList) {
                        dataPrj.tradeBillList.forEach(function (value) {
                            var Time = new Date(value.repayDate);
                            var timeStemp = Time.getTime();
                            value.repayDate = timeStemp;
                        });
                    }
                    loading();
                    $.axpostJosn(url, dataPrj, function (data) {
                        loadingDone();
                        if (data.respCode == 1) {
                            callPop(1, "保存成功");
                            return window.location.href = "../finance/financeQuery.html"
                        } else {
                            callPop(1, data.respMsg);
                        }
                    });

                    console.log("ok");
                    loadingDone();
                } else {
                    alert("输入信息有误");
                }
            },
            init: function () {
                $("#contract").each(function () {
                    if (myArr.indexOf($(this).attr("id")) == -1) {//没有包含此id，就添加
                        myArr.push($(this).attr("id"));
                    }
                })
                $.each(myArr, function (i, n) {
                    var self = this.toString();
                    //实例化一个plupload上传对象
                    myUpload(self);
                });

                $(".close-btn").click(function () {
                    closeProgress();
                    $(".close-btn").addClass("hidden");
                });

                $(".uploadLayer_close").click(function () {
                    $("#uploadLayer").addClass("hidden");
                });

                $(".uploadLayer_max").click(function () {
                    uploadLayerReady();
                });

                $(".uploadLayer_min").click(function () {
                    uploadLayerReady();
                });
            },
            isExsisted: function () {
                var prjNameVal = $("#prjName").val();
                if (prjNameVal != '' && prjNameVal != null) {
                    var prjNameJson = { prjName: prjNameVal ,tid:tid};
                    var url = '../zs/finance/getExistedProject';
                    $.axpost(url, prjNameJson, function (data) {
                        if (data.respData == 'true') {
                            $("#ied").removeClass('hidden');
                        } else {
                            $("#ied").addClass('hidden');
                        }
                    });
                }
            },
        	restorePrj: function(){
                prjvue.$data.projectCache = JSON.parse(JSON.stringify(this.project.associatedPrjList));
            }
        },
        created: function () {
        	const self = this;
            getBankAccountList();
        },
        mounted: function () {
            imageLoager();
            this.init();
        },
        computed: {
            residualAmount: function () {
                var residualAmount = 0, i = 0;
                if(this.project.associatedPrjList!=null&&this.project.associatedPrjList!=''&&this.project.associatedPrjList!=undefined){
	                for (; i < this.project.associatedPrjList.length; i++) {
	                    residualAmount += this.project.associatedPrjList[i].paidAmount;
	                }
                }
                return residualAmount;
            }
        }
    });


    $('#date').datetimepicker({
        language: 'zh-CN',
        format: 'yyyy-mm-dd',
        setDate: new Date(),
        weekStart: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0
    });
    
    $('#date').datetimepicker("setDate", new Date());

    var prjvue = new Vue({
        el: '#prjModel',
        data: {

            contractNum: "",
            prjSelected: [],
            project: [],
            projectCon: [],
            projectCache:[],
            mfrs: "",
            client: "",
            n: -1

        },
        methods: {
            searchPrj: function () {
                this.projectCon = JSON.parse(JSON.stringify(this.project));
                if (this.contractNum) {
                    let i = 0;
                    for (; i < this.projectCon.length; i++) {
                        if (this.projectCon[i].contractNo != this.contractNum) {
                            this.projectCon.splice(i, 1);
                            i--;
                        }
                    }
                }
                if (this.mfrs) {
                    let i = 0;
                    for (; i < this.projectCon.length; i++) {
                        if (this.projectCon[i].mfrsName != this.mfrs) {
                            this.projectCon.splice(i, 1);
                            i--;
                        }
                    }
                }
                if (this.client) {
                    let i = 0;
                    for (; i < this.projectCon.length; i++) {
                        if (this.projectCon[i].princName != this.client) {
                            this.projectCon.splice(i, 1);
                            i--;
                        }
                    }
                }

            },
            resetPrj: function () {
                this.contractNum = "";
                this.mfrs = "";
                this.client = "";
                this.projectCon = JSON.parse(JSON.stringify(this.project));
            },
            prjConfirm: function () {
                if (this.prjSelected.length == 0) {
                    alert("当前无选中项目");
                    return;
                }
                $("#prjModel").modal("hide");
                let i = 0;
                for (; i < bigVue.project.associatedPrjList.length; i++) {
                    if (!this.prjSelected.includes(bigVue.project.associatedPrjList[i])) {
                        bigVue.project.associatedPrjList.splice(i, 1);
                        i--;
                    }
                }
                this.prjSelected.forEach(function (value) {
                    if (!bigVue.project.associatedPrjList.includes(value)) {
                        bigVue.project.associatedPrjList.push(value);
                    }
                });
                this.contractNum = "";
                this.mfrs = "";
                this.client = "";
            },
            selectPrj: function (project, index) {
                project.select = !project.select;
                if (project.select) {
                    this.prjSelected.push(project);
                } else {
                    const indexdel = this.prjSelected.findIndex(function (e) {
                        return e.tid === project.tid;
                    });
                    this.prjSelected.splice(indexdel, 1);
                }
            },
            cancel:function(){
                this.prjSelected = JSON.parse(JSON.stringify(this.projectCache));
            },
            selectrev: function (project, index) {
                this.prjSelected.splice(index, 1);
            }
        },
        created: function () {
            let self = this;
            console.log(tid);
            getAssociatedProject(self,tid);
        },
        computed: {
            projectFilter: function () {
                let prjArray = JSON.parse(JSON.stringify(this.projectCon));
                let prjSelectedArray = this.prjSelected;
                prjArray.forEach(function (e) {
                    for (let i = 0; i < prjSelectedArray.length; i++) {
                        if (prjSelectedArray[i].tid === e.tid) {
                            Vue.set(e, 'select', true);
                            break;
                        }
                        Vue.set(e, 'select', false);
                    }
                });
                return prjArray;
            }
        }


    });

    function getBankAccountList() {
        const url = "../zs/finance/getBanckAccountList";
        $.axpost(url, null, function (data) {

            var liHtml = "";
            if (data.respData != undefined && data.respData != "") {
                var liList = data.respData;
                if (liList != null && liList.length > 0) {
                    for (var i = 0; i < liList.length; i++) {
                        liHtml += "<li role='presentation'>" +
                            "<a role='menuitem' data-id='" + liList[i].tid + "' tabindex='-1' href='#' data-bankName='" + liList[i].bank + "' data-cardNo='" + liList[i].cardNo + "'>" + liList[i].bank + '|' + liList[i].cardNo + "</a>" +
                            "</li>";
                    }
                }
            }
            $("#bankAccount_ul").empty().html(liHtml);

        });
    }


    function getAssociatedProject(vue,tid) {
        var url = "../zs/finance/getAssociatedProject";
        console.log(tid);
        $.axpost(url, {'tid':tid}, function (data) {
            vue.project = data.respData;
            vue.projectCon = JSON.parse(JSON.stringify(vue.project));
        });
    }

    function formatDate(dateTime) {
        var date = new Date(dateTime);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        month = month < 10 ? ('0' + month) : month;
        day = day < 10 ? ('0' + day) : day;
        return year + '-' + month + '-' + day;

    }

    $(".imgbox a.del").click(function () {
        $(".file_excel").val("");
        $(".file_excel_show").addClass("hidden");
        $(".addimg").removeClass("hidden");
    });
    $(".resetModel").click(function () {
        setTimeout(function () {
            resetModel();
        }, 400);
    });
    function resetModel() {
        $(".addimg").removeClass("hidden");
        $(".file_excel_show").addClass("hidden");

    }
    $(".resetModel1").click(function () {
        setTimeout(function () {
            resetModel1();
        }, 400);
    });
    function resetModel1() {
        $(".addimg").removeClass("hidden");
        $(".file_excel_show").addClass("hidden");

    }


    $(document).on("click", "#importPlan", function () {


        var filepath = $("#xlsFile1").val();
        if (filepath == null || filepath == '') {
            callAlert("警告");
            return;
        }
        if (filepath.substring(filepath.length - 3, filepath.length) != "xls" && filepath.substring(filepath.length - 4, filepath.length) != "xlsx") {
            callAlert("xls");
            return;
        }
        loading();
        var reqData = null;
        $.ajaxFileUpload({
            url: "../zs/finance/importPlan",
            secureuri: false,
            fileElementId: 'xlsFile1',
            data: reqData,
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                loadingDone();
                resetModel1();
                $('#validateForm')[0].reset();
        		$('#file_excel_file_path1').html('');
                $("#selectFileModal").modal("hide");
                if (typeof (data.respData.success) === "undefined") {
                } else {
                    if (data.respData.list) {
                        if (bigVue.project.tradeBillList == null || bigVue.project.tradeBillList.length == 0|| bigVue.project.tradeBillList==undefined) {
                              bigVue.project.tradeBillList=[];
                              console.log(bigVue.project.associatedPrjList);
                              data.respData.list.forEach(function (value) {
                                  if (value.repayDate != '' || value.repayDate != null) {
                                      value.repayDate = formatDate(value.repayDate);
                                  }
                                  bigVue.project.tradeBillList.push(JSON.parse(JSON.stringify(value)));
                              });
                            getBillListSum(data.respData.list);
                        } else {
                            const size = data.respData.list.length;
                            let billSum = {
                                curPrincipal: 0,
                                curInterset: 0,
                                repayAmount: 0
                            };
                            for (let i = 0; i < size; i++) {
                                const billData = data.respData.list[i];
                                billSum.curPrincipal += billData.curPrincipal;
                                billSum.curInterset += billData.curInterset;
                                billSum.repayAmount += billData.repayAmount;
                                if (billData != '' || billData != null) {
                                    billData.repayDate = formatDate(billData.repayDate);
                                }
                                if (bigVue.project.tradeBillList[i] != null && bigVue.project.tradeBillList[i] != '') {
                                    const bill = JSON.parse(JSON.stringify(billData));
                                    bill.tid = bigVue.project.tradeBillList[i].tid;
                                    bigVue.project.tradeBillList[i] = bill;
                                } else {
                                    bigVue.project.tradeBillList.push(JSON.parse(JSON.stringify(billData)));
                                }
                            }
                            bigVue.billSum = JSON.parse(JSON.stringify(billSum));
                        }
                    }
                }
            }
        }


        );
    });

    $(document).on("change", "#xlsFile1", fileChange);
    function fileChange() {

        $(".file_excel_show").removeClass("hidden");
        $(".addimg").addClass("hidden");
        $("#file_excel_file_path1").html($("#xlsFile1").val());
    }


    function myUpload(self) {
        var uploader = new plupload.Uploader({
            browse_button: self, //触发文件选择对话框的按钮，为那个元素id
            url: "../zs/uploadMaterialController/ossUpload",//服务器端的上传页面地址
            container: document.getElementById('container'),//这个是容器的地址
            silverlight_xap_url: '../js/Moxie.xap',
            multipart_params: { 'self': self },
            flash_swf_url: '../js/Moxie.swf',
            filters: [],//图片限制

            init: {
                FilesAdded: function (up, files) {//添加图片
                    if (files.length > 10) { // 最多上传10张图
                        plupload.each(files, function (file) {
                            uploader.removeFile(file.id);
                        });
                        loadingDone();
                        callAlert("提示", "一次最多上传10张图片");
                        return;
                    }
                    var flag = false;
                    if (files.length <= 10) {
                        plupload.each(files, function (file) {//限制上传大小提示
                            if (file.size > 200 * 1048576) {
                                flag = true;
                            }
                        });
                        if (flag) {
                            plupload.each(files, function (file) {
                                uploader.removeFile(file.id);
                            });
                            loadingDone();
                            callAlert("提示", "所选每个文件大小不能超过200MB");
                            return;
                        }
                    }
                    console.log("go");
                    $("#uploadLayer").removeClass("hidden");
                    totalCount = totalCount + files.length;//图片总数添加
                    $("#number").html("(" + completedCount + "/" + totalCount + ")");
                    plupload.each(files, function (file) {
                        document.getElementById('filelist').innerHTML = "<ul class='uploading' id='" + file.id + "'>" +
                            "<li class='upload_name'>" + file.name + "</li>" +
                            "<li class='upload_size'>" + plupload.formatSize(file.size) + "</li>" +
                            "<li>" +
                            "<div class='progress'>" +
                            "<span style='width: " + 0 + ";'></span>" +
                            "</div>" +
                            "</li>" +
                            "<li class='upload_status'>" +
                            "等待上传" +
                            "</li>" +
                            "</ul>" + document.getElementById('filelist').innerHTML;
                    });
                    uploader.start();
                    uploadLayerReady();//显示进度条
                }
            },

            UploadProgress: function (up, file) {
                document.getElementById(file.id).find("span").attr("width", file.percent);
            }

        });
        //在实例对象上调用init()方法进行初始化
        uploader.init();
        //绑定各种事件，并在事件监听函数中做你想做的事
        uploader.bind('FilesAdded', function (uploader, files) {//添加完图片开始上传
            uploader.start();
            loading();
        });
        uploader.bind('FileUploaded', function (uploader, files, data) {
            //将上传完成的文件显示在对应的分类下面
            var response = eval('(' + data.response + ')').respData;
            var pre_type = $("#" + self).parent().parent().attr("pre_type");
            if (eval('(' + data.response + ')').respCode == 1) {//上传成功
                //进度条更新
                completedCount = completedCount + 1;//已完成条数添加
                $("#number").html("(" + completedCount + "/" + totalCount + ")");
                $("#" + files.id + "").removeClass("uploading").addClass("uploaded");
                $("#" + files.id + "").find("li[class='upload_status']")[0].innerHTML = "上传成功";
                if (completedCount + failCount == totalCount) {//全部上传完成之后
                    $("#uploadLayer").removeClass("open");
                    loadingDone();
                }

                var itemId = $("#" + self).parent().attr("itemId");//细分类型Id
                var itemName = $("#" + self).parent().attr("itemName");//细分类型名称
                //图片展示
                if (response.videoPath != undefined) {
                    pictureHtml = "<div class='imgbox videobox' data-id='" + response.fileUrl + "'data-id-r='" + response.iconUrl + "' data='" + self + "'><a itemId='" + itemId + "' itemName='" + itemName + "' class='imglink' target='_blank' href='" + response.videoPath + "' dataType='" + response.ext + "' datatype='" + response.ext + "' videoUrl='" +
                        response.fileUrl + "' phoneUrl='" + response.iconUrl + "'><img dataType='" + response.ext + "' src='" + response.iconPath + "'  /></a>"
                        + "<a class='del edit' data-toggle='modal' data-target='#deleteImg' href='javascript:'><i>&times;</i></a></div>";
                } else {
                    pictureHtml = "<div class='imgbox' data-id='" + response.fileUrl + "' data='" + self + "'><a itemId='" + itemId + "' itemName='" + itemName + "' class='imglink' href='javascript:'  dataType='" + response.ext + "' datatype='" + response.ext + "' videoUrl='" +
                        response.videoUrl + "' phoneUrl='" + response.fileUrl + "'><img dataType='" + response.ext + "' data-src='" + response.picturePath + "' src='" + response.picturePath + "?w=100&h=100' class='preview " + pre_type + "' /></a>"
                        + "<a class='del edit' data-toggle='modal' data-target='#deleteImg' href='javascript:'><i>&times;</i></a></div>";
                }


                //刷新文件域
                $("#" + self).parent().before(pictureHtml);
            } else {//失败
                failCount = failCount + 1;
                var respMsg = eval('(' + data.response + ')').respMsg;
                $("#" + files.id + "").removeClass("uploading").addClass("failure");
                $("#" + files.id + "").find("li[class='upload_status']")[0].innerHTML = "失败(" + respMsg.substring(1, 10) + ")";
                if (completedCount + failCount == totalCount) {//全部上传完成之后-最后一个失败
                    $("#uploadLayer").removeClass("open");
                    loadingDone();
                }
            }
        });
        uploader.bind('UploadProgress', function (uploader, files) {//文件上传过程中不断触发，显示上传进度
            $("#" + files.id + "").find("li[class='upload_status']")[0].innerHTML = "正在上传";
            $(document.getElementById(files.id)).find("span").attr("style", "width: " + files.percent + "%;");
        });
    }

    function getpictureHtml(dataType, url, zimgurl, video_url, icon, pre_type) {
        var retHtml = "";
        if (dataType == ".png" || dataType == ".gif" || dataType == ".jpeg" || dataType == ".jpg") {
            retHtml = "<div data-id='" + url + "' class='imgbox'><a class='imglink'><img data-src='" + (zimgurl + url) + "' src='" + zimgurl + url + "' dataType='" + dataType + "' class='preview " + pre_type + "' /></a>"
                + "<a class='del edit' data-toggle='modal' data-target='#deleteImg' href='javascript:'><i>&times;</i></a></div>";
        } else {
            retHtml = "<div data-id='" + url + "' data-id-r='" + icon + "' class='imgbox videobox'><a class='imglink' target='_blank' href='" +
                video_url + url + "'><img src='" + zimgurl + icon + "' dataType='" + dataType + "'  /></a>"
                + "<a class='del edit' data-toggle='modal' data-target='#deleteImg' href='javascript:'><i>&times;</i></a></div>";
        }
        return retHtml;
    }

    $(document).on("click", "a.del", function () {//删除上传图片
        var delImg = $(this).closest(".imgbox");
        delImg.fadeOut(function () {
            delImg.remove();
        }
        );
    })

    /**
     * 
     * @param {*} imgId 
     * @param {*} imgJson 
     * @param {*} dataCategory 
     * @param {*} itemName 
     * 封装图片信息
     */
    function getImg(imgId, imgJson, dataCategory, itemName) {
        var Imgs = $("#" + imgId).find(".imgbox");
        if (Imgs.length > 0) {
            $("#" + imgId + " .imgbox").each(function () {
                var thisImg = "{";
                var imgMd5 = $(this).attr("data-id");
                var iconurl = $(this).attr("data-id-r");
                if (typeof (iconurl) == "undefined" || null == iconurl) {
                    iconurl = "";
                }
                var data_type = $(this).find("img").attr("datatype");
                thisImg += "\"url\":\"" + imgMd5 + "\",";
                thisImg += "\"icon\":\"" + iconurl + "\",";
                thisImg += "\"dataType\":\"" + data_type + "\",";
                thisImg += "\"itemName\":\"" + itemName + "\",";
                thisImg += "\"dataCategory\":\"" + dataCategory + "\"},";
                imgJson += thisImg;
            });
        }
        return imgJson;
    }

    function getBillListSum(list) {
        let billSum = {
            curPrincipal: 0,
            curInterset: 0,
            repayAmount: 0
        };
        if(list!=null&&list!=''&&list!=undefined){
        	list.forEach(function (value) {
            if (value.repayDate != '' || value.repayDate != null) {
                value.repayDate = formatDate(value.repayDate);
                billSum.curPrincipal += value.curPrincipal;
                billSum.curInterset += value.curInterset;
                billSum.repayAmount += value.repayAmount;
            }
        })
        }
        bigVue.billSum = JSON.parse(JSON.stringify(billSum));
    }




});

