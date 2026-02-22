/*
	Barkside Dog Café — Main interactions
	-------------------------------------
	This file handles:
	1) Sticky glass nav + mobile menu
	2) Smooth scrolling with fixed-nav offset
	3) Animated menu filtering
	4) Scroll-reveal animations (Intersection Observer)
	5) Dog of the Day spotlight
	6) Reservation form enhancements + validation + success state
*/

document.addEventListener("DOMContentLoaded", () => {
  initStickyNavAndMobileMenu();
  initSmoothScrollLinks();
  initMenuFiltering();
  initScrollReveals();
  initDogOfTheDay();
  initReservationForm();
});

/* ---------- Shared helpers ---------- */

const easingStandard = "cubic-bezier(0.22, 0.61, 0.36, 1)";

function isDesktopViewport() {
  return window.matchMedia("(min-width: 64rem)").matches;
}

function normalizeText(value) {
  return value.trim().replace(/\s+/g, " ");
}

/* ---------- Nav: sticky glass + mobile toggle ---------- */

function initStickyNavAndMobileMenu() {
  const navElement = document.querySelector(".site-nav");
  const toggleButton = document.querySelector(".site-nav__toggle");
  const navMenu = document.querySelector(".site-nav__menu");

  if (!navElement) {
    return;
  }

  const updateScrolledState = () => {
    navElement.classList.toggle("site-nav--scrolled", window.scrollY > 24);
  };

  updateScrolledState();
  window.addEventListener("scroll", updateScrolledState, { passive: true });

  if (!toggleButton || !navMenu) {
    return;
  }

  const closeMenu = () => {
    toggleButton.setAttribute("aria-expanded", "false");
    navElement.classList.remove("site-nav--menu-open");
  };

  const openMenu = () => {
    toggleButton.setAttribute("aria-expanded", "true");
    navElement.classList.add("site-nav--menu-open");
  };

  toggleButton.addEventListener("click", () => {
    const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";
    if (isExpanded) {
      closeMenu();
      return;
    }
    openMenu();
  });

  navMenu.querySelectorAll("a").forEach((linkElement) => {
    linkElement.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (!navElement.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (isDesktopViewport()) {
      closeMenu();
    }
  });
}

/* ---------- Smooth scrolling ---------- */

function initSmoothScrollLinks() {
  const hashLinks = document.querySelectorAll('a[href^="#"]');
  const navElement = document.querySelector(".site-nav");

  hashLinks.forEach((linkElement) => {
    linkElement.addEventListener("click", (event) => {
      const targetHash = linkElement.getAttribute("href");
      if (!targetHash || targetHash === "#") {
        return;
      }

      const targetElement = document.querySelector(targetHash);
      if (!targetElement) {
        return;
      }

      event.preventDefault();

      const navOffset = navElement ? navElement.getBoundingClientRect().height : 0;
      const targetTop = targetElement.getBoundingClientRect().top + window.scrollY - navOffset + 8;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth",
      });

      window.history.replaceState(null, "", targetHash);
    });
  });
}

/* ---------- Menu category filtering ---------- */

function initMenuFiltering() {
  const filterButtons = Array.from(document.querySelectorAll(".menu-filter__button"));
  const menuCards = Array.from(document.querySelectorAll(".menu-card"));

  if (!filterButtons.length || !menuCards.length) {
    return;
  }

  filterButtons.forEach((buttonElement) => {
    buttonElement.addEventListener("click", () => {
      const selectedFilter = buttonElement.dataset.filter ?? "all";

      filterButtons.forEach((candidateButton) => {
        candidateButton.classList.toggle(
          "menu-filter__button--active",
          candidateButton === buttonElement,
        );
      });

      menuCards.forEach((cardElement) => {
        const cardCategory = cardElement.dataset.category;
        const shouldShow = selectedFilter === "all" || cardCategory === selectedFilter;
        animateMenuCardVisibility(cardElement, shouldShow);
      });
    });
  });
}

