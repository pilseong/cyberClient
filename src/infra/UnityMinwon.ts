// 페이지 전체를 관리 하는 어플리케이션
import InfoPanel from '../components/InfoPanel';
import AuthBasicApplicationPage from '../front/AuthBasicApplicationPage';
import BasicApplicationPage from '../front/BasicApplicationPage';
import NoSuyongaApplicationPage from '../front/NoSuyongaApplicationPage';
import SuyongaJusoApplicationPage from '../front/SuyongaJusoApplicationPage';
import A13ApplicationPage from '../front/A13ApplicationPage';
import A14ApplicationPage from '../front/A14ApplicationPage';
import SummaryPage from '../infra/SummaryPage';
import CyberMinwonStorage from '../infra/StorageData';
//자주 찾는 민원, 주요민원, 통합민원 4
import B04DetailPage from '../content/B04Detail';
import B14DetailPage from '../content/B14Detail';
import B14DetailPage2 from '../content/B14Detail2';
import B19DetailPage from '../content/B19Detail';
import B19DetailPage2 from '../content/B19Detail2';
import B25DetailPage from '../content/B25Detail';
//자주 찾는 민원, 주요민원 2
import B01DetailPage from '../content/B01Detail';
import A02DetailPage from '../content/A02Detail';
//주요민원 4
import A04DetailPage from '../content/A04Detail';
import B05DetailPage from '../content/B05Detail';
import A05DetailPage from '../content/A05Detail';
import A06DetailPage from '../content/A06Detail';
//요금민원 13
import B02DetailPage from '../content/B02Detail';
import I06DetailPage from '../content/I06Detail';
import B08DetailPage from '../content/B08Detail';
import B09DetailPage from '../content/B09Detail';
import B10DetailPage from '../content/B10Detail';
import I12DetailPage from '../content/I12Detail';
import B13DetailPage from '../content/B13Detail';
import B15DetailPage from '../content/B15Detail';
import B18DetailPage from '../content/B18Detail';
import B20DetailPage from '../content/B20Detail';
import B23DetailPage from '../content/B23Detail';
import B24DetailPage from '../content/B24Detail';
import B27DetailPage from '../content/B27Detail';
//공사민원 8
import A01DetailPage from '../content/A01Detail';
import I10DetailPage from '../content/I10Detail';
import A07DetailPage from '../content/A07Detail';
import A08DetailPage from '../content/A08Detail';
import A09DetailPage from '../content/A09Detail';
import A11DetailPage from '../content/A11Detail';
import A12DetailPage from '../content/A12Detail';
import A13DetailPage from '../content/A13Detail';
//기타 1
import C01DetailPage from '../content/C01Detail';

import { closeKeypad } from '../util/unity_resource';
import { submitOnce, citizenAlert, citizenConfirm, jsDeptTelPop } from '../util/uiux-common';
declare var $: any;
declare var document: any;
declare var gContextUrl: string;

export default class UnityMinwon {
  state: {
    parent: any;
    steps: any;
    target: any;
    currentPage: any;
    minwonCd: string;
    registeredMinwons: any[];
    page: number;
    applicationPage: any;
    summaryPage: any;
  }

