import { ref } from "vue";
import { defineStore } from "pinia";
import { useApiStore } from "@/stores/api";
import type { Appointment } from "@/models/Appointment";

export const useAppointmentStore = defineStore("appointment", () => {
  const api = useApiStore();

  const appointments = ref<Appointment[]>([]);

  async function getAppointments() {
    const response = await api.callApi("appointment", "GET");
    if (response.ok) {
      appointments.value = await response
        .json()
        .then((data) => data.appointments ?? []);
    }
    return response;
  }

  async function getAppointment(id: number) {
    const response = await api.callApi(`appointment/${id}`, "GET");
    if (response.ok) {
      return await response.json().then((data) => data.appointment);
    }
    return null;
  }

  async function createAppointment(appointment: Appointment) {
    const response = await api.callApi("appointment", "POST", appointment);
    if (response.ok) {
      // appointments.value.push(await response.json().then((data) => data.appointment));
    }
    return response;
  }

  async function updateAppointment(appointment: Appointment) {
    const response = await api.callApi(
      `appointment/${appointment.id}`,
      "PATCH",
      appointment
    );
    if (response.ok) {
      const updatedAppointment = await response.json();
      const index = appointments.value.findIndex(
        (t) => t.id === updatedAppointment.id
      );
      appointments.value[index] = updatedAppointment;
    }
    return response;
  }

  async function deleteAppointment(id: number) {
    const response = await api.callApi(`appointment/${id}`, "DELETE");
    if (response.ok) {
      const index = appointments.value.findIndex((t) => t.id === id);
      appointments.value.splice(index, 1);
    }
    return response;
  }

  return {
    appointments,
    getAppointments,
    getAppointment,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  };
});
