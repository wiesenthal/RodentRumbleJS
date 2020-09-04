// JavaScript source code
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
		}, (60*x.length));
	}
	);
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
	canvas.addEventListener('click', function (e) {
	  let rect = canvas.getBoundingClientRect();
	  let x = e.clientX - rect.left;
	  let y = e.clientY - rect.top;
	  resolve([x, y]);
	}, { once: true }));
}