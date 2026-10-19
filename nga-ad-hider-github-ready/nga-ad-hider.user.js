// ==UserScript==
// @name         NGA 广告隐藏
// @namespace    nga-ad-hider.community
// @version      1.0.0
// @description  独立隐藏 NGA 论坛右侧广告和横幅广告，支持点选屏蔽、开关及规则保存。
// @author       NGA Ad Hider contributors
// @license      MIT
// @match        *://bbs.nga.cn/*
// @match        *://ngabbs.com/*
// @match        *://www.ngabbs.com/*
// @match        *://nga.178.com/*
// @match        *://g.nga.cn/*
// @run-at       document-start
// @noframes
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

/*
 * NGA Ad Hider — independent Tampermonkey userscript.
 *
 * No NGA-BBS-Script API, jQuery, remote libraries, @require, or network calls.
 * Advertising elements are only hidden visually; network requests are not blocked.
 * Use the Tampermonkey icon on NGA to toggle features or select an ad manually.
 */
(function () {
    'use strict';

    const VERSION = '1.0.0';
    const STORAGE_KEY = 'nga-ad-hider:settings:v1';
    const STYLE_ID = 'nga-ad-hider-independent-style';
    const RIGHT_CLASS = 'nga-ad-hider-right-hidden';
    const BANNER_CLASS = 'nga-ad-hider-banner-hidden';
    const MARKER = 'img[src*="admark.png"], img[alt="广告"]';
    const MAX_RULES = 60;
    const MAX_RULE_LENGTH = 400;
    const PROTECTED_POST =
        '.postcontent, .postrow, .ubbcode, .post_content, .post_body, [id^="postcontent"]';

    const DEFAULTS = {
        enabled: true,
        hideRight: true,
        hideBanner: true,
        hideLegacySlots: true,
        aggressive: false,
        customRules: []
    };

    function safeRule(selector) {
        if (typeof selector !== 'string' ||
            !selector || selector.length > MAX_RULE_LENGTH ||
            /[{};]/.test(selector)) return false;
        try {
            document.querySelector(selector);
            return true;
        } catch (_) {
            return false;
        }
    }

    function loadSettings() {
        let raw;
        try {
            raw = GM_getValue(STORAGE_KEY, null);
            if (typeof raw === 'string') raw = JSON.parse(raw);
        } catch (error) {
            console.warn('[NGA Ad Hider] 读取设置失败，使用默认值', error);
            raw = null;
        }
        if (!raw || typeof raw !== 'object' || Array.isArray(raw)) raw = {};
        return {
            enabled: typeof raw.enabled === 'boolean' ? raw.enabled : DEFAULTS.enabled,
            hideRight: typeof raw.hideRight === 'boolean' ? raw.hideRight : DEFAULTS.hideRight,
            hideBanner: typeof raw.hideBanner === 'boolean' ? raw.hideBanner : DEFAULTS.hideBanner,
            hideLegacySlots: typeof raw.hideLegacySlots === 'boolean'
                ? raw.hideLegacySlots : DEFAULTS.hideLegacySlots,
            aggressive: typeof raw.aggressive === 'boolean' ? raw.aggressive : DEFAULTS.aggressive,
            customRules: Array.isArray(raw.customRules)
                ? [...new Set(raw.customRules.filter(safeRule))].slice(0, MAX_RULES)
                : []
        };
    }

    let settings = loadSettings();

    function saveSettings() {
        GM_setValue(STORAGE_KEY, JSON.stringify(settings));
    }

    function renderStyle() {
        if (!document.documentElement) return false;
        let style = document.getElementById(STYLE_ID);
        if (!style) {
            style = document.createElement('style');
            style.id = STYLE_ID;
            (document.head || document.documentElement).appendChild(style);
        }
        if (!settings.enabled) {
            style.textContent = '';
            return true;
        }

        const selectors = [
            ...(settings.hideLegacySlots ? [
                '#m_posts_c > span',
                '#toptopics + span'
            ] : []),
            ...(settings.hideRight ? ['.' + RIGHT_CLASS] : []),
            ...(settings.hideBanner ? ['.' + BANNER_CLASS] : []),
            ...(settings.aggressive ? ['td.null'] : []),
            ...settings.customRules.filter(safeRule)
        ];
        style.textContent =
            selectors.map(s => `${s} { display: none !important; }`).join('\n');
        return true;
    }

    // Inject the style at document-start, before normal page rendering.
    if (!renderStyle()) {
        const setupObserver = new MutationObserver(() => {
            if (renderStyle()) setupObserver.disconnect();
        });
        setupObserver.observe(document, {childList: true, subtree: true});
    }

    function rect(element) {
        return element && element.getBoundingClientRect
            ? element.getBoundingClientRect() : null;
    }

    function compactRightBox(element) {
        let selected = null;
        const width = window.innerWidth || 1;
        const height = window.innerHeight || 1;
        for (let node = element; node &&
             node !== document.body && node !== document.documentElement;
             node = node.parentElement) {
            const r = rect(node);
            if (r && r.width >= 65 &&
                r.width <= Math.min(460, width * 0.43) &&
                r.height >= 95 &&
                r.height <= Math.max(1500, height * 2) &&
                r.left >= width * 0.55 && r.right >= width - 180) {
                selected = node; // Prefer the wrapper including the dark side panel.
            }
        }
        return selected;
    }

    function isWideCreative(element) {
        if (!element || !/^(IMG|IFRAME)$/.test(element.tagName || '')) return false;
        const r = rect(element);
        return !!r && r.width >= 480 && r.height >= 45 &&
            r.height <= 200 && r.width / Math.max(1, r.height) >= 3.6;
    }

    function isWideStrip(element) {
        const r = rect(element);
        const vw = window.innerWidth || 1;
        return !!r && r.width >= Math.max(600, vw * 0.56) &&
            r.width <= vw + 120 &&
            r.height >= 55 && r.height <= 220 &&
            r.width / Math.max(1, r.height) >= 4.2 &&
            r.left <= vw * 0.36 && r.right >= vw * 0.64;
    }

    function containsWideCreative(element) {
        if (isWideCreative(element)) return true;
        return !!element.querySelectorAll &&
            Array.from(element.querySelectorAll('img, iframe')).some(isWideCreative);
    }

    function hasAdLabel(element) {
        if (!element.querySelector) return false;
        return !!element.querySelector(
            `${MARKER}, [aria-label="广告"], [title="广告"], [data-ad-label="广告"]`
        );
    }

    function hasDarkBackground(element) {
        if (typeof window.getComputedStyle !== 'function') return false;
        const color = window.getComputedStyle(element).backgroundColor || '';
        const values = color.match(
            /^rgba?\(\s*([\d.]+)[,\s]+\s*([\d.]+)[,\s]+\s*([\d.]+)(?:[,\s/]+\s*([\d.]+))?\s*\)$/
        );
        if (!values) return false;
        const [r, g, b] = [Number(values[1]), Number(values[2]), Number(values[3])];
        const alpha = values[4] === undefined ? 1 : Number(values[4]);
        return alpha >= 0.7 && (r * 0.2126 + g * 0.7152 + b * 0.0722) < 120;
    }

    function insidePost(element) {
        return !!(element.closest && element.closest(PROTECTED_POST));
    }

    function wideBannerBox(element, manual = false) {
        if (!element || insidePost(element)) return null;
        let selected = null;
        let node = element;
        for (let depth = 0; node && depth < 10 &&
             node !== document.body && node !== document.documentElement;
             node = node.parentElement, depth++) {
            if (!isWideStrip(node) || !containsWideCreative(node)) continue;
            // Don't hide an ordinary panorama just because it is wide.
            if (manual || hasAdLabel(node) || hasDarkBackground(node)) {
                selected = node;
            }
        }
        return selected;
    }

    function scanAds() {
        if (!settings.enabled) return;

        if (settings.hideRight) {
            document.querySelectorAll(MARKER).forEach(marker => {
                const container = compactRightBox(marker);
                if (container) container.classList.add(RIGHT_CLASS);
            });
        }

        if (settings.hideBanner) {
            document.querySelectorAll('img, iframe').forEach(element => {
                if (!isWideCreative(element)) return;
                const banner = wideBannerBox(element);
                if (banner) banner.classList.add(BANNER_CLASS);
            });
        }
    }

    function needsRescan(records) {
        return records.some(record => {
            if (record.type === 'attributes') {
                const name = record.target.tagName || '';
                return name === 'IMG' || name === 'IFRAME';
            }
            return Array.from(record.addedNodes || []).some(node =>
                node.nodeType === 1 && (
                    (node.matches && node.matches('img,iframe')) ||
                    (node.querySelector && node.querySelector('img,iframe'))
                )
            );
        });
    }

    let scanQueued = false;
    function queueScan() {
        if (scanQueued) return;
        scanQueued = true;
        // Microtask batching normally runs before the browser's next paint.
        Promise.resolve().then(() => {
            scanQueued = false;
            scanAds();
        });
    }

    function startScanning() {
        if (!settings.enabled || (!settings.hideRight && !settings.hideBanner)) return;
        scanAds();
        const observer = new MutationObserver(records => {
            if (needsRescan(records)) queueScan();
        });
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'alt']
        });
        document.addEventListener('load', event => {
            if (event.target && /^(IMG|IFRAME)$/.test(event.target.tagName || '')) {
                queueScan();
            }
        }, true);
    }

    if (document.documentElement) {
        startScanning();
    } else {
        const observer = new MutationObserver(() => {
            if (document.documentElement) {
                observer.disconnect();
                startScanning();
            }
        });
        observer.observe(document, {childList: true});
    }

    function toggle(option) {
        settings[option] = !settings[option];
        saveSettings();
        // Refresh to update menu labels and restore newly unhidden elements.
        window.location.reload();
    }

    function registerToggle(label, option) {
        GM_registerMenuCommand(
            `${settings[option] ? '✅' : '⬜'} ${label}（点击切换）`,
            () => toggle(option)
        );
    }

    function escapeId(value) {
        if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
            return CSS.escape(value);
        }
        return String(value).replace(/[^a-zA-Z0-9_-]/g, c => '\\' + c);
    }

    function selectorFor(element) {
        const parts = [];
        for (let node = element; node && node.nodeType === 1;
             node = node.parentElement) {
            if (node.id) {
                parts.unshift('#' + escapeId(node.id));
                break;
            }
            let part = node.localName.toLowerCase();
            if (node.parentElement) {
                const siblings = Array.from(node.parentElement.children)
                    .filter(sibling => sibling.localName === node.localName);
                if (siblings.length > 1) {
                    part += `:nth-of-type(${siblings.indexOf(node) + 1})`;
                }
            }
            parts.unshift(part);
            if (node === document.body) break;
        }
        return parts.join(' > ');
    }

    function pickContainer(element) {
        if (!element || element === document.body ||
            element === document.documentElement || insidePost(element)) return null;
        return compactRightBox(element) ||
            wideBannerBox(element, true) ||
            (element.closest && element.closest('a,iframe')) ||
            element;
    }

    function startPicker() {
        if (!settings.enabled) {
            window.alert('请先在油猴菜单中开启“广告隐藏总开关”。');
            return;
        }
        if (!document.body) {
            window.alert('请等页面加载完毕后再点选广告。');
            return;
        }

        const overlay = document.createElement('div');
        overlay.style.cssText =
            'position:fixed;inset:0;z-index:2147483644;cursor:crosshair;';
        const frame = document.createElement('div');
        frame.style.cssText =
            'position:fixed;z-index:2147483645;pointer-events:none;' +
            'outline:2px solid #db7532;background:rgba(219,117,50,.14);display:none;';
        const hint = document.createElement('div');
        hint.textContent = '点击广告保存隐藏规则 · Esc 取消（先确认橙色框范围）';
        hint.style.cssText =
            'position:fixed;top:12px;left:50%;transform:translateX(-50%);' +
            'z-index:2147483646;pointer-events:none;color:#fff;background:#17434a;' +
            'padding:10px 14px;border-radius:8px;font:14px sans-serif;';
        document.body.append(overlay, frame, hint);

        function underPointer(x, y) {
            overlay.style.pointerEvents = 'none';
            const element = document.elementFromPoint(x, y);
            overlay.style.pointerEvents = 'auto';
            return pickContainer(element);
        }

        function cleanup() {
            document.removeEventListener('keydown', onKey, true);
            overlay.remove();
            frame.remove();
            hint.remove();
        }

        function onKey(event) {
            if (event.key === 'Escape') {
                event.preventDefault();
                cleanup();
            }
        }
        document.addEventListener('keydown', onKey, true);

        overlay.addEventListener('pointermove', event => {
            const target = underPointer(event.clientX, event.clientY);
            if (!target) {
                frame.style.display = 'none';
                return;
            }
            const r = rect(target);
            Object.assign(frame.style, {
                display: 'block',
                left: r.left + 'px',
                top: r.top + 'px',
                width: r.width + 'px',
                height: r.height + 'px'
            });
        });

        overlay.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            const target = underPointer(event.clientX, event.clientY);
            if (!target) {
                cleanup();
                return;
            }
            const rule = selectorFor(target);
            if (!safeRule(rule)) {
                cleanup();
                window.alert('未能为该广告生成可靠的 CSS 规则。');
                return;
            }
            if (!settings.customRules.includes(rule)) {
                if (settings.customRules.length >= MAX_RULES) {
                    cleanup();
                    window.alert(`点选规则最多 ${MAX_RULES} 条。`);
                    return;
                }
                settings.customRules.push(rule);
            }
            saveSettings();
            renderStyle();
            cleanup();
            window.alert('已隐藏所选区域并保存规则。刷新后将继续生效。');
        }, true);
    }

    registerToggle('广告隐藏总开关', 'enabled');
    registerToggle('自动隐藏右侧广告', 'hideRight');
    registerToggle('自动隐藏横向通栏广告', 'hideBanner');
    registerToggle('隐藏传统广告位', 'hideLegacySlots');
    registerToggle('加强模式（可能误隐藏内容）', 'aggressive');

    GM_registerMenuCommand('🎯 点选未隐藏的广告', startPicker);
    GM_registerMenuCommand(`🧹 清空手动规则（目前 ${settings.customRules.length} 条）`, () => {
        if (!window.confirm('确定删除全部手动点选规则吗？自动隐藏功能不受影响。')) {
            return;
        }
        settings.customRules = [];
        saveSettings();
        window.location.reload();
    });

    console.info(`[NGA Ad Hider v${VERSION}] 已启动`);
})();
