/**
 * 소유자, 사용자 명의 변경 상세 화면
 */
class B04DetailPage {
  constructor(parent, root) {
    this.state = {
      parent,
      root,
      ownerCheck: false,
      userCheck: false,
      reason: '',
      ownerInfo: {
        gubun: '0',
        ownerName: '',
        ownerBusinessNumber: '',
        ownerPhone: '',
        ownerMobile: '',
        ownerChangeDate: new Date().toLocaleDateString('en-CA')
      },
      userInfo: {
        gubun: '0',
        userName: '',
        userBusinessNumber: '',
        userPhone: '',
        userMobile: '',
        userChangeDate: new Date().toLocaleDateString('en-CA')
      },
      viewRequestInfo: {

      }
    };
  }

  setState(nextState) {
    this.state = nextState;
  }

  setEventListeners() {
  }

  // 법인 / 개인 선택 시 UI 변경 처리
  handleUserGubun(e) {
    this.setState({
      ...this.state,
      userInfo: {
        ...this.state.userInfo,
        gubun: e.target.value
      }
    });

    console.log(this.state);
    this.render();
  }

  handleOwnerGubun(e) {
    this.setState({
      ...this.state,
      ownerInfo: {
        ...this.state.ownerInfo,
        gubun: e.target.value
      }
    });

    console.log(this.state);
    this.render();
  }

  // 신청 구분에 따른 UI 활성화
  toggleUIGubun(gubun, id, uiBox) {
    if (gubun === 'ownerCheck') {
      this.setState({
        ...this.state,
        ownerCheck: !this.state[gubun]
      });
    } else if (gubun === 'userCheck') {
      this.setState({
        ...this.state,
        userCheck: !this.state[gubun]
      });
    }
    setGubunMulti(id, uiBox);
    this.render();
  }

  // 소유자 전화번호 연동
  handleOwnerPhone(e) {
    console.log(e.target.value.substring(0, 10));
    this.setState({
      ...this.state,
      ownerInfo: {
        ...this.state.ownerInfo,
        ownerPhone: e.target.value.substring(0, 10)
      }
    });
    e.target.value = this.state.ownerInfo.ownerPhone.substring(0, 10);
  }

  // 소유자 휴대번호 연동
  handleOwnerMobile(e) {
    console.log(e.target.value.substring(0, 11));
    this.setState({
      ...this.state,
      ownerInfo: {
        ...this.state.ownerInfo,
        ownerMobile: e.target.value.substring(0, 11)
      }
    });
    e.target.value = this.state.ownerInfo.ownerMobile.substring(0, 11);
  }

  // 소유자 이름 연동
  handleOwnerName(e) {
    console.log(e.target.value.substring(0, 30));
    this.setState({
      ...this.state,
      ownerInfo: {
        ...this.state.ownerInfo,
        ownerName: e.target.value.substring(0, 30)
      }
    });
    e.target.value = this.state.ownerInfo.ownerName.substring(0, 30);
  }

  // 소유자 사업자번호 연동
  handleOwnerBusinessNumber(e) {
    console.log(e.target.value.substring(0, 10));
    this.setState({
      ...this.state,
      ownerInfo: {
        ...this.state.ownerInfo,
        ownerBusinessNumber: e.target.value.substring(0, 10)
      }
    });
    e.target.value = this.state.ownerInfo.ownerBusinessNumber.substring(0, 10);
  }

  // 사용자 전화번호 연동
  handleUserPhone(e) {
    console.log(e.target.value.substring(0, 10));
    this.setState({
      ...this.state,
      userInfo: {
        ...this.state.userInfo,
        userPhone: e.target.value.substring(0, 10)
      }
    });
    e.target.value = this.state.userInfo.userPhone.substring(0, 10);
  }

  // 사용자 휴대번호 연동
  handleUserMobile(e) {
    console.log(e.target.value.substring(0, 11));
    this.setState({
      ...this.state,
      userInfo: {
        ...this.state.userInfo,
        userMobile: e.target.value.substring(0, 11)
      }
    });
    e.target.value = this.state.userInfo.userMobile.substring(0, 11);
  }

