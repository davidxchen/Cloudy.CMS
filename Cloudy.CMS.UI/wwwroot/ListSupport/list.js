﻿


/* LIST */

class List {
    constructor() {
        this.element = document.createElement('cloudy-ui-list');
    }

    addItem(configurator) {
        var item = new ListItem();

        configurator(item);

        item.appendTo(this.element);

        return this;
    }

    addSubHeader(text) {
        var header = document.createElement('cloudy-ui-list-sub-header');
        header.innerText = text;
        this.element.append(header);

        return this;
    }

    appendTo(element) {
        element.appendChild(this.element);

        return this;
    }
}

class ListItem {
    constructor() {
        this.element = document.createElement('cloudy-ui-list-item');
        this.content = document.createElement('cloudy-ui-list-item-content');
        this.element.append(this.content);

        this.content.tabIndex = 0;

        this.content.addEventListener("keyup", event => {
            if (event.keyCode != 13) {
                return;
            }

            event.preventDefault();
            this.content.click();
        });

        this.callbacks = {
            click: [],
        };

        this.content.addEventListener('click', () => this.triggerClick());
    }

    triggerClick() {
        this.callbacks.click.forEach(callback => callback());
    }

    onClick(callback) {
        this.callbacks.click.push(callback);

        return this;
    }

    setText(value) {
        if (!this.text) {
            this.text = document.createElement('cloudy-ui-list-item-text');
            this.content.append(this.text);
        }
        this.text.innerText = value;

        return this;
    }

    setSubText(value) {
        if (!this.subText) {
            this.subText = document.createElement('cloudy-ui-list-item-sub-text');
            this.content.append(this.subText);
        }
        this.subText.innerText = value;

        return this;
    }

    setMenu(menu) {
        this.menu = menu;
        this.menu.appendTo(this.element);
    }

    setActive(value = true) {
        if (value) {
            this.element.classList.add('cloudy-ui-active');
        } else {
            this.element.classList.remove('cloudy-ui-active');
        }

        return this;
    }

    appendTo(element) {
        element.appendChild(this.element);

        return this;
    }
}

export default List;