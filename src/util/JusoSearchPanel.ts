import { fetch } from './unity_resource';
import { addMW, removeMW, showElement, hideElement } from './uiux-common';

declare var gVariables: any;
declare var fncGetCodeByGroupCd: any;
declare var gContextUrl: string;
declare var alert_msg: (msg: string) => void;


export default class JusoSearchPanel {
  state: {
    parent: any;
    path: string;
    target: any;
    callback: (data: any) => void
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
  }
  constructor(parent: any, path: string, target: string, callback: (jusoInfo: any) => void) {
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
      }
    }
  }

  setState(nextState: any) {
    if (this.state !== nextState)
      this.state = nextState;
  }

  handleSidoList() {
    gVariables['sidoTy'] = fncGetCodeByGroupCd("sidoCs");
  }

  handleDoroSearch(page: string) {
    const that = this;

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

    console.log(jusoKeyword);

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
        alert_msg("서버가 응답하지 않습니다. 잠시 후 다시 조회해 주세요.");
        return;
      }

      that.setState({
        ...that.state,
        jusoResult: {
          juso: data.results.juso,
          meta: data.results.common
        }
      })
      console.log(data);
      console.log('after fetching', that.state);
      that.renderJusoResult();
    });
  }

  // 신청 구분에 따른 UI 활성화
  toggleUIGubun(gubun: string) {
    this.renderJusoSearchUI(gubun);
    this.setState({
      ...this.state,
      jusosearchMethod: gubun
    });

    //    if (gubun === '3') {
    //      const sido = fncGetCodeByGroupCd("sidoCs");
    //      console.log(sido);
    //    }

    console.log(this.state);
  }

  handleDongKeyword(e: any) {
    e.preventDefault();
    console.log(e.target.value.substring(0, 50));
    const jusoParams = this.state.jusoParams;

    this.setState({
      ...this.state,
      jusoParams: {
        ...this.state.jusoParams,
        dongKeyword: e.target.value.substring(0, 50)
      }
    });
    e.target.value = this.state.jusoParams.dongKeyword.substring(0, 50);
    console.log(this.state);
  }

  handleJibeunKeyword(e: any) {
    e.preventDefault();
    console.log(e.target.value.substring(0, 50));
    const jusoParams = this.state.jusoParams;

    this.setState({
      ...this.state,
      jusoParams: {
        ...this.state.jusoParams,
        jibeunKeyword: e.target.value.substring(0, 50)
      }
    });
    e.target.value = this.state.jusoParams.jibeunKeyword.substring(0, 50);
    console.log(this.state);
  }

  handleDoroKeyword(e: any) {
    e.preventDefault();
    console.log(e.target.value.substring(0, 20));
    const jusoParams = this.state.jusoParams;

    this.setState({
      ...this.state,
      jusoParams: {
        ...this.state.jusoParams,
        doroKeyword: e.target.value.substring(0, 20)
      }
    });
    e.target.value = this.state.jusoParams.doroKeyword.substring(0, 20);
  }

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

  // 특정 주소를 설정한 경우 부모의 데이터에 매핑하여 입력한다.
  handleSelectJuso(index: string) {
    this.state.callback(this.state.jusoResult.juso[index]);
  }

  render() {
    const that = this;
    let template = `     
      <label for="form-mw46-tx"><span class="sr-only">주소검색선택</span></label>
      <ul class="mw-opt mw-opt-6 row">
        <li id="${that.state.target}aGubun1" class="aGubun on"><a href="javascript:void(0);"
            onClick="${that.state.path}.toggleUIGubun('1');">
          <span>도로명</span></a>
        </li>
        <li id="${that.state.target}aGubun2" class="aGubun off"><a href="javascript:void(0);"
            onClick="${that.state.path}.toggleUIGubun('2');">
          <span>지번</span></a>
        </li>
      </ul>
      
      <div id="form-mw23-info" class="form-info-box">
        <div id="sch-addr-01" class="sch-addr display-block row">
          <div id="searchform">
            <!-- 도로명주소 검색 -->
            <div id="${that.state.target}doro" class="display-block">
              <label for="form-mw46-tx"><span class="sr-only">도로명주소</span></label>
              <input type="text" 
                onkeyup="${that.state.path}.handleDoroKeyword(event)"
                onpaste="${that.state.path}.handleDoroKeyword(event)"                          
                value="${that.state.jusoParams.doroKeyword}"
                id="form-mw46-tx" class="input-box input-w-1" placeholder="도로명주소">
              <a class="btn btnSS" 
                onclick="${that.state.path}.handleDoroSearch('1');">
                <span>주소검색</span>
              </a>
              <p class="form-cmt form-cmt-1 txStrongColor">* 도로명주소로 검색하세요.</p>
            </div>
      
            <!-- 지번주소 검색 -->
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
              <a class="btn btnSS" 
                onclick="${that.state.path}.handleDoroSearch('1');">
                <span>주소검색</span>
              </a>
              <p class="form-cmt form-cmt-1 txStrongColor">* 지번주소로 검색하세요.</p>
            </div>
          </div>
          <!-- 검색결과 -->
          <div id="${that.state.target}jusoresult" class="jusoresult"></div>
        </div><!-- //sch-addr-01 -->
      </div>
    `;

    document.getElementById(this.state.target)!.innerHTML = template;
    this.afterRender();
  }

  getJusoList() {
    const that = this;
    let template = '';
    if (this.state.jusoResult?.juso) {
      template += this.state.jusoResult.juso.map((item: any, index: number) => {
        return `
        <div class="jusolist">
          <div class="postal">
            <a href="javascript:;"
              onclick="${that.state.path}.handleSelectJuso('${index}')">
              ${item.zipNo}
            </button>
          </div>
          <div class="addr">
            <a href="javascript:;"
              onclick="${that.state.path}.handleSelectJuso('${index}')">
              ${item.roadAddr}
            </a>
          </div>
        </div> 
        `;
      }).join('');
    } else {
      template += `
      <div class="jusolist">
        <div>검색결과가 존재하지 않습니다.</td>  
      </div>      
      `;
    }

    return template;
  }

  afterRender() {
    this.renderJusoSearchUI(this.state.jusosearchMethod);
    this.renderJusoResult();
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
        console.log(i, this.state.jusoParams.currentPage);
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
            <a href="javascript:;" 
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
}