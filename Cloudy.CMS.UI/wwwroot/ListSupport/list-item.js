﻿


/* LIST ITEM */

class ListItem {
    onDisabledClickCallbacks = [];
    onClickCallbacks = [];
    element = null;
    content = null;
    textContainer = null;
    text = null;

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

        this.content.addEventListener('click', () => this.triggerClick());
    }

    triggerClick() {
        if (this.element.classList.contains('cloudy-ui-disabled')) {
            this.onDisabledClickCallbacks.forEach(callback => callback());
            return;
        }

        this.onClickCallbacks.forEach(callback => callback());
    }

    onClick(callback) {
        this.onClickCallbacks.push(callback);

        return this;
    }

    onDisabledClick(callback) {
        this.onDisabledClickCallbacks.push(callback);

        return this;
    }

    setText(value) {
        if (!this.textContainer) {
            this.textContainer = document.createElement('cloudy-ui-list-item-text-container');
            this.content.append(this.textContainer);
        }
        if (!this.text) {
            this.text = document.createElement('cloudy-ui-list-item-text');
            this.textContainer.append(this.text);
        }
        this.text.innerHTML = value;

        return this;
    }

    setSubText(value) {
        if (!this.textContainer) {
            this.textContainer = document.createElement('cloudy-ui-list-item-text-container');
            this.content.append(this.textContainer);
        }
        if (!this.subText) {
            this.subText = document.createElement('cloudy-ui-list-item-sub-text');
            this.textContainer.append(this.subText);
        }

        if (!value) {
            this.subText.style.display = 'none';
            return;
        } else {
            this.subText.style.display = 'block';
        }

        this.subText.innerHTML = value;

        return this;
    }

    setImage(value) {
        if (!this.image) {
            this.image = document.createElement('img');
            this.image.classList.add('cloudy-ui-list-item-image');
            this.content.insertBefore(this.image, this.textContainer);
        }

        if (!value) {
            this.image.style.display = 'none';
            return;
        } else {
            this.image.style.display = 'block';
        }

        this.image.src = value;

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

    setDisabled(value = true) {
        if (value) {
            this.element.classList.add('cloudy-ui-disabled');
        } else {
            this.element.classList.remove('cloudy-ui-disabled');
        }

        return this;
    }

    appendTo(element) {
        element.appendChild(this.element);

        return this;
    }
}

export default ListItem;