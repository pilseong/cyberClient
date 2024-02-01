import { fetch } from '../util/unity_resource';
import { addMW, removeMW, showElement, hideElement, citizenAlert, clearObject } from '../util/uiux-common';

declare var $: any;
declare var gVariables: any;
declare var fncGetCodeByGroupCd: any;
declare var fncGetCodeByGroupCdUsing: any;
declare var gContextUrl: string;
declare var fncCutByByte: (str: string, maxByte: number) => string;

export default class JusoSearchPanel {
  state: {
    parent: any;
    path: string;
    target: any;
    callback: (data: any, data1: string, data2?: string) => void
    parentPath: string,
    jusosearchMethod: string;
    jusoParams: {
      currentPage: string;
      countPerPage: string,
      confmKey: string;
      doroKeyword: string;
      dongKeyword: string;
      jibeunKeyword: string
    }
    jusoResult: {
      juso: any;
      meta: any;
    };
    jusoSelect: {
      selectAddr: string;      
      selectDetailAddr: string;
      selectIndex: string;
      selectData: any;
    }
  }
  constructor(parent: any, path: string, target: string, callback: (jusoInfo: any, jusoDetailAddr: string, action?: string) => void) {
    this.state = {
      // 부모 즉 프로그램 전체를 감싸는 UnityMinwon의 객체를 참조한다.
      parent,
      path: path + '.jusoSearchPanel',
      target,
      callback,
      parentPath: path,
      jusosearchMethod: '1',
      jusoParams: {
        currentPage: '1',
        countPerPage: '10',
        confmKey: 'U01TX0FVVEgyMDIxMTAxMjEzMjgxMTExMTc0NTc=',
        doroKeyword: '',
        dongKeyword: '',
        jibeunKeyword: ''
      },
      jusoResult: {
        juso: [],
        meta: {}
      },
      jusoSelect: {
        selectAddr: '',    
        selectDetailAddr: '',
        selectIndex: '',
        selectData: []
      }
    }
  }

  setState(nextState: any) {
    if (this.state !== nextState)
      this.state = nextState;
  }
  
  reset(){
    const that = this;
    that.setState({
      ...that.state,
      jusoParams: {
        ...that.state.jusoParams,
        doroKeyword: '',
        dongKeyword: '',
        jibeunKeyword: ''
      }
    });
    that.render();
  }

  handleSidoList() {
    gVariables['sidoTy'] = fncGetCodeByGroupCdUsing("sidoCs");
  }

  handleWrapDoroSearch(e:any){
    e.preventDefault();
    console.log(e)
    console.log(`code::${e.code}||key::${e.key}||type::${e.type}`)
    if(this.state.jusoParams.doroKeyword.trim().length == 0){
      $("#jsuoSearchInput").focus();
      return false
    }
    if(e.key === "Enter" || e.type === "click"){
      this.handleDoroSearch('1');
    }
  }
  handleDoroSearch(page: string, e?: any) {
    const that = this;
    if(e){
      e.preventDefault();
      console.log(e)
    }

    this.setState({
      ...this.state,
      jusoParams: {
        ...this.state.jusoParams,
        currentPage: page
      }
    });

    let jusoKeyword = '';
    if (this.state.jusosearchMethod === '1') {
      jusoKeyword += this.state.jusoParams.doroKeyword;
    } else if (this.state.jusosearchMethod === '2') {
      jusoKeyword += this.state.jusoParams.dongKeyword;
      jusoKeyword += (this.state.jusoParams.jibeunKeyword ? ' ' + this.state.jusoParams.jibeunKeyword : '');
    } else {

    }
    
    if(jusoKeyword.trim().length == 0){
      //jsuoSearchInput
      citizenAlert('검색할 주소를 입력해 주세요.').then(result => {
        if(result){
          $("#jsuoSearchInput").focus();
        }
      })
      return false
      
    }

    var url = gContextUrl + "/basic/getAddrApi.do";
    var queryString = {
      'currentPage': this.state.jusoParams.currentPage,
      'countPerPage': this.state.jusoParams.countPerPage,
      'resultType': 'json',
      'confmKey': this.state.jusoParams.confmKey,
      'keyword': jusoKeyword
    };

    fetch('POST', url, queryString, function (error: any, data: any) {
      // 에러가 발생한 경우
      if (error) {
        citizenAlert("서버가 응답하지 않습니다. 잠시 후 다시 조회해 주세요.");
        return;
      }

      that.setState({
        ...that.state,
        jusoResult: {
          juso: data.results.juso,
          meta: data.results.common
        }
      })
      that.state.jusoResult.juso.forEach((key:String, index:number) => {
        let item = that.state.jusoResult.juso[index];
        let fullDoroAddr = item.siNm+" "+item.sggNm+" "+item.rn+" "+item.buldMnnm;
        fullDoroAddr = item.buldSlno != "0" ? fullDoroAddr += "-"+item.buldSlno : fullDoroAddr;
        fullDoroAddr += " ("+item.emdNm
        fullDoroAddr = item.bdnm ? fullDoroAddr += ","+item.bdnm+") " : fullDoroAddr += ")"; 
        item.roadAddr = fullDoroAddr;
      });
      
      that.renderJusoResult();
    });
    $("#"+this.state.target+"jusoresult").removeClass("display-none");
  }

