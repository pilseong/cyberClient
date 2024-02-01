import { fetch } from './../util/unity_resource';
import { radioMW, citizenAlert, citizenConfirm, maskingFnc, numberWithCommas, clearObject } from './../util/uiux-common';
import CyberMinwon from '../infra/CyberMinwon';

declare var fncGetCodeByGroupCdUsing: (code: string) => string;
declare var fncSetComboByCodeList: (param1: string, param2: string) => void;
declare var gContextUrl: string;
declare var $: any;
declare var fncTrim: (str: string) => string;
declare var cyberMinwon: CyberMinwon;
declare var fncCutByByte: (str: string, maxByte: number) => string;
declare var mtk: any;
declare var initmTranskey: () => void;
declare var transkey: any;
declare var tk_origin: string;
declare var initTime: string;
export default class B10DetailPage {
  path: string;
  state: any;
  constructor(parent:any, minwonCd:any) {
    this.state = {
      minwonCd,
      parent,
      keypadInit: false,
      noticePresenceCheck: false, //수용가 번호의 과오납통지서 실제 유무 확인
      checkAcctGubun: false,
      isSubmitSuccessful: false,
      submitResult: {},
      statusInfo: {
    	  bankList: ""//은행 공통코드 리스트 객체
      },
      mgrNo: "",//함수에서 사용할 수용가 고객번호
      viewInfo: {//화면에서 보여주기만 하는 값들
    	  napgi: "",//납기(과오납반환통지서번호 조회 값)
    	  sunapDay: "",//납입년월일(과오납반환통지서번호 조회 값)
    	  sunapAmt: "",//기납부액(과오납반환통지서번호 조회 값)
    	  gojiAmt: "",//정상납부액(과오납반환통지서번호 조회 값)
    	  overAmt: "",//과오납금(과오납반환통지서번호 조회 값)
    	  overInt: "",//가산금액(과오납반환통지서번호 조회 값)
    	  settleAmt: "",//반환총액(과오납반환통지서번호 조회 값)
    	  
    	  totalMoney1: "",//고지금액(합계)
  		  totalMoney2: "",//고지금액(합계)
  		  totalMoney3: "",//고지금액(합계)
  		  totalMoney4: "",//고지금액(합계)
  		  totalMoney5: "",//고지금액(합계)
  		  submitbank1Nm: "",//은행명
  		  submitbank2Nm: "",//은행명
  		  submitbank3Nm: "",//은행명
  		  submitbank4Nm: "",//은행명
  		  submitbank5Nm: "",//은행명
  			  
  		  returnBankCdNm: "",//환급방법:계좌이체(은행명)
  		  returnAccountTypeNm: ""//환급방법:계좌이체(예금종류명)
      },
      requestInfo: {
    	  noticePresenceYn: "",//통지서유무
    	  noticeCheck: "",//통지서 확인 여부(:통지서 '있음' 선택 시 확인)
    	  noticeNo: "",
  		  returnWay: "",//환급방법
  		  returnBankCd: "",//환급방법:계좌이체(은행코드)
  		  returnAccountNo: "",//환급방법:계좌이체(계좌번호)
  		  returnAccountType: "",//환급방법:계좌이체(예금종류)
  		  returnAccountOwner: "",//환급방법:계좌이체(예금주)
  		  reason: "",//신청사유
      },
      noticeInfo: {
        payOver: "",//과오납금
        payDt1: "",//납기
        payDt2: "",//납기
        payDt3: "",//납기
        payDt4: "",//납기
        payDt5: "",//납기
        submitmoney1: "",//납부일자
        submitmoney2: "",//납부일자
        submitmoney3: "",//납부일자
        submitmoney4: "",//납부일자
        submitmoney5: "",//납부일자
        upwater1: "",//고지금액(상수도)
        upwater2: "",//고지금액(상수도)
        upwater3: "",//고지금액(상수도)
        upwater4: "",//고지금액(상수도)
        upwater5: "",//고지금액(상수도)
        downwater1: "",//고지금액(하수도)
        downwater2: "",//고지금액(하수도)
        downwater3: "",//고지금액(하수도)
        downwater4: "",//고지금액(하수도)
        downwater5: "",//고지금액(하수도)
        water1: "",//고지금액(물이용)
        water2: "",//고지금액(물이용)
        water3: "",//고지금액(물이용)
        water4: "",//고지금액(물이용)
        water5: "",//고지금액(물이용)
        submitbank1: "",//은행코드
        submitbank2: "",//은행코드
        submitbank3: "",//은행코드
        submitbank4: "",//은행코드
        submitbank5: "",//은행코드
        submitbankdown1: "",//은행지점명
        submitbankdown2: "",//은행지점명
        submitbankdown3: "",//은행지점명
        submitbankdown4: "",//은행지점명
        submitbankdown5: "",//은행지점명
        payment1: "",//납부금액
        payment2: "",//납부금액
        payment3: "",//납부금액
        payment4: "",//납부금액
        payment5: "",//납부금액
        etc1: "",//비고
        etc2: "",//비고
        etc3: "",//비고
        etc4: "",//비고
        etc5: "",//비고
      },
      description: {
      }
    };
    this.path = 'cyberMinwon.state.currentModule.state.currentPage';

    this.setInitValue();
  }

  // 초기값 설정
  setInitValue() {
    const that = this;
    that.setState({
      ...that.state,
      keypadInit: false,
      mgrNo: "",//함수에서 사용할 수용가 고객번호
      viewInfo: {//화면에서 보여주기만 하는 값들
        napgi: "",//납기(과오납반환통지서번호 조회 값)
        sunapDay: "",//납입년월일(과오납반환통지서번호 조회 값)
        sunapAmt: "",//기납부액(과오납반환통지서번호 조회 값)
        gojiAmt: "",//정상납부액(과오납반환통지서번호 조회 값)
        overAmt: "",//과오납금(과오납반환통지서번호 조회 값)
        overInt: "",//가산금액(과오납반환통지서번호 조회 값)
        settleAmt: "",//반환총액(과오납반환통지서번호 조회 값)
        
        totalMoney1: "",//고지금액(합계)
        totalMoney2: "",//고지금액(합계)
        totalMoney3: "",//고지금액(합계)
        totalMoney4: "",//고지금액(합계)
        totalMoney5: "",//고지금액(합계)
        submitbank1Nm: "",//은행명
        submitbank2Nm: "",//은행명
        submitbank3Nm: "",//은행명
        submitbank4Nm: "",//은행명
        submitbank5Nm: "",//은행명
          
        returnBankCdNm: "",//환급방법:계좌이체(은행명)
        returnAccountTypeNm: ""//환급방법:계좌이체(예금종류명)
      },
      requestInfo: {
        noticePresenceYn: "",//통지서유무
        noticeCheck: "",//통지서 확인 여부(:통지서 '있음' 선택 시 확인)
        noticeNo: "",
        returnWay: "",//환급방법
        returnBankCd: "",//환급방법:계좌이체(은행코드)
        returnAccountNo: "",//환급방법:계좌이체(계좌번호)
        returnAccountType: "",//환급방법:계좌이체(예금종류)
        returnAccountOwner: "",//환급방법:계좌이체(예금주)
        reason: "",//신청사유
      },
      noticeInfo: {
        payOver: "",//과오납금
        payDt1: "",//납기
        payDt2: "",//납기
        payDt3: "",//납기
        payDt4: "",//납기
        payDt5: "",//납기
        submitmoney1: "",//납부일자
        submitmoney2: "",//납부일자
        submitmoney3: "",//납부일자
        submitmoney4: "",//납부일자
        submitmoney5: "",//납부일자
        upwater1: "",//고지금액(상수도)
        upwater2: "",//고지금액(상수도)
        upwater3: "",//고지금액(상수도)
        upwater4: "",//고지금액(상수도)
        upwater5: "",//고지금액(상수도)
        downwater1: "",//고지금액(하수도)
        downwater2: "",//고지금액(하수도)
        downwater3: "",//고지금액(하수도)
        downwater4: "",//고지금액(하수도)
        downwater5: "",//고지금액(하수도)
        water1: "",//고지금액(물이용)
        water2: "",//고지금액(물이용)
        water3: "",//고지금액(물이용)
        water4: "",//고지금액(물이용)
        water5: "",//고지금액(물이용)
        submitbank1: "",//은행코드
        submitbank2: "",//은행코드
        submitbank3: "",//은행코드
        submitbank4: "",//은행코드
        submitbank5: "",//은행코드
        submitbankdown1: "",//은행지점명
        submitbankdown2: "",//은행지점명
        submitbankdown3: "",//은행지점명
        submitbankdown4: "",//은행지점명
        submitbankdown5: "",//은행지점명
        payment1: "",//납부금액
        payment2: "",//납부금액
        payment3: "",//납부금액
        payment4: "",//납부금액
        payment5: "",//납부금액
        etc1: "",//비고
        etc2: "",//비고
        etc3: "",//비고
        etc4: "",//비고
        etc5: "",//비고
      }
    });
  }
  
