package com.zhishi.bean.vo.finance;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class FinanceListVo {
	
	private String tid;
	private String bankAccount;//银行账户
	private String projectName;//筹资项目名称
	private BigDecimal amount;//提款金额
	private String tradeDate;//提款日期
	private BigDecimal rate;//利率
	private String tradeState;//筹资项目状态
	private BigDecimal curPrincipal = new BigDecimal(0.0);//本月应还本金
	private BigDecimal curInterest = new BigDecimal(0.0);//本月应还利息
	private BigDecimal repayAmount = new BigDecimal(0.0);//本月应还本息合计
	private BigDecimal otherFee = new BigDecimal(0.0);//本月应还其他费用
	private BigDecimal repaidAmount = new BigDecimal(0.0);//累计实还金额
	private BigDecimal capBalance = new BigDecimal(0.0);//本金余额
	private BigDecimal insBalance = new BigDecimal(0.0);//利息余额
	private BigDecimal balanceAmount = new BigDecimal(0.0);//剩余应还本息
	
}
