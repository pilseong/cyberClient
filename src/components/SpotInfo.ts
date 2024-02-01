import JusoSearchPanel from "./JusoSearchPanel";
import { showHideInfo, hideElement, citizenAlert, citizen_alert, citizenConfirm, clearObject } from '../util/uiux-common';

declare var document: any;
declare var $: any;

export default class SpotInfo {
  state: any;
  jusoTarget: string;
  jusoSearchPanel: JusoSearchPanel;
  path: string;

  constructor(private parent: any) {
    this.state = {
      // 부모 즉 프로그램 전체를 감싸는 UnityMinwon의 객체를 참조한다.
      parent,
      jusosearchShow: false,
      // spotInfo은 신청인 정보를 저장하는 곳이다.
      spotInfo: {
        spotPostNumber: '',
        spotAddress: '',
        spotDetailAddress: '',
        spotDisplayAddress: '',
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
        zipcode: '',
        fullDoroAddr: '', //applyAddress
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
        viewSpotAddress: ['', '주소'],
      },
    };
    this.jusoTarget = 'jusosearchspot'
    this.path = 'cyberMinwon.state.currentModule.state.currentPage.spotInfo';
    this.jusoSearchPanel = new JusoSearchPanel(this, this.path,
      this.jusoTarget, this.handleSelectJuso);
  }

  setState(nextState: any) {
    if (this.state !== nextState)
      this.state = nextState;
  }

  verify() {
    if (!this.state.spotInfo.spotAddress) {
      citizenAlert("민원발생지 주소 검색하여 입력해 주세요.");
      return false;
    }
    if (!this.state.spotInfo.spotDetailAddress) {
      citizenAlert("민원발생지 상세주소를 입력해 주세요.");
      return false;
    }
    return true;
  }

  getSpotView() {
    return {
      viewSpotInfo: {
        viewSpotAddress: [
          this.state.spotInfo.spotPostNumber + " " +
          this.state.spotInfo.spotAddress + " " + this.state.spotInfo.spotDetailAddress
          , '도로명주소'],
        viewSpotJibeunAddress: [
          this.state.spotInfo.addr1
          + " " + this.state.spotInfo.bunji
          + (this.state.spotInfo.ho && this.state.spotInfo.ho !== '0'? "-"+this.state.spotInfo.ho:"")
          + " " + this.state.spotInfo.spotDetailAddress
          , '지번주소'],
        title: '민원발생지'
      }
    }
  }

  // 콜백에서 사용되기 때무에 arrow function을 사용한다.
  // 수정 시에 this의 score에 주의한다.
  handleSelectJuso = (jusoInfo: any, detailAddress: string, action?: string) => {
    
    this.setState({
      ...this.state,
      spotInfo: {
        ...this.state.spotInfo,
        spotAddress: jusoInfo.roadAddr,
        spotPostNumber: jusoInfo.zipNo,
        zipcode: jusoInfo.zipNo,//우편번호        
        addr1: (jusoInfo.siNm +" "+jusoInfo.sggNm+" "+jusoInfo.emdNm).trim(),//지역명        
        addr2: '',//상세주소        
        fullDoroAddr: jusoInfo.roadAddr,        
        sido: jusoInfo.siNm,//시도명        
        sigungu: jusoInfo.sggNm,//시군구명        
        umd: jusoInfo.emdNm,//법정읍면동명        
        hdongNm: '',//행정동 명(java단에서 어차피 만들어줌)        
        dong: jusoInfo.emdNm,//행정읍동명 같지만 값이 없어 umd와 같은 값을 준다        
        doroCd: jusoInfo.rnMgtSn,//도로명코드        
        doroNm: jusoInfo.rn,//도로명        
        //dzipcode: '',        
        bupd: jusoInfo.admCd,//법정동코드        
        bdMgrNum: jusoInfo.bdMgtSn,//건물관리번호 (java단에서 어차피 만들어줌)        
        bdBonNum: jusoInfo.buldMnnm,//건물본번        
        bdBuNum: jusoInfo.buldSlno,//건물부번        
        bdnm: jusoInfo.bdNm,//건물명        
        bdDtNm: '',//상세건물명                        
        bunji: jusoInfo.lnbrMnnm,//번지        
        ho: jusoInfo.lnbrSlno,//호 
        
        spotDetailAddress : detailAddress,//상세주소
        spotDisplayAddress : (jusoInfo.roadAddr+" "+detailAddress).trim()//요약주소(보여주기용)
      }
    });

    const $zip: HTMLInputElement = document.getElementById('spotPostNumber') as HTMLInputElement;
    const $addr: HTMLInputElement = document.getElementById('spotAddress') as HTMLInputElement;
    
    $zip.value = jusoInfo.zipNo;
    document.getElementById('spotDisplayAddress').innerHTML = jusoInfo.roadAddr+" "+detailAddress;
    document.getElementById('spotDisplayAddress').parentNode.style.display = 'none';
    if(action !== "clear"){
      
      document.getElementById('spotDisplayAddress').parentNode.style.display = 'block';
      
      //수용가주소 복사 여부 변수 값 변경
      if(this.parent.applicantInfo.state.copySuyongaAddress){
          this.parent.handleChangeFromCopy();
      }
      this.toggleJusoSearch();
      //$addr.value = jusoInfo.roadAddr
      //$("#spotDetailAddress").focus();
    }
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
    $("#jusosearchspotdoro > input").focus();
  }

  handleSpotDetailAddress(e: any) {
    this.setState({
      ...this.state,
      spotInfo: {
        ...this.state.spotInfo,
        spotDetailAddress: e.target.value.substring(0, 50)
      }
    });
    e.target.value = this.state.spotInfo.spotDetailAddress.substring(0, 50);
    
    //더이상 수용가주소 복사 상태가 아님
    if(this.parent.applicantInfo.state.copySuyongaAddress){
        this.parent.handleChangeFromCopy();
      }
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
            <ul id="spotInput">
              <li>
                <label for="spotPostNumber" class="input-label"><span class="form-req"><span class="sr-only">필수</span>주소</span></label>
                <span onclick="${that.path}.toggleJusoSearch();">
                  <input type="text" id="spotPostNumber" value="${that.state.spotInfo.spotPostNumber}" class="input-box input-w-2" placeholder="우편번호" disabled="">
                </span>  
                <a href="javascript:;" class="btn btnSS btnTypeA btnSingle" onclick="${that.path}.toggleJusoSearch()"><span>주소검색</span></a>
              </li>
              `;
        template += `${that.state.spotInfo.spotPostNumber}` ? `<li>` : `<li style="display:none;">` ;
        template += `
                <label for="spotDisplayAddress" class="input-label display-inline"><span class="sr-only">주소</span></label>
                <div id="spotDisplayAddress" class="input-box input-w-2 result-address">${that.state.spotInfo.spotDisplayAddress}</div>
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