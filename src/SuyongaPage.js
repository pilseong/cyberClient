/**
 *  수용가 정보와 신청인 정보를 관리하는 컴포넌트 
 */
class SuyongaPage {
  constructor(parent, root) {
    this.state = {
      // 부모 즉 프로그램 전체를 감싸는 UnityMinwon의 객체를 참조한다.
      parent,
      root,
      // suyongaInfo는 화면 표출을 위한 상태를 저장하는 속성이다.
      suyongaInfo: {
        suyongaNumber: '',
        suyongaName: '',
        suyongaPostNumber: '',
        suyongaBusinessType: '',
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
      // applyInfo은 신청인 정보를 저장하는 곳이다.
      applyInfo: {
        applyName: '',
        applyPostNumber: '',
        applyAddress: '',
        applyPhone: '',
        applyMobile: '',
        applyEmailId: '',
        applyEmailProvider: '',
        applyEmailProviderSelector: '',
        applyRelation: '',
        applyAgree: ''
      },
      // 신청인의 뷰를 데이터를 저장한다.
      viewApplyInfo: {
        viewApplyName: ['', '신청인'],
        viewApplyAddress: ['', '도로명주소'],
        viewApplyPhone: ['', '일반전화'],
        viewApplyMobile: ['', '연락처'],
        viewApplyEmail: ['', '이메일'],
        viewApplyRelation: ['', '관계']
      },
      searchYN: false
    };

    this.suyongaInfoPanel = new InfoPanel('',
      this.state.parent, 'this.root.state.suyongaInfoPage.state.viewSuyongaInfo');
  }

  fetch(method, url, queryString, callback) {
    const thisClass = this;
    $.ajax({
      type: method,
      async: false,
      url: url,
      data: queryString,
      dataType: 'json',
      error: function (xhr, status, error) {
        callback(error, null);
      },
      success: function (data) {
        callback(null, data);
      }
    });
  }

  setState(nextState) {
    this.state = nextState;
  }

  // 컴포넌트에서 처리하는 이벤트를 등록한다. template 함수 호출 방식도 가능하다.
  setEventListeners() {
    // 수용가 검색 버튼 연동
    document.getElementById('suyongaSearch').addEventListener('click', (e) => {
      e.preventDefault();
      this.fncSearchCustomer(this.state.mionwonCd);
    });
  }

  // 수용가 검색 조회시 0을 앞에 삽입한다.
  zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
      return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number + ""; // always return a string
  }

