import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

createApp({
  data() {
    return {
      url: "https://vue3-course-api.hexschool.io/v2",
      user: {
        // 驗證用資料
        username: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      // login API method
      axios
        .post(`${this.url}/admin/signin`, this.user)
        // 成功
        .then((res) => {
          // 解構取得參數
          const { expired, token } = res.data;
          console.log(expired, token);
          // 將Token存到cookie（避免跨網域CORS問題）
          document.cookie = `hexVueToken=${token}; expires=${new Date(
            expired
          )};`;
          // 轉到商品頁
          window.location = "products.html";
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
    },
  },
}).mount("#app");