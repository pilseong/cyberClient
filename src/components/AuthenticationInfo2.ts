import CyberMinwon from "../infra/CyberMinwon";
import {
  maskingFnc,  saupsoInfo, lpad,
  citizenAlert, citizenAlert3, citizenConfirm, serverTime
} from './../util/uiux-common';
declare var document: any;
declare var cyberMinwon: CyberMinwon;
declare var $: any;
declare var gContextUrl: string;
export default class AthenticationInfo2 {
  state: {
    isAuthenticated: boolean;
    type: string; // I -> ipin, M -> mobile, X -> certification  
    authInfo: {
      authNumber: string;
      authName: string;
      data: any;
      ci: string;
    },
    signData: any;
    authTarget:any;
  };
  path: string;
  devUrl: string;
  prodUrl: string;
  esignPop: any;
  yesSignPop: any;
  initVal: boolean;
  initCount:number;
  
  constructor(private parent: any, private callback?: (authInfo: any) => void, authTarget?:string) {
    this.state = {
      isAuthenticated: false,
      type: '', // I -> ipin, P -> phone, X -> certification  
      authInfo: {
        authNumber: '801119',
        authName: '김광수',
        data: {},
        ci: ''
      },
      signData: {},
      authTarget: authTarget
    }
    //this.path = 'cyberMinwon.state.currentModule.state.currentPage.authenticationInfo';
    this.path = 'cyberMinwon.state.currentModule.state.summaryPage.authenticationInfo';
    this.devUrl = 'http://220.76.91.64:5011/esign' //https://signdev.anyid.go.kr/esign/
    this.prodUrl = 'https://easysign.anyid.go.kr/esign/'
    this.esignPop = null
    this.yesSignPop = null
    this.initVal = false
    this.initCount = 0
  }

  setState(nextState: any) {
    if (this.state !== nextState)
      this.state = nextState;
  }
  
  isCheckAccount(){
    console.log(this.parent)
    const minwonCd = this.parent.state.parent.state.minwonCd
    //B14 화면일 경우
    //return this.parent.state.conditionInfo.isValidAccount
    //summaryPage 화면일 경우
    return this.parent.state.parent.state.steps[minwonCd].step[1].state.conditionInfo.isValidAccount
    
  }
  
  noticeCheck(authType:string){
    const serverTimeCall = serverTime()
    serverTimeCall.then(val => {
      //real 20240126180000 20240127060000
      //test 20240125100000 
      if(val >= '20240126220000' && val <= '20240127060000'){
        let noticeMsg = `
          <div style="text-align:center;"><span class="txStrong" style="font-size:16px; text-decoration: underline;">간편인증 서비스 일시 중단 안내</span></div>
          <p class="txBlue txStrong" style="text-align:justify;">- 중단일시 : 2024.1.26.(금) 22:00 ~ 1.27.(토) 06:00</p><br>
          <p style="text-align:justify;">간편인증 시스템 개선 작업으로 서비스가 일시 중단 되오니,<br>해당 시간동안은 다른 인증수단을 이용해 주시기 바랍니다.<br>이용에 불편을 드려 죄송합니다.</p>
        `
        citizenAlert3(noticeMsg).then(result => {
          if(result){
            console.log(`handleShowSignVal notice end`)
            return false;
          }else{
            return;
          }
        });
      }else{
        this.handleShowSignVal(authType)
      }
    })
  }
  
