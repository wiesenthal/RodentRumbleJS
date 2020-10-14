import {Button} from './textual.js';
import {HpMeter, StMeter} from './meters.js';
import {Drawings, IMG} from './images.js';
import { wait, waitL, nextClick} from './utils.js';
import {cr} from './config.js';


export async function battle(player, enemy, mainText, context, canvas, drawings = []) {
    drawings.clear();
    //set background
    drawings.background = new IMG("assets/forest.png", -20*cr, 0, 900*cr, context);

    //get all players moves, make them into button
    let buttons = [];
    let i = 0;
    const btnWidth = 220 * cr; const btnHeight = 65 * cr; const btnMargin = 8 * cr;
    const btnX = 20 * cr; const btnY = 350 * cr; const numCols = 3;
    player.moveList.forEach(move =>
      {
        let clr = '#654321';
        if (move.combo)
        {
          clr = '#519';
        }
        if (move.bleed)
        {
          clr = '#800';
        }
        let nB = new Button(`${move.title}: ${move.stam}`, btnX + (btnWidth+btnMargin) * (i%numCols), btnY + (btnHeight+btnMargin) * Math.floor(i / numCols), context, clr, btnWidth, btnHeight);
        //nB.draw();
        drawings.push(nB);
        nB.action = move;
        nB.help = move.description;
        buttons.push(nB);
        i++;
      });
    var endTurnButton = new Button('End Turn', 560 * cr, 255 * cr, context, "#000", btnWidth, btnHeight);
    //endTurnButton.draw();
    drawings.push(endTurnButton);
    endTurnButton.action = () => {
      player.endTurn();
      enemy.startTurn();
    }
  
    player.reset();
    enemy.reset();
    player.stamMeter = new StMeter(player, 70 * cr, 180 * cr, context, 35 * cr, 130 * cr);
    player.hpMeter = new HpMeter(player, 20 * cr, 180 * cr, context, 35 * cr, 130 * cr);
    enemy.stamMeter = new StMeter(enemy, 700 * cr, 80 * cr, context, 35*cr, 130*cr);
    enemy.hpMeter = new HpMeter(enemy, 650*cr, 80*cr, context, 35*cr, 130*cr);
    let battleMeters = [player.stamMeter, player.hpMeter, enemy.stamMeter, enemy.hpMeter];
  
    //draw player
    drawings.push(player);
  
    //draw enemy
    drawings.push(enemy);
    await drawings.update();
  
    mainloop: while (player.hp > 0 && enemy.hp > 0) {
      if (player.isTurn) {
        mainText.change("Your turn...");
        await drawings.update();
        //wait for click
        var clickedMove = undefined;
        while (!clickedMove) {
          let [mType, mouseX, mouseY] = await nextClick(canvas);
          buttons.forEach(b =>
          {
            if (b.checkClick(mouseX, mouseY))
            {
              if (mType === "r")
              {
                mainText.change(b.help);
                drawings.update();
              }
              else if (mType === "l")
              {
                if (b.action.stam > player.stam)
                {
                  mainText.change("Not enough stamina.");
                  drawings.update();
                }
                else
                {
                  clickedMove = b.action;
                }
              }
            }
          });
          if (endTurnButton.checkClick(mouseX, mouseY))
          {
            endTurnButton.action();
            continue mainloop;
          }
        }
        //get result
        let dmg = clickedMove(player, enemy);
        let damageResults = enemy.damage(dmg, drawings);
        mainText.change(clickedMove.result);
        await drawings.update();
  
        player.stam -= clickedMove.stam;
        battleMeters.forEach((meter) => meter.update());
        await drawings.update();
        
        await waitL(clickedMove.result);
  
        for (i in damageResults)
        {
          mainText.change(damageResults[i]);
          await drawings.update();
          await waitL(damageResults[i]);
          await drawings.update();
        }
      
        battleMeters.forEach((meter) => meter.update());
  
        if (!clickedMove.combo) 
        {
          let endTurnResults = player.endTurn();
          for (i in endTurnResults)
          {
            mainText.change(endTurnResults[i]);
            await drawings.update();
            await waitL(endTurnResults[i]);
          }
          enemy.startTurn();
        }
      }
      else {
        mainText.change(enemy.name + "'s turn...");
        await drawings.update();
  
        await wait(500);
        //get a move from enemy
        let possibleMoves = [];
        enemy.moveList.forEach(move =>
          {
            if (move.stam < enemy.stam)
            {
              possibleMoves.push(move);
            }
          });
        if (possibleMoves.length == 0)
        {
          let t = "the enemy ends their turn";
          mainText.change(t);
          await drawings.update();
          await waitL(t);
          enemy.endTurn();
          player.startTurn();
          continue mainloop;
        }
        let randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        mainText.change(`${enemy.name} chooses ${randomMove.title}...`);
        await drawings.update();
        await waitL(`${enemy.name} chooses ${randomMove.title}...`);
  
        let dmg = randomMove(enemy, player);
        let damageResults = player.damage(dmg, drawings);
        mainText.change(randomMove.result);
        enemy.stam -= randomMove.stam;
        battleMeters.forEach((meter) => meter.update());
  
        await drawings.update();
        await waitL(randomMove.result);
  
        for (i in damageResults)
        {
          mainText.change(damageResults[i]);
          await drawings.update();
          await waitL(damageResults[i]);
        }
  
        battleMeters.forEach((meter) => meter.update());
  
        if (!randomMove.combo)
        {
          let endTurnResults = enemy.endTurn();
          for (i in endTurnResults)
          {
            mainText.change(endTurnResults[i]);
            await drawings.update();
            await waitL(endTurnResults[i]);
          }
          player.startTurn();
        }
      }
    }
    let victor = (player.hp > enemy.hp ? player : enemy);

    drawings.back();
    return victor;
  }