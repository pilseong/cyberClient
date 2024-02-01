import { fetch, fetchMultiPart } from './../util/unity_resource';
import { citizenAlert, citizenConfirm, maskingFnc, fncFileDownload, mobilePattern, phonePattern, numberWithCommas, getNowDate} from './../util/uiux-common';
import CyberMinwon from '../infra/CyberMinwon';

declare var fncGetCodeByGroupCdUsing: (code: string) => string;
declare var fncSetComboByCodeList: (param1: string, param2: string) => void;
declare var gContextUrl: string;
declare var gVariables: any;
declare var $: any;
declare var getDoroAddrFromOwner: (prefix: string, body: any) => string;
declare var fncTrim: (str: string) => string;
declare var cyberMinwon: CyberMinwon;

export default class A13DetailPage {
  initSearch: boolean;
  state: {
    minwonCd: string;
    parent: any;
    path: string;
    statusInfo: any;
    suyongaInfo: {
      suyongaNumber: string;
      suyongaName: string;
      suyongaPostNumber: string;
      suyongaAddress: string;
      suyongaDetailAddress: string;
      suyongaBusinessType: string;
      mkey: string;
      csNo: string;
      csOfficeCd: string;
      ownerNm: string;
      usrName: string;
      mtrLoc: string;
      zip1: string;
      zip2: string;
      csAddr1: string;
      csAddr2: string;
      usrTel: string;
      hshldCnt: string;
      idtCdS: string;
      idtCdSNm: string;
      cbCd: string;
      cbCdNm: string;
      tapNo: string;
      vesslNo: string;
      preSealYear: string;
      lipipeCbCd: string;
      gcYy: string;
      gcMm: string;
      gcDd: string;
      idtCdH: string;
      idtCdHNm: string;
      gcThsmmPointer: string;
      csGuCd: string;
      csHdongCd: string;
      csBdongCd: string;
      usrIdNo: string;
      autoPayFlag: string;
      autoPayFlagNm: string;
      ugOpenDay: string;
      recipterHshldCnt: string;
      cgExceptAdjRsnCd: string;
      oldExemptCd: string;
      hRdCd: string;
      hRdrate: string;
      wAlotmRdCd: string;
      wAlotmRdrate: string;
      tapStatusCd: string;
      ugStatusCd: string;
      swaterdspsMth: string;
      docSealNo: string;
      area: string;
      tapOpenDay: string;
      csSido: string;
      csGuCdNm: string;
      csRn: string;
      csBldBon: string;
      csBldBu: string;
      csSan: string;
      csBon: string;
      csBu: string;
      csBldDong: string;
      csBldHo: string;
      csUgFlag: string;
      csUgFloorNo: string;
      csEtcAddr: string;
      csBldNm: string;
      csBdongCdNm: string;
      reqAddr1: string;
      reqAddr2: string;
      reqSido: string;
      reqGuCdNm: string;
      reqRn: string;
      reqBldBon: string;
      reqBldBu: string;
      reqSan: string;
      reqBon: string;
      reqBu: string;
      reqBldDong: string;
      reqBldHo: string;
      reqUgFlag: string;
      reqUgFloorNo: string;
      reqEtcAddr: string;
      reqBldNm: string;
      reqBdongCdNm: string;
      vsgGbn: string;
      gtnSeCd: string;
      csStdBdongCd: string;
      csApthouseCd: string;
      reqStdBdongCd: string;
      premmPointer: string;
      csJCnt: string;
      csHdongCdNm: string;
      mblckCd: string;
      mblckCdNm: string;
      sblckCd: string;
      sblckCdNm: string;
      ctcharCd: string;
      ctcharCdNm: string;
      srvrsvCd: string;
      srvrsvCdNm: string;
      mtrTypeCd: string;
      mtrTypeCdNm: string;
      tapLocCd: string;
      tapLocCdNm: string;
      tapLocDetailCd: string;
      tapLocDetailCdNm: string;
      mpcMtrqlt: string;
      mpcStatus: string;
      mrnrBxStatus: string;
      wplmStatus: string;
      wpMtrqlt: ''
      //
    };
    applyInfo: {
      applyNm: string; //신청인
      telno: string; //일반전화
      hpno: string; //휴대전화
      smsAllowYn: string; //수신동의
      email: string; //이메일
      relation: string //관계 표출용
      relation1: string; //관계1
      relation2: string; //관계2

      //주소
      cvpl_adres_ty : string;
      zipcode: string;   // 우편번호
      addr1: string;  // 기본주소
      addr2: string; // 상세주소
      fullDoroAddr: string; //도로명주소
      sido: string;
      sigungu: string;
      umd: string;
      hdongNm: string;
      dong: string;
      doroCd: string;
      doroNm: string;
      dzipcode: string;
      bupd: string;
      bdMgrNum: string;
      bdBonNum: string;
      bdBuNum: string;
      bdnm: string;
      bdDtNm: string;
      bunji: string;
      ho: string;
      extraAdd: string;
      specAddr: string;
      specDng: string;
      specHo: string;
      floors: string;
      buildingYear: string;
      contents: string;
    };
    requestInfo: {
      [key : string]: string | any,
      receiptNo: string; // 접수번호
      ownerNm: string; //소유자(건물주)

      buildingYear: string; //준공년도
      workTerm: string; //공사범위
      workTermNm: string; //공사범위명
      planMoney: string; //공사예정금액
      
      fileName1: string; //통장사본
      file1: any; //통장사본
      fileName2: string; //견적서
      file2: any; //견적서
      fileName3: string; //신청서
      file3: any; //신청서
      fileName4: string; //설계서
      file4: any; //설계서
      fileName5: string; //청렴이행서약서
      file5: any; //청렴이행서약서
    };
    isSubmitSuccessful: boolean;
    submitResult: any;
    viewRequestInfo: any;
    description: any;
};
  constructor(parent: any, minwonCd: string) {
    this.initSearch = true,
    this.state = {
      minwonCd,
      parent,
      path: 'cyberMinwon.state.currentModule.state.currentPage',
      statusInfo: {},
      suyongaInfo: {
        suyongaNumber: '',
        suyongaName: '',
        suyongaPostNumber: '',
        suyongaAddress: '',
        suyongaDetailAddress: '',
        suyongaBusinessType: '',
        mkey: '',
        csNo: '',
        csOfficeCd: '',
        ownerNm: '',
        usrName: '',
        mtrLoc: '',
        zip1: '',
        zip2: '',
        csAddr1: '',
        csAddr2: '',
        usrTel: '',
        hshldCnt: '',
        idtCdS: '',
        idtCdSNm: '',
        cbCd: '',
        cbCdNm: '',
        tapNo: '',
        vesslNo: '',
        preSealYear: '',
        lipipeCbCd: '',
        gcYy: '',
        gcMm: '',
        gcDd: '',
        idtCdH: '',
        idtCdHNm: '',
        gcThsmmPointer: '',
        csGuCd: '',
        csHdongCd: '',
        csBdongCd: '',
        usrIdNo: '',
        autoPayFlag: '',
        autoPayFlagNm: '',
        ugOpenDay: '',
        recipterHshldCnt: '',
        cgExceptAdjRsnCd: '',
        oldExemptCd: '',
        hRdCd: '',
        hRdrate: '',
        wAlotmRdCd: '',
        wAlotmRdrate: '',
        tapStatusCd: '',
        ugStatusCd: '',
        swaterdspsMth: '',
        docSealNo: '',
        area: '',
        tapOpenDay: '',
        csSido: '',
        csGuCdNm: '',
        csRn: '',
        csBldBon: '',
        csBldBu: '',
        csSan: '',
        csBon: '',
        csBu: '',
        csBldDong: '',
        csBldHo: '',
        csUgFlag: '',
        csUgFloorNo: '',
        csEtcAddr: '',
        csBldNm: '',
        csBdongCdNm: '',
        reqAddr1: '',
        reqAddr2: '',
        reqSido: '',
        reqGuCdNm: '',
        reqRn: '',
        reqBldBon: '',
        reqBldBu: '',
        reqSan: '',
        reqBon: '',
        reqBu: '',
        reqBldDong: '',
        reqBldHo: '',
        reqUgFlag: '',
        reqUgFloorNo: '',
        reqEtcAddr: '',
        reqBldNm: '',
        reqBdongCdNm: '',
        vsgGbn: '',
        gtnSeCd: '',
        csStdBdongCd: '',
        csApthouseCd: '',
        reqStdBdongCd: '',
        premmPointer: '',
        csJCnt: '',
        csHdongCdNm: '',
        mblckCd: '',
        mblckCdNm: '',
        sblckCd: '',
        sblckCdNm: '',
        ctcharCd: '',
        ctcharCdNm: '',
        srvrsvCd: '',
        srvrsvCdNm: '',
        mtrTypeCd: '',
        mtrTypeCdNm: '',
        tapLocCd: '',
        tapLocCdNm: '',
        tapLocDetailCd: '',
        tapLocDetailCdNm: '',
        mpcMtrqlt: '',
        mpcStatus: '',
        mrnrBxStatus: '',
        wplmStatus: '',
        wpMtrqlt: ''
        //
      },
      applyInfo: {
        applyNm: '', //신청인
        telno: '', //일반전화
        hpno: '', //휴대전화
        smsAllowYn: '',
        email: '', //이메일
        relation: '', //관계 표출용
        relation1: '', //관계1
        relation2: '', //관계2
        //주소
        cvpl_adres_ty : 'APPLY',
        zipcode: '',
        addr1: '',
        addr2: '',
        fullDoroAddr: '', //applyAddress
        sido: '',
        sigungu: '',
        umd: '',
        hdongNm: '',
        dong: '',
        doroCd: '',
        doroNm: '',
        dzipcode: '',
        bupd: '',
        bdMgrNum: '',
        bdBonNum: '',
        bdBuNum: '',
        bdnm: '',
        bdDtNm: '',
        bunji: '',
        ho: '',
        extraAdd: '',
        specAddr: '',
        specDng: '',
        specHo: '',
        floors: '',
        buildingYear: '',
        contents: ''
      },
      requestInfo: {
        
        receiptNo: '',
        ownerNm: '',
        buildingYear: '',  // 준공년도
        workTerm: '',
        workTermNm: '',
        planMoney: '',
        //첨부파일
        fileName1: '', //통장사본
        file1: '', //통장사본
        fileName2: '', //견적서
        file2: '', //견적서
        fileName3: '', //신청서
        file3: '', //신청서
        fileName4: '', //설계서
        file4: '', //설계서
        fileName5: '', //청렴이행서약서
        file5: ''
      },
      isSubmitSuccessful: false,
      submitResult: {},
      viewRequestInfo: {},
      description: {}
    }

    this.setInitValue();
  }

