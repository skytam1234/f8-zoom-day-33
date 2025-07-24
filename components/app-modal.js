import * as DAO from "../httpRequest/httpRequest.js";
class AppModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.data = null;
    this.oldTask = null;
  }
  connected() {
    const template = document.querySelector(`#app-modal-tpl`);
    const appModalNode = template.content.cloneNode(true);
    this.shadowRoot.appendChild(appModalNode);
    this.modal = this.shadowRoot.querySelector(`.modal`);
    this.modalApp = this.shadowRoot.querySelector(`#addTaskModal`);
    this.form = this.shadowRoot.querySelector(`.todo-app-form`);
    this.taskTitle = this.shadowRoot.querySelector(`#taskTitle`);
    this.taskDescription = this.shadowRoot.querySelector(`#taskDescription`);
    this.taskCategory = this.shadowRoot.querySelector(`#taskCategory`);
    this.taskPriority = this.shadowRoot.querySelector(`#taskPriority`);
    this.startTime = this.shadowRoot.querySelector(`#startTime`);
    this.endTime = this.shadowRoot.querySelector(`#endTime`);
    this.taskDate = this.shadowRoot.querySelector(`#taskDate`);
    this.taskColor = this.shadowRoot.querySelector(`#taskColor`);
    this.shadowRoot.addEventListener("click", (e) => {
      const modalContainer = this.shadowRoot.querySelector(`#addTaskModal`);
      if (!modalContainer.classList.contains("show")) {
        return;
      }
      e.stopPropagation();
      const cancelBtn = e.target.closest(`.btn-cancel`);
      const modal = this.shadowRoot.querySelector(`.modal`);
      const isOverlay = modal && !modal.contains(e.target);
      const form = this.shadowRoot.querySelector(`.todo-app-form`);
      const modalClose = e.target.closest(`.modal-close`);
      const confirmBtn = e.target.closest(`.btn-submit`);
      if (cancelBtn || modalClose || isOverlay) {
        if (confirm("Bạn chắc chắn muốn tắt  form?")) {
          this.data = null;
          this.close();
        }
      }
      if (confirmBtn) {
        this.close();
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === `Escape`) {
        if (confirm("Bạn chắc chắn muốn tắt  form?")) {
          this.close();
        }
      }
    });
  }

  open() {
    this.form.reset();
    this.modal.scrollTop = 0;
    this.modalApp.style.transition = `all 0.3s ease`;
    this.modalApp.classList.add(`show`);
    setTimeout(() => {
      this.taskTitle.focus();
    }, 100);
    this.data = `add`;
    this.dispatchEvent(new CustomEvent("open"));
  }
  edit(oldTask) {
    this.oldTask = oldTask;
    this.modalApp.style.transition = `all 0.3s ease`;
    this.modalApp.classList.add(`show`);
    this.data = "edit";
    this.taskTitle.value = this.oldTask.title;
    this.taskDescription.value = this.oldTask.description;
    this.taskCategory.value = this.oldTask.category;
    this.taskPriority.value = this.oldTask.priority;
    this.startTime.value = this.oldTask.startTime;
    this.endTime.value = this.oldTask.endTime;
    this.taskDate.value = this.oldTask.dueDate;
    this.taskColor.value = this.oldTask.color;
  }
  async close() {
    if (this.data === "add") {
      const newTask = await Object.fromEntries(new FormData(this.form));
      console.log(newTask);
      await DAO.createTask(newTask);
    }
    if (this.data === "edit") {
      const newTask = await Object.fromEntries(new FormData(this.form));
      const task = await DAO.editTask(this.oldTask.id, newTask);
    }
    await this.dispatchEvent(new CustomEvent("close", { detail: this.data }));
    await this.shadowRoot
      .querySelector(`#addTaskModal`)
      .classList.remove(`show`);
    setTimeout(() => {
      this.shadowRoot.innerHTML = "";
    }, 300);
  }
}
customElements.define(`app-modal`, AppModal);
