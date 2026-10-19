'use strict';

// Self-contained browser mock for checking the userscript in Node.js.
// The actual NGA DOM may differ; these tests do not replace browser testing.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const code = fs.readFileSync(path.join(__dirname, '..', 'nga-ad-hider.user.js'), 'utf8');

function environment(storage = {}) {
    function create(tag, id='', parent=null, rectangle=null) {
        const el = {
            id, tagName: tag.toUpperCase(), localName: tag.toLowerCase(),
            nodeType: 1, parentElement: parent, children: [],
            isAdMark: false, style: {}, textContent: '', listeners: {},
            classList: {
                items: new Set(),
                add(name) { this.items.add(name); },
                remove(name) { this.items.delete(name); },
                contains(name) { return this.items.has(name); }
            },
            getBoundingClientRect() {
                return rectangle || {left:0,right:0,width:0,height:0,top:0};
            },
            appendChild(child) {
                child.parentElement = this;
                this.children.push(child);
                return child;
            },
            append(...children) {
                children.forEach(child => this.appendChild(child));
            },
            remove() {
                if (!this.parentElement) return;
                const children = this.parentElement.children;
                const index = children.indexOf(this);
                if (index >= 0) children.splice(index, 1);
            },
            addEventListener(name, fn) { this.listeners[name] = fn; },
            removeEventListener(name) { delete this.listeners[name]; },
            matches(query) {
                if (query === 'img,iframe') return /^(IMG|IFRAME)$/.test(this.tagName);
                return false;
            },
            closest(query) {
                if (query.includes('postcontent') ||
                    query.includes('.postcontent') || query.includes('postrow')) {
                    for (let n=this; n; n=n.parentElement) {
                        if (n.id.startsWith('postcontent') || n.id.startsWith('user-post')) return n;
                    }
                    return null;
                }
                if (query.includes('a,iframe')) {
                    for (let n=this; n; n=n.parentElement) {
                        if (n.tagName === 'A' || n.tagName === 'IFRAME') return n;
                    }
                    return null;
                }
                return null;
            },
            querySelectorAll(query) {
                const results = [];
                function walk(node) {
                    for (const child of node.children) {
                        if (query === 'img, iframe' && /^(IMG|IFRAME)$/.test(child.tagName)) {
                            results.push(child);
                        } else if (query.includes('admark.png') && child.isAdMark) {
                            results.push(child);
                        } else if (query.includes('img[alt="广告"]') && child.isAdMark) {
                            results.push(child);
                        }
                        walk(child);
                    }
                }
                walk(this);
                return [...new Set(results)];
            },
            querySelector(query) {
                if (query.includes('admark.png') || query.includes('img[alt="广告"]')) {
                    return this.querySelectorAll(query)[0] || null;
                }
                return null;
            }
        };
        if (parent) parent.children.push(el);
        return el;
    }

    const html=create('html');
    const head=create('head','',html);
    const body=create('body','',html);
    const right=create('div','right-game-ad',body,
        {left:1757,right:1883,width:126,height:310,top:202});
    const rightWrapper=create('div','',right,
        {left:1775,right:1878,width:103,height:300,top:207});
    const marker=create('img','',rightWrapper,
        {left:1810,right:1870,width:60,height:15,top:470});
    marker.isAdMark=true;

    const banner=create('div','wide-game-ad',body,
        {left:9,right:1884,width:1875,height:102,top:80});
    const link=create('a','',banner,
        {left:462,right:1434,width:972,height:91,top:85});
    const bannerImg=create('img','',link,
        {left:462,right:1434,width:972,height:91,top:85});

    const post=create('div','postcontent-101',body,
        {left:10,right:1870,width:1860,height:1100,top:220});
    const panorama=create('div','user-panorama',post,
        {left:9,right:1884,width:1875,height:102,top:400});
    create('img','',panorama,
        {left:462,right:1434,width:972,height:91,top:405});

    const menus=[];
    const warnings=[];
    let reloadCount=0;
    let mask=null;

    const document={
        documentElement:html,head,body,
        createElement(tag) {
            const e=create(tag);
            if(tag==='div' && !mask) mask=e;
            return e;
        },
        getElementById(id) {
            function visit(n) {
                if (n.id === id) return n;
                for (const ch of n.children) {
                    const found=visit(ch);
                    if(found) return found;
                }
                return null;
            }
            return visit(html);
        },
        querySelector(q) {
            if (q.startsWith('#')) return this.getElementById(q.substring(1));
            if (/[{};]/.test(q)) throw new Error('invalid CSS');
            return null;
        },
        querySelectorAll(q) {
            if (q.includes('admark.png') || q.includes('img[alt="广告"]')) return [marker];
            if (q==='img, iframe') return [marker,bannerImg,panorama.children[0]];
            return [];
        },
        elementFromPoint(x) { return x < 1500 ? bannerImg : marker; },
        listeners:{},
        addEventListener(name, fn) { this.listeners[name]=fn; },
        removeEventListener(name) {delete this.listeners[name];}
    };

    const window={
        innerWidth:1883,innerHeight:900,
        alerts:[],
        alert(msg){this.alerts.push(msg);},
        confirm(){return true;},
        getComputedStyle(node) {
            const dark=(node===banner||node===panorama);
            return {backgroundColor:dark ? 'rgb(62, 58, 51)' : 'rgba(0, 0, 0, 0)'};
        },
        location:{reload(){reloadCount++;}}
    };

    const context={
        window,document,console,Promise,
        CSS:{escape:value=>value},
        MutationObserver:class {observe(){} disconnect(){}},
        GM_getValue:(key,def)=>Object.prototype.hasOwnProperty.call(storage,key)
            ?storage[key]:def,
        GM_setValue:(key,val)=>{storage[key]=val;},
        GM_registerMenuCommand:(label,fn)=>{menus.push({label,fn});}
    };
    vm.runInNewContext(code,context);

    return {
        menus,storage,window,document,right,banner,panorama,
        getStyle(){return document.getElementById('nga-ad-hider-independent-style').textContent;},
        getMask(){return mask;},
        reloadCount(){return reloadCount;},
        menu(fragment){
            const menu=menus.find(m=>m.label.includes(fragment));
            assert.ok(menu,`menu exists: ${fragment}`);
            return menu.fn;
        }
    };
}