  // 초기값 설정
  setInitValue() {
    const that = this;
    that.setState({
      ...that.state,
      suyongaInfo: {
        suyongaNumber: '',
        suyongaName: '',
        suyongaPostNumber: '',
        suyongaAddress: '',
        suyongaDetailAddress: '',
        suyongaBusinessType: '',
        mkey: '',
        csNo: '',
        csOfficeCd: '',
        ownerNm: '',
        usrName: '',
        mtrLoc: '',
        zip1: '',
        zip2: '',
        csAddr1: '',
        csAddr2: '',
        usrTel: '',
        hshldCnt: '',
        idtCdS: '',
        idtCdSNm: '',
        cbCd: '',
        cbCdNm: '',
        tapNo: '',
        vesslNo: '',
        preSealYear: '',
        lipipeCbCd: '',
        gcYy: '',
        gcMm: '',
        gcDd: '',
        idtCdH: '',
        idtCdHNm: '',
        gcThsmmPointer: '',
        csGuCd: '',
        csHdongCd: '',
        csBdongCd: '',
        usrIdNo: '',
        autoPayFlag: '',
        autoPayFlagNm: '',
        ugOpenDay: '',
        recipterHshldCnt: '',
        cgExceptAdjRsnCd: '',
        oldExemptCd: '',
        hRdCd: '',
        hRdrate: '',
        wAlotmRdCd: '',
        wAlotmRdrate: '',
        tapStatusCd: '',
        ugStatusCd: '',
        swaterdspsMth: '',
        docSealNo: '',
        area: '',
        tapOpenDay: '',
        csSido: '',
        csGuCdNm: '',
        csRn: '',
        csBldBon: '',
        csBldBu: '',
        csSan: '',
        csBon: '',
        csBu: '',
        csBldDong: '',
        csBldHo: '',
        csUgFlag: '',
        csUgFloorNo: '',
        csEtcAddr: '',
        csBldNm: '',
        csBdongCdNm: '',
        reqAddr1: '',
        reqAddr2: '',
        reqSido: '',
        reqGuCdNm: '',
        reqRn: '',
        reqBldBon: '',
        reqBldBu: '',
        reqSan: '',
        reqBon: '',
        reqBu: '',
        reqBldDong: '',
        reqBldHo: '',
        reqUgFlag: '',
        reqUgFloorNo: '',
        reqEtcAddr: '',
        reqBldNm: '',
        reqBdongCdNm: '',
        vsgGbn: '',
        gtnSeCd: '',
        csStdBdongCd: '',
        csApthouseCd: '',
        reqStdBdongCd: '',
        premmPointer: '',
        csJCnt: '',
        csHdongCdNm: '',
        mblckCd: '',
        mblckCdNm: '',
        sblckCd: '',
        sblckCdNm: '',
        ctcharCd: '',
        ctcharCdNm: '',
        srvrsvCd: '',
        srvrsvCdNm: '',
        mtrTypeCd: '',
        mtrTypeCdNm: '',
        tapLocCd: '',
        tapLocCdNm: '',
        tapLocDetailCd: '',
        tapLocDetailCdNm: '',
        mpcMtrqlt: '',
        mpcStatus: '',
        mrnrBxStatus: '',
        wplmStatus: '',
        wpMtrqlt: ''
        //
      },
      applyInfo: {
        applyNm: '', //신청인
        telno: '', //일반전화
        hpno: '', //휴대전화
        smsAllowYn: '',
        email: '', //이메일
        relation: '', //관계 표출용
        relation1: '', //관계1
        relation2: '', //관계2
        //주소
        cvpl_adres_ty : 'APPLY',
        zipcode: '',
        addr1: '',
        addr2: '',
        fullDoroAddr: '', //applyAddress
        sido: '',
        sigungu: '',
        umd: '',
        hdongNm: '',
        dong: '',
        doroCd: '',
        doroNm: '',
        dzipcode: '',
        bupd: '',
        bdMgrNum: '',
        bdBonNum: '',
        bdBuNum: '',
        bdnm: '',
        bdDtNm: '',
        bunji: '',
        ho: '',
        extraAdd: '',
        specAddr: '',
        specDng: '',
        specHo: '',
        floors: ''
      },
      requestInfo: {
        
        receiptNo: '',
        ownerNm: '',
        buildingYear: '',  // 준공년도
        workTerm: '',
        workTermNm: '',
        planMoney: '',
        //첨부파일
        fileName1: '', //통장사본
        file1: '', //통장사본
        fileName2: '', //견적서
        file2: '', //견적서
        fileName3: '', //신청서
        file3: '', //신청서
        fileName4: '', //설계서
        file4: '', //설계서
        fileName5: '', //청렴이행서약서
        file5: ''
      }
    });
  }