function animateMenuCardVisibility(cardElement, shouldShow) {
  if (shouldShow) {
    if (cardElement.hidden) {
      cardElement.hidden = false;
      cardElement.style.pointerEvents = "auto";
      cardElement.animate(
        [
          { opacity: 0, transform: "translateY(14px) scale(0.985)" },
          { opacity: 1, transform: "translateY(0) scale(1)" },
        ],
        { duration: 300, easing: easingStandard, fill: "both" },
      );
    }
    return;
  }

  if (cardElement.hidden) {
    return;
  }

  const hideAnimation = cardElement.animate(
    [
      { opacity: 1, transform: "translateY(0) scale(1)" },
      { opacity: 0, transform: "translateY(8px) scale(0.985)" },
    ],
    { duration: 220, easing: easingStandard, fill: "forwards" },
  );

  hideAnimation.addEventListener("finish", () => {
    cardElement.hidden = true;
    cardElement.style.pointerEvents = "none";
  });
}

/* ---------- Scroll reveal animations ---------- */

function initScrollReveals() {
  const revealElements = Array.from(
    document.querySelectorAll(
      [
        ".menu-section__header",
        ".menu-filter",
        ".menu-card",
        ".dogs-section__header",
        ".dog-profile",
        ".reservation-section__header",
        ".reservation-form",
        ".site-footer__title",
        ".site-footer__column",
      ].join(","),
    ),
  );

  if (!revealElements.length) {
    return;
  }

  revealElements.forEach((element, index) => {
    element.setAttribute("data-reveal", "");
    element.style.transitionDelay = `${Math.min(index * 22, 280)}ms`;
  });

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-revealed"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

/* ---------- Dog of the Day ---------- */

function initDogOfTheDay() {
  const dogCards = Array.from(document.querySelectorAll(".dog-profile"));
  if (!dogCards.length) {
    return;
  }

  const randomIndex = Math.floor(Math.random() * dogCards.length);
  const featuredCard = dogCards[randomIndex];
  const captionElement = featuredCard.querySelector(".dog-profile__caption");

  featuredCard.classList.add("dog-profile--featured");

  if (!captionElement) {
    return;
  }

  const badgeElement = document.createElement("span");
  badgeElement.className = "dog-profile__badge";
  badgeElement.textContent = "★ Dog of the Day";
  captionElement.append(badgeElement);
}

/* ---------- Reservation form + validation ---------- */

function initReservationForm() {
  const formElement = document.getElementById("reservation-form");
  if (!formElement) {
    return;
  }

  const formStatusElement = document.getElementById("reservation-form-status");
  const formGridElement = formElement.querySelector(".reservation-form__grid");
  const dogCountInput = document.getElementById("dog-count");

  if (!formGridElement || !dogCountInput) {
    return;
  }

  const dynamicFields = injectDogPreferenceFields(formGridElement, dogCountInput);

  if (Number(dogCountInput.value || 0) > 0) {
    dynamicFields.dogYesRadio.checked = true;
    dynamicFields.dogNoRadio.checked = false;
  }
  applyDogFieldVisibility(dynamicFields, dogCountInput);

  const inputElements = Array.from(formElement.querySelectorAll("input, textarea")).filter(
    (inputElement) => inputElement.type !== "radio",
  );

  const radioInputs = [dynamicFields.dogYesRadio, dynamicFields.dogNoRadio];

  const validateAndRenderError = (fieldElement) => {
    const errorMessage = getFieldErrorMessage(fieldElement, dynamicFields);
    setFieldError(fieldElement, errorMessage);
    return !errorMessage;
  };

  inputElements.forEach((fieldElement) => {
    fieldElement.addEventListener("blur", () => validateAndRenderError(fieldElement));
    fieldElement.addEventListener("input", () => {
      if (fieldElement.getAttribute("aria-invalid") === "true") {
        validateAndRenderError(fieldElement);
      }
    });
  });

  radioInputs.forEach((radioInput) => {
    radioInput.addEventListener("change", () => {
      applyDogFieldVisibility(dynamicFields, dogCountInput);
      setCustomErrorText(dynamicFields.dogChoiceErrorElement, "");
      setFieldError(dynamicFields.dogNameInput, "");
      if (dynamicFields.dogNameInput.required) {
        validateAndRenderError(dynamicFields.dogNameInput);
      }
    });
  });

  dogCountInput.addEventListener("input", () => {
    if (Number(dogCountInput.value || 0) === 0 && dynamicFields.dogYesRadio.checked) {
      dynamicFields.dogNoRadio.checked = true;
      applyDogFieldVisibility(dynamicFields, dogCountInput);
    }
  });

  formElement.addEventListener("submit", (event) => {
    event.preventDefault();

    if (formStatusElement) {
      formStatusElement.textContent = "";
    }

    let formIsValid = true;

    inputElements.forEach((fieldElement) => {
      const isFieldValid = validateAndRenderError(fieldElement);
      formIsValid = formIsValid && isFieldValid;
    });

    const dogChoiceError = getDogChoiceError(dynamicFields, dogCountInput);
    setCustomErrorText(dynamicFields.dogChoiceErrorElement, dogChoiceError);
    if (dogChoiceError) {
      formIsValid = false;
    }

    if (dynamicFields.dogNameInput.required) {
      const dogNameValid = validateAndRenderError(dynamicFields.dogNameInput);
      formIsValid = formIsValid && dogNameValid;
    }

    if (!formIsValid) {
      if (formStatusElement) {
        formStatusElement.textContent = "Please review the highlighted fields and try again.";
      }
      const firstInvalidField = formElement.querySelector('[aria-invalid="true"]');
      if (firstInvalidField) {
        firstInvalidField.focus();
      }
      return;
    }

    renderReservationSuccessState(formElement, dynamicFields);
  });
}

function injectDogPreferenceFields(formGridElement, dogCountInput) {
  const dogCountField = dogCountInput.closest(".reservation-form__field");

  const dogChoiceField = document.createElement("div");
  dogChoiceField.className =
    "reservation-form__field reservation-form__field--full reservation-form__field--dog-choice";
  dogChoiceField.innerHTML = `
		<span class="reservation-form__label">Bringing a dog companion?</span>
		<div class="reservation-form__radio-group" role="radiogroup" aria-labelledby="dog-choice-label">
			<span id="dog-choice-label" class="visually-hidden">Bringing a dog companion?</span>
			<label class="reservation-form__radio-option" for="dog-choice-yes">
				<input type="radio" id="dog-choice-yes" name="bringingDog" value="yes" />
				Yes
			</label>
			<label class="reservation-form__radio-option" for="dog-choice-no">
				<input type="radio" id="dog-choice-no" name="bringingDog" value="no" checked />
				No
			</label>
		</div>
		<p class="reservation-form__error" id="dog-choice-error" aria-live="polite"></p>
	`;

  const dogNameField = document.createElement("div");
  dogNameField.className =
    "reservation-form__field reservation-form__field--full reservation-form__field--dog-name reservation-form__field--hidden";
  dogNameField.innerHTML = `
		<label class="reservation-form__label" for="dog-name">Dog's Name</label>
		<input
			class="reservation-form__input"
			type="text"
			id="dog-name"
			name="dogName"
			maxlength="80"
			placeholder="Your dog's name"
			aria-describedby="dog-name-error"
		/>
		<p class="reservation-form__error" id="dog-name-error" aria-live="polite"></p>
	`;

  if (dogCountField) {
    dogCountField.insertAdjacentElement("afterend", dogChoiceField);
    dogChoiceField.insertAdjacentElement("afterend", dogNameField);
  } else {
    formGridElement.append(dogChoiceField, dogNameField);
  }

  const dogYesRadio = dogChoiceField.querySelector("#dog-choice-yes");
  const dogNoRadio = dogChoiceField.querySelector("#dog-choice-no");
  const dogNameInput = dogNameField.querySelector("#dog-name");
  const dogChoiceErrorElement = dogChoiceField.querySelector("#dog-choice-error");

  if (!dogYesRadio || !dogNoRadio || !dogNameInput || !dogChoiceErrorElement) {
    throw new Error("Failed to initialize dynamic dog fields.");
  }

  return {
    dogChoiceField,
    dogNameField,
    dogYesRadio,
    dogNoRadio,
    dogNameInput,
    dogChoiceErrorElement,
  };
}

function applyDogFieldVisibility(dynamicFields, dogCountInput) {
  const bringingDog = dynamicFields.dogYesRadio.checked;

  dynamicFields.dogNameField.classList.toggle("reservation-form__field--hidden", !bringingDog);
  dynamicFields.dogNameInput.required = bringingDog;

  if (bringingDog) {
    if (!dogCountInput.value || Number(dogCountInput.value) < 1) {
      dogCountInput.value = "1";
    }
    return;
  }

  dynamicFields.dogNameInput.value = "";
  dogCountInput.value = "0";
  setFieldError(dynamicFields.dogNameInput, "");
}

function getFieldErrorMessage(fieldElement, dynamicFields) {
  const fieldId = fieldElement.id;
  const rawValue = fieldElement.value;
  const value = normalizeText(rawValue);

  if (fieldId === "guest-name") {
    if (!value) {
      return "Please enter your full name.";
    }
    if (value.length < 2) {
      return "Name should be at least 2 characters.";
    }
  }

  if (fieldId === "guest-email") {
    if (!value) {
      return "Please enter your email address.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Enter a valid email address (example: you@example.com).";
    }
  }

  if (fieldId === "reservation-date") {
    if (!value) {
      return "Please choose a reservation date.";
    }
    const selectedDate = new Date(`${value}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return "Reservation date cannot be in the past.";
    }
  }

  if (fieldId === "reservation-time") {
    if (!value) {
      return "Please choose a reservation time.";
    }
    if (value < "07:00" || value > "21:00") {
      return "Please select a time between 7:00 AM and 9:00 PM.";
    }
  }

  if (fieldId === "guest-count") {
    if (!value) {
      return "Please enter number of guests.";
    }
    const guestCount = Number(value);
    if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 10) {
      return "Guests must be a whole number from 1 to 10.";
    }
  }

  if (fieldId === "dog-count") {
    if (!value) {
      return "Please enter number of dogs (use 0 if none).";
    }
    const dogCount = Number(value);
    if (!Number.isInteger(dogCount) || dogCount < 0 || dogCount > 6) {
      return "Dogs joining must be a whole number from 0 to 6.";
    }
    if (dynamicFields.dogYesRadio.checked && dogCount < 1) {
      return "If bringing a dog, please set Dogs Joining to at least 1.";
    }
    if (dynamicFields.dogNoRadio.checked && dogCount > 0) {
      return "If not bringing a dog, Dogs Joining should be 0.";
    }
  }

  if (fieldId === "dog-name" && fieldElement.required) {
    if (!value) {
      return "Please provide your dog's name.";
    }
    if (value.length < 2) {
      return "Dog's name should be at least 2 characters.";
    }
  }

  return "";
}

function getDogChoiceError(dynamicFields, dogCountInput) {
  if (!dynamicFields.dogYesRadio.checked && !dynamicFields.dogNoRadio.checked) {
    return "Please choose whether you are bringing a dog companion.";
  }

  if (dynamicFields.dogYesRadio.checked && Number(dogCountInput.value || 0) < 1) {
    return "Please set Dogs Joining to at least 1.";
  }

  return "";
}

function setCustomErrorText(errorElement, message) {
  if (!errorElement) {
    return;
  }
  errorElement.textContent = message;
}

function setFieldError(fieldElement, message) {
  const errorElement = document.getElementById(`${fieldElement.id}-error`);
  if (errorElement) {
    errorElement.textContent = message;
  }
  fieldElement.setAttribute("aria-invalid", message ? "true" : "false");
}

function renderReservationSuccessState(formElement, dynamicFields) {
  const nameValue = normalizeText(getInputValue("guest-name"));
  const dateValue = getInputValue("reservation-date");
  const timeValue = getInputValue("reservation-time");
  const guestsValue = getInputValue("guest-count");
  const dogsValue = getInputValue("dog-count");
  const dogNameValue = normalizeText(dynamicFields.dogNameInput.value);

  const confirmationElement = document.createElement("section");
  confirmationElement.className = "reservation-confirmation";
  confirmationElement.setAttribute("role", "status");
  confirmationElement.setAttribute("aria-live", "polite");

  const formattedDate = new Date(`${dateValue}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  confirmationElement.innerHTML = `
		<h3 class="reservation-confirmation__title">Reservation Confirmed, ${nameValue}! ✨</h3>
		<p class="reservation-confirmation__lead">
			Thank you for choosing Barkside Dog Café. We can't wait to welcome you.
		</p>
		<ul class="reservation-confirmation__details">
			<li><strong>Date:</strong> ${formattedDate}</li>
			<li><strong>Time:</strong> ${timeValue}</li>
			<li><strong>Guests:</strong> ${guestsValue}</li>
			<li><strong>Dogs Joining:</strong> ${dogsValue}</li>
			${dogNameValue ? `<li><strong>Dog's Name:</strong> ${dogNameValue}</li>` : ""}
		</ul>
	`;

  formElement.replaceWith(confirmationElement);
  confirmationElement.scrollIntoView({ behavior: "smooth", block: "center" });
}

function getInputValue(id) {
  const element = document.getElementById(id);
  return element ? element.value : "";
}
