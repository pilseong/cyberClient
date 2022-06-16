/**
 *  수용가 정보와 신청인 정보를 관리하는 컴포넌트 
 */
class SuyongaPage {
  constructor(parent) {
    this.state = {
      // 부모 즉 프로그램 전체를 감싸는 UnityMinwon의 객체를 참조한다.
      parent,
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
        applySMSAgree: false,
        applyEmailId: '',
        applyEmailProvider: '',
        applyEmailProviderSelector: '',
        applyRelation: '사용자 본인',
        applyRelationSelector: 0,
        applyPrivcyAgree: false
      },
      // 신청인의 뷰를 데이터를 저장한다.
      viewApplyInfo: {
        viewApplyName: ['', '신청인'],
        viewApplyAddress: ['', '도로명주소'],
        viewApplyPhone: ['', '일반전화'],
        viewApplyMobile: ['', '연락처'],
        viewApplySMSAgree: ['', 'SMS수신동의'],
        viewApplyEmail: ['', '이메일'],
        viewApplyRelation: ['', '관계'],
        viewapplyPrivcyAgree: ['', '개인정보수집동의']
      },
      searchYN: false
    };

    this.suyongaInfoPanel = new InfoPanel('',
      this.state.parent, this, 'getSuyongaView');
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

  verifySuyonga() {
    if (!this.state.searchYN) {
      alert('수용가가 정상적으로 조회되지 않았습니다.')
      return false;
    }
    return true;
  }

  verifyApply() {
    if (!this.state.applyInfo.applyName) {
      alert("신청인 이름을 입력해 주세요.");
      return false;
    }

    if (!this.state.applyInfo.applyAddress) {
      alert("주소를 입력해 주세요.");
      return false;
    }

    if (!this.state.applyInfo.applyPhone && !this.state.applyInfo.applyMobile) {
      alert("전화번호를 입력해 주세요.");
      return false;
    }

    if (!this.state.applyInfo.applyRelation) {
      alert("수용가와의 관계를 선택해 주세요.");
      return false;
    }

    if (!this.state.applyInfo.applyPrivcyAgree) {
      alert("개인정보취급방침을 동의해 주세요.");
      return false;
    }

    return true;
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

  // 신청인에 소유자 이름을 복사한다.
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

  // 신청인에 사용자 이름을 복사한다.
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
    phoneNumberInputValidation(e.target, 11, /(02|0\d{2})(\d{3,4})(\d{4})/g);
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
    phoneNumberInputValidation(e.target, 11, /(010)(\d{3,4})(\d{4})/g);
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
    console.log('handleApplyEmailProviderSelector', e.target.value);
    const that = this;
    const viewInfo = this.state.viewApplyInfo;

    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        // 공급자의 domain을 공급자로 저장한다.
        applyEmailProvider: e.target.value,
        // 선택한 이메일 공급자의 index를 저장한다.
        applyEmailProviderSelector: e.target.options.selectedIndex
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
    this.render();

    var $applyEmailProviderSelector = document.getElementById("applyEmailProviderSelector");
    $applyEmailProviderSelector.options[this.state.applyInfo.applyEmailProviderSelector].selected = true;
  }

