const BMIInfo = [
  { index: 16,		text: "Выраженный дефицит массы тела", color: "#30a7cfff" },
  { index: 18.5,	text: "Недостаточная (дефицит) массы тела", color: "#2a96c1ff" },
  { index: 24.99,	text: "Норма", color: "#47a147ff" },
  { index: 30,		text: "Избыточная масса тела (предожирение)", color: "#e2c101ff" },
  { index: 35,		text: "Ожирение второй степени", color: "#FFA500" },
  { index: 40,		text: "Ожирение третьей степени (морбидное)", color: "#FF0000" },
];

function getBMIInfo(index) {
  return (
    BMIInfo.find((set) => index <= set.index) || BMIInfo[BMIInfo.length - 1]
  );
}

function getBMIIndex(weight, height) {
  return weight / (height / 100) ** 2;
}

function calculateBMI() {
  const weightInput = document.getElementById("bmi-weight");
  const heightInput = document.getElementById("bmi-height");

  const weightValue = parseFloat(weightInput.value);
  const heightValue = parseFloat(heightInput.value);

  if (isNaN(weightValue) || isNaN(heightValue) || weightValue <= 0 || heightValue <= 0) {
    alert("Пожалуйста, введите корректные значения");
    return;
  }

  const indexValue = getBMIIndex(weightValue, heightValue);
  const { text, color } = getBMIInfo(indexValue);

  const BMIValueDiv = document.getElementById("bmi-result-value");
  const BMIDescriptionDiv = document.getElementById("bmi-result-description");

  BMIValueDiv.textContent = `Ваш ИМТ: ${indexValue.toFixed(2)}`;
  BMIValueDiv.style.color = color;
  BMIDescriptionDiv.textContent = text;
}

function initBMICalculator() {
  const heightInput = document.getElementById("bmi-height");
  const weightInput = document.getElementById("bmi-weight");
  
  function preventNonNumeric(e) {
    const allowedKeys = [
      'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 
      'Tab', 'Home', 'End'
    ];
    
    if (allowedKeys.includes(e.key)) return;
    
    if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
      return;
    }
    
    if (!/^\d$/.test(e.key) && e.key !== '.') {
      e.preventDefault();
      return;
    }
    
    if (e.key === '.' && e.target.value.includes('.')) {
      e.preventDefault();
    }
  }
  
  function cleanPastedContent(e) {
    e.preventDefault();
    
    const pastedText = (e.clipboardData || window.clipboardData).getData('text');
    
    let cleaned = pastedText.replace(/[^\d.]/g, '');
    
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('');
    }
    
    const input = e.target;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const currentValue = input.value;
    
    input.value = currentValue.substring(0, start) + cleaned + currentValue.substring(end);
    input.setSelectionRange(start + cleaned.length, start + cleaned.length);
  }
  
  if (heightInput) {
    heightInput.addEventListener('keydown', preventNonNumeric);
    heightInput.addEventListener('paste', cleanPastedContent);
  }
  
  if (weightInput) {
    weightInput.addEventListener('keydown', preventNonNumeric);
    weightInput.addEventListener('paste', cleanPastedContent);
  }
  
  console.log('BMI calculator initialized');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBMICalculator);
} else {
  initBMICalculator();
}

document.addEventListener('click', function(e) {
  if (e.target && e.target.id === 'bmi-calculate-button') {
    calculateBMI();
  }
});