  constructor(parent: any, $app: any) {
    this.state = {
      parent,
      steps: {},
      target: $app,
      currentPage: null,
      minwonCd: '',
      registeredMinwons: [],
      page: 0,
      applicationPage: null,
      summaryPage: null,
    };

    const authBasicApplicationPage = new AuthBasicApplicationPage(this);
    const basicApplicationPage = new BasicApplicationPage(this);
    const a13ApplicationPage = new A13ApplicationPage(this);
    const a14ApplicationPage = new A14ApplicationPage(this);
//    const b18ApplicationPage = new B18ApplicationPage(this);
    const noSuyongaApplicationPage = new NoSuyongaApplicationPage(this);
    const suyongaJusoApplicationPage = new SuyongaJusoApplicationPage(this);

    var summaryStep = new SummaryPage(this);
    this.addSummaryPage(summaryStep);

    //자주 찾는 민원, 주요민원, 통합민원
    var detailB04 = new B04DetailPage(this, 'B04');
    var detailB14 = new B14DetailPage(this, 'B14');
    var detailB14_1 = new B14DetailPage2(this, 'B14');
    var detailB19 = new B19DetailPage(this, 'B19');
    var detailB19_1 = new B19DetailPage2(this, 'B19');
    var detailB25 = new B25DetailPage(this, 'B25');
    //자주 찾는 민원, 주요민원
    var detailB01 = new B01DetailPage(this, 'B01');
    var detailA02 = new A02DetailPage(this, 'A02');
    //주요민원
    var detailA04 = new A04DetailPage(this, 'A04');
    var detailB05 = new B05DetailPage(this, 'B05');
    var detailA05 = new A05DetailPage(this, 'A05');
    var detailA06 = new A06DetailPage(this, 'A06');
    //요금민원
    var detailB02 = new B02DetailPage(this, 'B02');
    var detailI06 = new I06DetailPage(this, 'I06');
    var detailB08 = new B08DetailPage(this, 'B08');
    var detailB09 = new B09DetailPage(this, 'B09');
    var detailB10 = new B10DetailPage(this, 'B10');
    var detailI12 = new I12DetailPage(this, 'I12');
    var detailB13 = new B13DetailPage(this, 'B13');
    var detailB15 = new B15DetailPage(this, 'B15');
    var detailB18 = new B18DetailPage(this, 'B18');
    var detailB20 = new B20DetailPage(this, 'B20');
    var detailB23 = new B23DetailPage(this, 'B23');
    var detailB24 = new B24DetailPage(this, 'B24');
    var detailB27 = new B27DetailPage(this, 'B27');
    //공사민원
    var detailA01 = new A01DetailPage(this, 'A01');
    var detailI10 = new I10DetailPage(this, 'I10');
    var detailA07 = new A07DetailPage(this, 'A07');
    var detailA08 = new A08DetailPage(this, 'A08');
    var detailA09 = new A09DetailPage(this, 'A09');
    var detailA11 = new A11DetailPage(this, 'A11');
    var detailA12 = new A12DetailPage(this, 'A12');
    var detailA13 = new A13DetailPage(this, 'A13');
    
    //기타
    var detailC01 = new C01DetailPage(this, 'C01');
    
    
    //자주 찾는 민원, 주요민원, 통합민원
    var minwonB04 = [authBasicApplicationPage, detailB04, summaryStep];  // 명의변경
    var minwonB14 = [authBasicApplicationPage, detailB14, summaryStep];  // 자동납부
    var minwonB14_1 = [authBasicApplicationPage, detailB14_1, summaryStep];  // 자동납부
    var minwonB19 = [authBasicApplicationPage, detailB19, summaryStep];  // 전자고지
    var minwonB19_1 = [authBasicApplicationPage, detailB19_1, summaryStep];  // 전자고지
    var minwonB25 = [authBasicApplicationPage, detailB25, summaryStep];  // 수도요금 바로 알림
    //자주 찾는 민원, 주요민원
    var minwonB01 = [basicApplicationPage, detailB01, summaryStep];  // 상하수도 누수요금 감면 신청
    var minwonA02 = [basicApplicationPage, detailA02, summaryStep];  // 수도계량기 교체 신청
    //주요민원
    var minwonA04 = [basicApplicationPage, detailA04, summaryStep];  // 급수불편 해소 신청
    var minwonB05 = [basicApplicationPage, detailB05, summaryStep];  // 급수설비 폐지
    var minwonA05 = [basicApplicationPage, detailA05, summaryStep];  // 옥내누수
    var minwonA06 = [suyongaJusoApplicationPage, detailA06, summaryStep];  // 옥외누수
    //요금민원
    var minwonB02 = [basicApplicationPage, detailB02, summaryStep];  // 급수업종 변경 신고
    var minwonI06 = [basicApplicationPage, detailI06, summaryStep];  // 급수중지(해제) 신청
    var minwonB08 = [basicApplicationPage, detailB08, summaryStep];  // 정수처분 해제 신청
    var minwonB09 = [basicApplicationPage, detailB09, summaryStep];  // 수도계량기 검정시험 신청
    var minwonB10 = [basicApplicationPage, detailB10, summaryStep];  // 과오납금반환 청구
    var minwonI12 = [basicApplicationPage, detailI12, summaryStep];  // 세대분할 신고
    var minwonB13 = [authBasicApplicationPage, detailB13, summaryStep];  // 신·구 소유자(사용자)사용요금 분리 신고
    var minwonB15 = [basicApplicationPage, detailB15, summaryStep];  // 검침일 안내 서비스 신청
    var minwonB18 = [basicApplicationPage, detailB18, summaryStep];  // 수도요금 청구지 주소변경 신청
    var minwonB20 = [basicApplicationPage, detailB20, summaryStep];  // 상하수도요금 이의신청
    var minwonB23 = [basicApplicationPage, detailB23, summaryStep];  // 시각장애인 요금 안내 서비스 신청
    var minwonB24 = [basicApplicationPage, detailB24, summaryStep];  // 자가검침 신청(신규, 변경, 해지)
    var minwonB27 = [basicApplicationPage, detailB27, summaryStep];  // 고지서재발급 신청
    
    //공사민원
    var minwonA01 = [suyongaJusoApplicationPage, detailA01, summaryStep];  // 급수공사 신청
    var minwonI10 = [authBasicApplicationPage, detailI10, summaryStep];  // 수도계량기 및 상수도관 이설 신청
    var minwonA07 = [basicApplicationPage, detailA07, summaryStep];  // 수질검사
    var minwonA08 = [noSuyongaApplicationPage, detailA08, summaryStep];  // 포장도로 복구
    var minwonA09 = [noSuyongaApplicationPage, detailA09, summaryStep];  // 돌발 누수사고 피해보상
    var minwonA11 = [basicApplicationPage, detailA11, summaryStep];  // 직결급수 신고
    var minwonA12 = [authBasicApplicationPage, detailA12, summaryStep];  // 옥내급수관 진단 상담
    var minwonA13 = [a13ApplicationPage, detailA13, summaryStep];  // 옥내급수관 공사비 지원 신청
    var minwonA14 = [a14ApplicationPage, '', ''];  // 옥내급수관 공사비 지급 요청
    //기타
    var minwonC01 = [noSuyongaApplicationPage, detailC01, summaryStep]; // 기타민원(질의, 건의, 고충)
    
    //통합민원 4
    this.addMinwon('B04', minwonB04);
    this.addMinwon('B14', minwonB14);
    this.addMinwon('B14_1', minwonB14_1);
    this.addMinwon('B19', minwonB19);
    this.addMinwon('B19_1', minwonB19_1);
    this.addMinwon('B25', minwonB25);
    //자주 찾는 민원, 주요민원 2
    this.addMinwon('B01', minwonB01);
    this.addMinwon('A02', minwonA02);
    //주요민원 4
    this.addMinwon('A04', minwonA04);
    this.addMinwon('B05', minwonB05);
    this.addMinwon('A05', minwonA05);
    this.addMinwon('A06', minwonA06);
    //요금민원 13
    this.addMinwon('B02', minwonB02);
    this.addMinwon('I06', minwonI06);
    this.addMinwon('B08', minwonB08);
    this.addMinwon('B09', minwonB09);
    this.addMinwon('B10', minwonB10);
    this.addMinwon('I12', minwonI12);
    this.addMinwon('B13', minwonB13);
    this.addMinwon('B15', minwonB15);
    this.addMinwon('B18', minwonB18);
    this.addMinwon('B20', minwonB20);
    this.addMinwon('B23', minwonB23);
    this.addMinwon('B24', minwonB24);
    this.addMinwon('B27', minwonB27);
    //공사민원 8
    this.addMinwon('A01', minwonA01);
    this.addMinwon('I10', minwonI10);
    this.addMinwon('A07', minwonA07);
    this.addMinwon('A08', minwonA08);
    this.addMinwon('A09', minwonA09);
    this.addMinwon('A11', minwonA11);
    this.addMinwon('A12', minwonA12);
    this.addMinwon('A13', minwonA13);
    this.addMinwon('A14', minwonA14);
    //기타 1
    this.addMinwon('C01', minwonC01);
  }
  
