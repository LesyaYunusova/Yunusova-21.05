document.querySelectorAll(".style-button").forEach((button) => {
  button.addEventListener("click", () => {
    alert(`Вы выбрали стиль: ${button.textContent}`);
  });
});

document.querySelectorAll(".form-button").forEach((button) => {
  button.addEventListener("click", () => {
    alert(`Вы выбрали форму: ${button.textContent}`);
  });
});

document.querySelectorAll(".area-button").forEach((button) => {
  button.addEventListener("click", () => {
    alert(`Вы выбрали площадь: ${button.textContent}`);
  });
});

document.querySelector(".calculate-button").addEventListener("click", () => {
  const phoneNumber = document.getElementById("phone-number").value;
  if (phoneNumber) {
    alert(
      `Ваш номер телефона: ${phoneNumber}. Наш дизайнер свяжется с Вами в ближайшее время!`
    );
  } else {
    alert("Пожалуйста, введите номер телефона.");
  }
});
document.querySelectorAll(".area-button").forEach((button) => {
  button.addEventListener("click", () => {
    // Сброс всех кнопок
    document.querySelectorAll(".area-button").forEach((btn) => {
      btn.classList.remove("selected");
    });
    // Выделение выбранной кнопки
    button.classList.add("selected");
  });
});
document.querySelector('.calculate-button').addEventListener('click', () => {
  const phoneNumber = document.getElementById('phone-number').value;
  if (phoneNumber) {
      alert(`Ваш номер телефона: ${phoneNumber}. Наш дизайнер свяжется с Вами в ближайшее время!`);
  } else {
      alert('Пожалуйста, введите номер телефона.');
  }
});
