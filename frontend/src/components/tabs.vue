<template>
  <div>
    <div class="tab-form">
      <a-form-model :model="form">
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="原文翻译" force-render>
            <a-form-model-item label="翻译">
              {{tweet.text}}
              <a-textarea v-model="form.article.origin" :auto-size="{minRows: 3}"/>
            </a-form-model-item>
            <a-form-model-item>
              <span class="switch-label">是否覆盖原文</span>
              <a-switch v-model="form.cover_origin"/>
            </a-form-model-item>
          </a-tab-pane>
          <a-tab-pane key="2" tab="汉化组" force-render>
            <a-form-model-item label="汉化组名称">
              <a-input v-model="form.group.group_info" placeholder="翻译自日文"/>
            </a-form-model-item>
            <a-form-model-item>
              <span class="switch-label">不显示汉化组标签</span>
              <a-switch default-checked v-model="form.no_group_info"/>
            </a-form-model-item>
            <!-- <a-form-model-item>
              <span class="switch-label">回复内显示汉化组标签</span>
              <a-switch default-checked/>
            </a-form-model-item> -->
          </a-tab-pane>
          <a-tab-pane key="3" tab="引用" v-if="tweet.quote != undefined">
            <a-form-model-item label="引用">
              <a-textarea v-model="form.article.quote" auto-size/>
            </a-form-model-item>
          </a-tab-pane>
          <a-tab-pane key="4" tab="回复" v-if="tweet.reply != undefined">
            <div v-for="(item, index) in tweet.reply" v-bind:key="index">
              <a-form-model-item label="回复">
                {{item}}
                <a-textarea v-model="form.article.reply[index]"  type="textarea"/>
              </a-form-model-item>
            </div>
          </a-tab-pane>
          <a-tab-pane key="5" tab="选项" v-if="tweet.choice != undefined">
            <a-form-model-item label="选项">
              <a-input v-model="form.article.choice" />
            </a-form-model-item>
          </a-tab-pane>
        </a-tabs>
      </a-form-model>
    </div>
  
    <a-button class="submit-button" type="primary" @click="preview" :loading="loading" :disabled="twitter_loaded == false" block>
        预览
    </a-button>
    <a-button v-bind:class="{download_button : twitter_loaded == true}" type="primary" @click="download" :loading="loading" :disabled="twitter_loaded == false" block>
        下载
    </a-button>
  </div>
</template>

<script>
import axios from "axios";
// import bbqForm from './bbqForm';

export default {
  name: 'tabs',
  props: ['tweet', 'twitter_url', 'loading', 'twitter_loaded'],
  data() {
    return {
      pic: "",
      form: {
        article : {
          origin: undefined,
          reply: [],
          retweet: undefined,
          choice: undefined
        },
        group: {
          group_info: undefined
        },
        cover_origin: false,
        no_group_info: false
      }
    }
  },
  methods: {
    preview() {
      this.loading = true;
      console.log("正在获取修改后预览");
      axios.get(`/api/bbq`,
          {
            params: {
              twitter_url : this.twitter_url,
              cook : "bbq",
              template: this.form
            }
          })
        .then(res => {
          this.$emit("update:pic", res.data);
          this.loading = false;
        });
    },
    download() {
      this.loading = true;
      axios.get(`/api/bbq`,
          {
            params: {
              twitter_url : this.twitter_url,
              cook : "bbq",
              template: this.form
            }
          })
        .then(res => {
          console.log("正在下载");
          let alink = document.createElement("a");
          alink.href = `/BBQ/img/${res.data}.jpg`;
          alink.download = `${/com\/(.+?)\/status/i.exec(this.twitter_url)[1]}.jpg`
          alink.click();
          this.loading = false;
        });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tab-form {
  min-height: 500px;
}
.switch-label {
  margin:0 2em 0 0;
}
.submit-button {
  margin: 10px 0;
}
.download_button {
  margin: 10px 0;
  background-color: #5DAC81;
  border-color: #5DAC81;
}
</style>