  retsetUnityMinwon(gubun:string) {
    //민원 신청 내역 초기화 후 UnityMinwon 초기화
    this.state.registeredMinwons.forEach(element => {
      this.state.steps[element].step[1].setInitValue();
    });
    if(gubun === "reset"){
      //applicationPage 초기화
//      this.state.steps[this.state.minwonCd].step[0].reset();
      Object.values(this.state.steps).forEach((minwon:any) => {
        if(minwon.step[0].reset){
          minwon.step[0].reset();
        }
      });
    }
    //infoPanel 초기화
    this.state.summaryPage.resetSummary();
    this.setState({
      ...this.state,
      currentPage: null,
      minwonCd: '',
      registeredMinwons: [],
      page: 0,
      applicationPage: null,
//      summaryPage: null,
    });
    //resultPage info 초기화
    this.state.parent.state.resultPage.reset();
  }

  goMinwon(minwonCd: string) {
    const applicationPage = this.state.steps[minwonCd].step[0];
    this.setState({
      ...this.state,
      minwonCd: minwonCd,
      applicationPage: applicationPage
    });
    //sessionStorage 세션 데이터 확인
    const sessionData = CyberMinwonStorage.getStorageData();
    if(sessionData && minwonCd !== "A14"){
      applicationPage.reset();
      const suyongaInfoCheck = applicationPage.suyongaInfo || null;
      const mkey = sessionData.mkey;
      if(suyongaInfoCheck && mkey){
        
        applicationPage.suyongaInfo.setState({
          ...applicationPage.suyongaInfo.state,
          suyongaInfo : {
            ...applicationPage.suyongaInfo.state.suyongaInfo,
            suyongaNumber : mkey,
            mkey : mkey
          }
        });
      }
      let authInfo = applicationPage.authenticationInfo3 || null;
      if(authInfo && sessionData.authenticationInfo){
        authInfo.state = sessionData.authenticationInfo;
        authInfo.executePosAuthentication(authInfo.state.authInfo);
      }
      if(sessionData.applicantInfo){
        applicationPage.applicantInfo.state.applyInfo = sessionData.applicantInfo;
      }
      applicationPage.state.privacyAgree = sessionData.privacyAgree;
      applicationPage.state.smsAgree = sessionData.smsAgree;
    }
    const curPage = this.state.page;
    const curModule = this.state.parent.state.currentModule;
    const curName = curModule.constructor.name;
    const resultChk = this.state.parent.state.resultPage.infoPanels.length > 0?true:false;
    if((curPage === 1 || curPage === 2) && !resultChk){
      citizenConfirm("신청(등록) 중의 내용이 지워집니다.<br />다른 화면으로 이동할까요?").then(result => {
        if(result){
          //이전 신청 내용 리셋 후 이동
          this.retsetUnityMinwon("go");
          this.setPage(0, minwonCd);
          this.addApplicationPage(this.state.steps[minwonCd].step[0]);
        }else{
          return false;
        }
      });
    }else if(sessionData && resultChk){
      this.retsetUnityMinwon("go");
      if(sessionData.authenticationInfo && (minwonCd === "B04" || minwonCd === "B14" || minwonCd === "B19" || minwonCd === "B25")){
        this.setPage(0, minwonCd);
        this.addApplicationPage(applicationPage);
      }else{
        this.setPage(0, minwonCd);
        this.addApplicationPage(applicationPage);
      }
    }else{
//      this.retsetUnityMinwon("go");
      this.setPage(0, minwonCd);
      this.addApplicationPage(this.state.steps[minwonCd].step[0]);
    }
//    this.setPage(0, minwonCd);
//    this.addApplicationPage(this.state.steps[minwonCd].step[0]);
  }