  // 민원안내, 절차 정보를 서버에 요청한다. 
  getDescription(data: any) {
    const that = this;
    that.setState({
      ...that.state,
      description: data 
    });
    let workTerm = fncGetCodeByGroupCdUsing("021");
    that.setState({
      ...that.state,
      statusInfo: {
        comboWorkTerm: workTerm
      }
    });
  }

  // InfoPanel 데이터 설정
  getViewInfo() {
    const that = this;
    let infoData: any = {};
    let requestInfo = that.state.requestInfo
    //신청내용
    infoData['viewA13Detail'] = {
//      title: '신청내용',
      buildingYear: [requestInfo.buildingYear, '준공년도'],
      workTermNm: [requestInfo.workTermNm, '공사범위'],
      planMoney: [requestInfo.planMoney, '공사예정금액'],
      file1: [requestInfo.fileName1?requestInfo.fileName1:'파일없음','통장사본'],
      file2: [requestInfo.fileName2?requestInfo.fileName2:'파일없음','견적서'],
      file3: [requestInfo.fileName3?requestInfo.fileName3:'파일없음','신청서'],
      file4: [requestInfo.fileName4?requestInfo.fileName4:'파일없음','설계서'],
      file5: [requestInfo.fileName5?requestInfo.fileName5:'파일없음','청렴이행서약서']
    }
    return infoData;
  }
  
  getViewInfoApplication(){
    const that = this;
    let infoData: any = {};
    let requestInfo = that.state.requestInfo;
    let suyongaInfo = that.state.suyongaInfo;
    let applyInfo = that.state.applyInfo;
    //수용가
    infoData['suyongaInfo'] = {
      title: '옥내급수관 진단 상담 정보',
      viewReceiptNo:[requestInfo.receiptNo,'접수번호'],
      viewSuyongaNumber:[suyongaInfo.mkey,'수용가번호'],
      viewAddr:["("+suyongaInfo.suyongaPostNumber+") "+suyongaInfo.suyongaAddress,'수용가주소'],
      viewOwnerName: [maskingFnc.name(suyongaInfo.ownerNm, "*"), '소유자'],
      viewOwnerNumber: [suyongaInfo.mkey, '수용가번호'],
      viewApplyName: [maskingFnc.name(applyInfo.applyNm, "*"), '신청인'],
      viewApplyPh: [maskingFnc.telNo(that.state.applyInfo.hpno, "*"), '신청인연락처'],
    }
    return infoData;
  }

  // 결과 뷰를 세팅하는 함수. 여기서 반환된 결과가 ResultPage에 표시된다.
  getResultView() {
    const infoData: any = {};
    const applyNm = this.state.applyInfo.applyNm;
    const applyDt = $("#applyDt").val();
    // 신청 실패 화면
    if (!this.state.isSubmitSuccessful) {
      infoData['noinfo'] = {
//        title: this.state.description.minwonNm+' 결과',
        width: "150px",
        applyNm: [maskingFnc.name(applyNm, "*"), '신청인'],
        applyDt: [this.state.submitResult.data.applyDt?this.state.submitResult.data.applyDt:applyDt, '신청일시'],
        desc: ['정상적으로 처리되지 않았습니다.', '신청결과'],
        cause: [this.state.submitResult.errorMsg,'사유']
      }
    // 성공
    } else {
      infoData['noinfo'] = {
//        title:  this.state.description.minwonNm+' 결과',
        width: "150px",
        receipt_no : [this.state.submitResult.data.receiptNo, '접수번호'],
        applyNm: [maskingFnc.name(applyNm, "*"), '신청인'],
        applyDt: [this.state.submitResult.data.applyDt, '신청일시'],
        desc: ['정상적으로 신청되었습니다.', '신청결과']
      }
    }
    
    return infoData;
  }

