package com.zhishi.service.impl.finance;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TimeZone;
import java.util.TreeSet;
import javax.servlet.http.HttpServletRequest;

import org.apache.ibatis.annotations.Param;
import org.apache.log4j.Logger;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.alibaba.fastjson.JSONArray;
import com.timevale.tgtext.text.pdf.bi;
import com.zhishi.bean.backend.User;
import com.zhishi.bean.capitaldepartment.FinaceTrade;
import com.zhishi.bean.capitaldepartment.FinaceTradeBill;
import com.zhishi.bean.capitaldepartment.FinaceTradeBillCriteria;
import com.zhishi.bean.capitaldepartment.FinaceTradeCriteria;
import com.zhishi.bean.capitaldepartment.FinaceTradeData;
import com.zhishi.bean.capitaldepartment.FinaceTradeDataCriteria;
import com.zhishi.bean.capitaldepartment.FinaceTradeOrder;
import com.zhishi.bean.capitaldepartment.FinaceTradeOrderCriteria;
import com.zhishi.bean.capitaldepartment.FinaceTradeRecord;
import com.zhishi.bean.capitaldepartment.FinaceTradeRecordCriteria;
import com.zhishi.bean.finance.FinAdvace;
import com.zhishi.bean.finance.FinAdvaceCriteria;
import com.zhishi.bean.finance.FinBank;
import com.zhishi.bean.finance.FinMonth;
import com.zhishi.bean.finance.FinMonthCriteria;
import com.zhishi.bean.finance.FinPeriod;
import com.zhishi.bean.finance.FinPeriodCriteria;
import com.zhishi.bean.finance.Statement;
import com.zhishi.bean.finance.StatementCriteria;
import com.zhishi.bean.finance.FinPeriodCriteria.Criteria;
import com.zhishi.bean.order.BizOrder;
import com.zhishi.bean.order.BizOrderCriteria;
import com.zhishi.bean.vo.finance.AssociatedPrjVo;
import com.zhishi.bean.vo.finance.FinanceListVo;
import com.zhishi.bean.vo.finance.FinancePlanDetailVO;
import com.zhishi.bean.vo.finance.FinanceQueryVo;
import com.zhishi.bean.vo.finance.PeriodQuery;
import com.zhishi.bean.vo.finance.ProjectAddVo;
import com.zhishi.bean.vo.finance.StatementVO;
import com.zhishi.common.constants.SystemConstants.orderStatus;
import com.zhishi.common.exception.BusinessException;
import com.zhishi.common.util.BeanMapper;
import com.zhishi.common.util.DataUtil;
import com.zhishi.common.util.DateUtils;
import com.zhishi.common.util.SqlFormatUtil;
import com.zhishi.common.util.UUIDUtil;
import com.zhishi.common.vo.MyBatisPage;
import com.zhishi.common.vo.RestAPIResult;
import com.zhishi.dal.mapper.backend.UserMapper;
import com.zhishi.dal.mapper.capitaldepartment.FinaceTradeBillMapper;
import com.zhishi.dal.mapper.capitaldepartment.FinaceTradeDataMapper;
import com.zhishi.dal.mapper.capitaldepartment.FinaceTradeMapper;
import com.zhishi.dal.mapper.capitaldepartment.FinaceTradeOrderMapper;
import com.zhishi.dal.mapper.capitaldepartment.FinaceTradeRecordMapper;
import com.zhishi.dal.mapper.finance.BankCustomMapper;
import com.zhishi.dal.mapper.finance.BankMfrsMapper;
import com.zhishi.dal.mapper.finance.BankOrderMapper;
import com.zhishi.dal.mapper.finance.FinAdvaceMapper;
import com.zhishi.dal.mapper.finance.FinMonthMapper;
import com.zhishi.dal.mapper.finance.FinPeriodMapper;
import com.zhishi.dal.mapper.finance.FinTypeMapper;
import com.zhishi.dal.mapper.finance.FinanceQueryMapper;
import com.zhishi.dal.mapper.finance.StatementMapper;
import com.zhishi.dal.mapper.order.BizOrderMapper;
import com.zhishi.service.finance.ConfirmIncomeService;
import com.zhishi.service.finance.FinanceService;
import com.zhishi.service.finance.VoucherManageService;
import com.zhishi.service.impl.xjProject.ProjectMgrServiceImpl;

/**
 * 创建时间：2019年10月14日 下午2:31:10 项目名称：zhishi-service
 * 
 * @author hxl
 * @version 1.0
 * @since JDK 1.8.0_ 文件名称：FinanceServiceImpl.java 类说明：
 */
@Service("financeService")
public class FinanceServiceImpl implements FinanceService {
  @Autowired
  FinPeriodMapper finPeriodMapper;
  @Autowired
  StatementMapper statementMapper;
  @Autowired
  BankCustomMapper bankCustomMapper;
  @Autowired
  BankMfrsMapper bankMfrsMapper;
  @Autowired
  BankOrderMapper bankOrderMapper;
  @Autowired
  FinMonthMapper finMonthMapper;
  @Autowired
  FinAdvaceMapper finAdvaceMapper;
  @Autowired
  ConfirmIncomeService confirmIncomeService;
  @Autowired
  FinanceQueryMapper finQueryMapper;
  @Autowired
  FinaceTradeOrderMapper finaceTradeOrderMapper;
  @Autowired
  FinaceTradeMapper finaceTradeMapper;
  @Autowired
  FinaceTradeBillMapper finaceTradeBillMapper;
  @Autowired
  FinaceTradeDataMapper finaceTradeDataMapper;
  @Autowired
  FinaceTradeRecordMapper finaceTradeRecordMapper;
  @Autowired
  UserMapper userMapper;
  @Autowired
  BizOrderMapper bizOrderMapper;

  private Logger logger = Logger.getLogger(FinanceServiceImpl.class);

  private String getStrCellValue(Row row, int col) {
    if (row == null || row.getCell(col) == null)
      return null;
    Cell cell = row.getCell(col);
    int type = row.getCell(col).getCellType();
    String value = "";
    try {
      switch (type) {
        case Cell.CELL_TYPE_BLANK:
          break;
        case Cell.CELL_TYPE_NUMERIC:
          if (HSSFDateUtil.isCellDateFormatted(cell)) {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy/MM/dd");
            value = formatter.format(cell.getDateCellValue());
          } else {
            BigDecimal decimalData = new BigDecimal(row.getCell(col).getNumericCellValue() + "");
            value = decimalData.toPlainString();
          }
          break;
        case Cell.CELL_TYPE_STRING:
        default:
          value = row.getCell(col).getStringCellValue();
          break;
      }
    } catch (Exception e) {
      logger.error("  read Str value from xlsx row cell error!!..." + e);
    }
    if (DataUtil.isNotEmpty(value)) {
      if ("null".equals(value) || "NULL".equals(value))
        value = "";
    }
    return value;
  }

