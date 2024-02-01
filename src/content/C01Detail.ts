import CyberMinwon from '../infra/CyberMinwon';
import { fetch, fetchMultiPart } from './../util/unity_resource';
import { pwInputValValidation, citizenAlert, citizen_alert, citizenConfirm, maskingFnc, enNumPassWordPattern, radioMW, phoneNumberInputValidation, phonePattern, mobilePattern, emailProviderPattern } from './../util/uiux-common';
declare var fncCutByByte: (str: string, maxByte: number) => string;

declare var gContextUrl: string;
declare var gVariables: any;
declare var document: any;
declare var $: any;
declare var cyberMinwon: CyberMinwon;

export default class C01DetailPage {
  state: {
      minwonCd: string;
      parent: any;
      isSubmitSuccessful: boolean;
      submitResult: any,
      statusInfo: any;
      isPwChecked: boolean;
      requestInfo: {
        [key : string]: string | any,
        userPw: string;
        appealSec: string; // 구분 질의, 건의, 고충민원
        appealSecNm: string;   // 구분명 질의, 건의, 고충민원
        subject: string;  // 제목
        contents: string; // 내용
        rtnWay: string; // 수신방법 : 0-전자우편, 1-휴대전화(알림톡), 2-우편 또는 유선
        fileName1: string; //첨부파일명
        file1: any; //첨부파일
        fileName2: string; //첨부파일명
        file2: any; //첨부파일
      },
      saveApplyInfo:{//본 화면과 '신청인' 정보 입력과 값을 공유하기 때문에 앞에서 입력한 값으로 되돌려야 할 경우 사용할 값
        saveApplyPhone: string;
        saveApplyMobile: string;
        saveApplyEmailId: string;
        saveApplyEmailProvider: string;
        saveApplyEmailProviderSelector: number;
      },
      viewRequestInfo: any;
      description: any;
  };
  path: string;
  