  setState(nextState: any) {
    this.state = nextState;
  }

  setEventListeners() {
  }

  // 입력사항 검증 로직
  verify() {
    const that = this;
    const requestInfo = that.state.requestInfo;

    if (!requestInfo.planMoney) {
      citizenAlert("공사예정금액을 입력해 주세요.").then(result => {
        if(result){
          $("#planMoney").focus();
        }
      });
      return false;
    }
    if (!requestInfo.file1) {
      citizenAlert("통장사본을 첨부해 주세요");
      return false;
    }
    if (!requestInfo.file2) {
      citizenAlert("견적서를 첨부해 주세요");
      return false;
    }
    if (!requestInfo.file3) {
      citizenAlert("신청서를 첨부해 주세요");
      return false;
    }
    if (!requestInfo.file4) {
      citizenAlert("설계서를 첨부해 주세요");
      return false;
    }
    if (!requestInfo.file5) {
      citizenAlert("청렴이행서약서를 첨부해 주세요");
      return false;
    }
    return true;
  }

  handleChangeBuildingYear(e: any) {
    let value = e.target.value.replace(/[^0-9]/g,"").substring(0,4);
    
    let dateMap =getNowDate();
    (value > '2100' || value == "0000") ? value= dateMap.get("year") : value;
    
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        buildingYear: value
      }
    });
    e.target.value = this.state.requestInfo.buildingYear;
  }

  //
  handleChangeWorkTerm(e: any) {
    let value = e.value;
    let name = e.options[e.selectedIndex].text;
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        workTerm: value,
        workTermNm: name
      }
    });
  }

  handleChangePlanMoney(e: any) {
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        planMoney: e.target.value.replace(/[^0-9]/g,"").substring(0, 10)
      }
    });
    e.target.value = numberWithCommas(this.state.requestInfo.planMoney.substring(0, 10));
  }

  handleChangeFile(e: any) {
    const inputFile = e.target;
    let fileIdx = parseInt(inputFile.id.substring(inputFile.id.length-1));
    
    if(e.target.value){//파일 선택 누르고 취소 눌러서 파일이 없을 수도 있음
      //임시 파일 체크
      let ext = e.target.value.split(".").pop().toLowerCase();
      if($.inArray(ext, gVariables['imgFileUploadPosible']) < 0){
        citizenAlert("업로드가 제한된 파일입니다. 확장자를 확인해 주세요.");
        //citizenAlert("업로드가 제한된 파일입니다. 확장자를 체크해 주세요.\n[업로드 가능 파일 : " + gVariables['imgFileUploadPosible'].toString() + " ]");
        $("#file"+fileIdx).val("");
        return false;
      }
      if(inputFile != undefined && inputFile !== null){
        let fileSize = inputFile.files[0].size;
        let maxSize = gVariables['fileUploadSize'] * 1024 *1024;
        if (fileSize > maxSize){
          citizenAlert("파일용량 " + gVariables['fileUploadSize'] + "MB를 초과하였습니다.");
          $("#file"+fileIdx).val("");
          return false;
        }
      }
    }
    
    const keyName = "file";
    let fileName = e.target.files[0] ? e.target.files[0].name : "";
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        [keyName+fileIdx]: inputFile,
        ["fileName"+fileIdx]: fileName
      }
    });
    $("#fileName"+fileIdx).val(fileName);
