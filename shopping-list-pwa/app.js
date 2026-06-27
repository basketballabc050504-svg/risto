const STORAGE_KEY = "couple-shopping-list:v1";

const addForm = document.querySelector("#addForm");
const itemInput = document.querySelector("#itemInput");
const plannedList = document.querySelector("#plannedList");
const purchasedList = document.querySelector("#purchasedList");
const plannedEmpty = document.querySelector("#plannedEmpty");
const purchasedEmpty = document.querySelector("#purchasedEmpty");
const activeCount = document.querySelector("#activeCount");
const plannedCount = document.querySelector("#plannedCount");
const purchasedCount = document.querySelector("#purchasedCount");
const itemTemplate = document.querySelector("#itemTemplate");

let items = loadItems();

const storage = {
  list() {
    return loadItems();
  },
  save(nextItems) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
  },
};

function loadItems() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist() {
  items.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  storage.save(items);
}

function createItem(name) {
  const now = new Date().toISOString();
  const id = globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;
  return {
    id,
    name,
    purchased: false,
    createdAt: now,
    updatedAt: now,
  };
}

function render() {
  plannedList.textContent = "";
  purchasedList.textContent = "";

  const planned = items.filter((item) => !item.purchased);
  const purchased = items.filter((item) => item.purchased);

  for (const item of planned) {
    plannedList.append(renderItem(item));
  }

  for (const item of purchased) {
    purchasedList.append(renderItem(item));
  }

  activeCount.textContent = String(planned.length);
  plannedCount.textContent = `${planned.length}件`;
  purchasedCount.textContent = `${purchased.length}件`;
  plannedEmpty.classList.toggle("visible", planned.length === 0);
  purchasedEmpty.classList.toggle("visible", purchased.length === 0);
}

function renderItem(item) {
  const row = itemTemplate.content.firstElementChild.cloneNode(true);
  const checkbox = row.querySelector(".purchase-check");
  const editForm = row.querySelector(".edit-form");
  const nameInput = row.querySelector(".name-input");
  const deleteButton = row.querySelector(".delete-button");

  row.dataset.id = item.id;
  checkbox.checked = item.purchased;
  nameInput.value = item.name;

  checkbox.addEventListener("change", () => {
    updateItem(item.id, { purchased: checkbox.checked });
  });

  editForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const nextName = nameInput.value.trim();
    if (!nextName) {
      nameInput.value = item.name;
      return;
    }
    updateItem(item.id, { name: nextName });
    nameInput.blur();
  });

  nameInput.addEventListener("blur", () => {
    const nextName = nameInput.value.trim();
    if (!nextName) {
      nameInput.value = item.name;
      return;
    }
    if (nextName !== item.name) {
      updateItem(item.id, { name: nextName });
    }
  });

  deleteButton.addEventListener("click", () => {
    const confirmed = window.confirm(`「${item.name}」を削除しますか？`);
    if (!confirmed) {
      return;
    }
    items = items.filter((candidate) => candidate.id !== item.id);
    persist();
    render();
  });

  return row;
}

function updateItem(id, patch) {
  items = items.map((item) => {
    if (item.id !== id) {
      return item;
    }
    return {
      ...item,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
  });
  persist();
  render();
}

addForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = itemInput.value.trim();
  if (!name) {
    itemInput.focus();
    return;
  }

  items = [...items, createItem(name)];
  persist();
  itemInput.value = "";
  itemInput.focus();
  render();
});

window.addEventListener("storage", (event) => {
  if (event.key !== STORAGE_KEY) {
    return;
  }
  items = storage.list();
  render();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}

render();
