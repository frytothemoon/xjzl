package com.zhishi.bean.vo.finance;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class AssociatedPrjVo {

	private String tid;
	private String contractNo;
	private String mfrsName;
	private String princName;
	private BigDecimal paidAmount;
}
