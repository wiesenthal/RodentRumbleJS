import {readingTime} from './config.js'

export function wait(x) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(true);
		}, x);
	}
	);
}

export function waitL(x) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(true);
		}, (readingTime*x.length));
	}
	);
}
export async function mainChange(newText, mainText, drawings) {
	mainText.change(newText);
	await drawings.update();
	await waitL(newText);
}

export class KeyHandler {
	constructor(d) {
		this._add_listeners(d);
		this.ctrl = false;
	}
	_add_listeners(d) {
		d.addEventListener('keydown', (e) => {
			if (e.keyCode == 17) {
				this.ctrl = true;
			}
		});
		d.addEventListener('keyup', (e) => {
			if (e.keyCode == 17)
			{
				this.ctrl = false;
			}
		});
	}
}

export async function debugMouse() {
	while (true) {
	  let [x, y] = await nextClick();
	  console.log(x + ", " + y);
	}
  }

export function nextClick(canvas) {
	return new Promise((resolve) =>
	{
	canvas.addEventListener('click', function (e) {
	  let rect = canvas.getBoundingClientRect();
	  let x = e.clientX - rect.left;
	  let y = e.clientY - rect.top;
	  resolve(['l', x, y]);
	}, { once: true });
	canvas.addEventListener('contextmenu', function (e)
	{
		e.preventDefault();
		let rect = canvas.getBoundingClientRect();
		let x = e.clientX - rect.left;
		let y = e.clientY - rect.top;
		resolve(['r', x, y]);
	}, {once: true});
	}
	);
}