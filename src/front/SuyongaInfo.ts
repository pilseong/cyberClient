import { fetch } from "./../util/unity_resource";
import InfoPanel from "./../util/InfoPanel";
import CyberMinwon from "../CyberMinwon";

declare var document: any;
declare var alert_msg: (msg: string) => void;
declare var cyberMinwon: CyberMinwon;
declare var gContextUrl: string;
declare var $: any;
declare var getDoroAddrFromOwner: (prefix: string, body: any) => string;
declare var fncTrim: (str: string) => string;

export default class SuyongaInfo {
  state: any;
  suyongaInfoPanel: InfoPanel;

  constructor(parent: any) {
    this.state = {
      // 부모 즉 프로그램 전체를 감싸는 UnityMinwon의 객체를 참조한다.
      parent,
      // suyongaInfo는 화면 표출을 위한 상태를 저장하는 속성이다.
      suyongaInfo: {
        suyongaNumber: '',
        suyongaName: '',
        suyongaPostNumber: '',
        suyongaBusinessType: '',
        mkey: '',
        csNo: '',
        csOfficeCd: '',
        ownerNm: '',
        usrName: '',
        mtrLoc: '',
        zip1: '',
        zip2: '',
        csAddr1: '',
        csAddr2: '',
        usrTel: '',
        hshldCnt: '',
        idtCdS: '',
        idtCdSNm: '',
        cbCd: '',
        cbCdNm: '',
        tapNo: '',
        vesslNo: '',
        preSealYear: '',
        lipipeCbCd: '',
        gcYy: '',
        gcMm: '',
        gcDd: '',
        idtCdH: '',
        idtCdHNm: '',
        gcThsmmPointer: '',
        csGuCd: '',
        csHdongCd: '',
        csBdongCd: '',
        usrIdNo: '',
        autoPayFlag: '',
        autoPayFlagNm: '',
        ugOpenDay: '',
        recipterHshldCnt: '',
        cgExceptAdjRsnCd: '',
        oldExemptCd: '',
        hRdCd: '',
        hRdrate: '',
        wAlotmRdCd: '',
        wAlotmRdrate: '',
        tapStatusCd: '',
        ugStatusCd: '',
        swaterdspsMth: '',
        docSealNo: '',
        area: '',
        tapOpenDay: '',
        csSido: '',
        csGuCdNm: '',
        csRn: '',
        csBldBon: '',
        csBldBu: '',
        csSan: '',
        csBon: '',
        csBu: '',
        csBldDong: '',
        csBldHo: '',
        csUgFlag: '',
        csUgFloorNo: '',
        csEtcAddr: '',
        csBldNm: '',
        csBdongCdNm: '',
        reqAddr1: '',
        reqAddr2: '',
        reqSido: '',
        reqGuCdNm: '',
        reqRn: '',
        reqBldBon: '',
        reqBldBu: '',
        reqSan: '',
        reqBon: '',
        reqBu: '',
        reqBldDong: '',
        reqBldHo: '',
        reqUgFlag: '',
        reqUgFloorNo: '',
        reqEtcAddr: '',
        reqBldNm: '',
        reqBdongCdNm: '',
        vsgGbn: '',
        gtnSeCd: '',
        csStdBdongCd: '',
        csApthouseCd: '',
        reqStdBdongCd: '',
        premmPointer: '',
        csJCnt: '',
        csHdongCdNm: '',
        mblckCd: '',
        mblckCdNm: '',
        sblckCd: '',
        sblckCdNm: '',
        ctcharCd: '',
        ctcharCdNm: '',
        srvrsvCd: '',
        srvrsvCdNm: '',
        mtrTypeCd: '',
        mtrTypeCdNm: '',
        tapLocCd: '',
        tapLocCdNm: '',
        tapLocDetailCd: '',
        tapLocDetailCdNm: '',
        mpcMtrqlt: '',
        mpcStatus: '',
        mrnrBxStatus: '',
        wplmStatus: '',
        wpMtrqlt: ''
        //
      },
      // viewSuyongaInfo는 수용가의 효면 표출용 변수들이다.      
      viewSuyongaInfo: {
        viewUserName: ['', '사용자'],
        viewOwnerName: ['', '소유자'],
        viewOwnerNumber: ['', '수용가번호'],
        viewItemNumber: ['', '기물번호'],
        viewDoroJuso: ['', '도로명주소'],
        viewPostNumberJibeunJuso: ['', '지번주소'],
        viewBusinessTypeDiameter: ['', '업종/계량기'],
      },
      searchYN: false
    }

    this.suyongaInfoPanel = new InfoPanel('',
      this.state.parent, this, 'getSuyongaView');
  }