  constructor(parent: any, minwonCd: string) {
    this.state = {
      minwonCd,
      parent,
      isSubmitSuccessful: false,
      submitResult: {},
      statusInfo: {},
      isPwChecked: false,
      requestInfo: {
        userPw: '', // 기타민원 비밀번호
        appealSec: '',   // 구분 질의, 건의, 고충민원
        appealSecNm: '',   // 구분명 질의, 건의, 고충민원
        subject: '',   // 제목
        contents: '',  // 내용
        rtnWay: '',  // 수신방법 : 0-전자우편, 1-휴대전화(알림톡), 2-우편 또는 유선
        fileName1: '', //첨부파일명
        file1: '', //첨부파일
        fileName2: '', //첨부파일명
        file2: '' //첨부파일
      },
      saveApplyInfo:{
        saveApplyPhone: '',//
        saveApplyMobile: '',
        saveApplyEmailId: '',
        saveApplyEmailProvider: '',
        saveApplyEmailProviderSelector: 0
      },
      viewRequestInfo: {},
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
      isPwChecked: false,
      requestInfo: {
        userPw: '', // 기타민원 비밀번호
        appealSec: '',   // 구분 질의, 건의, 고충민원
        appealSecNm: '',   // 구분명 질의, 건의, 고충민원
        subject: '',   // 제목
        contents: '',  // 내용
        rtnWay: '',  // 수신방법 : 0-전자우편, 1-휴대전화(알림톡), 2-우편 또는 유선
        fileName1: '', //첨부파일명
        file1: '', //첨부파일
        fileName2: '', //첨부파일명
        file2: '', //첨부파일
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
    let rtnWayNm = "";
    const rtnWay = that.state.requestInfo.rtnWay;
    if(rtnWay === "0"){
      rtnWayNm = "전자우편";
    }else if(rtnWay === "1"){
      rtnWayNm = "휴대전화(알림톡)";
    }else if(rtnWay === "2"){
      rtnWayNm = "우편 또는 유선";
    }
    return {
      noinfo: {
        title: `${that.state.requestInfo.appealSecNm} 내용`,
        appealSecNm: [that.state.requestInfo.appealSecNm, '구분'],
        subject: [that.state.requestInfo.subject, '제목'],
        contents: [that.state.requestInfo.contents, '내용'],
        rtnWay: [rtnWayNm, '수신방법'],
        fileName1: [this.state.requestInfo.fileName1, '파일명'],
        fileName2: [this.state.requestInfo.fileName2, '파일명']
      }
    };
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

  setState(nextState: any) {
    this.state = nextState;
  }

  setEventListeners() {
  }

  // 입력사항 검증 로직
  verify() {
    const requestInfo = this.state.requestInfo;
    const applyInfo = this.state.parent.state.applicationPage.applicantInfo.state.applyInfo;
    
    if(requestInfo.rtnWay === "0"){
      if(applyInfo.applyEmailId === ""){
        citizenAlert("수신방법을 전자우편으로 선택 시 전자우편 아이디를 필수로 입력해 주세요.").then(result => {
          if(result){
            $("#applyEmailId").focus();
          }
        });
        return false;
      }else if(applyInfo.applyEmailProvider === ""){
        citizenAlert("수신방법을 전자우편으로 선택 시 전자우편 도메인을 필수로 입력해 주세요.").then(result => {
          if(result){
            $("#applyEmailProvider").focus();
          }
        });
        return false;
      }else if(emailProviderPattern.test(applyInfo.applyEmailProvider) !== true){
        citizenAlert("전자우편 도메인 형식을 알맞게 입력해 주세요.").then(result => {
          if(result){
            $("#applyEmailProvider").focus();
          }
        });
        return false;
      }
    }else if(requestInfo.rtnWay === "1" && !applyInfo.applyMobile){
      citizenAlert("수신방법을 휴대전화(알림톡)로 선택 시 휴대폰번호를 필수로 입력해 주세요.").then(result => {
        if(result){
          $("#applyMobile").focus();
        }
      });
      return false;
    }else if(requestInfo.rtnWay === "1" && mobilePattern.test(applyInfo.applyMobile) !== true){
      citizenAlert("휴대전화 번호가 형식에 맞지 않습니다. 확인 후 다시 입력해 주세요.").then(result => {
        if(result){
          $("#applyMobile").focus();
        }        
      });
      return false;
    }else if(requestInfo.rtnWay === "2" && !applyInfo.applyPhone){
      citizenAlert("수신방법을 우편 또는 유선으로 선택 시 전화번호를 필수로 입력해 주세요.").then(result => {
        if(result){
          $("#applyPhone").focus();
        }
      });
      return false;
    } else if(requestInfo.rtnWay === "2" && phonePattern.test(applyInfo.applyPhone) !== true){
      citizenAlert("전화번호가 형식에 맞지 않습니다. 지역번호를 포함한 정확한 전화번호를 입력해 주세요.").then(result => {
        if(result){
          $("#applyPhone").focus();
        }        
      });
      return false;
    }
    
    if(!requestInfo.userPw) {
      citizenAlert("비밀번호를 입력해 주세요.").then(result => {
        if(result){
          $("#userPw").focus();
        }
      });
      return false;
    }
    
    if(!enNumPassWordPattern.test(requestInfo.userPw)){
      citizenAlert("잘못된 형식의 비밀번호입니다.").then(result => {
        if(result){
          $("#userPw").focus();
        }
      });
      return false;
    }
    
    if(!this.state.isPwChecked){
      citizenAlert("비밀번호 확인이 다릅니다.").then(result => {
        if(result){
          $("#userPwConfirm").focus();
        }
      });
      return false;
    }
    
    if (!requestInfo.subject) {
      citizenAlert("제목을 입력해 주세요.").then(result => {
        if(result){
          $("#subject").focus();
        }
      });
      return false;
    }
    
    if(requestInfo === undefined || !requestInfo.contents) {
      citizenAlert("내용을 입력해 주세요.").then(result => {
        if(result){
          $("#contents").focus();
        }
      });
      return false;
    }
    return true;
  }
  
  handleUserPw(e: any){
    let value = e.target.value;
    
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        userPw: value
      }
    });
    e.target.value = this.state.requestInfo.userPw;
    
    if(!enNumPassWordPattern.test(value) || value.length < 4 || value.length > 12){
      $("#passChk").show();
    }else{
      $("#passChk").hide();
    }
  }
  