  // 신청 구분에 따른 UI 활성화
  toggleUIGubun(gubun: string) {
    //this.renderJusoSearchUI(gubun);
    this.setState({
      ...this.state,
      jusosearchMethod: gubun
    });

    //    if (gubun === '3') {
    //      const sido = fncGetCodeByGroupCd("sidoCs");
    //      console.log(sido);
    //    }

  }

  handleDongKeyword(e: any) {
    e.preventDefault();
    const jusoParams = this.state.jusoParams;

    this.setState({
      ...this.state,
      jusoParams: {
        ...this.state.jusoParams,
        dongKeyword: e.target.value.substring(0, 50)
      }
    });
    e.target.value = this.state.jusoParams.dongKeyword.substring(0, 50);
    if(e.key === "Enter"){
      this.handleDoroSearch('1');
    }
  }

  handleJibeunKeyword(e: any) {
    e.preventDefault();
    const jusoParams = this.state.jusoParams;

    this.setState({
      ...this.state,
      jusoParams: {
        ...this.state.jusoParams,
        jibeunKeyword: e.target.value.substring(0, 50)
      }
    });
    e.target.value = this.state.jusoParams.jibeunKeyword.substring(0, 50);
    if(e.key === "Enter"){
      this.handleDoroSearch('1');
    }
  }

