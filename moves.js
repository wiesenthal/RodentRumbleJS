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

export function bite (user, enemy) {
  if (user == 0)
  {
    bite.title = "Bite";
    bite.description = "A normal bite move.";
    bite.tempoCost = 10;
    return bite;
  } else {
	let dmg = Math.floor(1*user.str);
 	let x = Math.floor(checkHit(user.acc, 0.05, 0.05, 2));
  enemy.damage(dmg * x);
  if (x == 0)
  {
    return (user.name +  " missed.");
  }
  if (x == 1)
  {
    return (user.name + " bites " + enemy.name + ", dealing " + dmg + "dmg.");
  }
  else
  {
    return (`Critical hit! ${user.name} sinks their teeth into ${enemy.name}, dealing ${dmg*x} dmg.`);
  }
}}
export function claw (user, enemy) {
  if (user == 0)
  {
    claw.title = "Claw";
    claw.description = "A weaker, but less tempo exhaustive move.";
    claw.tempoCost = 5;
    return claw;
  } else {
	let dmg = Math.floor(0.65*user.str);
 	let x = Math.floor(checkHit(user.acc, 0.05, 0.05, 2));
  enemy.damage(dmg * x);
  if (x == 0)
  {
    return (user.name +  " missed.");
  }
  if (x == 1)
  {
    return (user.name + " claws " + enemy.name + ", dealing " + dmg + "dmg.");
  }
  else
  {
    return (`Critical hit! ${user.name} slashes ${enemy.name}'s neck with sharp claws, dealing ${dmg*x} dmg.`);
  }
}}
export function tailWhip (user, enemy) {
  if (user == 0)
  {
    tailWhip.title = "Tail Whip";
    tailWhip.description = "A quick, low damage move which uses zero tempo. Has a high chance to miss. Has a low chance to crit.";
    tailWhip.tempoCost = 0;
    return tailWhip;
  } else {
	let dmg = Math.floor(0.2*user.str);
 	let x = Math.floor(checkHit(user.acc, 0.2, 0.05, 2));
  enemy.damage(dmg * x);
  if (x == 0)
  {
    return (user.name +  " missed.");
  }
  if (x == 1)
  {
    return (user.name + " whips " + enemy.name + ", dealing " + dmg + "dmg.");
  }
  else
  {
    return (`Critical hit! ${user.name} lashes ${enemy.name} with their tail, dealing ${dmg*x} dmg.`);
  }
}}
bite(0, 0);
claw(0, 0);
tailWhip(0, 0);