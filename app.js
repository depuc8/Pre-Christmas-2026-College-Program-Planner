import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-database.js";

(function () {
  "use strict";

  const data = window.PRE_CHRISTMAS_DATA;
  if (!data) return;

  const $ = (selector) => document.querySelector(selector);
  const completed = Object.create(null);
  let activeFilter = "all";
  let sharedReady = false;
  let database = null;
  let checklistRef = null;

  function setSyncStatus(message, state = "loading") {
    const status = $("#sync-status");
    if (status) {
      status.textContent = message;
      status.dataset.state = state;
    }
    const resetButton = $("#reset-progress");
    if (resetButton) resetButton.disabled = !sharedReady;
  }

  function updateProgress() {
    const total = data.tasks.length;
    const done = data.tasks.filter((task) => Boolean(completed[task.id])).length;
    const remaining = total - done;
    const percentage = total ? Math.round((done / total) * 100) : 0;
    $("#progress-label").textContent = percentage + "%";
    $("#progress-fill").style.width = percentage + "%";
    $("#progress-bar").setAttribute("aria-valuenow", String(percentage));
    $("#completed-count").textContent = done + " completed";
    $("#remaining-count").textContent = remaining + " remaining";
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>\"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
    })[character]);
  }

  function formatINR(value) {
    return "₹" + Number(value || 0).toLocaleString("en-IN");
  }

  function phoneHref(contact) {
    const digits = String(contact || "").replace(/[^\d+]/g, "");
    return digits ? "tel:" + digits : "";
  }

  function vendorFor(id) {
    return (data.vendors || []).find((vendor) => vendor.id === id);
  }

  function renderChecklist() {
    const query = $("#task-search").value.trim().toLowerCase();
    const filtered = data.tasks.filter((task) => {
      const isDone = Boolean(completed[task.id]);
      const matchesFilter = activeFilter === "all" || (activeFilter === "done" && isDone) || (activeFilter === "pending" && !isDone);
      const vendor = vendorFor(task.vendorId);
      const searchText = [task.title, task.category, task.detail, vendor?.name, vendor?.item].join(" ").toLowerCase();
      return matchesFilter && searchText.includes(query);
    });

    const groups = [];
    filtered.forEach((task) => {
      let group = groups.find((entry) => entry.category === task.category);
      if (!group) {
        group = { category: task.category, tasks: [] };
        groups.push(group);
      }
      group.tasks.push(task);
    });

    if (!groups.length) {
      $("#checklist-list").innerHTML = '<div class="empty-state">No tasks match this view. Try another filter or search term.</div>';
      return;
    }

    $("#checklist-list").innerHTML = groups.map((group) => {
      const doneInGroup = group.tasks.filter((task) => completed[task.id]).length;
      const rows = group.tasks.map((task) => {
        const isDone = Boolean(completed[task.id]);
        const vendor = vendorFor(task.vendorId);
        const vendorLabel = vendor ? ` · <a class="task-vendor-link" href="#" data-vendor-tab="true">${escapeHtml(vendor.name)}</a>` : "";
        return `<li class="task-item${isDone ? " is-done" : ""}">
          <input class="task-check" type="checkbox" id="task-${escapeHtml(task.id)}" data-task-id="${escapeHtml(task.id)}" ${isDone ? "checked" : ""} ${sharedReady ? "" : "disabled"} aria-label="Mark ${escapeHtml(task.title)} as ${isDone ? "not completed" : "completed"}">
          <div class="task-main"><label class="task-title" for="task-${escapeHtml(task.id)}">${escapeHtml(task.title)}</label><div class="task-detail">${escapeHtml(task.detail)}${vendorLabel}</div></div>
        </li>`;
      }).join("");
      return `<section class="task-group"><div class="group-heading"><h3>${escapeHtml(group.category)}</h3><span class="group-count">${doneInGroup}/${group.tasks.length} done</span></div><ul class="task-list">${rows}</ul></section>`;
    }).join("");
  }

  function renderVendors() {
    const query = $("#vendor-search").value.trim().toLowerCase();
    const vendors = (data.vendors || []).filter((vendor) => [vendor.category, vendor.item, vendor.name, vendor.contact, vendor.note].join(" ").toLowerCase().includes(query));
    $("#vendor-count").textContent = (data.vendors || []).length + ((data.vendors || []).length === 1 ? " contact" : " contacts");

    if (!vendors.length) {
      $("#vendor-list").innerHTML = '<div class="empty-state">No vendor matches that search.</div>';
      return;
    }

    $("#vendor-list").innerHTML = vendors.map((vendor) => {
      const href = phoneHref(vendor.contact);
      const contactMarkup = href
        ? `<a class="vendor-phone" href="${escapeHtml(href)}">${escapeHtml(vendor.contact)} ↗</a>`
        : '<span class="no-phone">No phone number listed</span>';
      return `<article class="vendor-card"><div class="vendor-topline"><span class="vendor-category">${escapeHtml(vendor.category)}</span></div><div class="vendor-item">${escapeHtml(vendor.item)}</div><div class="vendor-name">${escapeHtml(vendor.name)}</div>${vendor.note ? `<div class="vendor-note">${escapeHtml(vendor.note)}</div>` : ""}<div class="vendor-contact-row">${contactMarkup}<span class="contact-label">${href ? "CALL" : "LOCAL"}</span></div></article>`;
    }).join("");
  }

  function renderExpenses() {
    const expenses = data.expenses2025 || [];
    const total = expenses.reduce((sum, row) => sum + Number(row.amount || 0), 0);
    $("#expense-total").textContent = formatINR(total);
    $("#expense-total-table").textContent = formatINR(total);
    $("#expense-rows").innerHTML = expenses.map((row, index) => `<tr><td>${index + 1}</td><td>${escapeHtml(row.item)}</td><td class="amount-col">${formatINR(row.amount)}</td></tr>`).join("");
  }

  function switchTab(tabName) {
    document.querySelectorAll(".tab-button").forEach((button) => {
      const isActive = button.dataset.tab === tabName;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });
    document.querySelectorAll(".tab-panel").forEach((panel) => {
      panel.hidden = panel.id !== "panel-" + tabName;
    });
  }

  async function startSharedSync() {
    const config = window.PRE_CHRISTMAS_FIREBASE_CONFIG;
    const requiredFields = ["apiKey", "authDomain", "databaseURL", "projectId", "appId"];
    const configIsReady = config && requiredFields.every((field) => {
      const value = config[field];
      return typeof value === "string" && value.trim() !== "" && !value.includes("YOUR_");
    });

    if (!configIsReady) {
      setSyncStatus("Shared sync is not configured yet. Complete the Firebase setup and add your web config in firebase-config.js.", "error");
      renderChecklist();
      return;
    }

    try {
      const firebaseApp = initializeApp(config);
      const auth = getAuth(firebaseApp);
      database = getDatabase(firebaseApp);
      checklistRef = ref(database, "preChristmas2026/checklist");
      setSyncStatus("Connecting to the shared checklist…", "loading");

      await signInAnonymously(auth);

      onValue(checklistRef, (snapshot) => {
        const cloudProgress = snapshot.val() || {};
        Object.keys(completed).forEach((key) => delete completed[key]);
        Object.entries(cloudProgress).forEach(([taskId, value]) => {
          if (typeof value === "boolean") completed[taskId] = value;
        });
        sharedReady = true;
        setSyncStatus("Live sync connected — checklist updates are shared with everyone.", "success");
        updateProgress();
        renderChecklist();
      }, (error) => {
        sharedReady = false;
        setSyncStatus("Could not read shared progress: " + error.message, "error");
        updateProgress();
        renderChecklist();
      });
    } catch (error) {
      sharedReady = false;
      setSyncStatus("Shared sync could not connect: " + error.message + ". Check your Firebase setup and database rules.", "error");
      updateProgress();
      renderChecklist();
    }
  }

  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
  });

  document.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      document.querySelectorAll(".filter-button").forEach((filterButton) => {
        const isActive = filterButton === button;
        filterButton.classList.toggle("active", isActive);
        filterButton.setAttribute("aria-pressed", String(isActive));
      });
      renderChecklist();
    });
  });

  $("#task-search").addEventListener("input", renderChecklist);
  $("#vendor-search").addEventListener("input", renderVendors);

  $("#checklist-list").addEventListener("change", async (event) => {
    const checkbox = event.target.closest("[data-task-id]");
    if (!checkbox || !sharedReady || !database) return;

    const taskId = checkbox.dataset.taskId;
    const nextValue = checkbox.checked;
    try {
      await set(ref(database, "preChristmas2026/checklist/" + taskId), nextValue);
      setSyncStatus("Saved — everyone viewing the page will see this update.", "success");
    } catch (error) {
      setSyncStatus("Could not save this change: " + error.message, "error");
    }
  });

  $("#checklist-list").addEventListener("click", (event) => {
    if (event.target.closest("[data-vendor-tab]")) {
      event.preventDefault();
      switchTab("vendors");
      $("#vendor-search").value = "";
      renderVendors();
    }
  });

  $("#reset-progress").addEventListener("click", async () => {
    if (!sharedReady || !checklistRef) return;
    if (!window.confirm("Reset the SHARED checklist for everyone? This will untick every task for all users.")) return;

    try {
      await Promise.all(data.tasks.map((task) =>
        set(ref(database, "preChristmas2026/checklist/" + task.id), false)
      ));
      setSyncStatus("Shared checklist reset for everyone.", "success");
    } catch (error) {
      setSyncStatus("Could not reset shared progress: " + error.message, "error");
    }
  });

  updateProgress();
  renderChecklist();
  renderVendors();
  renderExpenses();
  setSyncStatus("Connecting to the shared checklist…", "loading");
  startSharedSync();
})();
