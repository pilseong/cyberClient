import JusoSearchPanel from '../components/JusoSearchPanel';
import { showHideInfo, phoneNumberInputValidation, hideElement, maskingFnc
        ,citizen_alert, citizenAlert, phonePattern, mobilePattern, emailProviderPattern, clearObject } from '../util/uiux-common';
import CyberMinwon from "../infra/CyberMinwon";
import { radioMW } from './../util/uiux-common';
declare var fncCutByByte: (str: string, maxByte: number) => string;

declare var document: any;
declare var $: any;
declare var cyberMinwon: CyberMinwon;
declare var fncTrim: (str: string) => string;

export default class ApplicantInfo {

  state: any;
  jusoTarget: string;
  jusoSearchPanel: JusoSearchPanel;

  constructor(parent: any, private copy?: any) {
    this.state = {
      // 부모 즉 프로그램 전체를 감싸는 UnityMinwon의 객체를 참조한다.
      parent,
      copy, // 복사 기능 사용 여부
      // path는 하위 컴포넌트가 실행해야 할 부모의 경로를 저장한다. DOM에 그려 줄 때 필요
      path: 'cyberMinwon.state.currentModule.state.currentPage.applicantInfo',
      jusosearchShow: false,
      copySuyongaAddress: false,
      // 상세 페이지에 추가로 넘길 정보
      addData: {},
      // applyInfo은 신청인 정보를 저장하는 곳이다.
      applyInfo: {
        applyName: '',
        applyPostNumber: '',
        applyAddress: '',
        applyDetailAddress: '',
        applyPhone: '',
        applyMobile: '',
        applyEmailId: '',
        applyEmailProvider: '',
        applyEmailProviderSelector: 0,
        applyRelation: '사용자',
        applyRelationSelector: 0,
        applyRelation1: '본인',
        applyRelationSelector1: 0,
        applyRelation2: '',
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
        floors: '',
        
        applyDisplayAddress: ''//모든 주소 입력 시 보여주기용 주소
      },
      // 신청인의 뷰를 데이터를 저장한다.
      viewApplyInfo: {
        viewApplyName: ['', '신청인'],
        viewApplyAddress: ['', '주소'],
        viewApplyTel: ['', '연락처'],
        viewApplyEmail: ['', '전자우편'],
        viewApplyRelation: ['', '관계'],
      },
    }
    this.jusoTarget = 'jusosearchapplicant';
    this.jusoSearchPanel = new JusoSearchPanel(this, this.state.path, 
      this.jusoTarget, this.handleSelectJuso);
  }

  setState(nextState: any) {
    if (this.state !== nextState)
      this.state = nextState;
  }

