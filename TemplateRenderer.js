class TemplateRenderer {
    constructor(templateId, data) {
        this.templateId = templateId;
        this.data       = data;
    }

    render() {
        let source = this.getTemplateSource();
        source     = this.processConditions(source); // Обрабатываем условия
        source     = this.processLoops(source); // Обрабатываем циклы
        source     = this.replaceVariables(source); // Заменяем переменные
        return source;
    }

    getTemplateSource() {
        return document.getElementById(this.templateId).innerHTML;
    }

    processConditions(source) {
        // Обработка конструкций {{#if ...}} и {{else if ...}}
        source = source.replace(/{{#if (.*?)}}(.*?){{else if (.*?)}}(.*?){{\/if}}/gs, (match, condition1, trueBlock, condition2, falseBlock) => {
            return this.evaluateCondition(condition1) ? trueBlock : this.evaluateCondition(condition2) ? falseBlock : '';
        });

        source = source.replace(/{{#if (.*?)}}(.*?){{else}}(.*?){{\/if}}/gs, (match, condition, trueBlock, falseBlock) => {
            return this.evaluateCondition(condition) ? trueBlock : falseBlock;
        });

        source = source.replace(/{{#if (.*?)}\s*(.*?){{\/if}}/gs, (match, condition, trueBlock) => {
            return this.evaluateCondition(condition) ? trueBlock : '';
        });

        return source;
    }

    evaluateCondition(condition) {
        // Очищаем условие перед его оценкой
        const sanitizedCondition = condition.replace(/{{[\s]*/g, '').replace(/[\s]*}}/g, ''); // Удаляем {{ и }} из условия
        const func               = new Function(...Object.keys(this.data), `return ${sanitizedCondition};`);
        return func(...Object.values(this.data));
    }

    processLoops(source) {
        // Обрабатываем циклы {{#for ... in ...}}
        return source.replace(/{{#for (.+?) in (.+?)}}(.*?){{\/for}}/gs, (match, item, arrayName, block) => {
            const items = this.data[arrayName.trim()] || [];
            return items.map(itemValue => {
                // Создаем новый контекст для каждой итерации
                const newContext = {...this.data, [item.trim()]: itemValue};
                return block.replace(/{{\s*(\w+)\s*}}/g, (match, key) => {
                    return typeof newContext[key] !== 'undefined' ? newContext[key] : match;
                });
            }).join('');
        });
    }

    replaceVariables(source) {
        // Заменяем переменные {{variable}}
        return source.replace(/{{(.*?)}}/g, (match, key) => {
            return typeof this.data[key.trim()] !== 'undefined' ? this.data[key.trim()] : match;
        });
    }
}