<template>
  <div>
    <div v-for="q in followups">
      <div class="row" :key="reply_key">
        {{ depth | dashes}}&nbsp;
        <vue-markdown v-bind:source="q.body" :html="false"/>
        <a href="javascript:void(0);" @click="q.reply_body=''; reply_key +=1">Reply</a>
        &nbsp;
        <a
                href="javascript:void(0);"
                v-if="$store.state.userRole!='student'"
                style="color: red"
                @click="$emit('delete',q)"
        >Delete</a>
      </div>
      <QuestionFollowups v-bind:followup_questions="followup_questions"
                         v-bind:parent_id="q.id"
                         v-bind:depth="depth+1"
                         v-bubble:submit_followup
                         v-bubble:delete
      />
      <div v-if="q.reply_body!=null">
        {{ depth + 1 | dashes}}&nbsp;
        <textarea v-model="q.reply_body"></textarea>
        <base-button class="btn-sm" @click="q.reply_body=null; reply_key +=1">Cancel</base-button>
        <base-button class="btn-sm" @click="submit(q.reply_body, q.id); q.reply_body = null; reply_key +=1">Submit</base-button>
      </div>
    </div>
    <div v-if="!depth">
      <div v-if="new_followup!=null">
        <textarea v-model="new_followup"></textarea>
        <base-button class="btn-sm" @click="new_followup=null">Cancel</base-button>
        <base-button class="btn-sm" @click="submit(new_followup, null); new_followup = null">Submit</base-button>
      </div>
      <div v-else>
        <base-button @click="new_followup=''">Add Followup Question</base-button>
      </div>
    </div>
  </div>
</template>

<script>
  import VueMarkdown from "vue-markdown/src/VueMarkdown";
  import Editor from '@toast-ui/vue-editor/src/Editor.vue';

  export default {
    name: "QuestionFollowups",
    components: {
      VueMarkdown,
      Editor,
    },
    props: {
      followup_questions: {
        type: Array
      },
      parent_id: {
        type: Number
      },
      depth: {
        type: Number,
        default: 0
      }
    },
    data() {
      let filtered = this.followup_questions;
      if (this.parent_id) {
        filtered = filtered.filter(x => x.question_followup_id == this.parent_id)
      } else {
        filtered = filtered.filter(x => x.question_followup_id == null)
      }
      filtered.map(x => x.reply_body = null);
      return {
        followups: filtered,
        reply_key: 0,
        new_followup: null
      }
    },
    watch: {
      followup_questions: function () {
        let filtered = this.followup_questions;
        if (this.parent_id) {
          this.followups = filtered.filter(x => x.question_followup_id == this.parent_id)
        } else {
          this.followups = filtered.filter(x => x.question_followup_id == null)
        }
      }
    },
    filters: {
      dashes: function (value) {
        if (!value) return '';
        return "- ".repeat(value);
      }
    },
    methods:{
      submit: function (body, replying_to_id) {
        if (body){
          this.$emit("submit_followup",
            {
              body: body,
              parent_id: replying_to_id
            });
        }
      }
    }
  }
</script>

<style scoped>

</style>