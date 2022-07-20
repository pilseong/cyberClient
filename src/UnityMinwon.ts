// 페이지 전체를 관리 하는 어플리케이션
import InfoPanel from './util/InfoPanel';
import BasicApplicationPage from './front/BasicApplicationPage';
import NoSuyongaApplicationPage from './front/NoSuyongaApplicationPage';
import A13ApplicationPage from './front/A13ApplicationPage';
import SummaryPage from './util/SummaryPage';
import B04DetailPage from './content/B04Detail';
import B14DetailPage from './content/B14Detail';
import B19DetailPage from './content/B19Detail';
import B25DetailPage from './content/B25Detail';
import A08DetailPage from './content/A08Detail';
import A12DetailPage from './content/A12Detail';
import A13DetailPage from './content/A13Detail';

declare var $: any;
declare var document: any;

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

    const basicApplicationPage = new BasicApplicationPage(this);
    const a13ApplicationPage = new A13ApplicationPage(this);
    const noSuyongaApplicationPage = new NoSuyongaApplicationPage(this);

    var summaryStep = new SummaryPage(this);
    this.addSummaryPage(summaryStep);

    var detailB04 = new B04DetailPage(this, 'B04');
    var detailB14 = new B14DetailPage(this, 'B14');
    var detailB19 = new B19DetailPage(this, 'B19');
    var detailB25 = new B25DetailPage(this, 'B25');
    // var detailB01 = new B01DetailPage(this, 'B01');
    // var detailA02 = new A02DetailPage(this, 'A02');
    // var detailA04 = new A04DetailPage(this, 'A04');
    // var detailA05 = new A05DetailPage(this, 'A05');
    // var detailA06 = new A06DetailPage(this, 'A06');
    // var detailA07 = new A07DetailPage(this, 'A07');
    var detailA08 = new A08DetailPage(this, 'A08');
    // var detailA09 = new A09DetailPage(this, 'A09');
    var detailA12 = new A12DetailPage(this, 'A12');
    var detailA13 = new A13DetailPage(this, 'A13');
    // var detailB05 = new B05DetailPage(this, 'B05');

    var minwonB04 = [basicApplicationPage, detailB04, summaryStep];  // 명의변경
    var minwonB14 = [basicApplicationPage, detailB14, summaryStep];  // 자동납부
    var minwonB19 = [basicApplicationPage, detailB19, summaryStep];  // 전자고지
    var minwonB25 = [basicApplicationPage, detailB25, summaryStep];  // 수도요금 바로 알림
    // var minwonB01 = [basicApplicationPage, detailB01, summaryStep];  // 상하수도 누수요금 감면 신청
    // var minwonA02 = [basicApplicationPage, detailA02, summaryStep];  // 수도계량기 교체 신청
    // var minwonA04 = [basicApplicationPage, detailA04, summaryStep];  // 수도계량기 교체 신청
    // var minwonA05 = [basicApplicationPage, detailA05, summaryStep];  // 옥내누수
    // var minwonA06 = [basicApplicationPage, detailA06, summaryStep];  // 옥외누수
    // var minwonA07 = [basicApplicationPage, detailA07, summaryStep];  // 수질검사
    var minwonA08 = [noSuyongaApplicationPage, detailA08, summaryStep];  // 포장도로 복구
    // var minwonA09 = [noSuyongaApplicationPage, detailA09, summaryStep];  // 돌발 누수사고 피해보상
    var minwonA12 = [basicApplicationPage, detailA12, summaryStep];  // 옥내급수관 진단 상담
    var minwonA13 = [a13ApplicationPage, detailA13, summaryStep];  // 옥내급수관 공사비 지원  상담
    // var minwonB05 = [basicApplicationPage, detailB05, summaryStep];  // 급수설비 폐지

    this.addMinwon('B04', minwonB04);
    this.addMinwon('B14', minwonB14);
    this.addMinwon('B19', minwonB19);
    this.addMinwon('B25', minwonB25);
    // this.addMinwon('B01', minwonB01);
    // this.addMinwon('A02', minwonA02);
    // this.addMinwon('A04', minwonA04);
    // this.addMinwon('A05', minwonA05);
    // this.addMinwon('A06', minwonA06);
    // this.addMinwon('A07', minwonA07);
    this.addMinwon('A08', minwonA08);
    // this.addMinwon('A09', minwonA09);
    this.addMinwon('A12', minwonA12);
    this.addMinwon('A13', minwonA13);
    // this.addMinwon('B05', minwonB05);
  }

  goMinwon(minwonCd: string) {
    this.setPage(0, minwonCd);
    this.addApplicationPage(this.state.steps[minwonCd].step[0]);
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
    document.getElementById('minwonNm').innerText =
      this.state.steps[this.state.minwonCd].step[1].state.description.minwonNm;
    document.getElementById('minwonDesc').innerText =
      this.state.steps[this.state.minwonCd].step[1].state.description.minwonDfn.replaceAll('\/', '')
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
    e.preventDefault();

    console.log(this.state.registeredMinwons);

    // 신청 페이지 정보가 제대로 있는지 확인한다.
    if (!this.state.applicationPage.verify()) {
      return false;
    }

    // 현재 데이터가 입력되어 있는 민원들을 확인한다.
    // 신청에 필요한 모든 데이터가 입력되어 있는지를 민원별로 확인한다.
    this.state.registeredMinwons.forEach(element => {
      if (!this.state.steps[element].step[1].verify()) {
        return false;
      }
      this.state.steps[element].step[1].submitApplication();
    });
    // 문제가 있는 부분이 있으면 중간에 신청 프로세스를 멈추어야 한다.

    // 등록된 민원을 순차적으로 처리를 서버로 요청한다.
  }

  buttonDisplay() {
    $("#prev").show();
    $("#next").show();
    $("#summaryPage").hide();
    $("#btnCvplApply").hide();

    if (this.state.page === 0) {
      if (this.state.minwonCd === 'A13') {
        $("#prev").hide();
        $("#next").hide();
        $("#summaryPage").hide();
        $("#btnCvplApply").hide();
      } else {
        console.log('firstPage');
        $("#prev").hide();
        $("#summaryPage").hide();
      }
    }

    console.log(this.state.steps);

    // 마지막 단계
    if (this.state.page === this.state.steps[this.state.minwonCd].step.length - 1) {
      console.log('lastPage');
      $("#next").hide();
      $("#summaryPage").hide();
      $("#btnCvplApply").show();
    }

    // 마지막 직전 단계
    if (this.state.page !== 0 && this.state.page === this.state.steps[this.state.minwonCd].step.length - 2) {
      console.log('lastPage-1 page');
      $("#prev").show();
      $("#next").hide();
      $("#summaryPage").show();
    }
  }

  setState(nextState: any) {
    this.state = nextState;
  }

  setPage(page: any, minwonCd: string) {
    minwonCd = minwonCd || this.state.minwonCd;
    console.log(this.state.steps);
    // 페이지가 이상한 경우는 처리하지 않는다.
    if (!(page < 0 || page >= this.state.steps[minwonCd].length)) {
      console.log('setPage', this.state.steps[minwonCd].step[page]);
      this.setState({
        ...this.state,
        currentPage: this.state.steps[minwonCd].step[page],
        page,
        minwonCd
      });
      console.log('setPage', this.state);
      this.render();
    }
    this.setTitle();
  }

  registerMinwon(page: any, minwonCd: string) {
    let regMins = this.state.registeredMinwons;
    minwonCd = minwonCd || this.state.minwonCd;

    // 현재 페이지가 범위에서 벋어난지 확인
    if (!(page < 0 || page >= this.state.steps[minwonCd].length)) {
      //신청 내용 입력 후 확인 및 등록 버튼 클릭 전 유효성 검증 호출
      if (page === 2 && !this.state.steps[minwonCd].step[1].verify()) {
        return false;
      }
      // 통합 민원이 이미 등록된 경우 통합민원을 등록하려는 경우
      if (regMins.length !== 0 && ['B04', 'B14', 'B19', 'B25'].includes(regMins[0]) &&
        (minwonCd === 'B04' || minwonCd === 'B14' ||
          minwonCd === 'B19' || minwonCd === 'B25')) {
        // 통합민원이 등록되어 있는 경우
        // 민원이 등록 안된 경우 추가한다.
        if (!regMins.includes(minwonCd)) {
          regMins.push(minwonCd);
          this.state.summaryPage.infoPanels.push(
            new InfoPanel(this.state.steps[this.state.minwonCd].step[1].state.description.minwonNm,
              this, this.state.steps[minwonCd].step[1], 'getViewInfo'));
        }
      } else {
        if (regMins.length !== 0) {
          if (!confirm("이전 입력한 민원 정보는 삭제 됩니다. 진행하시겠습니까?")) {
            return false;
          }
        }

        regMins = [minwonCd];
        this.state.summaryPage.infoPanels = [
          new InfoPanel('신청 정보', this, this.state.steps[minwonCd].step[0], 'getViewInfo'),
          new InfoPanel(this.state.steps[this.state.minwonCd].step[1].state.description.minwonNm,
            this, this.state.steps[minwonCd].step[1], 'getViewInfo')
        ]
      }

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

  render() {
    let template = `
      <form>
        <div class="form-m-wrap row">
          <div class="mw-box bgStrong">
            <h2 class="txWhite"><span class="i-99" id="minwonNm"></span></h2>
            <div class="info-alert" id="minwonDesc">
              이사 통합민원은 <span class="txStrongColor">소유자(사용자)명의변경 신고, 자동납부(계좌) 신규/해지, 수도요금 바로알림 신규/변경/해지, 전자고지
                신규/변경/해지</span> 의 4가지 민원으로 한번에 신청할 수 있습니다.
            </div>
          </div><!-- //mw-box -->


          <div id="minwonRoot">

          </div>

          <!-- 버튼영역 -->
          <div class="form-btn-wrap row">
            <button type="button" class="btn btnM btnWL" id="prev"
              onClick="cyberMinwon.state.currentModule.setPage(cyberMinwon.state.currentModule.state.page-1)">이전단계</button>
            <button type="button" class="btn btnM btnWL" id="next"
              onClick="cyberMinwon.state.currentModule.setPage(cyberMinwon.state.currentModule.state.page+1)">다음단계</button>
            <button type="button" class="btn btnM btnWL" id="summaryPage"
              onClick="cyberMinwon.state.currentModule.registerMinwon(cyberMinwon.state.currentModule.state.page+1)">확인 및 등록</button>
            <button type="button" class="btn btnM btnWL" id="btnCvplApply"
              onClick="cyberMinwon.state.currentModule.submitMinwon(event)">민원신청</button>
            <button type="button" class="btn btnM btnDGray btnWM" onclick="cyberMinwon.goFront();">취소</button>
            <button type="button" class="btn btnM btnDGray btnWM" onclick="clearForm(this.form);">초기화</button>

          </div><!-- //form-btn-wrap -->

        </div><!-- /form-mw-wrap -->
      </form>
    `;

    this.state.target.innerHTML = template;
    this.buttonDisplay();
    this.state.steps[this.state.minwonCd].step[this.state.page].render();

    console.log(this);
  }
}