  verify() {
    const minwonCd = cyberMinwon.state.unityMinwon.state.minwonCd;
    const applyInfo = this.state.applyInfo;
    if (!this.state.applyInfo.applyName) {
      citizenAlert("신청인 이름을 입력해 주세요.").then(result => {
        if(result){
          $("#applyName").focus();
        }
      });
      return false;
    }
    let directInput = !this.state.parent.suyongaInfo ? "" : this.state.parent.suyongaInfo.directInput;
    if (
        ((minwonCd !== "A05") 
        &&!(directInput && applyInfo.sido && applyInfo.sigungu && applyInfo.umd && applyInfo.applyDetailAddress))//직접 입력의 경우 applyAddress로 체크 안함
        && !applyInfo.applyAddress) {
      citizenAlert("신청인 주소를 입력해 주세요.").then(result => {
        if(result){
          $("#applyAddress").focus();
        }
      });
      return false;
    }
    
    if (applyInfo.applyPhone && phonePattern.test(applyInfo.applyPhone) !== true) {
      citizenAlert("전화번호가 형식에 맞지 않습니다. 지역번호를 포함한 정확한 전화번호를 입력해 주세요.").then(result => {
        if(result){
          $("#applyPhone").focus();
        }        
      });
      return false;
    } 
    
    if (applyInfo.applyMobile && mobilePattern.test(applyInfo.applyMobile) !== true) {
      citizenAlert("휴대전화 번호가 형식에 맞지 않습니다. 확인 후 다시 입력해 주세요.").then(result => {
        if(result){
          $("#applyMobile").focus();
        }        
      });
      return false;
    }
    
    if((minwonCd == 'B14' || minwonCd == 'B14_1') && !applyInfo.applyMobile){
      citizenAlert("휴대전화 번호는 필수로 입력해 주세요.").then(result => {
        if(result){
          $("#applyMobile").focus();
        }        
      });
      return false;
    }
    if(!applyInfo.applyPhone && !applyInfo.applyMobile){
      citizenAlert("전화번호와 휴대전화 번호 중 하나는 필수로 입력해 주세요.").then(result => {
        if(result){
          $("#applyPhone").focus();
        }        
      });
      return false;
    }
    
    if(applyInfo.applyEmailId && !applyInfo.applyEmailProvider){
       citizenAlert("전자우편(eMail) 도메인 형식을 알맞게 입력해 주세요.").then(result => {
        if(result){
          $("#applyEmailProvider").focus();
        }        
      });
      return false;
    } 

    if(applyInfo.applyEmailId && applyInfo.applyEmailProvider.length > 0 && emailProviderPattern.test(applyInfo.applyEmailProvider) !== true){
      citizenAlert("전자우편(eMail) 도메인 형식을 알맞게 입력해 주세요.").then(result => {
        if(result){
          $("#applyEmailProvide").focus();
        }        
      });
      return false;
    }
    
    if(!applyInfo.applyEmailId && applyInfo.applyEmailProvider){
       citizenAlert("전자우편(eMail) 아이디를 입력해 주세요").then(result => {
        if(result){
          $("#applyEmailId").focus();
        }        
      });
      return false;
    }

    if (minwonCd !== "A08" && minwonCd !== "A09" && minwonCd !== "A11" && minwonCd !== "C01" && !applyInfo.applyRelation) {
      citizenAlert("관계를 선택해 주세요.").then(result => {
        if(result){
          $("#applyRelation").focus();
        }
      });
      return false;
    } else if(minwonCd !== "A08" && minwonCd !== "A09" && minwonCd !== "A11" && minwonCd !== "C01" && applyInfo.applyRelation1 === "직접입력" && !applyInfo.applyRelation2){
      citizenAlert(applyInfo.applyRelation+"와의 관계를 입력해 주세요.").then(result => {
        if(result){
          $("#applyRelation2").focus();
        }
      });
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
    let applyRelation = this.state.applyInfo.applyRelation + '의 ' + (
                        this.state.applyInfo.applyRelation1 !== '직접입력' ? this.state.applyInfo.applyRelation1 : this.state.applyInfo.applyRelation2);
    let applyInfo = this.state.applyInfo;
    const minwonCd = cyberMinwon.state.unityMinwon.state.minwonCd;
    const viewApplyInfo : any = {};
    viewApplyInfo['noinfo'] = {
      title: '신청인 정보',
      viewApplyName: [maskingFnc.name(applyInfo.applyName,"*"), '신청인'],
      viewApplyAddress: [applyInfo.applyPostNumber 
          + " " + applyInfo.applyAddress +
          (applyInfo.applyDetailAddress? " " + applyInfo.applyDetailAddress : "")
          , '도로명주소' 
          ],
      viewApplyJibeunAddress: [
          fncTrim(applyInfo['addr1'])
             + " " +fncTrim(applyInfo['bunji']) + 
            (fncTrim(applyInfo['ho']) && fncTrim(applyInfo['ho']) !== '0'? "-"+fncTrim(applyInfo['ho']):"") +
            (applyInfo['applyDetailAddress']? " "+fncTrim(applyInfo['applyDetailAddress']):"")
            , '지번주소'],
      viewApplyTel: [`${maskingFnc.telNo(applyInfo.applyPhone, "*")} / ${maskingFnc.telNo(applyInfo.applyMobile, "*")}`, '연락처'],
      viewApplyEmail: [maskingFnc.emailId(applyInfo.applyEmailId, "*", 3) +
        (applyInfo.applyEmailProvider ?
          '@' + applyInfo.applyEmailProvider : ''), '전자우편']
    }
    if(minwonCd != 'A06' && minwonCd != 'A08' && minwonCd !== "A09" && minwonCd !== "A11" && minwonCd !== "C01"){
      viewApplyInfo['noinfo'] = {
        ...viewApplyInfo['noinfo'],
        viewApplyRelation: [applyRelation, '관계']
      }
    }
    return viewApplyInfo;
  }

  // 콜백에서 사용되기 때무에 arrow function을 사용한다.
  // 수정 시에 this의 score에 주의한다.
  handleSelectJuso = (jusoInfo: any, detailAddress: string, action?: string) => {
    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        applyAddress: jusoInfo.roadAddr,
        applyPostNumber: jusoInfo.zipNo,
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
        bdDtNm: '',//상세건물명(jusoInfo.detBdNmList를 쓰지마시오 일정 확률로 못쓰는 엄청 긴 값이 옴)
        bunji: jusoInfo.lnbrMnnm,//번지        
        ho: jusoInfo.lnbrSlno,//호
        
        //수용가 주소 복사로 들어올 수 있지만 도로명주소API 입력으로 지워지지 않는 값들
        specAddr:"",         
        extraAdd:"",
        specDng:"",
        specHo:"",
        floors:"",
        //수용가 주소 복사로 들어올 수 있지만 도로명주소API 입력으로 지워지지 않는 값들
        
        applyDetailAddress : detailAddress,//상세주소
        applyDisplayAddress : (jusoInfo.roadAddr+" "+detailAddress).trim()//요약주소(보여주기용)
      }
    });

    document.getElementById('applyPostNumber').value = jusoInfo.zipNo
    document.getElementById('applyDisplayAddress').innerHTML = jusoInfo.roadAddr+" "+detailAddress
    document.getElementById('applyDisplayAddress').parentNode.style.display = 'none';
    if(action !== "clear"){
      //document.getElementById('applyAddress').value = jusoInfo.roadAddr
      //document.getElementById('applyDetailAddress').value = detailAddress
      document.getElementById('applyDisplayAddress').parentNode.style.display = 'block';
      document.getElementById('applyDisplayAddress').parentNode.classList.remove("display-none");
  
      this.toggleJusoSearch();
      //$("#applyDetailAddress").focus();
    }
  }

  // 신청인 이름 타이핑 매핑
  handleApplyName(e: any) {
    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        applyName: e.target.value.substring(0, 50)
      }
    });
    e.target.value = this.state.applyInfo.applyName.substring(0, 50);
  }

  // 신청인 전화번호 연동
  handleApplyPhone(e: any) {
    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        applyPhone: e.target.value.replace(/[^0-9]/g,"").substring(0, 12)
      }
    });
    e.target.value = this.state.applyInfo.applyPhone.substring(0, 12);
    if(this.state.applyInfo.applyPhone.length === 0){
      e.target.classList.remove("success","err");
    } else {
      phoneNumberInputValidation(e.target, 12, phonePattern);
    }
  }

  // 신청인 휴대번호 연동
  handleApplyMobile(e: any) {
    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        applyMobile: e.target.value.replace(/[^0-9]/g,"").substring(0, 11)
      }
    });
    e.target.value = this.state.applyInfo.applyMobile.substring(0, 11);
    if(this.state.applyInfo.applyMobile.length === 0){
      e.target.classList.remove("success","err");
    } else {
      phoneNumberInputValidation(e.target, 11, mobilePattern);
    }
  }

  // 이미메일 id 입력 연동
  handleApplyEmailId(e: any) {
    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        applyEmailId: e.target.value.replace(/[^a-z0-9,\-,\_.+]/gi,'').substring(0, 30)
      }
    });
    e.target.value = this.state.applyInfo.applyEmailId.substring(0, 30);
  }

  // 전자우편 공급자를 리스트에서 선택할 경우
  handleApplyEmailProviderSelector(e: any) {
    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        // 공급자의 domain을 공급자로 저장한다.
        applyEmailProvider: e.target.value,
        // 선택한 전자우편 공급자의 index를 저장한다.
        applyEmailProviderSelector: e.target.options.selectedIndex
      }
    });
