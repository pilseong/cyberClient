/**
 * 
 */

class InfoPanel {
  constructor(title, root, owner, callbackName) {
    this.title = title;
    this.root = root;
    this.owner = owner;
    this.callbackName = callbackName;
    this.data = {};
  }

  setData() {
    this.data = this.owner[this.callbackName]();
  }

  render() {
    const that = this;

    // 데이터를 가지고 온다.
    this.setData();

    let template = '';
    
    if (Object.keys(this.data).length > 1) {      
      const head = `
        <ul>
          <div class="txStrong">${that.title}</div>
          <div class="display-block form-info form-info-box">
      `;
      template += head;
    }


    for (const property in this.data) {
      let innerHead = `
        <li>
          <div class="txStrong">${that.data[property]['title']}</div>
          <p class="display-block form-info form-info-box">
      `;
      let body = '';
      for (const item in this.data[property]) {
        if (item !== 'title')
          body += `<span class="mw-info-label">${that.data[property][item][1]}</span> ${that.data[property][item][0]} <br>`;
      }

      let innerTail = `     
          </p>
        </li>
      `;

      template += innerHead + body + innerTail;
    }

    if (Object.keys(this.data).length > 1) {      
      const tail = `     
          </div>
        </ul>
      `;
      template += tail;
    }


    return template;
  }
}