const store={};
const first=environment(store);

// Advertisements should be detected, but ordinary post images protected.
assert.equal(first.menus.length,7);
assert.ok(first.right.classList.contains('nga-ad-hider-right-hidden'));
assert.ok(first.banner.classList.contains('nga-ad-hider-banner-hidden'));
assert.equal(first.panorama.classList.contains('nga-ad-hider-banner-hidden'),false);
assert.ok(first.getStyle().includes('.nga-ad-hider-banner-hidden'));
assert.equal(first.getStyle().includes('td.null'),false);

// The wide picker selects the complete background strip.
first.menu('点选未隐藏的广告')();
const mask=first.getMask();
assert.ok(mask.listeners.click,'picker click event registered');
mask.listeners.click({
    clientX:950,clientY:130,
    preventDefault(){},stopPropagation(){}
});
let persisted=JSON.parse(store['nga-ad-hider:settings:v1']);
assert.ok(persisted.customRules.includes('#wide-game-ad'));
assert.ok(first.getStyle().includes('#wide-game-ad'));
assert.ok(first.window.alerts.some(m=>m.includes('已隐藏')));

// A new page load retains the custom rule and an independent side-ad toggle.
first.menu('自动隐藏横向通栏广告')();
assert.equal(first.reloadCount(),1);
persisted=JSON.parse(store['nga-ad-hider:settings:v1']);
assert.equal(persisted.hideBanner,false);
const second=environment(store);
assert.equal(second.banner.classList.contains('nga-ad-hider-banner-hidden'),false);
assert.ok(second.right.classList.contains('nga-ad-hider-right-hidden'));
assert.equal(second.getStyle().includes('.nga-ad-hider-banner-hidden'),false);
assert.ok(second.getStyle().includes('#wide-game-ad'));

// Switch off the global setting, reload, and confirm no ad-hiding CSS.
second.menu('广告隐藏总开关')();
const third=environment(store);
assert.equal(third.getStyle(),'');
assert.equal(third.right.classList.contains('nga-ad-hider-right-hidden'),false);
assert.equal(third.banner.classList.contains('nga-ad-hider-banner-hidden'),false);

// Reset hand-selected rules without affecting individual toggles.
third.menu('清空手动规则')();
persisted=JSON.parse(store['nga-ad-hider:settings:v1']);
assert.deepEqual(persisted.customRules,[]);
assert.equal(persisted.enabled,false);
assert.equal(persisted.hideBanner,false);

// Script must remain stand-alone.
assert.equal(code.includes('registerPlugin('),false);
assert.equal(code.includes('unsafeWindow'),false);
assert.equal(/^[ \/]*@require\s/m.test(code.split('// ==/UserScript==')[0]),false,
    'no third-party required scripts in userscript metadata');

console.log('PASS: independent install, right ad, wide banner, normal-post protection, picker, saved rules, independent toggles, global switch, restore');
