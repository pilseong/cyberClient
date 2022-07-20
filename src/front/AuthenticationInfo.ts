

export default class AthenticationInfo {
  state: any;
  
  constructor(parent: any) {
    this.state = {
      parent,
      path: 'cyberMinwon.state.currentModule.state.currentPage.state.authenticationInfo',
      isAuthenticated: false
    }
  }

  setState(nextState: any) {
    if (this.state !== nextState)
      this.state = nextState;
  }
  
  handlePhoneAuthentication() {
    window.name = "mainwin";
    window.open("/basic/authCheckMain.do?type=checkPhone", 'checkPhone', 
      "width=450, height=550, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no");
  }

  render() {
    const that = this;
    let template = `  
          <div id="form-mw2" class="row">
            <div class="tit-mw-h3">
              <a href="javascript:void(0);" onClick="showHideLayer('#form-mw2');" title="닫기">
                <span class="i-09">본인인증</span>
              </a>
            </div>
            <div class="form-mw-box display-block row">
              <div class="form-mv form-certify col-3 row">
                <ul>
                  <li class="txCenter">
                    <dl>
                      <dt><div class="tit-certify-1">아이핀(I-PIN)</div></dt>
                      <dd><button type="button" 
                        onclick="alert()"
                        class="btn btnM btnWL btnTypeC">인증하기</button></dd>
                    </dl>
                  </li>
                  <li class="txCenter">
                    <dl>
                      <dt><div class="tit-certify-2">휴대폰 본인확인</div></dt>
                      <dd>
                        <button type="button" 
                          onclick="${that.state.path}.handlePhoneAuthentication()"
                          class="btn btnM btnWL btnTypeC">인증하기</button>
                      </dd>
                    </dl>
                  </li>
                  <li class="txCenter">
                    <dl>
                      <dt><div class="tit-certify-3">공동인증서</div></dt>
                      <dd><button type="button" class="btn btnM btnWL btnTypeC">인증하기</button></dd>
                    </dl>
                  </li>
                </ul>
                <p class="form-cmt form-cmt-1 txStrongColor">* 자동납부 등록은 공동인증서를 사용하여 본인인증한 경우만 신청 가능합니다.</p>
              </div>
            </div>
          </div><!-- //form-mw1 -->      
    `;
    
    document.getElementById('authentication')!.innerHTML = template;
  }
}