  handleDoroKeyword(e: any) {
    e.preventDefault();
    const jusoParams = this.state.jusoParams;

    this.setState({
      ...this.state,
      jusoParams: {
        ...this.state.jusoParams,
        doroKeyword: e.target.value.substring(0, 30)
      }
    });
    e.target.value = this.state.jusoParams.doroKeyword.substring(0, 30);
    if(e.key === "Enter"){
      this.handleDoroSearch('1');
    }
  }

/*
  renderJusoSearchUI(gubun: string) {
    addMW('#' + this.state.target + 'aGubun' + gubun);
    if (gubun === '1') {
      removeMW("#" + this.state.target + "aGubun2");
      showElement("#" + this.state.target + "doro");
      hideElement("#" + this.state.target + "jibun");
    } else if (gubun === '2') {
      removeMW("#" + this.state.target + "aGubun1");
      hideElement("#" + this.state.target + "doro");
      showElement("#" + this.state.target + "jibun");
    }
  }
*/
  // 특정 주소를 설정한 경우 부모의 데이터에 매핑하여 입력한다.
  handleSelectJuso(index: string) {
    //////////////////주소 target 종류(서울사업소 관할 필수 여부)///////////////////
    //민원 발생지(spotInfo.ts)                                 : jusosearchspot(o)
    //민원 발생지 급수공사/옥외누수(SuyongajusoInfo.ts)        : jusosearchsuyonga(o)
    //A11 직결급수 신고(A11Detail.ts)                          : jusosearchdetailA11(x)
    //B13 신·구 소유자(사용자)사용요금 분리 신고(B13Detail.ts) : jusosearcholdOwner(x)
    //B18 수도요금 청구지 주소변경 신청(B18Detail.ts)          : jusosearchB18Bill(x)
    //B27 고지서재발급 신청(B27Detail.ts)                      : jusosearcholdOwner(x)
    //신청인 주소(ApplicantInfo.ts)                            : jusosearchapplicant(x)
    ////////////////////////////////////////////////////////////////////////////////
    
    //this.state.callback(this.state.jusoResult.juso[index]);
    const jusoResult = this.state.jusoResult.juso[index];
    
    if(["jusosearchspot","jusosearchsuyonga"].indexOf(this.state.target) > -1){
      if(["서울특별시", "경기도"].indexOf(jusoResult.siNm) < 0){
        citizenAlert("해당 주소는 서울특별시 상수도 관할 지역이 아닙니다.").then(result => {
          if(result){
          }
        });
        return false;
      }
      //31개 상수도 관할 시군구
      if(["하남시","도봉구","강북구","노원구","서대문구","중구","은평구","종로구","마포구","용산구","강서구","양천구"
         ,"영등포구","구로구","금천구","동작구","관악구","서초구","강남구","강동구","송파구","중랑구","성동구","광진구"
         ,"성북구","동대문구","과천시","고양시","고양시 일산동구","고양시 일산서구","고양시 덕양구"].indexOf(jusoResult.sggNm) < 0){
        citizenAlert("해당 주소는 서울특별시 상수도 관할 지역이 아닙니다.").then(result => {
          if(result){
          }
        });
        return false;
      }
    }
    
    if(this.state.target == "jusosearchapplicant"){
      this.state.parent.state.copySuyongaAddress = false;
    } 
    //주소 목록에서 주소 선택 시 부모객체의 주소정보 초기화 목적
    const clearData = {...jusoResult};
    clearObject(clearData)
    this.state.callback(clearData, "", "clear");
    
    this.setState({
      ...this.state,
      jusoSelect: {
        ...this.state.jusoSelect,
        selectAddr: `(${jusoResult.zipNo}) ${jusoResult.roadAddr}`,    
        selectDetailAddr: '',
        selectIndex: index,
        selectData: jusoResult
      }
    });
    $("#"+this.state.target+"jusoresult").hide();
    this.renderJusoDetail();
    $("#"+this.state.target+"Searchform > div > div > input").focus();
  }
  
  handleDetailAddr(e: any) {
    this.setState({
      ...this.state,
      jusoSelect: {
        ...this.state.jusoSelect,
        selectDetailAddr: fncCutByByte(e.target.value ,150),
      }
    });
    e.target.value = this.state.jusoSelect.selectDetailAddr;
  }
  
  handleSelectOk() {
    const that = this;
    const jusoSelect = that.state.jusoSelect;
    
    if(!jusoSelect.selectDetailAddr){
      citizenAlert("상세주소를 입력해 주세요.");
      $(this.state.path).parent().children("#searchDetail").focus();
    }else{
      this.state.callback(jusoSelect.selectData,jusoSelect.selectDetailAddr);
    }
  }
  
  setEventListeners(){
    //sch-addr-01
    $('#sch-addr-01').on('keydown', (e:any)=> { 
      console.log(`code::${e.code}||key::${e.key}`)
      if(e.key === "Tab"){
        const id = $(':focus').attr('id')
        if(id == "lastPage"){ $('#jsuoSearchInput').focus(); }
      }else{
        
      }
    });
  }