  handleShowSignVal(authType:string){
    const minwonCd = this.parent.state.parent.state.minwonCd
    const mobile = this.parent.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyMobile
    const requestInfo = this.parent.state.parent.state.steps[minwonCd].step[1].state.requestInfo
    let signVal = `<p class="form-info-box-gol"><전자서명 내용 확인><br>`
    signVal += `신청인: ${maskingFnc.name(requestInfo.authName,"*")}<br>
                                 생년월일: ${maskingFnc.authNumber(requestInfo.authNumber.substring(0,6),"*")}<br>
                                 휴대전화: ${maskingFnc.telNo(mobile, "*")}<br>
                                    은행명: ${requestInfo.bankName}<br>
                                 계좌번호: ${maskingFnc.account(requestInfo.bankAccountNumber, "*", 6)}<br><br>
               위 내용으로 전자서명 하시겠습니까?
               `;
    const signData = {
        'applyName':requestInfo.authName,
        'birthDay':requestInfo.authNumber.substring(0,6),
        'mobile':mobile,
        'bankName':requestInfo.bankName,
        'bankAccount':requestInfo.bankAccountNumber
    }
    this.setState({
      ...this.state,
      signData: signData
    })
    //yessign easysign niceu
    citizenConfirm(signVal).then(result => {
      if(result){
        if(authType == 'yessign'){
          this.handleYesSignAuthentication(signData)
        }else if(authType == 'easysign'){
          this.handleEasysignAuthentication(signData)
        }else{
          this.handleCertAuthentication(signData)
        }
      }else{
        return false;
      }
    });
  }
  
  //금융인증
  handleYesSignAuthentication(signData:any,authTarget?:string) {
    console.log(`handleYesSignAuthentication call`)
    //this.localCertiResult('금융인증서');
    //return;
    let status = `width=606, height=660, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no`
    const url = `/auth/yesSign.do?authTarget=`
    const target = `yesSignMain`
    window.name = "mainwin";
    $('#signData').val(signData)
    if(this.yesSignPop == null || this.yesSignPop.closed == true){
        this.yesSignPop = window.open(url, target, status)
    }
    //window.open(url, target, status)
    /*
    var signForm = $('#signDataForm')
    signForm.action = url
    signForm.method = 'POST'
    signForm.target = target
    signForm.submit()
    */
  }
  
  yesSignReciveMsg(e: any){
    
  }
  
  //공동인증
  handleCertAuthentication(signData:any) {
    //this.localCertiResult('공동인증서');
    const hostName = location.hostname;
    if((hostName === "localhost" || hostName.indexOf('98.42.34.126') === 0 || hostName.indexOf('98.42.34.254') === 0  || hostName.indexOf('98.42.34.22') === 0)){
      this.setNiceResult({},"U")
      return;
    }
    //return;
    window.name = "mainwin";
    window.open("/basic/nAuthCheckMain.do?type=checkPhone&subType=U", 'checkPhone', 
      "width=450, height=550, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no");
  }
  
  //행안부-간편인증
  handleEasysignAuthentication(signData:any) {
    //this.localCertiResult('간편인증-카카오');
    //return;
    const hostName = location.hostname;
    const status = 'toolbar=no,scrollbars=no,location=no,resizable=no,status=no,menubar=no,width=838,height=611'; // option
    if(this.esignPop == null || this.esignPop.closed == true){
        this.esignPop = window.open(this.prodUrl,"simpleSignNonMember",status)
        this.getAccessInfo("simpleSignNonMember")
    }
    /*
    window.name = "mainwin";
    window.open("/auth/easySign.do", 'easySign', 
      "toolbar=no,scrollbars=no,location=no,resizable=no,status=no,menubar=no,width=838,height=611");
    */
  }
  
  async getAccessInfo(data:string){
    const url = gContextUrl + '/auth/getAccessInfo.do'
//    console.log(url)
//    console.log(data)
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8")
    try{
        let res = await window.fetch(url,{
            method: 'post',
            headers: myHeaders,
            body: data
        })
        let getData = await res.json();
        this.sendData(getData)
    }catch(err: any){
        citizenAlert(`접속정보를 가져올 수 없습니다.`).then(result => {
        if(result){
          console.log(err)
        }
      })
    }
  }
  
  async getAccessInfo1(data:string){
    const url = gContextUrl + '/auth/getAccessInfo1.do'
//    console.log(url)
//    console.log(data)
    const reqForm = new FormData();
    reqForm.append('fn',data)
    reqForm.append('signData',this.state.signData)
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8")
    try{
        let res = await window.fetch(url,{
            method: 'post',
            headers: myHeaders,
            body: reqForm
        })
        let getData = await res.json();
        this.sendData(getData)
    }catch(err: any){
        citizenAlert(`접속정보를 가져올 수 없습니다.`).then(result => {
        if(result){
          console.log(err)
        }
      })
    }
  }
  
