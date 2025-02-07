<template>
    <div>
      <h2>Signup</h2>
      <form @submit.prevent="signup">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Signup</button>
      </form>
    </div>
  </template>
  
  <script>
  import { auth } from "@/firebase";
  import { createUserWithEmailAndPassword } from "firebase/auth";
  
  export default {
    data() {
      return {
        email: "",
        password: ""
      };
    },
    methods: {
      async signup() {
        try {
          console.log(auth);

          await createUserWithEmailAndPassword(auth, this.email, this.password);
          this.$router.push("/");
        } catch (error) {
          console.error("Error signing up:", error);
        }
      }
    }
  };
  </script>