//    this.render();

    var $applyEmailProviderSelector = document.getElementById("applyEmailProviderSelector");
    $applyEmailProviderSelector.options[this.state.applyInfo.applyEmailProviderSelector].selected = true;
  }

  // 신청인의 수용가와의 관계를 설정한다.
  handleApplyRelationSelector(e: any) {
    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        // 공급자의 domain을 공급자로 저장한다.
        applyRelation: e.target.selectedOptions[0].innerText,
        // 선택한 전자우편 공급자의 index를 저장한다.
        applyRelationSelector: e.target.options.selectedIndex
      }
    });
//    this.render();
    let applyRelationVal = e.target.selectedOptions[0].innerText

    var $applyRelationSelector = document.getElementById("applyRelationSelector");
    $applyRelationSelector.options[this.state.applyInfo.applyRelationSelector].selected = true;
//    let title = $applyRelationSelector.options[this.state.applyInfo.applyRelationSelector].title
//    $applyRelationSelector.options[this.state.applyInfo.applyRelationSelector].title = `${applyRelationVal} ${title}`
    
    let title = '관계선택1'
    $("#applyRelationSelector").attr("title",`${applyRelationVal} 선택됨 ${title}`);
  }
  
  // 신청인의 수용가와의 관계를 설정한다.
  handleApplyRelationSelector1(e: any) {
    let value = e.value;
    let name = e.options[e.selectedIndex].text;
    let preValue = this.state.applyInfo.applyRelation1;
    if(value == "9") {
      if(document.getElementById("applyRelation2").offsetWidth == 0 && document.getElementById("applyRelation2").offsetHeight == 0){
        document.getElementById("applyRelation2").classList.toggle("display-none");
      }
      document.getElementById("applyRelation2").value = (preValue == "9" && document.getElementById("applyRelation2").value) ? document.getElementById("applyRelation2").value : "";
    }else{
      if(document.getElementById("applyRelation2").offsetWidth > 0 && document.getElementById("applyRelation2").offsetHeight > 0){
        document.getElementById("applyRelation2").classList.toggle("display-none");
      }
      document.getElementById("applyRelation2").value = "";
      this.state.applyInfo.applyRelation2 = "";
    }
    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        // 
        applyRelation1: name,
        // 
        applyRelationSelector1: e.selectedIndex
      }
    });
