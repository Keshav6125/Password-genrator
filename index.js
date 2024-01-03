const inputSlider = document.querySelector("[data-lengthSlider]");
const inputDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyImage = document.querySelector("[data-copyMsg]"); 
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#number");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const genrateBtn = document.querySelector(".genrateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbol = '!@#$%^&*()_-+={}[]:<>,./?~`';

let password = "";
passwordLength = 15;
checkCount = 0;
handleSlider();
setIndicator("#ccc");
// set strength circle color to gray 

function handleSlider(){
    inputSlider.value = passwordLength;
    inputDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"

    // or kuch bhi add krna hai 
    
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
function getRndInteger(max , min){
   return Math.floor(Math.random()*(max - min))+min;
}

function genrateRndNumber(){
    return getRndInteger(0,9);
}

function genrateLowCase(){
    return String.fromCharCode(getRndInteger(97 , 127));
}

function genrateUppCase(){
    return String.fromCharCode(getRndInteger(65 , 91));
}

function genrateSymbol(){
     const random = getRndInteger(0 , symbol.length);
     return symbol.charAt(random); 
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numberCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyImage.innerText = "copied";
    }

    catch{
        copyImage.innerText = "failed";   
    }
    copyImage.classList.add("active");
    
    setTimeout(() => {
        copyImage.classList.remove("active"); 
    }, 2000);
}

function passwordShuffle(array) {
    //Fisher Yates Method
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


function handleCheckBoxChng(){
    checkCount= 0;
    allCheckBox.forEach(checkBox => {
        if(checkBox.checked){
            checkCount++;
        }
    });
    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}
   allCheckBox.forEach((checkBox) =>{
   checkBox.addEventListener('change' , handleCheckBoxChng);
})

inputSlider.addEventListener('input' , (e) => {
     passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click' , ()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

genrateBtn.addEventListener('click' , () =>{
    if(checkCount < 0) 
    return;

    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    password = "";
    // if(uppercaseCheck.checked){
    //     password += genrateUppCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += genrateLowCase();
    // }
    // if(numberCheck.checked){
    //     password += genrateRndNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += genrateSymbol();
    // }

    let funcArr = [];
    if(uppercaseCheck.checked){
        funcArr.push(genrateUppCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(genrateLowCase);
    }
    if(symbolsCheck.checked){
        funcArr.push(genrateSymbol);
    }
    if(numberCheck.checked){
        funcArr.push(genrateRndNumber);
    }

    for (let index = 0; index < funcArr.length; index++) {
        password += funcArr[index]();
    }

    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randindex = getRndInteger(0 , funcArr.length);
        password+=funcArr[randindex]();
    }

    password = passwordShuffle(Array.from(password));
    passwordDisplay.value = password;
    calcStrength(); 
}) 