  ///* 간편인증 팝업 페이지 호출 */
  sendData(data:any){
//    console.log(data);
//    console.log(this);
    console.log('sendData 실행 =>> 팝업 유형:'+data.fn);
    setTimeout(() =>{
//      console.log("@@@@@ initVal  =  "+this.initVal);
      console.log("@@@@@ initCount  =  "+this.initCount);

      if(this.initVal){
          if(data.fn == "simpleAuth"){
              this.esignPop.postMessage('{"simpleType":"simpleAuth", "accKey":"'+data.accKey+'", "accToken":"'+data.accToken+'"}',"*");
          } else if(data.fn == "simpleSign"){
              this.esignPop.postMessage('{"simpleType":"simpleSign", "accKey":"'+data.accKey+'", "accToken":"'+data.accToken+'","signTarget":"'+data.signTarget+'"}',"*");
          } else if(data.fn == "simpleAuthNonMember"){
              this.esignPop.postMessage('{"simpleType":"simpleAuthNonMember", "accKey":"'+data.accKey+'", "accToken":"'+data.accToken+'"}',"*");
          } else if(data.fn == "simpleSignNonMember"){
              this.esignPop.postMessage('{"simpleType":"simpleSignNonMember", "accKey":"'+data.accKey+'", "accToken":"'+data.accToken+'","signTarget":"'+data.signTarget+'"}',"*");
          }
          this.initVal = false;
          this.initCount = 0;
      } else {
          if(this.initCount > 20){
              this.initCount = 0;
              return;
          }
          this.sendData(data);
          this.initCount++;
      }
    },300);
  }
  
  receiveMsg(event:any) {
    const data = event.data;
    const jsonData = JSON.parse(data);
    if(jsonData.initFlag == "true"){
      console.log("@@@@@ jsonData.initFlag  =  "+jsonData.initFlag);
      console.log("receiveMsg");
      cyberMinwon.state.unityMinwon.state.summaryPage.authenticationInfo.initVal = true;
      //$("#windowCallResult").text("성공");
      return;
    }
    console.log("@@@@@ jsonData.fn  =  "+jsonData.fn);
    if(jsonData.fn == "getToken"){
      if(jsonData.status == "success"){
          //$("#txId").text(jsonData.res.txId);
          console.log("@@@@@ jsonData.res success =  "+JSON.stringify(jsonData.res));
      } else {
          console.log("@@@@@ jsonData.res fail =  "+JSON.stringify(jsonData.res));
      }
    } else if(jsonData.fn == "authRequest"){
      if(jsonData.status == "success"){
          console.log("@@@@@ jsonData.res success =  "+JSON.stringify(jsonData.res));
      } else {
          console.log("@@@@@ jsonData.res fail =  "+JSON.stringify(jsonData.res));
      }
    } else {
      if(jsonData.status == "success"){
          console.log("@@@@@ jsonData.res success =  "+JSON.stringify(jsonData.res));
          //var jsonData = JSON.parse(data);
          //jsonData.jsonPath = $("#jsonPath").val();
          //if(jsonData.fn == "signComplete" || jsonData.fn == "signNonMemberComplete"){
          //    jsonData.signTargetOri = $("#signTarget").val();
          //}
          //var param = JSON.stringify(jsonData);
          const url = `https://i121.seoul.go.kr:38090/auth/result.do`
          $.ajax({
              type:"POST",
              url:url,
              dataType: "json",
              contentType: "application/json; charset=utf-8",
              data:data,
              success: (data:any) => {
                  console.log("data = " + JSON.stringify(data));
                  cyberMinwon.state.unityMinwon.state.summaryPage.authenticationInfo.showCertResult(`간편인증-${data.provider}`,data)
              }
          });
      } else {
          console.log("@@@@@ jsonData.res fail =  "+JSON.stringify(jsonData.res));
      }
    }
  }
  
