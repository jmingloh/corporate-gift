"use strict";

const SITE_CONFIG = Object.freeze({
  BRAND_NAME: "JM Corporate Gift Sourcing",
  PHONE_NUMBER: "60177740471",
  EMAIL: "jmcorporategift.my@gmail.com",
  WEBSITE_URL: "https://corporate-gift.my/",
  CATALOGUE_URL: "gift-catalogue.pdf",
  SHIRT_CATALOGUE_URL: "shirt-catalogue.pdf",
  FORM_ENDPOINT: "https://script.google.com/macros/s/AKfycbyy_Kvw1jEJLANZfkNnZagJWp7OcYYhhNvHZMPicNo72Jb_yMjBXoDbXVdLeYZJRCKC/exec",
  GA4_ID: "",
  GOOGLE_ADS_ID: "",
  META_PIXEL_ID: "",
  GTM_ID: ""
});

const DEFAULT_WHATSAPP_MESSAGE =
  "Hi I am looking for corporate gifts. Please send me your free catalogue.";

const SELECTORS = {
  menuToggle: "[data-menu-toggle]",
  siteNav: "[data-site-nav]",
  whatsappLink: "[data-whatsapp-link]",
  downloadLink: "[data-download-link]",
  shirtDownloadLink: "[data-shirt-download-link]",
  configText: "[data-config]",
  emailLink: "[data-email-link]",
  websiteLink: "[data-website-link]",
  form: "#catalogueForm",
  formCard: "[data-form-card]",
  formStatus: "[data-form-status]",
  successState: "[data-success-state]",
  reveal: ".reveal"
};

