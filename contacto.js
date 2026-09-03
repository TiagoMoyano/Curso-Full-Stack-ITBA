const form = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const cartCount = document.querySelector("[data-cart-count]");
const resetButton = form.querySelector('button[type="reset"]');

const fields = {
  nombre: {
    element: document.querySelector("#nombre"),
    error: document.querySelector("#nombre-error"),
    validate(value) {
      if (!value.trim()) return "Ingresá tu nombre.";
      if (value.trim().length < 2) return "El nombre debe tener al menos 2 caracteres.";
      return "";
    },
  },
  email: {
    element: document.querySelector("#email"),
    error: document.querySelector("#email-error"),
    validate(value) {
      const cleanValue = value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!cleanValue) return "Ingresá tu email.";
      if (!emailPattern.test(cleanValue)) return "Ingresá un email válido.";
      return "";
    },
  },
  mensaje: {
    element: document.querySelector("#mensaje"),
    error: document.querySelector("#mensaje-error"),
    validate(value) {
      if (!value.trim()) return "Escribí tu mensaje.";
      if (value.trim().length < 10) return "El mensaje debe tener al menos 10 caracteres.";
      return "";
    },
  },
};

function updateCartCount() {
  if (!cartCount) return;

  const storedCount = localStorage.getItem("carritoCantidad") || localStorage.getItem("hj_cart_count");
  const parsedCount = Number.parseInt(storedCount || "0", 10);
  const safeCount = Number.isNaN(parsedCount) ? 0 : parsedCount;

  cartCount.textContent = safeCount;
  cartCount.closest(".indicador-carrito")?.setAttribute("aria-label", `Carrito con ${safeCount} productos`);
}

function setFieldState(field, message) {
  const wrapper = field.element.closest(".campo-formulario");
  const hasError = Boolean(message);

  wrapper.classList.toggle("es-invalido", hasError);
  field.element.setAttribute("aria-invalid", String(hasError));
  field.error.textContent = message;
}

function validateField(field) {
  const message = field.validate(field.element.value);
  setFieldState(field, message);
  return !message;
}

function validateForm() {
  return Object.values(fields).map(validateField).every(Boolean);
}

Object.values(fields).forEach((field) => {
  field.element.addEventListener("input", () => {
    validateField(field);
    formStatus.hidden = true;
    formStatus.textContent = "";
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateForm()) {
    formStatus.hidden = false;
    formStatus.textContent = "Revisá los campos marcados para poder enviar tu consulta.";
    return;
  }

  form.reset();
  Object.values(fields).forEach((field) => setFieldState(field, ""));
  formStatus.hidden = false;
  formStatus.textContent = "Gracias por escribirnos. Te vamos a responder a la brevedad.";
});

resetButton.addEventListener("click", () => {
  window.setTimeout(() => {
    Object.values(fields).forEach((field) => setFieldState(field, ""));
    formStatus.hidden = true;
    formStatus.textContent = "";
  }, 0);
});

updateCartCount();
