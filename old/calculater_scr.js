const BMIInfo = [
    {index: 16, text: "Выраженный дефицит массы тела", color: "#30a7cfff"},
    {index: 18.5, text: "Недостаточная (дефицит) массы тела", color: "#2a96c1ff"},
    {index: 24.99, text: "Норма", color: "#47a147ff"},
    {index: 30, text: "Избыточная масса тела (предожирение)", color: "#e2c101ff"},
    {index: 35, text: "Ожирение первой степени", color: "#FFA500"},
    {index: 40, text: "Ожирение второй степени", color: "#FF0000"},
]

function getBMIInfo(index) {
    return BMIInfo.find(set => index < set.index) || {text: "", color: "#525252ff"};
}

function getBMIIndex(weight, height) {
    return weight / ((height / 100) ** 2);
}

function calculate() {
    const weightInput = document.getElementById("weight-input");
    const heightInput = document.getElementById("height-input");

    const weightValue = parseFloat(weightInput.value);
    const heightValue = parseFloat(heightInput.value);

    const indexValue = getBMIIndex(weightValue, heightValue);
    const {text, color} = getBMIInfo(indexValue);

    const BMIValueDiv = document.getElementById("bmi-value");
    const BMIDescriptionDiv = document.getElementById("bmi-description");

    BMIValueDiv.textContent = `Ваш ИМТ: ${indexValue.toFixed(2)}`;
    BMIValueDiv.style.color = color;
    BMIDescriptionDiv.textContent = text;
}

document.addEventListener("DOMContentLoaded", function () {
    const calculationButton = document.getElementById("calculation-button");
    calculationButton.addEventListener("click", calculate);
});

// function calculate() {
//     let weightInput = document.querySelector(".weight");
//     let heightInput = document.querySelector(".height");
//     let resultDiv = document.querySelector(".result");
//     let tresultDiv = document.querySelector(".tresult");

//     let weight = parseFloat(weightInput.value);
//     let height = parseFloat(heightInput.value);
// }


// if (isNaN(weight)) {
//     resultDiv.innerHTML = "Будьте любезны — введите Ваш вес.";
//     tresultDiv.innerHTML = "";
//     weightInput.focus();
//     return;
// }

// if (isNaN(height)) {
//     resultDiv.innerHTML = "Будьте любезны — введите Ваш рост.";
//     tresultDiv.innerHTML = "";
//     heightInput.focus();
//     return;
// }

// let result = weight / ((height/100)**2);
// let tresult = "";

// if (result < 16) {
//     tresult ="Выраженный дефицит массы тела";
//     calculater.style.backgroundColor = "\\";
// } else if (result < 18.5) {
//     tresult = "Недостаточная (дефицит) массы тела";
//     calculater.style.backgroundColor = "\\";
// } else if (result < 24.99) {
//     tresult = "Норма";
//     calculater.style.backgroundColor = "\\";
// } else if (result < 30) {
//     tresult = "Избыточная масса тела (предожирение)";
//     calculater.style.backgroundColor = "\\";
// } else if (result < 35) {
//     tresult = "Ожирение первой степени";
//     calculater.style.backgroundColor = "\\";
// } else if (result < 40) {
//     tresult = "Ожирение второй степени";
//     calculater.style.backgroundColor = "\\";
// } else if (result > 40) {
//     tresult = "Ожирение третьей степени (морбидное)";
//     calculater.style.backgroundColor = "\\";
// }

/* Иди спи, чудо*/
// согласна