//    this.render();
    var $applyRelationSelector1 = document.getElementById("applyRelationSelector1");
    $applyRelationSelector1.options[this.state.applyInfo.applyRelationSelector1].selected = true;
    let title = '관계선택2'
    $("#applyRelationSelector1").attr("title",`${name} 선택됨 ${title}`);
  }
  
  handleApplyRelation2(e: any) {
    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        // 관계 직접 입력
        applyRelation2: fncCutByByte(e.target.value, 30)
      }
    });
    e.target.value = this.state.applyInfo.applyRelation2;
  }

  // 전자우편 공급자를 입력하는 루틴
  handleApplyEmailProvider(e: any) {
    // 상태를 변경하기 전에 선택된 select 박스를 해지해 준다.
    if (this.state.applyInfo.applyEmailProviderSelector !== 0) {
      const $applyEmailProviderSelector = document.getElementById("applyEmailProviderSelector");
      $applyEmailProviderSelector.options[this.state.applyInfo.applyEmailProviderSelector].selected = false;
    }

    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        applyEmailProvider: e.target.value.replace(/[^a-z0-9.-]/gi,'').substring(0, 30),
        applyEmailProviderSelector: 0
      }
    });
    e.target.value = this.state.applyInfo.applyEmailProvider.substring(0, 30);
  }

  toggleJusoSearch(e?:any) {
    if(e)e.preventDefault();
    showHideInfo('#' + this.jusoTarget);
    this.setState({
      ...this.state,
      jusosearchShow: !this.state.jusosearchShow
    });
    clearObject(this.jusoSearchPanel.state.jusoResult);
    this.jusoSearchPanel.render();
    //this.state.jusosearchShow && this.jusoSearchPanel.state.jusoResult.juso.length === 0 ? $("#"+this.jusoTarget+"doro > p").show() : $("#"+this.jusoTarget+"doro > p").hide();
    //!document.getElementById(this.jusoTarget+"doro") ? this.jusoSearchPanel.render() : "";
    if($('#jusosearchapplicantdoro').is(':visible')){
      //$("#jusosearchapplicantdoro > input").focus();
    } else $("#applyPhone").focus();
  }

  handleApplyDetailAddress(e: any) {

    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        applyDetailAddress: fncCutByByte(e.target.value, 150),
        addr2: fncCutByByte(e.target.value, 150)
      }
    });
    e.target.value = this.state.applyInfo.applyDetailAddress;
  }
  
  render() {
    const that = this;
    const minwonCd = cyberMinwon.state.unityMinwon.state.minwonCd;
    let template = `
      <div id="form-mw3" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw3');" title="닫기">
            <span class="i-09">신청인</span></a>
        </div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label for="applyName" class="input-label"><span class="form-req"><span class="sr-only">필수</span>성명 </span></label>
                <input type="text" value="${that.state.applyInfo.applyName}"
                  onkeyup="${that.state.path}.handleApplyName(event)"
                  onpaste="${that.state.path}.handleApplyName(event)"
                  id="applyName" class="input-box input-w-2" placeholder="신청인 이름" >
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
    
    if(minwonCd !== "A05"){
      template += `
              </li>
              <li class="mw-opt mw-opt-2 row">
                <label for="applyPostNumber" class="input-label"><span class="form-req"><span class="sr-only">필수</span>주소</span></label>
                <input type="text" id="applyPostNumber" value="${that.state.applyInfo.applyPostNumber}" class="input-box input-w-2" placeholder="우편번호" disabled="">
                <a href="javascript:void(0);" class="btn btnSS btnTypeA" onclick="cyberMinwon.state.currentModule.state.currentPage.applicantInfo.toggleJusoSearch(event)" title="주소검색"><span>주소검색</span></a>
                `;
               if(minwonCd === "A13"){
                template += `<a href="javascript:void(0);" class="btn btnSS btnTypeB" id="copyA12Address" onclick="cyberMinwon.state.currentModule.state.currentPage.handleCopyA12Address(event);" title="신청내역주소복사"><span>신청내역주소</span></a>`
               } else if(minwonCd  === "A08" || minwonCd  === "A09" || minwonCd  === "C01"){
                template += `<a href="javascript:void(0);" class="btn btnSS btnTypeB" id="copySpotAddress" onclick="cyberMinwon.state.currentModule.state.currentPage.handleCopySpotAddress(event);" title="민원발생지주소복사"><span>민원발생지</span></a>`
               } else { 
                template += `<a href="javascript:void(0);" class="btn btnSS btnTypeB" id="copySuyongaAddress" onclick="cyberMinwon.state.currentModule.state.currentPage.handleCopySuyongaAddress(event);" title="수용가주소복사"><span>수용가주소</span></a>`
               }
       template += `</li>`;
       
       template += `${that.state.applyInfo.applyDisplayAddress}` ? `<li>` : `<li style="display:none;">` ;
       template += `
                <label for="applyDisplayAddress" class="input-label display-inline"><span class="sr-only">주소</span></label>
                <div id="applyDisplayAddress" class="input-box input-w-2 result-address">${that.state.applyInfo.applyDisplayAddress}</div>
              </li>
      `;
      template += `
              <li id="${that.jusoTarget}" class="display-block"></li>
      `;
    }
    template += `
              <li>
                <label for="applyPhone" class="input-label"><span>전화번호</span></label>
                <input value="${that.state.applyInfo.applyPhone}" maxlength="12"
                  onkeyup="${that.state.path}.handleApplyPhone(event)"
                  onpaste="${that.state.path}.handleApplyPhone(event)"
                  type="text" id="applyPhone" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
              </li>
              <li>
                <label for="applyMobile" class="input-label">휴대전화</label>
                <input value="${that.state.applyInfo.applyMobile}" maxlength="12"
                  onkeyup="${that.state.path}.handleApplyMobile(event)"
                  onpaste="${that.state.path}.handleApplyMobile(event)"
                  type="text" id="applyMobile" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
              </li>
              <li>
                <p class="form-cmt pre-star tip-blue">전화번호와 휴대전화 번호 중 하나는 필수로 입력해 주세요.</p>
              </li>
              <!-- <p class="form-cmt pre-star tip-blue">전화번호와 휴대전화 번호 중 하나는 필수로 입력해 주세요.</p>`;
                if(minwonCd === "A04" || minwonCd === "A05" || minwonCd === "A07" || minwonCd === "A12" || minwonCd === "B01"){
                  template += `<p class="form-cmt pre-star tip-blue">현장 민원서비스 품질 향상을 위해 만족도조사를 실시합니다.</p>`;
                }            
    template +=`</li> -->
              <li class="email">
                <label for="applyEmailId" class="input-label"><span>전자우편(eMail)</span></label>
                <input value="${that.state.applyInfo.applyEmailId}" placeholder="전자우편 아이디"
                  onkeyup="${that.state.path}.handleApplyEmailId(event)"
                  onpaste="${that.state.path}.handleApplyEmailId(event)"
                  type="text" id="applyEmailId" class="input-box input-w-mail"> 
                <span>@</span>
                <label for="applyEmailProvider"><span class="sr-only">전자우편 주소</span></label>
                <input
                		placeholder="도메인"
                  onkeyup="${that.state.path}.handleApplyEmailProvider(event)"
                  onpaste="${that.state.path}.handleApplyEmailProvider(event)"
                  type="text" id="applyEmailProvider" class="input-box input-w-mail"
                  value="${that.state.applyInfo.applyEmailProvider}">
                <label for="applyEmailProviderSelector"><span class="sr-only">전자우편 선택</span></label>
                <select id="applyEmailProviderSelector"
                  onchange="${that.state.path}.handleApplyEmailProviderSelector(event)"
                   title="전자우편도메인선택" class="input-box input-w-mail2 ">
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
    `;
    if(minwonCd !== "A06" && minwonCd != 'A08' && minwonCd !== "A09" && minwonCd !== "A11" && minwonCd !== "C01"){
      
      template += `
                <li class="relation">
                  <label for="applyRelationSelector" class="input-label"><span class="form-req"><span class="sr-only">필수</span>관계</span></label>
                  <select id="applyRelationSelector" title="관계 선택1" class="input-box input-w-mail"
                    onchange="${that.state.path}.handleApplyRelationSelector(event)">
                    <option value="사용자" selected="selected">사용자</option>
                    <option value="소유자">소유자</option>
                    `;
      if(minwonCd == "I10"){
        template += `
                    <option value="수용가">수용가</option>
                    <option value="시공자">시공자</option>
                    <option value="설계자">설계자</option>
                    
        `;
      }
      if(minwonCd == "I12"){
        template += `
                    <option value="대표자">대표자</option>
        `;
      }
      template += `
                  </select>
                  <span>의</span>
                  <select id="applyRelationSelector1" title="관계 선택2" class="input-box input-w-mail"
                    onchange="${that.state.path}.handleApplyRelationSelector1(this)"
                    value="${that.state.applyInfo.applyRelation1}">
                    <option value="본인" selected="selected">본인</option>
                    <option value="배우자">배우자</option>
                    <option value="자녀">자녀</option>
                    <option value="9">직접입력</option>
                  </select>
                  <input type="text" id="applyRelation2" title="관계 직접 입력" class="input-box input-w-rel-directly display-none"
                    onchange="${that.state.path}.handleApplyRelation2(event)"
                    onkeyup="${that.state.path}.handleApplyRelation2(event)"
                    value="${that.state.applyInfo.applyRelation2}">
                </li>
       `;
     }
     template += `
            </ul>
          </div>
        </div>
      </div><!-- //form-mw3 -->
    `;

    document.getElementById('applicant').innerHTML = template;

    this.afterRender();

    if (!this.state.jusosearchShow) {
      showHideInfo('#' + this.jusoTarget);
    }

    if(minwonCd !== "A05"){
      this.jusoSearchPanel.render();
    }
  }
  
  afterRender() {
    const that = this;
    const minwonCd = cyberMinwon.state.unityMinwon.state.minwonCd;
    if(minwonCd === "C01"){
      var $applyEmailProviderSelector = document.getElementById("applyEmailProviderSelector") as HTMLSelectElement;
      $applyEmailProviderSelector!.options[this.state.applyInfo.applyEmailProviderSelector].selected = true;
    }else if(minwonCd !== "A06" && minwonCd !== "A08" && minwonCd !== "A09" && minwonCd !== "A11"){
      
      // 선택된 셀렉트 박스로 상태를 복구한다.
      var $applyRelationSelector = document.getElementById("applyRelationSelector") as HTMLSelectElement;
      //(사용자/소유자) 이외의 관계를 이전 민원에서 신청 하고 (사용자/소유자)만 있는 확면으로 진입 시 에러가 나므로 if 처리. 
      if($applyRelationSelector!.options[this.state.applyInfo.applyRelationSelector]){
        $applyRelationSelector!.options[this.state.applyInfo.applyRelationSelector].selected = true;
      } else {
        $applyRelationSelector!.options[0].selected = true;
        this.setState({
          ...this.state,
          applyInfo:{
            ...that.state.applyInfo,
            applyRelationSelector: 0,
            applyRelation: "사용자"
          }
        })
        this.state.applyInfo.applyRelationSelector
      }
      
      var $applyRelationSelector1 = document.getElementById("applyRelationSelector1") as HTMLSelectElement;
      $applyRelationSelector1!.options[this.state.applyInfo.applyRelationSelector1].selected = true;  
  
      var $applyEmailProviderSelector = document.getElementById("applyEmailProviderSelector") as HTMLSelectElement;
      $applyEmailProviderSelector!.options[this.state.applyInfo.applyEmailProviderSelector].selected = true;  
    }
    if(document.getElementById("applyRelation2") && this.state.applyInfo.applyRelation1 == "직접입력"){
      document.getElementById("applyRelation2").classList.toggle("display-none");
    }
    const authInfo = this.state.parent.authenticationInfo || null;
    $("#applyRelationSelector").attr("title",`${that.state.applyInfo.applyRelation} 선택됨 관계 선택1`);
    $("#applyRelationSelector1").attr("title",`${that.state.applyInfo.applyRelation1} 선택됨 관계 선택2`);
    if(authInfo && !$('#authentication').hasClass('display-none')){
      $("#applyName").prop("readonly", true);
      authInfo.state.type === 'M'? $("#applyMobile").prop("readonly", true) : $("#applyMobile").prop("readonly", false)
    }else{
      $("#applyName").prop("readonly", false);
      $("#applyMobile").prop("readonly", false);
    }
  }
}