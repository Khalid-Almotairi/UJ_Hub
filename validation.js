// validation.js
// التهيئة
document.addEventListener("DOMContentLoaded", () => {
  const CURRENT_STUDENT_ID = localStorage.getItem("CURRENT_STUDENT_ID");

  // ===== NAVBAR DROPDOWN & LOGIN LINK =====
  const authNavItems = document.querySelectorAll(".nav-auth-only"); //بعد التسجيل
  const loginWrapper = document.getElementById("navLoginWrapper");// login
  const userWrapper = document.getElementById("navUserWrapper");// logged as
  const navUserId = document.getElementById("navUserId"); 
  const navUserToggle = document.getElementById("navUserToggle");
  const navUserDropdown = document.getElementById("navUserDropdown");
  const navLogoutBtn = document.getElementById("navLogoutBtn");

  function setupNavbar() {
    if (CURRENT_STUDENT_ID) {
      if (loginWrapper) loginWrapper.classList.add("d-none");//المستخدم مسجل
      if (userWrapper) userWrapper.classList.remove("d-none");//
      if (navUserId) navUserId.textContent = CURRENT_STUDENT_ID;
      authNavItems.forEach(li => li.classList.remove("d-none"));
    } else {
      if (loginWrapper) loginWrapper.classList.remove("d-none");
      if (userWrapper) userWrapper.classList.add("d-none");
      authNavItems.forEach(li => li.classList.add("d-none"));
    }
  }

  setupNavbar();

  // Dropdown toggle
  if (navUserToggle && navUserDropdown && userWrapper) {
    navUserToggle.addEventListener("click", (e) => {
      e.preventDefault();
      navUserDropdown.classList.toggle("show");
    });
    // اليوزر ما سجل
    document.addEventListener("click", (e) => {
      if (!userWrapper.contains(e.target)) {
        navUserDropdown.classList.remove("show");
      }
    });
  }

  // Logout
  if (navLogoutBtn) {
    navLogoutBtn.addEventListener("click", () => {
      localStorage.removeItem("CURRENT_STUDENT_ID");
      window.location.href = "login.html";
    });
  }

  // ===== PROTECT PAGES THAT NEED LOGIN =====
  const protectedPages = ["events-register.html", "contact-us.html", "submitted-forms.html"];
  const currentPage = window.location.pathname.split("/").pop();

  if (protectedPages.includes(currentPage) && !CURRENT_STUDENT_ID) {
    window.location.href = "login.html";
    return;
  }

  // ===== AUTO-FILL STUDENT ID FIELDS =====
  const studentIdInput = document.getElementById("studentId");
  if (studentIdInput) {
    studentIdInput.value = CURRENT_STUDENT_ID || "";
    studentIdInput.readOnly = true;
  }

  const contactStudentIdInput = document.getElementById("contactStudentId");
  if (contactStudentIdInput) {
    contactStudentIdInput.value = CURRENT_STUDENT_ID || "";
    contactStudentIdInput.readOnly = true;
  }

  const submittedStudentIdInput = document.getElementById("submittedStudentId");
  if (submittedStudentIdInput) {
    submittedStudentIdInput.value = CURRENT_STUDENT_ID || "";
  }

  // ===== HELPER FOR FORMS =====//مسح الفورم 
  function clearErrors() {
    document.querySelectorAll(".error-message").forEach(el => el.innerText = "");
  }

  // ===================== CONTACT FORM =====================
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearErrors();

      let valid = true;
      const firstName = document.getElementById("firstName").value.trim();
      const lastName = document.getElementById("lastName").value.trim();
      const genderEl = document.querySelector('input[name="gender"]:checked');
      const mobile = document.getElementById("mobile").value.trim();
      const dob = document.getElementById("dob").value;
      const email = document.getElementById("email").value.trim();
      const language = document.getElementById("language").value;
      const message = document.getElementById("message").value.trim();

      if (firstName.length < 2) {
        document.getElementById("firstNameError").innerText = "Please enter a valid first name.";
        valid = false;
      }
      if (lastName.length < 2) {
        document.getElementById("lastNameError").innerText = "Please enter a valid last name.";
        valid = false;
      }
      if (!genderEl) {
        document.getElementById("genderError").innerText = "Please select a gender.";
        valid = false;
      }
      if (!/^05[0-9]{8}$/.test(mobile)) {
        document.getElementById("mobileError").innerText = "Mobile must begin with 05 and be 10 digits.";
        valid = false;
      }
      if (!dob) {
        document.getElementById("dobError").innerText = "Please enter your date of birth.";
        valid = false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById("emailError").innerText = "Please enter a valid email.";
        valid = false;
      }
      if (!language) {
        document.getElementById("languageError").innerText = "Please select a language.";
        valid = false;
      }
      if (message.length < 5) {
        document.getElementById("messageError").innerText = "Message must contain at least 5 characters.";
        valid = false;
      }
      if (!valid) return;

      const data = {
        firstName,
        lastName,
        gender: genderEl.value,
        mobile,
        dob,
        email,
        language,
        message,
        studentId: CURRENT_STUDENT_ID
      };

      const response = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    // تم الارسال
      const text = await response.text();
      document.getElementById("contactResponse").innerHTML =
        `<div class="alert alert-success mt-2">${text}</div>`;
      contactForm.reset();
    });
  }

  // ===================== EVENT REGISTRATION =====================
  const registrationForm = document.getElementById("registrationForm");
  if (registrationForm) {
    registrationForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearErrors();

      let valid = true;

      const fullName = document.getElementById("fullName").value.trim();
      const regEmail = document.getElementById("regEmail").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const eventSelect = document.getElementById("eventSelect").value;
      const track = document.getElementById("track").value;
      const skillLevel = document.getElementById("skillLevel").value;
      const teamName = document.getElementById("teamName").value.trim();
      const teamSize = document.getElementById("teamSize").value;
      const notes = document.getElementById("notes").value.trim();

      if (fullName.length < 3) {
        document.getElementById("fullNameError").innerText = "Enter a valid name.";
        valid = false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) {
        document.getElementById("regEmailError").innerText = "Enter a valid email.";
        valid = false;
      }
      if (!/^05[0-9]{8}$/.test(phone)) {
        document.getElementById("phoneError").innerText = "Phone must begin with 05 and be 10 digits.";
        valid = false;
      }
      if (!eventSelect) {
        document.getElementById("eventSelectError").innerText = "Select an event.";
        valid = false;
      }
      if (!track) {
        document.getElementById("trackError").innerText = "Select a track.";
        valid = false;
      }
      if (!skillLevel) {
        document.getElementById("skillLevelError").innerText = "Select your skill level.";
        valid = false;
      }
      if (teamSize < 1 || teamSize > 8) {
        document.getElementById("teamSizeError").innerText = "Team size must be 1–8 members.";
        valid = false;
      }
      if (!valid) return;

      const data = {
        fullName,
        studentId: CURRENT_STUDENT_ID,
        regEmail,
        phone,
        eventSelect,
        track,
        skillLevel,
        teamName,
        teamSize,
        notes
      };

      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    // تم الارسال
      const text = await response.text();
      const respDiv = document.getElementById("registrationResponse");
      if (respDiv) {
        respDiv.innerHTML = `<div class="alert alert-success mt-2">${text}</div>`;
      }
      registrationForm.reset();
    });
  }

  // ===================== SUBMITTED FORMS =====================
  const submittedContactsDiv = document.getElementById("submittedContacts");
  const submittedEventsDiv = document.getElementById("submittedEvents");

  if (submittedContactsDiv && submittedEventsDiv) {
    const refreshContactsBtn = document.getElementById("refreshContactsBtn");
    const refreshEventsBtn = document.getElementById("refreshEventsBtn");
    // تحديث
    async function loadContacts() {
      submittedContactsDiv.innerHTML = "<div class='text-light-muted'>Loading contact messages...</div>";
      try {
        const res = await fetch(`http://localhost:3000/api/contact/by-student/${CURRENT_STUDENT_ID}`);
        const contacts = await res.json();
      // مافيه بيانات
        if (!Array.isArray(contacts) || contacts.length === 0) {
          submittedContactsDiv.innerHTML = "<div class='text-light-muted'>No contact messages yet.</div>";
          return;
        }

        const rows = contacts.map(c => {
          const created = c.created_at ? new Date(c.created_at).toLocaleString() : "";
          const shortMsg = c.message.length > 60 ? c.message.slice(0, 60) + "..." : c.message;
          return `
            <tr>
              <td>${c.first_name} ${c.last_name}</td>
              <td>${c.email}</td>
              <td>${created}</td>
              <td>${shortMsg}</td>
            </tr>`;
        }).join("");

        submittedContactsDiv.innerHTML = `
          <div class="table-responsive">
            <table class="table table-sm table-dark table-striped align-middle mb-0">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Submitted At</th><th>Message</th></tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>`;
      } catch (err) {
        console.error(err);
        submittedContactsDiv.innerHTML = "<div class='text-danger'>Error loading contact messages.</div>";
      }
    }

    async function loadEvents() {
      submittedEventsDiv.innerHTML = "<div class='text-light-muted'>Loading event registrations...</div>";
      try {
        const res = await fetch(`http://localhost:3000/api/register/by-student/${CURRENT_STUDENT_ID}`);
        const regs = await res.json();

        if (!Array.isArray(regs) || regs.length === 0) {
          submittedEventsDiv.innerHTML = "<div class='text-light-muted'>No event registrations yet.</div>";
          return;
        }

        const rows = regs.map(r => {
          const created = r.created_at ? new Date(r.created_at).toLocaleString() : "";
          return `
            <tr>
              <td>${r.full_name}</td>
              <td>${r.event_name}</td>
              <td>${r.skill_level}</td>
              <td>${r.team_members_count}</td>
              <td>${created}</td>
            </tr>`;
        }).join("");

        submittedEventsDiv.innerHTML = `
          <div class="table-responsive">
            <table class="table table-sm table-dark table-striped align-middle mb-0">
              <thead>
                <tr><th>Name</th><th>Event</th><th>Level</th><th>Team Size</th><th>Submitted At</th></tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>`;
      } catch (err) {
        console.error(err);
        submittedEventsDiv.innerHTML = "<div class='text-danger'>Error loading registrations.</div>";
      }
    }

    if (refreshContactsBtn) refreshContactsBtn.addEventListener("click", loadContacts);
    if (refreshEventsBtn) refreshEventsBtn.addEventListener("click", loadEvents);

    loadContacts();
    loadEvents();
  }
});