  setState(nextState: any) {
    if (this.state !== nextState)
      this.state = nextState;
  }

  // 컴포넌트에서 처리하는 이벤트를 등록한다. template 함수 호출 방식도 가능하다.
  setEventListeners() {
    // 수용가 검색 버튼 연동
    document.getElementById('suyongaSearch').addEventListener('click', (e: any) => {
      e.preventDefault();

      //화면별 수용가 조회전 고객번호가 민원 신청에 적합한지 검증 함수 호출
      var unityMinwonState = cyberMinwon.state.unityMinwon.state;
      if (unityMinwonState.steps[unityMinwonState.minwonCd].step[1].possibleApplyChk) {
        if (!unityMinwonState.steps[unityMinwonState.minwonCd].step[1].possibleApplyChk(this.state.suyongaInfo.suyongaNumber)) {//함수 결과 신청 불가능
          return false;
        } else {//함수가 있고 신청이 가능
          this.fncSearchCustomer();
        }
      } else {//possibleApplyChk함수가 없을 경우
        this.fncSearchCustomer();
      }
    });
  }

  // 수용가 검색 조회시 0을 앞에 삽입한다.
  zeroFill(number: number, width: number) {
    width -= number.toString().length;
    if (width > 0) {
      return new Array(width + (/\./.test(String(number)) ? 2 : 1)).join('0') + number;
    }
    return number + ""; // always return a string
  }

  verify() {
    if (!this.state.searchYN) {
      alert('수용가가 정상적으로 조회되지 않았습니다.')
      return false;
    }
    return true;
  }

  // 수용가 번호 연동
  handleSuyongaNumber(e: any) {
    console.log(e.target.value.substring(0, 9));
    this.setState({
      ...this.state,
      suyongaInfo: {
        ...this.state.suyongaInfo,
        suyongaNumber: e.target.value.substring(0, 9)
      }
    });
    e.target.value = this.state.suyongaInfo.suyongaNumber.substring(0, 9);
  }

  // 수용가 이름 연동
  handleSuyongaName(e: any) {
    console.log(e.target.value.substring(0, 20));

    this.setState({
      ...this.state,
      suyongaInfo: {
        ...this.state.suyongaInfo,
        suyongaName: e.target.value.substring(0, 20)
      },
    });
    e.target.value = this.state.suyongaInfo.suyongaName.substring(0, 20);
  }

