package com.zhishi.backend.controller.finance;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.text.DateFormat;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.google.errorprone.annotations.RestrictedApi;
import com.zhishi.backend.controller.BaseController;
import com.zhishi.bean.finance.FinPeriod;
import com.zhishi.bean.finance.Statement;
import com.zhishi.bean.finance.StatementCriteria;
import com.zhishi.bean.order.BizOrder;
import com.zhishi.bean.backend.User;
import com.zhishi.bean.capitaldepartment.FinaceTrade;
import com.zhishi.bean.capitaldepartment.FinaceTradeBill;
import com.zhishi.bean.capitaldepartment.FinaceTradeBillCriteria;
import com.zhishi.bean.capitaldepartment.FinaceTradeOrder;
import com.zhishi.bean.finance.FinBank;
import com.zhishi.bean.vo.finance.AssociatedPrjVo;
import com.zhishi.bean.vo.finance.FinanceListVo;
import com.zhishi.bean.vo.finance.FinancePlanDetailVO;
import com.zhishi.bean.vo.finance.FinanceQueryVo;
import com.zhishi.bean.vo.finance.PeriodQuery;
import com.zhishi.bean.vo.finance.ProjectAddVo;
import com.zhishi.bean.vo.finance.StatementVO;
import com.zhishi.common.exception.BusinessException;
import com.zhishi.common.util.DataUtil;
import com.zhishi.common.vo.MyBatisPage;
import com.zhishi.common.vo.RestAPIResult;
import com.zhishi.dal.mapper.capitaldepartment.FinaceTradeBillMapper;
import com.zhishi.dal.mapper.capitaldepartment.FinaceTradeMapper;
import com.zhishi.service.common.OssCommonService;
import com.zhishi.service.finance.FinanceService;

/**
 * 创建时间：2019年8月6日 上午8:57:17 项目名称：zhishi-backend
 * 
 * @author hxl
 * @version 1.0
 * @since JDK 1.8.0_ 文件名称：FinanceController.java 类说明：
 */
@RestController
@RequestMapping("/zs/finance")
public class FinanceController extends BaseController {
  private Logger logger = Logger.getLogger(FinanceController.class);
  private static final String MESSAGE_KEY = "message";
  @Autowired
  FinanceService financeService;
  @Autowired
  OssCommonService ossCommonService;
  @Autowired
  FinaceTradeBillMapper finaceTradeBillMapper;
  @Autowired
  FinaceTradeMapper finaceTradeMapper;
  /**
   * 查询关账列表
   * 
   * @param finPeriod
   * @return
   * @throws BusinessException
   */
  @RequestMapping(value = "queryPeriod", method = RequestMethod.POST)
  RestAPIResult<MyBatisPage<FinPeriod>> queryPeriod(String month,
      @RequestParam(defaultValue = "0") Integer nextPage,
      @RequestParam(defaultValue = "10") Integer pageSize) throws BusinessException {
    PeriodQuery finPeriod = new PeriodQuery();
    finPeriod.setMonth(month);
    finPeriod.setNextPage(nextPage);
    finPeriod.setPageSize(pageSize);
    return financeService.queryPeriod(finPeriod);
  };

  /**
   * 生成关账期末数据
   * 
   * @param finPeriod
   * @return
   * @throws BusinessException
   */
  @RequestMapping(value = "createPeriod", method = RequestMethod.POST)
  RestAPIResult<FinPeriod> createPeriod(FinPeriod finPeriod) throws BusinessException {
    return financeService.createPeriod(finPeriod);
  };

  /**
   * 关账操作
   * 
   * @param finPeriod
   * @throws BusinessException
   */
  @RequestMapping(value = "completedMonth", method = RequestMethod.POST)
  RestAPIResult<Object> completedMonth(FinPeriod finPeriod, HttpServletRequest request)
      throws BusinessException {
    return financeService.completedMonth(finPeriod);
  };

  @RequestMapping(value = "queryFinanceProject", method = RequestMethod.POST)
  RestAPIResult<MyBatisPage<FinanceListVo>> queryFinanceProject(FinanceQueryVo query)
      throws BusinessException {
    return financeService.queryFinanceProject(query);
  };


  @RequestMapping(value = "getBanckAccountList", method = RequestMethod.POST)
  RestAPIResult<List<FinBank>> getBanckAccountList() throws BusinessException {
    return financeService.getBanckAccountList();
  };


  @RequestMapping(value = "getAssociatedProject", method = RequestMethod.POST)
  RestAPIResult<List<AssociatedPrjVo>> getAssociatedProject(@RequestParam(value = "tid", defaultValue = "null")String tid) throws BusinessException {
    return financeService.getAssociatedProject(tid);
  }

