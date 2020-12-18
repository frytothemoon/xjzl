package com.zhishi.dal.mapper.finance;

import com.zhishi.bean.capitaldepartment.FinaceTradeBill;
import com.zhishi.bean.capitaldepartment.FinaceTradeData;
import com.zhishi.bean.capitaldepartment.FinaceTradeOrder;
import com.zhishi.bean.finance.FinBank;
import com.zhishi.bean.finance.Statement;
import com.zhishi.bean.vo.finance.*;
import java.util.*;
import org.apache.ibatis.annotations.Param;
import java.math.*;

public interface FinanceQueryMapper {

	BigDecimal queryFinancePlanThisWeek();
	
	BigDecimal queryFinancePlanNextWeek();
	
	BigDecimal queryFinancePlanThisMonth();
	
	List<FinBank> queryBankAccount();
	
	Integer queryPlanCount(Map<String,Object> query);
	
	List<FinanceListVo> queryFinanceList(Map<String,Object> query);
	
	List<FinancePlanDetailVO> queryFinanceDetail(String option);
	
	List<AssociatedPrjVo> getAssociatedProject(String tid);
	
	List<AssociatedPrjVo> selectOrderByKey(String tid);
	
	String getRoleNameByKey(String tid);
	
	List<Statement> getRecordStatement(String billTid);
	
	List<Statement> queryBankStatement(String bankId);
	
	Integer orderBatchInsert(List<FinaceTradeOrder> list);
	
	Integer billBatchInsert(List<FinaceTradeBill> list);
	
	Integer dataBatchInsert(List<FinaceTradeData> list);
}
