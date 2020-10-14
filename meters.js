import {TextBox} from './textual.js';

export class Meter {
    constructor(label, x, y, context, width, height, amount, max, color, numColor="black")
    {
      this.label = new TextBox(label, x - width*0.25, y + height*1.16, context, width*1.5, height*0.15, numColor, true);
      this.number = new TextBox(amount.toString(), x, y + height/1.05, context, width, height, numColor);
      this.x = x;
      this.y = y;
      this.context = context;
      this.width = width;
      this.height = height;
      this.color = color;
      this.amount = amount;
      this.max = max;
    }
    change(newAmount)
    {
      this.amount = Math.floor(newAmount);
      this.number.change(this.amount.toString());
    }
    draw()
    {
      let prevFill = this.context.fillStyle;
      let prevStroke = this.context.strokeStyle;
      this.context.strokeStyle = "#000";
      this.context.fillStyle = '#FFF';
      this.context.fillRect(this.x+1, this.y+1, this.width-2, this.height-2);
      this.context.fillStyle = this.color;
      this.context.fillRect(this.x, this.y + this.height * (1 -this.amount/this.max), this.width, this.height * (this.amount/this.max));
      this.context.strokeRect(this.x, this.y, this.width, this.height);
      this.number.draw();
      this.label.draw();
  
      this.context.strokeStyle = prevFill;
      this.context.fillStyle = prevStroke;
    }
    /*
    erase(canvasColor="#FFF")
    {
      let prevFill = this.context.fillStyle;
      let prevStroke = this.context.strokeStyle;
      this.context.strokeStyle = canvasColor;
      this.context.fillStyle = canvasColor;
  
      this.context.strokeRect(this.x, this.y, this.width, this.height);
      this.context.fillRect(this.x, this.y, this.width, this.height);
      this.label.erase();
  
      this.context.strokeStyle = prevFill;
      this.context.fillStyle = prevStroke;
    }*/
  }
export class HpMeter extends Meter {
    constructor (rodent, x, y, context, width, height, color="#F46", numColor ="#300")
    {
        super("HP", x, y, context, width, height, rodent.hp, rodent.hp, color, numColor);
        this.rodent = rodent;
    }
    update()
    {
        this.change(this.rodent.hp);
    }
    draw()
    {
        let prevColor = this.context.fillStyle;
        super.draw();
        //draw bleed
        this.context.fillStyle = "#500";
        this.context.fillRect(this.x, this.y + this.height * (1-this.rodent.hp/this.max), this.width, Math.min(this.height * (this.rodent.hp/this.max) , this.height * (this.rodent.effects.bleed/this.max)) );
        this.context.fillStyle = prevColor;
    }
}
export class StMeter extends Meter {
    constructor (rodent, x, y, context, width, height, color="#FFF000", numColor = "#1122AA")
    {
        super("ST", x, y, context, width, height, rodent.stam, rodent.end * 3, color, numColor);
        this.rodent = rodent;
    }
    update()
    {
        this.change(this.rodent.stam);
    }
}