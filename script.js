// JavaScript source code

//TODO: add bleed bar to hp
//maybe add bleed text

import { Rodent, Stats } from './rod.js';
import {SolidTextBox} from './textual.js';
import {Drawings, IMG} from './images.js';
import {KeyHandler } from './utils.js';
import {shadyRoach} from './roach.js';
import {battle} from './battle.js';
import {cr} from './config.js';

let c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

let k = new KeyHandler (document);

async function startGame ()
{
  let bg = new IMG('assets/forest.png', -40*cr, -80*cr, 1050*cr, ctx);
  let m = new SolidTextBox("", 0, 0, ctx, 800*cr, 60*cr, "#000", '#FFF', true, 0.85, 0.6, 2*cr);
  let drawings = new Drawings(ctx, bg, m);
  drawings.draw();

  var rat = new Rodent("Lenny", "Mouse", new Stats(50, 50, 50, 50, 50, 50), true);
  var horse = new Rodent("Thomas", "Rat", new Stats(50, 50, 50, 50, 30, 50));
  rat.sprite = new IMG("assets/mouse_hero.png", 110*cr, 110*cr, 115*cr, ctx, "Lenny", "#222");
  horse.sprite = new IMG("assets/rat_enemy1.png", 470*cr, 65*cr, 150*cr, ctx, "Thomas", "#A02");
  rat.isTurn = true;
  horse.isTurn = false;

  await shadyRoach(rat, m, ctx, c, drawings);
  await battle(rat, horse, m, ctx, c, drawings);
}
startGame();
document.addEventListener('keyup', async function (event) {
  if (event.code == 'Space') {
    //var b = new Button("Bite", 200, 210, ctx, "#FF0055", 200, 100);

    //clickables.push(b);
    

    var rat = new Rodent("Lenny", "Mouse", new Stats(50, 50, 50, 50, 50, 50), true);
    var horse = new Rodent("Thomas", "Rat", new Stats(50, 50, 50, 50, 30, 50));
    rat.sprite = new IMG("assets/mouse_hero.png", 110*cr, 110*cr, 115*cr, ctx, "Lenny", "#222");
    horse.sprite = new IMG("assets/rat_enemy1.png", 470*cr, 65*cr, 150*cr, ctx, "Thomas", "#A02");
    rat.isTurn = true;
    horse.isTurn = false;

    console.log('battle!');

    battle(rat, horse, m, ctx, c, drawings);
  }
  if (event.code == 'KeyF')
  {
    var rat = new Rodent("Lenny", "Mouse", new Stats(50, 50, 50, 50, 50, 50), true);
    rat.sprite = new IMG("assets/mouse_hero.png", 110*cr, 110*cr, 150*cr, ctx, "Lenny", "#444");
    
    
    shadyRoach(rat, m, ctx, c, drawings);
 
  }
}, { once: true });