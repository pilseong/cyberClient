import CyberMinwon from '../infra/CyberMinwon';
import { fetch } from './../util/unity_resource';
import { radioMW, phoneNumberInputValidation, citizenAlert, maskingFnc, phonePattern, mobilePattern } from './../util/uiux-common';

declare var gContextUrl: string;
declare var document: any;
declare var $: any;
declare var cyberMinwon: CyberMinwon;

export default class B24DetailPage {
  path: string;
  state: {
      minwonCd: string;
      parent: any;
      statusInfo: any;
      requestInfo: {
        reqGubun: string;//신청 구분  (1:신규, 2:변경, 3:해지 )
        gumInfoType: string;//안내 방법 (01: 문자안내(알림톡) 02: 전자우편 03: 음성안내 04: 문자안내(SMS/LMS))
        agreeYn: string;//확인사항 확인 여부
        
        //자가검침 현재상태 변수
        gcReqFlag: string;//R: 현재 자가 검침중, Y: 자가검침 대상,  N: 자가검침 대상아님
        gcReqFlagNm: string;//R: 현재 자가 검침중, Y: 자가검침 대상,  N: 자가검침 대상아님
        //신청인 정보에서 가져오는 값들
        reqNm: string;//신청인 이름
        reqTel: string;//자가검침 안내 유선전화번호
        reqMobile: string;//자가검침 안내 휴대전화번호
        reqEmail: string;//자가검침 안내 이메일주소
        reqEmailId: string;//자가검침 안내 이메일주소
        reqEmailProvider: string;//자가검침 안내 이메일주소
        reqEmailProviderSelector: number;//자가검침 안내 이메일주소
        relation: string;//관계
        appDueDt: string;//적용납기일자
      };
      description: any;
      
      viewRequestInfo: any;
      isSubmitSuccessful: boolean;
      submitResult: any,
  };
  constructor(parent:any, minwonCd: string) {
    this.state = {
      minwonCd,
      parent,
      statusInfo: {},
      requestInfo: {
    	  reqGubun: '',
    	  gumInfoType: '',
    	  agreeYn: '',
    	  gcReqFlag: '',
    	  gcReqFlagNm: '',
    	  reqNm: '',
    	  reqTel: '',
    	  reqMobile: '',
    	  reqEmail: '',
    	  reqEmailId: '',
    	  reqEmailProvider: '',
    	  reqEmailProviderSelector: 0,
    	  relation: '',
    	  appDueDt: ''
      },

      description: {},
      viewRequestInfo: {},
      isSubmitSuccessful: false,
      submitResult: {},
    };
    this.path = 'cyberMinwon.state.currentModule.state.currentPage';

    this.setInitValue();
  }