  @RequestMapping(value = "importPlan", method = RequestMethod.POST)
  RestAPIResult<Object> importRepaymentPlan(
      @RequestParam(value = "xlsFile1", required = true) MultipartFile xlsFile1,
      HttpServletRequest request, @RequestParam(required = false) String serialNo)
      throws BusinessException, ParseException {
    Map<String, String> uploadLocationMap = this.getUploadSuffix();
    String tmp_path = uploadLocationMap.get("tmp_path");
    String filePath = ossCommonService.uploadTmpFile(xlsFile1, tmp_path);
    logger.info("----------------------------------------->>>上传文件路径：" + filePath);
    RestAPIResult<Object> result = financeService.importRepaymentPlan(filePath, request, serialNo);
    return result;
  }

  @RequestMapping(value = "submitProject", method = {RequestMethod.GET, RequestMethod.POST})
  @ResponseBody
  public RestAPIResult<Object> submitProject(@RequestBody ProjectAddVo projectAddVo,
      HttpServletRequest request) throws BusinessException, ParseException {
    RestAPIResult<Object> result = new RestAPIResult<Object>();
    User user = getSessionUser(request);
    if (DataUtil.isNotEmpty(projectAddVo.getTid())) {
      result = financeService.modifyProject(projectAddVo, user);
    } else {
      result = financeService.createProject(projectAddVo, user);
    }

    return result;

  }

  @RequestMapping(value = "getExistedProject", method = RequestMethod.POST)
  public RestAPIResult<Object> getExistedProject(@RequestParam(value = "prjName") String prjName,@RequestParam(value = "tid")String tid) throws BusinessException {
    RestAPIResult<Object> result = new RestAPIResult<Object>();
    result = financeService.getExistedProject(prjName, tid);
    return result;
  }
  
  @RequestMapping(value = "exportDetail", method = RequestMethod.POST)
  public RestAPIResult<Boolean> exportAccountSubjectData(FinanceQueryVo financeQueryVo, HttpServletRequest request,
      HttpServletResponse response) throws BusinessException,IOException{
    RestAPIResult<Boolean> result = new RestAPIResult<Boolean>();
    
    String agent = request.getHeader("USER-AGENT").toLowerCase();

    String filename = "筹资台账信息.xls";
   
    try {
      if ((agent.indexOf("msie") > -1) || (agent.indexOf("edge") > -1) || (agent.indexOf("trident") > -1)) {
        filename = URLEncoder.encode(filename, "UTF-8");
    } else { // firefox/safari不转码
        filename = new String(filename.getBytes("UTF-8"), "ISO8859-1");
    }
    response.setContentType("application/msexcel");
    response.setCharacterEncoding("utf-8");
    response.setHeader("Content-Disposition", "attachment;filename=" + filename);
    OutputStream output = response.getOutputStream();
    //FIXME
      List<FinanceListVo> list= financeService.queryFinanceProject(financeQueryVo).getRespData().getContent();
      Map<String,List<FinaceTradeBill>> map = new HashMap<>();
      List<FinaceTrade> finaceTradeList = new ArrayList<>();
      for(int i =0;i<list.size();i++) {
        FinaceTradeBillCriteria example = new FinaceTradeBillCriteria();
        example.createCriteria().andTradeIdEqualTo(list.get(i).getTid());
        List<FinaceTradeBill> billList = finaceTradeBillMapper.selectByExample(example);
        FinaceTrade finaceTrade = finaceTradeMapper.selectByPrimaryKey(list.get(i).getTid());
        finaceTradeList.add(finaceTrade);
        Collections.sort(billList, new Comparator<FinaceTradeBill>() {// 按时间升序排列
          @Override
          public int compare(FinaceTradeBill o1, FinaceTradeBill o2) {
            return o1.getRepayDate().compareTo(o2.getRepayDate());
          }
        });
        map.put(list.get(i).getTid(), billList);
      }
      HSSFWorkbook workbook = financeService.exportDetail(finaceTradeList,map);
      workbook.write(output);
      output.flush();
      output.close();
      
    } catch (Exception e) {
      logger.error(e.getMessage(), e);
    }
    
    
    return result;
    
  }

