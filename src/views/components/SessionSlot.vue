<template>
  <div>
    <a v-if="courses && user == 'student'">
      <badge
        v-for="(course, idx) in all_courses"
        :key="idx"
        :type="courses.includes(course) ? 'success' : 'danger text-muted'"
      >
        {{ course }}
      </badge>
    </a>
    <base-button v-else-if="courses && user == 'tutor'" class="btn-sm" type="secondary">{{tutor.first_name}}</base-button>
    <base-button v-else-if="user == 'admin'" class="btn-sm" type="secondary" @click="modal = true">Assign</base-button>

    <modal :show.sync="modal">
        <h6 slot="header" class="modal-title" id="modal-title-default">Assign tutor to slot</h6>
        <div v-if="errors">
          {{errors}}
        </div>
        <base-dropdown>
          <base-button slot="title" type="secondary" class="dropdown-toggle">
            Regular
          </base-button>
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
          <a class="dropdown-item" href="#">Something else here</a>
        </base-dropdown>


        <template slot="footer">
            <base-button type="primary" @click="assignTutor">Save changes</base-button>
            <base-button type="link" class="ml-auto" @click="modal = false">Close
            </base-button>
        </template>
    </modal>
  </div>
</template>

<script>
  import BaseDropdown from '@/components/BaseDropdown';
  import Modal from '@/components/Modal';

  export default {
    components: {
      BaseDropdown,
      Modal
    },
    props: {
      session: {
        type: Object,
        default: () => {},
        description: "Arrays of the session in this slot"
      },
      user: {
        type: String,
        default: "student",
        description: "Which type of user is this intended for? (student/tutor/admin)"
      },
      all_courses: {
        type: Array,
        default: () => [],
        description: "All available courses"
      }
    },
    data() {
      return {
        modal: false,
        date: this.session.date,
        time: this.session.time,
        tutor: this.session.tutor,
        courses: this.session.tutor.courses,
        errors: null,
      };
    },
    methods: {
      assignTutor () {

      }
    }
  };
</script>

<style></style>