  addSummaryPage(page: any) {
    this.setState({
      ...this.state,
      summaryPage: page
    });
  }

  addApplicationPage(page: any) {
    this.setState({
      ...this.state,
      applicationPage: page
    });
  }

  // 민원 제목을 설정한다.
  setTitle() {
    if(this.state.minwonCd != 'A14'){
      document.getElementById('minwonNm').innerText =
        this.state.steps[this.state.minwonCd].step[1].state.description.minwonNm;
      document.getElementById('minwonDesc').innerText =
        this.state.steps[this.state.minwonCd].step[1].state.description.minwonDfn.replaceAll('\/', '')
    }else{
      document.getElementById('minwonNm').innerText =
        this.state.steps[this.state.minwonCd].step[0].state.description.minwonNm
    }
    if(this.state.minwonCd === "A13"){
      document.getElementById('minwonDesc').insertAdjacentHTML('beforeend','<br>! 공사비 지원은 최근 2년 이내, 옥내급수관 진단 상담 결과 "공사비 지원 가능"으로 안내 된 수용가에서 신청할 수 있습니다.');
    }else if(this.state.minwonCd === "B14" || this.state.minwonCd === "B14_1"){
      document.getElementById('minwonDesc').insertAdjacentHTML('beforeend','<br><span class="txRed">※ 자동납부 신청 민원은 전자금융감독규정에 따라 전자서명 인증 후 신청가능합니다.</span>');
    }
  }

