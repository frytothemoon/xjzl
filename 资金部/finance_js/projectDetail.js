$(function () {
    loading();
    const tid = getUrlParam("tid");

    if (tid != null && tid != '' && tid != undefined) {
        const url = '../zs/finance/getProjectDetailBySerialNo';
        $.axpost(url, { 'tid': tid }, function (data) {
            loadingDone();
            prjDetail.project = JSON.parse(JSON.stringify(data.respData));
            prjDetail.userRole = JSON.parse(JSON.stringify(data.respMap.user));
            prjDetail.state = JSON.parse(JSON.stringify(data.respMap.state));
            prjDetail.archival.zimgurl = JSON.parse(JSON.stringify(data.respMap.zimgUrl));

            let billSum = {
                curPrincipal: 0,
                curInterest: 0,
                repayAmount: 0
            };

            prjDetail.project.tradeBillList.forEach(function (value) {
                value.repayDate = formatDate(value.repayDate);
                billSum.curPrincipal += value.curPrincipal;
                billSum.curInterest += value.curInterest;
                billSum.repayAmount += value.repayAmount;
            });
            prjDetail.billSum = JSON.parse(JSON.stringify(billSum));


            for (let i = 0; i < prjDetail.project.associatedPrjList.length; i++) {
                prjDetail.sumAmount += prjDetail.project.associatedPrjList[i].paidAmount;
            }

            prjDetail.project.tradeBillList.forEach(function (value) {
                value.repayDate = formatDate(value.repayDate);
            });
            if (data.respData.dataList != '' && data.respData.dataList != undefined) {
                data.respData.dataList.forEach(function (value) {
                    const picture = getpictureHtml(value.dataType, value.url, data.respMap.zimgUrl, null, value.icon, null);
                    $('#contractImg').append(picture);
                });
            }


        });
    }

    $(document).on("click", "img", function (e) {
        fImgPreview($("img"), e.target);
    });
	
    var prjDetail = new Vue({
        el: '#projectForm',
        data: {
            project: {
                tid: '',
                adviserFee: '',
                amount: '',
                bank: '',
                banId: '',
                bondFee: '',
                cardNo: '',
                creditAgency: '',
                date: '',
                rate: '',
                guaranteeFee: '',
                prjName: '',
                associatedPrjList: [],
                dataList: [],
                tradeBillList: []
            },
            userRole: '',
            state: '',
            sumAmount: 0,
            archival: {
                zimgurl: '',
                zimg_size: ''
            },
            tradeRecord: [],
            receipt: [],
            receiptCon: [],
            billSum: {
                curPrincipal: 0,
                curInterest: 0,
                repayAmount: 0
            }
        },
        methods: {
            cancelPrj: function () {
                const cancelUrl = '../zs/finance/projectOperation';
                const operation = 'cancel';
                $.axpost(cancelUrl, { 'tid': tid, 'operation': operation }, function (data) {
                    window.location.href = '../finance/financeQuery.html';
                });
            },
            modify: function () {
                window.location.href = '../finance/createProject.html?tid=' + tid;
            },
            approvePrj: function () {
                const confirmUrl = '../zs/finance/projectOperation';
                const operation = 'approve';
                $.axpost(confirmUrl, { 'tid': tid, 'operation': operation }, function (data) {
                    window.location.href = '../finance/projectDetail.html?tid=' + tid;
                });
            },
            settlePrj: function () {
                const settleUrl = '../zs/finance/projectOperation';
                const operation = 'settle';
                $.axpost(settleUrl, { 'tid': tid, 'operation': operation }, function () {
                    window.location.href = '../finance/projectDetail.html?tid=' + tid;
                });
            },
            showReceiptDetail: function (bill, index) {
                const tid = bill.tid;
                 const tradeRecordUrl = '../zs/finance/getTradeRecord';
                 let that = this;
                 $.axpost(tradeRecordUrl, { 'billTid': tid }, function (data) {
                     that.tradeRecord = data.respData;
                     that.tradeRecord.forEach(function(e){
                     e.tradeDate = formatDate(e.tradeDate);
                     });
                 });
                 console.log(this.tradeRecord);
                /*let self = this;
                bankReceipt(self, bill);*/
            },
            billTid: function (bill) {
                finReceipt.$data.billTid = bill.tid;
            }
        },
        created() {

        },
        computed: {
            sumAmount() {
                let sumAmount = 0;
                for (let i = 0; i < this.project.associatedPrjList.length; i++) {
                    sumAmount += this.project.associatedPrjList[i].paidAmount;
                }
                return sumAmount;
            },
            repAmountSum: function () {
                let sum = 0;
                if (this.tradeRecord == undefined || this.tradeRecord == '' || this.tradeRecord == null) {
                }
                else {
                    for (let i = 0; i < this.tradeRecord.length; i++) {
                        sum += this.tradeRecord[i].money;
                    }
                }
                return sum;
            }
        }
    });

    var finReceipt = new Vue({
        el: '#financeReceipt',
        data: {
            billTid: '',
            date: '',
            summary: '',
            amount: 0,
            repSelected: [],
            receipt: [],
            receiptCon: []
        },
        methods: {
            search: function () {
                this.receiptCon = JSON.parse(JSON.stringify(this.receipt));
                if (this.date) {
                    let i = 0;
                    for (; i < this.receiptCon.length; i++) {
                        if (this.receiptCon[i].tradeDate != this.date) {
                            this.receiptCon.splice(i, 1);
                            i--;
                        }
                    }
                }
                if (this.summary) {
                    let i = 0;
                    for (; i < this.receiptCon.length; i++) {
                        if (this.receiptCon[i].summary != this.summary) {
                            this.receiptCon.splice(i, 1);
                            i--;
                        }
                    }
                }
                if (this.amount) {
                    let i = 0;
                    for (; i < this.receiptCon.length; i++) {
                        if (this.receiptCon[i].money != this.amount) {
                            this.receiptCon.splice(i, 1);
                            i--;
                        }
                    }
                }
            },
            reset: function () {
                this.date = "";
                this.amount = 0;
                this.summary = "";
                this.receiptCon = JSON.parse(JSON.stringify(this.receipt));
            },
            select: function (receipt, index) {
                receipt.select = !receipt.select;
                if (receipt.select) {
                    this.repSelected.push(receipt);
                } else {
                    const indexdel = this.repSelected.findIndex(function (e) {
                        return e.tid === receipt.tid;
                    });
                    this.repSelected.splice(indexdel, 1);
                }
            },
            selectAll: function(btn){
                const el = btn.currentTarget;
                if(el.checked){
                	this.repSelected=JSON.parse(JSON.stringify(this.receiptCon));
                }else{
                	const size = this.repSelected.length;
                	this.repSelected.splice(0,size);
                	let repList = this.receiptCon;
                	repList.forEach(function(e){
                		e.select = false;
                	});
                }
            },
            confirm: function () {
                const receiptList = this.repSelected;
                const billTid = this.billTid;
                const url = '../zs/finance/confirmRecord?tid=' + tid + '&billTid=' + billTid;
                if(receiptList==null||receiptList==''||receiptList==undefined||receiptList.length==0){
                	alert("当前无选中流水");
                    return;
                }
                let self = this;
                $.axpostJosn(url, receiptList, function (data) {
                    $("#financeReceipt").modal("hide");
                    alert('操作成功');
                    financeReceipt(self);
                    location.reload();
                }
                );
            },
            cancel: function(){
	            this.repSelected = JSON.parse(JSON.stringify(this.receipt));
	            const size = this.repSelected.length;
	            this.repSelected.splice(0,size);
	            let repList = this.receiptCon;
	            repList.forEach(function(e){
	            	e.select = false;
	            });
            }
        },
        created: function () {
            let self = this;
            financeReceipt(self);
        },
        computed: {
            receiptFilter: function () {
                let repList = this.receiptCon;
                let repSelectedList = this.repSelected;
                repList.forEach(function (e) {
                    let i = 0;
                    for (; i < repSelectedList.length; i++) {
                        if (repSelectedList[i].tid === e.tid) {
                            Vue.set(e, 'select', true);
                            break;
                        }
                        Vue.set(e, 'select', false);
                    }
                });
                return repList;
            }
        }
    });

    function formatDate(dateTime) {
        var date = new Date(dateTime);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        month = month < 10 ? ('0' + month) : month;
        day = day < 10 ? ('0' + day) : day;
        return year + '-' + month + '-' + day;

    }

    function getpictureHtml(dataType, url, zimgurl, video_url, icon, pre_type) {
        var retHtml = "";
        if (dataType == ".png" || dataType == ".gif" || dataType == ".jpeg" || dataType == ".jpg") {
            retHtml = "<div data-id='" + url + "' class='imgbox'><a class='imglink'><img data-src='" + (zimgurl + url) + "' src='" + zimgurl + url + "' dataType='" + dataType + "' class='preview " + pre_type + "' /></a>"
                + "</div>";
        } else {
            retHtml = "<div data-id='" + url + "' data-id-r='" + icon + "' class='imgbox videobox'><a class='imglink' target='_blank' href='" +
                zimgurl + url + "'><img src='" + zimgurl + icon + "' dataType='" + dataType + "'  /></a>"
                + "</div>";
        }
        return retHtml;
    }

    function financeReceipt(vue) {
        const url = '../zs/finance/getBankStatement';
        $.axpost(url, { 'tid': tid }, function (data) {
            vue.receipt =JSON.parse(JSON.stringify(data.respData));
            if(vue.receipt!=null&&vue.receipt!=''&&vue.receipt!=undefined){
	            vue.receipt.forEach(function (e) {
	                e.tradeDate = formatDate(e.tradeDate);
	                console.log(e.tradeDate);
	            });
	            vue.receiptCon = JSON.parse(JSON.stringify(vue.receipt));
            }
        })
    }

    function bankReceipt(vue, bill) {
        const url = '../zs/finance/getTradeRecord';
        const billTid = bill.tid;
        $.axpost(url, { 'billTid': billTid }, function (data) {

            vue.tradeRecord = data.respData;
            vue.tradeRecord.forEach(function (e) {
                e.tradeDate = formatDate(e.tradeDate);
            });
        })
    }

});