  // 납기 초기화
  setInitNoticeValue() {
    const that = this;
    that.setState({
      ...that.state,
      noticeInfo: {
        payOver: "",//과오납금
        payDt1: "",//납기
        payDt2: "",//납기
        payDt3: "",//납기
        payDt4: "",//납기
        payDt5: "",//납기
        submitmoney1: "",//납부일자
        submitmoney2: "",//납부일자
        submitmoney3: "",//납부일자
        submitmoney4: "",//납부일자
        submitmoney5: "",//납부일자
        upwater1: "",//고지금액(상수도)
        upwater2: "",//고지금액(상수도)
        upwater3: "",//고지금액(상수도)
        upwater4: "",//고지금액(상수도)
        upwater5: "",//고지금액(상수도)
        downwater1: "",//고지금액(하수도)
        downwater2: "",//고지금액(하수도)
        downwater3: "",//고지금액(하수도)
        downwater4: "",//고지금액(하수도)
        downwater5: "",//고지금액(하수도)
        water1: "",//고지금액(물이용)
        water2: "",//고지금액(물이용)
        water3: "",//고지금액(물이용)
        water4: "",//고지금액(물이용)
        water5: "",//고지금액(물이용)
        submitbank1: "",//은행코드
        submitbank2: "",//은행코드
        submitbank3: "",//은행코드
        submitbank4: "",//은행코드
        submitbank5: "",//은행코드
        submitbankdown1: "",//은행지점명
        submitbankdown2: "",//은행지점명
        submitbankdown3: "",//은행지점명
        submitbankdown4: "",//은행지점명
        submitbankdown5: "",//은행지점명
        payment1: "",//납부금액
        payment2: "",//납부금액
        payment3: "",//납부금액
        payment4: "",//납부금액
        payment5: "",//납부금액
        etc1: "",//비고
        etc2: "",//비고
        etc3: "",//비고
        etc4: "",//비고
        etc5: "",//비고
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
    var bankList = fncGetCodeByGroupCdUsing("007");
    var depositList = fncGetCodeByGroupCdUsing("005");
    that.setState({
      ...that.state,
      statusInfo: {
        bankList: bankList,
        depositList: depositList
      }
    });
  }

  // InfoPanel 데이터 설정
  getViewInfo() {
  	const that = this;
  	
  	var viewB10Detail:any = {};
  	viewB10Detail.noticePresenceYn = [this.state.requestInfo.noticePresenceYn == "Y" ? "있음" : "없음", "통지서유무"]
  	
  	if(that.state.requestInfo.noticePresenceYn == "Y"){//통지서가 있으면
  		viewB10Detail.noticeNo = [that.state.requestInfo.noticeNo, "통지서번호"]
  		viewB10Detail.napgi = [that.state.viewInfo.napgi, "납기"]
  		viewB10Detail.sunapDay = [that.state.viewInfo.sunapDay, "납입년월일"]
  		viewB10Detail.sunapAmt = [that.state.viewInfo.sunapAmt+" 원", "기납부액"]
  		viewB10Detail.gojiAmt = [that.state.viewInfo.gojiAmt+" 원", "정상납부액"]
  		viewB10Detail.overAmt = [that.state.viewInfo.overAmt+" 원", "과오납금"]
  		viewB10Detail.overInt = [that.state.viewInfo.overInt+" 원", "가산금액"]
  		viewB10Detail.settleAmt = [that.state.viewInfo.settleAmt+" 원", "반환총액"]
  	} else {//통지서가 없으면
  		viewB10Detail.payOver = [that.state.noticeInfo.payOver, "과오납금액"]
  		for(var i=1; i<6; i++){
  			if(that.state.noticeInfo["payDt"+i]){viewB10Detail["payDt"+i] = [that.state.noticeInfo["payDt"+i], "납기"+i]}
  			if(that.state.noticeInfo["submitmoney"+i]){viewB10Detail["submitmoney"+i] = [that.state.noticeInfo["submitmoney"+i], "납부일자"+i]}
  			if(that.state.noticeInfo["upwater"+i]){viewB10Detail["upwater"+i] = [that.state.noticeInfo["upwater"+i]+" 원", "고지금액(상수도)"+i]}
  			if(that.state.noticeInfo["downwater"+i]){viewB10Detail["downwater"+i] = [that.state.noticeInfo["downwater"+i]+" 원", "고지금액(하수도)"+i]}
  			if(that.state.noticeInfo["water"+i]){viewB10Detail["water"+i] = [that.state.noticeInfo["water"+i]+" 원", "고지금액(물이용)"+i]}
  			if(that.state.viewInfo["totalMoney"+i]){viewB10Detail["totalMoney"+i] = [that.state.viewInfo["totalMoney"+i]+" 원", "고지금액(합계)"+i]}
  			if(that.state.viewInfo["submitbank"+i+"Nm"]){viewB10Detail["submitbank"+i+"Nm"] = [that.state.viewInfo["submitbank"+i+"Nm"], "은행명"+i]}
  			if(that.state.noticeInfo["submitbankdown"+i]){viewB10Detail["submitbankdown"+i] = [that.state.noticeInfo["submitbankdown"+i], "은행지점명"+i]}
  			if(that.state.noticeInfo["payment"+i]){viewB10Detail["payment"+i] = [that.state.noticeInfo["payment"+i]+" 원", "납부금액"+i]}
  			if(that.state.noticeInfo["etc"+i]){viewB10Detail["etc"+i] = [that.state.noticeInfo["etc"+i], "비고"+i]}
  		}
  	}
  	viewB10Detail.returnWay = [that.state.requestInfo.returnWay, "환급방법"]
  	if(that.state.requestInfo.returnWay == "계좌이체"){
  		viewB10Detail.returnBankCdNm = [that.state.viewInfo.returnBankCdNm, "환급 은행"]
  		viewB10Detail.returnAccountNo = [maskingFnc.account(that.state.requestInfo.returnAccountNo,'*',6), "환급 계좌번호"]
  		//viewB10Detail.returnAccountTypeNm = [that.state.viewInfo.returnAccountTypeNm, "환급 계좌 예금종류"]  // 2023.04.24. 예금종류 삭제 요청
  		viewB10Detail.returnAccountOwner = [maskingFnc.name(that.state.requestInfo.returnAccountOwner,'*'), "환급 계좌 예금주"]
  	}
  	
  	viewB10Detail.reason = [that.state.requestInfo.reason, "신청사유"]
  	
  	
  	
  	var returnObj = {viewB10Detail}
    return returnObj ;
  }
  
  // 결과 뷰를 세팅하는 함수. 여기서 반환된 결과가 ResultPage에 표시된다.
  getResultView() {
    const infoData: any = {};
    const applyNm = this.state.parent.state.applicationPage.getSuyongaQueryString()['cvplInfo.cvpl.applyNm'];
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

  setState(nextState:any) {
    this.state = nextState;
  }

  setEventListeners() {
  }

  // 입력사항 검증 로직
  verify() {
    const requestInfo = this.state.requestInfo;
    const noticeInfo = this.state.noticeInfo;
    
    
    if(requestInfo.noticePresenceYn == "Y"){//과오납금 반환 통지서가 있을 경우
    	if(requestInfo.noticeCheck != "Y"){
        citizenAlert("통지서 번호를 확인하십시오.").then(result => {
          if(result){
            $("#noticeNo").focus();
          }
        });
      return false;
    	}
    } else {//과오납금 반환 통지서가 없을 경우
    	var payDtCnt=0;
    	for(var i=1; i<6; i++){
    		if(noticeInfo["upwater"+i] || noticeInfo["downwater"+i] || noticeInfo["water"+i]){
    			if(!noticeInfo["payDt"+i]){
            citizenAlert(i+"번째 납기일을 입력해 주세요.").then(result => {
              if(result){
                $("#payDt"+i).focus();
              }
            });
    				return false;
    			}
    			if(!noticeInfo["submitmoney"+i]){
            citizenAlert(i+"번째 납기내역 납부일자를 입력해 주세요.").then(result => {
              if(result){
                $("#submitmoney"+i).focus();
              }
            });
    				return false;
    			}
    			if(!noticeInfo["upwater"+i]){
            citizenAlert(i+"번째 납기 고지금액(상수도)을 입력해 주세요.").then(result => {
              if(result){
                $("#upwater"+i).focus();
              }
            });
            return false;
    			}
    			if(!noticeInfo["downwater"+i]){
            citizenAlert(i+"번째 납기 고지금액(하수도)을 입력해 주세요.").then(result => {
              if(result){
                $("#downwater"+i).focus();
              }
            });
            return false;
    			}
    			if(!noticeInfo["water"+i]){
            citizenAlert(i+"번째 납기 고지금액(물이용)을 입력해 주세요.").then(result => {
              if(result){
                $("#water"+i).focus();
              }
            });
            return false;
    			}
    			if(!noticeInfo["submitbank"+i]){
            citizenAlert(i+"번째 납기 은행을 선택해 주세요.").then(result => {
              if(result){
                $("#submitbank"+i).focus();
              }
            });
            return false;
    			}
    			if(!noticeInfo["submitbankdown"+i]){
            citizenAlert(i+"번째 납기 은행지점명을 입력해 주세요.").then(result => {
              if(result){
                $("#submitbankdown"+i).focus();
              }
            });
            return false;
    			}
    			if(!noticeInfo["payment"+i]){
            citizenAlert(i+"번째 납기 납부 금액을 입력해 주세요.").then(result => {
              if(result){
                $("#payment"+i).focus();
              }
            });
            return false;
    			}
    			payDtCnt++;
    		}
    	}
    	if(payDtCnt < 1){
        citizenAlert("납기 내용은 1개 이상 입력해 주세요.").then(result => {
          if(result){
            $("#payDt2").focus();
          }
        });
        return false;
    	}
    }
    
    if($("#bGubun1").hasClass("on")){//환급방법(returnWay:계좌이체)일 경우
    	if(!requestInfo.returnBankCd){
        citizenAlert("환급받을 계좌의 은행을 선택해 주세요.").then(result => {
          if(result){
            $("#returnBankCd").focus();
          }
        });
        return false;
    	}
    	if(!$("#n_account_no_new").val()){//n_account_no_new
        citizenAlert("환급받을 계좌번호를 입력해 주세요.").then(result => {
          if(result){
            $("#n_account_no_new").focus();
          }
        });
        return false;
    	}
    	/* 2023.04.24. 예금종류 삭제 요청
    	if(!requestInfo.returnAccountType){
        citizenAlert("환급받을 계좌의 예금종류를 입력해 주세요.").then(result => {
          if(result){
            $("#returnAccountType").focus();
          }
        });
        return false;
    	}
    	*/
    	if(!requestInfo.returnAccountOwner){
        citizenAlert("환급받을 계좌의 예금주를 입력해 주세요.").then(result => {
          if(result){
            $("#returnAccountOwner").focus();
          }
        });
        return false;
    	}
    	if(!this.state.checkAcctGubun){
        citizenAlert("계좌확인을 해주세요.");
        return false;
      }
    }
    
    if(!requestInfo.reason){
      citizenAlert("신청사유를 입력해 주세요.").then(result => {
          if(result){
            $("#reason").focus();
          }
        });
        return false;
    }
    
    return true;
  }
  
  //신청 구분에 따른 UI 활성화(id, class, display-none:true 아이디, display-none:false 클래스)
  toggleUIGubun(opt:string, gubun:string, selLayer:string, layer:string) {
	  
	  radioMW(opt, gubun);
	  $(layer).addClass("display-none");
	  $(selLayer).removeClass("display-none");
	  
	  if(opt == "#aGubun1"){
		  this.setInitNoticeValue();
		  for(let key in this.state.noticeInfo){
        $("#"+key).val("")
      }
      this.state.viewInfo.totalMoney1 = "";//고지금액1(합계)
      this.state.viewInfo.totalMoney2 = "";//고지금액2(합계)
      this.state.viewInfo.totalMoney3 = "";//고지금액3(합계)
      this.state.viewInfo.totalMoney4 = "";//고지금액4(합계)
      this.state.viewInfo.totalMoney5 = "";//고지금액5(합계)
      $("#totalMoney1").val("");
      $("#totalMoney2").val("");
      $("#totalMoney3").val("");
      $("#totalMoney4").val("");
      $("#totalMoney5").val("");
		  this.state.requestInfo.noticePresenceYn = "Y" //통지서유무에 값입력
	  }else if(opt == "#aGubun2"){
		  this.setState({
		      ...this.state,
		      requestInfo: {
		        ...this.state.requestInfo,
		        noticePresenceYn: "N"//통지서유무에 값입력
		      }
		    });
	  }else {
      var returnWay = $(opt).text();
      if(returnWay == '계좌이체'){
        initmTranskey();
      }
      this.setState({
          ...this.state,
          requestInfo: {
            ...this.state.requestInfo,
            returnWay: returnWay,//환급방법에 값입력
          }
        });
    }
  }
  
  //통지서번호(noticeNo)관리
  handleNoticeNo(e:any) {
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        [e.target.id]: e.target.value.replace(/[^0-9]/g, "")
      }
    });      
    e.target.value = this.state.requestInfo[e.target.id]
  }
  
  //통지서 '없음' 청구내역 추가 입력칸 생성 함수
  handleBillList(){
	  var j=1;
	  for(var i=1; i<6; i++){
		  if($("#bill"+i).is(":visible")){
			  j++;
		  }
	  }
	  if(j == 5){ $("#handleBillBtn").hide()};
	  $("#bill"+j).show();
  }
  
  //납기,납부일자 관리 함수
  handleDate(e:any) {
	  this.setState({
	      ...this.state,
	      noticeInfo: {
	        ...this.state.noticeInfo,
	        [e.target.id]: e.target.value//파라미터로 가져온 id를 key값으로 사용
	      }
	    });
	  }
  
  //상수도금액,하수도금액,물이용금액 관리 및 고지금액(합계)입력 함수
  handleAmt(e:any) {
	  this.setState({
	      ...this.state,
	      noticeInfo: {
	        ...this.state.noticeInfo,
	        [e.target.id]: numberWithCommas(e.target.value.replace(/[^0-9]/g, "").substring(0, 10))
	      }
	    });
	  	e.target.value = this.state.noticeInfo[e.target.id]
	  	
	  	// 고지금액(합계)입력 
	  	var index = e.target.id.slice(-1);
	  	var upwater = !this.state.noticeInfo["upwater"+index] ? 0 : parseInt(this.state.noticeInfo["upwater"+index].replace(/[^0-9]/g, ""));
	  	var downwater = !this.state.noticeInfo["downwater"+index] ? 0 : parseInt(this.state.noticeInfo["downwater"+index].replace(/[^0-9]/g, ""));
	  	var water = !this.state.noticeInfo["water"+index] ? 0 : parseInt(this.state.noticeInfo["water"+index].replace(/[^0-9]/g, ""));
	  	var totalMoney = String(upwater+downwater+water);
	  	this.setState({
		      ...this.state,
		      viewInfo: {
		        ...this.state.viewInfo,
		        ["totalMoney"+index]: numberWithCommas(totalMoney)
		      }
		    });
	  	$("#totalMoney"+index).val(numberWithCommas(totalMoney))
	  }
  
  //납부금액(payment)관리 및 과오납금(payOver)입력
  handlePayment(e:any) {
	  this.setState({
		  ...this.state,
		  noticeInfo: {
			  ...this.state.noticeInfo,
			  [e.target.id]: numberWithCommas(e.target.value.replace(/[^0-9]/g, ""))
		  }
	  });
	  e.target.value = this.state.noticeInfo[e.target.id]
	  
	  // 고지금액(합계)입력 
	  var payment1 = !this.state.noticeInfo.payment1 ? 0 : parseInt(this.state.noticeInfo.payment1.replace(/[^0-9]/g, ""));
	  var payment2 = !this.state.noticeInfo.payment2 ? 0 : parseInt(this.state.noticeInfo.payment2.replace(/[^0-9]/g, ""));
	  var payment3 = !this.state.noticeInfo.payment3 ? 0 : parseInt(this.state.noticeInfo.payment3.replace(/[^0-9]/g, ""));
	  var payment4 = !this.state.noticeInfo.payment4 ? 0 : parseInt(this.state.noticeInfo.payment4.replace(/[^0-9]/g, ""));
	  var payment5 = !this.state.noticeInfo.payment5 ? 0 : parseInt(this.state.noticeInfo.payment5.replace(/[^0-9]/g, ""));

	  var payOver = payment1+payment2+payment3+payment4+payment5;
	  this.setState({
		  ...this.state,
		  noticeInfo: {
			  ...this.state.noticeInfo,
			  payOver: numberWithCommas(String(payOver))
		  }
	  });
	  $("#payOver").val(numberWithCommas(String(payOver)))
  }
  
  //은행명(submitbank)관리
  handleSelectBox(e:any) {
	  if(e.target.id.replace(/[0-9]/g, "") == "submitbank"){
      this.setState({
            ...this.state,
            noticeInfo: {
              ...this.state.noticeInfo,
              [e.target.id]: e.target.value,
            },
            viewInfo: {
              ...this.state.viewInfo,
              [e.target.id+"Nm"]: $("#"+e.target.id+" option:selected").text()
            }
      });
    }else{
      this.setState({
            ...this.state,
            checkAcctGubun: false,
            requestInfo: {
              ...this.state.requestInfo,
              [e.target.id]: e.target.value,
            },
            viewInfo: {
              ...this.state.viewInfo,
              [e.target.id+"Nm"]: $("#"+e.target.id+" option:selected").text()
            }
      });
    }
	
  }
  
  //은행지점명(submitbankdown)관리
  handleSubmitbankdown(e:any) {
	  this.setState({
		  ...this.state,
		  noticeInfo: {
			  ...this.state.noticeInfo,
			  [e.target.id]: e.target.value.substring(0, 7)
		  }
	  });      
	  e.target.value = this.state.noticeInfo[e.target.id]
  }
  
  //비고(etc)관리
  handleEtc(e:any) {
	  this.setState({
		  ...this.state,
		  noticeInfo: {
			  ...this.state.noticeInfo,
			  [e.target.id]: e.target.value.substring(0, 7)
		  }
	  });      
	  e.target.value = this.state.noticeInfo[e.target.id]
  }
  
  //신청사유
  handleReason(e:any) {
	  this.setState({
	      ...this.state,
	      requestInfo: {
	        ...this.state.requestInfo,
	        reason: fncCutByByte(e.target.value, 290)
	      }
	    });
	    e.target.value = this.state.requestInfo.reason
	  }
  
  //환급 계좌번호
  handleReturnAccountNo(e:any) {
	  this.setState({
	      ...this.state,
	      checkAcctGubun: false,
	      requestInfo: {
	        ...this.state.requestInfo,
	        [e.target.id]: e.target.value.replace(/[^0-9]/g, "").substring(0, 29)
	      }
	    });
	  e.target.value = this.state.requestInfo[e.target.id]
  }
  
  //환급 계좌번호(예금주)
  handleReturnAccountOwner(e:any) {
	  this.setState({
		  ...this.state,
		  checkAcctGubun: false,
		  requestInfo: {
			  ...this.state.requestInfo,
			  [e.target.id]: e.target.value.substring(0, 12)
		  }
	  });
	  e.target.value = this.state.requestInfo[e.target.id]
  }
 
  
  //과오납반환 통지서 번호 조회함수
  loadOverInfo() {
	  const that = this;
	  var mgrNo = this.state.mgrNo
	  var refundNo = $("#noticeNo").val();
	  if(refundNo.length != 13){
			citizenAlert("과오납반환 통지서 번호는 열세자리입니다. 확인하시고 다시 입력해 주세요");
			return false;
		 }
	  
	  $.ajax({
			url : "/citizen/common/exchangeSearchOverInfoParam.do",
			type : 'post',
			async : false,
			data : {"mkey":mgrNo, "refundNo":refundNo},
			dataType : 'json',
			error : function(xhr:any, status:any, error:any){
				citizenAlert(error);
			},
			success : function(data:any){
				if(data.business == ""){
					var str = "<tr><td class='col-tool'><span>검색결과가 없습니다. 과오납반환통지서번호를 확인하여 주십시오.</span></td></tr>";
					$('#noticeTable tbody').html(str);
					that.setState({
					      ...that.state,
					      requestInfo: {
					        ...that.state.requestInfo,
					        noticeCheck: ""//통지서 확인 못한걸로
					      }
					    });
				}
				else {
					var noticeData = data.business.bodyVO;
					var napgi = noticeData.napgi.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3');
					var sunapDay = noticeData.sunapDay.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3');
					var sunapAmt = numberWithCommas(noticeData.sunapAmt);
					var gojiAmt = numberWithCommas(noticeData.gojiAmt);
					var overAmt = numberWithCommas(noticeData.overAmt);
					var overInt = numberWithCommas(noticeData.overInt);
					var settleAmt = numberWithCommas(noticeData.settleAmt);
					
					var str = "<tr>";
						str += "	<td>";
						str += "		<span class='sch--re-info' style='font-weight:bold;'>납기 : </span>";
						str += "		<span class='sch--re-info'>"+napgi+"</span>";
						str += "    <span class='sch--re-info' style='font-weight:bold;'>납입년월일 : </span>";
						str += "		<span class='sch--re-info'>"+sunapDay+"</span><br>";
						str += "    <span class='sch--re-info txBlue' style='font-weight:bold;'>기납부액 : </span>";
						str += "		<span class='sch--re-info txBlue'>"+sunapAmt+"원</span>";
						str += "    <span class='sch--re-info txBlue' style='font-weight:bold;'>정상납부액 : </span>";
						str += "		<span class='sch--re-info txBlue'>"+gojiAmt+"원</span><br>";
						str += "    <span class='sch--re-info txOrange' style='font-weight:bold;'>과오납금 : </span>";
						str += "		<span class='sch--re-info txOrange'>"+overAmt+"원</span>";
						str += "    <span class='sch--re-info txOrange' style='font-weight:bold;'>가산금액 : </span>";
						str += "		<span class='sch--re-info txOrange'>"+overInt+"원</span>";
						str += "    <span class='sch--re-info txRed' style='font-weight:bold;'>반환총액 : </span>";
						str += "		<span class='sch--re-info txRed'>"+settleAmt+"원</span>";
						str += "	</td>";
						str += "</tr>";
					$('#noticeTable tbody').html(str);
					that.setState({
					      ...that.state,
					      requestInfo: {
					        ...that.state.requestInfo,
					        noticeCheck: "Y",//통지서 확인 값 입력
					        noticeNo: refundNo//통지서 번호
					      },
					      viewInfo: {
					    	  ...that.state.viewInfo,
					    	  napgi: napgi,//납기
					    	  sunapDay: sunapDay,//납입년월일
					    	  sunapAmt: sunapAmt,//기납부액
					    	  gojiAmt: gojiAmt,//정상납부액
					    	  overAmt: overAmt,//과오납금
					    	  overInt: overInt,//가산금액
					    	  settleAmt: settleAmt//반환총액
					      }
					    });
				}
			}
	 });
  }
  
  //자동납부 계좌정보 가져오기 함수
  loadAccInfo(){
	  const that = this;
	  var mgrNo = this.state.mgrNo;
	  var url = "/citizen/common/exchangeAuotNabuAcctInfoSearchParam.do";

	 $.ajax({
			url : url,
 			type : 'post',
 			async : false,
			data : {"mkey":mgrNo},
 			dataType : 'json',
			error : function(xhr:any, status:any, error:any){
				citizenAlert(error);
			},
			success : function(data:any){
        if(data.result.status === "SUCCESS"){
          var str = data.business.bodyVO;
          $('#returnBankCd').val(str.bankCd).prop("selected",true);
          $('#n_account_no_new').val(str.acctNo);
          $('#returnAccountOwner').val(str.acctOwner);
          that.setState({
            ...that.state,
            checkAcctGubun: false,
            requestInfo: {
            ...that.state.requestInfo,
            returnBankCd: str.bankCd,
            returnAccountNo: str.acctNo,
            returnAccountOwner: str.acctOwner
            },
            viewInfo: {
              ...that.state.viewInfo,
              returnBankCdNm: $("#returnBankCd option:selected").text()
            }
          });
        }else{
          citizenAlert("자동납부 계좌정보가 없습니다.");
        }
				
			}
	 });
  }
  
  //계좌확인 함수
  checkAcct(){
    const that = this;
    mtk.fillEncData();
    
    const $bankAccountNumber = document.getElementById('n_account_no_new')! as HTMLInputElement;
    const bankAccountNumber = $bankAccountNumber.value;
    
  	var argBankNm = $("#returnBankCd option:selected").text(); //은행명
  	var argBankCd = $("#returnBankCd option:selected").val();//은행코드
//  	var argAcctNo = $("#returnAccountNo").val();//계좌번호
  	var argOwner = $("#returnAccountOwner").val();//예금주성명
  
  	if (fncTrim(argBankCd) == "" || argBankCd == "000") {
  		citizenAlert("은행 선택이 안되었습니다.");
  		return false;
  	}
  
  	if (!bankAccountNumber) {
  		citizenAlert("계좌번호를 입력 바랍니다.");
  		$("#n_account_no_new").select();
  		return false;
  	}
  
  	if (fncTrim(argOwner) == "") {
  		citizenAlert("예금주를 입력 바랍니다.");
  		$("#"+argOwner).select();
  		return false;
  	}
    
  	//농협중앙 - 계좌자리수 14인경우, 계좌자리수가 13이면서 끝자리가 3,4,7,8,9  인경우 오류메세지
  	if(argBankCd == "011"){
  		if(bankAccountNumber.length == 14){
  			citizenAlert("농협(중앙)에 해당되는 계좌가 아닙니다.\n확인하시고 다시 선택바랍니다.");
  			$("#returnAccountNo").focus();
  			return;
  		}
  
  		if(bankAccountNumber.length == 13){
  			var endDigit = bankAccountNumber.substring(12,13);
  			if(endDigit == "3" || endDigit == "4" || endDigit == "5" || endDigit == "7"){
  				citizenAlert("농협(중앙)에 해당되는 계좌가 아닙니다.\n확인하시고 다시 선택바랍니다.");
  				$("#returnAccountNo").focus();
  				return;
  			}
  
  			if(endDigit == "8" || endDigit == "9"){
  				citizenAlert("신청할 수 없는 계좌번호입니다.\n확인하시고 다시 선택바랍니다.");
  				$("#returnAccountNo").focus();
  				return;
  			}
  
  		}
  	}
  
  	//농협단위 - 계좌자리수 11or 12인경우, 계좌자리수가 13이면서 끝자리가 1,2,6,8,9 인경우 오류메세지
  	if(argBankCd == "012"){
  		if(bankAccountNumber.length == 11 || bankAccountNumber.length == 12){
  			citizenAlert("농협(단위)에 해당되는 계좌가 아닙니다.\n확인하시고 다시 선택바랍니다.");
  			$("#returnAccountNo").focus();
  			return;
  		}
  
  		if(bankAccountNumber.length == 13){
  			var endDigit = bankAccountNumber.substring(12,13);
  			if(endDigit == "1" || endDigit == "2" || endDigit == "6"){
  				citizenAlert("농협(단위)에 해당되는 계좌가 아닙니다.\n확인하시고 다시 선택바랍니다.");
  				$("#returnAccountNo").focus();
  				return;
  			}
  
  			if(endDigit == "8" || endDigit == "9"){
  				citizenAlert("신청할 수 없는 계좌번호입니다.\n확인하시고 다시 선택바랍니다.");
  				$("#returnAccountNo").focus();
  				return;
  			}
  
  		}
  
  	}
  	$(".contents-mw").append('<div class="Modal"></div>');
    $(".Modal").append('<div><h1 style="color: white; font-size: 24px;">계좌 확인중<br/>기다려 주세요</h1></div>');
    //임시
    const hostName = location.hostname;
//    if(hostName === "localhost"){
    if((hostName === "localhost" || hostName.indexOf('98.42.34.126') === 0 || hostName.indexOf('98.42.34.22') === 0 )){
      that.setState({
        ...that.state,
        checkAcctGubun : true,
        requestInfo : {
          ...that.state.requestInfo,
          returnAccountNo : bankAccountNumber
        }
      });
      $(".Modal").remove();
      citizenAlert("사용가능한 계좌로 확인되었습니다.");
      return;
    }
  	var queryString = "bankCd=" + argBankCd + "&bankNm="+ argBankNm + "&acctNo=" + bankAccountNumber + "&acctOwner=" + argOwner;
   	var url = '/citizen/common/checkAcctNo.do';
  
   	$.ajax({
  		url:url,
  		type:'post',
  		async:false,
  		data:queryString,
  		dataType:'json',
      error: function(xhr:any, status:any, error:any){
        $(".Modal").remove();
          citizenAlert(error);
      },
      success : function(data:any){
        $(".Modal").remove();
      	var resultCode = data.resultCode;
      	var resultName = data.resultName;

      	if(resultCode == "1"){
      		citizenAlert("사용가능한 계좌로 확인되었습니다.");
          that.setState({
            ...that.state,
            checkAcctGubun: true,
            requestInfo: {
            ...that.state.requestInfo,
            returnAccountNo : bankAccountNumber//반환계좌
            }
          });
      	}else{
      		if(resultCode == "2" && resultCode != ""){
      			citizenConfirm('예금주명이 일치하지 않습니다.\n은행에서 전송해온 예금주명을 사용하시겠습니까?').then(result => {
              $("#returnAccountOwner").focus();
            	if(!result){
                return false;
              }
            	$("#returnAccountOwner").val(resultName);
                that.setState({
                  ...that.state,
                  checkAcctGubun: true,
                  requestInfo: {
                  ...that.state.requestInfo,
                  returnAccountOwner: resultName//반환계좌 예금주명
                  }
                });
            });
      		}else{
      			citizenAlert("은행에 등록된 계좌정보와 일치하지 않거나 사용불가능한 계좌입니다.\n확인하시기 바랍니다.");
      		}
      	}
      }
 	  });
}
  // 계좌번호 onclick 호출
  saveEncryptedAccountNumber() {
  const $n_account_no_new = document.getElementById('n_account_no_new') as HTMLInputElement;
    const id = 'n_account_no_new';
    var values = mtk.inputFillEncData($n_account_no_new); // 예) document.getElementById("n_account_no_new")
    var hidden = values.hidden;
    var hmac = values.hmac;
    var keyboardType = transkey[id].keyboard;
    var keyIndex = transkey[id].keyIndex;
    var fieldType = transkey[id].fieldType;
    var $seedKey = document.getElementById("seedKey") as HTMLInputElement;
    var seedKey = $seedKey ? $seedKey.value : '';  
    
//    console.log("id=" + id + "&transkey_" + id + "_=" + hidden + 
//      "&transkey_HM_" + id + "_=" + hmac + "&keyboardType_" + id + "_=" + keyboardType + 
//      "&keyIndex_" + id + "_=" + keyIndex + "&fieldType_" + id + "_=" + fieldType + 
//      "&seedKey_=" + seedKey + "&initTime_=" + initTime + "&hidfrmId=" + tk_origin);    
    
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
      },
      transkeyInfo: {
        id,
        values,
        hidden,
        // hmac은 nested object라서 string으로 강제 변경함(가이드에서 
        // 객체를 string으로 대입하는 방식을 그대로 이용함)
        hmac: "" + hmac,
        keyboardType,
        keyIndex,
        fieldType,
        seedKey,
        initTime
      }
    });
    
  }
  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyOvpmtRefn.do";
    var formMtrAthrzObjc = new FormData();//ChrgeObjcVO chrgeObjcVO
    const sendData = this.getQueryString();
    for(let key in sendData){
      formMtrAthrzObjc.append(key, sendData[key]);
    }
    

    fetch('POST', url, sendData, function (error:any, data:any) {
      // 에러가 발생한 경우
      if (error) {
        citizenAlert(that.state.description.minwonNm+"가 정상적으로 처리되지 않았습니다.");
        return;
      }
      that.setState({
        ...that.state,
        isSubmitSuccessful: data.resultCd === '00' ? true : false,
        submitResult: data
      });

      cyberMinwon.setResult(that.state.description.minwonNm, that, 'getResultView');
      that.state.noticePresenceCheck = false;
    });
  }

  getQueryString() {
  	const requestInfo = this.state.requestInfo;
  	const noticeInfo = this.state.noticeInfo;
  	const transkeyInfo = this.state.transkeyInfo;
    
    let requestData:any;
   
    requestData = {
    	'noticePresenceYn'      : requestInfo.noticePresenceYn,
      'noticeNo'              : requestInfo.noticeNo,
      'submitbank1'           : noticeInfo.submitbank1,
      'submitbank2'           : noticeInfo.submitbank2,
      'submitbank3'           : noticeInfo.submitbank3,
      'submitbank4'           : noticeInfo.submitbank4,
      'submitbank5'           : noticeInfo.submitbank5,
      'submitbankdown1'       : noticeInfo.submitbankdown1,
      'submitbankdown2'       : noticeInfo.submitbankdown2,
      'submitbankdown3'       : noticeInfo.submitbankdown3,
      'submitbankdown4'       : noticeInfo.submitbankdown4,
      'submitbankdown5'       : noticeInfo.submitbankdown5,
      'etc1'                  : noticeInfo.etc1,
      'etc2'                  : noticeInfo.etc2,
      'etc3'                  : noticeInfo.etc3,
      'etc4'                  : noticeInfo.etc4,
      'etc5'                  : noticeInfo.etc5,
      'returnWay'             : requestInfo.returnWay,
      'returnBankCd'          : requestInfo.returnBankCd,
      'returnAccountNo'       : requestInfo.returnAccountNo,
      'returnAccountType'     : requestInfo.returnAccountType,
      'returnAccountOwner'    : requestInfo.returnAccountOwner,
      'reason'                : requestInfo.reason
    }
   /*
    requestData = {
    	'id': transkeyInfo.id, 
      'transkey_n_account_no_new_':       transkeyInfo.hidden,
      'transkey_HM_n_account_no_new_':    transkeyInfo.hmac,
      'keyboardType_n_account_no_new_':   transkeyInfo.keyboardType,
      'keyIndex_n_account_no_new_':       transkeyInfo.keyIndex,
      'fieldType_n_account_no_new_':      transkeyInfo.fieldType,
      'seedKey_':                         transkeyInfo.seedKey,
      'initTime_':                        transkeyInfo.initTime,
      'hidfrmId':                         tk_origin,
    	'noticePresenceYn'      : requestInfo.noticePresenceYn,
      'noticeNo'              : requestInfo.noticeNo,
      'submitbank1'           : noticeInfo.submitbank1,
      'submitbank2'           : noticeInfo.submitbank2,
      'submitbank3'           : noticeInfo.submitbank3,
      'submitbank4'           : noticeInfo.submitbank4,
      'submitbank5'           : noticeInfo.submitbank5,
      'submitbankdown1'       : noticeInfo.submitbankdown1,
      'submitbankdown2'       : noticeInfo.submitbankdown2,
      'submitbankdown3'       : noticeInfo.submitbankdown3,
      'submitbankdown4'       : noticeInfo.submitbankdown4,
      'submitbankdown5'       : noticeInfo.submitbankdown5,
      'etc1'                  : noticeInfo.etc1,
      'etc2'                  : noticeInfo.etc2,
      'etc3'                  : noticeInfo.etc3,
      'etc4'                  : noticeInfo.etc4,
      'etc5'                  : noticeInfo.etc5,
      'returnWay'             : requestInfo.returnWay,
      'returnBankCd'          : requestInfo.returnBankCd,
      'returnAccountNo'       : requestInfo.returnAccountNo,
      'returnAccountType'     : requestInfo.returnAccountType,
      'returnAccountOwner'    : requestInfo.returnAccountOwner,
      'reason'                : requestInfo.reason
    }
    */
    if(requestInfo.returnWay == "계좌이체"){
      requestData['id']                             = transkeyInfo.id;
      requestData['transkey_n_account_no_new_']     = transkeyInfo.hidden;
      requestData['transkey_HM_n_account_no_new_']  = transkeyInfo.hmac;
      requestData['keyboardType_n_account_no_new_'] = transkeyInfo.keyboardType;
      requestData['keyIndex_n_account_no_new_']     = transkeyInfo.keyIndex;
      requestData['fieldType_n_account_no_new_']    = transkeyInfo.fieldType;
      requestData['seedKey_']                       = transkeyInfo.seedKey;
      requestData['initTime_']                      = transkeyInfo.initTime;
      requestData['hidfrmId']                       = tk_origin;
    } 
    
    if(noticeInfo.payOver){
      requestData["payOver"] = noticeInfo.payOver.replace(/[^0-9]/g, "");
    }
    
    if(requestInfo.noticePresenceYn !== 'Y'){
      var replaceVarArray = ["payDt", "submitmoney", "upwater", "downwater", "water", "payment"];
      replaceVarArray.forEach((varNm) => {
        for(var i=1; i<6; i++){
          if(noticeInfo[varNm+i]){
            requestData[varNm+i] = noticeInfo[varNm+i].replace(/[^0-9]/g, "");
          }
        }
      });
    }
    
    return {
      ...this.state.parent.state.applicationPage.getSuyongaQueryString(),
      'cvplInfo.cvpl.minwonCd': this.state.minwonCd,
      ...requestData
    };
  }
  
  getStatusString() {
    
  }

  setInitNoticePresenceExist(){
    const that = this;
    
    var mgrNo = that.state.parent.state.parent.state.currentModule.state.applicationPage.suyongaInfo.state.suyongaInfo.mkey;
    
    var url = gContextUrl + "/citizen/common/searchOverNoticeNo.do";
    var queryString = {mkey: mgrNo}
    fetch('POST', url, queryString, function (error:any, data:any) {
      // 에러가 발생한 경우
      if (error) {
        that.state.requestInfo.noticePresenceYn = 'N';
        that.state.requestInfo.noticeCheck = "";
        that.state.requestInfo.noticeNo = "";
        return;
      }
      
      if ("00" == data.resultCd){
        that.state.requestInfo.noticePresenceYn = 'Y';
        that.state.requestInfo.noticeCheck = "Y";
        that.state.requestInfo.noticeNo = data.data;
      } else {
        that.state.requestInfo.noticePresenceYn = 'N';
        that.state.requestInfo.noticeCheck = "";
        that.state.requestInfo.noticeNo = "";
      }
    });
  }
  
  render() {
    var mgrNoSearch = this.state.parent.state.parent.state.currentModule.state.applicationPage.suyongaInfo.state.suyongaInfo.mkey;
    var mgrNo = this.state.mgrNo;
    if(mgrNoSearch !=mgrNo){
      this.state.noticePresenceCheck = false;
    }
    
    if(!this.state.noticePresenceCheck){
      this.setInitNoticePresenceExist();
      this.state.noticePresenceCheck = true;
    }
    
  	const that = this;

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
      <!-- 과오납반환통지서 -->
      <div id="form-mw21" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="showHideLayer('#form-mw21');" class="off" title="닫기"><span class="i-01">과오납반환통지서</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label class="input-label-1"><span>과오납반환통지서가 있으신가요?</span></label>
                <ul class="mw-opt mw-opt-2 row">
                  <li id="aGubun1" class="aGubun off"><a href="javascript:void(0);" onClick="${that.path}.toggleUIGubun('#aGubun1','.aGubun','#sch-data-01','.sch-data');"><span>있음</span></a></li>
                  <li id="aGubun2" class="aGubun off"><a href="javascript:void(0);" onClick="${that.path}.toggleUIGubun('#aGubun2','.aGubun','#sch-data-02','.sch-data');"><span>없음</span></a></li>
                </ul>

				<div id="form-mw23-info" class="form-info-box">
					<div  id="sch-data-01" class="sch-data display-block row">
						<!-- 과오납반환통지서번호 검색 -->
						<label for="noticeNo"><span class="sr-only">과오납반환통지서번호</span></label>
						<input type="text" id="noticeNo" class="input-box input-w-1" value="${that.state.requestInfo.noticeNo}" placeholder="과오납반환통지서번호" maxlength="13" 
						  onkeyup="${that.path}.handleNoticeNo(event)"/>
						<a class="btn btnSS" onclick="${that.path}.loadOverInfo();">
							<span>검색</span>
						</a>

						<!-- 검색결과 -->
						<div class="sch-re">
							<table id="noticeTable">
									<caption><span class="blind">과오납반환통지서번호검색 결과 정보를 포함한 표</span></caption>
									<thead>
											<tr>
												<th scope="col">과오납반환통지서 정보</th>
											</tr>
									</thead>
									<tbody>
										<tr>
											<td class="col-tool"></td>
										</tr>
									</tbody>
							</table>
						</div><!-- //sch-re -->
					</div><!-- //sch-data-01 -->


					<div  id="sch-data-02" class="sch-data display-none row">
						<!-- 과오납금액 -->
						<label for="payOver"><span class="sr-only">과오납금액</span></label>
						<input  onkeyup="${that.path}.handleAmt(event)" onchange="${that.path}.handleAmt(event)"
							value="${that.state.noticeInfo.payOver}" type="text" id="payOver" name="payOver" class="input-box input-w-2" placeholder="(필수입력) 과오납금액"><span class="unit">원</span>
        <p class="form-cmt form-cmt-1 pre-star tip-red">영수증 사본을 팩스 또는 우편으로 제출하셔야 합니다.</p>


						<!-- 청구내역 입력 -->
						<div class="sch-re-form">
							<table>
									<caption><span class="blind">청구내역 입력표</span></caption>
									<thead>
											<tr>
												<th scope="col" class="col-no">번호</th>
												<th scope="col">청구내역 입력</th>
											</tr>
									</thead>
									<tbody>
											<tr id="bill1"><!-- id의 마지막은 숫자 1입니다. -->
				                                <td class="col-no">1</td>
				                                <td class="col-input">
				                                  <label for="payDt1"><span class="sr-only">납기</span></label>
				                                  <input onchange="${that.path}.handleDate(event)"
				                                	  value="${that.state.noticeInfo.payDt1}" type="date" id="payDt1" name="payDt1" class="input-box input-w-2 datepicker hasDatepicker payDt" required data-placeholder="납기" min="1000-01-01" max="2100-12-31" maxlength="10">
				                                  	
				                                  <label for="submitmoney1"><span class="sr-only">납부일자 </span></label>
				                                  <input onchange="${that.path}.handleDate(event)"
				                                	  value="${that.state.noticeInfo.submitmoney1}" type="date" id="submitmoney1" name="submitmoney1" class="input-box input-w-2 datepicker hasDatepicker" required data-placeholder="납부일자" min="1000-01-01" max="2100-12-31" maxlength="10">
				
				                                  <label for="upwater1"><span class="sr-only">고지금액(상수도)</span></label>
				                                  <input onkeyup="${that.path}.handleAmt(event)" onchange="${that.path}.handleAmt(event)"
				                                  	value="${that.state.noticeInfo.upwater1}" type="text" id="upwater1" name="upwater1" class="input-box input-w-2" placeholder="고지금액(상수도)" maxlength="13">
				                                  
				                                  <label for="downwater1"><span class="sr-only">고지금액(하수도)</span></label>
				                                  <input onkeyup="${that.path}.handleAmt(event)" onchange="${that.path}.handleAmt(event)"
				                                	  value="${that.state.noticeInfo.downwater1}" type="text" id="downwater1" name="downwater1" class="input-box input-w-2" placeholder="고지금액(하수도)" maxlength="13">
				                                  
				                                  <label for="water1"><span class="sr-only">고지금액(물이용)</span></label>
				                                  <input onkeyup="${that.path}.handleAmt(event)" onchange="${that.path}.handleAmt(event)"
				                                	  value="${that.state.noticeInfo.water1}" type="text" id="water1" name="water1" class="input-box input-w-2" placeholder="고지금액(물이용)" maxlength="13">
				                                  
				                                  <label for="totalMoney1"><span class="sr-only">고지금액(합계)</span></label>
				                                  <input value="${that.state.viewInfo.totalMoney1}" type="text" id="totalMoney1" name="totalMoney1" class="input-box input-w-2" placeholder="고지금액(합계)" readonly>
				
				                                  <label for="submitbank1"><span class="sr-only">은행명</span></label>
				                                  <select id="submitbank1" name="submitbank1" title="은행명" class="input-box input-w-sel" onChange="${that.path}.handleSelectBox(event);"></select>
				                                  <label for="submitbankdown1"><span class="sr-only">은행지점명</span></label>
				                                  <input onkeyup="${that.path}.handleSubmitbankdown(event)" onchange="${that.path}.handleSubmitbankdown(event)"
				                                	  value="${that.state.noticeInfo.submitbankdown1}" type="text" id="submitbankdown1" name="submitbankdown1" class="input-box input-w-2" placeholder="은행지점명" maxlength="7">
				                                  
				                                  <label for="payment1"><span class="sr-only">납부금액</span></label>
				                                  <input onkeyup="${that.path}.handlePayment(event)" onchange="${that.path}.handlePayment(event)"
				                                	  value="${that.state.noticeInfo.payment1}" type="text" id="payment1" name="payment1" class="input-box input-w-2" placeholder="납부금액" maxlength="15">
				                                  
				                                  <label for="etc1"><span class="sr-only">비고</span></label>
				                                  <input onkeyup="${that.path}.handleEtc(event)" onchange="${that.path}.handleEtc(event)"
				                                	  value="${that.state.noticeInfo.etc1}" type="text" id="etc1" name="etc1" class="input-box input-w-2" placeholder="비고" maxlength="7">
				                               </td>
											</tr>
											<tr id="bill2" style="display:none;">
												<td class="col-no">2</td>
												<td class="col-input">
													<label for="payDt2"><span class="sr-only">납기</span></label>
													<input onchange="${that.path}.handleDate(event)"
														value="${that.state.noticeInfo.payDt2}" type="date" id="payDt2" name="payDt2" class="input-box input-w-2 datepicker hasDatepicker payDt" required data-placeholder="납기" min="1000-01-01" max="2100-12-31" maxlength="10">
													
													<label for="submitmoney2"><span class="sr-only">납부일자 </span></label>
													<input onchange="${that.path}.handleDate(event)"
														value="${that.state.noticeInfo.submitmoney2}" type="date" id="submitmoney2" name="submitmoney2" class="input-box input-w-2 datepicker hasDatepicker"  required data-placeholder="납부일자" min="1000-01-01" max="2100-12-31" maxlength="10">
													
													<label for="upwater2"><span class="sr-only">고지금액(상수도)</span></label>
													<input onkeyup="${that.path}.handleAmt(event)" onchange="${that.path}.handleAmt(event)"
														value="${that.state.noticeInfo.upwater2}" type="text" id="upwater2" name="upwater2" class="input-box input-w-2" placeholder="고지금액(상수도)" maxlength="13">
													
													<label for="downwater2"><span class="sr-only">고지금액(하수도)</span></label>
													<input onkeyup="${that.path}.handleAmt(event)" onchange="${that.path}.handleAmt(event)"
														value="${that.state.noticeInfo.downwater2}" type="text" id="downwater2" name="downwater2" class="input-box input-w-2" placeholder="고지금액(하수도)" maxlength="13">
													
													<label for="water2"><span class="sr-only">고지금액(물이용)</span></label>
													<input onkeyup="${that.path}.handleAmt(event)" onchange="${that.path}.handleAmt(event)"
														value="${that.state.noticeInfo.water2}" type="text" id="water2" name="water2" class="input-box input-w-2" placeholder="고지금액(물이용)" maxlength="13">
													
													<label for="totalMoney2"><span class="sr-only">고지금액(합계)</span></label>
													<input value="${that.state.viewInfo.totalMoney2}" type="text" id="totalMoney2" name="totalMoney2" class="input-box input-w-2" placeholder="고지금액(합계)" maxlength="13" readonly>
													
													<label for="submitbank2"><span class="sr-only">은행명</span></label>
													<select id="submitbank2" name="submitbank2" title="은행명" class="input-box input-w-sel" onChange="${that.path}.handleSelectBox(event);"></select>
													<label for="submitbankdown2"><span class="sr-only">은행지점명</span></label>
													<input onkeyup="${that.path}.handleSubmitbankdown(event)" onchange="${that.path}.handleSubmitbankdown(event)"
														value="${that.state.noticeInfo.submitbankdown2}" type="text" id="submitbankdown2" name="submitbankdown2" class="input-box input-w-2" placeholder="은행지점명" maxlength="7">
													
													<label for="payment2"><span class="sr-only">납부금액</span></label>
													<input onkeyup="${that.path}.handlePayment(event)" onchange="${that.path}.handlePayment(event)"
														value="${that.state.noticeInfo.payment2}" type="text" id="payment2" name="payment2" class="input-box input-w-2" placeholder="납부금액" maxlength="15">
													
													<label for="etc2"><span class="sr-only">비고</span></label>
													<input onkeyup="${that.path}.handleEtc(event)" onchange="${that.path}.handleEtc(event)"
														value="${that.state.noticeInfo.etc2}" type="text" id="etc2" name="etc2" class="input-box input-w-2" placeholder="비고" maxlength="7">
												</td>
											</tr>
											<tr id="bill3" style="display:none;">
												<td class="col-no">3</td>
												<td class="col-input">
													<label for="payDt3"><span class="sr-only">납기</span></label>
													<input onchange="${that.path}.handleDate(event)"
														value="${that.state.noticeInfo.payDt3}" type="date" id="payDt3" name="payDt3" class="input-box input-w-2 datepicker hasDatepicker payDt" required data-placeholder="납기" min="1000-01-01" max="2100-12-31" maxlength="10">
													
													<label for="submitmoney3"><span class="sr-only">납부일자 </span></label>
													<input onchange="${that.path}.handleDate(event)"
														value="${that.state.noticeInfo.submitmoney3}" type="date" id="submitmoney3" name="submitmoney3" class="input-box input-w-2 datepicker hasDatepicker"  required data-placeholder="납부일자" min="1000-01-01" max="2100-12-31" maxlength="10">
													
													<label for="upwater3"><span class="sr-only">고지금액(상수도)</span></label>
													<input onkeyup="${that.path}.handleAmt(event)" onchange="${that.path}.handleAmt(event)"
														value="${that.state.noticeInfo.upwater3}" type="text" id="upwater3" name="upwater3" class="input-box input-w-2" placeholder="고지금액(상수도)" maxlength="13">
													
													<label for="downwater3"><span class="sr-only">고지금액(하수도)</span></label>
													<input onkeyup="${that.path}.handleAmt(event)" onchange="${that.path}.handleAmt(event)"
														value="${that.state.noticeInfo.downwater3}" type="text" id="downwater3" name="downwater3" class="input-box input-w-2" placeholder="고지금액(하수도)" maxlength="13">
													
													<label for="water3"><span class="sr-only">고지금액(물이용)</span></label>
													<input onkeyup="${that.path}.handleAmt(event)" onchange="${that.path}.handleAmt(event)"
														value="${that.state.noticeInfo.water3}" type="text" id="water3" name="water3" class="input-box input-w-2" placeholder="고지금액(물이용)" maxlength="13">
													
													<label for="totalMoney3"><span class="sr-only">고지금액(합계)</span></label>
													<input value="${that.state.viewInfo.totalMoney3}" type="text" id="totalMoney3" name="totalMoney3" class="input-box input-w-2" placeholder="고지금액(합계)" maxlength="13" readonly>
													
													<label for="submitbank3"><span class="sr-only">은행명</span></label>
													<select id="submitbank3" name="submitbank3" title="은행명" class="input-box input-w-sel" onChange="${that.path}.handleSelectBox(event);"></select>
													<label for="submitbankdown3"><span class="sr-only">은행지점명</span></label>
													<input onkeyup="${that.path}.handleSubmitbankdown(event)" onchange="${that.path}.handleSubmitbankdown(event)"
														value="${that.state.noticeInfo.submitbankdown3}" type="text" id="submitbankdown3" name="submitbankdown3" class="input-box input-w-2" placeholder="은행지점명" maxlength="7">
													
													<label for="payment3"><span class="sr-only">납부금액</span></label>
													<input onkeyup="${that.path}.handlePayment(event)" onchange="${that.path}.handlePayment(event)"
														value="${that.state.noticeInfo.payment3}" type="text" id="payment3" name="payment3" class="input-box input-w-2" placeholder="납부금액" maxlength="15">
													
													<label for="etc3"><span class="sr-only">비고</span></label>
													<input onkeyup="${that.path}.handleEtc(event)" onchange="${that.path}.handleEtc(event)"
														value="${that.state.noticeInfo.etc3}" type="text" id="etc3" name="etc3" class="input-box input-w-2" placeholder="비고" maxlength="7">
												</td>
											</tr>
											<tr id="bill4" style="display:none;">
												<td class="col-no">4</td>
												<td class="col-input">
													<label for="payDt4"><span class="sr-only">납기</span></label>
													<input onchange="${that.path}.handleDate(event)"
														value="${that.state.noticeInfo.payDt4}" type="date" id="payDt4" name="payDt4" class="input-box input-w-2 datepicker hasDatepicker payDt" required data-placeholder="납기" min="1000-01-01" max="2100-12-31" maxlength="10">
													
													<label for="submitmoney4"><span class="sr-only">납부일자 </span></label>
													<input onchange="${that.path}.handleDate(event)"
														value="${that.state.noticeInfo.submitmoney4}" type="date" id="submitmoney4" name="submitmoney4" class="input-box input-w-2 datepicker hasDatepicker"  required data-placeholder="납부일자" min="1000-01-01" max="2100-12-31" maxlength="10">
													
													<label for="upwater4"><span class="sr-only">고지금액(상수도)</span></label>
													<input onkeyup="${that.path}.handleAmt(event)" onchange="${that.path}.handleAmt(event)"
														value="${that.state.noticeInfo.upwater4}" type="text" id="upwater4" name="upwater4" class="input-box input-w-2" placeholder="고지금액(상수도)" maxlength="13">
													
													<label for="downwater4"><span class="sr-only">고지금액(하수도)</span></label>
													<input onkeyup="${that.path}.handleAmt(event)" onchange="${that.path}.handleAmt(event)"
														value="${that.state.noticeInfo.downwater4}" type="text" id="downwater4" name="downwater4" class="input-box input-w-2" placeholder="고지금액(하수도)" maxlength="13">
													
													<label for="water4"><span class="sr-only">고지금액(물이용)</span></label>
													<input onkeyup="${that.path}.handleAmt(event)" onchange="${that.path}.handleAmt(event)"
														value="${that.state.noticeInfo.water4}" type="text" id="water4" name="water4" class="input-box input-w-2" placeholder="고지금액(물이용)" maxlength="13">
													
													<label for="totalMoney4"><span class="sr-only">고지금액(합계)</span></label>
													<input value="${that.state.viewInfo.totalMoney4}" type="text" id="totalMoney4" name="totalMoney4" class="input-box input-w-2" placeholder="고지금액(합계)" maxlength="13" readonly>
													
													<label for="submitbank4"><span class="sr-only">은행명</span></label>
													<select id="submitbank4" name="submitbank4" title="은행명" class="input-box input-w-sel" onChange="${that.path}.handleSelectBox(event);"></select>
													<label for="submitbankdown4"><span class="sr-only">은행지점명</span></label>
													<input onkeyup="${that.path}.handleSubmitbankdown(event)" onchange="${that.path}.handleSubmitbankdown(event)"
														value="${that.state.noticeInfo.submitbankdown4}" type="text" id="submitbankdown4" name="submitbankdown4" class="input-box input-w-2" placeholder="은행지점명" maxlength="7">
													
													<label for="payment4"><span class="sr-only">납부금액</span></label>
													<input onkeyup="${that.path}.handlePayment(event)" onchange="${that.path}.handlePayment(event)"
														value="${that.state.noticeInfo.payment4}" type="text" id="payment4" name="payment4" class="input-box input-w-2" placeholder="납부금액" maxlength="15">
													
													<label for="etc4"><span class="sr-only">비고</span></label>
													<input onkeyup="${that.path}.handleEtc(event)" onchange="${that.path}.handleEtc(event)"
														value="${that.state.noticeInfo.etc4}" type="text" id="etc4" name="etc4" class="input-box input-w-2" placeholder="비고" maxlength="7">
												</td>
											</tr>
											<tr id="bill5" style="display:none;">
												<td class="col-no">5</td>
												<td class="col-input">
													<label for="payDt5"><span class="sr-only">납기</span></label>
													<input onchange="${that.path}.handleDate(event)"
														value="${that.state.noticeInfo.payDt5}" type="date" id="payDt5" name="payDt5" class="input-box input-w-2 datepicker hasDatepicker payDt" required data-placeholder="납기" min="1000-01-01" max="2100-12-31" maxlength="10">
													
													<label for="submitmoney5"><span class="sr-only">납부일자 </span></label>
													<input onchange="${that.path}.handleDate(event)"
														value="${that.state.noticeInfo.submitmoney5}" type="date" id="submitmoney5" name="submitmoney5" class="input-box input-w-2 datepicker hasDatepicker"  required data-placeholder="납부일자" min="1000-01-01" max="2100-12-31" maxlength="10">
													
													<label for="upwater5"><span class="sr-only">고지금액(상수도)</span></label>
													<input onkeyup="${that.path}.handleAmt(event)" onchange="${that.path}.handleAmt(event)"
														value="${that.state.noticeInfo.upwater5}" type="text" id="upwater5" name="upwater5" class="input-box input-w-2" placeholder="고지금액(상수도)" maxlength="13">
													
													<label for="downwater5"><span class="sr-only">고지금액(하수도)</span></label>
													<input onkeyup="${that.path}.handleAmt(event)" onchange="${that.path}.handleAmt(event)"
														value="${that.state.noticeInfo.downwater5}" type="text" id="downwater5" name="downwater5" class="input-box input-w-2" placeholder="고지금액(하수도)" maxlength="13">
													
													<label for="water5"><span class="sr-only">고지금액(물이용)</span></label>
													<input onkeyup="${that.path}.handleAmt(event)" onchange="${that.path}.handleAmt(event)"
														value="${that.state.noticeInfo.water5}" type="text" id="water5" name="water5" class="input-box input-w-2" placeholder="고지금액(물이용)" maxlength="13">
													
													<label for="totalMoney5"><span class="sr-only">고지금액(합계)</span></label>
													<input value="${that.state.viewInfo.totalMoney5}" type="text" id="totalMoney5" name="totalMoney5" class="input-box input-w-2" placeholder="고지금액(합계)" maxlength="13" readonly>
													
													<label for="submitbank5"><span class="sr-only">은행명</span></label>
													<select id="submitbank5" name="submitbank5" title="은행명" class="input-box input-w-sel" onChange="${that.path}.handleSelectBox(event);"></select>
													<label for="submitbankdown5"><span class="sr-only">은행지점명</span></label>
													<input onkeyup="${that.path}.handleSubmitbankdown(event)" onchange="${that.path}.handleSubmitbankdown(event)"
														value="${that.state.noticeInfo.submitbankdown5}" type="text" id="submitbankdown5" name="submitbankdown5" class="input-box input-w-2" placeholder="은행지점명" maxlength="7">
													
													<label for="payment5"><span class="sr-only">납부금액</span></label>
													<input onkeyup="${that.path}.handlePayment(event)" onchange="${that.path}.handlePayment(event)"
														value="${that.state.noticeInfo.payment5}" type="text" id="payment5" name="payment5" class="input-box input-w-2" placeholder="납부금액" maxlength="15">
													
													<label for="etc5"><span class="sr-only">비고</span></label>
													<input onkeyup="${that.path}.handleEtc(event)" onchange="${that.path}.handleEtc(event)"
														value="${that.state.noticeInfo.etc5}" type="text" id="etc5" name="etc5" class="input-box input-w-2" placeholder="비고" maxlength="7">
												</td>
											</tr>
									</tbody>
							</table>

          <p class="sch-btn-wrap row"><a href="javascript:void(0);" id="handleBillBtn" onClick="${that.path}.handleBillList();" class="btn btnSS btnTypeB"><span>내역추가입력</span></a></p>

						</div><!-- //sch-re-form -->
					</div><!-- //sch-data-02 -->
				</div>
              </li>
            </ul>
          </div>
        </div>
      </div><!-- //form-mw21 -->
      </div><!-- //mw-box -->

      <div class="mw-box row">
      <!-- 환급방법 -->
      <div id="form-mw25" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="showHideLayer('#form-mw25');" class="off" title="닫기"><span class="i-01">환급방법</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label class="input-label-1"><span>환급 방법을 선택해 주세요.</span></label>
                <ul class="mw-opt mw-opt-3 mw-opt-type03 row">
                  <li id="bGubun3" class="bGubun off"><a href="javascript:void(0);" onClick="${that.path}.toggleUIGubun('#bGubun3','.bGubun','#mw-boxA3','.mw-boxA');"><span>정산</span></a></li>
                  <li id="bGubun1" class="bGubun off"><a href="javascript:void(0);" onClick="${that.path}.toggleUIGubun('#bGubun1','.bGubun','#mw-boxA1','.mw-boxA');"><span>계좌이체</span></a></li>
                  <li id="bGubun2" class="bGubun off"><a href="javascript:void(0);" onClick="${that.path}.toggleUIGubun('#bGubun2','.bGubun','#mw-boxA2','.mw-boxA');"><span>현금반환</span></a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div><!-- //form-mw25 -->
      </div><!-- //mw-boxA3 -->
      <div id="mw-boxA1" class="mw-box mw-boxA display-none row">
      <!-- 계좌이체 -->
      <div id="form-mw22" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="showHideLayer('#form-mw22');" class="off" title="닫기"><span class="i-01">계좌이체</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label for="n_bank_nm_new" class="input-label"><span class="form-req"><span class="sr-only">필수</span>은행 </span></label>
                <select id="returnBankCd" name="returnBankCd" title="은행명 선택" class="input-box input-w-2" onChange="${that.path}.handleSelectBox(event);"></select>
              </li>
              <li>
                <label for="n_account_no_new" class="input-label"><span class="form-req"><span class="sr-only">필수</span>계좌번호 </span></label>
                <input type="text" id="n_account_no_new" class="input-box input-w-2" 
                  data-tk-kbdType="number" value="" autocomplete="new-password" maxlength="30" title="계좌번호"  
                  onclick="mtk.onKeyboard(this);"
                  placeholder="'-' 없이 번호입력" readonly>
              </li>
              
              <!-- 2023.04.24. 예금종류 삭제 요청
              <li>
                <label for="returnAccountType" class="input-label"><span class="form-req"><span class="sr-only">필수</span>예금종류</span></label>
                <select id="returnAccountType" name="returnAccountType" title="선택" class="input-box input-w-2" onChange="${that.path}.handleSelectBox(event);"></select>
              </li>
              -->
              
              <li><label for="returnAccountOwner" class="input-label"><span class="form-req"><span class="sr-only">필수</span>예금주</span></label>
              <input onkeyup="${that.path}.handleReturnAccountOwner(event)" onchange="${that.path}.handleReturnAccountOwner(event)"
            	  value="${that.state.requestInfo.returnAccountOwner}" type="text" id="returnAccountOwner" name="returnAccountOwner" class="input-box input-w-2" placeholder="성명(예금주)" maxlength="12">
                <a class="btn btnSS btnTypeA btnSingle" onclick="${that.path}.checkAcct();"><span>계좌확인</span></a>
                <p class="form-cmt form-cmt-1">
                  <span class="pre-star tip-red">납부자와 예금주가 다른 경우, 실제 납부자임을 증빙할 수 있는 서류를 제출하셔야만 처리가 됩니다.</span><br>
                  <span class="pre-star tip-red">법인인 경우 법인인감증명이 필요합니다.</span><br>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div><!-- //form-mw22 -->
      </div><!-- //mw-boxA1 -->

      <div id="mw-boxA2" class="mw-box mw-boxA display-none row">
      <!-- 현금수령 -->
      <div id="form-mw24" class="align-box row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="showHideLayer('#form-mw24');" class="off" title="닫기"><span class="i-01">현금수령</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
              <label class="input-label"><span>은행명</span></label><p class="form-info">신한은행(각 사업소 시금고업무 취급지점)</p></li>
              <li><label class="input-label"><span>수령절차</span></label><p class="form-info">1. 과오납금환부명령서를 해당 수도사업소(요금과)에서 수령<br>2. 신한은행(해당사업소 시금고업무 취급지점)에 제출하고 현금 수령</p>
              </li>
            </ul>
          </div>
        </div>
      </div><!-- //form-mw24 -->
      </div><!-- //mw-boxA2 -->

      <div id="mw-boxA3" class="mw-box mw-boxA display-none row">
      <!-- 정산 -->
      <div id="form-mw26" class="align-box row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="showHideLayer('#form-mw26');" class="off" title="닫기"><span class="i-01">정산</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li><label class="input-label"><span>납기</span></label><p class="form-info">다음납기</p></li>
              <li><label class="input-label"><span>정산금액</span></label><p class="form-info">수도요금 등의 징수금에 대해 과다 납부 또는 이중 납부한 경우<br>요금 납부자가 징수금을 초과하여 납부한 금액을 환불 신청</p></li>
            </ul>
          </div>
        </div>
      </div><!-- //form-mw26 -->
      </div><!-- //mw-boxA3 -->

      <div class="mw-box row">
      <!-- 신청사유 -->
      <div id="form-mw27" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="showHideLayer('#form-mw27');" class="off" title="닫기"><span class="i-01">신청사유</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label for="reason" class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>신청사유</span></label>
                <textarea onkeyup="${that.path}.handleReason(event)" onchange="${that.path}.handleReason(event)"
                	name="reason" id="reason" title="신청사유" class="textarea-box" maxlength="290">${that.state.requestInfo.reason}</textarea>
              </li>
            </ul>
          </div>
        </div>
      </div><!-- //form-mw27 -->
      </div><!-- //mw-box -->   
      `;

    document.getElementById('minwonRoot')!.innerHTML = template;

    this.renderDescription(document.getElementById('desc'));
    
    this.afterRender();
    
  }
  
  //상태가 아닌 UI class 적용은 랜더링 후에 처리되어야 한다.
  afterRender() {
  	const that = this;
  	//state.requestInfo;
  	this.setState({
        ...this.state,
        mgrNo: that.state.parent.state.parent.state.currentModule.state.applicationPage.suyongaInfo.state.suyongaInfo.mkey//고객번호
      });
  	
  	//통지서 여부 토글
	that.state.requestInfo.noticePresenceYn == "Y" ? $("#aGubun1 > a").trigger("click") : $("#aGubun2 > a").trigger("click");
	if(that.state.requestInfo.noticeCheck == "Y"){that.loadOverInfo()}//통지서가 이미 제대로 조회 되었었다면 출력
	//환급방법 토글
	if(that.state.requestInfo.returnWay == "계좌이체"){
//    initmTranskey();
		$("#bGubun1 > a").trigger("click");
	} else if(that.state.requestInfo.returnWay == "현금반환"){
		$("#bGubun2 > a").trigger("click");
	} else if(that.state.requestInfo.returnWay == "정산"){
    $("#bGubun3 > a").trigger("click");
  } else {
	}
	
	//은행 셀렉트 박스 셋팅
  	$("#submitbank1").prepend("<option value='' selected='selected'>은행선택</option>");
  	fncSetComboByCodeList("submitbank1", that.state.statusInfo.bankList);
  	$("#submitbank2").prepend("<option value='' selected='selected'>은행선택</option>");
  	fncSetComboByCodeList("submitbank2", that.state.statusInfo.bankList);
  	$("#submitbank3").prepend("<option value='' selected='selected'>은행선택</option>");
  	fncSetComboByCodeList("submitbank3", that.state.statusInfo.bankList);
  	$("#submitbank4").prepend("<option value='' selected='selected'>은행선택</option>");
  	fncSetComboByCodeList("submitbank4", that.state.statusInfo.bankList);
  	$("#submitbank5").prepend("<option value='' selected='selected'>은행선택</option>");
  	fncSetComboByCodeList("submitbank5", that.state.statusInfo.bankList);
  	
  	//과오납금반환통지서 '없음'은행 셀렉트박스 셋팅
  	for(var i=1; i<6; i++){
  		$("#submitbank"+i).val(that.state.noticeInfo["submitbank"+i]).prop("selected", true);
  		that.state.noticeInfo["payment"+i] ? $("#bill"+i).show() : $("#bill"+i).hide();
  		$("#bill1").show();
  	}
  	
  	//환금방법 '계좌이체' 셀렉트박스 셋팅
  	$("#returnBankCd").prepend("<option value='' selected='selected'>은행선택</option>");
  	fncSetComboByCodeList("returnBankCd", that.state.statusInfo.bankList);
  	$("#returnBankCd").val(that.state.requestInfo["returnBankCd"]).prop("selected", true);
  	
  	/* 2023.04.24. 예금종류 삭제 요청
  	$("#returnAccountType").prepend("<option value='' selected='selected'>예금종류선택</option>");
  	fncSetComboByCodeList("returnAccountType", that.state.statusInfo.depositList);
  	$("#returnAccountType").val(that.state.requestInfo["returnAccountType"]).prop("selected", true);
	  */
	
  }//afterRender끝
  
  
	
  renderDescription(target:any) {
  	const that = this;
  	
    let desc = `
        <div id="form-mw0" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw0');" class="on" title="펼치기">
            <span class="i-06 txStrongColor">민원안내 및 처리절차</span></a>
          </div>
          <div class="form-mw-box display-none row">
            <div class="info-mw row">
              <div class="tit-mw-h5 row"><span>신청서류</span></div>
              <div class="info-mw-list">
                <ul>
                  <li>
                현금반환 신청시<br />
                 - 본인청구 : 과오납환부통지서, 주민등록증, 인장<br />
                 - 대리청구 : 과오납환부통지서, 권리자의 인감증명 및 위임장, 대리인 도장 및 주민등록증<br />
                 - 법인청구 : 과오납환부통지서, 법인의 인감증명 및 위임장, 대리인 도장 및 주민등록증<br />
                  </li>
                  <li>
                은행계좌 이체신청시<br />
                 - 전화신청 : 과오납환부통지서, 주민등록증, 인장<br />
                 - 서면신청(개인) : 계좌이체신청서<br />
                 - 서면신청(법인) : 계좌이체신청서, 법인인감증명, 통장사본(신한은행인경우 제외)<br />
                  <span class="txRed">- 환불신청 안내문 발송시 계좌이체신청서를 동봉함</span>
                  </li>
                </ul>
              </div>
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
    if(that.state.description.minwonProcedure){
      desc += `
                <div class="tit-mw-h5 row"><span>처리절차</span></div>
                <p>${that.state.description.minwonProcedure}</p>
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