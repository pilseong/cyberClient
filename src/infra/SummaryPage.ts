import InfoPanel from "../components/InfoPanel";
import AthenticationInfo from '../components/AuthenticationInfo2';
import { addMW, citizenAlert, citizenConfirm } from '../util/uiux-common';
declare var $: any;

export default class SummaryPage {
  state: {
    parent: any;
  }
  authenticationInfo: AthenticationInfo;
  infoPanels: InfoPanel[];
  path: string;
  parentPath: string;
  unityMinwons : any;
  
  constructor(parent: any) {
    this.state = {
      parent,
    }
    this.infoPanels = [];
    this.authenticationInfo = new AthenticationInfo(this);
    this.path = 'cyberMinwon.state.currentModule.state.summaryPage';
    this.parentPath = 'cyberMinwon.state.currentModule';
  }
  
  resetSummary(){
    this.infoPanels = [];
    this.authenticationInfo = new AthenticationInfo(this);
  }
  
  render() {
    const that = this;
    const minwonCd = that.state.parent.state.minwonCd;
    let template = `
      <!-- 신청내용 -->
      <div class="mw-box">
      <div id="form-mw21" class="row">
        <div class="tit-mw-h3">
          <a href="javascript:void(0);" onClick="toggleLayer('#form-mw21');" title="닫기">
            <span class="i-01">민원신청내역</span>
          </a>
        </div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
              <ul id="summary" class="result-box">
              </ul>
          </div>
        </div><!-- //form-mw-box -->
      </div><!-- //form-mw21 -->
      </div><!-- //mw-box -->
    `;
    /*
    */
    if(minwonCd === "B14" || minwonCd === "B14_1"){ //minwonCd === "B14" ||
      
      template += `
        <!-- 전자서명 -->      
        <div class="mw-box" id="authentication"></div>
      `;
    }
    // 실제로 화면을 붙여준다.
    document.getElementById('minwonRoot')!.innerHTML = template;

    const renderedInfoPanels = this.infoPanels.map(function(node) {
      return node.render();
    }).join('');

    const $target = document.getElementById('summary');
    $target!.innerHTML += renderedInfoPanels;
    this.afterRender();
  }
  
  afterRender() {
    const that = this;
//    console.log(this.state.parent);
    const minwonCd = that.state.parent.state.minwonCd;
    const $minwonNm = document.getElementById('minwonNm');
    $minwonNm!.innerText = 
      this.state.parent.state.steps[this.state.parent.state.minwonCd].step[1].state.description.minwonNm;
    const $minwonDesc = document.getElementById('minwonDesc');
    $minwonDesc!.innerText =
      this.state.parent.state.steps[this.state.parent.state.minwonCd].step[1].state.description.minwonDfn.replaceAll('\/', '');
    /*
    */
    if(minwonCd === "B14" || minwonCd === "B14_1"){//minwonCd === "B14" || 
        this.authenticationInfo.render();
    }
  }
}