function buildWhatsAppUrl(message = DEFAULT_WHATSAPP_MESSAGE) {
  return `https://wa.me/${SITE_CONFIG.PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
}

function clean(value) {
  return String(value || "").trim();
}

function trackEvent(eventName, eventParams = {}) {
  if (!eventName) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...eventParams });

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, eventParams);
  }

  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", eventName, eventParams);
  }
}

function injectTrackingPlaceholders() {
  // Google Tag Manager, GA4, Google Ads, and Meta Pixel can be enabled here.
  // Keep IDs blank in SITE_CONFIG until the real accounts are ready.
  if (SITE_CONFIG.GTM_ID) {
    const gtmScript = document.createElement("script");
    gtmScript.async = true;
    gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${SITE_CONFIG.GTM_ID}`;
    document.head.appendChild(gtmScript);
  }

  if (SITE_CONFIG.GA4_ID || SITE_CONFIG.GOOGLE_ADS_ID) {
    const firstId = SITE_CONFIG.GA4_ID || SITE_CONFIG.GOOGLE_ADS_ID;
    const gtagScript = document.createElement("script");
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${firstId}`;
    document.head.appendChild(gtagScript);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());

    if (SITE_CONFIG.GA4_ID) window.gtag("config", SITE_CONFIG.GA4_ID);
    if (SITE_CONFIG.GOOGLE_ADS_ID) window.gtag("config", SITE_CONFIG.GOOGLE_ADS_ID);
  }

  if (SITE_CONFIG.META_PIXEL_ID) {
    window.fbq = window.fbq || function fbq() {
      window.fbq.callMethod
        ? window.fbq.callMethod.apply(window.fbq, arguments)
        : window.fbq.queue.push(arguments);
    };
    window.fbq.queue = window.fbq.queue || [];
    window.fbq.loaded = true;
    window.fbq.version = "2.0";
    const metaScript = document.createElement("script");
    metaScript.async = true;
    metaScript.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(metaScript);
    window.fbq("init", SITE_CONFIG.META_PIXEL_ID);
    window.fbq("track", "PageView");
  }
}

function applyConfigToPage() {
  document.querySelectorAll(SELECTORS.configText).forEach((node) => {
    const key = node.dataset.config;
    const valueMap = {
      brandName: SITE_CONFIG.BRAND_NAME,
      email: SITE_CONFIG.EMAIL,
      phone: SITE_CONFIG.PHONE_NUMBER,
      website: SITE_CONFIG.WEBSITE_URL
    };
    node.textContent = valueMap[key] || "";
  });

  document.querySelectorAll(SELECTORS.whatsappLink).forEach((link) => {
    link.href = buildWhatsAppUrl();
    link.target = "_blank";
    link.rel = "noopener";
  });

  document.querySelectorAll(SELECTORS.downloadLink).forEach((link) => {
    link.href = SITE_CONFIG.CATALOGUE_URL;
    link.target = "_blank";
    link.rel = "noopener";
  });

  document.querySelectorAll(SELECTORS.shirtDownloadLink).forEach((link) => {
    link.href = SITE_CONFIG.SHIRT_CATALOGUE_URL;
    link.target = "_blank";
    link.rel = "noopener";
  });

  document.querySelectorAll(SELECTORS.emailLink).forEach((link) => {
    link.href = SITE_CONFIG.EMAIL.includes("@") ? `mailto:${SITE_CONFIG.EMAIL}` : "#";
  });

  document.querySelectorAll(SELECTORS.websiteLink).forEach((link) => {
    const hasUrl = SITE_CONFIG.WEBSITE_URL.startsWith("http");
    link.href = hasUrl ? SITE_CONFIG.WEBSITE_URL : "#";
    if (hasUrl) {
      link.target = "_blank";
      link.rel = "noopener";
    }
  });
}

function initMenu() {
  const toggle = document.querySelector(SELECTORS.menuToggle);
  const nav = document.querySelector(SELECTORS.siteNav);
  if (!toggle || !nav) return;

  const closeMenu = () => {
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    document.body.classList.toggle("menu-open", !expanded);
    toggle.setAttribute("aria-expanded", String(!expanded));
  });

  document.querySelectorAll(".site-nav a, .header-actions a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

function initEventTracking() {
  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-event]");
    if (!target) return;

    const eventName = target.dataset.event;
    const label = clean(target.textContent);
    trackEvent(eventName, { label });
  });

  document.querySelectorAll('a[href="#catalogue"]').forEach((link) => {
    link.addEventListener("click", () => {
      trackEvent("quote_request", { label: clean(link.textContent) });
    });
  });
}

function initRevealAnimations() {
  const elements = document.querySelectorAll(SELECTORS.reveal);
  if (!elements.length) return;

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach((element) => observer.observe(element));
}

function buildLeadPayload(form) {
  const formData = new FormData(form);
  return {
    source: "corporate_gift_catalogue_landing_page",
    pageUrl: window.location.href,
    capturedAt: new Date().toISOString(),
    brandName: SITE_CONFIG.BRAND_NAME,
    name: clean(formData.get("name")),
    companyName: clean(formData.get("company")),
    businessEmail: clean(formData.get("email")),
    whatsappPhone: clean(formData.get("phone")),
    estimatedQuantity: clean(formData.get("estimatedQuantity")),
    budgetPerGift: clean(formData.get("budgetPerGift")),
    lookingFor: clean(formData.get("lookingFor")),
    neededDate: clean(formData.get("deadline")),
    additionalRequirements: clean(formData.get("requirements")),
    marketingConsent: formData.get("marketingConsent") === "yes"
  };
}

function buildLeadWhatsAppMessage(data) {
  return [
    "Hi I am looking for corporate gifts. Please send me your free catalogue.",
    "",
    `Name: ${data.name}`,
    `Company: ${data.companyName}`,
    `Email: ${data.businessEmail}`,
    `WhatsApp / Phone: ${data.whatsappPhone}`,
    `Estimated Quantity: ${data.estimatedQuantity || "Not sure yet"}`,
    `Budget Per Gift: ${data.budgetPerGift || "Not sure yet"}`,
    `Looking For: ${data.lookingFor || "Not sure yet"}`,
    `Needed Date: ${data.neededDate || "Not stated"}`,
    `Additional Requirements: ${data.additionalRequirements || "Not stated"}`
  ].join("\n");
}

async function submitLead(data) {
  if (!SITE_CONFIG.FORM_ENDPOINT) {
    const stored = JSON.parse(localStorage.getItem("catalogueLeads") || "[]");
    stored.unshift(data);
    localStorage.setItem("catalogueLeads", JSON.stringify(stored.slice(0, 50)));
    return { localOnly: true };
  }

  const body = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    body.append(key, String(value ?? ""));
  });

  await fetch(SITE_CONFIG.FORM_ENDPOINT, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body
  });

  return { localOnly: false };
}

function showSuccess(formCard, form, successState, data) {
  form.hidden = true;
  successState.hidden = false;

  const whatsappButton = successState.querySelector(SELECTORS.whatsappLink);
  if (whatsappButton) {
    whatsappButton.href = buildWhatsAppUrl(buildLeadWhatsAppMessage(data));
  }

  formCard.scrollIntoView({ behavior: "smooth", block: "center" });
}

function initLeadForm() {
  const form = document.querySelector(SELECTORS.form);
  const formCard = document.querySelector(SELECTORS.formCard);
  const status = document.querySelector(SELECTORS.formStatus);
  const successState = document.querySelector(SELECTORS.successState);
  if (!form || !formCard || !status || !successState) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.classList.remove("error");
    status.textContent = "";

    const honeypot = clean(new FormData(form).get("website"));
    if (honeypot) return;

    if (!form.checkValidity()) {
      form.classList.add("form-was-validated");
      form.reportValidity();
      status.classList.add("error");
      status.textContent = "Please complete the required fields so we can send the catalogue.";
      return;
    }

    form.classList.remove("form-was-validated");
    const data = buildLeadPayload(form);
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "SENDING...";

    try {
      await submitLead(data);
      trackEvent("catalogue_lead", {
        quantity: data.estimatedQuantity,
        budget: data.budgetPerGift,
        looking_for: data.lookingFor
      });
      showSuccess(formCard, form, successState, data);
    } catch (error) {
      status.classList.add("error");
      status.textContent = "We could not submit the form. Please try WhatsApp instead.";
      submitButton.disabled = false;
      submitButton.textContent = "GET FREE CATALOGUE";
      console.error(error);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  injectTrackingPlaceholders();
  applyConfigToPage();
  initMenu();
  initEventTracking();
  initRevealAnimations();
  initLeadForm();
});
