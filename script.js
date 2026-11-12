
const StudentGig = (() => {
  const KEYS = {
    users: "studentgig_users",
    session: "studentgig_session",
    gigs: "studentgig_gigs",
    apps: "studentgig_applications",
    messages: "studentgig_messages",
    activity: "studentgig_activity",
  };

  const page = document.body.dataset.page || "home";
  const requiredRole = document.body.dataset.role || "public";
  const now = () => new Date().toISOString();
  const uid = (prefix = "id") =>
    `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  const read = (key, fallback = []) => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  };

  const write = (key, value) =>
    localStorage.setItem(key, JSON.stringify(value));

  const esc = (value) =>
    String(value ?? "").replace(
      /[&<>'"]/g,
      (c) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[c],
    );

  const initials = (name) =>
    String(name || "SG")
      .split(/\s+/)
      .map((x) => x[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const money = (n) => `₱${Number(n || 0).toLocaleString()}`;

  const formatDate = (value) =>
    new Date(value).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const homeFor = (role) =>
    role === "admin"
      ? "admin-dashboard.html"
      : role === "employer"
        ? "employer-profile.html"
        : "student-profile.html";

  const getUsers = () => read(KEYS.users),
    getGigs = () => read(KEYS.gigs),
    getApps = () => read(KEYS.apps),
    getMessages = () => read(KEYS.messages);

  const current = () => {
    const s = read(KEYS.session, null);
    return s
      ? getUsers().find((u) => u.id === s.userId && u.status === "active") || null
      : null;
  };

  const activity = (text, actorId = current()?.id || "system") => {
    const rows = read(KEYS.activity);
    rows.unshift({ id: uid("act"), text, actorId, time: now() });
    write(KEYS.activity, rows.slice(0, 80));
  };

  function seed() {
    if (!localStorage.getItem(KEYS.users))
      write(KEYS.users, [
        {
          id: "admin_1",
          role: "admin",
          name: "System Administrator",
          email: "admin@studentgig.test",
          password: "Admin123!",
          status: "active",
          createdAt: now(),
          profile: {},
        },
        {
          id: "student_1",
          role: "student",
          name: "Alex Pasion",
          email: "student@studentgig.test",
          password: "Student123!",
          status: "active",
          createdAt: now(),
          profile: {
            degree: "BS Information Technology",
            school: "Northbridge University",
            bio: "Third-year IT student interested in digital products, community programs, and meaningful work.",
            skills: ["Figma", "HTML & CSS", "Social media", "Data entry"],
            preferences: "Remote or hybrid creative and admin work",
            availability: "Weekdays after 2 PM and Saturdays",
            location: "Quezon City",
            photo: "",
          },
        },
        {
          id: "student_2",
          role: "student",
          name: "Lenox Pasion",
          email: "lenox@studentgig.test",
          password: "Student123!",
          status: "active",
          createdAt: now(),
          profile: {
            degree: "BA Communication",
            school: "City State College",
            skills: ["Writing", "Events"],
            location: "Manila",
          },
        },
        {
          id: "employer_1",
          role: "employer",
          name: "Mia Santos",
          email: "employer@studentgig.test",
          password: "Employer123!",
          status: "active",
          createdAt: now(),
          profile: {
            company: "Bright Media",
            description:
              "An independent creative studio helping local businesses tell clearer stories.",
            contact: "hello@brightmedia.test",
            location: "Quezon City",
            industry: "Creative marketing",
            logo: "",
          },
        },
        {
          id: "employer_2",
          role: "employer",
          name: "Leo Cruz",
          email: "leo@campuscafe.test",
          password: "Employer123!",
          status: "active",
          createdAt: now(),
          profile: {
            company: "Campus Cafe",
            description: "A student-friendly neighborhood cafe.",
            contact: "hello@campuscafe.test",
            location: "On Campus",
            industry: "Food service",
            logo: "",
          },
        },
      ]);

    if (!localStorage.getItem(KEYS.gigs))
      write(KEYS.gigs, [
        {
          id: "gig_1",
          ownerId: "employer_1",
          title: "Social Media Assistant",
          company: "Bright Media",
          category: "Marketing",
          type: "Part-Time",
          location: "Remote",
          salary: 12000,
          salaryLabel: "₱12,000 / month",
          schedule: "10 hours per week, flexible",
          deadline: "2027-12-15",
          description:
            "Plan social content, write clear captions, and monitor community conversations for growing local brands.",
          responsibilities:
            "Create weekly content plans\nWrite and schedule social posts\nTrack basic engagement metrics",
          qualifications:
            "Clear written communication\nOrganized and dependable\nBasic Canva or Figma knowledge",
          status: "active",
          createdAt: now(),
        },
        {
          id: "gig_2",
          ownerId: "employer_1",
          title: "Graphic Design Assistant",
          company: "Bright Media",
          category: "Design",
          type: "Remote",
          location: "Remote",
          salary: 250,
          salaryLabel: "₱250 / hour",
          schedule: "8–12 flexible hours per week",
          deadline: "2027-11-30",
          description:
            "Create polished social assets and presentation graphics with guidance from our design lead.",
          responsibilities:
            "Prepare social templates\nResize campaign assets\nOrganize design files",
          qualifications:
            "Portfolio of student or personal work\nWorking knowledge of Figma or Canva",
          status: "active",
          createdAt: now(),
        },
        {
          id: "gig_3",
          ownerId: "employer_2",
          title: "Cashier Assistant",
          company: "Campus Cafe",
          category: "Retail",
          type: "Part-Time",
          location: "On Campus",
          salary: 95,
          salaryLabel: "₱95 / hour",
          schedule: "Three afternoon shifts per week",
          deadline: "2027-12-20",
          description:
            "Support daily counter operations and create a warm, efficient experience for campus customers.",
          responsibilities:
            "Take customer orders\nHandle payments accurately\nKeep the counter organized",
          qualifications:
            "Friendly communication\nReliable availability\nNo prior experience required",
          status: "active",
          createdAt: now(),
        },
        {
          id: "gig_4",
          ownerId: "employer_2",
          title: "Campus Event Assistant",
          company: "Campus Cafe",
          category: "Events",
          type: "Short-Term",
          location: "On Campus",
          salary: 650,
          salaryLabel: "₱650 / day",
          schedule: "Two event days plus briefing",
          deadline: "2027-10-10",
          description:
            "Help coordinate registration, guest flow, and setup for a student leadership event.",
          responsibilities:
            "Prepare registration materials\nWelcome attendees\nSupport setup and pack-down",
          qualifications:
            "Confident communication\nAble to work on event dates",
          status: "active",
          createdAt: now(),
        },
      ]);

    if (!localStorage.getItem(KEYS.apps))
      write(KEYS.apps, [
        {
          id: "app_1",
          gigId: "gig_1",
          studentId: "student_1",
          status: "pending",
          note: "I have managed social content for our student council and would love to contribute.",
          createdAt: now(),
        },
        {
          id: "app_2",
          gigId: "gig_2",
          studentId: "student_2",
          status: "accepted",
          note: "Design and storytelling are my strengths.",
          createdAt: now(),
        },
      ]);

    if (!localStorage.getItem(KEYS.messages))
      write(KEYS.messages, [
        {
          id: "msg_1",
          fromId: "employer_1",
          toId: "student_1",
          text: "Hi Nathan, thanks for applying. Are you available for a quick call tomorrow?",
          time: now(),
          read: false,
        },
        {
          id: "msg_2",
          fromId: "student_1",
          toId: "employer_1",
          text: "Yes, I am available after 2 PM.",
          time: now(),
          read: true,
        },
      ]);

    if (!localStorage.getItem(KEYS.activity))
      write(KEYS.activity, [
        {
          id: "act_seed",
          text: "StudentGig demo data initialized",
          actorId: "system",
          time: now(),
        },
      ]);
  }

  function guard() {
    const user = current();

    if (requiredRole === "public") return user;

    if (requiredRole === "auth" && !user) {
      location.replace(
        `login.html?next=${encodeURIComponent(location.pathname.split("/").pop())}`,
      );
      return null;
    }

    if (requiredRole === "member") {
      if (!user) {
        location.replace(
          `login.html?next=${encodeURIComponent(location.pathname.split("/").pop())}`,
        );
        return null;
      }

      if (!["student", "employer"].includes(user.role)) {
        location.replace(homeFor(user.role));
        return null;
      }
    }

    if (["student", "employer", "admin"].includes(requiredRole)) {
      if (!user) {
        location.replace(
          `login.html?next=${encodeURIComponent(
            location.pathname.split("/").pop() + location.search,
          )}`,
        );
        return null;
      }

      if (user.role !== requiredRole) {
        location.replace(homeFor(user.role));
        return null;
      }
    }

    return user;
  }

  function toast(message, type = "success") {
    let box = document.querySelector(".toast");

    if (!box) {
      box = document.createElement("div");
      box.className = "toast";
      document.body.append(box);
    }

    box.textContent = message;
    box.style.borderColor =
      type === "error" ? "rgba(255,107,107,.4)" : "";
    box.classList.add("show");

    clearTimeout(window.sgToast);
    window.sgToast = setTimeout(
      () => box.classList.remove("show"),
      2600,
    );
  }

  function logout() {
    const user = current();

    localStorage.removeItem(KEYS.session);

    if (user) activity(`${user.name} logged out`, user.id);

    location.href = "login.html";
  }

  // UPDATED NAVIGATION WITH MOBILE LOGOUT
  function nav() {
    const host = document.querySelector("#siteNav");
    if (!host) return;

    const user = current();
    let links = "";

    if (user?.role === "student") {
      links =
        '<a href="student-profile.html">Dashboard</a>' +
        '<a href="find-gigs.html">Find gigs</a>' +
        '<a href="student-profile.html#applications">Applications</a>' +
        '<a href="messages.html">Messages</a>';
    } else if (user?.role === "employer") {
      links =
        '<a href="employer-profile.html">Dashboard</a>' +
        '<a href="post-job.html">Post a gig</a>' +
        '<a href="employer-profile.html#applicants">Applicants</a>' +
        '<a href="messages.html">Messages</a>';
    } else if (user?.role === "admin") {
      links = '<a href="admin-dashboard.html">Admin dashboard</a>';
    } else {
      links =
        '<a href="index.html">Home</a>' +
        '<a href="login.html">Find gigs</a>' +
        '<a href="signin.html">For employers</a>';
    }

    // Add logout inside the mobile navigation menu
    const mobileLogout = user
      ? `<button class="btn btn-outline mobile-logout" data-logout>Log out</button>`
      : `<div class="mobile-auth">
           <a class="btn btn-ghost" href="login.html">Log in</a>
           <a class="btn btn-sm" href="signin.html">Create account</a>
         </div>`;

    host.innerHTML = `
      <header class="navbar">
        <div class="container nav-inner">

          <a class="logo" href="${user ? homeFor(user.role) : "index.html"}">
            <span class="logo-mark">S</span>
            StudentGig
          </a>

          <nav class="nav-links">
            ${links}
            ${mobileLogout}
          </nav>

          <div class="nav-actions">
            ${
              user
                ? `
                  <div class="nav-user">
                    <div class="avatar sm">
                      ${initials(user.profile?.company || user.name)}
                    </div>
                    <div>
                      <strong>${esc(user.profile?.company || user.name)}</strong>
                      <small>${esc(user.role)}</small>
                    </div>
                  </div>

                  <button class="btn btn-outline btn-sm desktop-logout" data-logout>
                    Log out
                  </button>
                `
                : `
                  <a class="btn btn-ghost desktop-auth" href="login.html">Log in</a>
                  <a class="btn btn-sm desktop-auth" href="signin.html">Create account</a>
                `
            }

            <button
              class="menu-btn"
              type="button"
              aria-label="Open navigation"
              aria-expanded="false"
            >☰</button>

          </div>
        </div>
      </header>
    `;

    const menuButton = host.querySelector(".menu-btn");
    const menu = host.querySelector(".nav-links");

    menuButton?.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");

      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation",
      );
      menuButton.textContent = isOpen ? "✕" : "☰";
    });

    // Attach logout to both desktop and mobile buttons
    host.querySelectorAll("[data-logout]").forEach((button) => {
      button.addEventListener("click", logout);
    });

    const file = location.pathname.split("/").pop() || "index.html";

    host.querySelectorAll("a").forEach((a) => {
      a.classList.toggle(
        "active",
        a.getAttribute("href")?.split("#")[0] === file,
      );
    });
  }

  function jobCard(gig, actions = "student") {
    const owner = getUsers().find((u) => u.id === gig.ownerId);

    return `
      <article class="card card-hover job-card">
        <div class="job-top">
          <div class="company-logo">${initials(gig.company)}</div>
          <span class="status ${gig.status}">${esc(gig.status)}</span>
        </div>

        <h3>${esc(gig.title)}</h3>
        <div class="job-company">${esc(gig.company)}</div>

        <p class="muted" style="font-size:12px;margin-top:12px">
          ${esc(gig.description)}
        </p>

        <div class="tags">
          <span class="tag lime">${esc(gig.type)}</span>
          <span class="tag">${esc(gig.location)}</span>
          <span class="tag">${esc(gig.category)}</span>
        </div>

        <div class="job-bottom">
          <div>
            <strong>${esc(gig.salaryLabel)}</strong>
            <small>Deadline ${formatDate(gig.deadline)}</small>
          </div>

          ${
            actions === "student"
              ? `<a class="btn btn-outline btn-sm" href="gig-details.html?id=${gig.id}">View details</a>`
              : `
                <div class="table-actions">
                  <a class="btn btn-outline btn-sm" href="post-job.html?edit=${gig.id}">Edit</a>
                  <button class="btn btn-danger btn-sm" data-delete-gig="${gig.id}">Delete</button>
                </div>
              `
          }
        </div>
      </article>
    `;
  }

  function setMessage(form, text, type = "error") {
    let box = form.querySelector(".form-message");

    if (!box) {
      box = document.createElement("div");
      box.className = "form-message";
      form.prepend(box);
    }

    box.className = `form-message ${
      type === "error" ? "error-msg" : "success-msg"
    }`;

    box.textContent = text;
  }

  function home() {
    const user = current();

    document.querySelector("#homePrimary").href = user
      ? homeFor(user.role)
      : "signin.html";

    document.querySelector("#homePrimary").textContent = user
      ? "Open my dashboard"
      : "Create free account";

    document.querySelector("#featuredJobs").innerHTML = getGigs()
      .filter((g) => g.status === "active")
      .slice(0, 3)
      .map((g) => jobCard(g))
      .join("");
  }

  function login() {
    const existing = current();
    const params = new URLSearchParams(location.search);

    if (existing && !params.has("stay")) {
      location.replace(homeFor(existing.role));
      return;
    }

    const form = document.querySelector("#loginForm");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = form.email.value.trim().toLowerCase(),
        password = form.password.value;

      const user = getUsers().find(
        (u) => u.email.toLowerCase() === email && u.password === password,
      );

      if (!user)
        return setMessage(
          form,
          "Incorrect email or password. Use one of the demo accounts below.",
        );

      if (user.status !== "active")
        return setMessage(
          form,
          "This account is suspended. Contact an administrator.",
        );

      write(KEYS.session, { userId: user.id, createdAt: now() });
      activity(`${user.name} logged in`, user.id);

      const next = params.get("next");

      location.href =
        next && requiredPageAllowed(next, user.role)
          ? next
          : homeFor(user.role);
    });
  }

  function requiredPageAllowed(url, role) {
    const file = url.split("?")[0];

    const map = {
      student: [
        "find-gigs.html",
        "gig-details.html",
        "student-profile.html",
        "messages.html",
      ],
      employer: [
        "employer-profile.html",
        "post-job.html",
        "messages.html",
      ],
      admin: ["admin-dashboard.html"],
    };

    return map[role]?.includes(file);
  }

  function signin() {
    if (current()) {
      location.replace(homeFor(current().role));
      return;
    }

    const form = document.querySelector("#signupForm");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(form));

      if (!data.name?.trim())
        return setMessage(form, "Enter your full name.");

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || ""))
        return setMessage(form, "Enter a valid email address.");

      if (data.password.length < 8)
        return setMessage(
          form,
          "Password must contain at least 8 characters.",
        );

      if (data.password !== data.confirm)
        return setMessage(form, "Passwords do not match.");

      if (!["student", "employer"].includes(data.role))
        return setMessage(form, "Choose Student or Employer.");

      if (data.role === "employer" && !data.company?.trim())
        return setMessage(form, "Enter your company name.");

      const users = getUsers();

      if (
        users.some(
          (u) => u.email.toLowerCase() === data.email.trim().toLowerCase(),
        )
      )
        return setMessage(
          form,
          "An account with this email already exists.",
        );

      const user = {
        id: uid(data.role),
        role: data.role,
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        status: "active",
        createdAt: now(),
        profile:
          data.role === "employer"
            ? {
                company: data.company.trim(),
                description: "",
                contact: data.email.trim(),
                location: "",
                industry: "",
                logo: "",
              }
            : {
                degree: "",
                school: "",
                bio: "",
                skills: [],
                preferences: "",
                availability: "",
                location: "",
                photo: "",
              },
      };

      users.push(user);
      write(KEYS.users, users);
      write(KEYS.session, { userId: user.id, createdAt: now() });

      activity(`${user.name} registered as ${user.role}`, user.id);

      location.href = homeFor(user.role);
    });

    const roleInputs = form.querySelectorAll("[name=role]");
    const company = form.querySelector("#companyGroup");

    roleInputs.forEach((input) =>
      input.addEventListener("change", () => {
        company.hidden = input.value !== "employer" || !input.checked;
        form.company.required = !company.hidden;
      }),
    );
  }

  function findGigs() {
    const list = document.querySelector("#jobList"),
      form = document.querySelector("#filterForm");

    const render = () => {
      const data = Object.fromEntries(new FormData(form));

      let gigs = getGigs().filter((g) => g.status === "active");

      if (data.q) {
        const q = data.q.toLowerCase();

        gigs = gigs.filter((g) =>
          [g.title, g.company, g.description, g.category].some((x) =>
            x.toLowerCase().includes(q),
          ),
        );
      }

      if (data.category)
        gigs = gigs.filter((g) => g.category === data.category);

      if (data.location)
        gigs = gigs.filter((g) => g.location === data.location);

      if (data.type)
        gigs = gigs.filter((g) => g.type === data.type);

      if (data.min)
        gigs = gigs.filter((g) => g.salary >= Number(data.min));

      if (data.max)
        gigs = gigs.filter((g) => g.salary <= Number(data.max));

      document.querySelector("#resultCount").textContent =
        `${gigs.length} opportunities`;

      list.innerHTML = gigs.length
        ? gigs.map((g) => jobCard(g)).join("")
        : '<div class="card empty-state"><h3>No gigs match those filters</h3><p>Try clearing one or more filters.</p></div>';
    };

    form.addEventListener("submit", (event) => event.preventDefault());
    form.addEventListener("input", render);
    form.addEventListener("reset", () => setTimeout(render));

    const params = new URLSearchParams(location.search);

    if (params.get("q")) form.q.value = params.get("q");

    render();
  }

  function gigDetails() {
    const user = current(),
      id = new URLSearchParams(location.search).get("id"),
      gig = getGigs().find((g) => g.id === id && g.status === "active");

    if (!gig) {
      document.querySelector("#gigContent").innerHTML =
        '<div class="card empty-state"><h2>Gig unavailable</h2><p>This gig was removed or closed.</p><a class="btn" href="find-gigs.html">Browse active gigs</a></div>';
      return;
    }

    const existing = getApps().find(
      (a) => a.gigId === gig.id && a.studentId === user.id,
    );

    document.title = `${gig.title} — StudentGig`;

    document.querySelector("#gigContent").innerHTML =
      `<div class="page-head"><a class="muted" href="find-gigs.html">← Back to gigs</a><div class="tags"><span class="tag lime">${esc(gig.type)}</span><span class="tag">${esc(gig.location)}</span></div><h1>${esc(gig.title)}</h1><p>${esc(gig.company)} · ${esc(gig.category)}</p></div><div class="detail-layout"><article class="card detail-card"><h2>About this opportunity</h2><p class="muted">${esc(gig.description)}</p><h2>Responsibilities</h2><ul>${gig.responsibilities
        .split("\n")
        .map((x) => `<li>${esc(x)}</li>`)
        .join("")}</ul><h2>Qualifications</h2><ul>${gig.qualifications
        .split("\n")
        .map((x) => `<li>${esc(x)}</li>`)
        .join("")}</ul><h2>Schedule</h2><p class="muted">${esc(gig.schedule)}</p></article><aside class="card sticky-card"><div class="company-logo">${initials(gig.company)}</div><h3 style="margin-top:18px">${esc(gig.title)}</h3><p class="muted">${esc(gig.company)}</p><div class="apply-meta"><div class="meta-row"><span>Pay</span><strong>${esc(gig.salaryLabel)}</strong></div><div class="meta-row"><span>Location</span><strong>${esc(gig.location)}</strong></div><div class="meta-row"><span>Deadline</span><strong>${formatDate(gig.deadline)}</strong></div></div>${existing ? `<div class="notice">Application status: <strong>${esc(existing.status)}</strong></div>` : '<button class="btn btn-block" id="openApply">Apply now</button>'}</aside></div>`;

    if (!existing) {
      document
        .querySelector("#openApply")
        .addEventListener("click", () =>
          document.querySelector("#applyModal").classList.add("open"),
        );

      document
        .querySelector("#applicationForm")
        .addEventListener("submit", (e) => {
          e.preventDefault();

          const apps = getApps();

          if (
            apps.some(
              (a) => a.gigId === gig.id && a.studentId === user.id,
            )
          )
            return toast("You already applied to this gig.", "error");

          apps.push({
            id: uid("app"),
            gigId: gig.id,
            studentId: user.id,
            status: "pending",
            note: e.target.note.value.trim(),
            createdAt: now(),
          });

          write(KEYS.apps, apps);
          activity(`${user.name} applied for ${gig.title}`, user.id);

          document.querySelector("#applyModal").classList.remove("open");

          toast("Application submitted.");

          setTimeout(() => location.reload(), 500);
        });
    }

    document
      .querySelectorAll("[data-close-modal]")
      .forEach((x) =>
        x.addEventListener("click", () =>
          document.querySelector("#applyModal").classList.remove("open"),
        ),
      );
  }

  function studentDashboard() {
    const user = current(),
      profile = user.profile || {},
      apps = getApps().filter((a) => a.studentId === user.id),
      gigs = getGigs();

    document.querySelector("#studentName").textContent = user.name;

    document.querySelector("#studentSubtitle").textContent =
      profile.degree && profile.school
        ? `${profile.degree} · ${profile.school}`
        : "Complete your profile to stand out";

    document.querySelector("#studentPhoto").innerHTML = profile.photo
      ? `<img class="profile-photo round" src="${profile.photo}" alt="${esc(user.name)} profile picture">`
      : `<div class="profile-photo round">${initials(user.name)}</div>`;

    document.querySelector("#studentStats").innerHTML =
      `<div class="card stat-card"><span>Applications</span><strong>${apps.length}</strong></div><div class="card stat-card"><span>Pending</span><strong>${apps.filter((a) => a.status === "pending").length}</strong></div><div class="card stat-card"><span>Accepted</span><strong>${apps.filter((a) => a.status === "accepted").length}</strong></div>`;

    document.querySelector("#profileDetails").innerHTML =
      `<h3>About</h3><p class="muted">${esc(profile.bio || "Add a short biography to introduce yourself to employers.")}</p><h3>Skills</h3><div class="skill-list">${(profile.skills || []).length ? profile.skills.map((s) => `<span class="tag lime">${esc(s)}</span>`).join("") : '<span class="muted">No skills added yet.</span>'}</div><h3 style="margin-top:24px">Work preferences</h3><p class="muted">${esc(profile.preferences || "Not specified")}</p>`;

    document.querySelector("#availability").innerHTML =
      `<div class="meta-row"><span>Availability</span><strong>${esc(profile.availability || "Not specified")}</strong></div><div class="meta-row"><span>Location</span><strong>${esc(profile.location || "Not specified")}</strong></div>`;

    document.querySelector("#studentApplications").innerHTML = apps.length
      ? apps
          .map((a) => {
            const g = gigs.find((x) => x.id === a.gigId);

            return `<div class="job-posting-row"><div><strong>${esc(g?.title || "Removed gig")}</strong><div class="muted" style="font-size:12px">${esc(g?.company || "Unavailable")} · ${formatDate(a.createdAt)}</div></div><span class="status ${a.status}">${esc(a.status)}</span></div>`;
          })
          .join("")
      : '<div class="empty-state"><p>You have not applied to a gig yet.</p><a class="btn" href="find-gigs.html">Find your first gig</a></div>';

    const form = document.querySelector("#studentProfileForm");

    form.name.value = user.name;

    ["degree", "school", "bio", "preferences", "availability", "location"].forEach(
      (k) => (form[k].value = profile[k] || ""),
    );

    form.skills.value = (profile.skills || []).join(", ");

    document
      .querySelector("#editProfile")
      .addEventListener("click", () =>
        document.querySelector("#profileModal").classList.add("open"),
      );

    document
      .querySelectorAll("[data-close-modal]")
      .forEach((x) =>
        x.addEventListener("click", () =>
          document.querySelector("#profileModal").classList.remove("open"),
        ),
      );

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      updateUser(user.id, (u) => {
        u.name = form.name.value.trim();

        u.profile = {
          ...u.profile,
          degree: form.degree.value.trim(),
          school: form.school.value.trim(),
          bio: form.bio.value.trim(),
          skills: form.skills.value
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean),
          preferences: form.preferences.value.trim(),
          availability: form.availability.value.trim(),
          location: form.location.value.trim(),
        };

        return u;
      });

      activity(`${user.name} updated their student profile`, user.id);
      toast("Profile saved.");

      setTimeout(() => location.reload(), 400);
    });

    document
      .querySelector("#photoInput")
      .addEventListener("change", (e) => uploadPhoto(e, user, "photo"));
  }

  function updateUser(id, mutate) {
    const users = getUsers(),
      i = users.findIndex((u) => u.id === id);

    if (i < 0) return;

    users[i] = mutate(users[i]);
    write(KEYS.users, users);
  }

  function uploadPhoto(event, user, key) {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/") || file.size > 1500000)
      return toast("Choose an image smaller than 1.5 MB.", "error");

    const reader = new FileReader();

    reader.onload = () => {
      updateUser(user.id, (u) => {
        u.profile[key] = reader.result;
        return u;
      });

      activity(`${user.name} changed their profile image`, user.id);
      toast("Profile picture updated.");

      setTimeout(() => location.reload(), 400);
    };

    reader.readAsDataURL(file);
  }

  function employerDashboard() {
    const user = current(),
      p = user.profile || {},
      gigs = getGigs().filter((g) => g.ownerId === user.id),
      allApps = getApps(),
      users = getUsers(),
      ownIds = new Set(gigs.map((g) => g.id)),
      apps = allApps.filter((a) => ownIds.has(a.gigId));

    document.querySelector("#companyName").textContent = p.company || user.name;

    document.querySelector("#companySubtitle").textContent =
      p.industry || "Complete your company profile";

    document.querySelector("#companyLogo").innerHTML = p.logo
      ? `<img class="profile-photo" src="${p.logo}" alt="${esc(p.company)} logo">`
      : `<div class="profile-photo">${initials(p.company || user.name)}</div>`;

    document.querySelector("#employerStats").innerHTML =
      `<div class="card stat-card"><span>Own gigs</span><strong>${gigs.length}</strong></div><div class="card stat-card"><span>Active</span><strong>${gigs.filter((g) => g.status === "active").length}</strong></div><div class="card stat-card"><span>Applicants</span><strong>${apps.length}</strong></div>`;

    document.querySelector("#companyDetails").innerHTML =
      `<h3>About the company</h3><p class="muted">${esc(p.description || "Add a company description to help students understand your team.")}</p><div class="meta-row"><span>Contact</span><strong>${esc(p.contact || user.email)}</strong></div><div class="meta-row"><span>Location</span><strong>${esc(p.location || "Not specified")}</strong></div>`;

    document.querySelector("#employerGigs").innerHTML = gigs.length
      ? `<div class="job-list">${gigs.map((g) => jobCard(g, "employer")).join("")}</div>`
      : '<div class="empty-state"><p>No gigs posted yet.</p><a class="btn" href="post-job.html">Post your first gig</a></div>';

    document.querySelector("#employerApplicants").innerHTML = apps.length
      ? apps
          .map((a) => {
            const student = users.find((u) => u.id === a.studentId),
              gig = getGigs().find((g) => g.id === a.gigId);

            return `<div class="job-posting-row"><div><strong>${esc(student?.name || "Unknown student")}</strong><div class="muted" style="font-size:12px">${esc(gig?.title || "Removed gig")} · ${esc(a.note)}</div></div><div class="table-actions"><span class="status ${a.status}">${esc(a.status)}</span>${a.status === "pending" ? `<button class="btn btn-sm" data-app-status="accepted" data-app-id="${a.id}">Accept</button><button class="btn btn-danger btn-sm" data-app-status="rejected" data-app-id="${a.id}">Reject</button>` : ""}</div></div>`;
          })
          .join("")
      : '<div class="empty-state"><p>No applications for your gigs yet.</p></div>';

    document
      .querySelectorAll("[data-app-status]")
      .forEach((btn) =>
        btn.addEventListener("click", () =>
          setApplicationStatus(btn.dataset.appId, btn.dataset.appStatus, user),
        ),
      );

    document
      .querySelectorAll("[data-delete-gig]")
      .forEach((btn) =>
        btn.addEventListener("click", () => deleteOwnGig(btn.dataset.deleteGig, user)),
      );

    const form = document.querySelector("#employerProfileForm");

    form.name.value = user.name;

    ["company", "description", "contact", "location", "industry"].forEach(
      (k) => (form[k].value = p[k] || ""),
    );

    document
      .querySelector("#editProfile")
      .addEventListener("click", () =>
        document.querySelector("#profileModal").classList.add("open"),
      );

    document
      .querySelectorAll("[data-close-modal]")
      .forEach((x) =>
        x.addEventListener("click", () =>
          document.querySelector("#profileModal").classList.remove("open"),
        ),
      );

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      updateUser(user.id, (u) => {
        u.name = form.name.value.trim();

        ["company", "description", "contact", "location", "industry"].forEach(
          (k) => (u.profile[k] = form[k].value.trim()),
        );

        return u;
      });

      activity(`${p.company || user.name} updated its employer profile`, user.id);
      toast("Company profile saved.");

      setTimeout(() => location.reload(), 400);
    });

    document
      .querySelector("#logoInput")
      .addEventListener("change", (e) => uploadPhoto(e, user, "logo"));
  }

  function setApplicationStatus(appId, status, employer) {
    const apps = getApps(),
      app = apps.find((a) => a.id === appId),
      gig = app && getGigs().find((g) => g.id === app.gigId);

    if (!app || !gig || gig.ownerId !== employer.id)
      return toast("You can only review applications to your own gigs.", "error");

    app.status = status;
    write(KEYS.apps, apps);

    activity(
      `${employer.profile.company || employer.name} marked an application ${status}`,
      employer.id,
    );

    toast(`Application ${status}.`);

    setTimeout(() => location.reload(), 400);
  }

  function deleteOwnGig(id, employer) {
    const gigs = getGigs(),
      gig = gigs.find((g) => g.id === id);

    if (!gig || gig.ownerId !== employer.id)
      return toast("You can only delete your own gigs.", "error");

    if (!confirm(`Delete “${gig.title}”?`)) return;

    write(
      KEYS.gigs,
      gigs.filter((g) => g.id !== id),
    );

    write(
      KEYS.apps,
      getApps().filter((a) => a.gigId !== id),
    );

    activity(`${employer.profile.company || employer.name} deleted ${gig.title}`, employer.id);
    toast("Gig deleted.");

    setTimeout(() => location.reload(), 400);
  }

  function postJob() {
    const user = current(),
      form = document.querySelector("#gigForm"),
      editId = new URLSearchParams(location.search).get("edit"),
      existing = editId ? getGigs().find((g) => g.id === editId) : null;

    if (editId && (!existing || existing.ownerId !== user.id)) {
      toast("You can only edit your own gigs.", "error");
      setTimeout(() => location.replace("employer-profile.html"), 600);
      return;
    }

    if (existing) {
      document.querySelector("#formTitle").textContent = "Edit your gig";

      Object.keys(existing).forEach((k) => {
        if (form.elements[k]) form.elements[k].value = existing[k];
      });

      form.salary.value = existing.salary;
      document.querySelector("#publishButton").textContent = "Save changes";
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(form)),
        gigs = getGigs(),
        profile = user.profile || {};

      if (existing) {
        const index = gigs.findIndex((g) => g.id === existing.id);

        if (index < 0 || gigs[index].ownerId !== user.id)
          return toast("Unauthorized change blocked.", "error");

        gigs[index] = {
          ...gigs[index],
          ...data,
          salary: Number(data.salary),
          salaryLabel: data.salaryLabel.trim(),
        };

        activity(`${profile.company || user.name} updated ${data.title}`, user.id);
      } else {
        gigs.unshift({
          id: uid("gig"),
          ownerId: user.id,
          company: profile.company || user.name,
          ...data,
          salary: Number(data.salary),
          status: "active",
          createdAt: now(),
        });

        activity(`${profile.company || user.name} published ${data.title}`, user.id);
      }

      write(KEYS.gigs, gigs);
      toast(existing ? "Gig updated." : "Gig published.");

      setTimeout(() => (location.href = "employer-profile.html"), 600);
    });
  }

  function messages() {
    const me = current(),
      users = getUsers(),
      gigs = getGigs(),
      apps = getApps();

    let contactIds = [];

    if (me.role === "student")
      contactIds = apps
        .filter((a) => a.studentId === me.id)
        .map((a) => gigs.find((g) => g.id === a.gigId)?.ownerId)
        .filter(Boolean);
    else {
      const own = new Set(
        gigs.filter((g) => g.ownerId === me.id).map((g) => g.id),
      );

      contactIds = apps
        .filter((a) => own.has(a.gigId))
        .map((a) => a.studentId);
    }

    contactIds = [...new Set(contactIds)];

    const contacts = contactIds
      .map((id) => users.find((u) => u.id === id && u.status === "active"))
      .filter(Boolean);

    const list = document.querySelector("#conversationList"),
      history = document.querySelector("#messageHistory"),
      form = document.querySelector("#messageForm");

    let active = contacts[0]?.id || null;

    function renderContacts() {
      list.innerHTML = contacts.length
        ? contacts
            .map(
              (c) =>
                `<button class="conversation ${c.id === active ? "active" : ""}" data-contact="${c.id}"><span class="avatar sm">${initials(c.profile?.company || c.name)}</span><span class="conversation-copy"><strong>${esc(c.profile?.company || c.name)}</strong><p>${esc(c.role)}</p></span></button>`,
            )
            .join("")
        : '<div class="empty-state"><p>Contacts appear after a student applies to a gig.</p></div>';

      list.querySelectorAll("[data-contact]").forEach((b) =>
        b.addEventListener("click", () => {
          active = b.dataset.contact;
          render();
        }),
      );
    }

    function render() {
      renderContacts();

      const contact = users.find((u) => u.id === active);

      if (!contact) {
        history.innerHTML =
          '<div class="chat-empty"><div><h3>No conversations yet</h3><p>Apply to a gig or wait for an applicant to start messaging.</p></div></div>';

        form.hidden = true;
        document.querySelector("#chatPerson").textContent = "Messages";
        return;
      }

      form.hidden = false;

      document.querySelector("#chatPerson").textContent =
        contact.profile?.company || contact.name;

      const rows = getMessages()
        .filter(
          (m) =>
            (m.fromId === me.id && m.toId === active) ||
            (m.fromId === active && m.toId === me.id),
        )
        .sort((a, b) => new Date(a.time) - new Date(b.time));

      history.innerHTML = rows.length
        ? rows
            .map(
              (m) =>
                `<div class="bubble ${m.fromId === me.id ? "me" : ""}">${esc(m.text)}<time>${new Date(m.time).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</time></div>`,
            )
            .join("")
        : '<div class="chat-empty"><p>Start the conversation with a clear, professional message.</p></div>';

      history.scrollTop = history.scrollHeight;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!active || !form.text.value.trim()) return;

      const rows = getMessages();

      rows.push({
        id: uid("msg"),
        fromId: me.id,
        toId: active,
        text: form.text.value.trim(),
        time: now(),
        read: false,
      });

      write(KEYS.messages, rows);
      activity(`${me.name} sent a message`, me.id);

      form.reset();
      render();
    });

    render();
  }

  function admin() {
    const users = getUsers(),
      gigs = getGigs(),
      apps = getApps(),
      activities = read(KEYS.activity);

    document.querySelector("#adminStats").innerHTML =
      `<div class="card stat-card"><span>Registered students</span><strong>${users.filter((u) => u.role === "student").length}</strong></div><div class="card stat-card"><span>Registered employers</span><strong>${users.filter((u) => u.role === "employer").length}</strong></div><div class="card stat-card"><span>Active gigs</span><strong>${gigs.filter((g) => g.status === "active").length}</strong></div><div class="card stat-card"><span>Total applications</span><strong>${apps.length}</strong></div>`;

    const userRows = (role) =>
      users
        .filter((u) => u.role === role)
        .map(
          (u) =>
            `<tr><td><strong>${esc(u.name)}</strong><br><span class="muted">${esc(u.email)}</span></td><td>${formatDate(u.createdAt)}</td><td><span class="status ${u.status}">${u.status}</span></td><td><button class="btn ${u.status === "active" ? "btn-danger" : "btn-outline"} btn-sm" data-toggle-user="${u.id}">${u.status === "active" ? "Suspend" : "Activate"}</button></td></tr>`,
        )
        .join("");

    document.querySelector("#studentRows").innerHTML = userRows("student");
    document.querySelector("#employerRows").innerHTML = userRows("employer");

    document.querySelector("#gigRows").innerHTML = gigs
      .map(
        (g) =>
          `<tr><td><strong>${esc(g.title)}</strong><br><span class="muted">${esc(g.company)}</span></td><td>${esc(g.type)}</td><td><span class="status ${g.status}">${g.status}</span></td><td class="table-actions"><button class="btn btn-outline btn-sm" data-toggle-gig="${g.id}">${g.status === "active" ? "Close" : "Activate"}</button><button class="btn btn-danger btn-sm" data-admin-delete-gig="${g.id}">Delete</button></td></tr>`,
      )
      .join("");

    document.querySelector("#applicationRows").innerHTML = apps
      .map((a) => {
        const g = gigs.find((x) => x.id === a.gigId),
          s = users.find((x) => x.id === a.studentId);

        return `<tr><td>${esc(s?.name || "Unknown")}</td><td>${esc(g?.title || "Removed")}</td><td>${esc(g?.company || "Unavailable")}</td><td><span class="status ${a.status}">${a.status}</span></td></tr>`;
      })
      .join("");

    document.querySelector("#activityList").innerHTML = activities
      .map(
        (a) =>
          `<div class="activity-item"><strong>${esc(a.text)}</strong><p>${formatDate(a.time)} · ${new Date(a.time).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</p></div>`,
      )
      .join("");

    document.querySelectorAll("[data-toggle-user]").forEach((b) =>
      b.addEventListener("click", () => {
        updateUser(b.dataset.toggleUser, (u) => {
          u.status = u.status === "active" ? "suspended" : "active";
          return u;
        });

        activity("Administrator changed an account status");
        location.reload();
      }),
    );

    document.querySelectorAll("[data-toggle-gig]").forEach((b) =>
      b.addEventListener("click", () => {
        const rows = getGigs(),
          g = rows.find((x) => x.id === b.dataset.toggleGig);

        g.status = g.status === "active" ? "closed" : "active";

        write(KEYS.gigs, rows);
        activity(`Administrator marked ${g.title} ${g.status}`);

        location.reload();
      }),
    );

    document.querySelectorAll("[data-admin-delete-gig]").forEach((b) =>
      b.addEventListener("click", () => {
        if (!confirm("Delete this gig and its applications?")) return;

        write(
          KEYS.gigs,
          gigs.filter((g) => g.id !== b.dataset.adminDeleteGig),
        );

        write(
          KEYS.apps,
          apps.filter((a) => a.gigId !== b.dataset.adminDeleteGig),
        );

        activity("Administrator deleted a gig");
        location.reload();
      }),
    );

    document.querySelectorAll(".tab-btn").forEach((btn) =>
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach((x) =>
          x.classList.remove("active"),
        );

        document.querySelectorAll(".tab-panel").forEach((x) =>
          x.classList.remove("active"),
        );

        btn.classList.add("active");
        document.querySelector(`#${btn.dataset.tab}`).classList.add("active");
      }),
    );

    document.querySelector("#adminSearch").addEventListener("input", (e) => {
      document
        .querySelectorAll(".tab-panel.active tbody tr")
        .forEach(
          (row) =>
            (row.hidden = !row.textContent
              .toLowerCase()
              .includes(e.target.value.toLowerCase())),
        );
    });
  }

  function init() {
    seed();

    const user = guard();

    if (requiredRole !== "public" && !user) return;

    nav();

    document.querySelectorAll("[data-logout]").forEach((button) => {
      button.addEventListener("click", logout);
    });

    document
      .querySelectorAll("[data-year]")
      .forEach((x) => (x.textContent = new Date().getFullYear()));

    const controllers = {
      home,
      login,
      signin,
      "find-gigs": findGigs,
      "gig-details": gigDetails,
      "student-profile": studentDashboard,
      "employer-profile": employerDashboard,
      "post-job": postJob,
      messages,
      admin,
    };

    controllers[page]?.();
  }

  return { init, toast };
})();

document.addEventListener("DOMContentLoaded", StudentGig.init);
