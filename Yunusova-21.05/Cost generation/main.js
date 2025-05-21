(() => {
  const form = document.getElementById("costForm");
  const basePriceInput = form.basePrice;
  const quantityInput = form.quantity;
  const taxRateInput = form.taxRate;
  const taxRateValueOutput = document.getElementById("taxRateValue");
  const discountTypeSelect = form.discountType;
  const discountValueInput = form.discountValue;
  const extrasCheckboxes = [...form.querySelectorAll('input[name="extras"]')];
  const resultOutput = document.getElementById("result");
  const breakdownOutput = document.getElementById("breakdown");

  // Format number as currency string
  const formatCurrency = (num) => {
    return num.toLocaleString("en-US", { style: "currency", currency: "USD" });
  };

  // Update tax rate output dynamically with ARIA attributes
  taxRateInput.addEventListener("input", () => {
    const val = parseFloat(taxRateInput.value);
    taxRateValueOutput.textContent = `${val.toFixed(1)}%`;
    taxRateInput.setAttribute("aria-valuenow", val.toFixed(1));
  });

  // Enable/disable discount value input based on discount type
  discountTypeSelect.addEventListener("change", () => {
    const type = discountTypeSelect.value;
    if (type === "none") {
      discountValueInput.value = 0;
      discountValueInput.disabled = true;
      discountValueInput.removeAttribute("aria-required");
      discountValueInput.removeAttribute("min");
    } else {
      discountValueInput.disabled = false;
      discountValueInput.setAttribute("aria-required", "true");
      discountValueInput.setAttribute("min", "0");
      discountValueInput.focus();
    }
  });

  // Validate discount input depending on type
  const validateDiscount = () => {
    const type = discountTypeSelect.value;
    const val = parseFloat(discountValueInput.value);
    if (type === "percent") {
      if (val < 0) return false;
      if (val > 100) return false;
    } else if (type === "fixed") {
      if (val < 0) return false;
    }
    return true;
  };

  // Main calculation function
  const calculateTotal = () => {
    // Parse inputs safely
    const basePrice = Math.max(0, parseFloat(basePriceInput.value) || 0);
    const quantity = Math.max(1, parseInt(quantityInput.value) || 1);
    const taxRate = Math.min(
      25,
      Math.max(0, parseFloat(taxRateInput.value) || 0)
    );
    const discountType = discountTypeSelect.value;
    const discountValueRaw = parseFloat(discountValueInput.value) || 0;

    if (!validateDiscount()) {
      throw new Error("Invalid discount value");
    }

    // Calculate subtotal before discount and tax
    const extrasTotal = extrasCheckboxes.reduce((sum, checkbox) => {
      return checkbox.checked ? sum + parseFloat(checkbox.dataset.cost) : sum;
    }, 0);

    const subtotal = (basePrice + extrasTotal) * quantity;

    // Calculate discount amount
    let discountAmount = 0;
    if (discountType === "fixed") {
      discountAmount = Math.min(discountValueRaw, subtotal);
    } else if (discountType === "percent") {
      discountAmount = subtotal * (discountValueRaw / 100);
    }

    // Calculate taxable amount after discount
    const taxableAmount = subtotal - discountAmount;

    // Calculate tax
    const taxAmount = taxableAmount * (taxRate / 100);

    // Calculate final total
    const total = taxableAmount + taxAmount;

    return {
      basePrice,
      quantity,
      extrasTotal,
      subtotal,
      discountType,
      discountValueRaw,
      discountAmount,
      taxableAmount,
      taxRate,
      taxAmount,
      total,
    };
  };

  // Render output and detailed breakdown
  const renderResult = (data) => {
    const {
      basePrice,
      quantity,
      extrasTotal,
      subtotal,
      discountType,
      discountValueRaw,
      discountAmount,
      taxableAmount,
      taxRate,
      taxAmount,
      total,
    } = data;

    resultOutput.textContent = `Total Cost: ${formatCurrency(total)}`;

    let discountStr = "No Discount";
    if (discountType === "fixed") {
      discountStr = `Fixed Discount: -${formatCurrency(discountAmount)}`;
    } else if (discountType === "percent") {
      discountStr = `Percentage Discount (${discountValueRaw.toFixed(
        2
      )}%): -${formatCurrency(discountAmount)}`;
    }

    let extrasStr = extrasCheckboxes
      .filter((chk) => chk.checked)
      .map(
        (chk) =>
          `- ${chk.nextElementSibling.textContent} ${formatCurrency(
            parseFloat(chk.dataset.cost)
          )}`
      )
      .join("\n");
    if (!extrasStr) extrasStr = "None";

    const breakdownText = `Base Price: ${formatCurrency(
      basePrice
    )} x ${quantity} = ${formatCurrency(basePrice * quantity)}
Optional Extras Total: ${formatCurrency(
      extrasTotal
    )} x ${quantity} = ${formatCurrency(extrasTotal * quantity)}
Subtotal (Base + Extras): ${formatCurrency(subtotal)}
${discountStr}
Taxable Amount: ${formatCurrency(taxableAmount)}
Tax Rate: ${taxRate.toFixed(2)}%
Tax Amount: ${formatCurrency(taxAmount)}
------------------------------------
Final Total: ${formatCurrency(total)}`;

    breakdownOutput.textContent = breakdownText;
  };

  // Form submit handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    resultOutput.textContent = "Calculating...";
    breakdownOutput.textContent = "";

    try {
      const data = calculateTotal();
      renderResult(data);
    } catch (err) {
      resultOutput.textContent = `Error: ${err.message}`;
      breakdownOutput.textContent = "";
    }
  });

  // Initialize UI states
  discountTypeSelect.dispatchEvent(new Event("change"));
  taxRateInput.dispatchEvent(new Event("input"));
})();
