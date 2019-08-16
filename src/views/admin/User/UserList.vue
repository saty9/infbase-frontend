<template>
  <div>
    <div v-for="user in users" :key="user.id" class="mb-5">
      <h4 class="text-primary mb-5 d-inline-block">{{ user }}</h4>
      <base-button
        outline
        v-if="$store.state.userRole == 'admin'"
        @click="
          modal = true;
          recipient = user;
        "
        class="float-right d-inline-block btn-sm"
        type="primary"
        >Email {{ user }}</base-button
      >
      <section v-if="errored">
        <p>
          We're sorry, we're not able to retrieve this information at the
          moment, please try back later
        </p>
      </section>
      <section v-else>
        <table class="table table-hover">
          <thead>
            <tr class="row">
              <th class="col">Name</th>
              <th class="col">Email</th>
              <th
                class="col text-right"
                v-if="$store.state.userRole == 'admin'"
              >
                Actions
              </th>
            </tr>
          </thead>
          <div v-if="loading">
            Loading...
          </div>
          <tbody v-else>
            <div v-if="user == 'Students'">
              <user-row
                v-for="student in pageStudents"
                :user="student"
                :key="student.id"
                @changed="onRoleChange"
              />
            </div>
            <div v-if="user == 'Tutors'">
              <user-row
                v-for="tutor in pageTutors"
                :user="tutor"
                :key="tutor.id"
                @changed="onRoleChange"
              />
            </div>
            <div v-if="user == 'Admins'">
              <user-row
                v-for="admin in pageAdmins"
                :user="admin"
                :key="admin.id"
                @changed="onRoleChange"
              />
            </div>
          </tbody>
        </table>
        <base-pagination
          v-if="user == 'Students' && studentsCount > 10"
          v-model="page_student"
          :total="studentsCount"
          align="center"
        ></base-pagination>
        <base-pagination
          v-if="user == 'Tutors' && tutorsCount > 10"
          v-model="page_tutor"
          :total="tutorsCount"
          align="center"
        ></base-pagination>
        <base-pagination
          v-if="user == 'Admins' && adminsCount > 10"
          v-model="page_admin"
          :total="adminsCount"
          align="center"
        ></base-pagination>
      </section>
    </div>
    <email-modal
      :recipient="recipient"
      :modal="modal"
      @closeModal="closeModal"
    />
  </div>
</template>

<script>
import UserRow from "./UserListRow";
import EmailModal from "./UserEmailModal";
import BasePagination from "@/components/BasePagination";

export default {
  components: {
    UserRow,
    BasePagination,
    EmailModal
  },
  props: {
    users: {
      type: Array,
      default: () => ["Admins", "Tutors", "Students"],
      description: "Which list to show opt(Students/Tutors/Admins)"
    }
  },
  data() {
    return {
      loading: true,
      all_users: [],
      errored: false,
      admins: [],
      tutors: [],
      students: [],
      page_student: 1,
      page_tutor: 1,
      page_admin: 1,
      modal: false,
      recipient: null
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      this.loading = true;

      this.axios
        .get("/api/admin/users", {
          headers: { Authorization: window.$cookies.get("jwt") }
        })
        .then(response => {
          this.all_users = response.data;
        })
        .catch(error => {
          this.errored = true;
        })
        .finally(() => (this.loading = false));
    },
    onRoleChange(user) {
      let index = this.all_users.findIndex(usr => usr.id == user.id);
      vm.$set(this.all_users, index, user);
      document.body.classList.remove("modal-open"); // hack to forcefully close the modal
    },
    closeModal() {
      this.modal = false;
    }
  },
  watch: {
    all_users() {
      this.tutors = this.all_users.filter(user => user.role == "tutor");
      this.students = this.all_users.filter(user => user.role == "student");
      this.admins = this.all_users.filter(user => user.role == "admin");
    }
  },
  computed: {
    studentsCount() {
      return this.students ? this.students.length : 0;
    },
    tutorsCount() {
      return this.tutors ? this.tutors.length : 0;
    },
    adminsCount() {
      return this.admins ? this.admins.length : 0;
    },
    pageStudents() {
      var start = (this.page_student - 1) * 10;
      return this.students ? this.students.slice(start, start + 10) : [];
    },
    pageTutors() {
      var start = (this.page_tutor - 1) * 10;
      return this.tutors ? this.tutors.slice(start, start + 10) : [];
    },
    pageAdmins() {
      var start = (this.page_admin - 1) * 10;
      return this.admins ? this.admins.slice(start, start + 10) : [];
    }
  }
};
</script>

<style scoped lang="scss">
.users {
  padding: 0px;

  .card {
    padding: 0px 15px;
  }
}
</style>