'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const inputElements = document.querySelectorAll('input[type="number"]');
  const bmiRadioElements = document.querySelectorAll('.bmi-calculator__radio');
  const imperialElement = document.querySelector('.bmi-calc__imperial');
  const metricElement = document.querySelector('.bmi-calc__metric');
  const bmiValueElement = document.querySelector('.bmi-calculator__value');
  const welcomeElement = document.querySelector('.bmi-calculator__welcome');
  const resultElement = document.querySelector('.bmi-calculator__content');
  const bmiCategoryElement = document.querySelector(
    '.bmi-calculator__category'
  );
  const bmiRangeElement = document.querySelector('.bmi-calculator__range');

  let bmiScore;
  const HEALTHY_LOWER_BMI_LIMIT = 18.5;
  const HEALTHY_UPPER_BMI_LIMIT = 24.9;
  const BMI_STATUS = [
    { start: 0, end: 18.5, status: 'underweight' },
    { start: 18.5, end: 24.9, status: 'healthy weight' },
    { start: 25, end: 29.9, status: 'overweight' },
    { start: 30, status: 'obese' },
  ];

  inputElements.forEach((input) => {
    input.addEventListener('input', attachBMIListener);
  });

  bmiRadioElements.forEach((bmiRadio) => {
    bmiRadio.addEventListener('click', (e) => {
      const selected = e.target.value;
      toggleVisibility(selected === 'metric');
    });
  });

  function toggleVisibility(isMetric) {
    metricElement.classList.toggle('hidden', !isMetric);
    imperialElement.classList.toggle('hidden', isMetric);
    resetLayout();
  }

  function resetLayout() {
    inputElements.forEach((input) => {
      input.value = '';
    });
    welcomeElement.classList.remove('hidden');
    resultElement.classList.add('hidden');
  }

  function attachBMIListener(event) {
    if (event.target.value.length > 3) {
      event.target.value = event.target.value.slice(0, 3);
    }
    calculateAndDisplayBMI();
  }

  function calculateAndDisplayBMI() {
    const height = Number(document.getElementById('height').value);
    const weight = Number(document.getElementById('weight').value);
    const feet = Number(document.getElementById('feet').value);
    const inches = Number(document.getElementById('inches').value);
    const stone = Number(document.getElementById('stone').value);
    const pound = Number(document.getElementById('pound').value);

    bmiRadioElements.forEach((bmiRadio) => {
      if (bmiRadio.value === 'metric' && bmiRadio.checked) {
        const heightM = height / 100;
        bmiScore = calculateBMI(weight, heightM);

        // Display BMI result
        displayBMI();

        // Set BMI range
        setBMIRange(heightM, HEALTHY_LOWER_BMI_LIMIT, HEALTHY_UPPER_BMI_LIMIT);
      } else if (bmiRadio.value === 'imperial' && bmiRadio.checked) {
        // Convert height to meters
        const heightM = (feet * 12 + inches) * 0.0254;

        // Convert weight to kilograms
        const weightKg = (stone * 14 + pound) / 2.2046;
        bmiScore = calculateBMI(weightKg, heightM);

        // Display BMI result
        displayBMI();

        // Set BMI range
        setBMIRange(
          heightM,
          HEALTHY_LOWER_BMI_LIMIT,
          HEALTHY_UPPER_BMI_LIMIT,
          true
        );
      }
    });
  }

  function calculateBMI(weight, height) {
    if (!weight || !height) return;
    return Number(weight / height ** 2).toFixed(1);
  }

  function displayBMI() {
    if (bmiScore > 100) return; // BMI score out of range
    if (bmiScore) {
      welcomeElement.classList.add('hidden');
      resultElement.classList.remove('hidden');
      bmiValueElement.textContent = bmiScore;
      bmiCategoryElement.textContent = getBMIStatus(bmiScore);
    } else {
      welcomeElement.classList.remove('hidden');
      resultElement.classList.add('hidden');
    }
  }

  function getBMIStatus(bmi) {
    for (const range of BMI_STATUS) {
      if (bmi >= range.start && bmi <= (range.end || Infinity)) {
        return range.status;
      }
    }
    return 'unknown status';
  }

  function setBMIRange(heightM, lowerLimit, upperLimit, isImperial = false) {
    const lowerBMILimit = lowerLimit * heightM ** 2 * (isImperial ? 2.2046 : 1);
    const upperBMILimit = upperLimit * heightM ** 2 * (isImperial ? 2.2046 : 1);

    if (isImperial) {
      const lowerStones = Math.floor(lowerBMILimit / 14);
      const lowerPounds = Math.floor(lowerBMILimit % 14);
      const upperStones = Math.floor(upperBMILimit / 14);
      const upperPounds = Math.floor(upperBMILimit % 14);
      bmiRangeElement.textContent = `${lowerStones}st ${lowerPounds}lb - ${upperStones}st ${upperPounds}lb`;
    } else {
      bmiRangeElement.textContent = `${lowerBMILimit.toFixed(
        1
      )}kgs - ${upperBMILimit.toFixed(1)}kgs`;
    }
  }
});
