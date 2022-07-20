import JusoSearchPanel from '../util/JusoSearchPanel';
import { showHideInfo, phoneNumberInputValidation, hideElement } from '../util/uiux-common';

declare var document: any;

export default class ApplicantInfo {

  state: any;
  jusoTarget: string;
  jusoSearchPanel: JusoSearchPanel;

  constructor(parent: any, copy: any) {
    this.state = {
      // 부모 즉 프로그램 전체를 감싸는 UnityMinwon의 객체를 참조한다.
      parent,
      copy, // 복사 기능 사용 여부
      // path는 하위 컴포넌트가 실행해야 할 부모의 경로를 저장한다. DOM에 그려 줄 때 필요
      path: 'cyberMinwon.state.currentModule.state.currentPage.state.applicantInfo',
      jusosearchShow: false,
      // applyInfo은 신청인 정보를 저장하는 곳이다.
      applyInfo: {
        applyName: '',
        applyPostNumber: '',
        applyAddress: '',
        applyDetailAddress: '',
        applyPhone: '',
        applyMobile: '',
        applySMSAgree: false,
        applyEmailId: '',
        applyEmailProvider: '',
        applyEmailProviderSelector: '',
        applyRelation: '사용자 본인',
        applyRelationSelector: 0,
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
        addr2: '',
        //        zipcode: '',
        //        fullDoroAddr: '', //applyAddress
        addr1: '',
        bunji: '',
        ho: '',
        extraAdd: '',
        specAddr: '',
        specDng: '',
        specHo: '',
        floors: ''
      },
      // 신청인의 뷰를 데이터를 저장한다.
      viewApplyInfo: {
        viewApplyName: ['', '신청인'],
        viewApplyAddress: ['', '도로명주소'],
        viewApplyPhone: ['', '일반전화'],
        viewApplyMobile: ['', '연락처'],
        viewApplySMSAgree: ['', 'SMS수신동의'],
        viewApplyEmail: ['', '이메일'],
        viewApplyRelation: ['', '관계'],
      },
    }
    this.jusoTarget = 'jusosearchapplicant';
    this.jusoSearchPanel = new JusoSearchPanel(this, this.state.path, this.jusoTarget, this.handleSelectJuso);
  }

  setState(nextState: any) {
    if (this.state !== nextState)
      this.state = nextState;
  }

  verify() {
    if (!this.state.applyInfo.applyName) {
      alert("신청인 이름을 입력해 주세요.");
      return false;
    }

    if (!this.state.applyInfo.applyAddress) {
      alert("주소를 입력해 주세요.");
      return false;
    }

    if (!this.state.applyInfo.applyPhone && !this.state.applyInfo.applyMobile) {
      alert("전화번호를 입력해 주세요.");
      return false;
    }

    if (!this.state.applyInfo.applyRelation) {
      alert("수용가와의 관계를 선택해 주세요.");
      return false;
    }
    return true;
  }

  disableJusoSearch() {
    hideElement('#' + this.jusoTarget);
    this.setState({
      ...this.state,
      jusosearchShow: false,
    });
  }

  getApplyView() {
    return {
      viewApplyInfo: {
        viewApplyName: [this.state.applyInfo.applyName, '신청인'],
        viewApplyAddress: [this.state.applyInfo.applyPostNumber + " " +
          this.state.applyInfo.applyAddress, '도로명주소'],
        viewApplyDetailAddress: [this.state.applyInfo.applyDetailAddress, '상세주소'],
        viewApplyPhone: [this.state.applyInfo.applyPhone, '일반전화'],
        viewApplyMobile: [this.state.applyInfo.applyMobile, '연락처'],
        viewApplySMSAgree: [this.state.applyInfo.applySMSAgree ? "신청" : '미동의', 'SMS수신동의'],
        viewApplyEmail: [this.state.applyInfo.applyEmailId +
          (this.state.applyInfo.applyEmailProvider ?
            '@' + this.state.applyInfo.applyEmailProvider : ''), '이메일'],
        viewApplyRelation: [this.state.applyInfo.applyRelation, '관계'],
        title: '신청인 정보'
      }
    }
  }

