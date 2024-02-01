import CyberMinwon from '../infra/CyberMinwon';
import JusoSearchPanel from '../components/JusoSearchPanel';
import { fetch, fetchMultiPart } from './../util/unity_resource';
import { showHideInfo, hideElement, applyMinwonCheck, citizenAlert, citizen_alert, citizenConfirm, 
         saupsoInfo, maskingFnc, numberWithCommas, phonePattern, mobilePattern, clearObject } from './../util/uiux-common';
import InfoPanel from "./../components/InfoPanel";
import { SuyongaInfoT, BillInfo, AddrInfoKey} from './B18Interface';
import SuyongaInfo from '../components/SuyongaInfo';

declare var document: any;
declare var gContextUrl: string;
declare var alert_msg: (msg: string) => void;
declare var fncSetComboByCodeList: (param1: string, param2: string) => void;
declare var fncCutByByte: (str: string, maxByte: number) => string;
declare var getDoroAddrFromOwner: (prefix: string, body: any) => string;
declare var fncTrim: (str: string) => string;
declare var document: any;
declare var $: any;
declare var cyberMinwon: CyberMinwon;

type AddrChangeVO = {[key : string]: string, chgDt: string, chungNm: string, mgrNo: string, bfAddr: string, bfDoroAddr: string,mblckCd: string, mblckCdNm: string, sblckCd: string, sblckCdNm: string};
const MAX_LEN: number = 20;

export default class B18DetailPage{
//  jusoTargetSuyong: string;
  jusoTargetBill: string;
//  jusoSearchPanelSuyong: JusoSearchPanel;
  jusoSearchPanel: JusoSearchPanel;
  addrChgList: Array<[SuyongaInfoT,BillInfo]>;
  addrChangeList: Array<AddrChangeVO>;
  suyongaInfoPanel: InfoPanel;
  curIdx: number;
  today: string;
  state: {
    minwonCd: string,
    parent: any,
    isSubmitSuccessful: boolean,
    submitResult: any,
    viewRequestInfo: any,
    jusosearchShowSuyong: boolean,
    jusosearchShowBill: boolean,
    path: string,
    statusInfo: any,
    suyongaInfo : SuyongaInfoT,
    viewSuyongaInfo: any,
    searchYN: boolean,
    suyongaInfoArray : Array<SuyongaInfoT>,
    billInfo: BillInfo,
    billInfoArray: Array<BillInfo>,
    description: any,
    paymentInfo: {
      paymentChk: boolean,
      paymentCnt: number
    }
  };
  
