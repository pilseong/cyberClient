import CyberMinwon from "../infra/CyberMinwon";
declare var document: any;
declare var cyberMinwon: CyberMinwon;
export default class AthenticationInfo {
  state: {
    isAuthenticated: boolean;
    type: string; // I -> ipin, M -> mobile, X -> certification  
    authInfo: {
      authNumber: string;
      authName: string;
      data: any;
      ci: string;
    }
    authTarget:any;
  };
  path: string;
  
  constructor(private parent: any, private callback?: (authInfo: any) => void, authTarget?:string) {
    this.state = {
      isAuthenticated: false,
      type: '', // I -> ipin, P -> phone, X -> certification  
      authInfo: {
        authNumber: '801216',
        authName: '김길동',
        data: {},
        ci: ''
      },
      authTarget: authTarget
    }
    if(authTarget && authTarget === "authentication2"){
      this.path = 'cyberMinwon.state.currentModule.state.currentPage.authenticationInfo2';
    }else{
      this.path = 'cyberMinwon.state.currentModule.state.currentPage.authenticationInfo';
    }
  }

  setState(nextState: any) {
    if (this.state !== nextState)
      this.state = nextState;
  }
  
  handlePhoneAuthentication(authTarget?:string) {
//    window.name = "mainwin";
//    window.open(`/basic/nAuthCheckMain.do?type=checkPhone&subType=&authTarget=${authTarget}`, 'checkPhone', 
//      "width=450, height=550, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no");
    const hostName = location.hostname;
    // || hostName.indexOf('98.42.34.126') === 0 || hostName.indexOf('98.42.34.22') === 0
    if(hostName === "localhost"){
//      this.localCertiResult("M");
      this.setNiceResult({},"M");
    }else{
      window.name = "mainwin";
      window.open(`/basic/nAuthCheckMain.do?type=checkPhone&subType=M&authTarget=${authTarget}`, 'checkPhone', 
        "width=450, height=550, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no");
    }
  }
  
  handleCertAuthentication() {
//    this.localCertiResult();
//    return;
    window.name = "mainwin";
    window.open("/basic/nAuthCheckMain.do?type=checkPhone&subType=U", 'checkPhone', 
      "width=450, height=550, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no");
  }
  
  
  handleIPinAuthentication(authTarget?:string) {
    const hostName = location.hostname;
    // || hostName.indexOf('98.42.34.126') === 0 || hostName.indexOf('98.42.34.22') === 0
    if(hostName === "localhost"){
//      this.localCertiResult("I");
      this.setNiceResult({},"I");
    }else{
      window.name = "mainwin";
      window.open(`/basic/nAuthCheckMain.do?type=checkIpin&subType=I&authTarget=${authTarget}`, 'checkIpin', 
        "width=450, height=550, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no");
    }
  }  
  
  localCertiResult(pType: string){
    this.setState({
      ...this.state,
      isAuthenticated: true,
      type: pType,
      authInfo: {
        ...this.state.authInfo,
        authNumber: "801216",
        authName: "김길동",
        data: {},
        ci: ""
      }
    });
    
    
    this.executePosAuthentication({
      authName: "김길동",
      authNumber: "801216",
      isAuthenticated: true,
      type: pType
    });
    this.render();
  }
  
