import { TextBox } from "./textual.js";
import { wait } from './utils.js';

export class IMG 
{
    constructor(filename, x, y, width, context, label="", textColor="#000")
    {
        this.image = new Image();
        this.image.src = filename;
        this.x = x;
        this.y = y;
        this.context = context;

        this.loaded = new Promise(resolve =>
            {
                this.image.onload = () =>
                {
                    this.width = width;
                    this.height = this.image.height * (this.width/this.image.width);
                    this.label = new TextBox(label, x, y + this.height*1.085, context, this.width, this.height/13, textColor);
                    resolve(true);
                }
            });
    }
    async draw()
    {
        await this.loaded;
        this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.label.draw();
    }

    async jiggle(amount, drawings)
    {
        drawings.erase();
        let origX = this.x;
        let origY = this.y;
        let origW = this.width;
        let origH = this.height;
        //this.x += amount;
        this.y -= amount;
        this.width *= 0.9;
        this.height *= 0.95;
        drawings.draw();
        await wait(amount*50);
        drawings.erase();
        this.x = origX;
        this.y = origY;
        this.width = origW;
        this.height = origH;
        drawings.draw();
    }
}

export class Drawings
{
    constructor(context, background, mainText, ...args)
    {
        this.context = context;
        this.background = background;
        this.mainText = mainText;
        this.list = [];
        for (let i = 0; i < args.length; ++i)
        {
            this.list.push(args[i]);
        }
        this.oldLists = [];
    }
    async update()
    {
        await this.erase();
        await this.draw();
    }
    async add(item) //push and update
    {
        this.list.push(item);
        await this.update();
    }
    async erase(canvasColor = '#FFF')
    {
        let prevColor = this.context.fillStyle;

        this.context.fillStyle = canvasColor;
        this.context.fillRect(0, 0, 800, 500);
        
        this.context.fillStyle = prevColor;
    }
    async draw()
    {
        await this.background.draw();
        for (const d in this.list)
        {
            if (this.list[d].visibility == undefined || this.list[d].visibility == true)
            {
                await this.list[d].draw();
            }
        }
        if (this.mainText.text !== "" && (this.mainText.visibility == undefined || this.mainText.visibility == true))
        {
            await this.mainText.draw();
        }
    }
    async clear()
    {
        //remove everything except background and maintext, save old scene
        this.oldLists.push(this.list);
        this.list = [];
    }
    async back()
    {
        //go back to previous scene
        this.list = this.oldLists.pop();
    }
    push(...items)
    {
        for (const item in items)
        {
            if (!(items[item] in this.list))
            {
                this.list.push(items[item]);
            }
        }
    }
}