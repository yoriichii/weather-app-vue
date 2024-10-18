<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import weatherApi from "./services/weatherApi";
import axios from "axios";
import { weatherType } from "./models/weatherType";
import { SearchIcon, ThermometerIcon, CloudIcon } from "lucide-vue-next";

const city = ref<string | null>();
const weather = ref<weatherType | null>(null);
const error = ref<string | null>(null);
const isLoading = ref<boolean>(false);
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const fetchWeather = async () => {
  if (!city.value?.trim()) {
    error.value = "Username cannot be empty";
    return;
  }
  isLoading.value = true;
  error.value = null;
  weather.value = null;
  try {
    error.value = "";
    weather.value = null;
    await sleep(1000);
    const response = await axios.get(weatherApi.apiUrl, {
      params: {
        q: city.value,
        appid: weatherApi.apiKey,
        units: "metric",
      },
    });
    weather.value = response.data;
    saveLocal();
  } catch (err) {
    error.value = "City not found. Please try again.";
  } finally {
    isLoading.value = false;
    city.value = null;
  }
};

const saveLocal = () => {
  localStorage.setItem("weather", JSON.stringify(weather.value));
};
onMounted(() => {
  const saveItems = localStorage.getItem("weather");
  if (saveItems) {
    weather.value = JSON.parse(saveItems);
  }
});

const weatherBackgroundClass = computed(() => {
  if (weather.value?.weather?.length) {
    const conditionClass = weather.value.weather[0]?.main.toLowerCase();
    switch (conditionClass) {
      case "drizzle":
      case "rain":
        return "bg-rainy";
      case "thunderstorm":
        return "bg-thunderstorm";
      case "clear":
        return "bg-clear";
      case "overcast":
      case "clouds":
        return "bg-cloudy";
      case "mist":
      case "fog":
        return "bg-fog";
      case "snow":
        return "bg-snowy";
      default:
        return "bg-gradient-to-br from-blue-500 to-purple-600";
    }
  }
});

const currentTime = ref(
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  })
);

setInterval(() => {
  currentTime.value = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}, 1000);
</script>

<template>
  <div
    :class="[weatherBackgroundClass, 'min-h-screen bg-gradient-to-br from-blue-500 to-purple-700 flex items-center justify-center p-4']"
  >
  <span class="absolute top-5 left-5 text-2xl">{{ currentTime }}</span>
    <div class="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
      <div class="p-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-4 text-center">
          Weather App
        </h1>

        <form @submit.prevent="fetchWeather" class="mb-6">
          <div class="flex items-center">
            <input
              v-model="city"
              type="text"
              placeholder="Enter city name"
              class="flex-grow px-4 py-2 rounded-l-lg border-gray-300 focus:outline-none"
            />
            <button
              type="submit"
              class="bg-blue-500 text-white px-4 pt-[0.6rem] pb-[0.651rem] rounded-r-lg hover:bg-blue-600"
            >
              <SearchIcon class="h-5 w-5" />
            </button>
          </div>
          <div class="text-red-600 ml-4 mt-1">{{ error }}</div>
        </form>

        <!-- Weather information display -->
        <div
          v-if="weather"
          :class="[weatherBackgroundClass, 'bg-gray-100 rounded-lg p-4']"
        >
          <h2 class="text-xl font-semibold text-white mb-2">
            {{ weather?.name }},{{ weather?.sys?.country }}
          </h2>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <ThermometerIcon class="h-6 w-6 text-white mr-2" />
              <span class="text-3xl font-bold text-white"
                >{{ weather?.main?.temp }}°C</span
              >
            </div>
            <div class="text-right">
              <p class="text-white" v-if="weather?.weather?.length">
                {{ weather?.weather[0]?.description }}
              </p>
              <p class="text-sm text-white">
                Humidity: {{ weather?.main?.humidity }}%
              </p>
            </div>
          </div>
        </div>
        <div
          v-if="isLoading"
          class="skeleton h-32 w-full rounded-lg bg-gray-200"
        ></div>

        <!-- Empty state -->
        <div v-if="!weather && !error && !isLoading" class="text-center py-8">
          <CloudIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-600">
            Search for a city to get weather information
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-rainy {
  background: url("https://i.pinimg.com/originals/b9/4f/bd/b94fbdd31b4696e748a16fb59435bfe7.gif")
    no-repeat center center/cover;
}

.bg-thunderstorm {
  background: url("https://imgs.search.brave.com/CNSDQLdO45vk_Qs443ifADqDTocLqKHCu3VeLHVMQ8Q/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YTMuZ2lwaHkuY29t/L21lZGlhL0ZaemJU/SnlSVHdQdXcvZ2lw/aHkuZ2lmP2NpZD03/OTBiNzYxMWoyZ3pz/aGFid2t4b243Mnll/dHd1djlzOTdoNmU4/eW9iNTNmbHY5bXMm/ZXA9djFfZ2lmc19z/ZWFyY2gmcmlkPWdp/cGh5LmdpZiZjdD1n.gif")
    no-repeat center center/cover;
}

.bg-clear {
  background: url("https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHA0bGhyZXBjMTI5MzZpZWxlZHkwMTRuNmJ3cGZycWtwaDAybWVmbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/0Styincf6K2tvfjb5Q/giphy.webp")
    no-repeat center center/cover;
}

.bg-cloudy {
  background: url("https://i.makeagif.com/media/4-12-2018/LlcgNo.gif") no-repeat
    center center/cover;
}
.bg-fog {
  background: url("https://imgs.search.brave.com/wNdLa7ZcHRCeWZAsLoPn0q172tr5MIEqvXDpEzQQo8w/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmdp/ZmVyLmNvbS9lbWJl/ZGRlZC9kb3dubG9h/ZC9JSk5nLmdpZg.gif")
    no-repeat center center/cover;
}

.bg-snowy {
  background: url("https://imgs.search.brave.com/a8-Cn-lB8gvQ_rPRpF9BWYu-1tnCYNdOYBXNqYFkMmg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9naWZk/Yi5jb20vaW1hZ2Vz/L2hpZ2gvYW5pbWUt/c25vdy1mYWxsaW5n/LWRiam0xOWFqemVv/NWc3bnMuZ2lm.gif")
    no-repeat center center/cover;
}
</style>
