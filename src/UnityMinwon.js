// 페이지 전체를 관리 하는 어플리케이션
class UnityMinwon {
  constructor(parent, $app) {
    this.state = {
        parent,
        steps: {},
        target: $app,
        currentPage: null,
        minwonCd: '',
        registeredMinwons: [],
        page: 0,
        suyongaInfoPage: null,
        summaryPage: null,
      };
    
    
    var suyongaInfo = new SuyongaPage(this);
    this.addSuyongaInfoPage(suyongaInfo);

    var summaryStep = new SummaryPage(this);
    this.addSummaryPage(summaryStep);

    var detailB04 = new B04DetailPage(this, 'B04');
    var detailB14 = new B14DetailPage(this, 'B14');
    var detailB19 = new B19DetailPage(this, 'B19');
    var detailB25 = new B25DetailPage(this, 'B25');

    var minwonB04 = [suyongaInfo, detailB04, summaryStep];  // 명의변경
    var minwonB14 = [suyongaInfo, detailB14, summaryStep];  // 자동납부
    var minwonB19 = [suyongaInfo, detailB19, summaryStep];  // 전자고지
    var minwonB25 = [suyongaInfo, detailB25, summaryStep];  // 수도요금 바로 알림
    
    this.addMinwon('B04', minwonB04, '명의변경 신청');
    this.addMinwon('B14', minwonB14, '자동납부 신청');
    this.addMinwon('B19', minwonB19, '전자고지 신청');
    this.addMinwon('B25', minwonB25, '수도요금 바로알림 신청');
  }

  goMinwon(minwonCd) {
    this.setPage(0, minwonCd);
  }

  addSummaryPage(page) {
    this.setState({
      ...this.state,
      summaryPage: page
    });
  }

  addSuyongaInfoPage(page) {
    this.setState({
      ...this.state,
      suyongaInfoPage: page
    });
  }

  // 민원 제목을 설정한다.
  setTitle() {
    document.getElementById('minwonNm').innerText =
      this.state.steps[this.state.minwonCd].step[1].state.description.minwonNm;
  }

  // 민원 셋을 추가한다.
  addMinwon(minwonCd, minwon, title) {
    this.setState({
      ...this.state,
      steps: {
        ...this.state.steps,
        [minwonCd]: {
          step: minwon,
          title
        }
      },
    });
  }

  submitMinwon(e) {
    // 민원 신청 로직 진행
    e.preventDefault();

    console.log(this.state.registeredMinwons);

    // 수용가 정보가 제대로 있는지 확인한다.
    if (!this.state.suyongaInfoPage.verifySuyonga()) {
      return false;
    }
    // 신청인 정보가 제대로 있는지 확인한다.
    if (!this.state.suyongaInfoPage.verifyApply()) {
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
      console.log('firstPage');
      $("#prev").hide();
      $("#summaryPage").hide();
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

  setState(nextState) {
    this.state = nextState;
  }

  setPage(page, minwonCd) {
    minwonCd = minwonCd || this.state.minwonCd;
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

  registerMinwon(page, minwonCd) {
    const regMins = this.state.registeredMinwons;
    minwonCd = minwonCd || this.state.minwonCd;

    if (!(page < 0 || page >= this.state.steps[minwonCd].length)) {
      // 신청 대상 민원 등록
      if (regMins.indexOf(minwonCd) === -1) {
        regMins.push(minwonCd);

        // 인포패널 등록
        this.state.summaryPage.infoPanels.push(
          new InfoPanel(this.state.steps[minwonCd].title,
            this, this.state.steps[minwonCd].step[1], 'getViewInfo'));
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
    console.log("after register minwon", this.state);
  }

  render() {
    console.log("app after render", this.state);
    
    let template = `
      <form>
        <div class="form-m-wrap row">
          <div class="mw-box bgStrong">
            <h2 class="txWhite"><span class="i-99" id="minwonNm"></span></h2>
            <div class="info-alert">
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
            <button type="button" class="btn btnM btnDGray btnWM" onclick="fncCivilCancel();">취소</button>
            <button type="button" class="btn btnM btnDGray btnWM" onclick="clearForm(this.form);">초기화</button>

          </div><!-- //form-btn-wrap -->

        </div><!-- /form-mw-wrap -->
      </form>
    `;
    
    this.state.target.innerHTML = template;
    this.buttonDisplay();
    this.state.steps[this.state.minwonCd].step[this.state.page].render();
  }
}