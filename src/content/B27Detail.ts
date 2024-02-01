import CyberMinwon from '../infra/CyberMinwon';
import { fetch} from './../util/unity_resource';
import JusoSearchPanel from "./../components/JusoSearchPanel";
import { radioMW, showHideInfo, hideElement, phoneNumberInputValidation, phoneNumberInputValidationRemove
, citizenAlert, citizen_alert, citizenConfirm, maskingFnc, clearObject, phonePattern } from './../util/uiux-common';

declare var gContextUrl: string;
declare var fncCutByByte: (str: string, maxByte: number) => string;
declare var document: any;
declare var $: any;
declare var cyberMinwon: CyberMinwon;

export default class B27DetailPage {
  state: {
    minwonCd: string;
    parent: any;
    jusosearchShow: any;
    path: string;
    statusInfo: any;
    requestInfo: {
      receiveWay:string,//발송방법 (우편/FAX/이메일)
      receiveWayMemo:string,//발송주소 및 연락처
      reprintDue:string,//재출력납기(전체/정기분/체납분)
      reprintRsn:string//재출력사유
    };
    saveInfo: {//receiveWayMemo가 같은 필드를 쓰고있어, fax와 email값 저장 용도로 생성한 변수
      receiveWayMemoEmail:string,
      receiveWayMemoFax:string
    }
    workAddrInfo: {
      zipcode: string,
      fullDoroAddr: string,
      addr2: string,
      sido: string,
      sigungu: string,
      umd: string,
      hdongNm: string,
      dong: string,
      doroCd: string,
      doroNm: string,
      dzipcode: string,
      bupd: string,
      bdMgrNum: string,
      bdBonNum: string,
      bdBuNum: string,
      bdnm: string,
      bdDtNm: string,
      addr1: string,
      bunji: string,
      ho: string,
      extraAdd: string,
      specAddr: string,
      specDng: string,
      specHo: string,
      floors: string,
      workAddress: string,
      workDetailAddress: string,
      workDisplayAddress: string
    };
    viewWorkInfo:{
      viewWorkAddress: any
    };
    description: any;
    viewRequestInfo: any;
    isSubmitSuccessful: boolean;
    submitResult: any,
  }
  jusoTarget: string;
  jusoSearchPanel: JusoSearchPanel;
  
  constructor(parent:any , minwonCd: string) {
    this.state = {
      
      minwonCd,
      parent,
      
      jusosearchShow: false,
      path: 'cyberMinwon.state.currentModule.state.currentPage',
      statusInfo: {
      	
      },
      requestInfo: {
	    	receiveWay:"",
	    	receiveWayMemo:"",
	    	reprintDue:"",
	    	reprintRsn:""
      },
      saveInfo: {//receiveWayMemo가 같은 필드를 쓰고있어, 화면에서 사용 용도로 생성한 변수
      receiveWayMemoEmail:"",
      receiveWayMemoFax:""
      },
      workAddrInfo: {
        zipcode: '',
        fullDoroAddr: '',
        addr2: '',
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
        addr1: '',
        bunji: '',
        ho: '',
        extraAdd: '',
        specAddr: '',
        specDng: '',
        specHo: '',
        floors: '',
        
        workAddress: '',
        workDetailAddress: '',
        workDisplayAddress: ''
      },
      
      viewWorkInfo: {
        viewWorkAddress: ['', '도로명주소'],
      },
      description: {},
      viewRequestInfo: {},
      isSubmitSuccessful: false,
      submitResult: {}
    };

    this.setInitValue();
    this.jusoTarget = 'jusosearcholdOwner'
    this.jusoSearchPanel = new JusoSearchPanel(this, this.state.path, this.jusoTarget, this.handleSelectJuso);
  }