  // 수용가 조회를 클릭했을 때 실행
  fncSearchCustomer() {
    // 콜백함수를 위해 context binding이 필요하다.
    const that = this;
    if (!this.state.suyongaInfo.suyongaName) {
      alert_msg('수용가를 입력해주세요');
      $("#suyongaName").select();
      return false;
    }

    if (!this.state.suyongaInfo.suyongaNumber) {
      alert_msg('고객번호를 정확히 입력해주세요');
      $("#suyongaNumber").select();
      return false;
    }
    var paddedNumber = this.zeroFill(this.state.suyongaInfo.suyongaNumber, 9);


    var url = gContextUrl + "/citizen/common/listOwnerInqireByMgrNo.do";
    var queryString = "mkey=" + paddedNumber + "&minwonCd=" + this.state.minwonCd;

    // 수용가 데이터를 조회해 온다. arrow function을 지원하지 않기 때문에 that을 사용
    fetch('GET', url, queryString, function (error: any, data: any) {
      // 에러가 발생한 경우
      if (error) {
        alert_msg("고객번호와 수용가명을 다시 확인하시고 검색해주세요.");
        return;
      }

      if (data.result.status === 'FAILURE') {
        // 나중에 슬라이드 alert으로 변경
        alert_msg("고객번호와 수용가명을 다시 확인하시고 검색해주세요.");
        that.setState({
          ...that.state,
          searchYN: false,
          suyongaInfo: {
            suyongaNumber: that.state.suyongaInfo.suyongaNumber,
            suyongaName: that.state.suyongaInfo.suyongaName
          }
        });

        that.render();
        return;
      }

      const suyongaInfo = data.business.bodyVO

      that.state.parent.setState({
        ...that.state.parent.state,
        suyonga: suyongaInfo
      });

      that.setState({
        ...that.state,
        searchYN: true,
        suyongaInfo: {
          suyongaNumber: suyongaInfo.mkey,
          suyongaName: suyongaInfo.usrName,
          suyongaPostNumber: suyongaInfo.zip1 + suyongaInfo.zip2,
          suyongaNameBusinessType: suyongaInfo.idtCdSNm,
          mkey: suyongaInfo.mkey,
          csNo: suyongaInfo.csNo,
          csOfficeCd: suyongaInfo.csOfficeCd,
          ownerNm: suyongaInfo.ownerNm,
          usrName: suyongaInfo.usrName,
          mtrLoc: suyongaInfo.mtrLoc,
          zip1: suyongaInfo.zip1,
          zip2: suyongaInfo.zip2,
          csAddr1: suyongaInfo.csAddr1,
          csAddr2: suyongaInfo.csAddr2,
          usrTel: suyongaInfo.usrTel,
          hshldCnt: suyongaInfo.hshldCnt,
          idtCdS: suyongaInfo.idtCdS,
          idtCdSNm: suyongaInfo.idtCdSNm,
          cbCd: suyongaInfo.cbCd,
          cbCdNm: suyongaInfo.cbCdNm.split("mm")[0],
          tapNo: suyongaInfo.tapNo,
          vesslNo: suyongaInfo.vesslNo,
          preSealYear: suyongaInfo.preSealYear,
          lipipeCbCd: suyongaInfo.lipipeCbCd,
          gcYy: suyongaInfo.gcYy,
          gcMm: suyongaInfo.gcMm,
          gcDd: suyongaInfo.gcDd,
          idtCdH: suyongaInfo.idtCdH,
          idtCdHNm: suyongaInfo.idtCdHNm,
          gcThsmmPointer: suyongaInfo.gcThsmmPointer,
          csGuCd: suyongaInfo.csGuCd,
          csHdongCd: suyongaInfo.csHdongCd,
          csBdongCd: suyongaInfo.csBdongCd,
          usrIdNo: suyongaInfo.usrIdNo,
          autoPayFlag: suyongaInfo.autoPayFlag,
          autoPayFlagNm: suyongaInfo.autoPayFlagNm,
          ugOpenDay: suyongaInfo.ugOpenDay,
          recipterHshldCnt: suyongaInfo.recipterHshldCnt,
          cgExceptAdjRsnCd: suyongaInfo.cgExceptAdjRsnCd,
          oldExemptCd: suyongaInfo.oldExemptCd,
          hRdCd: suyongaInfo.hRdCd,
          hRdrate: suyongaInfo.hRdrate,
          wAlotmRdCd: suyongaInfo.wAlotmRdCd,
          wAlotmRdrate: suyongaInfo.wAlotmRdrate,
          tapStatusCd: suyongaInfo.tapStatusCd,
          ugStatusCd: suyongaInfo.ugStatusCd,
          swaterdspsMth: suyongaInfo.swaterdspsMth,
          docSealNo: suyongaInfo.docSealNo,
          area: suyongaInfo.area,
          tapOpenDay: suyongaInfo.tapOpenDay,
          csSido: suyongaInfo.csSido,
          csGuCdNm: suyongaInfo.csGuCdNm,
          csRn: suyongaInfo.csRn,
          csBldBon: suyongaInfo.csBldBon,
          csBldBu: suyongaInfo.csBldBu,
          csSan: suyongaInfo.csSan,
          csBon: suyongaInfo.csBon,
          csBu: suyongaInfo.csBu,
          csBldDong: suyongaInfo.csBldDong,
          csBldHo: suyongaInfo.csBldHo,
          csUgFlag: suyongaInfo.csUgFlag,
          csUgFloorNo: suyongaInfo.csUgFloorNo,
          csEtcAddr: suyongaInfo.csEtcAddr,
          csBldNm: suyongaInfo.csBldNm,
          csBdongCdNm: suyongaInfo.csBdongCdNm,
          reqAddr1: suyongaInfo.reqAddr1,
          reqAddr2: suyongaInfo.reqAddr2,
          reqSido: suyongaInfo.reqSido,
          reqGuCdNm: suyongaInfo.reqGuCdNm,
          reqRn: suyongaInfo.reqRn,
          reqBldBon: suyongaInfo.reqBldBon,
          reqBldBu: suyongaInfo.reqBldBu,
          reqSan: suyongaInfo.reqSan,
          reqBon: suyongaInfo.reqBon,
          reqBu: suyongaInfo.reqBu,
          reqBldDong: suyongaInfo.reqBldDong,
          reqBldHo: suyongaInfo.reqBldHo,
          reqUgFlag: suyongaInfo.reqUgFlag,
          reqUgFloorNo: suyongaInfo.reqUgFloorNo,
          reqEtcAddr: suyongaInfo.reqEtcAddr,
          reqBldNm: suyongaInfo.reqBldNm,
          reqBdongCdNm: suyongaInfo.reqBdongCdNm,
          vsgGbn: suyongaInfo.vsgGbn,
          gtnSeCd: suyongaInfo.gtnSeCd,
          csStdBdongCd: suyongaInfo.csStdBdongCd,
          csApthouseCd: suyongaInfo.csApthouseCd,
          reqStdBdongCd: suyongaInfo.reqStdBdongCd,
          premmPointer: suyongaInfo.premmPointer,
          csJCnt: suyongaInfo.csJCnt,
          csHdongCdNm: suyongaInfo.csHdongCdNm,
          mblckCd: suyongaInfo.mblckCd,
          mblckCdNm: suyongaInfo.mblckCdNm,
          sblckCd: suyongaInfo.sblckCd,
          sblckCdNm: suyongaInfo.sblckCdNm,
          ctcharCd: suyongaInfo.ctcharCd,
          ctcharCdNm: suyongaInfo.ctcharCdNm,
          srvrsvCd: suyongaInfo.srvrsvCd,
          srvrsvCdNm: suyongaInfo.srvrsvCdNm,
          mtrTypeCd: suyongaInfo.mtrTypeCd,
          mtrTypeCdNm: suyongaInfo.mtrTypeCdNm,
          tapLocCd: suyongaInfo.tapLocCd,
          tapLocCdNm: suyongaInfo.tapLocCdNm,
          tapLocDetailCd: suyongaInfo.tapLocDetailCd,
          tapLocDetailCdNm: suyongaInfo.tapLocDetailCdNm,
          mpcMtrqlt: suyongaInfo.mpcMtrqlt,
          mpcStatus: suyongaInfo.mpcStatus,
          mrnrBxStatus: suyongaInfo.mrnrBxStatus,
          wplmStatus: suyongaInfo.wplmStatus,
          wpMtrqlt: suyongaInfo.wpMtrqlt
        },

        viewSuyongaInfo: {
          viewUserName: [suyongaInfo.usrName, '사용자'],
          viewOwnerName: [suyongaInfo.ownerNm, '소유자'],
          viewOwnerNumber: [suyongaInfo.mkey, '수용가번호'],
          viewItemNumber: [suyongaInfo.vesslNo, '기물번호'],
          viewDoroJuso: [getDoroAddrFromOwner('cs', suyongaInfo), '도로명주소'],
          viewPostNumberJibeunJuso: [suyongaInfo.zip1 + suyongaInfo.zip2 + " " +
            fncTrim(suyongaInfo['csSido']) + " " +
            fncTrim(suyongaInfo['csAddr1']) + " " +
            fncTrim(suyongaInfo['csAddr2']), '지번주소'],
          viewBusinessTypeDiameter: [suyongaInfo.idtCdSNm + '/' + suyongaInfo.cbCdNm, '업종/계량기']
        }
      });

      for (const minwonCd in that.state.parent.state.parent.state.steps) {
        that.state.parent.state.parent.state.steps[minwonCd].step[1].setInitValue(paddedNumber);
      }

      console.log('after fetching', that.state);
      that.render();
    });
  }

