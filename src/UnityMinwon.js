/**
 * 
 */

// 페이지 전체를 관리 하는 어플리케이션
class UnityMinwon {
  constructor(minwonCd, $app) {
    this.state = {
      steps: {},
      target: $app,
      currentPage: null,
      minwonCd,
      registeredMinwons: [],
      page: 0,
      suyongaInfoPage: null,
      summaryPage: null,
    };
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

  render() {
    this.buttonDisplay();
    this.state.steps[this.state.minwonCd].step[this.state.page].render();
    console.log("app after render", this.state);
  }

  setState(nextState) {
    this.state = nextState;
  }

  setPage(page, minwonCd) {
    minwonCd = minwonCd || this.state.minwonCd;
    // 페이지가 이상한 경우는 처리하지 않는다.
    if (!(page < 0 || page >= this.state.steps[minwonCd].length)) {
      this.setState({
        ...this.state,
        currentPage: this.state.steps[minwonCd][page],
        page,
        minwonCd
      });
      this.render();
    }
    console.log("after setPage", this.state);
  }

  registerMinwon(page, minwonCd) {
    const regMins = this.state.registeredMinwons;
    minwonCd = minwonCd || this.state.minwonCd;

    if (!(page < 0 || page >= this.state.steps[minwonCd].length)) {
      // 신청 대상 민원 등록
      if (regMins.indexOf(minwonCd) === -1) {
        regMins.push(minwonCd);

        this.state.summaryPage.infoPanels.push(new InfoPanel(this.state.steps[minwonCd].title,
          this, `this.root.state.steps['${minwonCd}'].step[1].state.viewRequestInfo`));
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
}