  checkResult(sType:string ,userName:string,birthDay:string,phoneNumber?:string){
    const signData = this.state.signData
    if(sType == 'U' || sType == 'X'){
      if(signData.applyName == userName && signData.birthDay == birthDay){
        return true
      }else{
        citizenAlert(`신청정보와 전자서명(본인확인·본인인증) 정보가 일치 하지 않습니다.`).then(result => {
          if(result){
            let differ = ``
            if(signData.applyName != userName && signData.birthDay == birthDay){
              differ += `◇ 신청인(예금주): ${signData.applyName}<br>◇ 전자서명 인증자: ${userName}`
            }else if(signData.applyName == userName && signData.birthDay != birthDay){
              differ += `◇ 신청인(예금주) 생년월일: ${signData.birthDay}<br>◇ 전자서명 인증자 생년월일: ${birthDay}`
            }else if(signData.applyName != userName && signData.birthDay != birthDay){
              differ += `◇ 신청인(예금주): ${signData.applyName}<br>◇ 전자서명 인증자: ${userName}<br>
              ◇ 신청인(예금주) 생년월일: ${signData.birthDay}<br>◇ 전자서명 인증자 생년월일: ${birthDay}
              `
            }
            let resultEsign = `
                <p class="form-info-box-gol"><미일치 정보를 확인해주세요><br>
               ${differ}
                </p>
            `;
            $('#signResult').html(resultEsign)
          }
        });
        return false;
      }
    }else{
      if(signData.applyName == userName && signData.birthDay == birthDay && signData.mobile ==phoneNumber){
        return true
      }else{
        citizenAlert(`신청정보와 전자서명(본인확인·본인인증) 정보가 일치 하지 않습니다.`).then(result => {
          if(result){
            let differ = ``
            if(signData.applyName != userName && signData.birthDay == birthDay && signData.mobile ==phoneNumber){
              differ += `◇ 신청인(예금주): ${signData.applyName}<br>◇ 전자서명 인증자: ${userName}`
            }else if(signData.applyName == userName && signData.birthDay != birthDay && signData.mobile ==phoneNumber){
              differ += `◇ 신청인(예금주) 생년월일: ${signData.birthDay}<br>◇ 전자서명 인증자 생년월일: ${birthDay}`
            }else if(signData.applyName == userName && signData.birthDay == birthDay && signData.mobile !=phoneNumber){
              differ += `◇ 신청인(예금주) 휴대전화: ${signData.mobile}<br>◇ 전자서명 인증자 휴대전화: ${phoneNumber}`
            }else if(signData.applyName != userName && signData.birthDay != birthDay && signData.mobile ==phoneNumber){
              differ += `◇ 신청인(예금주): ${signData.applyName}<br>◇ 전자서명 인증자: ${userName}<br>
              ◇ 신청인(예금주) 생년월일: ${signData.birthDay}<br>◇ 전자서명 인증자 생년월일: ${birthDay}
              `
            }else if(signData.applyName == userName && signData.birthDay != birthDay && signData.mobile !=phoneNumber){
              differ += `◇ 신청인(예금주) 생년월일: ${signData.birthDay}<br>◇ 전자서명 인증자 생년월일: ${birthDay}<br>
              ◇ 신청인(예금주) 휴대전화: ${signData.mobile}<br>◇ 전자서명 인증자 휴대전화: ${phoneNumber}
              `
            }else if(signData.applyName != userName && signData.birthDay == birthDay && signData.mobile !=phoneNumber){
              differ += `◇ 신청인(예금주): ${signData.applyName}<br>◇ 전자서명 인증자: ${userName}<br>
              ◇ 신청인(예금주) 휴대전화: ${signData.mobile}<br>◇ 전자서명 인증자 휴대전화: ${phoneNumber}
              `
            }else if(signData.applyName != userName && signData.birthDay != birthDay && signData.mobile !=phoneNumber){
              differ += `◇ 신청인(예금주): ${signData.applyName}<br>◇ 전자서명 인증자: ${userName}<br>
              ◇ 신청인(예금주) 생년월일: ${signData.birthDay}<br>◇ 전자서명 인증자 생년월일: ${birthDay}<br>
              ◇ 신청인(예금주) 휴대전화: ${signData.mobile}<br>◇ 전자서명 인증자 휴대전화: ${phoneNumber}
              `
            }
            let resultEsign = `
                <p class="form-info-box-gol"><미일치 정보를 확인해주세요><br>
               ${differ}
                </p>
            `;
            $('#signResult').html(resultEsign)
          }
        });
        return false;
      }
    }
  }
  
