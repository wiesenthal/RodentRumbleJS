// JavaScript source code
export class Text {
	constructor(text, x, y, context, size = 20, font = "monospace", color = "#000000")
  {
  	this.text = text;
    this.x = x;
    this.y = y;
    this.context = context;
    this.color = color;
    this.size = size;
    this.font = font;
    this.draw();
  }
  change(newText)
  {
  	this.erase();
  	this.text = newText;
    this.draw();
  }
  draw()
  {
  	let prevColor = this.context.fillStyle;
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
      this.context.fillText(this.text.substring(linebreaks[l-1], linebreaks[l]), this.x, this.y + this.size*(l-1));
    }
    //this.context.fillText(this.text, this.x, this.y);
    this.context.fillStyle = prevColor;
  }
  erase(canvasColor="#FFFFFF")
  {
  	let prevColor = this.context.fillStyle;
    let prevColor2 = this.context.strokeStyle;
    this.context.fillStyle = canvasColor;
    this.context.strokeStyle = canvasColor;
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
      this.context.fillText(this.text.substring(linebreaks[l-1], linebreaks[l]), this.x, this.y + this.size*(l-1));
      this.context.strokeText(this.text.substring(linebreaks[l-1], linebreaks[l]), this.x, this.y + this.size*(l-1));
    }
    //this.context.fillText(this.text, this.x, this.y);
    //this.context.strokeText(this.text, this.x, this.y)
    this.contextstrokeStyle = prevColor2;
    this.context.fillStyle = prevColor;
  }
  toString() {
  	return this.text;
  }
}

export class TextBox extends Text {
  constructor (text, x, y, context, width = 180, height = 50, color = "#000000")
  {
    const font = 'monospace';
    const fontWR = 0.55;
    const fontHR = 0.7;

    let sz = Math.min(width / (text.length * fontWR), (height / fontHR));
    super (text, x, y, context, sz, font, color);
    this.width = width;
    this.height = height;
    this.fontWR = fontWR;
    this.fontHR = fontHR;
  }
  change (newText)
  {
    this.erase();
    this.text = newText;
    this.size = Math.min(this.width / (this.text.length * this.fontWR), (this.height / this.fontHR));
    if (this.size < 15)
    {
      let i , j = Math.floor(this.text.length/2);
      while (this.text[i] != " " && this.text[j] != " ")
      {
        i -= 1;
        j += 1;
        if (i <= 0 || j >= this.text.length)
        {
          this.draw();
          return;
        }
      }
      var index;
      if (this.text[i] == " ")
      {
        index = i;
      }
      else
      {
        index = j
      }
      this.text = this.text.substring(0, index) + '\n' + this.text.substring(index+1);
      this.size = this.width / (index * this.fontWR);
      console.log("g!");
    }

    this.draw();
  }
}

export class HPText extends Text {
	constructor(rodent, x, y, context, size = 20, font = "Arial", color = "#000000")
  {
  	super(`${rodent.name}: ${rodent.hp}hp `, x, y, context, size, font, color);
    this.rodent = rodent;
  }
  update()
  {
  	this.change( `${this.rodent.name}: ${this.rodent.hp}hp `);
  }
}


export class Button {
  constructor(text, x, y, context, color = "#000000", width = 180, height = 50, wpadding = 0.9, hpadding = 0.6) {
    this.height = height;
    this.width = width;
    this.text = new TextBox (text, x + width * (1-wpadding)/2, y + height * (1+hpadding)/2, context, width * wpadding, height * hpadding, color);
    this.x = x;
    this.y = y;
    this.context = context;
    this.color = color;
    this.action = function() {
      console.log("clicked");
    };
    this.draw();
  }
  draw() {
    let prevColor = this.context.strokeStyle;
    this.context.strokeStyle = this.color;
    this.context.strokeRect(this.x, this.y, this.width, this.height);
    //this.context.font = this.width * 1.6 / this.text.length + "px Arial";
    //this.context.fillText(this.text, this.x + this.width / (10 + this.text.length*0.1), this.y + this.height / 1.5);
    this.text.draw();
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