//    e.target.value = this.state.requestInfo.fileName;
  }

  handleClickDeleteFile(e: any, idx: number) {
    
    if(!$("#fileName"+idx).val()){
      return false;
    }
    citizenConfirm("첨부된 파일을 삭제하시겠습니까?").then(result => {
      $("#fileName"+idx).focus();
      if(!result){
        return false;
      }
      let tag = $(e.target).prev("input").id;
      let fileIdx = idx;
      let fileName = 'fileName'+fileIdx;
      let file = 'file'+fileIdx;
      let agent = navigator.userAgent.toLowerCase();
      
      if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ){
          // ie 일때 input[type=file] init.
          $(e).siblings("input").replaceWith( $(e).siblings("input").clone(true) );
      } else {
          //other browser 일때 input[type=file] init.
        $(e).siblings("input").val("");
      }
      this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          [fileName]: '',
          [file]: ''
        }
      });
    });
  }
  
  handleSearchA12Data(receiptNo : any){
    const that = this;
    var url = gContextUrl + "/citizen/common/ncitizenCtSportForm.do";
    var queryString = {
      'receiptNo': receiptNo
    };
    let formData = new FormData();
    formData.append("receiptNo",receiptNo);
    window.fetch(url,{
      method: 'post',
      body: formData
    }).then(res => {
      if(res.ok){
        return res.json();
      }else{
        throw new Error('응답이 올바르지 않습니다.');
      }
    })
    .then(data => {
      this.initSearch = false;
      const cvpl = data.cvpl;
      const cvplOwner = cvpl.cvplInfo.cvplOwner;
      const suyongaAddr = cvpl.cvplInfo.cvplAddr[1];
      const applyAddr = cvpl.cvplInfo.cvplAddr[0];
      const applcnt = cvpl.cvplInfo.cvplApplcnt;
      
      let telNo = applcnt.telno1+(applcnt.telno2?applcnt.telno2:"")+(applcnt.telno3?applcnt.telno3:"");
      let hpNo = applcnt.hpno1+applcnt.hpno2+applcnt.hpno3;
      let relation = applcnt.relation1 + ' 의 ' + applcnt.relation2;
      
      that.setState({
        ...that.state,
        requestInfo: {
          ...that.state.requestInfo,
          receiptNo: receiptNo,
          ownerNm: cvplOwner.ownerNm,
          buildingYear: cvpl.buildingYear
        },
        suyongaInfo: {
          ...that.state.suyongaInfo,
          suyongaNumber: cvplOwner.mkey,
          suyongaName: cvplOwner.ownerNm,
          suyongaPostNumber: suyongaAddr.zipcode,
          suyongaAddress: suyongaAddr.fullDoroAddr,
          suyongaDetailAddress: suyongaAddr.addr2,
          suyongaBusinessType: '',
          mkey: cvplOwner.mkey,
          csNo: cvplOwner.csNo,
          csOfficeCd: cvplOwner.csOfficeCd,
          ownerNm: cvplOwner.ownerNm,
          usrName: cvplOwner.usrName,
          mtrLoc: '',
          zip1: '',
          zip2: '',
          csAddr1: suyongaAddr.addr1,
          csAddr2: suyongaAddr.addr2,
          usrTel: '',
          hshldCnt: '',
          idtCdS: '',
          idtCdSNm: cvplOwner.idtCdSNm,
          cbCd: cvplOwner.cbCd,
          cbCdNm: cvplOwner.cbCdNm,
          tapNo: '',
          vesslNo: cvplOwner.vesslNo,
          preSealYear: '',
          lipipeCbCd: '',
          gcYy: cvplOwner.gcYy,
          gcMm: cvplOwner.gcMm,
          gcDd: cvplOwner.gcDd,
          idtCdH: '',
          idtCdHNm: '',
          gcThsmmPointer: cvplOwner.gcThsmmPointer,
          csGuCd: '',
          csHdongCd: '',
          csBdongCd: '',
          usrIdNo: '',
          autoPayFlag: '',
          autoPayFlagNm: '',
          ugOpenDay: '',
          recipterHshldCnt: '',
          cgExceptAdjRsnCd: '',
          oldExemptCd: '',
          hRdCd: '',
          hRdrate: '',
          wAlotmRdCd: '',
          wAlotmRdrate: '',
          tapStatusCd: '',
          ugStatusCd: '',
          swaterdspsMth: '',
          docSealNo: '',
          area: '',
          tapOpenDay: '',
          csSido: suyongaAddr.sido,
          csGuCdNm: suyongaAddr.sigungu,
          csRn: suyongaAddr.doroNm,
          csBldBon: suyongaAddr.bdBonNum,
          csBldBu: suyongaAddr.bdBuNum,
          csSan: suyongaAddr.fullDoroAddr,
          csBon: suyongaAddr.bunji,
          csBu: suyongaAddr.ho,
          csBldDong: suyongaAddr.specDng,
          csBldHo: suyongaAddr.specHo,
          csUgFlag: '',
          csUgFloorNo: suyongaAddr.floors,
          csEtcAddr: suyongaAddr.extraAdd,
          csBldNm: suyongaAddr.bdnm,
          csBdongCdNm: suyongaAddr.umd,
          reqAddr1: '',
          reqAddr2: '',
          reqSido: '',
          reqGuCdNm: '',
          reqRn: '',
          reqBldBon: '',
          reqBldBu: '',
          reqSan: '',
          reqBon: '',
          reqBu: '',
          reqBldDong: '',
          reqBldHo: '',
          reqUgFlag: '',
          reqUgFloorNo: '',
          reqEtcAddr: '',
          reqBldNm: '',
          reqBdongCdNm: '',
          vsgGbn: '',
          gtnSeCd: '',
          csStdBdongCd: suyongaAddr.bupd,
          csApthouseCd: '',
          reqStdBdongCd: '',
          premmPointer: '',
          csJCnt: '',
          csHdongCdNm: suyongaAddr.hdongNm,
          mblckCd: cvplOwner.mblckCd,
          mblckCdNm: cvplOwner.mblckCdNm,
          sblckCd: cvplOwner.sblckCd,
          sblckCdNm: cvplOwner.sblckCdNm,
          ctcharCd: '',
          ctcharCdNm: '',
          srvrsvCd: '',
          srvrsvCdNm: '',
          mtrTypeCd: '',
          mtrTypeCdNm: '',
          tapLocCd: '',
          tapLocCdNm: '',
          tapLocDetailCd: '',
          tapLocDetailCdNm: '',
          mpcMtrqlt: '',
          mpcStatus: '',
          mrnrBxStatus: '',
          wplmStatus: '',
          wpMtrqlt: ''
        },
        applyInfo: {
          ...that.state.applyInfo,
          applyNm: cvpl.cvplInfo.cvpl.applyNm,
          telno: telNo, //일반전화
          hpno: hpNo, //휴대전화
          smsAllowYn: cvpl.cvplInfo.cvplProcnd.smsAllowYn,
          email: applcnt.email, //이메일
          relation: relation, //관계 표출용
          relation1: applcnt.relation1, //관계1
          relation2: applcnt.relation2, //관계2
          //주소
          cvpl_adres_ty : 'APPLY',
          zipcode: applyAddr.zipcode,
          addr1: applyAddr.addr1,
          addr2: applyAddr.addr2,
          fullDoroAddr: applyAddr.fullDoroAddr, //applyAddress
          sido: applyAddr.sido,
          sigungu: applyAddr.sigungu,
          umd: applyAddr.umd,
          hdongNm: applyAddr.hdongNm,
          dong: applyAddr.dong,
          doroCd: applyAddr.doroCd,
          doroNm: applyAddr.doroNm,
          dzipcode: applyAddr.dzipcode,
          bupd: applyAddr.bupd,
          bdMgrNum: applyAddr.bdMgrNum,
          bdBonNum: applyAddr.bdBonNum,
          bdBuNum: applyAddr.bdBuNum,
          bdnm: applyAddr.bdnm,
          bdDtNm: applyAddr.bdDtNm,
          bunji: applyAddr.bunji,
          ho: applyAddr.ho,
          extraAdd: applyAddr.extraAdd,
          specAddr: applyAddr.specAddr,
          specDng: applyAddr.specDng,
          specHo: applyAddr.specHo,
          floors: applyAddr.floors,
          buildingYear: cvpl.buildingYear,
          contents: cvpl.contents
          }
      });
      that.render();
    })
    .catch(err => {
      
      citizenAlert("서버가 응답하지 않습니다. 잠시 후 다시 조회해 주세요.");
    });
  }

  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyCtSport.do";
    let wspCnslt = new FormData();
    let sendData = that.getQueryString();
    
    
    for(let key in sendData){
      wspCnslt.append(key,sendData[key]);
    }
    const keyName = "file";
    for(let idx=1; idx <= 5; idx++){
      let fileData = that.state.requestInfo["file"+idx];
      if(fileData){
        wspCnslt.append("file",fileData.files[0]);
      }
      
    }
    wspCnslt.append("owner", this.state.suyongaInfo.ownerNm);
