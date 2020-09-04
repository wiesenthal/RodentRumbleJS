// JavaScript source code

import { Rodent, Stats } from './rod.js';
import { Text, TextBox, Button, HPText } from './textual.js';
import { bite } from './moves.js';
import { wait, waitL, nextClick, debugMouse, KeyHandler } from './tools.js';


let c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
//var clickables = [];


let k = new KeyHandler (document);

async function battle(player, enemy, pHPText, eHPText, mainText, context) {
  //get all players moves, make them into button
  let buttons = [];
  let i = 0;
  player.moveList.forEach(move =>
    {
      let nB = new Button(`${move.title}: ${move.tempoCost}T`, 20 + 190 * (i%2), 200 + 60 * Math.floor(i / 2), ctx, '#AA0000');
      nB.action = move;
      buttons.push(nB);
      i++;
    });
  //var b = new Button("Bite", 100, 200, ctx, '#FF0011');
  player.reset();
  enemy.reset();
  let pT = player.dex;
  let eT = enemy.dex;
  while (player.hp > 0 && enemy.hp > 0) {
    if (player.isTurn) {
      mainText.change("Your turn...");
      pT += player.end;
      //wait for click
      var clickedMove = undefined;
      while (!clickedMove) {
        let [mouseX, mouseY] = await nextClick(c);
        buttons.forEach(b =>
        {
          if (b.checkClick(mouseX, mouseY))
          {
            if (k.ctrl)
            {
              mainText.change(b.action.description);
            }
            else
            {
              clickedMove = b.action;
            }
          }
        });
      }
      let result = clickedMove(player, enemy);
      pT -= clickedMove.tempoCost;
      mainText.change(result);
      pHPText.update();
      eHPText.update();
      enemy.isTurn = true;
      player.isTurn = false;
      await waitL(result);
    }
    else {
      mainText.change(enemy.name + "'s turn...");
      eT += enemy.end;

      await wait(1000);
      let result = bite(enemy, player);
      eT -= clickedMove.tempoCost;
      mainText.change(result);
      pHPText.update();
      eHPText.update();
      await waitL(result);
      enemy.isTurn = false;
      player.isTurn = true;
      //break;
    }
  }
  let victor = (player.hp > enemy.hp ? player : enemy);
  if (victor == player) {
    mainText.change(`You beat ${enemy.name}!`);
  }
  else {
    mainText.change(`You lost the fight to ${enemy.name}.`);
  }

}



document.addEventListener('keyup', function (event) {
  if (event.keyCode == 32) {
    //var b = new Button("Bite", 200, 210, ctx, "#FF0055", 200, 100);

    //clickables.push(b);

    var rat = new Rodent("Lenny", "Mouse", new Stats(50, 50, 50, 50, 50, 50), true);
    rat.isTurn = true;
    var horse = new Rodent("Thomas", "Horse", new Stats(30, 40, 50, 50, 50, 50));
    horse.isTurn = false;

    var t = new HPText(rat, 60, 25, ctx, 20, "Arial", "#AA0033");
    var y = new HPText(horse, 540, 25, ctx, 20, "Arial", "#AA0011");

    rat.hpText = t;
    horse.hpText = y;

    let m = new TextBox("", 25, 470, ctx, 760, 30, "#444");

    battle(rat, horse, t, y, m, ctx);
  }
}, { once: true });