  render() {
    const that = this;
    let template = ` 
      <div id="form-mw23-info" class="form-info-box sch-box">
        <div id="sch-addr-01" class="sch-addr display-block row">
          <div id="${this.state.target}Searchform">
            <!-- 도로명주소 검색 -->
            <div id="${that.state.target}doro" class="search-addr display-block">
              <label for="jsuoSearchInput"><span class="sr-only">도로명주소</span></label>
              <input type="text" 
                onkeyup="${that.state.path}.handleDoroKeyword(event)"
                onpaste="${that.state.path}.handleDoroKeyword(event)"                          
                value="${that.state.jusoParams.doroKeyword}"
                id="jsuoSearchInput" class="input-box input-w-1" placeholder="도로명주소 또는 지번주소를 입력해 주세요.">
              <a href="javascript:;" class="btn btnSS btnTypeE" title="주소검색"
                onclick="${that.state.path}.handleWrapDoroSearch(event)">
                <span></span>
              </a>
              <p class="form-cmt form-cmt-1 txStrongColor">
                TIP_이렇게 검색해 주세요!<br />
                - 도로명+건물번호<br />
                - 지역명+번지<br />
                - 지역명+건물명<br />
              </p>
            </div>
      
            <!-- 지번주소 검색 -->
            <!--
            <div id="${that.state.target}jibun">
              <label for="form-mw35-tx"><span class="sr-only">읍면동</span></label>
              <input 
                onkeyup="${that.state.path}.handleDongKeyword(event)"
                onpaste="${that.state.path}.handleDongKeyword(event)" 
                type="text" id="form-mw35-tx"
                name="form-mw35-tx" class="input-box input-w-2" placeholder="읍면동">
              <label for="form-mw36-tx"><span class="sr-only">지번</span></label>
              <input 
                onkeyup="${that.state.path}.handleJibeunKeyword(event)"
                onpaste="${that.state.path}.handleJibeunKeyword(event)" 
                type="text" id="form-mw36-tx"
                name="form-mw36-tx" class="input-box input-w-2" placeholder="지번(예:202-124)">
              <a href="javascript:;" class="btn btnSS" 
                onclick="${that.state.path}.handleDoroSearch('1');">
                <span>주소검색</span>
              </a>
              <p class="form-cmt form-cmt-1 pre-star tip-blue">지번주소로 검색해 주세요.</p>
            </div>
          </div>
          -->
          <!-- 검색결과 -->
          <div id="${that.state.target}jusoresult" class="jusoresult display-none"></div>
        </div><!-- //sch-addr-01 -->
      </div>
    `;

    document.getElementById(this.state.target)!.innerHTML = template;
    this.afterRender();
  }

  getJusoList() {
    const that = this;
    let template = '';
    if (this.state.jusoResult?.juso.length > 0) {
      $("#"+this.state.target+"doro > p").hide();//안내문구 숨김
      template += this.state.jusoResult.juso.map((item: any, index: number) => {
        let fullDoroAddr = item.siNm+" "+item.sggNm+" "+item.rn+" "+item.buldMnnm;
        fullDoroAddr = item.buldSlno != "0" ? fullDoroAddr += "-"+item.buldSlno : fullDoroAddr;
        fullDoroAddr += " ("+item.emdNm
        fullDoroAddr = item.bdnm ? fullDoroAddr += ","+item.bdnm+") " : fullDoroAddr += ")"; 
        
        let fullAddr = item.siNm+" "+item.sggNm+" "+item.emdNm+" "+item.lnbrMnnm;
        fullAddr = item.lnbrSlno != "0" ? fullAddr += "-"+item.lnbrSlno : fullAddr;
        fullAddr = item.bdNm ? fullAddr += " "+item.bdNm : fullAddr;
        return `
        <div class="jusolist">
          <div class="postal">
            <a href="javascript:;"
              onclick="${that.state.path}.handleSelectJuso('${index}')">
              ${item.zipNo}
            </a>
          </div>
          <div class="addr">
            <a href="javascript:;"
              onclick="${that.state.path}.handleSelectJuso('${index}')">
              <span>${fullDoroAddr}</span>
              <span>${fullAddr}</span>
            </a>
          </div>
        </div> 
        `;
      }).join('');
    } else {
      $("#"+this.state.target+"doro > p").show();//안내문구 노출
      template += `
      <div class="jusolist">
        <div>검색결과가 존재하지 않습니다.</td>  
      </div>      
      `;
    }

    return template;
  }

  afterRender() {
    this.renderJusoResult();
    this.setEventListeners();
  }

