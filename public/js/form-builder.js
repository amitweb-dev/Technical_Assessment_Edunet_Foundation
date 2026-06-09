document.addEventListener('DOMContentLoaded', () => {
    let formFields = [];
    let currentEditId = null;

    const canvas = document.getElementById('fb-canvas');
    const palette = document.getElementById('fb-palette');
    const emptyState = document.getElementById('fb-empty-state');
    const optionsPanel = document.getElementById('field-options-panel');
    const optionsForm = document.getElementById('options-form');
    const addFieldsPanel = document.getElementById('add-fields-panel');

    const subtabAdd = document.getElementById('subtab-add');
    const subtabOptions = document.getElementById('subtab-options');

    const tabEditor = document.getElementById('tab-editor');
    const tabSettings = document.getElementById('tab-settings');
    const panelEditor = document.getElementById('panel-editor');
    const panelSettings = document.getElementById('panel-settings');

    const btnNext = document.getElementById('btn-next');
    const btnCancel = document.getElementById('btn-cancel');

    const titleInput = document.getElementById('form-title');
    const titleCharCount = document.getElementById('title-char-count');

    const savedState = localStorage.getItem('formBuilderState');
    if (savedState) {
        try {
            formFields = JSON.parse(savedState);
            renderCanvas();
        } catch (e) {
            console.error(e);
        }
    }

    const savedTitle = localStorage.getItem('formBuilderTitle');
    if (savedTitle) {
        titleInput.value = savedTitle;
        titleCharCount.innerText = savedTitle.length;
    }

    titleInput.addEventListener('input', (e) => {
        titleCharCount.innerText = e.target.value.length;
        saveState();
    });

    tabEditor.addEventListener('click', () => {
        tabEditor.classList.add('active');
        tabSettings.classList.remove('active');
        panelEditor.classList.remove('fb-hidden');
        panelSettings.classList.add('fb-hidden');
    });

    tabSettings.addEventListener('click', () => {
        tabSettings.classList.add('active');
        tabEditor.classList.remove('active');
        panelSettings.classList.remove('fb-hidden');
        panelEditor.classList.add('fb-hidden');
    });

    subtabAdd.addEventListener('click', () => {
        openAddFields();
    });

    subtabOptions.addEventListener('click', () => {
        if (currentEditId) {
            openOptions();
        }
    });

    function openAddFields() {
        subtabAdd.classList.add('active');
        subtabOptions.classList.remove('active');
        addFieldsPanel.classList.remove('fb-hidden');
        optionsPanel.classList.add('fb-hidden');
    }

    function openOptions() {
        subtabOptions.classList.add('active');
        subtabAdd.classList.remove('active');
        optionsPanel.classList.remove('fb-hidden');
        addFieldsPanel.classList.add('fb-hidden');
    }

    if (palette) {
        new Sortable(palette, {
            group: {
                name: 'shared',
                pull: 'clone',
                put: false
            },
            animation: 150,
            sort: false
        });
    }

    const sortableCanvas = new Sortable(canvas, {
        group: 'shared',
        animation: 150,
        onAdd: function (evt) {
            const itemEl = evt.item;
            const type = itemEl.getAttribute('data-type');
            
            if (type) {
                const newField = {
                    id: 'field_' + Date.now(),
                    type: type,
                    label: getDefaultLabel(type),
                    placeholder: '',
                    required: false,
                    options: ['Option 1', 'Option 2'],
                    cssClass: '',
                    defaultValue: '',
                    minChars: '',
                    maxChars: ''
                };
                
                formFields.splice(evt.newIndex, 0, newField);
                itemEl.style.display = 'none'; // visually hide immediately
                saveState();
                setTimeout(() => {
                    itemEl.remove();
                    renderCanvasSafe();
                    editField(newField.id);
                }, 10);
            } else {
                itemEl.remove();
            }
        },
        onUpdate: function (evt) {
            const movedItem = formFields.splice(evt.oldIndex, 1)[0];
            formFields.splice(evt.newIndex, 0, movedItem);
            saveState();
            setTimeout(() => {
                renderCanvasSafe();
            }, 10);
        }
    });

    function renderCanvasSafe() {
        try {
            renderCanvas();
        } catch (err) {
            console.error("Error rendering canvas:", err);
        }
    }

    function getDefaultLabel(type) {
        const words = type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1));
        return words.join(' ');
    }

    function renderCanvas() {
        const cards = canvas.querySelectorAll('.fb-field-card');
        cards.forEach(c => c.remove());

        if (formFields.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
        }

        formFields.forEach((field) => {
            const tpl = document.getElementById('tpl-' + field.type);
            if (!tpl) return;

            const card = document.createElement('div');
            card.className = 'fb-field-card';
            if (field.id === currentEditId) {
                card.classList.add('active');
            }
            card.setAttribute('data-id', field.id);

            const actions = document.createElement('div');
            actions.className = 'fb-field-actions';
            actions.innerHTML = `
                <button class="fb-action-btn fb-drag-handle" title="Move"><i class="fa fa-arrows-alt"></i></button>
                <button class="fb-action-btn edit-btn" title="Edit"><i class="fa fa-edit"></i></button>
                <button class="fb-action-btn copy-btn" title="Duplicate"><i class="fa fa-copy"></i></button>
                <button class="fb-action-btn delete delete-btn" title="Delete"><i class="fa fa-trash"></i></button>
            `;
            
            const content = document.createElement('div');
            content.className = 'fb-field-content';
            content.innerHTML = tpl.innerHTML;
            
            const labelEl = content.querySelector('[data-bind="label"]');
            if (labelEl) labelEl.innerText = field.label + (field.required ? ' *' : '');
            
            const placeholderEl = content.querySelector('[data-bind-attr="placeholder"]');
            if (placeholderEl && field.placeholder) placeholderEl.setAttribute('placeholder', field.placeholder);

            if (field.cssClass) {
                const inputs = content.querySelectorAll('.fb-form-control');
                inputs.forEach(i => i.classList.add(field.cssClass));
            }
            
            const optionsEl = content.querySelector('[data-bind-options="options"]');
            if (optionsEl) {
                optionsEl.innerHTML = field.options.map(o => `<option>${o}</option>`).join('');
            }

            const radiosEl = content.querySelector('[data-bind-radios="options"]');
            if (radiosEl) {
                radiosEl.innerHTML = field.options.map((o, idx) => `<div><input type="radio" name="temp_${field.id}"> ${o}</div>`).join('');
            }

            const checkEl = content.querySelector('[data-bind-checkboxes="options"]');
            if (checkEl) {
                checkEl.innerHTML = field.options.map(o => `<div><input type="checkbox"> ${o}</div>`).join('');
            }

            card.appendChild(actions);
            card.appendChild(content);
            canvas.appendChild(card);

            actions.querySelector('.edit-btn').addEventListener('click', () => editField(field.id));
            actions.querySelector('.copy-btn').addEventListener('click', () => duplicateField(field.id));
            actions.querySelector('.delete-btn').addEventListener('click', () => deleteField(field.id));
        });
    }

    function editField(id) {
        currentEditId = id;
        renderCanvas();
        openOptions();
        
        const field = formFields.find(f => f.id === id);
        if (!field) return;

        let html = '';
        html += `<div class="fb-form-group"><label class="fb-form-label">Label</label><input type="text" class="fb-form-control" id="opt-label" value="${field.label}"></div>`;
        
        const typesWithPlaceholder = ['text-input', 'text-area', 'number-input', 'email-input', 'phone-input'];
        if (typesWithPlaceholder.includes(field.type)) {
            html += `<div class="fb-form-group"><label class="fb-form-label">Placeholder</label><input type="text" class="fb-form-control" id="opt-placeholder" value="${field.placeholder || ''}"></div>`;
        }

        const typesWithMinMax = ['text-input', 'text-area'];
        if (typesWithMinMax.includes(field.type)) {
            html += `<div class="fb-form-group"><label class="fb-form-label">Min Characters</label><input type="number" class="fb-form-control" id="opt-min" value="${field.minChars || ''}"></div>`;
            html += `<div class="fb-form-group"><label class="fb-form-label">Max Characters</label><input type="number" class="fb-form-control" id="opt-max" value="${field.maxChars || ''}"></div>`;
        }

        const typesWithOptions = ['dropdown', 'radio-buttons', 'checkboxes'];
        if (typesWithOptions.includes(field.type)) {
            html += `<div class="fb-form-group"><label class="fb-form-label">Options</label><div id="opt-options-container">`;
            field.options.forEach((opt, idx) => {
                html += `<div class="fb-option-row"><input type="text" class="fb-form-control opt-option-val" data-idx="${idx}" value="${opt}"><button class="fb-btn fb-btn-outline remove-opt" data-idx="${idx}"><i class="fa fa-times"></i></button></div>`;
            });
            html += `</div><button class="fb-btn fb-btn-outline" id="add-opt-btn" style="width:100%">Add Option</button></div>`;
        }

        html += `<div class="fb-form-group"><label><input type="checkbox" id="opt-required" ${field.required ? 'checked' : ''}> Required</label></div>`;
        html += `<div class="fb-form-group"><label class="fb-form-label">CSS Class</label><input type="text" class="fb-form-control" id="opt-class" value="${field.cssClass || ''}"></div>`;
        
        const typesWithDefault = ['text-input', 'number-input', 'email-input', 'hidden-field'];
        if (typesWithDefault.includes(field.type)) {
            html += `<div class="fb-form-group"><label class="fb-form-label">Default Value</label><input type="text" class="fb-form-control" id="opt-default" value="${field.defaultValue || ''}"></div>`;
        }

        html += `<div style="margin-top:20px; border-top:1px solid #dee2e6; padding-top:20px;"><button class="fb-btn" style="background:#dc3545; color:#fff; width:100%; border:none;" id="opt-remove">Remove Element</button></div>`;

        optionsForm.innerHTML = html;

        document.getElementById('opt-label').addEventListener('input', (e) => { field.label = e.target.value; renderCanvas(); saveState(); });
        
        if (document.getElementById('opt-placeholder')) document.getElementById('opt-placeholder').addEventListener('input', (e) => { field.placeholder = e.target.value; renderCanvas(); saveState(); });
        if (document.getElementById('opt-min')) document.getElementById('opt-min').addEventListener('input', (e) => { field.minChars = e.target.value; renderCanvas(); saveState(); });
        if (document.getElementById('opt-max')) document.getElementById('opt-max').addEventListener('input', (e) => { field.maxChars = e.target.value; renderCanvas(); saveState(); });
        if (document.getElementById('opt-class')) document.getElementById('opt-class').addEventListener('input', (e) => { field.cssClass = e.target.value; renderCanvas(); saveState(); });
        if (document.getElementById('opt-default')) document.getElementById('opt-default').addEventListener('input', (e) => { field.defaultValue = e.target.value; renderCanvas(); saveState(); });
        if (document.getElementById('opt-required')) document.getElementById('opt-required').addEventListener('change', (e) => { field.required = e.target.checked; renderCanvas(); saveState(); });

        if (document.getElementById('add-opt-btn')) {
            document.getElementById('add-opt-btn').addEventListener('click', () => {
                field.options.push('New Option');
                editField(field.id);
                renderCanvas();
                saveState();
            });
            document.querySelectorAll('.remove-opt').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
                    field.options.splice(idx, 1);
                    editField(field.id);
                    renderCanvas();
                    saveState();
                });
            });
            document.querySelectorAll('.opt-option-val').forEach(input => {
                input.addEventListener('input', (e) => {
                    const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
                    field.options[idx] = e.target.value;
                    renderCanvas();
                    saveState();
                });
            });
        }

        document.getElementById('opt-remove').addEventListener('click', () => deleteField(field.id));
    }

    function duplicateField(id) {
        const idx = formFields.findIndex(f => f.id === id);
        if (idx > -1) {
            const copy = JSON.parse(JSON.stringify(formFields[idx]));
            copy.id = 'field_' + Date.now();
            formFields.splice(idx + 1, 0, copy);
            renderCanvas();
            saveState();
        }
    }

    function deleteField(id) {
        if (confirm("Are you sure you want to remove this field?")) {
            formFields = formFields.filter(f => f.id !== id);
            if (currentEditId === id) {
                currentEditId = null;
                openAddFields();
            }
            renderCanvas();
            saveState();
        }
    }

    function saveState() {
        localStorage.setItem('formBuilderState', JSON.stringify(formFields));
        localStorage.setItem('formBuilderTitle', titleInput.value);
    }

    btnNext.addEventListener('click', () => {
        const schema = {
            title: titleInput.value,
            fields: formFields
        };
        alert(JSON.stringify(schema, null, 2));
        console.log(schema);
    });

    btnCancel.addEventListener('click', () => {
        if (confirm("Are you sure you want to clear the form?")) {
            formFields = [];
            currentEditId = null;
            titleInput.value = "Untitled Form";
            titleCharCount.innerText = "13";
            openAddFields();
            renderCanvas();
            saveState();
        }
    });

    renderCanvas();
});
