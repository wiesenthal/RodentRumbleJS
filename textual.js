// JavaScript source code
export class Text {
	constructor(text, x, y, context, size = 20, font = "monospace", color = "#000000", strokeColor = '')
  {
  	this.text = text;
    this.x = x;
    this.y = y;
    this.context = context;
    this.color = color;
    this.size = size;
    this.font = font;
    this.strokeColor = strokeColor;
  }
  change(newText)
  {
  	this.text = newText;
  }
  async draw()
  {
    let prevColor = this.context.fillStyle;
    let prevColor2 = this.context.strokeStyle;
    let prevWidth = this.context.lineWidth;

    if (this.strokeColor)
    {
      this.context.lineWidth = this.size/20;
      this.context.strokeStyle = this.strokeColor;
    }

    this.context.fillStyle = this.color;
    this.context.font = this.size + "px " + this.font;
    let linebreaks = [0];
    for (let i = 0; i < this.text.length; i++)
    {
      if (this.text[i] == '\n')
      {
        linebreaks.push(i);
      } 
    }
    linebreaks.push(this.text.length);
    for (let l = 1; l < linebreaks.length; l++)
    {
      this.context.fillText(this.text.substring(linebreaks[l-1], linebreaks[l]), this.x, this.y + this.size*(l-1) - ((linebreaks.length - 2)*this.size) );
      if (this.strokeColor)
      {
        this.context.strokeText(this.text.substring(linebreaks[l-1], linebreaks[l]), this.x, this.y + this.size*(l-1) - ((linebreaks.length - 2)*this.size) );
      }
    }

    this.context.fillStyle = prevColor;
    this.context.strokeStyle = prevColor2;
    this.context.lineWidth = prevWidth;
  }
  toString() {
  	return this.text;
  }
}

export class TextBox extends Text {
  constructor (text, x, y, context, width = 180, height = 50, color = "#000", centered=true, strokeColor='')
  {
    const font = 'monospace';
    const fontWR = 0.55;
    const fontHR = 0.7;


    let sz = Math.min(width / (text.length * fontWR), (height / fontHR));
    if (centered && (width / (text.length * fontWR)) > (height / fontHR))
    {
      super (text, x + (width/2) - sz*text.length*fontWR/2, y, context, sz, font, color, strokeColor);
    }
    else
    {
      super (text, x, y, context, sz, font, color, strokeColor);
    }
    this.constX = x;
    this.constY = y;
    this.width = width;
    this.height = height;
    this.fontWR = fontWR;
    this.fontHR = fontHR;
  }
  change (newText)
  {
    this.text = newText;
    this.size = Math.min(this.width / (this.text.length * this.fontWR), (this.height / this.fontHR));
    
    let numSentences = 1;
    while (this.size < 15 && this.height / ((numSentences + 1) * this.fontHR) >= this.size)
    {
      numSentences ++;
      this.size = Math.min(this.width / ((this.text.length / numSentences) * this.fontWR), this.height / (numSentences * this.fontHR));
    }

    let sentences = [];
    let prevIndex = 0;
    for (let i1 = 1; i1 <= numSentences; ++i1)
    {
      let i = Math.floor((this.text.length/numSentences) * i1);
      let j = i;
      //search for nearest space
      while (this.text[i] != " " && this.text[j] != " ")
      {
        i -= 1;
        j += 1;
        if (j >= this.text.length)
        {
          break;
        }
      }
      var index;
      if (this.text[i] == " ")
      {
        index = i;
      }
      else
      {
        index = j;
      }
      sentences.push(this.text.slice(prevIndex, index));
      prevIndex = index;
    }
    
    this.text = sentences.join("\n");
    //this.size = this.width / (Math.max(...(sentences.map(e => e.length))) * this.fontWR);
    this.size = Math.min(this.width / (Math.max(...(sentences.map(e => e.length))) * this.fontWR), this.height / (numSentences * this.fontHR));    
    this.x = this.constX + (this.width/2) - this.size*(Math.max(...(sentences.map(e => e.length))))*this.fontWR/2;

  }
}
export class SolidTextBox extends TextBox {
  constructor(text, x, y, context, width = 180, height = 50, color = "#000", bgColor='#FFF', centered=true, wpadding=0.9, hpadding = 0.6, lWidth = 2)
  {
    super(text, x + width * (1-wpadding)/2, y + height * (1+hpadding)/2, context, width * wpadding, height * hpadding, color, centered);
    this.boxX = x;
    this.boxY = y;
    this.boxW = width;
    this.boxH = height
    this.bgColor = bgColor;
    this.lWidth = lWidth;
  }
  async draw()
  {
    let prevColor = this.context.strokeStyle;
    let prevColor2 = this.context.filLStyle;
    let prevWidth = this.context.lineWidth;

    this.context.lineWidth = this.lWidth;
    this.context.strokeStyle = this.color;
    this.context.fillStyle = this.bgColor;
    this.context.fillRect(this.boxX, this.boxY, this.boxW, this.boxH);
    this.context.strokeRect(this.boxX, this.boxY, this.boxW, this.boxH);
    super.draw();

    this.context.lineWidth = prevWidth;
    this.context.strokeStyle = prevColor;
    this.context.fillStyle = prevColor2;
  }
}

export class Button {
  constructor(text, x, y, context, color = "#000000", width = 180, height = 50, wpadding = 0.9, hpadding = 0.6, lWidth = 3, bgColor = '#FFD') {
    this.height = height;
    this.width = width;
    this.text = new TextBox (text, x + width * (1-wpadding)/2, y + height * (1+hpadding)/2, context, width * wpadding, height * hpadding, color);
    this.x = x;
    this.y = y;
    this.context = context;
    this.color = color;
    this.lWidth = lWidth;
    this.bgColor = bgColor;

    this.action = function() {
      console.log("clicked");
    };
    this.help = 'Click me.';
  }
  async draw() {
    let prevColor = this.context.strokeStyle;
    let prevWidth = this.context.lineWidth;

    this.context.lineWidth = this.lWidth;
    this.context.strokeStyle = this.color;
    this.context.fillStyle = this.bgColor;
    this.context.fillRect(this.x, this.y, this.width, this.height);
    this.context.strokeRect(this.x, this.y, this.width, this.height);
    this.text.draw();
    
    this.context.lineWidth = prevWidth;
    this.context.strokeStyle = prevColor;
  }
  
  checkClick(x, y) {
    return (x > this.x && x < this.x + this.width &&
      y > this.y && y < this.y + this.height);
  }
  toString() {
    return this.text.toString();
  }
}