  handleUserPwBlur(e: any){
    let value = e.target.value;
    
    if(!enNumPassWordPattern.test(value) || value.length < 4 || value.length > 12){
      citizenAlert("비밀번호 형식을 지켜주세요.\n비밀번호는 하나 이상의 영문, 숫자를 포함하는 4~12자리로 입력해 주세요.").then(result => {
        if(result){
          e.target.focus();
        }
      });
      e.target.classList.remove('success');
      e.target.classList.add('err');
      return false;
    }else{
      e.target.classList.remove('err');
      e.target.classList.add('success');
      e.target.setCustomValidity("");
      return true;
    }
  }
  
  handleUserPwConfirm(e: any) {
    const userPass = this.state.requestInfo.userPw;
    let value = e.target.value;
    let pwChk = false;
    if(userPass !== value){
      e.target.classList.remove('success');
      e.target.classList.add('err');
      e.target.setCustomValidity("비밀번호가 일지하지 않습니다.");
      $("#passCheck").removeClass("txGreen").addClass("txRed");
      $("#passCheck").text("미일치");
      pwChk = false;
    }else{
      e.target.classList.remove('err');
      e.target.classList.add('success');
      e.target.setCustomValidity("");
      $("#passCheck").removeClass("txRed").addClass("txGreen");
      $("#passCheck").text("일치");
      pwChk = true;
    }
    if(e.type === "onblur" && !pwChk){
      
      e.target.focus();
    }
    this.setState({
      ...this.state,
      isPwChecked: pwChk
    });
  }
  
