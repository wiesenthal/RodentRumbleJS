import {Button, TextBox} from './textual.js';
import {nextClick, mainChange, waitL, wait} from './utils.js';
import {StatSheet, Rodent} from './rod.js';
import {IMG} from './images.js';
import {cr} from './config.js';

export async function shadyRoach(player, mainText, context, canvas, drawings = [])
{
  drawings.clear();
  var roachSprite = new IMG("assets/roach_eyes_hat.png", 400*cr, 230*cr, 150*cr, context);
  drawings.background = new IMG("assets/roachbg.png", -20*cr, 0, 900*cr, context);
  
  if (!player.data.hasVisitedShadyRoach)
  {
    await mainChange('You enter the tent and see a room larger than you expected. There are various liquids and powders lining the shelves, and another flap leading to a different room in the back.', mainText, drawings);
    await drawings.add(roachSprite);
    await mainChange('A giant cockroach comes around from behind the counter. ', mainText, drawings);
    await mainChange('Shady Roach: "Hi and welcome to the Shady Roach."', mainText, drawings);
    await mainChange('Shady Roach: "If you want a sliver of a chance out there, you needa get yourself some performance enhancing drugs from in here."', mainText, drawings);
    await mainChange('Shady Roach: "I also have a dojo in the back where you can learn new moves."', mainText, drawings);
    await mainChange('Shady Roach: "How about we get you started off with one of my \'potions\'. First one\'s free!"', mainText, drawings);
  }
  //pick what to do
  await buyDrugs(player, mainText, context, canvas, drawings);
  drawings.update();
}
export async function buyDrugs(player, mainText, context, canvas, drawings = [])
{
    drawings.clear();
    //show stats
    let playerName = new TextBox(player.name, 580*cr, 130*cr, context, 200*cr, 30*cr, '#FFF', true, '#000');
    let playerStatSheet = new StatSheet(player.stats, 580*cr, 140*cr, 200*cr, 350*cr, context, '#333');
    drawings.push(playerName, playerStatSheet);
    let oldText = drawings.mainText;
    mainText = new TextBox("", mainText.constX, mainText.constY, context, mainText.width, mainText.height, "#FFF");
    drawings.mainText = mainText;


    let buttons = [];
    let i = 0;
    const btnWidth = 80*cr; const btnHeight = 50*cr; const btnMargin = 20*cr;
    const btnX = 80*cr; const btnY = 300*cr; const numCols = 3;
    const stats = {'hp':'Health determines how much damage you can take before dying.','str':'Strength acts as a multiplier for how much damage your moves do.','dex':'Dexterity is how much stamina you begin with in battle.', 'end':'Endurance is proportional to how much stamina you gain per turn (As well as your maximum stamina).', 'acc':'Accuracy determines how often you miss and how often you crit.','chr':'Charisma makes it easier to make friends.'}
    const statColors = {'hp':"#F46", 'str':'#000', 'dex':"#1122AA", 'end':"#F0D000",'acc':'#555','chr':"#630085"};
    const statDrugs = {'hp':'You swallow a handful of mismatched pills, washed down with vile tasting liquid.','str':'You inject a clear liquid from a syringe into your neck.',
                        'dex':'You inhale a fine white powder from a small bag.', 'end':'You burn some blue-ish white crystals in a bent discarded spoon.', 'acc':'You eat a small amount of a dried out fungus.', 'chr':'You smoke from a small wooden pipe, filled with potent green herbs.'}
    for (var key in stats)
    {
        let nB = new Button(key, btnX + (btnWidth+btnMargin) * (i%numCols), btnY + (btnHeight+btnMargin) * Math.floor(i / numCols), context, statColors[key], btnWidth, btnHeight, 0.8);
        nB.help = stats[key];
        nB.action = function () {
          player.stats[nB.text.text] += 10;
        }
        buttons.push(nB);
        ++i;
    }
    drawings.push(...buttons);
    
    mainText.change("Tip: Right click the buttons for more information. Each will raise the stat by 10.");
    drawings.background = new IMG("assets/potions.jpg", 0, 0, 800*cr, context);
    await drawings.background.loaded;
    
    await drawings.update();

    var clicked;
    var selection;
    while (!clicked)
    {
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
                    clicked = b.action;
                    selection = b.text.text;
                }
              }
            });
    }
    
    clicked();
    playerStatSheet.update();
    drawings.update();
    await mainChange(statDrugs[selection], mainText, drawings);
    await mainChange(`Your ${selection} increases by 10. (${player.stats[selection]-10}->${player.stats[selection]})`, mainText, drawings);
    drawings.update();
    drawings.mainText = oldText;
    drawings.back();
}