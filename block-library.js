/*
 * Arabic Syllable Blocks - reusable component library.
 * Exposes window.ArabicBlockLibrary = { shapes, arabicLetters, SyllableBlock }
 */
(function (global) {
    // Shape registry: maps a shape key to its CSS class (see block-library.css)
    // and the number of editable cells it contains.
    const shapes = {
        'side-by-side':     { cssClass: 'block-side-by-side',    cells: 2, label: '2 cells - side by side' },
        '2x2-3cells':       { cssClass: 'block-2x2-3cells',      cells: 3, label: '3 cells - 2x2 merged' },
        '2x2-4cells':       { cssClass: 'block-2x2',             cells: 4, label: '4 cells - 2x2 grid' },
        'single':           { cssClass: 'block-single',          cells: 1, label: '1 cell - single' },
        'top-span-3cells':  { cssClass: 'block-top-span-3cells', cells: 3, label: '3 cells - top span' },
        '2x3-six':          { cssClass: 'block-2x3-six',         cells: 6, label: '6 cells - 2x3 grid' },
        '2x3-five':         { cssClass: 'block-2x3-five',        cells: 5, label: '5 cells - 2x2 + bottom span' }
    };

    const arabicLetters = [
        { ch: 'ا', name: 'Alef' },
        { ch: 'ب', name: 'Ba' },
        { ch: 'ت', name: 'Ta' },
        { ch: 'ث', name: 'Tha' },
        { ch: 'ج', name: 'Jim' },
        { ch: 'ح', name: 'Ha' },
        { ch: 'خ', name: 'Kha' },
        { ch: 'د', name: 'Dal' },
        { ch: 'ذ', name: 'Dhal' },
        { ch: 'ر', name: 'Ra' },
        { ch: 'ز', name: 'Za' },
        { ch: 'س', name: 'Sin' },
        { ch: 'ش', name: 'Shin' },
        { ch: 'ص', name: 'Sad' },
        { ch: 'ض', name: 'Dad' },
        { ch: 'ط', name: 'Tah' },
        { ch: 'ظ', name: 'Zah' },
        { ch: 'ع', name: 'Ain' },
        { ch: 'غ', name: 'Ghain' },
        { ch: 'ف', name: 'Fa' },
        { ch: 'ق', name: 'Qaf' },
        { ch: 'ك', name: 'Kaf' },
        { ch: 'ل', name: 'Lam' },
        { ch: 'م', name: 'Mim' },
        { ch: 'ن', name: 'Nun' },
        { ch: 'ه', name: 'Ha' },
        { ch: 'و', name: 'Waw' },
        { ch: 'ي', name: 'Ya' },
        { ch: 'ْ', name: 'Sukun' }
    ];

    function placeCaretAtEnd(el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    // Generic, reusable syllable block. The visual layout (shape) and font are
    // driven entirely by props so a single component covers every block type.
    // Cells are inline-editable (contenteditable) instead of separate <input> fields.
    const SyllableBlock = {
        props: {
            title: { type: String, default: '' },
            shape: { type: String, required: true },
            modelValue: { type: Array, required: true },
            font: { type: String, default: 'lafd' }
        },
        emits: ['update:modelValue', 'cell-focus'],
        computed: {
            shapeInfo() {
                return shapes[this.shape] || shapes['single'];
            }
        },
        mounted() {
            this.syncDom();
        },
        methods: {
            syncDom() {
                const inputs = this.$refs.cellInputs || [];
                inputs.forEach((el, i) => {
                    el.textContent = this.modelValue[i] || '';
                });
            },
            onFocus(e, i) {
                this.$emit('cell-focus', { el: e.target, title: this.title, index: i });
            },
            onInput(e, i) {
                let text = e.target.textContent || '';
                if (text.length > 1) {
                    text = text.slice(-1);
                    e.target.textContent = text;
                    placeCaretAtEnd(e.target);
                }
                const updated = this.modelValue.slice();
                updated[i] = text;
                this.$emit('update:modelValue', updated);
                if (text) {
                    this.$nextTick(() => this.focusCell(i + 1));
                }
            },
            onKeydown(e, i) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.focusCell(i + 1);
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.focusCell(i + 1);
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.focusCell(i - 1);
                }
            },
            focusCell(i) {
                const inputs = this.$refs.cellInputs || [];
                const el = inputs[i];
                if (el) {
                    el.focus();
                    placeCaretAtEnd(el);
                }
            },
            reset() {
                const cleared = this.modelValue.map(() => '');
                this.$emit('update:modelValue', cleared);
                this.$nextTick(() => this.syncDom());
            }
        },
        template: `
            <div class="block-card">
                <div class="block-title">{{ title }}</div>
                <div class="block-grid">
                    <div class="block" :class="shapeInfo.cssClass">
                        <div
                            v-for="(v, i) in modelValue"
                            :key="i"
                            class="block-cell"
                            :class="'font-' + font"
                        >
                            <span class="cell-number">{{ i + 1 }}</span>
                            <div
                                class="cell-input"
                                contenteditable="true"
                                spellcheck="false"
                                ref="cellInputs"
                                @focus="onFocus($event, i)"
                                @input="onInput($event, i)"
                                @keydown="onKeydown($event, i)"
                            ></div>
                        </div>
                    </div>
                </div>
                <button class="reset-btn" @click="reset">Reset</button>
            </div>
        `
    };

    global.ArabicBlockLibrary = { shapes, arabicLetters, SyllableBlock };
})(window);
