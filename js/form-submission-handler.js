(function() {
  function validEmail(email) {
    var re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }

  function validateHuman(honeypot) {
    if (honeypot) {
      console.log("Robot Detected!");
      return true;
    } else {
      console.log("Welcome Human!");
      return false;
    }
  }

  function getFormData(form) {
    var fields = ["name", "email", "subject", "message"];
    var formData = {};

    fields.forEach(function(name) {
      var element = form.elements[name];
      if (element) {
        if (element.length && element[0].type === "checkbox") {
          var values = [];
          for (var i = 0; i < element.length; i++) {
            if (element[i].checked) values.push(element[i].value);
          }
          formData[name] = values.join(", ");
        } else {
          formData[name] = element.value || "";
        }
      }
    });

    formData.formDataNameOrder = JSON.stringify(fields);
    formData.formGoogleSheetName = form.dataset.sheet || "FormResponses";
    formData.formGoogleSendEmail = form.dataset.email || "";

    return formData;
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    var form = event.target;

    if (validateHuman(form.elements["honeypot"].value)) {
      return false;
    }

    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const subject = form.querySelector('[name="subject"]').value.trim();
    const message = form.querySelector('[name="message"]').value;

    if (!name || !email || !subject || !message || message.trim().length === 0) {
      showPopup("Veuillez remplir tous les champs obligatoires.", false);
      return false;
    }

    if (!validEmail(email)) {
      showPopup("Veuillez entrer une adresse e-mail valide.", false);
      return false;
    }

    var data = getFormData(form);
    disableAllButtons(form);
    var url = form.action;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        var formElements = form.querySelector(".form-elements");
        if (formElements) {
          formElements.style.display = "none";
        }
    
        // Başarı popup'u göster
        if (window.handleFormSuccess) {
          window.handleFormSuccess(form);
        } else {
          showPopup("Votre message a été envoyé avec succès ✔", true);
        }
        // FORMU TEMİZLE
        form.reset();
      }
    };
    
    var encoded = Object.keys(data).map(function(k) {
      return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
    }).join('&');
    xhr.send(encoded);
  }

  function loaded() {
    console.log("Contact form submission handler loaded successfully.");
    var forms = document.querySelectorAll("form.gform");
    for (var i = 0; i < forms.length; i++) {
      forms[i].addEventListener("submit", handleFormSubmit, false);
    }
  }
  document.addEventListener("DOMContentLoaded", loaded, false);

  function disableAllButtons(form) {
    var buttons = form.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }
  }

  function showPopup(message, isSuccess = true) {
    const popup = document.createElement('div');
    popup.textContent = message;
    popup.style.position = 'fixed';
    popup.style.bottom = '30px';
    popup.style.right = '30px';
    popup.style.padding = '16px 20px';
    popup.style.backgroundColor = isSuccess ? '#28a745' : '#dc3545';
    popup.style.color = 'white';
    popup.style.borderRadius = '6px';
    popup.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    popup.style.zIndex = '10000';
    document.body.appendChild(popup);
    setTimeout(() => {
      popup.remove();
    }, 4000);
  }
})();

if (window.handleFormSuccess) {
  window.handleFormSuccess(form);
} else {
  showPopup("Votre message a été envoyé avec succès ✔", true);
}
// 🧹 Formu temizle
form.reset();
// 🧹 Formu temizle