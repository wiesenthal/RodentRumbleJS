// JavaScript source code

import * as moves from './moves.js';
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


export class Rodent {
  constructor(name, type, stats, isPlayer = false) {
    this.name = name;
    this.type = type;
    this.isPlayer = isPlayer;
    this.stats = stats;
    this.fStats = Object.assign({}, stats);
    this.fStats.hp *= 10;
    this.friends = [];
    this.moveList = [moves.bite, moves.claw, moves.tailWhip];
    this.isTurn = false;
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
  }

  damage(amount) {
    this.fStats.hp -= amount;
  }

  randomMove(enemy)
  {
    console.log(this.moveList[0](this, enemy));
    //console.log(`${enemy.name} HP: ${enemy.hp}`);
    enemy.hpText.update();
    if (enemy.hp <= 0) {
      if (this.isPlayer) {
        this.contFunction("win");
        return;
      } else {
        enemy.contFunction("loss");
        return;
      }
    }
    setTimeout(function() {
    	console.log(`${enemy.name}'s Turn...'`);
    	enemy.isTurn = true;
    	this.isTurn = false;
    }, 1000);
  }
  attack(enemy, move) {
    console.log(move(this, enemy));
    //console.log(`${enemy.name} HP: ${enemy.hp}`);
    enemy.hpText.update();
    /*
    if (enemy.hp <= 0) {
      if (this.isPlayer) {
        this.contFunction("win");
        return;
      } else {
        enemy.contFunction("loss");
        return;
      }
    }
    */
    
    if (this.isPlayer) {
      
      enemy.isTurn = true;
      this.isTurn = false;
      let me = this;
      setTimeout(function() {
      console.log(`${enemy.name}'s Turn...'`);
      }, 1000);
      
    }
  }
}