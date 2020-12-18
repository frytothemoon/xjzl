package com.zhishi.bean.vo.finance;

import java.math.BigDecimal;
import java.util.List;

import com.zhishi.bean.capitaldepartment.FinaceTradeBill;
import com.zhishi.bean.capitaldepartment.FinaceTradeData;
import com.zhishi.bean.vo.finance.AssociatedPrjVo;

import lombok.Data;

@Data
public class ProjectAddVo {
	public String tid;
	public String bankId;
	public String bank;
	public String cardNo;
	public String prjName;
	public BigDecimal amount;
	public String date;
	public BigDecimal rate;
	public String creditAgency;
	public BigDecimal adviserFee;
	public BigDecimal guaranteeFee;
	public BigDecimal bondFee;
	List<AssociatedPrjVo> associatedPrjList;
	List<FinaceTradeBill> tradeBillList;
	List<FinaceTradeData> dataList;
}