  // 민원 셋을 추가한다.
  addMinwon(minwonCd: string, minwon: any) {
    this.setState({
      ...this.state,
      steps: {
        ...this.state.steps,
        [minwonCd]: {
          step: minwon,
        }
      },
    });
  }

  submitMinwon(e: any) {
    // 민원 신청 로직 진행
    $(".contents-mw").append('<div class="Modal"></div>');
    $(".Modal").append('<div><h1 style="color: white; font-size: 24px;">신청 처리중..</h1></div>');
//    e.preventDefault();
    // 처리중

    // 현재 데이터가 입력되어 있는 민원들을 확인한다.
    //전자서명 여부 확인
    if((this.state.minwonCd == 'B14' || this.state.minwonCd == 'B14_1') && !this.state.summaryPage.authenticationInfo.state.isAuthenticated){
      $(".Modal").remove();
      citizenAlert('전자서명(본인확인·본인인증)이 필요합니다.').then(result => {
        if(result){
          return false
        }
      });
      return false;
    }
//    // 신청에 필요한 모든 데이터가 입력되어 있는지를 민원별로 확인한다.
    this.state.registeredMinwons.forEach(element => {
      if (!this.state.steps[element].step[1].verify()) {
        return false;
      }
      
      if(element == 'B14_1' || element == 'B19_1'){
        return false;
      }else{
        
        submitOnce(this.state.steps[element].step[1].submitApplication());
      }
    });
    // 문제가 있는 부분이 있으면 중간에 신청 프로세스를 멈추어야 한다.
    // 등록된 민원을 순차적으로 처리를 서버로 요청한다.
    // 기존 setResult에서 결과페이지 호출 시 통합민원 다건인 경우 여러 번 호출하여 결과페이지 호출 시점 변경
    this.goResult();
  }
  
  goResult() {
    const legMinwons = this.state.registeredMinwons;
    const curMinwon = this.state.minwonCd;
    if(legMinwons.length !== 0 && legMinwons.length === 1){
      
    }
    // 신청 결과 데이터가 있는지 확인. 
    let resultCheck = this.state.registeredMinwons.find(minwon => {
      const data = this.state.steps[minwon].step[1].state.submitResult;
      return Object.keys(data).length <= 0;
    });
    if(typeof resultCheck !== 'undefined'){
      return false;
    }
    //고객번호로 오늘 신청한 민원 조회
    const url = `${gContextUrl}/citizen/common/selectMyMinwon.do`;
    let formData = new FormData();
    const applicationPage = this.state.steps[curMinwon].step[0];
    let mkey = '';
    if(applicationPage.suyongaInfo){
      mkey = applicationPage.suyongaInfo.state.suyongaInfo.mkey;
    }
    let applyName = applicationPage.applicantInfo.state.applyInfo.applyName;
    let applyMobile = applicationPage.applicantInfo.state.applyInfo.applyMobile;
    formData.append('mkey',mkey);
    formData.append('applyName',applyName);
    formData.append('applyMobile',applyMobile);
    
    const cyberMinwon = this.state.parent;
    cyberMinwon.setState({
      ...cyberMinwon.state,
      currentModule: cyberMinwon.state.resultPage
    });
    
    // 10분 타이머 설정
    CyberMinwonStorage.expirySessionData(this.state.parent,600000,true,'reset');
    $(".Modal").remove();
  }

