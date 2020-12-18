$(function () {
    //loading();
    const tid = getUrlParam("tid");
    const ttid = '123123';

    if (tid != null && tid != '' && tid != undefined) {
        const url = '../zs/finance/getProjectDetailBySerialNo';
        $.axpost(url, { 'tid': tid }, function (data) {
            loadingDone();
            prjDetail.project = data.respData;
            prjDetail.userRole = data.respMap.user;
            prjDetail.state = data.respMap.state;
            prjDetail.archival.zimgurl = data.respMap.zimgUrl;

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

            data.respData.dataList.forEach(function (value) {
                const picture = getpictureHtml(value.dataType, value.url, data.respMap.zimgUrl, null, value.icon, null);
                $('#contractImg').append(picture);
            });

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
                const cancelUrl = '../zs/finance/projectCancel';
                const operation = 'cancel';
                $.axpost(cancelUrl, { 'tid': tid, 'operation': operation }, function (data) {
                    window.location.href = '../finance/financeQuery.html';
                });
            },
            modify: function () {
                window.location.href = '../finance/createProject.html?tid=' + tid;
            },
            approvePrj: function () {
                const confirmUrl = '../zs/finance/projectApproved';
                const operation = 'approve';
                $.axpost(confirmUrl, { 'tid': tid, 'operation': operation }, function (data) {
                    window.location.href = '../finance/projectDetail.html?tid=' + tid;
                });
            },
            settlePrj: function () {
                const settleUrl = '../zs/finance/projectSettled';
                const operation = 'settle';
                $.axpost(settleUrl, { 'tid': tid, 'operation': operation }, function () {
                    window.location.href = '../finance/projectDetail.html?tid=' + tid;
                });
            },
            showReceiptDetail: function (bill, index) {
                const tid = bill.tid;
                this.receiptCon = JSON.parse(JSON.stringify(this.receipt));
                for (let i = 0; i < this.receiptCon.length; i++) {
                    if (this.receiptCon[i].tid != tid) {
                        this.receiptCon.splice(i, 1);
                    }
                }
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
                const rep = JSON.parse(JSON.stringify(this.receiptCon));
                let sum = 0;
                for (let i = 0; i < rep.length; i++) {
                    sum += rep[i].money;
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
                        if (this.receiptCon[i].trade_date != this.date) {
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
            confirm: function () {
            	const receiptList = this.repSelected;
                const billTid = this.billTid;
                const url = '../zs/finance/confirmRecord?tid='+tid+'&billTid='+billTid;
                
                $.axpostJosn(url,receiptList , function (data) {
                console.log('ok');
                }
                );
            }
        },
        created: function () {
            let self = this;
            financeReceipt(self);
        },
        computed: {
            receiptFilter: function () {
                var repList = this.receiptCon;
                var repSelectedList = this.repSelected;
                repList.forEach(function (e) {
                    var i = 0;
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
                video_url + url + "'><img src='" + zimgurl + icon + "' dataType='" + dataType + "'  /></a>"
                + "</div>";
        }
        return retHtml;
    }

    function financeReceipt(vue) {
        const url = '../zs/finance/getBankStatement';
        $.axpost(url, { 'tid': tid }, function (data) {
            vue.receipt = data.respData;
            vue.receiptCon = JSON.parse(JSON.stringify(vue.receipt));
        })
    }

});