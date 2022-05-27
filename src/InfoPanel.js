/**
 * 
 */

class InfoPanel {
  constructor(title, root, path) {
    this.title = title;
    this.root = root;
    this.path = path;
    this.data = {};
  }

  setData(data) {
    console.log(data);
    this.data = eval(data);
  }

  render() {
    const that = this;
    
    // 데이터를 가지고 온다.
    this.setData(this.path);
    
    let template = '';
    let head = `
      <li>
        <div class="txStrong">${that.title}</div>
        <p class="display-block form-info form-info-box">
    `;

    console.log(this.data);

    let body = '';
    for (const property in this.data) {
      body += `<span class="mw-info-label">${that.data[property][1]}</span> ${that.data[property][0]} <br>`;
    }

    let tail = `     
        </p>
      </li>`;

    return template = head + body + tail;
  }
}