import { fetch } from "../util/unity_resource";
import { showHideInfo, hideElement, applyMinwonCheck, citizenAlert, citizen_alert, citizenConfirm, maskingFnc, clearObject } from '../util/uiux-common';
import InfoPanel from "./InfoPanel";
import JusoSearchPanel from '../components/JusoSearchPanel';
import CyberMinwon from "../infra/CyberMinwon";
import CyberMinwonStorage from '../infra/StorageData';
declare var fncCutByByte: (str: string, maxByte: number) => string;

declare var document: any;
declare var cyberMinwon: CyberMinwon;
declare var gContextUrl: string;
declare var $: any;
declare var getDoroAddrFromOwner: (prefix: string, body: any) => string;
declare var fncTrim: (str: string) => string;
declare var fncGetCodeByGroupCdUsing: (code: string) => string;
declare var fncSetComboByCodeList: (param1: string, param2: string) => void;

export default class SuyongaJusoInfo {
  state: any;
  suyongaInfoPanel: InfoPanel;
  path: string;
  jusoTarget: string;
  jusoSearchPanel: JusoSearchPanel;
  directInput: boolean;

  constructor(private parent: any) {
    this.state = {
      setPageSuyongSearch: false,
      // 부모 즉 프로그램 전체를 감싸는 UnityMinwon의 객체를 참조한다.
      jusosearchShowS: false,
      // suyongaInfo는 화면 표출을 위한 상태를 저장하는 속성이다.
      statusInfo: {
        comboSidoTy: [],
        comboSigunguTy : []
      },
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
        wpMtrqlt: '',
        
        suyongaDisplayAddress: ''
        //
      },
      // viewSuyongaInfo는 수용가의 효면 표출용 변수들이다.      
      viewSuyongaInfo: {
        viewOwnerNumber: ['', '고객번호'],
        viewUserName: ['', '사용자/소유자'],
        viewItemNumber: ['', '기물번호'],
        viewJuso: ['', '수용가주소'],
//        viewPostNumberJibeunJuso: ['', '지번주소'],
        viewBusinessTypeDiameter: ['', '업종/계량기구경'],
      },
      viewSuyongaInfo2: {
        viewUserName: ['', '사용자/소유자'],
        viewItemNumber: ['', '기물번호'],
        viewJuso: ['', '수용가주소'],
//        viewPostNumberJibeunJuso: ['', '지번주소'],
        viewBusinessTypeDiameter: ['', '업종/계량기구경'],
      },
      searchYN: false
    }

