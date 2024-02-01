interface UnityProps {
  [key : string] : unknown,
  minwonCd : string,
  isSel : boolean,
  inputState : boolean,
  order : number
}

class UnityMinwonPanel {
  unityMinwons : UnityProps [];
  unityCount : number;
  curPos : number;
  orderList : any;
  unityList : any;
  
  title: string;
  subTitle: string;
  tailMsg: string;
  
  constructor(){
    this.unityMinwons = [
      {minwonCd : "B04", isSel : false, inputState : false, order : 1},
      {minwonCd : "B14", isSel : false, inputState : false, order : 2},
      {minwonCd : "B19", isSel : false, inputState : false, order : 3},
      {minwonCd : "B25", isSel : false, inputState : false, order : 4},
    ]
    this.unityCount = 0;
    this.curPos = 0;
    this.orderList = [];
    this.unityList = [];
    
    this.title = "이사 통합민원 신청";
    this.subTitle = "";
    this.tailMsg = "* 같이 신청 할 민원을 선택하고 민원신청을 할 경우, 해당 민원을 추가로 등록 할 수 있습니다.";
  }
  setUnityMinwon(minwonCd: string, isSel: boolean, inputState? : boolean){
    let order = 0;
    this.unityMinwons.forEach((ele) => {
      if(ele.minwonCd === minwonCd){
        ele.isSel = isSel;
        ele.inputState = inputState?inputState:false;
        order = ele.order;
      }
    });
  }
  
  getUnityMinwon(minwonCd: string){
    return this.unityMinwons.find(ele => {
      if(ele.minwonCd === minwonCd){
        return ele.isSel;
      }
    })
//    return this.unityMinwon[minwonCd];
  }
  
  setInputState(minwonCd: string, inputState : boolean){
    this.unityMinwons.forEach((ele) => {
      if(ele.minwonCd === minwonCd){
        ele.inputState = inputState?inputState:false;
      }
    });
  }
  
  getUnityMiwonCount(){
//    this.unityMinwons.forEach((ele) => {
//      if(ele.isSel){
//        this.unityCount++;
//      }
//    });
    return this.unityCount;
  }
  
  authCheck(){
    if(this.getSelectedMinwonCdByOrd(2) || this.getSelectedMinwonCdByOrd(3) || this.getSelectedMinwonCdByOrd(4)){
      return true;
    }else{
      return false;
    }
  }
  
  setOrder(){
    this.unityMinwons.forEach(ele => {
      if(ele.isSel){
        this.orderList.push(ele.order);
        if(this.unityCount === 0) this.curPos = ele.order;
        this.unityCount++;
      }
    })
  }
  
  hasNext(){
    const tempPos = this.curPos;
    const returnPos = this.orderList.find((ele: number) => ele > tempPos);
    if(typeof returnPos  === 'undefined') {
      return false;
    }else{
      return true;
    }
  }
  
  getNext(){
    const tempPos = this.curPos;
    let returnPos = this.orderList.find((ele: number) => ele > tempPos);
    if(typeof returnPos  === 'undefined') {
      this.curPos = 5;
      return null;
    }
    this.curPos = returnPos;
    return this.getMinwonCdByOrd(returnPos);
  }
  
  getMinwonCdByOrd(ord: number){
    const ele = this.unityMinwons.find(ele => {
      if(ele.order === ord){
        return ele;
      }else{
        return null;
      }
    });
    
    return typeof ele === 'undefined' || ele === null ? null : ele.minwonCd;
  }
  
  getSelectedMinwonCdByOrd(ord: number){
    const ele = this.unityMinwons.find(ele => {
      if(ele.order === ord && ele.isSel){
        return ele;
      }else{
        return null;
      }
    });
    
    return typeof ele === 'undefined' || ele === null ? null : ele.minwonCd;
  }
  
  isSelNotCurPos(ord: number) {
    const ele = this.unityMinwons.find(ele => {
      if(ele.order === ord && ele.isSel){
        return ele;
      }else{
        return null;
      }
    });
    if(typeof ele !== 'undefined' && ele !== null){
      if(ele.isSel && ord !== this.curPos){
        return true;
      }else{
        return false;
      }
    }
  }
  
  isSelected(ord: number){
    const ele = this.unityMinwons.find(ele => {
      if(ele.order === ord && ele.isSel){
        return ele;
      }else{
        return null;
      }
    });
    if(typeof ele !== 'undefined' && ele !== null){
      if(ele.isSel){
        return true;
      }else{
        return false;
      }
    }
  }
  
  isNext(ord: number){
    return this.orderList.find((ele: number)=>ele>this.curPos) === ord? true : false
  }
  
  resetUnityMinwon(){
    this.unityMinwons = [
      {minwonCd : "B04", isSel : false, inputState : false, order : 1},
      {minwonCd : "B14", isSel : false, inputState : false, order : 2},
      {minwonCd : "B19", isSel : false, inputState : false, order : 3},
      {minwonCd : "B25", isSel : false, inputState : false, order : 4},
    ]
    this.unityCount = 0;
    this.curPos = 0;
    this.orderList = [];
    this.unityList = [];
  }
  