  // 초기값 설정
  setInitValue() {
    const that = this;
    that.setState({
  		...that.state,
  		requestInfo: {
        receiveWay:"우편",
        receiveWayMemo:"",
        reprintDue:"전체",
        reprintRsn:""
      },
      workAddrInfo: {
        zipcode: '',//zipcode
        fullDoroAddr: '',//fullDoroAddr, 
        addr2: '',
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
        bdMgrNum: '',
        bdBonNum: '',
        bdBuNum: '',
        bdnm: '',
        bdDtNm: '',
        addr1: '',
        bunji: '',
        ho: '',
        extraAdd: '',
        specAddr: '',
        specDng: '',
        specHo: '',
        floors: '',
        
        workAddress: '',
        workDetailAddress: '',
        workDisplayAddress: ''
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
  	const that = this;
  	
  	var viewB10Detail:any = {};
//  	viewB10Detail.title = that.state.description.minwonNm;
  	viewB10Detail.receiveWay = [that.state.requestInfo.receiveWay == "fax" ? "팩스(FAX)" : that.state.requestInfo.receiveWay, "수신방법"]
  	viewB10Detail.reprintDue = [that.state.requestInfo.reprintDue, "선택납기"]
  	viewB10Detail.reprintRsn = [that.state.requestInfo.reprintRsn, "재발급 사유"]
  	
  	if(that.state.requestInfo.receiveWay == "우편"){
      viewB10Detail.fullDoroAddr = ["("+this.state.workAddrInfo.zipcode+") "+this.state.workAddrInfo.workDisplayAddress, "수신처(우편주소)"]
    }
  	
  	if(that.state.requestInfo.receiveWay == "fax"){
      viewB10Detail.receiveWayMemo = [maskingFnc.telNo(that.state.requestInfo.receiveWayMemo, "*"), "수신처(팩스번호)"]
      //viewB10Detail.receiveWayMemo = [that.state.requestInfo.receiveWayMemo.replace(/^(01[016789]{1}|02|0[3-9]{1}[0-9]{1}|050.{1})([0-9]{3,4})([0-9]{4})$/g, '$1-$2-$3'), "연락처"]
    }  
  	
  	if(that.state.requestInfo.receiveWay == "이메일"){
      let receiveWayMemo = that.state.requestInfo.receiveWayMemo;
      let receiveEmailId = receiveWayMemo.substring(0,receiveWayMemo.indexOf("@"));
      let receiveEmailProvider = receiveWayMemo.substring(receiveWayMemo.indexOf("@")+1);
      viewB10Detail.receiveWayMemo = [maskingFnc.emailId(receiveEmailId,'*',3)+ '@' +receiveEmailProvider, "수신처(전자우편)"]
    }  
  	
    var infoArray = {viewB10Detail}
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
    //const that = this;
    const requestInfo = this.state.requestInfo;
    const workAddrInfo = this.state.workAddrInfo;
    if(!requestInfo.receiveWay){
      citizenAlert("수신방법을 선택해 주세요.").then(result => {
        if(result){
          $("#receiveWay1").focus();
        }
      });
      return false;
    }
    if(!requestInfo.reprintDue){
      citizenAlert("납기를 선택해 주세요.").then(result => {
        if(result){
          $("#reprintDue1").focus();
        }
      });
      return false;
    }
    if(!requestInfo.reprintRsn){
      citizenAlert("재발급 사유를 입력해 주세요.").then(result => {
        if(result){
          $("#reprintRsn").focus();
        }
      });
      return false;
    }
    
    if(requestInfo.receiveWay == "우편"){
       if(!workAddrInfo.zipcode){
        citizenAlert("우편주소를 검색해 주세요.").then(result => {
          if(result){
            $("#zipcode").focus();
          }
        });
        return false;
      }
    }
    
    if(requestInfo.receiveWay != "우편"){
      if(!requestInfo.receiveWayMemo){
        if(requestInfo.receiveWay == "fax"){
          citizenAlert("팩스번호를 입력해 주세요.").then(result => {
          if(result){
              $("#receiveWayMemo").focus();
            }
          });
          return false;
        }else{
          citizenAlert("우편주소를 입력해 주세요.").then(result => {
          if(result){
              $("#receiveWayMemo").focus();
            }
          });
          return false;
        }
      }
      //첫번째 번호 01+(016789) / 02 / 0+(3~9)+(0~9) / 050+(0~9)
      //가운데 번호 3또는 4자리의 숫자
      //4자리의 숫자
      var faxPattern = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1}|050.{1})([0-9]{3,4})([0-9]{4})$/;
      if(requestInfo.receiveWay == "fax" && faxPattern.test(requestInfo.receiveWayMemo) !== true){
        citizenAlert("입력하신 팩스번호가 팩스번호 형식에 맞지 않습니다.").then(result => {
        if(result){
            $("#receiveWayMemo").focus();
          }
        });
        return false;
      }
      //@앞쪽에 위치한 아이디 부분 문자 중 영문,숫자를 포함하여 점( . ), 하이픈( - ), 언더바( _ ) 까지 허용
      var emailPattern = /^([\w\.\_\-])*[a-zA-Z0-9]+([\w\.\_\-])*([a-zA-Z0-9])+([\w\.\_\-])+@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,8}$/i;
      if(requestInfo.receiveWay == "이메일" && emailPattern.test(requestInfo.receiveWayMemo) !== true){
        citizenAlert("입력하신 이메일이 형식에 맞지 않습니다.").then(result => {
        if(result){
            $("#receiveWayMemo").focus();
          }
        });
        return false;
      }
    }
    return true;
  }
 
