const calculate = (n1, operator, n2) => {
    const first = parseFloat(n1);
    const second = parseFloat(n2);

    if(operator === 'add') return first + second;
    if(operator === 'minus') return first - second;
    if(operator === 'divide') return first / second;
    if(operator ==='multiply') return first * second;
}

const getKeyType = (key) => {
    const {action} = key.dataset;
    if(!action) return 'number';
    if(
        action === 'add' ||
        action === 'minus' ||
        action === 'divide' ||
        action === 'multiply'
    ) return 'operator';

    return action;
}

const createResultString = (key, displayedNum, state) => {
    const keyContent = key.textContent;
    const keyType = getKeyType(key);
    const {
        firstValue,
        operator,
        modValue,
        previousKeyType
    } = state;

    if(keyType === 'number'){
        return displayedNum === '0' || 
               previousKeyType === 'operator' ||
               previousKeyType === 'equals'
            ? keyContent 
            : displayedNum + keyContent;
    }

    if(keyType === "decimal"){
        if (!displayedNum.includes(".")) return displayedNum + ".";
        if(previousKeyType === 'operator' || previousKeyType === 'equals') return "0.";
        return displayedNum;
    }

    if(keyType === 'operator') {    
        return
            firstValue && 
            operator && 
            previousKeyType !== 'operator' &&
            previousKeyType !== 'equals'
        ? calculate(firstValue, operator, displayedNum)
        : displayedNum;
        

        calculator.dataset.previousKeyType = 'operator';
        calculator.dataset.operator = action;
    }

    if(keyType === "clear") return 0;

    if(keyType === "equals"){
        return firstValue
            ? previousKeyType === 'equals'
                ? calculate(firstValue, operator, modValue)
                : calculate(firstValue, operator, displayedNum)
            : displayedNum;
        
    }
}

const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {
    const keyType = getKeyType(key);
    const {
        firstValue,
        operator,
        modValue,
        previousKeyType
    } = calculator.dataset;

    calculator.dataset.previousKeyType = keyType;

    if(keyType === 'operator'){
        calculator.dataset.operator = key.dataset.action;
        calculator.dataset.firstValue = firstValue &&
            operator &&
            previousKeyType !== 'operator' &&
            previousKeyType !== 'calculate'
            ? calculatedValue
            : displayedNum;
    }

    if(keyType === 'equals'){
        calculator.dataset.modValue = firstValue && previousKeyType === 'equals'
            ? modValue
            : displayedNum;
    }

    if(keyType === 'clear'){
        calculator.dataset.firstValue = '';
        calculator.dataset.modValue = '';
        calculator.dataset.operator = '';
        calculator.dataset.previousKeyType = '';
    }
}

const updateVisualState = (key, calculator) => {
    const keyType = getKeyType(key);
    
    if(keyType === 'clear' && key.textContent !== 'AC') key.textContent = 'AC';
    if(keyType !=='clear'){
        const clearButton = calculator.querySelector('[data-action=clear]');
        clearButton.textContent = 'CE'; 
    }

}

const calculator = document.querySelector('.container');
const keys = calculator.querySelector('.button-container');
const display = document.querySelector('.display');

keys.addEventListener('click', (e) => {
    if(!e.target.matches('button')) return
        const key = e.target;
        const displayedNum = display.textContent;
        const resultString = createResultString(key, displayedNum, calculator.dataset);

        display.textContent = resultString;
        updateCalculatorState(key, calculator, resultString, displayedNum);
        updateVisualState(key, calculator);

    
})