import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

let productModal = null;
let delProductModal = null;

const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'vuejs',
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      pagination: {},
      isNew: false
    }
  },
  methods:{
    checkAdmin() {
      const url = `${this.apiUrl}/api/user/check`;
      axios.post(url)
        .then(() => {
          // 確認登入成功，並且撈資料
          this.getData();
        })
        .catch((err) => {
          alert(err.response.data.message)
          window.location = 'login.html';
        })
    },
    getData(page = 1) {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`;

      axios.get(url)
        .then((response) => {
          const { products, pagination } = response.data;
          // 將遠端資料存到data去
          this.products = products;
          this.pagination = pagination;
        }).catch((err) => {
          alert(err.response.data.message);
          window.location = 'login.html';
        })
    },
    openModal(isNew, item) {
      if (isNew === 'new') { // 新資料
        // temp 清空
        this.tempProduct = {
          imagesUrl: [],
        };
        // 開啟 productModal
        this.isNew = true;
        productModal.show();
      } else if (isNew === 'edit') { // 編輯
        // 將要編輯的那項資料淺層拷貝給 temp
        this.tempProduct = { ...item };
        // 開啟 productModal
        this.isNew = false;
        productModal.show();
      } else if (isNew === 'delete') { // 刪除
        // 將要刪除的那項資料淺層拷貝給 temp
        this.tempProduct = { ...item };
        // 開啟 delProductModal
        delProductModal.show()
      }
    },
  },
  mounted() {
    // 取出 Token，並且自動加到 hearders
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexVueToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;

    // 確認登入，並且將資料透過api存到products
    this.checkAdmin();
  }
});

// 分頁元件
app.component('pagination', {
  template: '#pagination',
  props: ['pages'],
  methods: {
    emitPages(item) {
      this.$emit('emit-pages', item);
    },
  },
});

// 產品新增/編輯元件
app.component('productModal', {
  template: '#productModal',
  props: ['product', 'isNew'],
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'vuejs',
    };
  },
  mounted() {
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false,
      backdrop: 'static'
    });
  },
  methods: {
    updateProduct() {
      // 新增商品
      let api = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let httpMethod = 'post';
      // 當不是新增商品時則切換成編輯商品 API
      if (!this.isNew) {
        api = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.product.id}`;
        httpMethod = 'put';
      }
      axios[httpMethod](api, { data: this.product })
        .then((response) => {
          alert(response.data.message);
          // 隱藏Modal
          this.hideModal();
          // 向外發送updata事件去重新渲染畫面
          this.$emit('update');
        }).catch((err) => {
          alert(err.response.data.message);
        });
    },
    createImages() {
      this.product.imagesUrl = [];
      this.product.imagesUrl.push('');
    },
    openModal() {
      productModal.show();
    },
    hideModal() {
      productModal.hide();
    },
  },
})

// 產品刪除元件
app.component('delProductModal', {
  template: '#delProductModal',
  props: ['tempProduct'],
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'vuejs',
    };
  },
  mounted() {
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false,
      backdrop: 'static',
    });
  },
  methods: {
    delProduct() {
      axios.delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`).then((response) => {
        // 隱藏Modal
        this.hideModal();
        // 向外發送updata事件去重新渲染畫面
        this.$emit('update');
      }).catch((err) => {
        alert(err.response.data.message);
      });
    },
    openModal() {
      delProductModal.show();
    },
    hideModal() {
      delProductModal.hide();
    },
  },
});

app.mount('#app');