  renderJusoNavigation() {
    const navi = [];
    if (this.state.jusoResult) {

      // 마지막 페이지를 계산한다.
      const lastPage = Math.floor(this.state.jusoResult.meta.totalCount / 10) + 1;
      // 해당 페이지가 속하는 5개 페이지의 첫번째 페이지 인덱스를 계산한다.
      const startPage = ((Math.floor((+this.state.jusoParams.currentPage - 1) / 5)) * 5) + 1
      // 표출된 5개의 페이지 다음페이지, 이전페이지로 이동한다. 
      const prevIndex = startPage - 1 < 1 ? 1 : startPage - 1;


      navi.push(`
        <!-- 주소검색결과 페이지 Nav -->
        <div class="sch-addr-re-nav">
      `);

      if (+this.state.jusoParams.currentPage > 5) {
        navi.push(`
            <a href="javascript:;" 
              onclick="${this.state.path}.handleDoroSearch('1')"
              title="맨앞"><img src="/images/ncitizen/ico-prev2.png" alt="맨앞"></a>
            <a href="javascript:;" 
              onclick="${this.state.path}.handleDoroSearch('${prevIndex}')"
              title="이전"><img src="/images/ncitizen/ico-prev.png" alt="이전"></a>
        `);
      }


      for (let i = startPage; i <= lastPage && i < startPage + 5; i++) {
        if (i === +this.state.jusoParams.currentPage) {
          navi.push(`<a href="javascript:;" 
            onclick="${this.state.path}.handleDoroSearch('${i}')"
            class="on" title="현재 페이지">${i}</a>`);
        } else {
          navi.push(`<a href="javascript:;"
            onclick="${this.state.path}.handleDoroSearch('${i}')"
            >${i}</a>`);
        }
      }

      const nextIndex = startPage + 5 > lastPage ? lastPage : startPage + 5;
      if (lastPage !== nextIndex) {
        navi.push(`
            <a href="javascript:;" 
              onclick="${this.state.path}.handleDoroSearch('${nextIndex}')"
              title="다음"><img src="/images/ncitizen/ico-next.png" alt="다음"></a>
            <a href="javascript:;" id="lastPage"
              onclick="${this.state.path}.handleDoroSearch('${lastPage}')"
              title="맨뒤"><img src="/images/ncitizen/ico-next2.png" alt="맨뒤"></a>
        `);
      }
      navi.push("          </div>");

      return navi.join('');
    }
    else {
      navi.push(`
          <!-- 주소검색결과 페이지 Nav -->
          <div class="sch-addr-re-nav">
            <a href="javascript:;" title="맨앞"><img src="/images/ncitizen/ico-prev2.png" alt="맨앞"></a>
            <a href="javascript:;" title="이전"><img src="/images/ncitizen/ico-prev.png" alt="이전"></a>
        `);
      navi.push('<a href="javascript:;" class="on" title="현재 페이지">1</a>');
      navi.push(`
          <a href="javascript:;" title="다음"><img src="/images/ncitizen/ico-next.png" alt="다음"></a>
          <a href="javascript:;" title="맨뒤"><img src="/images/ncitizen/ico-next2.png" alt="맨뒤"></a>
        </div>
      `);

      return navi.join('');
    }
  }

  renderJusoResult() {
    const that = this;
    const template = `
      <div class="jusotable">
        <div class="header">
          <div class="postal">우편번호</div>
          <div class="addr">주소</div>
        </div>
        <div class="body" id="resultBody1">
         `+ this.getJusoList() + `            
        </div>
      </div>
    ` + this.renderJusoNavigation();
    document.getElementById(this.state.target + 'jusoresult')!.innerHTML = template;
  }
  
  renderJusoDetail() {
    const that = this;
    const jusoSelect = that.state.jusoSelect;
    const template = `
      <div class="detail-addr" style="text-align : center;">
        <div>
          <span class="sr-only">상세주소</span></label>
          <span>${jusoSelect.selectAddr}</span>
        </div>
        <div>
          <span class="sr-only">상세주소</span></label>
          <input type="text" 
            onkeyup="${that.state.path}.handleDetailAddr(event)"
            onchange="${that.state.path}.handleDetailAddr(event)"
            onpaste="${that.state.path}.handleDetailAddr(event)"                          
            value="${jusoSelect.selectDetailAddr}"
            id="searchDetail" class="input-box input-w-1" placeholder="상세주소">
          <a class="btn btnSS btnTypeA btnSingle" href="javascript:;" onclick="${that.state.path}.handleSelectOk()" title="확인"><span>확인</span></a>
        </div>
      </div>
    `;
    //searchform
    document.getElementById(this.state.target+'Searchform')!.innerHTML = template;
  }
}