  handleChangeAppealSec(e: any) {
    
    let value = e.value;
    let name = e.options[e.selectedIndex].text;
    let preValue = this.state.requestInfo.appealSec;
    
    this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          appealSec: value,
          appealSecNm: name
        }
    });
  }
  
  //
  handleChangeSubject(e: any) {
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        subject: fncCutByByte(e.target.value, 150)
      }
    });
    e.target.value = this.state.requestInfo.subject;
  }
  
  handleChangeContents(e: any) {
    
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        contents: fncCutByByte(e.target.value, 4000)
      }
    });
    e.target.value = this.state.requestInfo.contents;
  }
  
  handleChangeFile(e: any) {
    const inputFile = e.target;
    
    let fileIdx = parseInt(inputFile.id.substring(inputFile.id.length-1));
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
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        ["file"+fileIdx]: inputFile,
        ["fileName"+fileIdx]: e.target.files[0].name
      }
    });
    $("#fileName"+fileIdx).val(e.target.files[0].name);
  }
  
  handleClickDeleteFile(e: any, idx: number) {
    let fileIdx = idx;
    let fileName = 'fileName'+fileIdx;
    let file = 'file'+fileIdx;
    if(!$("#"+fileName).val()){return false;}
    citizenConfirm("첨부된 파일을 삭제하시겠습니까?").then(result => {
      $("#"+fileName).focus();
      if(!result){
        return false;
      }
      
      $("#"+fileName).val("");
      $("#"+file).val("");
      
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
  
  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyEtcCvpl.do";
    var queryString = this.getQueryString();
    
    var formData = new FormData();
    
    for(let key in queryString){
      formData.append(key, queryString[key]);
    }
    
    for(let idx=1; idx <= 3; idx++){
      let fileData = that.state.requestInfo["file"+idx];
      if(fileData){
        formData.append("file"+idx,fileData.files[0]);
      }
      
    }
    
    fetchMultiPart(url, formData, function (error: any, data: any) {
      // 에러가 발생한 경우
      if (error) {
        citizenAlert(data.errorMsg+"\n" + that.state.description.minwonNm+"이 정상적으로 처리되지 않았습니다.");
        return;
      }
      that.setState({
        ...that.state,
        isSubmitSuccessful: data.resultCd === '00' ? true : false,
        submitResult: data
      });

      cyberMinwon.setResult(that.state.description.minwonNm, that, 'getResultView');

//      that.render();
    });
  }

  getQueryString() {
    const requestInfo = this.state.requestInfo;
    const statusInfo = this.state.statusInfo;
    const addInfo = this.state.parent.state.applicationPage.getAddData();

    const requestData = {
      // 기타 민원 데이터 셋 바인딩
      'cvplInfo.cvplProcnd.userPw': requestInfo.userPw,
      'appealSec': requestInfo.appealSec,
      'subject': requestInfo.subject,
      'minwonCont': requestInfo.contents,
      'rtnWay': requestInfo.rtnWay
    };

    return {
      ...this.state.parent.state.applicationPage.getSuyongaQueryString(),
      'cvplInfo.cvpl.minwonCd': this.state.minwonCd,
      ...requestData
    };
  }
  
  getStatusString() {
    const that = this;
  }
  //신청 구분에 따른 UI 활성화
  toggleUIGubun(gubunTy:string, columnNm:string, value:string) {
    
    const applyInfo = this.state.parent.state.applicationPage.applicantInfo.state.applyInfo;
    
    var id = "#"+columnNm+value;
    var classNm = "."+gubunTy;
    //disble처리
    if($(id).hasClass("disable")){
      return false;
    }
    
   this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        [columnNm] : value
      }
    });
    radioMW(id, classNm);
    
    //수신방법을 변경 하면 이전 화면에서 입력했던 신청인 값으로 되돌려주는 기능 추가(2023.01.06)
    if(this.state.requestInfo.rtnWay == "0"){//rtnWay : 0(전자우편)
      $(".rtnWayEmail").css("display", "block");
      $(".rtnWayMobile, .rtnWayPhone").css("display", "none");
      
      applyInfo.applyPhone = this.state.saveApplyInfo.saveApplyPhone;
      $("#applyPhone").val(applyInfo.applyPhone);
      phoneNumberInputValidation($("#applyPhone")[0], 12, phonePattern);
      applyInfo.applyMobile = this.state.saveApplyInfo.saveApplyMobile;
      $("#applyMobile").val(applyInfo.applyMobile);
      phoneNumberInputValidation($("#applyMobile")[0], 11, mobilePattern);
      
    } else if(this.state.requestInfo.rtnWay == "1"){//rtnWay : 1(휴대전화 문자/알림톡)
      $(".rtnWayMobile").css("display", "block");
      $(".rtnWayEmail, .rtnWayPhone").css("display", "none");
      
      applyInfo.applyEmailId = this.state.saveApplyInfo.saveApplyEmailId;
      $("#applyEmailId").val(applyInfo.applyEmailId);
      applyInfo.applyEmailProvider = this.state.saveApplyInfo.saveApplyEmailProvider;
      $("#applyEmailProvider").val(applyInfo.applyEmailProvider);
      applyInfo.applyEmailProviderSelector = this.state.saveApplyInfo.saveApplyEmailProviderSelector;
      
      applyInfo.applyPhone = this.state.saveApplyInfo.saveApplyPhone;
      $("#applyPhone").val(applyInfo.applyPhone);
      phoneNumberInputValidation($("#applyPhone")[0], 12, phonePattern);
      
    } else {//rtnWay : 2(우편 또는 유선)
      $(".rtnWayPhone").css("display", "block");
      $(".rtnWayEmail, .rtnWayMobile ").css("display", "none");
      
      applyInfo.applyEmailId = this.state.saveApplyInfo.saveApplyEmailId;
      $("#applyEmailId").val(applyInfo.applyEmailId);
      applyInfo.applyEmailProvider = this.state.saveApplyInfo.saveApplyEmailProvider;
      $("#applyEmailProvider").val(applyInfo.applyEmailProvider);
      applyInfo.applyEmailProviderSelector = this.state.saveApplyInfo.saveApplyEmailProviderSelector;
      
      applyInfo.applyMobile = this.state.saveApplyInfo.saveApplyMobile;
      $("#applyMobile").val(applyInfo.applyMobile);
      phoneNumberInputValidation($("#applyMobile")[0], 11, mobilePattern);
    }
  }

  //신청인 페이지 이메일 id 입력 연동
  handleApplyEmailId(e: any) {
    this.state.parent.state.applicationPage.applicantInfo.setState({
      ...this.state.parent.state.applicationPage.applicantInfo.state,
      applyInfo: {
        ...this.state.parent.state.applicationPage.applicantInfo.state.applyInfo,
        applyEmailId: e.target.value.replace(/[^a-z0-9,\-,\_]/gi,'').substring(0, 30)
      }
    });
    e.target.value = this.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyEmailId.substring(0, 30);
  }
  
  // 전자우편 공급자를 리스트에서 선택할 경우
  handleApplyEmailProviderSelector(e: any) {
    this.state.parent.state.applicationPage.applicantInfo.setState({
      ...this.state.parent.state.applicationPage.applicantInfo.state,
      applyInfo: {
        ...this.state.parent.state.applicationPage.applicantInfo.state.applyInfo,
        // 공급자의 domain을 공급자로 저장한다.
        applyEmailProvider: e.target.value,
        // 선택한 전자우편 공급자의 index를 저장한다.
        applyEmailProviderSelector: e.target.options.selectedIndex
      }
    });
    //this.render();

    var $applyEmailProviderSelector = document.getElementById("applyEmailProviderSelector");
    $applyEmailProviderSelector.options[this.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyEmailProviderSelector].selected = true;
    var $applyEmailProvider = document.getElementById("applyEmailProvider");
    $applyEmailProvider.value = e.target.value;
  }
  
  // 전자우편 공급자를 입력하는 루틴
  handleApplyEmailProvider(e: any) {
    // 상태를 변경하기 전에 선택된 select 박스를 해지해 준다.
    if (this.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyEmailProviderSelector !== 0) {
      const $applyEmailProviderSelector = document.getElementById("applyEmailProviderSelector");
      $applyEmailProviderSelector.options[this.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyEmailProviderSelector].selected = false;
    }

    this.state.parent.state.applicationPage.applicantInfo.setState({
      ...this.state.parent.state.applicationPage.applicantInfo.state,
      applyInfo: {
        ...this.state.parent.state.applicationPage.applicantInfo.state.applyInfo,
        applyEmailProvider: e.target.value.replace(/[^a-z0-9.]/gi,'').substring(0, 30),
        applyEmailProviderSelector: 0
      }
    });
    e.target.value = this.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyEmailProvider.substring(0, 30);
  }
  
  // 신청인 휴대번호 연동
  handleApplyMobile(e: any) {
    this.state.parent.state.applicationPage.applicantInfo.setState({
      ...this.state.parent.state.applicationPage.applicantInfo.state,
      applyInfo: {
        ...this.state.parent.state.applicationPage.applicantInfo.state.applyInfo,
        applyMobile: e.target.value.replace(/[^0-9]/g,"").substring(0, 11)
      }
    });
    e.target.value = this.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyMobile.substring(0, 11);
    if(this.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyMobile.length === 0){
      e.target.classList.remove("success","err");
    } else {
      phoneNumberInputValidation(e.target, 11, mobilePattern);
    }
  }
  
  // 신청인 전화번호 연동
  handleApplyPhone(e: any) {
    this.state.parent.state.applicationPage.applicantInfo.setState({
      ...this.state.parent.state.applicationPage.applicantInfo.state,
      applyInfo: {
        ...this.state.parent.state.applicationPage.applicantInfo.state.applyInfo,
        applyPhone: e.target.value.replace(/[^0-9]/g,"").substring(0, 12)
      }
    });
    e.target.value = this.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyPhone.substring(0, 12);
    if(this.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyPhone.length === 0){
      e.target.classList.remove("success","err");
    } else {
      phoneNumberInputValidation(e.target, 12, phonePattern);
    }
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
      <!-- 기타민원(질의, 건의, 고충) 신청 -->
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기">
        <span class="i-01">${that.state.description.minwonNm}</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label for="applyMobile" class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>처리결과 수신방법을 선택해주세요.</span></label>
                <ul class="mw-opt mw-opt-3 row">
                  <li id="rtnWay0" class="aGubun off">
                    <a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('aGubun', 'rtnWay', '0');"><span>전자우편</span></a>
                  </li>
                  <li id="rtnWay1" class="aGubun off">
                    <a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('aGubun', 'rtnWay', '1');"><span>휴대전화(알림톡)</span></a>
                  </li>
                  <li id="rtnWay2" class="aGubun off">
                    <a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('aGubun', 'rtnWay', '2');"><span>우편 또는 유선</span></a>
                  </li>
                </ul>
              </li>
              <li class="rtnWayEmail email" style="display:none;">
                <label for="applyEmailId" class="input-label"><span class="form-req" style="margin-top:0px;">전자우편</span></label>
                <input value="${that.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyEmailId}" placeholder="전자우편 아이디" onkeyup="${that.path}.handleApplyEmailId(event)" onpaste="${that.path}.handleApplyEmailId(event)" type="text" id="applyEmailId" class="input-box input-w-mail"> 
                <span>@</span>
                <label for="applyEmailProvider"><span class="sr-only">전자우편 주소</span></label>
                <input placeholder="도메인" onkeyup="${that.path}.handleApplyEmailProvider(event)" onpaste="${that.path}.handleApplyEmailProvider(event)" type="text" id="applyEmailProvider" class="input-box input-w-mail" 
                value="${that.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyEmailProvider}">
                <label for="applyEmailProviderSelector"><span class="sr-only">전자우편 선택</span></label>
                <select id="applyEmailProviderSelector" onchange="${that.path}.handleApplyEmailProviderSelector(event)" title="전자우편도메인선택" class="input-box input-w-mail2 ">
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
              <li class="rtnWayMobile" style="display:none;">
                <label for="applyMobile" class="input-label"><span class="form-req"><span class="sr-only">필수</span>휴대전화</span></label>
                <input value="${that.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyMobile}" maxlength="12"
                  onkeyup="${that.path}.handleApplyMobile(event)"
                  onpaste="${that.path}.handleApplyMobile(event)"
                  type="text" id="applyMobile" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
              </li>
              <li class="rtnWayPhone" style="display:none;">
                <label for="applyPhone" class="input-label"><span class="form-req"><span class="sr-only">필수</span>전화번호</span></label>
                <input value="${that.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyPhone}" maxlength="12"
                  onkeyup="${that.path}.handleApplyPhone(event)"
                  onpaste="${that.path}.handleApplyPhone(event)"
                  type="text" id="applyPhone" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
              </li>
              <p class="form-cmt pre-star tip-blue">연락처를 수정하시면 신청인 정보(전자우편, 휴대전화번호, 전화번호)도 함께 변경됩니다.</p>
              <li>
                <label for="userPw" class="input-label"><span class="form-req"><span class="sr-only">필수</span>비밀번호 </span></label>
                <input type="password" id="userPw" name="userPw" class="input-box input-w-2" placeholder="영문, 숫자를 포함하는 4~12자" maxlength="12"
                  pattern="[a-z0-9]*" value="${that.state.requestInfo.userPw}"
                  onchange="${that.path}.handleUserPw(event)" 
                  onkeyup="${that.path}.handleUserPw(event)"
                  onblur="${that.path}.handleUserPwBlur(event)">
                <span id="passChk" class="pre-star tip-red txRight">영문, 숫자를 포함하는 4~12자</span>
              </li>
              <li>
                <label for="userPwConfirm" class="input-label"><span class="form-req"><span class="sr-only">필수</span>번호확인</span></label>
                <input type="password" id="userPwConfirm" name="userPwConfirm" class="input-box input-w-2" placeholder="비밀번호 확인" maxlength="12"
                  pattern="[a-z0-9]*" value="${that.state.requestInfo.userPw}"
                  onchange="${that.path}.handleUserPwConfirm(event)"
                  onblur="${that.path}.handleUserPwConfirm(event)"
                  onkeyup="${that.path}.handleUserPwConfirm(event)">
                <span id="passCheck" class="txRight"></span>
              </li>
              <li>
                <label for="appealSec" class="input-label"><span class="form-req"><span class="sr-only">필수</span>구분</span></label>
                <select id="appealSec" name="appealSec" title="구분" class="input-box input-w-2"
                  onchange="${that.path}.handleChangeAppealSec(this)">
                  <option value="025002">질의</option>
                  <option value="025003">건의</option>    
                  <option value="025004">고충민원</option>
                </select>
              </li>
              <li>
                <label class="input-label"><span class="form-req"><span class="sr-only">필수</span>제목</span></label>
                <input type="text" id="subject" name="subject" class="input-box input-w-2" title="제목" maxlength="150" 
                  value="${that.state.requestInfo.subject}" placeholder="제목"
                  onchange="${that.path}.handleChangeSubject(event)"
                  onpaste="${that.path}.handleChangeSubject(event)">
              
              </li>
              <li>
                <label class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>내용을 입력해 주세요.</span></label>
                <textarea name="contents" id="contents" class="textarea-box" title="내용" value="" maxlength="4000"
                  onkeyup="${that.path}.handleChangeContents(event)" placeholder="내용 입력(최대 한글 1333자)"
                  onchange="${that.path}.handleChangeContents(event)">${that.state.requestInfo.contents}</textarea>
              </li>
              <li class="addfile">
                <label for="form-mw36-tx" class="input-label-1"><span>증빙자료를 등록해 주세요.</span></label>
                  <!--<div class="filebox">-->
                    <label for="file1" class="fileLabel">파일 선택</label>
                    <input type="text" id="fileName1" name="fileName1" value="${that.state.requestInfo.fileName1}" placeholder="선택된 파일 없음" readonly >
                    <input type="file" id="file1" name="file1" title="첨부파일" class="display-none"
                      onchange="cyberMinwon.state.currentModule.state.currentPage.handleChangeFile(event)">
                    <a href="javascript:void(0);" class="btn btnSS" onclick="cyberMinwon.state.currentModule.state.currentPage.handleClickDeleteFile(this,1)"><span>삭제</span></a>
                  <br />
                  <!--</div>-->
                  <!--<div class="filebox">-->
                    <label for="file2" class="fileLabel">파일 선택</label>
                    <input type="text" id="fileName2" name="fileName2" value="${that.state.requestInfo.fileName2}" placeholder="선택된 파일 없음" readonly >
                    <input type="file" id="file2" name="file2" title="첨부파일" class="display-none"
                      onchange="cyberMinwon.state.currentModule.state.currentPage.handleChangeFile(event)">
                    <a href="javascript:void(0);" class="btn btnSS" onclick="cyberMinwon.state.currentModule.state.currentPage.handleClickDeleteFile(this,2)"><span>삭제</span></a>
                  <!--</div>-->
              </li>
              <li>
                <p class="pre-star tip-blue">
                  등록 가능 파일 : 이미지(gif, jpg 등), 문서(pdf, hwp*, doc*, ppt*) (최대 파일 크기: ${gVariables['fileUploadSize']} MB)
                </p>
                  <!--등록 가능 파일 : [${gVariables['imgFileUploadPosible'].toString()}](최대 파일 크기: ${gVariables['fileUploadSize']} MB)-->
              </li>
          </div>
        </div><!-- //form-mw-box -->
      </div><!-- //form-mw23 -->
      </div><!-- //mw-box -->    
      `;

      document.getElementById('minwonRoot')!.innerHTML = template;

    this.renderDescription(document.getElementById('desc'));
    
    this.afterRender();
  }
  
  // 기본 설정값은 여기에서 랜더링 해야 한다.
  afterRender() {
    const that = this;
    
    //신청인에서 입력한 값 저장
    that.setState({
      ...that.state,
      saveApplyInfo: {
        ...that.state.saveApplyInfo,
        saveApplyPhone: that.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyPhone,
        saveApplyMobile: that.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyMobile,
        saveApplyEmailId: that.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyEmailId,
        saveApplyEmailProvider: that.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyEmailProvider,
        saveApplyEmailProviderSelector: that.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyEmailProviderSelector
      }
    })
    
    var $applyEmailProviderSelector = document.getElementById("applyEmailProviderSelector");
    $applyEmailProviderSelector.options[that.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyEmailProviderSelector].selected = true;
    
    $("#appealSec").val(that.state.requestInfo.appealSec ? that.state.requestInfo.appealSec : $("#appealSec option:selected").val())
                   .trigger("change");

    if(!that.state.requestInfo.rtnWay){
      that.toggleUIGubun('aGubun', 'rtnWay', "0");
      $(".rtnWayEmail").css("display", "block");
      $(".rtnWayMobile, .rtnWayPhone").css("display", "none");
    }else{
      that.toggleUIGubun('aGubun', 'rtnWay', that.state.requestInfo.rtnWay);
      if(that.state.requestInfo.rtnWay == "0"){
        $(".rtnWayEmail").css("display", "block");
        $(".rtnWayPhone, .rtnWayMobile").css("display", "none");
      } else if(that.state.requestInfo.rtnWay == "1"){
        $(".rtnWayMobile").css("display", "block");
        $(".rtnWayEmail, .rtnWayPhone").css("display", "none");
      } else {//rtnWay : 2(우편 또는 유선)
        $(".rtnWayPhone").css("display", "block");
        $(".rtnWayEmail, .rtnWayMobile ").css("display", "none");
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