  @Override
  public RestAPIResult<MyBatisPage<FinPeriod>> queryPeriod(PeriodQuery finPeriod)
      throws BusinessException {
    RestAPIResult<MyBatisPage<FinPeriod>> result = new RestAPIResult<MyBatisPage<FinPeriod>>();
    Integer nextPage = finPeriod.getNextPage();
    Integer pageSize = finPeriod.getPageSize();
    FinPeriodCriteria example = new FinPeriodCriteria();
    Criteria criteria = example.createCriteria();
    criteria.andStateEqualTo(1);
    if (DataUtil.isNotEmpty(finPeriod.getMonth())) {
      criteria.andMonthEqualTo(finPeriod.getMonth());
    }
    Integer count = finPeriodMapper.countByExample(example);
    example.setOrderByClause(SqlFormatUtil.makeupOrderByAndLimit("create_date",
        SqlFormatUtil.ORDER_BY_DIRECTION_DESC, nextPage, pageSize));
    List<FinPeriod> list = finPeriodMapper.selectByExample(example);
    MyBatisPage<FinPeriod> respData = new MyBatisPage<FinPeriod>(nextPage, pageSize, list, count);
    result.setRespData(respData);
    return result;
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public RestAPIResult<Object> completedMonth(FinPeriod finPeriodEdit) throws BusinessException {
    RestAPIResult<Object> result = new RestAPIResult<Object>();
    // 一，跟新关账期末数据
    if (DataUtil.isEmpty(finPeriodEdit.getTid())) {
      throw new BusinessException("系统繁忙,请重试!");
    }
    FinPeriod finPeriod = finPeriodMapper.selectByPrimaryKey(finPeriodEdit.getTid());
    if (DataUtil.isEmpty(finPeriod)) {
      throw new BusinessException("系统繁忙,请重试!");
    }

    String month = finPeriod.getMonth();
    String startStr = month + "-01";
    Date start = null;
    Date end = null;
    try {
      start = DateUtils.string2Date(startStr, TimeZone.getDefault());
      end = DateUtils.getMonthLastDay(start);
    } catch (ParseException e) {
      throw new BusinessException("账期月份格式异常");
    }
    FinPeriod cur = null;
    if (DataUtil.isNotEmpty(finPeriod.getMonth())) {
      cur = totalPeriodByMonth(finPeriod.getMonth());
      cur.setStart(start);
      cur.setEnd(end);
      cur.setChecked(2);
      cur.setTid(finPeriod.getTid());
      finPeriodMapper.updateByPrimaryKeySelective(cur);
    }
    // 生成下个账期期初数据
    Date nextDate;
    try {
      nextDate =
          DateUtils.dateAddBymonth(DateUtils.string2Date(startStr, TimeZone.getDefault()), 1);
    } catch (ParseException e) {
      throw new BusinessException("账期格式错误,联系管理员!");
    }
    String nextMonth = DateUtils.date2String(nextDate, "yyyy-MM", TimeZone.getDefault());
    FinPeriod next = new FinPeriod();
    try {
      Date startNext = DateUtils.string2Date(nextMonth + "-01", TimeZone.getDefault());
      Date endNext = DateUtils.getMonthLastDay(start);
      next.setStart(startNext);
      next.setEnd(endNext);
    } catch (ParseException e) {
      throw new BusinessException("账期月份格式异常");
    }
    next.setMonth(nextMonth);
    next.setBankOpen(cur.getBankClose());
    next.setOverdueOpen(cur.getOverdueClose());
    next.setChecked(0);
    finPeriodMapper.insertSelective(next);
    // 二， 5-1批量跟新流水状态为已关账
    Statement record = new Statement();
    record.setChecked(2);
    StatementCriteria example = new StatementCriteria();
    example.createCriteria().andTradeDateBetween(start, end);
    statementMapper.updateByExampleSelective(record, example);
    // 5-2 跟新流水客户状态为已关账

    // 5-3 跟新流水厂商状态为已关账

    // 5-4 跟新流水订单状态为已关账

    // 5-5 跟新流水预收状态为已关账
    FinAdvace recordAdvace = new FinAdvace();
    recordAdvace.setChecked(2);
    FinAdvaceCriteria exampleAdvace = new FinAdvaceCriteria();
    exampleAdvace.createCriteria().andFinDataBetween(start, end);
    finAdvaceMapper.updateByExampleSelective(recordAdvace, exampleAdvace);
    // 5-6 跟新关账期银行数据状态
    FinMonth recordMonth = new FinMonth();
    recordMonth.setChecked(2);
    FinMonthCriteria exampleMonth = new FinMonthCriteria();
    exampleMonth.createCriteria().andMonthEqualTo(finPeriod.getMonth());
    finMonthMapper.updateByExampleSelective(recordMonth, exampleMonth);
    // 批量跟新银行下个账期期初数据
    finMonthMapper.updateOpenByCompelete(month, nextMonth);
    // 批量新增银行下个账期记录
    finMonthMapper.batchInsertSelect(month, nextMonth);

    // 生成确认收入期次
    confirmIncomeService.createConfirmIncome(month);

    return result;
  }

  @Override
  public RestAPIResult<FinPeriod> createPeriod(FinPeriod finPeriodEdit) throws BusinessException {
    RestAPIResult<FinPeriod> result = new RestAPIResult<FinPeriod>();
    if (DataUtil.isEmpty(finPeriodEdit.getTid())) {
      throw new BusinessException("系统繁忙,请重试!");
    }
    FinPeriod finPeriod = finPeriodMapper.selectByPrimaryKey(finPeriodEdit.getTid());
    if (DataUtil.isEmpty(finPeriod)) {
      throw new BusinessException("系统繁忙,请重试!");
    }
    FinPeriodCriteria example = new FinPeriodCriteria();
    Criteria criteria = example.createCriteria();
    criteria.andStateEqualTo(1);
    FinPeriod respData = null;
    /*
     * if(DataUtil.isNotEmpty(finPeriod.getTid())){
     * respData=finPeriodMapper.selectByPrimaryKey(finPeriod.getTid()); }
     */
    // 统计合计数据
    if (DataUtil.isNotEmpty(finPeriod.getMonth())) {
      respData = totalPeriodByMonth(finPeriod.getMonth());
    }
    result.setRespData(respData);
    return result;
  }

  private FinPeriod totalPeriodByMonth(String month) throws BusinessException {

    String startStr = month + "-01";
    String endStr = "";
    // 计算值
    Date start = null;
    try {
      start = DateUtils.string2Date(startStr, TimeZone.getDefault());
      endStr = DateUtils.date2String(DateUtils.getMonthLastDay(start));
    } catch (ParseException e) {
      throw new BusinessException("账期月份格式异常");
    }
    //
    FinPeriod result = finPeriodMapper.totalPeriodByMonth(month, startStr, endStr);
    return result;
  }

  @Override
  public RestAPIResult<MyBatisPage<FinanceListVo>> queryFinanceProject(FinanceQueryVo query)
      throws BusinessException {

    RestAPIResult<MyBatisPage<FinanceListVo>> result =
        new RestAPIResult<MyBatisPage<FinanceListVo>>();

    Map<String, Object> respMap = new HashMap();
    String bankId = query.getBankId();
    String repayDate = query.getRepayDate();
    String finProjectName = query.getFinProjectName();
    String tradeState = query.getTradeState();
    Integer pageSize = query.getPageSize();
    Integer nextPage = query.getNextPage();
    Date date = new Date();
    String dateYm = DataUtil.formatDate2String(date, "yyyy-MM-dd");

    Map<String, Object> map = new HashMap<>();
    if (DataUtil.isNotEmpty(bankId)) {
      map.put("bankId", bankId);
    }
    if (DataUtil.isNotEmpty(repayDate)) {
      map.put("repayDate", repayDate);
    }
    if (DataUtil.isEmpty(repayDate)) {
      map.put("repayDate", dateYm);
    }
    if (DataUtil.isNotEmpty(finProjectName)) {
      map.put("finProjectName", finProjectName);
    }
    if (DataUtil.isNotEmpty(tradeState)) {
      if (tradeState.equals("1")) {
        tradeState = "待审批";
      } else if (tradeState.equals("2")) {
        tradeState = "还款中";
      } else if (tradeState.equals("3")) {
        tradeState = "已结清";
      }
      map.put("tradeState", tradeState);
    }
    map.put("pageSize", pageSize);
    map.put("nextPage", nextPage*pageSize);

    List<FinanceListVo> list = finQueryMapper.queryFinanceList(map);
    Integer count = finQueryMapper.queryPlanCount(map);
    if (count == null) {
      count = 0;
    }

    respMap.put("curWeekPlan", finQueryMapper.queryFinancePlanThisWeek());
    respMap.put("nextWeekPlan", finQueryMapper.queryFinancePlanNextWeek());
    respMap.put("curMonthPlan", finQueryMapper.queryFinancePlanThisMonth());

    MyBatisPage<FinanceListVo> page = new MyBatisPage<>(nextPage, pageSize, list, count);
    result.setRespData(page);
    result.setRespMap(respMap);

    return result;
  }

  @Override
  public RestAPIResult<List<FinBank>> getBanckAccountList() throws BusinessException {
    RestAPIResult<List<FinBank>> result = new RestAPIResult<List<FinBank>>();

    List<FinBank> list = finQueryMapper.queryBankAccount();
    result.setRespData(list);
    return result;
  }

  


  @Override
  @Transactional
  public RestAPIResult<Object> createProject(ProjectAddVo projectVo, User user)
      throws BusinessException, ParseException {
    RestAPIResult<Object> result = new RestAPIResult<Object>();

    FinaceTrade financeTrade = new FinaceTrade();

    if (DataUtil.isNotEmpty(projectVo)) {
      String state = "待审批";
      financeTrade.setBankId(projectVo.getBankId());
      financeTrade.setName(projectVo.getPrjName());
      financeTrade.setAmount(projectVo.getAmount());
      SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
      Date tradeDate = sdf.parse(projectVo.getDate());
      financeTrade.setTradeDate(tradeDate);
      financeTrade.setRate(projectVo.getRate());
      if (DataUtil.isNotEmpty(projectVo.getCreditAgency())) {
        financeTrade.setCreditAgency(projectVo.getCreditAgency());
      }
      financeTrade.setBank(projectVo.getBank());
      financeTrade.setCardNo(projectVo.getCardNo());
      financeTrade.setAdviserFee(projectVo.getAdviserFee());
      financeTrade.setGuaranteeFee(projectVo.getGuaranteeFee());
      financeTrade.setBondFee(projectVo.getBondFee());
      financeTrade.setTradeState(state);
      financeTrade.setCreateBy(user.getTid());
      financeTrade.setCreateName(user.getUsername());
      financeTrade.setUpdateBy(user.getTid());
    }
    finaceTradeMapper.insertSelective(financeTrade);
    List<AssociatedPrjVo> prjList = projectVo.getAssociatedPrjList();
    List<FinaceTradeBill> billList = projectVo.getTradeBillList();
    List<FinaceTradeOrder> financeTradeOrderList = new ArrayList<>();
    List<FinaceTradeData> dataList = projectVo.getDataList();
    if (DataUtil.isNotEmpty(prjList)) {
      for (int i = 0; i < prjList.size(); i++) {

        // financeTradeOrder.get(i).setTradeId();
        FinaceTradeOrder finaceTradeOrder = new FinaceTradeOrder();
        finaceTradeOrder.setTradeId(financeTrade.getTid());
        finaceTradeOrder.setContractNo(prjList.get(i).getContractNo());
        finaceTradeOrder.setSerialNo(prjList.get(i).getTid());
        finaceTradeOrder.setPrincName(prjList.get(i).getPrincName());
        finaceTradeOrder.setMfrsName(prjList.get(i).getMfrsName());
        finaceTradeOrder.setCreateBy(user.getTid());
        finaceTradeOrder.setUpdateBy(user.getTid());
        financeTradeOrderList.add(finaceTradeOrder);
      }
    }
    if (DataUtil.isNotEmpty(billList)) {
      for (int i = 0; i < billList.size(); i++) {
        billList.get(i).setTradeId(financeTrade.getTid());
        billList.get(i).setRate(projectVo.getRate());
        billList.get(i).setLimits(billList.size());
        billList.get(i).setCurLimit(billList.get(i).getCurLimit());
        billList.get(i).setCreateBy(user.getTid());
        billList.get(i).setUpdateBy(user.getTid());

      }
    }
    if (DataUtil.isNotEmpty(dataList)) {
      for (int i = 0; i < dataList.size(); i++) {
        dataList.get(i).setTradeId(financeTrade.getTid());
        dataList.get(i).setCreateBy(user.getTid());
        dataList.get(i).setUpdateBy(user.getTid());
      }
    }
    finQueryMapper.orderBatchInsert(financeTradeOrderList);
    finQueryMapper.billBatchInsert(billList);
    finQueryMapper.dataBatchInsert(dataList);
    result.setRespData(financeTrade.getTid());
    return result;
  }
  
  @Override
  public RestAPIResult<List<AssociatedPrjVo>> getAssociatedProject(String tid)
      throws BusinessException {
    RestAPIResult<List<AssociatedPrjVo>> result = new RestAPIResult<List<AssociatedPrjVo>>();
    List<AssociatedPrjVo> list = new ArrayList<AssociatedPrjVo>();
    list = finQueryMapper.getAssociatedProject(tid);
    result.setRespData(list);
    return result;
  }


  @Override
  public RestAPIResult<Object> importRepaymentPlan(String filePath, HttpServletRequest request,
      String serialNo) throws BusinessException, ParseException {
    RestAPIResult<Object> result = new RestAPIResult<Object>();
    List<FinaceTradeBill> list = new ArrayList<FinaceTradeBill>();
    int totalCount = 0;
    int fail = 0;
    ProjectMgrServiceImpl impl = new ProjectMgrServiceImpl();
    try {
      List<Row> dataRows = impl.readXlsx(filePath);
      totalCount = dataRows.size();
      if (totalCount > 0) {
        for (int i = 1; i < totalCount - 1; i++) {
          Row row = dataRows.get(i);
          FinaceTradeBill bill = new FinaceTradeBill();
          bill.setTid(UUIDUtil.generateUUID());
          try {
            if (DataUtil.isNotEmpty(getStrCellValue(row, 0))) {
              Integer curLimit = Integer.parseInt(getStrCellValue(row, 0).split("\\.")[0]);
              bill.setCurLimit(curLimit + 1);
            } else {
              fail++;
              continue;
            }
            if (DataUtil.isNotEmpty(getStrCellValue(row, 1))) {
              SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
              Date repayDate = sdf.parse(getStrCellValue(row, 1));
              bill.setRepayDate(repayDate);
            } else {
              fail++;
              continue;
            }
            if (DataUtil.isNotEmpty(getStrCellValue(row, 2))) {
              Integer interestDays = Integer.parseInt(getStrCellValue(row, 2).split("\\.")[0]);
              bill.setInterestDays(interestDays);
            } else {
              fail++;
              continue;
            }
            if (DataUtil.isNotEmpty(getStrCellValue(row, 3))) {
              BigDecimal curPrincipal = new BigDecimal(getStrCellValue(row, 3));
              bill.setCurPrincipal(curPrincipal);
            } else {
              fail++;
              continue;
            }
            if (DataUtil.isNotEmpty(getStrCellValue(row, 4))) {
              BigDecimal curInterset = new BigDecimal(getStrCellValue(row, 4));
              bill.setCurInterset(curInterset);
            } else {
              fail++;
              continue;
            }
            if (DataUtil.isNotEmpty(getStrCellValue(row, 5))) {
              BigDecimal repayAmount = new BigDecimal(getStrCellValue(row, 5));
              bill.setRepayAmount(repayAmount);
            } else {
              fail++;
              continue;
            }
            if (DataUtil.isNotEmpty(getStrCellValue(row, 6))) {
              BigDecimal OrtherFee = new BigDecimal(getStrCellValue(row, 6));
              bill.setOrtherFee(OrtherFee);
            }
            if (DataUtil.isNotEmpty(getStrCellValue(row, 7))) {
              BigDecimal curBalance = new BigDecimal(getStrCellValue(row, 7));
              bill.setCurBalance(curBalance);
            } else {
              fail++;
              continue;
            }
            list.add(bill);
          } catch (Exception e) {
            throw new BusinessException("格式错误");
          }
          
        }

      }
    } catch (InvalidFormatException | IOException e) {
      e.printStackTrace();
    }
    logger.info(list.get(0).getCapitalName());
    Map<String, Object> map = new HashMap<String, Object>();
    map.put("success", list.size() + "");
    map.put("fail", fail + "");
    map.put("list", list);
    result.setRespData(map);
    return result;
  }

  @Override
  public RestAPIResult<ProjectAddVo> getProjectDetailBySerialNo(String tid, User user)
      throws BusinessException {
    RestAPIResult<ProjectAddVo> result = new RestAPIResult<ProjectAddVo>();
    ProjectAddVo projectAddVo = new ProjectAddVo();
    Map<String, Object> map = new HashMap<String, Object>();
    FinaceTrade finaceTrade = finaceTradeMapper.selectByPrimaryKey(tid);
    if (DataUtil.isEmpty(finaceTrade)) {
      throw new BusinessException(tid + "订单不存在");
    } else {
      projectAddVo.setAdviserFee(finaceTrade.getAdviserFee());
      projectAddVo.setAmount(finaceTrade.getAmount());
      projectAddVo.setBank(finaceTrade.getBank());
      projectAddVo.setBankId(finaceTrade.getBankId());
      projectAddVo.setBondFee(finaceTrade.getBondFee());
      projectAddVo.setCardNo(finaceTrade.getCardNo());
      projectAddVo.setCreditAgency(finaceTrade.getCreditAgency());
      DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
      projectAddVo.setDate(format.format(finaceTrade.getTradeDate()));
      projectAddVo.setRate(finaceTrade.getRate());
      projectAddVo.setGuaranteeFee(finaceTrade.getGuaranteeFee());
      projectAddVo.setPrjName(finaceTrade.getName());
    }

    List<AssociatedPrjVo> associatedPrjList = new ArrayList<AssociatedPrjVo>();
    List<FinaceTradeBill> billList = new ArrayList<FinaceTradeBill>();
    List<FinaceTradeData> dataList = new ArrayList<FinaceTradeData>();

    FinaceTradeBillCriteria billCriteria = new FinaceTradeBillCriteria();
    billCriteria.createCriteria().andTradeIdEqualTo(tid);
    billList = finaceTradeBillMapper.selectByExample(billCriteria);
    if (DataUtil.isNotEmpty(billList)) {
      projectAddVo.setTradeBillList(billList);
    }

    FinaceTradeDataCriteria dataCriteria = new FinaceTradeDataCriteria();
    dataCriteria.createCriteria().andTradeIdEqualTo(tid);
    dataList = finaceTradeDataMapper.selectByExample(dataCriteria);
    if (DataUtil.isNotEmpty(dataList)) {
      projectAddVo.setDataList(dataList);
    }

    associatedPrjList = finQueryMapper.selectOrderByKey(tid);
    if (DataUtil.isNotEmpty(associatedPrjList)) {
      projectAddVo.setAssociatedPrjList(associatedPrjList);
    }

    String userRole = new String(finQueryMapper.getRoleNameByKey(user.getTid()));

    map.put("user", userRole);
    map.put("state", finaceTrade.getTradeState());

    result.setRespData(projectAddVo);
    result.setRespMap(map);
    return result;
  }

  @Override
  @Transactional
  public RestAPIResult<Object> projectOperation(String tid, User user, String operation)
      throws BusinessException {
    if (DataUtil.isEmpty(operation)) {
      throw new BusinessException("项目处理方式为空");
    }
    RestAPIResult<Object> result = new RestAPIResult<Object>();
    Integer status;
    FinaceTrade record = new FinaceTrade();
    String state;
    switch (operation) {
      case "approve":
        String checkerName = userMapper.selectByPrimaryKey(user.getTid()).getUsername();
        String userTid = user.getTid();
        state = "还款中";
        record.setTid(tid);
        record.setTradeState(state);
        record.setUpdateBy(userTid);
        record.setChecker(userTid);
        record.setCheckerName(checkerName);
        status = finaceTradeMapper.updateByPrimaryKeySelective(record);
        result.setRespData(status);
        break;

      case "cancel":
        record.setTid(tid);
        record.setState(0);
        FinaceTradeBillCriteria bill = new FinaceTradeBillCriteria();
        FinaceTradeOrderCriteria order = new FinaceTradeOrderCriteria();
        FinaceTradeDataCriteria data = new FinaceTradeDataCriteria();
        
        bill.createCriteria().andTradeIdEqualTo(tid);
        order.createCriteria().andTradeIdEqualTo(tid);
        data.createCriteria().andTradeIdEqualTo(tid);
        
        finaceTradeBillMapper.deleteByExample(bill);//删除
        finaceTradeOrderMapper.deleteByExample(order);
        finaceTradeDataMapper.deleteByExample(data);
        status = finaceTradeMapper.updateByPrimaryKeySelective(record);
        result.setRespData(status);
        break;

      case "settle":
        state = "已结清";
        record.setTid(tid);
        record.setTradeState(state);
        record.setUpdateBy(user.getTid());
        status = finaceTradeMapper.updateByPrimaryKeySelective(record);
        result.setRespData(status);
        break;
    }
    return result;
  }

  @Override
  @Transactional
  public RestAPIResult<Object> modifyProject(ProjectAddVo projectVo, User user)
      throws BusinessException, ParseException {
    RestAPIResult<Object> result = new RestAPIResult<Object>();
    FinaceTrade tradeRecord = new FinaceTrade();
    List<FinaceTradeBill> billRecordList = projectVo.getTradeBillList();
    List<AssociatedPrjVo> orderRecordList = projectVo.getAssociatedPrjList();
    List<FinaceTradeData> dataRecordList = projectVo.getDataList();
    List<FinaceTradeOrder> financeTradeOrderList = new ArrayList<FinaceTradeOrder>();

    tradeRecord.setTid(projectVo.getTid());
    tradeRecord.setAdviserFee(projectVo.getAdviserFee());
    tradeRecord.setAmount(projectVo.getAmount());
    tradeRecord.setBank(projectVo.getBank());
    tradeRecord.setBankId(projectVo.getBankId());
    tradeRecord.setBondFee(projectVo.getBondFee());
    tradeRecord.setCardNo(projectVo.getCardNo());
    if (DataUtil.isNotEmpty(projectVo.getCreditAgency())) {
      tradeRecord.setCreditAgency(projectVo.getCreditAgency());
    }
    tradeRecord.setGuaranteeFee(projectVo.getGuaranteeFee());
    tradeRecord.setName(projectVo.getPrjName());
    tradeRecord.setRate(projectVo.getRate());
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
    Date tradeDate = sdf.parse(projectVo.getDate());
    tradeRecord.setTradeDate(tradeDate);
    tradeRecord.setUpdateBy(user.getTid());
    tradeRecord.setUpdateDate(new Date());
    finaceTradeMapper.updateByPrimaryKeySelective(tradeRecord);


    if(DataUtil.isNotEmpty(orderRecordList)){
      FinaceTradeOrderCriteria orderCriteria = new FinaceTradeOrderCriteria();
      orderCriteria.createCriteria().andTradeIdEqualTo(projectVo.getTid());
      finaceTradeOrderMapper.deleteByExample(orderCriteria);
      List<FinaceTradeOrder> insertList = new ArrayList<>();
      for(int i = 0;i<orderRecordList.size();i++) {
        FinaceTradeOrder temp = new FinaceTradeOrder();
        temp.setContractNo(orderRecordList.get(i).getContractNo());
        temp.setMfrsName(orderRecordList.get(i).getMfrsName());
        temp.setPrincName(orderRecordList.get(i).getPrincName());
        temp.setSerialNo(orderRecordList.get(i).getTid());
        temp.setTradeId(projectVo.getTid());
        temp.setCreateBy(user.getTid());
        temp.setUpdateBy(user.getTid());
        insertList.add(temp);
      }
      finQueryMapper.orderBatchInsert(insertList);
    }
    
    if(DataUtil.isNotEmpty(billRecordList)) {
      FinaceTradeBillCriteria billCriteria = new FinaceTradeBillCriteria();
      billCriteria.createCriteria().andTradeIdEqualTo(projectVo.getTid());
      finaceTradeBillMapper.deleteByExample(billCriteria);
      List<FinaceTradeBill> insertList = new ArrayList<>();
      for(int i =0;i<billRecordList.size();i++) {
        FinaceTradeBill temp = new FinaceTradeBill();
        temp.setRate(projectVo.getRate());
        temp.setTradeId(projectVo.getTid());
        temp.setLimits(billRecordList.size());
        temp.setCurLimit(billRecordList.get(i).getCurLimit());
        temp.setInterestDays(billRecordList.get(i).getInterestDays());
        temp.setRepayDate(billRecordList.get(i).getRepayDate());
        temp.setRepayAmount(billRecordList.get(i).getRepayAmount());
        temp.setCurPrincipal(billRecordList.get(i).getCurPrincipal());
        temp.setCurInterset(billRecordList.get(i).getCurInterset());
        temp.setCurBalance(billRecordList.get(i).getCurBalance());
        temp.setOrtherFee(billRecordList.get(i).getOrtherFee());
        temp.setCreateBy(user.getTid());
        temp.setUpdateBy(user.getTid());
        insertList.add(temp);
      }
      finQueryMapper.billBatchInsert(insertList);
    }
    
    if(DataUtil.isNotEmpty(dataRecordList)) {
      FinaceTradeDataCriteria dataCriteria = new FinaceTradeDataCriteria();
      dataCriteria.createCriteria().andTradeIdEqualTo(projectVo.getTid());
      finaceTradeDataMapper.deleteByExample(dataCriteria);
      List<FinaceTradeData> insertList = new ArrayList<>();
      for(int i = 0;i<dataRecordList.size();i++) {
        FinaceTradeData temp = new FinaceTradeData();
        temp.setDataType(dataRecordList.get(i).getDataType());
        temp.setTradeId(projectVo.getTid());
        temp.setDataCategory(dataRecordList.get(i).getDataCategory());
        temp.setItemName(dataRecordList.get(i).getItemName());
        temp.setUrl(dataRecordList.get(i).getUrl());
        temp.setUpdateBy(user.getTid());
        temp.setCreateBy(user.getTid());
        temp.setIcon(dataRecordList.get(i).getIcon());
        insertList.add(temp);
      }
      finQueryMapper.dataBatchInsert(insertList);
    }
    
    result.setRespData("ok");

    return result;
  }


  @Override
  public RestAPIResult<List<Statement>> getBankStatement(String tid) throws BusinessException {
    RestAPIResult<List<Statement>> result = new RestAPIResult<>();
    FinaceTrade finaceTrade = new FinaceTrade();
    finaceTrade = finaceTradeMapper.selectByPrimaryKey(tid);
    List<Statement> list = new ArrayList<>();
    
    list = finQueryMapper.queryBankStatement(finaceTrade.getBankId());
    if (DataUtil.isNotEmpty(list)) {
      result.setRespData(list);
    }
    return result;
  }

  @Override
  @Transactional
  public RestAPIResult<Object> confirmRecord(List<Statement> statementList, User user, String tid,
      String billTid) throws BusinessException {
    if (DataUtil.isEmpty(statementList)) {
      throw new BusinessException("提交流水列表为空");
    }
    RestAPIResult<Object> result = new RestAPIResult<Object>();
    FinaceTradeBill curBill = finaceTradeBillMapper.selectByPrimaryKey(billTid);
    BigDecimal curOtherFee = curBill.getOrtherFee();
    BigDecimal curPrincipal = curBill.getCurPrincipal();
    BigDecimal curInterest = curBill.getCurInterset();
    BigDecimal paidAmount = new BigDecimal(0);
    BigDecimal paidInterest = new BigDecimal(0);
    BigDecimal paidPrincipal = new BigDecimal(0);
    BigDecimal repaidPrincipal = new BigDecimal(0);
    BigDecimal repaidInterset = new BigDecimal(0);
    
    Collections.sort(statementList, new Comparator<Statement>() {// 按时间升序排列
      @Override
      public int compare(Statement o1, Statement o2) {
        return o1.getTradeDate().compareTo(o2.getTradeDate());
      }
    });

    for (int i = 0; i < statementList.size(); i++) {
      FinaceTradeRecord record = new FinaceTradeRecord();
      BigDecimal residual = statementList.get(i).getMoneyRmb();
      if (DataUtil.isEmpty(residual)) {
        throw new BusinessException("流水金额为0");
      }
      BigDecimal curPaidPrincipal = new BigDecimal(0);
      BigDecimal curPaidInterest = new BigDecimal(0);
      record.setTradeId(tid);
      record.setPlanId(billTid);
      record.setOrigin(statementList.get(i).getSummary());
      record.setPaidAmount(statementList.get(i).getMoneyRmb());
      record.setRepaidDate(statementList.get(i).getTradeDate());
      record.setRepaidFlow(statementList.get(i).getTid());
      record.setPaidBank(statementList.get(i).getBank());

      paidAmount = paidAmount.add(residual);
      if (curInterest.compareTo(paidInterest) == 0) {
        BigDecimal residualTemp = residual;
        curPaidPrincipal = residual.add(paidPrincipal).compareTo(curPrincipal) >= 0
            ? curPrincipal.subtract(paidPrincipal)
            : residual;
        residual = residual.add(paidPrincipal).compareTo(curPrincipal) >= 0
            ? residual.add(paidPrincipal).subtract(curPrincipal)
            : BigDecimal.ZERO;
        paidPrincipal = paidPrincipal.add(residualTemp).compareTo(curPrincipal) >= 0 ? curPrincipal
            : paidPrincipal.add(residualTemp);
        record.setPaidPrincipal(curPaidPrincipal);
        repaidPrincipal = repaidPrincipal.add(curPaidPrincipal);
        record.setOrtherFee(residual);
      } else {
        if (residual.compareTo(curInterest.subtract(paidInterest)) >= 0) {
          curPaidInterest = curInterest.subtract(paidInterest);
          residual = residual.subtract(curInterest).add(paidInterest);
          record.setPaidInterest(curPaidInterest);
          repaidInterset = repaidInterset.add(curPaidInterest);
          paidInterest = curInterest;
          BigDecimal residualTemp = residual;
          curPaidPrincipal = residual.add(paidPrincipal).compareTo(curPrincipal) >= 0
              ? curPrincipal.subtract(paidPrincipal)
              : residual;
          residual = residual.add(paidPrincipal).compareTo(curPrincipal) >= 0
              ? residual.add(paidPrincipal).subtract(curPrincipal)
              : BigDecimal.ZERO;
          paidPrincipal =
              paidPrincipal.add(residualTemp).compareTo(curPrincipal) >= 0 ? curPrincipal
                  : paidPrincipal.add(residualTemp);
          record.setPaidPrincipal(curPaidPrincipal);
          repaidPrincipal = repaidPrincipal.add(curPaidPrincipal);
          record.setOrtherFee(residual);
        } else {// residual<curInterest-paidInterest
          paidInterest = paidInterest.add(residual);
          record.setPaidInterest(residual);
          repaidInterset = repaidInterset.add(residual);
          residual = BigDecimal.ZERO;
        }
      }

      finaceTradeRecordMapper.insertSelective(record);
    }



    FinaceTradeBill bill = new FinaceTradeBill();// 添加record还款明细
    bill.setTid(billTid);
    bill.setRepaidAmount(paidAmount);
    bill.setUpdateBy(user.getTid());
    bill.setRepaidPrincipal(repaidPrincipal);
    bill.setRepaidInterset(repaidInterset);
    finaceTradeBillMapper.updateByPrimaryKeySelective(bill);
    result.setRespData("ok");

    return result;
  }

  @Override
  public RestAPIResult<List<Statement>> getRecordStatement(String billTid)
      throws BusinessException {
    RestAPIResult<List<Statement>> result = new RestAPIResult<List<Statement>>();
    List<Statement> list = new ArrayList<Statement>();
    list = finQueryMapper.getRecordStatement(billTid);
    result.setRespData(list);
    return result;
  }

  @Override
  public RestAPIResult<List<FinancePlanDetailVO>> planDetailByTime(String option)
      throws BusinessException {
    RestAPIResult<List<FinancePlanDetailVO>> result = new RestAPIResult<>();
    List<FinancePlanDetailVO> plan = new ArrayList<FinancePlanDetailVO>();
    plan = finQueryMapper.queryFinanceDetail(option);
    result.setRespData(plan);
    return result;
  }

  @Override
  public HSSFWorkbook exportDetail(List<FinaceTrade> list, Map<String, List<FinaceTradeBill>> map)
      throws BusinessException {
    HSSFWorkbook workbook = new HSSFWorkbook();
    try {
      String[]tittles = {"序号","银行账户","筹资项目名称","提款金额(元)","提款日期","利率(%)","增信机构","财务顾问费(%)","担保费(%)","保证金(%)"};
      List<String> colName = new ArrayList<String>();
      String sheetName = "筹资台账明细";
      HSSFSheet sheet = workbook.createSheet(sheetName);
      HSSFRow tittleRow = sheet.createRow(0);
      HSSFRow tittleRow1 = sheet.createRow(1);
      HSSFCellStyle fontStyle = workbook.createCellStyle();
      fontStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);
      
      sheet.setColumnWidth(0, 7*256);
      sheet.setColumnWidth(1, 15*256);
      sheet.setColumnWidth(2, 15*256);
      sheet.setColumnWidth(3, 15*256);
      sheet.setColumnWidth(4, 15*256);
      sheet.setColumnWidth(5, 15*256);
      sheet.setColumnWidth(6, 15*256);
      sheet.setColumnWidth(7, 15*256);
      sheet.setColumnWidth(8, 15*256);
      sheet.setColumnWidth(9, 15*256);
      
      SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
      SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
      Set<String> set = new TreeSet<String>();
      for(int i =0;i<tittles.length;i++) {
        CellRangeAddress cellRangeAddress = new CellRangeAddress(0, 1, i, i);
        sheet.addMergedRegion(cellRangeAddress);
        HSSFCell tittleCell = tittleRow.createCell(i);
        tittleCell.setCellValue(tittles[i]);
        tittleCell.setCellStyle(fontStyle);
      }
      
      
      for(List<FinaceTradeBill> mapVal:map.values()) {
        for(FinaceTradeBill listVal:mapVal) {
          set.add(sdf.format(listVal.getRepayDate()));
        }
      }
      
      List<String> dateList = new ArrayList<>(set);
      
      if(DataUtil.isNotEmpty(dateList)) {
        for(int i =0;i<dateList.size();i++) {
          HSSFCell dateCell = tittleRow.createCell(i*4+tittles.length);
          HSSFCell dateCell1 = tittleRow1.createCell(tittles.length+i*4);
          HSSFCell dateCell2 = tittleRow1.createCell(tittles.length+i*4+1);
          HSSFCell dateCell3 = tittleRow1.createCell(tittles.length+i*4+2);
          HSSFCell dateCell4 = tittleRow1.createCell(tittles.length+i*4+3);
          
          dateCell.setCellStyle(fontStyle);
          dateCell1.setCellStyle(fontStyle);
          dateCell2.setCellStyle(fontStyle);
          dateCell3.setCellStyle(fontStyle);
          dateCell4.setCellStyle(fontStyle);
          
          String date = dateList.get(i);
          String dateCellVal = date.split("-")[0]+"年"+date.split("-")[1]+"月";
          CellRangeAddress cellRangeDate = new CellRangeAddress(0,0,tittles.length+i*4,tittles.length+3+i*4);
          sheet.addMergedRegion(cellRangeDate);
          dateCell.setCellValue(dateCellVal);
          dateCell1.setCellValue("应还本金");
          dateCell2.setCellValue("应还利息");
          dateCell3.setCellValue("应还本息合计");
          dateCell4.setCellValue("其他应还费用");
        }
      }
      
      if(DataUtil.isNotEmpty(list)) {
        for(int i =0;i<list.size();i++) {
          HSSFRow dataRow = sheet.createRow(i+2);
          HSSFCell dataCellIndex = dataRow.createCell(0);
          HSSFCell dataCellAccount = dataRow.createCell(1);
          HSSFCell dataCellPrjName = dataRow.createCell(2);
          HSSFCell dataCellAmount = dataRow.createCell(3);
          HSSFCell dataCellTradeDate = dataRow.createCell(4);
          HSSFCell dataCellRate = dataRow.createCell(5);
          HSSFCell dataCellAgency = dataRow.createCell(6);
          HSSFCell dataCellAdviserFee = dataRow.createCell(7);
          HSSFCell dataCellGuranteeFee = dataRow.createCell(8);
          HSSFCell dataCellBondFee = dataRow.createCell(9);
          
          dataCellIndex.setCellStyle(fontStyle);
          dataCellAccount.setCellStyle(fontStyle);
          dataCellPrjName.setCellStyle(fontStyle);
          dataCellAmount.setCellStyle(fontStyle);
          dataCellTradeDate.setCellStyle(fontStyle);
          dataCellRate.setCellStyle(fontStyle);
          dataCellAgency.setCellStyle(fontStyle);
          dataCellAdviserFee.setCellStyle(fontStyle);
          dataCellGuranteeFee.setCellStyle(fontStyle);
          dataCellBondFee.setCellStyle(fontStyle);
          
          dataCellIndex.setCellValue(i+1);
          int length = list.get(i).getCardNo().length();
          if(length>=4) {
            dataCellAccount.setCellValue(list.get(i).getBank()+"/"+list.get(i).getCardNo().substring(length-4, length));
          }
          dataCellPrjName.setCellValue(list.get(i).getName());
          dataCellAmount.setCellValue(list.get(i).getAmount().setScale(2, BigDecimal.ROUND_HALF_UP).toString());
          dataCellTradeDate.setCellValue(sdf1.format(list.get(i).getTradeDate()));
          dataCellRate.setCellValue(list.get(i).getRate().setScale(2, BigDecimal.ROUND_HALF_UP).toString());
          dataCellAgency.setCellValue(list.get(i).getCreditAgency());
          dataCellAdviserFee.setCellValue(list.get(i).getAdviserFee().setScale(2, BigDecimal.ROUND_HALF_UP).toString());
          dataCellGuranteeFee.setCellValue(list.get(i).getGuaranteeFee().setScale(2, BigDecimal.ROUND_HALF_UP).toString());
          dataCellBondFee.setCellValue(list.get(i).getBondFee().setScale(2, BigDecimal.ROUND_HALF_UP).toString());
          
          
          List<FinaceTradeBill> curBillList = map.get(list.get(i).getTid());
          Map<String,FinanceListVo> curBillAmount = new HashMap<>();
          FinanceListVo vo = new FinanceListVo();
          Set billDate = new TreeSet();
          
          String repayDate =sdf.format(curBillList.get(0).getRepayDate());
          billDate.add(repayDate);
          
          for(FinaceTradeBill bill:curBillList) {//当前项目的所有还款计划
            
            
            if(billDate.add(sdf.format(bill.getRepayDate()))) {
              FinanceListVo voCopy = new FinanceListVo();
              voCopy.setCurPrincipal(vo.getCurPrincipal());
              voCopy.setCurInterest(vo.getCurInterest());
              voCopy.setOtherFee(vo.getOtherFee());
              voCopy.setRepayAmount(vo.getRepayAmount());
              
              curBillAmount.put(repayDate, voCopy);
              
              vo.setCurPrincipal(BigDecimal.ZERO);
              vo.setCurInterest(BigDecimal.ZERO);
              vo.setOtherFee(BigDecimal.ZERO);
              vo.setRepayAmount(BigDecimal.ZERO);
              
              repayDate =sdf.format(bill.getRepayDate());
            }
              vo.setCurPrincipal(vo.getCurPrincipal().add(bill.getCurPrincipal()));
              vo.setCurInterest(vo.getCurInterest().add(bill.getCurInterset()));
              vo.setOtherFee(vo.getOtherFee().add(bill.getOrtherFee()));
              vo.setRepayAmount(vo.getRepayAmount().add(bill.getCurPrincipal()).add(bill.getCurInterset()));
              
              if(bill.getCurLimit().equals(bill.getLimits())) {
                FinanceListVo voCopy = new FinanceListVo();
                voCopy.setCurPrincipal(vo.getCurPrincipal());
                voCopy.setCurInterest(vo.getCurInterest());
                voCopy.setRepayAmount(vo.getRepayAmount());
                voCopy.setOtherFee(vo.getOtherFee());
                
                curBillAmount.put(repayDate, voCopy);
              }
          }
          
          curBillAmount.forEach((date,amountVo)->{
            int dateIndex = dateList.indexOf(date)*4+tittles.length;
            
            HSSFCell principalCell = dataRow.createCell(dateIndex);
            HSSFCell interestCell = dataRow.createCell(dateIndex+1);
            HSSFCell amountCell = dataRow.createCell(dateIndex+2);
            HSSFCell otherCell = dataRow.createCell(dateIndex+3);
            
            sheet.setColumnWidth(dateIndex, 15*256);
            sheet.setColumnWidth(dateIndex+1, 15*256);
            sheet.setColumnWidth(dateIndex+2, 15*256);
            sheet.setColumnWidth(dateIndex+3, 15*256);
            
            principalCell.setCellStyle(fontStyle);
            interestCell.setCellStyle(fontStyle);
            amountCell.setCellStyle(fontStyle);
            otherCell.setCellStyle(fontStyle);
            
            principalCell.setCellValue(amountVo.getCurPrincipal().setScale(2, BigDecimal.ROUND_HALF_UP).toString());
            interestCell.setCellValue(amountVo.getCurInterest().setScale(2, BigDecimal.ROUND_HALF_UP).toString());
            amountCell.setCellValue(amountVo.getRepayAmount().setScale(2, BigDecimal.ROUND_HALF_UP).toString());
            otherCell.setCellValue(amountVo.getOtherFee().setScale(2, BigDecimal.ROUND_HALF_UP).toString());
            
          });
        }
      }
      
    } catch (Exception e) {
      e.printStackTrace();
    }
    return workbook;
  }

  @Override
  public RestAPIResult<Object> getExistedProject(String prjName, String tid)
      throws BusinessException {
    RestAPIResult<Object> result = new RestAPIResult<>();
    String isExsisted;
    FinaceTradeCriteria finaceTradeCriteria = new FinaceTradeCriteria();
    finaceTradeCriteria.createCriteria().andNameEqualTo(prjName).andStateNotEqualTo(0);
    List<FinaceTrade> list = finaceTradeMapper.selectByExample(finaceTradeCriteria);
    if (list.size() == 0) {
      isExsisted = new String("false");
    } else {
      if(DataUtil.isEmpty(tid)) {
        isExsisted = new String("true");
      }
      else{
        for(FinaceTrade item : list) {
          if(item.getTid().equals(tid)) {
            isExsisted = new String("false");
            result.setRespData(isExsisted);
            return result;
          }
        }
        isExsisted = new String("true");
      }
    }
    result.setRespData(isExsisted); 
    return result;
  }



}
