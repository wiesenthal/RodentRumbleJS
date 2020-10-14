// JavaScript source code
function checkHit(accuracy, missChance, critChance, critDamage = 2)
{
	let r = Math.random();
  if (r < 1 / Math.pow(1 + (-1+Math.pow(1/missChance, 1.1))*Math.exp(0.05*(accuracy-50)), 1/1.1))
  {
  	return 0;
  }
  if ((r > 1 / Math.pow(1 + (-1+Math.pow(1/(1-critChance), 1.1))*Math.exp(0.05*(accuracy-50)), 1/1.1)))
  {
  	return critDamage;
  }
  else
  {
  	return 1;
  }
}

export function punch (user, enemy) {
  if (user == 0)
  {
    punch.title = "Punch";
    punch.description = "Deals damage equivalent to your strenth. 5% chance to both miss and crit.";
    punch.stam = 20;
    return punch;
  } else {
	let dmg = 1*user.str;
  let x = checkHit(user.acc, 0.05, 0.05, 2);
  dmg = Math.round(dmg*x);
  if (x == 0)
  {
    punch.result = (user.name +  " missed.");
  }
  else if (x == 1)
  {
    punch.result = (user.name + " punches " + enemy.name + ", dealing " + dmg + "dmg.");
  }
  else
  {
    punch.result = (`Critical hit! ${user.name} wallops ${enemy.name}, dealing ${dmg} dmg.`);
  }
  return dmg;
}}
export function claw (user, enemy) {
  if (user == 0)
  {
    claw.title = "Claw";
    claw.description = "Combo (This move does not end your turn). Deals 50% damage, 5% chance to miss, 1% chance to crit.";
    claw.stam = 10;
    claw.combo = true;
    return claw;
  } else {
	let dmg = 0.5*user.str;
  let x = checkHit(user.acc, 0.05, 0.01, 2);
  dmg = Math.round(dmg*x);
  if (x == 0)
  {
    claw.result = (user.name +  " missed.");
  }
  else if (x == 1)
  {
    claw.result = (user.name + " claws " + enemy.name + ", dealing " + dmg + "dmg.");
  }
  else
  {
    claw.result = (`Critical hit! ${user.name} slashes ${enemy.name}'s neck with sharp claws, dealing ${dmg} dmg.`);
  }
  return dmg;
}}
export function tailWhip (user, enemy) {
  if (user == 0)
  {
    tailWhip.title = "Tail Whip";
    tailWhip.description = "A quick, low damage move. Deals 15% damage. Cannot miss or crit.";
    tailWhip.stam = 1;
    return tailWhip;
  } else {
	let dmg = 0.15*user.str;
  let x = checkHit(user.acc, 0.0, 0.0, 2);
  dmg = Math.round(dmg*x);
  if (x == 0)
  {
    tailWhip.result = (user.name +  " missed.");
  }
  if (x == 1)
  {
    tailWhip.result = (user.name + " whips " + enemy.name + ", dealing " + dmg + "dmg.");
  }
  else
  {
    tailWhip.result = (`Critical hit! ${user.name} lashes ${enemy.name} with their tail, dealing ${dmg} dmg.`);
  }
  return dmg;
}}
export function bite (user, enemy) {
  if (user == 0)
  {
    bite.title = "Bite";
    bite.description = "Bleed 10 (This move inflicts [10] extra damage to the opponent every time they take damage. Reduced by 1 at the end of your turn). Deals 100% damage."
    bite.stam = 35;
    bite.bleed = 10;
    return bite;
  }
  let dmg = 1*user.str;
  let x = checkHit(user.acc, 0.05, 0.05, 2);
  dmg = Math.round(dmg * x);
  if (x == 0)
  {
    bite.result = (`${user.name} missed.`);
  }
  else if (x == 1)
  {
    enemy.effects.applyBleed(bite.bleed);
    bite.result = (`${user.name} bites ${enemy.name}, dealing  ${dmg}dmg. ${enemy.name} has ${enemy.effects.bleed} Bleed.`);
  }
  else
  {
    enemy.effects.applyBleed(bite.bleed);
    bite.result = (`Critical hit! ${user.name} sinks their teeth into ${enemy.name}, dealing ${dmg} dmg. ${enemy.name} has ${enemy.effects.bleed} Bleed.`);
  }
  return dmg;
}

punch(0, 0);
claw(0, 0);
tailWhip(0, 0);
bite(0,0);