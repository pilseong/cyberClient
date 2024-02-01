import CyberMinwon from "../infra/CyberMinwon";

declare var $: any;
declare var cyberMinwon: CyberMinwon;
declare var mtk: any;
declare var gContextUrl: string;
export function fetch(method: string, url: string, queryString: any, callback: any) {
  // const thisClass = this;
  $.ajax({
    type: method,
    async: false,
    url: url,
    data: queryString,
    dataType: 'json',
    error: function (xhr: any, status: any, error: any) {
      callback(error, null);
    },
    success: function (data: any) {
      callback(null, data);
    }
  });
}

export function fetchMultiPart(url: string, queryForm: any, callback: any) {
  // const thisClass = this;
  $.ajax({
    type: 'POST',
    async: false,
    enctype: 'multipart/form-data',
    url: url,
    data: queryForm,
    dataType: 'json',
    contentType: false,
    processData: false,
    error: function (xhr: any, status: any, error: any) {
      callback(error, null);
    },
    success: function (data: any) {
      callback(null, data);
    }
  });
}


// 2021-010 나이스 인증 리턴값 받는 곳
// 인증 결과 SET
export function setNiceResult(data: any, type?: string) { 
  const unityState = cyberMinwon.state.unityMinwon.state;
  const resultData = data.substring(1,data.length-1).split(', ');
  const authTarget = resultData.find((rData:string) => rData.indexOf('authTarget') !== -1).split('=')[1];
  if(unityState.page === 0){
    if(unityState.minwonCd == 'B19_1'){
      unityState.applicationPage.authenticationInfo3.setNiceResult(data, type); 
    }else if(unityState.minwonCd == 'B14'){
      unityState.applicationPage.authenticationInfo.setNiceResult(data, type); 
    }else{
      unityState.applicationPage.authenticationInfo3.setNiceResult(data, type); 
    }
  }else{
    if(unityState.minwonCd == 'B14' || unityState.minwonCd == 'B14_1'){
      unityState.summaryPage.authenticationInfo.setNiceResult(data, type);
    }else{
      if(authTarget === 'authentication2'){
        unityState.steps[unityState.minwonCd].step[1].authenticationInfo2.setNiceResult(data, type);
      }else{
        unityState.steps[unityState.minwonCd].step[1].authenticationInfo.setNiceResult(data, type);
      }
    }
  }
}

export function CertResultShow(data: any,userName:string,birthDay:string,phoneNumber:string,nonce:string,yesToken:string){
//  console.log(`CertResultShow in`)
//  console.log(data)
//  console.log('yesToken',yesToken)
  const url = gContextUrl + '/auth/yesSignUcpid.do'
//  console.log(url)
  const unityState = cyberMinwon.state.unityMinwon.state;
  if(unityState.page === 0){
    unityState.applicationPage.authenticationInfo3.setYesSignResult(data,userName,birthDay,phoneNumber)
  }else{
    if(unityState.minwonCd == 'B14' || unityState.minwonCd == 'B14_1'){
      unityState.summaryPage.authenticationInfo.setYesSignResult(data,userName,birthDay,phoneNumber)
    }
    /*
    if(authTarget === 'authentication2'){
        unityState.steps[unityState.minwonCd].step[1].authenticationInfo2.setYesSignResult(data,userName,birthDay,phoneNumber);
      }else{
        unityState.steps[unityState.minwonCd].step[1].authenticationInfo.setYesSignResult(data,userName,birthDay,phoneNumber);
      }
    */
  }
  const ucpData = {
    'signData':data,
    'nonce':nonce,
    'yesToken':yesToken,
    'serverType':'prod'
  }
  try{
      window.fetch(url,{
        method: 'post',
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify(ucpData),
      }).then(res => {
        const result = res.json()
//        console.log(result)
        
      })
  }catch(err){
    
  }
}

export function CertResultShow1(data: any){
  console.log(data)
  const unityState = cyberMinwon.state.unityMinwon.state;
  if(unityState.page === 0){
    unityState.applicationPage.authenticationInfo3.setEzOkResult(data)
  }else{
    /*
    if(authTarget === 'authentication2'){
        unityState.steps[unityState.minwonCd].step[1].authenticationInfo2.setEzOkResult(data);
      }else{
        unityState.steps[unityState.minwonCd].step[1].authenticationInfo.setEzOkResult(data);
      }
    */
  }
}

export function easySignResult(data: any){
  
  const unityState = cyberMinwon.state.unityMinwon.state;
  unityState.summaryPage.authenticationInfo.showCertResult('간편인증', data);
}
// 활성화 되어 있는 키패드를 비활성화 한다.
export function closeKeypad() {
  if (mtk) {
    if (mtk.now) {        
      mtk.close();
    }
  }
}
