<template>
    <div>
      <h2>Login</h2>
      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  </template>
  
  <script>
  import { auth } from "@/firebase";
  import { signInWithEmailAndPassword } from "firebase/auth";
  
  export default {
    data() {
      return {
        email: "",
        password: ""
      };
    },
    methods: {
      async login() {
        try {
          await signInWithEmailAndPassword(auth, this.email, this.password);
          this.$router.push("/");
        } catch (error) {
          console.error("Error logging in:", error);
        }
      }
    }
  };
  </script>