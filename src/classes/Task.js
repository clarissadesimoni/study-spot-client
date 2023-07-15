class Task {
    constructor(isTodoist, id, title, projectId, labels, isCompleted, duration=null, due_obj=null, due_dict=null) {
        this.isTodoist = isTodoist;
        this.id = id;
        this.name = title;
        this.projectId = projectId;
        this.labels = labels;
        this.isCompleted = isCompleted;
        this.duration = duration;
        this.due = !due_obj && !due_dict ? null : due_obj ?? new Date(Date.parse(due_dict.datetime ?? due_dict.date));
        this.isAllDay = due_dict && !due_dict.datetime
    }

    isBefore = function (other) {
        return this.due <= other.due;
    }
}

export default Task;