  //수용가 조회 시 민원 신청 가능한지 확인하는 함수
  async possibleApplyChk(mgrNo:string){
    const that = this;
    let result = true;
    var sMsg =   '<p class="title">자가검침 신청가능 대상</p><p class="contents">1. 가정용 중 40mm이하<br>  2. 일반용 중 오피스텔내 호별 수전 분리된 수도계량기중 실내에 설치    되어 있는 경우</p><p class="strong">신청대상을 확인 하셨습니까?</p>';
    let formData = new FormData();
    formData.set("mkey",mgrNo);
    
    try{
      let res = await window.fetch("/citizen/common/gcReqFlagByMgrNo.do",{
        method: 'post',
        body: formData
      });
      let getData = await res.json();
      if(!getData.business){
        citizenAlert("자가검침 신청을 할 수 없는 수용가입니다.");
        return false;
      }
      const gcReqFlag = getData.business.bodyVO.ownGcReqFlag;
      const applyNapgi =  getData.business.bodyVO.appNapgi;
      const ownGcNtceCd = getData.business.bodyVO.ownGcNtceCd;//안내방법[01:문자안내(알림톡) 02:전자우편 03:음성안내 04:문자안내(SMS)]
      const ownGcNtceMtel = getData.business.bodyVO.ownGcNtceMtel;//문자안내번호
      const ownGcNtceEmail = getData.business.bodyVO.ownGcNtceEmail;//이메일
      const ownGcNtceTel = getData.business.bodyVO.ownGcNtceTel;//음성안내번호
      if(gcReqFlag=="N"){
        citizenAlert('요금 관리시스템에서 알려드립니다.<br>자가검침 대상이 아니므로 자가검침 신청을 할 수 없습니다');
        result = false;
        
      } else if(gcReqFlag=="Y"){
        that.setState({
          ...that.state,
          statusInfo: {
            gcReqFlag: gcReqFlag,
            applyNapgi: applyNapgi,
            ownGcNtceCd: ownGcNtceCd,
            ownGcNtceMtel: ownGcNtceMtel,
            ownGcNtceEmail: ownGcNtceEmail,
            ownGcNtceTel: ownGcNtceTel
          },
          requestInfo: {
            ...that.state.requestInfo,
            reqGubun: "1",//'신규'입력
            gcReqFlag: gcReqFlag,
            gcReqFlagNm: "미가입 수용가",
            appDueDt: applyNapgi
          }
        });
        citizenAlert(sMsg);
        result = true;
      } else {
        let gcReqFlagNm = "";
        if(ownGcNtceCd == "01" || ownGcNtceCd == "04"){//문자안내(알림톡/SMS)
          gcReqFlagNm = "문자안내 번호: ";
          gcReqFlagNm += ownGcNtceMtel.substring(0, ownGcNtceMtel.length-6) + "****" + ownGcNtceMtel.substring(ownGcNtceMtel.length-2);
        }else if(ownGcNtceCd == "02"){//이메일
          const atIndex = ownGcNtceEmail.indexOf("@");
          gcReqFlagNm = "전자우편(eMail)안내 주소: ";
          gcReqFlagNm += atIndex <= 3 ? "***"+ownGcNtceEmail.substring(1, atIndex) + ownGcNtceEmail.substring(atIndex) : 
                                       ownGcNtceEmail.substring( 0, atIndex-3) + "***@" + ownGcNtceEmail.substring(atIndex+1);
        }else{//음성안내
          gcReqFlagNm = "음성안내 번호: ";
          gcReqFlagNm += ownGcNtceTel.substring(0, ownGcNtceTel.length-6) + "****" + ownGcNtceTel.substring(ownGcNtceTel.length-2);
        }
        
        that.setState({
          ...that.state,
          statusInfo: {
            gcReqFlag: gcReqFlag,
            applyNapgi: applyNapgi,
            ownGcNtceCd: ownGcNtceCd,
            ownGcNtceMtel: ownGcNtceMtel,
            ownGcNtceEmail: ownGcNtceEmail,
            ownGcNtceTel: ownGcNtceTel
          },
          requestInfo: {
              ...that.state.requestInfo,
              reqGubun: "2",//'변경'입력
              gcReqFlag: gcReqFlag,
              gcReqFlagNm: gcReqFlagNm,
              appDueDt: applyNapgi,
              gumInfoType: ownGcNtceCd.substring(1)
            }
        });
        citizenAlert(sMsg);
        result = true;
      }
      return result;
    }catch(err: any){
      citizenAlert(err);
    }
  }