  setUnityList(receiptNo: string, resultYn: string) {
    const unityMinwon = `${receiptNo}/${resultYn}`
    this.unityList.push(unityMinwon);
  }
  
  getUnityList() {
    return this.unityList;
  }
  
  showUnityMinwon(path: string, gubun: string){
    this.subTitle = gubun === "first" ? "같이 신청할 민원을 선택해 주세요." : "같이 신청한 민원";
    let unityPanel = `
      <div id="form-unity" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw24');" title="닫기">
        <span class="i-02">${this.title}</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label class="input-label-1"><span>${this.subTitle}</span></label>
                <ul class="mw-opt mw-opt-2 mw-opt-type02 row">
    `;
    if(gubun === "first"){
      unityPanel += `
                  <li id="uGubun1" class="uGubun ${this.getSelectedMinwonCdByOrd(1)?"on":"off"}">
                    <a href="javascript:void(0);" onclick="${path}.handleUnityMinwonClick('B04','#uGubun1')">
                      <span>소유자(사용자)명의변경 신고</span>
                    </a>
                  </li>
                  <li id="uGubun2" class="uGubun ${this.getSelectedMinwonCdByOrd(2)?"on":"off"}">
                    <a href="javascript:void(0);" onclick="${path}.handleUnityMinwonClick('B14','#uGubun2')">
                      <span>자동납부(계좌) 신규/해지</span>
                    </a>
                  </li>
                  <li id="uGubun3" class="uGubun ${this.getSelectedMinwonCdByOrd(3)?"on":"off"}">
                    <a href="javascript:void(0);" onclick="${path}.handleUnityMinwonClick('B19','#uGubun3')">
                      <span>전자고지 신규/변경/해지</span>
                    </a>
                  </li>
                  <li id="uGubun4" class="uGubun ${this.getSelectedMinwonCdByOrd(4)?"on":"off"}">
                    <a href="javascript:void(0);" onclick="${path}.handleUnityMinwonClick('B25','#uGubun4')">
                      <span>수도요금 문자 알림 신규/변경/해지</span>
                    </a>
                  </li>
                </ul>
                <p class="form-cmt form-cmt-1 txStrongColor">${this.tailMsg}</p>
              </li>
      `;
    }else if(gubun === "detail"){
      unityPanel += `
                  <li id="uGubun1" class="uGubun ${this.getSelectedMinwonCdByOrd(1)?"on":"off"} ${this.isSelNotCurPos(1)?'disable':''}">
                    <a href="javascript:void(0);">
                      <span class="unitySpan">소유자(사용자)명의변경 신고</span>
                    </a>
                  </li>
                  <li id="uGubun2" class="uGubun ${this.getSelectedMinwonCdByOrd(2)?"on":"off"} ${this.isSelNotCurPos(2)?'disable':''}">
                    <a href="javascript:void(0);">
                      <span class="unitySpan">자동납부(계좌) 신규/해지</span>
                    </a>
                  </li>
                  <li id="uGubun3" class="uGubun ${this.getSelectedMinwonCdByOrd(3)?"on":"off"} ${this.isSelNotCurPos(3)?'disable':''}">
                    <a href="javascript:void(0);">
                      <span class="unitySpan">전자고지 신규/변경/해지</span>
                    </a>
                  </li>
                  <li id="uGubun4" class="uGubun ${this.getSelectedMinwonCdByOrd(4)?"on":"off"} ${this.isSelNotCurPos(4)?'disable':''}">
                    <a href="javascript:void(0);">
                      <span class="unitySpan">수도요금 문자 알림 신규/변경/해지</span>
                    </a>
                  </li>
                </ul>
              </li>
      `;
    }else{
      unityPanel += `
                  <li id="uGubun1" class="uGubun ${this.isNext(1)?"on":"off"} ${this.isSelected(1) && !this.isNext(1)?'disable':''}">
                    <a href="javascript:void(0);">
                      <span class="unitySpan">소유자(사용자)명의변경 신고</span>
                    </a>
                  </li>
                  <li id="uGubun2" class="uGubun ${this.isNext(2)?"on":"off"} ${this.isSelected(2) && !this.isNext(2)?'disable':''}">
                    <a href="javascript:void(0);">
                      <span class="unitySpan">자동납부(계좌) 신규/해지</span>
                    </a>
                  </li>
                  <li id="uGubun3" class="uGubun ${this.isNext(3)?"on":"off"} ${this.isSelected(3) && !this.isNext(3)?'disable':''}">
                    <a href="javascript:void(0);">
                      <span class="unitySpan">전자고지 신규/변경/해지</span>
                    </a>
                  </li>
                  <li id="uGubun4" class="uGubun ${this.isNext(4)?"on":"off"} ${this.isSelected(4) && !this.isNext(4)?'disable':''}">
                    <a href="javascript:void(0);">
                      <span class="unitySpan">수도요금 문자 알림 신규/변경/해지</span>
                    </a>
                  </li>
                </ul>
              </li>
      `;
    }
    unityPanel += `
            </ul>
          </div>
        </div><!-- //form-mw-box -->
      </div><!-- //form-mw24 -->
    `;
    return unityPanel;
  }
}

export default new UnityMinwonPanel();