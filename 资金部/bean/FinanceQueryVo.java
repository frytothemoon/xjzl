package com.zhishi.bean.vo.finance;

import lombok.Data;

@Data
public class FinanceQueryVo {
	private String bankId;
	private String repayDate;
	private String finProjectName;
	private String tradeState;
	private Integer pageSize;
	private Integer nextPage;
}
