<template>
  <v-app>
    <v-main class="bg-black d-flex justify-center align-center">
      <v-card
        width="300"
        height="200"
        class="d-flex flex-column justify-space-between align-center"
      >
        <div class="my-4 text-h5">Online Countdown timer</div>
        <div class="d-flex justify-space-between">
          <v-text-field
            v-model="counterUserInput"
            type="number"
            style="width: 80px"
            density="compact"
            hide-details
            variant="outlined"
          ></v-text-field>
          <v-btn prepend-icon="mdi-send" @click="setCount">Send</v-btn>
        </div>

        <div class="font-weight-bold">
          {{ counter }}
        </div>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
import { dbFirestore, dbRtdb } from "@/firebase";
import {
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  doc,
  orderBy,
} from "firebase/firestore";
import {
  push,
  ref,
  onValue,
  serverTimestamp,
  query,
  orderByChild,
} from "firebase/database";

export default {
  data() {
    return { counter: 0, counterUserInput: 0 };
  },

  methods: {
    setCount() {
      this.setCountRtdb();

      // console.log(serverTimestamp());
      // const colRef = collection(dbFirestore, "timers2");

      // addDoc(colRef, {
      //   startAt: serverTimestamp(),
      //   seconds: this.counterUserInput,
      // }).then(() => {
      //   console.log("Funcionou");
      // });

      // const serverTimeOffset = 0;
      // const offsetRef = ref(dbFirestore, ".info/serverTimeOffset");
      // onValue(offsetRef, (snap) => {
      //   serverTimeOffset = snap.val();
      // });

      // const q = query(colRef, orderBy("startAt"));
      // onSnapshot(q, (snapshot) => {
      // });
    },
    setCountRtdb() {
      push(ref(dbRtdb, "timers/"), {
        startAt: serverTimestamp(),
        seconds: this.counterUserInput,
      });
    },

    listenToTimers() {
      const timersRef = ref(dbRtdb, "timers/");
      onValue(timersRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data);
      });
    },
  },
  mounted() {
    let serverTimeOffset = 0;

    const offsetRef = ref(dbRtdb, ".info/serverTimeOffset");
    onValue(offsetRef, (snap) => {
      serverTimeOffset = snap.val();
    });

    const timersRef = ref(dbRtdb, "timers/");
    const q = query(timersRef, orderByChild("startAt"));
    onValue(q, (snapshot) => {
      let timers = [];
      const data = snapshot.val();
      for (const id in data) {
        timers.push({
          id: id,
          seconds: data[id].seconds,
          startAt: data[id].startAt,
        });
      }

      console.log("SNAPSHOT TIMERS");
      console.log(timers);

      const seconds = timers[timers.length - 1].seconds;
      const startAt = timers[timers.length - 1].startAt;
      const interval = setInterval(() => {
        this.counter =
          seconds * 1000 - (Date.now() - startAt - serverTimeOffset);
        if (this.counter < 0) {
          clearInterval(interval);
          this.counter = 0;
        } else {
          console.log(
            `${Math.floor(this.counter / 1000)}.${this.counter % 1000}`
          );
        }
      }, 100);
    });
  },
};
</script>
