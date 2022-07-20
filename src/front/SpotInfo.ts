import JusoSearchPanel from "./../util/JusoSearchPanel";
import { showHideInfo, hideElement } from './../util//uiux-common';

export default class SpotInfo {
  state: any;
  jusoTarget: string;
  jusoSearchPanel: JusoSearchPanel;

  constructor(parent: any) {
    this.state = {
      // 부모 즉 프로그램 전체를 감싸는 UnityMinwon의 객체를 참조한다.
      parent,
      path: 'cyberMinwon.state.currentModule.state.currentPage.state.spotInfo',
      jusosearchShow: false,
      // spotInfo은 신청인 정보를 저장하는 곳이다.
      spotInfo: {
        spotPostNumber: '',
        spotAddress: '',
        spotDetailAddress: '',
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
      viewSpotInfo: {
        viewSpotAddress: ['', '도로명주소'],
      },
    };
    this.jusoTarget = 'jusosearchspot'
    this.jusoSearchPanel = new JusoSearchPanel(this, this.state.path,
      this.jusoTarget, this.handleSelectJuso);
  }

  setState(nextState: any) {
    if (this.state !== nextState)
      this.state = nextState;
  }

  verify() {
    if (!this.state.spotInfo.applyAddress) {
      alert("주소 검색하여 입력해 주세요.");
      return false;
    }
    return true;
  }

  getSpotView() {
    return {
      viewSpotInfo: {
        viewSpotAddress: [this.state.spotInfo.spotPostNumber + " " +
          this.state.spotInfo.spotAddress, '도로명주소'],
        viewSpotDetailAddress: [this.state.spotInfo.spotDetailAddress, '상세주소'],
        title: '민원발생지'
      }
    }
  }

  // 콜백에서 사용되기 때무에 arrow function을 사용한다.
  // 수정 시에 this의 score에 주의한다.
  handleSelectJuso = (jusoInfo: any) => {
    console.log(this);
    this.setState({
      ...this.state,
      spotInfo: {
        ...this.state.spotInfo,
        spotAddress: jusoInfo.roadAddr,
        spotPostNumber: jusoInfo.zipNo
      }
    });

    const $zip: HTMLInputElement = document.getElementById('spotPostNumber') as HTMLInputElement;
    const $addr: HTMLInputElement = document.getElementById('spotAddress') as HTMLInputElement;

    $zip.value = jusoInfo.zipNo
    $addr.value = jusoInfo.roadAddr
  }

  toggleJusoSearch() {
    showHideInfo('#' + this.jusoTarget);
    this.setState({
      ...this.state,
      jusosearchShow: !this.state.jusosearchShow
    });
    console.log(this.state);
  }

  handleSpotDetailAddress(e: any) {
    console.log(e.target.value.substring(0, 50));

    this.setState({
      ...this.state,
      spotInfo: {
        ...this.state.spotInfo,
        spotDetailAddress: e.target.value.substring(0, 50)
      }
    });
    e.target.value = this.state.spotInfo.spotDetailAddress.substring(0, 50);
    console.log(this.state);
  }

  disableJusoSearch() {
    hideElement('#' + this.jusoTarget);
    this.setState({
      ...this.state,
      jusosearchShow: false,
    });
  }

  render() {
    const that = this;
    let template = `
      <div id="form-mw3" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw3');" title="닫기">
            <span class="i-09">민원발생지</span></a>
        </div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label for="spotPostNumber" class="input-label"><span class="form-req">도로명주소</span></label>
                <input type="text" value="${that.state.spotInfo.spotPostNumber}" id="spotPostNumber"
                  class="input-box input-w-2" placeholder="우편번호" disabled>
                <a class="btn btnSS btnTypeA"
                  onClick="${that.state.path}.toggleJusoSearch()"><span>주소검색</span></a>
              </li>
              <li>
                <label for="spotAddress" class="input-label">
                  <span class="sr-only">주소</span>
                </label><input type="text" value="${that.state.spotInfo.spotAddress}" id="spotAddress"
                  class="input-box input-w-1" placeholder="주소" disabled>
              </li>
              <li>
                <label for="spotDetailAddress" class="input-label">
                  <span class="sr-only">세부주소</span>
                </label><input type="text" 
                  onkeyup="${that.state.path}.handleSpotDetailAddress(event)"
                  onpaste="${that.state.path}.handleSpotDetailAddress(event)"
                  onfocus="${that.state.path}.disableJusoSearch()"
                  value="${that.state.spotInfo.spotDetailAddress}" id="spotDetailAddress"
                  class="input-box input-w-1" placeholder="세부주소">
              </li>               
              <li id="${that.jusoTarget}" class="display-block">
            </ul>
          </div>
        </div>
      </div><!-- //form-mw3 -->
    `;

    document.getElementById('spot')!.innerHTML = template;

    if (!this.state.jusosearchShow) {
      showHideInfo('#' + this.jusoTarget);
    }

    this.jusoSearchPanel.render();
  }
}