  buttonDisplay() {
    const minwonCd = this.state.minwonCd;
    const page = this.state.page;
    $("#prev").show();
    $("#next").show();
    $("#summaryPage").hide();
    $("#btnCvplApply").hide();

    if (page === 0) {
      if (minwonCd === 'A14') {
        $("#prev").hide();
        $("#next").hide();
        $("#summaryPage").hide();
        $("#btnCvplApply").hide();
        $("#cancel").hide();
//        let btnTemplate = `
//          <button type="button" class="btn btnM btnWL" id="home" onclick="cyberMinwon.goFront()">첫화면으로 가기</button>
//        `;
//        document.getElementById('btnSet')!.innerHTML = btnTemplate;
      } else {
        $("#prev").hide();
        $("#summaryPage").hide();
      }
    }

    // 마지막 단계
    if (page === this.state.steps[minwonCd].step.length - 1) {
        $("#next").hide();
        $("#summaryPage").hide();
        $("#btnCvplApply").show();
    }

    // 마지막 직전 단계
    if(this.state.page !== 0 && this.state.page === this.state.steps[this.state.minwonCd].step.length - 2) {
      $("#prev").show();
      $("#next").hide();
      $("#summaryPage").show();
    }
  }

  setState(nextState: any) {
    this.state = nextState;
  }
  
  setEventListeners() {
    const minwonCd = this.state.minwonCd;
    if(minwonCd !== "A14"){
      
    }
  }
  