  // 신청인의 수용가와의 관계를 설정한다.
  handleApplyRelationSelector(e) {
    console.log('handleApplyRelationSelector', e.target.options.selectedIndex);
    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        // 공급자의 domain을 공급자로 저장한다.
        applyRelation: e.target.selectedOptions[0].innerText,
        // 선택한 이메일 공급자의 index를 저장한다.
        applyRelationSelector: e.target.options.selectedIndex
      },
    });
    this.render();

    var $applyRelationSelector = document.getElementById("applyRelationSelector");
    $applyRelationSelector.options[this.state.applyInfo.applyRelationSelector].selected = true;
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

  // 개인정보 수집 동의
  handleOnClickForPrivateInfo(e) {
    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        applyPrivcyAgree: !this.state.applyInfo.applyPrivcyAgree
      }
    })
  }

  // 개인정보 수집 동의
  handleOnChangeForSMSAgree(e) {
    this.setState({
      ...this.state,
      applyInfo: {
        ...this.state.applyInfo,
        applySMSAgree: !this.state.applyInfo.applySMSAgree
      }
    })
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

      for (const minwonCd in that.state.parent.state.steps) {
        that.state.parent.state.steps[minwonCd].step[1].setInitValue(paddedNumber);
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

  getApplyView() {
    return {
      viewApplyInfo: {
        ...this.state.viewApplyInfo,
        viewApplyRelation: [this.state.applyInfo.applyRelation, 'SMS수신동의'],
        viewApplySMSAgree: [this.state.applyInfo.applySMSAgree ? "신청" : '미동의', 'SMS수신동의'],
        viewapplyPrivcyAgree: [this.state.applyInfo.applyPrivcyAgree ? "동의" : '미동의', '개인정보수집동의'],
        title: '신청인 정보'
      }
    }
  }

  // 신청을 위한 데이터를 수집한다.
  getSuyongaQueryString() {
    const data = this.state.parent.state.suyonga;
    const pattern = /(02|0\d{2})(\d{3,4})(\d{4})/g
    const phoneArr = pattern.exec(this.state.applyInfo.applyPhone);
    const mobileArr = pattern.exec(this.state.applyInfo.applyMobile);

    console.log(this.state.applyInfo.applyMobile)
    console.log(mobileArr)
    return {
      // 신청 기본 정보
      'cvplInfo.cvpl.treatSec': '001',
      'cvplInfo.cvpl.recSec': '003',
      'cvplInfo.cvpl.mgrNo': data.mkey,

      // 수용가 정보
      'cvplInfo.cvplOwner.csOfficeCd': data.csOfficeCd,
      'cvplInfo.cvplOwner.mblckCd': data.mblckCd,
      'cvplInfo.cvplOwner.mblckCdNm': data.mblckCdNm,
      'cvplInfo.cvplOwner.sblckCd': data.sblckCd,
      'cvplInfo.cvplOwner.sblckCdNm': data.sblckCdNm,
      'cvplInfo.cvplOwner.ownerNm': data.ownerNm,
      'cvplInfo.cvplOwner.usrName': data.usrName,
      'cvplInfo.cvplOwner.idtCdSNm': data.idtCdSNm,
      'cvplInfo.cvplOwner.reqKbnNm': '',
      'cvplInfo.cvplProcnd.cyberUserKey': '',
      'cvplInfo.cvplProcnd.officeYn': 'N',

      // 수용자 주소 정보
      'cvplInfo.cvplAddr[0].cvplAdresTy': 'OWNER',
      'cvplInfo.cvplAddr[0].sido': data.csSido,
      'cvplInfo.cvplAddr[0].sigungu': data.csGuCdNm,
      'cvplInfo.cvplAddr[0].umd': data.csBdongCdNm,
      'cvplInfo.cvplAddr[0].hdongNm': data.csHdongCdNm,
      'cvplInfo.cvplAddr[0].dong': '',
      'cvplInfo.cvplAddr[0].doroCd': '',
      'cvplInfo.cvplAddr[0].doroNm': data.csRn,
      'cvplInfo.cvplAddr[0].dzipcode': '',            // 도로우편번호
      'cvplInfo.cvplAddr[0].bupd': data.csHdongCd,
      'cvplInfo.cvplAddr[0].bdMgrNum': '',            // 빌딩관리번호
      'cvplInfo.cvplAddr[0].bdBonNum': data.csBldBon,
      'cvplInfo.cvplAddr[0].bdBuNum': data.csBldBu,
      'cvplInfo.cvplAddr[0].bdnm': data.csBldNm,      // specAddr/csBldNm와 동일 특수주소(건물,아파트명)
      'cvplInfo.cvplAddr[0].bdDtNm': data.csEtcAddr,  //extraAdd/csEtcAddr와 동일 특수주소(건물,아파트명) 기타 입력
      'cvplInfo.cvplAddr[0].addr2': data.csAddr2,
      'cvplInfo.cvplAddr[0].zipcode': data.zip1 + data.zip2,
      'cvplInfo.cvplAddr[0].fullDoroAddr': this.state.viewSuyongaInfo.viewDoroJuso[0],
      'cvplInfo.cvplAddr[0].addr1': data.csAddr1,
      'cvplInfo.cvplAddr[0].bunji': data.csBon,
      'cvplInfo.cvplAddr[0].ho': data.csBu,
      'cvplInfo.cvplAddr[0].extraAdd': data.csEtcAddr,
      'cvplInfo.cvplAddr[0].specAddr': data.csBldNm,
      'cvplInfo.cvplAddr[0].specDng': data.csBldDong,
      'cvplInfo.cvplAddr[0].specHo': data.csBldHo,
      'cvplInfo.cvplAddr[0].floors': data.csUgFloorNo,

      // 신청인 정보
      'cvplInfo.cvpl.applyNm': this.state.applyInfo.applyName,  // 신청인 이름
      'cvplInfo.cvplApplcnt.telno1': phoneArr ? phoneArr[1] : '',
      'cvplInfo.cvplApplcnt.telno2': phoneArr ? phoneArr[2] : '',
      'cvplInfo.cvplApplcnt.telno3': phoneArr ? phoneArr[3] : '',
      'cvplInfo.cvplApplcnt.hpno1': mobileArr ? mobileArr[1] : '',
      'cvplInfo.cvplApplcnt.hpno2': mobileArr ? mobileArr[2] : '',
      'cvplInfo.cvplApplcnt.hpno3': mobileArr ? mobileArr[3] : '',
      'cvplInfo.cvplApplcnt.email': this.state.viewApplyInfo.viewApplyEmail[0],
      'cvplInfo.cvplApplcnt.relation1': this.state.applyInfo.applyRelation,
      'cvplInfo.cvplApplcnt.relation2': '', // 기존은 사용자/소유자 -> 관계로 설정 / 사용여부 고려 해봐야

      // 신청인 주소 정보
      'cvplInfo.cvplAddr[1].cvplAdresTy': 'APPLY',
      'cvplInfo.cvplAddr[1].sido': '',
      'cvplInfo.cvplAddr[1].sigungu': '',
      'cvplInfo.cvplAddr[1].umd': '',
      'cvplInfo.cvplAddr[1].hdongNm': '',
      'cvplInfo.cvplAddr[1].dong': '',
      'cvplInfo.cvplAddr[1].doroCd': '',
      'cvplInfo.cvplAddr[1].doroNm': '',
      'cvplInfo.cvplAddr[1].dzipcode': '',
      'cvplInfo.cvplAddr[1].bupd': '',
      'cvplInfo.cvplAddr[1].bdMgrNum': '',
      'cvplInfo.cvplAddr[1].bdBonNum': '',
      'cvplInfo.cvplAddr[1].bdBuNum': '',
      'cvplInfo.cvplAddr[1].bdnm': '',
      'cvplInfo.cvplAddr[1].bdDtNm': '',
      'cvplInfo.cvplAddr[1].addr2': '',
      'cvplInfo.cvplAddr[1].zipcode': '',
      'cvplInfo.cvplAddr[1].fullDoroAddr': this.state.applyInfo.applyAddress,
      'cvplInfo.cvplAddr[1].addr1': '',
      'cvplInfo.cvplAddr[1].bunji': '',
      'cvplInfo.cvplAddr[1].ho': '',
      'cvplInfo.cvplAddr[1].extraAdd': '',
      'cvplInfo.cvplAddr[1].specAddr': '',
      'cvplInfo.cvplAddr[1].specDng': '',
      'cvplInfo.cvplAddr[1].specHo': '',
      'cvplInfo.cvplAddr[1].floors': '',
    };
  }

  // 화면을 그려주는 부분이다.
  render() {
    const that = this;
    let template = `
      <!-- 민원안내 -->
      <div class="mw-box" id="desc">
      </div><!-- //mw-box -->    
      <div class="mw-box">
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
                      onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleSuyongaNumber(event)" onpaste="cyberMinwon.state.currentModule.state.currentPage.handleSuyongaNumber(event)"
                      value="${that.state.suyongaInfo.suyongaNumber || ''}"
                      class="input-box input-w-fix" 
                      placeholder="고객번호">
                  <a class="btn btnSS btnTypeA" onclick="javascript:fncSearchCyberMkey()"><span>고객번호 검색</span></a>
                  <p class="form-cmt">* 고객번호는 <a href="#">수도요금 청구서 [위치보기]</a> 로 확인할 수 있습니다.</p>
                </li>
                <li>
                  <label for="owner_ownerNm" class="input-label">
                    <span class="form-req">수용가(성명)</span></label>
                    <input id="owner_ownerNm" value="${that.state.suyongaInfo.suyongaName || ''}"
                      onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleSuyongaName(event)" onpaste="cyberMinwon.state.currentModule.state.currentPage.handleSuyongaName(event)"
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
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw3');" title="닫기">
            <span class="i-09">신청인정보</span></a>
          </div>
          <div class="form-mw-box display-block row">
            <div class="form-mv row">
              <ul>
                <li>
                  <label for="applyName" class="input-label"><span class="form-req">성명 </span></label>
                    <input type="text" value="${that.state.applyInfo.applyName}"
                      onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleApplyName(event)" onpaste="cyberMinwon.state.currentModule.state.currentPage.handleApplyName(event)"
                      id="applyName" class="input-box input-w-2" placeholder="신청인 이름">
                  <a class="btn btnSS btnTypeB" id="copyOwnerName" onclick="cyberMinwon.state.currentModule.state.currentPage.handleCopyOwnerName(event)">
                    <span>소유자이름</span>
                  </a>
                  <a class="btn btnSS btnTypeB" id="copyUserName" onclick="cyberMinwon.state.currentModule.state.currentPage.handleCopyUserName(event)">
                    <span>사용자이름</span>
                  </a>
                </li>
                <li>
                  <label for="applyPostNumber" class="input-label"><span class="form-req">도로명주소</span></label>
                  <input type="text" value="${that.state.applyInfo.applyPostNumber}"
                    id="applyPostNumber" class="input-box input-w-2" placeholder="우편번호">
                  <a class="btn btnSS btnTypeA" onclick="fncSearchAddrPopup()"><span>주소검색</span></a>
                  <a class="btn btnSS btnTypeB" id="copySuyongaAddress"
                    onclick="cyberMinwon.state.currentModule.state.currentPage.handleCopySuyongaAddress(event)">
                    <span>수용가주소</span>
                  </a>
                </li>
                <li>
                  <label for="applyAddress" class="input-label">
                    <span class="sr-only">주소</span>
                  </label>
                  <input type="text" value="${that.state.applyInfo.applyAddress}"
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
                  <input value="${that.state.applyInfo.applyPhone}" 
                    onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleApplyPhone(event)" onpaste="cyberMinwon.state.currentModule.state.currentPage.handleApplyPhone(event)"
                    type="text" id="applyPhone" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
                 </li>
                <li>
                  <label for="applyMobile" class="input-label"><span class="form-req">휴대폰번호</span></label>
                  <input value="${that.state.applyInfo.applyMobile}" 
                    onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleApplyMobile(event)" onpaste="cyberMinwon.state.currentModule.state.currentPage.handleApplyMobile(event)"
                    type="text" id="applyMobile" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
                </li>
                <li>
                  <label class="input-label">
                    <span class="sr-only">SMS수신동의</span></label>
                    <input type="checkbox" 
                      onchange="cyberMinwon.state.currentModule.state.currentPage.handleOnChangeForSMSAgree(event)"
                      ${that.state.applyInfo.applySMSAgree ? 'checked' : ''}
                      name="smsFrzburYnCheck" id="ch01">
                    <label class="chk-type" for="ch01"> <span>SMS수신동의</span></label>
                </li>
                <li>
                  <label for="applyEmailId" class="input-label"><span>이메일</span></label>
                  <input value="${that.state.applyInfo.applyEmailId}" 
                    onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleApplyEmailId(event)" onpaste="cyberMinwon.state.currentModule.state.currentPage.handleApplyEmailId(event)"  
                    type="text" id="applyEmailId" class="input-box input-w-mail"> @
                  <label for="applyEmailProvider"><span class="sr-only">이메일 주소</span></label>
                  <input onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleApplyEmailProvider(event)" onpaste="cyberMinwon.state.currentModule.state.currentPage.handleApplyEmailProvider(event)"  
                    type="text" id="applyEmailProvider" class="input-box input-w-mail"
                    value="${that.state.applyInfo.applyEmailProvider}">
                  <label for="applyEmailProviderSelector"><span class="sr-only">이메일 선택</span></label>
                  <select onchange="cyberMinwon.state.currentModule.state.currentPage.handleApplyEmailProviderSelector(event)" id="applyEmailProviderSelector"
                    value="${that.state.applyInfo.applyEmailProvider}" title="이메일도메인선택" class="input-box input-w-mail2 ">
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
                  <label for="applyRelationSelector" class="input-label"><span class="form-req">관계</span></label>
                  <select onchange="cyberMinwon.state.currentModule.state.currentPage.handleApplyRelationSelector(event)" 
                    value="${that.state.applyInfo.applyRelation}"
                    id="applyRelationSelector" title="관계 선택" class="input-box input-w-2">
                    <option value="1">사용자 본인</option>
                    <option value="2">사용자의 배우자</option>
                    <option value="3">사용자의 자녀</option>
                    <option value="4">소유자 본인</option>
                    <option value="5">소유자의 배우자</option>
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
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw-p');" title="닫기">
            <span class="i-10">개인정보취급방침</span></a></div>
          <div class="form-mw-box display-block row">
            <div class="form-mv row">
              <ul>
                <li><label><span class="sr-only"> 개인정보취급방침</span></label>
                  <input type="checkbox" name="ch83" id="ch83" onclick="cyberMinwon.state.currentModule.state.currentPage.handleOnClickForPrivateInfo(event)"
                    ${that.state.applyInfo.applyPrivcyAgree ? 'checked' : ''}>
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
    document.getElementById('minwonRoot').innerHTML = template;

    // 후처리를 위한 로직이 수행될 부분들
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

    // 셀렉트 박스를 복구한다.
    var $applyRelationSelector = document.getElementById("applyRelationSelector");
    $applyRelationSelector.options[this.state.applyInfo.applyRelationSelector].selected = true;


    // 안내 절차를 받아온다.
    this.state.parent.state.steps[this.state.parent.state.minwonCd].step[1].renderDescription(document.getElementById('desc'));

    // 이벤트를 수동으로 등록해 준다.
    this.setEventListeners();
  }
}