  @RequestMapping(value = "exportPlanTemplate", method = RequestMethod.GET)
  public void exportTemplate(HttpServletRequest request, HttpServletResponse response) {
    InputStream input = null;
    try {
      String filename = "1_筹资台账还款计划模板.xlsx";
      String agent = request.getHeader("USER-AGENT").toLowerCase();
      // 根据浏览器类型处理文件名称
      if ((agent.indexOf("msie") > -1) || (agent.indexOf("edge") > -1)
          || (agent.indexOf("trident") > -1)) {
        filename = URLEncoder.encode(filename, "UTF-8");
      } else { // firefox/safari不转码
        filename = new String(filename.getBytes("UTF-8"), "ISO8859-1");
      }
      response.setContentType("application/msexcel");
      response.setCharacterEncoding("utf-8");
      response.setHeader("Content-Disposition", "attachment;filename=" + filename);
      OutputStream output = response.getOutputStream();

      String filePath = Thread.currentThread().getContextClassLoader()
          .getResource("conf/config.properties").getPath();
      // String srcFilePath = "C:\\dev\\template_monthPayBill.xls";
      String srcFilePath = filePath.split("/WEB-INF/")[0];
      srcFilePath = srcFilePath + "/xlstemplate/template_finaceRepayment.xlsx";
      File srcfile = new File(srcFilePath);
      input = new FileInputStream(srcfile);
      // 修正 Excel在“xxx.xlsx”中发现不可读取的内容。是否恢复此工作薄的内容？如果信任此工作簿的来源，请点击"是"
      response.setHeader("Content-Length", String.valueOf(input.available()));
      byte[] datas = new byte[input.available()];
      int bytes = input.read(datas);
      logger.info("    read [" + bytes + "] of datas");
      output.write(datas);
      output.flush();

    } catch (Exception e) {
      logger.error("     exportTemplate error:" + e.getMessage());
      throw new RuntimeException(e.getMessage());
    } finally {
      if (input != null) {
        try {
          input.close();
        } catch (Exception e) {
          logger.error("  close input stream error  ....");
        }
      }
    }
  }


  @RequestMapping(value = "getProjectDetailBySerialNo",
      method = {RequestMethod.GET, RequestMethod.POST})
  public RestAPIResult<ProjectAddVo> getProjectDetailBySerialNo(
      @RequestParam(value = "tid", required = true) String serialNo, HttpServletRequest request)
      throws BusinessException {
    User user = getSessionUser(request);
    RestAPIResult<ProjectAddVo> result = new RestAPIResult<ProjectAddVo>();
    result = financeService.getProjectDetailBySerialNo(serialNo, user);
    Map<String, Object> respMap = result.getRespMap();
    String zimgUrl = getUploadSuffix().get("ZIMG_ROOT_URL");
    String fastdbUrl = getUploadSuffix().get("FASTDB_ROOT_URL");
    respMap.put("zimgUrl", zimgUrl);
    respMap.put("fastdbUrl", fastdbUrl);
    result.setRespMap(respMap);
    return result;

  }


  @RequestMapping(value = "projectOperation", method = {RequestMethod.GET, RequestMethod.POST})
  public RestAPIResult<Object> projectOperation(
      @RequestParam(value = "tid", required = true) String tid,
      @RequestParam(value = "operation", required = true) String operation,
      HttpServletRequest request) throws BusinessException {
    User user = getSessionUser(request);
    return financeService.projectOperation(tid, user, operation);
  }

  @RequestMapping(value = "getBankStatement", method = RequestMethod.POST)
  public RestAPIResult<List<Statement>> bankStatement(
      @RequestParam(value = "tid", required = true) String tid) throws BusinessException {
    return financeService.getBankStatement(tid);
  }

  @RequestMapping(value = "confirmRecord", method = {  RequestMethod.GET,RequestMethod.POST})
  @ResponseBody
  public RestAPIResult<Object> confirmRecord(@RequestBody List<Statement> statementList,
      HttpServletRequest request,@RequestParam(value = "tid", required = true)String tid,
      @RequestParam(value = "billTid", required = true)String billTid) throws BusinessException{
    User user = getSessionUser(request);
    return financeService.confirmRecord(statementList, user, tid, billTid);
  }
  
  @RequestMapping(value = "getTradeRecord", method = RequestMethod.POST)
  public RestAPIResult<List<Statement>> getTradeRecord(@RequestParam("billTid") String billTid) throws BusinessException{
    if(DataUtil.isEmpty(billTid)) {
      throw new BusinessException("还款计划id为空");
    }
    return financeService.getRecordStatement(billTid);
  }
  
  @RequestMapping(value = "planDetailByTime", method = RequestMethod.POST)
  public RestAPIResult<List<FinancePlanDetailVO>> planDetailByTime(@RequestParam("option") String option) throws BusinessException{
    if(DataUtil.isEmpty(option)) {
      throw new BusinessException("选项为空");
    }
    return financeService.planDetailByTime(option);
  }
}