  setPage(page: any, minwonCd: string) {
    minwonCd = minwonCd || this.state.minwonCd;
    const beforePage = this.state.page;
    const applicationPage = this.state.steps[minwonCd].step[0];
    // 페이지 전환시 키패드 모듈이 활성화 되어 있는 경우는 close 한다.
    closeKeypad();
    const hostName = location.hostname;
    // 페이지가 이상한 경우는 처리하지 않는다.
    if (!(page < 0 || page >= this.state.steps[minwonCd].length)) {
      // authentication check B13, B14, B19외 인증 제외
      // 본인확인 추가 I10, A12, A01
      if (page === 1 && beforePage === 0) {
        if ((minwonCd === 'B13' || minwonCd === 'B19'
             || minwonCd === 'A01' || minwonCd === 'I10' || minwonCd === 'A12' || minwonCd === 'A13') 
            && !applicationPage.authenticationInfo3.state.isAuthenticated ) {
          if(hostName === "localhost" || applicationPage.authenticationInfo3.state.isAuthenticated){
//            return true;
          }else{
            citizenAlert('본인확인·본인인증이 필요합니다.');
            return false;
          }
        }
//        else if(minwonCd === 'B14' && !applicationPage.authenticationInfo.state.isAuthenticated){
//          citizenAlert('본인확인·본인인증이 필요합니다.');
//          return false;
//        }
        
        if(!applicationPage.verify()){
          return false;
        }
        //page 0 -> page 1인 경우에만 sessionStorage 저장
        if(beforePage === 0){ 
          //이전 세션스토리지 삭제 후 저장
          const sessionData = CyberMinwonStorage.getStorageData();
          let sessionAuth = null;
          let sessionMkey = '';
          if(sessionData){
            sessionAuth = sessionData.authenticationInfo || null;
            sessionMkey = sessionData.mkey || '';
            CyberMinwonStorage.clear();
          }
          //고객번호 확인
          const suyongaInfo = applicationPage.suyongaInfo || null;
          let mkey = "";
          if(suyongaInfo){
            mkey = suyongaInfo.state.suyongaInfo.mkey || null;
            if(suyongaInfo.payMentInfo){
              CyberMinwonStorage.setStoragePay(suyongaInfo.payMentInfo);
            }
          }
          const authInfo = applicationPage.authenticationInfo3 || null;
          const applicantInfo = applicationPage.applicantInfo.state.applyInfo;
          const privacyAgree = applicationPage.state.privacyAgree;
          const smsAgree = applicationPage.state.smsAgree;
          const paramAuth = authInfo?authInfo.state : sessionAuth?sessionAuth:'';

          CyberMinwonStorage.setStorageData("Y", mkey?mkey:sessionMkey, paramAuth, applicantInfo, privacyAgree, smsAgree);
          CyberMinwonStorage.expirySessionData(this.state.parent,1800000,true,'reset');
        }
        if(page === 1 && (minwonCd === "B04" || minwonCd === "B14" || minwonCd === "B14_1" || minwonCd === "B19" || minwonCd === "B19_1" || minwonCd === "B25")){
          //통합민원의 경우 고객번호로 해당민원의 요금쪽 조회 함수 호출 후 페이지 전환 
          if(this.state.steps[minwonCd].step[1].setInitCheck){
            this.state.steps[minwonCd].step[1].setInitCheck();
          }
        }
      }

      this.setState({
        ...this.state,
        currentPage: this.state.steps[minwonCd].step[page],
        page,
        minwonCd
      });
      this.render();
      this.setTitle();
      const linkCall = $('#linkCall').val()
      const linkMKey = $('#mKey').val()
      if(minwonCd !== 'A14'){
        if(page === 0 && CyberMinwonStorage){
          const sessionData = CyberMinwonStorage.getStorageData();
          if(sessionData){
            const mkey = sessionData.mkey || null;
            if(mkey && applicationPage.suyongaInfo && 
               !applicationPage.suyongaInfo.jusoTarget){
              applicationPage.suyongaInfo.state.setPageSuyongSearch = true;
              applicationPage.suyongaInfo.handleSuyongSearch(minwonCd);
            }else if(mkey && applicationPage.suyongaInfo && minwonCd === 'A01'){
              this.state.steps[minwonCd].step[0].suyongaInfo.setState({
                ...this.state.steps[minwonCd].step[0].suyongaInfo.state,
                suyongaInfo : {
                  ...this.state.steps[minwonCd].step[0].suyongaInfo.state.suyongaInfo,
                  suyongaNumber : mkey,
                  mkey : mkey
                }
              });
              this.state.steps[minwonCd].step[0].suyongaInfo.render();
            }
          }else if(linkCall == 'Y' && minwonCd == 'B14' && linkMKey){
            CyberMinwonStorage.setStorageData('Y',linkMKey,'','',false,false)
            this.state.steps[minwonCd].step[0].suyongaInfo.setState({
                ...this.state.steps[minwonCd].step[0].suyongaInfo.state,
              suyongaInfo : {
                ...this.state.steps[minwonCd].step[0].suyongaInfo.state.suyongaInfo,
                suyongaNumber : linkMKey,
                mkey : linkMKey
              }
            });
            applicationPage.suyongaInfo.state.setPageSuyongSearch = true;
            applicationPage.suyongaInfo.handleSuyongSearch(minwonCd);
          }
        }
      }
    }else{
      citizenAlert('화면 오류입니다. 첫 화면으로 이동합니다.').then(result => {
        if(result){
          const userKey = $("#userKey");
          window.location.href = "/citizen/common/nCitizenCivilList.do?userKey=" + userKey;
        }
      });
    }
    
    //window.scrollTo(0,0);
    $("#focusArea").attr("tabindex", -1).focus();
  }
  