  constructor(parent: any, minwonCd: string) {
    this.today = $("#applyDt").val().substring(0,10).replace(/\./g,"-");
    this.state = {
      minwonCd,
      parent,
      isSubmitSuccessful: false,
      submitResult: {},
      viewRequestInfo: {},
      jusosearchShowSuyong: false,
      jusosearchShowBill: false,
      path: 'cyberMinwon.state.currentModule.state.currentPage',
      statusInfo: {},
      suyongaInfo: {
        cvplAdresTy : 'OWNER',
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
      viewSuyongaInfo: {
        viewName:['', '사용자/소유자'],
        /*
        viewUserName: ['', '사용자'],
        viewOwnerName: ['', '소유자'],
        viewOwnerNumber: ['', '수용가번호'],
        */
        viewItemNumber: ['', '기물번호'],
        viewDoroJuso: ['', '도로명주소'],
        viewPostNumberJibeunJuso: ['', '지번주소'],
        viewBusinessTypeDiameter: ['', '업종/계량기'],
      },
      searchYN: false,
      suyongaInfoArray: [],
      billInfo: {
        chgDt: '', // 주소변경일자
        chungNm: '', // 청구자
        billPostNumber: '', // 우편번호
        billAddress: '', // 도로명주소
        billDetailAddress: '', // 상세주소
        billDisplayAddress: '', //화면 표시용 주소
        cvplAdresTy : 'BILL',
        //주소
        sido: '',
        sigungu: '',
        umd: '',
        hdongNm: '',
        dong: '',
        doroCd: '',
        doroNm: '',
        dzipcode: '',
        bupd: '',
        bdMgrNum: '0',
        bdBonNum: '0',
        bdBuNum: '0',
        bdnm: '',
        bdDtNm: '',
        addr2: '',
        zipcode: '',
        fullDoroAddr: '', //applyAddress
        addr1: '',
        bunji: '0',
        ho: '0',
        extraAdd: '',
        specAddr: '',
        specDng: '',
        specHo: '',
        floors: '',
        mblckCd: '',
        mblckCdNm: '',
        sblckCd: '',
        sblckCdNm: '',
      },
      billInfoArray: [],
      description: {},
      paymentInfo : {
        paymentChk: false,
        paymentCnt: 0,
      }
    };
    this.curIdx = 0;
    this.addrChangeList = new Array();
    this.addrChgList = new Array();
    this.jusoTargetBill = 'jusosearchB18Bill';
    this.jusoSearchPanel = new JusoSearchPanel(this, this.state.path, this.jusoTargetBill, this.handleSelectJuso);
    this.suyongaInfoPanel = new InfoPanel('',
      this.state.parent, this, 'getSuyongaView');

    this.setInitValue();
  }
  
  // 초기값 설정
  setInitValue() {
    const that = this;
    that.setState({
      ...that.state,
      requestInfo: {
        smsAllowYn: 'N',
        tellAllowYn: 'N',
        cellYn: 'N',
        telYn: 'N'
      },
      viewSuyongaInfo: {
        viewName:['', '사용자/소유자'],
        /*
        viewUserName: ['', '사용자'],
        viewOwnerName: ['', '소유자'],
        viewOwnerNumber: ['', '수용가번호'],
        */
        viewItemNumber: ['', '기물번호'],
        viewDoroJuso: ['', '도로명주소'],
        viewPostNumberJibeunJuso: ['', '지번주소'],
        viewBusinessTypeDiameter: ['', '업종/계량기'],
        viewReqDoroJuso: ['', '현재청구지도로명주소'],
        viewReqJibeunJuso: ['', '현재청구지주소'],
      },
      searchYN: false,
      suyongaInfoArray: [],
      billInfoArray: [],
    });
    this.reSetSuyongInfo();
    this.resetBillInfo();
    this.addrChangeList = new Array();
    this.addrChgList = new Array();
  }
  
  // 민원안내, 절차 정보를 서버에 요청한다. 
  getDescription(data: any) {
    const that = this;
    that.setState({
      ...that.state,
      description: data 
    });
  }
  
  // InfoPanel 데이터 설정
  getSuyongaView() {
    const index = this.curIdx === -1 ? 0 : this.curIdx;
    if(this.state.searchYN){
      return {
        noinfo: {
          ...this.state.viewSuyongaInfo,
          title: '수용가 정보'
        }
      }
    }else{
      
      const suyongaInfo = this.addrChgList[index][0];
      return {
        noinfo: {
          title: '수용가 정보',
           viewName:[maskingFnc.name(suyongaInfo.usrName, "*")+"/"+maskingFnc.name(suyongaInfo.ownerNm, "*"), '사용자/소유자'],
          /*
          viewUserName: [maskingFnc.name(suyongaInfo.usrName, "*"), '사용자'],
          viewOwnerName: [maskingFnc.name(suyongaInfo.ownerNm, "*"), '소유자'],
          viewOwnerNumber: [suyongaInfo.mkey, '수용가번호'],
          */
          viewItemNumber: [suyongaInfo.vesslNo, '기물번호'],
          viewDoroJuso: [suyongaInfo.suyongaAddress, '도로명주소'],
          viewPostNumberJibeunJuso: [suyongaInfo.zip1 + suyongaInfo.zip2 + " " +
              fncTrim(suyongaInfo['csSido']) + " " +
              fncTrim(suyongaInfo['csAddr1']) + " " +
              fncTrim(suyongaInfo['csAddr2']), '지번주소'],
          viewBusinessTypeDiameter: [suyongaInfo.idtCdSNm + '/' + suyongaInfo.cbCdNm, '업종/계량기'],
          viewReqDoroJuso: [getDoroAddrFromOwner('req', suyongaInfo), '현재청구지주소'],
          viewReqJibeunJuso: [`${fncTrim(suyongaInfo['reqSido'])} ${fncTrim(suyongaInfo['reqAddr1'])} ${fncTrim(suyongaInfo['reqAddr2'])}`
            ,'현재청구지주소']
        }
      }
    }
  }
  
  // InfoPanel 데이터 설정
  getViewInfo() {
    const that = this;
    let infoData: any = {};

    if(that.addrChangeList.length > 0){
      const addrChangeLists = that.addrChgList;
      for(let idx in addrChangeLists){
        infoData['suyongBillInfo'+(parseInt(idx)+1)] = {
          title: '청구지 변경 신청 내역'+(parseInt(idx)+1),
          mkey: [addrChangeLists[idx][0].mkey,'고객번호'],
          suyongInfo: [addrChangeLists[idx][0].suyongaAddress,'수용가 주소'],
          chungNm: [maskingFnc.name(addrChangeLists[idx][1].chungNm, "*"),'청구자명'],
          billInfo: [addrChangeLists[idx][1].billDisplayAddress
          ,'신청구지 주소']
        }
      }
    }
    return infoData;
  }
  
  // 결과 뷰를 세팅하는 함수. 여기서 반환된 결과가 ResultPage에 표시된다.
  getResultView() {
    const infoData: any = {};
    const applyNm = this.state.parent.state.applicationPage.getSuyongaQueryString()['cvplInfo.cvpl.applyNm'];
    const applyDt = $("#applyDt").val();
    const resultData = this.state.submitResult;
    const resultList = resultData.errorMsg.split(',');
    // 신청 실패 화면
    if (!this.state.isSubmitSuccessful) {
      infoData['noinfo'] = {
//        title: this.state.description.minwonNm+' 결과',
        width: "150px",
        receipt_no : [resultData.data.receiptNo ? resultData.data.receiptNo : '-', '접수번호'], 
        applyNm: [maskingFnc.name(applyNm, "*"), '신청인'],
        applyDt: [resultData.data.applyDt?resultData.data.applyDt:applyDt, '신청일시'],
        desc: [`[${resultList[1]}]로 비정상 처리 되었습니다.<br>아래 수도사업소 또는 서울아리수본부에 문의해 주십시오.`, '신청결과'],
//        cause: [resultData.errorMsg,'사유']
      }
    // 성공
    } else {
      infoData['noinfo'] = {
//        title:  this.state.description.minwonNm+' 결과',
        width: "150px",
        receipt_no : [resultData.data.receiptNo, '접수번호'],
        applyNm: [maskingFnc.name(applyNm, "*"), '신청인'],
        applyDt: [resultData.data.applyDt, '신청일시'],
        desc: ['정상적으로 신청되었습니다.', '신청결과']
      }
    }
    
    return infoData;
  }

  setState(nextState: any) {
    this.state = nextState;
  }

  setEventListeners() {
    // 수용가 검색 버튼 연동
//    document.getElementById('suyongaSearch').addEventListener('click', (e: any) => {
//      e.preventDefault();
//      if(!this.hadleDupSuyongNumber($("#owner_mkey").val())){
//        return false;
//      }else{
//        this.fncSearchCustomer();
//      }
//
//    });
  }
  
  hadleSuyongaSearch(e: any){
    e.preventDefault();
    if(!this.hadleDupSuyongNumber($("#owner_mkey").val())){
      return false;
    }else{
      this.fncSearchCustomer();
    }
  }
  
  //수용가 변경 버튼 함수
  hadleSuyongaModify(e: any){
    //const that = this;
    clearObject(this.state.suyongaInfo, ['suyongaName','suyongaNumber','owner_mkey','owner_ownerNm']);
    this.setState({
      ...this.state,
      searchYN: false
    })
    this.suyongRender();
  }
  
  hadleDupSuyongNumber(mkey: string) {
    const that = this;
    if(that.addrChangeList.length >= 1){
      let result = true;
      for(const item of that.addrChangeList){
        if(item.mgrNo === mkey){
          citizenAlert("중복된 수용가 번호 입니다.");
          $("#owner_mkey").val("");
          $("#owner_ownerNm").val("");
          $("#owner_mkey").focus();
          result = false;
        }
      }
      return result;
    }else {
      return true;
    }
  }

  // 입력사항 검증 로직
  verify() {
    if(this.addrChgList.length ==  0){
      citizenAlert("청구지 변경 입력 내역이 없습니다.");
      return false;
    }

    return true;
  }
  
  // 수용가 검색 조회시 0을 앞에 삽입한다.
  zeroFill(number: number, width: number) {
    width -= number.toString().length;
    if (width > 0) {
      return new Array(width + (/\./.test(String(number)) ? 2 : 1)).join('0') + number;
    }
    return number + ""; // always return a string
  }
  
  // 수용가 번호 연동
  handleSuyongaNumber(e: any) {
    this.setState({
      ...this.state,
      suyongaInfo: {
        ...this.state.suyongaInfo,
        suyongaNumber: e.target.value.replace(/[^0-9]/g,"").substring(0, 9)
      }
    });
    e.target.value = this.state.suyongaInfo.suyongaNumber;
  }

  // 수용가 이름 연동
  handleSuyongaName(e: any) {
    this.setState({
      ...this.state,
      suyongaInfo: {
        ...this.state.suyongaInfo,
        suyongaName: e.target.value.substring(0, 50)
      },
    });
    e.target.value = this.state.suyongaInfo.suyongaName.substring(0, 50);
  }
  
  //체납정보 확인 체크 연동
  handlePaymentChk(e: any){
    if(e.target.checked){
      this.state.paymentInfo.paymentChk = true;
    } else {
      this.state.paymentInfo.paymentChk = false;
    }
  }

  // 수용가 조회를 클릭했을 때 실행
  fncSearchCustomer() {
    // 콜백함수를 위해 context binding이 필요하다.
    const that = this;
    if (!this.state.suyongaInfo.suyongaName) {
      citizenAlert('수용가를 입력해 주세요');
      $("#owner_ownerNm").select();
      return false;
    }

    if (!this.state.suyongaInfo.suyongaNumber) {
      citizenAlert('고객번호를 정확히 입력해 주세요');
      $("#suyongaNumber").select();
      return false;
    }
    var paddedNumber = this.zeroFill(parseInt(this.state.suyongaInfo.suyongaNumber), 9);
    const minwonCd = cyberMinwon.state.unityMinwon.state.minwonCd;

    var url = gContextUrl + "/citizen/common/listOwnerInqireByMgrNo.do";
    var queryString = "mkey=" + paddedNumber + "&minwonCd=" + minwonCd;

    // 수용가 데이터를 조회해 온다. arrow function을 지원하지 않기 때문에 that을 사용
    fetch('GET', url, queryString, function (error: any, data: any) {
      // 에러가 발생한 경우
      if (error) {
        citizenAlert("고객번호와 수용가명을 다시 확인하시고 검색해 주세요.");
        return;
      }

      if (data.result.status === 'FAILURE') {
        // 나중에 슬라이드 alert으로 변경
        citizenAlert("고객번호와 수용가명을 다시 확인하시고 검색해 주세요.");
        that.setState({
          ...that.state,
          searchYN: false,
          suyongaInfo: {
            suyongaNumber: that.state.suyongaInfo.suyongaNumber,
            suyongaName: that.state.suyongaInfo.suyongaName
          }
        });

        that.render();
        return;
      }

      const suyongaInfo = data.business.bodyVO
      let inputOwnerNm = fncTrim($("#owner_ownerNm").val());
//      if(inputOwnerNm !== fncTrim(suyongaInfo.ownerNm) && inputOwnerNm !== fncTrim(suyongaInfo.usrName)){
//        citizenAlert("고객번호 또는 수용가명이 정확하지 않거나 민원신청을 할 수 없는 수용가입니다.\n\n확인 후 다시 입력하시거나 \n관할 수도사업소 또는 다산콜(02-120)으로 문의바랍니다.");
//        citizen_alert("고객번호 또는 수용가명이 정확하지 않거나 민원신청을 할 수 없는 수용가입니다.\n\n확인 후 다시 입력하시거나 \n관할 수도사업소 또는 다산콜(02-120)으로 문의바랍니다.");
//        $("#owner_ownerNm").focus();
//        return false;
//      }
      //중복 신청 체크
      url = "/basic/checkDuplicateMinwon.do";
      queryString = "mgrNo=" + paddedNumber + "&minwonCd=" + minwonCd;
      fetch('GET', url, queryString, function (error: any, data: any) {
        // 에러가 발생한 경우
        if (error) {
          citizenAlert("서버가 응답하지 않습니다. 잠시 후 다시 조회해 주세요.");
          $("#suyongaSearch").prop('disabled', false);
          return;
        }
  
        if (data > 0) {
          citizenAlert('동일 수용가로 처리 중인 민원이 있습니다. 수용가(고객번호)를 확인해 주세요.');
          $("#owner_mkey").focus();
          $("#suyongaSearch").prop('disabled', false);
          return;
        }else{
          that.setSuyongaInfo(suyongaInfo, minwonCd);
        }
      });
    });
  }
  
  setSuyongaInfo(suyongaInfo: any, minwonCd: string){
    const that = this;
    //수용가 조회 정보로 신청 제한 확인
    if (!applyMinwonCheck(minwonCd, suyongaInfo)) {
      //owner_mkey
      $("#owner_mkey").focus();
      $("#suyongaSearch").prop('disabled', false);
      return false;
    }
    
    that.setState({
      ...that.state,
      searchYN: true,
      suyongaInfo: {
        cvplAdresTy : 'OWNER',
        suyongaNumber: suyongaInfo.mkey,
        suyongaName: suyongaInfo.usrName,
        suyongaPostNumber: suyongaInfo.zip1 + suyongaInfo.zip2,
        suyongaAddress: getDoroAddrFromOwner('cs', suyongaInfo),
        suyongaDetailAddress: '',
        suyongaNameBusinessType: suyongaInfo.idtCdSNm,
        mkey: suyongaInfo.mkey,
        csNo: suyongaInfo.csNo,
        csOfficeCd: suyongaInfo.csOfficeCd,
        ownerNm: suyongaInfo.ownerNm,
        usrName: suyongaInfo.usrName,
        mtrLoc: suyongaInfo.mtrLoc,
        zip1: suyongaInfo.zip1,
        zip2: suyongaInfo.zip2,
        csAddr1: suyongaInfo.csSido.trim()+ " " + suyongaInfo.csAddr1.trim(),
        csAddr2: suyongaInfo.csAddr2,
        usrTel: suyongaInfo.usrTel,
        hshldCnt: suyongaInfo.hshldCnt,
        idtCdS: suyongaInfo.idtCdS,
        idtCdSNm: suyongaInfo.idtCdSNm,
        cbCd: suyongaInfo.cbCd,
        cbCdNm: suyongaInfo.cbCdNm.split("mm")[0],
        tapNo: suyongaInfo.tapNo,
        vesslNo: suyongaInfo.vesslNo,
        preSealYear: suyongaInfo.preSealYear,
        lipipeCbCd: suyongaInfo.lipipeCbCd,
        gcYy: suyongaInfo.gcYy,
        gcMm: suyongaInfo.gcMm,
        gcDd: suyongaInfo.gcDd,
        idtCdH: suyongaInfo.idtCdH,
        idtCdHNm: suyongaInfo.idtCdHNm,
        gcThsmmPointer: suyongaInfo.gcThsmmPointer,
        csGuCd: suyongaInfo.csGuCd,
        csHdongCd: suyongaInfo.csHdongCd,
        csBdongCd: suyongaInfo.csBdongCd,
        usrIdNo: suyongaInfo.usrIdNo,
        autoPayFlag: suyongaInfo.autoPayFlag,
        autoPayFlagNm: suyongaInfo.autoPayFlagNm,
        ugOpenDay: suyongaInfo.ugOpenDay,
        recipterHshldCnt: suyongaInfo.recipterHshldCnt,
        cgExceptAdjRsnCd: suyongaInfo.cgExceptAdjRsnCd,
        oldExemptCd: suyongaInfo.oldExemptCd,
        hRdCd: suyongaInfo.hRdCd,
        hRdrate: suyongaInfo.hRdrate,
        wAlotmRdCd: suyongaInfo.wAlotmRdCd,
        wAlotmRdrate: suyongaInfo.wAlotmRdrate,
        tapStatusCd: suyongaInfo.tapStatusCd,
        ugStatusCd: suyongaInfo.ugStatusCd,
        swaterdspsMth: suyongaInfo.swaterdspsMth,
        docSealNo: suyongaInfo.docSealNo,
        area: suyongaInfo.area,
        tapOpenDay: suyongaInfo.tapOpenDay,
        csSido: suyongaInfo.csSido,
        csGuCdNm: suyongaInfo.csGuCdNm,
        csRn: suyongaInfo.csRn,
        csBldBon: suyongaInfo.csBldBon,
        csBldBu: suyongaInfo.csBldBu,
        csSan: suyongaInfo.csSan,
        csBon: suyongaInfo.csBon,
        csBu: suyongaInfo.csBu,
        csBldDong: suyongaInfo.csBldDong,
        csBldHo: suyongaInfo.csBldHo,
        csUgFlag: suyongaInfo.csUgFlag,
        csUgFloorNo: suyongaInfo.csUgFloorNo,
        csEtcAddr: suyongaInfo.csEtcAddr,
        csBldNm: suyongaInfo.csBldNm,
        csBdongCdNm: suyongaInfo.csBdongCdNm,
        reqAddr1: suyongaInfo.reqAddr1,
        reqAddr2: suyongaInfo.reqAddr2,
        reqSido: suyongaInfo.reqSido,
        reqGuCdNm: suyongaInfo.reqGuCdNm,
        reqRn: suyongaInfo.reqRn,
        reqBldBon: suyongaInfo.reqBldBon,
        reqBldBu: suyongaInfo.reqBldBu,
        reqSan: suyongaInfo.reqSan,
        reqBon: suyongaInfo.reqBon,
        reqBu: suyongaInfo.reqBu,
        reqBldDong: suyongaInfo.reqBldDong,
        reqBldHo: suyongaInfo.reqBldHo,
        reqUgFlag: suyongaInfo.reqUgFlag,
        reqUgFloorNo: suyongaInfo.reqUgFloorNo,
        reqEtcAddr: suyongaInfo.reqEtcAddr,
        reqBldNm: suyongaInfo.reqBldNm,
        reqBdongCdNm: suyongaInfo.reqBdongCdNm,
        vsgGbn: suyongaInfo.vsgGbn,
        gtnSeCd: suyongaInfo.gtnSeCd,
        csStdBdongCd: suyongaInfo.csStdBdongCd,
        csApthouseCd: suyongaInfo.csApthouseCd,
        reqStdBdongCd: suyongaInfo.reqStdBdongCd,
        premmPointer: suyongaInfo.premmPointer,
        csJCnt: suyongaInfo.csJCnt,
        csHdongCdNm: suyongaInfo.csHdongCdNm,
        mblckCd: suyongaInfo.mblckCd,
        mblckCdNm: suyongaInfo.mblckCdNm,
        sblckCd: suyongaInfo.sblckCd,
        sblckCdNm: suyongaInfo.sblckCdNm,
        ctcharCd: suyongaInfo.ctcharCd,
        ctcharCdNm: suyongaInfo.ctcharCdNm,
        srvrsvCd: suyongaInfo.srvrsvCd,
        srvrsvCdNm: suyongaInfo.srvrsvCdNm,
        mtrTypeCd: suyongaInfo.mtrTypeCd,
        mtrTypeCdNm: suyongaInfo.mtrTypeCdNm,
        tapLocCd: suyongaInfo.tapLocCd,
        tapLocCdNm: suyongaInfo.tapLocCdNm,
        tapLocDetailCd: suyongaInfo.tapLocDetailCd,
        tapLocDetailCdNm: suyongaInfo.tapLocDetailCdNm,
        mpcMtrqlt: suyongaInfo.mpcMtrqlt,
        mpcStatus: suyongaInfo.mpcStatus,
        mrnrBxStatus: suyongaInfo.mrnrBxStatus,
        wplmStatus: suyongaInfo.wplmStatus,
        wpMtrqlt: suyongaInfo.wpMtrqlt
      },
      
      viewSuyongaInfo: {
         viewName:[maskingFnc.name(suyongaInfo.usrName, "*")+'/'+maskingFnc.name(suyongaInfo.ownerNm, "*"), '사용자/소유자'],
        /*
        viewUserName: [maskingFnc.name(suyongaInfo.usrName, "*"), '사용자'],
        viewOwnerName: [maskingFnc.name(suyongaInfo.ownerNm, "*"), '소유자'],
        viewOwnerNumber: [suyongaInfo.mkey, '수용가번호'],
        */
        viewItemNumber: [suyongaInfo.vesslNo, '기물번호'],
        viewDoroJuso: [getDoroAddrFromOwner('cs', suyongaInfo), '도로명주소'],
        viewPostNumberJibeunJuso: [suyongaInfo.zip1 + suyongaInfo.zip2 + " " +
          fncTrim(suyongaInfo['csSido']) + " " +
          fncTrim(suyongaInfo['csAddr1']) + " " +
          fncTrim(suyongaInfo['csAddr2']), '지번주소'],
        viewBusinessTypeDiameter: [suyongaInfo.idtCdSNm + '/' + suyongaInfo.cbCdNm, '업종/계량기'],
        viewReqDoroJuso: [getDoroAddrFromOwner('req', suyongaInfo), '현재청구지도로명주소'],
        viewReqJibeunJuso: [`${fncTrim(suyongaInfo['reqAddr1'])} ${fncTrim(suyongaInfo['reqAddr2'])}`
          ,'현재청구지지번주소']
      }
    });

    that.render();
  }
  
  handleSelectJuso = (jusoInfo: any, detailAddress: string, action?: string) => {    
    this.setState({      
      ...this.state,      
      billInfo: {        
        ...this.state.billInfo,      
        billPostNumber: jusoInfo.zipNo,//우편번호
        billAddress: (jusoInfo.siNm +" "+jusoInfo.sggNm+" "+jusoInfo.emdNm).trim(),//지역명
        zipcode: jusoInfo.zipNo,//우편번호        
        addr1: (jusoInfo.siNm +" "+jusoInfo.sggNm+" "+jusoInfo.emdNm).trim(),//지역명        
        addr2: '',//상세주소        
        fullDoroAddr: jusoInfo.roadAddr,        
        sido: jusoInfo.siNm,//시도명        
        sigungu: jusoInfo.sggNm,//시군구명        
        umd: jusoInfo.emdNm,//법정읍면동명        
        hdongNm: '',//행정동 명(java단에서 어차피 만들어줌)        
        dong: jusoInfo.emdNm,//행정읍동명 같지만 값이 없어 umd와 같은 값을 준다        
        doroCd: jusoInfo.rnMgtSn,//도로명코드        
        doroNm: jusoInfo.rn,//도로명        
        //dzipcode: '',        
        bupd: jusoInfo.admCd,//법정동코드        
        bdMgrNum: jusoInfo.bdMgtSn,//건물관리번호 (java단에서 어차피 만들어줌)        
        bdBonNum: jusoInfo.buldMnnm,//건물본번        
        bdBuNum: jusoInfo.buldSlno,//건물부번        
        bdnm: jusoInfo.bdNm,//건물명        
        bdDtNm: '',//상세건물명                        
        bunji: jusoInfo.lnbrMnnm,//번지        
        ho: jusoInfo.lnbrSlno,//호        
        extraAdd: '',        
        specAddr: '',        
        specDng: '',        
        specHo: '',        
        floors: '',
        billDetailAddress : detailAddress,//상세주소
        billDisplayAddress : (jusoInfo.roadAddr+" "+detailAddress).trim()//화면 표출용 주소
      }    
    });
    
    document.getElementById('billPostNumber').value = jusoInfo.zipNo;
    document.getElementById('billDisplayAddress').innerHTML = jusoInfo.roadAddr+" "+detailAddress
    document.getElementById('billDisplayAddress').parentNode.style.display = 'none';
    if(action !== "clear"){
      document.getElementById('billDisplayAddress').parentNode.style.display = 'block';
      this.toggleJusoSearch();
    }     
//    const $zip: HTMLInputElement = document.getElementById('billPostNumber') as HTMLInputElement;    
//    const $addr: HTMLInputElement = document.getElementById('billAddress') as HTMLInputElement;     
//    $zip.value = jusoInfo.zipNo    
//    $addr.value = jusoInfo.roadAddr    
//    $("#billDetailAddress").focus();  
    
    
  }
  
  disableJusoSearch() {
    hideElement('#' + this.jusoTargetBill);
    this.setState({
      ...this.state,
      jusosearchShow: false,
    });
  }
  
  toggleJusoSearch() {
    showHideInfo('#' + this.jusoTargetBill);
    this.setState({
      ...this.state,
      jusosearchShow: !this.state.jusosearchShowBill
    });
    clearObject(this.jusoSearchPanel.state.jusoResult);
    this.jusoSearchPanel.render();
    //!document.getElementById(this.jusoTargetBill+"doro") ? this.jusoSearchPanel.render() : "";
    $("#jusosearchB18Billdoro > input").focus();
  }

  handleBillDetailAddress(e: any) {
    this.setState({
      ...this.state,
      billInfo: {
        ...this.state.billInfo,
        billDetailAddress: e.target.value.substring(0, 50)
      }
    });
    e.target.value = this.state.billInfo.billDetailAddress.substring(0, 50);
  }
  
  // 주소변경일자
  handleChangeChgDt(e: any){
    this.setState({
      ...this.state,
      billInfo: {
        ...this.state.billInfo,
        chgDt: e.target.value
      }
    });
    e.target.value = this.state.billInfo.chgDt;
  }
  
  // 청구자
  handleChangeChungNm(e: any){
    this.setState({
      ...this.state,
      billInfo: {
        ...this.state.billInfo,
        chungNm:fncCutByByte(e.target.value,100)
      }
    });
    e.target.value = this.state.billInfo.chungNm;
  }
  
  //
  reSetSuyongInfo(){
    const that = this;
    that.setState({
      ...that.state,
      searchYN: false,
      suyongaInfo: {
        cvplAdresTy : 'OWNER',
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
      viewSuyongaInfo: {
        viewName:['', '사용자/소유자'],
        /*
        viewUserName: ['', '사용자'],
        viewOwnerName: ['', '소유자'],
        viewOwnerNumber: ['', '수용가번호'],
        */
        viewItemNumber: ['', '기물번호'],
        viewDoroJuso: ['', '도로명주소'],
        viewPostNumberJibeunJuso: ['', '지번주소'],
        viewBusinessTypeDiameter: ['', '업종/계량기'],
      },
      paymentInfo:{
        paymentChk : false,
        paymentCnt : 0
      }
    });
  }
  
  // 청구지 주소 초기화
  resetBillInfo(){
    const that = this;
    that.setState({
      ...that.state,
      billInfo: {
        chgDt: '', // 주소변경일자
        chungNm: '', // 청구자
        billPostNumber: '', // 우편번호
        billAddress: '', // 도로명주소
        billDetailAddress: '', // 상세주소
        billDisplayAddress: '', //화면 표출용 주소
        cvplAdresTy : 'BILL',
        //주소
        sido: '',
        sigungu: '',
        umd: '',
        hdongNm: '',
        dong: '',
        doroCd: '',
        doroNm: '',
        dzipcode: '',
        bupd: '',
        bdMgrNum: '0',
        bdBonNum: '0',
        bdBuNum: '0',
        bdnm: '',
        bdDtNm: '',
        addr2: '',
        zipcode: '',
        fullDoroAddr: '', //applyAddress
        addr1: '',
        bunji: '0',
        ho: '0',
        extraAdd: '',
        specAddr: '',
        specDng: '',
        specHo: '',
        floors: '',
        mblckCd: '',
        mblckCdNm: '',
        sblckCd: '',
        sblckCdNm: '',
      }
    });
  }
  
  // 수용가 get
  getSuyongInfo(suyongaInfo: SuyongaInfoT){
    let ownerAddr : AddrInfoKey = {
      cvplAdresTy: 'OWNER',
      sido: suyongaInfo.csSido,
      sigungu: suyongaInfo.csGuCdNm,
      umd: suyongaInfo.csBdongCdNm,
      hdongNm: suyongaInfo.csHdongCdNm,
      dong: '',
      doroCd: '',
      doroNm: suyongaInfo.csRn,
      dzipcode: '',
      bupd: suyongaInfo.csStdBdongCd,
      bdMgrNum: '',
      bdBonNum: suyongaInfo.csBldBon,
      bdBuNum: suyongaInfo.csBldBu,
      bdnm: suyongaInfo.csBldNm,
      bdDtNm: suyongaInfo.csEtcAddr,
      addr2: suyongaInfo.csAddr2,
      zipcode: suyongaInfo.suyongaPostNumber,
      fullDoroAddr: suyongaInfo.suyongaAddress,
      addr1: suyongaInfo.csAddr1,
      bunji: suyongaInfo.csBon,
      ho: suyongaInfo.csBu,
      extraAdd: suyongaInfo.csEtcAddr,
      specAddr: suyongaInfo.csBldNm,
      specDng: suyongaInfo.csBldDong,
      specHo: suyongaInfo.csBldHo,
      floors: suyongaInfo.csUgFloorNo,
      mblckCd: suyongaInfo.mblckCd,
      mblckCdNm: suyongaInfo.mblckCdNm,
      sblckCd: suyongaInfo.sblckCd,
      sblckCdNm: suyongaInfo.sblckCdNm,
    }
    return ownerAddr;
  }
  // 청구지 get
  getBillInfo(billInfo: BillInfo){
    let billAddr : AddrInfoKey = {
      cvplAdresTy: 'BILL',
      sido: billInfo.sido,
      sigungu: billInfo.sigungu,
      umd: billInfo.umd,
      hdongNm: billInfo.hdongNm,
      dong: '',
      doroCd: '',
      doroNm: billInfo.doroNm,
      dzipcode: '',
      bupd: billInfo.bupd,
      bdMgrNum: '',
      bdBonNum: billInfo.bdBonNum,
      bdBuNum: billInfo.bdBuNum,
      bdnm: billInfo.bdnm,
      bdDtNm: billInfo.bdDtNm,
      addr2: billInfo.addr2,
      zipcode: billInfo.zipcode,
      fullDoroAddr: billInfo.fullDoroAddr,
      addr1: billInfo.addr1,
      bunji: billInfo.bunji,
      ho: billInfo.ho,
      extraAdd: billInfo.billDetailAddress,
      specAddr: billInfo.specAddr,
      specDng: billInfo.specDng,
      specHo: billInfo.specHo,
      floors: billInfo.floors,
      mblckCd: billInfo.mblckCd,
      mblckCdNm: billInfo.mblckCdNm,
      sblckCd: billInfo.sblckCd,
      sblckCdNm: billInfo.sblckCdNm,
    }
    return billAddr;
  }
  
  // 임시저장
  applyTempSave(){
    const that = this;
    let idx = 0;
    const arrLen = that.addrChangeList.length;
    if(MAX_LEN === arrLen){
      citizenAlert("수도요금청구주소 변경신청은 1번에 최대 20건까지 신청가능합니다.");
      return false;
    }
    idx = arrLen;
    let suyougTmp : SuyongaInfoT = that.state.suyongaInfo;
    let billTmp : BillInfo = that.state.billInfo;
    const chungNm = $("#chungNm").val();
    let addrChangeTmp: Array<AddrChangeVO> = new Array();
    let paymentCnt = that.state.paymentInfo.paymentCnt;
    let paymentChk = that.state.paymentInfo.paymentChk;
    
    if(that.state.searchYN && (paymentCnt > 0 && paymentChk === false)){
      citizenAlert('체납 정보 확인 후 체크해 주세요.');
      return false;
    }
    if(that.state.searchYN && !billTmp.addr1){
      citizenAlert("신 청구지 주소를 입력해 주세요.");
      return false;
    }
    /*
    if(!billTmp.billDetailAddress){
      citizenAlert("신 청구지 상세주소를 입력해 주세요.");
      $("#billDetailAddress").focus();
      return false;
    }
    */
    if(that.state.searchYN && !chungNm){
      citizenAlert("청구자명을 입력해 주세요.");
      $("#chungNm").focus();
      return false;
    }
    if(!that.state.searchYN && !suyougTmp.mkey){
      citizenAlert("수용가 검색으로 이동합니다.<br>고객번호와 수용가명(사용자 또는 소유자)으로 검색해 주세요.").then(result => {
        if(result){
          $("#owner_mkey").focus();
        }
      });
      
      return false;
    }else{
      let bfDoroAddr = getDoroAddrFromOwner('req', suyougTmp);
      let bfAddr = suyougTmp.reqAddr1;
//      let suyougTmp1:AddrInfoKey = suyougTmp;
//      that.addrChangeList.push(suyougTmp);
      that.addrChangeList.push({
        chgDt:billTmp.chgDt,
        chungNm:billTmp.chungNm,
        mgrNo:suyougTmp.mkey,
        bfAddr: bfAddr,
        bfDoroAddr: bfDoroAddr,
        mblckCd: suyougTmp.mblckCd,
        mblckCdNm: suyougTmp.mblckCdNm,
        sblckCd: suyougTmp.sblckCd,
        sblckCdNm: suyougTmp.sblckCdNm
      });
      that.state.suyongaInfoArray.push(suyougTmp);
      
      //수용가와같이 기능으로 extraAdd값이 이미 있을 수 있어 유지 후 billDetailAddress 추가.
      billTmp = {
        ...billTmp,
        extraAdd: billTmp.extraAdd ? billTmp.extraAdd+" "+ billTmp.billDetailAddress : billTmp.billDetailAddress
      };
      that.state.billInfoArray.push(billTmp);
//      that.addrChangeList[idx] = [...addrChangeTmp];
      that.addrChgList[idx] = [suyougTmp,billTmp];
//      that.addrChangeList[idx]['billInfo'] = billTmp;
      that.curIdx = -1;
      
      citizenConfirm("청구지 주소변경을 임시저장하였습니다.<br>또 다른 수용가의 청구지 주소 변경이 필요하신가요?").then(result =>{
          that.setState({
            ...that.state,
            searchYN: false,
          });
          that.reSetSuyongInfo();
          that.suyongRender();
          
        if(!result){$("#summaryPage").focus();}
        else $("#owner_mkey").focus();
      });
      //임시 저장 후 수용가 다시 저장할 수 있도록 초기화
//      this.setEventListeners();
    }
    that.showBillAddrList();
  }
  
  applyTempReset() {
    
    this.reSetSuyongInfo();
    this.resetBillInfo();
    this.jusoSearchPanel.reset();
    this.render();
  }
  
  // 임시데이터 삭제
  applyTempDelete(index:number){
    const that = this;
    that.addrChgList.splice(index,1);
    that.addrChangeList.splice(index,1);
    that.state.suyongaInfoArray.splice(index,1);
    that.state.billInfoArray.splice(index,1);
    that.setState({
      ...that.state,
      searchYN: false,
    });
    
    that.curIdx = -1; //newLists.length;
    that.reSetSuyongInfo();
//    that.resetBillInfo();
    that.render();
  }
  
  // 임시데이터 선택/수정
  applyTempUpdate(index:number){
    const that = this;
    that.curIdx = index;
    that.setState({
      ...that.state,
      searchYN: false,
      suyongaInfo: that.addrChgList[index][0],
      billInfo: that.addrChgList[index][1]
    });
    const $target = document.getElementById('suyongaInput');
    $target.innerHTML = $target.innerHTML + this.suyongaInfoPanel.render();
    let mkey = this.state.suyongaInfo.mkey;
    if(mkey){this.printPayMentInfo(mkey);}
    
    that.addrChgList.splice(index,1);
    that.addrChangeList.splice(index,1);
    that.state.suyongaInfoArray.splice(index,1);
    that.state.billInfoArray.splice(index,1);
    
    that.curIdx = -1; //newLists.length;
    that.render();
  }
  
  // 임시저장 데이터 show
  showBillAddrList(){
    const that = this;
    const addrList = that.addrChgList;
    let template = '';
    if(addrList.length !== 0){
      template += addrList.map((item: any, index: number)=>{
        return `
        <div class="searchlist">
          <div class="searchresult-b_5" style="margin:auto;">${index+1}</div>
          <div class="searchresult-b-3" style="margin:auto;">
            <p>${item[0].mkey}</p>
            <p>${maskingFnc.name(item[1].chungNm, "*")}</p>
            <p>${item[1].billDisplayAddress}</p>
          </div>
          <div class="searchresult-b-5" style="margin:auto;">
            <a href="javascript:;" class="btn btnSS btnTypeA"
              onclick="${that.state.path}.applyTempUpdate(${index})"><span>수정</span></a>
            <a href="javascript:;" class="btn btnSS btnTypeA"
              onclick="${that.state.path}.applyTempDelete(${index})"><span>삭제</span></a>
          </div>
        </div>
      `;
      }).join('');
    }else{
      //여러건 신청을 원하시는 경우 고객정보와 청구지 변경내용을 입력하고 추가 버튼을 누르세요.
      template += `
        <div class="searchlist">
          <div class="txStrongColor">
            여러건 신청을 원하시는 경우 고객정보와 청구지 변경내용을 입력하고 추가 버튼을 누르세요.
          </div>
        </div>
      `;
    }
    document.getElementById('billAddrList')!.innerHTML = template;
  }
  
  //체납정보를 화면에 출력하는 함수
  printPayMentInfo(mkey : String){
    let that = this;
    let url = "/citizen/common/listProofPaymentByMgrNo.do?"
    let queryString = "mkey=" + mkey;
    fetch('GET', url, queryString, function (error: any, data: any) {
        
        // 에러가 발생한 경우
        if (error) {
          alert_msg("서버가 응답하지 않습니다. 잠시 후 다시 조회해 주세요.");
          $("#suyongaSearch").prop('disabled', false);
          return;
        }
        let paymentCnt = parseInt(data.business.bodyVO.cnt);
        cyberMinwon.state.unityMinwon.state.currentPage.state.paymentInfo.paymentCnt = paymentCnt;
        let innerHtml = ""
        
        var UserAgent = navigator.userAgent;
        if(UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null 
                    || UserAgent.match(/LG|SAMSUNG|Samsung/) != null){ //모바일인 경우
          innerHtml = `
                        <li class="arrears">
                        <div class='txStrong'>체납 확인</div>
                            <div  id='sch-data-01' class='sch-data display-block row'>
                              <div class='sch-re'>
                                <table>
                                <caption><span class='blind'>과오납반환통지서번호검색 결과 정보를 포함한 표</span></caption>
                                <colgroup>
                                  <col style="width: 33%;">
                                  <col style="width: 33%;">
                                  <col style="width: *%;">
                                </colgroup>
                                <thead>
                                  <tr>
                                    <th scope='col'>기본요금</th>
                                    <th scope='col'>상수도요금</th>
                                    <th scope='col'>하수도요금</th>
                                  </tr>
                                  <tr>
                                    <th scope='col' colspan='2'>물이용부담금</th>
                                    <th scope='col'>기타요금</th>
                                  </tr>
                                </thead>
                                  <tbody>
                                    <tr>
                        `;
        if(paymentCnt > 0) {
            innerHtml += `
                            <td style='text-align:right;'>
                              <span class='sch--re-info '>`+numberWithCommas(data.business.bodyVO.basicAmt)+`</span>
                            </td>
                            <td style='text-align:right;'>
                              <span class='sch--re-info '>`+numberWithCommas(data.business.bodyVO.sAmt)+`</span>
                            </td>
                            <td style='text-align:right;'>
                              <span class='sch--re-info '>`+numberWithCommas(data.business.bodyVO.hAmt)+`</span>
                            </td>
                          </tr>
                          <tr>
                            <td style='text-align:right;' colspan='2'>
                              <span class='sch--re-info '>`+numberWithCommas(data.business.bodyVO.mAmt)+`</span>
                            </td>
                            <td style='text-align:right;'>
                              <span class='sch--re-info '>`+numberWithCommas(data.business.bodyVO.etcAmt)+`</span>
                            </td>
                         `;
      
          } else {
            that.state.paymentInfo.paymentChk = true;
            innerHtml += "<td colspan='3' style='text-align:center;''>체납사항이 없습니다.</td>";
          }
        }else{ //모바일이 아닌 경우
          innerHtml = `
                        <li class="arrears">
                        <div class='txStrong'>체납 확인</div>
                            <div  id='sch-data-01' class='sch-data display-block row'>
                              <div class='sch-re'>
                                <table>
                                <caption><span class='blind'>과오납반환통지서번호검색 결과 정보를 포함한 표</span></caption>
                                <colgroup>
                                  <col style="width: 20%;">
                                  <col style="width: 21%;">
                                  <col style="width: 21%;">
                                  <col style="width: 24%;">
                                  <col style="width: *;">
                                </colgroup>
                                <thead>
                                  <tr>
                                    <th scope='col'>기본요금</th>
                                    <th scope='col'>상수도요금</th>
                                    <th scope='col'>하수도요금</th>
                                    <th scope='col'>물이용부담금</th>
                                    <th scope='col'>기타요금</th>
                                  </tr>
                                </thead>
                                  <tbody>
                                    <tr>
                        `;
        if(paymentCnt > 0) {
            innerHtml += `
                          <td style='text-align:right;'>
                            <span class='sch--re-info '>`+numberWithCommas(data.business.bodyVO.basicAmt)+`</span>
                          </td>
                          <td style='text-align:right;'>
                            <span class='sch--re-info '>`+numberWithCommas(data.business.bodyVO.sAmt)+`</span>
                          </td>
                          <td style='text-align:right;'>
                            <span class='sch--re-info '>`+numberWithCommas(data.business.bodyVO.hAmt)+`</span>
                          </td>
                          <td style='text-align:right;'>
                            <span class='sch--re-info '>`+numberWithCommas(data.business.bodyVO.mAmt)+`</span>
                          </td>
                          <td style='text-align:right;'>
                            <span class='sch--re-info '>`+numberWithCommas(data.business.bodyVO.etcAmt)+`</span>
                          </td>
                         `;
      
          } else {
            that.state.paymentInfo.paymentChk = true;
            innerHtml += "<td colspan='5' style='text-align:center;''>체납사항이 없습니다.</td>";
          }
        }

        
        
        innerHtml += `            
                                  </tr>
                                </tbody>
                              </table>
                            </div><!-- sch-re -->
                     `;
        if(paymentCnt > 0) {
          innerHtml += `
                            <div class="summary"><p><span>합계</span><span>${numberWithCommas(data.business.bodyVO.tAmt)}</span></p><p><span>체납건수</span><span>${data.business.bodyVO.cnt}</span></p></div>
                       `;
        }
        innerHtml += `
                          </div><!-- sch-data-01 -->
                      </li>
                      `;
        if(paymentCnt > 0) {
          innerHtml += `
                        <li>
                          <label><span class='sr-only'>체납 확인</span></label>
                            <input type='checkbox' id='paymentChk' onclick='${that.state.path}.handlePaymentChk(event);'>
                          <label class='chk-type' for='paymentChk'><span>체납 정보를 확인했습니다.</span></label>
                        </li>
                      `;
        }
        
        $("#suyongaInput").append(innerHtml);
    });
  }
  copyToBillInfo(type: String){
    const suyongaInfo = this.state.suyongaInfo;
    
    let displayAddr = suyongaInfo.suyongaAddress ? suyongaInfo.suyongaAddress : ""//요약주소(보여주기용)
    displayAddr = suyongaInfo.suyongaDetailAddress.trim().length > 0 ? displayAddr + " " + suyongaInfo.suyongaDetailAddress : displayAddr;
    
    if(type == 'suyonga'){
      if(!suyongaInfo.mkey){
        citizenAlert("수용가가 조회되지 않았습니다.<br />고객번호와 수용가명(사용자 또는 소유자)으로 검색해 주세요.");
        $("#owner_mkey").focus();
        return false;
      }
      this.setState({      
        ...this.state,      
        billInfo: {        
          ...this.state.billInfo,      
          billPostNumber: suyongaInfo.suyongaPostNumber,//우편번호
          billAddress: suyongaInfo.suyongaAddress,//지역명
          zipcode: suyongaInfo.suyongaPostNumber,//우편번호
          billDisplayAddress:displayAddr,
             
          addr1: suyongaInfo.csAddr1,//지역명        
          addr2: suyongaInfo.csAddr2,//상세주소        
          fullDoroAddr: suyongaInfo.suyongaAddress,        
          sido: suyongaInfo.csSido,//시도명        
          sigungu: suyongaInfo.csGuCdNm,//시군구명        
          umd: suyongaInfo.csBdongCdNm,//법정읍면동명        
          dong: suyongaInfo.csBdongCdNm,//행정읍동명 같지만 값이 없어 umd와 같은 값을 준다        
          doroCd: '',//2020년 이후로 저장 안함        
          doroNm: suyongaInfo.csRn,//도로명        
          bupd: suyongaInfo.csStdBdongCd,//법정동코드        
          bdBonNum: suyongaInfo.csBldBon,//건물본번        
          bdBuNum: suyongaInfo.csBldBu,//건물부번        
          bdnm: suyongaInfo.csBldNm,//건물명        
          bdDtNm: suyongaInfo.csEtcAddr,//상세건물명                        
          bunji: suyongaInfo.csBon,//번지        
          ho: suyongaInfo.csBu,//호        
          extraAdd: suyongaInfo.csEtcAddr,        
          specAddr: suyongaInfo.csBldNm,        
          specDng: suyongaInfo.csBldDong,        
          specHo: suyongaInfo.csBldHo,        
          floors: suyongaInfo.csUgFloorNo
        }    
      });     
    } else if(type == 'first'){
      if(this.addrChgList.length === 0){
        citizenAlert("입력된 청구주소가 없습니다.");
        return false;
      }
      this.setState({      
        ...this.state,      
        billInfo: {        
          ...this.state.billInfo,      
          billPostNumber: this.addrChgList[0][1].billPostNumber,//우편번호
          billAddress: this.addrChgList[0][1].billAddress,//지역명
          billDisplayAddress: this.addrChgList[0][1].billDetailAddress ? this.addrChgList[0][1].fullDoroAddr+" "+this.addrChgList[0][1].billDetailAddress : this.addrChgList[0][1].fullDoroAddr ,//화면 출력용 주소
          zipcode: this.addrChgList[0][1].zipcode,//우편번호        
          addr1: this.addrChgList[0][1].addr1,//지역명        
          addr2: this.addrChgList[0][1].addr2,//상세주소        
          fullDoroAddr: this.addrChgList[0][1].fullDoroAddr,        
          sido: this.addrChgList[0][1].sido,//시도명        
          sigungu: this.addrChgList[0][1].sigungu,//시군구명        
          umd: this.addrChgList[0][1].umd,//법정읍면동명        
          dong: this.addrChgList[0][1].dong,//행정읍동명 같지만 값이 없어 umd와 같은 값을 준다        
          doroCd: '',//2020년 이후로 저장 안함        
          doroNm: this.addrChgList[0][1].doroNm,//도로명        
          bupd: this.addrChgList[0][1].bupd,//법정동코드        
          bdBonNum: this.addrChgList[0][1].bdBonNum,//건물본번        
          bdBuNum: this.addrChgList[0][1].bdBuNum,//건물부번        
          bdnm: this.addrChgList[0][1].bdnm,//건물명        
          bdDtNm: this.addrChgList[0][1].bdDtNm,//상세건물명                        
          bunji: this.addrChgList[0][1].bunji,//번지        
          ho: this.addrChgList[0][1].ho,//호        
          extraAdd: this.addrChgList[0][1].extraAdd,        
          specAddr: this.addrChgList[0][1].specAddr,        
          specDng: this.addrChgList[0][1].specDng,        
          specHo: this.addrChgList[0][1].specHo,        
          floors: this.addrChgList[0][1].floors,
          billDetailAddress: this.addrChgList[0][1].billDetailAddress,//상세주소
        }    
      });     
      
    }
    
    this.render();
    if($("#jusosearchB18Bill").is(":visible")){
      this.toggleJusoSearch();
    }
    //document.getElementById('billPostNumber').value = this.state.billInfo.billPostNumber;
    //document.getElementById('billAddress').value = this.state.billInfo.fullDoroAddr;
    
    
    //const $zip: HTMLInputElement = document.getElementById('billPostNumber') as HTMLInputElement;    
    //const $addr: HTMLInputElement = document.getElementById('billAddress') as HTMLInputElement;     
    //$zip.value = this.state.billInfo.billPostNumber;
    //$addr.value = this.state.billInfo.fullDoroAddr;
    $("#billDetailAddress").focus();
  }
  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyAddrChnge.do";
    var queryString = this.getQueryString();
    let addrChange = new FormData();
    for(let key in queryString){
      addrChange.append(key, queryString[key]);
    }
    //주소 데이터
    let addrListKey = "cvplInfo.cvplAddr[index]";
    let addrChngListKey = "addrChngeList[index]";
    let addrInx = 1;
    that.addrChangeList.map((item:AddrChangeVO, idx:number) => {
      addrChange.append(addrChngListKey.replace("index",""+idx)+".chgDt",item.chgDt.replace(/[^0-9]/g, ""));
      addrChange.append(addrChngListKey.replace("index",""+idx)+".chungNm",item.chungNm);
      addrChange.append(addrChngListKey.replace("index",""+idx)+".mgrNo",item.mgrNo);
      addrChange.append(addrChngListKey.replace("index",""+idx)+".bfAddr",item.bfAddr);
      addrChange.append(addrChngListKey.replace("index",""+idx)+".bfDoroAddr",item.bfDoroAddr);
      addrChange.append(addrChngListKey.replace("index",""+idx)+".mblckCd",item.mblckCd);
      addrChange.append(addrChngListKey.replace("index",""+idx)+".mblckCdNm",item.mblckCdNm);
      addrChange.append(addrChngListKey.replace("index",""+idx)+".sblckCd",item.sblckCd);
      addrChange.append(addrChngListKey.replace("index",""+idx)+".sblckCdNm",item.sblckCdNm);
    });
    
    for(let idx=0; idx < that.addrChgList.length; idx++){
      let suyongInfo = this.getSuyongInfo(that.addrChgList[idx][0]);
      if(idx != 0){
        for(let key in suyongInfo){
          addrChange.append(addrListKey.replace("index",""+addrInx)+"."+key, suyongInfo[key]);
        }
        addrInx++;
      }
      let billInfo = that.addrChgList[idx][1];
      for(let key in billInfo){
        addrChange.append(addrListKey.replace("index",""+addrInx)+"."+key, billInfo[key]);
      }
      addrInx++;
    }
    let applyInfo = that.state.parent.state.applicationPage.applicantInfo.state.applyInfo;
    applyInfo = {
      ...applyInfo,
      extraAdd: applyInfo.applyDetailAddress
    }
    addrChange.append(addrListKey.replace("index",""+addrInx)+".cvplAdresTy","APPLY");
    for(let idx in applyInfo){
      addrChange.append(addrListKey.replace("index",""+addrInx)+"."+idx,applyInfo[idx]);
    }
//    return;
    fetchMultiPart(url, addrChange, function (error: any, data: any) {
      // 에러가 발생한 경우
//      if (error) {
//        citizenAlert(that.state.description.minwonNm+"이 정상적으로 처리되지 않았습니다.");
//        return;
//      }
      that.setState({
        ...that.state,
        isSubmitSuccessful: data.resultCd === '00' ? true : false,
        submitResult: data
      });

      cyberMinwon.setResult(that.state.description.minwonNm, that, 'getResultView');

    });
  }
  
  getSmsResult(){
    const that = this;
    const applicationPage = that.state.parent.state.applicationPage;
    const suyongaInfo = applicationPage.suyongaInfo.state.suyongaInfo;
    let smsTemplate = ``;
    const mkey = suyongaInfo.mkey;
    const address = suyongaInfo.suyongaAddress;
    const billAddress = that.addrChgList[0][1].billDetailAddress ? that.addrChgList[0][1].fullDoroAddr+" "+that.addrChgList[0][1].billDetailAddress : that.addrChgList[0][1].fullDoroAddr
    let saupsoCdR = ""
    const resultData = that.state.submitResult.data;
    if(resultData){
      saupsoCdR = resultData.receiptNo.substring(0,3);
    }
    let officeNm = '';
    const saupso = saupsoInfo.find(ele => {ele.saupsoCd === saupsoCdR});
    if(typeof saupso  === 'undefined') {
      
    }else{
      officeNm = saupso.fullName;
    }
    smsTemplate += `
      <p class="form-info-box-gol"><수도요금 청구지 주소 변경 처리 안내><br>
      고객번호 : ${mkey}<br>
      주소 : ${address}<br>
      사용자 : ${maskingFnc.name(suyongaInfo.usrName,"*")}<br><br>
      위 수도에 대한 청구지 주소가 ${billAddress}로 변경 처리되었습니다.이사 등으로 청구지 주소를 다시 변경하여야 할 경우 사전에 수도사업소로 연락하셔서 불이익을 받는 일이 없도록 해주시기 바랍니다.<br><br>
      ${officeNm}
      </p>
    `;
    return smsTemplate;
  }

  getQueryString() {
    const that = this;
    const suyongaInfo = this.addrChgList[0][0];
    const recSec = $('#recSec').val() || null
    let addrChngeVO = {
        //수용가 정보
        'cvplInfo.cvpl.mgrNo': suyongaInfo.mkey,
        'cvplInfo.cvplOwner.csOfficeCd': suyongaInfo.csOfficeCd,
        'cvplInfo.cvplOwner.mblckCd': suyongaInfo.mblckCd,
        'cvplInfo.cvplOwner.mblckCdNm': suyongaInfo.mblckCdNm,
        'cvplInfo.cvplOwner.sblckCd': suyongaInfo.sblckCd,
        'cvplInfo.cvplOwner.sblckCdNm': suyongaInfo.sblckCdNm,
        'cvplInfo.cvplOwner.ownerNm': suyongaInfo.suyongaName,
        'cvplInfo.cvplOwner.usrName': suyongaInfo.usrName,
        'cvplInfo.cvplOwner.idtCdSNm': suyongaInfo.idtCdSNm,
        'cvplInfo.cvplOwner.reqKbnNm': '',
        'cvplInfo.cvplProcnd.cyberUserKey': $('#userKey').val(),
        'cvplInfo.cvplProcnd.officeYn': 'N',
        'cvplInfo.cvplProcnd.privacyAgree': that.state.parent.state.applicationPage.state.privacyAgree ? 'Y' : 'N',
        'cvplInfo.cvplProcnd.smsAllowYn': that.state.parent.state.applicationPage.state.smsAgree ? 'Y' : 'N',
        // 수용자 주소 정보
        'cvplInfo.cvplAddr[0].cvplAdresTy': 'OWNER',
        'cvplInfo.cvplAddr[0].sido': suyongaInfo.csSido,
        'cvplInfo.cvplAddr[0].sigungu': suyongaInfo.csGuCdNm,
        'cvplInfo.cvplAddr[0].umd': suyongaInfo.csBdongCdNm,
        'cvplInfo.cvplAddr[0].hdongNm': suyongaInfo.csHdongCdNm,
        'cvplInfo.cvplAddr[0].dong': '',
        'cvplInfo.cvplAddr[0].doroCd': '',
        'cvplInfo.cvplAddr[0].doroNm': suyongaInfo.csRn,
        'cvplInfo.cvplAddr[0].dzipcode': '',            // 도로우편번호
        'cvplInfo.cvplAddr[0].bupd': suyongaInfo.csStdBdongCd,
        'cvplInfo.cvplAddr[0].bdMgrNum': '',            // 빌딩관리번호
        'cvplInfo.cvplAddr[0].bdBonNum': suyongaInfo.csBldBon,
        'cvplInfo.cvplAddr[0].bdBuNum': suyongaInfo.csBldBu,
        'cvplInfo.cvplAddr[0].bdnm': suyongaInfo.csBldNm,      // specAddr/csBldNm와 동일 특수주소(건물,아파트명)
        'cvplInfo.cvplAddr[0].bdDtNm': suyongaInfo.csEtcAddr,  //extraAdd/csEtcAddr와 동일 특수주소(건물,아파트명) 기타 입력
        'cvplInfo.cvplAddr[0].addr2': suyongaInfo.csAddr2,
        'cvplInfo.cvplAddr[0].zipcode': suyongaInfo.suyongaPostNumber,
        'cvplInfo.cvplAddr[0].fullDoroAddr': suyongaInfo.suyongaAddress,
        'cvplInfo.cvplAddr[0].addr1': suyongaInfo.csAddr1,
        'cvplInfo.cvplAddr[0].bunji': suyongaInfo.csBon,
        'cvplInfo.cvplAddr[0].ho': suyongaInfo.csBu,
        'cvplInfo.cvplAddr[0].extraAdd': suyongaInfo.csEtcAddr,
        'cvplInfo.cvplAddr[0].specAddr': suyongaInfo.csBldNm,
        'cvplInfo.cvplAddr[0].specDng': suyongaInfo.csBldDong,
        'cvplInfo.cvplAddr[0].specHo': suyongaInfo.csBldHo,
        'cvplInfo.cvplAddr[0].floors': suyongaInfo.csUgFloorNo,
        'cvplInfo.cvplAddr[0].mblckCd': suyongaInfo.mblckCd,
        'cvplInfo.cvplAddr[0].mblckCdNm': suyongaInfo.mblckCdNm,
        'cvplInfo.cvplAddr[0].sblckCd': suyongaInfo.sblckCd,
        'cvplInfo.cvplAddr[0].sblckCdNm': suyongaInfo.sblckCdNm,
    
        // 신청 기본 정보
        'cvplInfo.cvpl.treatSec': '001',
        'cvplInfo.cvpl.recSec': recSec? recSec:'003',
    }
    
    
    return {
      ...this.getSuyongaQueryString(),
      'cvplInfo.cvpl.minwonCd': this.state.minwonCd,
      ...addrChngeVO
    };
  }
  
  // 신청을 위한 데이터를 수집한다.
  getSuyongaQueryString(): any {
    //신청인 정보
    const data1 = this.state.parent.state.steps['B18'].step[0].applicantInfo.state.applyInfo;
    const phoneArr =phonePattern.exec(data1.applyPhone);
    const mobileArr = mobilePattern.exec(data1.applyMobile);
    const applyEmail = data1.applyEmailId + "@" + data1.applyEmailProvider;
    const applyRelation1 = data1.applyRelation1 ? data1.applyRelation1 : data1.applyRelation2;
    
    return {
      // 신청 기본 정보
      'cvplInfo.cvpl.treatSec': '001',
      'cvplInfo.cvpl.recSec': '003',

      // 신청인 정보
      'cvplInfo.cvpl.applyNm': data1.applyName,  // 신청인 이름
      'cvplInfo.cvplApplcnt.telno1': phoneArr ? phoneArr[1] : '',
      'cvplInfo.cvplApplcnt.telno2': phoneArr ? phoneArr[2] : '',
      'cvplInfo.cvplApplcnt.telno3': phoneArr ? phoneArr[3] : '',
      'cvplInfo.cvplApplcnt.hpno1': mobileArr ? mobileArr[1] : '',
      'cvplInfo.cvplApplcnt.hpno2': mobileArr ? mobileArr[2] : '',
      'cvplInfo.cvplApplcnt.hpno3': mobileArr ? mobileArr[3] : '',
      'cvplInfo.cvplApplcnt.smsAllowYn': data1.applySMSAgree ? 'Y' : 'N',
      'cvplInfo.cvplApplcnt.email': applyEmail, //this.state.applicantInfo.state.viewApplyInfo.viewApplyEmail[0],
      'cvplInfo.cvplApplcnt.relation1': data1.applyRelation,
      'cvplInfo.cvplApplcnt.relation2': applyRelation1, // 기존은 사용자/소유자 -> 관계로 설정 / 사용여부 고려 해봐야 => TM_CVPL_APPLCNT table 데이터 필요. 기존대로 변경.
      
      // 신청인 주소 정보
    };
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
      <!-- 수용가정보 -->
      <div class="mw-box" id="suyonga">
        <div id="form-mw1" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw1');" title="닫기">
            <span class="i-10">수용가정보</span></a>
          </div>
          <div class="form-mw-box display-block row">
            <div class="form-mv row">
              <ul id="suyongaInput" class="result-box">
                <li>
                  <label for="owner_mkey" class="input-label">
                    <span class="form-req"><span class="sr-only">필수</span>고객번호</span></label>
                    <input type="text"
                      id="owner_mkey"
                      onkeyup="${that.state.path}.handleSuyongaNumber(event)" 
                      onpaste="${that.state.path}.handleSuyongaNumber(event)"
                      value="${that.state.suyongaInfo.suyongaNumber || ''}"
                      class="input-box input-w-2"maxlength="9"`;
       if (that.state.searchYN){template +=' disabled '} 
       template +=             
                    `placeholder="고객번호">
                  <p class="form-cmt pre-star tip-blue"><span class="txBlack">고객번호는</span> <a href="javascript:layerPopupOpen();">수도요금 청구서 [위치보기]</a> <span class="txBlack">/</span> <a href="javascript:fncSearchCyberMkey();">[고객번호 찾기]</a><span class="txBlack">로 확인할 수 있습니다.</span></p>
                </li>
                <li>
                  <label for="owner_ownerNm" class="input-label">
                    <span class="form-req"><span class="sr-only">필수</span>수용가명</span></label>
                    <input value="${that.state.suyongaInfo.suyongaName || ''}"
                      onkeyup="${that.state.path}.handleSuyongaName(event)" 
                      onpaste="${that.state.path}.handleSuyongaName(event)"
                      onchange="${that.state.path}.handleSuyongaName(event)"`;
       if (that.state.searchYN){template +=' disabled '}
       template +=             
                    `type="text" id="owner_ownerNm" class="input-box input-w-2 owner_ownerNm" placeholder="수용가 이름">
                  <a class="btn btnSS btnTypeA btnSingle"`;
                 template += that.state.searchYN ? `id="suyongaModify" onclick="${that.state.path}.hadleSuyongaModify(event)"` : `id="suyongaSearch" onclick="${that.state.path}.hadleSuyongaSearch(event)"`;
       template += `> 
                 <span>`;
                 template += that.state.searchYN ? '수용가 변경' : '수용가 검색';
       template +=           
                 `</span>
                  </a>
                  <p class="form-cmt pre-star tip-blue">고객번호와 수용가명(사용자 또는 소유자)을 입력하고 검색해 주세요.</p>
                </li>
              </ul>
            </div>
          </div>
        </div><!-- //form-mw1 -->
      </div><!-- //mw-box -->
      <!-- 신청내용 -->
      <div class="mw-box">
        <!-- 수도요금 청구지 주소변경 신청 -->
        <div id="form-mw23" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기">
          <span class="i-01">신 청구지 변경내용</span></a></div>
          <div class="form-mw-box display-block row">
            <div class="form-mv row">
              <ul id="billInput" class="bill-info">
                <li>
                  <label for="billPostNumber" class="input-label"><span class="form-req"><span class="sr-only">필수</span>청구지주소</span></label>
                  <span onClick="${that.state.path}.toggleJusoSearch()">
                    <input type="text" value="${that.state.billInfo.billPostNumber}" id="billPostNumber"
                      class="input-box input-w-2" placeholder="우편번호" disabled>
                  </span>
                </li>
                <li class="mw-opt mw-opt-3 row">
                  <a class="btn btnSS btnTypeA btnSingle"
                    onClick="${that.state.path}.toggleJusoSearch()"><span>주소검색</span></a>
                  <a class="btn btnSS btnTypeB"
                    onClick="${that.state.path}.copyToBillInfo('suyonga')"><span>수용가주소</span></a>
                  <a class="btn btnSS btnTypeB"
                    onClick="${that.state.path}.copyToBillInfo('first')"><span>첫번째 청구주소</span></a>
                </li>
                `
       
   template += `${that.state.billInfo.billDisplayAddress}` ? `<li>` : `<li style="display:none;">` ;
   template += `
              <label for="billDisplayAddress" class="input-label display-inline"><span class="sr-only">주소</span></label>
              <div id="billDisplayAddress" class="input-box input-w-2 result-address">${that.state.billInfo.billDisplayAddress}</div>
            </li>
                
                <!--
                <li class="default-address">
                  <label for="billAddress" class="input-label">
                    <span class="sr-only">주소</span>
                  </label><input type="text" value="${that.state.billInfo.billAddress}" id="billAddress"
                      class="input-box input-w-1" placeholder="주소" disabled>
                </li>
                <li class="detail-address">
                  <label for="billDetailAddress" class="input-label">
                    <span class="sr-only">상세주소</span>
                  </label><input type="text" 
                    onfocus="${that.state.path}.disableJusoSearch()"
                    onkeyup="${that.state.path}.handleBillDetailAddress(event)"
                    onpaste="${that.state.path}.handleBillDetailAddress(event)"      
                    value="${that.state.billInfo.billDetailAddress}" id="billDetailAddress"
                    class="input-box input-w-1 gap" placeholder="상세주소">
                </li>
                -->
                               
                <li id="${that.jusoTargetBill}" class="display-none">
                </li>
                <li>
                  <label for="chgDt" class="input-label"><span>변경일</span></label>
                  <input type="date" id="chgDt" name="chgDt" class="input-box input-w-2" maxlength="10"
                    value="${that.state.billInfo.chgDt}"
                    onchange="${that.state.path}.handleChangeChgDt(event)"
                    onpaste="${that.state.path}.handleChangeChgDt(event)">
                </li>
                <li>
                  <label for="chungNm" class="input-label"><span class="form-req"><span class="sr-only">필수</span>청구자명</span></label>
                  <input type="text" id="chungNm" name="chungNm" class="input-box input-w-2" maxlength="100"
                    value="${that.state.billInfo.chungNm}" placeholder="청구자 이름"
                    onkeyup="${that.state.path}.handleChangeChungNm(event)"
                    onchange="${that.state.path}.handleChangeChungNm(event)"
                    onpaste="${that.state.path}.handleChangeChungNm(event)">
                </li>
              </ul>
            </div>
          <!-- 버튼영역 -->
          <div class="form-btn-wrap row">
            <button type="button" id="btnTempSave" class="btn btnM btnWL" onclick="${that.state.path}.applyTempSave();">임시저장</button>
            <button type="button" id="btnTempReset"class="btn btnM btnDGray btnWM" onclick="${that.state.path}.applyTempReset();">초기화</button>
          </div><!-- //form-btn-wrap -->  
          </div><!-- //form-mw-box -->
        </div><!-- //form-mw24 -->
      </div><!-- //mw-box -->
      <!-- 청구지 변경 입력상태 -->
      <div class="mw-box">
        <div class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="showHideLayer('#form-mw-p');" title="닫기">
          <span class="i-01">청구지 변경 입력내역</span></a></div>
          <div class="form-mw-box display-block row">
            <div class="form-mv row">
              <p class="txStrongColor">변경 내용 추가 후 반드시 하단의 '등록'버튼을 눌러야 신청이 완료됩니다.</p>
              <div class="searchtable">
                <div class="header">
                  <div class="searchresult-h_5">번호</div>
                  <div class="searchresult-h-3">청구지 정보</div>
                  <div class="searchresult-h-5"></div>
                </div>
                <div class="body" id="billAddrList">
                </div>
              </div>
            </div>
          </div><!-- //form-mw-box -->
        </div><!-- //row -->
      </div><!-- //mw-box -->
      `;

    document.getElementById('minwonRoot')!.innerHTML = template;

    this.renderDescription(document.getElementById('desc'));
    
    this.afterRender();
    this.showBillAddrList()
//    if (!this.state.jusosearchShowSuyong) {
//      showHideInfo('#' + this.jusoTargetSuyong);
//    }
//    this.jusoSearchPanelSuyong.render();
/*
    if (!this.state.jusosearchShowBill) {
      showHideInfo('#' + this.jusoTargetBill);
    }
*/   
    this.jusoSearchPanel.render();
  }
  
  // 수용가 정보만 렌더링
  suyongRender(){
    const that = this;
    let template = `
        <div id="form-mw1" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw1');" title="닫기">
            <span class="i-10">수용가정보</span></a>
          </div>
          <div class="form-mw-box display-block row">
            <div class="form-mv row">
              <ul id="suyongaInput">
                <li>
                  <label for="owner_mkey" class="input-label">
                    <span class="form-req"><span class="sr-only">필수</span>고객번호</span></label>
                    <input type="text"
                      id="owner_mkey"
                      onkeyup="${that.state.path}.handleSuyongaNumber(event)" 
                      onpaste="${that.state.path}.handleSuyongaNumber(event)"
                      value="${that.state.suyongaInfo.suyongaNumber || ''}"
                      class="input-box" 
                      placeholder="고객번호">
                  <p class="form-cmt pre-star tip-blue"><span class="txBlack">고객번호는</span> <a href="javascript:layerPopupOpen();">수도요금 청구서 [위치보기]</a> <span class="txBlack">/</span> <a href="javascript:fncSearchCyberMkey();">[고객번호 찾기]</a><span class="txBlack">로 확인할 수 있습니다.</span></p>
                </li>
                <li>
                  <label for="owner_ownerNm" class="input-label">
                    <span class="form-req"><span class="sr-only">필수</span>수용가명</span></label>
                    <input value="${that.state.suyongaInfo.suyongaName || ''}"
                      onkeyup="${that.state.path}.handleSuyongaName(event)" 
                      onpaste="${that.state.path}.handleSuyongaName(event)"
                      type="text" id="owner_ownerNm" class="input-box owner_ownerNm" placeholder="수용가 이름">
                  <a class="btn btnSS btnTypeA btnSingle" id="suyongaSearch" onclick="${that.state.path}.hadleSuyongaSearch(event)"><span>수용가 검색</span></a>
                  <p class="form-cmt">* 고객번호를 입력하고 수용가 이름으로 검색해 주세요.</p>
                </li>
              </ul>
            </div>
          </div>
        </div><!-- //form-mw1 -->
      </div><!-- //mw-box -->
    `;
    
    document.getElementById('suyonga')!.innerHTML = template;
  }
  
  // 기본 설정값은 여기에서 랜더링 해야 한다.
  afterRender() {
    const that = this;
    // Info 패널을 그려준다.
    if (this.state.searchYN) {
      const $target = document.getElementById('suyongaInput');
      $target.innerHTML = $target.innerHTML + this.suyongaInfoPanel.render();
      let mkey = this.state.suyongaInfo.mkey;
      if(mkey){this.printPayMentInfo(mkey);}
    }
    const idx = that.curIdx;
    const addrListLen = that.addrChgList.length;
    that.setState({
      ...that.state,
      billInfo: {
        ...that.state.billInfo,
        chgDt: addrListLen === 0? that.today : ""
      }
    });
    //this.setEventListeners();
    //체납확인
    if(this.state.searchYN === false && addrListLen === 0){//첫 화면에서 입력한 수용가 정보 디폴트 값으로 사용 
      $("#owner_mkey").val(that.state.parent.state.applicationPage.suyongaInfo.state.suyongaInfo.mkey);
      $("#owner_ownerNm").val(that.state.parent.state.applicationPage.suyongaInfo.state.suyongaInfo.suyongaName);
      this.state.suyongaInfo.suyongaNumber = that.state.parent.state.applicationPage.suyongaInfo.state.suyongaInfo.mkey;
      this.state.suyongaInfo.suyongaName = that.state.parent.state.applicationPage.suyongaInfo.state.suyongaInfo.suyongaName;
      that.fncSearchCustomer();
    }else if(this.state.searchYN === false){
      if($("#owner_mkey").val()){
        that.fncSearchCustomer();
      }
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
              <div class="tit-mw-h5 row"><span>안내방법</span></div>
              <div class="info-mw-list">
                <ul>
                  <li>안내 방법 : 전화, 문자, 전자우편(이메일)  <br />
                       - 시민고객이 신청한 방법으로 안내
                  </li>
                  <li>수도요금 고지서(체납고지서, 자동납부 청구서 포함) 송달  <br />
                       - 11일까지 신청분 : 당월요금부터 변경된 청구지 주소로 우편 송달  <br />
                       - 11일이후 신청분 : 익월요금부터 변경된 청구지 주소로 우편 송달
                  </li>
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