  // 수용가 번호 연동
  handleSuyongaNumber(e) {
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
  handleSuyongaName(e) {
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

  // 신청인 이름 타이핑 매핑
  handleApplyName(e) {
    console.log(e.target.value.substring(0, 20));
    const viewInfo = this.state.viewApplyInfo

    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        applyName: e.target.value.substring(0, 20)
      },
      viewApplyInfo: {
        ...this.state.viewApplyInfo,
        viewApplyName: viewInfo.viewApplyName.map(function (item, index) {
          return index === 0 ? e.target.value.substring(0, 20) : item;
        })
      }
    });
    e.target.value = this.state.applyInfo.applyName.substring(0, 20);
    console.log(this.state);
  }

  handleCopyOwnerName(e) {
    const viewSourceInfo = this.state.viewSuyongaInfo;
    const viewDestInfo = this.state.viewApplyInfo;

    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        applyName: viewSourceInfo.viewOwnerName[0]
      },
      viewApplyInfo: {
        ...viewDestInfo,
        viewApplyName: viewDestInfo.viewApplyName.map(function (item, index) {
          return index === 0 ? viewSourceInfo.viewOwnerName[0] : item;
        })
      }
    });
    this.render();
    console.log(this.state);
  }

  handleCopyUserName(e) {
    const viewSourceInfo = this.state.viewSuyongaInfo;
    const viewDestInfo = this.state.viewApplyInfo;

    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        applyName: this.state.viewSuyongaInfo.viewUserName[0]
      },
      viewApplyInfo: {
        ...viewDestInfo,
        viewApplyName: viewDestInfo.viewApplyName.map(function (item, index) {
          return index === 0 ? viewSourceInfo.viewUserName[0] : item;
        })
      }
    });
    this.render();
    console.log(this.state);
  }

  // 수용가의 주소를 복사해서 신청인 주소에 입력한다.
  // 신청인 주소와 함께 우편번호도 복사해야 한다.
  // 주의점은 View 주소에는 우편번호와 주소 모두 포함되어야 한다.
  handleCopySuyongaAddress(e) {
    const viewSourceInfo = this.state.viewSuyongaInfo;
    const viewDestInfo = this.state.viewApplyInfo;
    const suyongaInfo = this.state.suyongaInfo;
    
    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        // 신청인 주소에 도로 주소를 복사한다.
        applyAddress: viewSourceInfo.viewDoroJuso[0],
        // 신청인의 우편번호에 수용가 우편번호를 넣는다.
        applyPostNumber: suyongaInfo.suyongaPostNumber
      },
      viewApplyInfo: {
        ...viewDestInfo,
        viewApplyAddress: viewDestInfo.viewApplyAddress.map(function (item, index) {
          return index === 0 ? suyongaInfo.suyongaPostNumber + " " + viewSourceInfo.viewDoroJuso[0] : item;
        })
      }
    });
    this.render();
    console.log(this.state);
  }


  // 신청인 전화번호 연동
  handleApplyPhone(e) {
    console.log(e.target.value.substring(0, 10));
    const viewInfo = this.state.viewApplyInfo

    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        applyPhone: e.target.value.substring(0, 10)
      },
      viewApplyInfo: {
        ...this.state.viewApplyInfo,
        viewApplyPhone: viewInfo.viewApplyPhone.map(function (item, index) {
          return index === 0 ? e.target.value.substring(0, 10) : item;
        })
      }
    });
    e.target.value = this.state.applyInfo.applyPhone.substring(0, 10);
  }

  // 신청인 휴대번호 연동
  handleApplyMobile(e) {
    console.log(e.target.value.substring(0, 11));
    const viewInfo = this.state.viewApplyInfo

    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        applyMobile: e.target.value.substring(0, 11)
      },
      viewApplyInfo: {
        ...this.state.viewApplyInfo,
        viewApplyMobile: viewInfo.viewApplyMobile.map(function (item, index) {
          return index === 0 ? e.target.value.substring(0, 11) : item;
        })
      }
    });
    e.target.value = this.state.applyInfo.applyMobile.substring(0, 11);
  }

  // 이미메일 id 입력 연동
  handleApplyEmailId(e) {
    const that = this;
    const viewInfo = this.state.viewApplyInfo;

    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        applyEmailId: e.target.value.substring(0, 30)
      },
      viewApplyInfo: {
        ...this.state.viewApplyInfo,
        viewApplyEmail: viewInfo.viewApplyEmail.map(function (item, index) {
          return index === 0 ?
            e.target.value.substring(0, 30) +
            (that.state.applyInfo.applyEmailProvider ? '@' + that.state.applyInfo.applyEmailProvider : '')
            : item;
        })
      }
    });
    console.log(this.state.viewApplyInfo.viewApplyEmail);
    e.target.value = this.state.applyInfo.applyEmailId.substring(0, 30);
  }

  // 이메일 공급자를 리스트에서 선택할 경우
  handleApplyEmailProviderSelector(e) {
    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        // 공급자의 domain을 공급자로 저장한다.
        applyEmailProvider: e.target.value,
        // 선택한 이메일 공급자의 index를 저장한다.
        applyEmailProviderSelector: e.target.options.selectedIndex
      }
    });
    this.render();

    var $applyEmailProviderSelector = document.getElementById("applyEmailProviderSelector");
    $applyEmailProviderSelector.options[this.state.applyInfo.applyEmailProviderSelector].selected = true;
  }

  // 이메일 공급자를 입력하는 루틴
  handleApplyEmailProvider(e) {
    const that = this;
    const viewInfo = this.state.viewApplyInfo;
    // 상태를 변경하기 전에 선택된 select 박스를 해지해 준다.
    if (this.state.applyInfo.applyEmailProviderSelector !== '') {
      const $applyEmailProviderSelector = document.getElementById("applyEmailProviderSelector");
      $applyEmailProviderSelector.options[this.state.applyInfo.applyEmailProviderSelector].selected = false;
    }

    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        applyEmailProvider: e.target.value.substring(0, 30),
        applyEmailProviderSelector: ''
      },
      viewApplyInfo: {
        ...this.state.viewApplyInfo,
        viewApplyEmail: viewInfo.viewApplyEmail.map(function (item, index) {
          return index === 0 ?
            (that.state.applyInfo.applyEmailId || '') + "@" + e.target.value.substring(0, 30)
            : item;
        })
      }
    });
    console.log(this.state.viewApplyInfo.viewApplyEmail);
    e.target.value = this.state.applyInfo.applyEmailProvider.substring(0, 30);
  }

  // 수용가 조회를 클릭했을 때 실행
  fncSearchCustomer(minwonCd) {
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
    this.fetch('GET', url, queryString, function (error, data) {
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

      console.log(that.state)
      that.setState({
        ...that.state,
        searchYN: true,
        suyongaInfo: {
          suyongaNumber: suyongaInfo.mkey,
          suyongaName: suyongaInfo.usrName,
          suyongaPostNumber: suyongaInfo.zip1 + suyongaInfo.zip2,
          suyongaNameBusinessType: suyongaInfo.idtCdSNm,
        },
        viewSuyongaInfo: {
          viewUserName: that.state.viewSuyongaInfo.viewUserName.map(function (item, index) {
            return index === 0 ? suyongaInfo.usrName : item;
          }),
          viewOwnerName: that.state.viewSuyongaInfo.viewOwnerName.map(function (item, index) {
            return index === 0 ? suyongaInfo.ownerNm : item;
          }),
          viewOwnerNumber: that.state.viewSuyongaInfo.viewOwnerNumber.map(function (item, index) {
            return index === 0 ? suyongaInfo.mkey : item;
          }),
          viewItemNumber: that.state.viewSuyongaInfo.viewItemNumber.map(function (item, index) {
            return index === 0 ? suyongaInfo.vesslNo : item;
          }),
          viewDoroJuso: that.state.viewSuyongaInfo.viewDoroJuso.map(function (item, index) {
            return index === 0 ? getDoroAddrFromOwner('cs', suyongaInfo) : item;
          }),
          viewPostNumberJibeunJuso:
            that.state.viewSuyongaInfo.viewPostNumberJibeunJuso.map(function (item, index) {
              return index === 0 ? suyongaInfo.zip1 + suyongaInfo.zip2 + " " +
                fncTrim(suyongaInfo['csSido']) + " " +
                fncTrim(suyongaInfo['csAddr1']) + " " +
                fncTrim(suyongaInfo['csAddr2']) : item;
            }),
          viewBusinessTypeDiameter: that.state.viewSuyongaInfo.viewBusinessTypeDiameter.map(function (item, index) {
            return index === 0 ? suyongaInfo.idtCdSNm + '/' + suyongaInfo.cbCdNm : item;
          })
        }
      });

      console.log('after fetching', that.state);
      that.render();
    });
  }

  // 화면을 그려주는 부분이다.
  render() {
    let template = `
      <div class="mw-box">
        <div id="form-mw1" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="showHideLayer('#form-mw1');" title="닫기">
            <span class="i-10">수용가정보</span></a>
          </div>
          <div class="form-mw-box display-block row">
            <div class="form-mv row">
              <ul id="suyongaInput">
                <li>
                  <label for="suyongaNameNumber" class="input-label"><span class="form-req">고객번호</span></label>
                    <input type="text"
                      id="suyongaNameNumber"
                      onkeyup="suyongaInfo.handleSuyongaNumber(event)" onpaste="suyongaInfo.handleSuyongaNumber(event)"
                      value="${suyongaInfo.state.suyongaInfo.suyongaNumber || ''}"
                      class="input-box input-w-fix" 
                      placeholder="고객번호">
                  <a class="btn btnSS btnTypeA"><span>고객번호 검색</span></a>
                  <p class="form-cmt">* 고객번호는 <a href="#">수도요금 청구서 [위치보기]</a> 로 확인할 수 있습니다.</p>
                </li>
                <li>
                  <label for="suyongaName" class="input-label"><span class="form-req">수용가(성명)</span></label>
                    <input value="${suyongaInfo.state.suyongaInfo.suyongaName || ''}"
                      onkeyup="suyongaInfo.handleSuyongaName(event)" onpaste="suyongaInfo.handleSuyongaName(event)"
                      type="text" id="suyongaName" class="input-box input-w-fix" placeholder="수용가 이름">
                  <a class="btn btnSS btnTypeA" id="suyongaSearch"><span>수용가 검색</span></a>
                  <p class="form-cmt">* 고객번호를 입력하고 수용가 이름으로 검색하세요.</p>
                </li>
              </ul>
            </div>
          </div>
        </div><!-- //form-mw1 -->
      </div><!-- //mw-box -->
  
      <!-- 신청인정보 -->
      <div class="mw-box">
        <div id="form-mw3" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="showHideLayer('#form-mw3');" title="닫기">
            <span class="i-09">신청인정보</span></a>
          </div>
          <div class="form-mw-box display-block row">
            <div class="form-mv row">
              <ul>
                <li>
                  <label for="applyName" class="input-label"><span class="form-req">성명 </span></label>
                    <input type="text" value="${suyongaInfo.state.applyInfo.applyName}"
                      onkeyup="suyongaInfo.handleApplyName(event)" onpaste="suyongaInfo.handleApplyName(event)"
                      id="applyName" class="input-box input-w-2" placeholder="신청인 이름">
                  <a class="btn btnSS btnTypeB" id="copyOwnerName" onclick="suyongaInfo.handleCopyOwnerName(event)">
                    <span>소유자이름</span>
                  </a>
                  <a class="btn btnSS btnTypeB" id="copyUserName" onclick="suyongaInfo.handleCopyUserName(event)">
                    <span>사용자이름</span>
                  </a>
                </li>
                <li>
                  <label for="applyPostNumber" class="input-label"><span class="form-req">도로명주소</span></label>
                  <input type="text" value="${suyongaInfo.state.applyInfo.applyPostNumber}"
                    id="applyPostNumber" class="input-box input-w-2" placeholder="우편번호">
                  <a class="btn btnSS btnTypeA"><span>주소검색</span></a>
                  <a class="btn btnSS btnTypeB" id="copySuyongaAddress"
                    onclick="suyongaInfo.handleCopySuyongaAddress(event)">
                    <span>수용가주소</span>
                  </a>
                </li>
                <li>
                  <label for="applyAddress" class="input-label">
                    <span class="sr-only">주소</span>
                  </label>
                  <input type="text" value="${suyongaInfo.state.applyInfo.applyAddress}"
                    id="applyAddress" class="input-box input-w-1" placeholder="주소" disabled>
                </li>
                <!-- <li><label for="form-mw02-tx" class="input-label"><span>지번주소</span></label>
                  <input type="text" id="form-mw02-tx" class="input-box input-w-1" placeholder="지번주소"></li>
                <li>
                  <label for="form-mw34-tx" class="input-label"><span class="sr-only">상세주소</span></label>
                  <input type="text" id="form-mw34-tx" class="input-box input-w-1" placeholder="상세주소">
                </li> -->
                <li>
                  <label for="applyPhone" class="input-label"><span>전화번호</span></label>
                  <input value="${suyongaInfo.state.applyInfo.applyPhone}" 
                    onkeyup="suyongaInfo.handleApplyPhone(event)" onpaste="suyongaInfo.handleApplyPhone(event)"
                    type="text" id="applyPhone" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
                 </li>
                <li>
                  <label for="applyMobile" class="input-label"><span class="form-req">휴대폰번호</span></label>
                  <input value="${suyongaInfo.state.applyInfo.applyMobile}" 
                    onkeyup="suyongaInfo.handleApplyMobile(event)" onpaste="suyongaInfo.handleApplyMobile(event)"
                    type="text" id="applyMobile" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
                </li>
                <li>
                  <label class="input-label"><span class="sr-only">SMS수신동의</span></label>
                  <input type="checkbox" name="smsFrzburYnCheck" id="ch01">
                    <label class="chk-type" for="ch01"> <span>SMS수신동의</span></label>
                <li>
                  <label for="applyEmailId" class="input-label"><span>이메일</span></label>
                  <input value="${suyongaInfo.state.applyInfo.applyEmailId}" 
                    onkeyup="suyongaInfo.handleApplyEmailId(event)" onpaste="suyongaInfo.handleApplyEmailId(event)"  
                    type="text" id="applyEmailId" class="input-box input-w-mail"> @
                  <label for="applyEmailProvider"><span class="sr-only">이메일 주소</span></label>
                  <input onkeyup="suyongaInfo.handleApplyEmailProvider(event)" onpaste="suyongaInfo.handleApplyEmailProvider(event)"  
                    type="text" id="applyEmailProvider" class="input-box input-w-mail"
                    value="${suyongaInfo.state.applyInfo.applyEmailProvider}">
                  <label for="applyEmailProviderSelector"><span class="sr-only">이메일 선택</span></label>
                  <select onchange="suyongaInfo.handleApplyEmailProviderSelector(event)" id="applyEmailProviderSelector"
                    value="${suyongaInfo.state.applyInfo.applyEmailProvider}" title="이메일도메인선택" class="input-box input-w-mail2 ">
                      <option value="">직접입력</option>
                      <option value="naver.com">naver.com</option>
                      <option value="hotmail.com">hotmail.com</option>
                      <option value="chol.com">chol.com</option>
                      <option value="dreamwiz.com">dreamwiz.com</option>
                      <option value="empal.com">empal.com</option>
                      <option value="freechal.com">freechal.com</option>
                      <option value="gmail.com">gmail.com</option>
                      <option value="hanmail.net">hanmail.net</option>
                      <option value="hanafos.com">hanafos.com</option>
                      <option value="hanmir.com">hanmir.com</option>
                      <option value="hitel.net">hitel.net</option>
                      <option value="korea.com">korea.com</option>
                      <option value="nate.com">nate.com</option>
                      <option value="netian.com">netian.com</option>
                      <option value="paran.com">paran.com</option>
                      <option value="yahoo.com">yahoo.com</option>
                  </select>
                </li>
                <li>
                  <label for="applyRelation" class="input-label"><span class="form-req">관계</span></label>
  
                  <select value="${suyongaInfo.state.applyInfo.applyRelation}"
                    id="applyRelation" title="관계 선택" class="input-box input-w-2">
                    <option value="1">사용자 본인</option>
                    <option value="2">사용자의 배우자</option>
                    <option value="3">사용자의 자녀</option>
                    <option value="4">소유자 본인</option>
                    <option value="5">소유자의 배우자</option>
                    <option value="6">소유자의 배우자</option>
                    <option value="">직접입력</option>
                  </select>
                  <!-- <label for="form-mw35-tx"><span class="sr-only">관계직접입력</span></label>
                    <input type="text" id="form-mw35-tx" class="input-box input-w-2"> -->
                </li>
              </ul>
            </div>
          </div>
        </div><!-- //form-mw3 -->
      </div><!-- //mw-box -->
  
      <!-- 개인정보 취급방침 동의 -->
      <div class="mw-box">
        <div id="form-mw-p" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="showHideLayer('#form-mw-p');" title="닫기">
            <span class="i-10">개인정보취급방침</span></a></div>
          <div class="form-mw-box display-block row">
            <div class="form-mv row">
              <ul>
                <li><label><span class="sr-only"> 개인정보취급방침</span></label>
                  <input type="checkbox" name="ch83" id="ch83">
                  <label class="chk-type" for="ch83"> <span>개인정보취급방침 동의</span></label>
                  <a href="https://www.xrp.kr/_arisu/data/use-info.hwp" target="_blank" class="btn btnSS btnTypeC m-br">
                    <span>내용보기</span></a>
                </li>
              </ul>
            </div>
          </div>
        </div><!-- //form-mw-p -->
      </div><!-- //mw-box -->
    `;

    // 실제로 화면을 붙여준다.
    this.state.root.innerHTML = template;

    // 데이터는 immutable 이기 때문에 랜더링 전에 데이터를 전달해야 한다.
    // 화면에 추가로 붙이는 부분들은 전체 화면이 그려진 후에 처리되어야 한다.
    if (this.state.searchYN) {
      const $target = document.getElementById('suyongaInput');
      $target.innerHTML = $target.innerHTML + this.suyongaInfoPanel.render();
    }

    // 이벤트를 수동으로 등록해 준다.
    this.setEventListeners();
  }
}