  //신청 구분에 따른 UI 활성화
  toggleUIGubun(id: string, column: string, value: string) {
    var classNm = "."+column
    
    radioMW(id, classNm);
   
    if(column == "receiveWay"){
      const beforeReceiveWay = this.state.requestInfo.receiveWay;
      //$("#receiveWayMemo").val("");
      let applyInfo = this.state.parent.state.applicationPage.applicantInfo.state.applyInfo
      let receiveWayMemo; 
      if(value == "fax"){
        $("label[for='receiveWayMemo']").text('팩스번호');
        $("#receiveWayMemo").attr("placeholder", "'-' 없이 번호입력");
        $(".mail").hide();
        $(".notMail").show();
        $("#eMailText").hide();
        receiveWayMemo = !receiveWayMemo ? "" : receiveWayMemo;
      } else if(value == "이메일"){
        $("label[for='receiveWayMemo']").text('전자우편');
        $("#receiveWayMemo").attr("placeholder", "수신처(전자우편) 입력");
        $(".mail").hide();
        $(".notMail").show();
        $("#eMailText").show();
        phoneNumberInputValidationRemove($("#receiveWayMemo")[0]);
        receiveWayMemo = !this.state.saveInfo.receiveWayMemoEmail ? applyInfo.applyEmailId+"@"+applyInfo.applyEmailProvider : this.state.saveInfo.receiveWayMemoEmail;
        if(receiveWayMemo == "@"){receiveWayMemo = ""}
      } else {//우편
        $(".mail").show();
        $(".notMail").hide();
        $("#eMailText").hide();
        this.state.workAddrInfo.workDisplayAddress ? $("#workDisplayAddress").parent().show() : $("#workDisplayAddress").parent().hide();
        phoneNumberInputValidationRemove($("#receiveWayMemo")[0]);
        receiveWayMemo = !receiveWayMemo ? "" : receiveWayMemo;
      }
      this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          receiveWayMemo : receiveWayMemo//발송 방법이 바뀌면 초기화 한다
        }
      })
      $("#receiveWayMemo").val(receiveWayMemo);
    }
    
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        [column] : value
      }
    })
  }
  
  //재출력사유
  handleReprintRsn(e: any) {
    this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          [e.target.id]: fncCutByByte(e.target.value, 500)
        }
      });
      e.target.value = fncCutByByte(e.target.value, 500)
    }
  //연락처 및 이메일
  handleReceiveWayMemo(e: any) {
    this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          [e.target.id]: this.state.requestInfo.receiveWay== "이메일"? e.target.value.replace(/[^a-z0-9@_.-]/gi, "").substring(0, 50) : e.target.value.replace(/[^0-9]/g, "").substring(0, 12)
        }
      });
      e.target.value = this.state.requestInfo.receiveWay== "이메일"? e.target.value.replace(/[^a-z0-9@_.-]/gi, "").substring(0, 50) : e.target.value.replace(/[^0-9]/g, "").substring(0, 12)
      this.state.requestInfo.receiveWay === "fax" ? phoneNumberInputValidation(e.target, 12, phonePattern) : phoneNumberInputValidationRemove(e.target);
      
      
      
     //receiveWay 필드에 
     if(this.state.requestInfo.receiveWay== "이메일"){
        this.setState({
          ...this.state,
          saveInfo: {
            ...this.state.saveInfo,
            receiveWayMemoEmail: e.target.value.replace(/[^a-z0-9@_.-]/gi, "").substring(0, 50)
          }
        });
      } else if(this.state.requestInfo.receiveWay== "fax"){
        this.setState({
          ...this.state,
          saveInfo: {
            ...this.state.saveInfo,
            receiveWayMemoFax: e.target.value.replace(/[^0-9]/g, "").substring(0, 12)
          }
      });
    }
    }
    
    
    
  // 콜백에서 사용되기 때무에 arrow function을 사용한다.
  // 수정 시에 this의 score에 주의한다.
  handleSelectJuso = (jusoInfo: any, detailAddress: string, action?: string) => {
    this.setState({
      ...this.state,
      workAddrInfo: {
        ...this.state.workAddrInfo,
        zipcode: jusoInfo.zipNo,//우편번호
        addr1: (jusoInfo.siNm +" "+jusoInfo.sggNm+" "+jusoInfo.emdNm).trim(),//지역명
        addr2: '',//상세주소(java 소스에서 만들어주는 값)
        fullDoroAddr: jusoInfo.roadAddr,
        sido: jusoInfo.siNm,//시도명
        sigungu: jusoInfo.sggNm,//시군구명
        umd: jusoInfo.emdNm,//법정읍면동명
        //hdongNm: '',//행정동 명(java단에서 만들어줌)
        dong: jusoInfo.emdNm,//행정읍동명 같지만 값이 없어 umd와 같은 값을 준다
        doroCd: jusoInfo.rnMgtSn,//도로명코드
        doroNm: jusoInfo.rn,//도로명
        bupd: jusoInfo.admCd,//법정동코드
        bdMgrNum: jusoInfo.bdMgtSn,//건물관리번호 (java단에서 어차피 만들어줌)
        bdBonNum: jusoInfo.buldMnnm,//건물본번
        bdBuNum: jusoInfo.buldSlno,//건물부번
        bdnm: jusoInfo.bdNm,//건물명
        bdDtNm: '',//상세건물명(요금관리시스템:값 없음, 도로명주소API 사용하기 어려운 값)
        
        
        bunji: jusoInfo.lnbrMnnm,//번지
        ho: jusoInfo.lnbrSlno,//호
        extraAdd: '',//입력받는 상세주소
        specAddr: '',
        specDng: '',
        specHo: '',
        floors: '',
        
        workAddress: jusoInfo.roadAddr,
        workDetailAddress : detailAddress,//상세주소
        workDisplayAddress : (jusoInfo.roadAddr+" "+detailAddress).trim()//요약주소(보여주기용)  
      }
    });
    document.getElementById('zipcode').value = jusoInfo.zipNo;
    document.getElementById('workDisplayAddress').innerHTML = jusoInfo.roadAddr+" "+detailAddress
    document.getElementById('workDisplayAddress').parentNode.style.display = 'none';
    if(action !== "clear"){
      document.getElementById('workDisplayAddress').parentNode.style.display = 'block';
      this.toggleJusoSearch();
    }
//    const $zip: HTMLInputElement = document.getElementById('zipcode') as HTMLInputElement;
//    const $addr: HTMLInputElement = document.getElementById('fullDoroAddr') as HTMLInputElement;
//    $zip.value = jusoInfo.zipNo
//    $addr.value = jusoInfo.roadAddr
//    $("#extraAdd").focus();
  }
  
  toggleJusoSearch() {
    showHideInfo('#' + this.jusoTarget);
    this.setState({
      ...this.state,
      jusosearchShow: !this.state.jusosearchShow
    });
    clearObject(this.jusoSearchPanel.state.jusoResult);
    this.jusoSearchPanel.render();
    //!document.getElementById(this.jusoTarget+"doro") ? this.jusoSearchPanel.render() : "";
    $("#jusosearcholdOwnerdoro > input").focus();
  }
 
  handleExtraAdd(e: any) {

    this.setState({
      ...this.state,
      workAddrInfo: {
        ...this.state.workAddrInfo,
        [e.target.id]: e.target.value.substring(0, 50)
      }
    });
    e.target.value = e.target.value.substring(0, 50)
  }
  
  disableJusoSearch() {
    hideElement('#' + this.jusoTarget);
    this.setState({
      ...this.state,
      jusosearchShow: false,
    });
  }
  
  //취득 예정 일자
  handleOldTelno(e:any) {
      this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          [e.target.id]: e.target.value.replace(/[^0-9]/g, "").substring(0, 11)
        }
      });
      e.target.value = e.target.value.replace(/[^0-9]/g, "").substring(0, 11)
      phoneNumberInputValidation(e.target, 11, /(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/g);
    }
  // 신청인 주소를 복사해서 수신처(우편주소)에 입력한다.
  // 신청인 주소와 함께 우편번호도 복사해야 한다.
  handleCopyApplyAddress() {
    
    const applicantInfo = this.state.parent.state.applicationPage.applicantInfo.state.applyInfo;
    //let workAddrInfo = this.state.workAddrInfo;
    
    let displayAddr = applicantInfo.applyAddress ? applicantInfo.applyAddress : ""//요약주소(보여주기용)
    displayAddr = applicantInfo.applyDetailAddress.trim().length > 0 ? displayAddr + " " + applicantInfo.applyDetailAddress : displayAddr;
    
    this.setState({
      ...this.state,
      workAddrInfo: {
        // 신청인 주소에 도로 주소를 복사한다.
        workAddress: applicantInfo.applyAddress,
        workDetailAddress: applicantInfo.applyDetailAddress,
        workDisplayAddress: displayAddr,
        zipcode: applicantInfo.zipcode,
        sido: applicantInfo.sido,
        sigungu: applicantInfo.sigungu,
        fullDoroAddr: applicantInfo.fullDoroAddr,
        umd: applicantInfo.umd,//법정동명
        hdongNm: applicantInfo.hdongNm,//행정동명
        dong: '',
        doroCd: applicantInfo.doroCd,
        doroNm: applicantInfo.doroNm,//도로명
        dzipcode: '',
        bupd: applicantInfo.bupd,//(수전주소-표준법정동 코드) <-> reqStdBdongCd(청구지수조 - 표준법정동 코드)
        bdMgrNum: '',
        bdBonNum: applicantInfo.bdBonNum,//건물본번
        bdBuNum: applicantInfo.bdBuNum,//건물부번
        bdnm: applicantInfo.bdnm,//건물명
        bdDtNm: applicantInfo.bdDtNm,//기타주소
        addr2: applicantInfo.addr2,//주소2
        addr1: applicantInfo.addr1,//주소1
        bunji: applicantInfo.bunji,//본번
        ho: applicantInfo.ho,//부번
        extraAdd: applicantInfo.extraAdd,//기타주소
        specAddr: applicantInfo.specAddr,//건물명
        specDng: applicantInfo.specDng,//동
        specHo: applicantInfo.specHo,//호
        floors: applicantInfo.floors//지하 층 번호
      }
    });
    this.render();
    if($("#jusosearcholdOwner").is(":visible")){
      this.toggleJusoSearch();
    }
  }
    
  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyBillReprint.do";
    const sendData = this.getQueryString();+
    

    fetch('POST', url, sendData, function (error: any, data: any) {
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
  	const workAddrInfo = this.state.workAddrInfo;
  	
    let requestData:any = {
    		receiveWay: requestInfo.receiveWay,//발송 방법(우편/fax/이메일)
    		reprintDue: requestInfo.reprintDue,//재출력 납기(전체/정기분/체납분)
    		reprintRsn: requestInfo.reprintRsn,//재출력 사유
    		receiveWayMemo: requestInfo.receiveWayMemo//[팩스 연락처/이메일]
    }
    
    if(requestInfo.receiveWay == "우편"){
      requestData['cvplInfo.cvplAddr[2].cvplAdresTy'] = 'WORK',
      requestData['cvplInfo.cvplAddr[2].zipcode'] = workAddrInfo.zipcode,
      requestData['cvplInfo.cvplAddr[2].fullDoroAddr'] = workAddrInfo.fullDoroAddr,
      requestData['cvplInfo.cvplAddr[2].addr2'] = workAddrInfo.addr2,
      requestData['cvplInfo.cvplAddr[2].sido'] = workAddrInfo.sido,
      requestData['cvplInfo.cvplAddr[2].sigungu'] = workAddrInfo.sigungu,
      requestData['cvplInfo.cvplAddr[2].umd'] = workAddrInfo.umd,
      requestData['cvplInfo.cvplAddr[2].hdongNm'] = workAddrInfo.hdongNm,
      requestData['cvplInfo.cvplAddr[2].dong'] = workAddrInfo.dong,
      requestData['cvplInfo.cvplAddr[2].doroCd'] = workAddrInfo.doroCd,
      requestData['cvplInfo.cvplAddr[2].doroNm'] = workAddrInfo.doroNm,
      requestData['cvplInfo.cvplAddr[2].dzipcode'] = workAddrInfo.dzipcode,
      requestData['cvplInfo.cvplAddr[2].bupd'] = workAddrInfo.bupd,
      requestData['cvplInfo.cvplAddr[2].bdMgrNum'] = workAddrInfo.bdMgrNum,
      requestData['cvplInfo.cvplAddr[2].bdBonNum'] = workAddrInfo.bdBonNum,
      requestData['cvplInfo.cvplAddr[2].bdBuNum'] = workAddrInfo.bdBuNum,
      requestData['cvplInfo.cvplAddr[2].bdnm'] = workAddrInfo.bdnm,
      requestData['cvplInfo.cvplAddr[2].bdDtNm'] = workAddrInfo.bdDtNm,
      requestData['cvplInfo.cvplAddr[2].addr1'] = workAddrInfo.addr1,
      requestData['cvplInfo.cvplAddr[2].bunji'] = workAddrInfo.bunji,
      requestData['cvplInfo.cvplAddr[2].ho'] = workAddrInfo.ho,
      requestData['cvplInfo.cvplAddr[2].extraAdd'] = workAddrInfo.workDetailAddress,
      requestData['cvplInfo.cvplAddr[2].specAddr'] = workAddrInfo.specAddr,
      requestData['cvplInfo.cvplAddr[2].specDng'] = workAddrInfo.specDng,
      requestData['cvplInfo.cvplAddr[2].specHo'] = workAddrInfo.specHo,
      requestData['cvplInfo.cvplAddr[2].floors'] = workAddrInfo.floors
    } 
    
    
    return {
      ...this.state.parent.state.applicationPage.getSuyongaQueryString(),
      'cvplInfo.cvpl.minwonCd': this.state.minwonCd,
      ...requestData
    };
  }
  
  getStatusString() {
    
  }


  render() {
  	const that = this;
  	const applyInfo = this.state.parent.state.applicationPage.applicantInfo.state.applyInfo;
    if(that.state.requestInfo.receiveWay == "이메일"){
      that.state.requestInfo.receiveWayMemo = !that.state.requestInfo.receiveWayMemo ? applyInfo.applyEmailId+"@"+applyInfo.applyEmailProvider : that.state.requestInfo.receiveWayMemo;
      if(that.state.requestInfo.receiveWayMemo == "@"){
        that.state.requestInfo.receiveWayMemo = "";
      }
    } 
    
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
        <!-- 고지서재발급 신청 -->
        <div id="form-mw23" class="row">
          <div class="tit-mw-h3">
            <a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기"><span class="i-01">고지서 재발급 신청</span></a>
          </div>
          <div class="form-mw-box display-block row">
            <div class="form-mv row">
              <ul>
  	            <li>
  		            <label class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>수신방법을 선택해 주세요.</span></label>
  		            <ul class="mw-opt mw-opt-3 mw-opt-type03 row">
  			            <li id="receiveWay1" class="receiveWay off">
  			            	<a href="javascript:void(0);" onclick="${that.state.path}.toggleUIGubun('#receiveWay1', 'receiveWay', '우편');"><span>우편</span></a>
  			            </li>
  			            <li id="receiveWay2" class="receiveWay off">
  			            	<a href="javascript:void(0);" onclick="${that.state.path}.toggleUIGubun('#receiveWay2', 'receiveWay', 'fax');"><span>팩스(FAX)</span></a>
  			            </li>
  			            <li id="receiveWay3" class="receiveWay off">
  			            	<a href="javascript:void(0);" onclick="${that.state.path}.toggleUIGubun('#receiveWay3', 'receiveWay', '이메일');"><span>전자우편</span></a>
  			            </li>
  		            </ul>
  	            </li>
  	            <li>
  		            <label class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>납기를 선택해 주세요.</span></label>
  		            <ul class="mw-opt mw-opt-3 mw-opt-type03 row">
  			            <li id="reprintDue1" class="reprintDue off">
  			            	<a href="javascript:void(0);" onclick="${that.state.path}.toggleUIGubun('#reprintDue1', 'reprintDue', '전체');"><span>전체</span></a>
  			            </li>
  			            <li id="reprintDue2" class="reprintDue off">
  			            	<a href="javascript:void(0);" onclick="${that.state.path}.toggleUIGubun('#reprintDue2', 'reprintDue', '정기분');"><span>정기분</span></a>
  			            </li>
  			            <li id="reprintDue3" class="reprintDue off">
  			            	<a href="javascript:void(0);" onclick="${that.state.path}.toggleUIGubun('#reprintDue3', 'reprintDue', '체납분');"><span>체납분</span></a>
  			            </li>
  		            </ul>
  	            </li>
  	            <li>
  	            	<label for="reprintRsn" class="input-label"><span class="form-req"><span class="sr-only">필수</span>재발급사유</span></label>
  	            	<input onkeyup="${that.state.path}.handleReprintRsn(event)" onchange="${that.state.path}.handleReprintRsn(event)"
  	            	value="${that.state.requestInfo.reprintRsn}"
  	            	type="text" id="reprintRsn" name="reprintRsn" class="input-box input-w-0" maxlength="120" placeholder="재출력 사유 입력"/>
  	            </li>
  	            <li class="notMail">
  	            	<label for="receiveWayMemo" class="input-label"><span class="form-req"><span class="sr-only">필수</span>팩스번호</span></label>
  	            	<input onkeyup="${that.state.path}.handleReceiveWayMemo(event)" onchange="${that.state.path}.handleReceiveWayMemo(event)"
  	            	value="${that.state.requestInfo.receiveWayMemo}"
  	            	type="text" id="receiveWayMemo" name="receiveWayMemo" class="input-box input-w-2" maxlength="50" placeholder="수신처(팩스번호) 입력"/>
  	            	<p id="eMailText" class="form-cmt pre-star tip-blue">전자우편(이메일)으로 고지서 스캔본을 발송합니다.</p>
  	            </li>
  	            
  	            <li class="mail mw-opt-2">
                  <label for="zipcode" class="input-label"><span class="form-req"><span class="sr-only">필수</span>우편주소</span></label>
                  <span onClick="${that.state.path}.toggleJusoSearch()">
                    <input type="text" value="${that.state.workAddrInfo.zipcode}" id="zipcode"
                      class="input-box input-w-2" placeholder="우편번호" disabled>
                  </span>
                  <a class="btn btnSS btnTypeA"
                    onClick="${that.state.path}.toggleJusoSearch()"><span>주소검색</span></a>
                  <a class="btn btnSS btnTypeA"
                    onClick="${that.state.path}.handleCopyApplyAddress(event);"><span>신청인주소</span></a>
                </li>`;
                
                //<li class="mail">-->
        template += `${that.state.workAddrInfo.workDisplayAddress}` ? `<li class="mail">` : `<li class="mail" style="display:none;">` ;
        template += `
                  <label for="workDisplayAddress" class="input-label display-inline"><span class="sr-only">주소</span></label>
                  <div id="workDisplayAddress" class="input-box input-w-2 result-address">${that.state.workAddrInfo.workDisplayAddress}</div>
                </li>
                <li id="${that.jusoTarget}" class="display-block"></li>
              </ul>
            </div>
          </div><!-- 고지서재발급 신청 -->
        </div><!-- //form-mw23 -->
      </div><!-- //mw-box -->    
      `;

    document.getElementById('minwonRoot')!.innerHTML = template;
    
    if (!this.state.jusosearchShow) {
      showHideInfo('#' + this.jusoTarget);
    }

    this.renderDescription(document.getElementById('desc'));
    this.afterRender();
    this.jusoSearchPanel.render();
  }
  
  //상태가 아닌 UI class 적용은 랜더링 후에 처리되어야 한다.
  afterRender() {
  	const that = this;
  	this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
        }
      });
    if(that.state.requestInfo.receiveWay == "우편"){
      $("#receiveWay1").addClass("on"); 
      $("#receiveWay1").removeClass("off");
      $(".mail").show();
      that.state.workAddrInfo.workDisplayAddress ? $("#workDisplayAddress").parent().show() : $("#workDisplayAddress").parent().hide();
      $(".notMail").hide();
      $("#eMailText").hide();
    } else if(that.state.requestInfo.receiveWay == "fax"){
      $("#receiveWay2").addClass("on"); 
      $("#receiveWay2").removeClass("off");
      $("label[for='receiveWayMemo']").text('팩스번호');
      $("#receiveWayMemo").attr("placeholder", "'-' 없이 번호입력");
      $(".mail").hide();
      $(".notMail").show();
      $("#eMailText").hide();
    } else {//이메일
      $("#receiveWay3").addClass("on"); 
      $("#receiveWay3").removeClass("off");
      $("label[for='receiveWayMemo']").text('전자우편');
      $("#receiveWayMemo").attr("placeholder", "수신처(전자우편) 입력");
      $(".mail").hide();
      $(".notMail").show();
      $("#eMailText").show();
    }
    
    if(that.state.requestInfo.reprintDue == "전체"){
      $("#reprintDue1").addClass("on"); 
      $("#reprintDue1").removeClass("off"); 
    } else if(that.state.requestInfo.reprintDue == "정기분"){
      $("#reprintDue2").addClass("on"); 
      $("#reprintDue2").removeClass("off"); 
    } else {//체납분
      $("#reprintDue3").addClass("on"); 
      $("#reprintDue3").removeClass("off"); 
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