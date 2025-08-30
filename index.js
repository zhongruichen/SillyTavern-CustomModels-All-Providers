import { saveSettingsDebounced } from '../../../../script.js';
import { extension_settings } from '../../../extensions.js';

const supportedProviders = [
    'openai', 'claude', 'windowai', 'aimlapi', 'openrouter', 'ai21', 'scale',
    'makersuite', 'vertexai', 'mistralai', 'custom', 'cohere', 'perplexity',
    'groq', '01ai', 'nanogpt', 'deepseek', 'xai', 'pollinations', 'novelai',
    'koboldai', 'textgenerationwebui', 'horde', 'anthropic', 'together',
];

const defaultSettings = { provider: {} };
for (const provider of supportedProviders) {
    defaultSettings.provider[provider] = [];
    defaultSettings[`${provider}_model`] = undefined;
}

const settings = { ...defaultSettings };
Object.assign(settings, extension_settings.customModels ?? {});

// Fix for settings from older versions
for (const provider of supportedProviders) {
    if (!settings.provider[provider]) {
        settings.provider[provider] = [];
    }
}

// old popups, ancient ST
let popupCaller;
let popupType;
let popupResult;
try {
    const popup = await import('../../../popup.js');
    popupCaller = popup.callGenericPopup;
    popupType = popup.POPUP_TYPE;
    popupResult = popup.POPUP_RESULT;
} catch {
    popupCaller = (await import('../../../../script.js')).callPopup;
    popupType = {
        TEXT: 1,
    };
    popupResult = {
        AFFIRMATIVE: 1,
    };
}

setTimeout(() => {
    for (const [provider, models] of Object.entries(settings.provider)) {
        const sel = /**@type {HTMLSelectElement}*/(document.querySelector(`#model_${provider}_select`));
        if (!sel) continue; // Skip if the provider's select element doesn't exist
        let h4 = sel.parentElement.querySelector('h4');
        if (!h4) {
            const parent = sel.parentElement;
            if (parent && parent.previousElementSibling && parent.previousElementSibling.tagName === 'H4') {
                h4 = /** @type {HTMLElement} */ (parent.previousElementSibling);
            }
        }
        if (!h4) continue; // Skip if the header element doesn't exist

        const btn = document.createElement('div'); {
            btn.classList.add('stcm--btn');
            btn.classList.add('menu_button');
            btn.classList.add('fa-solid', 'fa-fw', 'fa-pen-to-square');
            btn.title = 'Edit custom models';
            btn.addEventListener('click', async()=>{
                let inp;
                const dom = document.createElement('div'); {
                    const header = document.createElement('h3'); {
                        header.textContent = `Custom Models: ${provider}`;
                        dom.append(header);
                    }
                    const hint = document.createElement('small'); {
                        hint.textContent = 'one model name per line';
                        dom.append(hint);
                    }
                    inp = document.createElement('textarea'); {
                        inp.classList.add('text_pole');
                        inp.rows = 20;
                        inp.value = models.join('\n');
                        dom.append(inp);
                    }
                }
                const prom = popupCaller(dom, popupType.TEXT, null, { okButton: 'Save' });
                const result = await prom;
                if (result == popupResult.AFFIRMATIVE) {
                    while (models.pop());
                    models.push(...inp.value.split('\n').filter(it=>it.length));
                    extension_settings.customModels = settings;
                    saveSettingsDebounced();
                    populateCustomModels();
                    if (settings[`${provider}_model`] && models.includes(settings[`${provider}_model`])) {
                        sel.value = settings[`${provider}_model`];
                        sel.dispatchEvent(new Event('change', { bubbles:true }));
                    }
                }
            });
            h4.append(btn);
        }
        const populateCustomModels = () => {
            if (provider === 'custom') {
                const datalist = document.querySelector('#model_custom_select_fill');
                if (sel) sel.innerHTML = '';
                if (datalist) datalist.innerHTML = '';

                for (const model of models) {
                    const opt = document.createElement('option');
                    opt.value = model;
                    opt.textContent = model;
                    if (sel) sel.append(opt.cloneNode(true));
                    if (datalist) datalist.append(opt);
                }
            } else {
                let optgroup = sel.querySelector('optgroup[label="Custom Models"]');
                if (!optgroup) {
                    optgroup = document.createElement('optgroup');
                    optgroup.label = 'Custom Models';
                    sel.insertBefore(optgroup, sel.children[0]);
                }
                optgroup.innerHTML = '';
                for (const model of models) {
                    const opt = document.createElement('option');
                    opt.value = model;
                    opt.textContent = model;
                    optgroup.append(opt);
                }
            }
        };
        populateCustomModels();
        if (settings[`${provider}_model`] && models.includes(settings[`${provider}_model`])) {
            sel.value = settings[`${provider}_model`];
            sel.dispatchEvent(new Event('change', { bubbles:true }));
        }
        sel.addEventListener('change', (evt)=>{
            evt.stopImmediatePropagation();
            if (settings[`${provider}_model`] != sel.value) {
                settings[`${provider}_model`] = sel.value;
                extension_settings.customModels = settings;
                saveSettingsDebounced();
            }
        });
    }
}, 500);
