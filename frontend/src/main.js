import Vue from 'vue';
import {Button, Switch, FormModel, Input, Tabs, Alert} from 'ant-design-vue';
import 'ant-design-vue/lib/tabs/style/css';
import 'ant-design-vue/lib/button/style/css';
import 'ant-design-vue/lib/form-model/style/css';
import 'ant-design-vue/lib/input/style/css';
import 'ant-design-vue/lib/switch/style/css';
import 'ant-design-vue/lib/alert/style/css';
import App from './App';
// import axios from 'F:/Coding/Javascript/node_modules/axios';
Vue.config.productionTip = false;

Vue.use(Tabs);
Vue.use(Alert);
Vue.use(Input);
Vue.use(Button);
Vue.use(Switch);
Vue.use(FormModel);

new Vue({
  render: h => h(App)
}).$mount("#app");