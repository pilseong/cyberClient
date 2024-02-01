import FrontPage from "../infra/FrontPage";
import ResultPage from '../infra/ResultPage';
import UnityMinwon from "./UnityMinwon";
import InfoPanel from "../components/InfoPanel";
import { citizenConfirm, citizenAlert } from '../util/uiux-common';
import CyberMinwonStorage from '../infra/StorageData';
declare var $: any;

// 전체를 관리하는 최상위 컴포넌트
export default class CyberMinwon {

  state: {
    target: any;
    currentUrl: string;
    currentModule: any;
    frontPage: FrontPage;
    resultPage: ResultPage;
    unityMinwon: UnityMinwon;
  }

  constructor(currentUrl: string, $app: any) {
    const frontPage = new FrontPage(this, $app);
    const unityMinwon = new UnityMinwon(this, $app);
    const resultPage = new ResultPage(this, $app);
    
    this.state = {
      target: $app,
      currentUrl,
      currentModule: frontPage,
      frontPage,
      resultPage,
      unityMinwon
    };
    this.setMinwonData();
  }
  
  setResult(title: string, owner: any, callbackName: string) {
    // 이전에 등록된 패널이 있으면 등록하지 않는다.
    if (this.state.resultPage.infoPanels.filter(panel => panel.owner === owner).length === 0) {
      this.state.resultPage.infoPanels.push(new InfoPanel(title, this, owner, callbackName));
    }
//    this.goResult(); 
  }
  
  setMinwonData(){
    for(const minwonCd in this.state.unityMinwon.state.steps){
      if(minwonCd !== "A14"){
        this.state.unityMinwon.state.steps[minwonCd].step[1].getDescription(this.getFrontMinwonData(minwonCd.length>3?minwonCd.substring(0,3):minwonCd));
      }else{
        this.state.unityMinwon.state.steps[minwonCd].step[0].getDescription(this.getFrontMinwonData(minwonCd));
      }
    }
  }
  
  getFrontMinwonData(minwonCd : string){
    return this.state.frontPage.state.minwonInfo.find((minwon: any) => minwon.minwonCd === minwonCd);
  }

  goMinwon(minwonCd: string) {
	  /*
    if(minwonCd == "A12"){
      citizenAlert("옥내급수관 진단 상담 신청 민원은 서비스 준비중에 있습니다. 관할지역 수도사업소에 문의하여 주시기 바랍니다.");
      return false;
    }
    if(minwonCd == "A13"){
      citizenAlert("옥내급수관 공사비 지원 신청 민원은 서비스 준비중에 있습니다. 관할지역 수도사업소에 문의하여 주시기 바랍니다.");
      return false;
    }
    */
    let logParam = "";
    const recSec = $('#recSec').val()
    const linkCall = $("#linkCall").val()

    if (minwonCd === 'B03') {
      const B03Url = 'https://minwon.seoul.go.kr/icisuser/minwon/info.do?mwnId=1472805362618';
      window.open(B03Url);
      logParam = `?url=${B03Url}&menu1=citizenPayProof&menu2=${minwonCd}&gubun=citizen`;
    } else {
      let minwonData:any = {}; 
      if(minwonCd == "B14_1" || minwonCd == "B19_1"){
        minwonData = this.state.unityMinwon.state.steps[minwonCd].step[1].state.description; 
        logParam = `?url=cyberMinwon.goMinwon(${minwonCd})&menu1=citizen${minwonCd}Detail&menu2=${minwonCd}&recSec=${recSec}&gubun=citizen`;
      }else if(minwonCd != "A14"){
        minwonData = this.state.unityMinwon.state.steps[minwonCd].step[1].state.description; 
        logParam = `?url=cyberMinwon.goMinwon(${minwonCd})&menu1=citizen${minwonCd}Detail&menu2=${minwonCd}&recSec=${recSec}&gubun=citizen`;
      }
      this.setState({
        ...this.state,
        currentModule: this.state.unityMinwon
      });
      this.state.unityMinwon.goMinwon(minwonCd);
    }
    if(minwonCd != "A14" && linkCall != 'Y'){
      this.setMinwonLog(logParam);
    }
  }
  
  goUnityMinwon(minwonCd: string) {
    let logParam = "";
    let minwonData:any = {}; 
    minwonData = this.state.unityMinwon.state.steps[minwonCd].step[1].state.description; 
    logParam = `?url=cyberMinwon.goMinwon(${minwonCd})&menu1=citizen${minwonCd}Detail&menu2=${minwonCd}&gubun=citizen`;
    this.setMinwonLog(logParam);
    this.state.unityMinwon.goMinwon(minwonCd);
  }
  
  setMinwonLog(logParam: string){
    let urlParam = "citizenMenuOpen.do";
    fetch(urlParam+logParam);
  }
  
  goList(){
    this.pageCheck().then(result => {
      if(result){
        this.state.frontPage.handleAllList()
        this.setState({
          ...this.state,
          currentModule: this.state.frontPage
        });
        let logParam = `?url=cyberMinwon.goList&menu1=goList&menu2=list&gubun=citizen`;
        this.setMinwonLog(logParam);
      }
    });
  }

  goFront() {
    this.pageCheck().then(result => {
      if(result){
        this.state.frontPage.handleKeywordReset();
        this.setState({
          ...this.state,
          currentModule: this.state.frontPage
        });
      }
    });
  }
  
  async pageCheck(){
    const sessionData = CyberMinwonStorage.getStorageData();
    const curPage = this.state.unityMinwon.state.page;
    //결과 페이지인지 확인
    const resultChk = this.state.resultPage.infoPanels.length > 0?true:false;
    if(sessionData && (curPage === 1 || curPage === 2) && !resultChk){
      return await citizenConfirm("신청(등록) 중의 내용이 지워집니다.<br />다른 화면으로 이동할까요?").then(result => {
        if(result){
          //이전 신청 내용 리셋?
          this.state.unityMinwon.retsetUnityMinwon("");
          return true;
        }else{
          return false;
        }
      });
    }else{
      return true;
    }
  }
  
  goCancel() {
    const userKey = $("#userKey").val();
    citizenConfirm("신청내용을 취소하시겠습니까?").then(result => {
      if(result){
        CyberMinwonStorage.clear();
        this.state.unityMinwon.retsetUnityMinwon("reset");
        window.location.href = "/citizen/common/nCitizenCivilList.do?userKey=" + userKey;
      }
    });
  }
  
  goResult() {
    this.setState({
      ...this.state,
      currentModule: this.state.resultPage
    });
  }
  
  goResultSearch(receiptNo: string) {
    const hostName = location.hostname;
    const referrer = document.referrer;
    const detailPath = `/cs/cyber/front/cvplsvc/NR_civilStateSearch.do?_m=m2_2`
    const resultSearch = `citizenResultSearch.do?receiptNo=${receiptNo}`
    window.localStorage.setItem('receiptNo',receiptNo)
    if(hostName === 'localhost' || !referrer){
      window.open(resultSearch);
    }else{
      window.open(`${referrer}${detailPath}`);
    }
  }
  
  setCurrentUrl(url: string, userKey: string, minwonCd: string) {
    window.location.href = "/citizen/common/" + url + ".do?userKey=" + userKey + "&minwonCd=" + minwonCd;

    this.setState({
      ...this.state,
      currentUrl: url
    });

    this.render();
  }

  setState(newState: any) {
    if (this.state !== newState) {
      this.state = newState;
      if (!(newState.currentModule === this.state.unityMinwon && 
           !newState.currentModule.state.minwonCd)) {
        this.render();
      }
    }
  }

  render() {
    this.state.currentModule.render();
  }
}