  // 사용자 이름 연동
  handleUserName(e) {
    console.log(e.target.value.substring(0, 30));
    this.setState({
      ...this.state,
      userInfo: {
        ...this.state.userInfo,
        userName: e.target.value.substring(0, 30)
      }
    });
    e.target.value = this.state.userInfo.userName.substring(0, 30);
  }

  // 사용자 사업자번호 연동
  handleUserBusinessNumber(e) {
    console.log(e.target.value.substring(0, 10));
    this.setState({
      ...this.state,
      userInfo: {
        ...this.state.userInfo,
        userBusinessNumber: e.target.value.substring(0, 10)
      }
    });
    e.target.value = this.state.userInfo.userBusinessNumber.substring(0, 10);
  }


  handleDateForUser(e) {
    this.setState({
      ...this.state,
      userInfo: {
        ...this.state.userInfo,
        userChangeDate: e.target.value.substring(0, 30)
      }
    });
    e.target.value = this.state.userInfo.userChangeDate.substring(0, 30);

    console.log(this.state.userInfo)
  }

  handleDateForOwner(e) {
    this.setState({
      ...this.state,
      ownerInfo: {
        ...this.state.ownerInfo,
        ownerChangeDate: e.target.value.substring(0, 30)
      }
    });
    e.target.value = this.state.ownerInfo.ownerChangeDate.substring(0, 30);
    console.log(this.state.ownerInfo)
  }

  handleReason(e) {
    this.setState({
      ...this.state,
      reason: e.target.value.substring(0, 100)
    });
    e.target.value = this.state.reason.substring(0, 100);
    console.log(this.state.reason)
  }

