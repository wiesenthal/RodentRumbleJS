// JavaScript source code

import * as moves from './moves.js';
import {TextBox} from './textual.js';

export class Stats {
  constructor(hp, str, dex, end, acc, chr) {
    this.hp = hp;
    this.str = str;
    this.dex = dex;
    this.end = end;
    this.acc = acc;
    this.chr = chr;
  }
}

export class StatSheet {
  constructor(statsObj, x, y, width, height, context, color='#000')
  {
    this.statsObj = statsObj;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.context = context;

    const numStats = 6;
    this.StatBoxes = [];
    let i = 0;
    for (const [key, value] of Object.entries(this.statsObj))
    {
      let nSB = new StatBox(this.statsObj, key, x, y + i*height/numStats, this.width, this.height/numStats, context, color);
      this.StatBoxes.push(nSB);
      i++;
    }
  }
  draw()
  {
    this.StatBoxes.forEach((sb) => sb.draw());
  }
  update()
  {
    this.StatBoxes.forEach((sb) => sb.update());
  }
}
class StatBox {
  constructor(statsObj, stat, x, y, width, height, context, color='#000', wpadding = 0.9, hpadding = 0.6)
  {
    this.statsObj = statsObj,
    this.stat = stat;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.context = context;
    this.color = color;
    let statColors = {'hp':"#F46", 'str':'#000', 'dex':"#1122AA", 'end':"#F0D000",'acc':'#555','chr':"#630085"}

    this.text = new TextBox (`${stat}: ${statsObj[stat]}`, x + width * (1-wpadding)/2, y + height * (1+hpadding)/2, context, width * wpadding, height * hpadding, statColors[stat]);
  }
  draw()
  {
    let prevColor = this.context.strokeStyle;
    let prevColor2 = this.context.fillStyle;
    let prevWidth = this.context.lineWidth;

    this.context.lineWidth = 2;
    this.context.strokeStyle = this.color;
    this.context.fillStyle = this.fillColor;
    this.context.fillRect(this.x, this.y, this.width, this.height);
    this.context.strokeRect(this.x, this.y, this.width, this.height);
    this.text.draw();

    this.context.lineWidth = prevWidth;
    this.context.strokeStyle = prevColor;
    this.context.fillStyle = prevColor2;
  }
  update()
  {
    this.text.text = `${this.stat}: ${this.statsObj[this.stat]}`;
  }
}

export class Effects {
  constructor(rodent)
  {
    this.bleed = 0;
    this.rodent = rodent;
  }
  onDamage()
  {
    let results = []
    this.rodent.fStats.hp = Math.max(this.rodent.fStats.hp - this.bleed, 0);
    if (this.bleed > 0)
    {
      results.push(`${this.rodent.name} bleeds for ${this.bleed} damage.`);
    }
    return results;
  }
  applyBleed(amount)
  {
    this.bleed += amount;
  }
  onEndTurn()
  {
    if (this.rodent.hp > 0 && this.bleed > 0) {this.bleed -= 1;}
  }
}
class playerData {
  constructor(rodent)
  {
    this.player = rodent;
    this.hasVisitedShadyRoach = false;
  }
  /*get hasVisitedShadyRoach() 
  {
    return this.hasVisitedShadyRoach;
  }*/
}


export class Rodent {
  constructor(name, type, stats, isPlayer = false, sprite=undefined, level=1) {
    this.name = name;
    this.type = type;
    this.isPlayer = isPlayer;
    this.stats = stats;
    this.fStats = Object.assign({}, stats);
    this.fStats.hp *= 10;
    this.stam = this.fStats.dex;
    this.friends = [];
    this.moveList = [moves.punch, moves.claw, moves.bite, moves.tailWhip,];
    this.isTurn = false;
    this.sprite = sprite;
    this.level = level;

    let me = this;
    this.effects = new Effects(me);
    this.data = new playerData(me);
  }
  get hp() {
    return this.fStats.hp;
  }
  get str() {
    return this.fStats.str;
  }
  get dex() {
    return this.fStats.dex;
  }
  get acc() {
    return this.fStats.acc;
  }
  get chr() {
    return this.fStats.chr;
  }
  get end() {
    return this.fStats.end;
  }
  
  reset() {
  	this.fStats = Object.assign({}, this.stats);
    this.fStats.hp *= 10;
    this.stam = this.dex;
  }

  endTurn()
  {
    this.isTurn = false;
    return (this.effects.onEndTurn());
  }
  startTurn()
  {
    this.isTurn = true;
    this.stam += this.end /5;
    this.stamMeter.change(this.stam);
  }

  damage(amount, drawings) {
    this.fStats.hp -= amount;
    if (this.fStats.hp < 0)
    {
      this.fStats.hp = 0;
    }
    if (amount > 0){
      this.sprite.jiggle(amount/10, drawings);
      return this.effects.onDamage();
    }
    return [];
  }
  draw()
  {
    this.sprite.draw();
    this.stamMeter.draw();
    this.hpMeter.draw();
  }
}