  // 초기값 설정
  setInitValue() {
    const that = this;
    that.setState({
      ...that.state,
      requestInfo: {
        reqGubun: '',
        gumInfoType: '',
        agreeYn: '',
        gcReqFlag: '',
        gcReqFlagNm: '',
        reqNm: '',
        reqTel: '',
        reqMobile: '',
        reqEmail: '',
        reqEmailId: '',
        reqEmailProvider: '',
        reqEmailProviderSelector: 0,
        relation: ''
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
  }

  // InfoPanel 데이터 설정
  getViewInfo() {
    var infoArray;
    const requestInfo = this.state.requestInfo;
    let reqGubun;//신청 구분
    if(requestInfo.reqGubun == "1"){
      reqGubun = "신규";
    } else if(requestInfo.reqGubun == "2"){
      reqGubun = "변경";
    } else {//"3"
      reqGubun = "해지";
    }
    
    let gumInfoType = requestInfo.gumInfoType;//안내 방법
    let gumInfoTypeNm = "";//안내 방법
    let gumInfoTyWay = "";
    if(gumInfoType == "1"){
      gumInfoTypeNm = "문자안내 - 알림톡(카카오톡)";
      gumInfoTyWay = maskingFnc.telNo(requestInfo.reqMobile, "*");
    } else if(gumInfoType == "4"){
      gumInfoTypeNm = "문자안내 - SMS(휴대전화 등)";
      gumInfoTyWay = maskingFnc.telNo(requestInfo.reqMobile, "*");
    } else if(gumInfoType == "2"){
      gumInfoTypeNm = "전자우편(eMail)안내";
      gumInfoTyWay = maskingFnc.emailId(requestInfo.reqEmailId,"*",3) + "@" + requestInfo.reqEmailProvider;
    } else if(gumInfoType == "3") {//"3"
      gumInfoTypeNm = "음성안내";
      gumInfoTyWay = maskingFnc.telNo(requestInfo.reqTel, "*");
    }
    
    if(requestInfo.reqGubun == "3"){
      infoArray =  {
        noinfo: {
//          title: this.state.description.minwonNm,
          gcReqGubun: [reqGubun, "신청 구분"],
          agreeYn: [requestInfo.agreeYn === "Y"? "동의":"미동의", "확인 및 동의"], //
        }
      }
    }else{
      infoArray =  {
      noinfo: {
//        title: this.state.description.minwonNm,
        gcReqGubun: [reqGubun, "신청 구분"],
        gumInfoTy: [gumInfoTypeNm + " : " + gumInfoTyWay, "검침일 안내 방법"],
        agreeYn: [requestInfo.agreeYn === "Y"? "동의":"미동의", "확인 및 동의"], //
      }
    }
    }
		
  	return infoArray;
  }

  setState(nextState: any) {
    this.state = nextState;
  }

  setEventListeners() {
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
  
  // 입력사항 검증 로직
  verify() {
    const requestInfo = this.state.requestInfo;
    
  	if(!requestInfo.reqGubun){
      citizenAlert("신청 구분을 선택해 주세요.").then(result => {
        if(result){
          $("#aGubun1").focus();
        }
      });
      return false;
  	}
  	if(requestInfo.reqGubun !== "3"){
      if(!requestInfo.gumInfoType){
        citizenAlert("검침일 안내 방법을 선택해 주세요.").then(result => {
          if(result){
            $("#bGubun1").focus();
          }
        });
        return false;
      }
      if(requestInfo.gumInfoType == "0" && !$("#cGubun1").hasClass("on") && !$("#cGubun4").hasClass("on")){
        citizenAlert("알림톡, SMS 중에 하나를 선택해 주세요.");
        return false;
      }
      
      if(requestInfo.gumInfoType == "2"){//이메일 선택 시
        if(!requestInfo.reqEmailId){
          citizenAlert("이메일 아이디를 입력해 주세요.").then(result => {
            if(result){
              $("#reqEmailId").focus();
            }
          });
          return false;
        }
        if(!requestInfo.reqEmailProvider){
          citizenAlert("전자우편(eMail) 도메인 형식을 알맞게 입력해 주세요.").then(result => {
            if(result){
              $("#reqEmailProvider").focus();
            }
          });
          return false;
        }
      }
      if(requestInfo.gumInfoType == "3" && !requestInfo.reqTel){//음성안내 선택 시
          citizenAlert("유선전화 전화번호를 입력해 주세요.").then(result => {
            if(result){
              $("#reqTel").focus();
            }
          });
          return false;
            
      }
      
      if ((requestInfo.gumInfoType == "1" || requestInfo.gumInfoType == "4") && !requestInfo.reqMobile) {
          citizenAlert("휴대전화번호를 입력해 주세요.").then(result => {
            if(result){
              $("#reqMobile").focus();
            }
          });
          return false;
      }
      
      if (requestInfo.gumInfoType == "3" && phonePattern.test(requestInfo.reqTel) !== true) {
        citizenAlert("전화번호가 형식에 맞지 않습니다. 확인 후 다시 입력해 주세요.").then(result => {
          if(result){
            $("#reqTel").focus();
          }
        });
        return false;
      };
      
      if ((requestInfo.gumInfoType == "1" || requestInfo.gumInfoType == "4") && mobilePattern.test(requestInfo.reqMobile) !== true) {
        citizenAlert("휴대전화 번호가 형식에 맞지 않습니다. 확인 후 다시 입력해 주세요.").then(result => {
          if(result){
            $("#reqMobile").focus();
          }
        });
        return false;
      };
    }
  	
    if(requestInfo.agreeYn != "Y"){
      citizenAlert("안내문을 확인하시고 자가검침 신청에 동의해 주세요.").then(result => {
        if(result){
          $("#agreeYn").focus();
        }
      });
      return false;
    }
    
    return true;
  }
  
  //신청 구분에 따른 UI 활성화
  toggleUIGubun(gubunTy:string, columnNm:string, value:string) {
    var id = "#"+gubunTy+value;
    var classNm = "."+gubunTy;
    
	  //disble처리
	  if($(id).hasClass("disable")){
		  return false;
	  }
	  let gumInfoType = this.state.requestInfo.gumInfoType;
	  if(id=== "#bGubun0" && (gumInfoType === '1' || gumInfoType === '4')){
      return false;
    }
    
	  if(id === "#aGubun3"){
      $("#gumInfoTypeCategory0").removeClass("display-block");
      $("#gumInfoTypeCategory0").addClass("display-none");
      $("#gumInfoTypeCategory1").removeClass("display-block");
      $("#gumInfoTypeCategory1").addClass("display-none");
      $("#gumInfoTypeCategory2").removeClass("display-block");
      $("#gumInfoTypeCategory2").addClass("display-none");
      $("#gumInfoTypeCategory3").removeClass("display-block");
      $("#gumInfoTypeCategory3").addClass("display-none");
    }else  if(id === "#aGubun1" || id === "#aGubun2"){
      $("#gumInfoTypeCategory0").removeClass("display-none");
      $("#gumInfoTypeCategory0").addClass("display-block");
    }
    if(id === "#bGubun0" || id === "#cGubun1" || id === "#cGubun4"){
      //문자안내
      $("#gumInfoTypeCategory1").removeClass("display-none");
      $("#gumInfoTypeCategory1").addClass("display-block");
      $("#gumInfoTypeCategory2").removeClass("display-block");
      $("#gumInfoTypeCategory2").addClass("display-none");
      $("#gumInfoTypeCategory3").removeClass("display-block");
      $("#gumInfoTypeCategory3").addClass("display-none");
    }else if(id === "#bGubun2"){
      //이메일
      $("#gumInfoTypeCategory3").removeClass("display-none");
      $("#gumInfoTypeCategory3").addClass("display-block");
      $("#gumInfoTypeCategory1").removeClass("display-block");
      $("#gumInfoTypeCategory1").addClass("display-none");
      $("#gumInfoTypeCategory2").removeClass("display-block");
      $("#gumInfoTypeCategory2").addClass("display-none");
    }else if(id === "#bGubun3"){
      //음성
      $("#gumInfoTypeCategory2").removeClass("display-none");
      $("#gumInfoTypeCategory2").addClass("display-block");
      $("#gumInfoTypeCategory1").removeClass("display-block");
      $("#gumInfoTypeCategory1").addClass("display-none");
      $("#gumInfoTypeCategory3").removeClass("display-block");
      $("#gumInfoTypeCategory3").addClass("display-none");
    }
	  this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        [columnNm] : value
      }
    });
    
    if(id=== "#bGubun0"){
      $("#cGubun1").addClass("off");
      $("#cGubun1").removeClass("on");
      $("#cGubun4").addClass("off");
      $("#cGubun4").removeClass("on");
    }
    
	  radioMW(id, classNm);
  }
  
  
  handleReqMobile(e: any){
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        reqMobile: e.target.value.replace(/[^0-9]/g,"").substring(0, 11)
      }
    });
    e.target.value = this.state.requestInfo.reqMobile.substring(0, 11);
    phoneNumberInputValidation(e.target, 12, mobilePattern);
    
  }
  
  handleReqTel(e: any){
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        reqTel: e.target.value.replace(/[^0-9]/g,"").substring(0, 11)
      }
    });
    e.target.value = this.state.requestInfo.reqTel.substring(0, 11);
    phoneNumberInputValidation(e.target, 12, phonePattern);
  }
  
  handleReqEmailId(e: any){
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        reqEmailId: e.target.value.replace(/[^a-z0-9,\-,\_]/gi,'').substring(0, 30)
      }
    });
    e.target.value = this.state.requestInfo.reqEmailId.substring(0, 30);
  }
  
  handleReqEmailProvider(e: any){
    const requestInfo = this.state.requestInfo;
    // 상태를 변경하기 전에 선택된 select 박스를 해지해 준다.
    if (requestInfo.reqEmailProviderSelector !== 0) {
      const $reqEmailProviderSelector = document.getElementById("reqEmailProviderSelector");
      $reqEmailProviderSelector.options[requestInfo.reqEmailProviderSelector].selected = false;
    }
    let emailId = requestInfo.reqEmailId;

    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        reqEmailProvider: e.target.value.replace(/[^a-z0-9.]/gi,'').substring(0, 30),
        reqEmailProviderSelector: 0,
        reqEmail: `${emailId}@${e.target.value.replace(/[^a-z0-9.]/gi,'').substring(0, 30)}`,
      }
    });
    e.target.value = this.state.requestInfo.reqEmailProvider.substring(0, 30);
  }
  
  handleReqEmailProviderSelector(e: any){
    const requestInfo = this.state.requestInfo;
    let emailId = requestInfo.reqEmailId;
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        reqEmail: `${emailId}@${e.target.value}`,
        // 공급자의 domain을 공급자로 저장한다.
        reqEmailProvider: e.target.value,
        // 선택한 이메일 공급자의 index를 저장한다.
        reqEmailProviderSelector: e.target.options.selectedIndex
      }
    });