  setYesSignResult(data: any,userName:string,birthDay:string,phoneNumber:string){
    if(!this.checkResult('yessign',userName,birthDay.substring(2),`0${phoneNumber.substring(3)}`)){
      return
    }
    const date = new Date();
    let displayTime = date.getFullYear()+"."+lpad((date.getMonth()+1).toString(),2,'0')+"."+lpad(date.getDate().toString(),2,'0')+'. '+lpad(date.getHours().toString(),2,'0')+':'+lpad(date.getMinutes().toString(),2,'0')+':'+lpad(date.getSeconds().toString(),2,'0');
    let resultEsign = `
        <p class="form-info-box-gol"><전자서명 처리결과><br>
       ◇ 전자서명 결과 : 성공<br>
       ◇ 전자서명 종류 : 금융인증서<br>
       ◇ 전자서명 일시 : ${displayTime}<br>
       ◇ 전자서명 인증자 : ${maskingFnc.name(userName,"*")}<br>
        </p>
    `;
    $('#signResult').html(resultEsign)
    this.setState({
      ...this.state,
      isAuthenticated: true,
      type: 'yessign',
      authInfo: {
        ...this.state.authInfo,
        authNumber: birthDay,
        authName: userName,
        data: data,
        ci:  ""
      }
    });
  }
  
  showCertResult(pType: string, data?:any){
    if(!this.checkResult(pType,data.userNm,data.birthday.substring(2),data.phoneNo)){
      return
    }
    const date = new Date();
    let displayTime = date.getFullYear()+"."+lpad((date.getMonth()+1).toString(),2,'0')+"."+lpad(date.getDate().toString(),2,'0')+'. '+lpad(date.getHours().toString(),2,'0')+':'+lpad(date.getMinutes().toString(),2,'0')+':'+lpad(date.getSeconds().toString(),2,'0');
    const userNm = maskingFnc.name(data.userNm,"*")
    let resultEsign = `
        <p class="form-info-box-gol"><전자서명 처리결과><br>
       ◇ 전자서명 결과 : 성공<br>
       ◇ 전자서명 종류 : ${pType}<br>
       ◇ 전자서명 일시 : ${displayTime}<br>
       ◇ 전자서명 인증자 : ${userNm}<br>
        </p>
    `;
    $('#signResult').html(resultEsign)
    this.setState({
      ...this.state,
      isAuthenticated: true,
      type: 'easysign',
      authInfo: {
        ...this.state.authInfo,
        authNumber: data.birthday,
        authName: data.userNm,
        data: data,
        ci:  data.ci
      }
    });
  }
  
  localCertiResult(pType: string){
    const date = new Date();
    let displayTime = date.getFullYear()+"."+lpad((date.getMonth()+1).toString(),2,'0')+"."+lpad(date.getDate().toString(),2,'0')+'. '+lpad(date.getHours().toString(),2,'0')+':'+lpad(date.getMinutes().toString(),2,'0')+':'+lpad(date.getSeconds().toString(),2,'0');
    let resultEsign = `
        <p class="form-info-box-gol"><전자서명 처리결과><br>
       ◇ 전자서명 결과 : 성공<br>
       ◇ 전자서명 종류 : ${pType}<br>
       ◇ 전자서명 일시 : ${displayTime}<br>
       ◇ 전자서명 인증자 : ${maskingFnc.name('김광수',"*")}<br>
        </p>
    `;
    $('#signResult').html(resultEsign)
  }
  
