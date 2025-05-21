(() => {
  const form = document.getElementById("loanCalc");
  const amountInput = form.amount;
  const interestInput = form.interest;
  const yearsInput = form.years;

  const interestValueDisplay = document.getElementById("interestValue");

  const resultsSection = document.getElementById("results");
  const monthlyPaymentDisplay = document.getElementById("monthlyPayment");
  const totalPaymentDisplay = document.getElementById("totalPayment");
  const totalInterestDisplay = document.getElementById("totalInterest");

  const amountError = document.getElementById("amountError");
  const yearsError = document.getElementById("yearsError");

  // Format numbers as currency with commas and 2 decimals
  const formatCurrency = (num) => {
    return num.toLocaleString("en-US", { style: "currency", currency: "USD" });
  };

  // Validate inputs and show errors
  const validateInputs = () => {
    let valid = true;
    amountError.textContent = "";
    yearsError.textContent = "";

    if (
      !amountInput.value ||
      amountInput.value < 1000 ||
      amountInput.value > 1000000
    ) {
      amountError.textContent = "Amount must be between $1,000 and $1,000,000";
      valid = false;
    }
    if (!yearsInput.value || yearsInput.value < 1 || yearsInput.value > 50) {
      yearsError.textContent = "Term must be between 1 and 50 years";
      valid = false;
    }
    return valid;
  };

  // Update interest % display near slider
  interestInput.addEventListener("input", () => {
    interestValueDisplay.textContent = `${parseFloat(
      interestInput.value
    ).toFixed(1)}%`;
  });

  // Core calculation function
  const calculateLoan = () => {
    if (!validateInputs()) {
      resultsSection.hidden = true;
      return;
    }

    const principal = parseFloat(amountInput.value);
    const annualInterest = parseFloat(interestInput.value) / 100;
    const years = parseInt(yearsInput.value, 10);

    const monthlyInterestRate = annualInterest / 12;
    const numberOfPayments = years * 12;

    // Formula for monthly payment
    // M = P * r * (1+r)^n / ((1+r)^n - 1)
    let monthlyPayment;
    if (monthlyInterestRate === 0) {
      monthlyPayment = principal / numberOfPayments;
    } else {
      const factor = Math.pow(1 + monthlyInterestRate, numberOfPayments);
      monthlyPayment =
        (principal * monthlyInterestRate * factor) / (factor - 1);
    }

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    monthlyPaymentDisplay.textContent = formatCurrency(monthlyPayment);
    totalPaymentDisplay.textContent = formatCurrency(totalPayment);
    totalInterestDisplay.textContent = formatCurrency(totalInterest);

    resultsSection.hidden = false;
    resultsSection.focus();
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    calculateLoan();
  });

  // Initial display update
  interestValueDisplay.textContent = `${parseFloat(interestInput.value).toFixed(
    1
  )}%`;
  calculateLoan();
})();
