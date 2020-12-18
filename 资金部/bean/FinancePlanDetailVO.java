package com.zhishi.bean.vo.finance;

import java.math.*;
import java.util.Date;
import lombok.Data;

@Data
public class FinancePlanDetailVO {
    private String tid;
	private String bankAccount;//银行账户
	private String projectName;//筹资项目名称
	private String repayDate;//提款日期
	private Integer curLimit;//当前期数
	private BigDecimal curPrincipal = new BigDecimal(0.0);//应还本金
	private BigDecimal curInterest = new BigDecimal(0.0);//应还利息
	private BigDecimal repayAmount = new BigDecimal(0.0);//应还本息合计
	private BigDecimal otherFee = new BigDecimal(0.0);//本月应还其他费用
}
