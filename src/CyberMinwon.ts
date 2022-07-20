import FrontPage from "./front/FrontPage";
import UnityMinwon from "./UnityMinwon";

// 전체를 관리하는 최상위 컴포넌트
export default class CyberMinwon {

  state: {
    target: any;
    currentUrl: string;
    currentModule: any;
    frontPage: FrontPage;
    unityMinwon: UnityMinwon;
  }

  constructor(currentUrl: string, $app: any) {
    var unityMinwon = new UnityMinwon(this, $app);
    var frontPage = new FrontPage(this, $app);

    this.state = {
      target: $app,
      currentUrl,
      currentModule: frontPage,
      frontPage,
      unityMinwon
    };
  }

  goMinwon(minwonCd: string) {
    this.setState({
      ...this.state,
      currentModule: this.state.unityMinwon
    });

    if (minwonCd === 'B03') {
      window.open('https://minwon.seoul.go.kr/icisuser/minwon/info.do?mwnId=1472805362618');
    } else {
      this.state.unityMinwon.goMinwon(minwonCd);
    }
  }

  goFront() {
    this.setState({
      ...this.state,
      currentModule: this.state.frontPage
    });
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
      if (!(newState.currentModule === this.state.unityMinwon && !newState.currentModule.state.minwonCd)) {
        this.render();
      }
    }
  }

  render() {
    this.state.currentModule.render();
    console.log(this);
  }
}