  setNiceResult(data: any, type?: string) {
    // type 정의 및 초기화
    let dataObject: {
      [key: string]: string
    } = {};
    //본인 확인 로컬 테스트 용 더미 데이터
    //type : I - 아이핀, M - 휴대전화
    const hostName = location.hostname;
    const signData = this.state.signData
    if((hostName === "localhost"|| hostName.indexOf('98.42.34.126') === 0 || hostName.indexOf('98.42.34.22') === 0) && (type === "U" || type === "X")){////|| hostName.indexOf('98.42.34.126') === 0 || hostName.indexOf('98.42.34.22') === 0
      console.log("dev::"+type)
      dataObject = {AUTH_TYPE: "U"
                    ,BIRTHDATE: `19${signData.birthDay}` //필요 시 변경 사용
                    ,CI: ""
                    ,DI: ""
                    ,GENDER: "1"
                    ,MOBILE_NO: "01012345678" //필요 시 변경 사용
                    ,NAME: signData.applyName //필요 시 변경 사용
                    ,NATIONALINFO: "0"
                    ,REQ_SEQ: "G6339_2022121617151198749"
                    ,RES_SEQ: "MG6339202212161323558405"
                    ,UTF8_NAME: "%EA%B9%80%EA%B8%B8%EB%8F%99"}
    }else{
      // {}로 둘러 쌓여 있고 =로 구분된 데이터를 object로 변경한다. 
      data.substring(1, data.length-1)
        .split(', ')
        .map((str:string) => str.split(/=(.*)/s,2))
        .forEach((pair: [string, string]) => {
          let key = pair[0];
          dataObject[key] = pair[1];
      });
    }
    let authName = "";
    let authNumber = "";
    if(type === "I"){
      authName = dataObject.sName;
      authNumber = dataObject.sBirthDate;
    }
    if(!this.checkResult(dataObject.AUTH_TYPE,dataObject.NAME,dataObject.BIRTHDATE.substring(2),dataObject.MOBILE_NO)){
      return
    }
    this.setState({
      ...this.state,
      isAuthenticated: true,
      type: type === "I" ? type : dataObject.AUTH_TYPE,
      authInfo: {
        ...this.state.authInfo,
        authNumber: type === "I" ? authNumber : dataObject.BIRTHDATE,
        authName: type === "I" ? authName : dataObject.NAME,
        data: dataObject,
        ci: (dataObject.AUTH_TYPE === "U" || dataObject.AUTH_TYPE === "X") ? dataObject.CI : ""
      }
    });
    
    const date = new Date();
    let displayTime = date.getFullYear()+"."+lpad((date.getMonth()+1).toString(),2,'0')+"."+lpad(date.getDate().toString(),2,'0')+'. '+lpad(date.getHours().toString(),2,'0')+':'+lpad(date.getMinutes().toString(),2,'0')+':'+lpad(date.getSeconds().toString(),2,'0');
    const userNm = maskingFnc.name(dataObject.NAME,"*")
    let resultEsign = `
        <p class="form-info-box-gol"><전자서명 처리결과><br>
       ◇ 전자서명 결과 : 성공<br>
       ◇ 전자서명 종류 : 공동인증서<br>
       ◇ 전자서명 일시 : ${displayTime}<br>
       ◇ 전자서명 인증자 : ${userNm}<br>
        </p>
    `;
    $('#signResult').html(resultEsign)
  }