  registerMinwon(page: any, minwonCd: string) {
    let regMins = this.state.registeredMinwons;
    minwonCd = minwonCd || this.state.minwonCd;
    const applicationPage = this.state.steps[minwonCd].step[0];
    // 페이지 전환시 키패드 모듈이 활성화 되어 있는 경우는 close 한다.
    closeKeypad();   

    // 현재 페이지가 범위에서 벋어난지 확인
    if (!(page < 0 || page >= this.state.steps[minwonCd].length)) {
      //신청 내용 입력 후 확인 및 등록 버튼 클릭 전 유효성 검증 호출 regMins.includes(minwonCd) && 
      if (page === 2 && !this.state.steps[minwonCd].step[1].verify()) {
        return false;
      }
      if (regMins.length === 0) {
        regMins = [minwonCd];
        this.state.summaryPage.infoPanels = [
          new InfoPanel('신청 정보', this, this.state.steps[minwonCd].step[0], 'getViewInfo'),
          new InfoPanel(this.state.steps[minwonCd].step[1].state.description.minwonNm,
            this, this.state.steps[minwonCd].step[1], 'getViewInfo')
        ]
      }
      // B14는 페이지 전환 시에 특별한 처리가 필요하다. 
      if (minwonCd === 'B14' || (minwonCd === 'B10'&& this.state.steps[this.state.minwonCd].step[1].state.requestInfo.returnWay == '계좌이체')) {
          this.state.steps[this.state.minwonCd].step[1].saveEncryptedAccountNumber();
      }
      
      // 모든 민원에 대한 후처리로직을 일괄적용하는 게 필요할 수도 있다.

      this.setState({
        ...this.state,
        currentPage: this.state.steps[minwonCd][page],
        registeredMinwons: [
          ...regMins,
        ],
        page,
        minwonCd
      });
      this.render();
    }
  }
  
  //사업소 연락처 팝업 호출
  callJsDeptTelPop(){
    jsDeptTelPop();
  }
  render() {
    let template = `
      <form>
        <div class="form-m-wrap row">
          <div class="mw-box bgStrong">
            <h2 class="txWhite"><span class="i-99" id="minwonNm"></span></h2>
            <div class="info-alert" id="minwonDesc">
              이사 통합민원은 <span class="txStrongColor">소유자(사용자)명의변경 신고, 자동납부(계좌) 신규/해지, 수도요금 문자알림 신규/변경/해지, 전자고지
                신규/변경/해지</span> 의 4가지 민원으로 한번에 신청할 수 있습니다.
            </div>
          </div><!-- //mw-box -->


          <div id="minwonRoot">

          </div>

          <!-- 버튼영역 -->
          <div class="form-btn-wrap row" id="btnSet">
            <button type="button" class="btn btnM btnWL" id="prev" title="이전단계"
              onClick="cyberMinwon.state.currentModule.setPage(cyberMinwon.state.currentModule.state.page-1)">이전단계</button>
            <button type="button" class="btn btnM btnWL" id="next" title="다음단계"
              onClick="cyberMinwon.state.currentModule.setPage(cyberMinwon.state.currentModule.state.page+1)">다음단계</button>
            <button type="button" class="btn btnM btnWL" id="summaryPage" title="확인 및 등록"
              onClick="cyberMinwon.state.currentModule.registerMinwon(cyberMinwon.state.currentModule.state.page+1)">확인 및 등록</button>
            <button type="button" class="btn btnM btnWL" id="btnCvplApply" title="민원신청"
              onClick="cyberMinwon.state.currentModule.submitMinwon(event)">민원신청</button>
            <button type="button" class="btn btnM btnDGray btnWM" id="cancel" onclick="cyberMinwon.goCancel();" title="신청취소">취소</button>

          </div><!-- //form-btn-wrap -->

        </div><!-- /form-mw-wrap -->
      </form>
      <div class="satisfaction">
        <!-- 본부일경우 -->
          <!-- 본부가 아닐경우 -->
            <h3 class="skip">담당자 정보</h3>
            <div class="manager_info">
              <ul class="clearfix">
                <li><span>정보제공부서&nbsp;:&nbsp;</span>각 수도사업소</li>
                <!-- <li><span>담당&nbsp;:&nbsp;</span>행정지원과</li>  -->
                <li>
                  <span>문의&nbsp;:&nbsp;</span>
                  <a href="#" onclick="cyberMinwon.state.currentModule.callJsDeptTelPop()" title="담당부서연락처 새창열림"
                      style="border:1px solid #ccc; padding: 0px 5px; padding-right: 6px; font-size: 11px; display: inline-block; font-family: 'Nanum Gothic', sans-serif;
                      background: no-repeat right center #fff;">담당부서연락처</a>
                </li>
              </ul>
            </div>
      </div>
    `;

    this.state.target.innerHTML = template;
    this.buttonDisplay();
    this.state.steps[this.state.minwonCd].step[this.state.page].render();
    this.setEventListeners();
  }
}