// 정보 요약 컴포넌트
export default class InfoPanel {
  title: string;
  root: any;
  owner: any;
  callbackName: string;
  data: any;

  constructor(title: string, root: any, owner: any, callbackName: string) {
    this.title = title;
    this.root = root;
    this.owner = owner;
    this.callbackName = callbackName;
    this.data = owner.state.submitResult;
  }

  setData() {
    this.data = this.owner[this.callbackName]();
  }

  render() {
    const that = this;
    const minwonCd = this.owner.state.minwonCd;

    // 데이터를 가지고 온다.
    this.setData();

    let template = '';

    if (!this.data['noinfo'] || !this.data['viewUseStatusB19']) {
      // head는 각 부분의 전체 제목이다. 박스 박에 표출 style="margin-bottom: 15px;"
      const head = `
      <li class="info-block sub-box">
        <div>
          <div class="txStrong">${that.title}</div>
          <div class="display-block form-info form-info-box">
            <ul>  
      `;
      template += head;
    }
    
    for (const property in this.data) {

      let width: string = "0px";
      width = that.data[property]['width'] ? that.data[property]['width'] : "150px";      
      
      // 박스 내부의 세부 제목
      let subTitle = that.data[property]['title'];
      let innerHead = ``;
      if(subTitle){
        innerHead += `
          <li class="info-block">
            <div class="txStrong">${subTitle}</div>
            <p class="display-block form-info form-info-box">
        `;
      }else{
        innerHead += `
          <li class="info-block">
            <p class="display-block form-info form-info-box">
        `;
        
      }
      
      let body = '';
      
      if(this.data['viewUseStatusB19']){
        for (const item in this.data[property]) {
          if (item !== 'title' && item !== 'width'){
            let conts = that.data[property][item][0];
            conts = conts ? conts : "-";
            body += `
              <span class="mw-info-label txStrongColor">${that.data[property][item][1]}</span>
                 <span class="contents">${conts}</span><br />`;
          }
        }
      }else if(this.data['viewB10Detail']){
        let chkNum = "";
        for (const item in this.data[property]) {
          if (item !== 'title' && item !== 'width'){
            let conts = that.data[property][item][0];
            conts = conts ? conts : "-";
            
            if(`${that.data[property][item][1]}`.replace(/[^0-9]/g, "") !== chkNum){
              body += `<br />`;
            }
            body += `
              <span class="mw-info-label">${that.data[property][item][1]}</span>
                 <span class="contents">${conts}</span><br />`;
            
            chkNum = `${that.data[property][item][1]}`.replace(/[^0-9]/g, "");
          }
        }
      }else{
        for (const item in this.data[property]) {
          if (item !== 'title' && item !== 'width'){
            let conts = that.data[property][item][0];
            conts = conts ? conts : "-";
            body += `
              <span class="mw-info-label">${that.data[property][item][1]}</span>
                 <span class="contents"`
            if(item == 'desc'){
              body+= !that.owner.state.isSubmitSuccessful ? ' style=color:#d0021b ' : ' style=color:#1c5cbe ';
            }
            if(item == 'receipt_no' && !(minwonCd === 'B04' || minwonCd === 'B14' || minwonCd === 'B19' || minwonCd === 'B25')){
              body += `>${conts} <button type="button" class="btn btnSS btnTypeA" id="next" onclick="cyberMinwon.goResultSearch('${conts}')">진행사항 확인</button></span><br />`;
            }else{
              
              body += `>${conts}</span><br />`;
            }
          }
        }
      }
      //문자 결과 위치  || minwonCd === 'B18' B18은 당분간 제외 문자 발송 정리 후 추가
      if((minwonCd === 'B04' || minwonCd === 'B14' || minwonCd === 'B19' || minwonCd === 'B25')){
        if(this.callbackName === 'getResultView' && this.owner.getSmsResult && 
           (this.owner.state.submitResult.data.resultCode === '2' || this.owner.state.submitResult.data.resultCd === '00')){
          body += `<p class="txCenter txStrong" style="margin-top:10px;margin-bottom:5px;">&lt; 문자(알림톡 또는 SMS) 발송내용을 참고해 주세요. &gt;</p>`;
          body += this.owner.getSmsResult();
        }
      }
          
      let innerTail = `     
          </p>
        </li>
      `;

      template += innerHead + body + innerTail;
    }

    if (!this.data['noinfo'] || !this.data['viewUseStatusB19']) {
      const tail = `
            </ul>     
          </div>
        </div>
      </li>
      `;
      template += tail;
    }
    
    return template;
  }
}