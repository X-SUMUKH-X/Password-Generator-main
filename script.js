const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const lengthDisplay = document.querySelector("[data-lengthNumber]"); //
const inputSlider = document.querySelector("[data-lengthSlider]"); //
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll(".checkbox");

let symbol = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// default state
let password = "";
let passwordLength = 10;
let checkCount = 0;
// set strength circle color to gray
handleSlider();
setIndicator("#ccc");

// set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    // how much color to fill
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max - min)) + "% 100%"
}

// set indicator-color
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
} 

function generateRandomNumber() {
    return getRndInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 122));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 90)); 
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbol.length);
    return symbol.charAt(randNum);
}

function shufflePassword(array) {
    //Fisher Yates Method:- to shuffle the array
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) {
        hasUpper = true;
    }
    if (lowercaseCheck.checked) {
        hasLower = true;
    }
    if (numbersCheck.checked) {
        hasNum = true;
    }
    if (symbolsCheck.checked) {
        hasSym = true;
    }

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    }
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
    } 
    else {
        setIndicator("#f00");
    }
}

// copy to clipboard
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    // to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000)
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

// Event Listener on slider
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

// Event Listener on copy-button
copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
});

// Event Listener on generate password-button
generateBtn.addEventListener('click', () => {
    if (checkCount == 0) {
        return 0;
    }

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // generate password
    // remove old password
    password = "";

    // let's put the stuff mentioned by the checkboxes
/*    
    if(uppercaseCheck.checked) {
        password += generateUpperCase();
    }

    if(lowercaseCheck.checked) {
        password += generateLowerCase();
    }

    if(numbersCheck.checked) {
        password += generateRandomNumber();
    }

    if(symbolsCheck.checked) {
        password += generateSymbol();
    }
*/

    let funcArr = [];

    if(uppercaseCheck.checked) {
        funcArr.push(generateUpperCase);
    }

    if(lowercaseCheck.checked) {
        funcArr.push(generateLowerCase);
    }

    if(numbersCheck.checked) {
        funcArr.push(generateRandomNumber);
    }

    if(symbolsCheck.checked) {
        funcArr.push(generateSymbol);
    }

    // compulsory addition
    for(let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // remaining addition
    for(let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // shuffle the password
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;

    // calculate strength
    calcStrength();

});