//    const inputFile = that.state.requestInfo.file1;
//    wspCnslt.append("file1", inputFile.files[0]);
//    const inputFile2 = that.state.requestInfo.file2;
//    wspCnslt.append("file2", inputFile2.files[0]);
//    const inputFile3 = that.state.requestInfo.file3;
//    wspCnslt.append("file3", inputFile3.files[0]);
//    const inputFile4 = that.state.requestInfo.file4;
//    wspCnslt.append("file4", inputFile4.files[0]);
//    const inputFile5 = that.state.requestInfo.file5;
//    wspCnslt.append("file5", inputFile5.files[0]);
    fetchMultiPart(url, wspCnslt, function (error: any, data: any) {
      // 에러가 발생한 경우
      if (error) {
        citizenAlert(that.state.description.minwonNm+"이 정상적으로 처리되지 않았습니다.");
        return;
      }

      that.setState({
        ...that.state,
        isSubmitSuccessful: data.resultCd === '00' ? true : false,
        submitResult: data
      });

      cyberMinwon.setResult(that.state.description.minwonNm, that, 'getResultView');

    });
  }

  getQueryString() {
    const data = this.state.suyongaInfo;
    const data1 = this.state.applyInfo;
    const requestInfo = this.state.requestInfo;
    const statusInfo = this.state.statusInfo;
    
    const phoneArr = phonePattern.exec(data1.telno);
    const mobileArr = mobilePattern.exec(data1.hpno);
    
    const relReceiptNo = this.state.requestInfo.receiptNo;

//    const requestData = {
    const requestData : {[key:string]:string} = {
      'cvplRelation.relReceiptNo': relReceiptNo,
      // 신청 기본 정보
      'cvplInfo.cvpl.minwonCd': this.state.minwonCd,
      'cvplInfo.cvpl.mgrNo': data.mkey,
      // 신청 정보
      'buildingYear': requestInfo.buildingYear,
      'workTerm': requestInfo.workTerm,
      'planMoney': requestInfo.planMoney,
      // 수용가 정보
      'cvplInfo.cvplOwner.csOfficeCd': data.csOfficeCd,
      'cvplInfo.cvplOwner.mblckCd': data.mblckCd,
      'cvplInfo.cvplOwner.mblckCdNm': data.mblckCdNm,
      'cvplInfo.cvplOwner.sblckCd': data.sblckCd,
      'cvplInfo.cvplOwner.sblckCdNm': data.sblckCdNm,
      'cvplInfo.cvplOwner.ownerNm': data.suyongaName,
      'cvplInfo.cvplOwner.usrName': data.usrName,
      'cvplInfo.cvplOwner.idtCdSNm': data.idtCdSNm,
      'cvplInfo.cvplOwner.reqKbnNm': '',
      'cvplInfo.cvplProcnd.cyberUserKey': '',
      'cvplInfo.cvplProcnd.officeYn': 'N',

      // 수용자 주소 정보
      'cvplInfo.cvplAddr[0].cvplAdresTy': 'OWNER',
      'cvplInfo.cvplAddr[0].sido': data.csSido,
      'cvplInfo.cvplAddr[0].sigungu': data.csGuCdNm,
      'cvplInfo.cvplAddr[0].umd': data.csBdongCdNm,
      'cvplInfo.cvplAddr[0].hdongNm': data.csHdongCdNm,
      'cvplInfo.cvplAddr[0].dong': '',
      'cvplInfo.cvplAddr[0].doroCd': '',
      'cvplInfo.cvplAddr[0].doroNm': data.csRn,
      'cvplInfo.cvplAddr[0].dzipcode': '',            // 도로우편번호
      'cvplInfo.cvplAddr[0].bupd': data.csStdBdongCd,
      'cvplInfo.cvplAddr[0].bdMgrNum': '',            // 빌딩관리번호
      'cvplInfo.cvplAddr[0].bdBonNum': data.csBldBon,
      'cvplInfo.cvplAddr[0].bdBuNum': data.csBldBu,
      'cvplInfo.cvplAddr[0].bdnm': data.csBldNm,      // specAddr/csBldNm와 동일 특수주소(건물,아파트명)
      'cvplInfo.cvplAddr[0].bdDtNm': data.csEtcAddr,  //extraAdd/csEtcAddr와 동일 특수주소(건물,아파트명) 기타 입력
      'cvplInfo.cvplAddr[0].addr2': data.csAddr2,
      'cvplInfo.cvplAddr[0].zipcode': data.suyongaPostNumber,
      'cvplInfo.cvplAddr[0].fullDoroAddr': data.suyongaAddress,
      'cvplInfo.cvplAddr[0].addr1': data.csAddr1,
      'cvplInfo.cvplAddr[0].bunji': data.csBon,
      'cvplInfo.cvplAddr[0].ho': data.csBu,
      'cvplInfo.cvplAddr[0].extraAdd': data.csEtcAddr,
      'cvplInfo.cvplAddr[0].specAddr': data.csBldNm,
      'cvplInfo.cvplAddr[0].specDng': data.csBldDong,
      'cvplInfo.cvplAddr[0].specHo': data.csBldHo,
      'cvplInfo.cvplAddr[0].floors': data.csUgFloorNo,
    };
    return {
      ...this.state.parent.state.applicationPage.getApplyQueryString(),
      'cvplInfo.cvpl.minwonCd': this.state.minwonCd,
      ...requestData
    };
  }
  
  handleFileDownload(ord:number){
    fncFileDownload(ord);
  }

  getStatusString() {
    const statusInfo = this.state.statusInfo;

  }

  render() {
    const that = this;
//    that.getDescription();

    let template = `
      <!-- 민원안내 -->
      <div class="mw-box" id="desc">
        <div id="form-mw0" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw0');" class="on" title="닫기">
            <span class="i-06 txStrongColor">민원안내 및 처리절차</span></a>
          </div>
        </div><!-- // info-mw -->
      </div><!-- // mw-box -->     
      <!-- 신청내용 -->
      <div class="mw-box">
      <!-- 옥내급수관 진단 상담 신청 -->
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기">
        <span class="i-01">옥내급수관 진단 상담 정보</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul class="result-box">
              <li class="info-block sub-box">
                <div  style="margin-bottom: 15px;">
                  <div class="txStrong"></div>
                  <div class="display-block form-info form-info-box">
                    <ul> 
                      <li class="info-block">
                        <div class="txStrong">수용가 정보</div>
                        <p class="display-block form-info form-info-box">
                          <span class="mw-info-label">고객번호</span>
                          <span class="contents">${that.state.suyongaInfo.suyongaNumber}</span><br/>
                          <span class="mw-info-label">소유자</span>
                          <span class="contents">${maskingFnc.name(that.state.suyongaInfo.suyongaName,"*")}</span><br/>
                          <span class="mw-info-label">수용가주소</span>
                          <span class="contents">(${that.state.suyongaInfo.suyongaPostNumber}) ${that.state.suyongaInfo.suyongaAddress}</span><br/>
                        </p>
                        <div class="txStrong">신청 정보</div>
                        <p class="display-block form-info form-info-box">
                          <span class="mw-info-label">접수번호</span>
                          <span class="contents">${that.state.requestInfo.receiptNo}</span><br/>
                          <span class="mw-info-label">신청인</span>
                          <span class="contents">${maskingFnc.name(that.state.applyInfo.applyNm,"*")}</span><br/>
                          <span class="mw-info-label">연락처</span>
                          <span class="contents">${maskingFnc.telNo(that.state.applyInfo.telno, "*")} / ${maskingFnc.telNo(that.state.applyInfo.hpno, "*")}</span><br/>
                          <span class="mw-info-label">준공년도</span>
                          <span class="contents">${that.state.applyInfo.buildingYear}</span><br/>
                          <span class="mw-info-label">내용</span>
                          <span class="contents">${that.state.applyInfo.contents}</span><br/>
                        </p>
                      </li>
                    </ul>     
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div><!-- //form-mw-box -->
      </div><!-- //form-mw23 -->
      </div><!-- //mw-box --> 
      <div class="mw-box row">
      <!-- 신청내용2 : 준공년도 및 기타정보 -->
      <div id="form-mw22" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="showHideLayer('#form-mw22');" class="off" title="닫기"><span class="i-01">신청내용 : 준공년도 및 기타정보</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label for="buildingYear" class="input-label"><span class="form-req"><span class="sr-only">필수</span>준공년도</span></label>
                <input type="text" id="buildingYear" name="buildingYear" class="input-box input-w-2" title="준공년도" maxlength="4" placeholder="준공년도 입력"
                  value="${that.state.requestInfo.buildingYear}"
                  onkeyup="${that.state.path}.handleChangeBuildingYear(event)" 
                  onchange="${that.state.path}.handleChangeBuildingYear(event)"> 
              </li>
              <li><label for="workTerm" class="input-label"><span>공사범위</span></label>
                <select id="workTerm" name="workTerm" title="공사범위" class="input-box input-w-sel"
                  onchange="${that.state.path}.handleChangeWorkTerm(this)">
                </select>
              </li>
              <li>
                <label for="planMoney" class="input-label"><span class="form-req"><span class="sr-only">필수</span>공사금액</span></label>
                <input type="text" id="planMoney" class="input-box input-w-2" placeholder="공사예정금액 입력" maxlength="10"
                  value="${that.state.requestInfo.planMoney}"
                  onkeyup="${that.state.path}.handleChangePlanMoney(event)" 
                  onchange="${that.state.path}.handleChangePlanMoney(event)">
                </br></br>
              </li>
              <li>
                <label for="form-mw36-tx" class="input-label-1"><span>증빙서류를 제출해 주세요.</span></label>
              </li>
              <li class="addfile">
                <label for="file1" class="input-label"><span class="form-req"><span class="sr-only">필수</span>통장사본</span></label>
                <label for="file1" class="fileLabel">파일 선택</label>
                <input type="text" id="fileName1" name="fileName1" value="${that.state.requestInfo.fileName1}" placeholder="선택된 파일 없음" readonly >
                <input type="file" id="file1" name="file1" title="첨부파일" class="display-none"
                  onchange="${that.state.path}.handleChangeFile(event)">
                <a href="javascript:void(0);" class="btn btnSS" onclick="${that.state.path}.handleClickDeleteFile(this,1)"><span>삭제</span></a>
              </li>
              <li class="addfile">
                <label for="file2" class="input-label"><span class="form-req"><span class="sr-only">필수</span>견적서</span></label>
                <label for="file2" class="fileLabel">파일 선택</label>
                <input type="text" id="fileName2" name="fileName2" value="${that.state.requestInfo.fileName2}" placeholder="선택된 파일 없음" readonly >
                <input type="file" id="file2" name="file2" title="첨부파일" class="display-none"
                  onchange="${that.state.path}.handleChangeFile(event)">
                <a href="javascript:void(0);" class="btn btnSS" onclick="${that.state.path}.handleClickDeleteFile(this,2)"><span>삭제</span></a>
              </li>
              <li class="addfile">
                <label for="file3" class="input-label"><span class="form-req"><span class="sr-only">필수</span>신청서</span></label>
                <label for="file3" class="fileLabel">파일 선택</label>
                <input type="text" id="fileName3" name="fileName3" value="${that.state.requestInfo.fileName3}" placeholder="선택된 파일 없음" readonly >
                <input type="file" id="file3" name="file3" title="첨부파일" class="display-none"
                  onchange="${that.state.path}.handleChangeFile(event)">
                <a href="javascript:void(0);" class="btn btnSS" onclick="${that.state.path}.handleClickDeleteFile(this,3)"><span>삭제</span></a>
              </li>
              <li class="addfile">
                <label for="file4" class="input-label"><span class="form-req"><span class="sr-only">필수</span>설계서</span></label>
                <label for="file4" class="fileLabel">파일 선택</label>
                <input type="text" id="fileName4" name="fileName4" value="${that.state.requestInfo.fileName4}" placeholder="선택된 파일 없음" readonly >
                <input type="file" id="file4" name="file4" title="첨부파일" class="display-none"
                  onchange="${that.state.path}.handleChangeFile(event)">
                <a href="javascript:void(0);" class="btn btnSS" onclick="${that.state.path}.handleClickDeleteFile(this,4)"><span>삭제</span></a>
              </li>
              <li class="addfile">
                <label for="file5" class="input-label"><span class="form-req"><span class="sr-only">필수</span>청렴이행서약서</span></label>
                <label for="file5" class="fileLabel">파일 선택</label>
                <input type="text" id="fileName5" name="fileName5" value="${that.state.requestInfo.fileName5}" placeholder="선택된 파일 없음" readonly >
                <input type="file" id="file5" name="file5" title="첨부파일" class="display-none"
                  onchange="${that.state.path}.handleChangeFile(event)">
                <a href="javascript:void(0);" class="btn btnSS" onclick="${that.state.path}.handleClickDeleteFile(this,5)"><span>삭제</span></a>
              </li>
              <li>
                <p class="pre-star tip-blue">
                  등록 가능 파일 : 이미지(gif, jpg 등), 문서(pdf, hwp*, doc*, ppt*) (최대 파일 크기: ${gVariables['fileUploadSize']} MB)
                </p>
                  <!--등록 가능 파일 : ${gVariables['imgFileUploadPosible'].toString()} (최대 파일 크기: ${gVariables['fileUploadSize']} MB)-->
              </li>
              <li class="download">
                <label class="input-label-1"><span>양식을 다운로드받으세요.</span></label>
                <p class="form-info-box-g">
                  <a href="javascript:void(0);" onClick="${that.state.path}.handleFileDownload(61);" class="btn btnSS btnTypeD m-br"><span>신청서 및 표준견적서</span></a>
                  <a href="javascript:void(0);" onClick="${that.state.path}.handleFileDownload(62);" class="btn btnSS btnTypeD m-br"><span>청렴이행서약서</span></a>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div><!-- //form-mw22 -->
      </div><!-- //mw-box -->
    `;

    document.getElementById('minwonRoot')!.innerHTML = template;

    this.renderDescription(document.getElementById('desc'));

    this.afterRender();
  }

  // 기본 설정값은 여기에서 랜더링 해야 한다.
  afterRender() {
    const that = this;
    fncSetComboByCodeList("workTerm", that.state.statusInfo.comboWorkTerm);
    $("#workTerm").val(that.state.requestInfo.workTerm ? that.state.requestInfo.workTerm : $("#workTerm option:selected").val())
                   .trigger("change");
    let receiptNo = this.state.parent.state.applicationPage.getAddData().receiptNo;
    if(that.initSearch){
      that.handleSearchA12Data(receiptNo);
    }
  }

  renderDescription(target: any) {
    const that = this;

    let desc = `
        <div id="form-mw0" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw0');" class="on" title="펼치기">
            <span class="i-06 txStrongColor">민원안내 및 처리절차</span></a>
          </div>
          <div class="form-mw-box display-none row">
            <div class="info-mw row">
    `;
    if(that.state.description.minwonHow){
      desc += `
                <div class="tit-mw-h5 row"><span>신청방법</span></div>
                <p>${that.state.description.minwonHow}</p>
      `;
    }
    if(that.state.description.minwonReqstDc){
      desc += `
                <div class="tit-mw-h5 row"><span>처리기간</span></div>
                <p>${that.state.description.minwonReqstDc}</p>
      `;
    }
    if(that.state.description.minwonGde){
      desc += `
                <div class="tit-mw-h5 row"><span>처리부서</span></div>
                <p>${that.state.description.minwonGde}</p>
      `;
    }
    if(that.state.description.presentnPapers){
      desc += `
                <div class="tit-mw-h5 row"><span>신청서류</span></div>
                <p>${that.state.description.presentnPapers}</p>
      `;
    }
    if(that.state.description.mtinspGde){
      desc += `
                <div class="tit-mw-h5 row"><span>관련법규</span></div>
                <p>${that.state.description.mtinspGde}</p>
      `;
    }
      desc += `
              <div class="tit-mw-h5 row"><span>지원대상</span></div>
              <div class="info-mw-list">
                <ul>
                  <li style="margin-left:0px;">노후 옥내 급수관(아연도강관)을 갱생 또는 교체하는 건물로서  <br />
                           - 사회복지시설 등 소외계층 이용건물 <br />
                           - 연면적 165㎡ 이하의 주거용 건물. 단, 공동주택은 전용면적 85㎡ 이하
                  </li>
                </ul>
              </div>
              <div class="tit-mw-h5 row"><span>지원제외대상</span></div>
              <div class="info-mw-list">
                <ul>
                  <li style="margin-left:0px;">뉴타운, 재개발, 재건축, 리모델링 사업승인 건축물</li>
                </ul>
              </div>
              <div class="tit-mw-h5 row"><span>지원우선순위</span></div>
              <div class="info-mw-list">
                <ul>
                  <li style="margin-left:0px;">① 국민지초생활보장 수급대상자 및 소외계층 이용건물</li>
                  <li style="margin-left:0px;">② 전용면적 60㎡ 미만의 공동주택, 100㎡ 미만의 단독주택</li>
                  <li style="margin-left:0px;">③ 접수순</li>
                </ul>
              </div>
              <div class="tit-mw-h5 row"><span>공사비지원금액</span></div>
              <div class="info-mw-list">
                <ul>
                  <li style="margin-left:0px;">단독주택 : ① 교체 - 연면적 165㎡ 이하(1가구) ② 갱생 - 최대 150만원(건물당)</li>
                  <li style="margin-left:0px;">다가구주택 : ① 교체 -  연면적 330㎡ 이하(2가구 이상)  ② 갱생 - 최대 200만원(건물당)</li>
                  <li style="margin-left:0px;">공동주택 : ① 교체 - 전용면적 85㎡ 이하 ② 갱생 - 최대 80만원(가구당) / ※세대 60만원, 공용 20만원</li>
                  <li style="margin-left:0px;">국민기초생활보장 수급대상자/소외계층 이용건물 : ① 교체 - ② 갱생 - 개량 공사비 전액</li>
                </ul>
              </div>
      `;
    if(that.state.description.minwonProcedure){
      desc += `
                <div class="tit-mw-h5 row"><span>처리절차</span></div>
                - ${that.state.description.minwonProcedure}<br>
      `;
    }
      desc += `
              <div class="tit-mw-h5 row"><span>민원편람</span></div>
              <a href="${that.state.description.minwonGudUrl}" target="_blank" class="txBlue" style="display:inline-block;float:right">민원편람 바로가기</a>
            </div>
          </div>
        </div><!-- // info-mw -->
      `;
    target.innerHTML = desc;
  }
}