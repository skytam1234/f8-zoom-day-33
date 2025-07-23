import * as DAO from "../httpRequest/httpRequest.js";
class AppModal extends HTMLElement {
  isInsert = true;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    const template = document.querySelector(`#app-modal-tpl`);
    const appModalNode = template.content.cloneNode(true);
    this.shadowRoot.appendChild(appModalNode);
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
      if (cancelBtn || modalClose || isOverlay) {
        if (confirm("Bạn chắc chắn muốn tắt  form?")) {
          this.close();
        }
      }
    });
    this.shadowRoot.addEventListener("keydown", (e) => {
      if (e.key === `Escape`) {
        if (confirm("Bạn chắc chắn muốn tắt  form?")) {
          this.close();
        }
      }
    });
  }
  open() {
    this.isInsert = true;
    const modal = this.shadowRoot.querySelector(`.modal`);
    const taskTitle = this.shadowRoot.querySelector(`#taskTitle`);
    const modalApp = this.shadowRoot.querySelector(`#addTaskModal`);
    const form = this.shadowRoot.querySelector(`.todo-app-form`);
    form.reset();
    modal.scrollTop = 0;
    modalApp.classList.add(`show`);
    setTimeout(() => {
      taskTitle.focus();
    }, 100);
    const confirmBtn = this.shadowRoot.querySelector(`.btn-submit`);
    confirmBtn.onclick = () => {
      const newTask = Object.fromEntries(new FormData(form));
      DAO.createTask(newTask);
      this.close();
    };
    this.dispatchEvent(new CustomEvent("open"));
  }
  edit(oldTask) {
    this.isInsert = false;
    const modal = this.shadowRoot.querySelector(`.modal`);
    const modalApp = this.shadowRoot.querySelector(`#addTaskModal`);
    const form = this.shadowRoot.querySelector(`.todo-app-form`);
    const taskTitle = this.shadowRoot.querySelector(`#taskTitle`);
    const taskDescription = this.shadowRoot.querySelector(`#taskDescription`);
    const taskCategory = this.shadowRoot.querySelector(`#taskCategory`);
    const taskPriority = this.shadowRoot.querySelector(`#taskPriority`);
    const startTime = this.shadowRoot.querySelector(`#startTime`);
    const endTime = this.shadowRoot.querySelector(`#endTime`);
    const taskDate = this.shadowRoot.querySelector(`#taskDate`);
    const taskColor = this.shadowRoot.querySelector(`#taskColor`);
    taskTitle.value = oldTask.title;
    taskDescription.value = oldTask.description;
    taskCategory.value = oldTask.category;
    taskPriority.value = oldTask.priority;
    startTime.value = oldTask.startTime;
    endTime.value = oldTask.endTime;
    taskDate.value = oldTask.dueDate;
    taskColor.value = oldTask.color;
    modalApp.classList.add(`show`);
    const confirmBtn = this.shadowRoot.querySelector(`.btn-submit`);
    confirmBtn.onclick = () => {
      const newTask = Object.fromEntries(new FormData(form));
      DAO.editTask(oldTask.id, newTask);
      this.close();
    };
  }
  close() {
    this.shadowRoot.querySelector(`#addTaskModal`).classList.remove(`show`);
    this.dispatchEvent(new CustomEvent("close"));
  }
}
customElements.define(`app-modal`, AppModal);