    this.directInput = false;
    this.suyongaInfoPanel = new InfoPanel('', this.parent, this, 'getSuyongaView2');
    this.path = 'cyberMinwon.state.currentModule.state.currentPage.suyongaInfo';
    this.jusoTarget = 'jusosearchsuyonga';
    this.jusoSearchPanel = new JusoSearchPanel(this, this.path, 
      this.jusoTarget, this.handleSelectJuso);
    this.setInitCombo();
  }
  
  setInitCombo(){
    const that = this;
    const sidoTy = fncGetCodeByGroupCdUsing("sidoCs");
    const sigunguTy = fncGetCodeByGroupCdUsing("sigunguCs");
    that.setState({
      ...that.state,
      statusInfo: {
        comboSidoTy: sidoTy,
        comboSigunguTy : sigunguTy
      }
    });
  }
  
  setInit(){
    this.state = {
      // suyongaInfo는 화면 표출을 위한 상태를 저장하는 속성이다.
      ...this.state,
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
        wpMtrqlt: '',
        
        suyongaDisplayAddress: ''
      },
      // viewSuyongaInfo는 수용가의 효면 표출용 변수들이다.      
      viewSuyongaInfo: {
        viewOwnerNumber: ['', '고객번호'],
        viewUserOwnerName: ['', '사용자/소유자'],
        viewItemNumber: ['', '기물번호'],
        viewJuso: ['', '수용가주소'],
        viewBusinessTypeDiameter: ['', '업종/계량기구경'],
      },
      viewSuyongaInfo2: {
        viewUserName: ['', '사용자/소유자'],
        viewItemNumber: ['', '기물번호'],
        viewJuso: ['', '수용가주소'],
//        viewPostNumberJibeunJuso: ['', '지번주소'],
        viewBusinessTypeDiameter: ['', '업종/계량기구경'],
      },
      searchYN: false
    };
  }

  setState(nextState: any) {
    if (this.state !== nextState)
      this.state = nextState;
  }

  // 컴포넌트에서 처리하는 이벤트를 등록한다. template 함수 호출 방식도 가능하다.
  setEventListeners() {
    
    if(document.getElementById('suyongaModify')){
      // 수용가 변경 버튼 연동
      document.getElementById('suyongaModify').addEventListener('click', (e: any) => {
        clearObject(this.state.suyongaInfo, ['suyongaName','suyongaNumber','owner_mkey','owner_ownerNm']);
        this.setState({
          ...this.state,
          searchYN: false
        })
        this.render();
      });
    } else {
      // 수용가 검색 버튼 연동
      document.getElementById('suyongaSearch').addEventListener('click', (e: any) => {
        if(this.parent.parent.state.minwonCd === "A01" && !this.parent.state.constTy){
          citizenAlert("공사 종류를 먼저 선택해 주세요.");
          return false;
        }
        e.preventDefault();
        e.target.disabled = true;
        $("#suyongaSearch").prop('disabled', true);
        this.fncSearchCustomer();
      });
    }  
  }
  
  handleSuyongSearch() {
    if(this.parent.parent.state.minwonCd === "A01" && !this.parent.state.constTy){
      citizenAlert("공사 종류를 먼저 선택해 주세요.");
      return false;
    }
    $("#suyongaSearch").prop('disabled', true);
    this.fncSearchCustomer(true);
  }

  // 수용가 검색 조회시 0을 앞에 삽입한다.
  zeroFill(number: number, width: number) {
    width -= number.toString().length;
    if (width > 0) {
      return new Array(width + (/\./.test(String(number)) ? 2 : 1)).join('0') + number;
    }
    return number + ""; // always return a string
  }

  verify() {
    const that = this;
    const suyongaInfo = that.state.suyongaInfo;
    const minwonCd = cyberMinwon.state.unityMinwon.state.minwonCd;
    const constTy = that.parent.state.constTy;
    if(minwonCd == "A01" && (constTy === "C01" || constTy === "C02" || constTy === "C03" || 
                             constTy === "E01")){
      if (!this.state.searchYN) {
        citizenAlert("수용가 정보를 정확히 조회해 주세요.").then(result => {
          if(result){
            $("#owner_mkey").focus();
          }
        });
        return false;
      }
      
      
//      if(!suyongaInfo.mkey){
//        citizenAlert('고객번호를 입력하세요.');
//        $("#owner_mkey").focus();
//        return false;
//      }
      
    }
    let addressTitle = minwonCd=="A01" ? "수용가(설치장소)" : "민원발생지의";
    if (!suyongaInfo.suyongaAddress && !that.directInput) {
      citizenAlert(addressTitle+' 주소를 입력해 주세요.');
      return false;
    }
    if(that.directInput){
      if(suyongaInfo.csGuCdNm === ""){
        citizenAlert(addressTitle+' 기본주소의 시군구를 선택해 주세요.');
        return false;
      }
      if(suyongaInfo.csBdongCdNm === ""){
        citizenAlert(addressTitle+' 기본주소의 법정동을 선택해 주세요.');
        return false;
      }
    }
    if ($("#suyongaDetailAddress").is(":visible") && !suyongaInfo.suyongaDetailAddress) {
      citizenAlert('수용가의 상세주소를 입력해 주세요.');
      return false;
    }
    return true;
  }

  // 수용가 번호 연동
  handleSuyongaNumber(e: any) {
    
    if(this.parent.parent.state.minwonCd === "A01" && !this.parent.state.constTy){
      citizenAlert("공사 종류를 먼저 선택해 주세요.");
      e.target.value = "";
      return false;
    }
    
    this.setState({
      ...this.state,
      suyongaInfo: {
        ...this.state.suyongaInfo,
        suyongaNumber: e.target.value.replace(/[^0-9]/g,"").substring(0, 9)
      }
    });
    e.target.value = this.state.suyongaInfo.suyongaNumber.substring(0, 9);
  }

  // 수용가 이름 연동
  handleSuyongaName(e: any) {
    if(this.parent.parent.state.minwonCd === "A01" && !this.parent.state.constTy){
      e.target.value = "";
      citizenAlert("공사 종류를 먼저 선택해 주세요.");
      return false;
    }

    this.setState({
      ...this.state,
      suyongaInfo: {
        ...this.state.suyongaInfo,
        suyongaName: fncCutByByte(e.target.value, 150)
      },
    });
    e.target.value = this.state.suyongaInfo.suyongaName;
  }
  
  // 사용자 이름
  handleUsrName(e: any){
    this.setState({
      ...this.state,
      suyongaInfo: {
        ...this.state.suyongaInfo,
        usrName: e.target.value.substring(0, 50)
      },
    });
    e.target.value = this.state.suyongaInfo.usrName.substring(0, 50);
  }

  // 수용가 조회를 클릭했을 때 실행
  fncSearchCustomer(isMkey? : boolean) {
    // 콜백함수를 위해 context binding이 필요하다.
    const that = this;
    if (!this.state.suyongaInfo.suyongaName && !isMkey) {
      citizenAlert('수용가를 입력해 주세요');
      $("#owner_ownerNm").select();
      $("#suyongaSearch").prop('disabled', false);
      return false;
    }

    if (!this.state.suyongaInfo.suyongaNumber) {
      citizenAlert('고객번호를 정확히 입력해 주세요');
      $("#suyongaNumber").select();
      $("#suyongaSearch").prop('disabled', false);
      return false;
    }
    var paddedNumber = this.zeroFill(this.state.suyongaInfo.suyongaNumber, 9);
    const minwonCd = cyberMinwon.state.unityMinwon.state.minwonCd;

    var url = gContextUrl + "/citizen/common/listOwnerInqireByMgrNo.do";
    var queryString = "mkey=" + paddedNumber + "&minwonCd=" + minwonCd;

    // 수용가 데이터를 조회해 온다. arrow function을 지원하지 않기 때문에 that을 사용
    fetch('GET', url, queryString, function (error: any, data: any) {
      // 에러가 발생한 경우
      if (error) {
        citizenAlert("고객번호(9자리 숫자) 또는 수용가명(사용자/소유자)를 정확히 입력해 주세요.");
        $("#suyongaSearch").prop('disabled', false);
        return;
      }

      if (data.result.status === 'FAILURE') {
        // 나중에 슬라이드 alert으로 변경
        citizenAlert("고객번호(9자리 숫자) 또는 수용가명(사용자/소유자)를 정확히 입력해 주세요.");
        $("#suyongaSearch").prop('disabled', false);
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
      
      const suyongaInfo = data.business.bodyVO;
      let inputOwnerNm = fncTrim($("#owner_ownerNm").val());
      const hostName = location.hostname;
      if((hostName === "localhost" || hostName.indexOf('98.42.34.126') === 0 || hostName.indexOf('98.42.34.22') === 0 )){
        
      }else{
        if(inputOwnerNm !== fncTrim(suyongaInfo.ownerNm) && inputOwnerNm !== fncTrim(suyongaInfo.usrName) && !isMkey){
          citizenAlert("고객번호 또는 수용가명이 정확하지 않거나 민원신청을 할 수 없는 수용가입니다.<br>확인 후 다시 입력하시거나 <br>관할 수도사업소 또는 다산콜(02-120)으로 문의바랍니다.").then(result => {
            if(result){
              $("#owner_ownerNm").focus();
            }
          });
          return false;
        }
      }
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
  
        if (data > 0 && minwonCd !== "A07" && minwonCd !== "A12") {
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

      that.parent.setState({
        ...that.parent.state,
        suyonga: suyongaInfo
      });
      
      //수용가주소 복사 여부 변수 값 변경
      if(!this.state.setPageSuyongSearch && this.parent.applicantInfo.state.copySuyongaAddress){
        this.parent.handleChangeFromCopy();
      }
      this.state.setPageSuyongSearch = false;
      
      that.setState({
        ...that.state,
        searchYN: true,
        suyongaInfo: {
          suyongaNumber: suyongaInfo.mkey,
          suyongaName: suyongaInfo.usrName,
          suyongaPostNumber: suyongaInfo.zip1 + suyongaInfo.zip2,
          suyongaAddress: getDoroAddrFromOwner('cs', suyongaInfo),
          suyongaDetailAddress: '',
          suyongaDisplayAddress: '',
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
//          csAddr1: suyongaInfo.csAddr1,
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
          viewOwnerNumber: [suyongaInfo.mkey, '고객번호'],
          viewUserOwnerName: [`${maskingFnc.name(suyongaInfo.usrName, "*")}/${maskingFnc.name(suyongaInfo.ownerNm, "*")}`, '사용자/소유자'],
          viewItemNumber: [suyongaInfo.vesslNo, '기물번호'],
          viewJuso: [suyongaInfo.zip1 + suyongaInfo.zip2 + " " +getDoroAddrFromOwner('cs', suyongaInfo), '도로명주소'],
//          viewPostNumberJibeunJuso: [
          //viewDoroJuso: [getDoroAddrFromOwner('cs', suyongaInfo), '도로명주소'],
          viewJibeunJuso: [
            fncTrim(suyongaInfo['csSido']) + " " +
            fncTrim(suyongaInfo['csAddr1']) + " " +
            fncTrim(suyongaInfo['csBon']) +
            (fncTrim(suyongaInfo['csBu']) && fncTrim(suyongaInfo['csBu']) !== '0'? "-"+fncTrim(suyongaInfo['csBu']):"")
            , '지번주소'],
          viewBusinessTypeDiameter: [suyongaInfo.idtCdSNm + '/' + suyongaInfo.cbCdNm, '업종/계량기구경']
        },
        viewSuyongaInfo2: {
          viewUserOwnerName: [`${maskingFnc.name(suyongaInfo.usrName, "*")}/${maskingFnc.name(suyongaInfo.ownerNm, "*")}`, '사용자/소유자'],
          viewItemNumber: [suyongaInfo.vesslNo, '기물번호'],
          viewJuso: [suyongaInfo.zip1 + suyongaInfo.zip2 + " " +getDoroAddrFromOwner('cs', suyongaInfo), '도로명주소'],
//          viewPostNumberJibeunJuso: [
          //viewDoroJuso: [getDoroAddrFromOwner('cs', suyongaInfo), '도로명주소'],
          viewJibeunJuso: [
            fncTrim(suyongaInfo['csSido']) + " " +
            fncTrim(suyongaInfo['csAddr1']) + " " +
            fncTrim(suyongaInfo['csAddr2']), '지번주소'],
          viewBusinessTypeDiameter: [suyongaInfo.idtCdSNm + '/' + suyongaInfo.cbCdNm, '업종/계량기구경']
        }
      });

      //신청인 주소에 수용가 주소를 넣어준다.
      if(minwonCd === "A04" || minwonCd === "A05"){
        cyberMinwon.state.currentModule.state.currentPage.handleCopySuyongaAddress();
      }
      const sessionData = CyberMinwonStorage.getStorageData();
      const sessionAuth = sessionData?sessionData.authenticationInfo : '';
      const applicantInfo = sessionData?sessionData.applicantInfo : '';
      const privacyAgree = sessionData?sessionData.privacyAgree : false;
      const smsAgree = sessionData?sessionData.smsAgree : false;
      
      CyberMinwonStorage.setStorageData('Y', suyongaInfo.mkey, sessionAuth, applicantInfo, privacyAgree, smsAgree);

      that.render();
  }
  
  disableJusoSearch() {
    hideElement('#' + this.jusoTarget);
    this.setState({
      ...this.state,
      jusosearchShowS: false,
    });
  }
  
  // 콜백에서 사용되기 때무에 arrow function을 사용한다.
  // 수정 시에 this의 score에 주의한다.
  handleSelectJuso = (jusoInfo: any, detailAddress: string, action?: string) => {
    this.setState({
      ...this.state,
      suyongaInfo: {
        ...this.state.suyongaInfo,
        suyongaPostNumber: jusoInfo.zipNo,
        suyongaAddress: jusoInfo.roadAddr,//도로명
        //suyongaAddress: fullDoroJuso,//도로명
        zip1: jusoInfo.zipNo.substring(0,3),
        zip2: jusoInfo.zipNo.substring(3),
        csAddr1: (jusoInfo.siNm +" "+jusoInfo.sggNm+" "+jusoInfo.emdNm).trim(),//지역명 
        csAddr2: '',
        csGuCd: '',
        csHdongCd: '',
        csBdongCd: '',
        csSido: jusoInfo.siNm,//시도명
        csGuCdNm: jusoInfo.sggNm,//시군구명
        csRn: jusoInfo.rn,//도로명
        csBldBon: jusoInfo.buldMnnm,//건물본번
        csBldBu: jusoInfo.buldSlno,//건물부번
        csSan: '',
        csBon: jusoInfo.lnbrMnnm,//번지
        csBu: jusoInfo.lnbrSlno,//호
        csBldDong: '',
        csBldHo: '',
        csUgFlag: '',
        csUgFloorNo: '',
        csEtcAddr: '',
        csBldNm: '',
        csBdongCdNm: jusoInfo.emdNm,//법정읍면동명
        csHdongCdNm: '',
        //
        suyongaDetailAddress : detailAddress,//상세주소
        suyongaDisplayAddress : (jusoInfo.roadAddr && detailAddress)  ? jusoInfo.roadAddr+" "+detailAddress : ""//요약주소(보여주기용)
      },
      viewSuyongaInfo: {
        viewDoroJuso: [jusoInfo.zipNo + " " +jusoInfo.roadAddr +
        (detailAddress? " "+fncTrim(detailAddress):"")
        , '도로명주소'],
        viewJibeunJuso: [
          jusoInfo.siNm + " " +
          jusoInfo.sggNm + " " +
          jusoInfo.emdNm + " " +
          jusoInfo.lnbrMnnm +
          (fncTrim(jusoInfo.lnbrSlno) && fncTrim(jusoInfo.lnbrSlno) !== '0'? "-"+fncTrim(jusoInfo.lnbrSlno):"") +
          (detailAddress? " "+fncTrim(detailAddress):"")
          , '지번주소'],
//        viewBusinessTypeDiameter: ['', '업종/계량기']
      },
      viewSuyongaInfo2: {
        viewDoroJuso: [jusoInfo.zipNo + " " +jusoInfo.roadAddr +
        (detailAddress? " "+fncTrim(detailAddress):"")
        , '도로명주소'],
        viewJibeunJuso: [
          jusoInfo.siNm + " " +
          jusoInfo.sggNm + " " +
          jusoInfo.emdNm + " " +
          jusoInfo.lnbrMnnm +
          (fncTrim(jusoInfo.lnbrSlno) && fncTrim(jusoInfo.lnbrSlno) !== '0'? "-"+fncTrim(jusoInfo.lnbrSlno):"") +
          (detailAddress? " "+fncTrim(detailAddress):"")
          , '지번주소'],
//        viewBusinessTypeDiameter: ['', '업종/계량기']
      }
    });
    
    document.getElementById('suyongaPostNumber').value = jusoInfo.zipNo
    document.getElementById('suyongaDisplayAddress').innerHTML = jusoInfo.roadAddr+" "+detailAddress
    document.getElementById('suyongaDisplayAddress').parentNode.style.display = 'none';
    //document.getElementById('suyongaAddress').value = jusoInfo.roadAddr
    //suyongaDetailAddress
    if(action !== "clear"){
      document.getElementById('suyongaDisplayAddress').parentNode.classList.remove("display-none");
      document.getElementById('suyongaDisplayAddress').parentNode.style.display = 'block';
      //document.getElementById('suyongaDisplayAddress').value = jusoInfo.roadAddr+" "+detailAddress
      
      //수용가주소 복사 여부 변수 값 변경
      if(this.parent.applicantInfo.state.copySuyongaAddress){
          this.parent.handleChangeFromCopy();
      }
      
      this.toggleJusoSearch();
      //$("#suyongaDetailAddress").focus();
      //this.disableJusoSearch();
    }
  }
  
  toggleJusoSearch() {
    if(this.parent.parent.state.minwonCd === "A01" && !this.parent.state.constTy){
      citizenAlert("공사 종류를 먼저 선택해 주세요.");
      return false;
    }
    if(!this.directInput){
      showHideInfo('#' + this.jusoTarget);
      this.setState({
        ...this.state,
        jusosearchShowS: !this.state.jusosearchShowS
      });
    }else{
      citizenConfirm("주소 직접 입력을 그만두고 검색 하시겠습니까?").then(result => {
        if(result){
          this.handleOnClickDirectInput("");
//          this.directInput = !this.directInput;
//          $("#directInput").prop("checked", false);
          showHideInfo('#' + this.jusoTarget);
          this.setState({
            ...this.state,
            jusosearchShowS: !this.state.jusosearchShowS
          });
        }else{
          
        }
      });
    }
    clearObject(this.jusoSearchPanel.state.jusoResult);
    this.jusoSearchPanel.render();
    //!document.getElementById(this.jusoTarget+"doro") ? this.jusoSearchPanel.render() : "";
    $("#jusosearchsuyongadoro > input").focus();
  }
  
  handleSuyongaDetailAddress(e: any) {
    this.setState({
      ...this.state,
      suyongaInfo: {
        ...this.state.suyongaInfo,
        suyongaDetailAddress: fncCutByByte(e.target.value, 150),
        csAddr2: fncCutByByte(e.target.value, 150)
      }
    });
    e.target.value = this.state.suyongaInfo.suyongaDetailAddress;
    
    //더이상 수용가주소 복사 상태가 아님
    if(this.parent.applicantInfo.state.copySuyongaAddress){
        this.parent.handleChangeFromCopy();
      }
  }
  
  handleSuyoungaAddress(e: any){
    
    this.setState({
      ...this.state,
      suyongaInfo: {
        ...this.state.suyongaInfo,
        suyongaAddress: fncCutByByte(e.target.value, 200),
        csRn: fncCutByByte(e.target.value, 200)
      }
    });
    e.target.value = this.state.suyongaInfo.suyongaAddress
  }
  
  handleCheckDirectInput(directInputYn: boolean){
    if(!directInputYn){
      return false;
    }
  }
  
  handleOnClickDirectInput(e: any) {
    this.directInput = !this.directInput;
    const saveKeyArray = ["suyongaName", "ownerNm", "usrName"];
    clearObject(this.state.suyongaInfo, saveKeyArray);
    
    //수용가주소 복사 여부 변수 값 변경
    if(this.parent.applicantInfo.state.copySuyongaAddress){
      this.parent.handleChangeFromCopy();
    }
    
    if(this.directInput){
      $("#suyongaPostNumber").val("00000");
      $("#directBasic").addClass("display-block");
      $("#directBasic").removeClass("display-none");
      
      $("#suyongaDisplayAddress").parent().addClass("display-none");
      $("#suyongaDetailAddress").parent().removeClass("display-none");
      
      $("#sido option:eq(0)").prop("selected",true);
      $("#sido").val($("#sido option:selected").val()).trigger("change");
      this.setState({
        ...this.state,
        suyongaInfo: {
          ...this.state.suyongaInfo,
          suyongaPostNumber: '00000'
        }
      });
    }else{
      $("#suyongaPostNumber").val("");
      
      $("#directBasic").removeClass("display-block");
      $("#directBasic").addClass("display-none");
      $("#suyongaDetailAddress").parent().addClass("display-none");
      
      $("#sido option:eq(0)").prop("selected",true);
      $("#sigungu option:eq(0)").prop("selected",true);
      $("#umd option:eq(0)").prop("selected",true);
      this.setState({
        ...this.state,
        suyongaInfo: {
          ...this.state.suyongaInfo,
          suyongaPostNumber: ''
        }
      });
    }
  }
  
  handleChangePostNumber(e: any){
    let value = e.target.value;
    
    this.setState({
      ...this.state,
      suyongaInfo: {
        ...this.state.suyongaInfo,
        suyongaPostNumber: value.replace(/[^0-9]/g,"").substring(0, 5)
      }
    });
    e.target.value = this.state.suyongaInfo.suyongaPostNumber;
  }
  
  handleChangeSido(e: any){
    if(e.selectedIndex !== -1){
      //더이상 수용가주소 복사 상태가 아님
      if(this.parent.applicantInfo.state.copySuyongaAddress){
        this.parent.handleChangeFromCopy();
      }
      
      let value = e.value;
      let name = e.options[e.selectedIndex].text === "선택" ? "" : e.options[e.selectedIndex].text;
      this.setState({
          ...this.state,
          suyongaInfo: {
            ...this.state.suyongaInfo,
            csSido: name,
            csGuCdNm: "",
            csBdongCdNm: ""
          }
      });
      this.setSigungu(value);
      this.setUmd();
    }
  }
  
  setSigungu(sido: string){
    const that = this;
    const sigunguData = that.state.statusInfo.comboSigunguTy;
    let sigunguTy = `<option value=''>선택</option>`;
    sigunguData.map((item: any, idx: any) => {
      if(item.codeId.substring(0,2) == sido){
        sigunguTy += `<option value='${item.codeId}'>${item.codeNm}</option>`;
      }
    }).join('');
    $("#sigungu").html(sigunguTy);
  }
  
  handleChangeSigungu(e: any){
    if(e.selectedIndex !== -1){
      //더이상 수용가주소 복사 상태가 아님
      if(this.parent.applicantInfo.state.copySuyongaAddress){
        this.parent.handleChangeFromCopy();
      }
      
      let value = e.value;
      let name = e.options[e.selectedIndex].text === "선택" ? "" : e.options[e.selectedIndex].text;
      this.setState({
          ...this.state,
          suyongaInfo: {
            ...this.state.suyongaInfo,
            csGuCdNm: name,
            csBdongCdNm : ""
          }
      });
      this.setUmd();
    }
    //this.handleDirectInputValue();
  }
  
  setUmd(){
    const that = this;
    const sidoSel = that.state.suyongaInfo.csSido;
    const sigunguSel = that.state.suyongaInfo.csGuCdNm;
    const url = "/basic/code/listUmdBySidoSigungu.do";
    let queryString = `sido=${sidoSel}&sigungu=${sigunguSel}`;
    fetch("GET", url, queryString, function (err:any , data: any){
      if(err){
        citizenAlert("통신장애가 발생했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }
      let umdTy = `<option value=''>선택</option>`;
      if(data != ""){
        data.map((item: any) => {
          umdTy += `<option value='${item.umd}'>${item.umd}</option>`;
        }).join('');
      }
      $("#umd").html(umdTy);
    });
    
  }
  
  handleChangeUmd(e: any){
    const that = this;
    const suyongaInfo = that.state.suyongaInfo;
    const sidoSel = suyongaInfo.csSido;
    const sigunguSel = suyongaInfo.csGuCdNm;
    if(e.selectedIndex !== -1){
      //더이상 수용가주소 복사 상태가 아님
      if(this.parent.applicantInfo.state.copySuyongaAddress){
        this.parent.handleChangeFromCopy();
      }
      
      let value = e.value;
      let name = e.options[e.selectedIndex].text === "선택" ? "" : e.options[e.selectedIndex].text;
      this.setState({
          ...this.state,
          suyongaInfo: {
            ...this.state.suyongaInfo,
            csBdongCdNm: name,
            csAddr1: `${sidoSel} ${sigunguSel} ${name}`
          },
      });
    }
    //this.handleDirectInputValue();
  }
  /*
  handleDirectInputValue(){
    
    const sido = this.state.suyongaInfo.csSido ? this.state.suyongaInfo.csSido : "";
    const sigungu = this.state.suyongaInfo.csGuCdNm ? this.state.suyongaInfo.csGuCdNm : "";
    const csBdongCdNm = this.state.suyongaInfo.csBdongCdNm ? this.state.suyongaInfo.csBdongCdNm : "";
    const suyongaDetailAddress = this.state.suyongaInfo.suyongaDetailAddress ? this.state.suyongaInfo.suyongaDetailAddress : "";
    
    this.setState({
          ...this.state,
          suyongaInfo: {
            ...this.state.suyongaInfo,
            suyongaDisplayAddress: sido+" "+sigungu+" "+csBdongCdNm+" "+suyongaDetailAddress
          }
      });
    document.getElementById("suyongaDisplayAddress").value = this.state.suyongaInfo.suyongaDisplayAddress;
  }
  */
  // InfoPanel 데이터 설정
  getSuyongaView() {
    const minwonCd = cyberMinwon.state.unityMinwon.state.minwonCd;
    let title = "";
    const suyongaInfo = this.state.suyongaInfo;
    if(minwonCd === "A01"){
      title = "수용가 정보(설치장소)";
    }else{
      title = "민원발생지 정보";
    }
    
    if (this.state.searchYN && minwonCd === "A01") {
      return {
        suyongaView: {
          ...this.state.viewSuyongaInfo,
          title: title
        }
      }
    }else if(!this.directInput){
      if(minwonCd === "A01"){
        return {
          suyongaView: {
            ...this.state.viewSuyongaInfo,
            title: title,
            viewUserOwnerName: [`${maskingFnc.name(suyongaInfo.usrName, "*")}/${maskingFnc.name(suyongaInfo.suyongaName, "*")}`, '사용자/소유자'],
          }
        }
      }else{
        return {
          suyongaView: {
            ...this.state.viewSuyongaInfo,
            title: title,
          }
        }
      }
    }else if(this.directInput){
      if(minwonCd === "A01"){
        return {
          suyongaView: {
            title: title,
            viewUserOwnerName: [`${maskingFnc.name(suyongaInfo.usrName, "*")}/${maskingFnc.name(suyongaInfo.suyongaName, "*")}`, '사용자/소유자'],
            viewSuyongaAddress: [suyongaInfo.csSido.trim() + " " + suyongaInfo.csGuCdNm.trim() + " " + suyongaInfo.csBdongCdNm.trim() + " " + suyongaInfo.suyongaDetailAddress, '수용가주소'],
          }
        }
      }else{
        return {
          suyongaView: {
            title: title,
            viewSuyongaAddress: [suyongaInfo.csSido.trim() + " " + suyongaInfo.csGuCdNm.trim() + " " + suyongaInfo.csBdongCdNm.trim() + " " + suyongaInfo.suyongaDetailAddress, '민원발생지 주소'],
          }
        }
      }
    }
  }
  
  getSuyongaView2() {
    const minwonCd = cyberMinwon.state.unityMinwon.state.minwonCd;
    let title = "";
    const suyongaInfo = this.state.suyongaInfo;
    if(minwonCd === "A01"){
      title = "수용가 정보(설치장소)";
    }else{
      title = "민원발생지 정보";
    }
    
    if (this.state.searchYN && minwonCd === "A01") {
      return {
        suyongaView: {
          ...this.state.viewSuyongaInfo2,
          title: title
        }
      }
    }else if(!this.directInput){
      if(minwonCd === "A01"){
        return {
          suyongaView: {
            ...this.state.viewSuyongaInfo2,
            title: title,
            viewUserOwnerName: [`${maskingFnc.name(suyongaInfo.usrName, "*")}/${maskingFnc.name(suyongaInfo.suyongaName, "*")}`, '사용자/소유자'],
          }
        }
      }else{
        return {
          suyongaView: {
            ...this.state.viewSuyongaInfo2,
            title: title,
          }
        }
      }
    }else if(this.directInput){
      if(minwonCd === "A01"){
        return {
          suyongaView: {
            title: title,
            viewUserOwnerName: [`${maskingFnc.name(suyongaInfo.usrName, "*")}/${maskingFnc.name(suyongaInfo.suyongaName, "*")}`, '사용자/소유자'],
            viewSuyongaAddress: [suyongaInfo.csSido.trim() + " " + suyongaInfo.csGuCdNm.trim() + " " + suyongaInfo.csBdongCdNm.trim() + " " + suyongaInfo.suyongaDetailAddress, '수용가주소'],
          }
        }
      }else{
        return {
          suyongaView: {
            title: title,
            viewSuyongaAddress: [suyongaInfo.csSido.trim() + " " + suyongaInfo.csGuCdNm.trim() + " " + suyongaInfo.csBdongCdNm.trim() + " " + suyongaInfo.suyongaDetailAddress, '민원발생지 주소'],
          }
        }
      }
    }
  }

  render() {
    const that = this;
    const minwonCd = cyberMinwon.state.unityMinwon.state.minwonCd;
    let boxTitle = "";
    if(minwonCd === "A01"){
      boxTitle = "수용가정보(설치장소)";
    }else{
      boxTitle = "민원발생지";
    }
    let template = `
      <div id="form-mw1" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw1');" title="닫기">
          <span class="i-10">${boxTitle}</span></a>
        </div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul id="suyongaInput">
              <li>
                <label for="owner_mkey" class="input-label form-req">
                  <span>고객번호</span></label>
                  <input type="text"
                    id="owner_mkey"
                    onkeyup="${that.path}.handleSuyongaNumber(event)" 
                    onpaste="${that.path}.handleSuyongaNumber(event)"
                    onchange="${that.path}.handleSuyongaNumber(event)"
                    value="${that.state.suyongaInfo.suyongaNumber || ''}"
                    class="input-box input-w-2" maxlength="9"`;
       if (that.state.searchYN){template +=' disabled '} 
       template +=             
                    `placeholder="고객번호">
                <p class="form-cmt pre-star tip-blue"><span class="txBlack">고객번호는</span> <a href="javascript:layerPopupOpen();" title="새 창 열림">수도요금 청구서 [위치보기]</a> <span class="txBlack">/</span> <a href="javascript:fncSearchCyberMkey();" title="새 창 열림">[고객번호 찾기]</a><span class="txBlack">로 확인할 수 있습니다.</span></p>
              </li>
              <li>
                <label for="owner_ownerNm" class="input-label">
                  <span class="form-req"><span class="sr-only">필수</span>소유자</span></label>
                  <input value="${that.state.suyongaInfo.suyongaName || ''}"
                    onkeyup="${that.path}.handleSuyongaName(event)" 
                    onpaste="${that.path}.handleSuyongaName(event)"
                    onchange="${that.path}.handleSuyongaName(event)"`;
       if (that.state.searchYN){template +=' disabled '}
       template +=             
                    `type="text" id="owner_ownerNm" class="input-box input-w-2 owner_ownerNm" placeholder="소유자 이름">
                  <a href="javascript:;" class="btn btnSS btnTypeA btnSingle"`;
                 template += that.state.searchYN ? 'id="suyongaModify"' : 'id="suyongaSearch"';
       template += `> 
                 <span>`;
                 template += that.state.searchYN ? '수용가 변경' : '수용가 검색';
       template +=           
                 `</span>
                </a>
                <p class="form-cmt pre-star tip-blue">고객번호와 수용가명(사용자 또는 소유자)을 입력하고 검색해 주세요.</p>
              </li>
              <li id="owner_usrName">
                <label for="usrName" class="input-label">
                  <span class="form-req"><span class="sr-only">필수</span>사용자</span></label>
                  <input value="${that.state.suyongaInfo.usrName || ''}"
                    onkeyup="${that.path}.handleUsrName(event)" 
                    onpaste="${that.path}.handleUsrName(event)"
                    type="text" id="usrName" class="input-box input-w-2" placeholder="사용자 이름">
              </li>
              
              
              <li class="mw-opt-2">
                <label for="suyongaPostNumber" class="input-label"><span class="form-req">주소</span></label>
                <span href="javascript:;" onClick="${that.path}.toggleJusoSearch()">
                  <input type="text" value="${that.state.suyongaInfo.suyongaPostNumber}" id="suyongaPostNumber"
                    onchange="${that.path}.handleChangePostNumber(event)"
                    class="input-box input-w-2" placeholder="우편번호" disabled maxlength="5">
                </span>
                  
                <a href="javascript:;" class="btn btnSS btnTypeA"
                  onClick="${that.path}.toggleJusoSearch()"><span>주소검색</span></a>
                  
                <a href="javascript:;" class="btn btnSS btnTypeA"
                  onclick="${that.path}.handleOnClickDirectInput(event)"
                  onfocus="${that.path}.disableJusoSearch()">
                  <span>주소직접입력</span>
                </a>
              </li>
              `
       
        template += `${that.state.suyongaInfo.suyongaDisplayAddress}` ? `<li>` : `<li style="display:none;">` ;
        template += `
                <label for="applyDisplayAddress" class="input-label display-inline"><span class="sr-only">주소</span></label>
                <div id="suyongaDisplayAddress" class="input-box input-w-2 result-address">${that.state.suyongaInfo.suyongaDisplayAddress}</div>
                <!--<input type="text" id="suyongaDisplayAddress" value="${that.state.suyongaInfo.suyongaDisplayAddress ? that.state.suyongaInfo.suyongaDisplayAddress : ''}" class="input-box input-w-2" readonly/>-->
              </li>
              <li id="directBasic" class="direct-add display-none">
                <label for="sido" class="input-label"><span class="sr-only"></span>
                </label>
                <select id="sido" name="sido" title="시도 선택" class="input-box"
                  onchange="${that.path}.handleChangeSido(this)">
                </select>
                <select id="sigungu" name="sigungu" title="시군구 선택" class="input-box"
                  onchange="${that.path}.handleChangeSigungu(this)">
                  <option value=''>선택</option>
                </select>
                <select id="umd" name="umd" title="법정동 선택" class="input-box"
                  onchange="${that.path}.handleChangeUmd(this)">
                  <option value=''>선택</option>
                </select>
              </li>
              <li class="detail-address display-none">
                <label for="suyongaDetailAddress" class="input-label detail-address">
                  <span class="sr-only">상세주소</span>
                </label><input type="text" maxlength="200"
                  onfocus="${that.path}.disableJusoSearch()"
                  onkeyup="${that.path}.handleSuyongaDetailAddress(event)"
                  onpaste="${that.path}.handleSuyongaDetailAddress(event)"      
                  value="${that.state.suyongaInfo.suyongaDetailAddress}" id="suyongaDetailAddress"
                  class="input-box input-w-1 gap" placeholder="상세주소">
              </li>               
              <li id="${that.jusoTarget}" class="search-add display-block">
              </li>
            </ul>
          </div>
        </div>
      </div><!-- //form-mw1 -->    
    `;

    document.getElementById('suyonga').innerHTML = template;

    this.afterRender();
    
    if (!this.state.jusosearchShowS) {
      showHideInfo('#' + this.jusoTarget);
    }

    this.jusoSearchPanel.render();
  }

  afterRender() {
    
    const that = this;
    fncSetComboByCodeList("sido",that.state.statusInfo.comboSidoTy);
    //서울특별시,경기도 이외 제거
    for(var i=$("#sido option").length-1; i>0; i--){
      $("#sido option:eq("+i+")").val()
      if($("#sido option:eq("+i+")").val() != "11" &&  $("#sido option:eq("+i+")").val() != "41"){
        $("#sido option:eq("+i+")").remove();
      }
    }
    if(this.directInput){
      $("#sido").val(that.state.suyongaInfo.csSido ? that.state.suyongaInfo.csSido : $("#sido option:selected").val())
                     .trigger("change");
      $("#sigungu").val(that.state.suyongaInfo.csGuCdNm ? that.state.suyongaInfo.csGuCdNm : $("#sigungu option:selected").val())
                     .trigger("change");
      $("#umd").val(that.state.suyongaInfo.csBdongCdNm ? that.state.suyongaInfo.csBdongCdNm : $("#umd option:selected").val())
                     .trigger("change");
    }
   
    const minwonCd = cyberMinwon.state.unityMinwon.state.minwonCd;
    
    if(minwonCd === "A01"){
      //this : cyberMinwon.state.currentModule.state.currentPage.suyongaInfo
      //constTy : cyberMinwon.state.currentModule.state.currentPage.state.constTy
      let constTy = that.parent.state.constTy;
      let directInput = that.parent.suyongaInfo.directInput;
      
      //A01:단독신규, A02:공동신규 ,B01:단독근생 ,B02:공동근생 ,D01:임시급수 ,F01:대규모 주택단지 및 산업시설 ,G01:기타
      if(constTy === "A01" || constTy === "A02" || constTy === "B01" || constTy === "B02" || constTy === "F01"){
        $("#owner_ownerNm").prev().text("소유자");
      }else{
        $("#owner_ownerNm").prev().text("소유자");
      }
      $("#owner_ownerNm").prev().addClass("form-req");//텍스트를 바꾸면 사라져서 다시 주입
      //급수공사(A01) 민원 공사종류(constTy)에 따른 화면 제어
      if(constTy === "A01" || constTy === "A02" || constTy === "D01" || constTy === "B01" || constTy === "B02" || constTy === "F01" || constTy === "G01"){
        $("#owner_mkey").parent().addClass("display-none");
        $("#suyongaSearch").addClass("display-none");
        $("#suyongaSearch").next().addClass("display-none");
        $("#directBasic").addClass("display-none");
        $("#directBasic").next().addClass("display-none");
        //$("#jusosearchsuyonga").addClass("display-none");
        if(directInput == true){
          $("#suyongaPostNumber").prop("disabled",true);
          //$("#suyongaAddress").parent().addClass("display-none");
          $("#directBasic").addClass("display-block");
          $("#directBasic").removeClass("display-none");
          $("#suyongaDetailAddress").parent().removeClass("display-none");
          
          //직접입력 셀렉트 박스 셋팅
          $("#sido option:contains("+that.parent.suyongaInfo.state.suyongaInfo.csSido+")").attr("selected", "selected");
          that.setSigungu($("#sido option:contains("+that.parent.suyongaInfo.state.suyongaInfo.csSido+")").val());
          $("#sigungu option:contains("+that.parent.suyongaInfo.state.suyongaInfo.csGuCdNm+")").attr("selected", "selected");
          that.setUmd();
          $("#umd option:contains("+that.parent.suyongaInfo.state.suyongaInfo.csBdongCdNm+")").attr("selected", "selected");
        }
      }else{//C01,C02,C03,E01
        $("#suyongaInput").children().addClass("display-none");
        $("#owner_mkey").parent().removeClass("display-none");
        $("#owner_ownerNm").parent().removeClass("display-none");
        $("#usrName").prop("readonly", true);
        $(".direct-input").addClass("display-none");
      }
      
    } else if(minwonCd === "A06"){
      $("#owner_ownerNm").parent().addClass("display-none");
      //$("#owner_ownerNm").prev().text("수용가(성명)");
      $("#owner_usrName").hide();
      
      $("#owner_mkey").parent().addClass("display-none");
      $("#suyongaSearch").addClass("display-none");
      $("#suyongaSearch").next().addClass("display-none");
      $("#directBasic").addClass("display-none");
      $("#directBasic").next().addClass("display-none");
      //$("#suyongaDetailAddress").parent().removeClass("display-none");
      let directInput = that.parent.suyongaInfo.directInput;
      if(directInput == true){
        $("#suyongaPostNumber").prop("disabled",true);
        $("#suyongaAddress").parent().addClass("display-none");
        $("#directBasic").addClass("display-block");
        $("#directBasic").removeClass("display-none");
        $("#suyongaDetailAddress").parent().removeClass("display-none");
        
        //직접입력 셀렉트 박스 셋팅
        $("#sido option:contains("+that.parent.suyongaInfo.state.suyongaInfo.csSido+")").attr("selected", "selected");
        that.setSigungu($("#sido option:contains("+that.parent.suyongaInfo.state.suyongaInfo.csSido+")").val());
        $("#sigungu option:contains("+that.parent.suyongaInfo.state.suyongaInfo.csGuCdNm+")").attr("selected", "selected");
        that.setUmd();
        $("#umd option:contains("+that.parent.suyongaInfo.state.suyongaInfo.csBdongCdNm+")").attr("selected", "selected");
        }
    }
    // 데이터는 immutable 이기 때문에 랜더링 전에 데이터를 전달해야 한다.
    // 화면에 추가로 붙이는 부분들은 전체 화면이 그려진 후에 처리되어야 한다.
    // Info 패널을 그려준다.
    if (this.state.searchYN && minwonCd === "A01" && that.parent.state.constTy) {
      const $target = document.getElementById('suyongaInput');
      $target.innerHTML = $target.innerHTML + this.suyongaInfoPanel.render();
    }
    

    // 이벤트를 수동으로 등록해 준다.
    this.setEventListeners();
  }
}