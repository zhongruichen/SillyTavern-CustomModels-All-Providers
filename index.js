import { saveSettingsDebounced } from '../../../../script.js';
import { extension_settings } from '../../../extensions.js';
import { Popup, POPUP_TYPE } from '../../../popup.js';

const settings = {
    provider: {
        claude: [],
        openai: [],
        google: [],
    },
    openai_model: undefined,
    claude_model: undefined,
    google_model: undefined,
};
Object.assign(settings, extension_settings.customModels ?? {});

for (const [provider, models] of Object.entries(settings.provider)) {
    const sel = /**@type {HTMLSelectElement}*/(document.querySelector(`#model_${provider}_select`));
    const h4 = sel.parentElement.querySelector('h4');
    const btn = document.createElement('div'); {
        btn.classList.add('stcm--btn');
        btn.classList.add('menu_button');
        btn.classList.add('fa-solid', 'fa-fw', 'fa-pen-to-square');
        btn.title = 'Edit custom models';
        btn.addEventListener('click', async()=>{
            const dom = document.createElement('div'); {
                const header = document.createElement('h3'); {
                    header.textContent = `Custom Models: ${provider}`;
                    dom.append(header);
                }
                const hint = document.createElement('small'); {
                    hint.textContent = 'one model name per line';
                    dom.append(hint);
                }
            }
            const dlg = new Popup(dom, POPUP_TYPE.INPUT, models.join('\n'), { rows:20 });
            const prom = dlg.show();
            dlg.dlg.querySelector('textarea').addEventListener('keydown', (evt)=>{
                if (evt.key == 'Enter') {
                    evt.stopImmediatePropagation();
                    evt.stopPropagation();
                }
            });
            const result = await prom;
            if (result !== null && result !== undefined && result !== false) {
                while (models.pop());
                models.push(...result.split('\n').filter(it=>it.length));
                extension_settings.customModels = settings;
                saveSettingsDebounced();
                populateOptGroup();
                if (settings[`${provider}_model`] && models.includes(settings[`${provider}_model`])) {
                    sel.value = settings[`${provider}_model`];
                    sel.dispatchEvent(new Event('change', { bubbles:true }));
                }
            }
        });
        h4.append(btn);
    }
    const populateOptGroup = ()=>{
        grp.innerHTML = '';
        for (const model of models) {
            const opt = document.createElement('option'); {
                opt.value = model;
                opt.textContent = model;
                grp.append(opt);
            }
        }
    };
    const grp = document.createElement('optgroup'); {
        grp.label = 'Custom Models';
        populateOptGroup();
        sel.insertBefore(grp, sel.children[0]);
    }
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
    $(sel).on('change', (evt)=>{
        //! HACK jQuery is too dumb to trigger real change events, can only be caught by jQuery...
        if ((evt.originalEvent ?? evt)?.isTrusted === undefined) {
            // changes from jQuery code happen because not the entire <select> is checked, should revert
            // to saved value
            sel.value = settings[`${provider}_model`];
            sel.dispatchEvent(new Event('change', { bubbles:true }));
        }
    });
}