  // 콜백에서 사용되기 때무에 arrow function을 사용한다.
  // 수정 시에 this의 score에 주의한다.
  handleSelectJuso = (jusoInfo: any) => {
    console.log(this);
    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        applyAddress: jusoInfo.roadAddr,
        applyPostNumber: jusoInfo.zipNo
      }
    });

    document.getElementById('applyPostNumber').value = jusoInfo.zipNo
    document.getElementById('applyAddress').value = jusoInfo.roadAddr
  }

  // 신청인 이름 타이핑 매핑
  handleApplyName(e: any) {
    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        applyName: e.target.value.substring(0, 20)
      }
    });
    e.target.value = this.state.applyInfo.applyName.substring(0, 20);
    console.log(this.state);
  }

  // 신청인 전화번호 연동
  handleApplyPhone(e: any) {
    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        applyPhone: e.target.value.substring(0, 10)
      }
    });
    e.target.value = this.state.applyInfo.applyPhone.substring(0, 10);
    phoneNumberInputValidation(e.target, 11, /(02|0\d{2})(\d{3,4})(\d{4})/g);
  }

  // 신청인 휴대번호 연동
  handleApplyMobile(e: any) {
    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        applyMobile: e.target.value.substring(0, 11)
      }
    });
    e.target.value = this.state.applyInfo.applyMobile.substring(0, 11);
    phoneNumberInputValidation(e.target, 11, /(010)(\d{3,4})(\d{4})/g);
  }

  // 이미메일 id 입력 연동
  handleApplyEmailId(e: any) {
    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        applyEmailId: e.target.value.substring(0, 30)
      }
    });
    e.target.value = this.state.applyInfo.applyEmailId.substring(0, 30);
  }

  // 이메일 공급자를 리스트에서 선택할 경우
  handleApplyEmailProviderSelector(e: any) {
    console.log('handleApplyEmailProviderSelector', e.target.value);
    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        // 공급자의 domain을 공급자로 저장한다.
        applyEmailProvider: e.target.value,
        // 선택한 이메일 공급자의 index를 저장한다.
        applyEmailProviderSelector: e.target.options.selectedIndex
      }
    });
    this.render();

    var $applyEmailProviderSelector = document.getElementById("applyEmailProviderSelector");
    $applyEmailProviderSelector.options[this.state.applyInfo.applyEmailProviderSelector].selected = true;
  }

  // 신청인의 수용가와의 관계를 설정한다.
  handleApplyRelationSelector(e: any) {
    console.log('handleApplyRelationSelector', e.target.options.selectedIndex);
    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        // 공급자의 domain을 공급자로 저장한다.
        applyRelation: e.target.selectedOptions[0].innerText,
        // 선택한 이메일 공급자의 index를 저장한다.
        applyRelationSelector: e.target.options.selectedIndex
      }
    });
    this.render();

    var $applyRelationSelector = document.getElementById("applyRelationSelector");
    $applyRelationSelector.options[this.state.applyInfo.applyRelationSelector].selected = true;
  }

  // 이메일 공급자를 입력하는 루틴
  handleApplyEmailProvider(e: any) {
    // 상태를 변경하기 전에 선택된 select 박스를 해지해 준다.
    if (this.state.applyInfo.applyEmailProviderSelector !== '') {
      const $applyEmailProviderSelector = document.getElementById("applyEmailProviderSelector");
      $applyEmailProviderSelector.options[this.state.applyInfo.applyEmailProviderSelector].selected = false;
    }

    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        applyEmailProvider: e.target.value.substring(0, 30),
        applyEmailProviderSelector: ''
      }
    });
    e.target.value = this.state.applyInfo.applyEmailProvider.substring(0, 30);
  }

  // SMS 수집 동의
  handleOnChangeForSMSAgree() {
    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        applySMSAgree: !this.state.applyInfo.applySMSAgree
      }
    })
  }

  toggleJusoSearch() {
    showHideInfo('#' + this.jusoTarget);
    this.setState({
      ...this.state,
      jusosearchShow: !this.state.jusosearchShow
    });

    console.log(this.state);
  }

  handleApplyDetailAddress(e: any) {
    console.log(e.target.value.substring(0, 50));

    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        applyDetailAddress: e.target.value.substring(0, 50)
      }
    });
    e.target.value = this.state.applyInfo.applyDetailAddress.substring(0, 50);
    console.log(this.state);
  }

  render() {
    const that = this;
    let template = `
      <div id="form-mw3" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw3');" title="닫기">
            <span class="i-09">신청인정보</span></a>
        </div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label for="applyName" class="input-label"><span class="form-req">성명 </span></label>
                <input type="text" value="${that.state.applyInfo.applyName}"
                  onkeyup="${that.state.path}.handleApplyName(event)"
                  onpaste="${that.state.path}.handleApplyName(event)"
                  onfocus="${that.state.path}.disableJusoSearch()"
                  id="applyName" class="input-box input-w-2" placeholder="신청인 이름">
   `;


    if (this.state.copy) {
      template += `
   
                <a href="javascript:void(0);" class="btn btnSS btnTypeB" id="copyOwnerName"
                  onclick="cyberMinwon.state.currentModule.state.currentPage.handleCopyOwnerName(event)">
                  <span>소유자이름</span>
                </a>
                <a href="javascript:void(0);" class="btn btnSS btnTypeB" id="copyUserName"
                  onclick="cyberMinwon.state.currentModule.state.currentPage.handleCopyUserName(event)">
                  <span>사용자이름</span>
                </a>
     `;
    }

    template += `
              </li>
              <li>
                <label for="applyPostNumber" class="input-label"><span class="form-req">도로명주소</span></label>
                <input type="text" value="${that.state.applyInfo.applyPostNumber}" id="applyPostNumber"
                  class="input-box input-w-2" placeholder="우편번호" disabled>
                <a class="btn btnSS btnTypeA"
                  onClick="${that.state.path}.toggleJusoSearch()"><span>주소검색</span></a>
   `;
    if (this.state.copy) {
      template += `                  
                <a href="javascript:void(0);" class="btn btnSS btnTypeB" id="copySuyongaAddress"
                  onclick="cyberMinwon.state.currentModule.state.currentPage.handleCopySuyongaAddress(event)">
                  <span>수용가주소</span>
                </a>
     `;
    }
    template += `   
              </li>
              <li>
                <label for="applyAddress" class="input-label">
                  <span class="sr-only">주소</span>
                </label><input type="text" value="${that.state.applyInfo.applyAddress}" id="applyAddress"
                  class="input-box input-w-1" placeholder="주소" disabled>
              </li>
              <li>
                <label for="applyDetailAddress" class="input-label">
                  <span class="sr-only">세부주소</span>
                </label><input type="text" 
                  onfocus="${that.state.path}.disableJusoSearch()"
                  onkeyup="${that.state.path}.handleApplyDetailAddress(event)"
                  onpaste="${that.state.path}.handleApplyDetailAddress(event)"      
                  value="${that.state.applyInfo.applyDetailAddress}" id="applyDetailAddress"
                  class="input-box input-w-1" placeholder="세부주소">
              </li>               
              <li id="${that.jusoTarget}" class="display-block">
              </li>
                <label for="applyPhone" class="input-label"><span>전화번호</span></label>
                <input value="${that.state.applyInfo.applyPhone}"
                  onfocus="${that.state.path}.disableJusoSearch()"
                  onkeyup="${that.state.path}.handleApplyPhone(event)"
                  onpaste="${that.state.path}.handleApplyPhone(event)"
                  type="text" id="applyPhone" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
              </li>
              <li>
                <label for="applyMobile" class="input-label"><span class="form-req">휴대폰번호</span></label>
                <input value="${that.state.applyInfo.applyMobile}"
                  onfocus="${that.state.path}.disableJusoSearch()"
                  onkeyup="${that.state.path}.handleApplyMobile(event)"
                  onpaste="${that.state.path}.handleApplyMobile(event)"
                  type="text" id="applyMobile" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
              </li>
              <li>
                <label class="input-label">
                  <span class="sr-only">SMS수신동의</span></label>
                <input type="checkbox"
                  onfocus="${that.state.path}.disableJusoSearch()"
                  onchange="${that.state.path}.handleOnChangeForSMSAgree(event)"
                  ${that.state.applyInfo.applySMSAgree ? 'checked' : ''} name="smsFrzburYnCheck" id="ch01">
                <label class="chk-type" for="ch01"> <span>SMS수신동의</span></label>
              </li>
              <li>
                <label for="applyEmailId" class="input-label"><span>이메일</span></label>
                <input value="${that.state.applyInfo.applyEmailId}"
                  onfocus="${that.state.path}.disableJusoSearch()"
                  onkeyup="${that.state.path}.handleApplyEmailId(event)"
                  onpaste="${that.state.path}.handleApplyEmailId(event)"
                  type="text" id="applyEmailId" class="input-box input-w-mail"> @
                <label for="applyEmailProvider"><span class="sr-only">이메일 주소</span></label>
                <input
                  onfocus="${that.state.path}.disableJusoSearch()"
                  onkeyup="${that.state.path}.handleApplyEmailProvider(event)"
                  onpaste="${that.state.path}.handleApplyEmailProvider(event)"
                  type="text" id="applyEmailProvider" class="input-box input-w-mail"
                  value="${that.state.applyInfo.applyEmailProvider}">
                <label for="applyEmailProviderSelector"><span class="sr-only">이메일 선택</span></label>
                <select id="applyEmailProviderSelector"
                  onfocus="${that.state.path}.disableJusoSearch()"
                  onchange="${that.state.path}.handleApplyEmailProviderSelector(event)"
                  value="${that.state.applyInfo.applyEmailProvider}" title="이메일도메인선택" class="input-box input-w-mail2 ">
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
              <li>
                <label for="applyRelationSelector" class="input-label"><span class="form-req">관계</span></label>
                <select id="applyRelationSelector" title="관계 선택" class="input-box input-w-2"
                  onchange="${that.state.path}.handleApplyRelationSelector(event)"
                  onfocus="${that.state.path}.disableJusoSearch()"
                  value="${that.state.applyInfo.applyRelation}">
                  <option value="1">사용자 본인</option>
                  <option value="2">사용자의 배우자</option>
                  <option value="3">사용자의 자녀</option>
                  <option value="4">소유자 본인</option>
                  <option value="5">소유자의 배우자</option>
                  <option value="">직접입력</option>
                </select>
                <!-- <label for="form-mw35-tx"><span class="sr-only">관계직접입력</span></label>
                        <input type="text" id="form-mw35-tx" class="input-box input-w-2"> -->
              </li>
            </ul>
          </div>
        </div>
      </div><!-- //form-mw3 -->
    `;

    document.getElementById('applicant').innerHTML = template;

    if (!this.state.jusosearchShow) {
      showHideInfo('#' + this.jusoTarget);
    }

    this.jusoSearchPanel.render();
  }
}