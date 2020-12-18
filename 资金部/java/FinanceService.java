package com.zhishi.service.finance;

import java.text.ParseException;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import com.alibaba.fastjson.JSONArray;
import com.zhishi.bean.backend.User;
import com.zhishi.bean.capitaldepartment.FinaceTrade;
import com.zhishi.bean.capitaldepartment.FinaceTradeBill;
import com.zhishi.bean.capitaldepartment.FinaceTradeOrder;
import com.zhishi.bean.finance.FinBank;
import com.zhishi.bean.finance.FinPeriod;
import com.zhishi.bean.finance.Statement;
import com.zhishi.bean.order.BizOrder;
import com.zhishi.bean.vo.finance.AssociatedPrjVo;
import com.zhishi.bean.vo.finance.FinanceListVo;
import com.zhishi.bean.vo.finance.FinancePlanDetailVO;
import com.zhishi.bean.vo.finance.FinanceQueryVo;
import com.zhishi.bean.vo.finance.PeriodQuery;
import com.zhishi.bean.vo.finance.ProjectAddVo;
import com.zhishi.bean.vo.finance.StatementVO;
import com.zhishi.common.exception.BusinessException;
import com.zhishi.common.vo.MyBatisPage;
import com.zhishi.common.vo.RestAPIResult;

/**  
* 创建时间：2019年10月14日 下午2:21:55  
* 项目名称：zhishi-serviceI  
* @author hxl  
* @version 1.0   
* @since JDK 1.8.0_  
* 文件名称：FinanceService.java  
* 类说明：  
*/
public interface FinanceService {
	/**
	 * 查询账期列表
	 * @param finPeriod
	 * @return
	 * @throws BusinessException
	 */
	RestAPIResult<MyBatisPage<FinPeriod>> queryPeriod(PeriodQuery finPeriod)throws BusinessException;
	
	/**
	 * 根据期初值统计期末值
	 * @param finPeriod
	 * @return
	 * @throws BusinessException
	 */
	RestAPIResult<FinPeriod> createPeriod(FinPeriod finPeriod)throws BusinessException;
	/**
	 * 关账操作
	 * @param finPeriod
	 * @throws BusinessException
	 */
	RestAPIResult<Object> completedMonth(FinPeriod finPeriod) throws BusinessException;
	

	RestAPIResult<MyBatisPage<FinanceListVo>> queryFinanceProject(FinanceQueryVo query) throws BusinessException;
	
	RestAPIResult<List<FinancePlanDetailVO>> planDetailByTime(String option) throws BusinessException;
	
	RestAPIResult<List<FinBank>> getBanckAccountList() throws BusinessException;
	
	RestAPIResult<Object> createProject(ProjectAddVo projectVo, User user) throws BusinessException,ParseException;
	
	RestAPIResult<Object> modifyProject(ProjectAddVo projectVo, User user) throws BusinessException,ParseException;
	
	RestAPIResult<List<AssociatedPrjVo>> getAssociatedProject(String tid) throws BusinessException;
	
	RestAPIResult<Object> getExistedProject(String prjName, String tid) throws BusinessException;
	
	RestAPIResult<Object> importRepaymentPlan(String filePath, HttpServletRequest request, String serialNo) 
			throws BusinessException, ParseException;
	
	RestAPIResult<ProjectAddVo> getProjectDetailBySerialNo(String tid,User user) throws BusinessException;
	
    RestAPIResult<Object> projectOperation(String tid, User user, String operation) throws BusinessException;
    
    RestAPIResult<List<Statement>> getBankStatement(String tid) throws BusinessException;
    
    RestAPIResult<Object> confirmRecord(List<Statement> statementList, User user,String tid,String billTid) throws BusinessException;
    
    RestAPIResult<List<Statement>> getRecordStatement(String billTid) throws BusinessException;
    
    HSSFWorkbook exportDetail(List<FinaceTrade> list,Map<String,List<FinaceTradeBill>> map) throws BusinessException;
    
}
