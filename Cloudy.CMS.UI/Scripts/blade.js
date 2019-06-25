﻿import BladeCloseButton from './close-button.js';



/* BLADE */

class Blade {
    constructor() {
        this.element = document.createElement('poetry-ui-blade');
        this.element.addEventListener('poetry-ui-close-blade', event => {
            if (event.detail && event.detail.blade) {
                return;
            }

            event.stopPropagation();

            this.element.dispatchEvent(new CustomEvent('poetry-ui-close-blade', { bubbles: true, detail: { blade: this, parameters: event.detail.parameters } }));
        });

        this.title = document.createElement('poetry-ui-blade-title');
        this.element.append(this.title);
        this.titleText = document.createElement('poetry-ui-blade-title-text');
        this.title.append(this.titleText);
        this.title.append(new BladeCloseButton().element);

        this.toolbar = document.createElement('poetry-ui-blade-toolbar');
        this.toolbar.style.display = 'none';
        this.element.append(this.toolbar);

        this.content = document.createElement('poetry-ui-blade-content');
        this.element.append(this.content);

        this.footer = document.createElement('poetry-ui-blade-footer');
        this.footer.style.display = 'none';
        this.element.append(this.footer);
    }

    setFullWidth() {
        this.element.classList.add('poetry-ui-fullwidth');
        return this;
    }

    setTitle(text) {
        this.titleText.innerText = text;
    }

    setToolbar(...items) {
        this.toolbar.style.display = '';
        [...this.toolbar.children].forEach(c => this.toolbar.removeChild(c));
        items.forEach(item => this.toolbar.append(item.element || item));
    }

    setContent(...items) {
        [...this.content.children].forEach(c => this.content.removeChild(c));
        items.forEach(item => this.content.append(item.element || item));
    }

    setFooter(...items) {
        this.footer.style.display = '';
        [...this.footer.children].forEach(c => this.footer.removeChild(c));
        items.forEach(item => this.footer.append(item.element || item));
    }

    open() {
        return new Promise(done => {
            this.element.classList.add('poetry-ui-hidden');
            this.element.getBoundingClientRect(); // force reflow

            this.element.classList.remove('poetry-ui-hidden');
            this.element.style.zIndex = -1;

            var callback = () => {
                this.element.style.zIndex = '';
                this.element.removeEventListener('transitionend', callback);
                done();
            }

            this.element.addEventListener('transitionend', callback);
        });
    }

    close(...parameters) {
        return new Promise(done => {
            this.element.classList.add('poetry-ui-hidden');

            if (!this.element.style.zIndex) {
                this.element.style.zIndex = -1;
            }

            var callback = () => {
                this.triggerOnClose(...parameters);
                this.element.removeEventListener('transitionend', callback);
                this.element.style.zIndex = '';
                done();
            }

            this.element.addEventListener('transitionend', callback);
        });
    }

    onClose(callback) {
        this.onCloseCallback = callback;

        return this;
    }

    triggerOnClose(...parameters) {
        if (!this.onCloseCallback) {
            return;
        }

        this.onCloseCallback(...parameters);
    }
}

export default Blade;