  // InfoPanel 데이터 설정
  getSuyongaView() {
    return {
      viewSuyongaInfo: {
        ...this.state.viewSuyongaInfo,
        title: '수용가 정보'
      }
    }
  }

  render() {
    const that = this;
    let template = `
      <div id="form-mw1" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw1');" title="닫기">
          <span class="i-10">수용가정보</span></a>
        </div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul id="suyongaInput">
              <li>
                <label for="owner_mkey" class="input-label">
                  <span class="form-req">고객번호</span></label>
                  <input type="text"
                    id="owner_mkey"
                    onkeyup="cyberMinwon.state.currentModule.state.currentPage.state.suyongaInfo.handleSuyongaNumber(event)" 
                    onpaste="cyberMinwon.state.currentModule.state.currentPage.state.suyongaInfo.handleSuyongaNumber(event)"
                    value="${that.state.suyongaInfo.suyongaNumber || ''}"
                    class="input-box" 
                    placeholder="고객번호">
                <a class="btn btnSS btnTypeA" onclick="javascript:fncSearchCyberMkey()"><span>고객번호 검색</span></a>
                <p class="form-cmt">* 고객번호는 <a href="#">수도요금 청구서 [위치보기]</a> 로 확인할 수 있습니다.</p>
              </li>
              <li>
                <label for="owner_ownerNm" class="input-label">
                  <span class="form-req">수용가(성명)</span></label>
                  <input id="owner_ownerNm" value="${that.state.suyongaInfo.suyongaName || ''}"
                    onkeyup="cyberMinwon.state.currentModule.state.currentPage.state.suyongaInfo.handleSuyongaName(event)" 
                    onpaste="cyberMinwon.state.currentModule.state.currentPage.state.suyongaInfo.handleSuyongaName(event)"
                    type="text" id="suyongaName" class="input-box" placeholder="수용가 이름">
                <a class="btn btnSS btnTypeA" id="suyongaSearch"><span>수용가 검색</span></a>
                <p class="form-cmt">* 고객번호를 입력하고 수용가 이름으로 검색하세요.</p>
              </li>
            </ul>
          </div>
        </div>
      </div><!-- //form-mw1 -->    
    `;

    document.getElementById('suyonga').innerHTML = template;

    this.afterRender();
  }

  afterRender() {
    // 데이터는 immutable 이기 때문에 랜더링 전에 데이터를 전달해야 한다.
    // 화면에 추가로 붙이는 부분들은 전체 화면이 그려진 후에 처리되어야 한다.
    // Info 패널을 그려준다.
    if (this.state.searchYN) {
      const $target = document.getElementById('suyongaInput');
      $target.innerHTML = $target.innerHTML + this.suyongaInfoPanel.render();
    }

    // 이벤트를 수동으로 등록해 준다.
    this.setEventListeners();
  }
}