  render() {
    let template = `
      <div class="mw-box">
        <div id="form-mw0" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="showHideLayer('#form-mw0');" class="on" title="닫기">
            <span class="i-06 txStrongColor">민원안내 및 처리절차</span></a></div>
          <div class="form-mw-box display-none row">
  
            <div class="info-mw row">
              <div class="tit-mw-h5 row"><span>계량기고장유형</span></div>
              <div class="info-mw-list">
                <ul>
                  <li>동파 : 겨울철 동결로 유리부가 파손되어 판독이 불가한 경우</li>
                  <li>외갑누수 : 계량기 외갑에서 물이 새어 나올 경우</li>
                  <li>화상 : 화재 또는 해빙작업 등으로 손상을 입은 경우</li>
                  <li>초파 : 사용자 관리부주의로 유리부가 파손된 경우</li>
                  <li>망실 : 계량기가 분실된 경우</li>
                  <li>침비 : 계량기 숫자의 일부 단위 작동상태가 비정상인 경우</li>
                  <li>불회전·회전불량 : 수돗물을 사용하고 있음에도 계량기 숫자가 회전하지 않거나, 회전상태가 불량인 경우</li>
                </ul>
              </div>
  
              <div class="tit-mw-h5 row"><span>신청방법</span></div>
              - 수도사업소 방문, 전화, 인터넷 등으로 신청가능 합니다.<br>
              <div class="tit-mw-h5 row"><span>처리기간</span></div>
              - 법정 5일, 신속 3일<br>
              <div class="tit-mw-h5 row"><span>처리부서</span></div>
              - 수도사업소 요금과, 현장민원과 ( 총괄부서: 본부 계측관리과 )<br>
              <div class="tit-mw-h5 row"><span>신청서류</span></div>
              - 수도계량기 교체 신청서<br>
              <div class="tit-mw-h5 row"><span>관련법규</span></div>
              - 민원 처리에 관한 법률 제2조<br>
              <div class="tit-mw-h5 row"><span>처리절차</span></div>
              01.계량기교체신청(동파,몸통누수) → 02.계량기교체(요금과,현장민원과) → 03.계량기대금부과(몸통누수 제외)→ 04.계량기교체신청(열손상,유리파손,망실,지침비정상) → 05.현장조사(요금과) → 06.계량기교체(요금과, 현장민원과)→ 07.계량기대금 및 설치대금부과 → 08.계량기교체신청(고장발생분) → 09.요금조정(요금관리팀) → 10.계량기교체(요금과, 현장민원과)
            </div>
          </div>
        </div><!-- // info-mw -->
      </div><!-- // mw-box -->
  
      <!-- 신청내용 -->
      <div class="mw-box">
      <div id="form-mw21" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="showHideLayer('#form-mw21');" title="닫기">
        <span class="i-01">명의변경 신청</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label class="input-label-1"><span>명의변경 대상을 선택하세요.</span></label>
                <ul class="mw-opt mw-opt-6 row">
                  <li id="aGubun1" class="off"><a onClick="detailB04.toggleUIGubun('userCheck', '#aGubun1','#mw-box1')">
                    <span>사용자</span></a>
                  </li>
                  <li id="aGubun2" class="off"><a onClick="detailB04.toggleUIGubun('ownerCheck', '#aGubun2','#mw-box2')">
                    <span>소유자</span></a>
                  </li>
                </ul>
                <!-- <a href="#" class="btn btnSS"><span>체납확인</span></a> -->
                <p class="form-cmt form-cmt-1 txRed row">
                  * 세입자이신 경우는 사용자 변경을 선택하시면 됩니다.<br>
                  * 고지서의 명의변경을 원하는 경우 사용자를 선택하시면 됩니다.
                </p>
              </li>
              <li>
                <label for="form-mw22-tx" class="input-label-1"><span>변경사유를 입력하세요.</span></label>
                <input onkeyup="detailB04.handleReason(event)" onchange="detailB04.handleReason(event)"
                  value="${detailB04.state.reason}"
                  type="text" id="form-mw22-tx" class="input-box input-w-0" placeholder="변경사유">
              </li>
            </ul>
          </div>
        </div><!-- // form-mw-box -->
      </div><!-- // form-mw21 -->
      </div><!-- // mw-box -->
  
      <!-- 사용자정보 -->
      <div id="mw-box1" class="mw-box display-none row">
      <div id="form-mw22" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="showHideLayer('#form-mw22');" title="닫기">
          <span class="i-01">사용자 정보</span></a>
        </div>
        <div class="form-mw-box display- row">
          <div class="form-mv row">
            <ul>
              <li>
                <label for="cGubunType1" class="input-label"><span>성명(회사명)</span></label>
                <select id="cGubunType1" name="cGubunType1" onchange="detailB04.handleUserGubun(event)" 
                  title="변경구분 선택" class="input-box input-w-2">
                  <option value="0" ${detailB04.state.userInfo.gubun === '0' ? 'selected' : ''}>개인</option>
                  <option value="1" ${detailB04.state.userInfo.gubun === '1' ? 'selected' : ''}>법인</option>
                </select>
                <label for="form-mw12-tx"><span class="sr-only">성명(회사명)</span></label>
                <input onkeyup="detailB04.handleUserName(event)" onchange="detailB04.handleUserName(event)"
                  type="text" value="${detailB04.state.userInfo.userName}"
                  id="form-mw12-tx" class="input-box input-w-2" placeholder="사용자 성명(회사명)">
              </li>
              <li ${detailB04.state.userInfo.gubun === '0' ? 'hidden' : ''}>
                <label for="form-mw35-tx" class="input-label"><span>사업자번호</span></label>
                <input onkeyup="detailB04.handleUserBusinessNumber(event)" onchange="detailB04.handleUserBusinessNumber(event)"
                  value="${detailB04.state.userInfo.userBusinessNumber}"
                  type="text" id="form-mw35-tx" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
              </li>
              <li>
                <label for="form-mw45-tx" class="input-label"><span>전화번호</span></label>
                <input onkeyup="detailB04.handleUserPhone(event)" onchange="detailB04.handleUserPhone(event)"
                  value="${detailB04.state.userInfo.userPhone}"
                  type="text" id="form-mw45-tx" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
              </li>
              <li>
                <label for="form-mw36-tx" class="input-label"><span class="form-req">휴대폰번호</span></label>
                <input  onkeyup="detailB04.handleUserMobile(event)" onchange="detailB04.handleUserMobile(event)"
                  value="${detailB04.state.userInfo.userMobile}"
                  type="text" id="form-mw36-tx" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
                <p class="form-cmt">* 휴대번호가없는 경우 전화번호를 입력하세요.</p>
              </li>
              <li>
                <label for="leakRepairDt" class="input-label"><span>변경년월일 </span></label>
                <input type="date" onchange="detailB04.handleDateForUser(event)" onkeyup="detailB04.handleDateForUser(event)"
                  value="${detailB04.state.userInfo.userChangeDate}" id="leakRepairDt" name="leakRepairDt"
                  class="input-box input-w-2 datepicker hasDatepicker">
                <p class="form-cmt txRed">* 실제 사용자 변경일자를 입력하세요.</p>
              </li>
            </ul>
          </div>
        </div><!-- // form-mw-box -->
      </div><!-- // form-mw22 -->
      </div><!-- // mw-box -->

      <!-- 소유자정보 -->
      <div id="mw-box2" class="mw-box display-none row">
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="showHideLayer('#form-mw23');" title="닫기">
          <span class="i-01">소유자 정보</span></a>
        </div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label for="cGubunType2" class="input-label"><span>성명(회사명)</span></label>
                <select id="cGubunType2" name="cGubunType2" onchange="detailB04.handleOwnerGubun(event)"
                  title="변경구분 선택" class="input-box input-w-2">
                  <option value="0" ${detailB04.state.ownerInfo.gubun === '0' ? 'selected' : ''}>개인</option>
                  <option value="1" ${detailB04.state.ownerInfo.gubun === '1' ? 'selected' : ''}>법인</option>
                </select>
                <label for="form-mw32-tx"><span class="sr-only">성명(회사명)</span></label>
                <input onkeyup="detailB04.handleOwnerName(event)" onchange="detailB04.handleOwnerName(event)"
                  type="text" value="${detailB04.state.ownerInfo.ownerName}"
                  id="form-mw32-tx" class="input-box input-w-2" placeholder="사용자 성명(회사명)">
              </li>
              <li ${detailB04.state.ownerInfo.gubun === '0' ? 'hidden' : ''}>
                <label for="form-mw55-tx" class="input-label"><span>사업자번호</span></label>
                <input onkeyup="detailB04.handleOwnerBusinessNumber(event)" onchange="detailB04.handleOwnerBusinessNumber(event)"
                  value="${detailB04.state.ownerInfo.ownerBusinessNumber}"
                  type="text" id="form-mw55-tx" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
              </li>
              <li>
                <label for="form-mw65-tx" class="input-label"><span>전화번호</span></label>
                <input onkeyup="detailB04.handleOwnerPhone(event)" onchange="detailB04.handleOwnerPhone(event)"
                  value="${detailB04.state.ownerInfo.ownerPhone}"
                type="text" id="form-mw65-tx" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
              </li>
              <li>
                <label for="form-mw46-tx" class="input-label"><span class="form-req">휴대폰번호</span></label>
                <input onkeyup="detailB04.handleOwnerMobile(event)" onchange="detailB04.handleOwnerMobile(event)"
                  value="${detailB04.state.ownerInfo.ownerMobile}"
                type="text" id="form-mw46-tx" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
                <p class="form-cmt">* 휴대번호가없는 경우 전화번호를 입력하세요.</p>
              </li>
              <li><label for="leakRepairDt1" class="input-label"><span>변경년월일 </span></label>
                <input type="date" onchange="detailB04.handleDateForOwner(event)" onkeyup="detailB04.handleDateForOwner(event)"
                  value="${detailB04.state.ownerInfo.ownerChangeDate}" id="leakRepairDt1" name="leakRepairDt1"
                  class="input-box input-w-2 datepicker hasDatepicker">
                <p class="form-cmt txRed">* 실제 소유자 변경일자를 입력하세요.</p>
              </li>
            </ul>
          </div>
        </div>
      </div><!-- // form-mw23 -->
      </div><!-- // mw-box -->
    `;

    this.state.root.innerHTML = template;

    // 상태가 아닌 UI class 적용은 랜더링 후에 처리되어야 한다.
    this.state.userCheck ? showGubunMulti('#aGubun1', '#mw-box1') : hideGubunMulti('#aGubun1', '#mw-box1');
    this.state.userCheck ? showLayer('#form-mw22') : hideLayer('#form-mw22');
    this.state.ownerCheck ? showGubunMulti('#aGubun2', '#mw-box2') : hideGubunMulti('#aGubun2', '#mw-box2');
    this.state.ownerCheck ? showLayer('#form-mw23') : hideLayer('#form-mw23');

    this.setEventListeners();
  }
}