  setNiceResult(data: any, type?: string) {
    // type 정의 및 초기화
    let dataObject: {
      [key: string]: string
    } = {};
    //본인 확인 로컬 테스트 용 더미 데이터
    //type : I - 아이핀, M - 휴대전화
    const hostName = location.hostname;
    // || hostName.indexOf('98.42.34.126') === 0 || hostName.indexOf('98.42.34.22') === 0 
    if((hostName === "localhost") && type === "I"){
      dataObject = {sAgeCode: "7"
                    ,sBirthDate: "19580128" //필요 시 변경 사용
                    ,sCIUpdate: "1"
                    ,sCPRequestNum: "IPIN_EC612022121617212021047"
                    ,sCoInfo1: "wMSDkiY4ldpT9QBs4n0kO0WanBlUzvc6rTFPeOFVl4a7P7+0lzIdmmluF5jZKaqvlmZyn3+3O07qYwKLHbqSVw=="
                    ,sDupInfo: "MC0GCCqGSIb3DQIJAyEAbil5UNx4fLrZSQd2ODDUWM7bxcD7Ut2rscrLsJBNEbo="
                    ,sGenderCode: "1"
                    ,sName: "덥옳쵠" //필요 시 변경 사용
                    ,sNationalInfo: "0"
                    ,sVNumber: "9016455055154"}
    }else if((hostName === "localhost") && type !== "I"){// || hostName.indexOf('98.42.34.126') === 0 || hostName.indexOf('98.42.34.22') === 0 
      dataObject = {AUTH_TYPE: "M"
                    ,BIRTHDATE: "19631025" //필요 시 변경 사용
                    ,CI: "wMSDkiY4ldpT9QBs4n0kO0WanBlUzvc6rTFPeOFVl4a7P7+0lzIdmmluF5jZKaqvlmZyn3+3O07qYwKLHbqSVw=="
                    ,DI: "MC0GCCqGSIb3DQIJAyEArptF+tMtdB+mwLzz8SrCVcUkODc4lUgD2KdUknaJ5rg="
                    ,GENDER: "1"
                    ,MOBILE_NO: "01012345678" //필요 시 변경 사용
                    ,NAME: "안양기" //필요 시 변경 사용
                    ,NATIONALINFO: "0"
                    ,REQ_SEQ: "G6339_2022121617151198749"
                    ,RES_SEQ: "MG6339202212161323558405"
                    ,UTF8_NAME: "%EA%B9%80%EA%B8%B8%EB%8F%99"}
    }else if((hostName === "localhost") && type !== "Xsds"){// || hostName.indexOf('98.42.34.126') === 0 || hostName.indexOf('98.42.34.22') === 0 
      dataObject = {AUTH_TYPE: "X"
                    ,BIRTHDATE: "19631025" //필요 시 변경 사용
                    ,CI: "wMSDkiY4ldpT9QBs4n0kO0WanBlUzvc6rTFPeOFVl4a7P7+0lzIdmmluF5jZKaqvlmZyn3+3O07qYwKLHbqSVw=="
                    ,DI: "MC0GCCqGSIb3DQIJAyEArptF+tMtdB+mwLzz8SrCVcUkODc4lUgD2KdUknaJ5rg="
                    ,GENDER: "1"
                    ,MOBILE_NO: "01012345678" //필요 시 변경 사용
                    ,NAME: "안양기" //필요 시 변경 사용
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
    this.setState({
      ...this.state,
      isAuthenticated: true,
      type: type === "I" ? type : dataObject.AUTH_TYPE,
      authInfo: {
        ...this.state.authInfo,
        authNumber: type === "I" ? authNumber : dataObject.BIRTHDATE,
        authName: type === "I" ? authName : dataObject.NAME,
        data: dataObject,
        ci: dataObject.AUTH_TYPE === "X" ? dataObject.CI : ""
      }
    });
    
    if (this.callback) {
      let birthVal = type === "I" ? authNumber.substring(2) : this.state.authInfo.data.BIRTHDATE.substr(2,6);
      this.callback({
        type: this.state.type,
        name: type === "I" ? authName : this.state.authInfo.data.NAME,
        mobile: this.state.authInfo.data.MOBILE_NO,
        birth: birthVal
      });
    }
    this.executePosAuthentication({
      authName: type === "I" ? authName : dataObject.NAME,
      authNumber: type === "I" ? authNumber.substring(2) : dataObject.BIRTHDATE.substring(2),
      isAuthenticated: true,
      type: type === "I" ? type : dataObject.AUTH_TYPE
    });
    this.render();
  }
  
  executePosAuthentication(authInfo: any, nextMinwonCd?: string) {
    const minwonCd = nextMinwonCd ?? cyberMinwon.state.unityMinwon.state.minwonCd;
    if(minwonCd == "B14"){
      this.parent.parent.state.steps[minwonCd].step[1].setAuthInfo(authInfo);
    }
  }

  render() {
    const that = this;
    const minwonCd = cyberMinwon.state.unityMinwon.state.minwonCd;
    const page = cyberMinwon.state.unityMinwon.state.page;
    let template = ""
    if(minwonCd == "B19" && page !== 0){
      template = `
          <ul class="mw-opt mw-opt-2 row">
            <li>
              <button type="button" id="mobile"
                onclick="${that.path}.handlePhoneAuthentication('${that.state.authTarget}')"
                class="btn btnS ${that.state.isAuthenticated && that.state.type === 'M' ? 'btnTypeC:hover' : 'btnTypeC' }">
                ${that.state.isAuthenticated && that.state.type === 'M' ? '인증완료' : '휴대폰' }
              </button>
            </li>
            <li>
              <button type="button" id="iPin"
                onclick="${that.path}.handleIPinAuthentication('${that.state.authTarget}')"
                class="btn btnS ${that.state.isAuthenticated && that.state.type === 'I' ? 'btnTypeC:hover' : 'btnTypeC' }">
                ${that.state.isAuthenticated && that.state.type === 'I' ? '인증완료' : '아이핀' }
              </button>
            </li>
          </ul>
      `;
    }else{
      template = `  
            <div id="form-mw2" class="row">
              <div class="tit-mw-h3">
                <a href="javascript:void(0);" onClick="showHideLayer('#form-mw2');" title="닫기">
                  <span class="i-52">본인확인</span>
                </a>
              </div>
              <div class="form-mw-box display-block row">
                <div class="form-mv form-certify col-3 row">
                  <ul>
                    <li class="txCenter">
                      <dl>
                        <dt><div class="tit-certify-2">휴대전화</div></dt>
                        <dd>
                          <button type="button" id="mobile" 
                            onclick="${that.path}.handlePhoneAuthentication()"
                            class="btn btnM btnWL ${that.state.isAuthenticated && that.state.type === 'M' ? 'btnTypeC:hover' : 'btnTypeC' }">
                            ${that.state.isAuthenticated && that.state.type === 'M' ? '인증완료' : '인증하기' }
                          </button>
                        </dd>
                      </dl>
                    </li>
                    <li class="txCenter">
                      <dl>
                        <dt><div class="tit-certify-1">아이핀(I-PIN)</div></dt>
                        <dd>
                          <button type="button" id="iPin"
                            onclick="${that.path}.handleIPinAuthentication()"
                            class="btn btnM btnWL ${that.state.isAuthenticated && that.state.type === 'I' ? 'btnTypeC:hover' : 'btnTypeC' }">
                            ${that.state.isAuthenticated && that.state.type === 'I' ? '인증완료' : '인증하기' }
                          </button>
                        </dd>
                      </dl>
                    </li>
                    <!--
                    <li class="txCenter">
                        <dl>
                          <dt><div class="tit-certify-3">공동인증서</div></dt>
                          <dd>
                            <button type="button" id="xCerti"
                              onclick="${that.path}.handleCertAuthentication()"
                              class="btn btnM btnWL ${that.state.isAuthenticated && that.state.type === 'X' ? 'btnTypeC:hover' : 'btnTypeC' }">
                              ${that.state.isAuthenticated && that.state.type === 'X' ? '인증완료' : '인증하기' }
                            </button>
                          </dd>
                        </dl>
                    </li>
                    -->
                  </ul>
                </div>
                <div>
                  </br>
                  <ul>
                    <li class="txCenter">
                      <span class="txStrongColor">안내 1600-1522</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div><!-- //form-mw1 -->      
      `;
    }
    
    if(minwonCd == "B19" && page !== 0){
      document.getElementById(this.state.authTarget)!.innerHTML = template;
    }else{
      document.getElementById('authentication')!.innerHTML = template;
    }
    
    this.afterRender();
  }
  
  afterRender() {
    const that = this;
  }
}