//    this.render();
    $("#reqEmailProvider").val(e.target.value);
    var $reqEmailProviderSelector = document.getElementById("reqEmailProviderSelector");
    $reqEmailProviderSelector.options[this.state.requestInfo.reqEmailProviderSelector].selected = true;
  }
  
  //확인사항 동의여부(agreeYn)
  handleAgreeYn(e: any) {
    this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          [e.target.id]: e.target.checked ? "Y" : "N"
        }
      });
    }
  
  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;
    
    //'해지' 신청의 경우 불필요한 값을 제거한다.
    if(that.state.requestInfo.reqGubun == "3"){//REQ_GUBUN
      this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          reqTel: '',
          reqMobile: '',
          reqEmail: '',
          reqEmailId: '',
          reqEmailProvider: '',
          reqEmailProviderSelector: 0
        }
      });
    }
    //검침일 안내 방법에 따라 불필요한 값을 제거한다.(GUM_INFO_TYPE)
    if(that.state.requestInfo.gumInfoType == "1" || that.state.requestInfo.gumInfoType == "4"){//알림톡,전자우편
      this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          reqTel: '',
          reqEmail: '',
          reqEmailId: '',
          reqEmailProvider: '',
          reqEmailProviderSelector: 0,
        }
      });
    }else if(that.state.requestInfo.gumInfoType == "2"){//전자우편
      this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          reqTel: '',
          reqMobile: '',
        }
      });
    }else if(that.state.requestInfo.gumInfoType == "3"){//음성안내
      this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          reqMobile: '',
          reqEmail: '',
          reqEmailId: '',
          reqEmailProvider: '',
          reqEmailProviderSelector: 0,
        }
      });
    }
    
    var url = gContextUrl + "/citizen/common/procApplyOwnMtrinspc.do";
    const sendData = this.getQueryString();
    

    fetch('POST', url, sendData, function (error:any, data:any) {
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
    const requestInfo = this.state.requestInfo;
    const statusInfo = this.state.statusInfo;

	  const ownMtrinspcObjcData = {
		  reqGubun: requestInfo.reqGubun,//신청구분  (1:신규, 2:변경, 3:해지 )
		  gumInfoType: requestInfo.gumInfoType?requestInfo.gumInfoType:statusInfo.ownGcNtceCd.substring(1),//검침일 안내 방법 (01: 문자안내(알림톡) 02: 전자우편 03: 음성안내 04: 문자안내(SMS/LMS))
		  reqNm: requestInfo.reqNm,
		  reqTel: requestInfo.reqTel?requestInfo.reqTel:"",
		  reqMobile: requestInfo.reqMobile?requestInfo.reqMobile:"",
		  reqEmail: requestInfo.reqEmail?requestInfo.reqEmail:"",
		  appDueDt: requestInfo.appDueDt,
		  relation: requestInfo.relation,
		  agreeYn: requestInfo.agreeYn
	  }
    return {
      ...this.state.parent.state.applicationPage.getSuyongaQueryString(),
      'cvplInfo.cvpl.minwonCd': this.state.minwonCd,
      ...ownMtrinspcObjcData
    };
  }
  
  getStatusString() {
    
  }


  render() {
  	const that = this;
   const applyInfo = this.state.parent.state.applicationPage.applicantInfo.state.applyInfo;
    
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
      <!-- 자가검침 신청(신규, 변경, 해지) -->
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기">
        <span class="i-01">${that.state.description.minwonNm}</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
	            <li>
                <label for="gcReqFlagNm" class="input-label"><span>서비스 사용현황</span></label>
                <input type="text" id="gcReqFlagNm" class="input-box input-w-2" readonly style="pointer-events:none;" value="${that.state.requestInfo.gcReqFlagNm}">
              </li>
	            <li>
		            <label class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>신청 구분을 선택해 주세요.</span></label>
		            <ul class="mw-opt mw-opt-3 mw-opt-type03 row">
			            <li id="aGubun1" class="aGubun off">
			            	<a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('aGubun', 'reqGubun', '1');"><span>신규</span></a>
			            </li>
			            <li id="aGubun2" class="aGubun off">
			            	<a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('aGubun', 'reqGubun', '2');"><span>변경</span></a>
			            </li>
			            <li id="aGubun3" class="aGubun off">
			            	<a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('aGubun', 'reqGubun', '3');"><span>해지</span></a>
			            </li>
		            </ul>
	            </li>
	            <li id="gumInfoTypeCategory0" class="display-block">
		            <label class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>검침일 안내방법을 선택해 주세요.</span></label>
		            <ul class="mw-opt mw-opt-3 mw-opt-type03 row">
			            <li id="bGubun0" class="bGubun off">
			            	<a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('bGubun', 'gumInfoType', '0');"><span>문자안내</span></a>
			            </li>
			            <li id="bGubun3" class="bGubun off">
			            	<a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('bGubun', 'gumInfoType', '3');"><span>음성안내</span></a>
			            </li>
			            <li id="bGubun2" class="bGubun off">
			            	<a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('bGubun', 'gumInfoType', '2');"><span>전자우편</span></a>
			            </li>
		            </ul>
	            </li>
	            <li id="gumInfoTypeCategory1" class="display-none">
	             <ul class="mw-opt mw-opt-2 row">
	               <li id="cGubun1" class="cGubun off">
                   <a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('cGubun', 'gumInfoType', '1');"><span>알림톡(카카오톡)</span></a>
                 </li>
                 <li id="cGubun4" class="cGubun off">
                   <a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('cGubun', 'gumInfoType', '4');"><span>SMS(휴대전화 등)</span></a>
                 </li>
	             </ul>
	             <label for="reqMobile" class="input-label"><span class="form-req"><span class="sr-only">필수</span>휴대전화</span></label>
                <input value="${!that.state.requestInfo.reqMobile ? applyInfo.applyMobile : that.state.requestInfo.reqMobile}" maxlenth="12"
                  onkeyup="${that.path}.handleReqMobile(event)"
                  onpaste="${that.path}.handleReqMobile(event)"
                  type="text" id="reqMobile" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
	            </li>
	            <li id="gumInfoTypeCategory2" class="display-none">
                <label for="reqTel" class="input-label"><span class="form-req"><span class="sr-only">필수</span>전화번호</span></label>
                <input value="${!that.state.requestInfo.reqTel ? applyInfo.applyPhone : that.state.requestInfo.reqTel}" maxlenth="12"
                  onkeyup="${that.path}.handleReqTel(event)"
                  onpaste="${that.path}.handleReqTel(event)"
                  type="text" id="reqTel" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
              </li>
              <li id="gumInfoTypeCategory3" class="email display-none">
                <label for="reqEmailId" class="input-label"><span class="form-req"><span class="sr-only">필수</span>이메일</span></label>
                <input value="${!that.state.requestInfo.reqEmailId ? applyInfo.applyEmailId : that.state.requestInfo.reqEmailId}"
                  onkeyup="${that.path}.handleReqEmailId(event)"
                  onpaste="${that.path}.handleReqEmailId(event)"
                  type="text" id="reqEmailId" class="input-box input-w-mail"> 
                <span>@</span>
                <label for="reqEmailProvider"><span class="sr-only">이메일 주소</span></label>
                <input
                  onkeyup="${that.path}.handleReqEmailProvider(event)"
                  onpaste="${that.path}.handleReqEmailProvider(event)"
                  type="text" id="reqEmailProvider" class="input-box input-w-mail"
                  value="${!that.state.requestInfo.reqEmailProvider ? applyInfo.applyEmailProvider : that.state.requestInfo.reqEmailProvider}">
                <label for="reqEmailProviderSelector"><span class="sr-only">이메일 선택</span></label>
                <select id="reqEmailProviderSelector"
                  onchange="${that.path}.handleReqEmailProviderSelector(event)"
                  title="이메일도메인선택" class="input-box input-w-mail2 ">
                  <option value="">직접입력</option>
                  <option value="naver.com">naver.com</option>
                  <option value="hotmail.com">hotmail.com</option>
                  <option value="chol.com">chol.com</option>
                  <option value="dreamwiz.com">dreamwiz.com</option>
                  <option value="empal.com">empal.com</option>
                  <option value="freechal.com">freechal.com</option>
                  <option value="gmail.com">gmail.com</option>
                  <option value="hanmail.net">hanmail.net</option>
                  <option value="hanafos.com">hanafos.com</option>
                  <option value="hanmir.com">hanmir.com</option>
                  <option value="hitel.net">hitel.net</option>
                  <option value="korea.com">korea.com</option>
                  <option value="nate.com">nate.com</option>
                  <option value="netian.com">netian.com</option>
                  <option value="paran.com">paran.com</option>
                  <option value="yahoo.com">yahoo.com</option>
                </select>
              </li>
            </ul>
          </div>
        </div><!-- //form-mw-box -->
      </div><!-- //form-mw23 -->
      </div><!-- //mw-box -->    
      
      <div class="mw-box">
        <div id="form-mw-p" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw-p');" title="닫기">
            <span class="i-53">민원 신청 안내 및 동의</span></a>
          </div>
          <div class="form-mw-box display-block row">
            <div class="form-mv row">
              <ul class="policy2">
                <li class="agree-more">
                  <label><span class="sr-only">자가검침 신청 동의</span></label>
                  <input type="checkbox" name="agreeYn" id="agreeYn" 
                    onclick="${that.path}.handleAgreeYn(event)"
                    ${that.state.requestInfo.agreeYn ? 'checked' : ''}>
                    <label class="chk-type" for="agreeYn"><span>안내문을 확인하였고, 자가검침 신청에 동의합니다.<p class="tx-opt">(필수)</p></span></label>
                    <div class="p-depth-1 bd-gray">
                      <ul>
                        <li>아래 사항에 해당하는 경우 직권해지 될 수 있습니다.</li>
                        <li class="dot">자가검침에 연속 2회 이상 참여하지 않은 경우</li>
                        <li class="dot">지침을 허위로 입력한 경우</li>
                        <li class="dot">이사 등으로 신청인이 해당 주소지에 거주하지 않을 경우</li>
                        <li class="dot">원격검침으로 변경된 경우</li>
                        <li class="dot2">검침 값은 인터넷(i121.seoul.go.kr), 모바일아리수 앱, 전화(1588-5121) 중 선택하여 입력합니다.</li>
                        <li class="dot2">1회당 600원을 감면합니다.(「서울특별시 수도 조례 시행규칙」 제27조)</li>
                      </ul>
                    </div>
                    <!--
                    <p id="b1217Agree" class="p-depth-1 bd-gray">
                    아래 사항에 해당하는 경우 직권해지 될 수 있습니다.<br>
                    - 자가검침에 연속 2회 이상 참여하지 않은 경우<br>
                    - 지침을 허위로 입력한 경우<br>
                    - 이사 등으로 신청인이 해당 주소지에 거주하지 않을 경우<br>
                    - 원격검침으로 변경된 경우<br>
                    ※ 검침 값은 인터넷(i121.seoul.go.kr), 모바일아리수 앱, 전화(1588-5121) 중 선택하여 입력합니다.<br>
                    ※ 1회당 600원을 감면합니다.(「서울특별시 수도 조례 시행규칙」 제27조)<br>
                    </p>
                    -->
                </li>
              </ul>
            </div>
          </div>
        </div>
      `;

    document.getElementById('minwonRoot').innerHTML = template;

    this.renderDescription(document.getElementById('desc'));
    
    this.afterRender();
  }
  
  //상태가 아닌 UI class 적용은 랜더링 후에 처리되어야 한다.
  afterRender() {
    const that = this;
    const gcReqFlag = that.state.requestInfo.gcReqFlag;
    const applyInfo = this.state.parent.state.applicationPage.applicantInfo.state.applyInfo;
    const viewApplyInfo = this.state.parent.state.applicationPage.applicantInfo.state.viewApplyInfo;
    
    
    
    //첫화면 신청인 값으로 셋팅
    that.setState({
          ...that.state,
          requestInfo: {
            ...that.state.requestInfo,
            reqMobile: $("#reqMobile").val(),//'신규'입력
            reqTel: $("#reqTel").val(),
            reqEmail: $("#reqEmailId").val()+"@"+$("#reqEmailProvider").val(),
            reqEmailId: $("#reqEmailId").val(),
            reqEmailProvider: $("#reqEmailProvider").val(),
            reqEmailProviderSelector : (!that.state.requestInfo.reqEmailProviderSelector && that.state.requestInfo.reqEmailProviderSelector !== 0) ? applyInfo.applyEmailProviderSelector : that.state.requestInfo.reqEmailProviderSelector
          }
        });
    $("#reqEmailProviderSelector option:eq("+this.state.requestInfo.reqEmailProviderSelector+")").prop("selected", true);
    
    //R: 현재 자가 검침중, Y: 자가검침 대상,  N: 자가검침 대상아님
    if(gcReqFlag=="R"){
      $("#aGubun1").addClass("disable");//신규 diabled
    }else if(gcReqFlag=="Y"){
      $("#aGubun2, #aGubun3").addClass("disable");///변경,해지 diabled
    }
    
    //신청 구분  (1:신규, 2:변경, 3:해지 )
    var reqGubun = that.state.requestInfo.reqGubun;
    $("#aGubun"+reqGubun).addClass("on");
    $("#aGubun"+reqGubun).removeClass("off");
    
    if("#aGubun"+reqGubun == "#aGubun3"){
      $("#gumInfoTypeCategory0").removeClass("display-block");
      $("#gumInfoTypeCategory0").addClass("display-none");
      $("#gumInfoTypeCategory1").removeClass("display-block");
      $("#gumInfoTypeCategory1").addClass("display-none");
      $("#gumInfoTypeCategory2").removeClass("display-block");
      $("#gumInfoTypeCategory2").addClass("display-none");
      $("#gumInfoTypeCategory3").removeClass("display-block");
      $("#gumInfoTypeCategory3").addClass("display-none");
    }else{
      //검침일 안내 방법 (01: 문자안내(알림톡) 02: 전자우편 03: 음성안내 04: 문자안내(SMS/LMS))
      var gumInfoType = that.state.requestInfo.gumInfoType;
       if(gumInfoType === "2"){
        // 선택된 셀렉트 박스로 상태를 복구한다.
        var $reqEmailProviderSelector = document.getElementById("reqEmailProviderSelector") as HTMLSelectElement;
        $reqEmailProviderSelector!.options[this.state.requestInfo.reqEmailProviderSelector].selected = true;
        $("#gumInfoTypeCategory3").removeClass("display-none");
        $("#gumInfoTypeCategory3").addClass("display-block");
        that.toggleUIGubun('bGubun', 'gumInfoType', gumInfoType);
      }else if(gumInfoType == "1" || gumInfoType == "4"){
        $("#bGubun0").addClass("on");
        $("#bGubun0").removeClass("off");
        that.toggleUIGubun('cGubun', 'gumInfoType', gumInfoType);
      }else{
        that.toggleUIGubun('bGubun', 'gumInfoType', gumInfoType);
      }
      /*
      $("#bGubun"+gumInfoType).addClass("on");
      $("#bGubun"+gumInfoType).removeClass("off");
      if(gumInfoType === "2"){
        // 선택된 셀렉트 박스로 상태를 복구한다.
        var $reqEmailProviderSelector = document.getElementById("reqEmailProviderSelector") as HTMLSelectElement;
        $reqEmailProviderSelector!.options[this.state.requestInfo.reqEmailProviderSelector].selected = true;
        $("#gumInfoTypeCategory3").removeClass("display-none");
        $("#gumInfoTypeCategory3").addClass("display-block");
      }else if(gumInfoType == "1" || gumInfoType == "4"){
        $("#bGubun0").addClass("on");
        $("#bGubun0").removeClass("off");
        $("#cGubun"+gumInfoType).addClass("on");
        $("#cGubun"+gumInfoType).removeClass("off");
        $("#gumInfoTypeCategory1").removeClass("display-none");
        $("#gumInfoTypeCategory1").addClass("display-block");
      }else if(gumInfoType == "3"){
        $("#gumInfoTypeCategory2").removeClass("display-none");
        $("#gumInfoTypeCategory2").addClass("display-block");
      }
      */
    }
    
    //확인사항 확인 여부
    if(that.state.requestInfo.agreeYn == "Y"){
      $("#agreeYn").prop("checked", true);
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
              <div class="tit-mw-h5 row"><span>유의사항</span></div>
              <div class="info-mw-list">
                <ul>
                  <li style="margin-left:0px;">1. 다음의 경우에는 직권 해지될 수 있습니다.<br />
                       - 자가검침에 연속 2회 이상 참여하지 않은 경우<br />
                       - 지침을 허위로 입력한 경우<br />
                       - 급수업종이 가정용이 아닌 업종으로 변경된 경우<br />
                       - 이사 등으로 신청인이 해당 주소지에 거주하지 않을 경우
                  </li style="margin-left:0px;">
                  <li style="margin-left:0px;">2. 연 1회 이상 사업소에서 확인검침하여 자가검침 사용량과 상이할 경우 요금 차액을 추징할 수 있습니다. </li>
                </ul>
              </div>
    `;
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