  render() {
    const that = this;
    const minwonCd = cyberMinwon.state.unityMinwon.state.minwonCd;
    const page = cyberMinwon.state.unityMinwon.state.page;
    const UserAgent = navigator.userAgent
    
    let template = ""
      template = `  
            <div id="form-mw2" class="row">
              <div class="tit-mw-h3">
                <a href="javascript:void(0);" onClick="showHideLayer('#form-mw2');" title="닫기">
                  <span class="i-52">전자서명(본인확인ㆍ인증)</span>
                </a>
              </div>
              <div class="form-mw-box display-block row">
                <div class="form-mv form-certify col-4 row">
                  <ul>
                    <li class="txCenter">
                        <div class="oacx-demo-sign" style="display:block; left:35rem; top:20rem;">
                            <button id="signBtnNonMember" type="button" onclick="${that.path}.noticeCheck('easysign')" class="oacx-ux oacx-ux-btn">
                                                                        간편인증
                                <span>
                                    <a class="oacx-kakao" title="카카오"></a>
                                    <a class="oacx-kb" title="KB국민"></a>
                                    <a class="oacx-payco" title="페이코"></a>
                                    <a class="oacx-pass" title="통신사패스"></a>
                                    <a class="oacx-samsung" title="삼성패스"></a>
                                    <a class="oacx-naver" title="네이버"></a>
                                </span>
                                <span>
                                    <a class="oacx-shinhan" title="신한은행"></a>
                                    <a class="oacx-toss" title="토스"></a>
                                    <a class="oacx-dream" title="드림인증"></a>
                                    <a class="oacx-banksalad" title="뱅크샐러드"></a>
                                    <a class="oacx-hana" title="하나은행"></a>
                                    <a class="oacx-nh" title="농협"></a>
                                </span>
                            </button>
                        </div>
                    </li>
                    <li>
                       <div class="form-mv form-certify row">
                              <dl>
                                <dt><div class="tit-certify-4">금융인증</div></dt>
                                <dd>
                                  <button type="button" id="iPin"
                                    onclick="${that.path}.handleShowSignVal('yessign')"
                                    class="btn btnM btnWL">금융인증</button>
                                </dd>
                              </dl>
                       </div>
                       `;
      if(UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null 
                    || UserAgent.match(/LG|SAMSUNG|Samsung/) != null){ //모바일인 경우                 
      }else{
          template += `  
                           <div class="form-mv form-certify row">
                                  <dl>
                                    <dt><div class="tit-certify-3">공동인증</div></dt>
                                    <dd>
                                      <button type="button" id="mobile" 
                                        onclick="${that.path}.handleShowSignVal('niceu')"
                                        class="btn btnM btnWL">공동인증</button>
                                    </dd>
                                  </dl>
                           </div>
                           `;
      }
      template += `  
                    </li>
                  </ul>
                </div>
                <div id="signResult" class="form-mv row">
                    
                </div>
                  </br>
                <div class="form-mv row">
                  <ul class="policy2">
                  `;
      if(UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null 
        || UserAgent.match(/LG|SAMSUNG|Samsung/) != null){ //모바일인 경우   
        template += `</br>`;              
      }
        template += `
                    <h4 class="txRed">※ 자동납부 신청 민원은 전자금융감독규정에 따라 전자서명 인증 후 신청가능합니다.</h4>
                    <li>
                        <label class="chk-type chk-typeS"> 
                          <span>[전자금융감독규정]</span>
                        </label>
                        <a href="javascript:void(0);" onClick="showHideInfo2('#toggleEkftc', event);" class="btn btnSS btnTypeC">
                          <span>보기</span>
                        </a>
                        <div id="toggleEkftc" class="p-depth-1 bd-gray display-none">
                          <h4>[주요내용]</h4>
                          <h5>□ 제6조(추심이체 출금 동의의 방법 등)</h5>
                          <ul class="p-depth-2">
                            <p>① 시행령 제10조제1호에서 “금융위원회가 정하여 고시하는 전자문서”라 함은 다음 각 전자문서을 말한다.</p>
                            <li>1. 「전자서명법」 제2조제2호에 따른 전자서명으로 다음 각 목의 요건을 구비된 전자서명을 한 전자문서 <개정 2016. 6. 30.>
                              <ul>
                                <li>가. 전자서명을 생성하기 위하여 이용하는 전자적 정보(이하 “전자서명생성정보”라함)가 본인에게 유일하게 속할 것</li>
                                <li>나. 전자서명 당시 본인이 전자서명생성정보를 지배ㆍ관리하고 있을 것</li>
                                <li>다. 전자서명이 있은 후에 당해 전자서명에 대한 변경여부를 확인할 수 있을 것</li>
                                <li>라. 전자서명이 있은 후에 당해 전자문서의 변경여부를 확인할 수 있을 것</li>
                              </ul>
                            </li>
                            <li>2. 「전자서명법」 제2조제2호에 따른 전자서명으로 다음 각 목의 요건을 구비된 전자서명을 한 전자문서
                              <ul>
                                <li>가. 서명 전 실명증표를 통해 본인확인</li>
                                <li>나. 전자문서가 생성된 이후 서명자가 지급인 본인임을 확인 가능</li>
                                <li>다. 전자서명 및 전자문서에 대한 위변조 여부 확인이 가능</li>
                                <li>라. 전자문서를 고객에게 전송한 이후 고객이 취소할 수 있는 충분한 기간 부여</li>
                              </ul>
                            </li>
                            <p>③ 지급인(출금계좌의 실지명의인을 포함한다)이 출금의 동의를 해지하는 경우에도 제1항 및 제2항의 규정을 준용한다. <개정 2015. 6. 24.></p>
                            <p>④ 금융회사ㆍ전자금융업자 또는 수취인은 제1항 각 호의 출금 동의의 방법을 운용함에 있어 다음 각 호의 어느 하나에 해당하는 사실을 확인하여야 한다. <개정 2013. 12. 3.></p>
                            
                            <li>1. 지급인과 추심이체 출금계좌 실지명의인이 동일인인 사실</li>
                            <li>2. 지급인과 추심이체 출금계좌 실지명의인이 동일인이 아닐 경우에는 지급인이 당해 계좌에서 출금할 수 있는 권한을 보유하고 있는 사실</li>
                          </ul>
                        </div>
                      </li>
                      <li>
                        <label class="chk-type chk-typeS"> 
                          <span>[전자서명법]</span>
                        </label>
                        <a href="javascript:void(0);" onClick="showHideInfo2('#toggleEsign', event);" class="btn btnSS btnTypeC">
                          <span>보기</span>
                        </a>
                        <div id="toggleEsign" class="p-depth-1 bd-gray display-none">
                          <h4>[주요내용]</h4>
                          <h5>□ 제2조(정의) 이 법에서 사용하는 용어의 뜻은 다음과 같다.</h5>
                          <ul class="p-depth-2">
                            <p>① 시행령 제10조제1호에서 “금융위원회가 정하여 고시하는 전자문서”라 함은 다음 각 전자문서을 말한다.</p>
                            <li>2. “전자서명”이란 다음 각 목의 사항을 나타내는 데 이용하기 위하여 전자문서에 첨부되거나 논리적으로 결합된 전자적 형태의 정보를 말한다.
                              <ul>
                                <li>가. 서명자의 신원</li>
                                <li>나. 서명자가 해당 전자문서에 서명하였다는 사실</li>
                              </ul>
                            </li>
                            <li>7. “전자서명인증업무”란 전자서명인증, 전자서명인증 관련 기록의 관리 등 전자서명인증서비스를 제공하는 업무를 말한다.</li>
                            <li>8. “전자서명인증사업자”란 전자서명인증업무를 하는 자를 말한다.</li>
                          </ul>
                        </div>
                      </li>
       `;
      if(UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null 
        || UserAgent.match(/LG|SAMSUNG|Samsung/) != null){ //모바일인 경우   
        template += `</br>`;              
      }
        template += `
                      <li class="txCenter">
                        <span class="txStrongColor">문의 : 금융인증서(1577-5500), 공동인증서(1600-1522)</span>
                      </li>
                  </ul>
                </div>
              </div>
            </div><!-- //form-mw1 -->      
      `;
    
    document.getElementById('authentication')!.innerHTML = template;
    this.afterRender();
  }
  
  afterRender() {
    const that = this;
    window.addEventListener("message", this.receiveMsg, false);
  }
}