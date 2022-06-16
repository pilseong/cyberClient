class CyberMinwon {
  
  constructor(currentUrl, $app) {
    var unityMinwon = new UnityMinwon(this, root);
    var frontPage = new FrontPage(this, root);

    this.state = {
        target: $app,
        currentUrl,
        currentModule: frontPage,
        frontPage,
        unityMinwon
      };
  }
  
  goMinwon(minwonCd) {
    this.setState({
      ...this.state,
      currentModule: this.state.unityMinwon
    });
    
    this.state.unityMinwon.goMinwon(minwonCd);
  }
  
  setCurrentUrl(url, userKey, minwonCd) {
    window.location.href="/citizen/common/" + url + ".do?userKey=" + userKey + "&minwonCd=" + minwonCd;
    
    this.setState({
      ...this.state,
      currentUrl: url
    });
    
    this.render();
  }
  
  setState(newState) {
    if (this.state !== newState)
      this.state = newState;
    
    if (this.state.unityMinwon.state.minwonCd) {
      this.render();
    }
  }
  
  render() {
    this.state.currentModule.render();
    console.log(this);
  }
}