<template>
  <div id="BBQ">
    <div class="loading" v-if="loaded === false"></div>
    <div class="flex-wrap" v-if="loaded === true">
      <div class="twitter-wrap">
        <div class="url-form">
          <a-alert class="twitter_alert" message="先输入单条Twitter网址" banner v-if="twitter_url.length < 1"/>
          <a-form-model v-model="twitter_url" @submit="submit_url" @submit.native.prevent>
            <a-form-model-item>
              <a-input v-model="twitter_url" placeholder="Twitter URL"></a-input>
            </a-form-model-item>
            <a-form-model-item>
              <a-button
                class="fetch-button"
                type="primary"
                html-type="submit"
                :loading="loading"
                @click="enterLoading"
                :disabled="!/^https:\/\/twitter.com\/.+?\/status\/\d+(?:\?s=\d{1,2})?$/.test(twitter_url)"
              >
                获取Twitter
              </a-button>
            </a-form-model-item>
          </a-form-model>
        </div>
        <div class="img-wrap">
          <img class="twishot" :src="pic" v-if="twitter_loaded == true">
        </div>
      </div>
    </div>
    <div class="flex-wrap">
      <div class="tab">
        <tabs :tweet="tweet" :loading="loading" :twitter_url="twitter_url" :twitter_loaded="twitter_loaded" @update:pic="cookready"></tabs>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import tabs from './components/tabs';

export default {
  name: 'BBQ',
  components: {
    tabs
  },
  data() {
    return {
      loaded : false,
      loading : false,
      tweet : {},
      twitter_url : "",
      twitter_loaded : false,
      pic: ""
    }
  },
  mounted() {
    this.loaded = true;
  },
  methods: {
    enterLoading() {
      this.loading = true;
    },
    submit_url() {
      console.log("正在获取预览");
      axios.get(`/api/bbq`,
          {
            params: {
              twitter_url : this.twitter_url,
              cook : "raw"
            }
          })
        .then(res => {
          let data = res.data;
          this.tweet = data.tweet;
          this.pic = `/BBQ/img/${data.pic}.jpg`;
          this.loading = false;
          this.twitter_loaded = true;
        });
    },
    cookready(pic) {
      this.pic = `/BBQ/img/${pic}.jpg`;
      this.twitter_loaded = true;
    }
  }
}
</script>

<style>
#BBQ {
  font-family: SourceHan Sans;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.flex-wrap {
  flex: 1;
  max-width: 80%;
  min-width: 500px;
}
.twitter-wrap {
  width: 80%;
  margin: 0 10%;
  justify-content: center;
  align-items: center;
}
.flex-wrap + .flex-wrap {
  border-left: dotted 2px gray;
  height: 1100px;
  margin: 10px 0;
}
.fetch-button {
  width: 120px;
  font-weight: 500;
}
.img-wrap {
  max-height: 900px;
  overflow: auto;
}
img {
  max-width: 70%;
  margin: 15px;
}
.tab {
  width: 80%;
  margin: 0 10%;
  justify-content: center;
  align-items: center;
}
.twitter_alert {
  margin: 10px 0;
}
.loading {
  display: inline-block;
  width: 80px;
  height: 80px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin: -80px -80px;
}
.loading:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #1E90FF;
  border-color: #1E90FF transparent #1E90FF transparent;
  animation: loading 1.2s linear infinite;
}
@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
