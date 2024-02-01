import { fetch } from "../util/unity_resource";
import { showHideInfo, maskingFnc, popPayWin, popPaymentCheck, applyMinwonCheck, citizen_alert, citizenAlert, numberWithCommas, clearObject } from '../util/uiux-common';
import InfoPanel from "./InfoPanel";
import CyberMinwon from "../infra/CyberMinwon";
import CyberMinwonStorage from '../infra/StorageData';
declare var document: any;
declare var cyberMinwon: CyberMinwon;
declare var gContextUrl: string;
declare var $: any;
declare var getDoroAddrFromOwner: (prefix: string, body: any) => string;
declare var fncTrim: (str: string) => string;
declare var fncCutByByte: (str: string, maxByte: number) => string;
declare var fncGetCodeByGroupCdUsing: (code: string) => string;
declare var fncSetComboByCodeList: (param1: string, param2: string) => void;

export default class SuyongaInfo {
  state: any;
  suyongaInfoPanel: InfoPanel;
  path: string;
  statusInfo: any;
  payMentInfo: {
    paymentChk: boolean,
    paymentCnt: number,
    //급수설비 폐지 요금납부 입력 정보
    chargeFlag: string,//(Y/N)
    bankCd: string,
    bankNm: string,
    bankBranch: string,
    paidDt: string,
    paidAmount: string
  };
  constructor(private parent: any) {
    this.state = {
      setPageSuyongSearch: false,
      // 부모 즉 프로그램 전체를 감싸는 UnityMinwon의 객체를 참조한다.
      // suyongaInfo는 화면 표출을 위한 상태를 저장하는 속성이다.
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
        insttSe: ''
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
      searchYN: false,
    }
    this.statusInfo = {
      bankList: fncGetCodeByGroupCdUsing("007")//은행 공통코드 리스트 객체
    },
    this.payMentInfo = {
      paymentChk: false,
      paymentCnt: 0,
      //급수설비 폐지 요금납부 입력 정보
      chargeFlag: 'N',
      bankCd: '',
      bankNm: '',
      bankBranch: '',
      paidDt: '',
      paidAmount: '',
    }

    this.suyongaInfoPanel = new InfoPanel('',
      this.parent, this, 'getSuyongaView2');
    this.path = 'cyberMinwon.state.currentModule.state.currentPage.suyongaInfo';
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
        insttSe: ''
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
    //체납정보 초기화
    this.payMentInfo = {
      paymentChk: false,
      paymentCnt: 0,
      //급수설비 폐지 요금납부 입력 정보
      chargeFlag: 'N',
      bankCd: '',
      bankNm: '',
      bankBranch: '',
      paidDt: '',
      paidAmount: '',
    }
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
        e.preventDefault();
        e.target.disabled = true;
        $("#suyongaSearch").prop('disabled', true);
  
        //화면별 수용가 조회전 고객번호가 민원 신청에 적합한지 검증 함수 호출
        var unityMinwonState = cyberMinwon.state.unityMinwon.state;
        if (unityMinwonState.steps[unityMinwonState.minwonCd].step[1].possibleApplyChk && this.state.suyongaInfo.suyongaNumber.length == 9) {
          (async() => {
            let possibleChk = await unityMinwonState.steps[unityMinwonState.minwonCd].step[1].possibleApplyChk(this.state.suyongaInfo.suyongaNumber);
            
            if (!possibleChk) {//함수 결과 신청 불가능
              e.target.disabled = false;
              return false;
            } else {//함수가 있고 신청이 가능
              this.fncSearchCustomer();
            }
          })();
        } else {//possibleApplyChk함수가 없을 경우
          this.fncSearchCustomer();
        }
      });
    }
  }
  
  handleSuyongSearch(minwonCd:string){
    $("#suyongaSearch").prop('disabled', true);
    
    //화면별 수용가 조회전 고객번호가 민원 신청에 적합한지 검증 함수 호출
    var unityMinwonState = cyberMinwon.state.unityMinwon.state;
    if(unityMinwonState){
      if (unityMinwonState.steps[minwonCd].step[1].possibleApplyChk && this.state.suyongaInfo.suyongaNumber.length == 9) {
        (async() => {
          let possibleChk = await unityMinwonState.steps[unityMinwonState.minwonCd].step[1].possibleApplyChk(this.state.suyongaInfo.suyongaNumber);
          
          if (!possibleChk) {//함수 결과 신청 불가능
            return false;
          } else {//함수가 있고 신청이 가능
            this.fncSearchCustomer(true);
          }
        })();
      } else {//possibleApplyChk함수가 없을 경우
        this.fncSearchCustomer(true);
      }
    }
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
    if (!this.state.searchYN) {
      citizenAlert('수용가 정보를 정확히 조회해 주세요.')
      return false;
    }
    const suyongaInfo = this.state.suyongaInfo;
    if(!suyongaInfo.csGuCdNm){
      citizenAlert('수용가의 시군구가 없습니다. 수용가를 검색해 주세요.').then(result => {
        if(result){
          return false
        }
      })
    }
    if(!suyongaInfo.csOfficeCd){
      citizenAlert('수용가의 사업소코드가 없습니다. 수용가를 검색해 주세요.').then(result => {
        if(result){
          return false
        }
      })
    }
    
    let minwonCd = cyberMinwon.state.unityMinwon.state.minwonCd;
    if(!this.payMentInfo.paymentChk && (minwonCd === "B04" || minwonCd === "B05" || minwonCd === "I06" || minwonCd === "B08" || minwonCd ==="B14" || minwonCd ==="B19" || minwonCd ==="B25")){
      citizenAlert('체납 정보 확인을 체크해 주세요.')
      return false;
    }
    
    if(this.payMentInfo.paymentCnt > 0 && minwonCd ==="B05"){//급수설비 폐지 민원 신청 시 체납 내역이 있을 경우
      if(!this.payMentInfo.bankCd){
        citizenAlert('납부 내역 입력(은행명)을 선택해 주세요.');
        return false;
      }
      if(!this.payMentInfo.paidDt){
        citizenAlert('납부 내역 입력(납부일자)를 입력해 주세요.');
        return false;
      }
      if(!this.payMentInfo.paidAmount){
        citizenAlert('납부 내역 입력(납부금액)을 입력해 주세요.');
        return false;
      }
      if(this.payMentInfo.chargeFlag == 'N' ){
        $('#chargeFlag').focus()
        citizenAlert('납부확인을 체크해 주세요.');
        return false;
      }
    }
    return true;
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
    e.target.value = this.state.suyongaInfo.suyongaNumber.substring(0, 9);
  }

  // 수용가 이름 연동
  handleSuyongaName(e: any) {
    this.setState({
      ...this.state,
      suyongaInfo: {
        ...this.state.suyongaInfo,
        suyongaName: fncCutByByte(e.target.value, 150) // fncCutByByte(e.target.value, 40) e.target.value.substring(0,40)
      },
    });
    e.target.value = this.state.suyongaInfo.suyongaName;
  }
  
  handlePayWin(){
    const mkey = $("#owner_mkey").val();
    const minwonCd = cyberMinwon.state.unityMinwon.state.minwonCd;
    if(minwonCd === "B05"){
      $("#payMentEqpCheck").prop("checked", true);
    }
    popPayWin(mkey);
  }
  
  handlePaymentChk(e: any){
    if(e.target.checked){
      this.payMentInfo.paymentChk = true;
      $(".chargeFlag").show();
    } else {
      this.payMentInfo.paymentChk = false;
      $(".chargeFlag").hide();
    }
  }
  
  handleChargeFlag(e: any){
    if(e.target.checked){
      this.payMentInfo.chargeFlag = 'Y';
    } else {
      this.payMentInfo.chargeFlag = 'N';
    }
  }
  
  //은행명(bankCd, bankNm)관리
  handleBankCd(e:any) {
    this.payMentInfo.bankCd = e.target.value;
    this.payMentInfo.bankNm = $("#"+e.target.id+" option:selected").text();
  }
  
  //은행지점명(bankBranch)관리
  handleBankBranch(e:any) {
    this.payMentInfo.bankBranch = e.target.value.substring(0, 10);
    e.target.value = this.payMentInfo.bankBranch;
  }
  
  //납부일자(paidDt)관리
  handlePaidDt(e:any) {
    this.payMentInfo.paidDt = e.target.value;
    e.target.value = this.payMentInfo.paidDt;
  }
  
  //납부금액(paidAmount)관리
  handlePaidAmount(e:any) {
    this.payMentInfo.paidAmount = e.target.value.replace(/[^0-9]/g, "").substring(0, 9);
    e.target.value = numberWithCommas(this.payMentInfo.paidAmount);
  }
  
  handlePayMentEqp(){
    popPaymentCheck();
  }
  
  // 수용가 조회를 클릭했을 때 실행
  fncSearchCustomer(isMkey? : boolean) {
    // 콜백함수를 위해 context binding이 필요하다.
    const that = this;
    if (!this.state.suyongaInfo.suyongaName && !isMkey) {
      citizenAlert('수용가를 입력해 주세요').then(result => {
        if(result){
          $("#owner_ownerNm").select();
          $("#suyongaSearch").prop('disabled', false);
        }
      })
      return false;
    }

    if (!this.state.suyongaInfo.suyongaNumber) {
      citizenAlert('고객번호를 정확히 입력해 주세요').then(result => {
        if(result){
          $("#suyongaSearch").prop('disabled', false);
          $("#suyongaNumber").select();
        }
      })
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
        citizenAlert("고객번호(9자리 숫자) 또는 수용가명(사용자/소유자)를 정확히 입력해 주세요.").then(result => {
          if(result){
            $("#owner_ownerNm").focus();
          }
        });
        $("#suyongaSearch").prop('disabled', false);
        return;
      }

      if (data.result.status === 'FAILURE') {
        // 나중에 슬라이드 alert으로 변경
        citizenAlert("고객번호(9자리 숫자) 또는 수용가명(사용자/소유자)를 정확히 입력해 주세요.").then(result => {
          if(result){
            $("#owner_ownerNm").focus();
          }
        });
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
      if((hostName === "localhost" || hostName.indexOf('98.42.34.126') === 0 || hostName.indexOf('98.42.34.254') === 0 || hostName.indexOf('98.42.34.22') === 0 )){
        
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
          citizenAlert("서버가 응답하지 않습니다. 잠시 후 다시 조회해 주세요.").then(result => {
            if(result){
              $("#owner_ownerNm").focus();
            }
          });
          $("#suyongaSearch").prop('disabled', false);
          return;
        }
  
        if (data > 0 && minwonCd !== "A07" && minwonCd !== "A12") {
          citizenAlert('동일 수용가로 처리 중인 민원이 있습니다. 수용가(고객번호)를 확인해 주세요.').then(result => {
            if(result){
              $("#owner_mkey").focus();
            }
          });
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
        $("#owner_ownerNm").val('');
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
          wpMtrqlt: suyongaInfo.wpMtrqlt,
          insttSe: suyongaInfo.insttSe
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
            fncTrim(suyongaInfo['csAddr2']), '지번주소'],
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
      const oldMkey = sessionData?sessionData.mkey : '';
      const sessionAuth = sessionData?sessionData.authenticationInfo : '';
      const applicantInfo = sessionData?sessionData.applicantInfo : '';
      const privacyAgree = sessionData?sessionData.privacyAgree : false;
      const smsAgree = sessionData?sessionData.smsAgree : false;
      
      CyberMinwonStorage.setStorageData('Y', suyongaInfo.mkey, sessionAuth, applicantInfo, privacyAgree, smsAgree);
      //고객번호로 수용가 조회 후 이전 고객번호와 다르면 체납 초기화
      if(oldMkey == suyongaInfo.mkey){
        const sessionPay = CyberMinwonStorage.getStoragePay();
        if(sessionPay){
          this.payMentInfo = sessionPay;
        }
        if(minwonCd == "B05"){
          $(".chargeFlag").show();
        }
      }else{
        $("#paymentChk").prop("checked", false);
        $("#chargeFlag").prop("checked", false);
        this.payMentInfo = {
          paymentChk: false,
          paymentCnt: 0,
          //급수설비 폐지 요금납부 입력 정보
          chargeFlag: 'N',
          bankCd: '',
          bankNm: '',
          bankBranch: '',
          paidDt: '',
          paidAmount: '',
        }
        CyberMinwonStorage.removeItemPay();
      }
      if(minwonCd == "B14" || minwonCd === "B14_1"){
        (async() => {
          let possibleChk = await that.parent.parent.state.steps[minwonCd].step[1].setInitCheck()
          
          if (!possibleChk) {//함수 결과 신청 불가능
            that.setInit();
            that.setState({
              ...that.state,
              suyongaInfo: {
                ...that.state.suyongaInfo,
                suyongaNumber: suyongaInfo.mkey,
                csOfficeCd: suyongaInfo.csOfficeCd,
              }
            })
            $("#owner_ownerNm").val('')
            return false;
          } else {//함수가 있고 신청이 가능
            that.render();$("#owner_ownerNm").next("a").focus()
          }
        })();
      }else{
        that.render();$("#owner_ownerNm").next("a").focus()
      }
      
  }

  // InfoPanel 데이터 설정
  getSuyongaView() {
    return {
      suyongaView: {
        ...this.state.viewSuyongaInfo,
        title: '수용가 정보'
      }
    }
  }
  
  getSuyongaView2() {
    return {
      suyongaView: {
        ...this.state.viewSuyongaInfo2,
        title: '수용가 정보'
      }
    }
  }

  render() {
    const that = this;
    const minwonCd = cyberMinwon.state.unityMinwon.state.minwonCd;
    let template = `
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
                  <span class="form-req"><span class="sr-only">필수</span>수용가명</span></label>
                  <input value="${that.state.suyongaInfo.suyongaName || ''}"
                    onkeyup="${that.path}.handleSuyongaName(event)" 
                    onpaste="${that.path}.handleSuyongaName(event)"
                    onchange="${that.path}.handleSuyongaName(event)"`;
       if (that.state.searchYN){template +=' disabled '}
       template +=             
                    `type="text" id="owner_ownerNm" class="input-box input-w-2 owner_ownerNm" placeholder="수용가 이름">
                <a href="javascript:;" 
                   class="btn btnSS btnTypeA btnSingle"`;
                 template += that.state.searchYN ? 'id="suyongaModify" title="수용가변경"' : 'id="suyongaSearch" title="수용가 검색"';
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
    `;

    document.getElementById('suyonga')!.innerHTML = template;

    this.afterRender();
  }

  afterRender() {
    let that = this;
    // 데이터는 immutable 이기 때문에 랜더링 전에 데이터를 전달해야 한다.
    // 화면에 추가로 붙이는 부분들은 전체 화면이 그려진 후에 처리되어야 한다.
    // Info 패널을 그려준다.
    if (this.state.searchYN) {
      const $target = document.getElementById('suyongaInput');
      $target.innerHTML = $target.innerHTML + this.suyongaInfoPanel.render();
    }

    // 이벤트를 수동으로 등록해 준다.
    this.setEventListeners();
    
    //체납확인
    //cyberMinwon.state.unityMinwon.state.currentPage.suyongaInfo.state.searchYN
    //this= cyberMinwon.state.unityMinwon.state.currentPage.suyongaInfo
    let minwonCd = this.parent.parent.state.minwonCd;
    let mkey = this.state.suyongaInfo.mkey;
    if(mkey && this.state.searchYN && (minwonCd === "B04" || minwonCd === "B05" || minwonCd === "I06" || minwonCd === "B08" || minwonCd ==="B14" || minwonCd ==="B19" || minwonCd ==="B25"
     || minwonCd ==="B14_1" || minwonCd ==="B19_1" )){
      // || minwonCd ==="B18" 청구지 주소 변경은 해당 화면에서 처리
      
      //B04:확인 필수(체크 변수 Y 이후 진행)
      //B05:확인 필수(납부 확인:팝업-입력 후 진행)
      //B18(첫화면 없음 민원 내용 화면에 있음)
      let url = "/citizen/common/listProofPaymentByMgrNo.do?"
      let queryString = "mkey=" + mkey;
      
      fetch('GET', url, queryString, function (error: any, data: any) {
        
        // 에러가 발생한 경우
        if (error) {
          citizenAlert("서버가 응답하지 않습니다. 잠시 후 다시 조회해 주세요.");
          $("#suyongaSearch").prop('disabled', false);
          return;
        }
        let paymentCnt = parseInt(data.business.bodyVO.cnt);
//        cyberMinwon.state.unityMinwon.state.currentPage.suyongaInfo.payMentInfo.paymentCnt = paymentCnt;
        that.payMentInfo.paymentCnt = paymentCnt;
        let innerHtml = ""
        
        var UserAgent = navigator.userAgent;
        if(UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null 
                    || UserAgent.match(/LG|SAMSUNG|Samsung/) != null){ //모바일인 경우
          innerHtml = `
                        <li class="arrears">
                        <label for="" class="input-label-1"><span>체납 확인</span></label>
                            <div  id='sch-data-01' class='sch-data display-block row'>
                              <div class='sch-re'>
                                <table>
                                <caption><span class='blind'>체납 확인 결과 정보를 포함한 표</span></caption>
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
            that.payMentInfo.paymentChk = true;
            innerHtml += "<td colspan='3' style='text-align:center;''>체납사항이 없습니다.</td>";
          }
        }else{ //모바일이 아닌 경우
          innerHtml = `
                        <li class="arrears">
                        <label for="" class="input-label-1"><span>체납 확인</span></label>
                            <div  id='sch-data-01' class='sch-data display-block row'>
                              <div class='sch-re'>
                                <table>
                                <caption><span class='blind'>체납 확인 결과 정보를 포함한 표</span></caption>
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
            that.payMentInfo.paymentChk = true;
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
                            <input type='checkbox' id='paymentChk' onclick='${that.path}.handlePaymentChk(event);'>
                          <label class='chk-type' for='paymentChk'><span>체납 정보를 확인했습니다.</span></label>
                        </li>
                      `;
        }
        if(minwonCd === "B05" && paymentCnt > 0){
//          style='padding: 3px 0 3px 0px;'
          if(UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null 
                    || UserAgent.match(/LG|SAMSUNG|Samsung/) != null){ //모바일인 경우
          innerHtml += `
                        <li class='chargeFlag' style='display:none;'>
                          <label for="" class="input-label-1">
                            <span class="form-req"><span class="sr-only">필수</span>납부 내역 입력</span>
                          </label>
                          <div  id='sch-data-01' class='sch-data display-block row'>
                            <div class='sch-re type1'>
                              <table>
                                <colgroup>
                                  <col width='30%;'>
                                  <col width=''>
                                </colgroup>
                                <tr>
                                  <th scope='col'>은행명</th>
                                  <td>
                                    <select id="bankCd" title="은행명 선택" class="input-box input-w-0" onchange="${that.path}.handleBankCd(event);" ><option value="" selected="selected"></select>
                                  </td>
                                </tr>
                                <tr>
                                  <th scope='col'>지점명</th>
                                  <td>
                                    <input onkeyup="${that.path}.handleBankBranch(event)" onchange="${that.path}.handleBankBranch(event)" value="${that.payMentInfo.bankBranch}" type="text" id="bankBranch" class="input-box input-w-0"  placeholder="은행지점명" maxlength="7">
                                  </td>
                                </tr>
                                <tr>
                                  <th scope='col'>납부일자</th>
                                  <td>
                                    <input onchange="${that.path}.handlePaidDt(event)" value="${that.payMentInfo.paidDt}" type="date" id="paidDt" min="1000-01-01" max="2100-12-31" maxlength="10" class="input-box input-w-0 datepicker hasDatepicker" required="" data-placeholder="납부일자">
                                  </td>
                                </tr>
                                <tr>
                                  <th scope='col'>납부금액</th>
                                  <td>
                                    <input onkeyup="${that.path}.handlePaidAmount(event)" onchange="${that.path}.handlePaidAmount(event)" value="${numberWithCommas(that.payMentInfo.paidAmount)}" type="text" id="paidAmount" class="input-box input-w-0"  placeholder="납부금액" maxlength="50">
                                  </td>`;
                  }else{
                    innerHtml += `
                        <li class='chargeFlag' style='display:none;'>
                          <label for="" class="input-label-1">
                            <span class="form-req"><span class="sr-only">필수</span>납부 내역 입력</span>
                          </label>
                          <div  id='sch-data-01' class='sch-data display-block row'>
                            <div class='sch-re type1'>
                              <table>
                                <colgroup>
                                  <col width='15%;'>
                                  <col width=''>
                                  <col width='15%;'>
                                  <col width=''>
                                </colgroup>
                                <tr>
                                  <th scope='col'>은행명</th>
                                  <td>
                                    <select id="bankCd" title="은행명 선택" class="input-box input-w-0" onchange="${that.path}.handleBankCd(event);" ><option value="" selected="selected"></select>
                                  </td>
                                  <th scope='col'>지점명</th>
                                  <td>
                                    <input onkeyup="${that.path}.handleBankBranch(event)" onchange="${that.path}.handleBankBranch(event)" value="${that.payMentInfo.bankBranch}" type="text" id="bankBranch" class="input-box input-w-0"  placeholder="은행지점명" maxlength="7">
                                  </td>
                                </tr>
                                <tr>
                                  <th scope='col'>납부일자</th>
                                  <td>
                                    <input onchange="${that.path}.handlePaidDt(event)" value="${that.payMentInfo.paidDt}" type="date" id="paidDt" class="input-box input-w-0 datepicker hasDatepicker" min="1000-01-01" max="2100-12-31" maxlength="10" required="" data-placeholder="납부일자">
                                  </td>
                                  <th scope='col'>납부금액</th>
                                  <td>
                                    <input onkeyup="${that.path}.handlePaidAmount(event)" onchange="${that.path}.handlePaidAmount(event)" value="${numberWithCommas(that.payMentInfo.paidAmount)}" type="text" id="paidAmount" class="input-box input-w-0"  placeholder="납부금액" maxlength="50">
                                  </td>`
                  }
                   innerHtml += `</tr>
                              </table>
                            </div>
                          </div>
                          <p class="pre-star tip-blue">체납이 있는 경우에는 폐전 민원 신청이 불가합니다. 이미 납부하셨다면 납부 내역을 입력해 주세요.</p>
                        </li>
                        <li class='chargeFlag' style='display:none;'>
                            <label><span class='sr-only'>체납 확인</span></label>
                              <input type='checkbox' id='chargeFlag' onclick='${that.path}.handleChargeFlag(event);'>
                            <label class='chk-type' for='chargeFlag'> <span>납부확인(영수증 등 실물 확인을 한 경우 선택해 주세요.)</span></label>
                          </li>
                       `;
        }
        
        $("#suyongaInput").append(innerHtml);
        //은행 셀렉트 박스 셋팅
        fncSetComboByCodeList("bankCd", that.statusInfo.bankList);
        $("#bankCd option[value='']").remove();
        $("#bankCd").prepend("<option value='' selected='selected'>은행선택</option>");
        $("#bankCd").val(that.payMentInfo.bankCd).prop("selected", true);
        
        //체납 정보 확인 체크
        that.payMentInfo.paymentChk === true ? $("#paymentChk").prop("checked", true) :  $("#paymentChk").prop("checked", false);
        that.payMentInfo.paymentChk && minwonCd === "B05" ? $(".chargeFlag").show() : $(".chargeFlag").hide()
        //납부확인 체크(영수증 등)
        that.payMentInfo.chargeFlag === 'Y' ? $("#chargeFlag").prop("checked", true) :  $("#chargeFlag").prop("checked", false);
      });
    }
  }
}