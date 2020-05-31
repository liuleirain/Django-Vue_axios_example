function sendRequest(url, method, data) {
  var r = axios({
    method: method,
    url: url,
    data: data,
    xsrfCookieName: "csrftoken",
    xsrfHeaderName: "X-CSRFToken",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
  });
  return r;
}

var app = new Vue({
  el: "#app",
  data: {
    task: "",
    tasks: [],
  },
  created() {
    var r = sendRequest("", "get").then((res) => (this.tasks = res.data.tasks));
  },
  computed: {
    taskList() {
      function compare(a, b) {
        if (a.completed > b.completed) {
          return 1;
        } else if (a.completed < b.completed) {
          return -1;
        }
        return 0;
      }
      return this.tasks.sort(compare);
    },
  },
  methods: {
    createTask() {
      var formData = new FormData();
      formData.append("title", this.task);
      // console.log(formData);

      sendRequest("", "post", formData).then((res) =>
        this.tasks.push(res.data.task)
      );
      this.task = "";
    },
    completeTask(id, index) {
      sendRequest("" + id + "/complete/", "post").then((res) => {
        this.tasks.splice(index, 1);
        this.tasks.push(res.data.task);
        console.log(res.data);
      });
    },
    deleteTask(id, index) {
      sendRequest("" + id + "/delete/", "post").then((res) =>
        this.tasks.splice(index, 1)
      );
    },
  },
});
